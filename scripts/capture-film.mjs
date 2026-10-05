// Captures the promo film's frames, and the homepage's, from ONE walk of one
// wedding through a local copy of kitchen-brain develop. Run one step at a
// time; each step reads where the walk is from the app itself and refuses to
// run out of order, so a failed step can be fixed and re-run without starting
// over.
//
//   APP=http://localhost:4197 KB_APP_DIR=<the app export> DEVELOP_COMMIT=<sha> \
//     node scripts/capture-film.mjs <step>
//
// Steps, in order: inquiry, menu, proposal, accept (then agreement, deposit,
// book, kitchen, receive, prep, pack, closeout as they are written).
//
// Frames land in public/proof/film/ at device pixel ratio 2, each clipped to
// the element it shows (never the test banner, never a mock), and every figure
// a caption quotes is read off the element it was photographed from into
// public/proof/film/manifest.json.
//
// Pattern: none. Considered Command (one object per step with run/verify);
// not used because the steps share one page and one manifest and run in a
// fixed order; a table of named async functions is the whole need.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const APP = process.env.APP ?? 'http://localhost:4197';
const KB_APP_DIR = process.env.KB_APP_DIR;
const DEVELOP_COMMIT = process.env.DEVELOP_COMMIT ?? '';
if (!KB_APP_DIR) throw new Error('KB_APP_DIR=<the kitchen-brain export the app runs from> is required');
if (!/^[0-9a-f]{7,40}$/.test(DEVELOP_COMMIT)) throw new Error('DEVELOP_COMMIT=<sha the app was exported from> is required');
const { chromium } = await import(pathToFileURL(resolve(KB_APP_DIR, 'node_modules/playwright/index.mjs')).href);

const OUT = resolve(import.meta.dirname, '../public/proof/film');
const MANIFEST = resolve(OUT, 'manifest.json');
const OWNER = 'marisol@example.com';
const KITCHEN = 'Harbor & Hearth Catering';
const TODAY = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());

// The one event every frame shows. The date is the shoot day, so the closeout
// (which opens the day after the event) can be captured the next morning with
// no date edited by hand.
export const EVENT = {
	client: 'Priya Nair',
	phone: '(207) 555-0187',
	email: 'priya.nair@example.com',
	name: 'Nair & Castellano wedding',
	guests: '150',
	menu: 'Wedding Plated Dinner',
	date: process.env.EVENT_DATE ?? TODAY,
	start: '17:00',
	end: '22:00',
	deposit: '3500',
};

// Text that must never be in a shipped frame.
const FORBIDDEN = [
	/Load out/i,
	/Kitchen Brain/i,
	/Test environment/i,
	/Test site/i,
	/Maple & Main/,
	/\bE2E\b/,
	/\bstub\b/i,
	/This test site only emails/,
	/Add a card in Billing/,
	/\bLOGO\b/,
];

await mkdir(OUT, { recursive: true });
const manifest = await readFile(MANIFEST, 'utf8').then(JSON.parse, () => ({ frames: [] }));
const saveManifest = () => writeFile(MANIFEST, JSON.stringify({ ...manifest, appSha: DEVELOP_COMMIT, capturedOn: TODAY }, null, 2) + '\n');

const browser = await chromium.launch({
	executablePath: '/usr/bin/google-chrome',
	headless: true,
	args: ['--no-sandbox', '--font-render-hinting=none'],
});
const owner = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
const page = await owner.newPage();

async function settle(p) {
	await p.waitForLoadState('load');
	await p.mouse.move(0, 0);
	await p.evaluate(() => {
		document.activeElement instanceof HTMLElement && document.activeElement.blur();
		for (const t of document.querySelectorAll('[data-sonner-toaster], [data-ui-role="toast"], .toast')) t.remove();
		return document.fonts.ready;
	});
	await p.waitForTimeout(600);
}

// vite dev compiles a route on first visit and hydrates late: wait it out.
async function open(p, path) {
	await p.goto(path.startsWith('http') ? path : APP + path, { timeout: 120_000 });
	await p.waitForLoadState('load');
	await p.waitForTimeout(2500);
}

async function docBox(locator) {
	return locator.first().evaluate((el) => {
		const r = el.getBoundingClientRect();
		return { x: r.left + window.scrollX, y: r.top + window.scrollY, r: r.right + window.scrollX, b: r.bottom + window.scrollY };
	});
}

async function union(locators, pad = 24) {
	let box = null;
	for (const l of locators) {
		const d = await docBox(l);
		box = box ? { x: Math.min(box.x, d.x), y: Math.min(box.y, d.y), r: Math.max(box.r, d.r), b: Math.max(box.b, d.b) } : d;
	}
	return { x: box.x - pad, y: box.y - pad, width: box.r - box.x + pad * 2, height: box.b - box.y + pad * 2 };
}

/** One frame: text-guarded, clipped, recorded in the manifest. */
async function shoot(p, name, clip, { fullPage = true } = {}) {
	await settle(p);
	const box = {
		x: Math.max(0, Math.round(clip.x)),
		y: Math.max(0, Math.round(clip.y)),
		width: Math.round(clip.width),
		height: Math.round(clip.height),
	};
	const text = await p.evaluate(
		({ box, fullPage }) => {
			const sx = fullPage ? window.scrollX : 0;
			const sy = fullPage ? window.scrollY : 0;
			const parts = [];
			const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
			for (let n = w.nextNode(); n; n = w.nextNode()) {
				const t = n.textContent.trim();
				if (!t || !n.parentElement) continue;
				const s = getComputedStyle(n.parentElement);
				if (s.visibility === 'hidden' || s.display === 'none') continue;
				const range = document.createRange();
				range.selectNodeContents(n);
				for (const r of range.getClientRects()) {
					const x = r.left + sx,
						y = r.top + sy;
					if (r.width && x < box.x + box.width && x + r.width > box.x && y < box.y + box.height && y + r.height > box.y) {
						parts.push(t);
						break;
					}
				}
			}
			return parts.join(' | ');
		},
		{ box, fullPage },
	);
	for (const bad of FORBIDDEN) if (bad.test(text)) throw new Error(`${name}: forbidden text ${bad} in frame: ${text.slice(0, 300)}`);
	await p.screenshot({ path: `${OUT}/${name}.png`, clip: box, fullPage, animations: 'disabled', caret: 'hide' });
	manifest.frames = [...new Set([...(manifest.frames ?? []), `${name}.png`])];
	await saveManifest();
	console.log(`captured ${name} (${box.width}x${box.height} CSS px @2x)`);
	return text;
}

async function signIn() {
	await open(page, '/login');
	await page.getByLabel('Email').fill(OWNER);
	await page.getByRole('button', { name: 'Send sign-in link' }).click();
	await page.getByRole('heading', { name: 'Check your email' }).waitFor();
	let link = null;
	for (let i = 0; i < 40 && !link; i += 1) {
		const r = await page.request.get(`${APP}/api/test/magic-link?email=${encodeURIComponent(OWNER)}`);
		if (r.ok()) link = (await r.json()).url;
		if (!link) await page.waitForTimeout(250);
	}
	if (!link) throw new Error('no magic link captured; start the app with MAGIC_LINK_TEST_CAPTURE=1');
	const u = new URL(link);
	await open(page, `${u.pathname}${u.search}`);
}

/** The wedding's event page URL, found through the Events list, or null. */
async function findEvent() {
	if (manifest.eventUrl) return manifest.eventUrl;
	return null;
}

const STEPS = {
	async inquiry() {
		if (await findEvent()) throw new Error('the wedding already exists; re-seed to shoot the inquiry again');
		const phone = await browser.newContext({
			viewport: { width: 390, height: 844 },
			deviceScaleFactor: 2,
			reducedMotion: 'reduce',
			storageState: await owner.storageState(),
		});
		const p = await phone.newPage();
		await open(p, '/events/new');
		// develop: the Client field is its own search box.
		const client = p.getByRole('combobox', { name: 'Client' });
		await client.click();
		await client.fill(EVENT.client);
		await p.getByRole('option', { name: new RegExp(`Add.*${EVENT.client}`) }).click();
		await p.getByLabel('Phone or email').fill(EVENT.phone);
		await p.getByLabel('Event name', { exact: true }).fill(EVENT.name);
		await p.getByLabel('Date not decided yet').check();
		await p.getByLabel('Guests', { exact: true }).fill(EVENT.guests);
		await p.evaluate(() => window.scrollTo(0, 0));
		// The action bar is fixed to the bottom: size the screen so it sits right
		// under "The event" card, the whole inquiry above the one button.
		const bar = p.getByRole('button', { name: /^Save (inquiry )?and build menu$/ }).last();
		const card = p
			.getByRole('heading', { name: 'The event' })
			.locator('xpath=ancestor::*[self::section or self::fieldset or self::div][.//button[contains(., "Add time, venue")]][1]');
		const cardBottom = (await docBox(card)).b;
		const barTop = await bar.evaluate((el) => {
			let n = el;
			while (n.parentElement && !['fixed', 'sticky'].includes(getComputedStyle(n).position)) n = n.parentElement;
			return n.getBoundingClientRect().top;
		});
		await p.setViewportSize({ width: 390, height: Math.round(cardBottom + 12 + (844 - barTop)) });
		await p.evaluate(() => window.scrollTo(0, 0));
		const bannerBottom = await p.evaluate(() => {
			const b = [...document.querySelectorAll('body *')].find(
				(e) => /^Test site\./.test(e.textContent?.trim() ?? '') && e.children.length === 0,
			);
			return b ? b.getBoundingClientRect().bottom : 0;
		});
		await shoot(
			p,
			'inquiry-mobile',
			{ x: 0, y: bannerBottom, width: 390, height: p.viewportSize().height - bannerBottom },
			{ fullPage: false },
		);
		await bar.click();
		await p.waitForURL(/\/events\/[0-9a-f-]+\/menu$/, { timeout: 60_000 });
		manifest.eventUrl = p.url().replace(/\/menu$/, '');
		manifest.guests = EVENT.guests;
		await saveManifest();
		await phone.close();
		console.log('event', manifest.eventUrl);
	},

	async menu() {
		const eventUrl = await findEvent();
		if (!eventUrl) throw new Error('run the inquiry step first');
		await open(page, `${eventUrl}/menu`);
		// Re-runnable: the menu and the date are set once; later runs only re-shoot.
		if (!(await page.getByText(`From “${EVENT.menu}”`).count())) {
			await page.getByRole('searchbox', { name: /Search menus/ }).fill(EVENT.menu);
			await page.waitForTimeout(1200);
			await page.getByRole('button', { name: 'Use menu' }).first().click();
			await page.getByText('All changes saved').first().waitFor({ timeout: 60_000 });
			// The date, time and plated service, through the event's own forms.
			await open(page, eventUrl);
			await page.getByRole('button', { name: 'Edit details' }).click();
			const dialog = page.getByRole('dialog', { name: 'Edit event details' });
			await dialog.waitFor();
			await dialog.getByLabel('Date not decided yet').uncheck();
			const wedding = dialog.getByRole('radio', { name: 'Wedding' });
			await wedding.check({ force: true });
			await dialog.getByLabel('Service start').fill(EVENT.start);
			await dialog.getByLabel('Service end').fill(EVENT.end);
			await dialog.getByText('Plated', { exact: true }).click();
			await dialog.getByRole('button', { name: 'Save changes' }).click();
			await dialog.waitFor({ state: 'hidden' });
			const r = await page.request.post(`${eventUrl}?/setDate`, { headers: { origin: APP }, form: { serviceDate: EVENT.date } });
			if (!r.ok()) throw new Error(`setDate refused: ${r.status()}`);
		}
		// The Menu & service screen: the step title down to the event totals.
		await open(page, `${eventUrl}/menu`);
		const title = page.getByRole('heading', { level: 1 });
		const totals = page.getByText('Event totals', { exact: false });
		await totals.first().waitFor();
		const food = await page.evaluate(() => {
			const t = document.querySelector('main').innerText;
			return {
				pct: t.match(/Food cost %\s*([\d.]+%)/)?.[1],
				perGuest: t.match(/subtotal\s*·\s*\$([\d,]+\.\d{2}) per guest/)?.[1],
				revenue: t.match(/EVENT TOTALS\s*\$([\d,]+\.\d{2})/i)?.[1],
				target: t.match(/Target\s*(\d+%)/)?.[1],
			};
		});
		console.log('menu figures', food);
		if (!food.pct || !food.target) throw new Error('could not read food cost % and target off the Menu & service screen');
		manifest.proposalFoodCostPct = food.pct;
		manifest.targetPct = food.target;
		if (!food.perGuest || !food.revenue) throw new Error('could not read the price a guest and the event total');
		manifest.pricePerGuest = `$${food.perGuest}`;
		manifest.revenue = `$${food.revenue}`;
		const box = await union([title, page.getByText(/Continue to proposal/).first()], 24);
		await shoot(page, 'menu-service', { x: box.x, y: box.y - 40, width: Math.max(box.width, 1392), height: box.height + 40 });
	},

	async proposal() {
		const eventUrl = await findEvent();
		if (!eventUrl) throw new Error('run the inquiry and menu steps first');
		if (manifest.offerUrl) throw new Error('the proposal is already sent');
		// Re-runnable: once sent, the step only re-shoots the decision page.
		await open(page, `${eventUrl}/decision`);
		const alreadySent = (await page.getByRole('heading', { level: 1, name: /^Waiting on / }).count()) > 0;
		if (!alreadySent) {
			await open(page, `${eventUrl}/proposal`);
			await page.getByLabel('Client email').fill(EVENT.email);
			// The deposit and balance the client accepts with the price.
			await page.getByLabel('A deposit, then the balance').check({ force: true });
			await page.getByLabel('A fixed amount').check({ force: true });
			await page.getByLabel('Deposit dollars').fill(EVENT.deposit);
			await page.getByLabel('In one payment').check({ force: true });
			await page.getByLabel('Balance due (days before the event)').fill('0');
			await page.waitForTimeout(1500);
			await page.getByRole('button', { name: 'Preview & send' }).last().click();
			await page.waitForURL(/\/proposal\/(send|preview)/, { timeout: 60_000 });
			await page.waitForTimeout(2500);
			const send = page.getByRole('button', { name: /^Send (offer|proposal) to/ });
			if (!(await send.count())) {
				const buttons = (await page.getByRole('button').allInnerTexts()).map((t) => t.trim()).filter(Boolean);
				throw new Error(`no Send button on ${page.url()}; buttons: ${buttons.join(' | ')}`);
			}
			await send.first().click();
			await page.waitForURL(/\/decision/, { timeout: 60_000 });
			await page.waitForTimeout(3000);
		}
		await page.getByRole('list', { name: 'Offer tracking' }).getByText(/Sent/).first().waitFor({ timeout: 60_000 });
		const card = page.locator('main section').filter({ has: page.getByRole('heading', { name: 'Current offer' }) });
		const title = page.getByRole('heading', { level: 1, name: /^Waiting on / });
		const box = await union([title, card], 24);
		await shoot(page, 'proposal-sent-desktop', { x: box.x, y: box.y - 40, width: box.width, height: box.height + 40 });
		await owner.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: APP });
		await page.getByRole('button', { name: 'Copy offer link' }).click();
		manifest.offerUrl = await page.evaluate(() => navigator.clipboard.readText());
		if (!/^https?:\/\//.test(manifest.offerUrl)) throw new Error(`Copy offer link gave "${manifest.offerUrl}"`);
		await saveManifest();
		console.log('offer link saved');
	},

	async accept() {
		if (!manifest.offerUrl) throw new Error('run the proposal step first');
		const client = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
		const cp = await client.newPage();
		await open(cp, manifest.offerUrl);
		const accept = cp.getByRole('button', { name: 'Accept proposal' }).last();
		await accept.waitFor({ timeout: 60_000 });
		// One phone screen with the price, the event, the menu and the fixed
		// Accept bar under the dish list.
		const listBottom = (await docBox(cp.getByRole('heading', { name: /what we.ll serve/i }).locator('xpath=following::ul[1]'))).b;
		const barTop = await accept.evaluate((el) => {
			let n = el;
			while (n.parentElement && !['fixed', 'sticky'].includes(getComputedStyle(n).position)) n = n.parentElement;
			return n.getBoundingClientRect().top;
		});
		await cp.setViewportSize({ width: 390, height: Math.round(listBottom + 20 + (844 - barTop)) });
		await cp.evaluate(() => window.scrollTo(0, 0));
		// The offer page's header hard-codes a dashed "LOGO" box (o/[token]/+page.svelte,
		// develop 05dfa4165) and never shows the kitchen's logo: start below it.
		const headerBottom = await cp.locator('header').first().evaluate((h) => h.getBoundingClientRect().bottom);
		await shoot(cp, 'proposal-mobile', { x: 0, y: headerBottom, width: 390, height: cp.viewportSize().height - headerBottom }, { fullPage: false });
		await cp.setViewportSize({ width: 390, height: 844 });
		await accept.click();
		await cp.getByLabel('Your full name').fill(EVENT.client);
		await cp.getByRole('button', { name: /^Accept for / }).click();
		await cp.getByRole('heading', { name: /accepted/i }).waitFor({ timeout: 60_000 });
		await client.close();
		console.log('accepted');
	},
};

const step = process.argv[2];
try {
	if (!STEPS[step]) throw new Error(`unknown step "${step}"; one of: ${Object.keys(STEPS).join(', ')}`);
	await signIn();
	await STEPS[step]();
} finally {
	await browser.close();
}

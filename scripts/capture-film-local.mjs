// Captures the promo film's frames from the Nair & Castellano wedding, the one
// the homepage frames show, carried forward on LOCAL develop (owner 2026-10-07:
// "the film follows Nair & Castellano"). The wedding already exists in that
// world: it came in as a phone call, was priced from the Wedding Plated Dinner
// at $95.00 a guest, the client accepted the offer on her phone, and the
// $3,500.00 deposit was paid with Stripe's test card. This walk continues it:
// agreement, Book the event, shop, Confirm, supplier orders, receiving, prep,
// pack, and the food-cost closeout the day after.
//
//   APP=http://localhost:4193 DB=<abs path to e2e/.scratch/home.db> \
//     FILM_OUT=<scratch dir> DEVELOP_COMMIT=7a7e407d9 node scripts/capture-film-local.mjs <step>
//
// Steps, in order: menu, accepted, paid, agreement, book, shop, kitchen, buy,
// receive, lists, (VACUUM INTO a backup), closeout. Each step reads where the
// wedding is from the app and refuses to run out of order, so a failed step
// can be fixed and re-run. Sign-in is the local app's magic-link capture.
//
// Rules kept from capture-film.mjs and capture-home-proof.mjs: element-bounded
// clips, mouse parked, focus blurred, toasts removed, fonts loaded, animations
// off, caret hidden, and every clip's text checked against FORBIDDEN. DPR 2.
//
// The one write not done through the UI is the closeout's date move, the one
// capture-events-proof.mjs documents: orders.event_date and events.service_date
// move together to yesterday, guarded to this event and order, right before the
// closeout frame, because the closeout opens the day after the event.
//
// Pattern: none. Considered Command (one object per step with run/verify);
// not used because the steps share one page and one manifest and run in a
// fixed order; a table of named async functions is the whole need.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const APP = process.env.APP ?? 'http://localhost:4193';
const KB_DIR = process.env.KB_DIR ?? '/home/rayan147/kitchen-brain-develop-demo';
const DEVELOP_COMMIT = process.env.DEVELOP_COMMIT ?? '';
const DPR = Number(process.env.DPR ?? 2);
if (!/^[0-9a-f]{7,40}$/.test(DEVELOP_COMMIT)) throw new Error('DEVELOP_COMMIT=<sha the app runs> is required');
if (!/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(APP)) throw new Error(`APP is ${APP}; this walk writes and only runs against a local app`);
if (!process.env.DB) throw new Error('DB=<absolute path to the app scratch database> is required (the closeout date move writes it)');
const DB = resolve(process.env.DB);
if (!DB.includes(`${sep}e2e${sep}.scratch${sep}`)) throw new Error(`DB is ${DB}; only a file under e2e/.scratch/ is written`);
const { chromium } = await import(pathToFileURL(resolve(KB_DIR, 'node_modules/playwright/index.mjs')).href);
const { createClient } = await import(pathToFileURL(resolve(KB_DIR, 'node_modules/@libsql/client/lib-esm/node.js')).href);

const OUT = process.env.FILM_OUT ? resolve(process.env.FILM_OUT) : resolve(import.meta.dirname, '../public/proof/film');
const MANIFEST = resolve(OUT, 'manifest.json');
const OWNER = 'marisol@example.com';
const KITCHEN = 'Harbor & Hearth Catering';
const TODAY = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());

// The wedding, as the homepage capture left it (docs/proof/home-manifest.json).
const EVENT = {
	id: 'd240353e-66b2-4067-b979-0e6c155c6835',
	name: 'Nair & Castellano wedding',
	client: 'Priya Nair',
	order: 784,
	date: '2026-12-19',
	kitchenSigner: 'Marisol Vega',
};
const EVENT_URL = `${APP}/events/${EVENT.id}`;
const ORDER = `${APP}/orders/${EVENT.order}`;

// The agreement's wording, typed by hand, and where its signed copy came from.
// Local develop has no online signing provider, so the app offers the paper
// route: collect the signatures on paper, then upload the signed copy. The
// source line prints on the frame, so it says plainly what this copy is.
const WORDING = [
	'Harbor & Hearth Catering will cook and serve the plated dinner in the accepted proposal for the Nair & Castellano wedding.',
	'The deposit holds the date. The balance and the final guest count are due ten days before the event.',
	'Please send dietary needs and allergies with the final count.',
];
const PAPER_SOURCE = 'Sample data: the revision PDF stands in for the copy signed on paper.';

// Text that must never be in a shipped frame.
const FORBIDDEN = [
	/Load out/i,
	/Kitchen Brain/i,
	/Test environment/i,
	/Test site/i,
	/Maple & Main/,
	/\bE2E\b/,
	/\bstub\b/i,
	/Add a card in Billing/,
	/\bLOGO\b/,
	/rayan/i,
	/this is a test/i,
	// PaperCopy's own note says an uploaded copy "doesn't count as signed
	// here" while Book counts it (booking-requirements.ts); kept off the film.
	/doesn.t count as signed/,
];

await mkdir(OUT, { recursive: true });
const manifest = await readFile(MANIFEST, 'utf8').then(JSON.parse, () => ({ frames: [] }));
const saveManifest = () => writeFile(MANIFEST, JSON.stringify({ ...manifest, appSha: DEVELOP_COMMIT, capturedOn: TODAY }, null, 2) + '\n');

const db = createClient({ url: `file:${DB}` });
const one = async (sql, args = []) => (await db.execute({ sql, args })).rows[0];
{
	const org = await one('select name from organization limit 1');
	if (org?.name !== KITCHEN) throw new Error(`the kitchen in ${DB} is "${org?.name}", not "${KITCHEN}"`);
	const ev = await one('select description from events where id = ?', [EVENT.id]);
	if (ev?.description !== EVENT.name) throw new Error(`event ${EVENT.id} is not "${EVENT.name}" in ${DB}`);
}

const browser = await chromium.launch({
	executablePath: '/usr/bin/google-chrome',
	headless: true,
	args: ['--no-sandbox', '--font-render-hinting=none'],
});
const owner = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: DPR, reducedMotion: 'reduce' });
await owner.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: APP });
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
	manifest.frameSources = {
		...(manifest.frameSources ?? {}),
		[`${name}.png`]: { host: new URL(p.url()).host, app: DEVELOP_COMMIT, via: `capture-film-local.mjs ${step}` },
	};
	await saveManifest();
	console.log(`captured ${name} (${box.width}x${box.height} CSS px @${await p.evaluate(() => devicePixelRatio)}x)`);
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
	if (!link) throw new Error('no magic link captured; the app must run with MAGIC_LINK_TEST_CAPTURE=1');
	const u = new URL(link);
	await open(page, `${u.pathname}${u.search}`);
}

/** Where the app's "Add a card in Billing" bar ends (0 where there is none). */
async function bannerBottom(p) {
	return p.evaluate(() => {
		const b = [...document.querySelectorAll('body *')].find((e) => /^Your kitchen is ready\./.test(e.textContent?.trim() ?? '') && e.children.length === 0);
		return b ? b.getBoundingClientRect().bottom + window.scrollY : 0;
	});
}

/** The owner's session at 3x, for narrow clips the film scales up to fill. */
async function at3x() {
	return browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 3, reducedMotion: 'reduce', storageState: await owner.storageState() });
}

const STEPS = {
	// Read-only: the Menu & service step, where the job is priced. The price, the
	// food cost and the target are read off the screen it photographs.
	async menu() {
		await open(page, `${EVENT_URL}/menu`);
		const title = page.getByRole('heading', { level: 1 });
		await page.getByText('Event totals', { exact: false }).first().waitFor();
		const food = await page.evaluate(() => {
			const t = document.querySelector('main').innerText;
			return {
				pct: t.match(/Food cost %\s*([\d.]+%)/)?.[1],
				perGuest: t.match(/subtotal\s*·\s*\$([\d,]+\.\d{2}) per guest/)?.[1],
				revenue: t.match(/EVENT TOTALS\s*\$([\d,]+\.\d{2})/i)?.[1],
				target: t.match(/Target\s*(\d+%)/)?.[1],
				guests: t.match(/(\d+) guests/)?.[1],
			};
		});
		console.log('menu figures', food);
		if (!food.pct || !food.target || !food.perGuest || !food.revenue || !food.guests) throw new Error('could not read the figures off Menu & service');
		Object.assign(manifest, { proposalFoodCostPct: food.pct, targetPct: food.target, pricePerGuest: `$${food.perGuest}`, revenue: `$${food.revenue}`, guests: food.guests });
		const box = await union([title, page.getByText(/Continue to proposal/).first()], 24);
		// From the step eyebrow above the title; the breadcrumb above it stays out.
		const top = (await docBox(page.getByText(/^Step 2 of 6/i))).y - 16;
		await shoot(page, 'menu-service', { x: box.x, y: top, width: Math.max(box.width, 1392), height: box.y + box.height - top });
	},

	// Read-only: the offer on the client's phone after she accepted it, from the
	// link the kitchen copies off the decision page.
	async accepted() {
		await open(page, `${EVENT_URL}/decision`);
		await page.getByRole('button', { name: 'Copy offer link' }).click();
		await page.waitForTimeout(600);
		const offerUrl = await page.evaluate(() => navigator.clipboard.readText());
		if (!new URL(offerUrl).hostname.match(/^(localhost|127\.0\.0\.1)$/)) throw new Error('the offer link is not local');
		const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DPR, reducedMotion: 'reduce' });
		const p = await phone.newPage();
		await open(p, offerUrl);
		const head = p.getByRole('heading', { name: /Proposal accepted/ });
		await head.waitFor({ timeout: 60_000 });
		const box = await union([p.getByText(KITCHEN).first(), head, p.getByRole('link', { name: /Download your copy/ }).or(p.getByRole('button', { name: /Download your copy/ }))], 20);
		await shoot(p, 'accepted-mobile', { x: 0, y: 0, width: 390, height: box.y + box.height });
		await phone.close();
	},

	// Read-only: the Payments card on the order's Money tab: the deposit paid by
	// card, the balance and its due day.
	async paid() {
		await open(page, `${ORDER}?tab=money`);
		const card = page.locator('main section, main div').filter({ has: page.getByRole('heading', { name: 'Payments', exact: true }) }).filter({ hasText: 'Due dates are part of' }).last();
		const text = (await card.innerText()).replace(/\s+/g, ' ');
		console.log(text.slice(0, 600));
		if (!/Deposit Paid by card/.test(text)) throw new Error(`the deposit is not paid: ${text.slice(0, 200)}`);
		manifest.deposit = text.match(/(\$[\d,]+\.\d{2}) paid of/)?.[1];
		manifest.offerTotal = text.match(/paid of (\$[\d,]+\.\d{2})/)?.[1];
		const due = text.match(/(\$[\d,]+\.\d{2}) due ((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), [A-Z][a-z]{2} \d{1,2})/);
		manifest.balance = due?.[1];
		manifest.balanceDue = due?.[2];
		if (!manifest.deposit || !manifest.balance) throw new Error('could not read the deposit and balance');
		await saveManifest();
		const b = await docBox(card);
		// Down to the balance's reminder line. The pay-link row under it counts
		// the links that can pay the balance, and copying one for an earlier
		// probe of this walk made a second; that row stays out.
		const bottom = (await docBox(card.getByText(/^Reminder sent /).first())).b + 24;
		await shoot(page, 'payments-paid-desktop', { x: b.x, y: b.y, width: b.r - b.x, height: bottom - b.y });
	},

	// The agreement, written from the accepted offer. Local develop has no
	// online signing provider ("Online signing is not set up here. Collect the
	// signatures on paper, then upload the signed copy."), so the walk takes
	// the app's paper route: review the contract, then upload the signed copy.
	async agreement() {
		await open(page, `${EVENT_URL}/agreement`);
		const review = page.getByRole('link', { name: /^Review (contract|the new revision)$/ }).or(page.getByRole('button', { name: /^Review (contract|the new revision)$/ }));
		const wording = page.getByRole('textbox', { name: 'Contract wording' });
		if ((await wording.count()) && !(await wording.innerText()).trim()) {
			await wording.click();
			for (const [i, line] of WORDING.entries()) {
				await page.keyboard.type(line, { delay: 2 });
				if (i < WORDING.length - 1) await page.keyboard.press('Enter');
			}
			await page.waitForTimeout(2500);
		}
		if (await review.count()) {
			await review.first().click();
			await page.waitForURL(/\/(agreement\/review|contract\/preview)/, { timeout: 60_000 });
			await page.waitForTimeout(2500);
		} else {
			// The saved revision's own page, by the agreement page's link to it.
		await open(page, `${EVENT_URL}/agreement`);
		await open(page, await page.getByRole('link', { name: /^Revision \d+$/ }).first().getAttribute('href'));
		}
		// "Nothing is emailed, because online signing is not set up here."
		const approve = page.getByRole('button', { name: 'Approve and save' });
		if (/\/agreement\/review/.test(page.url()) && (await approve.count())) {
			await approve.click();
			await page.waitForURL(/\/agreement$/, { timeout: 60_000 });
			await page.waitForTimeout(2500);
		}
		// The saved revision's own page, by the agreement page's link to it.
		await open(page, `${EVENT_URL}/agreement`);
		await open(page, await page.getByRole('link', { name: /^Revision \d+$/ }).first().getAttribute('href'));
		const paper = page.locator('#signed-copy');
		await paper.waitFor({ timeout: 60_000 });
		if (!(await paper.getByText('Signed copy on file').count())) {
			// The copy is the saved revision's own PDF, downloaded from this page:
			// sample data, and the source line says so.
			const href = await page.getByRole('link', { name: /^Download PDF$/ }).first().getAttribute('href');
			const pdf = await page.request.get(new URL(href, page.url()).href);
			if (!pdf.ok() || !(pdf.headers()['content-type'] ?? '').includes('pdf')) throw new Error(`the revision PDF did not download: ${pdf.status()}`);
			await paper.getByRole('button', { name: 'Upload a signed copy' }).click();
			const dialog = page.getByRole('dialog', { name: 'Upload a signed copy' });
			await dialog.waitFor();
			await dialog.getByLabel(/^Signed PDF/).setInputFiles({ name: 'nair-castellano-agreement-signed.pdf', mimeType: 'application/pdf', buffer: await pdf.body() });
			await dialog.getByLabel('Where did it come from?').fill(PAPER_SOURCE);
			await dialog.getByRole('checkbox').check();
			await dialog.getByRole('button', { name: 'Save signed copy' }).click();
			await dialog.waitFor({ state: 'hidden', timeout: 60_000 });
			await open(page, page.url());
		}
		console.log((await page.locator('aside[aria-label="Signatures and revision"]').innerText()).replace(/\s+/g, ' '));
		if (process.env.DUMP) return;
		// The copy on file, from its heading down to its download link. The
		// card's next paragraph says an uploaded copy "doesn't count as signed
		// here", while Book counts it (the event page reads "The agreement is
		// signed."): an app inconsistency, reported, kept out of the frame. The
		// Signatures card above still reads 0 of 2, as nothing was sent online.
		// A narrow card, so it is shot at 3x: the film scales it up to fill.
		const close = await at3x();
		const p3 = await close.newPage();
		await open(p3, page.url());
		const copy = p3.locator('#signed-copy');
		const card = await docBox(copy);
		const bottom = (await docBox(copy.getByRole('link', { name: 'Download the signed copy' }))).b;
		await shoot(p3, 'agreement-desktop', { x: card.x - 16, y: card.y - 16, width: card.r - card.x + 32, height: bottom - card.y + 16 });
		await close.close();
	},

	// Book the event with everything it asks for in: the signed copy on file,
	// the deposit paid, a day with room. No override, no reason typed.
	async book() {
		await open(page, EVENT_URL);
		const book = page.locator('#book-event');
		const bookIt = book.getByRole('button', { name: 'Book the event', exact: true });
		if (await bookIt.count()) {
			const text = (await book.innerText()).replace(/\s+/g, ' ');
			if (!/Everything booking asks for is in/.test(text)) throw new Error(`booking still needs something: ${text.slice(0, 300)}`);
			// The step rail and the next step ("The agreement is signed."), then
			// the Book card, one frame each.
			const next = page.locator('main section, main div').filter({ hasText: /^NEXT STEP/i }).filter({ hasText: 'The agreement is signed' }).last();
			const rail = page.getByText('You are here').first().locator('xpath=ancestor::*[.//*[contains(text(),"Inquiry")]][1]');
			const box = await union([rail, next], 24);
			const wide = await docBox(page.locator('.event-workspace').first());
			await shoot(page, 'signed-desktop', { x: wide.x - 24, y: box.y, width: wide.r - wide.x + 48, height: box.height });
			await shoot(page, 'book-event-desktop', await union([book], 16));
			if (process.env.DUMP) return;
			await bookIt.click();
			await page.getByText('Event booked').first().waitFor({ timeout: 60_000 });
		} else if (await book.getByRole('button', { name: 'Book anyway' }).count()) {
			throw new Error(`booking still needs something: ${(await book.innerText()).replace(/\s+/g, ' ').slice(0, 300)}`);
		}
		await open(page, EVENT_URL);
		const next = page.locator('main section, main div').filter({ hasText: /^NEXT STEP/i }).filter({ hasText: 'Event booked' }).last();
		const rail = page.getByText('You are here').first().locator('xpath=ancestor::*[.//*[contains(text(),"Inquiry")]][1]');
		const box = await union([rail, next], 24);
		const wide = await docBox(page.locator('.event-workspace').first());
		await shoot(page, 'booked-desktop', { x: wide.x - 24, y: box.y, width: wide.r - wide.x + 48, height: box.height });
		manifest.eventDate = (await page.locator('main').first().innerText()).match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun), [A-Z][a-z]{2} \d{1,2}, \d{4}/)?.[0];
		await saveManifest();
		console.log('booked', manifest.eventDate);
	},

	// The shop list: the first supplier groups, whole packs. Read-only, so it
	// re-shoots after Confirm.
	async shop() {
		await open(page, `${ORDER}?tab=shop`);
		await page.locator('.group-head').first().waitFor({ timeout: 60_000 });
		const box = await union([page.getByRole('table', { name: 'Ingredients grouped by supplier' }).locator('[role="row"]').first(), page.locator('[role="rowgroup"]').nth(1)], 16);
		await shoot(page, 'shop-desktop', box);
	},

	// Confirm order: guest restrictions marked "None declared" (the client named
	// none on the call; sample data), the dialog shot, then confirmed.
	async kitchen() {
		await STEPS.shop();
		await open(page, `${ORDER}?tab=shop`);
		const none = page.getByRole('button', { name: 'Mark guest restrictions: None declared' });
		if (await none.count()) {
			await none.click();
			await page.waitForTimeout(2000);
			await open(page, `${ORDER}?tab=shop`);
		}
		const checks = (await page.getByLabel('Before you confirm').innerText()).replace(/\s+/g, ' ');
		console.log(checks.slice(0, 400));
		manifest.foodCostPct = checks.match(/([\d.]+%) food cost, target/)?.[1];
		await saveManifest();
		// The dialog is narrow, so it is opened and confirmed at 3x, and clipped
		// to its own edges: the dimmed page behind stays out.
		const close = await at3x();
		const p3 = await close.newPage();
		await open(p3, `${ORDER}?tab=shop`);
		await p3.getByRole('button', { name: /^Confirm( order)?$/ }).first().click();
		const dialog = p3.getByRole('alertdialog');
		await dialog.waitFor({ timeout: 30_000 });
		await p3.waitForTimeout(700);
		const b = await dialog.boundingBox();
		await shoot(p3, 'confirm-desktop', { x: b.x, y: b.y, width: b.width, height: b.height }, { fullPage: false });
		if (process.env.DUMP) return close.close();
		await dialog.getByRole('button', { name: /^Confirm( order)?$/ }).click();
		await dialog.waitFor({ state: 'hidden', timeout: 30_000 });
		await close.close();
		const row = await one('select status from orders where id = ?', [EVENT.order]);
		if (row.status !== 'confirmed') throw new Error(`order ${EVENT.order} is ${row.status}`);
		console.log('confirmed');
	},

	// Buying: the dialog that fans the order out by supplier, then send. The
	// supplier emails go to sample example.com addresses through the local
	// app's own mail catcher (Mailpit), never a real inbox.
	async buy() {
		const close = await at3x();
		const p3 = await close.newPage();
		await open(p3, `${ORDER}?tab=shop`);
		const send = p3.getByRole('button', { name: /^Send \d+ emails?/ }).first();
		if (!(await send.count())) {
			await close.close();
			return console.log('already sent to suppliers');
		}
		await send.click();
		const dialog = p3.getByRole('dialog').filter({ hasText: 'Send these supplier orders?' });
		await dialog.waitFor({ timeout: 30_000 });
		await p3.waitForTimeout(700);
		console.log((await dialog.innerText()).replace(/\s+/g, ' ').slice(0, 600));
		const b = await dialog.boundingBox();
		await shoot(p3, 'po-desktop', { x: b.x, y: b.y, width: b.width, height: b.height }, { fullPage: false });
		if (process.env.DUMP) return close.close();
		await dialog.getByRole('button', { name: /^Send \d+ emails?/ }).click();
		await dialog.waitFor({ state: 'hidden', timeout: 60_000 });
		await close.close();
		console.log('sent to suppliers');
	},

	// The trucks: every line checked in whole but the arugula, which came one
	// clamshell short (3 of 4, $61.74 of $82.32; sample data), so the frame
	// shows a real "Still to get". Finishing check-in posts what came and what
	// it cost as purchases, which the closeout's "at what you paid" reads.
	async receive() {
		await open(page, `${ORDER}/receiving`);
		const baldor = page.locator('main section, main div').filter({ has: page.getByText('Baldor contact and purchasing details') }).filter({ has: page.getByRole('button', { name: 'All of Arugula is here' }) }).last();
		const arugulaRow = baldor.locator('li, div').filter({ has: page.getByRole('button', { name: 'All of Arugula is here' }) }).last();
		if (await arugulaRow.getByRole('button', { name: 'Fewer came' }).count()) {
			await arugulaRow.getByRole('button', { name: 'Fewer came' }).click();
			await page.getByLabel(/How many came/).first().fill('3');
			await page.getByLabel(/Invoice total for this item/).first().fill('61.74');
			await page.getByLabel(/Receiving note/).first().fill('One clamshell short on the truck.');
			await page.getByRole('button', { name: /^Save: fewer came/ }).first().click();
			await page.waitForTimeout(2500);
		}
		const others = page.getByRole('button', { name: /^All of (?!Arugula).+ is here$/ });
		for (let n = 0; n < 60 && (await others.count()) > 0; n += 1) {
			await others.first().click();
			await page.waitForTimeout(1200);
		}
		await open(page, `${ORDER}/receiving`);
		// From "Your orders to vendors" down to Still to get. The Finish check-in
		// bar is fixed to the screen's foot, so the clip ends above where it sits.
		const vendors = page.getByText('Your orders to vendors').first().locator('xpath=..');
		const still = page.locator('main section, main div').filter({ has: page.getByText('Still to get', { exact: true }) }).filter({ hasText: 'still needed' }).last();
		await shoot(page, 'receiving-desktop', await union([vendors, still], 24));
		if (process.env.DUMP) return;
		const finish = page.getByRole('button', { name: 'Finish check-in' });
		if (await finish.count()) {
			await finish.first().click();
			const review = page.getByRole('dialog');
			await review.waitFor({ timeout: 30_000 });
			await review.getByRole('button', { name: 'Finish check-in' }).click();
			await review.waitFor({ state: 'hidden', timeout: 60_000 });
			console.log('check-in finished');
		}
	},

	// The prep list and the pack list, as the crew opens them.
	async lists() {
		// Prep: from the last make-first base to the last dish, each dish with
		// its portions. The page header's date is the event's, which reads as
		// prepping on the day, so it stays out.
		await open(page, `${ORDER}?tab=prep`);
		const rows = page.locator('main').getByText(/^\d+ · .+· \d+ portions/);
		await rows.first().waitFor({ timeout: 60_000 });
		const base = page.locator('main section, main div, main article, main li').filter({ has: page.getByText('Make first', { exact: false }) }).filter({ hasText: 'Whipped Goat Cheese Spread' }).filter({ hasNotText: 'Mirepoix Base' }).last();
		const prepText = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
		manifest.mainPortions = prepText.match(/Braised Short Rib· (\d+) portions/)?.[1];
		if (!manifest.mainPortions) throw new Error(`no short rib portions on the prep list: ${prepText.slice(0, 300)}`);
		await shoot(page, 'prep-desktop', await union([base, rows.last().locator('xpath=..')], 24));
		// Pack: the dishes card only, with each dish's allergens and portions.
		await open(page, `${ORDER}?tab=pack`);
		const dishes = page.locator('main section, main div').filter({ has: page.getByText(/^Dishes/) }).filter({ hasText: 'Lemon Posset' }).filter({ hasNotText: /Load out|Equipment/ }).last();
		await dishes.waitFor({ timeout: 60_000 });
		const packText = (await dishes.innerText()).replace(/\s+/g, ' ');
		const packed = packText.match(/Braised Short Rib\b\D*?(\d+)\b/)?.[1];
		if (packed !== manifest.mainPortions) throw new Error(`the pack list counts ${packed} short rib, the prep list ${manifest.mainPortions}`);
		manifest.packDishes = packText.match(/Dishes\s*·\s*0 of (\d+)/)?.[1];
		await saveManifest();
		await shoot(page, 'pack-desktop', await union([dishes], 16));
	},

	// The food-cost closeout opens the day after the event. The event and its
	// order move to yesterday together (the one raw write, guarded to this
	// event and order), then the kitchen records what it used and closes the
	// review through the page, so the share is final, not "likely".
	async closeout() {
		const yesterday = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date(Date.now() - 86_400_000));
		const order = await one('select event_date, status from orders where id = ?', [EVENT.order]);
		if (order.event_date === EVENT.date) {
			if (order.status !== 'confirmed') throw new Error(`order ${EVENT.order} is ${order.status}; confirm it before the closeout`);
			const event = await one('select id from events where id = ? and description = ? and service_date = ?', [EVENT.id, EVENT.name, EVENT.date]);
			if (!event) throw new Error(`event ${EVENT.id} is not "${EVENT.name}" on ${EVENT.date}; refusing the date move`);
			await db.execute({ sql: 'update orders set event_date = ? where id = ? and event_date = ?', args: [yesterday, EVENT.order, EVENT.date] });
			await db.execute({ sql: 'update events set service_date = ? where id = ? and service_date = ?', args: [yesterday, EVENT.id, EVENT.date] });
			manifest.dateMove = `orders.event_date and events.service_date moved ${EVENT.date} -> ${yesterday} for order ${EVENT.order} / event ${EVENT.id}, right before the closeout frame`;
			await saveManifest();
		} else if (order.event_date !== yesterday) {
			throw new Error(`order ${EVENT.order} is on ${order.event_date}, neither ${EVENT.date} nor yesterday`);
		}
		await open(page, `${ORDER}/closeout`);
		const title = page.getByRole('heading', { level: 1, name: 'Food-cost closeout' });
		await title.waitFor({ timeout: 60_000 });
		// What the kitchen used: each ingredient's need off the confirmed Shop
		// list, recorded as used (sample data: the kitchen cooked to plan).
		const recorded = new Set(
			(await page.locator('main').innerText()).match(/\d+ amounts? recorded/) ? (await page.locator('details li').evaluateAll((els) => els.map((e) => e.textContent ?? ''))).map((t) => t.split(' · ')[0].trim()) : [],
		);
		await open(page, `${ORDER}?tab=shop`);
		const shopText = await page.locator('main').innerText();
		const needs = [...shopText.matchAll(/\n([A-Z][^\n]+)\n(?:\nUses [^\n]+\n\n)?([\d.,]+) (lb|gal|fl oz|each|oz|qt)\nNot counted/g)].map((m) => ({ name: m[1].trim(), qty: m[2].replace(/,/g, ''), unit: m[3] }));
		const UNIT = { lb: 'Pound (lb)', gal: 'Gallon (gal)', 'fl oz': 'Fluid ounce (fl oz)', each: 'Each (ea)', oz: 'Ounce (oz)', qt: 'Quart (qt)' };
		console.log(`${needs.length} needs on the Shop list`);
		await open(page, `${ORDER}/closeout`);
		for (const need of needs) {
			if (recorded.has(need.name)) continue;
			const form = page.locator('#record-draw');
			await form.locator('#observation-ingredient').click();
			await page.getByRole('option', { name: need.name, exact: true }).click();
			await form.getByLabel('Quantity').fill(need.qty);
			await form.locator('#observation-unit').click();
			await page.getByRole('option', { name: UNIT[need.unit], exact: true }).click();
			await form.getByRole('button', { name: 'Save amount used' }).click();
			await page.waitForTimeout(1500);
			console.log('used', need.name, need.qty, need.unit);
		}
		// Buying records from before this event's supplier orders went out
		// (sample history dated Sep 28 to Oct 5; the orders went out Oct 7).
		for (let n = 0; n < 60; n += 1) {
			await open(page, `${ORDER}/closeout`);
			const reason = page.getByLabel('Why it is not for this event');
			if (!(await reason.count())) break;
			await reason.first().fill("Bought before this event's supplier orders went out.");
			await page.getByRole('button', { name: 'Not for this event' }).first().click();
			await page.waitForTimeout(1200);
		}
		await open(page, `${ORDER}/closeout`);
		const closeIt = page.getByRole('button', { name: 'Close food-cost review' });
		if (await closeIt.count()) {
			await closeIt.click();
			await page.waitForTimeout(2500);
			await open(page, `${ORDER}/closeout`);
		}
		const card = page
			.locator('main section, main div')
			.filter({ has: page.getByRole('heading', { name: 'Planned vs actual food cost' }) })
			.filter({ hasText: /(Over|Under) plan by/ })
			.filter({ hasNot: page.getByRole('heading', { name: 'Before you close' }) })
			.last();
		const text = (await card.innerText()).replace(/\s+/g, ' ');
		console.log(text.slice(0, 600));
		const figure = (label) => {
			const m = text.match(new RegExp(`${label}\\s*(\\$[\\d,]+\\.\\d{2}|[\\d.]+%)`));
			if (!m) throw new Error(`closeout card has no "${label}" figure: ${text.slice(0, 300)}`);
			return m[1];
		};
		manifest.closeoutPlanned = figure('Planned food cost');
		manifest.closeoutActual = figure('Actual food cost, at what you paid');
		manifest.closeoutDirection = /Under plan by/.test(text) ? 'under' : 'over';
		manifest.closeoutOver = figure('(?:Over|Under) plan by');
		manifest.closeoutPct = figure('Food cost, share of the event price(?: \\(likely\\))?');
		manifest.closeoutFinal = !/\(likely\)|Likely, not final/.test(text);
		if (!manifest.closeoutFinal) throw new Error('the closeout still reads likely');
		await saveManifest();
		// The card from its heading down to the four figures. The page subtitle
		// above prints the moved date (yesterday), not the wedding's, so it stays
		// out; the card's last line (a full-pack total) stays out as before.
		// At 1440 the four figures sit in one short row that the film would
		// letterbox, so the card is shot in a 960 px window at 3x, where they
		// stack two by two.
		const narrow = await browser.newContext({ viewport: { width: 960, height: 900 }, deviceScaleFactor: 3, reducedMotion: 'reduce', storageState: await owner.storageState() });
		const pn = await narrow.newPage();
		await open(pn, `${ORDER}/closeout`);
		const cardN = pn.locator('main section, main div').filter({ has: pn.getByRole('heading', { name: 'Planned vs actual food cost' }) }).filter({ hasText: /(Over|Under) plan by/ }).filter({ hasNot: pn.getByRole('heading', { name: 'Before you close' }) }).last();
		const box = await union([cardN], 24);
		const figures = await docBox(cardN.getByText('Food cost, share of the event price', { exact: false }).locator('xpath=..'));
		await shoot(pn, 'closeout-desktop', { x: box.x, y: box.y, width: box.width, height: figures.b + 14 - box.y });
		await narrow.close();
		console.log('closeout', manifest.closeoutPlanned, manifest.closeoutActual, manifest.closeoutOver, manifest.closeoutPct);
	},
};

const step = process.argv[2];
try {
	if (!STEPS[step]) throw new Error(`unknown step "${step}"; one of: ${Object.keys(STEPS).join(', ')}`);
	await signIn();
	await STEPS[step]();
} finally {
	await browser.close();
	db.close();
}

// Captures the promo film's frames from ONE walk of one wedding through
// test.app.costcook.io (develop, DocuSeal and Stripe test mode), starting from a
// quote request on the kitchen's ordering site. Run one step at a time; each
// step reads where the walk is from the app itself and refuses to run out of
// order, so a failed step can be fixed and re-run without starting over.
//
//   APP=https://test.app.costcook.io SITE=<storefront url> STORAGE=<owner session json> \
//     KB_APP_DIR=<the develop export> DEVELOP_COMMIT=<sha> node scripts/capture-film.mjs <step>
//
// Steps, in order: request, menu, proposal, accept, agreement, deposit, (the
// client pays by card, by hand), paid, book, allergens, kitchen, buy, receive,
// lists, then closeout on a local copy of the database with its clock moved to
// the day after (scripts/shift-clock.mjs). Without STORAGE the script signs in
// through a local app's magic-link capture instead.
//
// Frames land in public/proof/film/ at device pixel ratio DPR (3 by default),
// each clipped to the element it shows (never the test banner, never a mock),
// and every figure a caption quotes is read off the element it was photographed
// from into public/proof/film/manifest.json.
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
const STORAGE = process.env.STORAGE;
const SITE = process.env.SITE;
// Narrow clips (a dialog, a strip) are scaled up to fill 1920 px in the film;
// at 3x a 640 CSS px dialog is already 1920 px wide.
const DPR = Number(process.env.DPR ?? 3);
if (!KB_APP_DIR) throw new Error('KB_APP_DIR=<the kitchen-brain export the app runs from> is required');
if (!/^[0-9a-f]{7,40}$/.test(DEVELOP_COMMIT)) throw new Error('DEVELOP_COMMIT=<sha the app was exported from> is required');
const { chromium } = await import(pathToFileURL(resolve(KB_APP_DIR, 'node_modules/playwright/index.mjs')).href);

// FILM_OUT sends a reshoot on a throwaway database to a scratch directory, so
// its frames and manifest never overwrite the shipped walk until picked by hand.
const OUT = process.env.FILM_OUT ? resolve(process.env.FILM_OUT) : resolve(import.meta.dirname, '../public/proof/film');
const MANIFEST = resolve(OUT, 'manifest.json');
const OWNER = process.env.OWNER_EMAIL ?? 'marisol@example.com';
const KITCHEN = 'Harbor & Hearth Catering';
const TODAY = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());

// The one wedding every frame shows. The closeout opens the day after its
// date, so that frame is shot with the capture app's clock moved to that day
// (scripts/shift-clock.mjs); no date in the data is edited.
// A practice run overrides the client and event name so the real wedding is
// walked once, with no re-run steps on its record.
export const EVENT = {
	// A new couple: the earlier Dec 28 walk left a "Priya Nair" client on test
	// whose record carries the owner's own email, and the app offers to link it.
	client: process.env.EVENT_CLIENT ?? 'Elena Brooks',
	phone: process.env.EVENT_PHONE ?? '(207) 555-0164',
	email: process.env.EVENT_EMAIL ?? 'elena.brooks@example.com',
	name: process.env.EVENT_NAME ?? 'Brooks & Hale wedding',
	guests: '150',
	menu: 'Wedding Plated Dinner',
	// A Saturday in June, far enough out that a balance due ten days before
	// still falls after the walk.
	date: process.env.EVENT_DATE ?? '2027-06-12',
	venue: 'Pineland Barn, 15 Farm Road, Gorham',
	venueState: 'ME',
	venueZip: '04038',
	budget: '95 per guest',
	start: '17:00',
	end: '22:00',
	// The balance falls due ten days out, with the final count, never on the day.
	balanceDaysBefore: '10',
	kitchenSigner: 'Marisol Vega',
	staff: { people: '8', hours: '7', rate: '38' },
	rentals: { qty: '150', price: '14' },
	serviceFeePct: '18',
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
	// The owner's own identity on the test account, never the film kitchen's.
	/rayan/i,
	/870-6309/,
	/Sayreville/,
	/Test Kitchen/,
	/this is a test/i,
];

await mkdir(OUT, { recursive: true });
const manifest = await readFile(MANIFEST, 'utf8').then(JSON.parse, () => ({ frames: [] }));
const saveManifest = () => writeFile(MANIFEST, JSON.stringify({ ...manifest, appSha: DEVELOP_COMMIT, capturedOn: TODAY }, null, 2) + '\n');

const browser = await chromium.launch({
	executablePath: '/usr/bin/google-chrome',
	headless: true,
	args: ['--no-sandbox', '--font-render-hinting=none'],
});
const owner = await browser.newContext({
	viewport: { width: 1440, height: 900 },
	deviceScaleFactor: DPR,
	reducedMotion: 'reduce',
	...(STORAGE ? { storageState: STORAGE } : {}),
});
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
	// Per frame: a later step or a reshoot on another build must not restate it.
	manifest.frameSources = {
		...(manifest.frameSources ?? {}),
		// The host the frame was shot on: the storefront and pay page live on
		// the ordering site, not the app.
		[`${name}.png`]: { host: new URL(p.url()).hostname, app: DEVELOP_COMMIT, via: `capture-film.mjs ${step}` },
	};
	await saveManifest();
	console.log(`captured ${name} (${box.width}x${box.height} CSS px @${DPR}x)`);
	return text;
}

async function signIn() {
	if (STORAGE) return;
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

/** The wedding's event page URL, as the inquiry step recorded it, or null. */
async function findEvent() {
	if (manifest.eventUrl) return manifest.eventUrl;
	return null;
}

/** Where test's "Test site." banner ends on a page (0 where there is none). */
async function bannerBottom(p) {
	return p.evaluate(() => {
		const b = [...document.querySelectorAll('body *')].find((e) => /^Test site\./.test(e.textContent?.trim() ?? '') && e.children.length === 0);
		return b ? b.getBoundingClientRect().bottom + window.scrollY : 0;
	});
}

/** Adds one charge on the proposal builder (or edits it if it is already there). */
async function chargeLine(p, chip, name, fields, extra) {
	// The row's summary button ("Service staff Staff · 8 × ..."), not its "actions" menu.
	const existing = p.getByRole('button', { name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} (?!actions$)`) });
	if (await existing.count()) await existing.first().click();
	else await p.getByRole('button', { name: chip, exact: true }).first().click();
	const sheet = p.getByRole('dialog').filter({ has: p.getByRole('button', { name: 'Done' }) });
	await sheet.waitFor();
	await sheet.getByLabel('Name', { exact: true }).fill(name);
	for (const [label, value] of Object.entries(fields)) await sheet.getByLabel(label, { exact: true }).fill(value);
	if (extra) await extra(sheet);
	await sheet.getByRole('button', { name: 'Done' }).click();
	await sheet.waitFor({ state: 'hidden' });
	await p.waitForTimeout(800);
}

const STEPS = {
	// The client asks for a price on the kitchen's ordering site, on her phone.
	// The request lands in the app as an inquiry ("Came in via Storefront").
	async request() {
		if (await findEvent()) throw new Error('the wedding already exists; start a new walk to shoot the request again');
		if (!SITE) throw new Error('SITE=<the storefront url> is required');
		const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DPR, reducedMotion: 'reduce' });
		const p = await phone.newPage();
		await open(p, SITE);
		await p.getByRole('button', { name: 'Ask for a quote' }).click();
		await p.getByLabel('What is the event?').fill(EVENT.name);
		await p.getByLabel('Date If you have one').fill(EVENT.date);
		await p.getByLabel('Guests, at least').fill('140');
		await p.getByLabel('Guests, at most').fill(EVENT.guests);
		await p.getByLabel('Where is it? Optional').fill(`${EVENT.venue}, ${EVENT.venueState}`);
		await p.getByLabel('What is the kitchen like there?').selectOption({ label: 'Some power and water' });
		await p.getByLabel('How should it be served?').selectOption({ label: 'Plated' });
		await p.getByLabel('Staff on site').check();
		await p.getByLabel('Rentals').check();
		await p.getByLabel('What are you after?').fill('A plated dinner for our wedding. Short rib, and something for the vegetarians.');
		// The form from its heading down to the guest range: what she is asking for.
		const head = p.getByRole('heading', { name: 'Tell us about the event' });
		const served = p.getByLabel('How should it be served?');
		const top = (await docBox(head)).y - 24;
		await shoot(p, 'request-mobile', { x: 0, y: top, width: 390, height: (await docBox(served)).b + 24 - top });
		await p.getByRole('button', { name: /Add contact details/ }).click();
		await p.getByLabel('Your name').fill(EVENT.client);
		await p.getByLabel('Email address').fill(EVENT.email);
		await p.getByLabel('Phone Optional').fill(EVENT.phone);
		await p.getByRole('button', { name: 'Review what you are asking for' }).click();
		await p.getByRole('button', { name: 'Ask the kitchen for a price' }).click();
		await p.getByText('Your request reached the kitchen').waitFor({ timeout: 60_000 });
		const ref = (await p.locator('main').innerText()).match(/inquiry_([0-9a-f-]{36})/)?.[1];
		if (!ref) throw new Error('no request reference on the receipt');
		await phone.close();
		manifest.eventUrl = `${APP}/events/${ref}`;
		manifest.guests = EVENT.guests;
		await saveManifest();
		// The owner's side: what the client sent, from the ordering site.
		await open(page, manifest.eventUrl);
		const sent = page.locator('section.client-request');
		await sent.waitFor({ timeout: 60_000 });
		const box = await union([sent], 16);
		await shoot(page, 'inquiry-desktop', box);
		const create = page.getByRole('button', { name: 'Create client' });
		if (await create.count()) {
			await create.click();
			await page.waitForTimeout(2500);
		}
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
			await dialog.getByLabel('Venue or address').fill(EVENT.venue);
			await dialog.getByLabel('Venue state').fill(EVENT.venueState).catch(() => {});
			await dialog.getByLabel('Venue ZIP code').fill(EVENT.venueZip).catch(() => {});
			await dialog.getByLabel(/^Budget they mentioned/).fill(EVENT.budget).catch(() => {});
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
		// The page says "Waiting on" before any offer exists; only a sent offer has tracking.
		const alreadySent = (await page.getByRole('list', { name: 'Offer tracking' }).count()) > 0;
		if (!alreadySent) {
			// Test only emails approved addresses, and DocuSeal mails the signer a
			// one-time code, so from here the client's email is an inbox the owner
			// reads (CLIENT_INBOX). Her request and its frame keep the address she typed.
			if (process.env.CLIENT_INBOX) {
				await open(page, eventUrl);
				const clientHref = await page.getByRole('link', { name: 'View client' }).first().getAttribute('href');
				await open(page, clientHref);
				await page.getByText('Edit details', { exact: true }).first().click();
				await page.getByRole('textbox', { name: /Email/ }).first().fill(process.env.CLIENT_INBOX);
				await page.getByRole('button', { name: /^Save/ }).first().click();
				await page.waitForTimeout(2500);
				await open(page, clientHref);
				if (!(await page.locator('main').innerText()).includes(process.env.CLIENT_INBOX))
					throw new Error(`the client's email did not change to ${process.env.CLIENT_INBOX}`);
			}
			await open(page, `${eventUrl}/proposal`);
			// The request step creates the client from what she sent; a practice
			// event that skipped it gets one typed here.
			const client = page.getByLabel('Client', { exact: true });
			if (!(await client.inputValue())) {
				await client.click();
				await client.fill(EVENT.client);
				await page.getByRole('option', { name: new RegExp(`Add.*${EVENT.client}`) }).click();
				const email = page.getByLabel('Client email');
				if (await email.count()) await email.fill(EVENT.email);
			}
			// Staff, rentals and a service fee go on top of the food, so the offer
			// reads like a wedding's, not a drop-off's.
			await chargeLine(page, '+ Staff', 'Service staff', { People: EVENT.staff.people, 'Hours each': EVENT.staff.hours, 'Unit price ($)': EVENT.staff.rate });
			// The offer prints people × hours as one count ("56 × $38.00"); the
			// film says what that count is, from what was entered here.
			manifest.staffPeople = EVENT.staff.people;
			manifest.staffHours = EVENT.staff.hours;
			await chargeLine(page, '+ Rentals', 'Plates, glassware and linens', { Quantity: EVENT.rentals.qty, 'Unit price ($)': EVENT.rentals.price });
			await chargeLine(page, '+ Service fee', 'Service fee', {}, async (sheet) => {
				await sheet.getByLabel('Service fee basis').click();
				await page.getByRole('option', { name: 'Percent of food' }).click();
				await sheet.getByLabel('Percent of food').fill(EVENT.serviceFeePct);
			});
			await page.waitForTimeout(2000);
			// A quarter down, read off the proposal total, to the nearest $50.
			const total = Number(
				(await page.getByText('PROPOSAL TOTAL', { exact: false }).locator('xpath=following::*[contains(., "$")][1]').first().innerText())
					.match(/\$([\d,]+\.\d{2})/)[1]
					.replace(/,/g, ''),
			);
			const deposit = String(Math.round((total * 0.25) / 50) * 50);
			console.log('proposal total before tax', total, 'deposit', deposit);
			await page.getByLabel('A deposit, then the balance').check({ force: true });
			await page.getByLabel('A fixed amount').check({ force: true });
			await page.getByLabel('Deposit dollars').fill(deposit);
			await page.getByLabel('In one payment').check({ force: true });
			await page.getByLabel('Balance due (days before the event)').fill(EVENT.balanceDaysBefore);
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
		await page.getByRole('list', { name: 'Offer tracking' }).waitFor({ timeout: 60_000 });
		const card = page.locator('main section').filter({ has: page.getByRole('heading', { name: 'Current offer' }) });
		const title = page.getByRole('heading', { level: 1, name: /^Waiting on / });
		// The header and the step rail only: the card's first line names the inbox
		// the offer went to, which on test is the owner's own (CLIENT_INBOX).
		const cardBox = await docBox(card);
		// From the step eyebrow above the title, below the breadcrumb.
		const top = (await docBox(title)).y - 42;
		const railStep = await docBox(page.locator('main').getByText('Booked', { exact: true }).last());
		const bottom = railStep.b + 30;
		const edit = await docBox(page.getByRole('link', { name: 'Edit proposal' }).or(page.getByRole('button', { name: 'Edit proposal' })).first());
		const right = Math.max(cardBox.r, edit.r) + 24;
		await shoot(page, 'proposal-sent-desktop', { x: cardBox.x - 24, y: top, width: right - cardBox.x + 24, height: bottom - top });
		manifest.offerTotal = (await card.innerText()).match(/\$[\d,]+\.\d{2}/)?.[0];
		await owner.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: APP });
		await page.getByRole('button', { name: 'Copy offer link' }).click();
		manifest.offerUrl = await page.evaluate(() => navigator.clipboard.readText());
		if (!/^https?:\/\//.test(manifest.offerUrl)) throw new Error(`Copy offer link gave "${manifest.offerUrl}"`);
		await saveManifest();
		console.log('offer link saved');
	},

	async accept() {
		if (!manifest.offerUrl) throw new Error('run the proposal step first');
		const client = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DPR, reducedMotion: 'reduce' });
		const cp = await client.newPage();
		await open(cp, manifest.offerUrl);
		const accept = cp.getByRole('button', { name: 'Accept proposal' }).last();
		await accept.waitFor({ timeout: 60_000 });
		// One phone screen with the price, the event, every line she pays for
		// (the menu, staff, rentals, the service fee) down to the total, and the
		// fixed Accept bar under it.
		const listBottom = (await docBox(cp.getByRole('region', { name: 'Proposal total' }))).b;
		const barTop = await accept.evaluate((el) => {
			let n = el;
			while (n.parentElement && !['fixed', 'sticky'].includes(getComputedStyle(n).position)) n = n.parentElement;
			return n.getBoundingClientRect().top;
		});
		await cp.setViewportSize({ width: 390, height: Math.round(listBottom + 20 + (844 - barTop)) });
		await cp.evaluate(() => window.scrollTo(0, 0));
		// The header carries the kitchen's own logo since develop f8ab8b79d (it was a
		// dashed "LOGO" box before); the FORBIDDEN guard still refuses that box.
		const banner = await bannerBottom(cp);
		await shoot(cp, 'proposal-mobile', { x: 0, y: banner, width: 390, height: cp.viewportSize().height - banner }, { fullPage: false });
		await cp.setViewportSize({ width: 390, height: 844 });
		await accept.click();
		await cp.getByLabel('Your full name').fill(EVENT.client);
		await cp.getByRole('button', { name: /^Accept for / }).click();
		await cp.getByRole('heading', { name: /accepted/i }).waitFor({ timeout: 60_000 });
		await client.close();
		console.log('accepted');
	},

	// The agreement from the accepted offer, sent for e-signature. Re-run once
	// both have signed, the frame is the signed contract ("2 of 2 signed"); the
	// DocuSeal signing page is never shot (RC-64).
	async agreement() {
		const eventUrl = await findEvent();
		if (!eventUrl) throw new Error('run the earlier steps first');
		await open(page, `${eventUrl}/agreement`);
		// DocuSeal mails the client signer a one-time code, so she signs from an
		// inbox the owner reads; NEW_REVISION re-sends a contract that went to
		// an address nobody can open.
		if (process.env.NEW_REVISION) {
			await page.getByRole('button', { name: 'Make a new revision' }).click();
			await page.waitForTimeout(3000);
		}
		const reviewName = /^Review (contract|the new revision)$/;
		const review = page.getByRole('button', { name: reviewName }).or(page.getByRole('link', { name: reviewName }));
		if (await review.count()) {
			const clientName = page.getByRole('textbox', { name: 'Client name' });
			if (!(await clientName.inputValue())) await clientName.fill(EVENT.client);
			const clientEmail = page.getByRole('textbox', { name: 'Client email' });
			await clientEmail.fill(process.env.CLIENT_INBOX ?? EVENT.email);
			await page.getByRole('textbox', { name: 'Name on the contract' }).fill(EVENT.kitchenSigner);
			await page.waitForTimeout(1500);
			await review.first().click();
			await page.waitForLoadState('load');
			await page.waitForTimeout(2500);
			if (process.env.DUMP) {
				console.log(page.url(), await page.locator('main').innerText());
				console.log((await page.getByRole('button').allInnerTexts()).join(' | '));
				return;
			}
			await page.getByRole('button', { name: 'Approve and send' }).last().click();
			await page.waitForURL(/\/(agreement|contract\/signing)/, { timeout: 60_000 });
			await page.waitForTimeout(2500);
		}
		await open(page, `${eventUrl}/agreement`);
		const title = page.getByRole('heading', { level: 1, name: 'Agreement' });
		const action = /^(Manage signatures|View signed contract)$/;
		const card = page.locator('main section, main div').filter({ hasText: 'Current contract' }).filter({ has: page.getByRole('link', { name: action }).or(page.getByRole('button', { name: action })) }).last();
		const box = await union([title, card, page.getByRole('heading', { name: 'Revisions' })], 24);
		await shoot(page, 'agreement-desktop', { x: box.x, y: box.y - 40, width: box.width, height: box.height + 40 });
	},

	// The deposit the agreement names, asked for by card: the client gets an
	// emailed link. Frames: the ask on the event, and the pay page on her phone
	// before she pays (the card itself is typed by hand, never by this script).
	async deposit() {
		const eventUrl = await findEvent();
		if (!eventUrl) throw new Error('run the earlier steps first');
		await open(page, eventUrl);
		const draft = page.getByRole('region', { name: 'Kitchen draft', exact: true });
		const prepare = page.getByRole('button', { name: 'Prepare the kitchen draft', exact: true });
		if (await prepare.count()) {
			await prepare.click();
			await draft.getByText('It is tentative', { exact: false }).waitFor({ timeout: 60_000 });
			await open(page, eventUrl);
		}
		const pay = page.locator('#event-payments');
		if (await pay.getByLabel('A card, by email').count()) {
			await pay.getByLabel('A card, by email').check();
			await pay.getByRole('button', { name: 'Ask for a deposit' }).click();
			await page.waitForTimeout(6000);
			await open(page, eventUrl);
		}
		// What was asked for and what came in. The rows below say whether each
		// link was emailed, and test emails only approved addresses.
		manifest.deposit = (await pay.innerText()).match(/Asked for\s*(\$[\d,]+\.\d{2})/)?.[1];
		const payBox = await docBox(pay);
		const asked = await docBox(pay.getByText(/^(Nothing received yet|Paid in full|Received)/).last());
		await shoot(page, 'payment-request-desktop', { x: payBox.x - 24, y: payBox.y - 24, width: payBox.r - payBox.x + 48, height: asked.b - payBox.y + 48 });
		manifest.orderHref = await page.locator('main a[href^="/orders/"]').first().getAttribute('href');
		await open(page, `${manifest.orderHref}?tab=money`);
		await owner.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: APP });
		await page.getByRole('button', { name: 'Copy pay link' }).first().click();
		await page.waitForTimeout(1500);
		manifest.payUrl = await page.evaluate(() => navigator.clipboard.readText());
		if (!/^https:\/\//.test(manifest.payUrl)) throw new Error(`Copy pay link gave "${manifest.payUrl}"`);
		await saveManifest();
		const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DPR, reducedMotion: 'reduce' });
		const p = await phone.newPage();
		await open(p, manifest.payUrl);
		await p.waitForTimeout(3000);
		// The pay card: who has her date, the figure, and the one button.
		const card = await union([p.getByText(/has your date/).first(), p.getByRole('button', { name: /^Pay \$/ }).first()], 40);
		await shoot(p, 'pay-mobile', { x: 0, y: Math.max(card.y, await bannerBottom(p)), width: 390, height: card.height });
		await phone.close();
		console.log('pay link saved; the deposit is paid by hand from it');
	},

	// After she pays from the link: the Payments card on the kitchen draft, with
	// the balance's own reminder date.
	async paid() {
		if (!manifest.orderHref) throw new Error('run the deposit step first');
		await open(page, `${manifest.orderHref}?tab=money`);
		const card = page.locator('main section, main div').filter({ has: page.getByRole('heading', { name: 'Payments', exact: true }) }).filter({ hasText: 'Reminder with a pay link' }).last();
		const text = (await card.innerText()).replace(/\s+/g, ' ');
		if (!/Deposit Paid by card/.test(text)) throw new Error(`the deposit is not paid yet: ${text.slice(0, 200)}`);
		manifest.depositPaid = text.match(/\$([\d,]+\.\d{2}) paid of/)?.[0].replace(' paid of', '');
		manifest.balanceReminderLine = text.match(/Reminder with a pay link goes out [^.]+\./)?.[0];
		manifest.balanceDue = text.match(/(\$[\d,]+\.\d{2}) due /)?.[1];
		await saveManifest();
		// The deposit and balance rows: paid by card, and the balance's own
		// reminder date. The card's head names the inbox payment requests go to,
		// which on test is the owner's own, so the clip starts at the rows.
		const cardBox = await docBox(card);
		const top = (await docBox(card.getByText('Deposit', { exact: true }).first())).y - 24;
		const bottom = (await docBox(card.getByText(/^Due dates are part of what the client agreed to/).first())).b + 24;
		await shoot(page, 'payments-paid-desktop', { x: cardBox.x, y: top, width: cardBox.r - cardBox.x, height: bottom - top });
		console.log('paid', manifest.depositPaid, '|', manifest.balanceReminderLine);
	},

	// Book the event with every requirement met: signed by both, the deposit
	// paid, a day with room. No override, no reason typed.
	async book() {
		const eventUrl = await findEvent();
		if (!eventUrl) throw new Error('run the earlier steps first');
		await open(page, eventUrl);
		const book = page.locator('#book-event');
		const bookIt = book.getByRole('button', { name: 'Book the event', exact: true });
		if (await bookIt.count()) {
			const box = await union([book], 16);
			await shoot(page, 'book-event-desktop', box);
			await bookIt.click();
			await page.getByText('Event booked').first().waitFor({ timeout: 60_000 });
		} else if (await book.getByRole('button', { name: 'Book anyway' }).count()) {
			throw new Error(`booking still needs something: ${(await book.innerText()).replace(/\s+/g, ' ').slice(0, 300)}`);
		}
		await open(page, eventUrl);
		const next = page.locator('main section, main div').filter({ hasText: /^NEXT STEP/i }).filter({ hasText: 'Event booked' }).last();
		// From the step rail down: the chips above print the time on a 24-hour
		// clock ("17:00–22:00") where the offer said "5:00 PM" (an app defect,
		// reported), and the rail and the card say Booked on their own.
		const rail = page.getByText('You are here').first().locator('xpath=ancestor::*[.//*[contains(text(),"Inquiry")]][1]');
		const box = await union([rail, next], 24);
		const wide = await docBox(page.locator('.event-workspace').first());
		await shoot(page, 'booked-desktop', { x: wide.x - 24, y: box.y, width: wide.r - wide.x + 48, height: box.height });
		manifest.orderHref = await page.locator('main a[href^="/orders/"]').first().getAttribute('href');
		manifest.eventDate = (await page.locator('main').first().innerText()).match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun), [A-Z][a-z]{2} \d{1,2}, \d{4}/)?.[0];
		await saveManifest();
		console.log('booked; order', manifest.orderHref, manifest.eventDate);
	},

	// Confirm order waits on two real checks: allergens reviewed on every dish
	// and guest restrictions declared. Each ingredient is answered for the US
	// nine by what it is (dairy contains milk, flour contains wheat, ...), every
	// answer is printed for the owner to check, and nothing is left "Not sure".
	async allergens() {
		if (!manifest.orderHref) throw new Error('run the book step first');
		const CONTAINS = [
			['Milk', /cream|butter|milk|cheese|parmesan|goat|feta|yogurt|yoghurt|mascarpone|ricotta|cr[eè]me|ghee/i],
			['Wheat', /flour|bread|focaccia|pasta|panko|crouton|wheat|semolina/i],
			['Egg', /\begg|mayonnaise|aioli/i],
			['Fish', /anchov|fish|salmon|tuna|cod|worcestershire/i],
			['Soy', /\bsoy|tamari|tofu|edamame|miso/i],
			['Tree nuts', /almond|walnut|pistachio|hazelnut|pecan|cashew|pine nut/i],
			['Sesame', /sesame|tahini/i],
			['Crustacean shellfish', /shrimp|crab|lobster|prawn|crawfish/i],
			['Peanuts', /peanut/i]
		];
		const answered = [];
		for (let round = 0; round < 12; round += 1) {
			await open(page, `${manifest.orderHref}?tab=shop`);
			const review = page.getByLabel('Before you confirm').getByRole('link', { name: /^Review allergens/ });
			if (!(await review.count())) break;
			await open(page, await review.getAttribute('href'));
			await page.getByRole('link', { name: /^Allergens/ }).or(page.getByRole('tab', { name: /^Allergens/ })).first().click();
			await page.waitForTimeout(1500);
			const todo = page.locator('button[aria-label$="allergens: Not reviewed"]');
			while (await todo.count()) {
				const label = await todo.first().getAttribute('aria-label');
				const ingredient = label.replace(/, allergens: Not reviewed$/, '');
				await todo.first().click();
				await page.getByText('Answers update every recipe using this ingredient.').waitFor();
				const answers = {};
				for (const [allergen, pattern] of CONTAINS) {
					const value = pattern.test(ingredient) ? 'Contains' : 'Free from';
					await page.getByRole('combobox', { name: allergen, exact: true }).click();
					await page.getByRole('option', { name: value, exact: true }).click();
					if (value === 'Contains') answers[allergen] = value;
				}
				// A "Free from" answer must say what it rests on.
				const evidence = page.getByLabel('Label or supplier evidence');
				if (await evidence.count()) await evidence.fill('Kitchen review of the ingredient as bought.');
				await page.getByRole('button', { name: 'Confirm answer' }).click();
				await page.getByText('Answers update every recipe using this ingredient.').waitFor({ state: 'hidden', timeout: 30_000 });
				answered.push(`${ingredient}: ${Object.keys(answers).length ? 'contains ' + Object.keys(answers).join(', ') : 'free of the nine'}`);
				await page.waitForTimeout(500);
			}
		}
		await open(page, `${manifest.orderHref}?tab=shop`);
		const none = page.getByRole('button', { name: 'Mark guest restrictions: None declared' });
		if (await none.count()) await none.click();
		await page.waitForTimeout(1500);
		console.log(answered.join('\n'));
		console.log((await page.getByLabel('Before you confirm').innerText()).replace(/\s+/g, ' ').slice(0, 300));
	},

	// Buying: the dialog that fans the order out by supplier, then send. Locally
	// the supplier emails land in this walk's own Mailpit, never a real inbox.
	async buy() {
		if (!manifest.orderHref) throw new Error('run the book step first');
		await open(page, `${manifest.orderHref}?tab=shop`);
		const send = page.getByRole('button', { name: /^Send \d+ emails?/ }).first();
		if (!(await send.count())) return console.log('already sent to suppliers');
		await send.click();
		const dialog = page.getByRole('dialog').filter({ hasText: 'Send these supplier orders?' });
		await dialog.waitFor({ timeout: 30_000 });
		await page.waitForTimeout(700);
		const b = await dialog.boundingBox();
		// Clipped to the dialog itself: the dimmed page behind it stays out.
		await shoot(page, 'po-desktop', { x: b.x, y: b.y, width: b.width, height: b.height }, { fullPage: false });
		await dialog.getByRole('button', { name: /^Send \d+ emails?/ }).click();
		await dialog.waitFor({ state: 'hidden', timeout: 60_000 });
		console.log('sent to suppliers');
	},

	// The truck: Baldor's lines checked in, arugula one case short, so the
	// frame shows a real "Still to get".
	async receive() {
		if (!manifest.orderHref) throw new Error('run the book step first');
		await open(page, `${manifest.orderHref}/receiving`);
		const baldor = page.locator('main section, main div').filter({ has: page.getByText('Baldor contact and purchasing details') }).filter({ has: page.getByRole('button', { name: 'All of Arugula is here' }) }).last();
		const arugulaRow = baldor.locator('li, div').filter({ has: page.getByRole('button', { name: 'All of Arugula is here' }) }).last();
		if (await arugulaRow.getByRole('button', { name: 'Fewer came' }).count()) {
			await arugulaRow.getByRole('button', { name: 'Fewer came' }).click();
			await page.getByLabel(/How many came/).first().fill('3');
			await page.getByLabel(/Invoice total for this item/).first().fill('61.74');
			await page.getByLabel(/Receiving note/).first().fill('One case short on the truck.');
			await page.getByRole('button', { name: /^Save: fewer came/ }).first().click();
			await page.waitForTimeout(2500);
		}
		// Every other line on every truck came in whole.
		const others = page.getByRole('button', { name: /^All of (?!Arugula).+ is here$/ });
		for (let n = 0; n < 60 && (await others.count()) > 0; n += 1) {
			await others.first().click();
			await page.waitForTimeout(1200);
		}
		await open(page, `${manifest.orderHref}/receiving`);
		// From "Your orders to vendors" down: the header above prints the event's
		// date, which reads as the trucks arriving on the wedding day.
		const vendors = page.getByText('Your orders to vendors').first().locator('xpath=..');
		const section = page.locator('main section, main div').filter({ has: page.getByText('Baldor contact and purchasing details') }).last();
		const box = await union([vendors, section], 24);
		await shoot(page, 'receiving-desktop', { x: box.x, y: box.y, width: box.width, height: Math.min(box.height, 1270) });
		// Finishing check-in posts what came and what it cost as purchases: the
		// closeout's "at what you paid" reads from them.
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
		if (!manifest.orderHref) throw new Error('run the book step first');
		for (const [path, name] of [['prep', 'prep-desktop'], ['pack', 'pack-desktop']]) {
			await open(page, `${manifest.orderHref}/${path}`);
			const title = page.getByRole('heading', { level: 1 });
			await title.waitFor({ timeout: 60_000 });
			if (path === 'pack') {
				// The dishes card only: the pack page's "Load out" block stays out of
				// shipped frames (capture brief).
				const dishes = page.locator('main section, main div').filter({ has: page.getByRole('heading', { name: /^Dishes/ }) }).filter({ hasText: 'Lemon Posset' }).filter({ hasNot: page.getByRole('heading', { name: /^(Load out|Equipment)/ }) }).last();
				// Plates per dish, as the pack list counts them, for the captions.
				const packText = (await dishes.innerText()).replace(/\s+/g, ' ');
				manifest.mainPortions = packText.match(/Braised Short Rib\b\D*?(\d+)\b/)?.[1];
				manifest.vegetarianPortions = packText.match(/Stuffed Pepper, Rice and Feta\b\D*?(\d+)\b/)?.[1];
				if (!manifest.mainPortions || !manifest.vegetarianPortions) throw new Error(`pack list counts not found: ${packText.slice(0, 300)}`);
				await saveManifest();
				const box = await union([title, dishes], 24);
				const from = Math.max(box.y - 40, (await bannerBottom(page)) + 8);
				await shoot(page, name, { x: box.x, y: from, width: box.width, height: Math.min(box.y + box.height - from, 1000) });
				continue;
			}
			// The steps, from the last make-first base to the vegetarian main: the
			// portions per dish (138 short rib, 12 peppers). The header's date is
			// the event's, which reads as delivering and braising on the day, and
			// the first two bases count celery in fractional "each" (an app
			// defect, reported), so both stay out.
			const rows = page.locator('main').getByText(/^\d+ · .+· \d+ portions/);
			const firstRow = rows.first();
			const lastRow = rows.last();
			await firstRow.waitFor({ timeout: 60_000 });
			const base = page.locator('main section, main div, main article, main li').filter({ has: page.getByText('Make first', { exact: false }) }).filter({ hasText: 'Whipped Goat Cheese Spread' }).filter({ hasNotText: 'Mirepoix Base' }).last();
			const box = await union([base, lastRow.locator('xpath=..')], 24);
			if (box.y < (await bannerBottom(page))) throw new Error('prep clip runs under the test banner');
			await shoot(page, name, box);
		}
	},

	// The shop list: the first supplier groups, whole packs. Read-only, so it
	// re-shoots after Confirm (quantities are frozen, the account's display
	// units still apply).
	async shop() {
		if (!manifest.orderHref) throw new Error('run the book step first');
		await open(page, `${manifest.orderHref}?tab=shop`);
		const head = page.locator('.group-head').first();
		await head.waitFor({ timeout: 60_000 });
		const box = await union([page.getByRole('table', { name: 'Ingredients grouped by supplier' }).locator('[role="row"]').first(), page.locator('[role="rowgroup"]').nth(1)], 16);
		await shoot(page, 'shop-desktop', box);
	},

	async kitchen() {
		if (!manifest.orderHref) throw new Error('run the book step first');
		await STEPS.shop();
		await open(page, `${manifest.orderHref}?tab=shop`);
		// Confirm order: the dialog, then confirm.
		await page.getByRole('button', { name: /^Confirm( order)?$/ }).first().click();
		const dialog = page.getByRole('alertdialog');
		await dialog.waitFor({ timeout: 30_000 });
		await page.waitForTimeout(700);
		const b = await dialog.boundingBox();
		await shoot(page, 'confirm-desktop', { x: b.x - 24, y: b.y - 24, width: b.width + 48, height: b.height + 48 }, { fullPage: false });
		await dialog.getByRole('button', { name: /^Confirm( order)?$/ }).click();
		await dialog.waitFor({ state: 'hidden', timeout: 30_000 });
		console.log('confirmed');
	},

	// The food-cost closeout opens the day after the event, so the app runs with
	// its server clock on that day (scripts/shift-clock.mjs). The card still says
	// "likely" until the kitchen records what it used, and the frame keeps it.
	async closeout() {
		if (!manifest.orderHref) throw new Error('run the book step first');
		await open(page, `${manifest.orderHref}/closeout`);
		const title = page.getByRole('heading', { level: 1, name: 'Food-cost closeout' });
		await title.waitFor({ timeout: 60_000 });
		const card = page
			.locator('main section, main div')
			.filter({ has: page.getByRole('heading', { name: 'Planned vs actual food cost' }) })
			.filter({ hasText: /(Over|Under) plan by/ })
			.filter({ hasNot: page.getByRole('heading', { name: 'Before you close' }) })
			.last();
		const text = (await card.innerText()).replace(/\s+/g, ' ');
		const figure = (label) => {
			const m = text.match(new RegExp(`${label}\\s*(\\$[\\d,]+\\.\\d{2}|[\\d.]+%)`));
			if (!m) throw new Error(`closeout card has no "${label}" figure: ${text.slice(0, 300)}`);
			return m[1];
		};
		manifest.closeoutPlanned = figure('Planned food cost');
		manifest.closeoutActual = figure('Actual food cost, at what you paid');
		// Over or under, as the card says it; the film quotes whichever it is.
		manifest.closeoutDirection = /Under plan by/.test(text) ? 'under' : 'over';
		manifest.closeoutOver = figure('(?:Over|Under) plan by');
		// "(likely)" only while some amounts still come from the plan; once the
		// kitchen's use is recorded and the review closed, the share is final.
		manifest.closeoutPct = figure('Food cost, share of the event price(?: \\(likely\\))?');
		manifest.closeoutFinal = !/\(likely\)/.test(text);
		// Down to the four figures. The card's last line ("You planned to buy ...
		// in full packs") prints a pack total that disagrees with the Shop tab on
		// the same order (an app defect, reported), so the clip ends above it.
		// From the title, with its Closed badge, down to the four figures. (At
		// 9a15fe297 the subtitle printed an ISO date, so the clip started at the
		// card; develop d3c7c9add prints "Sat, Jun 12, 2027".)
		const box = await union([title, card], 24);
		const figures = await docBox(card.getByText('Food cost, share of the event price', { exact: false }).locator('xpath=..'));
		await shoot(page, 'closeout-desktop', { x: box.x, y: box.y - 40, width: box.width, height: figures.b + 14 - (box.y - 40) });
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
}

// Captures the homepage's frames (public/proof/home/) from LOCAL DEVELOP,
// kitchen-brain 7a7e407d9 (owner, 2026-10-07: "local develop latest"), all on
// the one wedding the page tells: Nair & Castellano, Sat Dec 19, 150 guests at
// $95.00, $3,500.00 deposit, balance $10,750.00 due Wed Dec 9.
// Notes per frame: docs/proof/home-manifest.json. Story:
// docs/stories/homepage-redesign-2026-10.story.md
//
//   PHASE=yield  APP=http://localhost:4188 node scripts/capture-home-proof.mjs
//   PHASE=walk   APP=http://localhost:4188 node scripts/capture-home-proof.mjs
//   PHASE=keyed  APP=http://localhost:4193 ORDERING=http://localhost:4194 \
//                node scripts/capture-home-proof.mjs
//
// THREE SOURCES, ONE CODEBASE (all 7a7e407d9):
//   yield  the events world on :4188 after capture-proof.mjs restated the
//          Greek Salad's Roma tomato in ounces (US customary display units).
//          Run before `walk`, which re-seeds that world.
//   walk   a FRESH demo world on :4188 (re-seed as capture-events-proof.mjs
//          says): the inquiry and the client's offer on a phone, before she
//          accepts. Nothing here is irreversible except sending the offer.
//   keyed  the Dec 19 wedding world first walked on e00299078 (order #784, the
//          deposit paid by Stripe TEST card 4242 through the client's link),
//          copied and migrated to 7a7e407d9 and served with Stripe test keys
//          and the Google reader by a script the owner runs (the keys never
//          pass through this one). Card payment, Sage and the import reader
//          need those keys; a keyless world cannot show them. Nothing is
//          written in this phase: the Confirm dialog is opened and cancelled.
//
// Rules kept from capture-events-proof.mjs: deviceScaleFactor 2, desktop 1440
// and phone 390 CSS px, element-bounded clips, mouse parked, focus blurred,
// animations off, caret hidden, fonts loaded, toasts removed, and every clip's
// text checked against FORBIDDEN. Each frame prints its PNG pixels (the `px`
// in src/lib/home.ts) and, where the rail rings a figure, the ring in percent
// of the PNG (the `focus` there).
//
// Considered Template Method (a phase skeleton with per-frame hooks); not
// used because each phase is a short straight walk against a different world
// and the frames share only the clip helper. Plain code, one helper set.
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const PHASE = process.env.PHASE;
if (!['yield', 'walk', 'keyed'].includes(PHASE)) throw new Error('PHASE=yield | walk | keyed (see header)');
const APP = process.env.APP ?? (PHASE === 'keyed' ? 'http://localhost:4193' : 'http://localhost:4188');
const ORDERING = process.env.ORDERING ?? 'http://localhost:4194';
const KB_DIR = process.env.KB_DIR ?? '/home/rayan147/kitchen-brain-develop-demo';
const CHROME_PATH = process.env.CHROME_PATH ?? '/usr/bin/google-chrome';
const ONLY = process.env.ONLY ? new Set(process.env.ONLY.split(',')) : null;
const want = (name) => !ONLY || ONLY.has(name);

const { chromium } = await import(pathToFileURL(resolve(KB_DIR, 'node_modules/playwright/index.mjs')).href);
const OUT = resolve(import.meta.dirname, '../public/proof/home');
const OWNER = 'marisol@example.com';

const EVENT = {
	client: 'Priya Nair',
	phone: '(207) 555-0187',
	email: 'priya.nair@example.com',
	name: 'Nair & Castellano wedding',
	guests: '150',
	menu: 'Wedding Plated Dinner',
	date: '2026-12-19',
	start: '17:00',
	end: '22:00',
	terms: 'Please send dietary needs and allergies with the final count.',
	deposit: '3500',
	balanceDays: '10',
	// keyed world: the wedding's order and event (manifest).
	order: 784,
	eventId: 'd240353e-66b2-4067-b979-0e6c155c6835'
};

const FORBIDDEN = [/Load out/i, /Kitchen Brain/i, /Test (environment|site|mode)/i, /Maple & Main/, /\bE2E\b/, /Square/, /QuickBooks/i, /Probe/, /\bQA\b/, /Coming/i, /\bbeta\b/i, /Preview only/i, /fixture/i, /localhost/i];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'] });
const DESKTOP = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' };
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce', isMobile: true, hasTouch: true };
// The homepage's wide frames are shot at the width they are shown at. On a
// 1440 screen each sits in a column 440 to 550px wide; shot at 1440 they drew
// the app's 14px text at 6 to 8px (readability review 2026-10-09). At 600 the
// app reflows to its narrow layout, so the same screen fits the column whole.
const SLOT = { viewport: { width: Number(process.env.SLOT_W ?? 600), height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' };
const hideStuck = (p) => p.evaluate(() => { for (const e of document.querySelectorAll('*')) { const cs = getComputedStyle(e); if (cs.position === 'fixed' || cs.position === 'sticky') e.style.visibility = 'hidden'; } });

async function settle(page) {
	await page.waitForLoadState('load');
	await page.mouse.move(0, 0).catch(() => {});
	await page.evaluate(() => {
		document.activeElement instanceof HTMLElement && document.activeElement.blur();
		for (const t of document.querySelectorAll('[data-sonner-toaster], [data-ui-role="toast"], .toast')) t.remove();
		return document.fonts.ready;
	});
	await page.waitForTimeout(600);
}

async function textIn(page, clip, fullPage) {
	return page.evaluate(
		({ clip, fullPage }) => {
			const sx = fullPage ? window.scrollX : 0;
			const sy = fullPage ? window.scrollY : 0;
			const parts = [];
			const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
			for (let n = walker.nextNode(); n; n = walker.nextNode()) {
				const text = n.textContent.trim();
				if (!text || !n.parentElement) continue;
				const style = getComputedStyle(n.parentElement);
				if (style.visibility === 'hidden' || style.display === 'none') continue;
				const range = document.createRange();
				range.selectNodeContents(n);
				for (const r of range.getClientRects()) {
					const x = r.left + sx;
					const y = r.top + sy;
					if (r.width && x < clip.x + clip.width && x + r.width > clip.x && y < clip.y + clip.height && y + r.height > clip.y) {
						parts.push(text);
						break;
					}
				}
			}
			return parts.join(' | ');
		},
		{ clip, fullPage }
	);
}

/** One clip; document coordinates when fullPage, viewport ones otherwise. Returns the clip used. */
async function shoot(page, name, clip, { fullPage = true } = {}) {
	await settle(page);
	const box = { x: Math.max(0, Math.round(clip.x)), y: Math.max(0, Math.round(clip.y)), width: Math.round(clip.width), height: Math.round(clip.height) };
	const text = await textIn(page, box, fullPage);
	for (const bad of FORBIDDEN) if (bad.test(text)) throw new Error(`${name}: forbidden text ${bad} in frame: ${text.slice(0, 400)}`);
	await page.screenshot({ path: `${OUT}/${name}.png`, clip: box, fullPage, animations: 'disabled', caret: 'hide' });
	console.log(`captured ${name}  px [${box.width * 2}, ${box.height * 2}]`);
	console.log(`  text: ${text.slice(0, 700)}`);
	return box;
}

/** A ring around a locator, in percent of the frame (the rail's Focus). */
async function ring(label, locator, clip, pad = { x: 8, y: 6 }) {
	const q = await docBox(locator);
	const r = {
		x: +(((q.x - pad.x - clip.x) / clip.width) * 100).toFixed(1),
		y: +(((q.y - pad.y - clip.y) / clip.height) * 100).toFixed(1),
		w: +(((q.r - q.x + pad.x * 2) / clip.width) * 100).toFixed(1),
		h: +(((q.b - q.y + pad.y * 2) / clip.height) * 100).toFixed(1)
	};
	console.log(`  ring ${label}: ${JSON.stringify(r)}`);
}

async function docBox(locator) {
	return locator.first().evaluate((el) => {
		const r = el.getBoundingClientRect();
		return { x: r.left + window.scrollX, y: r.top + window.scrollY, r: r.right + window.scrollX, b: r.bottom + window.scrollY };
	});
}

async function hydrate(page) {
	await page.waitForLoadState('load');
	await page.waitForTimeout(2000);
}

async function signIn(ctx) {
	const page = await ctx.newPage();
	await page.goto(`${APP}/login`);
	await hydrate(page);
	await page.getByLabel('Email').fill(OWNER);
	await page.getByRole('button', { name: 'Send sign-in link' }).click();
	await page.getByRole('heading', { name: 'Check your email' }).waitFor({ timeout: 120000 });
	let link = null;
	for (let i = 0; i < 40 && !link; i += 1) {
		const r = await page.request.get(`${APP}/api/test/magic-link?email=${encodeURIComponent(OWNER)}`);
		if (r.ok()) link = (await r.json()).url;
		if (!link) await page.waitForTimeout(250);
	}
	if (!link) throw new Error('no magic link captured; start the app with MAGIC_LINK_TEST_CAPTURE=1');
	const u = new URL(link);
	await page.goto(`${APP}${u.pathname}${u.search}`);
	await page.waitForLoadState('load');
	await page.close();
}

async function openGreekSalad(page) {
	await page.goto(`${APP}/catalog/recipes`);
	await hydrate(page);
	await page.getByRole('searchbox').first().fill('Greek Salad');
	await page.waitForTimeout(1500);
	await page.goto(APP + (await page.getByRole('link', { name: /Greek Salad/ }).first().getAttribute('href')));
	await hydrate(page);
	await page.getByRole('heading', { name: 'Ingredients per portion' }).first().waitFor();
	await page.waitForTimeout(1500);
}

try {
	// ================================================================ yield
	if (PHASE === 'yield') {
		const desk = await browser.newContext(DESKTOP);
		await signIn(desk);
		if (want('yield-lines')) {
			const p = await desk.newPage();
			await openGreekSalad(p);
			const table = p.locator('table').filter({ hasText: 'Roma tomato' }).first();
			const t = await docBox(table);
			const feta = await docBox(p.getByRole('row', { name: /Feta/ }));
			const clip = await shoot(p, 'yield-lines', { x: t.x - 12, y: t.y - 12, width: t.r - t.x + 24, height: feta.b - t.y + 12 });
			await ring('roma row', p.getByRole('row', { name: /Roma tomato/ }), clip, { x: 0, y: 0 });
		}
		if (want('yield-lines-phone')) {
			const phone = await browser.newContext({ ...PHONE, storageState: await desk.storageState() });
			const p = await phone.newPage();
			await openGreekSalad(p);
			// Phones get one card per line (the table is desktop only).
			const card = p.locator('article').filter({ has: p.getByRole('heading', { name: 'Roma tomato', exact: true }) }).filter({ hasText: 'To buy' }).first();
			await card.scrollIntoViewIfNeeded();
			console.log('  phone card:', (await card.innerText()).replace(/\s+/g, ' ').slice(0, 200));
			const b = await docBox(card);
			await shoot(p, 'yield-lines-phone', { x: b.x - 2, y: b.y - 2, width: b.r - b.x + 4, height: b.b - b.y + 4 });
		}
	}

	// ================================================================ walk
	walk: if (PHASE === 'walk') {
		const ctx = await browser.newContext(PHONE);
		await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: APP });
		await signIn(ctx);
		const page = await ctx.newPage();
		// The inquiry on a phone screen (390 x 780), filled, then saved so the
		// walk can go on; the frame is taken before the save.
		await page.goto(`${APP}/events/new`);
		await hydrate(page);
		await page.getByRole('combobox', { name: 'Client' }).click();
		await page.getByRole('combobox', { name: 'Client' }).fill(EVENT.client);
		await page.getByRole('option', { name: /Add.*as new client/ }).click();
		await page.getByLabel('Phone or email').fill(EVENT.phone);
		await page.getByLabel('Event name', { exact: true }).fill(EVENT.name);
		await page.getByLabel('Date not decided yet').check();
		await page.getByLabel('Guests', { exact: true }).fill(EVENT.guests);
		// From the Client field to the estimate tick: who, how they reached you,
		// the event, no date yet, 150 guests as an estimate. The fixed action
		// bar is hidden for the clip; the frame is taken before the save.
		if (want('inquiry-mobile')) {
			const estimate = page.getByLabel('This is an estimate');
			if (!(await estimate.isChecked())) await estimate.check();
			await page.evaluate(() => { for (const e of document.querySelectorAll('*')) { const cs = getComputedStyle(e); if (cs.position === 'fixed' || cs.position === 'sticky') e.dataset.capHidden = '1', (e.style.visibility = 'hidden'); } });
			const top = await docBox(page.getByText('Client', { exact: true }));
			const end = await docBox(estimate.locator('xpath=ancestor::label[1]'));
			const clip = await shoot(page, 'inquiry-mobile', { x: 0, y: top.y - 12, width: 390, height: end.b - top.y + 36 });
			await ring('client', page.getByRole('combobox', { name: 'Client' }), clip);
			await ring('guests', page.getByLabel('Guests', { exact: true }).locator('xpath=ancestor::*[.//button][1]'), clip);
			await page.evaluate(() => { for (const e of document.querySelectorAll('[data-cap-hidden]')) e.style.visibility = ''; });
		}
		if (!want('proposal-mobile')) break walk;
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.getByRole('button', { name: 'Save and build menu', exact: true }).click();
		await page.waitForURL(/\/events\/[0-9a-f-]+\/menu$/);
		const eventUrl = page.url().replace(/\/menu$/, '');
		await hydrate(page);
		await page.getByRole('searchbox', { name: 'Search menus or dishes' }).fill(EVENT.menu);
		await page.waitForTimeout(800);
		await page.getByRole('button', { name: 'Use menu' }).first().click();
		await page.getByRole('heading', { name: 'Menu & service' }).waitFor();
		await page.getByText('All changes saved').waitFor();
		await page.goto(eventUrl);
		await hydrate(page);
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
		{
			const r = await page.request.post(`${eventUrl}?/setDate`, { headers: { origin: APP }, form: { serviceDate: EVENT.date } });
			if (!r.ok()) throw new Error(`setDate refused: ${r.status()}`);
		}
		await page.goto(`${eventUrl}/proposal`);
		await hydrate(page);
		if (await page.getByLabel('Client email').count()) {
			await page.getByLabel('Client email').fill(EVENT.email);
			await page.getByLabel('Client email').blur();
		}
		await page.getByRole('status').filter({ hasText: 'Saved' }).first().waitFor();
		await page.waitForTimeout(800);
		if (!(await page.getByRole('button', { name: 'Save these terms' }).count())) await page.getByRole('button', { name: /^Terms (Add|Edit)/ }).click();
		{
			const terms = page.getByRole('region', { name: 'Terms on the proposal' });
			await terms.getByText('A deposit, then the balance', { exact: true }).click();
			await terms.getByText('A fixed amount', { exact: false }).first().click();
			await terms.getByLabel('Deposit dollars').fill(EVENT.deposit);
			await terms.getByLabel('Balance due (days before the event)').fill(EVENT.balanceDays);
			await terms.getByLabel('Anything else the client should know · optional').fill(EVENT.terms);
			await terms.getByRole('button', { name: 'Save these terms' }).click();
			await page.waitForTimeout(1500);
		}
		await page.getByRole('button', { name: 'Preview & send' }).click();
		await page.waitForURL(/\/proposal\/send\?revision=/);
		await hydrate(page);
		await page.getByRole('button', { name: /^Send offer( to |$)/ }).first().click();
		await page.waitForURL(/\/decision/);
		await hydrate(page);
		await page.getByRole('button', { name: 'Copy offer link' }).click();
		const offerUrl = await page.evaluate(() => navigator.clipboard.readText());
		if (!/^https?:\/\//.test(offerUrl)) throw new Error(`Copy offer link gave "${offerUrl}"`);
		// The client's phone: no sign-in, one screen, the Accept bar fixed below.
		if (want('proposal-mobile')) {
			const client = await browser.newContext({ ...PHONE, viewport: { width: 390, height: 780 } });
			const cp = await client.newPage();
			await cp.goto(offerUrl);
			await hydrate(cp);
			await cp.getByRole('button', { name: 'Accept proposal' }).last().waitFor();
			const clip = await shoot(cp, 'proposal-mobile', { x: 0, y: 0, width: 390, height: 780 }, { fullPage: false });
			const total = cp.getByText('Total for your event', { exact: false }).first().locator('xpath=..');
			const b = await total.boundingBox();
			console.log(`  ring total: ${JSON.stringify({ x: +(((b.x - 8) / clip.width) * 100).toFixed(1), y: +(((b.y - 8) / clip.height) * 100).toFixed(1), w: +(((b.width + 16) / clip.width) * 100).toFixed(1), h: +(((b.height + 16) / clip.height) * 100).toFixed(1) })}`);
			await client.close();
		}
	}

	// ================================================================ keyed
	if (PHASE === 'keyed') {
		const desk = await browser.newContext(DESKTOP);
		await signIn(desk);
		const phone = await browser.newContext({ ...PHONE, storageState: await desk.storageState() });
		const slot = await browser.newContext({ ...SLOT, storageState: await desk.storageState() });
		const eventUrl = `${APP}/events/${EVENT.eventId}`;

		// The deposit block on the wedding: asked, received, the balance owed.
		for (const [name, ctx, pad] of [['payment-schedule', slot, 16], ['payment-schedule-phone', phone, 12]]) {
			if (!want(name)) continue;
			const p = await ctx.newPage();
			await p.goto(eventUrl);
			await hydrate(p);
			const box = p.locator('[data-ui-role="event-deposit"]').first();
			await box.waitFor();
			await hideStuck(p);
			const d = await docBox(box);
			const req = await docBox(box.getByRole('button', { name: /Request payment/ }));
			const clip = await shoot(p, name, { x: d.x - pad, y: d.y - pad, width: d.r - d.x + pad * 2, height: req.b - d.y + pad * 2 });
			await ring('received', box.locator('dl'), clip);
			await ring('owed', box.getByText(/\$10,750\.00 owed/), clip);
		}

		// Confirm order, opened and cancelled: the order stays a draft.
		if (want('confirm-dialog')) {
			const p = await desk.newPage();
			await p.goto(`${APP}/orders/${EVENT.order}`);
			await hydrate(p);
			await p.getByRole('button', { name: 'Confirm order' }).first().click();
			const dlg = p.getByRole('alertdialog');
			await dlg.getByText('Confirm order?', { exact: true }).waitFor();
			await p.waitForTimeout(700);
			const b = await dlg.boundingBox();
			const clip = await shoot(p, 'confirm-dialog', { x: b.x - 24, y: b.y - 24, width: b.width + 48, height: b.height + 48 }, { fullPage: false });
			const lock = dlg.getByText(/locks quantities and prices/).first();
			const lb = await lock.boundingBox();
			if (lb) console.log(`  ring lock: ${JSON.stringify({ x: +(((lb.x - 8 - clip.x) / clip.width) * 100).toFixed(1), y: +(((lb.y - 6 - clip.y) / clip.height) * 100).toFixed(1), w: +(((lb.width + 16) / clip.width) * 100).toFixed(1), h: +(((lb.height + 12) / clip.height) * 100).toFixed(1) })}`);
			await dlg.getByRole('button', { name: /Keep editing|Cancel/ }).first().click();
		}

		// The Shop tab on a phone: the first supplier, its rows, before the next.
		if (want('shop-list')) {
			const p = await phone.newPage();
			await p.goto(`${APP}/orders/${EVENT.order}?tab=shop`);
			await hydrate(p);
			const head = p.getByText('Highland Meats').first();
			const wide = (l) => l.evaluate((el) => { let n = el; while (n && n.getBoundingClientRect().width < 340) n = n.parentElement; const r = n.getBoundingClientRect(); return { y: r.top + scrollY }; });
			const top = (await wide(head)).y;
			const next = (await wide(p.getByText('Stone Mill Dairy').first())).y;
			await p.evaluate(() => { for (const e of document.querySelectorAll('*')) { const cs = getComputedStyle(e); if (cs.position === 'fixed' || cs.position === 'sticky') e.style.visibility = 'hidden'; } });
			await shoot(p, 'shop-list', { x: 0, y: top - 12, width: 390, height: next - top + 12 });
		}

		// The menu's Dishes per guest: the first four dishes.
		for (const [name, ctx] of [['food-cost-breakdown', slot], ['food-cost-breakdown-phone', phone]]) {
			if (!want(name)) continue;
			const p = await ctx.newPage();
			await p.goto(`${APP}/catalog/menus/9`);
			await hydrate(p);
			const sec = p.getByRole('heading', { name: 'Dishes, per guest' }).first().locator('xpath=ancestor::section[1]');
			const d = await docBox(sec);
			const groups = p.locator('[role=group][aria-label$="portions per guest"]:visible');
			console.log('  dishes', await groups.evaluateAll((gs) => gs.map((g) => g.getAttribute('aria-label'))));
			const g4 = await docBox(groups.nth(3));
			const g5 = await docBox(groups.nth(4));
			const bottom = Math.round(((g4.y + g4.b) / 2 + (g5.y + g5.b) / 2) / 2);
			if (ctx === slot) await hideStuck(p);
			const pad = ctx === slot ? 16 : 0;
			const x = ctx === slot ? d.x - pad : 0;
			const w = ctx === slot ? d.r - d.x + pad * 2 : 390;
			await shoot(p, name, { x, y: d.y - 16, width: w, height: bottom - d.y + 16 });
		}

		// The Pack tab's dishes, allergens on each, a Label button each.
		for (const [name, ctx] of [['allergens-labels', slot], ['allergens-labels-phone', phone]]) {
			if (!want(name)) continue;
			const p = await ctx.newPage();
			await p.goto(`${APP}/orders/${EVENT.order}?tab=pack`);
			await hydrate(p);
			await p.waitForTimeout(1500);
			const card = p.getByText('Lemon Posset', { exact: true }).first().locator('xpath=ancestor::*[count(.//button[normalize-space()="Label"])>=6][1]');
			const c = await docBox(card);
			await hideStuck(p);
			const pad = ctx === slot ? 16 : 0;
			await shoot(p, name, ctx === slot ? { x: c.x - pad, y: c.y - pad, width: c.r - c.x + pad * 2, height: c.b - c.y + pad * 2 } : { x: 0, y: c.y - 12, width: 390, height: c.b - c.y + 24 });
		}

		// The sample produce invoice's import review, rows collapsed.
		for (const [name, ctx] of [['import-review', slot], ['import-review-phone', phone]]) {
			if (!want(name)) continue;
			const p = await ctx.newPage();
			await p.goto(`${APP}/import/source/5`);
			await hydrate(p);
			for (const open of await p.locator('[aria-expanded="true"]').all()) {
				if (/Navel oranges|Micro herb|Lemons/.test((await open.textContent()) ?? '')) { await open.click(); await p.waitForTimeout(700); }
			}
			// The phone layout opens the first blocked row on load; close it by its name.
			for (let i = 0; i < 3 && (await p.getByText('Why this is blocked').first().isVisible().catch(() => false)); i++) {
				await p.getByText('Navel oranges', { exact: true }).first().click();
				await p.waitForTimeout(800);
			}
			const head = await docBox(p.getByText('Extracted products', { exact: true }));
			const last = p.getByText('Ready to create', { exact: true }).last();
			const bottom = await last.evaluate((e) => { let n = e; for (let i = 0; i < 6 && n.parentElement; i++) { n = n.parentElement; if (n.getBoundingClientRect().height > 60) break; } return n.getBoundingClientRect().bottom + scrollY; });
			const list = await docBox(p.getByText('Extracted products', { exact: true }).locator('xpath=ancestor::section[1]'));
			await p.evaluate(() => { for (const e of document.querySelectorAll('header, [data-sonner-toaster]')) e.style.visibility = 'hidden'; });
			await shoot(p, name, ctx === slot ? { x: list.x - 16, y: head.y - 16, width: list.r - list.x + 32, height: bottom - head.y + 24 } : { x: 0, y: head.y - 24, width: 390, height: bottom - head.y + 40 });
		}

		// The invoice inbox, newest two emails: Harbor Foods' HF-3102 and HF-3103
		// held from an address the kitchen has not approved, and HF-3106 from
		// its approved billing address waiting in review. The mail went in
		// through the app's own inbox code (scripts/inbox-fixture.ts and the
		// worker's sweepInbox, with the Google reader) before this run, by a
		// script the owner ran; this phase only reads the page.
		// Desktop at 600 wide since 2026-10-09 (SLOT): at 780 its 14px text drew at
		// 10px in the homepage card, and the card sat half the ordering card's
		// height. Before that, at 780 wide, not 1440: the homepage crops this card 6:5 from
		// the top left, and at 1440 the two cards run 2:1, so the dates and
		// HF-3106's Review link would fall outside it.
		for (const [name, ctx] of [['invoice-inbox', slot], ['invoice-inbox-phone', phone]]) {
			if (!want(name)) continue;
			const p = await ctx.newPage();
			await p.goto(`${APP}/purchases/inbox`);
			await hydrate(p);
			const card = (subject) => p.getByText(subject, { exact: true }).first().evaluate((el) => {
				let n = el;
				while (n.parentElement && !/(article|li)/i.test(n.tagName) && getComputedStyle(n).borderTopWidth === '0px') n = n.parentElement;
				const r = n.getBoundingClientRect();
				return { x: r.left + scrollX, y: r.top + scrollY, r: r.right + scrollX, b: r.bottom + scrollY };
			});
			const held = await card('Invoices HF-3102 and HF-3103');
			const waiting = await card('Invoice HF-3106');
			if (ctx === phone) await p.evaluate(() => { for (const e of document.querySelectorAll('*')) { const cs = getComputedStyle(e); if (cs.position === 'fixed' || cs.position === 'sticky') e.style.visibility = 'hidden'; } });
			await shoot(p, name, ctx === slot
				? { x: held.x - 12, y: held.y - 12, width: held.r - held.x + 24, height: waiting.b - held.y + 24 }
				: { x: 0, y: held.y - 12, width: 390, height: waiting.b - held.y + 24 });
		}

		// Online ordering, as a client meets it on the kitchen's own website: the
		// ordering widget (ordering.js, pasted verbatim from Settings >
		// Integrations > Ordering site > Put on your website) mounted in a plain
		// sample page for the sample kitchen (HOST, default http://127.0.0.1:4370,
		// scratchpad hostsite/index.html), whose origin was approved on that same
		// settings page. The frame runs from the site's own header to the end of
		// the first menu. The page around the widget is sample, the widget is the
		// app's.
		const HOST = process.env.HOST ?? 'http://127.0.0.1:4370/';
		for (const [name, opts] of [['ordering-site', SLOT], ['ordering-site-phone', PHONE]]) {
			if (!want(name)) continue;
			const ctx = await browser.newContext({ ...opts, viewport: { width: opts.viewport.width, height: 2600 } });
			const p = await ctx.newPage();
			await p.goto(HOST);
			const frameEl = p.locator('#order-here iframe');
			await frameEl.waitFor();
			const frame = p.frameLocator('#order-here iframe');
			await frame.getByText('$93.00 per guest', { exact: true }).waitFor({ timeout: 30000 });
			await p.waitForTimeout(2500);
			const f = await docBox(frameEl);
			const card = await frame.getByText('Coastal Dinner', { exact: true }).first().locator('xpath=ancestor::*[.//*[normalize-space()="Lemon Posset"]][1]').boundingBox();
			if (opts === PHONE) {
				const bottom = f.y + (card.y - (await frameEl.boundingBox()).y) + card.height + 24;
				await shoot(p, name, { x: 0, y: 0, width: opts.viewport.width, height: bottom });
			} else {
				// Desktop: the homepage card shows a 3:2 crop from the top left, so the
				// frame is the page's 1200px column cut at the Coastal Dinner row, the
				// figure the row's sentence carries.
				const row = await frame.getByText('$93.00 per guest', { exact: true }).boundingBox();
				const top = (await frameEl.boundingBox()).y;
				const main = await docBox(p.locator('main'));
				const bottom = f.y + (row.y - top) + row.height + 28;
				await shoot(p, name, { x: main.x, y: 0, width: main.r - main.x, height: bottom });
			}
			await ctx.close();
		}

		// The balance reminder the client gets, as sent: the app's own sweep run
		// as of Dec 6 (three days before the Dec 9 balance, develop's lead) into
		// local Mailpit (MAILPIT, default http://localhost:8191), rendered here.
		if (want('balance-reminder')) {
			const MAILPIT = process.env.MAILPIT ?? 'http://localhost:8191';
			const list = await (await fetch(`${MAILPIT}/api/v1/messages?limit=50`)).json();
			const hit = list.messages.find((m) => /balance is due/.test(m.Subject) && m.Subject.includes(EVENT.name));
			if (!hit) throw new Error('balance-reminder: no reminder in Mailpit; run the sweep first (manifest)');
			const msg = await (await fetch(`${MAILPIT}/api/v1/message/${hit.ID}`)).json();
			console.log(`  subject: ${hit.Subject}`);
			const ctx = await browser.newContext({ viewport: { width: 720, height: 900 }, deviceScaleFactor: 2 });
			const p = await ctx.newPage();
			await p.setContent(msg.HTML, { waitUntil: 'load' });
			await p.waitForTimeout(1500);
			const btn = await docBox(p.getByRole('link', { name: /pay/i }));
			const card = await docBox(p.locator('table[role=presentation] table'));
			await shoot(p, 'balance-reminder', { x: card.x - 12, y: card.y - 12, width: card.r - card.x + 24, height: btn.b - card.y + 36 });
			await ctx.close();
		}

		// Sage, opened from the sidebar on Events, asked about the wedding.
		if (want('sage-answer')) {
			const ctx = await browser.newContext({ ...DESKTOP, viewport: { width: 1440, height: 1000 }, storageState: await desk.storageState() });
			const p = await ctx.newPage();
			await p.goto(`${APP}/events`);
			await hydrate(p);
			await p.locator('[data-sidebar="sidebar"], [data-slot="sidebar"]').first().getByRole('button', { name: /^Sage/ }).first().click();
			await p.waitForTimeout(1500);
			const panel = p.locator('#sage-panel');
			const fresh = panel.getByRole('button', { name: /New (chat|conversation|question)/i });
			if (await fresh.count()) { await fresh.first().click(); await p.waitForTimeout(1000); }
			const QUESTION = 'What is still owed on the Nair & Castellano wedding on December 19, and when is it due?';
			await panel.getByRole('textbox').first().fill(QUESTION);
			await p.keyboard.press('Enter');
			await panel.getByText('You review it first.').last().waitFor({ timeout: 120000 });
			await p.waitForTimeout(2500);
			const all = await panel.innerText();
			const answer = all.slice(all.lastIndexOf(QUESTION));
			console.log('  sage answer:\n' + answer);
			// Read before use: a draft is not a confirmed or booked order.
			if (/confirmed|booked/i.test(answer)) throw new Error('sage-answer: the answer calls the draft confirmed or booked; ask again');
			const q = panel.getByText(QUESTION, { exact: true }).last();
			await q.scrollIntoViewIfNeeded();
			await panel.evaluate((el) => { for (const s of el.querySelectorAll('*')) { const cs = getComputedStyle(s); if (/(auto|scroll)/.test(cs.overflowY) && s.scrollHeight > s.clientHeight) s.scrollTop = 0; } });
			await p.waitForTimeout(500);
			const pb = await panel.boundingBox();
			const qb = await q.locator('xpath=..').boundingBox();
			// Cropped above the suggested-next-step card: its green button read
			// as the page's primary (design review 2026-10-07).
			const next = panel.getByText(/suggested next step/i).last();
			const end = (await next.count()) ? (await next.boundingBox()).y - 22 : (await panel.getByText('You review it first.').last().boundingBox()).y - 12;
			await shoot(p, 'sage-answer', { x: pb.x + 8, y: qb.y - 16, width: pb.width - 16, height: end - (qb.y - 16) }, { fullPage: false });
			await ctx.close();
		}
	}
} finally {
	await browser.close();
}

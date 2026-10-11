// Captures the step-by-step screenshots for the blog's how-to guides, from the
// running app. One walk per guide, chosen with GUIDE=<slug>.
// story: docs/stories/blog-catering-food-labels.story.md
//
//   APP=http://localhost:4188 GUIDE=catering-food-labels node scripts/capture-blog-guides.mjs
//
// THE APP. Local kitchen-brain develop 66d0703fe (the commit every guide's
// claims were read off on 2026-10-10), exported with `git archive`, seeded
// with `npm run demo:seed` and `npm run db:backfill:revisions`, renamed to
// Harbor & Hearth Catering with US customary units, and served on 4188 with
// FEATURE_LABEL_PRINTING_ENABLED=true and MAGIC_LINK_TEST_CAPTURE=1 (the
// recipe in capture-events-proof.mjs's header). Sample data only.
//
// THE FRAMES. Phone captures at 390 CSS px, device scale 2, named
// <step>-mobile.png so integrations/blog-figures.mjs shows each one at its own
// size at every width: a guide step is read on a phone, and a 1440 frame in
// the 44rem article column would draw the app's text at 7px.
//
// The walk writes the demo database through the UI (allergen answers, a
// printed label), so a second run starts from a re-seed.
//
// Pattern: none. Considered Template Method (one walk skeleton, per-guide
// steps); not used because each guide's walk is linear and shares only the
// sign-in and the clip helper, which are plain functions.
import { chromium } from '/home/rayan147/kitchen-brain/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const APP = process.env.APP ?? 'http://localhost:4188';
const GUIDE = process.env.GUIDE;
if (!GUIDE) throw new Error('GUIDE=<blog slug> is required');
const OUT = resolve(import.meta.dirname, `../public/proof/blog/${GUIDE}`);
mkdirSync(OUT, { recursive: true });
const OWNER = 'marisol@example.com';

const browser = await chromium.launch();

async function settle(page) {
	await page.evaluate(() => document.fonts.ready);
	await page.mouse.move(0, 0);
	await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
	await page.evaluate(() => document.querySelectorAll('[data-ui-role="toast"], .toast, [data-sonner-toaster]').forEach((n) => n.remove()));
	await page.waitForTimeout(400);
}

/** Clip the union of the given locators' boxes, padded, page-relative. */
async function shoot(page, name, locators, { pad = 12, top = pad, bottom = pad } = {}) {
	await settle(page);
	const boxes = [];
	for (const locator of locators) {
		await locator.first().scrollIntoViewIfNeeded();
		const box = await locator.first().evaluate((e) => {
			const r = e.getBoundingClientRect();
			return { x: r.left + scrollX, y: r.top + scrollY, r: r.right + scrollX, b: r.bottom + scrollY };
		});
		boxes.push(box);
	}
	// Fixed and sticky bars (the app header, a sticky action bar) float over a
	// full-page capture wherever the viewport ended; hide every one that is not
	// part of what is being framed.
	const targets = await Promise.all(locators.map((l) => l.first().elementHandle()));
	await page.evaluate((els) => {
		for (const n of document.querySelectorAll('body *')) {
			const pos = getComputedStyle(n).position;
			if (pos !== 'fixed' && pos !== 'sticky') continue;
			if (els.some((t) => t && (n.contains(t) || t.contains(n)))) continue;
			n.setAttribute('data-capture-float', n.style.visibility);
			n.style.visibility = 'hidden';
		}
	}, targets);
	const vw = page.viewportSize().width;
	const x0 = Math.max(0, Math.min(...boxes.map((b) => b.x)) - pad);
	const x1 = Math.min(vw, Math.max(...boxes.map((b) => b.r)) + pad);
	const y0 = Math.max(0, Math.min(...boxes.map((b) => b.y)) - top);
	const y1 = Math.max(...boxes.map((b) => b.b)) + bottom;
	await page.screenshot({
		path: `${OUT}/${name}.png`,
		fullPage: true,
		clip: { x: x0, y: y0, width: x1 - x0, height: y1 - y0 },
		animations: 'disabled',
		caret: 'hide'
	});
	await page.evaluate(() => {
		for (const n of document.querySelectorAll('[data-capture-float]')) {
			n.style.visibility = n.getAttribute('data-capture-float');
			n.removeAttribute('data-capture-float');
		}
	});
	console.log('wrote', name, Math.round(x1 - x0), 'x', Math.round(y1 - y0));
}

async function signedIn(width, email = OWNER) {
	const context = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
	const page = await context.newPage();
	await page.goto(`${APP}/login`);
	await page.getByLabel('Email').fill(email);
	await page.getByRole('button', { name: 'Send sign-in link' }).click();
	await page.getByRole('heading', { name: 'Check your email' }).waitFor();
	let link = null;
	for (let i = 0; i < 40 && !link; i++) {
		const r = await page.request.get(`${APP}/api/test/magic-link?email=${encodeURIComponent(email)}`);
		if (r.ok()) link = (await r.json()).url;
		if (!link) await page.waitForTimeout(250);
	}
	if (!link) throw new Error('no magic link captured; is MAGIC_LINK_TEST_CAPTURE=1 set?');
	const u = new URL(link);
	await page.goto(`${APP}${u.pathname}${u.search}`);
	await page.getByRole('main').first().waitFor();
	return { context, page };
}

/** Answer every allergen row on an ingredient's Allergens page, then save. */
async function answerAllergens(page, ingredientId, answers, shotName = null, shotRow = 'milk', note = 'Package label, read Oct 10') {
	await page.goto(`${APP}/ingredients/${ingredientId}/allergens`, { waitUntil: 'networkidle' });
	const names = await page.locator('input[type="radio"][name^="allergen-"]').evaluateAll((es) => [...new Set(es.map((e) => e.name))]);
	for (const name of names) {
		const value = answers[name.slice('allergen-'.length)] ?? 'free_from';
		// The input sits under its styled label; a DOM click sets it the way a tap does.
		const radio = page.locator(`input[type="radio"][name="${name}"][value="${value}"]`);
		await radio.evaluate((e) => e.click());
		if (!(await radio.isChecked())) throw new Error(`${name} did not take ${value}`);
	}
	// Already answered on an earlier run: nothing to save.
	if (!(await page.locator('.save-bar').count())) return;
	// Saving asks where the answer came from; the note is required.
	await page.locator('#evidence-note').fill(note);
	if (shotName) {
		const heading = page.getByRole('heading', { level: 1 });
		// The row from its heading to its Source line; the save bar floats over
		// the rows on a phone, so it is hidden for this frame and shot alone next.
		const milkRow = page.locator(`#answer-${shotRow}-contains`).locator('xpath=ancestor::*[.//*[starts-with(normalize-space(.), "Source")]][1]');
		await page.evaluate(() => document.querySelector('.save-bar')?.style.setProperty('visibility', 'hidden'));
		// Milk is the first rows down, so the page heading frames it; a row
		// further down (sesame) is shot on its own.
		// Other rows are folded away for this frame, so the page heading (which
		// names the ingredient) sits directly over the row the step is about.
		const hidden = await page.evaluate((keep) => {
			const rows = [...document.querySelectorAll('input[type="radio"][name^="allergen-"][value="contains"]')].map((input) => {
				let row = input.parentElement;
				while (row && !/^Source/m.test(row.innerText)) row = row.parentElement;
				return { name: input.name, row };
			});
			const hide = rows.filter((r) => r.name !== `allergen-${keep}` && r.row).map((r) => r.row);
			hide.forEach((row) => row.setAttribute('data-capture-hidden', ''));
			const style = document.createElement('style');
			style.id = 'capture-hide';
			style.textContent = '[data-capture-hidden]{display:none!important}';
			document.head.append(style);
			return hide.length;
		}, shotRow);
		if (!hidden) throw new Error('no allergen rows found to fold');
		await shoot(page, shotName, [heading, milkRow], { top: 16, bottom: 16 });
		await page.evaluate(() => {
			document.getElementById('capture-hide')?.remove();
			document.querySelectorAll('[data-capture-hidden]').forEach((n) => n.removeAttribute('data-capture-hidden'));
		});
		await page.evaluate(() => document.querySelector('.save-bar')?.style.removeProperty('visibility'));
		if (shotRow === 'milk') await shoot(page, shotName.replace('-mobile', '-save-mobile'), [page.locator('.save-bar')]);
	}
	await page.getByRole('button', { name: /^Save \d+ changes?$/ }).click();
	await page.waitForFunction(() => !document.querySelector('.save-bar'), null, { timeout: 15_000 });
	await page.waitForLoadState('networkidle');
}

if (GUIDE === 'catering-food-labels') {
	// The Ishikawa fundraiser (#765): confirmed, Tue Oct 13, 29 guests, on the
	// demo world's Autumn Harvest Table menu. Wild Mushroom Polenta is labelled:
	// four ingredients, two of them dairy.
	const ORDER = 765;
	const DISH = 'Wild Mushroom Polenta';
	const { context, page } = await signedIn(390);

	// 1. The Pack page says what the labels would say today.
	await page.goto(`${APP}/orders/${ORDER}/pack`, { waitUntil: 'networkidle' });
	await shoot(page, '01-pack-warning-mobile', [page.getByRole('heading', { level: 1 }), page.getByText(/Labels will say/).locator('xpath=ancestor::*[.//a or .//button][1]')], { top: 16 });

	// 2. Each ingredient answered from its package: Parmesan contains milk.
	await answerAllergens(page, 66, { milk: 'contains' }, '02-ingredient-allergens-mobile');
	await answerAllergens(page, 63, { milk: 'contains' });
	await answerAllergens(page, 95, {});
	await answerAllergens(page, 51, {});

	// 3. Back on Pack, the dish is reviewed and Label is one tap away.
	await page.goto(`${APP}/orders/${ORDER}/pack`, { waitUntil: 'networkidle' });
	const row = page.getByRole('button', { name: `Label ${DISH}` }).locator('visible=true').first().locator(`xpath=ancestor::*[contains(., "${DISH}")][1]`);
	await shoot(page, '03-pack-row-mobile', [row]);

	// 4. The Label dialog: storage first, then the shelf life.
	const dlg = page.getByRole('dialog').first();
	for (let attempt = 0; attempt < 4 && !(await dlg.count()); attempt++) {
		await page.getByRole('button', { name: `Label ${DISH}` }).locator('visible=true').first().click();
		await page.waitForTimeout(1500);
	}
	await dlg.waitFor();
	await dlg.locator('input[name="storageState"][value="refrigerated"]').first().check({ force: true });
	await page.waitForTimeout(600);
	const shelf = dlg.getByRole('heading', { name: 'Shelf life' }).locator('xpath=ancestor::section[1] | ancestor::fieldset[1]');
	await shoot(page, '04-storage-shelf-life-mobile', [dlg.getByRole('group', { name: 'Storage condition' }), shelf]);
	const suggestion = dlg.getByRole('button', { name: /FDA Food Code/ }).first();
	if (await suggestion.count()) {
		await suggestion.click();
		await page.waitForTimeout(800);
	}

	// 5. The sticker, exactly as it will print.
	await dlg.getByRole('spinbutton', { name: 'How many physical containers?' }).fill('2');
	await dlg.getByRole('spinbutton', { name: 'How many physical containers?' }).blur();
	await page.waitForTimeout(600);
	// Down to the line saying where the allergens come from; the region's last
	// line ("Stickers 2–2 are identical…") is cut.
	await shoot(page, '05-sticker-mobile', [dlg.getByRole('heading', { name: 'The sticker' }), dlg.getByText(/^Contains and May contain are derived/)]);

	// 6. Containers, stock and the print button.
	await shoot(page, '06-print-mobile', [dlg.getByText('How many physical containers?', { exact: true }), dlg.getByRole('button', { name: /^Print \d+ labels?/ })]);
	await dlg.getByRole('button', { name: /^Print \d+ labels?/ }).click();
	await page.waitForURL(/\/labels\/print\/\d+/, { timeout: 30_000 });
	await context.close();
}


/** Pick an option in the app's FormSelect (a button that opens a listbox). */
async function pick(page, trigger, optionName) {
	await trigger.click();
	await page.getByRole('option', { name: optionName, exact: true }).first().click();
	await page.waitForTimeout(300);
}

if (GUIDE === 'guest-allergy-menu-check') {
	// A new order on the demo world's Mediterranean Spread: the hummus carries
	// tahini through its Tahini Sauce sub-recipe, and the focaccia comes from a
	// bakery whose label warns "may contain sesame". Allergen answers follow
	// each ingredient's real allergens; the sample notes name where they were read.
	const ANSWERS = {
		78: { wheat: 'contains' }, 70: { egg: 'contains' }, 92: { sesame: 'contains' },
		103: { wheat: 'contains', sesame: 'may_contain' }, 11: { milk: 'contains' }, 68: { milk: 'contains' },
		93: { wheat: 'contains' }, 5: { milk: 'contains' }
	};
	const MENU_INGREDIENTS = [78, 79, 8, 53, 70, 32, 36, 6, 92, 10, 39, 81, 103, 11, 68, 93, 55, 57, 7, 5, 99, 76, 38, 73, 25, 87, 85, 86];
	const { context, page } = await signedIn(390);

	// RESUME_ORDER=<id> picks up at the confirm step on an order made earlier.
	let orderUrl = process.env.RESUME_ORDER ? `${APP}/orders/${process.env.RESUME_ORDER}` : null;
	if (!orderUrl) {
	// The order: Lindqvist wedding, Saturday Oct 24, 120 guests.
	await page.goto(`${APP}/orders/new`, { waitUntil: 'networkidle' });
	await page.locator('#name').fill('Lindqvist wedding');
	await page.getByRole('button', { name: 'Choose a date' }).click();
	const day = page.locator('[data-value="2026-10-24"]').or(page.getByRole('button', { name: /October 24/ }));
	await day.first().click();
	await page.locator('#guestCount').fill('120');
	await page.locator('#menu-search').fill('Mediterranean');
	await page.getByText('Mediterranean Spread', { exact: true }).first().click();
	await page.getByRole('button', { name: 'Create order' }).click();
	await page.waitForURL(/\/orders\/\d+(\?.*)?$/, { timeout: 30_000 });
	orderUrl = page.url().replace(/\?.*$/, '');
	console.log('order', orderUrl);
	await page.waitForLoadState('networkidle');

	await page.getByText('Order created.').waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => {});
	// 1. Before you confirm: allergens and guest restrictions are on the list.
	const checklist = page.getByRole('heading', { name: /^Before you confirm/ });
	await shoot(page, '01-checklist-mobile', [checklist, page.getByRole('button', { name: 'Confirm order' }).first()], { top: 16 });

	// 2. The Guest restrictions dialog, then the sesame restriction.
	await page.evaluate(() => window.dispatchEvent(new Event('order-edit-restrictions')));
	const dialog = page.getByRole('dialog', { name: 'Guest restrictions' });
	await dialog.waitFor();
	await dialog.getByRole('button', { name: 'Add a restriction' }).first().click();
	await pick(page, dialog.locator('#restriction-allergen'), 'Sesame');
	await dialog.locator('#restriction-guest').fill("table 4, bride's brother-in-law");
	await dialog.locator('#restriction-count').fill('1');
	await shoot(page, '02-add-restriction-mobile', [dialog]);
	await dialog.getByRole('button', { name: 'Add restriction' }).click();
	await page.waitForLoadState('networkidle');
	await page.waitForTimeout(800);
	await page.keyboard.press('Escape');

	// 3. What the order says before anyone has answered the ingredients.
	await page.goto(orderUrl, { waitUntil: 'networkidle' });
	const guards = page.getByText(/dishes to check|conflicts? with the guests/).first().locator('xpath=ancestor::section[1]');
	await shoot(page, '03-checks-before-mobile', [guards]);

	// 4. Answer every ingredient from its package; tahini and the focaccia shot.
	for (const id of MENU_INGREDIENTS) {
		const shotName = id === 92 ? '04-tahini-mobile' : id === 103 ? '05-focaccia-mobile' : null;
		await answerAllergens(page, id, ANSWERS[id] ?? {}, shotName, id === 103 ? 'sesame' : id === 92 ? 'sesame' : 'milk', id === 103 ? 'Bakery spec sheet, read Oct 10' : 'Package label, read Oct 10');
	}

	// 5. The order now names the conflict and the check.
	await page.goto(orderUrl, { waitUntil: 'networkidle' });
	await page.getByText('View dish checks').first().click();
	await page.waitForTimeout(500);
	await shoot(page, '06-checks-after-mobile', [page.getByText(/conflicts? with the guests/).first().locator('xpath=ancestor::section[1]')]);

	}

	// 6. Price the order to the 30% target (the checklist's Fix the price),
	// then Confirm order: the dialog lists the conflict before you commit.
	await page.goto(orderUrl, { waitUntil: 'networkidle' });
	// The first Use on the page is GET TO 30%'s "Charge $… a guest".
	const useTarget = page.getByRole('button', { name: /^Charge \$[\d.]+ a guest/ });
	if (await useTarget.count()) {
		await useTarget.first().click();
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(1000);
	}
	await page.getByRole('button', { name: 'Confirm order' }).first().click();
	const confirm = page.getByRole('alertdialog').or(page.getByRole('dialog')).first();
	await confirm.waitFor();
	await shoot(page, '07-confirm-dialog-mobile', [confirm]);
	await confirm.getByRole('button', { name: /^Confirm/ }).last().click();
	await page.waitForLoadState('networkidle');
	await page.waitForTimeout(1500);
	await page.goto(orderUrl, { waitUntil: 'networkidle' });
	await shoot(page, '08-checked-at-confirm-mobile', [page.getByText(/Checked at confirm/).first().locator('xpath=ancestor::section[1]')]);
	await context.close();
}


if (GUIDE === 'catering-deposit-without-chasing') {
	// The site's wedding (homepage, events page): Nair & Castellano, Sat Dec 19,
	// 150 guests on the demo world's Wedding Plated Dinner at $95, a $3,500
	// deposit, the balance 10 days out. The inquiry-to-draft steps follow
	// capture-events-proof.mjs.
	const EVENT = { client: 'Priya Nair', phone: '(207) 555-0187', email: 'priya.nair@example.com', name: 'Nair & Castellano wedding', guests: '150', menu: 'Wedding Plated Dinner', date: '2026-12-19', start: '17:00', end: '22:00', deposit: '3500', balanceDays: '10' };
	const context = (await signedIn(390)).context;
	const page = context.pages()[0];
	await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: APP });
	const hydrate = async (p) => { await p.waitForLoadState('load'); await p.waitForTimeout(2000); };

	let eventUrl = process.env.RESUME_EVENT ? `${APP}/events/${process.env.RESUME_EVENT}` : null;
	if (!eventUrl) {
		// Inquiry, menu, details and date (not shot: the events guide covers them).
		await page.goto(`${APP}/events/new`); await hydrate(page);
		await page.getByRole('combobox', { name: 'Client' }).click();
		await page.getByRole('combobox', { name: 'Client' }).fill(EVENT.client);
		await page.getByRole('option', { name: /Add.*as new client/ }).click();
		await page.getByLabel('Phone or email').fill(EVENT.phone);
		await page.getByLabel('Event name', { exact: true }).fill(EVENT.name);
		await page.getByLabel('Date not decided yet').check();
		await page.getByLabel('Guests', { exact: true }).fill(EVENT.guests);
		await page.getByRole('button', { name: 'Save and build menu', exact: true }).click();
		await page.waitForURL(/\/events\/[0-9a-f-]+\/menu$/);
		eventUrl = page.url().replace(/\/menu$/, '');
		console.log('event', eventUrl);
		await hydrate(page);
		await page.getByRole('searchbox', { name: 'Search menus or dishes' }).fill(EVENT.menu);
		await page.waitForTimeout(800);
		await page.getByRole('button', { name: 'Use menu' }).first().click();
		await page.getByText('All changes saved').waitFor({ state: 'attached' });
		await page.waitForTimeout(1500);
	}
	// START_AT=menu with RESUME_EVENT picks up an event created without its menu.
	if (!process.env.RESUME_EVENT || process.env.START_AT === 'menu') {
		// Set-up runs at desktop width, as capture-events-proof.mjs does: on a
		// phone the workspace tucks Edit details and the menu search away.
		await page.setViewportSize({ width: 1440, height: 900 });
		if (process.env.START_AT === 'menu') {
			await page.goto(`${eventUrl}/menu`); await hydrate(page);
			const search = page.getByRole('searchbox', { name: 'Search menus or dishes' });
			if (await search.count()) {
				await search.fill(EVENT.menu);
				await page.waitForTimeout(800);
				await page.getByRole('button', { name: 'Use menu' }).first().click();
				await page.getByText('All changes saved').waitFor({ state: 'attached' });
				await page.waitForTimeout(1500);
			}
		}
		await page.goto(eventUrl); await hydrate(page);
		await page.getByRole('button', { name: 'Edit details' }).click();
		const details = page.getByRole('dialog', { name: 'Edit event details' });
		await details.waitFor();
		await details.getByLabel('Date not decided yet').uncheck();
		const wedding = details.getByRole('radio', { name: 'Wedding' });
		await wedding.check({ force: true });
		await details.getByLabel('Service start').fill(EVENT.start);
		await details.getByLabel('Service end').fill(EVENT.end);
		await details.getByText('Plated', { exact: true }).click();
		await details.getByRole('button', { name: 'Save changes' }).click();
		await details.waitFor({ state: 'hidden' });
		const r = await page.request.post(`${eventUrl}?/setDate`, { headers: { origin: APP }, form: { serviceDate: EVENT.date } });
		if (!r.ok()) throw new Error(`setDate refused: ${r.status()}`);

		// 1. The money goes on the proposal: deposit, balance date. From here on
		// the walk stays at phone width (a resize folds the open terms away).
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto(`${eventUrl}/proposal`); await hydrate(page);
		if (await page.getByLabel('Client email').count()) { await page.getByLabel('Client email').fill(EVENT.email); await page.getByLabel('Client email').blur(); }
		await page.getByRole('status').filter({ hasText: 'Saved' }).first().waitFor();
		await page.waitForTimeout(800);
		if (!(await page.getByRole('button', { name: 'Save these terms' }).count())) await page.getByRole('button', { name: /^Terms (Add|Edit)/ }).click();
		const terms = page.getByRole('region', { name: 'Terms on the proposal' });
		await terms.getByText('A deposit, then the balance', { exact: true }).click();
		await terms.getByText('A fixed amount', { exact: false }).first().click();
		await terms.getByLabel('Deposit dollars').fill(EVENT.deposit);
		await terms.getByLabel('Balance due (days before the event)').fill(EVENT.balanceDays);
		await terms.getByLabel('Balance due (days before the event)').blur();
		await page.waitForTimeout(600);
		await shoot(page, '01-payment-terms-mobile', [terms.getByRole('heading', { name: 'Payment schedule' }), terms.getByText('What the client will read').locator('xpath=..')]);
		await terms.getByRole('button', { name: 'Save these terms' }).click();
		await page.waitForTimeout(1500);
		await page.getByRole('button', { name: 'Preview & send' }).click();
		await page.waitForURL(/\/proposal\/send\?revision=/); await hydrate(page);
		await page.getByRole('button', { name: /^Send offer( to |$)/ }).first().click();
		await page.waitForURL(/\/decision/); await hydrate(page);
		await page.getByRole('button', { name: 'Copy offer link' }).click();
		const offerUrl = await page.evaluate(() => navigator.clipboard.readText());

		// 2. The client's phone: the price, the terms, and Accept.
		{
			const client = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
			const cp = await client.newPage();
			await cp.goto(offerUrl); await hydrate(cp);
			const payment = cp.getByText(/deposit/i).first().locator('xpath=ancestor::section[1]');
			await shoot(cp, '02-client-terms-mobile', [payment]);
			const accept = cp.getByRole('button', { name: 'Accept proposal' }).last();
			await accept.click();
			await cp.getByLabel('Your full name').fill(EVENT.client);
			await shoot(cp, '03-client-accept-mobile', [cp.getByLabel('Your full name').locator('xpath=ancestor::form[1]')]);
			await cp.getByRole('button', { name: /^Accept for / }).click();
			await cp.getByRole('heading', { name: /proposal accepted/i }).waitFor();
			await client.close();
		}
	}

	// 3. The event after the yes: Book the event lists what is missing.
	const STAGE = process.env.STAGE ?? 'gate';
	if (STAGE === 'gate') {
		await page.goto(eventUrl); await hydrate(page);
		await shoot(page, '04-book-gate-mobile', [page.getByRole('region', { name: 'Book the event', exact: true })]);

		// 4. The agreement carries the payment schedule the client accepted.
		await page.goto(`${eventUrl}/agreement`); await hydrate(page);
		const editor = page.locator('[contenteditable="true"]').first();
		await editor.click();
		await editor.fill('Harbor & Hearth Catering will cater the Nair & Castellano wedding on the date, menu and prices Priya accepted. The deposit confirms the date. The final guest count and the balance are due together.');
		await page.getByLabel('Client name').fill('Priya Nair');
		await page.getByLabel('Client email').fill('priya.nair@example.com');
		await page.waitForTimeout(1500);
		await page.getByRole('link', { name: /^Review contract/ }).first().click();
		await page.waitForURL(/\/agreement\/review/); await hydrate(page);
		const schedule = page.getByRole('heading', { name: 'Payment schedule' });
		await shoot(page, '05-agreement-schedule-mobile', [schedule, page.getByText(/^Final guest count due/)]);
		await page.getByRole('button', { name: 'Approve and save' }).click();
		await page.waitForLoadState('networkidle'); await page.waitForTimeout(1500);
		console.log('after approve', page.url());

	}
	if (STAGE === 'gate' || STAGE === 'paper') {
		// 5. What the saved contract says about signing on paper.
		await page.goto(`${eventUrl}/agreement`); await hydrate(page);
		const paper = page.getByRole('heading', { name: 'Signed on paper?' }).first().locator('xpath=ancestor::section[1]');
		await shoot(page, '06-signed-copy-mobile', [paper]);
	}
	if (STAGE === 'gate' || STAGE === 'paper' || STAGE === 'deposit') {
		// 6. The kitchen draft, then the deposit, asked by hand: a check.
		await page.goto(eventUrl); await hydrate(page);
		const draft = page.getByRole('region', { name: 'Kitchen draft', exact: true });
		const prepare = draft.getByRole('button', { name: 'Prepare the kitchen draft', exact: true });
		if (await prepare.count()) {
			await prepare.click();
			await draft.getByText('It is tentative', { exact: false }).waitFor();
			await page.reload(); await hydrate(page);
		}
		await draft.getByLabel('Deposit amount').fill('3500');
		await draft.getByText('A check, cash or a transfer', { exact: true }).click();
		const ask = draft.getByRole('button', { name: 'Ask for a deposit', exact: true });
		await shoot(page, '07-ask-deposit-mobile', [draft.getByText('Deposit amount', { exact: true }).first(), ask], { pad: 16 });
		await ask.click();
		await draft.getByText('Nothing received yet.', { exact: true }).waitFor();
		await page.reload(); await hydrate(page);
		const orderHref = await draft.getByRole('link', { name: 'Open the kitchen draft', exact: true }).getAttribute('href');
		console.log('order', orderHref);
		console.log('draft text', (await draft.innerText()).replace(/\n+/g, ' | ').slice(0, 1200));
		process.env.ORDER_HREF = orderHref;
	}
	if (STAGE === 'gate' || STAGE === 'paper' || STAGE === 'deposit' || STAGE === 'record') {
		const orderHref = process.env.ORDER_HREF;
		// 7. The order's Money tab: what is owed, and Record a payment.
		await page.goto(`${APP}${orderHref}?tab=money`); await hydrate(page);
		const payments = page.getByRole('heading', { name: 'Payments', exact: true });
		await shoot(page, '08-money-tab-mobile', [payments, page.getByText(/^Due dates are part of what the client agreed to/)]);
		await page.getByRole('button', { name: 'Record a payment' }).click();
		const record = page.getByRole('dialog').first();
		await record.waitFor();
		await page.getByLabel('Amount received (USD)').fill('3500');
		await page.getByLabel('Receipt or reference').fill('check #204');
		await page.waitForTimeout(400);
		await shoot(page, '09-record-payment-mobile', [record]);
		await page.getByRole('button', { name: 'Review payment' }).click();
		await page.waitForTimeout(1000);
		await shoot(page, '10-record-review-mobile', [page.getByRole('dialog').first()]);
		await page.getByRole('button', { name: 'Record payment', exact: true }).click();
		await page.waitForLoadState('networkidle'); await page.waitForTimeout(1500);

		// 8. Back on the event: the deposit is in; the signature is what's left.
		await page.goto(eventUrl); await hydrate(page);
		await shoot(page, '11-book-gate-after-mobile', [page.getByRole('region', { name: 'Book the event', exact: true })]);
		console.log('GATE', (await page.getByRole('region', { name: 'Book the event', exact: true }).innerText()).replace(/\n+/g, ' | '));
	}
	await page.screenshot({ path: `${OUT}/_probe-after.png`, fullPage: true });
	await context.close();
}


if (GUIDE === 'should-staff-see-food-costs') {
	// The owner invites a cook as Staff, then the same order, the same recipe
	// and a closed screen are shot as each of them. The cook is sample data.
	const COOK = 'rosa.alvarez@example.com';
	const ORDER = 765; // Ishikawa fundraiser, Tue Oct 13, 29 guests
	const RECIPE = 36; // Wild Mushroom Polenta
	const { context, page } = await signedIn(390);
	const STAGE = process.env.STAGE ?? 'invite';

	if (STAGE === 'invite') {
		await page.goto(`${APP}/settings/team`, { waitUntil: 'networkidle' });
		const emails = page.getByRole('combobox').first();
		await emails.fill(COOK);
		await emails.press('Enter');
		await page.waitForTimeout(500);
		await page.locator('input[name="role"][value="staff"]').check({ force: true }).catch(() => {});
		await shoot(page, '01-invite-mobile', [page.getByRole('heading', { name: 'Invite people' }), page.getByRole('button', { name: /^Send \d+ invitations?$/ })]);
		await page.getByRole('button', { name: /^Send \d+ invitations?$/ }).click();
		await page.waitForLoadState('networkidle'); await page.waitForTimeout(1500);
		console.log('after invite', (await page.locator('#main').innerText()).replace(/\n+/g, ' | ').slice(0, 600));
	}

	// The cook opens the invite link from the email (JOIN_LINK, read from the
	// local mail catcher; the token is stored hashed, so it exists only there).
	if (STAGE === 'invite' || STAGE === 'join') {
		const joinContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
		const joinPage = await joinContext.newPage();
		await joinPage.goto(process.env.JOIN_LINK, { waitUntil: 'networkidle' });
		const joinButton = joinPage.getByRole('button', { name: /^Join / });
		await shoot(joinPage, '02-join-mobile', [joinPage.getByRole('heading', { level: 1 }), joinButton], { top: 24, bottom: 16 });
		await joinButton.click();
		await joinPage.waitForLoadState('networkidle');
		await joinPage.waitForTimeout(1500);
		await joinContext.close();
	}
	// Now a member: the cook signs in the usual way.
	const { context: cookContext, page: cookPage } = await signedIn(390, COOK);
	console.log('cook at', cookPage.url());

	// The same order, owner then cook: the price card and the Shop total are
	// the owner's; the cook gets the same lists in quantities.
	await page.goto(`${APP}/orders/${ORDER}`, { waitUntil: 'networkidle' });
	await shoot(page, '03-owner-order-mobile', [page.getByRole('heading', { level: 1 }), page.getByText('Food margin', { exact: true }).first()], { top: 16 });
	await cookPage.goto(`${APP}/orders/${ORDER}`, { waitUntil: 'networkidle' });
	await shoot(cookPage, '04-staff-order-mobile', [cookPage.getByRole('heading', { level: 1 }), cookPage.getByText('Mushroom, cremini', { exact: true }).first().locator('xpath=ancestor::*[.//*[starts-with(normalize-space(.), "1 ×")]][1]')], { top: 16 });

	// The same recipe: the owner's pricing card, and the cook's view of it.
	await page.goto(`${APP}/catalog/recipes/${RECIPE}`, { waitUntil: 'networkidle' });
	await shoot(page, '05-owner-recipe-mobile', [page.getByText('PRICING, PER PORTION', { exact: true }).first(), page.getByText(/^Change price or target$/).first()]);
	// The cook's recipe page is not shot: its checklist strip scrolls sideways
	// at 390 and a frame of it cut mid-card.

	// A screen that is all money, opened by the cook.
	await cookPage.goto(`${APP}/analytics`, { waitUntil: 'networkidle' });
	await shoot(cookPage, '07-staff-closed-mobile', [cookPage.getByRole('heading', { level: 1 }), cookPage.getByText('The page is fine', { exact: true }).locator('xpath=ancestor::*[.//a[contains(., "Go to Today")] or .//button[contains(., "Go to Today")]][1]')], { top: 16 });

	// Back with the owner: the team, and what the ••• menu offers.
	await page.goto(`${APP}/settings/team`, { waitUntil: 'networkidle' });
	// The People list with the cook's ••• menu open: Change role, Remove.
	await page.getByRole('button', { name: `More for ${COOK}` }).click();
	const menu = page.getByRole('menu').first();
	await menu.waitFor();
	await shoot(page, '08-team-menu-mobile', [page.getByRole('heading', { name: 'People' }).first(), menu]);
	await page.keyboard.press('Escape');
	// Who can do what: the three roles side by side.
	const who = page.getByRole('heading', { name: 'Who can do what' }).first();
	await shoot(page, '09-who-can-do-what-mobile', [who, page.getByText('Billing and team', { exact: true }).first()]);
	await cookContext.close();
	await context.close();
}

await browser.close();

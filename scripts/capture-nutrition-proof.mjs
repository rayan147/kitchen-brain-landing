// Captures the nutrition & allergens proof from LOCAL DEVELOP, kitchen-brain
// 7a7e407d9 (owner, 2026-10-07: "local develop latest"), on a dish from the
// homepage's wedding menu: Wild Mushroom Polenta (recipe 36), one of the six
// on the Nair & Castellano Wedding Plated Dinner.
// Story: docs/stories/nutrition-facts-allergens-feature.story.md
//
//   APP=http://localhost:4193 node scripts/capture-nutrition-proof.mjs
//
// THE APP SHOWS A DRAFT, SO THE FRAMES SHOW A DRAFT. On develop the Nutrition
// tab calls a dish with unconfirmed sources or blank label lines a "Draft
// estimate. Not ready to print.", Preview label shows the panel with a dash for
// each blank line and Print label switched off, and the print route refuses
// until every source is confirmed and no line is blank. No recipe in the demo
// world passed that gate on 2026-10-07 (all 90 checked), so nothing here
// shows a printed sheet: the copy says what the gate asks instead.
//
// Any signed-in copy of the develop demo world works (magic link, as in
// capture-events-proof.mjs); 2026-10-07 used the keyed :4193 world. Read only:
// the preview dialog is opened and closed, nothing is saved.
//
// Rules kept from the other capture scripts: deviceScaleFactor 2, desktop 1440
// and phone 390 CSS px, element-bounded clips, mouse parked, focus blurred,
// animations off, caret hidden, fonts loaded, toasts removed, FORBIDDEN text
// checked in every clip, PNG pixels printed for the page's width and height.
//
// Considered Strategy; not used because this is one fixed capture whose only
// variants are viewport and output path, not swappable behavior.
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const APP = process.env.APP ?? 'http://localhost:4193';
const KB_DIR = process.env.KB_DIR ?? '/home/rayan147/kitchen-brain-develop-demo';
const CHROME_PATH = process.env.CHROME_PATH ?? '/usr/bin/google-chrome';
const RECIPE = process.env.RECIPE ?? '36';
const DISH = 'Wild Mushroom Polenta';
const OWNER = 'marisol@example.com';
const { chromium } = await import(pathToFileURL(resolve(KB_DIR, 'node_modules/playwright/index.mjs')).href);
const outputRoot = resolve(import.meta.dirname, '../public/proof');
const cropRoot = resolve(outputRoot, 'nutrition');
const FORBIDDEN = [/Kitchen Brain/i, /Maple & Main/, /\bE2E\b/, /Square/, /QuickBooks/i, /fixture/i, /localhost/i, /Chicken Burrito/];

async function settle(page) {
	await page.mouse.move(0, 0).catch(() => {});
	await page.evaluate(() => {
		document.activeElement instanceof HTMLElement && document.activeElement.blur();
		for (const t of document.querySelectorAll('[data-sonner-toaster], [data-ui-role="toast"], .toast')) t.remove();
		return document.fonts.ready;
	});
	await page.waitForTimeout(600);
}

/** Screenshot of one element (or a document-space clip), with the text guard. */
async function shoot(page, path, target) {
	await settle(page);
	const text = typeof target.innerText === 'function' ? await target.innerText() : await page.evaluate(() => document.body.innerText);
	for (const bad of FORBIDDEN) if (bad.test(text)) throw new Error(`${path}: forbidden ${bad}`);
	if (typeof target.screenshot === 'function') await target.screenshot({ path, animations: 'disabled', caret: 'hide' });
	else await page.screenshot({ path, clip: target, fullPage: true, animations: 'disabled', caret: 'hide' });
	const { width, height } = await sizeOf(path);
	console.log(`captured ${path.replace(outputRoot, 'public/proof')}  ${width} x ${height}`);
	console.log(`  text: ${text.replace(/\s+/g, ' ').slice(0, 500)}`);
}

async function sizeOf(path) {
	const { readFile } = await import('node:fs/promises');
	const b = await readFile(path);
	return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

async function signIn(page) {
	await page.goto(`${APP}/login`);
	await page.waitForTimeout(2000);
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
}

async function openTab(page, tab) {
	await page.goto(`${APP}/catalog/recipes/${RECIPE}?tab=${tab}`);
	await page.waitForLoadState('load');
	await page.waitForTimeout(2500);
	const h1 = await page.getByRole('heading', { level: 1 }).first().innerText();
	if (h1.trim() !== DISH) throw new Error(`recipe ${RECIPE} is "${h1}", not ${DISH}`);
	// ?tab= opens Nutrition but not every tab; the tab itself always does.
	const name = { nutrition: /^Nutrition/, allergens: /^Allergens/ }[tab];
	const t = page.getByRole('tab', { name }).first();
	if (await t.count()) { await t.click(); await page.waitForTimeout(1500); }
}

/** The Nutrition tab section: from its heading to the end of the section. */
const nutritionSection = (page) => page.getByRole('heading', { name: 'Nutrition, per portion' }).locator('xpath=ancestor::section[1]');

await mkdir(cropRoot, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'] });
try {
	const desk = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
	const page = await desk.newPage();
	await signIn(page);
	const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce', isMobile: true, hasTouch: true, storageState: await desk.storageState() });
	const mpage = await phone.newPage();

	// 1. The summary: the draft banner, the four headline values, lines filled.
	for (const [p, name] of [[page, 'wide'], [mpage, 'mobile']]) {
		await openTab(p, 'nutrition');
		// The phone's sticky app bar sat over the banner's first lines in the
		// 2026-10-07 frame, hiding the words the alt names (readability review
		// 2026-10-09); hide it as section 3 does.
		if (name === 'mobile') await p.evaluate(() => { for (const e of document.querySelectorAll('*')) { const cs = getComputedStyle(e); if (cs.position === 'fixed' || cs.position === 'sticky') e.style.visibility = 'hidden'; } });
		const banner = p.getByText('Draft estimate. Not ready to print.', { exact: true }).first();
		const filled = p.getByText('Label lines filled', { exact: true }).first();
		const top = await banner.evaluate((el) => { let n = el; while (n.parentElement && n.getBoundingClientRect().width < 330) n = n.parentElement; const r = n.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, r: r.right + scrollX }; });
		const bottom = await filled.evaluate((el) => { let n = el; while (n.parentElement && !/Calories/.test(n.innerText)) n = n.parentElement; const r = n.getBoundingClientRect(); return { b: r.bottom + scrollY, x: r.left + scrollX, r: r.right + scrollX }; });
		const x = Math.min(top.x, bottom.x) - 8;
		await shoot(p, resolve(cropRoot, `nutrition-summary-${name}.png`), { x, y: top.y - 8, width: Math.max(top.r, bottom.r) - x + 8, height: bottom.b - top.y + 16 });
	}

	// 2. The whole Nutrition tab, for "Open full recipe capture".
	await openTab(page, 'nutrition');
	await shoot(page, resolve(outputRoot, 'nutrition-panel.png'), nutritionSection(page));

	// 3. Allergens & dietary, the evidence table.
	for (const [p, name] of [[page, 'wide'], [mpage, 'mobile']]) {
		await openTab(p, 'allergens');
		const section = p.getByRole('heading', { name: 'Allergens & dietary' }).locator('xpath=ancestor::section[1]');
		if (name === 'wide') {
			const box = await section.evaluate((el) => { const r = el.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height }; });
			await shoot(p, resolve(cropRoot, 'allergen-review-wide.png'), { x: box.x - 12, y: box.y - 12, width: box.width + 24, height: box.height + 24 });
			continue;
		}
		// Phones get one card per ingredient; the frame is the two that carry
		// milk, with the sticky app bar hidden.
		await p.evaluate(() => { for (const e of document.querySelectorAll('*')) { const cs = getComputedStyle(e); if (cs.position === 'fixed' || cs.position === 'sticky') e.style.visibility = 'hidden'; } });
		const card = (n) => section.locator('section, article, div').filter({ has: p.getByRole('heading', { name: n, exact: true }) }).filter({ hasText: 'Gluten-free' }).last();
		const box = async (l) => l.evaluate((el) => { const r = el.getBoundingClientRect(); return { y: r.top + scrollY, b: r.bottom + scrollY }; });
		const first = await box(card('Parmesan, block'));
		const last = await box(card('Butter, unsalted'));
		await shoot(p, resolve(cropRoot, 'allergen-review-mobile.png'), { x: 0, y: first.y - 12, width: 390, height: last.b - first.y + 24 });
	}

	// 4. Preview label: the dialog (draft line, sheet, Print label off) and its
	//    Nutrition Facts panel. A tall screen so the dialog shows its whole sheet.
	await page.setViewportSize({ width: 1440, height: 2000 });
	await openTab(page, 'nutrition');
	await page.getByRole('button', { name: 'Preview label' }).click();
	const dialog = page.getByRole('dialog').first();
	await dialog.waitFor();
	await page.waitForTimeout(1200);
	const print = dialog.getByRole('button', { name: 'Print label' });
	if (await print.isEnabled()) throw new Error('Print label is enabled: the dish is no longer a draft; re-read the copy before re-shooting');
	await shoot(page, resolve(cropRoot, 'label-panel.png'), dialog);
	await shoot(page, resolve(outputRoot, 'nutrition-label.png'), dialog);
	const panel = dialog.getByText('Nutrition Facts', { exact: true }).first().locator('xpath=ancestor::*[contains(normalize-space(.), "Daily Value")][1]');
	await shoot(page, resolve(cropRoot, 'nutrition-facts-panel.png'), panel);
	await dialog.getByRole('button', { name: 'Close' }).last().click();
} finally {
	await browser.close();
}

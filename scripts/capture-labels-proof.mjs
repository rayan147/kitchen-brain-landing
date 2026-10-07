// Captures the kitchen label printing proof for /features/labels-and-printing.
// story: docs/stories/labels-printing.story.md
//
//   APP=http://localhost:4181 node scripts/capture-labels-proof.mjs
//
// The app is the demo world (kitchen-brain-develop-demo `sandbox/demo`, the
// guarded scratch DB) with the `label_printing` flag on for the demo business,
// signed in by magic link. The walk is the cook's: open the pack list for the
// tour's wedding order, tap Label on Braised Short Rib, choose Refrigerated,
// accept the FDA Food Code shelf-life suggestion, two containers, print. The
// print view is opened with auto=0 so the system dialog stays closed.
//
// Same discipline as capture-proof.mjs: device scale 2, desktop at 1440 CSS px
// and phone at 390, element-bounded clips, cursor parked, animations off.
//
// Pattern: none. One walk, four clips.
import { chromium } from '/home/rayan147/kitchen-brain/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const APP = process.env.APP ?? 'http://localhost:4181';
const OUT = resolve(import.meta.dirname, '../public/proof/labels');
mkdirSync(OUT, { recursive: true });
// The homepage's wedding (Sat Dec 19, 150 guests), confirmed by
// capture-events-proof.mjs run with SKIP_CLOSEOUT=1 (re-shot 2026-10-07 from
// app 7a7e407d9, served with FEATURE_LABEL_PRINTING_ENABLED=true).
const ORDER_NAME = 'Nair & Castellano wedding';
const CONTAINERS = '10';

const browser = await chromium.launch({
	executablePath: '/usr/bin/google-chrome',
	headless: true,
	args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
});

async function settle(page) {
	await page.evaluate(() => document.fonts.ready);
	await page.mouse.move(0, 0);
	await page.evaluate(() => document.activeElement?.blur?.());
	await page.waitForTimeout(500);
}

async function clip(page, locator, name, pad = 0) {
	await settle(page);
	const b = await locator.first().boundingBox();
	if (!b) throw new Error(`no box for ${name}`);
	await page.screenshot({
		path: `${OUT}/${name}.png`,
		clip: { x: Math.max(0, b.x - pad), y: Math.max(0, b.y - pad), width: b.width + pad * 2, height: b.height + pad * 2 },
		animations: 'disabled',
		caret: 'hide'
	});
	console.log('wrote', name);
}

async function signedIn(width) {
	const ctx = await browser.newContext({ viewport: { width, height: 2600 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
	const page = await ctx.newPage();
	// /demo's one-tap sign-in is gone; the harness exposes the mailed link.
	const email = 'marisol@example.com';
	await page.goto(APP + '/login', { waitUntil: 'load', timeout: 120_000 });
	await page.getByLabel('Email').fill(email);
	await page.getByRole('button', { name: 'Send sign-in link' }).click();
	await page.getByRole('heading', { name: 'Check your email' }).waitFor();
	let link = null;
	for (let i = 0; i < 40 && !link; i++) {
		const r = await page.request.get(APP + '/api/test/magic-link?email=' + encodeURIComponent(email));
		if (r.ok()) link = (await r.json()).url;
		if (!link) await page.waitForTimeout(250);
	}
	if (!link) throw new Error('no magic link captured; is MAGIC_LINK_TEST_CAPTURE=1 set?');
	const u = new URL(link);
	await page.goto(APP + u.pathname + u.search, { waitUntil: 'load' });
	await page.waitForTimeout(800);
	return { ctx, page };
}

async function prepUrl(page) {
	await page.goto(APP + '/orders/list', { waitUntil: 'load' });
	await page.waitForTimeout(2500);
	await page.getByRole('button', { name: 'All', exact: true }).first().click().catch(() => {});
	await page.locator('#list-search').fill(ORDER_NAME).catch(() => {});
	await page.waitForTimeout(600);
	const link = page.getByRole('link', { name: new RegExp(ORDER_NAME) }).first();
	if (!(await link.count())) throw new Error('the wedding order is missing; run SKIP_CLOSEOUT=1 scripts/capture-events-proof.mjs first');
	return new URL(await link.getAttribute('href'), page.url()).href.replace(/\/?$/, '/pack');
}

/** Opens the Label dialog for Braised Short Rib and fills it to the point of printing. */
async function fillDialog(page) {
	await page.waitForTimeout(4000); // the dialog is client-side
	// App 7a7e407d9: Label lives on the Pack tab, one button per dish.
	const dlg = page.getByRole('dialog').first();
	for (let attempt = 0; attempt < 4 && !(await dlg.count()); attempt++) {
		await page.getByRole('button', { name: 'Label Braised Short Rib' }).locator('visible=true').first().click();
		await page.waitForTimeout(1500);
	}
	await dlg.waitFor({ timeout: 10_000 });
	await dlg.locator('input[name="storageState"][value="refrigerated"]').first().check({ force: true });
	await page.waitForTimeout(600);
	const suggestion = dlg.getByRole('button', { name: /FDA Food Code/ }).first();
	if (await suggestion.count()) {
		await suggestion.click();
		await page.waitForTimeout(800);
	}
	// 300 portions across ten hotel pans, one label each (chef review: two
	// containers for a 300-portion batch was not a kitchen).
	await dlg.getByRole('spinbutton', { name: 'How many physical containers?' }).fill(CONTAINERS);
	await dlg.getByRole('spinbutton', { name: 'How many physical containers?' }).blur();
	await dlg.getByRole('button', { name: /^Print \d+ labels?/ }).waitFor();
	await page.waitForTimeout(400);
	return dlg;
}

// Desktop: the dialog, the sticker preview inside it, then the print view.
{
	const { ctx, page } = await signedIn(1440);
	const prep = await prepUrl(page);
	await page.goto(prep, { waitUntil: 'load' });
	const dlg = await fillDialog(page);
	// The top of the dialog only: the title, the storage choice and the sticker
	// column. The full dialog is 1150 CSS px tall and unreadable at page width.
	{
		await settle(page);
		const box = await dlg.boundingBox();
		const storage = await dlg.getByRole('group', { name: 'Storage condition' }).boundingBox();
		const sticker = await dlg.getByRole('region', { name: 'The sticker' }).boundingBox();
		const bottom = Math.min(Math.max(storage.y + storage.height, sticker.y + sticker.height) + 10, box.y + box.height);
		await page.screenshot({ path: `${OUT}/dialog-wide.png`, clip: { x: box.x, y: box.y, width: box.width, height: bottom - box.y }, animations: 'disabled', caret: 'hide' });
		console.log('wrote dialog-wide');
	}
	await clip(page, dlg.locator('[data-ui-role="label-sticker"]').first(), 'sticker', 6);
	await dlg.getByRole('button', { name: /^Print \d+ labels?/ }).click();
	await page.waitForURL(/\/labels\/print\/\d+/, { timeout: 30_000 });
	const u = new URL(page.url());
	u.searchParams.set('auto', '0');
	await page.goto(u.href, { waitUntil: 'load' });
	await page.waitForTimeout(1500);
	const stickers = page.locator('[data-ui-role="label-sticker"]');
	// Every sticker on the sheet: ten labels lay out in columns, so first and
	// last alone cut a column in half.
	const boxes = await stickers.evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, r: r.right + scrollX, b: r.bottom + scrollY }; }));
	const x0 = Math.min(...boxes.map((b) => b.x)), y0 = Math.min(...boxes.map((b) => b.y));
	const x1 = Math.max(...boxes.map((b) => b.r)), y1 = Math.max(...boxes.map((b) => b.b));
	await settle(page);
	await page.screenshot({
		path: `${OUT}/print-sheet.png`,
		fullPage: true,
		clip: { x: x0 - 12, y: y0 - 12, width: x1 - x0 + 24, height: y1 - y0 + 24 },
		animations: 'disabled',
		caret: 'hide'
	});
	console.log('wrote print-sheet');

	// Settings: the stock picker, the part that makes the sticker printer-independent.
	await page.goto(APP + '/settings/labels', { waitUntil: 'load' });
	await page.waitForTimeout(1500);
	const stock = page.getByRole('radiogroup').first();
	await clip(page, (await stock.count()) ? stock : page.getByText('30-up sheet').first().locator('xpath=ancestor::fieldset[1]'), 'stock-picker', 8);
	await ctx.close();
}

// No phone dialog capture: at 390 the dialog is 1700 CSS px tall. The page
// shows the sticker crop on phones instead.

await browser.close();

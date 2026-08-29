// Captures the kitchen label printing proof for /features/labels-and-printing.
// story: docs/stories/labels-printing.story.md
//
//   APP=http://localhost:4181 node scripts/capture-labels-proof.mjs
//
// The app is the demo world (kitchen-brain-develop-demo `sandbox/demo`, the
// guarded scratch DB) with the `label_printing` flag on for the demo business,
// signed in through /demo. The walk is the cook's: open the prep list for the
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
const ORDER_NAME = 'Alvarez-Whitman Wedding';

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
	await page.goto(APP + '/demo', { waitUntil: 'load', timeout: 120_000 });
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
	if (!(await link.count())) throw new Error('the wedding order is missing; run scripts/capture-proof.mjs first, it creates it');
	return new URL(await link.getAttribute('href'), page.url()).href.replace(/\/?$/, '/prep');
}

/** Opens the Label dialog for Braised Short Rib and fills it to the point of printing. */
async function fillDialog(page) {
	await page.waitForTimeout(4000); // the dialog is client-side
	const section = page.locator('section:has(h3:has-text("Braised Short Rib"))').first();
	const dlg = page.getByRole('dialog').first();
	for (let attempt = 0; attempt < 4 && !(await dlg.count()); attempt++) {
		await section.getByRole('button', { name: /^Label/ }).locator('visible=true').first().click();
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
	await dlg.locator('button:has-text("+")').first().click();
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
		const storage = await dlg.locator('input[name="storageState"][value="opened"]').first().locator('xpath=ancestor::label[1] | ancestor::div[1]').first().boundingBox();
		const note = await dlg.getByText(/identical apart from their number/).first().boundingBox();
		const bottom = Math.max(storage.y + storage.height, note.y + note.height) + 10;
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
	const first = await stickers.first().boundingBox();
	const last = await stickers.last().boundingBox();
	await settle(page);
	await page.screenshot({
		path: `${OUT}/print-sheet.png`,
		clip: { x: Math.min(first.x, last.x) - 12, y: first.y - 12, width: Math.max(first.x + first.width, last.x + last.width) - Math.min(first.x, last.x) + 24, height: last.y + last.height - first.y + 24 },
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

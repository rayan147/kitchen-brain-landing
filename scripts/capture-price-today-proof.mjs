// Captures /proof/order-price-today.png from LOCAL DEVELOP, kitchen-brain
// 7a7e407d9 (owner, 2026-10-07: "local develop latest"), for the "Price the
// menu before you commit" block on /features/recipes-and-costing and "The
// agreed number stays put" on /features/menus-and-quotes. It replaces
// /demo-poster.jpg there, a still from the retired demo video (180 guests at
// $68, a cursor and a burned-in caption).
//
//   APP=http://localhost:4193 node scripts/capture-price-today-proof.mjs
//
// Two files: order-price-today.png (1280 wide, 2x) and
// order-price-today-mobile.png (the app's own 390-wide phone layout, 2x),
// served below 640 px so the figures stay readable on a phone.
//
// The keyed world's Nair & Castellano wedding, order #784, confirmed: the
// Shop tab's money block from "Confirmed ... prices locked" down to "Today's
// ingredient prices". The title row is left out: the film walk moved the
// event date to the day before its closeout (public/proof/film/manifest.json),
// and this frame is about the price, not the date. Read only.
//
// Considered Template Method (shared with capture-sage-proof.mjs); not used
// because it is one page and one clip. Plain code.
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const APP = process.env.APP ?? 'http://localhost:4193';
const KB_DIR = process.env.KB_DIR ?? '/home/rayan147/kitchen-brain-develop-demo';
const CHROME_PATH = process.env.CHROME_PATH ?? '/usr/bin/google-chrome';
const OWNER = 'marisol@example.com';
const ORDER = 784;
const { chromium } = await import(pathToFileURL(resolve(KB_DIR, 'node_modules/playwright/index.mjs')).href);
const OUT = resolve(import.meta.dirname, '../public/proof');
const FORBIDDEN = [/Kitchen Brain/i, /Maple & Main/, /\bE2E\b/, /fixture/i, /localhost/i, /Oct 6/];

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

async function shoot(page, name, isPhone) {
	await page.goto(`${APP}/orders/${ORDER}?tab=shop`);
	await page.getByText("Today's ingredient prices", { exact: true }).waitFor();
	await page.mouse.move(0, 0);
	await page.evaluate((hideFixed) => {
		document.activeElement instanceof HTMLElement && document.activeElement.blur();
		for (const t of document.querySelectorAll('[data-sonner-toaster]')) t.remove();
		if (hideFixed) for (const e of document.querySelectorAll('*')) { const cs = getComputedStyle(e); if (cs.position === 'fixed' || cs.position === 'sticky') e.style.visibility = 'hidden'; }
		return document.fonts.ready;
	}, isPhone);
	await page.waitForTimeout(800);
	const top = await page.getByText(/^Confirmed .* prices locked$/).first().evaluate((el) => { const r = el.getBoundingClientRect(); return { y: r.top + scrollY }; });
	// The bordered block that holds the price, the food cost and today's prices.
	const box = await page.getByText("Today's ingredient prices", { exact: true }).evaluate((el) => {
		let n = el;
		while (n.parentElement && getComputedStyle(n).borderTopWidth === '0px') n = n.parentElement;
		while (n.parentElement && n.parentElement.getBoundingClientRect().height < 900 && getComputedStyle(n.parentElement).borderTopWidth !== '0px') n = n.parentElement;
		const r = n.getBoundingClientRect();
		return { x: r.left + scrollX, w: r.width, b: r.bottom + scrollY };
	});
	const clip = isPhone
		? { x: 0, y: top.y - 14, width: 390, height: box.b - top.y + 30 }
		: { x: box.x - 16, y: top.y - 14, width: box.w + 32, height: box.b - top.y + 30 };
	const text = await page.evaluate((c) => [...document.querySelectorAll('body *')]
		.filter((e) => e.children.length === 0 && e.textContent.trim())
		.filter((e) => { const r = e.getBoundingClientRect(); const y = r.top + scrollY; return y >= c.y && y + r.height <= c.y + c.height && r.left >= c.x && r.right <= c.x + c.width; })
		.map((e) => e.textContent.trim()).join(' | '), clip);
	for (const bad of FORBIDDEN) if (bad.test(text)) throw new Error(`${name}: forbidden ${bad} in frame: ${text}`);
	await page.screenshot({ path: resolve(OUT, `${name}.png`), clip, fullPage: true, animations: 'disabled', caret: 'hide' });
	console.log(`captured ${name}.png  px [${Math.round(clip.width) * 2}, ${Math.round(clip.height) * 2}]`);
	console.log(`  text: ${text}`);
}

const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'] });
try {
	const desk = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
	await signIn(await desk.newPage());
	const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce', isMobile: true, hasTouch: true, storageState: await desk.storageState() });
	for (const [name, ctx] of [['order-price-today', desk], ['order-price-today-mobile', phone]]) await shoot(await ctx.newPage(), name, ctx === phone);
} finally {
	await browser.close();
}

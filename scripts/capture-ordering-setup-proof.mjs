// Captures the Ordering site Setup tab from LOCAL DEVELOP, kitchen-brain
// 7a7e407d9 (owner, 2026-10-07: "local develop latest"), for "Set it up in the
// app" on /features/online-ordering.
//
//   APP=http://localhost:4193 node scripts/capture-ordering-setup-proof.mjs
//
// Two cards, each its own file: "Pickup and delivery" and "Payments and tax"
// (the two a Go live depends on). Shot in a 1100-wide window so the cards keep their
// two-column desktop form and stay readable on a phone. Each at 2x.
//
// The "Put on your website" tab is NOT captured: on a local app its link and
// snippet name localhost and a real site id. The page prints the snippet's
// shape instead, with placeholders. Read only: nothing is typed or saved.
//
// Considered Template Method (shared with capture-price-today-proof.mjs); not
// used because the sign-in is the only shared step and it is ten lines.
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const APP = process.env.APP ?? 'http://localhost:4193';
const KB_DIR = process.env.KB_DIR ?? '/home/rayan147/kitchen-brain-develop-demo';
const CHROME_PATH = process.env.CHROME_PATH ?? '/usr/bin/google-chrome';
const OWNER = 'marisol@example.com';
const { chromium } = await import(pathToFileURL(resolve(KB_DIR, 'node_modules/playwright/index.mjs')).href);
const OUT = resolve(import.meta.dirname, '../public/proof');
const FORBIDDEN = [/Kitchen Brain/i, /Maple & Main/, /\bE2E\b/, /fixture/i, /localhost/i, /127\.0\.0\.1/, /site_[A-Za-z0-9]/];
const CARDS = [
	['ordering-setup-delivery', 'Pickup and delivery'],
	['ordering-setup-payments', 'Payments and tax']
];

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

const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'] });
try {
	const ctx = await browser.newContext({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
	const page = await ctx.newPage();
	await signIn(page);
	await page.goto(`${APP}/settings/integrations/ordering-site`);
	await page.getByRole('heading', { name: 'Payments and tax' }).waitFor();
	await page.mouse.move(0, 0);
	await page.evaluate(() => {
		document.activeElement instanceof HTMLElement && document.activeElement.blur();
		for (const t of document.querySelectorAll('[data-sonner-toaster]')) t.remove();
		return document.fonts.ready;
	});
	await page.waitForTimeout(800);
	for (const [name, heading] of CARDS) {
		// The card is the nearest bordered ancestor of its heading.
		const handle = await page.getByRole('heading', { name: heading }).evaluateHandle((el) => {
			let n = el.parentElement;
			while (n && getComputedStyle(n).borderTopWidth === '0px') n = n.parentElement;
			return n;
		});
		const card = handle.asElement();
		const box = card && (await card.boundingBox());
		if (!box) throw new Error(`${name}: card not found`);
		const text = await card.innerText();
		for (const bad of FORBIDDEN) if (bad.test(text)) throw new Error(`${name}: forbidden ${bad} in frame: ${text}`);
		await card.screenshot({ path: resolve(OUT, `${name}.png`), animations: 'disabled', caret: 'hide' });
		console.log(`captured ${name}.png  px [${Math.round(box.width) * 2}, ${Math.round(box.height) * 2}]`);
		console.log(`  text: ${text.replace(/\s+/g, ' ')}`);
	}
} finally {
	await browser.close();
}

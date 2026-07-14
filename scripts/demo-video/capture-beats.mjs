// Captures the director's-cut beats: fully-loaded 2x stills for static
// beats, live recordings for the two scroll beats. Captions injected
// in-page so every beat shares one branded lower-third.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:5199';
const OUT = '/tmp/claude-1000/-home-rayan147-kitchen-brain/cc4d86d5-ccfd-4404-8245-dd19e1d7d6dc/scratchpad/cut';
mkdirSync(OUT, { recursive: true });
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

const CAPTION_CSS = `
	position: fixed; left: 24px; bottom: 24px; z-index: 99999;
	background: rgba(31,36,33,0.94); color: #F4F6F4;
	font-family: 'Instrument Sans Variable', sans-serif; font-weight: 600;
	font-size: 15px; line-height: 1.35; letter-spacing: 0.01em;
	padding: 10px 16px 10px 13px; border-radius: 8px;
	border-left: 3px solid #B9762A; max-width: 56%;
`;

async function setCaption(page, text) {
	await page.evaluate(([css, t]) => {
		let el = document.getElementById('cc-caption');
		if (!el) {
			el = document.createElement('div');
			el.id = 'cc-caption';
			document.body.appendChild(el);
		}
		el.style.cssText = css;
		el.textContent = t;
	}, [CAPTION_CSS, text]);
}

async function ready(page, selector) {
	await page.waitForLoadState('networkidle');
	await page.locator(selector).first().waitFor({ state: 'visible', timeout: 20000 });
	await page.evaluate(() => document.fonts.ready);
	await pause(400);
}

// Slow eased scroll over `ms` to absolute Y.
async function cinematicScroll(page, toY, ms) {
	await page.evaluate(
		([y, dur]) =>
			new Promise((done) => {
				const startY = window.scrollY;
				const dist = y - startY;
				const t0 = performance.now();
				const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
				function step(now) {
					const p = Math.min(1, (now - t0) / dur);
					window.scrollTo(0, startY + dist * ease(p));
					if (p < 1) requestAnimationFrame(step);
					else done();
				}
				requestAnimationFrame(step);
			}),
		[toY, ms]
	);
}

const browser = await chromium.launch({
	executablePath: '/usr/bin/google-chrome',
	headless: true,
	args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
});

// ---- Pre-warm: login once, prime every route, keep the session ----
const warm = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const wp = await warm.newPage();
await wp.goto(BASE + '/login', { waitUntil: 'networkidle' });
await wp.waitForTimeout(900);
await wp.locator('#email').fill('demo@costcook.io');
await wp.locator('#password').fill('walkin-fridge-2026');
await wp.getByRole('button', { name: /sign in/i }).click();
await wp.waitForURL(BASE + '/', { timeout: 20000 });
const RID = await wp.goto(BASE + '/recipes', { waitUntil: 'networkidle' }).then(async () => {
	const href = await wp.locator('a', { hasText: 'Skewers' }).first().getAttribute('href');
	return href;
});
for (const p of ['/orders', '/orders/1', '/orders/1/prep', '/orders/1/pack', RID])
	await wp.goto(BASE + p, { waitUntil: 'networkidle' });
const state = await warm.storageState();
await warm.close();
console.log('warmed; skewers at', RID);

// ---- Static beats: 2x viewport stills, fully loaded, caption on ----
const stills = await browser.newContext({
	viewport: { width: 1280, height: 800 },
	deviceScaleFactor: 2,
	storageState: state
});
const sp = await stills.newPage();

// b2 orders list
await sp.goto(BASE + '/orders', { waitUntil: 'networkidle' });
await ready(sp, 'table.table-clean');
await setCaption(sp, 'Every event in one place.');
await sp.screenshot({ path: OUT + '/b2-orders.png' });

// b3 order detail (header: menu + guests visible)
await sp.goto(BASE + '/orders/1', { waitUntil: 'networkidle' });
await ready(sp, 'h1');
await setCaption(sp, 'A wedding. 200 guests. Summer BBQ menu.');
await sp.screenshot({ path: OUT + '/b3-detail.png' });

// b6 pack list
await sp.goto(BASE + '/orders/1/pack', { waitUntil: 'networkidle' });
await ready(sp, 'table.table-clean');
await setCaption(sp, 'And a pack list for the van.');
await sp.screenshot({ path: OUT + '/b6-pack.png' });

// b7 food cost (skewers pricing section in view)
await sp.goto(BASE + RID, { waitUntil: 'networkidle' });
await ready(sp, '#pricing-heading');
await sp.locator('#pricing-heading').scrollIntoViewIfNeeded();
await sp.evaluate(() => window.scrollBy(0, -140));
await pause(500);
await setCaption(sp, 'Real plate cost and margin, dish by dish.');
await sp.screenshot({ path: OUT + '/b7-cost.png' });
await stills.close();
console.log('stills done');

// ---- Scroll beats: live recordings ----
async function scrollBeat(name, path, selector, caption, toYFn, scrollMs, tailHold) {
	const ctx = await browser.newContext({
		viewport: { width: 1280, height: 800 },
		deviceScaleFactor: 2,
		storageState: state,
		recordVideo: { dir: OUT, size: { width: 1280, height: 800 } }
	});
	const page = await ctx.newPage();
	await page.goto(BASE + path, { waitUntil: 'networkidle' });
	await ready(page, selector);
	await setCaption(page, caption);
	await pause(1700); // opening hold on the loaded screen
	const toY = await page.evaluate(toYFn);
	await cinematicScroll(page, toY, scrollMs);
	await pause(tailHold);
	await ctx.close();
	const v = await page.video().path();
	console.log(name, '->', v);
	return v;
}

await scrollBeat('b4-shopping', '/orders/1', 'table.table-clean',
	'One shopping list, every dish rolled up by ingredient.',
	() => document.body.scrollHeight - window.innerHeight, 6500, 2200);
await scrollBeat('b5-prep', '/orders/1/prep', 'table.table-clean',
	'A prep list your line can actually follow.',
	() => Math.min(900, document.body.scrollHeight - window.innerHeight), 4200, 1800);

await browser.close();
console.log('CAPTURE DONE');

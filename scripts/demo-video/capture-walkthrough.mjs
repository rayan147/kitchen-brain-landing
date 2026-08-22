// Narration-synced walkthrough capture against the DEPLOYED demo
// instance (issue #58). One recorded context per beat; every beat's
// action schedule is driven by vo/timings.json caption starts so the
// footage tracks the voiceover. Each recording begins BEFORE the page
// is ready (Playwright starts the tape at context creation), so the
// script emits meta.json with a per-beat trimStart: assembly cuts to
// that point and the first retained frame is a fully loaded screen.
//
// Run from a directory whose node_modules has playwright-core
// (npm i --no-save playwright-core in the repo root works):
//   node scripts/demo-video/capture-walkthrough.mjs
import { chromium } from 'playwright-core';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = 'https://kitchen-brain-demo.vercel.app';
const OUT = process.env.CUT_DIR
	?? '/tmp/claude-1000/-home-rayan147-kitchen-brain-landing/47b3c2c4-38f7-4757-b2e6-ece8e1ac73e2/scratchpad/cut';
const CHROME = process.env.CHROME_PATH
	?? '/home/rayan147/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';
const timings = JSON.parse(readFileSync(join(HERE, 'vo/timings.json'), 'utf8'));
mkdirSync(OUT, { recursive: true });

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- in-page helpers: clean chrome, cursor, highlight ring ----------

const INJECT = `
	(() => {
		const style = document.createElement('style');
		style.textContent = \`
			::-webkit-scrollbar { display: none !important; }
			* { scrollbar-width: none !important; }
			#cc-cursor { position: fixed; z-index: 100000; width: 22px; height: 22px;
				pointer-events: none; transition: left 650ms cubic-bezier(.4,0,.2,1),
				top 650ms cubic-bezier(.4,0,.2,1); left: 640px; top: 700px; }
			#cc-ring { position: absolute; z-index: 99999; pointer-events: none;
				border: 3px solid #2F7D5B; border-radius: 10px;
				box-shadow: 0 0 0 4px rgba(185,118,42,0.25); opacity: 0;
				transition: all 550ms cubic-bezier(.4,0,.2,1); }
		\`;
		document.head.appendChild(style);
		const cur = document.createElement('div');
		cur.id = 'cc-cursor';
		cur.innerHTML = '<svg width="22" height="22" viewBox="0 0 22 22">'
			+ '<path d="M3 1l6.5 18 2.8-7.2L19.5 9z" fill="#1F2421" stroke="#F4F6F4" stroke-width="1.5"/></svg>';
		document.body.appendChild(cur);
		const ring = document.createElement('div');
		ring.id = 'cc-ring';
		document.body.appendChild(ring);
	})();
`;

async function inject(page) {
	await page.evaluate(INJECT);
}

// Move the fake cursor near an element (bottom-right of its box).
async function cursorTo(page, locator) {
	const box = await locator.boundingBox();
	if (!box) return;
	await page.evaluate(([x, y]) => {
		const c = document.getElementById('cc-cursor');
		if (c) { c.style.left = x + 'px'; c.style.top = y + 'px'; }
	}, [box.x + box.width * 0.72, box.y + box.height * 0.78]);
	await pause(700);
}

// Slide the ring onto an element (document coords so it scrolls along).
async function ring(page, locator, padding = 6) {
	const box = await locator.boundingBox();
	if (!box) return;
	await page.evaluate(([b, pad]) => {
		const r = document.getElementById('cc-ring');
		if (!r) return;
		r.style.left = b.x + window.scrollX - pad + 'px';
		r.style.top = b.y + window.scrollY - pad + 'px';
		r.style.width = b.width + pad * 2 + 'px';
		r.style.height = b.height + pad * 2 + 'px';
		r.style.opacity = '1';
	}, [box, padding]);
}

async function ringOff(page) {
	await page.evaluate(() => {
		const r = document.getElementById('cc-ring');
		if (r) r.style.opacity = '0';
	});
}

// Eased scroll to absolute Y over ms (from the old rig, unchanged).
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

async function scrollToLocator(page, locator, ms, offset = -220) {
	const box = await locator.boundingBox();
	if (!box) return;
	const y = Math.max(0, box.y + (await page.evaluate(() => window.scrollY)) + offset);
	await cinematicScroll(page, y, ms);
}

async function ready(page, selector) {
	await page.waitForLoadState('networkidle');
	await page.locator(selector).first().waitFor({ state: 'visible', timeout: 30000 });
	await page.evaluate(() => document.fonts.ready);
	await pause(400);
}

// ---------- beat runner: schedule actions at caption times ----------

// Runs `steps` [{at, run}] against a beat clock started at t0. `at` is
// seconds on the narration timeline (from vo/timings.json).
async function runSchedule(steps, t0) {
	for (const step of steps) {
		const wait = t0 + step.at * 1000 - Date.now();
		if (wait > 0) await pause(wait);
		await step.run();
	}
}

const meta = {};

async function recordBeat(browser, state, id, path, readySel, buildSteps, extraTail = 1.2) {
	const dur = timings[id].duration;
	const caps = timings[id].captions;
	const ctx = await browser.newContext({
		viewport: { width: 1280, height: 800 },
		deviceScaleFactor: 2,
		storageState: state,
		recordVideo: { dir: OUT, size: { width: 1280, height: 800 } }
	});
	const created = Date.now();
	const page = await ctx.newPage();
	await page.goto(BASE + path, { waitUntil: 'networkidle' });
	await ready(page, readySel);
	await inject(page);
	await pause(300);
	const t0 = Date.now();
	const trimStart = (t0 - created) / 1000;
	await runSchedule(buildSteps(page, caps), t0);
	// footage must outlast the narration
	const leftover = t0 + (dur + extraTail) * 1000 - Date.now();
	if (leftover > 0) await pause(leftover);
	await ctx.close();
	const file = await page.video().path();
	meta[id] = { file, trimStart: Math.round(trimStart * 1000) / 1000, planned: dur + extraTail };
	// persist after every beat so a mid-run crash loses nothing
	writeFileSync(join(OUT, 'meta.json'), JSON.stringify(meta, null, '\t') + '\n');
	console.log(`${id}: trimStart=${trimStart.toFixed(2)}s file=${file}`);
}

// ---------- main ----------

const browser = await chromium.launch({
	executablePath: CHROME,
	headless: true,
	args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
});

// Pre-warm: /demo signs into the shared demo account; prime every route
// so nothing is cold when the tape rolls.
const warm = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const wp = await warm.newPage();
await wp.goto(BASE + '/demo', { waitUntil: 'networkidle' });
await wp.waitForURL(BASE + '/', { timeout: 30000 });
for (const p of ['/', '/orders/3', '/orders/3/prep', '/orders/3/pack', '/recipes/11'])
	await wp.goto(BASE + p, { waitUntil: 'networkidle' });
const state = await warm.storageState();
await warm.close();
console.log('warmed');

// ---- b1/b7: brand cards (stills; audio rides over them in assembly) ----
const cardCtx = await browser.newContext({
	viewport: { width: 1280, height: 800 },
	deviceScaleFactor: 2
});
const cardPage = await cardCtx.newPage();
for (const card of ['title', 'end']) {
	await cardPage.goto('file://' + join(HERE, 'cards.html') + `?card=${card}`, {
		waitUntil: 'networkidle'
	});
	await cardPage.evaluate(() => document.fonts.ready);
	await pause(400);
	await cardPage.screenshot({ path: join(OUT, card === 'title' ? 'b1-card.png' : 'b7-card.png') });
}
await cardCtx.close();
console.log('cards done');

// ---- b2: home, then into the order ----
await recordBeat(browser, state, 'b2', '/', 'main', (page, c) => [
	// c0 "An order comes in." — hold on the upcoming-orders home
	{ at: c[1].start - 0.9, run: async () => {
		const row = page.getByRole('link', { name: /Rodriguez backyard wedding/ }).first();
		await cursorTo(page, row);
		await ring(page, row);
	} },
	// c1 "A backyard wedding, 200 guests, Aug 15." — click through
	{ at: c[1].start + 1.6, run: async () => {
		await ringOff(page);
		await page.getByRole('link', { name: /Rodriguez backyard wedding/ }).first().click();
		await ready(page, 'h1');
		await inject(page);
	} },
	// c2 "I type in the menu, the guest count," — guests field
	{ at: c[2].start, run: async () => {
		const guests = page.getByLabel(/guests/i).first();
		await cursorTo(page, guests);
		await ring(page, guests);
	} },
	// c3 "and what I'm charging a head. $13." — price field
	{ at: c[3].start, run: async () => {
		const price = page.getByLabel(/price/i).first();
		await cursorTo(page, price);
		await ring(page, price);
	} },
	// c4 "That's all CostCook needs." — ring the order subhead
	{ at: c[4].start, run: async () => {
		await ring(page, page.getByText(/Summer BBQ · 200 guests/).first());
	} },
	{ at: c[5].start + 0.8, run: async () => ringOff(page) }
]);

// ---- b3: the shopping roll-up (the money shot) ----
await recordBeat(browser, state, 'b3', '/orders/3', 'table', (page, c) => [
	// c3 "Red onion is in the pilaf and the salad." — travel to the row
	{ at: c[3].start - 0.6, run: async () => {
		const row = page.getByRole('row', { name: /Red onion/ }).first();
		await scrollToLocator(page, row, 1400, -320);
		await cursorTo(page, row);
		await ring(page, row);
	} },
	// c6 "Grouped by supplier," — widen out: ring the Green Valley subtotal
	{ at: c[6].start, run: async () => {
		await ring(page, page.getByRole('row', { name: /Green Valley Produce subtotal/ }).first());
	} },
	// c8 "3 cases of chicken thigh from Sysco." — down to Sysco
	{ at: c[8].start - 0.7, run: async () => {
		const row = page.getByRole('row', { name: /Boneless chicken thigh/ }).first();
		await scrollToLocator(page, row, 1500, -300);
		await cursorTo(page, row);
		await ring(page, row);
	} },
	// c9 "5 cases of pita from the bakery." — back up top to the pita line
	{ at: c[9].start - 0.7, run: async () => {
		const row = page.getByRole('row', { name: /^Pita|Pita 300/ }).first();
		await scrollToLocator(page, row, 1500, -220);
		await cursorTo(page, row);
		await ring(page, row);
	} },
	// c10 "Each stop gets its own subtotal." — ring the Bakery subtotal
	{ at: c[10].start, run: async () => {
		await ring(page, page.getByRole('row', { name: /Downtown Bakery subtotal/ }).first());
	} },
	// c11 "And down here, the honest number." — journey to the bottom totals
	{ at: c[11].start, run: async () => {
		await ringOff(page);
		const total = page.getByText(/Total to buy/).first();
		await scrollToLocator(page, total, 2600, -420);
	} },
	// c12 "About $900 out the door,"
	{ at: c[12].start, run: async () => {
		const row = page.getByText(/Total to buy/).first();
		await cursorTo(page, row);
		await ring(page, row, 10);
	} },
	// c13 "$785 in what the food itself costs."
	{ at: c[13].start, run: async () => {
		await ring(page, page.getByText(/Exact usage/).first(), 10);
	} },
	{ at: c[15].start, run: async () => ringOff(page) }
]);

// ---- b4: prep list ----
await recordBeat(browser, state, 'b4', '/orders/3/prep', 'table', (page, c) => [
	// c2 "You buy almost 80 lb of chicken thigh." — chicken line + note
	{ at: c[2].start - 0.5, run: async () => {
		const row = page.getByRole('row', { name: /Boneless chicken thigh/ }).first();
		await cursorTo(page, row);
		await ring(page, row);
	} },
	// c5 "The marinade? Six whole batches." — the section heading that
	// carries the batch count (match on it, not the recipe name, which
	// also appears as a narrow inline element elsewhere on the page)
	{ at: c[5].start - 0.7, run: async () => {
		await ringOff(page);
		const h = page.getByText(/6 batches/).first();
		await scrollToLocator(page, h, 1600, -240);
		await cursorTo(page, h);
		await ring(page, h, 10);
	} },
	{ at: c[6].start + 1.2, run: async () => ringOff(page) }
]);

// ---- b5: pack list ----
await recordBeat(browser, state, 'b5', '/orders/3/pack', 'table', (page, c) => [
	// c1 "Every dish, with its portion count." — ring the dish table
	{ at: c[1].start, run: async () => {
		await ring(page, page.getByRole('table').first(), 8);
	} },
	// c2 "Check each one off as it's loaded." — first check-off box
	{ at: c[2].start, run: async () => {
		const box = page.getByRole('button', { name: /^Done:/ }).first();
		await cursorTo(page, box);
		await ring(page, box, 8);
	} },
	// c3 "Equipment can ride along here too." — equipment section
	{ at: c[3].start, run: async () => {
		await ringOff(page);
		const eq = page.getByText(/Equipment/).first();
		await scrollToLocator(page, eq, 1400, -260);
		await ring(page, eq, 10);
	} },
	{ at: c[4].start + 1.0, run: async () => ringOff(page) }
]);

// ---- b6: food cost (recipe page, then the event money block) ----
await recordBeat(browser, state, 'b6', '/recipes/11', 'h1', (page, c) => [
	// c1 "Every dish knows its plate cost." — plate cost figure
	{ at: c[1].start, run: async () => {
		const pc = page.getByText(/Plate cost/).first();
		await cursorTo(page, pc);
		await ring(page, pc, 10);
	} },
	// c4 "At $5.50 they run 31.6%." — pricing block
	{ at: c[4].start - 0.6, run: async () => {
		await ringOff(page);
		const block = page.getByText(/Pricing & food cost/).first();
		await scrollToLocator(page, block, 1500, -200);
		await ring(page, page.getByText(/31.6%/).first(), 10);
	} },
	// c6 "The fix: charge $6.22 or better."
	{ at: c[6].start, run: async () => {
		await ring(page, page.getByText(/charge ≥ \$6\.22/).first(), 10);
	} },
	// c7 "Same math for the whole event." — cut to the order's money block
	{ at: c[7].start, run: async () => {
		await page.goto(BASE + '/orders/3', { waitUntil: 'networkidle' });
		await ready(page, 'table');
		await inject(page);
		const money = page.getByText(/Event food-cost/).first();
		await scrollToLocator(page, money, 900, -300);
	} },
	// c8 "$2,600 in, $785 food, 30.2%."
	{ at: c[8].start, run: async () => {
		const rev = page.getByText(/Revenue/).first();
		await cursorTo(page, rev);
		await ring(page, page.getByText(/Event food-cost %/).first(), 10);
	} },
	// c9 "A dime more a guest hits the target." (regex matching does not
	// normalize whitespace and the line wraps mid-sentence in the DOM)
	{ at: c[9].start, run: async () => {
		await ring(page, page.getByText(/\$13\.10\/guest/).first(), 10);
	} },
	{ at: c[11].start + 1.0, run: async () => ringOff(page) }
]);

await browser.close();
writeFileSync(join(OUT, 'meta.json'), JSON.stringify(meta, null, '\t') + '\n');
console.log('CAPTURE DONE');

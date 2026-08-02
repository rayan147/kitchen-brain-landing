/**
 * Silent, text-captioned walkthrough capture.
 *
 *   CUT_DIR=scripts/demo-video/cut APP=http://localhost:5900 \
 *     node scripts/demo-video/capture-silent.mjs
 *
 * Deliberately NOT the narrated rig. No voiceover, no TTS, no timings.json to
 * stay in sync with: the caption is a DOM element injected into the page before
 * the hold, so it is part of the recorded frames and needs no burn-in pass.
 * That also means one fewer thing that can drift from the footage.
 *
 * Records against a LOCAL walkthrough-seeded instance. Never production, and
 * never a real database (standing policy since PR #29). The viewport only is
 * recorded, so no hostname is ever in frame.
 *
 * Each beat gets its own context because Playwright writes one video per
 * context. Playwright also starts the tape at context creation, before
 * navigation, so every beat records how long it spent loading and writes that
 * to meta.json as `trimStart`; assemble-silent.mjs cuts it off. Without that,
 * every beat opens on a blank or half-painted screen.
 */
import { chromium } from 'playwright-core';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';

const APP = process.env.APP ?? 'http://localhost:5900';
const CUT_DIR = path.resolve(process.env.CUT_DIR ?? 'scripts/demo-video/cut');
const CHROME =
	process.env.CHROME_PATH ??
	'/home/rayan147/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';

// 1600x1000, not 1280x800: at the narrower width the app's tables crowd and a
// couple of columns wrap, which reads as a layout fault rather than a busy
// screen. The sidebar is collapsed too (see hideChrome), so the frame is almost
// entirely the thing being demonstrated.
const SIZE = { width: 1600, height: 1000 };

import { BEATS, holdFor, CAPTION_DELAY } from './beats.mjs';

/**
 * Caption bar, injected into the page so it is recorded as part of the frame.
 *
 * Sized and centred for a video, not for a web page. The cut has no narration,
 * so this bar is the entire spoken track — it is read at whatever size the
 * viewer's player renders it, which on a phone or in a half-width embed is a
 * fraction of the 1600px it was authored at. At the old 26px that meant a
 * caption a viewer had to lean in for while the numbers it referred to sat
 * right above it, unread.
 *
 * Centred because the bar is now the only text with no home of its own: at 26px
 * flush left it read as a continuation of the app's own left-aligned layout,
 * and the eye kept trying to attach it to whatever column it sat under. A
 * centred block detaches from the interface and reads as the film's voice.
 *
 * The measure cap is what stops centring from becoming unreadable — centred
 * text with ragged edges on both sides is hard to track across a long line, so
 * two shortish lines are the target, never three long ones.
 *
 * The measure is in px, not ch, and that is not fussiness. `ch` is the width of
 * a zero, which in Instrument Sans is far wider than the average character, so
 * a 60ch cap measured out at nearly 1,400px and the shortest beat still ran as
 * one edge-to-edge line. px is the only unit here whose value can be reasoned
 * about against a 1600px frame.
 *
 * 36px over a 1080px measure is a two-line budget of roughly 120 characters, and
 * the bar it produces is about 160px of a 1000px frame. Going bigger is not
 * free: at 44px the longest beat runs to three lines and the bar takes a fifth
 * of the picture, covering the very rows the caption is pointing at. If a
 * caption in beats.mjs grows past the budget, shorten the caption rather than
 * shrinking this — the caption standing alone is the whole design now.
 *
 * TWO LINES IS THE TARGET, INCLUDING FOR SHORT CAPTIONS. At a 64ch measure the
 * shorter beats fitted on one line, and a single centred line 1,470px wide runs
 * to both edges of the frame with the text-wrap balancing it has nothing to
 * balance. It read as a ticker rather than as a caption. The narrower measure
 * forces every beat into the same two-line block, so the bar is one shape for
 * the whole film instead of changing height at every cut.
 */
const CAPTION_CSS = `
#cc-cap {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 2147483647;
  background: #1F2421; color: #F4F6F4;
  font-family: 'Instrument Sans Variable', ui-sans-serif, system-ui, sans-serif;
  font-size: 36px; line-height: 1.32; font-weight: 500;
  padding: 34px 64px; letter-spacing: -0.012em;
  text-align: center; text-wrap: balance;
}
#cc-cap span { display: block; max-width: 1080px; margin: 0 auto; }
#cc-cap b { color: #8FD3B0; font-weight: 600; }
::-webkit-scrollbar { display: none; }
`;

async function ready(page) {
	await page.waitForLoadState('networkidle').catch(() => {});
	await page.evaluate(() => document.fonts?.ready).catch(() => {});
	await page.waitForTimeout(400);
}

/**
 * Collapse the left navigation before recording. It is real chrome a customer
 * sees every day, but in a 40-second video it is a quarter of the frame spent
 * on something the viewer is not being asked to look at.
 */
async function hideChrome(page) {
	const toggle = page.getByRole('button', { name: /collapse navigation/i }).first();
	await toggle.click({ timeout: 5000 }).catch(() => {});
	await page.waitForTimeout(500);
}

async function caption(page, text) {
	await page.addStyleTag({ content: CAPTION_CSS });
	await page.evaluate((t) => {
		document.getElementById('cc-cap')?.remove();
		const el = document.createElement('div');
		el.id = 'cc-cap';
		const line = document.createElement('span');
		line.textContent = t;
		el.appendChild(line);
		document.body.appendChild(el);
	}, text);
}

const browser = await chromium.launch({
	executablePath: CHROME,
	headless: true,
	args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
});

// One signed-in state, reused by every beat: no password is ever typed on camera.
const warm = await browser.newContext({ viewport: SIZE });
const wp = await warm.newPage();
await wp.goto(`${APP}/demo`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
await ready(wp);

/**
 * Navigate a list and return the href of the entry whose link text names
 * `label`. Every target is pinned by name, never by position: ids are insertion
 * order in a fresh database and "the first link" is whatever sorts first today.
 *
 * This is load-bearing, not defensive. An earlier cut took the first menu link,
 * which is Mediterranean Mezze, then quoted the Summer BBQ order's food cost
 * over it — two different menus narrated as one, and the arithmetic on screen
 * did not close. The three targets below are the three ends of one order.
 */
async function findNamed(listPath, hrefPattern, label) {
	await wp.goto(APP + listPath, { waitUntil: 'domcontentloaded', timeout: 180_000 });
	await ready(wp);
	return wp.evaluate(
		({ hrefPattern, label }) => {
			const href = new RegExp(hrefPattern);
			const name = new RegExp(label, 'i');
			return (
				[...document.querySelectorAll('a[href]')]
					.filter((a) => name.test(a.textContent || ''))
					.map((a) => a.getAttribute('href'))
					.find((h) => href.test(h)) ?? null
			);
		},
		{ hrefPattern, label }
	);
}

const orderHref = await findNamed('/orders/list', '^/orders/[^/]+$', 'rodriguez');
const menuHref = await findNamed('/catalog/menus', '^/catalog/menus/[^/]+$', 'summer bbq');
const recipeHref = await findNamed('/catalog/recipes', '^/catalog/recipes/[^/]+$', 'greek salad');
if (!orderHref || !menuHref || !recipeHref) {
	throw new Error(`missing target: order=${orderHref} menu=${menuHref} recipe=${recipeHref}`);
}
const storageState = await warm.storageState();
await warm.close();
console.log(`targets: order=${orderHref} menu=${menuHref} recipe=${recipeHref}`);

await rm(CUT_DIR, { recursive: true, force: true });
await mkdir(CUT_DIR, { recursive: true });

const meta = {};
for (const beat of BEATS) {
	const created = Date.now();
	const ctx = await browser.newContext({
		viewport: SIZE,
		storageState,
		reducedMotion: 'reduce',
		recordVideo: { dir: CUT_DIR, size: SIZE }
	});
	const page = await ctx.newPage();

	let url = beat.path;
	if (beat.useOrder) url = orderHref + (beat.suffix ?? '');
	if (beat.useMenu) url = menuHref;
	if (beat.useRecipe) url = recipeHref;

	await page.goto(APP + url, { waitUntil: 'domcontentloaded', timeout: 180_000 });
	await ready(page);
	await hideChrome(page);
	// Two framings, and the difference matters. `scrollTo` only brings a target
	// into view, which is right when the screen above it is context worth keeping
	// (b2 wants the menu's own title in frame). `scrollTop` pins the target to the
	// top of the frame, which is required when the section above is something the
	// beat must NOT show — scrollIntoViewIfNeeded is a no-op on an already-visible
	// element, and that left the shopping-list beat framed on the Green Valley rows and their
	// "304.9 each" bell peppers, the one number in this dataset that reads as
	// software rather than as a cook.
	const anchor = beat.scrollTop ?? beat.scrollTo;
	if (anchor) {
		const target = page.getByText(new RegExp(anchor)).filter({ visible: true }).first();
		if (beat.scrollTop) {
			await target
				.evaluate((el) => {
					const top = el.getBoundingClientRect().top + window.scrollY - 24;
					window.scrollTo({ top: Math.max(0, top), behavior: 'instant' });
				})
				.catch(() => {});
		} else {
			await target.scrollIntoViewIfNeeded({ timeout: 8000 }).catch(() => {});
		}
		await page.waitForTimeout(400);
	}
	// trimStart is fixed HERE, before the caption, so the kept footage opens on
	// the framed screen with nothing on it yet. The caption then lands a beat
	// later, which is the lead-in: the viewer gets to look at the screen before
	// being told what to look at. Captioning first and trimming afterwards put
	// the text on frame one of every beat and made the cut feel narrated-at.
	const trimStart = (Date.now() - created) / 1000;
	const hold = holdFor(beat);
	await page.waitForTimeout(CAPTION_DELAY * 1000);
	await caption(page, beat.caption);
	await page.waitForTimeout((hold - CAPTION_DELAY) * 1000);

	const video = page.video();
	await ctx.close(); // flushes the file
	const src = await video.path();
	const dest = path.join(CUT_DIR, `${beat.id}.webm`);
	await import('node:fs/promises').then((fs) => fs.rename(src, dest));
	meta[beat.id] = { file: `${beat.id}.webm`, trimStart, hold };
	console.log(`  ✓ ${beat.id} (trim ${trimStart.toFixed(1)}s, hold ${hold.toFixed(1)}s)`);
}

await writeFile(path.join(CUT_DIR, 'meta.json'), JSON.stringify(meta, null, 2));
await browser.close();
console.log(`\nwrote beats to ${CUT_DIR}`);

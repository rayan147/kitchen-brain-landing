/**
 * Silent, captioned, MOVING walkthrough capture.
 *
 *   APP=http://localhost:4181 CUT_DIR=scripts/demo-video/cut \
 *     node scripts/demo-video/capture-silent.mjs
 *
 * The app has to be up and seeded first, and nothing in either repo boots a
 * standing one for you: the app repo's Playwright harness starts its own
 * preview and tears it down when the run ends. `./demo/serve.sh` in the app repo
 * boots the same build with the same env and leaves it up. The order this runs
 * in matters: `npm run demo:capture` there creates the marquee order live, and
 * the targets below are resolved by name against the world it leaves behind.
 * See `docs/demo-video-rebuild-2026-08-21.md` and this directory's README.
 *
 * Records against a LOCAL walkthrough-seeded instance. Never production, and
 * never a real database (standing policy since PR #29). The viewport only is
 * recorded, so no hostname is ever in frame.
 *
 * WHAT CHANGED IN THIS GENERATION (2026-08-21). The previous cut was eleven
 * still screenshots, each held for eight to thirteen seconds with a paragraph
 * of caption under it. It read as a slideshow, which is what the owner
 * reacted to. Two things are different now:
 *
 *   1. A beat is a SEQUENCE OF CARDS, not one paragraph. beats.mjs owns them.
 *   2. A beat schedules MOTION inside its own window: a visible cursor that
 *      travels and clicks, real typing, a highlight ring that slides onto the
 *      figure the current card is talking about, and eased scrolling. The
 *      primitives are ported from capture-walkthrough.mjs, the narrated
 *      generation that never had a path to public/.
 *
 * Each beat still gets its own context because Playwright writes one video per
 * context, and Playwright still starts the tape at context creation, before
 * navigation, so every beat records how long it spent loading and writes that
 * to meta.json as `trimStart`; assemble-silent.mjs cuts it off.
 */
import { chromium } from 'playwright-core';
import { mkdir, writeFile, readFile, rm, rename } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { BEATS, beatLength, runtimeLabel, LEAD_IN } from './beats.mjs';

const APP = process.env.APP ?? 'http://localhost:4181';
// The demo's capture inbox. Loopback only, and every address it ever holds is
// under the reserved example.com (demo/README.md in the app repo).
const MAILPIT = process.env.MAILPIT ?? 'http://localhost:8025';
const CUT_DIR = path.resolve(process.env.CUT_DIR ?? 'scripts/demo-video/cut');
const CHROME =
	process.env.CHROME_PATH ??
	'/home/rayan147/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';

// 1600x1000, not 1280x800: at the narrower width the app's tables crowd and a
// couple of columns wrap, which reads as a layout fault rather than a busy
// screen. The sidebar is collapsed too (see hideChrome), so the frame is almost
// entirely the thing being demonstrated.
const SIZE = { width: 1600, height: 1000 };

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CARDS_FILE = path.join(HERE, 'cards.html');

/**
 * The end card's call to action, read out of src/lib/site.ts at capture time.
 *
 * Not typed into cards.html, and that is the whole point. The homepage now has
 * exactly ONE primary action and check-landing-claims.mjs fails the build if a
 * second one appears; a video that closes on a different ask is the same
 * mistake in a place no guard can see. The card the old rig shipped read "Book
 * a 15-min demo", which is the quiet secondary. Reading the label here means
 * the video cannot drift from the page even silently.
 */
async function ctaLabel() {
	const source = await readFile(path.join(HERE, '..', '..', 'src', 'lib', 'site.ts'), 'utf8');
	const block = /export const cta = \{([\s\S]*?)\}/.exec(source)?.[1] ?? '';
	const label = /label:\s*'([^']+)'/.exec(block)?.[1];
	if (!label) throw new Error('could not read cta.label out of src/lib/site.ts');
	return label;
}

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Caption bar, injected into the page so it is recorded as part of the frame.
 *
 * Sized and centred for a video, not for a web page. The cut has no speech, so
 * this bar is the entire narration — it is read at whatever size the viewer's
 * player renders it, which on a phone or in a half-width embed is a fraction
 * of the 1600px it was authored at.
 *
 * The measure is in px, not ch, and that is not fussiness. `ch` is the width of
 * a zero, which in Instrument Sans is far wider than the average character, so
 * a 60ch cap measured out at nearly 1,400px and the shortest card still ran as
 * one edge-to-edge line. px is the only unit here whose value can be reasoned
 * about against a 1600px frame.
 *
 * CARDS ARE SHORT NOW, so the two-line-minimum trick the old bar used is gone
 * with the paragraph that needed it. A card is six to ten words and lands on
 * one figure; it sets its own height and the bar breathes with it. What keeps
 * the bar from jumping between cards is `min-height`, not a forced wrap.
 *
 * The rise-and-fade matches the page's own `.anim-enter` register (transform
 * and opacity only, per CLAUDE.md design principle 3). Nothing here reflows.
 */
const INJECT_CSS = `
#cc-cap {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 2147483646;
  background: #1F2421; color: #F4F6F4;
  font-family: 'Instrument Sans Variable', ui-sans-serif, system-ui, sans-serif;
  /* box-sizing is NOT decoration here. Without it min-height is a CONTENT
     height and the padding is added on top, so the shipped bar was 132 + 60 =
     192px while every note about it, including the comment above, said 132. Set
     it, then read min-height as the real height of the bar. */
  box-sizing: border-box;
  /* 62px in a 1600px frame is ~13.6 CSS px once SeeItRun.astro draws the player
     at 350px inside container-page on a 390px phone. The shipped 40px card
     arrived there at 8.75px, which is not small type, it is unreadable type.
     min-height covers the tallest card the cut has (two lines: 2 x 76.9 + 72 =
     226). frame-check.mjs in this directory, run with the "cards" argument,
     measures every card and flags one that wraps to three, which would make
     the bar jump between beats. */
  font-size: 62px; line-height: 1.24; font-weight: 500;
  padding: 36px 72px; letter-spacing: -0.012em; min-height: 232px;
  display: flex; align-items: center; justify-content: center;
  text-align: center; text-wrap: balance;
}
/* THE BAR STAYS PAINTED EVEN WHEN EMPTY, and that is deliberate.
 *
 * It was briefly made transparent while empty, on the reasonable note that the
 * cut spends about nine seconds showing a dark slab with nothing in it during
 * the lead-ins and tails. Two things killed it. At 200px the bar is a fifth of
 * the frame, so having it blink out between every card means app content
 * appearing and vanishing at the bottom edge two dozen times, which is worse
 * than a steady letterbox. And it is load-bearing for framing: on b04 the bar
 * is what keeps the Live quote panel's "Estimated margin" figure out of shot,
 * and the ledger excludes margin claims. A bar that uncovers the bottom of the
 * frame whenever no card is up would have put that figure on screen twice.
 */
#cc-cap span {
  display: block; max-width: 1360px; margin: 0 auto;
  opacity: 0; transform: translateY(14px);
  transition: opacity 380ms ease-out, transform 380ms cubic-bezier(.2,.7,.3,1);
}
#cc-cap span[data-in] { opacity: 1; transform: none; }
#cc-cap b { color: #8FD3B0; font-weight: 600; }

#cc-cursor {
  position: fixed; z-index: 2147483647; width: 26px; height: 26px;
  pointer-events: none; left: 800px; top: 860px; opacity: 0;
  transition: left 620ms cubic-bezier(.4,0,.2,1), top 620ms cubic-bezier(.4,0,.2,1),
              opacity 250ms linear, transform 140ms ease-out;
}
#cc-cursor[data-down] { transform: scale(0.82); }
#cc-ring {
  position: absolute; z-index: 2147483645; pointer-events: none;
  border: 3px solid #2F7D5B; border-radius: 10px;
  box-shadow: 0 0 0 4px rgba(185,118,42,0.25); opacity: 0;
  transition: left 520ms cubic-bezier(.4,0,.2,1), top 520ms cubic-bezier(.4,0,.2,1),
              width 520ms cubic-bezier(.4,0,.2,1), height 520ms cubic-bezier(.4,0,.2,1),
              opacity 300ms linear;
}
::-webkit-scrollbar { display: none !important; }
* { scrollbar-width: none !important; }
`;

const INJECT_DOM = () => {
	document.getElementById('cc-cursor')?.remove();
	document.getElementById('cc-ring')?.remove();
	document.getElementById('cc-cap')?.remove();
	const cur = document.createElement('div');
	cur.id = 'cc-cursor';
	cur.innerHTML =
		'<svg width="26" height="26" viewBox="0 0 22 22">' +
		'<path d="M3 1l6.5 18 2.8-7.2L19.5 9z" fill="#1F2421" stroke="#F4F6F4" stroke-width="1.5"/></svg>';
	document.body.appendChild(cur);
	const ring = document.createElement('div');
	ring.id = 'cc-ring';
	document.body.appendChild(ring);
	const cap = document.createElement('div');
	cap.id = 'cc-cap';
	document.body.appendChild(cap);
};

/**
 * The card currently on screen, so `inject` can put it back.
 *
 * A click that navigates destroys the injected overlay, and `inject` rebuilds
 * it EMPTY. Any card still mid-hold across that navigation therefore vanished,
 * and nothing appeared until the next card came due. b04 is the only beat that
 * navigates twice and it lost roughly two seconds of caption each time: the
 * page changed, the narration went with it, and the beat read as a flash.
 * Reset per beat by `recordBeat`.
 */
let currentCard = '';

async function inject(page) {
	await page.addStyleTag({ content: INJECT_CSS }).catch(() => {});
	await page.evaluate(INJECT_DOM).catch(() => {});
	// Restored with `data-in` already set, NOT through showCard: a card that is
	// halfway through its hold should still be sitting there after the page
	// changes, not play its entrance again.
	if (currentCard)
		await page
			.evaluate((t) => {
				const bar = document.getElementById('cc-cap');
				if (!bar) return;
				const line = document.createElement('span');
				line.textContent = t;
				line.setAttribute('data-in', '');
				bar.appendChild(line);
			}, currentCard)
			.catch(() => {});
}

async function ready(page) {
	await page.waitForLoadState('networkidle').catch(() => {});
	await page.evaluate(() => document.fonts?.ready).catch(() => {});
	await page.waitForTimeout(400);
}

/**
 * Collapse the left navigation before recording. It is real chrome a customer
 * sees every day, but in a two-minute video it is a quarter of the frame spent
 * on something the viewer is not being asked to look at.
 */
async function hideChrome(page) {
	const toggle = page.getByRole('button', { name: /collapse navigation/i }).first();
	await toggle.click({ timeout: 5000 }).catch(() => {});
	await page.waitForTimeout(400);
}

/** One resolver for every move descriptor, so beats.mjs stays declarative. */
function locate(page, move) {
	if (move.role) return page.getByRole(move.role, { name: new RegExp(move.name, 'i') }).first();
	if (move.label) return page.getByLabel(new RegExp(move.label, 'i')).first();
	if (move.row) return page.getByRole('row', { name: new RegExp(move.row, 'i') }).first();
	return page
		.getByText(new RegExp(move.text), { exact: false })
		.filter({ visible: true })
		.first();
}

async function cursorTo(page, locator, { corner = false } = {}) {
	const box = await locator.boundingBox().catch(() => null);
	if (!box) return;
	await page.evaluate(
		([x, y]) => {
			const c = document.getElementById('cc-cursor');
			if (!c) return;
			c.style.opacity = '1';
			c.style.left = x + 'px';
			c.style.top = y + 'px';
		},
		[
			box.x + box.width * (corner ? 0.72 : 0.5),
			box.y + box.height * (corner ? 0.78 : 0.55)
		]
	);
	await pause(680);
}

/**
 * Box of a locator, optionally `up` ancestors above it. A figure on these
 * screens is a label and a value in one block, and the label is what has the
 * matchable text — ringing the match itself puts a green box around the word
 * "Revenue" and leaves the number outside it.
 */
async function boxOf(locator, up = 0) {
	if (!up) return locator.boundingBox().catch(() => null);
	return locator
		.evaluate((el, n) => {
			let node = el;
			for (let i = 0; i < n && node.parentElement; i += 1) node = node.parentElement;
			const r = node.getBoundingClientRect();
			return { x: r.x, y: r.y, width: r.width, height: r.height };
		}, up)
		.catch(() => null);
}

async function ringOn(page, locator, padding = 8, up = 0) {
	const box = await boxOf(locator, up);
	if (!box) return;
	await page.evaluate(
		([b, pad]) => {
			const r = document.getElementById('cc-ring');
			if (!r) return;
			r.style.left = b.x + window.scrollX - pad + 'px';
			r.style.top = b.y + window.scrollY - pad + 'px';
			r.style.width = b.width + pad * 2 + 'px';
			r.style.height = b.height + pad * 2 + 'px';
			r.style.opacity = '1';
		},
		[box, padding]
	);
}

async function ringOff(page) {
	await page
		.evaluate(() => {
			const r = document.getElementById('cc-ring');
			if (r) r.style.opacity = '0';
			const c = document.getElementById('cc-cursor');
			if (c) c.style.opacity = '0';
		})
		.catch(() => {});
}

/** Eased scroll to an absolute Y, ported from the narrated rig. */
async function cinematicScroll(page, toY, ms) {
	await page
		.evaluate(
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
		)
		.catch(() => {});
}

async function scrollToLocator(page, locator, ms, offset) {
	const box = await locator.boundingBox().catch(() => null);
	if (!box) return;
	const y = Math.max(0, box.y + (await page.evaluate(() => window.scrollY)) + offset);
	await cinematicScroll(page, y, ms);
}

/**
 * Show one card. The old bar replaced its text in place, which on a cut with
 * no audio read as a caption glitching rather than as a new thing being said.
 * The outgoing card leaves before the incoming one arrives.
 */
async function showCard(page, text) {
	currentCard = text;
	await page
		.evaluate(async (t) => {
			const bar = document.getElementById('cc-cap');
			if (!bar) return;
			const old = bar.firstElementChild;
			if (old) {
				old.removeAttribute('data-in');
				await new Promise((r) => setTimeout(r, 240));
				old.remove();
			}
			const line = document.createElement('span');
			line.textContent = t;
			bar.appendChild(line);
			// One frame with the start style applied, then the transition runs.
			requestAnimationFrame(() => requestAnimationFrame(() => line.setAttribute('data-in', '')));
		}, text)
		.catch(() => {});
}

/**
 * Run a beat's schedule against a clock started at t0. Every entry carries
 * `at`, in seconds from the first retained frame, so a card and the motion
 * that belongs with it are written next to each other in beats.mjs and land
 * together on screen.
 *
 * A move that throws is logged and skipped rather than killing the run. A beat
 * that loses its highlight ring is a worse video; a beat that dies halfway
 * through is no video at all, and the whole capture is twelve minutes of app
 * build away from being retried.
 */
async function runSchedule(steps, t0, beatId) {
	for (const step of steps) {
		const wait = t0 + step.at * 1000 - Date.now();
		if (wait > 0) await pause(wait);
		try {
			await step.run();
		} catch (err) {
			console.warn(`  ! ${beatId} @${step.at}s ${step.label}: ${err.message.split('\n')[0]}`);
		}
	}
}

/** Turn a beat's declarative cards and moves into one time-ordered schedule. */
function scheduleFor(page, beat) {
	const steps = [];
	let at = LEAD_IN;
	for (const card of beat.cards) {
		const text = card.text;
		steps.push({ at, label: `card "${text.slice(0, 24)}…"`, run: () => showCard(page, text) });
		at += card.hold;
	}
	for (const move of beat.moves ?? []) {
		const target = () => locate(page, move);
		const run = {
			cursor: () => cursorTo(page, target(), { corner: move.corner }),
			ring: async () => {
				await cursorTo(page, target());
				await ringOn(page, target(), move.pad, move.up);
			},
			ringOnly: () => ringOn(page, target(), move.pad, move.up),
			ringOff: () => ringOff(page),
			scroll: () => scrollToLocator(page, target(), move.ms ?? 1400, move.offset ?? -260),
			click: async () => {
				const el = target();
				await cursorTo(page, el, { corner: true });
				await page.evaluate(() => document.getElementById('cc-cursor')?.setAttribute('data-down', ''));
				await el.click({ timeout: 10_000 });
				await page.evaluate(() => document.getElementById('cc-cursor')?.removeAttribute('data-down'));
				if (move.settle !== false) await page.waitForTimeout(500);
				if (move.reinject) await inject(page);
			},
			type: async () => {
				const el = target();
				await cursorTo(page, el);
				await el.click({ timeout: 10_000 });
				await el.fill('');
				await el.pressSequentially(String(move.value), { delay: move.delay ?? 110 });
			}
		}[move.act];
		if (!run) throw new Error(`unknown move act "${move.act}" in beat ${beat.id}`);
		steps.push({ at: move.at, label: move.act, run });
	}
	return steps.sort((a, b) => a.at - b.at);
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
 * did not close.
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

const orderHref = await findNamed('/orders/list', '^/orders/\\d+$', 'alvarez');
const recipeHref = await findNamed('/catalog/recipes', '^/catalog/recipes/[^/]+$', 'braised short rib');
const ingredientHref = await findNamed('/catalog/ingredients', '/ingredients/\\d+', 'baby spinach');
if (!orderHref || !recipeHref || !ingredientHref) {
	throw new Error(
		`missing target: order=${orderHref} recipe=${recipeHref} ingredient=${ingredientHref}. ` +
			`Has the app repo's demo:seed + demo:capture run against this database?`
	);
}
const storageState = await warm.storageState();
await warm.close();
console.log(`targets: order=${orderHref} recipe=${recipeHref} ingredient=${ingredientHref}`);

/**
 * `BEATS_ONLY=b04,b07` re-records just those beats and merges them into the
 * meta.json already in CUT_DIR, instead of wiping twelve beats to fix one.
 *
 * This exists because a beat CAN fail on its own: the multi-event beat drives a
 * real form, and the first version of its date picker sat on a locator until it
 * timed out, after ten good beats had already been recorded. Losing all of them
 * to re-run one is nine wasted minutes and a re-seed.
 */
const ONLY = (process.env.BEATS_ONLY ?? '').split(',').map((s) => s.trim()).filter(Boolean);
const META_FILE = path.join(CUT_DIR, 'meta.json');
if (!ONLY.length) await rm(CUT_DIR, { recursive: true, force: true });
await mkdir(CUT_DIR, { recursive: true });
const meta = ONLY.length
	? JSON.parse(await readFile(META_FILE, 'utf8').catch(() => '{}'))
	: {};

/**
 * CAPTURE ORDER IS NOT STORY ORDER, and that is deliberate.
 *
 * The multi-event beat creates three real draft orders in the demo database.
 * Every beat after it that shows the orders list would then show a world the
 * beats before it did not, and the figure table in the commit would describe
 * neither. Beats marked `captureLast` are recorded after everything else and
 * assembled back into their story position by assemble-silent.mjs, which reads
 * the order from BEATS rather than from the filenames.
 */
const captureOrder = [...BEATS.filter((b) => !b.captureLast), ...BEATS.filter((b) => b.captureLast)];

const CTA_LABEL = await ctaLabel();
console.log(`end card CTA: ${CTA_LABEL}`);

/**
 * Named setup routines, run after the page is framed and BEFORE the tape's
 * first kept frame. Anything here is off camera.
 *
 * `threeEvents` fills the multi-event form. Filling three events on camera
 * would eat the whole inset watching a form being typed, and the inset is not
 * about typing: it is about what comes out the other end. So the beat opens on
 * a filled form with its Live quote panel already priced, and what the viewer
 * actually watches is the submit, the combined run, and the Pack tab.
 *
 * The two extra events are real menus at their own guest counts, because the
 * Live quote panel prices each one separately and a run of three identical
 * events would look like a copy button rather than a week of work.
 */
/**
 * The id of the message Mailpit holds for a given recipient, so a beat can be
 * framed on the purchase order itself rather than on the mail tool around it.
 * Resolved live because ids are per-send and the PO number embeds the order id.
 */
async function mailpitViewUrl(match) {
	const res = await fetch(`${MAILPIT}/api/v1/messages?limit=200`);
	const { messages } = await res.json();
	const hit = messages.find((m) => m.To?.some((t) => t.Address.includes(match)));
	if (!hit) throw new Error(`no message in the capture inbox addressed to "${match}"`);
	return `${MAILPIT}/view/${hit.ID}.html`;
}

const PREPARE = {
	/**
	 * Drop the magic-link mails so the inbox holds purchase orders and nothing
	 * else. The capture signs in by link, so every run deposits two or three of
	 * these next to the four vendor POs the beat is actually about.
	 */
	async inboxPOsOnly(page) {
		const res = await fetch(`${MAILPIT}/api/v1/messages?limit=200`);
		const { messages } = await res.json();
		const ids = messages.filter((m) => !/^PO-/.test(m.Subject)).map((m) => m.ID);
		if (ids.length)
			await fetch(`${MAILPIT}/api/v1/messages`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ IDs: ids })
			});
		console.log(`    inbox: dropped ${ids.length}, kept ${messages.length - ids.length} PO(s)`);
		await page.reload({ waitUntil: 'domcontentloaded' });
		await ready(page);
	},

	async threeEvents(page) {
		const pickMenu = async (menu, scope) => {
			// Fifteen menus, six previewed (MENU_PREVIEW_LIMIT in
			// MenuSelector.svelte). Everything past the sixth is only reachable
			// through the search box.
			await page.getByLabel('Search menus').fill(menu);
			await scope.getByRole('radio', { name: menu, exact: true }).click({ timeout: 15_000 });
		};
		// The date picker is a button and a calendar grid, not a text field, so a
		// day is clicked rather than typed. `.last()` because the grid's first row
		// carries the tail of the previous month, and a late day number appears
		// twice. Without a date every event on the combined run reads "No date",
		// which is honest (the field is optional) and looks like an unfinished
		// form in the one frame of the cut a viewer studies hardest.
		const pickDay = async (scope, day) => {
			await scope.getByRole('button', { name: /date/i }).first().click({ timeout: 10_000 });
			// A day cell is a div carrying [data-calendar-day], not a button, and
			// its accessible name is the whole date ("Monday, August 24, 2026").
			// So neither `getByRole('button', { name: '24' })` nor a button
			// selector matches anything, and the locator sits there until it times
			// out. Both were tried; both cost a run.
			//
			// Matched on the cell's own text and NOT on a month name, so this does
			// not go stale when HISTORY_SEED_DATE moves: the calendar opens on the
			// current month. `.last()` because the first row carries the tail of
			// the previous month, so a late day number can appear twice.
			const grid = page.getByRole('grid').first();
			await grid.waitFor({ state: 'visible', timeout: 10_000 });
			await grid
				.locator('[data-calendar-day]:not([data-disabled])')
				.filter({ hasText: new RegExp(`^${day}$`) })
				.last()
				.click({ timeout: 10_000 });
			await page.keyboard.press('Escape').catch(() => {});
			await page.waitForTimeout(250);
		};

		await pickMenu('Wedding Plated Dinner', page.getByRole('group', { name: 'Menu' }));
		await page.getByLabel('Guests').first().fill('180');
		await page.getByLabel('Client or event').first().fill('Alvarez-Whitman Wedding');
		await page.getByLabel('Price per guest').first().fill('68');
		// The marquee event first, so `.first()` on the page is its picker.
		await pickDay(page, '24');

		const extras = [
			{ name: 'Delacroix company offsite', guests: '60', menu: 'Corporate Breakfast', day: '26' },
			{ name: 'Ferraro rehearsal dinner', guests: '40', menu: 'Farmhouse Supper', day: '28' }
		];
		for (const [index, extra] of extras.entries()) {
			await page.getByRole('button', { name: 'Add another event' }).click();
			const card = page.locator('[data-ui-role="additional-order-card"]').nth(index);
			await card.getByLabel('Client or event').fill(extra.name);
			await card.getByLabel('Guests').fill(extra.guests);
			// Choosing the menu also fills that event's usual price, which is why
			// the price field is never touched here.
			await card.getByLabel('Menu').click();
			await page.getByRole('option', { name: extra.menu, exact: true }).click({ timeout: 10_000 });
			await pickDay(card, extra.day);
		}
		await page.waitForTimeout(900);
	}
};

for (const beat of captureOrder.filter((b) => !ONLY.length || ONLY.includes(b.id))) {
	const created = Date.now();
	// Each beat starts with an empty bar. Without this a reinject in the first
	// beat of a run would restore the last card of the previous one.
	currentCard = '';
	const ctx = await browser.newContext({
		viewport: SIZE,
		storageState,
		// The app's own animations stay off, so the only motion in frame is
		// motion this script scheduled.
		reducedMotion: 'reduce',
		recordVideo: { dir: CUT_DIR, size: SIZE }
	});
	const page = await ctx.newPage();

	// Title and end cards render scripts/demo-video/cards.html in the page's own
	// visual world (Fraunces, cream, ticket rule, brand lockup) rather than the
	// app. They carry no caption bar: the card IS the frame.
	if (beat.card) {
		await page.goto(`file://${CARDS_FILE}?card=${beat.card}`, { waitUntil: 'domcontentloaded' });
		await page.evaluate((label) => {
			const pill = document.querySelector('[data-cta-label]');
			if (pill) pill.textContent = label;
		}, CTA_LABEL);
		await ready(page);
		const trimStart = (Date.now() - created) / 1000;
		const hold = beatLength(beat);
		await pause(hold * 1000);
		const cardVideo = page.video();
		await ctx.close();
		await rename(await cardVideo.path(), path.join(CUT_DIR, `${beat.id}.webm`));
		meta[beat.id] = { file: `${beat.id}.webm`, trimStart, hold };
		await writeFile(META_FILE, JSON.stringify(meta, null, 2));
		console.log(`  ✓ ${beat.id} card:${beat.card} (trim ${trimStart.toFixed(1)}s, hold ${hold.toFixed(1)}s)`);
		continue;
	}

	let url = beat.path;
	if (beat.mailpitTo) url = await mailpitViewUrl(beat.mailpitTo);
	if (beat.useOrder) url = orderHref + (beat.suffix ?? '');
	if (beat.useIngredient) url = ingredientHref;
	if (beat.useRecipe) url = recipeHref;

	// Absolute URLs are part of the story too: the Mailpit inbox on :8025 is
	// where the demo's REAL sends land (never a deliverable address).
	const destination = /^https?:\/\//.test(url) ? url : APP + url;
	await page.goto(destination, { waitUntil: 'domcontentloaded', timeout: 180_000 });
	await ready(page);
	// A bare email renders at its own 720px max-width in a 1600px frame, and the
	// landing page draws that frame at 350 CSS px on a phone, so the purchase
	// order arrives about 130 device px wide. Zoom fixes that.
	//
	// ZOOM THE CONTENT ELEMENT, NEVER document.documentElement. Root zoom scales
	// every descendant including the injected overlay, which is a child of body:
	// measured, the caption bar came back 383px tall instead of 232, and the
	// ring's boundingBox coordinates are post-zoom while its left/top are applied
	// pre-zoom, so it lands nowhere near its target. Zooming the message's own
	// <main> leaves the overlay alone and keeps every box consistent.
	if (beat.zoom) {
		await page.evaluate((z) => {
			const el = document.querySelector('main') ?? document.body.firstElementChild;
			if (!el) return;
			el.style.zoom = String(z);
			el.style.margin = '0 auto';
		}, beat.zoom);
		await page.waitForTimeout(300);
	}
	if (!beat.keepChrome) await hideChrome(page);
	if (beat.prepare) {
		const prepare = PREPARE[beat.prepare];
		if (!prepare) throw new Error(`unknown prepare routine "${beat.prepare}" in beat ${beat.id}`);
		await prepare(page);
	}
	if (beat.click) {
		await page.getByText(new RegExp(beat.click)).filter({ visible: true }).first().click({ timeout: 10_000 });
		await ready(page);
	}
	// Two framings, and the difference matters. `scrollTo` only brings a target
	// into view, which is right when the screen above it is context worth
	// keeping. `scrollTop` pins the target to the top of the frame, which is
	// required when the section above is something the beat must NOT show —
	// scrollIntoViewIfNeeded is a no-op on an already-visible element, and that
	// left the shopping-list beat framed on the Green Valley rows and their
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
	await inject(page);

	// trimStart is fixed HERE, before the first card, so the kept footage opens
	// on the framed screen with nothing on it yet. The card then lands a beat
	// later, which is the lead-in: the viewer gets to look at the screen before
	// being told what to look at.
	const trimStart = (Date.now() - created) / 1000;
	const hold = beatLength(beat);
	const t0 = Date.now();
	await runSchedule(scheduleFor(page, beat), t0, beat.id);
	const leftover = t0 + hold * 1000 - Date.now();
	if (leftover > 0) await pause(leftover);

	const video = page.video();
	await ctx.close(); // flushes the file
	const src = await video.path();
	const dest = path.join(CUT_DIR, `${beat.id}.webm`);
	await rename(src, dest);
	meta[beat.id] = { file: `${beat.id}.webm`, trimStart, hold };
	// Persisted after every beat, so a beat that throws costs one beat and not
	// the whole run. BEATS_ONLY can then pick up exactly what is missing.
	await writeFile(META_FILE, JSON.stringify(meta, null, 2));
	console.log(`  ✓ ${beat.id} (trim ${trimStart.toFixed(1)}s, hold ${hold.toFixed(1)}s)`);
}

await browser.close();
console.log(`\nwrote ${BEATS.length} beats to ${CUT_DIR}`);
console.log(`storyboard runtime ${runtimeLabel()} (before fades)`);

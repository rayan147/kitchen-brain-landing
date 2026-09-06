// Captures the five setup stages from the running app, on a genuinely EMPTY
// kitchen. story: docs/stories/onboarding.story.md
//
//   APP=http://localhost:4188 node scripts/capture-setup-proof.mjs
//
// WHY A SEPARATE SCRIPT FROM capture-proof.mjs. That one drives the demo world,
// which is populated: RC-13 puts an existing kitchen into review mode, so the
// five-stage stepper never renders there. Setup only looks like setup on an
// account with nothing in it, which is the world e2e/prepare-db.mjs plus
// e2e/provision-owner.ts build (business "E2E First Kitchen", owner
// onboarding-owner@e2e.test). Stand it up the way playwright.config.ts's
// webServer does, then point APP at it.
//
// WHY NOT THE REHEARSAL PNGs. artifacts/onboarding-rehearsal/260814a/ has 18
// captures of this workflow, and every one shows the SIX-stage sidebar
// (Costing defaults, Business and suppliers, Ingredients, Recipes, Menu, First
// order). That shape was consolidated into five; RC-10 records the change.
// Shipping one beside the page's five-stage sentence would be the $1.59-vs-
// $1.62 defect again, in pictures.
//
// Rules this script keeps, from BRIEF-screenshots and RC-48:
//   - deviceScaleFactor 2; PNGs are stored at 2x and the page renders them at
//     half their pixel width
//   - a 1440 CSS px viewport, the app harness's own discipline
//   - element-bounded clips, never a hand-drawn rectangle, never through a word
//   - mouse parked at 0,0, active element blurred, animations disabled, caret
//     hidden, fonts loaded
//   - the alt text on the page is read off the pixels, by hand, afterwards
//
// Pattern: none. It is a linear walk through one workflow; the only shared
// state is the signed-in page.
import { chromium } from '/home/rayan147/kitchen-brain/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const APP = process.env.APP ?? 'http://localhost:4188';
const OWNER = 'onboarding-owner@e2e.test';
const OUT = new URL('../public/proof/setup/', import.meta.url).pathname;

// The same dish, pack and yield the page's arithmetic uses, so a reader who
// checks the screenshot against the $1.62 trace finds the same numbers.
const DISH = 'Roast chicken plate';
const KITCHEN = 'Harbor & Hearth Catering';
const INGREDIENT = 'Chicken thigh';

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
	viewport: { width: 1440, height: 900 },
	deviceScaleFactor: 2,
	reducedMotion: 'reduce'
});
const page = await context.newPage();
const shots = [];

const settle = async () => {
	await page.mouse.move(0, 0);
	// Any panel that auto-scrolled to its newest content goes back to the top,
	// so a capture never begins mid-sentence. The Sage panel re-pins itself to
	// the bottom for a beat after it settles, so this retries until the reset
	// actually holds rather than assuming one pass wins the race.
	for (let attempt = 0; attempt < 12; attempt += 1) {
		const remaining = await page.evaluate(() => {
			let worst = 0;
			for (const node of document.querySelectorAll('*')) {
				if (!/auto|scroll/.test(getComputedStyle(node).overflowY)) continue;
				if (node.scrollTop > 0) node.scrollTop = 0;
				worst = Math.max(worst, node.scrollTop);
			}
			return worst;
		});
		if (remaining === 0) break;
		await page.waitForTimeout(200);
	}
	await page.waitForTimeout(120);
	await page.evaluate(() => {
		document.activeElement instanceof HTMLElement && document.activeElement.blur();
		document.querySelectorAll('[data-ui-role="toast"], .toast').forEach((n) => n.remove());
		return document.fonts.ready;
	});
	await page.waitForTimeout(150);
};

/** Element-bounded clip: the union of the stage heading and its form. */
const ALL = process.env.ALL === '1';
/** Steps of the walk, kept out of public/ unless ALL=1: only the stage-one
 *  clip ships, and an unused PNG under public/ is a deployed file. */
const shoot = async (name, locator) => {
	if (!ALL) return;
	await settle();
	await locator.first().screenshot({
		path: `${OUT}${name}.png`,
		caret: 'hide',
		animations: 'disabled'
	});
	shots.push(name);
	console.log(`captured ${name}`);
};

/**
 * A clip from the top of the page to the bottom of the first selector that
 * resolves, full width. Element-bounded in the sense the brief means: the
 * edges are an element's own box, never a rectangle chosen by eye.
 */
const shootClip = async (name, selectors) => {
	await settle();
	const bottom = await page.evaluate((list) => {
		let bottom = 0;
		for (const selector of list) {
			const node = document.querySelector(selector);
			if (node) bottom = Math.max(bottom, node.getBoundingClientRect().bottom);
		}
		// Two things must be whole in this shot, and either can be the lower:
		// the five-stage rail (its last item is "Menu and first order") and the
		// stage's own checklist, which ends on the "Next:" line. Clipping to
		// the copy column alone cut the checklist mid-item.
		const lowest = (pattern) => {
			let edge = 0;
			for (const node of document.querySelectorAll('a, li, p')) {
				const text = (node.textContent ?? '').trim();
				if (!pattern.test(text)) continue;
				// Deepest match only: an ancestor's box would overshoot.
				if (node.querySelector('a, li, p')) continue;
				edge = Math.max(edge, node.getBoundingClientRect().bottom);
			}
			return edge;
		};
		bottom = Math.max(
			bottom,
			lowest(/^Menu and first order/),
			lowest(/^Next:/),
			// Enough of Sage's stage-aware suggestions to read several.
			lowest(/^Do I need a supplier to cost a recipe/)
		);
		// Full width on purpose: the Sage panel occupies the right edge, so
		// there is no empty third left to crop. An earlier version measured
		// "ink" to trim it, but the header's own Save and exit button sits at
		// x≈1266 and pinned the result near 1440 anyway.
		return {
			// +14, not +28: the Sage suggestions are a continuing list, so the
			// clip should end just past one card rather than open the next.
			height: bottom ? bottom + window.scrollY + 14 : document.body.scrollHeight,
			width: 1440
		};
	}, selectors);
	await page.screenshot({
		path: `${OUT}${name}.png`,
		caret: 'hide',
		animations: 'disabled',
		clip: { x: 0, y: 0, width: bottom.width, height: Math.round(bottom.height) }
	});
	shots.push(name);
	console.log(`captured ${name} (${bottom.width}x${Math.round(bottom.height)} CSS px)`);
};

/**
 * A clip from the top of the page to the bottom of the deepest element whose
 * text matches `pattern`, full width. The same element-bounded rule as
 * shootClip, for the screens where the argument ends on a button label
 * rather than a stage checklist. These ship: they are the visuals the
 * story's Part 2 is built on.
 */
const shootTo = async (name, pattern) => {
	await settle();
	const height = await page.evaluate((source) => {
		const test = new RegExp(source);
		let edge = 0;
		for (const node of document.querySelectorAll('a, button, li, p, span')) {
			const text = (node.textContent ?? '').replace(/\s+/g, ' ').trim();
			if (!test.test(text)) continue;
			if (node.querySelector('a, button, li, p, span')) continue;
			edge = Math.max(edge, node.getBoundingClientRect().bottom);
		}
		if (!edge) throw new Error(`no element matches ${source}`);
		// The card the label sits in has its own padding and border below the
		// text; +36 closes the card without opening whatever follows it.
		return Math.round(edge + window.scrollY + 36);
	}, pattern.source);
	await page.screenshot({
		path: `${OUT}${name}.png`,
		caret: 'hide',
		animations: 'disabled',
		clip: { x: 0, y: 0, width: 1440, height }
	});
	shots.push(name);
	console.log(`captured ${name} (1440x${height} CSS px)`);
};

/** A clip bounded by two labels: the top of the first, the bottom of the second. */
const shootBetween = async (name, topPattern, bottomPattern) => {
	await settle();
	const box = await page.evaluate(([topSource, bottomSource]) => {
		const edge = (source, side) => {
			const test = new RegExp(source);
			let found = null;
			for (const node of document.querySelectorAll('a, button, li, p, span, h1, h2, h3, label')) {
				const text = (node.textContent ?? '').replace(/\s+/g, ' ').trim();
				if (!test.test(text)) continue;
				if (node.querySelector('a, button, li, p, span, h2, h3, label')) continue;
				const rect = node.getBoundingClientRect();
				const value = side === 'top' ? rect.top : rect.bottom;
				found = found === null ? value : side === 'top' ? Math.min(found, value) : Math.max(found, value);
			}
			if (found === null) throw new Error(`no element matches ${source}`);
			return found + window.scrollY;
		};
		const top = Math.max(0, Math.round(edge(topSource, 'top') - 28));
		const bottom = Math.round(edge(bottomSource, 'bottom') + 28);
		// Horizontally, the card the top label sits in: its own box, so the
		// empty rail column to the left never ships as picture.
		const card = (() => {
			const test = new RegExp(topSource);
			for (const node of document.querySelectorAll('h2, h3, p, span')) {
				if (!test.test((node.textContent ?? '').replace(/\s+/g, ' ').trim())) continue;
				const box = node.closest('section, article, li, fieldset, form') ?? node.parentElement;
				return box.getBoundingClientRect();
			}
			return { left: 0, right: 1440 };
		})();
		const left = Math.max(0, Math.round(card.left - 8));
		const right = Math.min(1440, Math.round(card.right + 8));
		return { top, height: bottom - top, left, width: right - left };
	}, [topPattern.source, bottomPattern.source]);
	await page.screenshot({
		path: `${OUT}${name}.png`,
		caret: 'hide',
		animations: 'disabled',
		fullPage: true,
		clip: { x: box.left, y: box.top, width: box.width, height: box.height }
	});
	shots.push(name);
	console.log(`captured ${name} (${box.width}x${box.height} CSS px from ${box.left},${box.top})`);
};

try {
	// Magic-link sign-in, the way e2e/helpers.ts does it. MAGIC_LINK_TEST_CAPTURE
	// exposes the issued link on this instance only.
	await page.goto(`${APP}/login`);
	await page.getByLabel('Email').fill(OWNER);
	await page.getByRole('button', { name: 'Send sign-in link' }).click();
	await page.getByRole('heading', { name: 'Check your email' }).waitFor();
	let link = null;
	for (let attempt = 0; attempt < 40 && !link; attempt += 1) {
		const response = await page.request.get(
			`${APP}/api/test/magic-link?email=${encodeURIComponent(OWNER)}`
		);
		if (response.ok()) link = (await response.json()).url;
		if (!link) await page.waitForTimeout(250);
	}
	if (!link) throw new Error('no magic link captured; is MAGIC_LINK_TEST_CAPTURE set?');
	const captured = new URL(link);
	await page.goto(`${APP}${captured.pathname}${captured.search}`);
	await page.getByRole('main').getByRole('heading', { level: 1 }).first().waitFor();

	// The welcome lives at the kitchen stage, not at bare /setup: /setup with
	// progress shows the stage map instead.
	await page.goto(`${APP}/setup?stage=kitchen`);
	const welcome = page.getByRole('heading', { level: 1, name: /^Welcome/ });
	if (await welcome.isVisible().catch(() => false)) {
		await page.getByRole('radio', { name: 'Catering' }).check();
		await page.getByLabel('One dish you know well').fill(DISH);
		await page.getByRole('radio', { name: 'What an event really costs' }).check();
		await shoot('00-welcome', page.getByRole('main'));
		await page.getByRole('button', { name: 'Start setup' }).click();
	}
	const resume = page.getByRole('button', { name: 'Continue setup' });
	if (await resume.isVisible().catch(() => false)) await resume.click();

	// Stage 1 — Kitchen and suppliers. Save first, then come back: the header
	// and the rail carry the business name, and a capture that still says
	// "E2E First Kitchen" is a test fixture pretending to be a kitchen.
	await page.getByRole('heading', { level: 1, name: 'Identify your kitchen' }).waitFor();
	await page.getByLabel('Business name').fill(KITCHEN);
	await page.getByLabel('Supplier name').fill('Highland Meats');
	await page.getByLabel('Target food-cost percentage').fill('30');
	await page.getByRole('button', { name: 'Save and continue' }).click();
	await page.waitForURL(/stage=ingredients/);

	await page.goto(`${APP}/setup?stage=kitchen`);
	await page.getByRole('heading', { level: 1, name: 'Identify your kitchen' }).waitFor();

	// Sage is part of what setup offers, so the shot has to show it: the app
	// needs SAGE_ENABLED=enabled, and the panel opens from the stage header.
	// Its suggestions are derived from the stage and the records entered so
	// far (RC-49), so opening it costs no model call and the capture stays
	// deterministic. Asking a question would not be either.
	const askSage = page.getByRole('button', { name: 'Ask Sage' });
	if (!(await askSage.isVisible().catch(() => false))) {
		throw new Error('Ask Sage is not in the setup header; start the app with SAGE_ENABLED=enabled');
	}
	await askSage.click();
	await page.getByText('This stays open beside the screen you are on', { exact: false }).waitFor();
	// The panel opens scrolled to its newest turn, which starts its intro
	// mid-sentence ("far. Setup is not finished..."). Resetting right after the
	// click does not hold: it re-pins to the bottom once the suggestions
	// settle, so the reset belongs in settle(), immediately before the shot.

	// THE SHOT IS ONLY VALID IN ONE STATE. This script does not reset the
	// fixture, so a second run against the same database carries the previous
	// run's progress and silently produces a different rail: the first shipped
	// capture showed Ingredients ticked and Food facts in progress, which this
	// walk never creates. Assert the state the alt text describes, and say how
	// to get back to it rather than shooting whatever is there.
	const rail = await page.evaluate(() =>
		[...document.querySelectorAll('a, li')]
			.map((node) => (node.textContent ?? '').replace(/\s+/g, ' ').trim())
			.filter((text) => /^(\d |✓ )?(Kitchen and suppliers|Ingredients|Food facts|Recipes|Menu and first order)/.test(text))
	);
	const expected = 'Kitchen and suppliers : complete';
	if (!rail.some((text) => text.includes('Kitchen and suppliers') && /complete/i.test(text))) {
		throw new Error(`stage 1 is not complete; rail reads: ${JSON.stringify(rail)}`);
	}
	if (rail.some((text) => /Ingredients/.test(text) && /complete/i.test(text))) {
		throw new Error(
			'the fixture already has ingredients, so this run would shoot a later state than the alt describes.\n' +
				'Reset it first, from the app repo:\n' +
				'  DATABASE_URL=file:e2e/.scratch/capture.db node e2e/prepare-db.mjs\n' +
				'  npx tsx e2e/provision-owner.ts   # then rename the business off "E2E First Kitchen"'
		);
	}
	void expected;

	// The argument, not the whole form: the five-stage rail, the stage heading,
	// what it wants, and Sage open beside it. A full-page clip of this screen
	// is 3,256px tall and unreadable at any width the landing page can give it.
	await shootClip('01-kitchen', ['[data-ui-role="setup-stage-why"]']);

	// Stage 2 — Ingredients. On an empty kitchen the stage opens on three
	// choices, and the first is the invoice (RC-58). That choice, and the
	// dropzone behind it, are the two screens the story's second scene shows:
	// the reader sees the button and the "Choose files" control instead of
	// reading a list of taps.
	await page.goto(`${APP}/setup?stage=ingredients`);
	await page.getByRole('link', { name: /Import an invoice or price sheet/ }).waitFor();
	await shootTo('02-choices', /^Best when you know one dish and its pack prices by heart\.$/);
	await page.getByRole('link', { name: /Import an invoice or price sheet/ }).click();
	await page.getByRole('heading', { name: 'Import and review' }).waitFor();
	await page.getByRole('button', { name: 'Choose files', exact: true }).waitFor();
	await shootTo('02-dropzone', /^Paste text instead$/);

	// The dish's one ingredient, entered by hand so stages three and four
	// have something to open on. The shot above is the door; this is the
	// fallback it names.
	await page.goto(`${APP}/setup?stage=ingredients`);
	await page.getByRole('button', { name: 'Add ingredients manually' }).click();
	await page.getByRole('dialog', { name: 'New ingredient' }).waitFor();
	await page.getByLabel('Name', { exact: true }).fill(INGREDIENT);
	await page.getByLabel('Category').fill('Protein');
	await page.getByRole('button', { name: 'Next: add pack and price' }).click();
	await page.getByLabel('Pack name').fill('10 lb case');
	await page.getByLabel('Pack contains').fill('10');
	await page.getByLabel('Unit', { exact: true }).selectOption('lb');
	await page.getByLabel('Pack price (paid)').fill('32.00');
	await page.getByText('Trim yield and conversions', { exact: true }).click();
	await page.getByLabel('Default yield').fill('80');
	// The pack and the price the page's $1.62 trace is built from.
	await shoot('02-ingredient-pack', page.getByRole('dialog', { name: 'New ingredient' }));
	await page.getByRole('button', { name: 'Add ingredient', exact: true }).click();
	await page.getByText('Ingredient added.', { exact: false }).waitFor();
	await shoot('02-ingredients', page.locator('body'));

	// Stage 3 — Food facts.
	await page.getByRole('button', { name: 'Review food facts' }).click();
	await page.waitForURL(/stage=allergens/);
	await page.getByRole('heading', { level: 1, name: 'Review food facts' }).waitFor();
	await shoot('03-food-facts', page.locator('body'));
	// The chips: one tap per allergen, and the way out for the unsure.
	await page.getByRole('button', { name: 'Skip for now' }).first().waitFor();
	// The ingredient's card: the drafted nutrition match, the allergen chips,
	// and the way out for the unsure. Bounded by the ingredient's name and
	// the Skip control, not the whole scrolling page.
	await shootBetween('03-chips', /^Chicken thigh$/, /^Skip for now$/);

	// Stage 4 — Recipes opens on the same shape: Sage, or by hand. The
	// recipe card goes in the way the invoice did. Food facts must be
	// answered first, so confirm the one draft as shown.
	await page.getByRole('button', { name: /^Confirm all 1 draft as shown$/ }).click();
	await page.waitForTimeout(600);
	await page.goto(`${APP}/setup?stage=recipes`);
	await page.getByRole('link', { name: /Build with Sage/ }).waitFor();
	await shootTo('04-choices', /^Best when you know the ingredients and amounts for one dish\.$/);

	// The stage map, once real progress exists: "N of 5 stages complete".
	await page.goto(`${APP}/setup`);
	await page.getByRole('heading', { level: 1, name: 'Set up your kitchen' }).waitFor();
	await shoot('00-stage-map', page.locator('body'));

	console.log(`\n${shots.length} captures written to public/proof/setup/`);
	console.log('Stages 4 and 5 need the dish and the order built; extend this walk when they are wanted.');
} finally {
	await browser.close();
}

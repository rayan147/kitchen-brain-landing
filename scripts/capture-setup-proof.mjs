// Captures the five setup stages from the running app, on a genuinely EMPTY
// kitchen. story: docs/stories/first-dish.story.md
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
		bottom = Math.max(bottom, lowest(/^Menu and first order/), lowest(/^Next:/));
		// The stage's copy column stops well short of 1440, and the empty third
		// on the right only shrinks the type once the landing page scales the
		// image down. Clip to the widest thing that carries meaning.
		// Measure INK, never containers: header, nav and main all span the full
		// 1440 whatever their contents do, so including them keeps the empty
		// third the crop exists to remove.
		let right = 0;
		for (const node of document.querySelectorAll('p, li, h1, h2, a, button, span')) {
			const text = (node.textContent ?? '').trim();
			if (!text || node.getBoundingClientRect().top > bottom) continue;
			if (node.querySelector('p, li, h1, h2, a, button, span')) continue;
			const range = document.createRange();
			range.selectNodeContents(node);
			const box = range.getBoundingClientRect();
			if (box.width > 0) right = Math.max(right, box.right);
		}
		return {
			height: bottom ? bottom + window.scrollY + 28 : document.body.scrollHeight,
			width: Math.min(1440, Math.ceil(right) + 32)
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
	// The argument, not the whole form: the five-stage rail, the stage heading,
	// why the stage exists, and what it wants. A full-page clip of this screen
	// is 3,256px tall and unreadable at any width the landing page can give it.
	await shootClip('01-kitchen', ['[data-ui-role="setup-stage-why"]']);

	// Stage 2 — Ingredients. One dish's worth, entered by hand.
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

	// The stage map, once real progress exists: "N of 5 stages complete".
	await page.goto(`${APP}/setup`);
	await page.getByRole('heading', { level: 1, name: 'Set up your kitchen' }).waitFor();
	await shoot('00-stage-map', page.locator('body'));

	console.log(`\n${shots.length} captures written to public/proof/setup/`);
	console.log('Stages 4 and 5 need the dish and the order built; extend this walk when they are wanted.');
} finally {
	await browser.close();
}

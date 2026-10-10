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
// Last run 2026-10-10 against local kitchen-brain develop c90d3b9c2 (owner
// rule 2026-10-07: shoot from the newest local develop), exported with
// `git archive`, built with `npm run build:e2e`, served on :4195 with the
// harness env plus SAGE_ENABLED=enabled, and the business renamed to
// "Harbor & Hearth Catering" in the scratch DB before the walk so the
// welcome already says it. Then, against the same DB:
//
//   APP=http://localhost:4195 node scripts/capture-setup-proof.mjs
//   APP=http://localhost:4195 RESUME=after node scripts/capture-setup-proof.mjs
//   node scripts/make-webp.mjs
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
//   - a 1440 CSS px viewport, the app harness's own discipline, and a 390
//     one for the phone half of every capture (`-mobile.png`)
//   - element-bounded clips, never a hand-drawn rectangle, never through a word
//   - mouse parked at 0,0, active element blurred, animations disabled, caret
//     hidden, fonts loaded
//   - the alt text on the page is read off the pixels, by hand, afterwards
//
// Considered Template Method (one walk, per-stage hooks); not used because
// the walk is linear and runs once, so the only shared state is the
// signed-in page and a shared-hook skeleton would add a seam nothing varies
// across. Plain sequential code.
import { chromium } from '/home/rayan147/kitchen-brain/node_modules/playwright/index.mjs';
import { mkdir } from 'node:fs/promises';

const APP = process.env.APP ?? 'http://localhost:4188';
const OWNER = 'onboarding-owner@e2e.test';
const OUT = process.env.OUT_DIR ?? new URL('../public/proof/setup/', import.meta.url).pathname;

// Every scene is shot twice in the same walk: at 1440 for the desktop
// source, and at 390 (a phone) for the img every narrower screen gets, so a
// phone reads the app's own phone layout at its own size instead of panning
// across a shrunk desktop capture (mobile review 2026-10-09). One walk,
// because the walk mutates the fixture and asserts its state.
const WIDTHS = (process.env.WIDTHS ?? '1440,390').split(',').map(Number);
let viewportWidth = 1440;
let suffix = '';
const atEachWidth = async (shot) => {
	for (const width of WIDTHS) {
		viewportWidth = width;
		suffix = width < 600 ? '-mobile' : '';
		await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
		await page.waitForTimeout(250);
		await shot();
	}
	viewportWidth = 1440;
	suffix = '';
	await page.setViewportSize({ width: 1440, height: 900 });
};

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
		path: `${OUT}${name}${suffix}.png`,
		caret: 'hide',
		animations: 'disabled'
	});
	shots.push(`${name}${suffix}`);
	console.log(`captured ${name}${suffix}`);
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
			for (const node of document.querySelectorAll('a, li, p, button')) {
				const text = (node.textContent ?? '').trim();
				if (!pattern.test(text)) continue;
				// Deepest match only: an ancestor's box would overshoot.
				if (node.querySelector('a, li, p, button')) continue;
				edge = Math.max(edge, node.getBoundingClientRect().bottom);
			}
			return edge;
		};
		bottom = Math.max(
			bottom,
			lowest(/^Menu and first order/),
			lowest(/^Add one supplier/),
			// Sage's "For this step" suggestions, and no further.
			lowest(/^What is left to finish setup\?$/)
		);
		// Full width on purpose: the Sage panel occupies the right edge, so
		// there is no empty third left to crop. An earlier version measured
		// "ink" to trim it, but the header's own Save and exit button sits at
		// x≈1266 and pinned the result near 1440 anyway.
		return {
			// +14, not +28: the Sage suggestions are a continuing list, so the
			// clip should end just past one card rather than open the next.
			height: bottom ? bottom + window.scrollY + 14 : document.body.scrollHeight,
			width: window.innerWidth
		};
	}, selectors);
	await page.screenshot({
		path: `${OUT}${name}${suffix}.png`,
		caret: 'hide',
		animations: 'disabled',
		clip: { x: 0, y: 0, width: bottom.width, height: Math.round(bottom.height) }
	});
	shots.push(`${name}${suffix}`);
	console.log(`captured ${name}${suffix} (${bottom.width}x${Math.round(bottom.height)} CSS px)`);
};

/**
 * The one text matcher every bounded clip uses. For each pattern, the box
 * of the DEEPEST element whose normalised text matches it (an ancestor's box
 * would overshoot), in document coordinates, plus the box of the card it
 * sits in. Element-bounded in the sense the brief means: every clip edge is
 * an element's own box, never a rectangle chosen by eye.
 */
const boxesFor = (patterns) =>
	page.evaluate((sources) => {
		const LEAF = 'a, button, li, p, span, h1, h2, h3, label, strong, div';
		return sources.map((source) => {
			const test = new RegExp(source);
			let leaf = null;
			for (const node of document.querySelectorAll(LEAF)) {
				const text = (node.textContent ?? '').replace(/\s+/g, ' ').trim();
				if (!test.test(text)) continue;
				if (node.querySelector(LEAF)) continue;
				leaf = node;
				break;
			}
			if (!leaf) throw new Error(`no element matches ${source}`);
			const rect = (el) => {
				const r = el.getBoundingClientRect();
				return {
					top: r.top + window.scrollY,
					bottom: r.bottom + window.scrollY,
					left: r.left,
					right: r.right
				};
			};
			const card = leaf.closest('section, article, li, fieldset, form') ?? leaf.parentElement;
			return { leaf: rect(leaf), card: rect(card) };
		});
	}, patterns.map((pattern) => pattern.source));

const clip = async (name, box) => {
	await page.screenshot({
		path: `${OUT}${name}${suffix}.png`,
		caret: 'hide',
		animations: 'disabled',
		fullPage: true,
		clip: {
			x: Math.round(box.x),
			y: Math.round(box.y),
			width: Math.round(box.width),
			height: Math.round(box.height)
		}
	});
	shots.push(`${name}${suffix}`);
	console.log(`captured ${name}${suffix} (${Math.round(box.width)}x${Math.round(box.height)} CSS px)`);
};

/** From the top of the page to the bottom of `pattern`'s element, full width. */
const shootTo = async (name, pattern) => {
	await settle();
	const [{ leaf }] = await boxesFor([pattern]);
	// The card the label sits in has its own padding and border below the
	// text; +36 closes the card without opening whatever follows it.
	await clip(name, { x: 0, y: 0, width: viewportWidth, height: leaf.bottom + 36 });
};

/**
 * From `topPattern`'s element to `bottomPattern`'s. Horizontally the top
 * one's card, or `bound` (a selector) when the argument spans several
 * cards: `main` for a setup stage, so the rail and the empty right third
 * never ship as picture and the cards render large enough to read on a
 * phone.
 */
const shootBetween = async (name, topPattern, bottomPattern, bound = null, below = 20, above = 28) => {
	await settle();
	const [top, bottom] = await boxesFor([topPattern, bottomPattern]);
	const box = bound
		? await page.evaluate((selector) => {
				// "cardof:<text regex>" bounds to the whole card (a bordered,
				// rounded block) around the deepest element whose text matches,
				// for grids where the card is a div and its heading is not unique.
				let el;
				if (selector.startsWith('cardof:')) {
					const test = new RegExp(selector.slice(7));
					const LEAF = 'a, button, li, p, span, h1, h2, h3, label, strong, div';
					const leaf = [...document.querySelectorAll(LEAF)].find(
						(n) => test.test((n.textContent ?? '').replace(/\s+/g, ' ').trim()) && !n.querySelector(LEAF)
					);
					// The leaf itself may be a rounded, bordered button: walk up to the
					// first wrapper that is card-sized, not control-sized.
					el = leaf.closest('[data-slot="card"], section, article');
				} else {
					el = document.querySelector(selector);
				}
				const r = el.getBoundingClientRect();
				return {
					left: r.left,
					right: r.right,
					top: r.top + window.scrollY,
					bottom: r.bottom + window.scrollY,
					whole: selector.startsWith('cardof:')
				};
			}, bound)
		: top.card;
	const y = Math.max(0, box.whole ? box.top - 12 : top.leaf.top - above);
	const left = Math.max(0, box.left - 8);
	const right = Math.min(viewportWidth, box.right + 8);
	// +40 below the last label: enough to close the card it sits in, not
	// enough to open the next heading.
	// Margins that close the card without opening whatever follows it
	// (2026-10 review: +28/+40 showed the next card's top edge).
	const end = box.whole ? box.bottom + 12 : bottom.leaf.bottom + below;
	await clip(name, { x: left, y, width: right - left, height: end - y });
};

/** A native select or develop's listbox select, whichever the field is. */
const pick = async (locator, value, option) => {
	await locator.selectOption(value, { timeout: 1500 }).catch(async () => {
		await locator.click();
		await page.getByRole('option', { name: option }).first().click();
	});
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

	// RESUME=first-order re-shoots stage five on a fixture that already has
	// the dish, without walking (and re-asserting) the earlier stages.
	if (process.env.RESUME === 'first-order') {
		await page.goto(`${APP}/setup?stage=first-order`);
		await page.getByRole('heading', { level: 1, name: 'Cost your first order' }).waitFor();
		await page.locator('#guestCount').fill('80');
		await atEachWidth(() => shootBetween('05-first-order', /^Order details$/, /^\$1\.62 per portion$/));
		console.log(`\n${shots.length} capture written to public/proof/setup/`);
		await browser.close();
		process.exit(0);
	}

	// RESUME=after finishes setup on a fixture that reached stage five and
	// shoots the screens Part 3 of the guide is about: the completion screen,
	// Kitchen records, the Purchases actions menu (where the next invoice
	// goes), the import box outside setup, and Settings > Team & access.
	if (process.env.RESUME === 'after') {
		await page.goto(`${APP}/setup?stage=first-order`);
		const made = page.getByRole('heading', { name: 'Your first order is made' });
		if (!(await made.isVisible().catch(() => false))) {
			await page.getByRole('heading', { level: 1, name: 'Cost your first order' }).waitFor();
			await page.locator('#guestCount').fill('80');
			// Develop (2026-10) asks about guests' allergies before an order
			// exists; a blank reads the same as nobody asked.
			await page.getByRole('radio', { name: 'No', exact: true }).check();
			await page.getByRole('button', { name: 'Create first order' }).click();
			await page.waitForURL((url) => !url.search.includes('stage=first-order'));
		}
		// The completion screen moved behind "See what setup built".
		await page.goto(`${APP}/setup?complete=1`);
		await page.getByRole('heading', { name: 'Your kitchen is ready' }).waitFor();
		await atEachWidth(() => shootBetween('06-ready', /^Your kitchen is ready$/, /^Go to Today$/));

		// Develop (2026-10) moved the next invoice off the Kitchen records hub:
		// it goes in from the Purchases page's actions. One capture serves
		// every width: the desktop header is a 1,200px strip whose text cannot
		// be read at the column's width, while the phone screen shows the same
		// action with its neighbours. On a phone "Import invoice" sits in the
		// More menu above the sticky "Log purchase" bar, so the shot opens it
		// and runs from the page title to the bottom of the screen.
		await page.goto(`${APP}/purchases`);
		await page.getByRole('heading', { level: 1, name: 'Purchases' }).waitFor();
		await page.setViewportSize({ width: 390, height: 844 });
		await page.waitForLoadState('networkidle');
		await page.mouse.move(0, 0);
		await page.getByRole('button', { name: 'More' }).last().click();
		await page.getByRole('menuitem', { name: /Import invoice/ }).waitFor();
		await page.waitForTimeout(300);
		const titleTop = await page.evaluate(() => document.querySelector('main h1').getBoundingClientRect().top);
		// -16, not -28: the tab row's active underline sits just above.
		const top = Math.max(0, Math.round(titleTop - 16));
		await page.screenshot({
			path: `${OUT}07-records-mobile.png`,
			caret: 'hide',
			animations: 'disabled',
			clip: { x: 0, y: top, width: 390, height: 844 - top }
		});
		shots.push('07-records-mobile');
		console.log('captured 07-records-mobile');
		await page.keyboard.press('Escape');
		await page.setViewportSize({ width: 1440, height: 900 });

		await page.goto(`${APP}/import`);
		await page.getByRole('heading', { level: 1, name: 'Import and review' }).waitFor();
		// Desktop: the "Add documents" card alone, the box itself, at a size
		// a column can show. Phone: the stacked page down to the review panel.
		await atEachWidth(() =>
			suffix
				? shootBetween('08-import', /^Import and review$/, /^Nothing to read yet\. Add files or pasted text/, 'main')
				: shootBetween('08-import', /^Add documents$/, /^Add documents$/, 'cardof:^Add documents$')
		);

		await page.goto(`${APP}/settings/team`);
		// Develop (2026-10): "Invite people" takes up to 20 addresses and a
		// role. One example address is typed (never sent) so the button reads
		// what a reader will see: "Send 1 invitation".
		await page.getByRole('heading', { name: 'Invite people' }).waitFor();
		await page.waitForLoadState('networkidle');
		const addresses = page.getByRole('combobox', { name: 'Email addresses' });
		await addresses.fill('maria@harborhearth.example');
		await addresses.press('Enter');
		await page.getByRole('button', { name: /^Send 1 invitation$/ }).waitFor();
		await atEachWidth(() => shootBetween('09-team', /^Invite people$/, /^Send 1 invitation$/, 'cardof:^Invite people$'));

		console.log(`\n${shots.length} captures written to public/proof/setup/`);
		await browser.close();
		process.exit(0);
	}

	// The welcome lives at the kitchen stage, not at bare /setup: /setup with
	// progress shows the stage map instead.
	await page.goto(`${APP}/setup?stage=kitchen`);
	const welcome = page.getByRole('heading', { level: 1, name: /^Welcome/ });
	if (await welcome.isVisible().catch(() => false)) {
		// The radios are buttons that only answer once the page hydrates.
		await page.waitForLoadState('networkidle');
		await page.getByRole('radio', { name: 'Catering' }).check();
		await page.getByLabel('One dish you know well').fill(DISH);
		await page.getByRole('radio', { name: 'What an event really costs' }).check();
		// The first screen after sign-up: two questions, one dish. Part 1 of
		// the guide shows it so the reader sees the welcome before they meet it.
		await atEachWidth(() => shootBetween('00-welcome', /^Welcome/, /^Skip these questions$/, null, 20, 64));
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
	// Develop added a required units choice to stage one (2026-10). US
	// customary, as every other capture on the site shows.
	await pick(page.getByLabel('Show weights and volumes in'), 'imperial', 'Pounds, ounces and quarts');
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
	await page.getByText('Ask about this step.', { exact: true }).waitFor();
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
	await atEachWidth(async () => {
		// On a phone Sage opens as a full-screen sheet over the stage, so the
		// phone shot closes it: the stage is what a phone shows first.
		if (suffix) {
			await page.getByRole('button', { name: /^Close/ }).last().click();
			await page.getByText('Ask about this step.', { exact: true }).waitFor({ state: 'hidden' });
		}
		await shootClip('01-kitchen', ['[data-ui-role="setup-stage-why"]']);
	});

	// Stage 2 — Ingredients. On an empty kitchen the stage opens on three
	// choices, and the first is the invoice (RC-58). That choice, and the
	// dropzone behind it, are the two screens the story's second scene shows:
	// the reader sees the button and the "Choose files" control instead of
	// reading a list of taps.
	await page.goto(`${APP}/setup?stage=ingredients`);
	await page.getByRole('link', { name: /Import an invoice or price sheet/ }).waitFor();
	await atEachWidth(() => shootBetween('02-choices', /^Add the ingredients for /, /^Best when you know one dish and its pack prices by heart\.$/, 'main'));
	await page.getByRole('link', { name: /Import an invoice or price sheet/ }).click();
	await page.getByRole('heading', { name: 'Import and review' }).waitFor();
	await page.getByRole('button', { name: 'Choose files', exact: true }).waitFor();
	await atEachWidth(() => shootBetween('02-dropzone', /^Adding ingredients for setup$/, /^Use the invoice PDF or a photo of it\./, 'main'));

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
	await pick(page.getByLabel('Unit', { exact: true }), 'lb', 'Pound (lb)');
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
	// Sage's draft is asked for, not automatic: "Draft missing food facts with
	// Sage" runs the model pass (develop c90d3b9c2). It renders only when a
	// provider is configured, so a keyless run shoots the undrafted card. Run
	// the app with a real key (IMPORT_AI_PROVIDER unset, the key exported) for
	// the published capture: the owner's rule is real-provider Sage drafts.
	const draftWithSage = page.getByRole('button', { name: 'Draft missing food facts with Sage' });
	if (await draftWithSage.isVisible().catch(() => false)) {
		await draftWithSage.click();
		await page.getByText('Drafting food facts…').waitFor({ state: 'hidden', timeout: 120_000 }).catch(() => {});
		await page.waitForLoadState('networkidle');
		console.log('Sage drafted the food facts');
	} else {
		console.log('no Sage draft button: this run has no AI provider configured');
	}
	// The ingredient's card: the drafted nutrition match, the allergen chips,
	// and the way out for the unsure. Bounded by the ingredient's name and
	// the Skip control, not the whole scrolling page.
	await atEachWidth(() => shootBetween('03-chips', /^Chicken thigh$/, /^Skip for now$/, null, 10));

	// Stage 4 — Recipes opens on the same shape: Sage, or by hand. The
	// recipe card goes in the way the invoice did. Food facts must be
	// answered first, so confirm the one draft as shown.
	// Develop (2026-10): confirming the drafts leaves any allergen Sage could
	// not tell open, so the walk answers the one ingredient: free from the
	// nine, which is true of a chicken thigh, then saves it.
	await page.getByRole('button', { name: /^Confirm all 1 draft( as shown)?$/ }).click();
	await page.waitForURL(/confirmedFoodFacts=1/);
	await page.waitForLoadState('networkidle');
	await page.getByText('Not answered yet', { exact: true }).waitFor();
	await page.getByRole('button', { name: 'Free from the rest' }).click();
	await page.waitForTimeout(400);
	await page.getByRole('button', { name: `Save ${INGREDIENT}` }).click();
	await page.getByText(/1 of 1 (ingredients complete|saved)/).first().waitFor();
	await page.goto(`${APP}/setup?stage=recipes`);
	await page.getByRole('link', { name: /Build with Sage/ }).waitFor();
	await atEachWidth(() => shootBetween('04-choices', /^Build your first dish$/, /^Best when you know the ingredients and amounts for one dish\.$/, 'main'));

	// The dish, built by hand so stage five has something to cost: the same
	// one line the page's $1.62 trace is built from (e2e/setup-wizard.spec.ts
	// walks these controls).
	await page.getByRole('button', { name: 'Build the dish by hand' }).click();
	await page.waitForURL(/\/setup\/recipes\/\d+/);
	await page.waitForLoadState('networkidle');
	// Develop (2026-10) names the dish from the welcome answer, so the name
	// step only runs on a build that still asks for it.
	const saveName = page.getByRole('button', { name: 'Save name' });
	if (await saveName.isVisible().catch(() => false)) {
		await page.getByLabel('Recipe name').fill(DISH);
		await saveName.click();
		await page.getByText('Name saved', { exact: true }).waitFor();
	}
	const combo = page.getByLabel('Ingredient or sub-recipe');
	await combo.click();
	await combo.fill(INGREDIENT);
	await page.getByRole('option', { name: new RegExp(`^${INGREDIENT}`) }).first().click();
	await page.getByLabel('Quantity', { exact: true }).fill('180');
	await pick(page.getByLabel('Unit', { exact: true }), 'g', 'Gram (g)');
	await page.getByRole('button', { name: 'Add line', exact: true }).click();
	await page.getByText('Line added', { exact: false }).waitFor();
	// Develop edits a draft of the dish and publishes it on "Check dish and
	// continue"; older builds said "Save dish and continue".
	// Develop asks what one portion looks like in the box before the dish
	// can continue (the pack list reads it).
	const next = page.getByRole('button', { name: /^(Check|Save) dish and continue$/ });
	await next.click();
	const packing = page.getByLabel('Packing description');
	if (await packing.waitFor({ timeout: 3000 }).then(() => true, () => false)) {
		await packing.fill('One roast chicken thigh');
		await next.click();
	}
	await page.waitForURL(/stage=first-order/);

	// Stage 5 — Menu and first order: the menu already named after the dish,
	// a date, a guest count, and the one button.
	await page.getByRole('heading', { level: 1, name: 'Cost your first order' }).waitFor();
	await page.locator('#guestCount').fill('80');
	// The order card down to the dish row: the menu already named after the
	// dish, the guest count, and the per-portion cost. The button below it is
	// named in the copy; the whole form is 1,700px tall and unreadable at any
	// width the page can give it.
	await atEachWidth(() => shootBetween('05-first-order', /^Order details$/, /^\$1\.62 per portion$/));

	// The stage map, once real progress exists: "N of 5 stages complete".
	await page.goto(`${APP}/setup`);
	await page.getByRole('heading', { level: 1, name: 'Set up your kitchen' }).waitFor();
	await shoot('00-stage-map', page.locator('body'));

	console.log(`\n${shots.length} captures written to public/proof/setup/`);
	console.log('The order itself is not created: the completion screen is rendered on the page as a ticket, not shown as a capture.');
} catch (error) {
	// Where the walk stopped, so a changed screen can be read, not guessed.
	await page.screenshot({ path: `${OUT}_failure.png`, fullPage: true }).catch(() => {});
	console.error(`stopped at ${page.url()}; see ${OUT}_failure.png`);
	throw error;
} finally {
	await browser.close();
}

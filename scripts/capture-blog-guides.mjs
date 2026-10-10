// Captures the step-by-step screenshots for the blog's how-to guides, from the
// running app. One walk per guide, chosen with GUIDE=<slug>.
// story: docs/stories/blog-catering-food-labels.story.md
//
//   APP=http://localhost:4188 GUIDE=catering-food-labels node scripts/capture-blog-guides.mjs
//
// THE APP. Local kitchen-brain develop 66d0703fe (the commit every guide's
// claims were read off on 2026-10-10), exported with `git archive`, seeded
// with `npm run demo:seed` and `npm run db:backfill:revisions`, renamed to
// Harbor & Hearth Catering with US customary units, and served on 4188 with
// FEATURE_LABEL_PRINTING_ENABLED=true and MAGIC_LINK_TEST_CAPTURE=1 (the
// recipe in capture-events-proof.mjs's header). Sample data only.
//
// THE FRAMES. Phone captures at 390 CSS px, device scale 2, named
// <step>-mobile.png so integrations/blog-figures.mjs shows each one at its own
// size at every width: a guide step is read on a phone, and a 1440 frame in
// the 44rem article column would draw the app's text at 7px.
//
// The walk writes the demo database through the UI (allergen answers, a
// printed label), so a second run starts from a re-seed.
//
// Pattern: none. Considered Template Method (one walk skeleton, per-guide
// steps); not used because each guide's walk is linear and shares only the
// sign-in and the clip helper, which are plain functions.
import { chromium } from '/home/rayan147/kitchen-brain/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const APP = process.env.APP ?? 'http://localhost:4188';
const GUIDE = process.env.GUIDE;
if (!GUIDE) throw new Error('GUIDE=<blog slug> is required');
const OUT = resolve(import.meta.dirname, `../public/proof/blog/${GUIDE}`);
mkdirSync(OUT, { recursive: true });
const OWNER = 'marisol@example.com';

const browser = await chromium.launch();

async function settle(page) {
	await page.evaluate(() => document.fonts.ready);
	await page.mouse.move(0, 0);
	await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
	await page.evaluate(() => document.querySelectorAll('[data-ui-role="toast"], .toast, [data-sonner-toaster]').forEach((n) => n.remove()));
	await page.waitForTimeout(400);
}

/** Clip the union of the given locators' boxes, padded, page-relative. */
async function shoot(page, name, locators, { pad = 12, top = pad, bottom = pad } = {}) {
	await settle(page);
	const boxes = [];
	for (const locator of locators) {
		await locator.first().scrollIntoViewIfNeeded();
		const box = await locator.first().evaluate((e) => {
			const r = e.getBoundingClientRect();
			return { x: r.left + scrollX, y: r.top + scrollY, r: r.right + scrollX, b: r.bottom + scrollY };
		});
		boxes.push(box);
	}
	const vw = page.viewportSize().width;
	const x0 = Math.max(0, Math.min(...boxes.map((b) => b.x)) - pad);
	const x1 = Math.min(vw, Math.max(...boxes.map((b) => b.r)) + pad);
	const y0 = Math.max(0, Math.min(...boxes.map((b) => b.y)) - top);
	const y1 = Math.max(...boxes.map((b) => b.b)) + bottom;
	await page.screenshot({
		path: `${OUT}/${name}.png`,
		fullPage: true,
		clip: { x: x0, y: y0, width: x1 - x0, height: y1 - y0 },
		animations: 'disabled',
		caret: 'hide'
	});
	console.log('wrote', name, Math.round(x1 - x0), 'x', Math.round(y1 - y0));
}

async function signedIn(width, email = OWNER) {
	const context = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
	const page = await context.newPage();
	await page.goto(`${APP}/login`);
	await page.getByLabel('Email').fill(email);
	await page.getByRole('button', { name: 'Send sign-in link' }).click();
	await page.getByRole('heading', { name: 'Check your email' }).waitFor();
	let link = null;
	for (let i = 0; i < 40 && !link; i++) {
		const r = await page.request.get(`${APP}/api/test/magic-link?email=${encodeURIComponent(email)}`);
		if (r.ok()) link = (await r.json()).url;
		if (!link) await page.waitForTimeout(250);
	}
	if (!link) throw new Error('no magic link captured; is MAGIC_LINK_TEST_CAPTURE=1 set?');
	const u = new URL(link);
	await page.goto(`${APP}${u.pathname}${u.search}`);
	await page.getByRole('main').first().waitFor();
	return { context, page };
}

/** Answer every allergen row on an ingredient's Allergens page, then save. */
async function answerAllergens(page, ingredientId, answers, shotName = null) {
	await page.goto(`${APP}/ingredients/${ingredientId}/allergens`, { waitUntil: 'networkidle' });
	const names = await page.locator('input[type="radio"][name^="allergen-"]').evaluateAll((es) => [...new Set(es.map((e) => e.name))]);
	for (const name of names) {
		const value = answers[name.slice('allergen-'.length)] ?? 'free_from';
		// The input sits under its styled label; a DOM click sets it the way a tap does.
		const radio = page.locator(`input[type="radio"][name="${name}"][value="${value}"]`);
		await radio.evaluate((e) => e.click());
		if (!(await radio.isChecked())) throw new Error(`${name} did not take ${value}`);
	}
	// Already answered on an earlier run: nothing to save.
	if (!(await page.locator('.save-bar').count())) return;
	// Saving asks where the answer came from; the note is required.
	await page.locator('#evidence-note').fill('Package label, read Oct 10');
	if (shotName) {
		const heading = page.getByRole('heading', { level: 1 });
		// The row from its heading to its Source line; the save bar floats over
		// the rows on a phone, so it is hidden for this frame and shot alone next.
		const milkRow = page.locator('#answer-milk-contains').locator('xpath=ancestor::*[.//*[starts-with(normalize-space(.), "Source")]][1]');
		await page.evaluate(() => document.querySelector('.save-bar')?.style.setProperty('visibility', 'hidden'));
		await shoot(page, shotName, [heading, milkRow], { top: 16, bottom: 16 });
		await page.evaluate(() => document.querySelector('.save-bar')?.style.removeProperty('visibility'));
		await shoot(page, shotName.replace('-mobile', '-save-mobile'), [page.locator('.save-bar')]);
	}
	await page.getByRole('button', { name: /^Save \d+ changes?$/ }).click();
	await page.waitForFunction(() => !document.querySelector('.save-bar'), null, { timeout: 15_000 });
	await page.waitForLoadState('networkidle');
}

if (GUIDE === 'catering-food-labels') {
	// The Ishikawa fundraiser (#765): confirmed, Tue Oct 13, 29 guests, on the
	// demo world's Autumn Harvest Table menu. Wild Mushroom Polenta is labelled:
	// four ingredients, two of them dairy.
	const ORDER = 765;
	const DISH = 'Wild Mushroom Polenta';
	const { context, page } = await signedIn(390);

	// 1. The Pack page says what the labels would say today.
	await page.goto(`${APP}/orders/${ORDER}/pack`, { waitUntil: 'networkidle' });
	await shoot(page, '01-pack-warning-mobile', [page.getByRole('heading', { level: 1 }), page.getByText(/Labels will say/).locator('xpath=ancestor::*[.//a or .//button][1]')], { top: 16 });

	// 2. Each ingredient answered from its package: Parmesan contains milk.
	await answerAllergens(page, 66, { milk: 'contains' }, '02-ingredient-allergens-mobile');
	await answerAllergens(page, 63, { milk: 'contains' });
	await answerAllergens(page, 95, {});
	await answerAllergens(page, 51, {});

	// 3. Back on Pack, the dish is reviewed and Label is one tap away.
	await page.goto(`${APP}/orders/${ORDER}/pack`, { waitUntil: 'networkidle' });
	const row = page.getByRole('button', { name: `Label ${DISH}` }).locator('visible=true').first().locator(`xpath=ancestor::*[contains(., "${DISH}")][1]`);
	await shoot(page, '03-pack-row-mobile', [row]);

	// 4. The Label dialog: storage first, then the shelf life.
	const dlg = page.getByRole('dialog').first();
	for (let attempt = 0; attempt < 4 && !(await dlg.count()); attempt++) {
		await page.getByRole('button', { name: `Label ${DISH}` }).locator('visible=true').first().click();
		await page.waitForTimeout(1500);
	}
	await dlg.waitFor();
	await dlg.locator('input[name="storageState"][value="refrigerated"]').first().check({ force: true });
	await page.waitForTimeout(600);
	const shelf = dlg.getByRole('heading', { name: 'Shelf life' }).locator('xpath=ancestor::section[1] | ancestor::fieldset[1]');
	await shoot(page, '04-storage-shelf-life-mobile', [dlg.getByRole('group', { name: 'Storage condition' }), shelf]);
	const suggestion = dlg.getByRole('button', { name: /FDA Food Code/ }).first();
	if (await suggestion.count()) {
		await suggestion.click();
		await page.waitForTimeout(800);
	}

	// 5. The sticker, exactly as it will print.
	await dlg.getByRole('spinbutton', { name: 'How many physical containers?' }).fill('2');
	await dlg.getByRole('spinbutton', { name: 'How many physical containers?' }).blur();
	await page.waitForTimeout(600);
	// Down to the line saying where the allergens come from; the region's last
	// line ("Stickers 2–2 are identical…") is cut.
	await shoot(page, '05-sticker-mobile', [dlg.getByRole('heading', { name: 'The sticker' }), dlg.getByText(/^Contains and May contain are derived/)]);

	// 6. Containers, stock and the print button.
	await shoot(page, '06-print-mobile', [dlg.getByText('How many physical containers?', { exact: true }), dlg.getByRole('button', { name: /^Print \d+ labels?/ })]);
	await dlg.getByRole('button', { name: /^Print \d+ labels?/ }).click();
	await page.waitForURL(/\/labels\/print\/\d+/, { timeout: 30_000 });
	await context.close();
}

await browser.close();

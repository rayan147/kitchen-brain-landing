// Captures every product screenshot the homepage shows, from the running app,
// in one command. story: docs/stories/homepage-captures.story.md
//
//   APP=http://localhost:4181 node scripts/capture-proof.mjs [name ...]
//
// The app is the demo world (kitchen-brain-develop-demo, `sandbox/demo`,
// DATABASE_URL=file:e2e/.scratch/demo.db) with the harness env from
// demo/playwright.config.ts, so `/demo` signs in as the owner. Sage is captured
// from the Sage fixture container (SAGE=http://127.0.0.1:5392, Mailpit API on
// MAILPIT=http://127.0.0.1:8092) because the assistant runs behind a flag the
// demo world does not set; that capture is skipped, not faked, when the
// container is down.
//
// Rules this script enforces so a capture cannot drift (BRIEF-screenshots):
//   - deviceScaleFactor 2, never a video frame; PNGs are stored at 2x and the
//     page renders them at half width
//   - desktop clips at a 1440 CSS px viewport (the app harness's own
//     discipline, demo/playwright.config.ts; at 1280 the lines table wraps its
//     column heads), phone clips at 390
//   - element-bounded clips (union of locators plus the app's own padding),
//     never a hand-drawn rectangle, never through a word
//   - mouse parked at 0,0, active element blurred, animations disabled,
//     caret hidden, toasts removed, fonts loaded
//
// Pattern: none. It is a table of shots and one function that takes them;
// the only shared state is the signed-in context.
import { chromium } from '/home/rayan147/kitchen-brain/node_modules/playwright/index.mjs';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const APP = process.env.APP ?? 'http://localhost:4181';
const SAGE = process.env.SAGE ?? 'http://127.0.0.1:5392';
const MAILPIT = process.env.MAILPIT ?? 'http://127.0.0.1:8092';
const OUT = resolve(import.meta.dirname, '../public/proof');
const only = new Set(process.argv.slice(2));

// The tour's marquee order (demo/constants.ts DEMO_EVENT in the app repo).
const EVENT = { menu: 'Wedding Plated Dinner', name: 'Alvarez-Whitman Wedding', guests: '180', perGuest: '68', daysOut: 3 };

const browser = await chromium.launch({
	executablePath: '/usr/bin/google-chrome',
	headless: true,
	args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
});

const wants = (name) => only.size === 0 || only.has(name);

/** Rule 6: nothing transient in the frame. */
async function settle(page) {
	await page.waitForLoadState('load');
	await page.evaluate(() => document.fonts.ready);
	await page.mouse.move(0, 0);
	await page.evaluate(() => {
		document.activeElement?.blur?.();
		for (const t of document.querySelectorAll('[data-sonner-toaster], [role="status"][aria-live], .toast')) t.remove();
	});
	await page.waitForTimeout(500);
}

/** Union bounding box of locators in document coordinates, padded. */
async function unionBox(page, locators, pad) {
	let box = null;
	for (const l of locators) {
		await l.first().scrollIntoViewIfNeeded();
		const b = await l.first().boundingBox();
		if (!b) throw new Error('no box for locator');
		// boundingBox is viewport-relative and each scrollIntoView moves the
		// viewport, so convert every box to document space as it is read.
		const { sx, sy } = await page.evaluate(() => ({ sx: window.scrollX, sy: window.scrollY }));
		const d = { x: b.x + sx, y: b.y + sy, r: b.x + sx + b.width, b: b.y + sy + b.height };
		box = box ? { x: Math.min(box.x, d.x), y: Math.min(box.y, d.y), r: Math.max(box.r, d.r), b: Math.max(box.b, d.b) } : d;
	}
	return { x: Math.max(0, box.x - pad), y: Math.max(0, box.y - pad), width: box.r - box.x + pad * 2, height: box.b - box.y + pad * 2 };
}

async function shoot(page, name, locators, { pad = 12, fullPage = false } = {}) {
	await settle(page);
	const path = `${OUT}/${name}.png`;
	if (fullPage) {
		await page.screenshot({ path, fullPage: true, animations: 'disabled', caret: 'hide' });
	} else {
		const clip = await unionBox(page, locators, pad);
		// Below the tall viewport (a long recipe page) the window really scrolls,
		// so a document-space clip needs the full-page capture.
		const below = clip.y + clip.height > page.viewportSize().height;
		await page.screenshot({ path, clip, fullPage: below, animations: 'disabled', caret: 'hide' });
	}
	console.log('wrote', name);
}

// A tall viewport so every clip fits without scrolling: some app pages scroll
// inside <main>, where window.scrollY never moves and a document-space clip lies.
async function context(width, height = 2600) {
	const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
	const page = await ctx.newPage();
	await page.goto(APP + '/demo', { waitUntil: 'load', timeout: 120_000 });
	await page.waitForTimeout(800);
	return { ctx, page };
}

/** The wedding order from the tour: found by name, or created through the same form the tour uses. */
async function orderUrl(page) {
	await page.goto(APP + '/orders/list', { waitUntil: 'load' });
	await page.waitForTimeout(2500); // hydration: the filter and search are client-side
	await page.getByRole('button', { name: 'All', exact: true }).first().click().catch(() => {});
	await page.locator('#list-search').fill(EVENT.name).catch(() => {});
	await page.waitForTimeout(600);
	const link = page.getByRole('link', { name: new RegExp(EVENT.name) }).first();
	if (await link.count()) return new URL(await link.getAttribute('href'), page.url()).href;

	await page.goto(APP + '/orders/new', { waitUntil: 'load' });
	await page.getByLabel('Search menus').fill(EVENT.menu);
	await page.getByRole('group', { name: 'Menu' }).getByRole('radio', { name: EVENT.menu, exact: true }).check();
	await page.getByLabel('Guests').fill(EVENT.guests);
	await page.getByLabel('Client or event').fill(EVENT.name);
	const date = new Date(Date.now() + EVENT.daysOut * 86_400_000).toISOString().slice(0, 10);
	await page.locator('input[name="eventDate"]').evaluate((el, v) => {
		el.value = v;
		el.dispatchEvent(new Event('input', { bubbles: true }));
		el.dispatchEvent(new Event('change', { bubbles: true }));
	}, date);
	await page.getByLabel('Price per guest').fill(EVENT.perGuest);
	await page.getByRole('button', { name: /Create order/ }).click();
	await page.getByRole('heading', { name: EVENT.name }).waitFor({ timeout: 30_000 });
	return page.url();
}

// ---------------------------------------------------------------- desktop
{
	const { ctx, page } = await context(1440);
	const order = await orderUrl(page);
	console.log('order', order);

	if (wants('hero-pricing') || wants('outcome-quote')) {
		await page.goto(order, { waitUntil: 'load' });
		await page.locator('[data-ui-role="order-financial-summary"]').waitFor();
		const results = page.locator('[data-ui-role="financial-results"]');
		const status = page.locator('[data-ui-role="financial-status"]');
		if (wants('hero-pricing')) await shoot(page, 'hero-pricing', [results, status], { pad: 16 });
		if (wants('outcome-quote')) await shoot(page, 'outcome-quote', [status.locator('> div').first()], { pad: 12 });
	}

	if (wants('outcome-price')) {
		await page.goto(APP + '/ingredients/44', { waitUntil: 'load' });
		const aside = page.locator('aside[aria-labelledby="cost-summary-heading"]');
		await aside.waitFor();
		// The card title through the usable-cost line, not the whole 700px card.
		const title = page.locator('#cost-summary-heading').locator('xpath=ancestor::div[3]');
		const usable = aside.locator('xpath=.//*[contains(normalize-space(.),"Usable cost")][not(.//*[contains(normalize-space(.),"Usable cost")])]/ancestor::*[self::div or self::li][1]').first();
		await shoot(page, 'outcome-price', [title, usable], { pad: 12 });
	}

	if (wants('yield-lines')) {
		await page.goto(APP + '/catalog/recipes/5', { waitUntil: 'load' });
		const table = page.locator('section[aria-labelledby="lines-heading"] div[class*="overflow-x-auto"]').first();
		await table.waitFor();
		// Roma tomato, opened: 60 g in the pot, 66 g on the list.
		const roma = table.locator('tr:has-text("Roma tomato") summary').first();
		await roma.click();
		await table.locator('details[open]').first().waitFor({ timeout: 5_000 });
		// Head row through the opened Roma tomato line: the argument, not the whole recipe.
		await shoot(page, 'yield-lines', [table.locator('thead'), table.locator('tbody tr').nth(0), table.locator('tbody tr').nth(2)], { pad: 0 });
	}

	if (wants('nutrition-panel')) {
		await page.goto(APP + '/catalog/recipes/32', { waitUntil: 'load' });
		const sec = page.locator('section#nutrition');
		await sec.waitFor();
		await shoot(page, 'nutrition-panel', [sec], { pad: 0 });
	}

	await ctx.close();
}

// ------------------------------------------------------------------ phone
{
	const { ctx, page } = await context(390);
	const order = await orderUrl(page);

	if (wants('hero-pricing-mobile')) {
		await page.goto(order, { waitUntil: 'load' });
		// On a phone the money bar is folded behind its toggle, which only works once hydrated.
		await page.waitForTimeout(3000);
		await page.getByRole('button', { name: /^Money/ }).first().click();
		const guidance = page.locator('[data-ui-role="financial-guidance"]').locator('visible=true').first();
		await guidance.waitFor();
		await shoot(page, 'hero-pricing-mobile', [guidance], { pad: 8 });
	}

	// The two wide lists are taken from the phone layout: the outcome cards are a
	// quarter of the page wide, and a 1080px table shrunk into them is unreadable.
	if (wants('outcome-prep')) {
		await page.goto(order.replace(/\/?$/, '/prep'), { waitUntil: 'load' });
		const section = page.locator('section:has(h3:has-text("Braised Short Rib"))').first();
		const rows = section.locator('li[data-ui-role="order-row"]').locator('visible=true');
		await rows.first().waitFor();
		await shoot(page, 'outcome-prep', [section.locator('h3').first(), rows.nth(0), rows.nth(1)], { pad: 12 });
	}

	if (wants('outcome-po')) {
		await page.goto(order, { waitUntil: 'load' });
		const heading = page.locator('h2[id^="kitchen-vendor-"]').locator('visible=true').first();
		await heading.waitFor();
		// The vendor card: its header (name, estimate) and the first two lines.
		const header = heading.locator('xpath=ancestor::header[1]');
		const rows = header.locator('xpath=following-sibling::*[1]/*');
		await shoot(page, 'outcome-po', [header, rows.nth(0), rows.nth(1)], { pad: 12 });
	}

	if (wants('yield-lines-mobile')) {
		await page.goto(APP + '/catalog/recipes/5', { waitUntil: 'load' });
		const art = page.locator('article:has(h3:has-text("Roma tomato"))').locator('visible=true').first();
		await art.waitFor();
		await art.locator('summary').first().click();
		await art.locator('details[open]').first().waitFor({ timeout: 5_000 });
		// The line and its opened calculation; not the edit buttons under it.
		await shoot(page, 'yield-lines-mobile', [art.locator('h3').first(), art.locator('details').first()], { pad: 16 });
	}

	if (wants('nutrition-label')) {
		await page.goto(APP + '/catalog/recipes/32/nutrition-label', { waitUntil: 'load' });
		await page.waitForTimeout(800);
		await shoot(page, 'nutrition-label', [page.locator('section.label-sheet')], { pad: 0 });
	}

	await ctx.close();
}

// ------------------------------------------------------------------- sage
if (wants('sage-answer') || wants('sage-answer-mobile')) {
	const up = await fetch(SAGE + '/login').then((r) => r.ok).catch(() => false);
	if (!up) {
		console.log('sage: container not reachable at', SAGE, '- skipped (never faked)');
	} else {
		for (const [name, width] of [
			['sage-answer', 1280],
			['sage-answer-mobile', 390]
		]) {
			if (!wants(name)) continue;
			const ctx = await browser.newContext({ viewport: { width, height: 2600 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
			const page = await ctx.newPage();
			await page.goto(SAGE + '/login', { waitUntil: 'load' });
			const before = await fetch(MAILPIT + '/api/v1/messages?limit=1').then((r) => r.json()).then((j) => j.messages?.[0]?.ID);
			await page.locator('#email').fill(process.env.SAGE_EMAIL ?? 'demo@example.com');
			await page.getByRole('button', { name: /magic link|email me|send/i }).first().click();
			let url = null;
			for (let i = 0; i < 20 && !url; i++) {
				await page.waitForTimeout(500);
				const list = await fetch(MAILPIT + '/api/v1/messages?limit=1').then((r) => r.json());
				const m = list.messages?.[0];
				if (m && m.ID !== before) {
					const full = await fetch(MAILPIT + '/api/v1/message/' + m.ID).then((r) => r.json());
					url = (full.Text.match(/https?:\/\/\S+magic-link\/verify\S+/) || [])[0]?.replace(/[)>.]+$/, '');
				}
			}
			if (!url) throw new Error('no magic link captured');
			await page.goto(url, { waitUntil: 'load' });
			// The session cookie belongs to the link's host, so stay on it.
			const origin = new URL(url).origin;
			await page.goto(origin + '/sage' + (process.env.SAGE_THREAD ? '?thread=' + process.env.SAGE_THREAD : ''), { waitUntil: 'load' });
			await page.waitForTimeout(1500);
			const asked = page.locator('main').getByText(/^You asked$/i).first();
			const from = page.locator('main').getByText(/^Where this came from$/i).first();
			await asked.waitFor({ timeout: 15_000 });
			const source = from.locator('xpath=..');
			await shoot(page, name, [asked, source], { pad: 16 });
			await ctx.close();
		}
	}
}

await browser.close();
if (!existsSync(`${OUT}/hero-pricing.png`)) process.exitCode = 1;

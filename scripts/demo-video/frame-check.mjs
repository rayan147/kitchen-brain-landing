/**
 * Frame checks for the cut, kept because they are needed every time the caption
 * bar or a beat's framing changes and they are tedious to reconstruct.
 *
 *   node scripts/demo-video/frame-check.mjs cards      # bar height per card
 *   APP=... node scripts/demo-video/frame-check.mjs boxes   # ring targets per beat
 *
 * `cards` needs nothing running. `boxes` needs the app up on APP.
 */
import { chromium } from 'playwright-core';
import { BEATS } from './beats.mjs';

// Text a beat's frame must not contain, as [label, RegExp]. Declared here rather
// than in beats.mjs because it is a check, not part of the storyboard.
const MUST_NOT_SHOW = {
	b02: [['CONFIRMED badge', /Confirmed/]],
	b04: [['Estimated margin', /Estimated margin/]]
};

const MODE = process.argv[2] ?? 'cards';
const APP = process.env.APP ?? 'http://localhost:4181';
const CHROME =
	process.env.CHROME_PATH ??
	'/home/rayan147/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';
const SIZE = { width: 1600, height: 1000 };

const src = await (await import('node:fs/promises')).readFile(
	new URL('./capture-silent.mjs', import.meta.url),
	'utf8'
);
const CSS = src.match(/const INJECT_CSS = `([\s\S]*?)`;/)[1];

const browser = await chromium.launch({
	executablePath: CHROME,
	headless: true,
	args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
});
const ctx = await browser.newContext({ viewport: SIZE, reducedMotion: 'reduce' });
const page = await ctx.newPage();

if (MODE === 'cards') {
	await page.setContent('<body style="margin:0;background:#eee"></body>');
	await page.addStyleTag({ content: CSS });
	await page.evaluate(() => {
		const cap = document.createElement('div');
		cap.id = 'cc-cap';
		document.body.appendChild(cap);
	});
	let worst = 0;
	let tooTall = 0;
	for (const beat of BEATS) {
		for (const card of beat.cards) {
			if (!card.text) continue;
			const m = await page.evaluate((t) => {
				const bar = document.getElementById('cc-cap');
				bar.innerHTML = '';
				const s = document.createElement('span');
				s.textContent = t;
				s.setAttribute('data-in', '');
				bar.appendChild(s);
				const lh = parseFloat(getComputedStyle(bar).lineHeight);
				return {
					bar: Math.round(bar.getBoundingClientRect().height),
					lines: Math.round(s.getBoundingClientRect().height / lh)
				};
			}, card.text);
			worst = Math.max(worst, m.bar);
			if (m.lines >= 3) tooTall += 1;
			const flag = m.lines >= 3 ? '  <-- THREE LINES' : '';
			console.log(
				`  ${beat.id} ${String(m.bar).padStart(4)}px ${m.lines}L  ${JSON.stringify(card.text)}${flag}`
			);
		}
	}
	console.log(`\ntallest bar ${worst}px  ->  bar top sits at y=${1000 - worst}`);
	console.log('min-height must equal that, or the bar jumps between beats.');
	// Exit non-zero, or this is a comment rather than a check: a copy edit that
	// pushes a card onto a third line changes the bar height, which moves the
	// floor every ring in the cut was measured against.
	await browser.close();
	if (tooTall) {
		console.error(`\n${tooTall} card(s) wrap to three lines. Shorten them, or raise min-height in capture-silent.mjs and re-run "boxes" to re-check every ring.`);
		process.exit(1);
	}
	process.exit(0);
}

if (MODE === 'boxes') {
	// The bar's real height, from `frame-check.mjs cards`. Anything a ring frames
	// that reaches below this line is behind the caption bar in the cut.
	const BAR = Number(process.env.BAR ?? 232);
	const FLOOR = 1000 - BAR;

	await page.goto(`${APP}/demo`, { waitUntil: 'domcontentloaded', timeout: 180_000 });
	await page.waitForLoadState('networkidle').catch(() => {});

	const named = async (listPath, hrefPattern, label) => {
		await page.goto(APP + listPath, { waitUntil: 'domcontentloaded' });
		await page.waitForLoadState('networkidle').catch(() => {});
		return page.evaluate(
			({ hrefPattern, label }) => {
				const re = new RegExp(hrefPattern);
				for (const a of document.querySelectorAll('a[href]')) {
					const href = a.getAttribute('href');
					if (re.test(href) && a.textContent.includes(label)) return href;
				}
				return null;
			},
			{ hrefPattern, label }
		);
	};
	// The same list paths and labels capture-silent.mjs resolves against, and
	// they are not guessable: ingredients live under /catalog/ingredients, and
	// the beat's ingredient is baby spinach, not the arugula from the beat before.
	const orderHref = await named('/orders/list', '^/orders/\\d+$', 'Alvarez-Whitman');
	const ingredientHref = await named('/catalog/ingredients', '/ingredients/\\d+', 'Baby spinach');
	console.log(`order ${orderHref}  ingredient ${ingredientHref}\n`);

	const locate = (move) => {
		if (move.role) return page.getByRole(move.role, { name: new RegExp(move.name, 'i') }).first();
		if (move.label) return page.getByLabel(new RegExp(move.label, 'i')).first();
		if (move.row) return page.getByRole('row', { name: new RegExp(move.row, 'i') }).first();
		return page.getByText(new RegExp(move.text), { exact: false }).filter({ visible: true }).first();
	};
	const boxOf = async (loc, up = 0) => {
		let el = loc;
		for (let i = 0; i < up; i += 1) el = el.locator('xpath=..');
		return el.boundingBox().catch(() => null);
	};

	let problems = 0;
	// Two rings that resolve to the same rectangle are one ring that never moves.
	const seen = new Map();
	const report = async (beatId, move) => {
		const bb = await boxOf(locate(move), move.up ?? 0);
		const what = move.row ?? move.text ?? `${move.role}:${move.name}`;
		if (!bb) {
			problems += 1;
			console.log(`    ${move.act} ${JSON.stringify(what)}: NOT FOUND`);
			return;
		}
		const top = Math.round(bb.y);
		const bot = Math.round(bb.y + bb.height);
		// Off the TOP matters as much as behind the bar, and is easier to ship by
		// accident: getByText().first() takes the first match in the document, so
		// a string that appears on several rows resolves to the one above the
		// frame. b08 rang "received value" and got the arugula row, at y=-71.
		const bad =
			bot < 0
				? '  <-- ABOVE THE FRAME (wrong match? .first() takes the topmost)'
				: bot > FLOOR
					? top > FLOOR
						? '  <-- ENTIRELY BEHIND THE BAR'
						: '  <-- CROSSES THE BAR'
					: '';
		if (bad) problems += 1;
		// The WHOLE rectangle. Comparing only y called two rings identical when
		// they were the two halves of a side-by-side strip: same line, opposite
		// ends of the frame, and the ring slides across between them.
		const rect = `${Math.round(bb.x)},${top} ${Math.round(bb.width)}x${Math.round(bb.height)}`;
		seen.set(beatId, (seen.get(beatId) ?? []).concat([[what, rect]]));
		console.log(`    ${move.act} ${JSON.stringify(what)}: y=${top}..${bot}${bad}`);
	};

	for (const beat of BEATS) {
		if (beat.card || beat.prepare || beat.mailpitTo) continue;
		let url = beat.path;
		if (beat.useOrder) url = orderHref + (beat.suffix ?? '');
		if (beat.useIngredient) url = ingredientHref;
		if (!url || /^https?:/.test(url)) continue;
		await page.goto(APP + url, { waitUntil: 'domcontentloaded' });
		await page.waitForLoadState('networkidle').catch(() => {});
		await page.getByRole('button', { name: /collapse navigation/i }).first().click({ timeout: 5000 }).catch(() => {});
		await page.waitForTimeout(300);
		const anchor = beat.scrollTop ?? beat.scrollTo;
		if (anchor) {
			const t = page.getByText(new RegExp(anchor)).filter({ visible: true }).first();
			if (beat.scrollTop)
				await t.evaluate((el) => {
					const y = el.getBoundingClientRect().top + window.scrollY - 24;
					window.scrollTo({ top: Math.max(0, y), behavior: 'instant' });
				}).catch(() => console.log(`  !! anchor "${anchor}" NOT FOUND`));
			else await t.scrollIntoViewIfNeeded({ timeout: 8000 }).catch(() => {});
			await page.waitForTimeout(350);
		}
		console.log(`${beat.id} ${url}${anchor ? ` @ "${anchor}"` : ''}   (bar covers y>${FLOOR})`);
		seen.set(beat.id, []);
		for (const move of beat.moves ?? []) if (/^ring(Only)?$/.test(move.act)) await report(beat.id, move);
		const boxes = seen.get(beat.id) ?? [];
		for (let i = 1; i < boxes.length; i += 1)
			if (boxes[i][1] === boxes[i - 1][1]) {
				problems += 1;
				console.log(`    !! ${JSON.stringify(boxes[i][0])} rings the SAME box as ${JSON.stringify(boxes[i - 1][0])} (${boxes[i][1]}) - the ring will not move`);
			}
		// Anything the beat must NOT show. A negative y is ABOVE the viewport,
		// i.e. scrolled off and not in frame at all, so the window is [0, FLOOR).
		for (const [label, re] of MUST_NOT_SHOW[beat.id] ?? []) {
			const bb = await page.getByText(re).filter({ visible: true }).first().boundingBox().catch(() => null);
			if (bb && bb.y >= 0 && bb.y < FLOOR) {
				problems += 1;
				console.log(`    !! ${label} IS IN FRAME at y=${Math.round(bb.y)}`);
			}
		}
	}
	console.log(`\n${problems} problem(s).`);
	await browser.close();
	process.exit(problems ? 1 : 0);
}

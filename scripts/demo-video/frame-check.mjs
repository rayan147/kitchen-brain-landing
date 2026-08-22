/**
 * Frame checks for the cut, kept because they are needed every time the caption
 * bar or a beat's framing changes and they are tedious to reconstruct.
 *
 *   node scripts/demo-video/frame-check.mjs cards      # bar height per card
 *   APP=... node scripts/demo-video/frame-check.mjs boxes   # ring targets per beat
 *   node scripts/demo-video/frame-check.mjs holds      # every card's real screen time
 *
 * `cards` and `holds` need nothing running; `holds` reads the encoded
 * public/demo.mp4. `boxes` needs the app up on APP.
 */
import { chromium } from 'playwright-core';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import ffmpegPath from 'ffmpeg-static';
import { BEATS, LEAD_IN, beatLength } from './beats.mjs';

// Text a beat's frame must not contain, as [label, RegExp]. Declared here rather
// than in beats.mjs because it is a check, not part of the storyboard.
// NOTE THE COVERAGE GAP: the loop below skips any beat with `prepare`, which is
// b04, so b04's entry here does not currently run. Its framing was verified by
// measuring the live page (see the anchor note in beats.mjs) and by reading the
// delivered frames. The row stays because the constraint is real and because the
// day this checker learns to drive a prepare routine, it should already be here.
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

// WHY THIS MODE EXISTS. The capture schedule can run perfectly and the delivered
// video can still be wrong. On 2026-08-22 b01's middle card was scheduled for
// 2.6s, every step in runSchedule fired on time, no move threw, and the encoded
// cut showed that card for six tenths of a second: the recorder lost the frames,
// not the scheduler. Re-running the same beat produced a correct clip, so it is
// intermittent, which is the worst kind — it ships whenever nobody happens to
// watch that beat. This checks the artifact that actually goes on the page.
//
// The method is deliberately dumb and therefore hard to fool. Clips are trimmed
// to exactly `hold` and plain-concatenated (assemble-silent.mjs pass 2), so
// every card's window in the final file is arithmetic: cumulative beat holds,
// plus LEAD_IN, plus the cards before it. Sample the caption band just after that
// window opens and just before it closes. If the same card held the whole time,
// the two frames are near identical. If it flashed, the second frame is a
// different card and the difference is enormous.
if (MODE === 'holds') {
	const run = promisify(execFile);
	const FILE = process.env.VIDEO ?? 'public/demo.mp4';
	const FPS = 10;
	// The caption band only, downsampled to grayscale. 200x29 is far too coarse
	// to read but keeps each glyph row distinct, and it makes
	// antialiasing and encoder noise irrelevant. The band is opaque, so within a
	// beat the ONLY thing that can change these pixels is the card changing —
	// scrolling, rings, cursors and even a navigation happen above it.
	const W = 200;
	const H = 29;
	const FRAME = W * H;
	// Two samples of one still card differ by encoder noise only, measured at
	// 0.0-0.4 on this encode. Two DIFFERENT cards measure 6 and up, and 6 is a
	// pair of short similar sentences, not a comfortable gap: keep the threshold
	// nearer the noise than the signal, or a real flash reads as a card change.
	const SAME = 3;

	const diff = (a, b) => {
		let sum = 0;
		for (let i = 0; i < a.length; i += 1) sum += Math.abs(a[i] - b[i]);
		return sum / a.length;
	};

	/** Every frame of one beat's window, as grayscale byte arrays. */
	const framesOf = async (from, seconds) => {
		const { stdout } = await run(
			ffmpegPath,
			['-v', 'error', '-ss', from.toFixed(3), '-t', seconds.toFixed(3), '-i', FILE,
			 '-vf', `crop=1600:232:0:768,fps=${FPS},scale=${W}:${H},format=gray`,
			 '-f', 'rawvideo', '-'],
			{ encoding: 'buffer', maxBuffer: 1 << 24 }
		);
		const out = [];
		for (let i = 0; i + FRAME <= stdout.length; i += FRAME) out.push(stdout.subarray(i, i + FRAME));
		return out;
	};


	// AN EXPECTED WINDOW IS ENOUGH, A GLOBAL SEGMENTATION IS NOT. Segmenting the
	// whole band by "is this frame the same as the last one" splits every card in
	// two, because the 240ms cross-fade is neither the old card nor the new one,
	// and then every card in the beat is compared against the wrong segment.
	// Clips are trimmed to exactly `hold` and plain-concatenated, so each card's
	// window is arithmetic. Take the frame at the middle of the window as that
	// card's fingerprint and measure the run of frames that match it.
	// A drifted card can put the arithmetic midpoint inside the 380ms cross-fade,
	// where the frame matches neither the card before nor the card after and the
	// run measures a tenth of a second. That is the check crying wolf, not a lost
	// card, so walk off the fade to the nearest frame that actually holds.
	const settled = (frames, mid) => {
		const runLength = (i) => {
			let lo = i;
			let hi = i;
			while (lo > 0 && diff(frames[lo - 1], frames[i]) <= SAME) lo -= 1;
			while (hi + 1 < frames.length && diff(frames[hi + 1], frames[i]) <= SAME) hi += 1;
			return hi - lo + 1;
		};
		if (runLength(mid) / FPS >= 0.5) return mid;
		for (let step = 1; step <= FPS; step += 1)
			for (const i of [mid - step, mid + step])
				if (i >= 0 && i < frames.length && runLength(i) / FPS >= 0.5) return i;
		return mid;
	};

	const runAround = (frames, at) => {
		const mid = settled(frames, at);
		const ref = frames[mid];
		let lo = mid;
		let hi = mid;
		while (lo > 0 && diff(frames[lo - 1], ref) <= SAME) lo -= 1;
		while (hi + 1 < frames.length && diff(frames[hi + 1], ref) <= SAME) hi += 1;
		return { ref, seconds: (hi - lo + 1) / FPS };
	};

	let at = 0;
	let bad = 0;
	console.log(`${FILE}, caption band 1600x232 at y=768, sampled at ${FPS}fps\n`);
	for (const beat of BEATS) {
		const length = beatLength(beat);
		const beatStart = at;
		at += length;
		// Title and end beats carry no caption bar; the card IS the frame, so
		// there is nothing in this crop to measure.
		if (beat.card) continue;
		// A beat whose moves click through a navigation drifts a few tenths late,
		// so the last card can run past the beat. The margin keeps its run
		// measurable; it can only ever make a card look longer, never shorter.
		const frames = await framesOf(beatStart, length + 1.0);
		console.log(`${beat.id} ${beatStart.toFixed(1)}s..${(beatStart + length).toFixed(1)}s`);
		let cardAt = LEAD_IN;
		let previous = null;
		for (const card of beat.cards) {
			const mid = Math.round((cardAt + card.hold / 2) * FPS);
			const { ref, seconds } = runAround(frames, Math.min(mid, frames.length - 1));
			// Two consecutive cards whose middles look identical is the flash: one
			// of them never had the screen to itself, whatever the beat sheet says.
			const same = previous && diff(previous, ref) <= SAME;
			const short = seconds < card.hold * 0.66;
			if (same || short) bad += 1;
			console.log(
				`    ${seconds.toFixed(1)}s of ${card.hold.toFixed(1)}s` +
					`${same ? '  <-- SAME FRAME AS THE CARD BEFORE IT' : short ? '  <-- DID NOT HOLD' : ''}` +
					`  ${JSON.stringify(card.text)}`
			);
			previous = ref;
			cardAt += card.hold;
		}
	}
	console.log(`\n${bad} card(s) did not hold.`);
	if (bad)
		console.error('Re-capture those beats (BEATS_ONLY=b01,b04 ...) and re-assemble. This is intermittent: the schedule can be perfect and the recorder still lose the frames.');
	process.exit(bad ? 1 : 0);
}

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
		const hits = await page.evaluate(
			({ hrefPattern, label }) => {
				const re = new RegExp(hrefPattern);
				const out = new Set();
				for (const a of document.querySelectorAll('a[href]')) {
					const href = a.getAttribute('href');
					if (re.test(href) && a.textContent.includes(label)) out.add(href);
				}
				return [...out];
			},
			{ hrefPattern, label }
		);
		// Same trap as capture-silent.mjs: after b04 has run, the fixture holds a
		// DRAFT "Alvarez-Whitman Wedding" that sorts ahead of the confirmed one,
		// and every ring on receiving or the quoted band then reports NOT FOUND
		// against a page that never had them. That is a dirty fixture, not a
		// broken beat, and the two must not look alike.
		if (hits.length > 1)
			throw new Error(
				`"${label}" matches ${hits.length} links on ${listPath} (${hits.join(', ')}). ` +
					'Re-seed the app fixture before checking; b04 leaves drafts behind.'
			);
		return hits[0] ?? null;
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

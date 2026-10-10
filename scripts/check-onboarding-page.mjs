import { readFileSync } from 'node:fs';

/**
 * Built-output contract for /onboarding.
 *
 * check-landing-claims.mjs greps the SOURCE, so a page whose `arithmetic.map`
 * or stage loop stopped rendering would still pass it: the strings live in
 * the frontmatter either way. This reads the emitted HTML, so the claim has
 * to survive the build to count.
 */
const html = readFileSync(new URL('../dist/onboarding/index.html', import.meta.url), 'utf8');
const failures = [];

// Considered Chain of Responsibility; not used because this is one fixed
// build contract whose independent assertions should report together.
const requireText = (text, label) => {
	if (!html.includes(text)) failures.push(`missing ${label}: ${text}`);
};

for (const [text, label] of [
	['Start by costing one dish.', 'page identity'],
	['Stage four ends on a number.', 'plate-cost stage (RC-10)'],
	['3 parts &middot; 5 stages &middot; 1 dish', 'setup ticket stage count (RC-10)'],
	// The whole trace, not just the total: a reader checks it by hand.
	['$32.00', 'case price (RC-55)'],
	['4,535.92', 'pound-to-gram conversion (RC-55)'],
	['0.80 trim yield', 'trim yield (RC-55)'],
	['180 g', 'plated quantity (RC-55)'],
	['$1.59', 'ingredient lines subtotal (RC-55)'],
	['2% misc (the default)', 'misc default boundary (RC-55)'],
	['$1.62', 'plate cost (RC-55)'],
	['stays on its own line', 'misc stays on its own line (RC-55)'],
	// The four input guards, one phrase each.
	['does not go on', 'pack-price guard (RC-55 B-PRICE)'],
	['give the ingredient a density', 'unconvertible-unit guard (RC-55 G-UNIT)'],
	['Only the guide', 'start-over guard (RC-55 A-STARTOVER)'],
	['the same button retries', 'offline-save guard (RC-55 finding 1)'],
	['never \u201cclear\u201d', 'unknown-is-not-clear boundary (RC-55)'],
	['initial-setup-guide', 'emitted direction contract'],
	['href="/onboarding"', 'shared navigation destination'],
	['aria-current="page"', 'active navigation state'],
	['docs/stories/onboarding.story.md', 'story pointer']
]) requireText(text, label);

const stageRows = (html.match(/class="fd-stage[ "]/g) ?? []).length;
if (stageRows !== 5) failures.push(`expected 5 rendered stage rows, received ${stageRows}`);

// The ticket now maps three parts; the five stage rows are counted above.
const ticketStages = (html.match(/class="fd-ticket-n/g) ?? []).length;
if (ticketStages !== 3) failures.push(`expected 3 setup-ticket map rows, received ${ticketStages}`);
// The hero ticket is the page map: three parts, each an in-page anchor, each
// with a done-when line. A reader picks the question they came with (Krug:
// a mindless choice) and every anchor must resolve to a section id.
const mapRows = (html.match(/class="fd-ticket-n fd-map-n"/g) ?? []).length;
if (mapRows !== 3) failures.push(`expected 3 map rows in the setup ticket, received ${mapRows}`);
for (const id of ['before', 'stages', 'after']) {
	if (!html.includes(`href="#${id}"`)) failures.push(`map does not link to #${id}`);
	if (!new RegExp(`<section[^>]*\\bid="${id}"`).test(html)) failures.push(`no section carries id="${id}"`);
}
const partLabels = (html.match(/class="eyebrow fd-part-label"/g) ?? []).length;
if (partLabels !== 3) failures.push(`expected 3 part labels (Part N of 3), received ${partLabels}`);
// Each stage row names the app's own last checkmark for that stage, so a
// reader inside the app knows when the stage is finished (research pattern
// 2: a countable done-marker per step).
const doneLines = (html.match(/class="fd-stage-done"/g) ?? []).length;
if (doneLines !== 5) failures.push(`expected 5 done-when lines, received ${doneLines}`);
for (const text of ['Add one supplier', 'Confirm the ingredients, pack sizes and prices', 'Review each ingredient or leave it marked for checking', 'Check the plate cost', 'cost the order']) {
	requireText(text, `stage done-when line from SETUP_STAGE_GUIDE (${text})`);
}

// Every stage is a scene: one paragraph and the app's own screen. Five
// scenes, five captures behind them (stage two carries two, stage five none),
// each with a declared size that matches its PNG and an alt long enough to
// have been read off the pixels (RC-48). The reader sees the button; they
// do not read a list of taps.
const scenes = (html.match(/class="fd-stage fd-scene"/g) ?? []).length;
if (scenes !== 5) failures.push(`expected 5 scenes, received ${scenes}`);
// Seven captures: the welcome in Part 1, then one per stage with two on
// stage two (the cards and the dropzone behind them).
const sceneShots = html.match(/<img\b[^>]*\/proof\/setup\/[^>]*>/g) ?? [];
if (sceneShots.length !== 11) failures.push(`expected 11 setup captures on the page, received ${sceneShots.length}`);
for (const tag of sceneShots) {
	const src = tag.match(/src="([^"]+)"/)?.[1] ?? '';
	const alt = tag.match(/alt="([^"]*)"/)?.[1] ?? '';
	if (alt.length < 120) failures.push(`${src}: alt is too thin to have been read off the pixels`);
	let bytes = null;
	try {
		bytes = readFileSync(new URL(`../public${src}`, import.meta.url));
	} catch {
		failures.push(`missing public${src}`);
	}
	if (!bytes) continue;
	const w = bytes.readUInt32BE(16);
	const h = bytes.readUInt32BE(20);
	const declaredOf = (attribute) => Number(tag.match(new RegExp(`${attribute}="(\\d+)"`))?.[1] ?? 0);
	if (declaredOf('width') !== w || declaredOf('height') !== h) {
		failures.push(`${src} declares ${declaredOf('width')}x${declaredOf('height')} but the PNG is ${w}x${h}`);
	}
}
// The desktop half of each capture is a <source media="(min-width: 64rem)">
// beside the phone img (mobile review 2026-10-09). Its declared size must
// match its PNG too, or the box jumps when the desktop source loads.
for (const tag of html.match(/<source\b[^>]*srcset="\/proof\/setup\/[^"]+\.png"[^>]*>/g) ?? []) {
	const src = tag.match(/srcset="([^"]+)"/)[1];
	if (!/media="\(min-width: 64rem\)"/.test(tag)) failures.push(`${src}: desktop source must start at 64rem`);
	let bytes = null;
	try {
		bytes = readFileSync(new URL(`../public${src}`, import.meta.url));
	} catch {
		failures.push(`missing public${src}`);
	}
	if (!bytes) continue;
	const declaredOf = (attribute) => Number(tag.match(new RegExp(`${attribute}="(\\d+)"`))?.[1] ?? 0);
	if (declaredOf('width') !== bytes.readUInt32BE(16) || declaredOf('height') !== bytes.readUInt32BE(20)) {
		failures.push(`${src} source declares ${declaredOf('width')}x${declaredOf('height')} but the PNG differs`);
	}
}
for (const src of ['00-welcome', '02-choices', '02-dropzone', '03-chips', '04-choices', '05-first-order', '06-ready', '07-records', '08-import', '09-team']) {
	// Either half counts: Purchases (07) ships its phone capture at every width.
	if (!html.includes(`/proof/setup/${src}.png`) && !html.includes(`/proof/setup/${src}-mobile.png`)) {
		failures.push(`scene capture ${src} is missing`);
	}
}
// RC-58: the three choices stage two opens on and the two at stage four, by
// the app's own labels, with the upload control and the staging gate they
// end at (RC-09, RC-39). Naming the upload without the gate would be the
// overclaim RC-55 forbids.
for (const [text, label] of [
	['Import an invoice or price sheet', 'the invoice choice (RC-58)'],
	['Import an ingredient list', 'the ingredient-list choice (RC-58)'],
	['Add ingredients manually', 'the manual choice (RC-58)'],
	['Choose files', 'the dropzone control (RC-58)'],
	['Build with Sage', 'the stage-four Sage choice (RC-58)'],
	['Build the dish by hand', 'the stage-four manual choice (RC-58)'],
	['is written to your kitchen until you confirm it', 'the staging gate the uploads end at (RC-09)'],
	['quoted back to you rather than guessed at', 'the unreadable-is-not-guessed boundary (RC-39)']
]) requireText(text, label);
// Part 1 tells the reader what to have within reach: the invoice and the
// recipe, before the phone, as a ticket beside the welcome capture rather
// than a bulleted list (owner, 2026-09-06: visuals, not lists).
const haveReady = (html.match(/class="fd-ticket fd-have"/g) ?? []).length;
if (haveReady !== 1) failures.push(`expected the have-ready ticket once, received ${haveReady}`);
for (const text of ['One invoice from the supplier', 'The recipe for one dish']) {
	requireText(text, `have-ready row (${text})`);
}

const guardLines = (html.match(/<li[^>]*>[^<]*(?:does not go on|density|progress resets|button retries)/g) ?? []).length;
if (guardLines !== 4) failures.push(`expected 4 rendered guard lines, received ${guardLines}`);

// Every arithmetic row plus the total must reach the page. Four steps and one
// total: a table that renders its headings and nothing else is the failure
// this counts.
const mathsRows = (html.match(/class="fd-maths-value"/g) ?? []).length;
if (mathsRows !== 5) failures.push(`expected 4 arithmetic steps and 1 total, received ${mathsRows} value cells`);

// The scroll container hides the value column at 390px, so it must be
// reachable without a pointer (WCAG 2.1.1) and it must carry a name.
const scroll = html.match(/<div\b[^>]*class="fd-maths-scroll"[^>]*>/)?.[0] ?? '';
if (!scroll) failures.push('missing the arithmetic scroll container');
if (!scroll.includes('tabindex="0"')) failures.push('arithmetic scroll container is not keyboard focusable');
if (!scroll.includes('aria-label=')) failures.push('arithmetic scroll container has no accessible name');
if ((html.match(/<th scope="col"/g) ?? []).length !== 3) {
	failures.push('the arithmetic table must name its three columns with scope="col"');
}

// RC-48: the setup capture. Stored at 2x, rendered at half its pixel width or
// narrower, and its alt read off the pixels. A figure with no alt, or one
// rendered at full pixel width, is the failure this catches.
// Stage one ships as a picture: the desktop PNG in a <source>, the phone
// capture as the img that carries the alt and the lazy load.
const shotSource = html.match(/<source\b[^>]*srcset="\/proof\/setup\/01-kitchen\.png"[^>]*>/)?.[0] ?? '';
const shot = shotSource
	? (html.slice(html.indexOf(shotSource)).match(/<img\b[^>]*\/proof\/setup\/01-kitchen-mobile\.png[^>]*>/)?.[0] ?? '')
	: '';
if (!shot) failures.push('missing the setup capture (RC-48)');
const shotAlt = shot.match(/alt="([^"]*)"/)?.[1] ?? '';
if (shotAlt.length < 60) failures.push(`setup capture alt is too thin to read off the pixels: "${shotAlt}"`);
// 'Harbor &amp; Hearth' as authored: the source writes the entity literally and
// it survives into the emitted HTML.
for (const word of [
	'five',
	'Kitchen and suppliers',
	'Menu and first order',
	'stage 1 of 5',
	'Harbor &amp; Hearth',
	'Ask Sage'
]) {
	if (!shotAlt.includes(word)) failures.push(`setup capture alt does not name "${word}" (RC-48)`);
}
// Read the real dimensions out of the PNG header rather than pinning a
// number here: a recapture that changes the crop should update the markup,
// and this is what notices when it did not.
// Guarded: every other assertion here reports through `failures` so one run
// lists them all. An unguarded read threw ENOENT and took the checks below
// it, including the primary-CTA contract, down with it.
let png = null;
try {
	png = readFileSync(new URL('../public/proof/setup/01-kitchen.png', import.meta.url));
} catch {
	failures.push('missing public/proof/setup/01-kitchen.png');
}
const pngWidth = png ? png.readUInt32BE(16) : 0;
const pngHeight = png ? png.readUInt32BE(20) : 0;
const declared = (attribute) => Number(shotSource.match(new RegExp(`${attribute}="(\\d+)"`))?.[1] ?? 0);
if (png && (declared('width') !== pngWidth || declared('height') !== pngHeight)) {
	failures.push(
		`setup capture declares ${declared('width')}x${declared('height')} but the PNG is ${pngWidth}x${pngHeight}`
	);
}
// Stored at 2x and rendered at half its pixel width OR NARROWER (RC-48). The
// widest the page can ask for is its 72rem container less the gutters, so the
// failing direction is the container exceeding half the pixels, not the
// reverse: a capture narrower than 2304px would be upscaled and soft.
// FINDING 4: container-page is max-width:72rem, which is REM. At a 200% root
// the container is 2304px, so a rem-only cap lets the image render above half
// its pixels and go soft. .fd-shot img therefore carries a PX max-width, and
// this is the number it must not exceed.
const WIDEST_RENDER = 1152;
if (png && WIDEST_RENDER > pngWidth / 2) {
	failures.push(
		`setup capture is ${pngWidth}px, so a ${WIDEST_RENDER}px container renders it above half width (RC-48)`
	);
}
if (!/loading="lazy"/.test(shot)) failures.push('setup capture should not block the first screen');
// No test identity may ship in a capture.
for (const leak of ['E2E First Kitchen', 'e2e.test', 'sandbox/demo', 'SANDBOX BUILD']) {
	if (html.includes(leak)) failures.push(`the page leaks internal provenance: ${leak}`);
}

// Part 3 must survive the build as three scenes (next invoice, next dish,
// two emails) with their boundaries. One sentence each (owner, 2026-09-06).
const afterScenes = (html.match(/class="fd-after-scene fd-scene"/g) ?? []).length;
if (afterScenes !== 3) failures.push(`expected 3 after-setup scenes, received ${afterScenes}`);
// Every explanation on the page is one sentence: a stage body or an
// after-scene body with a second full stop is the novel nobody reads.
const bodies = [...html.matchAll(/class="fd-stage-body"[^>]*>([^<]*)</g)].map((m) => m[1]);
for (const body of bodies) {
	const stops = (body.replace(/[“”][^“”]*[“”]/g, '').match(/[.!?](\s|$)/g) ?? []).length;
	if (stops > 1) failures.push(`explanation runs past one sentence: "${body.slice(0, 60)}…"`);
}
for (const [text, label] of [
	['Your kitchen is ready', 'completion heading'],
	['Open shopping list', 'completion first action'],
	['Go to Today', 'completion second action'],
	['See what setup built', 'the door from stage five to the summary'],
	['pasted text', 'the five doors (RC-38)'],
	['quoted back', 'unreadable-is-not-guessed (RC-39)'],
	['one-time sign-in link', 'invite mechanism (RC-52)'],
	// Develop c90d3b9c2 (2026-10-10): an invitation picks Staff or Manager.
	['joins as Staff or Manager', 'invited roles (RC-52)'],
	['href="/features/team-and-access"', 'link to the Team and Access guide'],
	['id="after-menu"', 'menu track anchor'],
	['id="after-crew"', 'crew track anchor']
]) requireText(text, label);

// One primary per end of the page, both rendering the site's single CTA
// label, and the demo link never promoted to a second primary here.
const primaries = (html.match(/class="btn-primary[ "]/g) ?? []).length;
if (primaries !== 3) failures.push(`expected 3 primaries (hero, close, sticky bar), received ${primaries}`);

if (failures.length > 0) {
	console.error(`Onboarding page contract failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log('Onboarding page contract passed: five stages, the full plate-cost trace, four guards, a reachable arithmetic table, and active navigation.');

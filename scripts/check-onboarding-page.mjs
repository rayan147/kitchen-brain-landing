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
	['You do not need to enter your whole walk-in.', 'page identity'],
	['Four stages in, it prints', 'plate-cost stage (RC-10)'],
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

const stageRows = (html.match(/class="fd-stage"/g) ?? []).length;
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
for (const text of ['Add one supplier', 'Review the food facts', 'Answer every ingredient once', 'Check the plate cost', 'cost the order']) {
	requireText(text, `stage done-when line from SETUP_STAGE_GUIDE (${text})`);
}

// RC-58: the three doors into stage two. The row's verification step says the
// ledger moves before the page does when a door is added or removed, and this
// is what makes that true. The gate sentence is pinned with them: naming the
// doors without the staging rule would be the overclaim RC-55 forbids.
const doorRows = (html.match(/class="fd-door-lead"/g) ?? []).length;
if (doorRows !== 3) failures.push(`expected 3 rendered stage-two doors, received ${doorRows}`);
for (const [text, label] of [
	['An invoice or a price sheet.', 'the invoice door (RC-58)'],
	['An ingredient list.', 'the ingredient-list door (RC-58)'],
	['The form.', 'the manual door (RC-58)'],
	['is written to your catalog', 'the staging gate the doors end at (RC-09)'],
	['quoted back to you rather than guessed at', 'the unreadable-is-not-guessed boundary (RC-39)']
]) requireText(text, label);

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
const shot = html.match(/<img\b[^>]*\/proof\/setup\/01-kitchen\.png[^>]*>/)?.[0] ?? '';
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
const declared = (attribute) => Number(shot.match(new RegExp(`${attribute}="(\\d+)"`))?.[1] ?? 0);
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

// One primary per end of the page, both rendering the site's single CTA
// label, and the demo link never promoted to a second primary here.
const primaries = (html.match(/class="btn-primary[ "]/g) ?? []).length;
if (primaries !== 3) failures.push(`expected 3 primaries (hero, close, sticky bar), received ${primaries}`);

if (failures.length > 0) {
	console.error(`Onboarding page contract failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log('Onboarding page contract passed: five stages, the full plate-cost trace, four guards, a reachable arithmetic table, and active navigation.');

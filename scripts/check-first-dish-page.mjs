import { readFileSync } from 'node:fs';

/**
 * Built-output contract for /first-dish.
 *
 * check-landing-claims.mjs greps the SOURCE, so a page whose `arithmetic.map`
 * or stage loop stopped rendering would still pass it: the strings live in
 * the frontmatter either way. This reads the emitted HTML, so the claim has
 * to survive the build to count.
 */
const html = readFileSync(new URL('../dist/first-dish/index.html', import.meta.url), 'utf8');
const failures = [];

// Considered Chain of Responsibility; not used because this is one fixed
// build contract whose independent assertions should report together.
const requireText = (text, label) => {
	if (!html.includes(text)) failures.push(`missing ${label}: ${text}`);
};

for (const [text, label] of [
	['You do not need to enter your whole walk-in.', 'page identity'],
	['Four stages in, it prints', 'plate-cost stage (RC-10)'],
	['5 stages &middot; 1 dish', 'setup ticket stage count (RC-10)'],
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
	['first-dish-onboarding', 'emitted direction contract'],
	['href="/first-dish"', 'shared navigation destination'],
	['aria-current="page"', 'active navigation state'],
	['docs/stories/first-dish.story.md', 'story pointer']
]) requireText(text, label);

const stageRows = (html.match(/class="fd-stage"/g) ?? []).length;
if (stageRows !== 5) failures.push(`expected 5 rendered stage rows, received ${stageRows}`);

const ticketStages = (html.match(/class="fd-ticket-n"/g) ?? []).length;
if (ticketStages !== 5) failures.push(`expected 5 setup-ticket stages, received ${ticketStages}`);

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

// One primary per end of the page, both rendering the site's single CTA
// label, and the demo link never promoted to a second primary here.
const primaries = (html.match(/class="btn-primary[ "]/g) ?? []).length;
if (primaries !== 3) failures.push(`expected 3 primaries (hero, close, sticky bar), received ${primaries}`);

if (failures.length > 0) {
	console.error(`First-dish page contract failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log('First-dish page contract passed: five stages, the full plate-cost trace, four guards, a reachable arithmetic table, and active navigation.');

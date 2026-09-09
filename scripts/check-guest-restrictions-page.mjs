import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Built-page contract for /features/guest-restrictions-and-dietary-guards.
 *
 * WHAT THIS IS ACTUALLY GUARDING. Not that the page exists: that the four
 * boundaries RC-60 pins are still on it. This is the one page on the site whose
 * copy, softened by one friendly edit, stops being a description of a detection
 * tool and becomes a safety promise to somebody's guest. Every assertion below
 * is a sentence a rewrite would drop first.
 *
 * Considered Strategy; not used because this validates one stable built-page
 * contract and has no interchangeable validation algorithms.
 */
const dist = new URL('../dist/', import.meta.url).pathname;
const html = readFileSync(join(dist, 'features/guest-restrictions-and-dietary-guards/index.html'), 'utf8');
const homeCompare = readFileSync(join(dist, 'compare/index.html'), 'utf8');
const featureHub = readFileSync(join(dist, 'features/index.html'), 'utf8');

const fail = (message) => {
	throw new Error(`Guests' restrictions page contract: ${message}`);
};

// The boundary, above the fold, in the product's own words.
if (!html.includes('CostCook detects, it never certifies.')) {
	fail('the detect-never-certify boundary is gone from the page');
}

// The four words this capability may never say. `allergen-free` survives only
// inside the sentence that denies it, which is why the denial is stripped first.
const prose = html
	.replace(/<[^>]+>/g, ' ')
	.replace(/No screen in CostCook makes an allergen-free claim\./gi, ' ')
	.replace(/no screen makes an allergen-free claim\./gi, ' ');
for (const word of ['\\bsafe\\b', '\\bcertified\\b', '\\bguaranteed\\b', 'allergen-free']) {
	if (new RegExp(word, 'i').test(prose)) {
		fail(`the page says "${word.replace(/\\b/g, '')}", which this capability may never claim`);
	}
}

// Five diets, named. A diet quietly dropped is a capability claim quietly
// narrowed, and nothing else on the site would notice.
for (const diet of ['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-free']) {
	if (!html.includes(`data-diet="${diet}"`)) fail(`the diet list is missing ${diet}`);
}

// Three outcomes, and no fourth invented.
const outcomes = [...html.matchAll(/data-guard-outcome="([A-Za-z]+)"/g)].map((m) => m[1]);
if (outcomes.join(',') !== 'Conflict,Check,Clear') {
	fail(`the outcomes render as [${outcomes.join(', ')}]; the engine has exactly Conflict, Check, Clear`);
}

// The four limits, still four, still rendered.
const limits = (html.match(/data-dietary-limit/g) ?? []).length;
if (limits !== 4) fail(`the limits list renders ${limits} item(s); RC-60 pins four`);

// The two caps and the freeze, in the prose rather than only in a data file.
for (const [phrase, what] of [
	['Halal and kosher can only ever come back as a check', 'the halal and kosher cap'],
	['is never counted as clear', 'the unreviewed-ingredient cap'],
	['freezes the reading', 'the frozen-at-confirm boundary'],
	['Unknown is never clear.', 'the coverage snap line']
]) {
	if (!html.includes(phrase)) fail(`${what} is gone`);
}

// The worked example stays labelled as illustrative for as long as there is no
// capture. RC-48 forbids passing a diagram off as a screenshot.
if (!html.includes('data-guard-example')) fail('the worked pack-list example is gone');
if (!/Illustrative lines in the app(&rsquo;|&#8217;|\u2019)s own wording/.test(html)) {
	fail('the worked example no longer says it is illustrative, and no capture of this screen exists');
}

// It is reachable, and /compare agrees the capability ships.
if (!featureHub.includes('/features/guest-restrictions-and-dietary-guards')) {
	fail('the features hub does not link the page');
}
if (!homeCompare.includes('Guest restrictions checked per dish')) {
	fail('/compare no longer carries the shipped row this page documents');
}

console.log(
	"Guests' restrictions page contract passed: the detect-never-certify boundary, five diets, three outcomes, four limits, the two caps, the confirm freeze, and a labelled illustrative example."
);

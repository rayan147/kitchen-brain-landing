import { readFile } from 'node:fs/promises';

// The labels page contract. The one thing this guard exists for is the status:
// while src/lib/labels.ts says Coming (RC-35), the page must carry the chip,
// the plain status sentence, and the browser-only boundary, and may never
// carry the words that would make it read as shipped or printer-connected.
const pagePath = new URL('../dist/features/labels-and-printing/index.html', import.meta.url);
const featureHubPath = new URL('../dist/features/index.html', import.meta.url);
const labelsSource = await readFile(new URL('../src/lib/labels.ts', import.meta.url), 'utf8');
const comparisonSource = await readFile(new URL('../src/lib/comparison.ts', import.meta.url), 'utf8');
const faqSource = await readFile(new URL('../src/lib/faq.ts', import.meta.url), 'utf8');
const [html, featureHubHtml] = await Promise.all([readFile(pagePath, 'utf8'), readFile(featureHubPath, 'utf8')]);

const coming = /LABELS_STATUS = 'coming'/.test(labelsSource);

const required = [
	'id="features-labels"',
	'id="labels-feature-heading"',
	'id="how-a-label-is-made"',
	'id="the-record"',
	'id="what-it-prints-on"',
	'id="what-it-is-not"',
	'aria-label="On this page"',
	'data-labels-on-page-link',
	'data-full-proof-link',
	'/proof/labels/dialog-wide.png',
	'/proof/labels/sticker.png',
	'/proof/labels/print-sheet.png',
	'/proof/labels/stock-picker.png',
	'LABEL PREVIEW',
	'blank label is not an all-clear',
	'never guesses a date',
	'browser’s print dialog',
	'id="faq-heading"',
	'Is kitchen label printing available now?',
	'Does it send labels straight to a label printer?',
	'Print what you chose. Keep the record.'
];
if (coming) required.push('Kitchen date labels are coming. Preview how they will work.', 'data-labels-status="coming"', 'data-labels-status-sentence', 'Not included in the CostCook subscription', 'See what ships today');
// Available since 2026-09-27 (RC-35 approved): the page must say so and may not
// keep any sentence that calls the feature Coming or excluded.
// The Settings pin is the whole sentence naming where the stock is set: the
// bare word 'Settings' was on every page through the shared header's menu.
else required.push('Kitchen date labels, printed from Prep and Pack.', 'data-labels-status="yes"', 'In the app today', 'Printing goes through your browser, onto the label stock you set once in Settings.');

const missing = required.filter((fragment) => !html.includes(fragment));
if (missing.length > 0) throw new Error(`Labels page build is missing: ${missing.join(', ')}`);

if (coming && /In the app today/.test(html)) throw new Error('Labels page says In the app today while src/lib/labels.ts says coming.');
if (!coming && /cannot use in the trial|remain excluded|Not included in the CostCook subscription|labels are coming/i.test(html)) throw new Error('Labels page still calls labels Coming while src/lib/labels.ts says yes.');
if (/sandbox(?:\/demo| build)/i.test(html)) throw new Error('Labels page exposes internal sandbox provenance.');
const forbidden = [/direct(ly)? to (the |a |your )?(label )?printer/i, /sends? (it |them |labels )?to (the |a |your )?printer/i, /Brother|DYMO|Dymo|Zebra|Avery/];
for (const pattern of forbidden) {
	if (pattern.test(html)) throw new Error(`Labels page carries a forbidden claim: ${pattern}`);
}
if ((html.match(/data-labels-disclosure/g) ?? []).length !== 6) throw new Error('Labels page must render six FAQ disclosures.');
if ((html.match(/data-full-proof-link/g) ?? []).length !== 4) throw new Error('Every labels proof must have a full-size link.');
if (html.includes('Six taps at the bench')) throw new Error('Labels page must not claim an unverified tap count.');
if (!html.includes('<picture>') || !html.includes('(min-width: 40rem)')) throw new Error('Labels hero must art-direct one responsive proof request.');
if (!comparisonSource.includes('labelsAvailability.verdict') || !faqSource.includes('labelsAvailability.faqStatus')) {
	throw new Error('Labels availability has drifted away from its shared source.');
}
if (!featureHubHtml.includes('href="/features/labels-and-printing"')) {
	throw new Error('Feature navigation is missing its dedicated Labels and printing destination.');
}

// Considered Strategy; not used because this guard validates one stable page
// contract and has no interchangeable validation algorithms.
console.log('Labels and printing page contract passed.');

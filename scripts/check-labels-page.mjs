import { readFile } from 'node:fs/promises';

// The labels page contract. The one thing this guard exists for is the status:
// while src/lib/labels.ts says Coming (RC-35), the page must carry the chip,
// the plain status sentence, and the browser-only boundary, and may never
// carry the words that would make it read as shipped or printer-connected.
const pagePath = new URL('../dist/features/labels-and-printing/index.html', import.meta.url);
const featureHubPath = new URL('../dist/features/index.html', import.meta.url);
const labelsSource = await readFile(new URL('../src/lib/labels.ts', import.meta.url), 'utf8');
const [html, featureHubHtml] = await Promise.all([readFile(pagePath, 'utf8'), readFile(featureHubPath, 'utf8')]);

const coming = /LABELS_STATUS = 'coming'/.test(labelsSource);

const required = [
	'id="features-labels"',
	'id="labels-feature-heading"',
	'The sticker says what you chose. Nothing more.',
	'id="how-a-label-is-made"',
	'id="the-record"',
	'id="what-it-prints-on"',
	'id="what-it-is-not"',
	'/proof/labels/dialog-wide.png',
	'/proof/labels/sticker.png',
	'/proof/labels/print-sheet.png',
	'/proof/labels/stock-picker.png',
	'SANDBOX BUILD',
	'blank label is not an all-clear',
	'never guesses a date',
	'browser’s print dialog',
	'id="faq-heading"',
	'Is kitchen label printing available now?',
	'Does it send labels straight to a label printer?',
	'Print what you chose. Keep the record.'
];
if (coming) required.push('data-labels-status="coming"', 'data-labels-status-sentence', 'not included in the launch subscription');

const missing = required.filter((fragment) => !html.includes(fragment));
if (missing.length > 0) throw new Error(`Labels page build is missing: ${missing.join(', ')}`);

if (coming && /Available now/.test(html)) throw new Error('Labels page says Available now while src/lib/labels.ts says coming.');
const forbidden = [/direct(ly)? to (the |a |your )?(label )?printer/i, /sends? (it |them |labels )?to (the |a |your )?printer/i, /Brother|DYMO|Dymo|Zebra|Avery/];
for (const pattern of forbidden) {
	if (pattern.test(html)) throw new Error(`Labels page carries a forbidden claim: ${pattern}`);
}
if ((html.match(/data-labels-disclosure/g) ?? []).length !== 6) throw new Error('Labels page must render six FAQ disclosures.');
if (!featureHubHtml.includes('href="/features/labels-and-printing"')) {
	throw new Error('Feature navigation is missing its dedicated Labels and printing destination.');
}

// Considered Strategy; not used because this guard validates one stable page
// contract and has no interchangeable validation algorithms.
console.log('Labels and printing page contract passed.');

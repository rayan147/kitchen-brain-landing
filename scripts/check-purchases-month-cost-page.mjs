import { readFile } from 'node:fs/promises';

const pagePath = new URL('../dist/features/purchases-and-month-cost/index.html', import.meta.url);
const homePath = new URL('../dist/index.html', import.meta.url);
const html = await readFile(pagePath, 'utf8');
const homeHtml = await readFile(homePath, 'utf8');

const required = [
	'id="ledger-heading"',
	'Know what the month should have cost',
	'id="purchase-ledger"',
	'id="month-close"',
	'id="features-ledger"',
	'aria-label="On this page"',
	'id="faq-heading"',
	'What does the month verdict compare?',
	'Close the month with the known and unknown parts still visible.',
	'month-close-explain-the-gap',
	'docs/stories/purchases-month-cost.story.md'
];

const missing = required.filter((fragment) => !html.includes(fragment));
if (missing.length > 0) throw new Error(`Purchases & Month Cost build is missing: ${missing.join(', ')}`);

if (!homeHtml.includes('href="/features/purchases-and-month-cost"')) {
	throw new Error('Features menu is missing its Purchases & Month Cost destination.');
}

// Considered Strategy; not used because this regression guard validates one
// stable page contract and has no interchangeable validation algorithms.
console.log('Purchases & Month Cost page contract passed.');

import { readFile } from 'node:fs/promises';

const pagePath = new URL('../dist/features/invoices-and-price-list-import/index.html', import.meta.url);
const featureHubPath = new URL('../dist/features/index.html', import.meta.url);

const [html, featureHubHtml] = await Promise.all([
	readFile(pagePath, 'utf8'),
	readFile(featureHubPath, 'utf8')
]);

const required = [
	'id="features-import"',
	'id="imports-heading"',
	'Bring in the paperwork. Keep the final say.',
	'id="invoice-import"',
	'id="price-list-import"',
	'aria-label="On this page"',
	'Source',
	'Staged',
	'You confirm',
	'A price list is an offer. An invoice is what happened. CostCook keeps the difference.',
	'id="faq-heading"',
	'What can I import into CostCook?',
	'Can an older invoice replace a newer ingredient price?',
	'The source filed. The price explained.',
	'invoices-price-lists-final-say'
];

const missing = required.filter((fragment) => !html.includes(fragment));
if (missing.length > 0) {
	throw new Error(`Invoices & price-list import build is missing: ${missing.join(', ')}`);
}

if ((html.match(/data-import-disclosure/g) ?? []).length !== 8) {
	throw new Error('Invoices & price-list import must render two capability and six FAQ disclosures.');
}

if (!featureHubHtml.includes('href="/features/invoices-and-price-list-import"')) {
	throw new Error('Feature navigation is missing its dedicated invoices and price-list import destination.');
}

// Considered Strategy; not used because this guard validates one stable page
// contract and has no interchangeable validation algorithms.
console.log('Invoices & price-list import page contract passed.');

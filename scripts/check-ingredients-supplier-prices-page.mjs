import { readFile } from 'node:fs/promises';

const pagePath = new URL('../dist/features/ingredients-and-supplier-prices/index.html', import.meta.url);
const homePath = new URL('../dist/index.html', import.meta.url);
const html = await readFile(pagePath, 'utf8');
const homeHtml = await readFile(homePath, 'utf8');

const required = [
	'id="ingredients-prices-heading"',
	'Compare supplier prices by what you can use.',
	'id="ingredient-records"',
	'id="supplier-prices"',
	'id="features-ingredients"',
	'aria-label="On this page"',
	'/proof/yield-lines-mobile.png',
	'/proof/yield-lines.png',
	'id="faq-heading"',
	'Can one ingredient have prices from more than one supplier?',
	'Know where every price came from before you quote.',
	'ingredients-one-comparable-cost',
	'docs/stories/ingredients-supplier-prices.story.md'
];

const missing = required.filter((fragment) => !html.includes(fragment));
if (missing.length > 0) {
	throw new Error(`Ingredients & Supplier Prices build is missing: ${missing.join(', ')}`);
}

if (!homeHtml.includes('href="/features/ingredients-and-supplier-prices"')) {
	throw new Error('Features menu is missing its Ingredients & Supplier Prices destination.');
}

// Considered Strategy; not used because this regression guard validates one
// stable page contract and has no interchangeable validation algorithms.
console.log('Ingredients & Supplier Prices page contract passed.');

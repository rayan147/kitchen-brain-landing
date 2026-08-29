import { readFile } from 'node:fs/promises';

const pagePath = new URL('../dist/tour/main/index.html', import.meta.url);
const homePath = new URL('../dist/index.html', import.meta.url);
const [html, homeHtml] = await Promise.all([readFile(pagePath, 'utf8'), readFile(homePath, 'utf8')]);

const featureStops = [
	'Recipes &amp; food costing',
	'Menus &amp; quotes',
	'Ingredients &amp; supplier prices',
	'Invoices &amp; price-list import',
	'Nutrition facts &amp; allergens',
	'Labels &amp; printing',
	'Orders, shop, prep &amp; pack',
	'Purchasing &amp; receiving',
	'Inventory',
	'Purchases &amp; month cost',
	'Sage, the assistant'
];

const required = [
	'id="guided-tour"',
	'data-tour',
	'data-tour-select',
	'data-tour-prev',
	'data-tour-next',
	'One event. Every part of the week that gets it out the door.',
	'Alvarez–Whitman wedding',
	'Illustrative tour data',
	'Labels & printing is marked Coming.',
	'data-seed-key="product-tour-connected-event"',
	'Stop 1 of 11',
	'/features/recipes-and-costing',
	'/features/labels-and-printing',
	'/features/sage',
	...featureStops
];

const missing = required.filter((fragment) => !html.includes(fragment));
if (missing.length > 0) throw new Error(`Product tour build is missing: ${missing.join(', ')}`);
if (html.includes('Why this stop matters')) {
	throw new Error('Product tour coach panels must not use a kicker above the callout heading.');
}

if ((html.match(/id="tour-tab-/g) ?? []).length !== 11) {
	throw new Error('Product tour must render exactly eleven feature tabs.');
}
if ((html.match(/id="tour-panel-/g) ?? []).length !== 11) {
	throw new Error('Product tour must render exactly eleven seeded feature scenes.');
}
if (!homeHtml.includes('href="/tour/main"') || !homeHtml.includes('Take the product tour')) {
	throw new Error('Features menu is missing the product-tour entry point.');
}

// Considered Strategy; not used because this guard checks one stable build
// contract and has no interchangeable validation algorithms.
console.log('Product tour page contract passed.');

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
	'Team &amp; access',
	'Sage, the assistant'
];

const required = [
	'id="guided-tour"',
	'data-tour',
	'data-tour-select',
	'data-tour-prev',
	'data-tour-next',
	'data-label="Usable yield"',
	'data-label="Cost"',
	'One event. Every part of the week that gets it out the door.',
	'Garden wedding supper',
	'Illustrative tour data',
	'Labels & printing is marked Coming.',
	'data-seed-key="product-tour-connected-event"',
	// Thirteen since 2026-09-09: the guests' restrictions stop landed with the
	// capability's feature page (RC-60). This number is pinned rather than derived
	// because a stop silently disappearing is the failure it is here to catch.
	'Stop 1 of 13',
	'$127.66 / 10 kg',
	'$14.03 / kg',
	'$109.42',
	'$164.16',
	'$6.84',
	'Revenue after food cost',
	'4.1 kg · count first',
	'Difference to explain',
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
if (html.includes('$61.50 / 10 kg') || html.includes('$6.76 / kg')) {
	throw new Error('Product tour still contains the unreconciled chicken costing proof.');
}
for (const forbidden of ['Gross margin', 'Unaccounted gap', 'Alvarez–Whitman wedding']) {
	if (html.includes(forbidden)) throw new Error(`Product tour still contains stale claim copy: ${forbidden}`);
}

// Thirteen since 2026-09-09 (RC-60). One tab per Features dropdown destination;
// src/lib/tour.ts throws if those two lists ever stop matching, and this is the
// built-page half of the same contract.
if ((html.match(/id="tour-tab-/g) ?? []).length !== 13) {
	throw new Error('Product tour must render exactly thirteen feature tabs.');
}
if ((html.match(/id="tour-panel-/g) ?? []).length !== 13) {
	throw new Error('Product tour must render exactly thirteen seeded feature scenes.');
}
if (!homeHtml.includes('href="/tour/main"') || !homeHtml.includes('Take the product tour')) {
	throw new Error('Features menu is missing the product-tour entry point.');
}

// Considered Strategy; not used because this guard checks one stable build
// contract and has no interchangeable validation algorithms.
console.log('Product tour page contract passed.');

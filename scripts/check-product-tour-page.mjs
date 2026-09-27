import { readFile } from 'node:fs/promises';
import { tourStopCount } from './lib/tour-stops.mjs';

const pagePath = new URL('../dist/tour/main/index.html', import.meta.url);
const homePath = new URL('../dist/index.html', import.meta.url);
const [html, homeHtml] = await Promise.all([readFile(pagePath, 'utf8'), readFile(homePath, 'utf8')]);

const featureStops = [
	'Recipes &amp; food costing',
	'Menus &amp; quotes',
	'Events &amp; proposals',
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
	'Follow one event from quote to pack list.',
	'Garden wedding supper',
	'Illustrative tour data',
	'Each stop follows its public status.',
	'data-seed-key="product-tour-connected-event"',
	// The count is read from src/lib/tour.ts (scripts/lib/tour-stops.mjs), which
	// holds the floor that catches a stop silently disappearing.
	`Stop 1 of ${tourStopCount}`,
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

// One tab per Features dropdown destination; src/lib/tour.ts throws if those
// two lists ever stop matching, and this is the built-page half of the same
// contract: every stop in the source renders as a tab and a scene.
if ((html.match(/id="tour-tab-/g) ?? []).length !== tourStopCount) {
	throw new Error(`Product tour must render exactly ${tourStopCount} feature tabs (src/lib/tour.ts).`);
}
if ((html.match(/id="tour-panel-/g) ?? []).length !== tourStopCount) {
	throw new Error(`Product tour must render exactly ${tourStopCount} seeded feature scenes (src/lib/tour.ts).`);
}
if (!homeHtml.includes('href="/tour/main"') || !homeHtml.includes('Take the product tour')) {
	throw new Error('Features menu is missing the product-tour entry point.');
}

// Considered Strategy; not used because this guard checks one stable build
// contract and has no interchangeable validation algorithms.
console.log('Product tour page contract passed.');

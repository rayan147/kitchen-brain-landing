import { readFile } from 'node:fs/promises';

const pagePath = new URL('../dist/features/menus-and-quotes/index.html', import.meta.url);
const featureHubPath = new URL('../dist/features/index.html', import.meta.url);
const recipesPath = new URL('../dist/features/recipes-and-costing/index.html', import.meta.url);

const [html, featureHubHtml, recipesHtml] = await Promise.all([
	readFile(pagePath, 'utf8'),
	readFile(featureHubPath, 'utf8'),
	readFile(recipesPath, 'utf8')
]);

const required = [
	'id="menus-quotes-heading"',
	'Build your menu. Check the price per guest.',
	'id="menu-management"',
	'id="catering-quotes"',
	'aria-label="On this page"',
	'/proof/hero-pricing-mobile.png',
	'/proof/hero-pricing.png',
	'/demo-poster.jpg',
	'id="faq-heading"',
	'What is menu management software?',
	'Can I reopen a confirmed event?',
	// "client" since 2026-09-27: the app's word (Clients), gap report W1.
	'Ready for the client. Ready for the kitchen.',
	// The quote the client sees is a proposal now, and this page says where.
	'data-proposal-bridge',
	'href="/features/events-and-proposals"',
	'menus-quotes-one-commitment'
];

const missing = required.filter((fragment) => !html.includes(fragment));
if (missing.length > 0) {
	throw new Error(`Menus & Quotes build is missing: ${missing.join(', ')}`);
}

if (!featureHubHtml.includes('href="/features/menus-and-quotes"')) {
	throw new Error('Feature navigation is missing its dedicated Menus & Quotes destination.');
}

if (!recipesHtml.includes('href="/features/menus-and-quotes"')) {
	throw new Error('Recipes & Costing is missing its Menus & Quotes onward link.');
}

// Considered Strategy; not used because this guard validates one stable page
// contract and has no interchangeable validation algorithms.
console.log('Menus & Quotes page contract passed.');

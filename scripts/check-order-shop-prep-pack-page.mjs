import { readFile } from 'node:fs/promises';

const pagePath = new URL('../dist/features/order-shop-prep-pack/index.html', import.meta.url);
const homePath = new URL('../dist/index.html', import.meta.url);
const html = await readFile(pagePath, 'utf8');
const homeHtml = await readFile(homePath, 'utf8');

const required = [
	'id="orders-heading"',
	'One confirmed order. Three working lists.',
	'id="shop-the-order"',
	'id="prep-and-pack"',
	'id="features-orders"',
	'aria-label="On this page"',
	'id="faq-heading"',
	'Do Shop, Prep, and Pack use the same order?',
	'Close the van on the same plan you priced, shopped, and cooked.',
	'order-shop-prep-pack-handoff',
	'docs/stories/order-shop-prep-pack.story.md'
];

const missing = required.filter((fragment) => !html.includes(fragment));
if (missing.length > 0) throw new Error(`Orders, Shop, Prep & Pack build is missing: ${missing.join(', ')}`);

if (!homeHtml.includes('href="/features/order-shop-prep-pack"')) {
	throw new Error('Features menu is missing its Orders, Shop, Prep & Pack destination.');
}

// Considered Strategy; not used because this regression guard validates one
// stable page contract and has no interchangeable validation algorithms.
console.log('Orders, Shop, Prep & Pack page contract passed.');

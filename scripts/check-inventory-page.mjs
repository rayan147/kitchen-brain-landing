import { readFile } from 'node:fs/promises';

const pagePath = new URL('../dist/features/inventory/index.html', import.meta.url);
const homePath = new URL('../dist/index.html', import.meta.url);
const html = await readFile(pagePath, 'utf8');
const homeHtml = await readFile(homePath, 'utf8');

const required = [
	'id="inventory-heading"',
	'Check your stock before you buy more.',
	'id="count-and-trust"',
	'id="plan-the-gap"',
	'id="features-inventory"',
	'aria-label="On this page"',
	'id="faq-heading"',
	'Will a stale count reduce what the shopping list buys?',
	'A shelf number ready to use.',
	'inventory-count-movement-trust',
	'docs/stories/inventory.story.md'
];

const missing = required.filter((fragment) => !html.includes(fragment));
if (missing.length > 0) throw new Error(`Inventory build is missing: ${missing.join(', ')}`);

if (!homeHtml.includes('href="/features/inventory"')) {
	throw new Error('Features menu is missing its Inventory destination.');
}

// Considered Strategy; not used because this regression guard validates one
// stable page contract and has no interchangeable validation algorithms.
console.log('Inventory page contract passed.');

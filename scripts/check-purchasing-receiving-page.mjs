import { readFile } from 'node:fs/promises';

const pagePath = new URL('../dist/features/purchasing-and-receiving/index.html', import.meta.url);
const homePath = new URL('../dist/index.html', import.meta.url);
const html = await readFile(pagePath, 'utf8');
const homeHtml = await readFile(homePath, 'utf8');

const required = [
	'id="purchasing-heading"',
	'The order you sent should meet the delivery at the back door.',
	'id="send-the-order"',
	'id="receive-the-delivery"',
	'id="features-purchasing"',
	'aria-label="On this page"',
	'id="faq-heading"',
	'What happens if the supplier email fails?',
	'Walk back into prep with one record.',
	'purchasing-sent-received-truth',
	'docs/stories/purchasing-and-receiving.story.md'
];

const missing = required.filter((fragment) => !html.includes(fragment));
if (missing.length > 0) throw new Error(`Purchasing & Receiving build is missing: ${missing.join(', ')}`);

if (!homeHtml.includes('href="/features/purchasing-and-receiving"')) {
	throw new Error('Features menu is missing its Purchasing & Receiving destination.');
}

// Considered Strategy; not used because this regression guard validates one
// stable page contract and has no interchangeable validation algorithms.
console.log('Purchasing & Receiving page contract passed.');

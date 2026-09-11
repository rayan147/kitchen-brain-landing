import { readFile } from 'node:fs/promises';

const pagePath = new URL('../dist/features/recipes-and-costing/index.html', import.meta.url);
const featureHubPath = new URL('../dist/features/index.html', import.meta.url);
const html = await readFile(pagePath, 'utf8');
const featureHubHtml = await readFile(featureHubPath, 'utf8');

const required = [
	'id="recipes-costing-heading"',
	'Cost a recipe before you quote.',
	'id="recipe-management"',
	'id="recipe-costing"',
	'id="recipe-lifecycle"',
	'The kitchen version is a decision, not the last tab left open.',
	'Earlier published versions',
	'Collections',
	'Structured method',
	'aria-label="On this page"',
	'/proof/yield-lines-mobile.png',
	'/proof/yield-lines.png',
	'id="faq-heading"',
	'What is recipe management software?',
	'Will a later price change rewrite a confirmed quote?',
	'Ready for the line. Ready to price.',
	'recipes-costing-one-record'
];

const missing = required.filter((fragment) => !html.includes(fragment));
if (missing.length > 0) {
	throw new Error(`Recipes & Costing build is missing: ${missing.join(', ')}`);
}

if (!featureHubHtml.includes('href="/features/recipes-and-costing"')) {
	throw new Error('Feature hub is missing its Recipes & Costing guide entry.');
}

// Considered Strategy; not used because this regression guard validates one
// stable page contract and has no interchangeable validation algorithms.
console.log('Recipes & Costing page contract passed.');

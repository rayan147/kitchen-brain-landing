import { readFile } from 'node:fs/promises';

const pagePath = new URL('../dist/features/nutrition-facts-and-allergens/index.html', import.meta.url);
const featureHubPath = new URL('../dist/features/index.html', import.meta.url);
const [html, featureHubHtml] = await Promise.all([
	readFile(pagePath, 'utf8'),
	readFile(featureHubPath, 'utf8')
]);

const required = [
	'id="features-nutrition"',
	'id="nutrition-feature-heading"',
	'One recipe. Two answers you cannot guess at.',
	'id="nutrition-facts"',
	'id="allergen-management"',
	'245',
	'45.4 g',
	'2.7 g',
	'A blank row beats a made-up zero.',
	'/proof/nutrition-panel.png',
	'/proof/nutrition-label.png',
	'not a retail-label regulatory compliance claim',
	'no screen makes an allergen-free claim',
	'id="faq-heading"',
	'What is nutrition facts software?',
	'Can I print a nutrition label today?',
	'Print the answer. Keep the evidence.'
];

const missing = required.filter((fragment) => !html.includes(fragment));
if (missing.length > 0) {
	throw new Error(`Nutrition & allergens build is missing: ${missing.join(', ')}`);
}

if ((html.match(/data-nutrition-disclosure/g) ?? []).length !== 6) {
	throw new Error('Nutrition & allergens must render six FAQ disclosures.');
}
if ((html.match(/data-capability-disclosure/g) ?? []).length !== 2) {
	throw new Error('Nutrition & allergens must render two capability disclosures.');
}
if (!featureHubHtml.includes('href="/features/nutrition-facts-and-allergens"')) {
	throw new Error('Feature navigation is missing its dedicated Nutrition & allergens destination.');
}

// Considered Strategy; not used because this guard validates one stable page
// contract and has no interchangeable validation algorithms.
console.log('Nutrition facts & allergens page contract passed.');

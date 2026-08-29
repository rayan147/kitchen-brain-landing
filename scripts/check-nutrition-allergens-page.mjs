import { readFile } from 'node:fs/promises';

const pagePath = new URL('../dist/features/nutrition-facts-and-allergens/index.html', import.meta.url);
const featureHubPath = new URL('../dist/features/index.html', import.meta.url);
const componentPath = new URL('../src/components/sections/NutritionFactsAllergensFeature.astro', import.meta.url);
const routePath = new URL('../src/pages/features/nutrition-facts-and-allergens.astro', import.meta.url);
const [html, featureHubHtml, component, route] = await Promise.all([
	readFile(pagePath, 'utf8'),
	readFile(featureHubPath, 'utf8'),
	readFile(componentPath, 'utf8'),
	readFile(routePath, 'utf8')
]);

const required = [
	'id="features-nutrition"',
	'id="nutrition-feature-heading"',
	'One recipe. Two answers you cannot guess at.',
	'id="nutrition-facts"',
	'id="allergen-management"',
	'339',
	'22 g',
	'48.1 g',
	'7 g',
	'USDA FoodData Central 2704502',
	'Contains: Milk, Soy',
	'A blank row beats a made-up zero.',
	'/proof/nutrition/nutrition-summary-wide.png',
	'/proof/nutrition/nutrition-summary-mobile.png',
	'/proof/nutrition/nutrition-facts-panel.png',
	'/proof/nutrition/allergen-review-wide.png',
	'/proof/nutrition/allergen-review-mobile.png',
	'/proof/nutrition/label-panel.png',
	'/proof/nutrition-panel.png',
	'/proof/nutrition-label.png',
	'not a retail-label regulatory compliance claim',
	'no screen makes an allergen-free claim',
	'id="faq-heading"',
	'What is nutrition facts software?',
	'Can I print a nutrition label today?',
	'Print the answer. Keep the evidence.',
	'Book a 15-min demo',
	'days free, then',
	'Open full recipe capture',
	'Open full Nutrition Facts panel',
	'Open allergen evidence in full capture',
	'docs/stories/nutrition-facts-allergens-feature.story.md'
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

const forbiddenSourceFragments = ['overflow: clip', '>Book 15 minutes<', 'const macroFacts', 'font-size: clamp(3rem, 5.55vw, 5.9rem)'];
const forbidden = forbiddenSourceFragments.filter((fragment) => component.includes(fragment));
if (forbidden.length > 0) {
	throw new Error(`Nutrition & allergens source regressed: ${forbidden.join(', ')}`);
}

for (const requiredSourceFragment of ['demoCta.label', 'launchPlan', 'var(--text-display)', 'var(--text-h2)', 'min-height: 44px', 'overflow-wrap: anywhere']) {
	if (!component.includes(requiredSourceFragment)) {
		throw new Error(`Nutrition & allergens source is missing: ${requiredSourceFragment}`);
	}
}

if (route.includes('Chicken Shawarma')) {
	throw new Error('Nutrition & allergens direction contract still names the retired Chicken Shawarma proof.');
}

// Considered Strategy; not used because this guard validates one stable page
// contract and has no interchangeable validation algorithms.
console.log('Nutrition facts & allergens page contract passed.');

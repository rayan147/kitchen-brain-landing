import { readFile } from 'node:fs/promises';

const pagePath = new URL('../dist/features/purchasing-and-receiving/index.html', import.meta.url);
const homePath = new URL('../dist/index.html', import.meta.url);
const componentPath = new URL('../src/components/sections/PurchasingReceivingFeature.astro', import.meta.url);
const html = await readFile(pagePath, 'utf8');
const homeHtml = await readFile(homePath, 'utf8');
const component = await readFile(componentPath, 'utf8');

const required = [
	'id="purchasing-heading"',
	'Check the delivery against the order you sent.',
	'id="send-the-order"',
	'id="receive-the-delivery"',
	'id="features-purchasing"',
	'aria-label="On this page"',
	'id="faq-heading"',
	'What happens if the supplier email fails?',
	'recorded as queued before CostCook attempts the email',
	'same record keeps the failure and remains safe to retry',
	'Walk back into prep with one record.',
	'Book 15 minutes',
	'days free, then',
	'$42.10',
	'$46.80',
	'PO sent',
	'purchasing-sent-received-truth',
	'docs/stories/purchasing-and-receiving.story.md'
];

const missing = required.filter((fragment) => !html.includes(fragment));
if (missing.length > 0) throw new Error(`Purchasing & Receiving build is missing: ${missing.join(', ')}`);

if (!homeHtml.includes('href="/features/purchasing-and-receiving"')) {
	throw new Error('Features menu is missing its Purchasing & Receiving destination.');
}

if (/<details id="features-purchasing"\s+open>/.test(html)) {
	throw new Error('The full capability inventory must use progressive disclosure.');
}

const forbiddenSourceFragments = ['overflow: clip', 'filter: blur', '>Book a 15-min demo<', 'hero-copy anim-enter', '<strong>Email supplier</strong>'];
forbiddenSourceFragments.push('written only after a successful send');
const forbidden = forbiddenSourceFragments.filter((fragment) => component.includes(fragment));
if (forbidden.length > 0) {
	throw new Error(`Purchasing & Receiving source regressed: ${forbidden.join(', ')}`);
}

for (const requiredSourceFragment of ['demoCta.label', 'FeatureTrialTerms', 'var(--text-display)', 'min-height: 44px', 'orderedPrice', 'receivedPrice']) {
	if (!component.includes(requiredSourceFragment)) {
		throw new Error(`Purchasing & Receiving source is missing: ${requiredSourceFragment}`);
	}
}

// Considered Strategy; not used because this regression guard validates one
// stable page contract and has no interchangeable validation algorithms.
console.log('Purchasing & Receiving page contract passed.');

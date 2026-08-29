import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../dist/faq/index.html', import.meta.url), 'utf8');
const failures = [];
const faqMarkup = html.slice(html.indexOf('<div class="faq-page"'), html.lastIndexOf('</main>'));

// Considered Chain of Responsibility; not used because this is one fixed
// build contract whose independent assertions should all report together.
const requireText = (text, label) => {
	if (!html.includes(text)) failures.push(`missing ${label}: ${text}`);
};

for (const [text, label] of [
	['Know the catch before you hand over the card.', 'page identity'],
	['id="decision-ticket-title"', 'before-you-start ticket'],
	['id="money"', 'money chapter'],
	['id="fit"', 'fit chapter'],
	['id="how"', 'workflow chapter'],
	['id="start"', 'getting-started chapter'],
	['data-snap-question', 'forty-guest snap answer'],
	['"@type":"FAQPage"', 'FAQ structured data'],
	['faq-answer-sheet', 'emitted direction contract']
]) requireText(text, label);

const entryCount = (html.match(/data-faq-entry/g) ?? []).length;
if (entryCount !== 32) failures.push(`expected 32 FAQ answers, received ${entryCount}`);

if (faqMarkup.includes('<details')) failures.push('FAQ answers must remain open; found a details disclosure');

for (const id of ['trial', 'cancel', 'guests', 'phone', 'demo']) {
	requireText(`id="${id}"`, `stable #${id} deep link`);
}

if (failures.length > 0) {
	console.error(`FAQ page contract failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log('FAQ page contract passed: 32 open answers, stable anchors, decision ticket, snap answer, and structured data.');

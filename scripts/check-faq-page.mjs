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
if (entryCount !== 35) failures.push(`expected 35 FAQ answers, received ${entryCount}`);

if (faqMarkup.includes('<details')) failures.push('FAQ answers must remain open; found a details disclosure');

for (const id of ['trial', 'cancel', 'guests', 'phone', 'demo']) {
	requireText(`id="${id}"`, `stable #${id} deep link`);
}

for (const [text, label] of [
	['charges $0 during the trial', 'bounded trial charge'],
	['Previously loaded order pages remain readable with no signal', 'bounded offline behavior'],
	['actions that write data need a connection', 'offline write boundary']
]) requireText(text, label);

for (const staleClaim of ['there is no invoice for the 15 days', 'works with no signal and with JavaScript off']) {
	if (html.includes(staleClaim)) failures.push(`stale claim remains: ${staleClaim}`);
}

if (failures.length > 0) {
	console.error(`FAQ page contract failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log('FAQ page contract passed: 35 open answers, stable anchors, decision ticket, snap answer, and structured data.');

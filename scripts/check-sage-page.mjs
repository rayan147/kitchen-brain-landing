import { readFile, stat } from 'node:fs/promises';

const pagePath = new URL('../dist/features/sage/index.html', import.meta.url);
const featureHubPath = new URL('../dist/features/index.html', import.meta.url);
const mp4Path = new URL('../public/proof/sage-walkthrough.mp4', import.meta.url);
const webmPath = new URL('../public/proof/sage-walkthrough.webm', import.meta.url);

const [html, featureHubHtml, mp4, webm] = await Promise.all([
	readFile(pagePath, 'utf8'),
	readFile(featureHubPath, 'utf8'),
	stat(mp4Path),
	stat(webmPath)
]);

const required = [
	'id="features-assistant"',
	'id="sage-feature-heading"',
	'Ask your kitchen. Check the answer.',
	'Available now',
	'id="watch-sage"',
	'/proof/sage-walkthrough.webm',
	'/proof/sage-walkthrough.mp4',
	'/proof/sage-walkthrough.vtt',
	'Ask before the kitchen is fully set up.',
	'Eleven kitchen checks. One reviewed proposal.',
	'A missing number is an answer, too.',
	'id="faq-heading"',
	'Is Sage available now?',
	'Who can see price moves or approve a shopping-list draft?',
	'Ask the next question. Keep the final say.'
];

const missing = required.filter((fragment) => !html.includes(fragment));
if (missing.length > 0) throw new Error(`Sage build is missing: ${missing.join(', ')}`);

if ((html.match(/data-sage-disclosure/g) ?? []).length !== 6) {
	throw new Error('Sage must render six FAQ disclosures.');
}
if (!featureHubHtml.includes('href="/features/sage"')) {
	throw new Error('Feature navigation is missing its dedicated Sage destination.');
}
if (mp4.size < 100_000 || webm.size < 100_000) {
	throw new Error('Sage walkthrough media is missing or unexpectedly small.');
}

// Considered Strategy; not used because this guard validates one stable page
// and media contract and has no interchangeable validation algorithms.
console.log('Sage page and video contract passed.');

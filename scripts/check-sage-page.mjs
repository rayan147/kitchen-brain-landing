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
	'Ask Sage about your kitchen.',
	'In the app today',
	'id="watch-sage"',
	'/proof/sage-walkthrough.webm',
	'/proof/sage-walkthrough.mp4',
	'/proof/sage-walkthrough-poster.jpg',
	'Read what the film shows',
	'id="sage-allowance"',
	'What it costs to run.',
	'2,000 Sage credits each paid month, 300 during the free trial',
	'Is there a limit on Sage?',
	'Ask before the kitchen is fully set up.',
	'Questions you can ask. A shopping list you can approve.',
	'A missing number is an answer, too.',
	'id="faq-heading"',
	'Is Sage available now?',
	'Can my staff use Sage?',
	'Ask the next question. Keep the final say.'
];

const missing = required.filter((fragment) => !html.includes(fragment));
if (missing.length > 0) throw new Error(`Sage build is missing: ${missing.join(', ')}`);

// Seven since 2026-10-11: "Is there a limit on Sage?" joined with the allowance.
if ((html.match(/data-sage-disclosure/g) ?? []).length !== 7) {
	throw new Error('Sage must render seven FAQ disclosures.');
}
if (!featureHubHtml.includes('href="/features/sage"')) {
	throw new Error('Feature navigation is missing its dedicated Sage destination.');
}
// The burned-in captions are the film's words; a caption track would double them.
if (html.includes('sage-walkthrough.vtt')) throw new Error('Sage film must not ship a caption track over its burned-in captions.');
if (/daily usage cap/i.test(html)) throw new Error('Sage limits are the period allowance now, not a daily cap.');
if (mp4.size < 100_000 || webm.size < 100_000) {
	throw new Error('Sage walkthrough media is missing or unexpectedly small.');
}

// Considered Strategy; not used because this guard validates one stable page
// and media contract and has no interchangeable validation algorithms.
console.log('Sage page and video contract passed.');

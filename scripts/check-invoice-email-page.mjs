import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { importsOnItsOwn, inboxOutcomeLabels, invoiceEmailLive as live, setupGuideSlug, workingAddress } from './lib/invoice-email.mjs';

/**
 * Built-page contract for /features/invoice-email (RC-73).
 *
 * WHAT THIS IS ACTUALLY GUARDING. That the page cannot say more than
 * production does. The status line must carry the word from
 * src/lib/invoice-email.ts; while it is Coming the page may not link the
 * setup guide (which is not built) and the menu must carry the Coming chip.
 * In both states the snap line, the review boundary and the limits stay, no
 * working address is printed, and nothing says invoices import on their own.
 *
 * Every failure is collected and reported together, then the script exits 1,
 * like its sibling page contracts.
 *
 * Considered Strategy; not used because this validates one stable built-page
 * contract and has no interchangeable validation algorithms.
 */
const dist = new URL('../dist/', import.meta.url).pathname;
const html = readFileSync(join(dist, 'features/invoice-email/index.html'), 'utf8');
const featureHub = readFileSync(join(dist, 'features/index.html'), 'utf8');
const importHtml = readFileSync(join(dist, 'features/invoices-and-price-list-import/index.html'), 'utf8');

const failures = [];
const fail = (message) => failures.push(message);
const decode = (text) =>
	text
		.replace(/<script[\s\S]*?<\/script>/g, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&gt;/g, '>')
		.replace(/&#39;|&rsquo;/g, '’')
		.replace(/\s+/g, ' ');
const prose = decode(html);

const verdict = html.match(/data-invoice-email-status="(\w+)"/)?.[1];
if (verdict !== (live ? 'yes' : 'coming')) fail(`status line reads ${verdict}; src/lib/invoice-email.ts says ${live ? 'yes' : 'coming'}`);
if (!live && !/Coming It is built, and it is not receiving email for trial kitchens yet/.test(prose)) {
	fail('the Coming status sentence is missing from the first screen');
}

// Settings shows a real address in production today, so while Coming the
// setup cards must say not to hand it out.
if (!live !== html.includes('data-invoice-email-setup-warning')) {
	fail(live ? 'the Coming setup warning is still on the page' : 'the setup cards lost the "do not give it to suppliers" warning');
}
if (!live && !prose.includes('so do not give it to suppliers')) fail('the setup warning sentence changed');
const guideLinked = html.includes(`href="/blog/${setupGuideSlug}"`);
if (live !== guideLinked) fail(live ? 'the setup guide link is missing' : 'the page links a setup guide that is not published');

if (!prose.includes('Nothing counts until you check it, so the worst a stranger can do is add to your review list.')) {
	fail('the snap line (the app’s own sentence) is gone');
}
if (!prose.includes('An emailed invoice opens in the same review as an upload.')) fail('the review boundary heading is gone');
// Every outcome the data lists, read from src/lib/invoice-email.ts.
for (const label of inboxOutcomeLabels) {
	if (!html.includes(`data-inbox-outcome="${label}"`)) fail(`outcome missing: ${label}`);
}
if ((html.match(/data-invoice-email-limit/g) ?? []).length !== 5) fail('expected five limits');
for (const text of ['200 emails in a day', '100 pages a day', 'Gmail’s confirmation code']) {
	if (!prose.includes(text)) fail(`limit missing: ${text}`);
}
if (importsOnItsOwn.test(prose)) fail('the page says invoices import on their own');
if (workingAddress.test(html)) fail('the page prints a working invoice address');

// The hub lists the guide; the menu chip follows the word.
if (!featureHub.includes('href="/features/invoice-email"')) fail('the /features hub does not link the invoice email guide');
const menuItem = html.match(/<a[^>]*href="\/features\/invoice-email"[\s\S]{0,2500}?<\/a>/)?.[0] ?? '';
if (!menuItem) fail('the feature menu does not link the invoice email guide');
else if (live === /Coming/.test(menuItem)) fail(live ? 'the menu still says Coming' : 'the menu item is missing its Coming chip');
if (!importHtml.includes('href="/features/invoice-email"')) fail('the invoice import guide does not link its front door');

if (failures.length) {
	console.error(`Invoice email page contract failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}
console.log(`Invoice email page contract passed (${live ? 'available' : 'Coming'}): status, snap, outcomes, limits, gated guide link.`);

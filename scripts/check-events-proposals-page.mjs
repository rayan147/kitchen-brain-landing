import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { moneyClaims } from './lib/money-claims.mjs';

/**
 * Built-page contract for /features/events-and-proposals.
 *
 * WHAT THIS IS ACTUALLY GUARDING. Not that the page exists: that the three
 * boundaries a friendly rewrite drops first are still on it. The deposit is
 * recorded by hand in production (inventory A-14), so the money sentence is
 * pinned word for word. The client's yes is not a signature or a booking, and
 * Confirm order is (A-07, D-04). The six step names are the app's own step bar
 * in its order (A-03), so a trial user meets the same words. And the card
 * payment page stays in a Coming block, read from src/lib/coming-plans.ts,
 * until it ships (RC-65).
 *
 * Considered Strategy; not used because this validates one stable built-page
 * contract and has no interchangeable validation algorithms.
 */
const dist = new URL('../dist/', import.meta.url).pathname;
const html = readFileSync(join(dist, 'features/events-and-proposals/index.html'), 'utf8');
const featureHub = readFileSync(join(dist, 'features/index.html'), 'utf8');
const homeHtml = readFileSync(join(dist, 'index.html'), 'utf8');
const compareHtml = readFileSync(join(dist, 'compare/index.html'), 'utf8');

const fail = (message) => {
	throw new Error(`Events & proposals page contract: ${message}`);
};

// The money boundary, as one sentence, on the page.
const money =
	'You record the deposit by hand, as a check, cash, a transfer or your own card processor, and the event shows what you asked for and what came in.';
if (!html.includes('data-events-money')) fail('the deposit sentence lost its hook');
if (!html.includes(money)) fail('the money boundary sentence changed; an event deposit is recorded by hand (A-14)');

// No sentence on the page may say the deposit is taken, collected, charged or
// accepted, or that CostCook invoices the client. Same patterns as the source
// scan (scripts/lib/money-claims.mjs), run on the rendered prose.
const prose = html.replace(/<[^>]+>/g, ' ');
for (const [pattern, label] of moneyClaims) {
	if (pattern.test(prose)) fail(`the page makes a forbidden ${label}`);
}

// The acceptance boundary.
if (!html.includes('Their yes is not a signature or a booking. Confirm order is.')) {
	fail('the "not a signature or a booking" boundary is gone');
}

// The six steps, in the app's order, and no seventh.
const steps = [...html.matchAll(/data-event-step="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));
const expected = ['Inquiry', 'Menu & service', 'Proposal', 'Client decision', 'Agreement', 'Booked'];
if (steps.join('|') !== expected.join('|')) {
	fail(`the step bar renders [${steps.join(', ')}]; the app's six steps are ${expected.join(', ')}`);
}

// The Coming block, carrying both halves of the plan.
if (!html.includes('data-events-coming')) fail('the Coming block is gone');
for (const phrase of ['A card payment page for the deposit and the balance of a booked event', 'a reminder email before the balance is due']) {
	if (!html.includes(phrase)) fail(`the Coming block no longer names "${phrase}"`);
}

// The limits, still five.
const limits = (html.match(/data-events-limit/g) ?? []).length;
if (limits !== 5) fail(`the limits list renders ${limits} item(s); five are pinned`);

// Captures only, and never the signing page's test line.
if (/Test environment/i.test(html)) fail('a capture or caption carries the signing page test line');
if (!html.includes('/proof/events-offer-mobile.png')) fail('the client offer capture is gone');

// Reachable from the hub and the Features menu.
if (!featureHub.includes('/features/events-and-proposals')) fail('the features hub does not link the page');
if (!homeHtml.includes('href="/features/events-and-proposals"')) fail('the Features menu does not link the page');

// The homepage's "Also in the app" line deep-links two sections here.
for (const id of ['clients', 'booked']) {
	if (!html.includes(`id="${id}"`)) fail(`#${id} is gone, and the homepage links to it`);
	if (!homeHtml.includes(`href="/features/events-and-proposals#${id}"`)) fail(`the homepage no longer links #${id}`);
}

// /compare agrees the capability ships, and that card payment does not yet.
if (!compareHtml.includes('Proposals the client accepts on their phone')) {
	fail('/compare no longer carries the shipped proposals row this page documents');
}
if (!compareHtml.includes('Card payment for event deposits and balances')) {
	fail('/compare no longer carries the Coming card-payment row');
}

console.log(
	'Events & proposals page contract passed: the hand-recorded deposit sentence, the acceptance boundary, six steps in order, five limits, and the Coming block.'
);

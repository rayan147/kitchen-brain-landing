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
 * payment page stays in a Coming block until it ships (RC-65): this script
 * reads comingPlans.eventPayments.homepage out of src/lib/coming-plans.ts and
 * requires that exact sentence on this page, on the homepage's EventBooking
 * Coming line and on /pricing, so the three cannot drift from the plan.
 *
 * Every failure is collected and reported together, then the script exits 1,
 * like its sibling page contracts.
 *
 * Considered Strategy; not used because this validates one stable built-page
 * contract and has no interchangeable validation algorithms.
 */
const dist = new URL('../dist/', import.meta.url).pathname;
const html = readFileSync(join(dist, 'features/events-and-proposals/index.html'), 'utf8');
const featureHub = readFileSync(join(dist, 'features/index.html'), 'utf8');
const homeHtml = readFileSync(join(dist, 'index.html'), 'utf8');
const compareHtml = readFileSync(join(dist, 'compare/index.html'), 'utf8');
const pricingHtml = readFileSync(join(dist, 'pricing/index.html'), 'utf8');
const comingPlansSource = readFileSync(new URL('../src/lib/coming-plans.ts', import.meta.url), 'utf8');

const failures = [];
const fail = (message) => {
	failures.push(message);
};
// Astro escapes & and ’ in text; compare against the decoded prose.
const decode = (text) =>
	text.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, '’').replace(/\s+/g, ' ');

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

// The Coming block, carrying both halves of the plan, in the plan's own words.
if (!html.includes('data-events-coming')) fail('the Coming block is gone');
const eventPaymentsSource = comingPlansSource.slice(comingPlansSource.indexOf('eventPayments: {'));
const planSentence = eventPaymentsSource.match(/homepage:\s*'([^']+)'/)?.[1];
if (!planSentence) {
	fail('could not read comingPlans.eventPayments.homepage from src/lib/coming-plans.ts');
} else {
	if (!decode(html).includes(planSentence)) fail('the Coming block does not render comingPlans.eventPayments.homepage');
	const bookingComing = homeHtml.match(/<p[^>]*data-booking-coming="event-payments"[^>]*>([\s\S]*?)<\/p>/)?.[1];
	if (!bookingComing || !decode(bookingComing).includes(planSentence)) {
		fail('the homepage EventBooking Coming line does not render comingPlans.eventPayments.homepage');
	}
	if (!decode(pricingHtml).includes(planSentence)) fail('/pricing does not render comingPlans.eventPayments.homepage');
}
for (const phrase of ['A card payment page for the deposit and the balance of a booked event', 'a reminder email before the balance is due']) {
	if (!html.includes(phrase)) fail(`the Coming block no longer names "${phrase}"`);
}

// The limits, still five.
const limits = (html.match(/data-events-limit/g) ?? []).length;
if (limits !== 5) fail(`the limits list renders ${limits} item(s); five are pinned`);

// Captures only, and never the signing page's test line.
if (/Test environment/i.test(html)) fail('a capture or caption carries the signing page test line');
if (!html.includes('/proof/events-offer-mobile.png')) fail('the client offer capture is gone');

// Reachable. Both old checks here read the whole page, and the shared header
// carries the Features menu on every page, so they passed on the menu alone.
// Each is now scoped to the part it names.
//  - The Features menu: the link must be inside that menu, not anywhere.
//  - The hub: its main content lists the five area pages, not the dedicated
//    guides (no guide is linked from there; only the menu reaches them). So the
//    hub must link the area page that carries the events group, and that area
//    page's main content must carry the group.
const featuresMenu = (source) => {
	const start = source.indexOf('data-features-menu');
	return start === -1 ? '' : source.slice(start, source.indexOf('</details>', start));
};
const mainOf = (source) => source.slice(source.indexOf('<main'), source.indexOf('</main>'));
if (!featuresMenu(homeHtml).includes('href="/features/events-and-proposals"')) {
	fail('the Features menu does not link the page');
}
// Since 2026-09-27 the hub lists every guide under data-feature-guides, from
// the menu's own data, so the hub's main content must link this guide itself.
if (!mainOf(featureHub).includes('data-feature-guides') || !mainOf(featureHub).includes('href="/features/events-and-proposals"')) {
	fail('the features hub guide list does not link the page');
}
if (!mainOf(featureHub).includes('href="/features/the-day-itself"')) {
	fail('the features hub main content does not link the area page that carries events');
}
const dayItself = readFileSync(join(dist, 'features/the-day-itself/index.html'), 'utf8');
if (!mainOf(dayItself).includes('From the first call to Confirm order, on one event.')) {
	fail('/features/the-day-itself no longer carries the events group');
}

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

if (failures.length > 0) {
	console.error(`Events & proposals page contract failed:\n- ${failures.join('\n- ')}`);
	process.exit(1);
}

console.log(
	'Events & proposals page contract passed: the hand-recorded deposit sentence, the acceptance boundary, six steps in order, five limits, and the Coming block.'
);

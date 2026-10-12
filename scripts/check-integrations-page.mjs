import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { connectorGuides } from './lib/connections.mjs';

/**
 * Built-page contract for /features/integrations (RC-45, RC-78).
 *
 * WHAT THIS IS ACTUALLY GUARDING. That the page cannot say more than
 * production does about Square and QuickBooks. Each connector section carries
 * the word from src/lib/connections.ts; while it is Coming the section shows
 * the chip and the /compare note, and its guide is not linked (the guide is
 * not built). In both states the boundaries stay: Square takes no stock off
 * the shelf and makes no orders, QuickBooks sends nothing without a press and
 * never pays a bill. No other connector is named (owner, 2026-10-12).
 *
 * Every failure is collected and reported together, then the script exits 1,
 * like its sibling page contracts.
 *
 * Considered Strategy; not used because this validates one stable built-page
 * contract and has no interchangeable validation algorithms.
 */
const dist = new URL('../dist/', import.meta.url).pathname;
const html = readFileSync(join(dist, 'features/integrations/index.html'), 'utf8');
const homeHtml = readFileSync(join(dist, 'index.html'), 'utf8');

const failures = [];
const fail = (message) => failures.push(message);
const decode = (text) =>
	text
		.replace(/<script[\s\S]*?<\/script>/g, ' ')
		.replace(/<style[\s\S]*?<\/style>/g, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&gt;/g, '>')
		.replace(/&#39;|&rsquo;/g, '’')
		.replace(/\s+/g, ' ');
const prose = decode(html);

for (const guide of connectorGuides) {
	const status = html.match(new RegExp(`data-connector="${guide.connector}" data-connector-status="(\\w+)"`))?.[1];
	if (status !== (guide.live ? 'yes' : 'coming')) fail(`${guide.connector}: section reads ${status}; src/lib/connections.ts says ${guide.live ? 'yes' : 'coming'}`);
	const linked = html.includes(`href="/blog/${guide.slug}"`);
	if (guide.live !== linked) fail(guide.live ? `${guide.connector}: the guide link is missing` : `${guide.connector}: the page links a guide that is not published`);
	// The menu, on every page, carries the chip while Coming.
	const menuItem = homeHtml.match(new RegExp(`href="/features/integrations#${guide.connector}"[\\s\\S]{0,1600}?</a>`))?.[0] ?? '';
	if (!menuItem) fail(`${guide.connector}: the Features menu has no item for it`);
	else if (guide.live === menuItem.includes('Coming')) fail(`${guide.connector}: the menu chip disagrees with src/lib/connections.ts`);
}
const anyComing = connectorGuides.some((guide) => !guide.live);
if (anyComing !== html.includes('data-integrations-status="coming"')) fail('the first-screen Coming line does not match the two words');
if (anyComing && !prose.includes('can’t connect a real account yet')) fail('the Coming status sentence changed');

// The boundaries, in both states.
for (const [text, label] of [
	['If you only book catering events, you can skip this integration.', 'the snap line (the app’s own sentence)'],
	['It doesn’t take stock off your shelf.', 'Square: no stock depletion'],
	['It doesn’t turn a sale into an order or a purchase.', 'Square: sales are not orders'],
	['Ingredients, allergens and stock quantities stay in CostCook.', 'Square: what stays'],
	['CostCook never pays a bill, or sends the same invoice twice.', 'QuickBooks: the app’s own boundary'],
	['Nothing goes to QuickBooks until someone presses Send.', 'QuickBooks: every bill is a press'],
	['into your own Stripe account', 'Stripe: the kitchen’s own account'],
	['Working today, in the trial.', 'the working-today section']
]) {
	if (!prose.includes(text)) fail(`missing ${label}: ${text}`);
}
if (!/<nav[^>]*aria-label="On this page"/.test(html)) fail('the On this page nav is missing');

// Never another connector's name, never "seamless".
for (const [pattern, label] of [
	[/\b(Xero|Toast|Clover|ezCater|Google Calendar)\b/, 'names a connector that is not built (owner: no names)'],
	// "There is no automatic send" is the boundary itself, so the pattern is
	// the positive claim only.
	[/\bseamless|\b(syncs?|sends?) automatically|\bautomatically (syncs?|sends?)/i, 'promises an automatic sync'],
	[/\bdeplet/i, 'says sales deplete stock']
]) {
	if (pattern.test(prose)) fail(`the page ${label}`);
}

if (failures.length) {
	console.error(`check-integrations-page: ${failures.length} failure(s)`);
	for (const failure of failures) console.error(`  - ${failure}`);
	process.exit(1);
}
console.log('check-integrations-page: ok');

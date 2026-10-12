import { readFileSync } from 'node:fs';

/**
 * Square and QuickBooks (RC-45, RC-78), read once for every script that checks
 * them: check-integrations-page.mjs and check-blog.mjs (build),
 * verify-blog.mjs and verify-features-menu.mjs (browser).
 *
 * Read by regex, not imported: src/lib/connections.ts imports './comparison'
 * without an extension, which Node's type stripping cannot resolve. Same
 * reason as scripts/lib/invoice-email.mjs.
 *
 * No pattern: two words and a table, like invoice-email.mjs.
 */
const source = readFileSync(new URL('../../src/lib/connections.ts', import.meta.url), 'utf8');

const word = (name) => {
	const found = source.match(new RegExp(`${name} = '(\\w+)'`))?.[1];
	if (!found) throw new Error(`connections: ${name} not found in src/lib/connections.ts`);
	return found;
};

export const squareLive = word('SQUARE_STATUS') === 'yes';
export const quickbooksLive = word('QUICKBOOKS_STATUS') === 'yes';

/** Each connector's guide, published only while its connector is live (src/lib/blog.ts). */
export const connectorGuides = [
	{ connector: 'square', slug: 'square-counter-sales-food-cost', live: squareLive },
	{ connector: 'quickbooks', slug: 'quickbooks-supplier-invoices-as-bills', live: quickbooksLive }
];

export const heldGuideSlugs = connectorGuides.filter((guide) => !guide.live).map((guide) => guide.slug);
export const liveGuideSlugs = connectorGuides.filter((guide) => guide.live).map((guide) => guide.slug);

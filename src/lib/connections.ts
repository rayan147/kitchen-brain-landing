/**
 * What CostCook connects to, as data. story: docs/stories/features-integrations.story.md
 * ledger: RC-45 (Square, QuickBooks), RC-78 (this page and its menu column)
 *
 * Added 2026-10-12 at the owner's request: a third Features column, "Connect
 * your tools", next to "Run the event", and one guide per connector.
 *
 * TWO WORDS, NOT ONE. Square and QuickBooks will not go live on the same day,
 * so each has its own status. Every surface reads these: the menu chips, the
 * feature groups, the tour stops, the page and the blog hold (src/lib/blog.ts).
 *
 * WHY BOTH ARE 'coming' (owner, 2026-10-12: "Coming, posts held"). Read off
 * kitchen-brain on 2026-10-12:
 *  - main = release = ed6ff5f01. src/lib/server/integrations/config.ts throws
 *    "Live ${provider} credentials are not wired yet." outside sandbox mode, and
 *    both features sit behind FEATURE_SQUARE_INTEGRATION_ENABLED and
 *    FEATURE_QUICKBOOKS_INTEGRATION_ENABLED, off by default
 *    (src/lib/server/features/access.ts). No customer can connect a real
 *    Square account or QuickBooks company.
 *  - develop 3e933bcc1 has the go-live code (SQUARE_PRODUCTION_*,
 *    QUICKBOOKS_PRODUCTION_*), but the provider apps, Marketplace review and
 *    the ADR 0010 stage sign-off before INTEGRATIONS_MODE=live are not done
 *    (docs/integrations/square.md, quickbooks.md).
 *
 * FLIP ONE TO 'yes' ONLY WHEN ALL THREE HOLD for that connector, and update
 * RC-45 and RC-78 in the same commit:
 *  1. kitchen-brain origin/main connects a real (not Sandbox) account;
 *  2. its feature flag is on in production, not only by a per-business override;
 *  3. the guide's captures are shot from that build (each post lists them).
 * Flipping publishes that connector's guide, drops its menu chip and moves the
 * /compare row; scripts/check-integrations-page.mjs and check-blog.mjs pin both
 * states.
 *
 * WHAT MAY NOT BE SAID, for either one: a date; that it is in the trial; that
 * Square sales take stock off the shelf (nothing in the app depletes
 * inventory), become orders, or report payouts or profit; that QuickBooks bills
 * go on their own (each one is a press), that CostCook pays a bill, or that it
 * creates accounts. Other connectors are not named: Xero has only a preview
 * adapter and the rest have no code (owner, 2026-10-12: "No names").
 *
 * Considered State; not used because the word changes by hand at release, not
 * at runtime, and the sentences differ only in data. Same shape as
 * src/lib/invoice-email.ts and src/lib/labels.ts.
 */

import type { Verdict } from './comparison';

export const SQUARE_STATUS = 'coming' as Verdict;
export const QUICKBOOKS_STATUS = 'coming' as Verdict;

export const integrationsRoute = '/features/integrations';

const availability = (status: Verdict, anchor: string) => ({
	isComing: status !== 'yes',
	verdict: status,
	word: status === 'yes' ? 'In the app today' : 'Coming',
	route: `${integrationsRoute}#${anchor}`
});

export const squareAvailability = availability(SQUARE_STATUS, 'square');
export const quickbooksAvailability = availability(QUICKBOOKS_STATUS, 'quickbooks');

/** The card-payment anchor; Stripe is shipped (src/lib/event-payments.ts). */
export const cardPaymentsRoute = `${integrationsRoute}#card-payments`;

/**
 * Working today. Each line is already claimed elsewhere on the site, with its
 * evidence there: card payments in src/lib/event-payments.ts and
 * src/lib/ordering.ts (Connect Stripe, the kitchen's own account, no saved
 * cards, no automatic refunds); invoice email in src/lib/invoice-email.ts
 * (RC-73); e-signature in the events group (features.ts, RC-64); the import
 * formats in Integrations.astro (RC-38).
 */
export const workingConnections = [
	{
		id: 'card-payments',
		name: 'Card payments, through Stripe',
		forWhat: 'Getting paid for the event without chasing it.',
		how: 'Connect Stripe in Settings. The client gets a pay link by email for the deposit and the balance, pays on Stripe’s page, and the money goes into your own Stripe account. An online order pays the same way when your booking rules ask for money.',
		limit: 'CostCook doesn’t save cards or refund on its own. Refunds go out from Stripe.',
		href: '/features/events-and-proposals',
		linkLabel: 'Events & proposals'
	},
	{
		id: 'invoice-email',
		name: 'Invoice email',
		forWhat: 'Getting supplier invoices in without typing them.',
		how: 'Your kitchen gets its own private address. Suppliers send invoices there, or you forward them from Gmail. Each one waits in review.',
		limit: 'Nothing counts until you check it.',
		href: '/features/invoice-email',
		linkLabel: 'Invoice email'
	},
	{
		id: 'e-signature',
		name: 'E-signature for the agreement',
		forWhat: 'A signed contract before the event is booked.',
		how: 'The agreement starts from your saved contract template, with the accepted proposal attached as Schedule A, and goes out for e-signature. Or keep a copy signed on paper.',
		limit: 'The event books once everyone has signed, or when you book anyway and write down why.',
		href: '/features/events-and-proposals',
		linkLabel: 'Events & proposals'
	},
	{
		id: 'files',
		name: 'Spreadsheets, PDFs and photos',
		forWhat: 'Prices in, with no connection to your supplier at all.',
		how: 'An order guide, a price sheet, an invoice or a photo of a delivery slip goes through one queue: JPEG, PNG, WebP, PDF, CSV, XLSX or DOCX, or paste it.',
		limit: 'Each one waits in review until you confirm it.',
		href: '/features/invoices-and-price-list-import',
		linkLabel: 'Invoices & price-list import'
	}
] as const;

/**
 * Square, as the test build does it. kitchen-brain develop 3e933bcc1 and main
 * ed6ff5f01: src/routes/settings/integrations/square/+page.svelte,
 * src/routes/analytics/sales/+page.svelte, docs/integrations/square.md.
 * App words are quoted exactly.
 */
export const square = {
	forWho: 'A café counter, a market stall or a meal-prep pickup: food you sell at a register as well as at events.',
	// The app's own sentence, settings/integrations/square/+page.svelte:154-155.
	skipLine: 'If you only book catering events, you can skip this integration.',
	steps: [
		{ title: 'Connect Square', detail: 'The owner signs in to Square from Settings > Integrations. Connecting is not publishing: nothing goes to the register yet.' },
		{ title: 'Publish the dishes you pick', detail: 'Choose the dishes, match each one to a new or existing Square item, check the name, description, price and locations, then publish.' },
		{ title: 'Sales come back', detail: 'Completed sales and refunds from the register come into CostCook. A sale is never turned into an order.' },
		{ title: 'Read Counter sales', detail: 'What sold at the register, what it cost to make at today’s prices, and how much to cook to do it again.' }
	],
	stays: 'Ingredients, allergens and stock quantities stay in CostCook.',
	doesNot: [
		'It doesn’t take stock off your shelf. Counts stay yours.',
		'It doesn’t turn a sale into an order or a purchase.',
		'It isn’t a payout or profit report. The cost is today’s recipe cost, not what you paid back then.'
	]
} as const;

/**
 * QuickBooks Online, as the test build does it. kitchen-brain main ed6ff5f01
 * and develop 3e933bcc1: src/routes/settings/integrations/quickbooks,
 * QuickBooksSetupSteps.svelte, QuickBooksBillSection.svelte,
 * docs/integrations/quickbooks.md (Sandbox-proven 2026-09-12).
 */
export const quickbooks = {
	forWho: 'For whoever keeps the books: the supplier invoices you already checked don’t get typed in a second time.',
	// QuickBooksSetupSteps.svelte:29-58, the app's four step titles.
	steps: [
		{ title: 'Connect your QuickBooks company', detail: 'The owner signs in to QuickBooks Online from Settings > Integrations.' },
		{ title: 'Pick where purchases go', detail: 'Choose the QuickBooks account for food and ingredients, and the one for fees on invoices. CostCook never creates an account.' },
		{ title: 'Match your suppliers', detail: 'Each CostCook supplier is matched to one QuickBooks vendor.' },
		{ title: 'Send each invoice you have checked', detail: 'Press “Send to QuickBooks as a bill” on one invoice, or send several at once. Supplier credits go the same way.' }
	],
	// The "What stays where" card, settings/integrations/quickbooks/+page.svelte.
	never: 'CostCook never pays a bill, or sends the same invoice twice.',
	doesNot: [
		'Nothing goes to QuickBooks until someone presses Send. There is no automatic send.',
		'It never changes your invoice in CostCook. It only reads back whether a bill is paid.',
		'It doesn’t let a manager or staff send bills. Only the workspace owner can.'
	]
} as const;

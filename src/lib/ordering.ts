/**
 * Taking orders, as data. story: docs/stories/taking-orders.story.md
 *
 * AVAILABLE SINCE 2026-09-27. Until then this file said "built, and reachable
 * by nobody": on 2026-09-08 there was no storefront deployment and
 * `FEATURE_ORDERING_INTEGRATION_ENABLED` was unset in production. On
 * 2026-09-27 the owner stated that the flag is on as the deployment default, so
 * every trial kitchen gets online ordering (RC-59). What the flow does is read
 * off kitchen-brain ed6ff5f01 (docs/research/lanes/C.yaml, C-notes.md, rows
 * C-04 to C-13):
 *
 *   Settings > Ordering site: save the storefront, connect Stripe, switch on
 *   the menus clients may order, then Go live. The client picks a menu,
 *   dishes, a date (closed and full dates are greyed), pickup or delivery, and
 *   contact and diet details, then sends the request. Nothing is charged. The
 *   owner or a manager approves or declines. Approval emails a pay link; the
 *   client pays on Stripe's page within the 72-hour payment window, and that
 *   payment confirms the order. A balance due date (14 days before the event
 *   by default) sends one reminder email with its own pay link. Clear requests
 *   can approve themselves (off by default). A custom or large request takes
 *   no money and becomes an Inquiry.
 *
 * WHAT MAY NOT BE SAID. Each boundary is the app's own:
 *
 *  1. A request is described as awaiting kitchen confirmation. It is never a
 *     booked event, and approval is not confirmation: only the client's
 *     payment (Stripe's webhook, never a browser return) confirms it.
 *  2. The browser sends menu, item, portion and modifier selections without
 *     prices. The server re-resolves publication and availability and computes
 *     every amount. No surface may suggest a client's browser knows a price.
 *  3. Card payment is Stripe Connect on the kitchen's own account. (Event
 *     deposits and balances are paid by card too since the owner ruling of
 *     2026-10-06; src/lib/event-payments.ts.) No saved cards, no automatic
 *     refunds, one reminder per balance, and no client invoices.
 *  4. The widget protocol has five outbound states and no inbound command: no
 *     navigation, HTML, script, client-contact or payment payload crosses into
 *     the frame. Approved embed origins are defence in depth, not
 *     authorization.
 *
 * THE WORD. ORDERING_STATUS is 'yes' with RC-59. The feature group's status
 * reads it, and the claim guard pins it with the ledger row.
 *
 * THE PAGE. /features/online-ordering exists since 2026-10-08 (owner: show
 * the drop-off film and say the form can sit on the caterer's own website).
 * Its settings walk is read off local develop 7a7e407d9: Settings >
 * Integrations > Ordering site, tabs Setup, Menus, Look, Put on your website.
 * Its captures come from that app, never the live storefront, and the website
 * tab is printed as text because a local capture names localhost and a real
 * site id. Still no `comparisonNote`: a /compare row obligates re-verifying
 * two competitors' pricing pages (RC-40).
 *
 * No pattern: a table the sections render.
 */
import type { Verdict } from './comparison';

export const ORDERING_STATUS = 'yes' as Verdict;

export const orderingRoute = '/features/online-ordering';
export const orderingSeoDescription =
	'Clients order catering from your own ordering page or a form on your website. The order arrives priced, and you approve it.';

export const orderingStatusWord = ORDERING_STATUS === 'yes' ? 'In the app today' : 'Coming';
const orderingIsComing = ORDERING_STATUS !== 'yes';

/** One status flip, with each public surface receiving copy for its own job. */
export const orderingAvailability = {
	isComing: orderingIsComing,
	verdict: ORDERING_STATUS,
	word: orderingStatusWord,
	featureLead: orderingIsComing ? 'Built, not deployed, marked Coming.' : 'In the app today.',
	featureDetail: orderingIsComing
		? 'A customer picks from the menu you published, sizes the choices, gives you the date and the headcount, leaves their contact, and reads it back before sending. It arrives awaiting kitchen confirmation, which means you still say yes to it. The storefront and the embeddable widget are built and are not deployed anywhere a customer could reach, so this stays marked Coming.'
		: 'Put your menus on an ordering page of your own, or paste one snippet into the website you already have. A client picks a menu, the dishes, a date and the headcount, leaves their contact and diet needs, and sends it. It arrives awaiting kitchen confirmation, and you approve or decline. Your booking rules decide what happens next: approving confirms it, or emails a pay link and the client’s payment through your Stripe account confirms it.',
	menuDescription: orderingIsComing
		? 'A storefront and an embeddable widget, built and not yet deployed.'
		: 'Clients request from your own ordering page; you approve, and their payment confirms it.',
	faqStatus: orderingIsComing
		? [
				'Not in the app you would start today. The storefront and the widget are built and are not deployed anywhere a customer could reach them, so this stays marked Coming and carries no date.',
				'When it lands, a customer picks from a menu you published, sizes the choices, gives you the date, the headcount and their contact, and reads it back before sending. What arrives is awaiting kitchen confirmation rather than a booked event, and you still say yes to it. Every amount is worked out by CostCook after the selections arrive: the browser sends what the customer chose, without prices, and never a number of its own. Card details are a handoff to Stripe, and the app says plainly when no online charge happened.'
			]
		: [
				'Yes. Put your menus on an ordering page of your own, or on a site you already have. A client picks a menu, the dishes and a date (closed and full dates are greyed out), chooses pickup or delivery, and sends the request. Nothing is charged, and it arrives awaiting kitchen confirmation rather than as a booked event. You approve or decline it, or let clear requests approve themselves.',
				'What approval does is set by your booking rules. A new account takes no online payment, so approving confirms the order. Set a rule to pay in full, or a deposit then the balance, and approval emails the client a pay link instead: they pay on Stripe’s page, into your own Stripe account, within 72 hours, and that payment confirms the order. A balance gets its own pay link and one reminder email. Every amount is worked out by CostCook after the selections arrive: the browser sends what the client chose, without prices. A bespoke request, or one your booking rules send to you, takes no money and comes to you to price. There are no saved cards and no automatic refunds.'
			]
} as const;

export const ordering = {
	name: 'Taking orders',
	/** Provenance stays here and in the ledger, never in public capture labels. */
	verified: { sha: 'ed6ff5f01', branch: 'main', on: '2026-09-27' },
	modes: [
		{
			lead: 'A page of your own.',
			detail: 'A hosted ordering page on its own address, separate from the app. The client needs no login.'
		},
		{
			lead: 'Or a piece of a site you already have.',
			detail: 'One small script that mounts a sandboxed frame. It is under 12 KiB and pulls in nothing else.'
		}
	],
	stages: ['Menu', 'Choices', 'Event', 'Contact', 'Review'],
	/** The five boundaries, in the words a surface would have to keep. */
	notClaimed: [
		'What arrives is awaiting kitchen confirmation. Approval is not confirmation: the client’s payment confirms the order, and nothing on the site may call a request booked.',
		'The browser sends the selections without prices. CostCook re-reads what is published and available and works out every amount.',
		'The pay link is good for 72 hours. If nothing is paid, the day is freed and the order waits to be approved again.',
		// "online orders only" contradicted event card payment, live since the
		// owner ruling of 2026-10-06 (chef audit 2026-10-07).
		'Card payment runs through your own Stripe account. No saved cards, no automatic refunds, one reminder per balance, and no client invoices.',
		'The widget speaks five states outward and takes no inbound command: nothing navigates, injects or reaches into the frame.'
	]
} as const;

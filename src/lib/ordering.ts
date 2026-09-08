/**
 * Taking orders, as data. story: docs/stories/taking-orders.story.md
 *
 * BUILT, AND REACHABLE BY NOBODY. Read off kitchen-brain `develop` on
 * 2026-09-08: `apps/ordering` is a complete standalone storefront (no
 * database, no auth, no internal imports, five stages) and
 * `packages/widget-loader` is a dependency-free IIFE under a 12 KiB budget
 * that mounts a sandboxed iframe. Both are documented in that repo's
 * docs/architecture/. Neither is deployed.
 *
 * THE EVIDENCE IS THE DEPLOYMENT, NOT THE BRANCH. Three checks, all run
 * 2026-09-08: `vercel project ls` returns three projects and none of them is
 * the storefront; `order.costcook.io`, the canonical origin named in the
 * architecture doc, is NXDOMAIN; and `FEATURE_ORDERING_INTEGRATION_ENABLED`
 * is absent from the app's production environment, which `featureDefault()`
 * reads as off for every workspace. A caterer who starts a trial today cannot
 * take an order. That sentence is why the word below is `coming`.
 *
 * WHAT MAY NOT BE SAID. Four boundaries, each traced to the app's own
 * architecture documents, each a sentence no surface may contradict:
 *
 *  1. A submission is described as awaiting kitchen confirmation, and is never
 *     a confirmed event. The hosted app is deliberate about this; the landing
 *     page may not upgrade it.
 *  2. The browser sends menu, item, portion and modifier selections without
 *     prices. The server re-resolves publication and availability and computes
 *     every amount. No surface may suggest a customer's browser knows a price.
 *  3. Stripe is a handoff. The hosted app has an explicit state saying no
 *     online charge and no confirmation occurred, so no surface may turn this
 *     into a promise about money reaching a caterer.
 *  4. The widget protocol has five outbound states and no inbound command: no
 *     navigation, HTML, script, customer-contact or payment payload crosses
 *     into the frame. Approved embed origins are defence in depth, not
 *     authorization.
 *
 * FLIPPING THE WORD. When a Vercel project exists for the storefront, DNS
 * resolves, the flag is on, and one real order has been placed end to end, set
 * ORDERING_STATUS to 'yes' here and update RC-59 in the same commit. The
 * feature group's status and the menu chip both read it, so they cannot
 * disagree. The claim guard pins the word until the ledger row changes.
 *
 * NOT YET HERE, AND ON PURPOSE: no `comparisonNote` and no `seoDescription`.
 * A /compare row obligates re-verifying two competitors' living pricing pages
 * against VERIFIED_ON (RC-40), and a dedicated page obligates captures of a
 * storefront nobody can reach. Both arrive with the deployment, not before.
 *
 * No pattern: a table the sections render.
 */
import type { Verdict } from './comparison';

export const ORDERING_STATUS = 'coming' as Verdict;

export const orderingStatusWord = ORDERING_STATUS === 'yes' ? 'Available now' : 'Coming';
const orderingIsComing = ORDERING_STATUS !== 'yes';

/** One status flip, with each public surface receiving copy for its own job. */
export const orderingAvailability = {
	isComing: orderingIsComing,
	verdict: ORDERING_STATUS,
	word: orderingStatusWord,
	featureLead: orderingIsComing ? 'Built, not deployed, marked Coming.' : 'Available now.',
	featureDetail: orderingIsComing
		? 'A customer picks from the menu you published, sizes the choices, gives you the date and the headcount, leaves their contact, and reads it back before sending. It arrives awaiting kitchen confirmation, which means you still say yes to it. The storefront and the embeddable widget are built and are not deployed anywhere a customer could reach, so this stays marked Coming.'
		: 'A customer picks from the menu you published, sizes the choices, gives you the date and the headcount, leaves their contact, and reads it back before sending. It arrives awaiting kitchen confirmation, which means you still say yes to it.',
	menuDescription: orderingIsComing
		? 'A storefront and an embeddable widget, built and not yet deployed.'
		: 'Take the enquiry on your own page or on a site you already have.',
	faqStatus: orderingIsComing
		? [
				'Not in the app you would start today. The storefront and the widget are built and are not deployed anywhere a customer could reach them, so this stays marked Coming and carries no date.',
				'When it lands, a customer picks from a menu you published, sizes the choices, gives you the date, the headcount and their contact, and reads it back before sending. What arrives is awaiting kitchen confirmation rather than a booked event, and you still say yes to it. Every amount is worked out by CostCook after the selections arrive: the browser sends what the customer chose, without prices, and never a number of its own. Card details are a handoff to Stripe, and the app says plainly when no online charge happened.'
			]
		: [
				'Yes. A customer picks from a menu you published, sizes the choices, gives you the date, the headcount and their contact, and reads it back before sending. What arrives is awaiting kitchen confirmation rather than a booked event, and you still say yes to it.',
				'Every amount is worked out by CostCook after the selections arrive: the browser sends what the customer chose, without prices, and never a number of its own. Card details are a handoff to Stripe, and the app says plainly when no online charge happened.'
			]
} as const;

export const ordering = {
	name: 'Taking orders',
	/** Provenance stays here and in the ledger, never in public capture labels. */
	verified: { sha: 'develop', branch: 'develop', on: '2026-09-08' },
	modes: [
		{
			lead: 'A page of your own.',
			detail: 'A hosted storefront on its own address, separate from the app, holding no login and no database of its own.'
		},
		{
			lead: 'Or a piece of a site you already have.',
			detail: 'One small script that mounts a sandboxed frame. It is under 12 KiB and pulls in nothing else.'
		}
	],
	stages: ['Menu', 'Choices', 'Event', 'Contact', 'Review'],
	/** The four boundaries, in the words a surface would have to keep. */
	notClaimed: [
		'What arrives is awaiting kitchen confirmation. It is not a booked event and nothing on the site may say it is.',
		'The browser sends the selections without prices. CostCook re-reads what is published and available and works out every amount.',
		'Stripe is a handoff, and the app states plainly when no online charge and no confirmation happened.',
		'The widget speaks five states outward and takes no inbound command: nothing navigates, injects or reaches into the frame.',
		'None of this is in the subscription a caterer would start today.'
	]
} as const;

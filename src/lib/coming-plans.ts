/**
 * Owner-confirmed additions that are Coming soon as of 2026-08-30.
 * Story: docs/stories/homepage-coming-plans.story.md
 *
 * Kitchen label printing is deliberately absent: its status is release-flag
 * aware and remains owned by src/lib/labels.ts.
 *
 * DIETARY CHARACTERISTICS LEFT THIS FILE ON 2026-09-09, because it shipped. It
 * was here from 2026-08-30 saying the app does not assess vegan or gluten-free
 * and infers nothing from an ingredient name, and by 2026-09-09 that was a
 * false negative on four published surfaces and a Coming row on /compare
 * against products that ship it. What replaced it is RC-60 and
 * src/lib/dietary.ts, which owns the shipped wording the way this file owns the
 * unshipped.
 *
 * BUYING TO PAR LEFT THIS FILE ON 2026-09-27, the same way. Inventory > Build
 * shopping list builds what to buy for confirmed events and your par, by
 * supplier (kitchen-brain e2e/buy-to-par.spec.ts, production and unflagged;
 * gap report F1). Its /compare row is now a yes and RC-43 records it. One plan
 * left, and the count is pinned in scripts/check-landing-claims.mjs on
 * purpose: this list only ever shrinks by something shipping.
 *
 * ONE ADDED ON 2026-09-27, and that is the other legal way in: an owner
 * ruling that the work is being built. Event deposits are recorded by hand in
 * production (inventory A-14); a card payment page for a booked event's
 * deposit and balance, and a reminder email before the balance is due, are
 * on kitchen-brain feat/client-payment-booking-loop (A-18). The homepage's
 * EventBooking Coming line, the events guide, /pricing, /compare and the FAQ
 * all render this entry, so the wording changes here and nowhere else.
 */

import { depositMethods } from './events';

// Considered Strategy; not used because availability and wording vary as
// shared data, not as behavior selected or swapped at runtime.
export const comingPlans = {
	spanish: {
		id: 'spanish',
		title: 'Spanish',
		comparisonLabel: 'English and Spanish',
		verdict: 'coming' as const,
		homepage: 'Use CostCook in Spanish as well as English.',
		comparisonNote: 'Coming soon. CostCook is English only today; no date is promised.',
		faq:
			'A Spanish version is Coming soon. CostCook is English only today, and no date is promised.'
	},
	eventPayments: {
		id: 'eventPayments',
		title: 'Card payment for booked events',
		comparisonLabel: 'Card payment for event deposits and balances',
		verdict: 'coming' as const,
		homepage:
			'A card payment page for the deposit and the balance of a booked event, and a reminder email before the balance is due.',
		comparisonNote: `Coming soon. Today you record an event deposit by hand, as ${depositMethods}; no date is promised.`,
		faq: `Not yet. Card payment for booked events is Coming soon: a card payment page for the deposit and the balance, and a reminder email before the balance is due. Today you record the deposit by hand, as ${depositMethods}, and no date is promised.`
	}
} as const;

export const comingPlanList = Object.values(comingPlans);

/**
 * Card payment for booked events, as shipped. Left src/lib/coming-plans.ts on
 * 2026-10-06 by owner ruling, the same way dietary characteristics and buying
 * to par did: the work it described (kitchen-brain
 * feat/client-payment-booking-loop) is live on test.app.costcook.io.
 *
 * Read off the app, not remembered:
 * - The event page's Deposit and payments block: "Card, by email link." for the
 *   deposit and the balance, "Asked for" against "Received", and Request
 *   payment for the balance (test.app event Nair & Castellano wedding,
 *   2026-10-06; public/proof/home/payment-schedule.png).
 * - The reminder: kitchen-brain src/lib/server/orders/approval/balance-reminders.ts,
 *   "the daily sweep that reminds the client on the day it falls due", for a
 *   card balance still owed. The email carries a pay link
 *   (public/proof/home/balance-reminder.png).
 *
 * Every surface that rendered the Coming entry renders this instead, so the
 * wording changes here and nowhere else.
 *
 * Considered State; not used because the wording changes by hand at release,
 * not at runtime. Same shape as src/lib/invoice-email.ts.
 */

import { depositMethods } from './events';

export const eventPayments = {
	id: 'event-payments',
	title: 'Card payment for booked events',
	comparisonLabel: 'Card payment for event deposits and balances',
	verdict: 'yes' as const,
	homepage:
		'The client pays the deposit and the balance by card from an email link. Send the balance request whenever you choose, and if it is still owed on the due day, a reminder with a pay link goes out.',
	comparisonNote: `The deposit and the balance are paid by card from an email link; a reminder goes out on the day the balance is due. You can still record a payment by hand, as ${depositMethods}.`,
	faq: `Yes. The client pays the deposit and the balance by card from a link in an email, and CostCook shows what was asked for against what came in. On the day the balance is due, the client gets a reminder email with a pay link. You can still record a payment by hand, as ${depositMethods}.`
} as const;

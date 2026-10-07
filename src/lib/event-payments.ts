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
 *   "the daily sweep that reminds the client a few days before it falls due"
 *   (BALANCE_REMINDER_LEAD_DAYS = 3 on develop 7a7e407d9; it was the due day
 *   before), for a card balance still owed. The email carries a pay link
 *   (public/proof/home/balance-reminder.png, sent by that sweep as of Dec 6
 *   for the Dec 9 balance).
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
	// Not "booked events": the deposit is paid before the event is booked.
	title: 'Card payment for event deposits and balances',
	comparisonLabel: 'Card payment for event deposits and balances',
	verdict: 'yes' as const,
	homepage:
		'The client pays the deposit and the balance by card, from a link in an email. You send the balance request whenever you choose. If it is still owed three days before it is due, they get a reminder with a pay link.',
	comparisonNote: `The deposit and the balance are paid by card from an email link; a reminder goes out three days before the balance is due. You can still record a payment by hand, as ${depositMethods}.`,
	faq: `Yes. The client pays the deposit and the balance by card from a link in an email, and CostCook shows what was asked for against what came in. Three days before the balance is due, if it is still owed, the client gets a reminder email with a pay link. You can still record a payment by hand, as ${depositMethods}.`
} as const;

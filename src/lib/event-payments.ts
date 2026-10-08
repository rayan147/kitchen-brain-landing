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

/**
 * The customer invoice, as shipped (owner ruling 2026-10-08, "yes, update
 * them"; until then the events page said there was none). Read off
 * kitchen-brain develop 185451a1b; Issue invoice and Send invoice are at
 * 7a7e407d9 too:
 * - src/lib/components/orders/CustomerInvoiceCard.svelte,
 *   on the order's Money tab: Issue invoice, "Issued from the revision the
 *   client accepted, so the total is the one they signed.", payments applied
 *   (receivables/auto-apply.ts applies them), Copy client link, "The link
 *   doesn't expire."
 * - SendInvoiceAction.svelte: Send invoice, then Send again.
 * - The client's copy, src/routes/invoice: Pay $X on a secure Stripe page for
 *   the next payment owed, or the kitchen's own How to pay lines when it is not
 *   a card payment (receivables/invoice-pay.ts); Print or save as PDF.
 * - receivables/read.ts and issue.ts: only an order from an event's accepted
 *   proposal has one. An online order carries an Approval and no agreement, so
 *   it has no invoice.
 * Left out: the QuickBooks line on the card, because QuickBooks is Coming here.
 */
export const eventInvoice = {
	title: 'An invoice from the proposal they accepted',
	body: 'On the order’s Money tab, Issue invoice makes a numbered invoice from the proposal the client accepted, so the total is the one they signed, and what they’ve already paid comes off it. Send invoice emails them a link that doesn’t expire. If you take cards through CostCook, it has a Pay button for what’s due next. If you collect it yourself, it shows the payment instructions you saved. They can print it or save it as a PDF.',
	onlineOrders: 'An invoice comes from an accepted proposal, so an online order has none.'
} as const;

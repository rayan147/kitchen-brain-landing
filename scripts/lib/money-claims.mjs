/**
 * The two money claims the landing site may not make, shared by the source
 * scan (check-landing-claims.mjs) and the built events page contract
 * (check-events-proposals-page.mjs), so the two cannot drift apart again.
 *
 * WHAT THEY GUARD. An EVENT deposit is recorded by hand in production
 * (inventory A-14, RC-65); card payment for it is being built
 * (feat/client-payment-booking-loop) and is a Coming plan. And there is no
 * client or customer invoice in CostCook (front-of-house PRD 06, unbuilt).
 *
 * WHAT THEY DO NOT GUARD. Storefront online ordering is live (RC-59): there the
 * client pays through the kitchen's own Stripe account, and copy like "the
 * client pays ... to hold your date" is true. The verbs below are the
 * caterer's (collect, take, charge, accept), never the client's "pay", so
 * that copy is out of reach by construction. The self-test at the foot pins
 * both sides.
 *
 * Considered Strategy (one matcher object per claim); not used because each
 * claim is a regular expression and a label, which is data, and both callers
 * already loop over [pattern, label] pairs.
 */

// Up to three words between the verb and the noun, never across a sentence.
const gap = String.raw`(?:\s+[^\s.;:!?]+){0,3}?`;

export const eventDepositClaim = new RegExp(
	String.raw`\b(?:(?:collect|take|charge|accept)(?:s|ed|ing|n)?|took|get(?:s|ting)? paid on)\b${gap}\s+deposits?\b` +
		String.raw`|\bdeposits?\s+(?:is|are|was|were|gets?|will\s+be|can\s+be)\s+(?:collected|taken|charged|accepted)\b`,
	'i'
);

export const clientInvoiceClaim = new RegExp(
	String.raw`\b(?:send|sends|sending|sent)\s+(?:the\s+|a\s+|your\s+)?(?:clients?|customers?)\s+(?:an\s+|the\s+)?invoices?\b` +
		String.raw`|\binvoic\w*\s+(?:to\s+)?(?:your\s+)?(?:clients?|customers?)\b`,
	'i'
);

export const moneyClaims = [
	[eventDepositClaim, 'event deposit collection claim (A-14, RC-65: recorded by hand; card payment is Coming)'],
	[clientInvoiceClaim, 'client invoicing claim (front-of-house PRD 06 is unbuilt)']
];

// SELF-TEST, run on import: a widened pattern that stops catching the old
// phrasing, or starts catching true copy, fails before any page is scanned.
const mustMatch = [
	[eventDepositClaim, 'CostCook collects the deposit'],
	[eventDepositClaim, 'take a deposit from the client'],
	[eventDepositClaim, 'charge your client a deposit'],
	[eventDepositClaim, 'accept card deposits'],
	[eventDepositClaim, 'get paid on the event deposit'],
	[eventDepositClaim, 'the deposit is collected when they accept'],
	[eventDepositClaim, 'Deposits are charged to the card'],
	[eventDepositClaim, 'collects\n\tthe deposit'],
	[clientInvoiceClaim, 'send the client an invoice'],
	[clientInvoiceClaim, 'send clients an invoice'],
	[clientInvoiceClaim, 'invoice your clients from the event'],
	[clientInvoiceClaim, 'invoicing to customers']
];
const mustNotMatch = [
	[eventDepositClaim, 'You record the deposit by hand, as a check, cash, a transfer or your own card processor'],
	[eventDepositClaim, 'Ask for a deposit and record what arrives'],
	[eventDepositClaim, 'Track the deposit, then press Confirm order'],
	[eventDepositClaim, 'the client pays through your own Stripe account to hold your date'],
	[eventDepositClaim, 'They accept it or ask for changes. The deposit is recorded by hand.'],
	[clientInvoiceClaim, 'There is no customer invoice in CostCook.'],
	[clientInvoiceClaim, 'one reminder per balance, and no client invoices.'],
	[clientInvoiceClaim, 'Photograph the supplier invoice']
];
for (const [pattern, text] of mustMatch) {
	if (!pattern.test(text)) throw new Error(`money-claims self-test: ${pattern} no longer catches "${text}"`);
}
for (const [pattern, text] of mustNotMatch) {
	if (pattern.test(text)) throw new Error(`money-claims self-test: ${pattern} flags true copy "${text}"`);
}

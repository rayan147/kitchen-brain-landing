/**
 * Invoice email, as data. story: docs/stories/features-invoice-email.story.md
 * ledger: RC-73
 *
 * WHAT IT IS. Each kitchen gets a private address (`invoices-` plus 16
 * letters and numbers, at in.costcook.io). Suppliers send invoices there, or
 * the owner forwards them from Gmail, and each email lands in Purchases >
 * Invoice inbox saying what became of it. An invoice or credit memo waits in
 * the same review as an upload; nothing counts until a person confirms it.
 * Read off kitchen-brain origin/main ed6ff5f01 on 2026-09-28 (inventory F-03).
 *
 * WHY THE WORD IS 'coming'. The code is on main and the settings page shows an
 * address in production, but production receives no mail: kitchen-brain
 * `infra/cdk/environments.ts:156` sets the production inbox to
 * `nameServers: [], worker: false`, and `dig +short MX in.costcook.io` returned
 * nothing on 2026-09-28. Only the test environment receives mail end to end
 * (since 2026-09-25). Invoice email is gated by infrastructure, not by a
 * release flag, so the owner's "all switches on" ruling of 2026-09-27 does not
 * reach it.
 *
 * FLIP TO 'yes' ONLY WHEN ALL THREE HOLD, then update RC-73 in the same commit:
 *  1. `dig +short MX in.costcook.io` answers with an SES inbound host;
 *  2. kitchen-brain origin/main shows production `inbox.worker: true`;
 *  3. an email sent to a production kitchen's address appears in its Invoice
 *     inbox.
 * Flipping it publishes the setup guide (src/lib/blog.ts) and drops the menu
 * chip; the claim guard and scripts/check-blog.mjs pin both states.
 *
 * WHAT MAY NOT BE SAID. That invoices import automatically or hands-free
 * (each waits in review); that every invoice is read (past 100 pages a day a
 * document waits for tomorrow, and a spreadsheet attachment is not read); any
 * accuracy claim about the reading.
 *
 * Considered State; not used because the word changes by hand at release, not
 * at runtime, and the sentences below differ only in data. Same shape as
 * src/lib/labels.ts.
 */

import type { Verdict } from './comparison';

export const INVOICE_EMAIL_STATUS = 'coming' as Verdict;

const invoiceEmailIsComing = INVOICE_EMAIL_STATUS !== 'yes';

export const invoiceEmailRoute = '/features/invoice-email';

/** The app's caps, verbatim from kitchen-brain src/lib/server/inbox. */
export const inboxLimits = {
	emailsPerDay: 200, // receive.ts DAILY_MESSAGE_CAP
	pagesReadPerDay: 100, // ocr-budget.ts DAILY_OCR_PAGE_CAP
	graceDays: 14 // address.ts ROTATION_GRACE_DAYS
} as const;

/**
 * What became of each email, in the app's own words (kitchen-brain
 * src/lib/inbox/outcomes.ts OUTCOME_COPY). Only the outcomes an owner meets
 * in a normal week; "Reading it" and "Gmail forwarding code" are covered in
 * the setup steps instead.
 */
export const inboxOutcomes = [
	{ label: 'Invoice', reason: 'Waiting in review. It counts once you confirm it.' },
	{ label: 'Credit memo', reason: 'Waiting in review. Once confirmed, it comes off your cost.' },
	{ label: 'Statement', reason: 'Kept, not imported. It repeats invoices you already have.' },
	{ label: 'Order confirmation', reason: 'Nothing to import. The invoice comes later.' },
	{ label: 'Duplicate', reason: 'Same invoice as one you already have, so it was not added again.' },
	{ label: 'Held as spam', reason: 'Not read. Let it through if you know the sender.' },
	{ label: 'Nothing to read', reason: 'No PDF or photo came with it. Ask the sender for a PDF.' },
	{ label: 'Over today’s limit', reason: 'Not read. More email arrived today than a kitchen gets. Ask the sender to resend tomorrow.' },
	{ label: 'Needs a look', reason: 'Not sure what this is. Choose what it is below.' }
] as const;

/** The four Gmail steps, as the settings page numbers them. */
export const gmailSteps = [
	'In Gmail, open Settings, then Forwarding and POP/IMAP, and add your invoice address.',
	'Gmail sends that address a confirmation code. It appears at the top of Settings > Invoice email and on Today, usually within a minute.',
	'Enter the code in Gmail.',
	'Make a Gmail filter for your suppliers’ invoice emails and choose “Forward it to” your invoice address.'
] as const;

/** One status flip; each surface receives copy for its own job. */
export const invoiceEmailAvailability = {
	isComing: invoiceEmailIsComing,
	verdict: INVOICE_EMAIL_STATUS,
	word: invoiceEmailIsComing ? 'Coming' : 'Available now',
	/** Follows the status word on the feature page, so it does not repeat it. */
	pageSentence: invoiceEmailIsComing
		? 'It is built, and it is not receiving email for trial kitchens yet, so keep uploading invoices until this line changes.'
		: 'In the CostCook subscription you would start today.',
	featureLead: invoiceEmailIsComing ? 'Coming; not receiving email yet.' : 'A private address for invoices.',
	featureDetail: invoiceEmailIsComing
		? 'Each kitchen will get a private invoice address for suppliers to send to or for you to forward to from Gmail. Every email will wait in review. Until it is receiving email, upload invoices as a photo or PDF.'
		: 'Suppliers send invoices to your kitchen’s private address, or you forward them from Gmail. Each email shows what became of it, and an invoice waits in review until you confirm it.',
	seoDescription: invoiceEmailIsComing
		? 'A private invoice address for each kitchen: suppliers email invoices, you forward from Gmail, and every one waits in review before it touches your costs. Coming; not receiving email yet.'
		: 'A private invoice address for each kitchen: suppliers email invoices, you forward from Gmail, and every one waits in review before it touches your costs.'
} as const;

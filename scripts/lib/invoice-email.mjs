import { readFileSync } from 'node:fs';

/**
 * Invoice email (RC-73), read once for every script that checks it:
 * check-landing-claims.mjs (source), check-invoice-email-page.mjs and
 * check-blog.mjs (build), verify-blog.mjs (browser). Each had its own copy of
 * the status regex and the banned wording, and the copies had already drifted
 * ("set and forget" was banned in one and not the other).
 *
 * Read by regex, not imported: src/lib/invoice-email.ts imports './comparison'
 * without an extension, which Node's type stripping cannot resolve. Same
 * reason as scripts/lib/tour-stops.mjs.
 *
 * No pattern: constants and two regular expressions, like money-claims.mjs.
 */
const source = readFileSync(new URL('../../src/lib/invoice-email.ts', import.meta.url), 'utf8');

const word = source.match(/INVOICE_EMAIL_STATUS = '(\w+)'/)?.[1];
if (!word) throw new Error('invoice-email: INVOICE_EMAIL_STATUS not found in src/lib/invoice-email.ts');

/** 'yes' or 'coming', as src/lib/invoice-email.ts says. */
export const invoiceEmailStatus = word;
export const invoiceEmailLive = word === 'yes';

/** The setup guide, published only while the feature is live (src/lib/blog.ts). */
export const setupGuideSlug = 'supplier-invoices-by-email';

/** The outcome labels the page renders, in order, from `inboxOutcomes`. */
const outcomesBlock = source.slice(source.indexOf('export const inboxOutcomes'), source.indexOf('] as const;', source.indexOf('export const inboxOutcomes')));
export const inboxOutcomeLabels = [...outcomesBlock.matchAll(/label: '([^']+)'/g)].map((m) => m[1]);
if (inboxOutcomeLabels.length === 0) throw new Error('invoice-email: no inboxOutcomes labels found');

/** An emailed invoice waits in review; no copy may say it imports on its own. */
export const importsOnItsOwn = /\bautomatic(ally)?\b|auto-?import|hands-?free|set and forget|seamless/i;

/** A real address is `invoices-` plus 16 base32 characters; never print one. */
export const workingAddress = /invoices-[0-9a-z]{16}@/;

/**
 * Sage, the in-app assistant, as data. story: docs/stories/sage.story.md
 *
 * ONE STATUS, READ EVERYWHERE. /compare's row, the /features group (and so
 * /pricing's in-development list), the header menu chip, the homepage section
 * and the FAQ all read SAGE_STATUS from here. The word may change in exactly
 * one place, and the ledger (RC-46, RC-49) says what has to be true before it
 * does. Considered a Strategy over status (a per-status renderer); not used:
 * the variation is one word and a boolean, which is data, and every surface
 * already knows how to render 'coming' and 'yes'.
 *
 * WHY IT IS 'coming' ON 2026-08-29. Verified on kitchen-brain-develop-demo at
 * sandbox/demo e8b69fe4: the feature is built, tested and behind a fail-closed
 * flag. `SAGE_ENABLED` must equal the exact string 'enabled' or the route 404s
 * and the nav item disappears, and nothing in that repo sets it outside two
 * test harnesses. "Coming" is therefore true of the app a visitor would start
 * today, which is the only thing a status word here is allowed to describe.
 *
 * TO FLIP THIS TO 'yes' (the release owner, not a branch): confirm
 * SAGE_ENABLED=enabled and a real provider key on the DEPLOYED app, walk one
 * question in production, update RC-49's evidence, then change the word.
 *
 * WHAT MAY NOT BE SAID, from the app repo's own truth ledger for this
 * feature: the name of the model or the provider; any claim that it learns or
 * remembers a kitchen; the absolute form of the honesty claim (the ledger
 * softens it to: answers from records, says when evidence is missing); a
 * per-record entry point from an order page (designed, not built); anything
 * beyond the six tools listed below. The claim check scans whole files for the
 * first three, comments included, which is why none is spelled out here.
 */
import type { Verdict } from './comparison';

export const SAGE_STATUS = 'coming' as Verdict;

export const sage = {
	name: 'Sage',
	/** The app's own one-line description, verbatim from its page header. */
	tagline:
		'Ask about your kitchen. Sage reads your records, shows where every number came from, and can prepare a draft for you to approve.',
	/** Where the app repo was read. Printed beside the captures. */
	verified: { sha: 'e8b69fe4', branch: 'sandbox/demo', on: '2026-08-29' },
	href: '/features/team-and-connections#features-assistant',
	/**
	 * The six tools, one line each, in the reader's words. Five read, one
	 * drafts. There is no seventh; a line here without a tool behind it is a
	 * promise the answer breaks.
	 */
	abilities: [
		{ ask: 'What needs my attention for Saturday?', does: 'Reads the same attention list the Today screen shows, for one date or all of them.' },
		{ ask: 'What else is on that date?', does: 'Lists the orders on a day: name, guests, status, drafts included.' },
		{ ask: 'Why does this dish cost what it costs?', does: 'Walks the recipe line by line, with each line’s share of the plate.' },
		{ ask: 'Which prices went up?', does: 'Reads the purchase ledger for price moves and says how many purchases the move rests on. Managers and owners only.' },
		{ ask: 'What came up short in receiving?', does: 'Lists the open receiving follow-ups, without the supplier’s contact details.' },
		{ ask: 'Prepare the shopping list', does: 'Drafts one. You see what it creates and what it does not touch, then you approve or discard it. Managers and owners only.' }
	],
	/** Read off the code, not the prompt. Each is enforced in a test. */
	guardrails: [
		{ lead: 'Every number has a source.', detail: 'Sources are collected from the checks that actually ran, and links are built by the app, so an answer cannot cite a record it did not read.' },
		{ lead: 'It never changes a record on its own.', detail: 'Five checks read. One prepares a draft. Nothing sends, buys, reprices or adjusts, and the draft waits for a person.' },
		{ lead: 'It cannot reach another kitchen.', detail: 'No check takes a kitchen as an argument. Your session decides what it can see, and a record it does not own resolves to nothing.' },
		{ lead: 'It reads what your role can read.', detail: 'Price moves are for managers and owners. An answer built on them is redacted for staff in a shared thread.' },
		{ lead: 'It says when evidence is missing.', detail: 'Each line is marked as from your records, calculated, Sage’s read, or missing evidence. A check that did not complete is named as one.' },
		{ lead: 'It has limits, and a stop.', detail: 'Eight steps, a minute per answer, a cap per kitchen per day, and a kill switch that leaves every other screen working.' }
	],
	proof: {
		desktop: {
			src: '/proof/sage-answer.png',
			width: 1622,
			height: 1288,
			alt: 'A Sage answer. You asked: which ingredient prices went up recently? Sage: Calculated, cucumber from Coastline Produce rose by 37.5 percent. Confirmed, the price went from $24.00 to $33.00. Confirmed, this change was found across 2 purchases, last seen on 2026-08-26. Where this came from: ingredient, cucumber, $24.00 to $33.00, with a link to the record. Below, the ask box, placeholder: what needs my attention for Saturday’s order? And a note: Enter sends. Sage reads your records and can prepare a draft; it never changes anything on its own.'
		},
		mobile: {
			src: '/proof/sage-answer-mobile.png',
			width: 652,
			height: 866,
			alt: 'A Sage answer on a phone. You asked: which ingredient prices went up recently? Sage: Calculated, cucumber from Coastline Produce rose by 37.5 percent. Confirmed, the price went from $24.00 to $33.00. Confirmed, this change was found across 2 purchases, last seen on 2026-08-26. Where this came from: ingredient, cucumber, $24.00 to $33.00, with a link to the record.'
		},
		caption:
			'Captured on the sandbox build on 2026-08-29, in a fixture kitchen made for testing Sage, not the wedding in the tour. The cucumber, the supplier and the prices are the fixture’s.'
	}
} as const;

/** The status word every surface prints beside the name. */
export const sageStatusWord = SAGE_STATUS === 'yes' ? 'Shipped' : 'Coming';

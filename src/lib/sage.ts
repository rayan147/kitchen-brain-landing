// story: docs/stories/sage-feature.story.md
/**
 * Sage, the in-app assistant, as data. story: docs/stories/sage.story.md
 * Copy-density revision: docs/stories/homepage-copy-density.story.md
 *
 * ONE STATUS, READ EVERYWHERE. /compare's row, the /features group (and so
 * /pricing's in-development list), the header menu chip, the homepage section
 * and the FAQ all read SAGE_STATUS from here. The word may change in exactly
 * one place, and the ledger (RC-46, RC-49) says what has to be true before it
 * does. Considered a Strategy over status (a per-status renderer); not used:
 * the variation is one word and a boolean, which is data, and every surface
 * already knows how to render 'coming' and 'yes'.
 *
 * WHY IT IS 'yes' ON 2026-08-29. The release owner confirmed Sage is available
 * in the marketed app and asked the landing site to stop presenting it as a
 * future feature. The implementation remains fail-closed behind SAGE_ENABLED;
 * the public release decision is recorded in RC-46 and RC-49.
 *
 * WHAT MAY NOT BE SAID, from the app repo's own truth ledger for this
 * feature: the name of the model or the provider; any claim that it learns or
 * remembers a kitchen; the absolute form of the honesty claim (the ledger
 * softens it to: answers from records, says when evidence is missing); a
 * per-record entry point from an order page (designed, not built); anything
 * beyond the tools and three draft kinds kitchen-brain ships (RC-49: 22 read
 * tools, 3 draft kinds, no commit tool; the list below is a selection of them). The claim check scans whole files for the
 * first three, comments included, which is why none is spelled out here.
 */
import type { Verdict } from './comparison';

export const SAGE_STATUS = 'yes' as Verdict;

/**
 * The counts kitchen-brain ships (RC-49): read-only tools, and the kinds of
 * draft Sage may prepare for approval. Every sentence that counts them spells
 * these through words.ts, so a count cannot drift between /features, the FAQ,
 * the homepage and /compare. The draft kinds are listed, not counted, so the
 * count and the names are one fact.
 */
export const sageReadToolCount = 22;
export const sageDraftKinds = [
	'the kitchen shopping list',
	'one order’s shopping list',
	'a guest-count change on a draft order'
] as const;

/** "The kitchen shopping list, one order’s shopping list, and a guest-count change on a draft order". */
export const sageDraftKindsAnd = new Intl.ListFormat('en', { type: 'conjunction' }).format(sageDraftKinds);
/** The same three, as alternatives: "..., or a guest-count change on a draft order". */
export const sageDraftKindsOr = new Intl.ListFormat('en', { type: 'disjunction' }).format(sageDraftKinds);

export const sage = {
	name: 'Sage',
	/** The app's own one-line description, verbatim from its page header. */
	tagline:
		'Ask about your kitchen. Sage reads your records, shows where every number came from, and can prepare a draft for you to approve.',
	/** Internal provenance for release review; never printed beside the captures. */
	verified: { sha: '7a7e407d9', branch: 'develop (local)', on: '2026-10-07' },
	href: '/features/sage',
	onboarding: {
		entry: 'Open Ask Sage from the setup header.',
		context:
			'Starting questions follow the setup stage and the records entered so far, so an empty kitchen is not prompted to ask about orders it does not have.',
		return:
			'Progress saves after each setup stage, and Back to setup returns to the unfinished stage.'
	},
	/** A selection of the read tools and the three drafts, in kitchen words. */
	abilities: [
		{ ask: 'What needs my attention for Saturday?', does: 'Reads the same attention list the Today screen shows, for one date or all of them.' },
		{ ask: 'What else is on that date?', does: 'Lists the orders on a day: name, guests, status, drafts included.' },
		{ ask: 'What should we prep for Saturday?', does: 'Builds the prep view for one date from the orders already on the books.' },
		{ ask: 'Which ingredients are below par?', does: 'Reads trusted inventory counts and names ingredients below the par you set.' },
		{ ask: 'Why does this dish cost what it costs?', does: 'Walks the recipe line by line, with each line’s share of the plate.' },
		{ ask: 'Find the chicken recipes', does: 'Searches recipes by name and the ingredients they use.' },
		{ ask: 'Which recipes contain sesame?', does: 'Finds recipes carrying a reviewed allergen through their ingredients.' },
		{ ask: 'What is the nutrition for this recipe?', does: 'Shows recipe nutrition and tells you which nutrient values or unit conversions are missing.' },
		{ ask: 'Which prices went up?', does: 'Reads the purchase ledger for price moves and says how many purchases the move rests on. Managers and owners only.' },
		{ ask: 'What came up short in receiving?', does: 'Lists the open receiving follow-ups, without the supplier’s contact details.' },
		{ ask: 'What is left in setup?', does: 'Reads setup progress and points to the unfinished stage. Managers and owners only.' },
		{ ask: 'Prepare the shopping list', does: 'Drafts the kitchen’s list, or one order’s. You see what it creates and what it does not touch, then you approve or discard it. Managers and owners only.' },
		{ ask: 'Change Saturday’s draft to 32 guests', does: 'Drafts the guest-count change on a draft order. The price per guest holds and the total follows once you approve. Managers and owners only.' }
	],
	/** The homepage introduces the breadth without repeating the full diligence list. */
	homepageGroups: [
		{ name: 'Run the shift', detail: 'Attention, orders, prep and receiving follow-ups for a date.' },
		{ name: 'Check a recipe', detail: 'Search, cost, nutrition and reviewed allergen facts.' },
		{ name: 'Check stock and buying', detail: 'Below-par ingredients and recent price moves.' },
		{ name: 'Finish setup', detail: 'Progress and the unfinished stage, for managers and owners.' },
		{ name: 'Prepare one change', detail: 'A draft shopping list or guest-count change, for a manager or owner to approve.' }
	],
	/** Read off the code, not the prompt. Each is enforced in a test. */
	guardrails: [
		{ lead: 'Every number has a source.', detail: 'Links are built by the app, so an answer cannot cite a record it did not read.' },
		{ lead: 'It never changes a record on its own.', detail: 'Nothing sends, buys, reprices or adjusts. A draft waits for a manager or owner to approve it.' },
		{ lead: 'It cannot reach another kitchen.', detail: 'Sage can only use records in the kitchen account you are signed into.' },
		{ lead: 'It reads what your role can read.', detail: 'Price moves are for managers and owners. An answer built on them is redacted for staff in a shared thread.' },
		{ lead: 'It says when evidence is missing.', detail: 'Each line is marked as from your records, calculated, Sage’s read, or missing evidence. A check that did not complete is named as one.' },
		{ lead: 'It has limits, and a stop.', detail: 'Sage has answer time limits and a daily usage cap. If it stops, you can continue working in the rest of CostCook.' }
	],
	proof: {
		// Re-shot on local develop 7a7e407d9, 2026-10-07, in the wedding's sample
		// kitchen (scripts/capture-sage-proof.mjs). The answer was checked against
		// the records: $7.00 + $0.20 + $0.08 = $7.28, the homepage's short rib.
		desktop: {
			src: '/proof/sage-answer.png',
			width: 1428,
			height: 808,
			alt: 'A Sage answer. You asked: why does the Braised Short Rib cost what it costs? Sage: the Braised Short Rib costs $7.28 per portion to make, driven almost entirely by the boneless beef short rib. Three cited lines, each linked to the recipe: beef short rib, boneless, $7.00 per portion, 96 percent of the recipe cost; House Beef Stock, $0.20, 3 percent; Mirepoix Base, $0.08, 1 percent.'
		},
		mobile: {
			src: '/proof/sage-answer-mobile.png',
			width: 780,
			height: 1100,
			alt: 'The same Sage answer on a phone: the Braised Short Rib costs $7.28 per portion, beef short rib $7.00 (96 percent), House Beef Stock $0.20 (3 percent), Mirepoix Base $0.08 (1 percent), each linked to the recipe.'
		},
		caption:
			'The wedding’s short rib, $7.28 a portion, broken into the three lines that make it, each linked to the recipe it came from.'
	}
} as const;

/** The status word every surface prints beside the name. */
// "In the app today", not "Available now": the badge reads as a fact, not a sales
// line (chef audit 2026-10-07). Same word on labels, invoice email, ordering.
export const sageStatusWord = SAGE_STATUS === 'yes' ? 'In the app today' : 'Coming';

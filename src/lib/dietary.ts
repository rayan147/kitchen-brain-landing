// story: docs/stories/dietary-guards.story.md
/**
 * Guests' restrictions and dietary guards: the shipped wording, in one place.
 *
 * WHY A FILE AND NOT A PARAGRAPH. Until 2026-09-09 this capability was a row in
 * src/lib/coming-plans.ts saying the app does not assess vegan or gluten-free
 * and infers nothing from an ingredient name. It shipped, so that row was a
 * false negative on four published surfaces at once (the homepage Coming band,
 * /compare, the FAQ, and the boundary list on the nutrition feature page) and a
 * Coming verdict against products that do ship it. Every surface reads this file
 * now, the way labels.ts owns the label status and ordering.ts owns one word, so
 * the next correction is one edit rather than four.
 *
 * RC-60 is the ledger row. Everything below is read off kitchen-brain `main`
 * on 2026-09-09:
 *
 *   src/lib/domain/allergens/guards.ts   the engine: DIET_CODES, TRAIT_CODES,
 *                                        DIET_RULES, GuardOutcome, worstOutcome
 *   drizzle/0089_order_dietary_guards.sql
 *   docs/stories/dietary-characteristics.story.md   the standing-catalog side
 *   docs/stories/order-dietary-guards.story.md      the per-order side
 *
 * THE BOUNDARY IS THE PRODUCT'S OWN SENTENCE, not ours: "CostCook detects, it
 * never certifies." The engine's header says every outcome is a reason to look
 * at an ingredient, never a promise to a guest with an EpiPen. No surface here
 * may say safe, certified, guaranteed or allergen-free, and the claim guard
 * fails the build on all four.
 *
 * WHAT MAY NOT BE CLAIMED, even though the code would let a sentence run there:
 * that a clear result is a guarantee, that halal or kosher can be decided by the
 * app (slaughter and certification are facts it cannot see, so both cap at
 * "check"), or that a confirmed order re-reads itself when the catalog moves. It
 * does not: confirm freezes the reading and the screen says so.
 *
 * Considered Strategy; not used because this is static release wording read by
 * five surfaces, not behaviour selected at runtime. The one variation, the diet
 * list, is a table.
 */

import { spell, spellCapital } from './words';

/**
 * The allergens the app tags, the fixed US nine, in the app's seed order
 * (kitchen-brain drizzle/0034_dizzy_klaw.sql:10-19; no custom allergens exist
 * and no later migration inserts more). Every count sentence on the site reads
 * its word from this list, so the number cannot drift from the list again: it
 * said "fourteen" on six surfaces until 2026-09-27.
 */
export const allergenNames = [
	'Milk', 'Egg', 'Fish', 'Crustacean shellfish', 'Tree nuts',
	'Peanuts', 'Wheat', 'Soy', 'Sesame'
] as const;
export const allergenCount = spell(allergenNames.length);
export const allergenCountCapital = spellCapital(allergenNames.length);

/** The five diets the app judges a dish against, in the engine's order. */
export const dietNames = ['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-free'] as const;

/** The three answers a guard can give. Unknown is never clear. */
export const guardOutcomes = [
	{
		word: 'Conflict',
		detail: 'A reviewed ingredient contains the named allergen or has a characteristic that conflicts with the guest’s diet.'
	},
	{
		word: 'Check',
		detail: 'Review is needed: an ingredient may contain the allergen, information is missing, or the diet requires checks the app cannot make.'
	},
	{
		word: 'Clear',
		detail: 'Every ingredient has been reviewed and no conflict was found in the recorded information. This is not a guarantee about the food you serve.'
	}
] as const;

export const dietary = {
	/** The name the app uses on the recipe panel. */
	title: 'Dietary characteristics',
	comparisonLabel: 'Guest restrictions checked per dish',
	verdict: 'yes' as const,
	comparisonNote:
		`Five diets and the ${allergenCount} major US allergens, judged from confirmed ingredient facts on every dish of an order, and printed on the prep and pack lists. It detects and never certifies: halal and kosher cap at check, and an unreviewed ingredient is never clear.`,
	faq:
		'Yes. Record who is eating on the order, by allergen or by diet, and every dish is judged against them from the ingredient facts your kitchen confirmed. Vegetarian, vegan, halal, kosher and gluten-free. Each dish comes back conflict, check or clear, with the ingredient named, and the answer prints on the prep and pack lists. It detects, it never certifies: halal and kosher can only ever be a check, because slaughter and certification are facts the app cannot see, and an ingredient nobody reviewed is never counted as clear.',

	/** The sentence every surface hangs on. One line, the product's own. */
	boundary: 'CostCook detects, it never certifies.',

	/** What a reader must be told before believing a clear row. */
	notClaimed: [
		'A clear result means no conflict was found in the recorded ingredient information. Your kitchen must still check the food and its preparation. No screen makes an allergen-free claim.',
		'Halal and kosher can only ever come back as a check. Slaughter and certification are facts the app cannot see.',
		'An ingredient nobody has reviewed is never counted as clear. The order says how many are outstanding.',
		'Confirming an order freezes the reading it was checked on. A later change to a recipe does not restate it, and the screen says when it was checked.'
	],

	href: '/features/guest-restrictions-and-dietary-guards'
} as const;

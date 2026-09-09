/**
 * Nutrition facts, as data. story: docs/stories/nutrition-facts.story.md
 *
 * SHIPPED, AND THE PAPER TOO. RC-42 has backed the computed panel since
 * 2026-08-23. On 2026-08-29 the print page was read off sandbox/demo dff9469c
 * (`src/routes/catalog/recipes/[id]/nutrition-label/`, a live read model with
 * no feature flag in front of it), so "printed" moved from Coming to Yes in
 * one deliberate act, recorded as RC-50. What is STILL Coming is the label
 * printer integration (`label_printing`, RC-35): the panel prints from the
 * browser onto label stock, and no sentence here may say more than that.
 *
 * THE MEAL-PREP ANGLE IS THE READER'S, NOT A CLAIM. A meal-prep kitchen is
 * asked for calories and protein before it is asked for a price. That is a
 * fact about the customer, and the section says it as one. Every sentence
 * about what the app does traces to RC-42 or RC-50.
 *
 * WHAT MAY NOT BE SAID, from the app's own screens: that the estimate is a
 * regulatory-compliance claim (the print says it is not); that dietary
 * characteristics ship today (they are Coming, RC-47); that the ingredient
 * order is a weight-order claim (the screen says it is not); that anything
 * is allergen-free (the screen says no such claim is made).
 *
 * CUT 2026-09-09, copy-density pass. BRIEF-copy-density-2026-09-09.md, and the
 * tracker at docs/stories/homepage-copy-density.story.md. This section was the
 * fattest on the homepage, 476 visible words for one mechanic, and the reason
 * was internal: the cue rail under each point ENUMERATES what that point's
 * detail paragraph had already spelled out. Point 4's detail listed the panel,
 * the ingredient statement, the allergen line and the printed time; the cues
 * beneath it read Panel / Ingredients / Allergens / Printed time. Same for the
 * three allergen evidence sources, the USDA match, and the blank-not-zero rule.
 * The details now state the claim once and let the rail do the listing.
 *
 * WHAT LEFT THE HOMEPAGE AND WHERE IT STILL LIVES. "raw, cooked or prepared",
 * "used everywhere the ingredient appears", the sheet's contents and the three
 * allergen evidence sources are all in NutritionFactsAllergensFeature.astro,
 * which this section links to. The blank-not-zero rule left the LEDE, not the
 * page: point 3 is the whole claim and the lede was saying it first.
 *
 * THE PINNED PHRASE MOVED HOUSE. check-landing-claims.mjs requires the literal
 * "not a retail-label compliance claim" in this file. It used to be carried by
 * point 4's detail, the caption AND notClaimed[0], which said "retail-label
 * regulatory compliance claim" and so did not match the pin at all. It is now
 * carried once, by notClaimed[0], in the exact words the guard reads, which is
 * where a boundary belongs. Do not re-add it to the caption.
 *
 * No pattern: a table the section renders once.
 */
import { dietary } from './dietary';

export const nutrition = {
	verified: { sha: 'dff9469c', branch: 'sandbox/demo', on: '2026-08-29' },
	href: '/features/nutrition-facts-and-allergens',
	/** In the order a meal-prep reader asks. */
	points: [
		{
			lead: 'Calories and protein, per portion.',
			detail: 'The four a customer asks for sit at the top of every recipe. The other eleven sit under them.'
		},
		{
			lead: 'From USDA profiles, matched by you.',
			detail: 'Each ingredient is matched once to a USDA FoodData Central record, and sub-recipes roll up to the dish.'
		},
		{
			lead: 'Partial is said out loud.',
			detail: 'A profile missing a value leaves the row blank instead of counting it as zero. An incomplete dish is never totalled as a complete one.'
		},
		{
			lead: 'Print it from the recipe.',
			detail: 'Print nutrition label opens a sheet your browser puts on label stock, with your kitchen name at the top.'
		},
		{
			lead: 'Allergens ride along, with evidence.',
			detail: 'Fourteen-allergen tagging per ingredient, recorded only from evidence. A recipe with unreviewed ingredients says so, and no screen ever claims allergen-free.'
		}
	],
	notClaimed: [
		'The estimate is not a retail-label compliance claim, and the printed sheet says so.',
		// WAS THE COMING SENTENCE UNTIL 2026-09-09. Dietary characteristics shipped,
		// so the boundary this list owes the reader is no longer "we do not do it"
		// but the two caps on the thing we do. RC-60, src/lib/dietary.ts.
		`${dietary.boundary} ${dietary.notClaimed[1]}`,
		'The ingredient statement is in recipe order, not a regulatory weight order.',
		'A label printer integration is being built and carries no date. Today the sheet prints from the browser.'
	],
	proof: {
		panel: {
			src: '/proof/nutrition-panel.png',
			width: 2272,
			height: 1732,
			alt: 'The complete Nutrition section for a 297 gram Chicken Burrito Bowl. The summary shows 339 calories, 22 grams protein, 48.1 grams carbohydrate, and 7 grams fat. All fifteen Nutrition Facts rows are populated, including explicit zero values for trans fat, added sugars, and vitamin D. The allergen review says Contains: Milk, Soy, and the source is USDA FoodData Central branded record 2704502.'
		},
		label: {
			src: '/proof/nutrition-label.png',
			width: 768,
			height: 1956,
			alt: 'The printable nutrition label sheet for Chicken Burrito Bowl from Maple and Main Catering. The complete per-portion Nutrition Facts panel shows 339 calories, 7 grams total fat, 3.5 grams saturated fat, 0 grams trans fat, 50.5 milligrams cholesterol, 561 milligrams sodium, 48.1 grams carbohydrate, 3.9 grams fiber, 6 grams total sugars, 0 grams added sugars, 22 grams protein, 0 micrograms vitamin D, 199 milligrams calcium, 2.6 milligrams iron, and 680 milligrams potassium. The sheet also lists the ingredient, Contains: Milk, Soy, USDA FoodData Central 2704502, and the calculated-estimate disclaimer.'
		},
		caption:
			'Captured from the live CostCook demo on 2026-08-29. A 297 g Chicken Burrito Bowl, on USDA FoodData Central branded record 2704502, with milk and soy confirmed.'
	}
} as const;

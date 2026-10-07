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
 * RE-SHOT ON DEVELOP, 2026-10-07 (owner: "local develop latest"; capture
 * notes in scripts/capture-nutrition-proof.mjs). Develop gates printing: a
 * dish with an unconfirmed source or a blank label line is a "Draft estimate.
 * Not ready to print.", Preview label shows it with a dash per blank line and
 * Print label off, and the print route refuses until the gate clears. None of
 * the demo world's 90 recipes cleared it, so the proof is the honest draft on
 * Wild Mushroom Polenta (the wedding menu) and the print sentence names the
 * gate. What the printed sheet carries is read from develop's
 * NutritionLabelSheet.svelte, not from a capture.
 *
 * No pattern: a table the section renders once.
 */
import { dietary, allergenCount } from './dietary';

export const nutrition = {
	verified: { sha: '7a7e407d9', branch: 'develop (local)', on: '2026-10-07' },
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
			lead: 'Print it once it is whole.',
			detail: 'Preview label shows the panel any time. Print label switches on when every source is confirmed and no line is blank, and your browser puts the sheet on label stock, kitchen name at the top.'
		},
		{
			lead: 'Allergens ride along, with evidence.',
			detail: `Tagging for the ${allergenCount} major US allergens per ingredient, recorded only from evidence. A recipe with unreviewed ingredients says so, and no screen ever claims allergen-free.`
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
			height: 1176,
			alt: 'The Nutrition tab for Wild Mushroom Polenta, one 240 gram portion: Draft estimate. Not ready to print, 7 label lines blank because no source reports them; 530 calories, 19 grams fat, 18 grams protein, 77 grams carbs, each a draft from unconfirmed sources; 8 of 15 label lines filled; then the ingredient sources, most gaps first, and the ingredient statement.'
		},
		label: {
			src: '/proof/nutrition-label.png',
			width: 1344,
			height: 1944,
			alt: 'Preview label for Wild Mushroom Polenta from Harbor and Hearth Catering, marked Draft estimate. Not ready to print. The Nutrition Facts panel for one 240 gram portion shows 530 calories, 19 grams total fat, 300 milligrams sodium, 77 grams total carbohydrate, 5 grams dietary fiber, 18 grams protein, 300 milligrams calcium and 0.6 milligrams iron, and a dash for saturated fat, trans fat, cholesterol, total and added sugars, vitamin D and potassium. Below it, the ingredients in recipe order and Print label, switched off.'
		},
		caption:
			'Captured in CostCook on 2026-10-07: Wild Mushroom Polenta from the sample wedding menu, one 240 g portion, still a draft. Print label stays off until every line has a confirmed source.'
	}
} as const;

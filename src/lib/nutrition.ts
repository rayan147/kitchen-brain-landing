/**
 * Nutrition facts, as data. story: docs/stories/nutrition-facts.story.md
 *
 * SHIPPED, AND THE PAPER TOO. RC-42 has backed the computed panel since
 * 2026-08-23. On 2026-08-29 the print page was read off sandbox/demo e8b69fe4
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
 * characteristics are assessed (they are not, RC-47); that the ingredient
 * order is a weight-order claim (the screen says it is not); that anything
 * is allergen-free (the screen says no such claim is made).
 *
 * No pattern: a table the section renders once.
 */
export const nutrition = {
	verified: { sha: 'e8b69fe4', branch: 'sandbox/demo', on: '2026-08-29' },
	href: '/features/compliance-and-labels#features-nutrition',
	/** In the order a meal-prep reader asks. */
	points: [
		{
			lead: 'Calories and protein, per portion, on the recipe you already costed.',
			detail: 'The four numbers a customer asks for sit at the top of every recipe: calories, protein, carbs, fat. Under them, the fifteen an FDA panel carries, computed per portion or per batch.'
		},
		{
			lead: 'From USDA profiles, matched by you.',
			detail: 'Each ingredient is matched once to a USDA FoodData Central record, raw, cooked or prepared, and that source is used everywhere the ingredient appears. Sub-recipes roll up to the dish.'
		},
		{
			lead: 'Partial is said out loud.',
			detail: 'A profile that lacks a value leaves the row blank instead of counting it as zero, and the panel says which values are missing. An incomplete dish is never totalled as a complete one.'
		},
		{
			lead: 'Print it from the recipe.',
			detail: 'Print nutrition label opens a sheet with your kitchen name, the panel, the ingredient statement, the allergen line and the time it was printed, for your browser to put on label stock. It says on the sheet that it is a calculated estimate, not a retail-label compliance claim.'
		},
		{
			lead: 'Allergens ride along, with evidence.',
			detail: 'Fourteen-allergen tagging per ingredient, recorded only from a supplier record, a package label or a kitchen review. A recipe with unreviewed ingredients says so, and no screen ever makes an allergen-free claim.'
		}
	],
	notClaimed: [
		'The estimate is not a retail-label regulatory compliance claim, and the printed sheet says so on the sheet.',
		'Dietary characteristics (vegan, gluten-free and the like) are not assessed. Nothing is inferred from an ingredient name.',
		'The ingredient statement is in recipe order, not a regulatory weight order.',
		'A label printer integration is being built and carries no date. Today the sheet prints from the browser.'
	],
	proof: {
		panel: {
			src: '/proof/nutrition-panel.png',
			width: 2272,
			height: 2452,
			alt: 'The Nutrition section of a recipe, Chicken Shawarma, per portion, with a Print nutrition label button. A strip of four: Calories 245, Protein 45.4 g, Carbs 2.7 g, Fat blank. A notice: some label nutrients are unavailable; the source profiles do not provide every Nutrition Facts value, and missing values stay blank instead of being counted as zero. A Nutrition Facts panel: Calories 245, Total Carbohydrate 2.7 g at 1 percent daily value, Protein 45.4 g, every other row blank. Beside it: the ingredient statement in recipe order, an allergen review marked incomplete for six ingredients with no allergen-free claim, dietary characteristics not assessed, and a sources list: chicken breast, coriander, kosher salt and Greek yogurt from USDA FoodData Central records 2646170, 170922, 173468 and 2259794; oregano and chili flake from seeded demo references.'
		},
		label: {
			src: '/proof/nutrition-label.png',
			width: 716,
			height: 2232,
			alt: 'The printable nutrition label sheet for Chicken Shawarma from Maple and Main Catering: calculated estimate, per portion, some values unavailable. A Nutrition Facts panel with Calories 245, Total Carbohydrate 2.7 g, Protein 45.4 g and the other rows blank; the ingredient statement in recipe order; an allergen review incomplete line with no allergen-free claim; the nutrition sources, four USDA FoodData Central records and two seeded demo references; and a footer: live recipe calculation printed 8/29/26, 10:20 AM, this estimate is not a claim of retail-label regulatory compliance.'
		},
		caption:
			'Captured from the running app in the tour’s demo kitchen, on the sandbox build, 2026-08-29 (scripts/capture-proof.mjs). Four of Chicken Shawarma’s six ingredients were matched to USDA FoodData Central records through the app’s own search; two still carry the demo world’s seeded profiles. Where a source does not carry a value the row is blank, which is the behaviour the section describes.'
	}
} as const;

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
 * characteristics are assessed (they are not, RC-47); that the ingredient
 * order is a weight-order claim (the screen says it is not); that anything
 * is allergen-free (the screen says no such claim is made).
 *
 * No pattern: a table the section renders once.
 */
export const nutrition = {
	verified: { sha: 'dff9469c', branch: 'sandbox/demo', on: '2026-08-29' },
	href: '/features/nutrition-facts-and-allergens',
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
			'Captured at 2× resolution from the live CostCook demo on 2026-08-29. This 297 g Chicken Burrito Bowl uses the manufacturer analytical values published in USDA FoodData Central branded record 2704502, including all fifteen label nutrients and confirmed milk and soy allergens. The sheet remains a calculated estimate, not a retail-label compliance claim.'
	}
} as const;

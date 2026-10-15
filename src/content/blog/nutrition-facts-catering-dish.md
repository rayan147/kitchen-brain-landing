---
title: "How to get nutrition facts for a catering dish, and where they stop"
menuTitle: "Nutrition facts for a dish"
description: "A step-by-step guide with a screenshot at every step: tell CostCook how recipes weigh each ingredient, check its USDA values, read the dish's panel, and see why a blank line stays blank."
publishedDate: 2026-11-12
category: Recipes & yield
menuGroup: Cost the work
menuIcon: label
featured: false
order: 27
readMinutes: 10
featureHref: /features/nutrition-facts-and-allergens
featureLabel: See nutrition facts in CostCook
---
<!-- story: docs/stories/blog-nutrition-facts-catering-dish.story.md -->
<!-- Read off kitchen-brain local develop f38ea126e on 2026-10-13 (RC-84),
     re-shot after the nutrition fixes merged: a USDA source with no weigh
     answer offers "Answer how recipes weigh it" (no more Confirm that did
     nothing), the window brings you back to the recipe, a cremini search
     tries USDA's "crimini", and a draft names its real reason ("Draft · 4
     label lines blank"). Labels are the app's own. Not claimed: any
     compliance, certification or lab accuracy; per-batch panels (not seen).
     CAPTURES: 18 crops at 390 px from a localhost build of develop f38ea126e
     with a live USDA FoodData Central key, demo seed renamed Harbor & Hearth
     Catering, US units, all from one run on a fresh copy. The four polenta
     ingredients were matched through the app's own window: the food already
     in use for Parmesan, polenta and butter, and the fuller "Mushrooms,
     brown, italian, or crimini, raw" for the cremini, each weighed raw, as
     bought; "No added sugars (0 g)" was chosen for the raw mushrooms. Dialog
     crops were taken with the dialog's sticky footer unstuck. -->

By the end of this guide, a dish in CostCook has a nutrition panel per portion, worked out from its ingredients, and you'll know which lines are real numbers and which are still unknown.

Nutrition in CostCook lives on each ingredient, not on the dish. For each ingredient you pick its USDA food once and say how your recipes weigh it, and every recipe that uses it adds the numbers up by weight. If no source reports a value, that line stays blank. The app's own words: "A blank means unknown, never zero."

## Before you start

- The dish is a recipe in CostCook, and every ingredient line has a weight, or a conversion to one.
- USDA search is set up for your kitchen. If it isn't, you can still type values from the package.
- Have the packages to hand. They fill the lines USDA leaves blank.

## Get the panel for one dish

1. Open the recipe and tap **Nutrition**.

![The recipe's tabs: Method, Allergens marked To review, and Nutrition, ringed.](/proof/blog/nutrition-facts-catering-dish/n-01-tab-mobile.png "Nutrition is a tab on the recipe.")

2. Read the top of the panel. Until each ingredient's source is settled, the numbers stay blank, and a note says what's missing.

![Nutrition, per portion. Worked out from each ingredient's source. A blank means unknown, never zero. Preview label. Nutrition needs a weight or source. Polenta needs an answer for how recipes weigh it. Answer how recipes weigh it. Calories, Fat, Protein and Carbs each blank: Blank until you answer how recipes weigh 4 ingredients.](/proof/blog/nutrition-facts-catering-dish/n-02-blank-mobile.png "Wild Mushroom Polenta, one 240 g portion, before anything is settled.")

3. Scroll to **Ingredient sources, most gaps first**. Each ingredient shows its USDA food and how many label lines it leaves blank. Press **Answer how recipes weigh it** on one.

![The Parmesan, block row: USDA, not confirmed, #170848, 2 lines missing, and Answer how recipes weigh it, ringed.](/proof/blog/nutrition-facts-catering-dish/n-03-sources-mobile.png "The number is how many label lines this ingredient can't fill.")

4. CostCook opens the ingredient's **Match nutrition** window and searches USDA. The food already in use is picked for you. If it's the food you cook with, press **Next: how recipes weigh it**.

![Currently using: Cheese, parmesan, hard. It stays in use until you save a replacement. Search USDA foods: Parmesan, block. 8 results. No close food match yet. Try block, or review the other results carefully. Hide other foods (8). Cheese, parmesan, grated, 14 of 15. Cheese, parmesan, hard, selected and ringed: 392 kcal, 35.8 g protein, 13 of 15.](/proof/blog/nutrition-facts-catering-dish/n-04-find-mobile.png "The food in use is already selected.")

![Next: how recipes weigh it, ringed.](/proof/blog/nutrition-facts-catering-dish/n-04b-next-mobile.png "Step 1 of 2 done.")

5. Say how your recipes weigh it. If "2 lb" on a recipe means the cheese as it comes, pick **Raw, as bought**.

![When a recipe says "2 lb Parmesan, block", is that weight: Raw, as bought, weighed before cooking, selected and ringed. Cooked, weighed after cooking. Choose how recipes weigh this ingredient. A wrong choice changes every label using it.](/proof/blog/nutrition-facts-catering-dish/n-05-weigh-mobile.png "A wrong choice changes every label using it.")

6. Check the values against what you actually use, then press **Use this source**.

![Check the values, per 100 g. 13 of 15 label values reported by source. Calories 392 kcal, Total Fat 25 g, Saturated Fat 14.9 g, Cholesterol 68 mg, Sodium 1175 mg, Total Carbohydrate 3.2 g, Dietary Fiber 0 g, Total Sugars 0.1 g, Protein 35.8 g, Vitamin D 0.5 mcg, Calcium 1184 mg, Iron 0.8 mg, Potassium 92 mg. Still unknown: trans fat, added sugars. A missing value is not zero.](/proof/blog/nutrition-facts-catering-dish/n-06-values-mobile.png "Values are per 100 g, as USDA reports them.")

![Use this source, ringed.](/proof/blog/nutrition-facts-catering-dish/n-06b-use-mobile.png "Saves the food and the answer together.")

7. CostCook brings you back to the recipe's **Nutrition** tab and says "Nutrition matched for Parmesan, block." The ingredient now reads **Confirmed**.

![The Parmesan, block row: Confirmed, Cheese, parmesan, hard, 2 lines missing, and Change.](/proof/blog/nutrition-facts-catering-dish/n-07-confirmed-row-mobile.png "One ingredient settled.")

8. Do the same for every ingredient in the list. If the food in use reports few values, pick a fuller one. Here the cremini's food reported only 10 of 15 values, and CostCook warns: "Labels would be mostly blank." It also searched USDA's spelling, crimini, for you, and found a raw one with 14 of 15.

![Try “crimini” for “cremini”. Check the food and form before saving. Best matches, same food, different forms. Mushrooms, brown, italian, or crimini, raw: Raw, 22 kcal, 2.5 g protein, 14 of 15, ringed. The same, exposed to ultraviolet light, 13 of 15. Mushroom, crimini, the food in use, selected: 24 kcal, 3.1 g protein, 10 of 15. Only 10 of 15 label values. Labels would be mostly blank.](/proof/blog/nutrition-facts-catering-dish/n-08-fuller-mobile.png "More values, fewer blanks on the label.")

9. Some foods don't report added sugars, and CostCook asks. Pick **No added sugars (0 g)** only if you know none were added, like raw mushrooms. Otherwise pick **Leave unknown**.

![Added sugars. This source does not report added sugars. Check the package or recipe. No added sugars (0 g), selected and ringed, and Leave unknown.](/proof/blog/nutrition-facts-catering-dish/n-09-added-sugars-mobile.png "Don't guess zero.")

10. With every ingredient settled, the panel fills in. If some lines are still blank, it says how many. Press **Preview label** to see the panel as it stands.

![Nutrition, per portion, Preview label ringed. Draft estimate. Not ready to print. 4 label lines are blank because no source reports them. Fix blanks. Calories 530, Fat 19 g, Protein 18 g, Carbs 78 g, each marked Draft, 4 label lines blank.](/proof/blog/nutrition-facts-catering-dish/n-10-matched-mobile.png "Every source settled. Four lines still unknown.")

11. Read the label. A dash means no source reports that line. It isn't a zero.

![A Nutrition Facts panel for one portion (240 g): Calories 530. Total Fat 19 g, 24%. Saturated Fat 11 g, 57%. Trans Fat shows a dash. Cholesterol 50 mg, 16%. Sodium 300 mg, 13%. Total Carbohydrate 78 g, 28%. Dietary Fiber 4 g, 13%. Total Sugars 2 g. Includes Added Sugars shows a dash. Protein 18 g. Vitamin D shows a dash. Calcium 320 mg, 25%. Iron 0.6 mg, 4%. Potassium shows a dash.](/proof/blog/nutrition-facts-catering-dish/n-11-label-mobile.png "Four dashes: four lines nobody has a number for yet.")

12. **Print label** stays off until every source is confirmed and no line is blank. To fill the blanks, see **Fix blanks** under "If something goes wrong" below.

![The bottom of the label preview: the ingredient statement, Polenta, Mushroom, cremini, Parmesan, block, Butter, unsalted, and Print label, ringed and greyed out.](/proof/blog/nutrition-facts-catering-dish/n-12-print-btn-mobile.png "Greyed out while any line is blank.")

## Where the numbers stop

- **One missing value blanks the line for the whole dish.** If the polenta's source doesn't report potassium, the dish's potassium line is a dash, even though the cheese and the mushrooms report theirs.
- **Matching an ingredient changes every recipe that uses it.** The app says so above the list: "Changes also reach other recipes that use it."
- **The panel is worked out, not measured.** It adds up each ingredient's source by weight. It isn't a lab test of the finished dish.

**Tip:** start with the ingredient at the top of the list. It's sorted most gaps first, so one fix can fill several lines.

**Tip:** when a package lists a value USDA doesn't, press **Fix blanks**, then **Enter values from the package**. Type only what the package prints. The fields say "Leave unknown blank".

## If something goes wrong

### "Nutrition needs a weight or source."

An ingredient has no source at all, or no answer for how recipes weigh it, so nothing can be added up. The note names it, like "Bell pepper needs a nutrition match." Press the button under the note and settle that ingredient.

![Nutrition, per portion for Greek Salad: Nutrition needs a weight or source. Bell pepper needs a nutrition match. Fix blanks. Calories and Fat blank.](/proof/blog/nutrition-facts-catering-dish/err-nosource-mobile.png "No source, no calories.")

### "4 label lines are blank because no source reports them."

Your sources are settled, but they don't cover every line. Press **Fix blanks**. For each ingredient you can **Search USDA** for a fuller match, or **Enter values from the package**.

![Pick a real source for Polenta. Search USDA for the same food and preparation you use. When the package lists a value the source leaves blank, enter it from the package. Search USDA, Enter values from the package. Package values, per 100 g: Includes Added Sugars (g), Vitamin D (mcg) and Potassium (mg), each reading Leave unknown blank.](/proof/blog/nutrition-facts-catering-dish/err-blanks-mobile.png "Type what the package prints. Leave the rest blank.")

### "Confirm none only if you know no sugars were added."

Press **Check now** on an ingredient and CostCook asks about added sugars. Press **Confirm none** only if you know. Otherwise, type the grams per 100 g from the package and press **Save added sugars**.

![Added sugars, Polenta. Confirm none only if you know no sugars were added. Confirm none. Added sugars, g per 100 g. Save added sugars.](/proof/blog/nutrition-facts-catering-dish/err-sugars-mobile.png "Don’t guess zero.")

### "Nutrition search could not be loaded. Try again."

USDA didn't answer in time. Nothing was changed. Press **Retry search**.

### "This page cannot open"

You opened the print page before the label was ready. Confirm every source and fill the blank lines, then print from **Preview label**.

![This page cannot open. Confirm every real source and fill the blank label lines before printing.](/proof/blog/nutrition-facts-catering-dish/err-print-mobile.png "No printing with blanks on the label.")

## Limits

- Values come per 100 g from each ingredient's source. A blank is unknown, never zero.
- The label prints only when every source is confirmed and no line is blank.
- The panel is a calculation from your recipe and its sources. It isn't a lab analysis or a compliance check.
- USDA search has to be set up for your kitchen. When it isn't, you can still enter values from the package.

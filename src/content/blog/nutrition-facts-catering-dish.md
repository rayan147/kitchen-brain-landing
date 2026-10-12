---
title: "How to get nutrition facts for a catering dish, and where they stop"
menuTitle: "Nutrition facts for a dish"
description: "A step-by-step guide with a screenshot at every step: confirm where each ingredient's numbers come from, read the dish's panel, and see why a blank line stays blank."
publishedDate: 2026-11-12
category: Recipes & yield
menuGroup: Cost the work
menuIcon: label
featured: false
order: 27
readMinutes: 7
featureHref: /features/nutrition-facts-and-allergens
featureLabel: See nutrition facts in CostCook
---
<!-- story: docs/stories/blog-nutrition-facts-catering-dish.story.md -->
<!-- Read off kitchen-brain develop 9b84420f4 on 2026-10-12 (RC-84). Labels are
     the app's own. Not claimed: any compliance, certification or lab accuracy;
     that USDA search works without setup; per-batch panels (not seen).
     CAPTURES: 12 crops at 390 px from a localhost build of develop 9b84420f4,
     demo seed renamed Harbor & Hearth Catering, US units. USDA search needs an
     API key this build did not have, so the four polenta ingredients' USDA
     matches came from the demo seed, and their "how recipes weigh it" answer
     (as purchased) was written into the sample database. The Confirm presses,
     the panel, the preview and every message were shot live. -->

By the end of this guide, a dish in CostCook has a nutrition panel per portion, worked out from its ingredients, and you'll know which lines are real numbers and which are still unknown.

Nutrition in CostCook lives on each ingredient, not on the dish. You confirm where an ingredient's numbers come from once, and every recipe that uses it adds them up by weight. If no source reports a value, that line stays blank. The app's own words: "A blank means unknown, never zero."

## Before you start

- The dish is a recipe in CostCook, and every ingredient line has a weight, or a conversion to one.
- Each ingredient has a nutrition source: a USDA food it's matched to, or values you type from the package.
- Have the packages to hand. They fill the lines USDA leaves blank.

## Get the panel for one dish

1. Open the recipe and tap **Nutrition**.

![The recipe's tabs: Method, Allergens marked To review, and Nutrition, ringed.](/proof/blog/nutrition-facts-catering-dish/n-01-tab-mobile.png "Nutrition is a tab on the recipe.")

2. Read the top of the panel. Until every source is confirmed, the numbers are marked **Draft**, and a note says what's missing.

![Nutrition, per portion. Worked out from each ingredient’s source. A blank means unknown, never zero. Preview label. Draft estimate. Not ready to print. 4 sources aren’t confirmed yet. 7 label lines are blank because no source reports them. Fix blanks. Calories 530, Fat 19 g, Protein 18 g, Carbs 77 g, each marked Draft, from unconfirmed sources.](/proof/blog/nutrition-facts-catering-dish/n-02-draft-mobile.png "Wild Mushroom Polenta, one 240 g portion, before anything is confirmed.")

3. Scroll to **Ingredient sources, most gaps first**. Each ingredient shows its source and how many label lines it leaves blank. Press **Confirm** on one.

![The Parmesan, block row: USDA, not confirmed, #170848, 2 lines missing, and Confirm, ringed.](/proof/blog/nutrition-facts-catering-dish/n-03-sources-mobile.png "The number is how many label lines this ingredient can't fill.")

4. Check the values against what you actually use. CostCook asks: "Is this the same food and preparation you use?" Press **Yes, confirm**, or **Pick another** if it isn't.

![Cheese, parmesan, hard. Calories per 100 g 392 kcal, Fat 25 g, Protein 35.75 g, Carbs 3.22 g. Is this the same food and preparation you use? Yes, confirm (ringed) and Pick another.](/proof/blog/nutrition-facts-catering-dish/n-04-confirm-mobile.png "Values are per 100 g, as the source reports them.")

5. Confirm every ingredient in the list. The note changes to what's left: lines no source reports.

![Nutrition, per portion after all four sources are confirmed. Draft estimate. Not ready to print. 7 label lines are blank because no source reports them. Fix blanks. Calories 530, Fat 19 g, Protein 18 g, Carbs 77 g.](/proof/blog/nutrition-facts-catering-dish/n-05-confirmed-mobile.png "Sources confirmed. Seven lines still unknown.")

6. Press **Preview label** to see the panel as it stands.

![The top of the Nutrition panel with Preview label ringed.](/proof/blog/nutrition-facts-catering-dish/n-06-preview-btn-mobile.png "The preview works at any stage.")

7. Read the label. A dash means no source reports that line. It isn't a zero.

![A Nutrition Facts panel for one portion (240 g): Calories 530. Total Fat 19 g, 24%. Saturated Fat, Trans Fat and Cholesterol show a dash. Sodium 300 mg, 13%. Total Carbohydrate 77 g, 28%. Dietary Fiber 5 g, 18%. Total Sugars and Includes Added Sugars show a dash. Protein 18 g. Vitamin D shows a dash. Calcium 300 mg, 25%. Iron 0.6 mg, 4%. Potassium shows a dash.](/proof/blog/nutrition-facts-catering-dish/n-07-label-mobile.png "Seven dashes: seven lines nobody has a number for yet.")

8. **Print label** stays off until every source is confirmed and no line is blank. To fill the blanks, see **Fix blanks** under "If something goes wrong" below.

![The bottom of the label preview: the ingredient statement, Polenta, Mushroom, cremini, Parmesan, block, Butter, unsalted, and Print label, ringed and greyed out.](/proof/blog/nutrition-facts-catering-dish/n-08-print-btn-mobile.png "Greyed out while any line is blank.")

## Where the numbers stop

- **One missing value blanks the line for the whole dish.** If the mushrooms' source doesn't report saturated fat, the polenta's saturated fat line is a dash, even though the butter and the Parmesan report theirs.
- **Confirming an ingredient changes every recipe that uses it.** The app says so above the list: "Changes also reach other recipes that use it."
- **The panel is worked out, not measured.** It adds up each ingredient's source by weight. It isn't a lab test of the finished dish.

**Tip:** start with the ingredient at the top of the list. It's sorted most gaps first, so one fix can fill several lines.

**Tip:** when a package lists a value USDA doesn't, press **Fix blanks**, then **Enter values from the package**. Type only what the package prints. The fields say "Leave unknown blank".

## If something goes wrong

### "Nutrition needs a weight or source."

An ingredient has no nutrition source at all, so nothing can be added up. The note names it, like "Bell pepper needs a nutrition match." Press **Fix blanks** and give it a source.

![Nutrition, per portion for Greek Salad: Nutrition needs a weight or source. Bell pepper needs a nutrition match. Fix blanks. Calories and Fat blank.](/proof/blog/nutrition-facts-catering-dish/err-nosource-mobile.png "No source, no calories.")

### "7 label lines are blank because no source reports them."

Your sources are confirmed, but they don't cover every line. Press **Fix blanks**. For each ingredient you can **Search USDA** for a better match, or **Enter values from the package**.

![Pick a real source for Mushroom, cremini. Search USDA for the same food and preparation you use. When the package lists a value the source leaves blank, enter it from the package. Search USDA, Enter values from the package. Package values, per 100 g: Saturated Fat (g), Trans Fat (g), Cholesterol (mg), each reading Leave unknown blank.](/proof/blog/nutrition-facts-catering-dish/err-blanks-mobile.png "Type what the package prints. Leave the rest blank.")

### "Confirm none only if you know no sugars were added."

Press **Check now** on an ingredient and CostCook asks about added sugars. Press **Confirm none** only if you know. Otherwise, type the grams per 100 g from the package and press **Save added sugars**.

![Added sugars, Polenta. Confirm none only if you know no sugars were added. Confirm none. Added sugars, g per 100 g. Save added sugars.](/proof/blog/nutrition-facts-catering-dish/err-sugars-mobile.png "Don’t guess zero.")

### "This page cannot open"

You opened the print page before the label was ready. Confirm every source and fill the blank lines, then print from **Preview label**.

![This page cannot open. Confirm every real source and fill the blank label lines before printing.](/proof/blog/nutrition-facts-catering-dish/err-print-mobile.png "No printing with blanks on the label.")

## Limits

- Values come per 100 g from each ingredient's source. A blank is unknown, never zero.
- The label prints only when every source is confirmed and no line is blank.
- The panel is a calculation from your recipe and its sources. It isn't a lab analysis or a compliance check.
- USDA search has to be set up for your kitchen. When it isn't, you can still enter values from the package.

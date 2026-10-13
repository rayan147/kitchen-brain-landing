---
title: "How to use one sauce in five dishes without costing it five times"
menuTitle: "One sauce in many dishes"
description: "A step-by-step guide with a screenshot at every step: build a sauce once as a sub-recipe, put it in each dish that uses it, and change it in one place when the recipe or the price moves."
publishedDate: 2026-11-05
category: Recipes & yield
menuGroup: Cost the work
menuIcon: yield
featured: false
order: 26
readMinutes: 10
featureHref: /features/recipes-and-costing
featureLabel: See recipes and costing in CostCook
---
<!-- story: docs/stories/blog-one-sauce-many-dishes.story.md -->
<!-- Read off kitchen-brain local develop fcc651477 on 2026-10-13 (RC-83),
     re-shot after the fixes from the first shoot merged: Sub-recipes chip
     then New recipe now opens "New sub-recipe" (shown as a tip), a first
     publish is worded as a first version. Labels are the app's own. The main
     path starts inside a dish because "Save recipe and return to" brings the
     cook straight back to it. Not claimed: how a supplier price change shows
     on each dish (only that the batch cost carries it, as the Sub-recipes
     list shows); anything about allergens or nutrition beyond the publish
     page's own sentences.
     CAPTURES: 21 crops at 390 px from a localhost build of develop fcc651477,
     demo seed renamed Harbor & Hearth Catering, US units, no revision
     backfill (so each dish's first publish is its version 1). Garlic Aioli,
     its lines, and the three dishes it was added to were entered for the
     shoot; every cost shown is the app's own arithmetic on the seed's
     prices. The sticky action bar was hidden for the crops. -->

By the end of this guide, your sauce is one recipe in CostCook, it sits inside every dish that uses it, and when you change it, every one of those dishes is re-costed in one go.

In CostCook, a sauce, a stock or a rub you make in batches is a **sub-recipe**. You cost the batch once. Each dish uses an amount of it, like 1 tbsp, and gets its share of the batch cost. The app says it plainly: "Dishes using this sub re-cost when its lines change."

The example here is a garlic aioli going onto three dishes: Smashburger Sliders, Pulled Pork Sliders and Garlic Shrimp Skewers.

## Before you start

- The sauce's ingredients are in CostCook with prices. If they aren't, start with [How to import your ingredients, invoices and recipes](/blog/import-invoices-recipes-ingredient-lists).
- Know how much one batch makes, like 1 qt.
- Know how much of it goes on one portion of each dish.

## Build the sauce once

1. Open the first dish that uses the sauce and press **Edit recipe**. Press **Start working copy**. The kitchen keeps cooking the saved dish until you publish your changes.

![Start a working copy of the saved recipe? A working copy lets you change this recipe privately. The kitchen keeps cooking the saved recipe until you publish the changes. Publish version 1 when it is ready. Start working copy is ringed.](/proof/blog/one-sauce-many-dishes/sr-01-working-copy-mobile.png "Edits stay private until you publish.")

2. Press **Add ingredient or sub-recipe**. Next to "A sauce or stock made in batches?", press **New sub-recipe**.

![A sauce or stock made in batches? New sub-recipe, ringed.](/proof/blog/one-sauce-many-dishes/sr-02-new-sub-link-mobile.png "Start the sauce from the dish that needs it.")

3. Press **Start blank**.

![New sub-recipe: Build the batch, then return to add the amount this recipe uses. Start blank, ringed: Name your recipe and add ingredients. You can add prices later.](/proof/blog/one-sauce-many-dishes/sr-03-start-blank-mobile.png "Build the batch, then come back to the dish.")

4. Type the sauce's name. Under the name, it says **Sub-recipe, costed per batch**.

![The new recipe named Garlic Aioli, marked Draft, with the line Sub-recipe, costed per batch, Not used yet.](/proof/blog/one-sauce-many-dishes/sr-04-name-mobile.png "Costed per batch, not per portion.")

5. Under **Makes**, type how much one batch makes and pick the unit. Press **Save batch**.

![Makes 1, Unit (per batch) Quart (qt), Round up to whole batches ticked, and Save batch, ringed.](/proof/blog/one-sauce-many-dishes/sr-05-makes-mobile.png "Every dish divides by this number.")

6. Add each ingredient for one batch: type it in **Ingredient or sub-recipe**, fill in **Quantity** and **Unit**, and press **Add line**. Here: 3 cups canola oil, 4 eggs, 2 lemons, 1 oz peeled garlic, 0.5 oz Dijon mustard and 0.25 oz kosher salt.

![The add-line form: Ingredient or sub-recipe Canola oil, Quantity 3, For one batch, Unit Cup (cup).](/proof/blog/one-sauce-many-dishes/sr-06-add-line-mobile.png "Amounts are for one batch.")

7. Check the batch cost. This aioli comes to $5.36 for the quart.

![Draft batch cost $5.36. Per unit of output $5.36 / qt. View batch calculation. Dishes using this sub re-cost when its lines change.](/proof/blog/one-sauce-many-dishes/sr-08-batch-cost-mobile.png "One batch, one cost.")

8. Press **Save recipe and return to** your dish. The sauce is saved, and you're back in the dish's working copy.

![The button Save recipe and return to Smashburger Sliders, ringed.](/proof/blog/one-sauce-many-dishes/sr-08b-return-button-mobile.png "Back to the dish you started from.")

## Put it in each dish

9. In **Ingredient or sub-recipe**, type the sauce's name and pick it. It's marked **Sub-recipe** with how much a batch makes.

![Ingredient or sub-recipe: Garlic Aioli typed, and the option Garlic Aioli, Sub-recipe, makes 1 qt, ringed.](/proof/blog/one-sauce-many-dishes/sr-09-pick-mobile.png "Your sauce is in the same list as your ingredients.")

10. Type how much goes on one portion, pick the unit, and press **Add line**.

![Ingredient or sub-recipe Garlic Aioli, Quantity 1, For one portion, Unit Tablespoon (tbsp). A note: Linked batch. Cost and scaling use this exact amount. Shop and Prep can still round up to whole batches. Add line is ringed.](/proof/blog/one-sauce-many-dishes/sr-10-amount-mobile.png "1 tbsp a portion, costed exactly.")

11. The sauce is now one line on the dish, with its share of the batch cost. On the sliders, 1 tbsp of aioli is $0.08, and the plate cost went from $2.70 to $2.78.

![The Garlic Aioli line, marked Sub-recipe: $0.08, 1 tbsp, 3% of cost, View sub-recipe calculation.](/proof/blog/one-sauce-many-dishes/sr-11-line-mobile.png "One line, not six.")

![Draft plate cost $2.78, View plate-cost calculation.](/proof/blog/one-sauce-many-dishes/sr-12-plate-mobile.png "Up 8 cents from $2.70.")

12. Press **Publish version …**, with your dish's next version number. Write a few words under **What changed, in a few words**, and press it again. In the sample kitchen the dishes had never been published, so it's version 1, and the review says "This publishes version 1, the first version of this recipe."

![What changed, in a few words: Garlic aioli on the side. This is what history will show beside version 1. Publish version 1, ringed, and Keep editing.](/proof/blog/one-sauce-many-dishes/sr-13-publish-mobile.png "The note goes into the dish's history.")

13. Do the same on every other dish that uses the sauce: **Edit recipe**, **Start working copy**, add the sauce with its amount, and publish. You don't build the sauce again. You pick it.

14. To check where the sauce goes, open **Recipes** and tap **Sub-recipes**. Each one shows its cost, its batch, and **Used in**.

![The Garlic Aioli row on the Sub-recipes list: Cost $5.36 / qt, Batch $5.36, makes 1 qt, Used in 3 dishes.](/proof/blog/one-sauce-many-dishes/sr-14-used-in-mobile.png "One sauce, three dishes.")

## Change the sauce once

15. Open the sauce, press **Edit recipe**, then **Start working copy**.

16. To change an amount, press the **…** button on that line, choose **Edit amount**, change it, and press **Save amounts**. To add an ingredient, use **Add ingredient or sub-recipe** as before. Here, one cup of the canola becomes extra virgin olive oil: canola goes from 3 cups to 2, and 1 cup of olive oil is added.

![Edit amounts for Canola oil: Amount used 2, Unit Cup (cup).](/proof/blog/one-sauce-many-dishes/sr-15-edit-amount-mobile.png "Change the line, not the dishes.")

17. Before you publish, the sauce says what publishing will move: every dish, menu and draft order that uses it.

![Publishing moves 3 dishes, 1 menu and 1 draft order. They keep version 1 until you publish. Draft orders (1): Kowalski birthday dinner. Menus (1): Backyard Cookout. Dishes (3): Garlic Shrimp Skewers, Pulled Pork Sliders, Smashburger Sliders.](/proof/blog/one-sauce-many-dishes/sr-15b-moves-mobile.png "You see the reach before you decide.")

18. Press **Publish version 2**. The review lists what changed and every dish it reaches. Write your note and press **Publish version 2**.

![What changed: Added Olive oil, extra virgin: 1 cup. Canola oil 3 cup to 2 cup. What publishing does: Cost and nutrition are recalculated for 3 dishes, 1 menu and 1 draft order. What this reaches: Dishes that use it (3): Garlic Shrimp Skewers, Pulled Pork Sliders, Smashburger Sliders. Menus (1). Draft orders that will recost (1). 47 confirmed orders will not change.](/proof/blog/one-sauce-many-dishes/sr-16-reaches-mobile.png "Every dish it reaches, named.")

19. Open any of the dishes. The new batch cost ($10.07 a quart) is already in it. The sliders went from $2.78 to $2.85, the pulled pork sliders from $3.55 to $3.62, and the shrimp skewers from $6.48 to $6.55. You didn't open a single dish to do it.

![Pricing, per portion: Plate cost $2.85. Sells for Not set. Price for a 30% target $9.50. Target source Workspace default.](/proof/blog/one-sauce-many-dishes/sr-17-after-mobile.png "Changed once, re-costed everywhere.")

**Tip:** check the **Sub-recipes** list before you build. If the sauce is already there, pick it in the dish instead of making a second one.

**Tip:** you can also start the sauce from **Recipes**. Tap **Sub-recipes**, then **New recipe**, and it opens **New sub-recipe**. Then add it to each dish as in steps 9 to 12.

![New sub-recipe, with Start blank: Name your recipe and add ingredients. You can add prices later.](/proof/blog/one-sauce-many-dishes/sr-tip-new-sub-mobile.png "From the Sub-recipes list, New recipe starts a sub-recipe.")

**Tip:** new ingredient prices reach your dishes through the sauce too. On the **Sub-recipes** list, each row shows its biggest price move and what it did to the batch cost, like "Egg, large −9% … −2.4% on this batch cost".

**Tip:** a sauce can have a sauce in it. The line picker is called **Ingredient or sub-recipe** in a sub-recipe too.

## If something goes wrong

### "This unit measures volume, but the ingredient is measured by weight"

You picked teaspoons or cups for something CostCook measures by weight, like salt. Pick a weight unit, like ounces. If you really cook it by volume, add its density on the ingredient card, as the message says.

![Unit Teaspoon (tsp), in red: This unit measures volume, but the ingredient is measured by weight: pick a weight unit to match. If this is one of those, add its density (g per ml) instead.](/proof/blog/one-sauce-many-dishes/fix-unit-mobile.png "Match the unit to how the ingredient is measured.")

### "This sub-recipe does not say how much it makes"

The sauce has no batch size, so CostCook won't save it. Fill in **Makes** and its unit, press **Save batch**, then save again.

![In red: This sub-recipe does not say how much it makes. Every dish using it divides by the batch output. Without one, none of them can be costed or scaled.](/proof/blog/one-sauce-many-dishes/fix-makes-mobile.png "No batch size, no cost per spoonful.")

## Limits

- Dishes keep the version of the sauce they have until you publish the new one.
- Confirmed orders never change. "A confirmed order keeps the costs and quantities it was confirmed with." Draft orders are re-costed.
- Cost uses the exact amount on the dish. Shop and Prep can still round up to whole batches.
- Changing the sauce changes it everywhere. If one dish needs a different version, use **Duplicate and edit instead** to make a separate sauce.

---
title: "How to set up your kitchen in CostCook, from an empty account to a costed first order"
menuTitle: "Set up your kitchen"
description: "A step-by-step guide with a screenshot at every step: the five setup stages, from naming your kitchen to a first order with its food cost and shopping list."
publishedDate: 2026-12-10
category: Running the event
menuGroup: Plan and buy
menuIcon: order
featured: false
order: 31
readMinutes: 12
featureHref: /onboarding
featureLabel: See the setup stages in CostCook
---
<!-- story: docs/stories/blog-set-up-your-kitchen.story.md -->
<!-- Read off kitchen-brain develop 9b84420f4 on 2026-10-12, re-shot on local
     develop fcc651477 on 2026-10-13 (RC-87). Labels are
     the app's own, walked end to end on an empty kitchen. This is the
     step-by-step version of /onboarding, not a second pitch, so it keeps that
     page's claim boundary: upload then confirm, never "complete" or "no typing".
     Walked by hand only: the import and Sage routes are named, not shown,
     because this build's reader is the test stub.
     The stage 4 dish screen now shows each line and the draft plate cost as
     you add them (fixed on fcc651477), so the plate-cost step is back.
     CAPTURES: 27 crops at 390 px, localhost develop fcc651477, an empty kitchen
     from e2e/provision-owner.ts renamed Harbor & Hearth Catering. Harbor
     Provisions, Chicken thigh ($32.00 a 10 lb case), Lemon ($38.00 a case of
     115), Lemon roast chicken and the Okafor retirement lunch (60 guests,
     $4.50 a guest, Oct 24) were typed for the shoot. -->

By the end of this guide, your kitchen is set up in CostCook with one supplier, the ingredients for one dish, that dish costed, and a first order with its food cost and shopping list.

Setup has five stages, in this order:

1. **Kitchen and suppliers**: your name, units, food-cost target and one supplier.
2. **Ingredients**: what you buy for one dish, with pack prices.
3. **Food facts**: allergens and nutrition for those ingredients.
4. **Recipes**: the dish itself.
5. **Menu and first order**: guests, a date and a price.

You can stop after any stage. The app says so on the first screen: "Stop after any stage and come back: each one saves when you continue."

## Before you start

- Pick one dish you cook often. Setup costs that dish first.
- Have the pack sizes and prices for its ingredients: a recent invoice, or what you remember paying.
- Know the name of the supplier you buy them from.
- If you'd rather look around first, **Load sample kitchen** on the Today screen fills CostCook with sample ingredients, recipes, a menu and orders instead.

## Stage 1: Kitchen and suppliers

1. On **Today**, press **Use guided setup**.

![The bottom of the Set up your kitchen card on Today: This goes away after the first four steps. Just looking around? Load a sample kitchen with ingredients, recipes, a menu, and orders. Load sample kitchen, and Use guided setup, ringed.](/proof/blog/set-up-your-kitchen/s01-today-mobile.png "Guided setup starts here.")

2. Answer the three questions, or press **Skip these questions**. All three are optional. The dish you name is the one setup costs first. Press **Start setup**.

![What do you most want to know? What an event really costs is selected. Below: What to buy for a date, Whether a price change hurt me, Not sure yet. Start setup is ringed, with Skip these questions under it.](/proof/blog/set-up-your-kitchen/s02-welcome-mobile.png "The dish you name is costed first.")

3. Check the **Target food-cost percentage** and the **Miscellaneous cost percentage**, then choose how to **Show weights and volumes in**. In the US, pick **Pounds, ounces and quarts**.

![Target food-cost percentage 30: Every plate is judged against this: at 30%, a $10 plate carries $3 of food. Most caterers use 28 to 32%. Miscellaneous cost percentage 2: For salt, frying oil, garnish and tasting. Show weights and volumes in: Pounds, ounces and quarts, ringed.](/proof/blog/set-up-your-kitchen/s03-units-mobile.png "30% and 2% are the defaults. Change them if yours differ.")

4. Under **First supplier**, type the **Supplier name** as it appears on their invoices. A name is enough. Press **Save and continue**.

![First supplier: One supplier is enough to start, and a name will do. Supplier name: Harbor Provisions. Add contact and ordering details, optional. Save and continue is ringed.](/proof/blog/set-up-your-kitchen/s04-supplier-mobile.png "Contact details can wait.")

## Stage 2: Ingredients

5. Choose how to bring in the ingredients for your dish. To upload or photograph an invoice, use **Import an invoice or price sheet**. For a spreadsheet or typed list, use **Import an ingredient list**. Either way, what comes back waits for you to confirm, and anything it can't read, you type. This guide uses **Add ingredients manually**.

![Three choices. Import an invoice or price sheet: Upload or photograph one. Supplier, packs, and prices come back for you to confirm; anything it cannot read, you type. Import an ingredient list. Add ingredients manually: Best when you know one dish and its pack prices by heart, ringed.](/proof/blog/set-up-your-kitchen/s05-paths-mobile.png "Two ways to upload, one to type.")

6. Type the ingredient's **Name**, choose how it's **Measured by** (weight, volume or count), and press **Next: add pack and price**.

![New ingredient: Measured by, Weight selected. Category: Protein. Storage area. Next: add pack and price is ringed.](/proof/blog/set-up-your-kitchen/s06-identity-mobile.png "Weight, volume or count.")

7. Fill in the **Pack name**, what the **Pack contains** and its **Unit**, and the **Pack price (paid)**. CostCook shows the cost per unit as you type. Press **Add ingredient**.

![Pack contains 10, Unit Pound (lb), Pack price (paid) $32.00. Below: $32.00 ÷ 10 lb = $3.20 per lb. As-purchased cost $3.20 / lb.](/proof/blog/set-up-your-kitchen/s07-pack-mobile.png "The math shows before you save.")

8. Press **Add another** for each ingredient in the dish. When the list looks right, press **Review food facts**.

![Ingredients added, 2 in this kitchen: Lemon, case 115 ct, $38.00, 100% yield. Chicken thigh, 10 lb case, $32.00, 100% yield. Review food facts is ringed.](/proof/blog/set-up-your-kitchen/s08-added-mobile.png "Each ingredient shows its pack and price.")

## Stage 3: Food facts

9. CostCook drafts nutrition and allergens from each ingredient's name. Read the drafts, then press **Confirm all … drafts**.

![0 of 2 saved. USDA provides nutrition. Allergen drafts come from ingredient names; check your package label for ingredients and cross-contact. Confirm all 2 drafts is ringed.](/proof/blog/set-up-your-kitchen/s09-confirm-mobile.png "Drafts are a starting point, not the answer.")

10. The allergens are still yours to answer. The app explains why.

![Saved Sage’s answers for 2 ingredients. 2 still need their allergens from you: a name can show butter has milk, not that chicken has none.](/proof/blog/set-up-your-kitchen/s10-notice-mobile.png "“A name can show butter has milk, not that chicken has none.”")

11. For each ingredient, check its package label, then set each allergen. If the label shows none of the rest, press **Free from the rest**.

![Allergens for Chicken thigh: Crustacean shellfish, Egg, Fish, Milk, Peanuts, Sesame, Soy, Tree nuts, Wheat. Free from the rest is ringed.](/proof/blog/set-up-your-kitchen/s11-allergens-mobile.png "Only when the label says so.")

12. Press **Save** for that ingredient, then do the next one. When they're all saved, press **Go to recipes**.

![Save Chicken thigh, ringed, and Skip for now.](/proof/blog/set-up-your-kitchen/s11b-save-mobile.png "One save per ingredient.")

## Stage 4: Recipes

13. Choose how to build the dish. **Build with Sage** takes a recipe card, photo, PDF, pasted text or link, and drafts the dish for you to review. This guide uses **Build the dish by hand**.

![How do you want to build your first dish? Build with Sage: Add a recipe card, photo, PDF, pasted text, or link. Build the dish by hand: Best when you know the ingredients and amounts for one dish, ringed. A sub-recipe, like a stock, a dressing or a dough, is added from inside the dish.](/proof/blog/set-up-your-kitchen/s12-dish-path-mobile.png "Sub-recipes are added from inside the dish.")

14. For each line, pick the ingredient, type the **Quantity** for one portion, and choose the **Unit**.

![Ingredient or sub-recipe: Chicken thigh. Quantity 6, For one portion. Unit: Ounce (oz).](/proof/blog/set-up-your-kitchen/s13-line-mobile.png "Amounts are per portion.")

15. Press **Add line**. CostCook says "Line added. Its exact used amount is now included in the plate cost." The line appears under **Ingredients per portion**, with what it costs and its share of the plate. Add the next ingredient the same way.

![Preparation note, and Add line, ringed.](/proof/blog/set-up-your-kitchen/s13b-add-line-mobile.png "One line per ingredient.")

![Ingredients per portion: Chicken thigh $1.20, 6 oz, 94% of cost. Lemon $0.08, 0.25 each, 6% of cost. Lines total $1.28.](/proof/blog/set-up-your-kitchen/s14-lines-mobile.png "Each line shows its cost as you add it.")

16. Check the **Draft plate cost** at the top of the dish. It adds up the lines plus your miscellaneous percentage. Type what the dish **Sells for ($)**, and CostCook shows its food cost against your target.

![DRAFT PLATE COST $1.31. Lines total $1.28 + misc 2% $0.03. View plate-cost calculation. Sells for ($): 4.50. Food-cost target (%): 30. 29.1% food cost, Within target, 0.9 percentage points under target.](/proof/blog/set-up-your-kitchen/s15-plate-mobile.png "The plate cost updates with every line.")

17. Press **Save dish and continue**. If CostCook asks you to describe one portion, type it in **Packing description** (for example, "6 oz thigh, lemon wedge") and press **Save dish and continue** again.

**Tip:** the nutrition and allergens on this screen follow the dish as you build it. In the app's words:

![Nutrition and allergens follow this dish as you build it. Save dish and continue to use them in the kitchen.](/proof/blog/set-up-your-kitchen/tip-nutrition-mobile.png "Saving the dish puts them to work.")

## Stage 5: Menu and first order

18. Your first menu is already made and named after the dish. Add the **Client or event**, the **Event date** and the **Guests**. The dish shows its cost per portion.

![Client or event: Okafor retirement lunch. Event date: Sat, Oct 24, 2026. Guests: 60. Menu name: Lemon roast chicken menu. Dish on the menu: Lemon roast chicken, $1.31 per portion.](/proof/blog/set-up-your-kitchen/s16-event-mobile.png "The dish brings its cost with it.")

19. Type the **Price per guest**. The live quote shows the food cost against your target, and the least you should charge.

![Price per guest $4.50: On target. This price meets your 30% food-cost target. Live quote: Revenue $270.00, Food cost $78.76, Food cost per guest $1.31. 29.2% food cost, Within target, 0.8 percentage points under target. Charge at least, per guest $4.38.](/proof/blog/set-up-your-kitchen/s17-quote-mobile.png "Food cost against your target, before you create anything.")

20. Answer **Anyone at this event with an allergy or a special diet?** with **No** or **Yes**, then press **Create first order**.

21. You'll see **Your kitchen is ready**, with the order's food cost and everything setup built. Press **Open shopping list**.

![Your kitchen is ready. You said you most wanted to know what an event really costs. For Okafor retirement lunch, the food comes to $78.76: 29.2% of the price. Ticks: 1 supplier, 2 ingredients, Dish: Lemon roast chicken, Menu: Lemon roast chicken menu, Order for 60 guests. The order stays a draft, with prices updating, until you confirm it on the order page. Open shopping list is ringed.](/proof/blog/set-up-your-kitchen/s19-ready-mobile.png "Setup ends on the number you asked for.")

22. The order opens with its shopping list, sorted by supplier, in whole packs.

![Harbor Provisions, 2 items, $134.00. Chicken thigh: uses 22.5 lb of 30 lb (3 × 10 lb case), Not counted, $96.00. Lemon: uses 15 each of 115 each (1 × case 115 ct), Not counted, $38.00.](/proof/blog/set-up-your-kitchen/s20-shop-mobile.png "Whole packs: the extra stays on your shelf.")

**Tip:** the order stays a draft, and its prices keep updating, until you press **Confirm order** on the order page. Confirming freezes its quantities and prices.

**Tip:** the list buys everything in full because nothing has been counted yet. To buy less, see [How to count your inventory the first time](/blog/count-inventory-first-time).

## If something goes wrong

### "Choose pounds or kilos."

You pressed **Save and continue** before choosing units. Pick one under **Show weights and volumes in**.

![Show weights and volumes in: Choose one. In red: Choose pounds or kilos. Recipe amounts and shopping lists read that way.](/proof/blog/set-up-your-kitchen/err-units-mobile.png "Units come first.")

### "Enter a supplier name"

Every price belongs to a supplier, so setup needs one. A name is enough.

![Supplier name, empty. As it appears on their invoices. In red: Enter a supplier name.](/proof/blog/set-up-your-kitchen/err-supplier-mobile.png "One supplier to start.")

### "Cost must be a dollar amount like 24.50"

The pack price is empty or isn't a number. Type what you paid for one pack.

![Pack price (paid), empty. In red: Cost must be a dollar amount like 24.50.](/proof/blog/set-up-your-kitchen/err-price-mobile.png "No price, no cost.")

### "Describe one portion before continuing."

Type what one portion is in **Packing description**, then press **Save dish and continue** again.

![Packing description: For example, 6 oz with sauce. In red: Describe one portion before continuing.](/proof/blog/set-up-your-kitchen/err-portion-mobile.png "Say what one guest gets.")

### "Pick No or Yes. A blank here reads the same as nobody asked."

Answer the allergy question for the event before you create the order.

![Anyone at this event with an allergy or a special diet? No and Yes, neither chosen. In red: Pick No or Yes. A blank here reads the same as nobody asked.](/proof/blog/set-up-your-kitchen/err-restrictions-mobile.png "Nobody asked isn't the same as no.")

## Limits

- Setup costs one dish and one order. Add the rest of your ingredients, recipes and menus afterwards.
- Allergen and nutrition drafts come from ingredient names. You still check each package label.
- If you leave food facts unanswered, the app warns that they're marked skipped and every order using them reads "check".
- Imports and Sage give you something to confirm, not a finished list. Anything they can't read, you type.
- The first order is a draft until you confirm it.

---
title: "How to build a catering menu and quote from your recipes"
menuTitle: "Build a menu and quote from recipes"
description: "A step-by-step guide with a screenshot at every step: put your recipes on a menu, price it per guest against your food-cost target, quote an event from it, and see what stays locked once you confirm."
publishedDate: 2026-11-19
category: Costing & pricing
menuGroup: Cost the work
menuIcon: percent
featured: false
order: 28
readMinutes: 10
featureHref: /features/menus-and-quotes
featureLabel: See menus and quotes in CostCook
---
<!-- story: docs/stories/blog-build-catering-menu-quote.story.md -->
<!-- Read off kitchen-brain local develop fcc651477 on 2026-10-13 (RC-86;
     first shot on 9b84420f4 on 2026-10-12, re-shot after the app's fixes). Labels are
     the app's own. Path shown: Menus > New menu, then Orders > New order (the
     direct order path). Events and proposals are a separate guide.
     Not claimed: what Reopen does to prices or when it is refused (not
     exercised); that the order screen itself sends anything to a client.
     CAPTURES: 19 crops at 390 px from a localhost build of develop fcc651477,
     demo seed renamed Harbor & Hearth Catering, US units. The menu "Harvest
     wedding supper" and the draft order "Okafor & Lind wedding" (120 guests,
     Oct 31) were made for the shoot. Confirming that draft needs every
     ingredient's allergens reviewed, which was not done for the shoot, so the
     locked-price shots are of the seed's own confirmed sample order
     (Blackwood anniversary party, #778), and their captions say so. -->

By the end of this guide, you'll have a menu built from your own recipes, priced per guest against your food-cost target, and a quote for one event that you can confirm. Once it's confirmed, the price stays put.

You do it in two parts:

1. **The menu**: what each guest gets, and the price per guest.
2. **The quote**: one event, with a date, a guest count and that price.

This guide is the clicks. For the math behind a food-cost target, see [Catering menu pricing: margin, markup, and food-cost target](/blog/catering-menu-pricing) and [How to calculate food cost per guest](/blog/food-cost-per-guest).

## Before you start

- Your dishes are in CostCook as recipes, with prices on their ingredients. If they aren't, start with [How to import your ingredients, invoices and recipes](/blog/import-invoices-recipes-ingredient-lists).
- Know your food-cost target. CostCook compares every price with it. The sample kitchen here uses 30%.
- Have the event's date and guest count for Part 2.

## Part 1: Build the menu

1. Open **Kitchen records**, then **Menus**, and press **New menu**.

![The top of Menus: 17 menus, Search menus, Orders: Any dates, and New menu, ringed.](/proof/blog/build-catering-menu-quote/m-01-menus-mobile.png "Start a new menu.")

2. Type the menu's name and press **Done**. The name is what you pick when you start an order.

![Menu name and description. The name is what you pick when you start an order. Name: Harvest wedding supper. Description (optional). Done is ringed.](/proof/blog/build-catering-menu-quote/m-02-name-mobile.png "The description is optional. It's for your storefront.")

3. Under **Add dish**, start typing a recipe and pick it. Each one shows its cost per portion.

![The Recipe search with Lemon-Th typed. The option Lemon-Thyme Chicken Breast, $2.62 per portion, is ringed.](/proof/blog/build-catering-menu-quote/m-03-add-dish-mobile.png "Your recipes, with what a portion costs today.")

4. Set **Portions per guest** and press **Add dish**. The dish card shows what it costs per guest and its share of the menu.

![The Lemon-Thyme Chicken Breast dish card: portions 1 per guest with minus and plus buttons. Cost per portion $2.62, Cost per guest $2.62, Share of menu cost 100% of menu cost.](/proof/blog/build-catering-menu-quote/m-05-dish-mobile.png "One portion per guest, $2.62.")

5. Add the rest of the dishes the same way. This menu has five: the chicken, roast potatoes, charred green beans, an arugula and pear salad, and focaccia with whipped goat cheese.

6. Look at **Cost per guest**. CostCook adds up the dishes and suggests a price that meets your target. Here it's $9.20 a guest, and $30.67 at 30%. Under it, CostCook warns you that an order can come out a little higher, because some of this menu's bases are made in whole batches. Part 2 shows how much.

![Cost per guest: Dish cost $9.20, Miscellaneous cost (0%) $0.00, Total cost per guest $9.20. Selling price per guest, empty. Suggested price for your 30% target: $30.67 per guest. $9.2006 theoretical cost ÷ 0.30 = $30.67. CostCook rounds up to the next cent so the target is met. Use $30.67 is ringed. Below: An order counts whole batches of this menu's bases, so its cost per guest can come out higher.](/proof/blog/build-catering-menu-quote/m-06-cost-mobile.png "Press Use $30.67, or type your own price.")

7. Type your **Selling price per guest**, or press **Use** to take the suggestion. CostCook shows the food cost at that price against your target.

![Selling price per guest: $32. 28.8% food cost, Within target. 1.2 percentage points under target. This menu is within the 30% target.](/proof/blog/build-catering-menu-quote/m-07-price-mobile.png "$32 a guest is 28.8% food cost.")

8. Press **Save menu**.

![The top of the new menu: Harvest wedding supper, 5 dishes, No linked orders. Edit name and description. Unsaved changes, and Save menu, ringed.](/proof/blog/build-catering-menu-quote/m-08-save-mobile.png "Nothing is kept until you save.")

![The saved menu: Harvest wedding supper, Menu, priced per guest, 5 dishes, Not used yet. All changes saved. No orders use this menu yet. Changes apply to new orders only.](/proof/blog/build-catering-menu-quote/m-09-saved-mobile.png "Changing a menu later doesn't change orders already made from it.")

**Tip:** add the equipment the menu always needs, like chafing dishes, under **Equipment**. It goes on every pack list for this menu, and the count doesn't change with the guest count.

![Equipment: Included on every pack list for this menu. Quantities do not scale with guest count. Chafing dishes × 3, with Edit.](/proof/blog/build-catering-menu-quote/m-tip-equipment-mobile.png "Three chafers is three chafers, at 50 guests or 150.")

## Part 2: Quote one event

1. Open **Orders**, then **New order**. Type the client or event, pick the **Event date** and type the **Guests**.

![Event information. Client or event: Okafor & Lind wedding. Event date: Sat, Oct 31, 2026. Guests: 120.](/proof/blog/build-catering-menu-quote/q-01-event-mobile.png "The count the kitchen cooks for.")

2. Under **Menu**, search for the menu and pick it. Its price per guest fills in.

![Menu: Selecting a menu fills in its current per-person price. Search: Harvest wedding. 1 menu found. Harvest wedding supper, $9.20 cost, $32.00 price, ringed.](/proof/blog/build-catering-menu-quote/q-02-menu-mobile.png "The menu brings its price with it.")

3. Read the **Live quote**. It changes as you change the menu, the guests or the price.

![Live quote: Revenue $3,840.00, Food cost $1,140.11. Whole-batch prep: Balsamic Vinaigrette: make 2 batches for 1.2 needed. Whipped Goat Cheese Spread: make 2 batches for 1.8 needed. Food cost includes whole-batch prep. Food cost per guest $9.50. 29.7% food cost, Within target, 0.3 percentage points under target. Charge at least, per guest $31.67.](/proof/blog/build-catering-menu-quote/q-03-live-quote-mobile.png "$9.20 a guest on the menu, $9.50 on the order: the vinaigrette is made in whole batches.")

The menu said $9.20 a guest. The order says $9.50, because you can't make 1.2 batches of vinaigrette. You make 2, and the food cost counts them. That's the difference the menu warned about, and why the quote's "Charge at least" is $31.67, not the menu's $30.67.

4. Change the price if you need to. If it's under what your target needs, CostCook says so and tells you the least to charge.

5. Press **Create order**.

![Add another event, and Create order, ringed.](/proof/blog/build-catering-menu-quote/q-04-create-mobile.png "The order opens as a live draft.")

6. The order opens as a draft, and its prices still update. Work through **Before you confirm**. Here, the date and price are done, and **Review allergens** is still open, so **Confirm order** waits. Adding the customer is optional.

![Before you confirm, 2 of 5 done. Confirming locks quantities and prices, and starts shopping, prep and pack. Date set, Ready for shopping and prep. Price within target, 29.7% food cost, target 30%. Review allergens, None reviewed on 5 dishes. Add the customer, Optional, for invoices. Guest restrictions, Not declared, add or mark none. Confirm order, greyed out.](/proof/blog/build-catering-menu-quote/q-05-before-confirm-mobile.png "Confirm order waits for Review allergens.")

![The draft order's price panel: Same as the menu price. Food cost 29.7%, target 30%. Sales $3,840.00, Food ($9.50 a guest) $1,140.11. Balsamic Vinaigrette and Whipped Goat Cheese Spread are made in whole batches: Balsamic Vinaigrette 2 for 1.2 needed, Whipped Goat Cheese Spread 2 for 1.8 needed. Adds $36.04. Food margin $2,699.89. Within target, with 0.3 points to spare.](/proof/blog/build-catering-menu-quote/q-06-draft-price-mobile.png "A draft still moves with today's prices.")

7. Press **Review allergens** to open the first dish that needs it, and review its ingredients. Do the same for each dish. If any guest has an allergy or a diet, add it under **Guest restrictions**, or press **Mark guest restrictions: None declared**. See [How to check a catering menu for a guest's allergy](/blog/guest-allergy-menu-check).

8. Press **Confirm order**. Confirming locks quantities and prices, and starts shopping, prep and pack.

9. From now on, the price you agreed stays on the order. CostCook keeps it beside what the same food costs at today's prices, so you can see when your margin moves.

![A confirmed sample order: Confirmed, Quantities and prices frozen. Confirmed Mon, Oct 12, prices locked. Price: Guests 51, Price a guest $89.11, Locked when confirmed. $5.89 below the menu’s $95.00 a guest.](/proof/blog/build-catering-menu-quote/q-07-locked-mobile.png "A different sample order, already confirmed. Its price is locked.")

![Today's ingredient prices: Food cost is 0.1 points higher than when you confirmed. At confirmation (Oct 12): $27.71 per guest, 31.1%. Today at current prices: $27.76, 31.2%. Change: +0.2%, +0.1 points.](/proof/blog/build-catering-menu-quote/q-08-today-mobile.png "What you agreed, next to what it costs today.")

**Tip:** an order's price doesn't have to match the menu's. The confirmed order above sells at $89.11 a guest, and CostCook says it's $5.89 below the menu's $95.00.

**Tip:** if the client needs a proposal to accept on their phone, start an event instead of an order. See [How to send a catering proposal the client accepts on their phone](/blog/send-catering-proposal).

## If something goes wrong

### "Below your 30% target"

The price is under what your target needs. CostCook names the least to charge. Raise the price, or change the dishes or portions on the menu. An order priced like this can't be confirmed until you do: its check reads **Fix the price**.

![Price per guest: $28.00. Below your 30% target. Charge at least $31.67 per guest to meet the 30% target.](/proof/blog/build-catering-menu-quote/err-below-target-mobile.png "At $28, this menu is 33.9% food cost.")

### Confirm order is greyed out

A required check is still open on **Before you confirm**. Two to look for:

- **Review allergens**: a dish on the menu has ingredients nobody has reviewed for allergens.
- **Fix the price**: the price is over your food-cost target. Raise it, or change the menu, until the check reads **Price within target**.

Clear the open check, and Confirm order unlocks.

### The food cost on the order is higher than on the menu

Some sub-recipes, like dressings and spreads, are made in whole batches. The order counts the whole batch, and says which ones and how much they add.

### "Locked when confirmed. Reopen as draft to change the price."

The order is confirmed, so its price is locked. To change it, reopen the order as a draft.

![Locked when confirmed. Reopen as draft to change the price.](/proof/blog/build-catering-menu-quote/q-07b-reopen-mobile.png "A confirmed price doesn't change by accident.")

## Limits

- A draft order's food cost follows today's prices until you confirm. Confirming freezes it.
- Changing a saved menu applies to new orders only.
- Equipment counts on a menu don't scale with guests.
- The food cost is the food. "Left after food" is before staff, packaging and rentals.

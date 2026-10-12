---
title: "How to count your inventory the first time, one shelf at a time"
menuTitle: "Count your inventory the first time"
description: "A step-by-step guide with a screenshot at every step: name one shelf, count what's on it, and watch the shopping list stop buying what you already have."
publishedDate: 2026-10-15
category: Buying & suppliers
menuGroup: Plan and buy
menuIcon: packs
featured: false
order: 23
readMinutes: 8
featureHref: /features/inventory
featureLabel: See inventory in CostCook
---
<!-- story: docs/stories/blog-count-inventory-first-time.story.md -->
<!-- Read off kitchen-brain develop 9b84420f4 on 2026-10-12 (RC-80). Labels are
     the app's own. Not claimed: who may count (no role gate found on the
     route), and anything about par topping up the shopping list (the Set par
     dialog says it doesn't, the develop shopping list offers "Top up to par";
     RC-43 keeps buying-to-par off the site).
     CAPTURES: 15 crops at 390 px from a localhost build of develop 9b84420f4,
     demo seed renamed Harbor & Hearth Catering, US units. The shelf name
     "Walk-in, produce shelf" and the 20 lb green-bean count were entered for
     the shoot. -->

By the end of this guide, one shelf in your kitchen is counted, and CostCook's shopping list trusts it. It stops buying what that shelf already has.

Until you count an item, CostCook won't take what it thinks you have off the shopping list. The app's own rule: "A count comes off a buy only while it is 2 days old or newer." So an item with no recent count gets bought in full for your next event, even if there's plenty of it on the shelf.

Start with one shelf, not the whole kitchen. Then do the next shelf the next time you're there.

## Before you start

- Your ingredients are in CostCook. If they aren't, start with [How to import your ingredients, invoices and recipes](/blog/import-invoices-recipes-ingredient-lists).
- Pick one shelf or one area, like the produce shelf in the walk-in.
- Take your phone to the shelf. You type each count there.

## Count one shelf

1. Open **Kitchen records**, then **Inventory**. The summary at the top says how many items **Need a count**.

![The Inventory summary: Shelf value $7,374.58, Counted items only: 19 not counted. Cost to buy $381.34, To order 11, Below par 2, and Need a count 19, ringed.](/proof/blog/count-inventory-first-time/inv-01-open-mobile.png "Need a count: items never counted, or counted too long ago.")

2. Tap **Needs count**. The list shows only the items you haven't counted, or counted too long ago.

![The filter row: All, Needed for orders, Below par, and Needs count, ringed and selected. Below it: Items never counted or past the kitchen’s freshness limit. Count these before trusting stock or buying.](/proof/blog/count-inventory-first-time/inv-02-needs-count-mobile.png "Count these before trusting stock or buying.")

3. Narrow it to one shelf's worth. Tap **Category** and choose one, like **Produce**.

![The Category list: All categories, Bakery, Dairy, Pantry, Produce (ringed), Protein.](/proof/blog/count-inventory-first-time/inv-03-category-mobile.png "One category is a good first shelf.")

4. Give that shelf a name, so you can open it straight away next time. Tap **Set area for these**, type the shelf's name, and press **Move … items**. Moving items doesn't change any count.

![Set area for 9 items. Every item this list is showing moves to one area. No count changes. Storage area: Walk-in, produce shelf, with the option Add “Walk-in, produce shelf”. Move 9 items is ringed.](/proof/blog/count-inventory-first-time/inv-04-set-area-mobile.png "Name it the way your crew would: where it actually is.")

5. From now on, tap **Area** and choose the shelf to see only what's on it.

![The Storage area list: All areas, Walk-in, produce shelf (ringed), No area set.](/proof/blog/count-inventory-first-time/inv-05-area-filter-mobile.png "Next time, open the shelf by name.")

6. Find the first item and tap **Update count**. Here, the green beans have an estimate of 22.5 lb, but the count is 12 days old. So CostCook buys a whole 10 lb case for this week's order anyway.

![The Green bean row: Count needed, Count stale. On hand 22.5 lb, Estimate. Last counted 12 days ago. Need 6.3 lb, From 1 order. Buy 1 × 10 lb case, 6.3 lb to cover, Whole amount: last count too old, $27.21. Update count is ringed.](/proof/blog/count-inventory-first-time/inv-06-before-mobile.png "22.5 lb on the estimate, and it still buys a case.")

7. Type what's on the shelf, pick the unit you counted in, and press **Save count**. What you type replaces the estimate. Type 0 if the shelf is empty.

![Update count for Green bean. CostCook’s estimate is 22.5 lb, from what was bought and used. Last counted 12 days ago. What you type replaces the estimate. Perishable: Check it before you buy. Spoilage is not in the estimate. New count 20, Pound (lb). Save count is ringed.](/proof/blog/count-inventory-first-time/inv-07-count-mobile.png "Zero records an empty shelf.")

8. Check the row. The green beans now read **Covered**: 20 lb on hand against 6.3 lb needed, and **Buy: None**. The case came off the list.

![The Green bean row after the count: Covered. On hand 20 lb, Need 6.3 lb, From 1 order, Buy None.](/proof/blog/count-inventory-first-time/inv-08-after-mobile.png "Counted, so nothing to buy.")

9. Work down the shelf the same way, one item at a time.

10. When the shelf is done, go back to **Inventory** and press **Build shopping list**. Before it builds, CostCook says how many items still have no recent count.

![Build the shopping list? This updates your one shopping list with today’s counts, the confirmed events, suppliers and pack sizes. To order 10, Cost to buy $354.13. 8 of these have no recent count, so the list buys the whole amount for them. Count them first to buy less. Build shopping list is ringed.](/proof/blog/count-inventory-first-time/inv-09-build-mobile.png "“Count them first to buy less.”")

11. Press **Build shopping list** in that window, then open **Shopping list**.

![The top of Inventory: 10 items to order this week, Add ingredient, Shopping list (ringed), and Build shopping list.](/proof/blog/count-inventory-first-time/inv-10-open-list-mobile.png "Shopping list appears once the list is built.")

The list is grouped by supplier. For items you counted, it buys only what's missing. Items with an old count, or none, are still bought in full, and each line says so.

![A notice on the Shopping list: Only a recent count comes off. An old count, or no count, buys the whole amount. When something changes, rebuild and check the lines marked Review before buying. This list does not order anything.](/proof/blog/count-inventory-first-time/inv-11-list-rule-mobile.png "Nothing is ordered from here.")

![The Sour cream line: Events need 1.5 lb, Count confidence Count stale, Estimate 84.8 lb, Recent count No recent count, Suggested buy 1 × 2.5 kg tub. To buy less, count the shelf or take off a delivery on its way, then rebuild.](/proof/blog/count-inventory-first-time/inv-12-list-line-mobile.png "84.8 lb on the estimate, and it still buys a tub. That's your next shelf.")

If you count more items afterwards, press **Rebuild from current inventory** on the list.

**Tip:** count in the pack you buy. If carrots come in a 25 lb bag, the unit list has **25 lb bag**, so two full bags is just "2".

![The unit list for Carrot: Gram, Kilogram, Milligram, Ounce, Pound, and 25 lb bag, ringed.](/proof/blog/count-inventory-first-time/inv-tip-pack-mobile.png "Your supplier's pack is one of the units.")

**Tip:** set a **par**, the least you want on the shelf, with **Set par** on the row. When a recent count drops below it, the item shows **Below par**.

**Tip:** when the count window says **Perishable**, count that item before you shop. CostCook says it plainly: "Spoilage is not in the estimate."

## If something goes wrong

### "Whole amount: last count too old"

The count is more than 2 days old, so CostCook buys the full need. Press **Show the work** to see why, then count the item.

![What this leaves out: Count is stale. The recommendation uses the full need until a count is verified. Counts become stale after 2 days.](/proof/blog/count-inventory-first-time/err-stale-mobile.png "Count it, and the full buy comes off.")

### "Count it to compare."

The item has a par, but CostCook only judges a par from a recent count. Count the item, and it shows Below par or not.

![The Avocado row: Par: 62.2 each. Count it to compare. On hand 180 each, Estimate. Last counted 12 days ago.](/proof/blog/count-inventory-first-time/err-compare-mobile.png "An estimate isn't checked against par.")

### Your unit isn't in the list

The unit list only has units the ingredient can convert to. To count avocados by weight, for example, add a unit weight on the ingredient card first. The **Open** link in the count window takes you there.

![The count window for Avocado: New count, unit Each (ea). Missing a unit? Add a unit weight (g per each) for weight and volume units on the ingredient card. Open Avocado.](/proof/blog/count-inventory-first-time/err-unit-mobile.png "Add a unit weight to count by the pound.")

### "Not counted: no shelf value"

Shelf value adds up counted items only. Count the item, and it's included.

![Count age and value for Avocado: Last counted 12 days ago. Shelf value: Not counted: no shelf value.](/proof/blog/count-inventory-first-time/err-value-mobile.png "Shelf value is only what you counted.")

## Limits

- A count takes stock off the shopping list for 2 days. After that, the item is bought in full again until you count it.
- The estimate between counts comes from what was bought and used. Spoilage isn't in it.
- Setting an area doesn't change a count. Neither does setting a par.
- The shopping list doesn't order anything from a supplier.

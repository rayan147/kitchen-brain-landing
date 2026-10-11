---
title: "How to cost a recipe from case price to portion cost"
description: "Take a supplier case through units, usable yield, the recipe and the portion, with all the arithmetic left in."
publishedDate: 2026-07-16
category: Recipes & yield
menuGroup: Cost the work
menuIcon: yield
featured: false
order: 3
readMinutes: 3
featureHref: /features/recipes-and-costing
featureLabel: See recipe costing with the working shown
---
<!-- story: docs/stories/blog-case-to-portion.story.md -->

You buy by the case. The recipe calls for pounds, ounces, cups or eaches. The guest gets a portion. Costing a recipe is just the walk from the first to the last.

## Read the purchase as it arrives

Write down the case price, how many packs, the pack unit and what the product actually is, all in one place. A case described as “4 × 5 lb” is a 20 lb purchase, but only if all four packs contain the same ingredient and weight.

Use a common unit before you compare or divide:

```text
Purchase unit cost = case price ÷ total purchase quantity
```

For an illustrative 20 lb case of onions at $24:

```text
$24.00 ÷ 20 lb = $1.20 per purchased lb
```

## Apply usable yield

The skins are in the case price, but they are not on the plate. If trimming leaves 85% usable product:

```text
Usable quantity = purchased quantity × yield
20 lb × 0.85 = 17 lb usable

Cost per usable lb = case price ÷ usable quantity
$24.00 ÷ 17 lb ≈ $1.41 per usable lb
```

Use the yield for the product you actually buy and the way you actually prep it. Peeled, whole, roasted and drained canned onions won't necessarily share a yield, or even a unit.

## Cost the amount used by the recipe

If the recipe uses 6 usable pounds:

```text
Recipe line cost = usable unit cost × recipe quantity
$1.4118 per usable lb × 6 lb ≈ $8.47
```

Carry every decimal while you work and round once, at the end. Round at every step and the pennies start to show across a few hundred portions.

## Divide by the yield of the recipe

If the finished recipe produces 24 portions:

```text
Portion cost = recipe cost ÷ finished portions
$8.4706 ÷ 24 ≈ $0.35 per portion
```

A sub-recipe works the same way. Cost the whole batch, write down what it yields, and the recipe that uses it takes only what it needs.

## Stop when the units do not connect

If the unit you buy in and the unit the recipe uses don't connect, don't force it. A bottle priced by each and a recipe measured in fluid ounces needs the bottle volume. A bunch used as grams needs a measured bunch weight. Until you have that number, leave the gap where you can see it. Don't quietly treat the two units as the same.

## Keep the chain open

The trail is short:

```text
Case price → purchase unit → usable yield → recipe quantity → batch yield → portion cost
```

When a case price or a yield changes, you fix that one link instead of rebuilding the recipe from memory.

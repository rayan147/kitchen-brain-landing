---
title: "How to cost a recipe from case price to portion cost"
description: "Follow a supplier case through unit conversion, usable yield, recipe quantity, and portions without hiding the arithmetic."
publishedDate: 2026-09-03
category: Recipes & yield
menuGroup: Cost the work
menuIcon: yield
featured: false
order: 3
readMinutes: 7
featureHref: /features/recipes-and-costing
featureLabel: See recipe costing with the working shown
---
<!-- story: docs/stories/blog-case-to-portion.story.md -->

The supplier sells a case. The recipe uses pounds, ounces, cups, or eaches. The guest receives a portion. Recipe costing is the path between those three facts.

## Read the purchase as it arrives

Record the case price, pack quantity, pack unit, and the ingredient identity together. A case described as “4 × 5 lb” is a 20 lb purchase, but only if all four packs contain the same ingredient and weight.

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

Yield should describe the product and preparation you actually use. Peeled onions, whole onions, roasted onions, and drained canned onions do not necessarily share a yield or unit path.

## Cost the amount used by the recipe

If the recipe uses 6 usable pounds:

```text
Recipe line cost = usable unit cost × recipe quantity
$1.4118 per usable lb × 6 lb ≈ $8.47
```

Keep full precision while calculating and round the displayed result at the end. Rounding every intermediate conversion can create small differences that become noticeable across many portions.

## Divide by the yield of the recipe

If the finished recipe produces 24 portions:

```text
Portion cost = recipe cost ÷ finished portions
$8.4706 ÷ 24 ≈ $0.35 per portion
```

For a sub-recipe, the same logic applies. Cost the whole batch, record its finished yield, then let the parent recipe use only the quantity it needs.

## Stop when the units do not connect

Do not force a result when the purchase and recipe units cannot be reconciled. A bottle priced by each and a recipe measured in fluid ounces needs the bottle volume. A bunch used as grams needs a measured bunch weight. Missing conversion evidence should leave a visible gap rather than silently treating unlike units as equal.

## Keep the chain open

The useful audit trail is short:

```text
Case price → purchase unit → usable yield → recipe quantity → batch yield → portion cost
```

When the supplier price or yield changes, you can revisit the affected link instead of rebuilding the recipe from memory.

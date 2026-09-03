---
title: "How to check a supplier invoice before it changes your recipe costs"
description: "Confirm the ingredient, pack, unit conversion, and price difference before an imported invoice line becomes the current recipe cost."
publishedDate: 2026-09-03
category: Buying & suppliers
menuGroup: Plan and buy
menuIcon: invoice
featured: false
order: 10
readMinutes: 7
featureHref: /features/invoices-and-price-list-import
featureLabel: See invoices staged for review in CostCook
---
<!-- story: docs/stories/blog-review-supplier-invoice.story.md -->

A supplier PDF says `TOM PASTE 6/#10 38.40`. Your ingredient record still carries $34.20 per case. The document can be read perfectly and still be applied to the wrong product, pack, or unit.

Reading the line is the fast part. Deciding what it means is the important part.

## Keep the original line visible

Start with the source exactly as it arrived:

```text
TOM PASTE 6/#10 38.40
```

Then stage the possible facts without treating them as approved:

```text
Possible product: tomato paste
Possible pack: 6 × #10 cans
Possible case price: $38.40
Supplier item code: confirm from the document or supplier record
```

If the line is unclear, quote the unclear text rather than completing it from a guess. A scan can extract characters; it cannot establish that the abbreviated item is the ingredient your recipes use.

OCR can read 38.40. It cannot taste the difference between a case and a can.

## Confirm identity before price

Match the line using evidence that distinguishes similar products:

- Supplier and supplier item code.
- Full product description or brand.
- Pack count and container size.
- Purchase unit and net quantity.
- The ingredient or approved supplier option already on file.

Tomato paste, tomato sauce, and crushed tomatoes are not interchangeable because a text match finds “tomato.” A six-can case and a single can are not interchangeable because both show the same container size.

## Convert the confirmed pack

For this illustrative example, one confirmed case contains six 111 oz cans. Preserve precision through the conversion:

```text
Previous case price = $34.20
$34.20 ÷ 6 cans = $5.70 per can
$5.70 ÷ 111 oz ≈ $0.051351 per oz

Proposed case price = $38.40
$38.40 ÷ 6 cans = $6.40 per can
$6.40 ÷ 111 oz ≈ $0.057658 per oz
```

The case increased by $4.20:

```text
($38.40 − $34.20) ÷ $34.20 × 100 ≈ 12.3%
```

That percentage is meaningful only because the old and new records describe the same six-can case.

## Show the recipe consequence

Suppose one sauce batch uses 28 oz of tomato paste:

```text
Previous line cost:
$0.051351 per oz × 28 oz ≈ $1.44

Proposed line cost:
$0.057658 per oz × 28 oz ≈ $1.61

Change using unrounded values:
$1.6144 − $1.4378 ≈ $0.18 per sauce batch
```

The case increased by $4.20, but this recipe line changes by about $0.18 per batch. Keep the unit path visible so the small downstream number does not look disconnected from the supplier document.

## Review what the line would touch

Before committing the new price, check:

1. Which ingredient and supplier option will become current.
2. Which recipes and sub-recipes use that ingredient.
3. Which draft menus or quotes will recalculate.
4. Which confirmed quotes should preserve the historical price while showing a current comparison.
5. Whether the invoice documents a delivered purchase or only a proposed price.

An invoice is purchase evidence, but the received product and pack still have to agree with the record. A price list is an offer, not proof of a purchase. Keep those sources distinct.

## Commit the reviewed fact

The final record should retain enough context to explain itself later:

```text
Supplier item: confirmed
Pack: 6 × 111 oz
Previous case price: $34.20
New case price: $38.40
Effective source: this invoice
Reviewer decision: accepted
```

Only then should $38.40 become current. The invoice remains beside the new price, and the next recipe cost has a source you can inspect instead of a number that appeared behind you.


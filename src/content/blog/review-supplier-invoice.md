---
title: "How to check a supplier invoice before it changes your recipe costs"
description: "Check the ingredient, the pack, the unit math and the price change before an imported invoice line becomes what your recipes cost."
publishedDate: 2026-09-03
category: Buying & suppliers
menuGroup: Plan and buy
menuIcon: invoice
featured: false
order: 10
readMinutes: 3
featureHref: /features/invoices-and-price-list-import
featureLabel: See invoices staged for review in CostCook
---
<!-- story: docs/stories/blog-review-supplier-invoice.story.md -->

A supplier PDF says `TOM PASTE 6/#10 38.40`. Your ingredient record still carries $34.20 per case. The line can be read perfectly and still land on the wrong product, pack or unit.

Reading the line takes a second. Working out what it means is the job.

## Keep the original line visible

Start with the source exactly as it arrived:

```text
TOM PASTE 6/#10 38.40
```

Then write down what it might mean, without treating any of it as settled:

```text
Possible product: tomato paste
Possible pack: 6 × #10 cans
Possible case price: $38.40
Supplier item code: confirm from the document or supplier record
```

If part of the line is unclear, copy it as written instead of filling in a guess. A scan can read the characters. It can't tell you that the abbreviation is the ingredient your recipes use.

OCR can read 38.40. It cannot taste the difference between a case and a can.

## Confirm identity before price

Match the line on the things that tell similar products apart:

- Supplier and supplier item code.
- Full product description or brand.
- Pack count and container size.
- Purchase unit and net quantity.
- The ingredient or approved supplier option already on file.

Paste, sauce and crushed tomatoes are three different products, even if a text search finds “tomato” in all of them. A six-can case and a single can are not the same buy just because both say #10.

## Convert the confirmed pack

In this example, one confirmed case holds six 111 oz cans. Keep every decimal through the conversion:

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

That 12.3% only means something because the old price and the new one are for the same six-can case.

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

The case went up $4.20. This recipe line goes up about $0.18 a batch. Keep the unit math showing, so that small number still traces back to the invoice.

## Review what the line would touch

Before committing the new price, check:

1. Which ingredient and supplier option will become current.
2. Which recipes and sub-recipes use that ingredient.
3. Which draft menus or quotes will recalculate.
4. Which confirmed quotes should preserve the historical price while showing a current comparison.
5. Whether the invoice documents a delivered purchase or only a proposed price.

An invoice shows you bought it, but what came in the door still has to match the record. A price list is only an offer. Don't mix the two up.

## Commit the reviewed fact

The record you keep should explain itself when you come back to it:

```text
Supplier item: confirmed
Pack: 6 × 111 oz
Previous case price: $34.20
New case price: $38.40
Effective source: this invoice
Reviewer decision: accepted
```

Only then does $38.40 become the current price. The invoice stays next to it, and the next time a recipe costs out you can see where the number came from, instead of finding it changed behind your back.

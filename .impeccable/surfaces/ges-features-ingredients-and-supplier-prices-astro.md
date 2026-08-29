---
version: 1
slug: "ges-features-ingredients-and-supplier-prices-astro"
primary_target: "src/pages/features/ingredients-and-supplier-prices.astro"
related_targets: ["src/components/sections/IngredientsSupplierPricesFeature.astro","docs/stories/ingredients-supplier-prices.story.md"]
---

# Ingredients & Supplier Prices surface brief

## Thesis

One ingredient record turns unlike supplier packs into a price the kitchen can compare and the recipe can use. Lead with that connected record and its working; do not reduce the page to a catalogue of interchangeable feature cards.

## Audience and job

The primary reader is a working chef-owner checking whether the supplier price inside the next recipe and quote is still defensible. The user is trying to compare offers and trace the chosen usable-unit cost into affected recipes so that they can start CostCook or book a focused demo with confidence.

## Visual world

This route is an ordinary extension of the established CostCook Kitchen Ticket world and the approved Recipes & Costing surface. Use warm paper, cream and soft-green fields, ink typography, amber rules, square operational records, green actions, restrained ticket elevation, and tabular numerals. The ingredient record, joined supplier offers, comparison table, price history, recipe impact, and real product screenshot are evidence scenes inside that world, not a new identity.

## First viewport

Use a code-led editorial split. The left side states the price-in-the-recipe problem and keeps both next actions visible. The right side is dominated by one Chicken thigh ingredient record joined to two supplier offers, exposing pack, yield, and usable-unit cost immediately. The relationship between ingredient and offers must read before the visitor reaches the detailed chapters.

## Information architecture and workflow shape

Keep one overview route with a linear persuasion sequence: price-drift problem, two-link story navigator, ingredient record, supplier comparison, price history and recipe impact, real product evidence, shipped capability disclosure, FAQ, and closing action. This is a low-risk, inspect-and-decide marketing workflow; the current denormalized page keeps the comparison context visible and needs no child routes, tabs, carousel, modal, or workflow restructuring.

The page has one screen with several reading frames. The primary actions are to start CostCook and book a demo; the secondary recovery path is to return to every feature. Semantic disclosures hold the diligence read without interrupting the main story. As a server-rendered page, its core content and actions remain useful without client-side JavaScript.

## Story and evidence

Follow the chef-owner from an old but plausible case price to one ingredient record, concurrent supplier offers, a same-usable-unit comparison, visible price provenance, and downstream recipe impact. The canonical content story is `docs/stories/ingredients-supplier-prices.story.md` and the implementation is `src/components/sections/IngredientsSupplierPricesFeature.astro`.

All constructed records and monetary values are explicitly illustrative. The recipe-line capture is labeled as the real CostCook interface. Public behavior must remain bounded by `src/lib/features.ts`, `src/lib/site.ts`, PRODUCT.md, and the story tracker; do not imply automatic supplier synchronization, real-time pricing, purchasing recommendations, guaranteed savings, or invented margin and time outcomes.

## Mobile behavior

Preserve the same story order. Stack the editorial split, ingredient record, and supplier offers; make both hero and closing actions full width. Reflow the comparison so each fact label spans the row above the two supplier values at the narrowest viewport, keeping every value legible without page-level or nested horizontal scrolling. Retain 44-pixel action targets, visible focus, reduced-motion behavior, and meaningful disclosure controls.

## Finish contract

The surface is finished when the first viewport clearly joins one ingredient to two supplier offers while both actions remain available; the full page carries the old-price-to-defensible-quote story; illustrative and real evidence are distinguished; the shipped capability and FAQ disclosures remain usable; desktop and mobile verification show no material overflow or accessibility regression; and the independent finish review disposition is **ship** with no material fixes.

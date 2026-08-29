---
version: 1
slug: "src-pages-features-inventory-astro"
primary_target: "src/pages/features/inventory.astro"
related_targets: ["src/components/sections/InventoryFeature.astro", "docs/stories/inventory.story.md"]
---

# Inventory surface brief

## Thesis

An on-hand number earns trust from a dated physical count and the movements after it. Lead with that inspectable working and refuse both the generic inventory dashboard and the catalogue of interchangeable feature cards.

## Audience and job

The primary reader is a working chef-owner checking the shelf before the next shopping list is built. They need to distinguish a usable on-hand quantity from an exact-looking stale or unsupported number, understand what moved after the last physical count, and decide whether to start CostCook or book a focused demo.

## Visual world

This route is an ordinary extension of the established CostCook Kitchen Ticket world and the approved Recipes & Costing surface. Use warm paper, cream and soft-green fields, deep ink typography, amber operational rules, square shelf records, green actions, restrained ticket elevation, and tabular numerals. The shelf ticket, movement history, gap sheet, and trust-state records are evidence scenes inside that world, not a new identity.

## First viewport

Use a code-led editorial split. The left side states the trust problem and keeps both next actions visible. The right side is dominated by one shelf ticket that joins a dated 24 kg physical count to later receiving and Pack movement, computes 26.2 kg on hand, and keeps the Fresh state attached to the result. The count-plus-movement relationship must read before the visitor reaches the detailed chapters.

## Information architecture and workflow shape

Keep one overview route with a linear persuasion sequence: exact-looking stale count, two-link story navigator, count-and-movement history, trusted-shelf buy gap, explicit recovery states, shipped capability disclosure, FAQ, and closing action. This is a low-risk, inspect-and-decide marketing workflow; the current denormalized page keeps cause, state, and buying consequence together and needs no child routes, tabs, carousel, modal, or workflow restructuring.

The page is one screen with several reading frames. Primary actions are to start CostCook and book a demo; the secondary onward path returns to every feature. Semantic disclosures carry the diligence read without interrupting the main story. As a server-rendered route, the core content and actions remain useful without client-side JavaScript.

## Story and evidence

Follow the chef-owner from an exact-looking stale count to a dated physical baseline, the purchases, waste, and completed Pack consumption after it, the resulting trust state, and finally the quantity left to buy. Resolve stale and never-counted edge states with direct recovery actions before the capability and FAQ diligence read. The canonical content story is `docs/stories/inventory.story.md`; the route entry is `src/pages/features/inventory.astro`; and the visible implementation is `src/components/sections/InventoryFeature.astro`.

All constructed counts, movements, shelf values, and buy-gap figures are explicitly illustrative. Public behavior remains bounded by `src/lib/features.ts`, `src/lib/site.ts`, PRODUCT.md, and the story tracker. Do not imply infallible live inventory, automatic replenishment to par, stale stock reducing buying, automatic waste or shrinkage blame, guaranteed savings, or invented time and margin outcomes.

## Motion and interaction

The hero calculation is the route-specific single motion owner: its count, operators, movements, and result resolve in sequence once on entry. Shared page entrance behavior remains subordinate. Disclosures use the established restrained state transition, and `prefers-reduced-motion` removes both the calculation animation and disclosure rotation. Do not add scroll reveals, card lifts, parallax, looping counters, or competing motion elsewhere on the route.

## Mobile behavior

Preserve the same story order. Stack the editorial split while keeping both hero actions and the computed on-hand result within the first viewport; reflow the shelf equation and buy-gap equation vertically; turn movement rows into dated mobile records; and keep closing actions full width. Retain 44-pixel action targets, visible focus, semantic disclosure controls, reduced-motion behavior, and no page-level or nested horizontal scrolling, including at 320 pixels with 200% text zoom.

## Finish contract

The surface is finished when the first viewport explains physical count plus later movement as the source of the Fresh on-hand result while both actions remain available; the full page carries the stale-number-to-defensible-buy story; illustrative evidence and trust states are explicit; stale and never-counted conditions recover without quietly reducing buying; capability and FAQ disclosures remain usable without JavaScript; desktop, mobile, 200% text, reduced-motion, and no-JavaScript checks pass without horizontal overflow; the route-specific calculation remains the single authored motion owner; and the independent finish review disposition is **ship** with no material fixes.

---
version: 1
slug: "src-pages-features-purchasing-and-receiving-astro"
primary_target: "src/pages/features/purchasing-and-receiving.astro"
related_targets: ["src/components/sections/PurchasingReceivingFeature.astro", "docs/stories/purchasing-and-receiving.story.md"]
---

# Purchasing & Receiving surface brief

## Thesis

The supplier order and the delivery should meet in one inspectable record. Lead with the ordered-versus-received handoff and refuse both the generic procurement dashboard and the catalogue of interchangeable feature cards.

## Audience and job

The primary reader is a working chef-owner receiving food while prep is moving. They need to see how a reviewed supplier commitment becomes a receiving checklist, how delivery variances remain distinct, and how actual received facts reach purchasing and current prices before deciding whether to start CostCook or book a focused demo.

## Visual world

This route extends the established CostCook Kitchen Ticket world and the approved Recipes & Costing surface. Use warm paper, cream and soft-green fields, deep ink typography, amber variance rules, square purchase records, green actions, restrained ticket elevation, and tabular numerals. Purchase orders, receiving lines, posting facts, and recovery states are evidence scenes inside that world, not a new identity.

## First viewport

Use a code-led editorial split. The left side states the back-door handoff and keeps both next actions visible. The right side is dominated by one purchase record that joins 10 ordered cases to 9 received and 1 left to follow up. Every value is illustrative, and the variance must read before the visitor reaches the detailed chapters.

## Information architecture and workflow shape

Keep one overview route with a linear persuasion sequence: the order-versus-delivery wall, two-link story navigator, reviewed PO, inherited receiving checklist, posting boundary, explicit recovery states, shipped capability disclosure, FAQ, and closing action. This is a frequent, moderately complex, financially consequential product workflow, but the public route is a low-risk inspect-and-decide workflow. The denormalized page keeps commitment, variance, posting consequence, and recovery together and needs no child routes, tabs, carousel, modal, or workflow restructuring.

The page is one screen with several reading frames. Primary actions are to start CostCook and book a demo; the secondary onward path returns to every feature. Semantic disclosures carry the diligence read without interrupting the main story. As a server-rendered route, the core content and actions remain useful without client-side JavaScript.

## Story and evidence

Follow the chef-owner from the exact supplier message to the sent purchase order, the receiving checklist generated from it, a nine-of-ten short delivery, all-or-nothing posting from what actually arrived, and the durable one-case follow-up. Resolve failed sends and unexpected lines with direct recovery actions before the capability and FAQ diligence read. The canonical content story is `docs/stories/purchasing-and-receiving.story.md`.

All constructed quantities, prices, dates, supplier names, and delivery variances are explicitly illustrative. Public behavior remains bounded by `src/lib/features.ts`, `src/lib/site.ts`, PRODUCT.md, and the story tracker. Do not imply automatic ordering without review, guaranteed send or delivery success, automatic substitution acceptance, silent partial posting, invented savings, or invented time outcomes.

## Motion and interaction

The hero handoff is the route-specific single motion owner: ordered quantity, transfer, received quantity, transfer, and follow-up resolve in sequence once on entry. Shared page entrance behavior remains subordinate. Disclosures use the established restrained state transition, and `prefers-reduced-motion` removes both the handoff animation and disclosure rotation. Do not add scroll reveals, card lifts, parallax, looping counters, or competing motion elsewhere on the route.

## Mobile behavior

Preserve the same story order. Stack the editorial split while keeping both hero actions and the ordered-received-follow-up result within the first viewport; turn receiving rows into compact records; and keep closing actions full width. Retain 44-pixel action targets, visible focus, semantic disclosure controls, reduced-motion behavior, and no page-level or nested horizontal scrolling, including at 320 pixels with 200% text zoom.

## Finish contract

The surface is finished when the first viewport explains ordered versus received as the source of the follow-up gap while both actions remain available; the full page carries the reviewed-commitment-to-posted-delivery story; illustrative evidence and recovery states are explicit; financial write boundaries remain honest; desktop, mobile, 200% text, reduced-motion, and no-JavaScript checks pass without horizontal overflow; the route-specific handoff remains the single authored motion owner; and independent finish review finds no material issue.

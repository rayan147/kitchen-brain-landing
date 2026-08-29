---
version: 1
slug: "src-pages-features-purchases-and-month-cost-astro"
primary_target: "src/pages/features/purchases-and-month-cost.astro"
related_targets: ["src/components/sections/PurchasesMonthCostFeature.astro", "docs/stories/purchases-month-cost.story.md"]
---

# Purchases & Month Cost surface brief

## Thesis

A month-end difference should remain an inspectable question until the records explain it. Lead with theoretical use against actual spend, then separate logged waste from the remaining unaccounted gap; refuse the generic analytics dashboard, decorative chart wall, and feature-card catalogue.

## Audience and job

The primary reader is a working chef-owner closing a catering month after service. They need to understand how purchases from several sources become one ledger, how the month verdict is calculated, how dated prices and corrections preserve history, and where missing evidence limits the conclusion before deciding whether to start CostCook or book a focused demo.

## Visual world

Extend the established CostCook Kitchen Ticket world: warm paper, cream and soft-green fields, deep ink type, amber variance states, square ledger and month-close sheets, green actions, restrained ticket elevation, and tabular numerals. The evidence should feel like a ledger packet spread open for review, not a new product dashboard or brand identity.

## First viewport

Use a code-led editorial split. The left side states the month-close promise and keeps both next actions visible. The right side is dominated by an illustrative August close that compares $18,420 theoretical use with $19,135 actual spend, then keeps the $715 difference visible. The amount is evidence, not a hero-metric template: it must read as part of the reconciliation working.

## Information architecture and workflow shape

Keep one overview route with a linear persuasion sequence: the gap wall, a two-link story navigator, four sourced ledger doors, month reconciliation, dated price and correction evidence, trust and recovery states, shipped capability disclosure, FAQ, and closing action. The underlying purchase review is recurring, moderately complex, and financially consequential. The public route is a low-risk inspect-and-decide workflow, so a denormalized page keeps source, arithmetic, limits, and recovery context together. It needs no child routes, wizard, tabs, carousel, modal, or other workflow restructuring.

The page is one screen with several reading frames. Primary actions are to start CostCook and book a demo; the onward path returns to every feature. Semantic disclosures carry the diligence read. Core content and actions remain useful without client-side JavaScript.

## Story and evidence

Follow the chef-owner from scattered month-end purchase sources into one sourced ledger, then compare an illustrative $18,420 theoretical use with $19,135 actual spend. Separate the $715 gap into $286 logged waste and $429 unaccounted rather than assigning blame. Show dated price movement, a signed correction, the count requirement for turnover, and explicit recovery when evidence is late or missing. The canonical story is `docs/stories/purchases-month-cost.story.md`.

All constructed amounts, percentages, dates, suppliers, ingredients, and monthly variances are explicitly illustrative. Claims remain bounded by `src/lib/features.ts`, `src/lib/site.ts`, PRODUCT.md, and the story tracker. Do not imply accounting-system reconciliation, guaranteed waste reduction, automatic blame assignment, trusted inventory without counts, invented savings, or invented time outcomes.

## Motion and interaction

The hero reconciliation is the route-specific single motion owner: theoretical use and actual spend settle first, then the difference resolves into the review state once on entry. Shared entrance behavior remains subordinate. Disclosures use the established restrained state transition, and `prefers-reduced-motion` removes both. Do not add scroll reveals, looping counters, chart drawing, card lifts, parallax, or competing motion.

## Mobile behavior

Preserve the story order. Stack the editorial split while keeping both hero actions and the month difference within the first viewport; turn ledger and price rows into compact records; keep closing actions full width. Retain 44-pixel targets, visible focus, semantic disclosures, reduced-motion behavior, and no horizontal scrolling at 320 pixels with 200% text zoom.

## Finish contract

The surface is finished when the first viewport explains theoretical use against actual spend without mislabeling the difference; the complete story carries sources, month working, dated corrections, limits, and recovery; illustrative evidence is explicit; desktop, mobile, 200% text, reduced-motion, and no-JavaScript checks pass without horizontal overflow; the route-specific reconciliation remains the single authored motion owner; and the established feature dropdown points directly to the route. The independent finish reviewer disposition is **ship**, with no material fixes.

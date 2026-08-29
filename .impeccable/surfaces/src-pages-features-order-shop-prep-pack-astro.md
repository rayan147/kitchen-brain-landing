---
version: 1
slug: "src-pages-features-order-shop-prep-pack-astro"
primary_target: "src/pages/features/order-shop-prep-pack.astro"
related_targets: ["src/components/sections/OrderShopPrepPackFeature.astro", "docs/stories/order-shop-prep-pack.story.md"]
---

# Orders, Shop, Prep & Pack surface brief

## Thesis

One confirmed event should become three working lists without becoming three versions of the truth. Lead with the Shop-to-Prep-to-Pack handoff and refuse both the generic task dashboard and the catalogue of interchangeable feature cards.

## Audience and job

The primary reader is a working chef-owner preparing an approved catering event with a small crew. They need to understand how the frozen order becomes the buy, prep, and pack work; how progress stays distinct at each stage; and how changed plans and incomplete pack lines remain honest before deciding whether to start CostCook or book a focused demo.

## Visual world

Extend the established CostCook Kitchen Ticket world: warm paper, cream and soft-green fields, deep ink type, amber attention states, square working sheets, green actions, restrained ticket elevation, and tabular numerals. The evidence should feel like a production packet laid out in task order, not a new product dashboard or new brand identity.

## First viewport

Use a code-led editorial split. The left side states the one-order/three-lists promise and keeps both next actions visible. The right side is dominated by an illustrative 80-guest event ticket whose Shop and Prep stages are complete while Pack shows 7 of 8 with one hotel pan open. The open handoff must read before the visitor reaches the detailed chapters.

## Information architecture and workflow shape

Keep one overview route with a linear persuasion sequence: the missing-pan wall, a two-link story navigator, the confirmed-order source, Shop evidence, Prep-to-Pack handoff, recovery states, shipped capability disclosure, FAQ, and closing action. The product workflow is high-frequency, moderately complex, and operationally consequential. The public route is a low-risk inspect-and-decide workflow, so a denormalized page keeps source, progress, and exception context together. It needs no child routes, wizard, tabs, carousel, modal, or other workflow restructuring.

The page is one screen with several reading frames. Primary actions are to start CostCook and book a demo; the onward path returns to every feature. Semantic disclosures carry the diligence read. Core content and actions remain useful without client-side JavaScript.

## Story and evidence

Follow the chef-owner from a confirmed 80-guest order into Shop, Prep, and Pack; let 12 of 12 shop lines and 7 of 7 prep tasks resolve before an illustrative 7-of-8 pack state exposes the missing hotel pan. Show the buy-line working, frozen prep notes, equipment and allergen context, then resolve plan changes, aged plans, and incomplete close states before the capability and FAQ read. The canonical story is `docs/stories/order-shop-prep-pack.story.md`.

All constructed guest counts, task counts, dates, event names, quantities, and prices are explicitly illustrative. Claims remain bounded by `src/lib/features.ts`, `src/lib/site.ts`, PRODUCT.md, and the story tracker. Do not imply guaranteed prevention, automatic buying, automatic inventory accuracy, silent plan recomputation, invented savings, or invented time outcomes.

## Motion and interaction

The hero stage handoff is the route-specific single motion owner: Shop, then Prep, then Pack resolve in sequence once on entry, ending on the open pack line. Shared entrance behavior remains subordinate. Disclosures use the established restrained state transition, and `prefers-reduced-motion` removes both. Do not add scroll reveals, card lifts, parallax, looping counters, or competing motion.

## Mobile behavior

Preserve the story order. Stack the editorial split while keeping both hero actions and the three-stage result within the first viewport; turn working rows into compact records; keep closing actions full width. Retain 44-pixel targets, visible focus, semantic disclosures, reduced-motion behavior, and no horizontal scrolling at 320 pixels with 200% text zoom.

## Finish contract

The surface is finished when the first viewport explains one confirmed order feeding Shop, Prep, and Pack while exposing the remaining pack line; the complete story carries source, working stages, change honesty, and recovery; illustrative evidence is explicit; desktop, mobile, 200% text, reduced-motion, and no-JavaScript checks pass without horizontal overflow; the route-specific handoff remains the single authored motion owner; and the established feature dropdown points directly to the route.

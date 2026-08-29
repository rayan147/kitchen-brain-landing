# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

CostCook is for independent caterers and working chef-owners who quote jobs, manage recipes, buy ingredients, and may also cook or oversee the event. The primary reader evaluates the product while balancing kitchen work with a customer decision that needs a defensible number.

## Product Purpose

CostCook connects a catering menu and guest count to the recipes, quantities, shopping, prep, pack plan, and food-cost math needed to quote and run the job. Success means the kitchen can act from the same recipe record the owner used to price the work.

## Positioning

CostCook keeps operational plans and costing math inspectable. A case price travels through pack size, usable yield, sub-recipes, portions, and guest count with the working available to the user instead of collapsing into an unexplained total.

## Operating Context

Users work across prep tables, offices, walk-ins, receiving areas, and event sites. They handle recipes, supplier prices, purchase records, menus, guest counts, printed sheets, and mobile checklists, sometimes with wet hands or unreliable connectivity.

## Capabilities and Constraints

- Recipe management includes a one-screen builder, drafts, duplication, dishes and sub-recipes, scaling previews, exports, print sheets, and guarded deletion where supported by the shipped feature register.
- Recipe costing includes unit conversion, yields, sub-recipe costing, missing-price handling, line reconciliation, food-cost percentages, menu pricing, and inspectable arithmetic where supported by the shipped feature register.
- Menu management includes menu records, dish portions, a default per-guest price, equipment templates, duplication, and guarded changes where supported by the shipped feature register.
- Catering quotes connect a menu, event date, guest count, food cost, and per-guest price before confirmation; confirmed events preserve the quoted commitment while later cost movement remains visible where supported by the shipped feature register.
- Invoice and supplier price-list intake accepts photographs, PDFs, spreadsheets, Word documents, and pasted text into one staging queue; the original stays visible and uncertain facts wait for confirmation. Invoices reconcile purchase facts, while price lists remain row-level offers until applied.
- Public marketing claims must stay within the shipped feature register and claim ledger. Work marked in development must not read as available.
- Public amounts used for demonstration must be real product data or explicitly labeled illustrative.
- The marketing site is an Astro application and should remain useful without client-side JavaScript.

## Brand Commitments

The product name is CostCook. Its established voice is founder-direct, calm, competent, kitchen-literate, and unfussy. It uses plain kitchen English, outcome-labeled actions, and no invented guarantees. Existing visual and verbal brand assets remain authoritative for local extensions.

## Evidence on Hand

- `src/lib/features.ts` is the shipped public feature inventory.
- `src/lib/site.ts` is the source of public CTA labels, destinations, pricing, and owner-supplied contact values.
- `public/demo-poster.jpg` shows food cost per guest, target-price guidance, and quoted-versus-current context.
- `public/proof/hero-pricing.png` and `public/proof/hero-pricing-mobile.png` show event pricing facts and the confirmed price path at desktop and mobile sizes.
- `public/proof/yield-lines.png` and `public/proof/yield-lines-mobile.png` show ingredient quantities, usable yield, purchase quantity, prep state, and line cost.
- `public/demo.mp4` and `public/demo.webm` provide a working product demonstration.
- No customer testimonials, ROI figures, usage counts, or competitor claims are approved for invention.

## Product Principles

1. The number never lies: show what is known, what is missing, and how the total was reached.
2. Enter the menu and guest count once; downstream work should read from the same plan.
3. The reader is the hero; the product supports their judgment instead of replacing it.
4. Kitchen language and operating consequences outrank generic software language.
5. Server-rendered content, accessibility, and resilient fallbacks are product behavior, not polish.

## Accessibility & Inclusion

Public surfaces target WCAG 2.2 AA, keyboard operation, visible focus, 44-pixel standalone targets, reduced-motion support, responsive reflow, and survival at 200% text zoom.

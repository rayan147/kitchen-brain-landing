<!-- story: docs/stories/recipes-and-costing-redesign-prompt.story.md -->

# Redesign prompt: Recipes & Costing

Redesign `http://127.0.0.1:4321/features/recipes-and-costing` as a persuasive, visual product page built around two connected featured products:

1. **Recipe Management Software** — the working recipe the kitchen can find, scale, print, and repeat.
2. **Recipe Costing Software** — the visible math that turns purchases, yields, sub-recipes, portions, and guest counts into a price the owner can trust.

Do not turn this into a generic SaaS feature grid. The reader is a working chef-owner or caterer who writes the recipe, answers the quote, and may still be cooking the event. CostCook is the tool in that story, not the hero.

## Research-informed direction

Use Meez as an information-architecture reference, not as a visual or copy template. Its site separates a broad [recipe-management story](https://www.getmeez.com/recipe-management) from focused product pages for [organization](https://www.getmeez.com/organization), [scaling](https://www.getmeez.com/scaling), and [food costing](https://www.getmeez.com/costing). It repeatedly pairs one operational outcome with one product visual, then explains how the workflow works. Adopt that clarity.

Also use the visual research pattern seen across restaurant software: an inspectable recipe record, ingredient quantities and yields, and cost-per-portion or food-cost figures shown together. Do not copy competitor layouts, assets, interface chrome, testimonials, numbers, or claims.

## Route and workflow decision

Keep the existing `/features/recipes-and-costing` route. Do not add child routes in this pass. This is a low-frequency, low-interaction marketing workflow with high information density and medium claim risk, so use a hybrid structure: one overview route, two fully visible product stories, and a compact exhaustive capability section.

The visitor workflow is:

1. Arrive from the Features hub or search and immediately understand the page's job.
2. Recognize the split between managing the recipe and trusting its cost.
3. Jump to either product story through an “On this page” anchor navigator.
4. Inspect real interface evidence and understand how the two stories connect.
5. Expand the exhaustive feature details if needed.
6. Start CostCook or book a 15-minute demo with one real menu.

Use anchor links, not tabs: both product stories must remain visible, crawlable, printable, and available without JavaScript. Preserve the breadcrumb and the closing links to the four sibling feature areas. No broader navigation or feature-family restructure is needed.

## Story and page sequence

Write in second person throughout. Use plain kitchen English. No exclamation points and no “seamless,” “powerful,” “robust,” “all-in-one,” or vague claims such as “save time” without evidence.

### 1. Hero — one recipe, two jobs

- Eyebrow: `RECIPES + COSTING`
- H1: **The recipe has to work on the line and in the quote.**
- Subhead: **When the method lives in one place and the cost in another, one of them goes stale. Keep the working recipe and the number you say out loud connected.**
- Primary CTA: `Start CostCook`
- Secondary CTA: `Book 15 minutes`
- Keep the existing breadcrumb above the hero.
- Replace “44 shipped things” as the leading message. The count may remain as quiet supporting metadata near the exhaustive list, where diligence readers need it.
- Hero visual: a truthful product composition that shows one recipe record bridging two views—a kitchen-ready recipe view and an open costing calculation. Use real CostCook UI captures. If a suitable capture is unavailable, use a clearly diagrammatic, repo-native illustration rather than inventing a fake screenshot.

The first viewport should answer: what this is, who it helps, why Recipe Management and Recipe Costing belong together, and what to do next.

### 2. The split workflow today

Show the reader's current workaround before introducing detailed product features: the recipe is in a binder, document, or person's head; the supplier price is in a purchase record; the quote is in a spreadsheet. Use a restrained three-part “recipe / price / quote” diagram in the Kitchen Ticket visual language.

End the section with: **One working recipe should carry both the method and the math.**

Do not use a generic before/after checklist. Make the handoff visible.

### 3. Two-product anchor navigator

Create an accessible `nav` labeled “On this page” with two large, differentiated anchor choices:

- `Recipe management` — Build it once. Find it, scale it, and hand it to the kitchen.
- `Recipe costing` — Follow the price from the case to the plate and the quote.

These are signposts, not floating feature cards. Keep the system flat by default: square or lightly ruled surfaces, restrained green and amber, no glassmorphism, no gradient mesh, no carousel, and no dashboard-card collage.

### 4. Featured product one — Recipe Management Software

Section anchor: `#recipe-management`

- Eyebrow: `FEATURED PRODUCT 01`
- Heading: **One working recipe, from first draft to prep sheet.**
- Lead: **Build the dish while the details are in your hands. Keep ingredients, prep, yield, sub-recipes, and the version the kitchen should use in one record.**

Tell this as three visual feature scenes, not a list of ten claims:

1. **Build without leaving the recipe.** Show the one-screen builder, ingredient autocomplete, and adding a missing ingredient without losing typed work.
2. **Scale without rewriting the original.** Show target-amount or on-hand scaling as a preview; make it clear the saved recipe does not change.
3. **Hand off the current version.** Show a kitchen-readable recipe or print sheet, including its printed-at timestamp where the real product supports it.

Fold supporting capabilities into concise annotations: private drafts, duplicate, dish/sub-recipe switching, safe nesting, CSV export, and checked deletes. Do not claim multimedia training, AI import, version control, multi-location publishing, or any other Meez capability unless the CostCook claim ledger and shipped product prove it.

Required visual evidence:

- One desktop recipe-builder capture.
- One narrow/mobile kitchen view or print-sheet detail.
- One small scaling interaction sequence with a before value, changed target, and recalculated quantities. Use a two-frame comparison or a short muted clip with a static fallback; do not use an auto-advancing carousel.

### 5. Featured product two — Recipe Costing Software

Section anchor: `#recipe-costing`

- Eyebrow: `FEATURED PRODUCT 02`
- Heading: **See the cost change before the quote does.**
- Lead: **A case price only becomes useful after the pack, usable yield, sub-recipe, portion, and guest count have had their say. Keep every step open to inspection.**

Reuse and strengthen the existing `CASE → UNIT → EDIBLE → PLATE → EVENT` figure as the section's connective diagram. Pair it with three visual feature scenes:

1. **Cost every usable ingredient.** Show purchased versus usable cost, yield, quantity to buy, prep state, and each line's contribution.
2. **Open the arithmetic.** Show the `View line calculation` disclosure so a doubtful number can be taken apart instead of merely trusted.
3. **Price the menu before commitment.** Show cost per guest, food-cost percentage, the target price, and quoted-versus-current comparison using real demo data.

Use the existing assets as starting evidence, cropping only when the surrounding context remains understandable:

- `public/proof/yield-lines.png` and its mobile counterpart for ingredient-level yield and cost.
- `public/demo-poster.jpg` for cost per guest, target price, and quoted-versus-current context.

Required visual behavior:

- Annotate the exact UI region each paragraph discusses; do not place a full unreadable dashboard beside small copy.
- Use `<picture>` or equivalent responsive sources so mobile receives a deliberate crop, not a desktop table squeezed to 390px.
- Keep labels and numbers legible at the rendered size. Decorative callouts must not carry information unavailable in alt text or nearby copy.

Use this as the page's one snap line: **A sauce is one recipe, even in five dishes.** Place it in a bridge visual that shows one sub-recipe feeding several dishes while its cost is calculated once. Do not add a second slogan-like snap line.

### 6. Connected proof — the same record serves both jobs

Show one representative recipe moving through a short, truthful sequence:

`Build recipe → set yield → reuse sub-recipe → see plate cost → price menu`

Use one real example and label any sample amount as `Illustrative`. Never invent a customer result, testimonial, usage count, savings percentage, or “real-time” integration claim. If product data is missing or a line cannot be costed, the visual must show that condition rather than silently displaying zero.

This section should turn first confidence into earned trust by including the edge cases the current product already handles: missing prices are named, partial totals say what is missing, nesting cycles are refused, and the saved recipe does not change during a scaling preview.

### 7. Complete capabilities — detail without the wall

Preserve access to every currently shipped item in the Recipes & Costing area, but demote the exhaustive inventory below the two stories.

- Group the items under `Recipe management`, `Recipe costing`, `Ingredients`, and `Menus`.
- Use semantic disclosure elements or a well-structured compact index. Keep all content in the document and keyboard accessible.
- Put the derived shipped count here; do not hardcode it into copy.
- Preserve the claim-ledger boundary. Do not silently drop capabilities, and do not promote “Coming” work as shipped.
- If the implementation changes a shared feature primitive, inspect and verify every sibling route first. Prefer a route-specific composition so the other four feature pages do not inherit this editorial structure accidentally.

### 8. Frequently asked questions — resolve the last practical objections

Place a semantic FAQ section after the complete capability disclosures and before the closing CTA. Keep every answer concise, server-rendered, keyboard accessible, and grounded in shipped behavior.

Answer these six questions:

1. `What is recipe management software?`
2. `How does recipe costing work in CostCook?`
3. `Can I scale a recipe without changing the original?`
4. `What happens when a yield or ingredient price is missing?`
5. `Can I reuse sub-recipes and hand recipes to the kitchen?`
6. `Will a later price change rewrite a confirmed quote?`

Use native disclosure elements. Do not turn the section into six floating cards, add FAQ claims that are absent from the shipped feature register, or repeat the exhaustive capability list in answer form. The section's job is to resolve buying objections about workflow, trust, and handoff before the final action.

### 9. Closing outcome and CTA

Bring the two product stories back together.

- Heading: **Ready for the line. Ready to price.**
- Body: **Bring one real menu and follow it from recipe to quote, with the working shown.**
- Primary CTA: `Book 15 minutes`
- Secondary CTA: `Start CostCook`

The final image is the chef-owner with the recipe ready for the kitchen and the cost ready to say out loud. Keep the existing sibling-area links after the CTA as quiet onward navigation.

## Visual direction

Preserve CostCook's incumbent “Kitchen Ticket” identity:

- Warm off-white ground, paper and cream surfaces, working green actions, deep amber operational accents, and thin ticket rules.
- Fraunces for page identity and Instrument Sans for operational explanation.
- Flat by default; use restrained shadow only when a screenshot or ticket-like artifact needs physical separation.
- Keep the 72rem container and fluid gutters, but vary section topology: editorial split layouts, full-width evidence bands, and tight annotated crops. Do not repeat identical cards down the page.
- Let product UI be the dominant visual material. Kitchen photography, if used at all, should establish the real working scene and must never substitute for product proof.
- Use subtle reveal motion only where it helps the reader follow the sequence. Respect `prefers-reduced-motion`; no parallax, scroll-jacking, or auto-play with sound.

Aim for at least four meaningful visuals across the page, each proving a different claim. Every visual must earn its place by answering a question faster than adjacent prose.

## States, accessibility, and responsive behavior

- Preserve clear application identity, breadcrumb, H1, local context, and next action on a deep link.
- Keep a logical heading order and landmark structure. The anchor navigator must have an accessible label and visible focus states.
- Make all controls and links at least 44×44px where they behave as standalone targets.
- Do not rely on color alone for status, active anchors, missing costs, or over-target food cost.
- At mobile widths, stack copy before its supporting visual, use deliberate mobile crops, and prevent tables, code-like diagrams, and annotated screenshots from causing horizontal page scroll.
- At 200% text zoom, preserve reading order, label association, and access to every CTA.
- If an image, clip, or interactive enhancement fails, its nearby copy and fallback image must preserve the claim and next action. There is no form or transactional success state on this route; success is a clearly labeled handoff to Start CostCook or Book 15 minutes, not a toast.

## Verification and definition of done

Before implementation, read the repository instructions, `DESIGN.md`, the claim ledger, the Recipes & Costing entries in `src/lib/features.ts`, and the shared feature-route consumers. Use the current rendered page as the baseline.

Verify the complete workflow at 1440×900, 1280×800, 1024×768, 768×1024, and 390×844:

- Entry from `/features` and direct deep link.
- Both anchor links, browser back behavior, and visible keyboard focus.
- All product images, fallbacks, alt text, captions, and responsive crops.
- Complete capability disclosures and sibling-area links.
- Both CTAs and their explicit destinations.
- No overflow, clipping, unreadable screenshot text, console errors, failed assets, or layout shift.
- Reduced motion, 200% text zoom, and keyboard-only traversal.

Add or update regression coverage for the route's semantic headings, two anchor targets, preserved shipped capability content, CTA labels, responsive image sources, and absence of horizontal overflow. Run the repository's full check and build commands. Do not change the page until the implementation can show which real visual proves each public claim.

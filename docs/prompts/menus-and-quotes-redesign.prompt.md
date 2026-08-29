<!-- story: docs/stories/menus-and-quotes-redesign.story.md -->

# Redesign prompt: Menus & Quotes

Redesign `/features/menus-and-quotes` as a persuasive, visual product page built around two connected products:

1. **Menu Management Software** — the menu record that keeps dishes, portions per guest, default price, and equipment together.
2. **Catering Quote Software** — the event draft that combines a menu, date, guest count, and price, shows the food-cost consequence before commitment, and freezes the agreed plan when confirmed.

The primary reader is an independent caterer or working chef-owner who needs to answer a customer today and then run the job they described. CostCook supports that judgment; it is not the hero.

## Research-informed direction

Use [Meez menu engineering](https://www.getmeez.com/menu-engineering) as an information-architecture reference for separating menu building from pricing analysis. Use [Tripleseat's proposal and event-document story](https://tripleseat.com/features/proposals-contracts-beo/) only as evidence that catering buyers care about customer-facing details and operational details staying connected.

Do not copy either competitor's interface, layout, imagery, language, testimonials, figures, or claims. CostCook does not currently claim branded proposals, digital signatures, deposits, contracts, BEOs, online booking, CRM pipelines, customer portals, automated customer emails, or the integrations those products advertise. The CostCook feature register and release-claim ledger remain the only public source of truth.

## Route and workflow decision

Create a dedicated `/features/menus-and-quotes` route and point the existing `Menus & quotes` feature-navigation entry to it. Keep `/features/recipes-and-costing` as the specialist recipe story and preserve the other four dynamic feature-area routes.

This is a low-frequency, high-information marketing workflow with medium financial risk: the visitor is evaluating whether the menu, price, and confirmed event can remain consistent. Use a hybrid page shape:

1. Establish one menu and one commitment in the first viewport.
2. Show the copying problem before introducing product behavior.
3. Offer two accessible anchor paths: Menu Management and Catering Quotes.
4. Keep both product chapters visible, printable, and crawlable.
5. Show real CostCook evidence for the quote chapter.
6. Put the detailed capability inventory and FAQ in native disclosures.
7. End with Start CostCook and Book 15 minutes.

Do not add tabs, a carousel, a form, a pricing calculator, or a child-route family. No broader navigation or workflow restructuring is needed.

## Story and page sequence

Write in second person and plain kitchen English. Avoid exclamation points, generic SaaS language, and any promise the shipped app cannot demonstrate.

### 1. Hero — the menu and quote are one commitment

- H1: **Build the menu once. Quote the job you can actually run.**
- Subhead: **Keep dishes, portions, guest count, equipment, food cost, and the price you say out loud on one path from draft to confirmed event.**
- Primary CTA: `Start CostCook`
- Secondary CTA: `Book 15 minutes`
- Preserve the breadcrumb back to `Every feature`.

The hero visual should pair two connected, clearly illustrative records:

- A menu sheet with representative dishes, portions per guest, a default price, and equipment.
- A quote worksheet for the same menu with event date, guest count, cost per guest, quoted price, food-cost percentage, and status.

Label invented sample values as `Illustrative`. The relationship between the records matters more than decorative interface chrome.

The first viewport must answer what the page is, why menus and quotes belong together, and what the visitor can do next.

### 2. The handoff problem — three files, one customer waiting

Show the current workaround as a restrained sequence:

`MENU DOCUMENT → GUEST-COUNT EMAIL → QUOTE SPREADSHEET`

Explain that copying appears harmless until the count changes, the menu is revised, or the quote needs to become the kitchen's production plan. Keep the problem human and specific; do not invent lost revenue, customer churn, or time-saved figures.

End with: **One event record should carry what the customer chose and what the kitchen has to run.**

### 3. Two-product anchor navigator

Create an accessible `nav` labeled `On this page` with two substantial anchor links:

- `Menu management` — Build what each guest gets, priced and ready to reuse.
- `Catering quotes` — Test the number, confirm it, and keep the original commitment.

These are reading signposts, not floating feature cards. Keep both chapters in the document and available without JavaScript.

### 4. Featured product one — Menu Management Software

Section anchor: `#menu-management`

- Heading: **Make the menu runnable before you make it presentable.**
- Lead: **Keep dishes, portions per guest, the default price, and the equipment the menu always needs in one workspace.**

Tell this through three visual scenes:

1. **Build what each guest receives.** Show dishes and portions per guest in one menu workspace.
2. **Price the menu from its food.** Show cost per guest against the selling price and the price that would meet the target.
3. **Keep the reusable plan safe.** Show equipment counts attached to the menu, per-order overrides that do not rewrite the template, and a used-by guard before deletion.

Use a code-native menu worksheet rather than inventing a fake product screenshot. Its values must be labeled illustrative. Make the dish-to-per-guest relationship legible at phone width without a horizontally scrolling table.

### 5. Featured product two — Catering Quotes

Section anchor: `#catering-quotes`

- Heading: **Know what the quote is carrying before you confirm it.**
- Lead: **A new event starts with a menu, date, guest count, and price. See the food cost while the job is still a draft, then freeze the plan, math, and money together.**

Use a visible sequence:

`MENU → DATE → GUESTS → PRICE → REVIEW → CONFIRM`

Pair it with three evidence-led scenes:

1. **Cost before commitment.** Show cost per guest, quoted price, food-cost percentage, and the price needed to hit the configured target.
2. **Confirm one version.** Explain that confirmation snapshots plan, math, and money in one transaction.
3. **Compare without rewriting.** Show quoted-versus-current price after confirmation, and say explicitly that later prices do not silently rewrite the original quote.

Use the existing real CostCook assets:

- `public/proof/hero-pricing.png` and `hero-pricing-mobile.png` for cost against target before the quote goes out.
- `public/proof/outcome-quote.png` for the quote decision.
- `public/demo-poster.jpg` for the confirmed quote's quoted-versus-current comparison and its handoff into Shop, Prep, and Pack.

Use `<picture>` for deliberate responsive crops. Alt text must report only what is visible in the image. Do not enlarge a capture past its intrinsic width.

### 6. Connected proof — the quote should know what the kitchen has to pack

Use the page's one snap line:

**The quote should know what the kitchen has to pack.**

Show one illustrative event moving through this sequence:

`Build menu → set guest count → review food cost → set price → confirm → run the frozen plan`

The diagram should make the operational consequence visible: the same confirmed event feeds Shop, Prep, and Pack. Do not turn those downstream workflows into additional product chapters; they are proof that the quote becomes a runnable job.

Include the relevant edge cases:

- An order-level price may override the menu default.
- Reopening preserves frozen prices and says so.
- Reopening is refused once purchasing begins.
- An old frozen plan is labeled old rather than silently recomputed.
- Confirmed prep notes remain the frozen copy.

### 7. Complete Menus & Quotes capabilities

Keep access to the shipped details while protecting the main reading flow.

- Derive the menu capabilities from the `menus` feature group.
- Derive the directly relevant quoting and confirmation capabilities from the `orders` group; do not duplicate their wording into a second source-of-truth file.
- Group them under `Menu management` and `Quote and confirmation`.
- Compute the count from the selected items.
- Use semantic `<details>` elements with complete keyboard access.
- Do not include unrelated shopping, prep, pack, purchasing, or receiving capabilities merely to inflate the count.

### 8. Frequently asked questions

Place six concise native disclosures before the closing CTA:

1. `What is menu management software?`
2. `How does CostCook calculate a catering quote?`
3. `Can an event use a different price from the menu default?`
4. `What happens when I confirm a quote?`
5. `Will later ingredient prices change the quote I already gave?`
6. `Can I reopen a confirmed event?`

Every answer must stay inside the shipped feature register. Do not imply CostCook sends proposals, takes deposits, collects signatures, manages leads, or provides a customer portal.

### 9. Closing outcome and CTA

- Heading: **Ready for the customer. Ready for the kitchen.**
- Body: **Bring one real menu, set the guest count, and follow the number into the plan the kitchen will run.**
- Primary CTA: `Book 15 minutes`
- Secondary CTA: `Start CostCook`

Keep quiet onward links to Recipes & Costing and Every CostCook feature after the CTA.

## Visual direction

Extend the established CostCook `Kitchen Ticket` world rather than creating a new brand:

- Warm off-white, cream, paper, and soft-green surfaces.
- Green for actions and menu-state signals; deep amber for quote and commitment signals.
- Fraunces for editorial identity and Instrument Sans for operational explanation.
- Square records, thin ticket rules, and restrained physical shadow only for paper-like artifacts or real product captures.
- Alternate section topology: editorial split, full-width workflow band, connected records, annotated evidence, disclosures.
- Do not repeat the exact Recipes & Costing composition. Give Menus & Quotes its own visual motif: a menu column becoming a signed-off event timeline.

Avoid generic icon-card grids, glassmorphism, gradient meshes, hero metrics, decorative dashboards, horizontal carousels, and photography used in place of product proof.

Aim for at least five meaningful visuals:

1. Connected menu and quote records.
2. Three-file handoff diagram.
3. Menu workspace illustration.
4. Quote decision screenshot.
5. Confirmation-to-Shop/Prep/Pack flow.

### Accessibility and responsive behavior

- Preserve application identity, breadcrumb, H1, local context, and next action on a deep link.
- Keep one logical heading hierarchy.
- Give the local navigator an accessible name and visible focus states.
- Keep standalone controls at least 44×44 pixels.
- Do not use color alone for draft, confirmed, changed, over-target, or frozen states.
- Reflow menu rows into labeled mobile pairs instead of causing horizontal scroll.
- Keep screenshot labels legible through deliberate crops and nearby explanatory copy.
- Preserve the full claim and CTA when images fail or JavaScript is unavailable.
- Respect reduced motion and survive 200% text zoom.

## Verification and definition of done

Verify the complete workflow at 1440×900, 1280×800, 1024×768, 768×1024, and 390×844:

- Entry from the Features navigation and direct deep link.
- Both anchor links and browser back behavior.
- Menu rows, quote flow, real screenshots, captions, and responsive crops.
- Capability and FAQ disclosures using keyboard-only input.
- Both CTAs and their explicit destinations.
- Onward links to Recipes & Costing and Every feature.
- No overflow, clipping, unreadable proof, missing assets, console errors, or route conflicts.
- Reduced motion and text zoom behavior.

Add regression coverage for the dedicated route, the specialized feature-navigation destination, semantic headings, both anchors, responsive proof sources, FAQ copy, final CTA, and the absence of duplicate route generation. Run the repository's complete check and build commands.

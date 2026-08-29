<!-- story: docs/stories/invoices-price-list-import.story.md -->

# Redesign prompt: Invoices & price-list import

Redesign `/features/invoices-and-price-list-import` as a persuasive, visual product page built around two connected but meaningfully different products:

1. **Invoice Import Software** — a staged path from a source invoice to a reviewable purchase record, with the original, extracted lines, total reconciliation, duplicate handling, and human confirmation visible before posting.
2. **Supplier Price-list Import Software** — a row-by-row review of supplier offers, where the user can apply or skip a price and a changed pack size cannot pass as an ordinary price change.

The primary reader is an independent caterer or working chef-owner who needs current costs for the next quote but cannot let uncertain extraction change live ingredient or recipe prices. The reader is the hero; CostCook is the review tool.

## Research-informed direction

Use [Meez invoice processing](https://www.getmeez.com/invoice-processing) as category evidence that invoice intake is commonly explained as a path from source submission to ingredient-cost updates. Use [MarginEdge automated invoice processing](https://www.marginedge.com/automated-invoice) as information-architecture evidence for separating submission, coding, approval, and reporting. Its public description also reinforces that vendor line items need to connect to the ingredients or products a kitchen actually uses.

Do not copy either competitor's interface, imagery, sequence labels, claims, integrations, performance figures, testimonials, or automation promises. CostCook's distinguishing page argument must come from its own shipped behavior: documents enter one queue, facts remain staged, the original stays visible, uncertainty is surfaced, and the user confirms what becomes real.

Do not claim accounting export, bill payment, approval routing, guaranteed OCR accuracy, fully automatic matching or posting, time savings, COGS reduction, real-time processing, EDI, mobile-app capture, or unlimited invoice processing unless the CostCook claim ledger later proves those exact capabilities.

## Route and workflow decision

Create a dedicated `/features/invoices-and-price-list-import` route and point the existing `Invoices & price-list import` feature-menu entry to it. Preserve the broader `/features/getting-prices-in` route for purchases and the rest of the price-intake family.

This is a low-frequency, high-information marketing evaluation. The real import workflow is low-frequency, high-complexity, and financially risky because accepted data can change current ingredient costs and downstream recipe math. Use a hybrid marketing-page shape:

1. Establish the source → staging → confirmation model in the first viewport.
2. Show the cost of delayed data before introducing product behavior.
3. Offer two accessible anchors: Invoice Import and Price-list Import.
4. Explain the shared intake rule once.
5. Give each document type its own visual chapter and decision model.
6. Keep exception handling visible before the capability inventory and FAQ.
7. End with explicit Start CostCook and Book 15 minutes actions.

Do not add a working uploader, form, simulated wizard, tabs, carousel, or child-route family. No broader navigation or workflow restructuring is needed.

## Story and page sequence

Write in second person and plain kitchen English. Use one memorable line only. Avoid exclamation points, generic SaaS language, and invented certainty.

### 1. Hero — source in, control retained

- H1: **Bring in the paperwork. Keep the final say.**
- Subhead: **Send an invoice or supplier price list into one review queue. CostCook stages the lines, keeps the source beside them, and waits for you before anything becomes real.**
- Primary CTA: `Start CostCook`
- Secondary CTA: `Book 15 minutes`
- Preserve the breadcrumb back to `Every feature`.

The hero visual should show two layered source sheets—Invoice / Purchase and Price list / Offer—feeding a staged record. Include visible `Ready to review`, `Check pack`, and `Needs you` states plus a clear `You confirm` gate. Label the entire record illustrative. The first viewport must answer what this is, why review matters, and what the visitor can do next.

### 2. The delay problem — the price changed on paper first

Show the current workaround as:

`SOURCE ARRIVES TODAY → PRICE GETS KEYED LATER → QUOTE GOES OUT NOW`

Keep the scene specific: a folded invoice, a photographed supplier offer, and a quote still using last month's price. Do not invent money lost, hours saved, or customer impact.

End with: **That is why reading and committing belong in different moments.**

### 3. Two-product anchor navigator

Create a semantic navigation labeled `On this page` with two substantial links:

- `Invoice import` — Check the purchase, its lines, and its total before posting.
- `Price-list import` — Apply or skip supplier offers without inventing a purchase.

Both chapters remain rendered, printable, and crawlable without JavaScript.

### 4. Shared intake rule — five doors, one queue, one gate

Show the common staged path:

`BRING IN SOURCE → READ AND MATCH → YOU CONFIRM → COMMIT RESULT`

Name the supported doors exactly: photograph, PDF, spreadsheet, Word document, and pasted text. Say that imported facts remain outside the real catalog until confirmation. Do not make a file format look like an assurance of perfect extraction.

### 5. Featured product one — Invoice Import Software

Section anchor: `#invoice-import`

- Heading: **Invoice import that stops for a proper check.**
- Lead: **An invoice says what you bought, when you bought it, and what the supplier charged. Review those facts together before they join the purchase ledger.**

Use a code-native review scene rather than a fake screenshot. Put an illustrative source invoice beside three staged purchase lines. Show the stated total and the computed total matching. Highlight one pack that still needs review.

Support the scene with three points:

1. **Keep the source in view.** The original photo or PDF stays beside staged rows.
2. **Reconcile before posting.** Stated totals compare with line totals; duplicate sources are fingerprinted.
3. **Post once.** A repeated commit replays the same receipt, and current cost follows purchase date rather than entry order.

Do not describe the page as an accounting approval workflow.

### 6. Featured product two — Supplier Price-list Import Software

Section anchor: `#price-list-import`

- Heading: **A supplier price list is an offer, not a purchase.**
- Lead: **Read the sheet row by row. Apply the offers you want, skip the ones you do not, and stop when a pack-size change needs a closer look.**

Use a wide price-list review with current values, offered values, and explicit `Apply`, `Skip`, and `Review pack` decisions. Reflow every row into labeled blocks on small screens; do not ship a horizontally scrolling table.

Use the page's single snap line:

**A price list is an offer. An invoice is what happened. CostCook keeps the difference.**

Support the scene with column mapping for unfamiliar CSVs, visible match ambiguity, learned supplier aliases, and refusal to silently apply pack-size changes.

### 7. Exception and recovery proof

Show four difficult states in one operational list:

- `Unreadable` → quote the source text beside the row; correct it or leave it waiting.
- `Unmatched` → show candidate matches; choose one or add a new record.
- `Duplicate` → open the existing receipt instead of posting again.
- `Pack changed` → stop and review the unit.

This section must answer what happened, what remains safe, and what the user can do next. Do not imply uncertainty disappears.

### 8. Complete import capabilities

Derive selected public details from `src/lib/features.ts` so the claim register remains the source of truth. Split them under `Invoice import` and `Price-list import`, compute the count, and use native `<details>` elements. Preserve complete keyboard access and do not inflate the count with unrelated purchasing, receiving, recipe, or inventory behavior.

### 9. Frequently asked questions

Place six concise native disclosures before the closing CTA:

1. `What can I import into CostCook?`
2. `Does an import update ingredient prices automatically?`
3. `What is the difference between an invoice and a price list?`
4. `What happens when CostCook cannot read a line?`
5. `How are duplicate invoices handled?`
6. `Can an older invoice replace a newer ingredient price?`

Every answer must preserve the staging-and-confirmation boundary.

### 10. Closing outcome and CTA

- Heading: **The source filed. The price explained.**
- Body: **Bring in the next supplier document with every line still under your eye.**
- Primary CTA: `Book 15 minutes`
- Secondary CTA: `Start CostCook`

Keep quiet onward links to Purchases & getting prices in, Recipes & food costing, and Every CostCook feature.

## Visual direction

Extend the established CostCook Kitchen Ticket world:

- Warm off-white, cream, paper, and soft-green fields.
- Green for accepted or actionable states; deep amber for review, uncertainty, and the human gate.
- Fraunces for editorial identity; Instrument Sans for operational explanation.
- Square sheets, fine ticket rules, tabular numerals, and restrained physical shadows only on document-like surfaces.
- Alternate topology across the page: layered papers, a dark delay band, a four-stage queue, side-by-side review records, a wide row decision surface, and plain disclosures.
- Treat the page as a source document under inspection, not a dashboard gallery.

Avoid a generic icon-card grid, glassmorphism, gradient meshes, fake browser chrome, decorative AI sparkles, hero metrics, horizontal carousels, and photography used in place of product proof.

Aim for at least five meaningful visuals:

1. Layered source documents becoming a staged ledger.
2. Source-arrival to quote-delay timeline.
3. Five-door queue and confirmation gate.
4. Original invoice beside reconciled staged lines.
5. Price-list rows with Apply, Skip, and Review pack decisions.
6. Exception-and-recovery rail.

## Accessibility and responsive behavior

- Preserve application identity, breadcrumb, H1, local context, and next action on a deep link.
- Keep one logical heading hierarchy.
- Give the local navigator an accessible name and visible focus states.
- Keep standalone actions at least 44×44 pixels.
- Never use color alone for ready, review, apply, skip, unreadable, unmatched, duplicate, or changed-pack states.
- Reflow all ledger and price-list rows into label-value blocks on mobile.
- Keep illustrative labels and captions adjacent to invented values.
- Preserve the complete argument and CTA when JavaScript or decorative visuals are unavailable.
- Respect reduced motion and survive 200% text zoom.

## Verification and definition of done

Verify at 1440×900, 1280×800, 1024×768, 768×1024, and 390×844:

- Entry from the Features menu and direct deep link.
- Both anchor links and browser back behavior.
- Source, staging, confirmation, invoice reconciliation, price-list decisions, and recovery states.
- Capability and FAQ disclosures with keyboard-only input.
- Both CTAs and their destinations.
- Onward links to related feature guides.
- No overflow, clipping, unreadable records, missing assets, console errors, or duplicate generated route.

Add regression coverage for the dedicated route, feature-menu destination, H1, both chapter anchors, source/stage/confirm labels, FAQ count and copy, closing CTA, and absence of a false automatic-update claim. Run the repository's complete check and build commands.

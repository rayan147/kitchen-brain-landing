# Lane F notes: buying and supplier invoices

Source: `~/kitchen-brain-develop-demo`, HEAD `ed6ff5f01` = `origin/main` (checked
2026-09-27). Rows are in `F.yaml`. "Invoice" means the supplier invoice.

## Counts

25 rows. 22 production, 0 assumed-today, 3 off-page (F-03 invoice email,
F-24 purchase-order email hardening branch, F-25 inter-unit stock transfers).

## What the lane found

- **Invoice import is the centre of buying.** You can bring an invoice in as a
  PDF, a phone photo (the pages become one document) or a file dropped on
  "Drop invoices & price lists". The owner then reviews it line by line and
  presses "Import invoice and update costs". That one action writes the
  purchases, updates current pack costs, can create the supplier and new
  ingredients, and can send a QuickBooks bill if QuickBooks is set up. The
  flow ends at "Invoice imported", and when an upcoming event's cost changes
  it offers "Review affected events" (price impact, F-08).
- **The price-impact loop is shipped.** A cost change from a purchase, invoice,
  price sheet or adopted quote becomes a review that names the draft and
  confirmed events affected. The app says confirmed events keep the quoted
  price, so a rise comes out of margin. The review closes for good with "I
  changed a price or menu" or "Checked, no change needed".
- **Inventory, par, buy-to-par shopping lists, receiving against a sent PO,
  short-delivery follow-up, waste, turnover and food-cost reconciliation** are
  all live. None of them do lot tracking, expiry dates or FIFO valuation, and
  the glossary rules those out on purpose.
- **Comparing buying options** (F-21) is live: "Cheapest after trim" and "The
  cheaper pack is not the cheaper buy. Trim eats the difference." This is a
  strong demo frame.

## Import AI provider behaviour (checked against code, not only the audit doc)

- `docs/import-pipeline-audit.md` is dated 2026-07-27. Where it differs from
  the current code, the code wins.
- PDFs with a text layer are read by CostCook's own rule-based parsers
  (`src/lib/import/parsers/*`). No AI is involved.
- Scanned PDFs and phone photos need OCR. That runs through the configured AI
  provider (`src/lib/server/import/ocr-adapter.ts`):
  - Google `gemini-3.5-flash-lite` is the default.
  - `IMPORT_AI_PROVIDER=anthropic` switches it to `claude-sonnet-5`
    (`provider.ts:93-103`).
  - One call has a 60-second timeout and one retry.
- Price sheets, ingredient lists and recipes also go through the AI when they
  arrive as photos or pasted text. For foreign spreadsheets the AI only names
  the columns, and rules read the numbers.
- The `stub` provider works only on localhost (`provider.ts:51`), so a deployed
  site can never serve canned output. The Sage kill switch blocks the Sage
  drafts (allergens, nutrition). It does **not** block import extraction.
- If no provider key is set, OCR is off. A scan then stops at "Scan not
  readable" / "This PDF needs OCR", and the app says "This is a scan, and no
  scan reader is set up here". The original file is kept, and the owner can
  replace it with a text PDF.

**Lines it cannot read.** The app never guesses a number into the books:

- A low-confidence quantity or amount blocks the import ("Confirm the
  low-confidence quantity for …", "Confirm the low-confidence financial
  values for …").
- Every line needs a catalog decision: an existing ingredient, "Create new
  ingredient", or "Exclude this line".
- Import is also blocked when the lines do not add up to the printed total,
  when no supplier is chosen, or when the invoice looks like a duplicate.
- For price sheets and recipes, unreadable sections are listed under "Some
  source text could not be read", and the rest is still extracted.
- The landing may say "CostCook reads it and you check what it wasn't sure
  of", which is close to the app's own lead line. It must not claim the reads
  are complete or accurate.

## Invoice email (F-03): why it is off-page

The feature is fully built on main: settings page, inbox, classifier, outcomes,
quarantine, daily caps, and an e2e spec. But `infra/cdk/environments.ts:156`
sets production to `inbox: { domain: 'in.costcook.io', nameServers: [], worker: false }`.
Only the **test** environment runs the mail worker, and only since
2026-09-25. In production the settings page can still show an
`@in.costcook.io` address (`domain.ts` maps production to it), but mail
cannot reach it yet. **The landing must not claim email-in until the owner
confirms production is live.**

## Gates

- No buying feature is limited by plan. `docs/billing.md` describes one
  "Launch" plan.
- These role gates apply:
  - Supplier timing is owner only.
  - Supplier credits and QuickBooks accounting actions are owner only.
  - Price-impact decisions are owner or manager.
  - Purchase correction depends on the user's role (`canCorrect`).
- QuickBooks bill export also needs the release flag
  `FEATURE_QUICKBOOKS_INTEGRATION_ENABLED` and an active subscription.

## Wording drift the landing should watch

- **Supplier or vendor:** the app mostly says "supplier", but the settings page
  and its dialog say "Vendors & suppliers" and "Add vendor". Use "supplier".
- **Invoice:** always the supplier invoice. Customer or client invoicing is a
  separate area (lanes A and C).
- **Price sheet:** a supplier's asking prices. It is **not** a purchase, and it
  never changes month spend.
- **Food cost:** the app labels the two sides "Should have cost" and "Did
  cost", and the gap is never called waste unless waste was logged.
- **Buying helpers:** "Purchase order", "Shopping list" and "Purchase
  recommendation" are three different things. The app has no PO numbers and
  no PO statuses.

## Cross-lane overlaps (dedupe at merge)

- F-10 and F-16 overlap lane D. Lane D covers purchase-order sending,
  `/orders/[id]/receiving` and the order shopping list.
- F-14 and F-23 overlap lane G (month food cost, `/analytics/prices`).
- F-22 overlaps lane E (allergens, nutrition).
- F-05 overlaps lane I (QuickBooks setup).

## Open questions for the owner

1. Is the invoice mail worker live in production, or planned? Today
   `worker: false` and the name servers are empty.
2. Which import AI provider and key does production run? If none is set,
   scans and photos stop at "Scan not readable". Is it Gemini flash-lite?
3. Is `FEATURE_QUICKBOOKS_INTEGRATION_ENABLED` on in production for all
   kitchens?
4. `feat/purchase-order-email-workflow` was last touched 2026-07-29. Is it
   abandoned, or still planned?
5. `feat/488-inter-unit-inventory-transfers-v2` (multi-unit stock transfers):
   what is its status?
6. The audit doc's release gate says "a configured real OCR provider ... was
   unavailable". Has a real OCR run been checked since then?

## Not done in this lane

No running-app spot check was done. That step belongs to the orchestrator
(section 8). All labels were read from source at the lines cited.

# What meez and Parsley market that we already ship

Reviewed 2026-08-22 against getmeez.com and parsleysoftware.com (homepages),
`src/lib/features.ts`, and `docs/release-claim-ledger.md`.

## The finding

We are not missing their features. We are missing their **prominence**.

Every capability below already exists in `features.ts` and already appears on
`/features`. None of it appears on the homepage, because the homepage argues
one chain (cost it, buy it, prep it, pack it, bring the price back) and that
chain has no slot for intake, for the shelf, or for allergens.

Nothing here is a competitor comparison. The ledger excludes those from public
copy. The two sites are input to what we lead with, never output on the page.

## 1. Ship, ledger-backed, absent from the homepage

Safe to promote today.

| Capability | They call it | Our rows | Framing constraint |
| --- | --- | --- | --- |
| Photo / PDF / paste intake, staged for review | meez "Invoice Scans & Processing"; Parsley "Herb AI" | RC-09, RC-26 | Must read *you confirm*, never *it reads your invoices*. The ledger excludes certified OCR accuracy and fully automatic matching. |
| Computed on-hand with a trust gate | both, "Inventory Management" | RC-23, RC-31 | Fresh / stale / never counted stays said out loud. Not a live count. |
| Price provenance: where this price came from, from whom, effective when | neither markets it | RC-32 | Keep the fallback wording when provenance is incomplete. |
| Prep scaled to the job, sub-recipes in whole batches, checks that persist | Parsley "Production Plans"; meez "Recipe Scaling" | RC-24 | Already in the walkthrough (b03, b03b) but nowhere in page copy. |
| Shop consolidated by supplier in whole packs | Parsley "Inventory & Purchasing" | RC-22 | On the homepage already, inside outcome 3. |

The best-written copy for the first row is already in the repo and ships
nowhere: `src/lib/workflow.ts` has fourteen stops, opening with "Photograph the
price board" and "You tap what changed, not the whole sheet." Nothing imports
it. `LoopBand.astro` and `TheProblem.astro` reference it only in comments.

## 2. Ship, but no ledger row exists

Blocked on an owner decision, not on engineering.

- **Allergens.** Fourteen-allergen tagging, rolls up from ingredient to recipe,
  chef overrides that require a written reason, allergen badges on the pack
  list. Both competitors lead with allergen handling; meez pairs it with
  compliance language. We have no RC row for it, so it cannot go on the
  homepage without a ledger review. It is already public on `/features`, which
  makes the gap a ledger-completeness problem as much as a marketing one.
- **The strong yield claim.** RC-16 and RC-19 say "yield" generically. Trim
  loss and cooking loss as two separate numbers, and byproduct credit against
  usable cost, are stronger than what the rows carry. `TheYield` already argues
  the trim half on the homepage. Confirm the rows stretch that far before
  leaning harder.

## 3. They market it, we do not ship it

Do not claim, in any wording.

- **Nutrition facts and USDA nutrition labels.** meez and Parsley both lead
  with this. We carry USDA reference data for *yields, densities and unit
  weights*, and allergen tagging. That is not a nutrition label. This is the
  most tempting item on their pages and the one that would fail a demo call.
- **Label design and printing.** RC-35, in development, stays marked so.
- **External ordering integrations / open API.** In development, stays so.
- **Multi-location / multi-unit groups.** We have per-kitchen isolation, which
  is not the same product claim.
- **Kitchen training and BOH onboarding.** Not a thing we do.

## 4. We ship it and neither of them markets it

These are the differentiators worth spending homepage space on before matching
anything on their pages.

- Confirming an order freezes its plan, its costing inputs and its money, and
  later prices never rewrite it (RC-07, RC-08). Quoted versus today.
- Receiving is the checklist for the purchase order you actually sent, and
  ticking it off is what writes the purchase (RC-26, RC-27, RC-37).
- Month verdict: theoretical usage against actual spend with the unaccounted
  gap named rather than blamed on waste (RC-30).
- Missing prices and conversion facts stop costing instead of becoming zero
  (RC-20).
- Purchase orders that really send, showing the exact body sent, recorded only
  after the send succeeds.

## Placement constraint before anyone edits

`CustomerOutcomes.astro` carries FOUR answers, deliberately one per pain in
`TheProblem.astro`, in the same order. `src/pages/index.astro` records that the
decision to promote `SeeItRun` above it is **void** if that mapping breaks.
Bolting extra outcome cards on silently invalidates a documented measurement.
Either add a pain and its paired answer together, or put the addition
somewhere that is not that pair.

CLAUDE.md also caps quiet secondaries at two and holds one claim per section.

## Acted on, 2026-08-23

The positioning half of this memo is now on the page. What changed:

- **`src/components/sections/PaperIn.astro`**, a new seventh stop between
  `TheYield` and `BuiltForKitchens`. It says how prices get into the loop:
  photo, PDF, spreadsheet, or pasted text, into one queue, staged until you
  commit it. Backed by RC-09 and RC-26 and nothing beyond them. No screenshot
  (`public/proof` has no import crop and the walkthrough seed stages no import
  batch), no CTA, and not a fifth `CustomerOutcomes` card, so the 1:1 mapping
  that `index.astro` records stays intact.
- **`src/lib/features.ts`** gained two `in-development` groups: Sage the in-app
  assistant, and Square/QuickBooks accounting and point of sale. Both are
  under-construction work in app-repo worktrees, absent from the deployed
  build, so they sit under "Clearly separate from what you can buy today" and
  nowhere else.

Still open and deliberately not written:

- **In-app support.** The ledger excludes any service-response promise without
  owner-approved evidence. Marketing support needs that approval first, not a
  code check.
- **Allergens.** Ships and is public on `/features`, still has no RC row. That
  is a ledger-completeness gap before it is a copy gap.
- **Recipe management.** The shipped recipe group (RC-17, RC-18, RC-19) already
  covers what is deployed. The in-flight work is an upgrade to it, so it gets
  no in-development row of its own until it changes what a prospect would be
  told.

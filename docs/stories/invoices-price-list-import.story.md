# Story Tracker — Invoices & price-list import

## My story

- **Piece:** Feature explainer
- **Title / headline:** Bring in the paperwork. Keep the final say.
- **My hero's name:** Sam, an independent caterer receiving supplier paperwork between kitchen work and quoting
- **Content file(s):** `src/components/sections/InvoicesPriceListImportFeature.astro`, `src/pages/features/invoices-and-price-list-import.astro`, `docs/prompts/invoices-price-list-import-redesign.prompt.md`

## The 11 steps

| # | Step | What you build | Done |
|---|------|----------------|------|
| 1 | The Idea | One sentence: WHO + WANT + WALL. | ☑ |
| 2 | Your Character | Hero's insides: want, need, wound, flaw. | ☑ |
| 3 | The Plot | 12 beats on the Save the Cat map. | ☑ |
| 4 | From Beats to Scenes | 12 beats → the 6–8 sections you will write. | ☑ |
| 5 | Character Voices | The reader's voice and the product's voice. | ☑ |
| 6 | Writing Dialogue | Each section turns a value, the McKee way. | ☑ |
| 7 | Sorkin Dialogue | Headline and subhead as intention vs obstacle. | ☑ |
| 8 | Cool Talk | One line of snap. | ☑ |
| 9 | Bringing a Scene to Life | Senses and setting for the key scene. | ☑ |
| 10 | Connecting Your Scenes | Hand-offs between sections; POV locked. | ☑ |
| 11 | Revise and Finish | Cut, sharpen, make the ending land. Done. | ☑ |

---

### Step 1 — The Idea

> An independent caterer who wants current ingredient prices without retyping every supplier document, but cannot let uncertain extraction rewrite the costs behind tomorrow's quote.

### Step 2 — Your Character

- **Want (surface):** Get the invoice and new supplier price list into CostCook before the next quote.
- **Need (real):** A reviewable path from source document to current cost, with every uncertain line kept visible until they confirm it.
- **Wound (the bad day):** A supplier's new case price was still sitting in a PDF while a customer received a quote based on the old number.
- **Flaw (the habit):** Sam postpones price updates because typing rows is slow, then trusts memory to bridge the gap.

### Step 3 — The Plot (12 beats)

| Beat | In this piece |
|------|---------------|
| 1 Opening Image — life before | A printed invoice, a photographed price list, and a spreadsheet wait beside prep notes while the useful prices remain trapped inside them. |
| 2 Theme Stated — the truth they'll learn | Faster intake only matters when the kitchen still controls what becomes real. |
| 3 Set-Up — the daily grind, the flaw on display | Sam keys the urgent rows, leaves the rest for later, and quotes from whatever price was last entered. |
| 4 Catalyst — the bad day / the wall hits | A changed case price reaches the quote after the customer does. |
| 5 Debate — “can it be different?” | Can a photograph, PDF, spreadsheet, Word document, or pasted text be useful without trusting every extracted unit and match? |
| 6 Break into Two — they try the new way | Sam sends the source into one import queue; CostCook stages what it could read instead of writing straight to the catalog. |
| 7 B Story — the person/relationship it's really about | The owner can protect the number they say to a customer and the ingredient record the kitchen uses. |
| 8 Fun and Games — the promise of the premise | The original stays beside staged rows; uncertain text is shown; invoices reconcile totals and duplicates; price sheets apply or skip line by line. |
| 9 Midpoint — first real win, with a number | One source becomes a review with a visible line count and an illustrative subtotal that can be checked before confirmation. |
| 10 Bad Guys Close In — the edge cases, the doubts | A pack size changed, a row is unreadable, a supplier name does not match, or an older invoice arrives after a newer purchase. |
| 11 All Is Lost / Dark Night — the risk if nothing changes | Another stack of supplier paperwork becomes another week of stale costing. |
| 12 Finale + Final Image — life after | The source is filed, the reviewed facts are committed, and Sam returns to the quote knowing which price changed and why. |

### Step 4 — From Beats to Scenes (7 sections)

| § | Section | Beats it carries | Value turn (− → +) |
|---|---------|------------------|--------------------|
| 1 | Hero: source documents enter a guarded path | 1–2 | trapped paperwork → controlled intake |
| 2 | The paper pile | 3–4 | postponed work → visible cost of delay |
| 3 | Two document jobs, one review rule | 5–6 | distrust of extraction → staged evidence |
| 4 | Invoice import | 7–9 | unstructured bill → reconciled purchase review |
| 5 | Price-list import | 8–10 | supplier asking prices → deliberate row decisions |
| 6 | Review, recovery, and FAQ | 5, 10 | edge-case doubt → concrete recovery path |
| 7 | Closing commitment | 11–12 | stale prices → source-backed current costs |

### Step 5 — Character Voices

- **Reader's words for the problem:** “the new price list,” “the invoice,” “case price,” “pack size,” “what changed,” “does this total,” and “I still need to check it,” drawn from `src/lib/features.ts`, `docs/release-claim-ledger.md`, and CostCook's purchasing workflow descriptions.
- **Product voice:** calm, exact, kitchen-literate.
- **Banned words:** seamless, magical, effortless.

### Step 6 — Dialogue (McKee): the turn in each section

1. The paperwork owns the price → you can move it into a guarded path.
2. Delay feels harmless → one late price can reach a live quote.
3. Import feels like surrendering control → staging separates reading from writing.
4. An invoice is a pile of rows → it becomes a checkable purchase record.
5. A price list looks like an invoice → it becomes a set of offers you choose to apply or skip.
6. Exceptions make import unsafe → unreadable, unmatched, duplicate, and changed-pack cases remain visible and recoverable.
7. Current costing feels like maintenance → every accepted price carries its source into the next decision.

### Step 7 — Sorkin: headline / subhead

- **Intention:** Bring supplier prices into costing while they still matter.
- **Obstacle:** The documents arrive in several formats and extracted details cannot be trusted blindly.
- **Headline:** Bring in the paperwork. Keep the final say.
- **Subhead:** Send an invoice or supplier price list into one review queue. CostCook stages the lines, keeps the source beside them, and waits for you before anything becomes real.

### Step 8 — Cool Talk: the one snap line

> A price list is an offer. An invoice is what happened. CostCook keeps the difference.

### Step 9 — Bringing a Scene to Life

- **Where they are:** At the end of a receiving table with the supplier document beside a phone or laptop.
- **What they see / hear / feel:** A folded invoice, a photographed sheet, the cooler running, one pack size that looks wrong, and the relief of leaving that row unconfirmed.
- **Time of day:** Late afternoon, before the next quote is priced.

### Step 10 — Connecting Your Scenes

- **POV:** Second person (“you”) throughout.
- **Hand-off lines:**
  1. “The first useful step is not posting it. It is seeing what the source actually says.”
  2. “That is why reading and committing belong in different moments.”
  3. “The review rule stays the same; what the document means does not.”
  4. “An invoice records a purchase. A price list still asks for your decision.”
  5. “The awkward rows are where a trustworthy import proves itself.”
  6. “Once the exceptions are plain, the source can follow the price forward.”

### Step 11 — Revise and Finish

- **Word count before → after:** 2,460-word planning draft → target page under 1,050 words.
- **Claims removed because they could not be shown:** guaranteed OCR accuracy, instant or fully automatic posting, accounting export, automatic approvals, savings estimates, processing-time promises, mobile-app claims, and competitor performance comparisons.
- **Final Image (the CTA sentence):** Bring in the next supplier document with every line still under your eye.

## Source and revision notes

- CostCook product truth: `src/lib/features.ts` (`import`, `ledger`, and ingredient price provenance), `docs/release-claim-ledger.md` RC-26, RC-28, RC-38, and RC-39.
- Competitive IA research, used only to understand the category's common sequence: Meez separates invoice intake from downstream food-cost updates; MarginEdge separates submission, coding, approval, and reporting. CostCook's page uses its own shipped staging-and-confirmation model and does not borrow their claims.
- The hero is the caterer. CostCook enters only after the delayed-price wall is established.
- **Snap line:** “A price list is an offer. An invoice is what happened. CostCook keeps the difference.”


## Caterer first-visit revision · 2026-09-11

- [x] 1 Idea: A busy owner of a six-person catering kitchen wants to update prices from supplier paperwork, but retyping the invoice takes time and creates mistakes.
- [x] 2 Character: Wants a usable answer between services; needs a traceable result; remembers a costly spreadsheet mistake; habitually postpones setup.
- [x] 3 Plot: (1) interrupted service gap; (2) one dependable answer; (3) separate records; (4) retyping the invoice takes time and creates mistakes; (5) asks what to enter; (6) tries the relevant CostCook task; (7) hands the result to the crew; (8) follows the worked example; (9) checks its labelled numbers; (10) reads missing-data and release limits; (11) sees the cost of guessing; (12) chooses a trial or booked demo.
- [x] 4 Scenes: hero, daily problem, task navigation, worked example, exceptions, detailed questions, next step. Turns: uncertainty to purpose; familiarity to need; confusion to action; doubt to evidence; risk to limits; questions to answers; hesitation to informed choice. Existing route and layout retained.
- [x] 5 Voices: Reader asks “What do I enter?” and “Can my kitchen use this today?” (persona prompts, not customer quotes). Product is calm, concrete and kitchen-literate; ban seamless, powerful and robust.
- [x] 6 Dialogue: Each scene answers the next practical question instead of explaining internal architecture.
- [x] 7 Intention/obstacle: update prices from supplier paperwork / retyping the invoice takes time and creates mistakes. Headline: “Upload paperwork. Check prices before saving.” Supporting line: “Upload an invoice or price list as a photo, PDF or spreadsheet. Check the items, pack sizes and prices against the original before you save any changes.”
- [x] 8 Snap: “A price list is an offer. An invoice is what happened.” Retain this concrete detail; cut competing abstract slogans.
- [x] 9 Setting: Phone beside the prep bench, a short gap between services, crew waiting for the next list.
- [x] 10 Connection: You throughout; inputs lead to results, results to limits, limits to the trial decision. Shared terms keep the next action consistent.
- [x] 11 Revision: Build and claim checks passed; every feature route inspected at desktop and mobile, with native disclosures and no JavaScript. Five-width regression checks and 320px/200% text passed. Report: `docs/qa/features-caterer-2026-09-11/report.md`.

### Revision 2026-10-07: chef audit of the feature and resource routes
- Dropped "Trust is earned at the edge cases." from the exceptions band; the sentence after it carries the point.

### Revision 2026-10-07: chef voice pass
Owner: make the site read like a chef wrote it. Copy only.
- **Slogans and consultant words out:** "Upload, review and save." is "Nothing
  lands in your catalog until you check it."; "Reconcile before posting." is
  "Add it up before you save."; "Map the sheet you received." is "Tell it
  which column is which."; "Refuse the quiet pack change." is "No sneaky pack
  changes."; "workspace", "purchase ledger", "structurally changed",
  "ambiguity" are gone.
- **The price-list section heading** is "Take the prices you want off the
  list.", so the pinned snap line ("A price list is an offer. An invoice is
  what happened.") is no longer said twice in a row.
- **Kept:** the H1, the snap line, the closing heading, the FAQ (all pinned),
  every illustrative figcaption, the capability list, and the boundaries:
  nothing reaches the catalog before review, a pack change stops the row,
  an older invoice does not overwrite a newer price, confirmed supplier names
  "can be remembered" (not "learns").

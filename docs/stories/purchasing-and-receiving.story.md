# Story Tracker — Purchasing & Receiving

## My story

- **Piece:** Feature explainer
- **Title / headline:** The order you sent should meet the delivery at the back door.
- **My hero's name:** Elena, a chef-owner receiving tomorrow's food while today's prep is moving
- **Content file(s):** `src/pages/features/purchasing-and-receiving.astro`, `src/components/sections/PurchasingReceivingFeature.astro`

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

> A chef-owner who wants to turn an approved event need into the right supplier order and trusted purchase facts, but the delivery at the back door does not always match what was sent.

### Step 2 — Your Character

- **Want (surface):** Get tomorrow's food through the door, checked, and into prep without retyping the order.
- **Need (real):** Keep one inspectable chain from the supplier message to what arrived, what still needs buying, and which price becomes current.
- **Wound (the bad day):** Ten cases were ordered, nine arrived, and the shortage surfaced only when prep opened the walk-in.
- **Flaw (the habit):** She treats the delivery slip, a marked-up printout, and the price in her head as three versions of the same record.

### Step 3 — The Plot (12 beats)

| Beat | In this piece |
|------|---------------|
| 1 Opening Image — life before | Elena stands at the back door with a wet delivery slip while prep calls for the missing case. |
| 2 Theme Stated — the truth they'll learn | The order sent and the delivery received should meet in one record. |
| 3 Set-Up — the daily grind, the flaw on display | Supplier emails, printed POs, and handwritten checks drift apart. |
| 4 Catalyst — the bad day / the wall hits | A ten-case line arrives as nine, but the clean order quantity survives longer than the shortage. |
| 5 Debate — “can it be different?” | She needs exceptions to stay visible without slowing every ordinary delivery. |
| 6 Break into Two — they try the new way | CostCook creates one PO per supplier and shows the exact email before it is sent. |
| 7 B Story — the person/relationship it's really about | Prep gets the food that was promised because receiving can name the gap while there is still time to act. |
| 8 Fun and Games — the promise of the premise | The sent PO becomes a receiving checklist; short, over, substituted, missing, and unexpected lines keep distinct handling. |
| 9 Midpoint — first real win, with a number | An illustrative 10-case order records 9 received at $47 per case, posts $423, and leaves 1 case on the follow-up list. |
| 10 Bad Guys Close In — the edge cases, the doubts | A failed send can retry; a substituted line and an unexpected line wait for an explicit receiving decision. |
| 11 All Is Lost / Dark Night — the risk if nothing changes | If the clean order overwrites the messy delivery, the shortage and the actual price both disappear. |
| 12 Finale + Final Image — life after; the CTA in their words | The delivery is posted from what arrived, the rebuy gap remains visible, and Elena walks back into prep with one record. |

### Step 4 — From Beats to Scenes (7 sections)

| § | Section | Beats it carries | Value turn (− → +) |
|---|---------|------------------|--------------------|
| 1 | Hero: the back-door handoff | 1–2 | split records → one chain |
| 2 | What was sent | 3, 5–6 | assumed message → reviewed commitment |
| 3 | Receiving starts from the PO | 7–8 | second round of typing → inherited checklist |
| 4 | The nine-of-ten delivery | 4, 9 | clean quantity and quoted price → truthful quantity and received price |
| 5 | Post what arrived | 8–10 | reviewed delivery → reconciled purchase and current-price facts |
| 6 | Exceptions keep a next action | 10–11 | loose ends → retry or rebuy path |
| 7 | Closing handoff | 12 | back-door uncertainty → prep-ready record |

### Step 5 — Character Voices

- **Reader's words for the problem:** “what I sent,” “what came through the door,” “short a case,” “subbed,” “still need to buy,” “delivery slip.” Source: `src/lib/features.ts`, PRODUCT.md, and the established “day itself” route language.
- **Product voice:** calm, exact, kitchen-literate.
- **Banned words:** seamless, powerful, effortless.

### Step 6 — Dialogue (McKee): the turn in each section

- Hero: another delivery to reconcile → the sent and received records can meet.
- What was sent: trust an email from memory → review the exact supplier message and stable PO.
- Receiving starts: build a second checklist → receive from the sent PO.
- Nine of ten: a tidy order masks the gap and price change → the short line and received price stay visible.
- Post what arrived: the received price is still a loose fact → 9 cases at $47 reconcile to a $423 purchase.
- Exceptions: a failed send or missing case becomes a side note → each keeps a retry or follow-up state.
- Closing: carry uncertainty into prep → return with a posted delivery and visible rebuy gap.

### Step 7 — Sorkin: headline / subhead

- **Intention:** Move the right food from approved need to supplier to prep.
- **Obstacle:** What arrives can differ from what was ordered, and retyping hides the difference.
- **Headline:** The order you sent should meet the delivery at the back door.
- **Subhead:** Review one purchase order per supplier, receive against the same lines, and post the quantity and price that actually arrived.

### Step 8 — Cool Talk: the one snap line

> Ten cases ordered. Nine at the back door is not ten in the walk-in.

### Step 9 — Bringing a Scene to Life

- **Where they are:** At the receiving door between a hand truck and the walk-in.
- **What they see / hear / feel:** A wet delivery slip, a driver waiting for a signature, and prep calling for the first case.
- **Time of day:** Early morning, before the production day settles.

### Step 10 — Connecting Your Scenes

- **POV:** Second person (“you”) throughout.
- **Hand-off lines:**
  - Hero → sent: “Start with the promise the supplier actually received.”
  - Sent → checklist: “Once it is sent, those same lines are ready at the door.”
  - Checklist → variance: “Then quantity and price change from ordered to arrived.”
  - Variance → posting: “Those differences belong in the purchase record, not in the margin.”
  - Posting → recovery: “And anything still open keeps its next action.”
  - Recovery → close: “So prep gets the truth, not the tidy version.”

### Step 11 — Revise and Finish

- **Word count before → after:** 720 → target under 430 visible words.
- **Claims removed because they couldn't be shown:** guaranteed supplier delivery accuracy, automatic ordering without review, savings or time claims, and automatic acceptance of substitutions.
- **Illustrative-data rule:** Every quantity, case price, and delivery variance used in the page evidence is labeled illustrative.
- **Revision target (2026-08-29):** The receiving scene now shows the ordered-to-received case price before the posted total, distinguishes the sent PO from the received-short outcome, and presents handoff choices as static example rows rather than live controls.
- **Progressive-disclosure rule:** The nine-item shipped catalogue stays available but closed until the reader asks for the full list.
- **Final Image (the CTA sentence):** Walk back into prep knowing what arrived, what it cost, and what still needs buying.

## Revision — send-failure lifecycle (2026-08-30)

All eleven steps remain complete. The send scene now follows the shipped lifecycle precisely: the purchase-order record is created in a queued state before email is attempted; a delivery failure is written to that same record and remains safe to retry. The scene still turns uncertainty into a concrete recovery action, and the established snap line and final image remain unchanged.


## Caterer first-visit revision · 2026-09-11

- [x] 1 Idea: A busy owner of a six-person catering kitchen wants to record a delivery accurately, but the supplier delivered less than was ordered.
- [x] 2 Character: Wants a usable answer between services; needs a traceable result; remembers a costly spreadsheet mistake; habitually postpones setup.
- [x] 3 Plot: (1) interrupted service gap; (2) one dependable answer; (3) separate records; (4) the supplier delivered less than was ordered; (5) asks what to enter; (6) tries the relevant CostCook task; (7) hands the result to the crew; (8) follows the worked example; (9) checks its labelled numbers; (10) reads missing-data and release limits; (11) sees the cost of guessing; (12) chooses a trial or booked demo.
- [x] 4 Scenes: hero, daily problem, task navigation, worked example, exceptions, detailed questions, next step. Turns: uncertainty to purpose; familiarity to need; confusion to action; doubt to evidence; risk to limits; questions to answers; hesitation to informed choice. Existing route and layout retained.
- [x] 5 Voices: Reader asks “What do I enter?” and “Can my kitchen use this today?” (persona prompts, not customer quotes). Product is calm, concrete and kitchen-literate; ban seamless, powerful and robust.
- [x] 6 Dialogue: Each scene answers the next practical question instead of explaining internal architecture.
- [x] 7 Intention/obstacle: record a delivery accurately / the supplier delivered less than was ordered. Headline: “Check the delivery against the order you sent.” Supporting line: “Review a purchase order for each supplier. When it arrives, record the quantities and prices you received, then save the delivery. Shortages stay visible for follow-up.”
- [x] 8 Snap: “Ten cases ordered. Nine at the back door is not ten in the walk-in.” Retain this concrete detail; cut competing abstract slogans.
- [x] 9 Setting: Phone beside the prep bench, a short gap between services, crew waiting for the next list.
- [x] 10 Connection: You throughout; inputs lead to results, results to limits, limits to the trial decision. Shared terms keep the next action consistent.
- [x] 11 Revision: Build and claim checks passed; every feature route inspected at desktop and mobile, with native disclosures and no JavaScript. Five-width regression checks and 320px/200% text passed. Report: `docs/qa/features-caterer-2026-09-11/report.md`.

### Revision 2026-10-07: chef audit, numbers and US units
- Illustrative frames rewritten in US units (lb, qt, gal, Aug 28) with arithmetic that reconciles on the page: see the commit "fix(features): receiving, order, ingredients and recipes add up".


## Revision 2026-10-07 (chef review of the sub-routes)
- One Northline chicken price on every guide: ordered at $42.10 (the Aug 14 price), received at $46.80. PO-1048 is $643.20 (9 × $46.80 + 4 × $18 + 2 × $75).

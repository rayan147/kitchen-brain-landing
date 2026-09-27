# Story Tracker — CostCook comparison

## My story

- **Piece:** Comparison landing page
- **Title / headline:** Compare the work, not just the feature list.
- **My hero's name:** The owner-operator choosing software for one catering kitchen
- **Content file(s):** `src/pages/compare.astro`, `src/lib/comparison.ts`

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
| 11 | Revise and Finish | Cut, sharpen, make the ending land. Done! | ☑ |

---

### Step 1 — The Idea

> An owner-operator who wants to choose software around the work their catering kitchen actually does, but tier names and long feature lists hide the real tradeoff.

### Step 2 — Your Character

- **Want (surface):** Pick the right kitchen system without sitting through three sales calls.
- **Need (real):** Know which daily work will stay connected and which requirements mean CostCook is the wrong fit.
- **Wound (the bad day):** A quote, order, or delivery went wrong because a missing price or changed guest count was smoothed over instead of surfaced.
- **Flaw (the habit):** Comparing the length of feature lists instead of the work that must hold together.

### Step 3 — The Plot (12 beats)

| Beat | In this piece |
|------|---------------|
| 1 Opening Image — life before | You are scanning tier names and checkmarks while the next menu still needs costing. |
| 2 Theme Stated — the truth they'll learn | Compare the work, not just the feature list. |
| 3 Set-Up — the daily grind, the flaw on display | Guest counts change; prep, purchasing, receiving, inventory, and food cost still have to agree. |
| 4 Catalyst — the bad day / the wall hits | One missing price can make a plate cost wrong by the price of the beef. |
| 5 Debate — "can it be different?" | Is a lower monthly price useful if the required work sits in another tier—or is not a CostCook fit at all? |
| 6 Break into Two — they try the new way | Read one dated board that separates shipped, coming, no, and not listed. |
| 7 B Story — the person/relationship it's really about | The owner needs a number they can give a customer and a plan the crew can use. |
| 8 Fun and Games — the promise of the premise | Compare five kitchen jobs row by row, on one monthly billing basis. |
| 9 Midpoint — first real win, with a number | CostCook is one $49/month plan; Parsley's cited tiers run $129–$379 and meez's $24–$199. |
| 10 Bad Guys Close In — the edge cases, the doubts | Requirements still make CostCook the wrong fit, role boundaries are not a permission grid, and competitor pages can change. |
| 11 All Is Lost / Dark Night — the risk if nothing changes | Choosing from checkmarks alone leaves the hard gap to appear during a real event. |
| 12 Finale + Final Image — life after; the CTA in their words | Bring the next real menu and leave with an answer. |

### Step 4 — From Beats to Scenes (7 sections)

| § | Section | Beats it carries | Value turn (− → +) |
|---|---------|------------------|--------------------|
| 1 | Hero | 1–4 | checklist fog → a practical decision rule |
| 2 | Fit before features | 5–7 | vague comparison → explicit fit and limits |
| 3 | Monthly price | 8–9 | mismatched tiers → one billing basis |
| 4 | Reading key and evidence | 6, 10 | marketing suspicion → bounded claims |
| 5 | Five work areas | 8–10 | scattered features → task-by-task evidence |
| 6 | Four operating rules | 7, 10–11 | feature count → trust in edge cases |
| 7 | Closing decision | 12 | uncertainty → test one real menu |

### Step 5 — Character Voices

- **Reader's words for the problem:** “What does the plan actually include?”, “Will this cover prep and ordering?”, “What happens when a price is missing?”, “Is this built for one kitchen like mine?”
- **Product voice:** competent, candid, unfussy.
- **Banned words:** seamless, powerful, effortless.

### Step 6 — Dialogue (McKee): the turn in each section

- Hero: feature-list comparison → work-based comparison.
- Fit: “Maybe it covers us” → “I can name the fit and the limits.”
- Price: headline price → monthly tier required for each row.
- Key: skeptical → able to read every cell literally.
- Areas: broad promise → evidence by kitchen job.
- Rules: more features → safer operational behavior.
- Close: still browsing → ready to test a real menu.

### Step 7 — Sorkin: headline / subhead

- **Intention:** Choose the tool around the work the kitchen cannot drop.
- **Obstacle:** Long feature lists and tier labels obscure what ships and at what price.
- **Headline:** Compare the work, not just the feature list.
- **Subhead:** You are choosing what your kitchen can rely on when the guest count changes, the order goes out, and the delivery reaches the back door.

### Step 8 — Cool Talk: the one snap line

> A missing price stops the costing. It never quietly becomes zero.

### Step 9 — Bringing a Scene to Life

- **Where they are:** At the back door with the delivery open and the purchase order in hand.
- **What they see / hear / feel:** A substituted case, a short count, and the pressure to keep prep moving without losing the true price.
- **Time of day:** Early morning, before the first event leaves.

### Step 10 — Connecting Your Scenes

- **POV:** Second person (“you”) throughout.
- **Hand-offs:** Work—not checkmarks—sets the decision → name the fit before comparing price → compare price on one basis → read each cell literally → test the five jobs → inspect the rules at the edges → bring one real menu.

### Step 11 — Revise and Finish

- **Word count before → after:** Hero paragraphs, 79 → 52 words; the fit decision moved into its own scannable frame and the exhaustive evidence stayed intact.
- **Claims removed because they couldn't be shown:** “the whole board”; “the rows neither of them has”; full tiered access. The team section separates shipped role-aware boundaries from the missing fine-grained permission grid.
- **Final Image:** Bring the next menu you need to cost and leave with an answer.
- **2026-08-30 status revision:** Owner confirmation moved buying-to-par, dietary characteristics and Spanish from No to Coming. Kitchen label printing was already Coming. All four remain outside today’s app and carry no promised date; the detailed rows now read from `src/lib/coming-plans.ts` or the label release status.
- **2026-08-30 competitor evidence refresh:** All eleven steps remain complete. The dated board now reflects the current official pricing pages: Parsley lists label printing as a $59/month add-on; meez lists view/editor/manager access, location-level access with additional recipe-viewer locations at $60/month/location, and Restaurant365 sync at $199/month plus a setup fee. These cells report only what those pages list on the verification date. The headline, snap line, and final image remain unchanged.
- **2026-09-05 spreadsheet column (RC-57):** All eleven steps remain complete. The board now shows the option most readers are actually using, which it never had: a fourth column headed **A spreadsheet**. It is not a fourth product, and the story reason and the honesty reason are the same one. Step 2's hero is the owner-caterer whose costing lives in a sheet that was right the day she made it, and until now the page compared her against two things she was not using while staying silent about the one she was. Step 6: the column turns the same value the homepage turns, unnamed cost − → named cost +, by reporting her labor rather than the tool's ability. Two cells, closed: *You build it* and *You key it in*. Step 11 refused a third meaning *a spreadsheet is not able to do this*, because a sheet can send mail, hold permissions and expose an API, and the refusal is the same one made on the homepage a day earlier. Where the sheet lands softly the row concedes it, and on the three rows CostCook marks **No** the spreadsheet cell says plainly that the sheet is the better answer, so the column is a description of work rather than a scoreboard. The headline, the snap line (*"A missing price stops the costing. It never quietly becomes zero."*) and the final image are unchanged; the page keeps its one primary and its one quiet secondary.


## Caterer first-visit revision · 2026-09-11

Content: `src/pages/compare.astro` and its shared data/response states.

- [x] 1 — Idea: A busy caterer wants to compare the work and monthly bill, but unexplained labels and unavailable features obscure the choice.
- [x] 2 — Character: Runs six people; spreadsheet competent, nontechnical, between services. Wants a quick decision; needs checkable inputs, limits and next action; remembers abandoned software setup; assumes unfamiliar words mean more work.
- [x] 3 — Twelve beats: Interrupted service → clear next decision → existing spreadsheet work → unclear promise → time/card doubt → open the relevant CostCook guide → crew needs a usable plan → inspect the example → understand one concrete outcome → check missing data and limits → avoid another unexplained commitment → choose a guide, trial or human answer knowingly.
- [x] 4 — Six scenes: Entry (uncertain → oriented); prerequisites (unknown → prepared); example (claim → evidence); consequences (guess → known); limits/recovery (risk → choice); next action (pause → decision). These map to existing sections and response states, without adding narrative scaffolding.
- [x] 5 — Voices: Persona questions are simulated, not interview quotes. Reader: “What do I need?”, “Does this include my crew?”, “Did it send?” Product: calm, concrete, kitchen-literate; ban seeded, mechanism, release flag from explanatory copy.
- [x] 6 — Dialogue: Each scene answers the question raised by the last; retain numbers and limits that change the decision, remove editorial commentary.
- [x] 7 — Intention/obstacle: Help her compare the work and monthly bill; explain the work required before asking her to act.
- [x] 8 — Snap: “A missing price stops the costing.”
- [x] 9 — Scene: Phone beside the prep list, crew waiting for the next service; attention is limited, not competence.
- [x] 10 — Connection: Reader-focused guide prose; founder voice explicitly identifies Rayan where he answers. Entry → evidence → constraints → action.
- [x] 11 — Revision: Rendered copy, units, navigation and recovery verified. Build and claim checks pass; eight routes at five widths, 200% text, thirteen tour stops, no-JS fallback and mocked contact failure/retry/success pass. Evidence: `docs/qa/resources-caterer-2026-09-11/report.md`.

## Claim correction · 2026-09-27 (allergen count)

- [x] 11 Revision: "Fourteen allergens" was false; the app tags the fixed US nine (milk, egg, fish, crustacean shellfish, tree nuts, peanuts, wheat, soy, sesame; kitchen-brain drizzle/0034_dizzy_klaw.sql). The count word is now computed from `allergenNames` in `src/lib/dietary.ts`. Beats, scenes, point of view and snap line unchanged; only the number moved. Gap report S3.

## Claim correction · 2026-09-27 (margin wording)

- [x] 11 Revision: The app does show "Gross margin" on event totals and recipe pricing, so "it is never called margin" was false. The true boundary stays: food cost is food only, and the gross margin the app shows is food-only, not business margin after labor and overhead. Gap report S4, W4.

## Claim correction · 2026-09-27 (buying to par shipped)

- [x] 11 Revision: Buying to par left the Coming list by shipping. Inventory > Build shopping list builds what to buy for confirmed events and your par, by supplier (kitchen-brain e2e/buy-to-par.spec.ts). The Coming band now carries two plans, the /compare row is Yes, and the inventory answers say so. Beats and snap line unchanged. Gap report F1; RC-43.

## Claim correction · 2026-09-27 (kitchen labels available)

- [x] 11 Revision: The owner approved the RC-35 labels launch decision on 2026-09-27 and LABELS_STATUS is now yes. Kitchen date labels print from Prep and Pack through the browser; label stock is set once in Settings > Labels. The premise that the whole feature sat behind the label_printing flag was false (gap report F2). Every Coming sentence about kitchen labels is gone; the browser-only, never-guessed-date and blank-allergen boundaries stay. Beats and point of view unchanged; the labels page hero now states availability instead of a preview.

## Claim correction · 2026-09-27 (what Staff can open)

- [x] 11 Revision: "All can open cost screens" and "everyone can open the costs" overstated it. Staff can open recipe costs and Analytics, but Today leaves out order money and client names for Staff, the calendar leaves money out for Staff, and Clients is for owners and managers (kitchen-brain today-work.ts:34-40, calendar/+page.server.ts:31). The no-per-screen-control boundary and the pinned "No." answers stand. Gap report S7.

### Revision 2026-09-27 (Sage row)
- The Sage row's note said Sage "can prepare a shopping-list draft", one of
  the three it ships. It now reads: "Sage is available now. It reads your
  records with twenty-two read-only tools, shows its sources, helps during
  setup and can prepare three kinds of draft for a manager or owner to
  approve: the kitchen shopping list, one order’s shopping list, and a
  guest-count change on a draft order." The counts and kinds are spelled
  from `src/lib/sage.ts` (RC-49), not typed.
- The events rows read the deposit list and the acceptance boundary from
  `src/lib/events.ts`; the proposals note now ends "Their yes is not a
  signature or a booking. Confirm order is." (full stop, not a semicolon).

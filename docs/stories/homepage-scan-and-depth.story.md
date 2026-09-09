# Story Tracker — the homepage's scan path and its depth

**Slug** `homepage-scan-and-depth`
**Produced** 2026-09-09
**Covers** two eyebrow labels (`src/lib/stops.ts`, `TheYield.astro`, `PaperIn.astro`),
the two folded-evidence controls (`FoldedDetail.astro` in `NutritionFacts.astro`
and `Sage.astro`), and the responsive work those measurements paid for
(`global.css` `.split-layout`, `SeeItRun.astro`'s fold threshold).
**Related** [[homepage-copy-density]] — same week, opposite lever. That pass cut
words. This one found that words were never the reason the page is long.

---

## Step 1 — The Idea

**WHO** An owner-operator caterer, phone in one hand, arriving from a cold text
and giving this page about a minute. **WANT** To know whether a 15-minute demo is
worth her time. **WALL** She reads headings, not paragraphs, and two of the page's
headings tell her where she is in someone else's argument rather than what the
stop is about; then the stop she does care about makes her scroll past its own
working to reach the next claim.

## Step 2 — Your Character

- **Want** A straight answer about whether this handles her week.
- **Need** To trust the thing before she spends a shift on it.
- **Wound** Big-platform funnels that read well and did not survive the trial.
- **Flaw** She skims when she is suspicious, which is exactly when skimming
  costs her the most. A page that punishes skimming loses her at stop five.

Every decision below traces to the flaw: **she is going to scan, so the scan has
to carry the argument.**

## Step 3 — The Plot (12 beats, against the page as shipped)

| Beat | On the page |
|---|---|
| Opening Image | The fold: cost it, buy it, prep it, pack it, and a real pricing panel. |
| Theme Stated | "Enter the numbers once." |
| Set-Up | The film. Proof before argument, by the 2026-09-06 owner decision. |
| Catalyst | "The spreadsheet works until the job changes." |
| Debate | Four moments, then the quiet one: a sheet totals what is in it. |
| Break into Two | "What it does instead: keeps one order moving." |
| B Story | Trim and yield — the case has the skins on it. |
| Fun and Games | Nutrition, invoices and price lists, Sage, roles. |
| Midpoint | **Where the scan used to break.** Two eyebrows stopped naming subjects. |
| Bad Guys Close In | The other tools; what is not built yet. |
| Dark Night | Twelve stops, 33 phone viewports, one minute of attention. |
| Final Image | Put one real order through it. |

The story did not change in this pass. Beat 9 is where it was failing to be
*read*, and beat 11 is the structural finding.

## Step 4 — From Beats to Scenes

No scene was added, removed or resequenced. This pass changed two scene **titles**
and moved two blocks of **working** behind a control on small screens. The scene
list is `src/lib/stops.ts` and it is unchanged in order and length.

## Step 5 — Character Voices

Her words, taken from the app's own vocabulary and the section's subject:
"trim and yield", "invoices and price lists". Not ours: "the hard part",
"before any of that" — both were the writer's sense of the argument's shape,
which she has no access to on a first read.

The two fold controls speak in her register and make no claim of their own:
"How the fifteen numbers are arrived at", "The nine rules, in full". A control
that argued would be a claim she cannot see, which principle 3 forbids.

## Step 6 — Writing Dialogue (McKee)

Each fold was tested by asking what value the block turns. `#nutrition`'s five
evidence steps turn *plausible → traceable*; the h2 and the printed label above
them already turn *unknown → plausible*, and they stay on screen. `#sage`'s nine
rules turn *trust me → check me*; the h3 that promises it ("Useful because the
boundaries are visible") stays on screen, so the turn is still offered.

**The rule this pass followed:** the claim never folds, only the working. A fold
whose summary is the only place a promise appears is a hidden claim, not a
disclosure.

## Step 7 — Sorkin Dialogue

"Trim and yield" pushes against the reader's assumption that a case price is the
price. "Invoices and price lists" pushes against the idea that any of this works
without somebody typing the week's costs in. Both eyebrows now want something.

## Step 8 — Cool Talk (the snap line)

The page's snap line is unchanged and is not in this pass's copy. The finding
behind the pass has its own, for the record and not for the page:

> **The tablet was taller than the desktop, and 37 pixels chose that.**

## Step 9 — Bringing a Scene to Life

The room this was measured in: 390x844, one thumb, mid-shift. Also 834x1112,
which is the same reader sitting down — and which until this pass shipped the
demo guide open, at 5,319px of demo section, while a 768px tablet folded it and
ran 1,249px. Same posture, same device class, four times the scroll, decided by
the two pixels between 832 and 834.

## Step 10 — Connecting Your Scenes

Point of view is second person throughout, unchanged. The hand-off lines are
still derived from `stops.ts`, so both renamed stops carried their new words into
the "Next ·" line above them without either label being typed twice.

## Step 11 — Revise and Finish

**Measured, homepage, before → after:**

| Viewport | Before | After | Change |
|---|---|---|---|
| 1440x900 | 21,487 | 21,487 | unchanged (folds are inert at this width) |
| 1280x800 | 21,316 | 21,316 | unchanged |
| 1024x768 | 23,628 | 21,052 | **−2,576** |
| 834x1112 | 25,716 | 22,597 | **−3,119** |
| 768x1024 | 23,885 | 22,689 | −1,196 |
| 390x844 | 27,979 | 26,260 | −1,719 |

**What was cut:** nothing. No claim left the page. Both folded blocks ship open
in the served HTML and close by script under 64rem, so a no-JS reader sees all of
it and every `data-*` hook `scripts/check-dist.mjs` reads is still in
`dist/index.html`.

**What this pass deliberately did NOT do.** The page is still 31 phone viewports
against a stated job of "decide in under a minute". Two thirds of that height is
not text: at the marginal rate the copy pass actually delivered, 3.41px per word,
every word on the page accounts for ~10,100px of 26,260. The rest is twelve
stops' worth of headings, figures, cards, rules and padding. Getting under about
20 viewports means **fewer stops**, and the four candidates
(`#nutrition`, `#intake`, `#sage`, `#access`) are each pinned by a documented
build contract asserting the homepage carries that proof. Retiring four contracts
to make the page shorter is a decision about what the homepage promises, not
about its length, and it is not a density pass's to make. The arithmetic is in
the reply that raised it; the decision is the owner's.

---

**Snap line called out:** the page's own snap line is untouched. This pass's
line lives in this tracker only: *the tablet was taller than the desktop, and 37
pixels chose that.*

# Making the spreadsheet pain explicit on the homepage

Owner request, 2026-09-05: *"we need to add to the main landing page the pain to
work with excel more clearly and how costcook fixes them."*

## What the page says today

`TheProblem` (second stop) carries the strongest sheet line on the site in its
heading, **"The spreadsheet works until the job changes."** Everything under it
then goes tool-agnostic. The four moments a reader's eye actually lands on
(right column, ticket stack) never mention a sheet:

| # | Title | Body names the sheet? |
|---|---|---|
| 1 | You quote from an old price | no |
| 2 | You rebuild the same order four times | no |
| 3 | You retype the list to buy it | no |
| 4 | You learn the margin after service | no |

`CustomerOutcomes` (fifth stop) answers those four one for one. Its four
`from` labels are the "before" side of each handoff and they are tool-agnostic
too: *An old supplier price · Four rebuilt lists · A list copied into emails ·
An invoice filed after service*.

So the diagnosis is already correct and already about spreadsheets. It is just
not **specific**, and the specificity that exists is buried in body prose
(*"every job starts as the last job's sheet, saved under a new name"*) instead
of sitting in the tickets.

## Decision: sharpen in place, do not add a section

`src/pages/index.astro` records a measurement that binds this:

> If CustomerOutcomes is ever rewritten so its answers stop mirroring
> TheProblem's pains one for one, this trade is void and the order is worth
> re-measuring.

The section order was settled by a measured trade (0.72 viewports of recall
distance spent to move the proof video 1.5 viewports up the page). A new
fifteenth stop for "the spreadsheet" costs depth that measurement already spent
and breaks the 4:4 pairing that makes it valid.

So the edit surface is exactly two components and their copy:

1. `TheProblem.astro` — the lede and the four `moments`.
2. `CustomerOutcomes.astro` — the four `from` labels and the section lede.

No new section, no reordering, no new capability claim about the app. The fix
half of the request is delivered by making the "before" side of the four
existing handoffs name the sheet artifact, so each one reads sheet -> app.

## Decision: describe the reader's sheet, never the tool's limits

Two traps, and they are different.

**Accuracy.** "A spreadsheet cannot re-cost your recipes" is false. Anyone can
write a lookup against a price tab. What is true is that *the copy you quoted
from* holds the old number and that *you* retype. Every sharpened line therefore
describes what the reader does by hand, not what the software is incapable of.
This is already the section's voice: *"That is the right move with the tools
most kitchens have."*

**Scope.** RC-40 confines named products to `/compare`, where a cell may report
only what that company's own pricing page listed on a stated date. RC-47 repeats
it for the homepage: no sentence may state what another product cannot do. A
spreadsheet suite is a named product with a pricing page. The copy therefore
uses the generic noun the page already uses (*the spreadsheet*, *the sheet*,
*the copy*, *the tab*) and names no brand. A guard is added so it stays that way.

## The copy

### TheProblem, lede

> Most kitchens cost on a spreadsheet, and it holds until something moves. A
> supplier price changes. The client adds forty guests. A case arrives short.
> Each one is a number somebody has to find and change by hand, in every copy
> of the sheet that still has the old one.

### TheProblem, four moments

1. **You quote from an old price**
   The vendor moved the case price and you changed it where you saw it. The
   sheet you quoted this job from is a copy of last month's, and it still holds
   the old one.
2. **You rebuild the same order four times**
   Forty more guests, and the same number has to change in the recipe math, the
   shopping list, the prep plan and the pack check. Four edits, and the one you
   miss turns up at the dock.
3. **You retype the list to buy it**
   You copy the rows out by hand: one message per supplier, then a checklist at
   the dock, then whatever the truck was short, typed back in.
4. **You learn the margin after service**
   The invoices arrive after the event and go in a folder, not in the sheet you
   quoted from. Weeks later, if you go and check, they decide whether the price
   worked.

The existing FLAW paragraph and the twelve-years provenance paragraph stay
exactly as they are. They are dated, load-bearing, and already carry the
sharpest sheet sentence on the page.

### CustomerOutcomes, four `from` labels

| Stage | Before (was) | Before (now) |
|---|---|---|
| Quote | An old supplier price | A price the copy never got |
| Plan | Four rebuilt lists | One number, four tabs |
| Buy | A list copied into emails | Rows retyped into emails |
| Cost again | An invoice filed after service | An invoice in a folder, not the sheet |

`to` labels are unchanged. The section lede gains one clause naming what
replaces the folder of sheets.

## Snap line

The homepage keeps its one established snap line, **"Charge at least $89.78 per
guest to meet the 30% target"**, in the hero crop. Nothing here competes: every
new line is a description of the reader's week, and none carries a number.

## Ledger and guard

**RC-56, new.** The homepage may describe spreadsheet work as the reader's own
manual work. Evidence class: release owner's twelve years in professional
kitchens, the same class that already backs the four moments (*"Those four are
my own week, not a survey"*), sitting under RC-40 and RC-47 for scope.
Conditions: no sentence states an incapability of a spreadsheet; no brand is
named; every claim is about what the reader retypes, copies or misses.

**`check-landing-claims.mjs`:**
- RC loop bound 55 -> 56.
- Pin the heading and all four moment titles in `TheProblem`.
- Pin all four `from` labels in `CustomerOutcomes`, so the mirror cannot drift
  back to tool-agnostic wording silently.
- Forbid an incapability verdict: a sheet noun within a short span of
  cannot/can't/is unable/will never/fails to.
- Forbid a named spreadsheet product anywhere in public copy (RC-40 scope).

**`check-dist.mjs`:** the same two lists, read off the emitted homepage HTML.
The source pins prove the strings are written; only a `dist` read proves they
render, and the source-side regex would be poisoned by a stray `title:` key
elsewhere in the module. Every other homepage section already has a `check-dist`
contract; `problem` and `outcomes` did not.

Every new pattern and both contracts get a mutation test before the work is
called done.

## Story tracker

`docs/stories/homepage-spreadsheet-pain.story.md`, a new thread rather than a
revision of `homepage-visual-guidance.story.md`, matching the repo's
one-tracker-per-change-thread precedent. A second `<!-- story: -->` pointer goes
into both components beside the existing one.

## Verification

1. `npm run check` (astro check + claim guard).
2. Mutation-test both new guard patterns: an incapability sentence and a brand
   name each fail, then revert.
3. `npm run build` (19 page contracts).
4. `npm run verify:homepage` at 1440x900 and 390x844, keyboard, 200% text,
   reduced motion, no-JavaScript.
5. Read the two sections in the browser at both widths and confirm the ticket
   stack still fits its column with the longer bodies.

Out of scope, both already reported: the two pre-existing `verify-faq` failures
on `develop`, and the `/_vercel/insights/script.js` 404 in production.

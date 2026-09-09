# Story Tracker — four stops become one

**Slug** `homepage-stop-merge`
**Produced** 2026-09-09
**Covers** `src/components/sections/WhatElse.astro` and the four blocks in
`src/components/more/`. Retires `NutritionFacts.astro`, `PaperIn.astro`,
`Sage.astro` and `TeamAccess.astro` as sections; every word they carried is in
the blocks.
**Related** [[homepage-scan-and-depth]] (the measurement this acts on),
[[homepage-copy-density]] (the pass that proved words were not the lever),
[[nutrition-facts]], [[homepage-paper-in-visual]], [[homepage-sage-redesign]],
[[team-and-access]].

---

## Step 1 — The Idea

**WHO** An owner-operator caterer, mid-shift, on a phone, arrived from a cold
text. **WANT** To decide in about a minute whether a 15-minute demo is worth her
time. **WALL** The page had twelve stops and thirty-one phone screens, and four
of those stops in a row each opened with the same ceremony: an eyebrow, a
heading, a lede, a figure, a hand-off line. By stop nine she is not reading an
argument, she is being introduced to a product for the fourth time.

## Step 2 — Your Character

- **Want** A straight answer.
- **Need** To trust it before she spends a shift on it.
- **Wound** Funnels that read well and did not survive the trial.
- **Flaw** She skims when she is suspicious. Four ceremonial openings in a row
  is what a skimmer reads as a brochure.

## Step 3 — The Plot

The twelve beats are unchanged and are recorded in [[homepage-scan-and-depth]].
This pass changes nothing about **what** happens in the story. It changes the
**pacing** of beats 8 to 10 — Fun and Games — which had been given four full
scenes where the story needs one.

## Step 4 — From Beats to Scenes

The scene list went from twelve to nine.

| Before | After |
|---|---|
| demo, problem, who, outcomes, yield | unchanged |
| **nutrition, intake, sage, access** | **more** (four blocks) |
| alternatives, trust, start | unchanged |

The four blocks hold their old order, and their old order was argued: nutrition
is recipe-level and follows yield; Sage is a mechanic and sits with the
mechanics, ahead of the rival beat whose `/compare` link lists it as a Coming
row. Reordering them inside the band is reordering the argument.

## Step 5 — Character Voices

Two new sentences on the page and no more. Everything else in the band is the
copy the four sections already carried, verbatim, having already passed the claim
scan:

- **h2** "Four more areas, and where each one stops."
- **lede** "The label numbers, the paperwork coming in, Sage, and who on your
  crew can do what. All four are in the app today, and each one says what it does
  not do."

Both are hers, not ours: "the paperwork coming in" is what a kitchen calls it,
and "where each one stops" is the promise she is actually shopping for after
being sold to before. Four `more-label` micro-labels reuse the eyebrows the
sections had.

## Step 6 — Writing Dialogue (McKee)

The band turns *another product tour → four bounded areas with their limits
stated*. The h2 does the turn on its own: a page that volunteers where a feature
stops is making a different kind of claim than a page listing what it does.

Delete the band and the story breaks: nutrition, intake, Sage and access are four
of the twelve ledger-backed areas of the app and three of them are the ones a
skeptic asks about first.

## Step 7 — Sorkin Dialogue

"Four more areas, and where each one stops" pushes against the expectation the
reader brought with her — that the next section will be another list of things it
does. The obstacle is her own experience of feature sections.

## Step 8 — Cool Talk

No new snap line. The page has one and it is not in this band. The four blocks
keep the lines they already had, including the one this band would have been
tempted to reach for: *a role is a boundary, not a badge*.

## Step 9 — Bringing a Scene to Life

390x844, one thumb. Before this pass, reaching "the other tools" meant scrolling
7,316px through four openings. After, the same four areas are 4,299px and the
first thing under each heading is one sentence, with the working one tap behind a
control.

## Step 10 — Connecting Your Scenes

Point of view unchanged (second person). Three hand-off lines went with the three
retired sections; `stops.ts` regenerated the rest, so "Next · What else is in it"
and "Next · The other tools" were never typed. One hairline rule separates the
blocks and nothing else: four backgrounds inside one stop would rebuild the thing
the band replaces.

## Step 11 — Revise and Finish

**Measured, homepage:**

| Viewport | Before | After | Change |
|---|---|---|---|
| 1440x900 | 21,487 | 20,778 | −709 |
| 1280x800 | 21,316 | 20,607 | −709 |
| 1024x768 | 21,052 | 20,397 | −655 |
| 834x1112 | 22,597 | 19,656 | **−2,941** |
| 768x1024 | 22,689 | 19,907 | **−2,782** |
| 390x844 | 26,260 | 23,242 | **−3,018** |

The band itself: **7,316px → 4,299px** on a phone. Phone viewports 31.1 → 27.5;
iPad Pro portrait 20.3 → 17.7.

**Nothing was cut.** That was the owner's decision on 2026-09-09, taken against a
stated alternative: a shorter band that replaced the four areas with four
sentences and four links, worth about 8,000px, and which would have retired four
documented contracts in `scripts/check-dist.mjs` asserting the homepage carries
this proof. Every claim, every figure and all four contracts are still here. The
saving is chrome — three eyebrows, three h2s, three ledes, three hand-off lines,
three screens of section padding — plus five `FoldedDetail` controls that fold the
working, never the claim, under 64rem, and ship open so a no-JS reader and every
build contract still see all of it.

**Desktop barely moved, and that is correct.** Every fold on this page is inert
at 64rem and above, so the desktop saving is the chrome alone. The reader this
page is written for is on a phone.

**What is still open.** 27.5 phone viewports. The next honest lever is
`#outcomes`, which is 3,890px carrying 278 words because it holds four app
screenshots, and those screenshots are the page's core proof. That is the same
class of decision as the one taken here, and it has not been put to anyone yet.

---

**Snap line called out:** none added. The band borrows no line it did not
already own.

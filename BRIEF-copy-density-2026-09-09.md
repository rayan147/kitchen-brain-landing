# Brief: cutting the homepage's word count

**Branch** `develop`
**Status** WORKED 2026-09-09. Section 8 is the record, and it corrects this
brief's own predicted pixel rate. Section 7 is the prompt that was run.
**Companion** `BRIEF-mobile-view-2026-09-09.md` (structural pass, WORKED). That
brief ends by saying the remaining cost is editorial and hands it to this one.
This brief also corrects that brief's word count. Read section 1 before quoting
any word figure from this repo.

---

## 0. Read this first

**The finding is not the one the request implies.** The ask was to summarize the
page so the reader is not overloaded. The measurement says the sentences are
already short: the average visible sentence on the homepage is **10.5 words**,
and exactly **7 sentences out of 193** run over 25. There is no verbose prose to
tighten. Tightening the writing would return perhaps fifty pixels and spend a
full editorial pass doing it.

What overloads the reader is the **number of claims**, not the length of any of
them. 127 paragraphs, each one short, each one true, each one arguing for
something. The page is not badly written. It is over-argued.

So the deliverable of the execution pass is a list of things the homepage stops
saying, not a rewrite of how it says them. That distinction is the whole brief.

**Five non-negotiables**, all from CLAUDE.md and the two guard scripts:

1. Every surviving sentence still traces to shipped app behaviour. A shorter
   page that overclaims is worse than the long one.
2. The copy pinned by `check-landing-claims.mjs` and `check-dist.mjs` does not
   move. Section 3 enumerates it. There are 24 literal pins plus two ordered
   four-item pairings.
3. The four pains in `#problem` and the four befores in `#outcomes` stay 1:1 and
   in order. A cut on one side is a cut on both, or the build fails.
4. No em-dashes. No stock SaaS phrasing. "Kitchen Brain" never appears.
5. `story-content` runs first and its tracker ships with the change. Section 7
   names the existing trackers this invalidates; a new tracker does not
   discharge a stale one.

**Out of scope.** Section order (settled three times, twice by measurement).
Adding or removing a section. The CTA label and target. Anything structural,
which the companion brief already spent.

---

## 1. The measurement, and a correction to the last one

Rendered at 390x844, `prefers-reduced-motion: reduce`, every `[data-reveal]`
forced revealed, on the current `dist`.

### The correction

`BRIEF-mobile-view-2026-09-09.md` reports **4,388 visible words**. That number
counted the `sr-only` demo transcript, which no sighted reader sees, and it
counted the demo guide as open, which on a phone it is not. Both are visible to
`innerText` and neither is visible to the reader the page is written for.

    with sr-only, guide open      4,390     <- what the last brief measured
    minus the sr-only transcript   -709
    minus the collapsed guide      -393
    ----------------------------------
    mobile visible                3,288

The three figures that are true, each labelled with who sees it:

| | words |
|---|---|
| Phone reader sees (390, guide collapsed, no sr-only) | **3,288** |
| Desktop reader sees (1440, guide open, no sr-only) | **3,692** |
| Screen-reader transcript, additional | 709 |

**The budget in this brief is denominated in the mobile figure, 3,288**, because
that is the reader CLAUDE.md describes and the phone column is 1.45x the desktop
one for the same words.

That is now the third correction to a measurement in this repo in two days. The
pattern in all three is the same: a metric that counted something the reader
cannot see. Before publishing a fourth number, state what a human eye would be
looking at when it is true.

### Where the words are

Section totals, phone, excluding `sr-only`. `px/w` is section height divided by
section words: low means the section's height is made of text, high means its
height is made of media and a cut there returns little.

| section | height | vps | words | head | prose | other | paras | sents | avg | px/w |
|---|---|---|---|---|---|---|---|---|---|---|
| demo | 1,098 | 1.30 | 93 | 3 | 89 | 1 | 5 | 8 | 11.1 | 11.8 |
| demo-guide | 128 | 0.15 | 7 | 0 | 0 | 7 | 0 | 0 | 0 | - |
| problem | 2,214 | 2.62 | **432** | 33 | 399 | 0 | 20 | 38 | 10.5 | **5.1** |
| who | 1,208 | 1.43 | 168 | 19 | 149 | 0 | 11 | 15 | 9.9 | 7.2 |
| outcomes | 3,890 | 4.61 | 275 | 36 | 137 | 102 | 8 | 11 | 12.5 | 14.1 |
| yield | 1,951 | 2.31 | 166 | 11 | 83 | 72 | 10 | 12 | 6.9 | 11.8 |
| nutrition | 3,597 | 4.26 | **476** | 15 | 291 | 170 | 15 | 22 | 13.2 | 7.6 |
| intake | 1,425 | 1.69 | 165 | 7 | 119 | 39 | 7 | 11 | 10.8 | 8.6 |
| sage | 3,498 | 4.14 | **421** | 57 | 224 | 140 | 13 | 21 | 10.7 | 8.3 |
| access | 1,290 | 1.53 | 93 | 8 | 46 | 39 | 4 | 6 | 7.7 | 13.9 |
| alternatives | 2,414 | 2.86 | **337** | 16 | 285 | 36 | 18 | 26 | 11.0 | 7.2 |
| trust | 1,482 | 1.76 | 117 | 25 | 90 | 2 | 8 | 10 | 9.0 | 12.7 |
| start | 2,647 | 3.14 | 252 | 28 | 97 | 127 | 8 | 13 | 7.5 | 10.5 |
| **sections** | | | **3,002** | 258 | 2,009 | 735 | 127 | 193 | **10.5** | |

Plus hero 267, footer 28, nav 2. Page 29,088px, 34.5 mobile viewports.

Two readings worth stating:

- **655 words fall in the first three viewports**, 20% of the page, which is
  roughly all a cold-email reader will ever look at. The other 2,633 are being
  written for a reader who has already decided.
- **Four sections hold 1,666 words, 55% of the section total**: nutrition,
  problem, sage, alternatives. Three of the four are single mechanics.

---

## 2. Why the reader feels overloaded

Not sentence length. Three specific things:

**Every mechanic argues at the same volume.** Nutrition is 476 words and Sage is
421, which is more than the diagnosis the whole page rests on would be if the
diagnosis were not itself 432. A reader scanning cannot tell from the mass of
any section whether it is load-bearing. Everything looks equally important, so
nothing does.

**The page answers questions the reader has not asked yet.** `#nutrition` and
`#sage` each carry their boundary conditions, their scope limits and their
"what it will not do" copy on the homepage. Those are diligence answers. They
belong on the feature page the diligence reader clicks through to, and
`/features/nutrition-facts-and-allergens` and `/features/sage` both exist and both already
say it. The homepage is paying full price to pre-answer a question that has its
own page.

**Four claims are made twice.** Section 5.

---

## 3. What may not be touched

**This list is indicative, not exhaustive.** It was built by extracting
`requireText(...)` calls whose source variable names a homepage section, so it
misses pins held under other variable names, and it does not cover the eight
bare `.includes()` assertions elsewhere in the guard's 1,041 lines. `npm run
check` is the authority, and the per-section cadence in section 7 is the safety
net. Do not read this table as a complete allowlist.

### Literal strings pinned by `check-landing-claims.mjs`

| source | string |
|---|---|
| hero | `restaurants that cater` |
| hero | `launchPlan.displayPrice` |
| problem | `The spreadsheet works until the job changes.` |
| problem | `Most kitchens cost on a spreadsheet` |
| problem | `Those four are the slow ones` |
| problem | `A missing price or a missing conversion holds the costing` |
| outcomes | `docs/stories/homepage-spreadsheet-pain.story.md` |
| nutrition | `not a retail-label compliance claim` |
| alternatives | `A restaurant can run both.` |
| alternatives | `Coming soon`, `data-coming-plans` |
| trust | `catering, meal-prep, and restaurant kitchens that plan work from menus and guest counts` |
| start | `href="/faq"` |
| sage | `export const SAGE_STATUS`, `{sageStatusWord}` |
| public copy | `See everything it does, area by area` |
| public copy | `Watch the 2:53 product tour` |

### Also pinned by `check-dist.mjs`

- `A price you have not got yet` and `A conversion nobody checked`, and they
  stay `<p>`, never `<h3>`.
- `Those four are the slow ones` stays OUTSIDE the `<ol>`.
- The four `#problem` h3 titles, in order, and the four `#outcomes` befores, in
  the same order, one for one. **Cutting a pain means cutting its answer.**
- Section order; `demo` before `problem`; the first heading after the h1 is an
  h2.
- Every `data-*` hook the per-section contracts read (`data-nutrition-step`,
  `data-sage-stage`, `data-sage-scope`, `data-sage-boundary`,
  `data-yield-stage`, `data-intake-source`, `data-order-input`,
  `data-order-output`, `data-founder-consequence`, `data-outcome-stage`, and the
  rest). **A step or stage removed from copy is also removed from a contract
  list**, so the two must move together or the build fails.

### The forbidden-claim regexes still apply to whatever replaces the copy

`check-landing-claims.mjs` holds roughly 25 patterns for sentences a shorter
page is *more* likely to write, not less, because compression drops
qualifiers: no "know the margin", no "handles it automatically", no verdict on
what a spreadsheet cannot do (RC-56), no model or provider name (RC-49), no
named spreadsheet product outside `/compare` (RC-40), and the four RC-59
ordering sentences. Compression is exactly how a hedged sentence becomes an
overclaim. Re-run `npm run check` after every section, not at the end.

---

## 4. Where the words are available, ranked

Ranked by **cuttability**, not by mass.

**1. `#nutrition`, 476 words. Cut to ~300.** The fattest section on the page for
a single mechanic, guard-quiet on prose apart from one pinned boundary line, and
it already links out (`Nutrition facts, area by area`). The homepage claim is
"the plate's numbers come from the line". The scope detail, the characteristics
list and the second half of the boundary copy belong on
`/features/nutrition-facts-and-allergens`, which it already links to. Measured
return: **~740px**; section 6 gives the rate.

**2. `#sage`, 421 words. Cut to ~290.** Same shape: one mechanic, three
`data-sage-*` contract lists, 57 words of headings alone. The status word and
`SAGE_STATUS` stay. The boundary and scope prose is diligence copy with a
feature page waiting for it. **Watch the contract lists**: if a scope or
boundary is cut from the copy it must also come out of the check. Measured return:
**~480px**. It links out to `/features/sage` from its closing paragraph, so
relocated detail stays reachable.

**3. `#alternatives`, 337 words, 18 paragraphs. Cut to ~240.** The densest
paragraph count on the page, and section 5 shows it restates two pains from
`#problem` in full. It has `/compare` to carry detail. Measured return: **~380px**.

**4. `#who`, `#intake`, `#trust`, `#start`, together ~700 words. Cut ~150.**
Ordinary trimming, no structural risk. `#trust` carries the duplicated
provenance sentence (section 5). Measured return: **~600px**.

**5. `#problem`, 432 words. Cut last, and least, to ~350.** It is the most
pinned block on the page: four literal strings, two ordered four-item pairings,
an h3 count, and a `<p>`-not-`<h3>` rule. It is also the section the page's
argument rests on and the one a cold reader actually reads. The only safe cut is
in the three lede paragraphs above the ticket stack, not in the tickets and not
in the quiet-one block. Measured return: **~350px**.

**Where words will not buy pixels.** Measured the same way, the marginal return
collapses in the media-led sections: `#demo` gives back **0.6 px/word** and
`#yield` **1.22**, because their height is video, poster and stage chrome.
`#outcomes` gives 2.91. Words can still come out of all three for the reader's
sake, and should, but do not count those pixels against the budget. `#access` is
the surprise: it returns 4.36 px/word, as good as anything on the page, but it
only holds 93 words, so there is almost nothing there to take.

---

## 5. The four claims made twice

Thirty-seven four-word phrases repeat across sections. Most are **by design and
must not be "fixed"**:

- hero + demo: the trial offer. `cta.label` is rendered verbatim by contract in
  every `btn-primary`. This repetition is enforced.
- hero + start: "by supplier, in whole packs, prep scaled to batches". The page
  opens and closes on the same action; the bookend is the design.
- demo + demo-guide: "follow the order in writing". Already handled, the jump
  link is hidden under `lg`.

Four are genuine and each is worth naming:

1. **The twelve-years provenance sentence appears in full in both `#problem`
   and `#trust`.** `TheProblem.astro` documents the duplication as deliberate:
   it was surfaced early because the credibility asset otherwise sat at 78%
   depth. That was a decision made when the page was shorter and the founder
   block was far away. It is now a re-openable question, and the cheapest
   version is one line early, the full block late, with no shared sentence.
2. **`#alternatives` restates `#problem`'s pains verbatim**: "the client adds
   forty guests", and "the shopping list, the prep". The reader met these 8,000
   pixels ago. The rival beat can name the pain in three words or point back.
3. **"special dinners and changing menus" in both `#who` and `#alternatives`.**
   Same audience definition, stated twice.
4. **The missing-fact rule appears in `#problem` and again in `#trust`.** The
   `#problem` version is pinned; the `#trust` version is the one that moves.

---

## 6. The target, and its arithmetic

**3,288 mobile-visible words down to ~2,600.** A cut of roughly 690 words, 21%.

**The rate is measured, not derived.** Section 1's `px/w` column is an *average*,
section height over section words, and it is the wrong multiplier for this: it
includes headings, media, card chrome, padding and section gaps, none of which
shrink when a sentence goes. The marginal rate was measured directly in the live
DOM at 390x844 by removing content and re-reading `scrollHeight`:

| how the words come out | words | px returned | px/word |
|---|---|---|---|
| trimming sentence tails, 25% off each paragraph | 619 | 1,733 | **2.80** |
| removing whole paragraphs, every fourth | 285 | 1,275 | **4.47** |

Two things follow. Removing a whole claim returns **60% more per word** than
tightening the sentences around it, because the paragraph's own margin goes with
it. That is independent confirmation of section 0: the lever is claims, not
prose. And the honest planning rate is about **4.2 px/word** in the text-led
sections (nutrition 4.44, problem 4.28, alternatives 3.94, sage 3.65), not the 5
to 8 the averages suggest.

| section | words out | px back |
|---|---|---|
| nutrition | 176 | ~740 |
| sage | 131 | ~480 |
| alternatives | 97 | ~380 |
| problem | 82 | ~350 |
| who, intake, trust, start | ~150 | ~600 |
| media-led sections | ~50 | not counted |
| **total** | **~690** | **~2,550** |

29,088px minus roughly 2,550 lands the page near **26,500px, about 31.4 mobile
viewports**, against the 30,000px ceiling in `src/pages/index.astro`.

That matters for a reason beyond this pass. The ceiling has 900px of headroom
today, which is less than half a section (the thirteen average 2,240px). After
this cut it has about 3,500px, which is **one more section, not two**. The cut
buys the page room to say one new thing. It is not a licence to move the
ceiling.

Re-measure after, and record the real figure in section 8.

## 7. The prompt

> Cut roughly 690 words from the CostCook homepage without dropping a claim the
> page needs, and without touching the guarded copy.
>
> **Read first.** `BRIEF-copy-density-2026-09-09.md` sections 3, 4 and 5. Then
> load the `story-content` skill and build the pass as one story before editing
> any file. Save the tracker at
> `docs/stories/homepage-copy-density.story.md`.
>
> **The finding you are executing.** The page's sentences average 10.5 words and
> only 7 exceed 25. Do not rewrite sentences to be shorter. Remove claims. Every
> cut is a decision that the homepage stops saying a thing, and the thing is
> usually still said on a feature page.
>
> **Order of work**, from section 4, safest first:
> 1. `#nutrition` 476 -> ~300. Detail moves to `/features/nutrition-facts-and-allergens`.
> 2. `#sage` 421 -> ~290. Detail moves to `/features/sage`. If you remove a
>    scope or boundary from the copy, remove it from the `data-sage-scope` /
>    `data-sage-boundary` lists in `scripts/check-dist.mjs` in the same commit
>    and say why in the component header.
> 3. `#alternatives` 337 -> ~240, resolving duplications 2 and 3.
> 4. `#who`, `#intake`, `#trust`, `#start`: ~120 words, and resolve duplications
>    1 and 4.
> 5. `#problem` 432 -> ~350, in the three lede paragraphs only. Not the ticket
>    stack. Not the quiet-one block.
>
> **Hard constraints.**
> - The 24 pinned strings in section 3 survive verbatim.
> - The four pains and the four befores stay 1:1 and in order. If you cut one,
>   you cut its pair, and you update both pinned arrays.
> - `Those four are the slow ones` stays outside the `<ol>`; the two quiet rows
>   stay `<p>`.
> - Every `data-*` step/stage/scope list stays in sync between copy and
>   `check-dist.mjs`.
> - No em-dashes. No stock SaaS phrases. No named model, provider, or
>   spreadsheet product. Compression drops qualifiers, which is how a hedged
>   sentence becomes a forbidden claim: run `npm run check` after **each**
>   section, not once at the end.
>
> **Trackers this invalidates.** These already describe copy you are cutting and
> each must be revised, not superseded, with a dated note saying what was
> removed and where it went:
> `docs/stories/homepage-nutrition-visual.story.md`,
> `docs/stories/nutrition-facts.story.md`,
> `docs/stories/homepage-sage-redesign.story.md`,
> `docs/stories/homepage-coming-plans.story.md`,
> `docs/stories/homepage-founder-trust.story.md`,
> `docs/stories/homepage-spreadsheet-pain.story.md`,
> `docs/stories/who-its-for.story.md`.
>
> **Definition of done.**
> - `npm run check` and `npm run build` pass, all 19 page contracts green.
> - Re-measure at 390x844 with reveals forced and `sr-only` excluded, the same
>   way section 1 did, and record the real word count and page height in section
>   8 of this brief.
> - Update the mobile budget note in `src/pages/index.astro` with the new height
>   and one line saying this pass is where the headroom came from. That note
>   currently carries the *predicted* 26,500px; replace it with the measured one.
> - If a link out does not exist for content you relocate, add the link in the
>   same commit. `#nutrition` and `#sage` both already have one; check before
>   assuming for any other section.
> - Verify at 390, 768 and 1440. Desktop must not lose a claim it needs.
> - Report per section: words before, words after, what stopped being said, and
>   where that thing is still said.

---

## 8. Record

**WORKED 2026-09-09.** Tracker: `docs/stories/homepage-copy-density.story.md`.
Measured at 390x844, reveals forced, `sr-only` excluded, guide collapsed, the
same protocol as section 1.

| | before | after | change |
|---|---|---|---|
| mobile visible words | 3,288 | **2,963** | -325, -9.9% |
| desktop visible words | 3,692 | **3,367** | -325 |
| height @390 | 29,088px | **27,979px** | **-1,109px** |
| mobile viewports | 34.5 | **33.2** | -1.3 |
| height @1440 | 22,017px | **21,487px** | -530px |
| paragraphs | 127 | 125 | -2 |
| sentences | 193 | 181 | -12 |

Per section, words then pixels: nutrition -127 / -391 · sage -74 / -312 ·
alternatives -41 / -139 · problem -23 / -76 · intake -26 / -72 · start -20 / -71
· trust -14 / -48. `#who` was audited and came out unchanged, on purpose; see
its tracker note.

`npm run check` and `npm run build` pass, all page contracts green. No
horizontal overflow at 390, 768 or 1440. One sub-44px target, the intentional
1x1 skip link. No heading, no section order and no hand-off line was edited.

### The rate, corrected a second time

Section 6 predicted 4.2 px/word and ~2,550px from ~690 words. **The delivered
rate was 3.41 px/word** (1,109 / 325). Section 6 was not wrong about the two
mechanisms; the mix was different from what it assumed. Most of what this pass
found was a *duplicated sentence inside a paragraph that had to stay*, which
pays the trim rate of 2.80, not a whole removable paragraph at 4.47. Only
`#sage`'s promise rail and `#intake`'s prose paragraph came out whole.

**For the next pass: plan at 3.4 px/word unless whole paragraphs are going.**

### Why 325 and not 690

Not unfinished. The 690 target was set before anyone had looked at which words
were available, and the answer turned out to be sharp: **every word this pass
removed was a duplicate**, a claim stated elsewhere on the page, usually within
a screen. Those cuts cost the page nothing.

The remaining ~365 words would have to come out of claims the page makes once.
The two blocks big enough to matter are `#sage`'s six guardrails (~150 words)
and `#nutrition`'s "What it is not" (~60). Both have a feature page that could
hold them, and both are the reason a skeptic believes the section they sit in.
`#sage`'s own h3 is "Useful because the boundaries are visible"; cutting the
boundaries to save 600px would make the page shorter and its claims weaker in
the same edit, which is design principle 2 read backwards.

**That is a decision about what the homepage promises, not about how long it is,
and it belongs to the owner rather than to a density pass.**

At this pass's measured 3.41 px/word it would be worth about 1,250px, landing
the page near 26,700px. Treat that as an upper bound, not a plan: both blocks are
dense boundary prose in sections carrying a lot of non-text height, and this
repo's predicted px/word figure has now come in high twice running.

### What the pass found that the brief did not predict

The brief said the problem was that every mechanic argues at the same volume.
True, but the cause was more specific and more fixable: **five sections were
reading their own diagrams aloud.** `#nutrition`'s detail paragraphs enumerated
what the cue rail beneath each one listed. `#intake`'s prose named the three
labels in the queue beside it. `#sage` said "eleven read, one prepares, you
approve" in six places, one of them a rail sitting directly on top of the band
that shows it. `#trust` re-listed the four plans its own lede names two elements
above.

That is a drawing-and-caption failure, not a verbosity failure, and it is what a
page accumulates when a visual pass (2026-08-29) adds diagrams to sections whose
prose already did the diagram's job. **Nobody deleted the prose the drawing
replaced.** Worth checking for by hand the next time a section gains a figure.

One thing the pass fixed that was not a length problem at all: the phrase
`check-landing-claims.mjs` pins in `src/lib/nutrition.ts`, "not a retail-label
compliance claim", was being carried by point 4's detail and the proof caption,
while the boundary list that should own it said "retail-label **regulatory**
compliance claim" and so did not satisfy the pin at all. The guard was green on
two incidental copies. It is now carried once, by `notClaimed[0]`, in the words
the guard reads.

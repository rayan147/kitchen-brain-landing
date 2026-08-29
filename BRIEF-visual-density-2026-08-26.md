# Brief: the homepage reads as a wall of text

**Written** 2026-08-26. **For** whoever picks up the next landing work (agent or human).
**Status** WORKED 2026-08-26. Section 5 is the record. A and B shipped; C and D were
declined with reasons; E is green. Sections 0-4 are left as written so the
reasoning that produced the work stays legible.

**Origin.** The user, reading the page: "there is a lot of text and it gets confusing
real fast." Their own guesses at the fix were "more icons or images or white space."
Section 1 argues that two of those three are right and one of them is a trap.

---

## 0. Read this first, or you will fail the build

### Baseline this brief assumes

The tree is **not** clean `main`. Present but uncommitted as of this writing:
`src/components/FeatureAreaIcon.astro`, the rebuilt `SiteNav.astro` disclosure, the
`/features/*` area pages, `compare.astro`, `PaperIn.astro`, and the 2026-08-26 copy
pass across all nine homepage sections. If those are missing, find out what happened
before building on this.

### Non-negotiables

Read `CLAUDE.md` and the non-negotiables in `BRIEF-enrich-landing-2026-08-23.md`
section 0. They all still apply. These four bite this brief in particular:

1. **`scripts/check-dist.mjs` fails the build on any inline `<svg>` that ships a
   viewBox with no intrinsic `width`/`height`** (issue #54). Any new mark goes
   through `FeatureAreaIcon.astro`'s pattern or a sibling component built the same
   way. Do not hand-roll an svg into a section file.
2. **`expectedSectionOrder` in `check-landing-claims.mjs:106` pins all nine homepage
   sections in order.** Any workstream that splits, merges, reorders or adds a
   section must update three places in that file: `surfaceFiles` (line 7 — and note
   the comment there: `site.ts` and `Hero.astro` are read by *position*, so they
   stay at indices 0 and 1), the component require-list, and `expectedSectionOrder`.
3. **Motion is transform/opacity only, in two registers** (`.anim-enter`,
   `[data-reveal]`), inert under `prefers-reduced-motion`, and nothing is hidden
   from a no-JS visitor. A new visual device that animates height, or that renders
   empty without JS, is out.
4. **AA is the floor and amber is decoration or large text only.** A mark or rule
   drawn in `amber` at body size fails. `amber-deep` is the small-text token.

### The image problem, stated once so no workstream forgets it

**The only images that exist are `public/founder.jpg`, `public/proof/yield-lines.png`
(+ its mobile crop), and the two demo posters.** There is no photo library, no
screenshot set, no illustration system.

So any workstream that proposes an image must do one of two things, explicitly:

- **name where it comes from** — the app repo's capture path (`npm run demo:seed`,
  then `npm run demo:capture` against the hard-guarded demo seed, never production,
  never `DEMO_REUSE_SERVER=1`) is the only sanctioned source of product imagery; or
- **scope itself to typographic and spatial devices only** — rules, measure, white
  space, scale, marks drawn as line art.

A brief that says "add a screenshot here" without answering that is the same failure
as the videos page: a promise the repo cannot keep. Stock photography of kitchens is
out; it is the "generic SaaS page" anti-reference in `CLAUDE.md` wearing an apron.

### Out of scope, deliberately

- **Another copy cut.** See section 1. This is the single most likely way to get
  this brief wrong.
- Testimonials, logos, star ratings, "trusted by" bars. None exist; none may be
  implied.
- Any second primary action anywhere. Quiet secondaries stay capped at two.
- Dark mode, gradients, a second accent colour, ad-hoc colours outside `@theme`.
- The videos/how-to page. It is blocked on a clip list from the user, tracked
  separately.

---

## 1. The diagnosis, and the trap inside the user's own words

### What was measured

Nine homepage sections. Approximate visible word counts (regex strip of markup and
comments, so treat as ±10%, not audited figures):

| Section | ~visible words | Visual anchor |
|---|---|---|
| Hero | 70 | `LoopBand` diagram |
| TheProblem | 58 | none |
| WhoThisIsFor | 82 | none |
| SeeItRun | ~86 (the 536 raw count is ~450 words of sr-only transcript) | video + poster |
| CustomerOutcomes | 37 | none |
| TheYield | 138 | `yield-lines.png` |
| PaperIn | 127 | none |
| BuiltForKitchens | 43 | `founder.jpg` |
| StartHere | 167 | none |

**Five of nine sections have no visual anchor of any kind.** Four of the five sit
consecutively in the middle of the page. The whole homepage carries three images and
one diagram.

### The trap

The word count is **not** the problem, and a brief that reads as license to cut more
copy will undo work that was measured and verified on 2026-08-26. That pass took the
homepage from 1,342 to 1,188 visible words (−11.5%) by deleting three genuine
duplications — billing terms told three times, the founder's twelve years told twice,
"you approve what becomes true" told twice — and stopped deliberately at the point
where further cuts start deleting *arguments* rather than repetition.

The reader's complaint is real and the reader's diagnosis is wrong. 1,188 words is
not a lot for a page that has to survive a demo call. What the page has is **unbroken
runs of undifferentiated text with nothing for the eye to land on** — a scanning
problem, not a verbosity problem. Sections that all open the same way (eyebrow, h2,
lede paragraph, body) and then all continue the same way give a mid-shift reader on a
phone no way to tell where one argument ends and the next begins, and no way to skip
one and rejoin.

**Every workstream below is measured against "can a reader find their way," never
against "is the word count lower."** If a workstream's acceptance test is a smaller
number of words, it is the wrong workstream.

### The test any new mark must pass

`FeatureAreaIcon.astro`'s header states the argument that justified the five area
marks: they sit in a disclosure panel where five similar-cadence phrases are
**scanned**, so the mark is what the eye lands on before the words resolve. That
argument does not transfer for free. Homepage sections are read in sequence, not
scanned in a list, so "one icon per section" is not granted by the earlier decision
and must earn itself separately.

The test, from `CLAUDE.md`: **would it survive on paper?** A printed page uses rules,
scale, measure, indentation and white space long before it uses glyphs. Reach for the
typographic device first and the mark second, and justify any mark by naming the
scanning behaviour it serves.

---

## 2. Workstreams

Each states the problem, the constraint, and the acceptance test. **Do not specify
class strings or rewritten copy here.** The next agent measures the rendered page and
decides. Work them in order; A and B are the ones most likely to fix the complaint on
their own.

### A. Give the five anchorless sections a structural rhythm

**Problem.** `TheProblem`, `WhoThisIsFor`, `CustomerOutcomes`, `PaperIn` and
`StartHere` render as eyebrow → heading → prose → prose. Four of them run
consecutively. Nothing marks the boundary between one argument and the next except a
heading the reader has already scrolled past.

**Constraint.** The ticket motif (dashed rules, mono micro-labels, cream/softamber
surfaces, the 1.5° tilt) is the one repeated accent device and it is already defined.
This workstream should mostly be *applying what exists* to sections that never got
it, not inventing a sixth device.

**Acceptance test.** Screenshot the page at 390 and 1440. A reader who cannot read
the words — squint, or scale to 25% — can still count the sections and tell which are
argument, which are proof, and which is the ask. Today they cannot.

### B. Audit vertical rhythm and measure, not just add space

**Problem.** The user said "white space." The likely truth is that space is
*uniform* rather than scarce: if the gap inside a section equals the gap between
sections, no amount of adding space creates grouping, and the page just gets longer.

**Constraint.** Page height is a real cost that has already been argued in this repo
(`SeeItRun.astro` documents a measured 10.1-viewport gap with nothing to click, which
is why a mid-page primary exists). Adding 2,000px of air to fix a scanning problem
trades one measured defect for another.

**Acceptance test.** Measure, before and after, at 390: (i) intra-section vs
inter-section spacing as a ratio, (ii) total page height, (iii) the longest run of
pixels containing nothing but body text. Report all three. (i) should separate,
(ii) should not grow materially, (iii) should fall. Record the before numbers *first*
— the last turn could not report a mobile height delta because no baseline was taken.

### C. Decide, with evidence, whether section marks earn their place

**Problem.** The user asked for icons. Section 1 says the argument has to be made
per-mark, not granted.

**Constraint.** Nine marks on a page whose design note caps decoration at the ticket
motif and amber eyebrows is a visible change of aesthetic direction, and the
anti-reference list names "generic AI-gradient SaaS pages." If marks go in, they go
through `FeatureAreaIcon`'s pattern (line art, `currentColor`, no fill, intrinsic
`width`/`height`) and they are `aria-hidden`, since every one would sit beside its own
heading as real text.

**Acceptance test.** Either ship marks with a written argument naming the scanning
behaviour each one serves, or write down that A and B fixed the complaint without
them and the marks were declined. **Both outcomes are acceptable deliverables.** What
is not acceptable is nine marks added because they were asked for.

### D. Two candidate images, each with its provenance answered

**Problem.** Four hundred pixels of prose with no image is where a phone reader
leaves. The two sections that most plausibly earn one are `PaperIn` (a claim about
paper and spreadsheets going in, with no picture of either) and `CustomerOutcomes`
(the section carrying the whole "one order, first price to final delivery" promise
with nothing to show).

**Constraint.** Section 0's image rule, in full. If the answer is a product crop, it
comes from the capture path against the guarded demo seed, it must be legible at 390
before it is legible at 1440 (the demo poster already failed this exact way once and
needed a purpose-built mobile composite), and whatever it asserts needs an RC row in
`docs/release-claim-ledger.md` like any other claim.

**Acceptance test.** Each image either ships with its RC row and a 390 legibility
screenshot, or is written up as declined with the reason. No placeholder ships.

### E. Verify, at the widths that matter

Run the existing sweep: 320, 360, 390, 480, 640, 768, 1024, 1280, 1440 across `/`,
`/features`, the five area pages, `/compare`, `/pricing`, `/contact`; plus 200% root
text on `/` and `/features` for WCAG 1.4.10. Zero horizontal overflow at every one.
Then `pnpm check` (0 errors, warnings and hints, guard passed) and `pnpm build`
(`check-dist` clean).

---

## 3. What "done" looks like

A reader on a 390px phone, scrolling at speed with the sound off, can tell without
reading a word where each argument starts, which parts are proof, and where the ask
is. The word count is within a few percent of 1,188 in either direction. Total page
height has not grown materially. Every claim still traces to its RC row, and the
report says what was declined and why, not only what was added.

---

## 4. Open questions for the user, if any workstream stalls

- Is a product screenshot in `PaperIn` welcome, given it means another capture run?
- Does the founder photo want company, or is one human face on the page the point?

---

## 5. Record: what was actually done, 2026-08-26

Worked in order. A and B did fix the complaint, so C and D were declined rather
than filled, which section 2 names as an acceptable outcome.

### A. Structural rhythm - SHIPPED

**One treatment for the section-opening role.** Five of the nine stops
(`TheProblem`, `SeeItRun`, `CustomerOutcomes`, `BuiltForKitchens`, `StartHere`)
opened straight on an `h2`; three carried an amber eyebrow above it
(`WhoThisIsFor`, `TheYield`, `PaperIn`); the hero carried its own kicker. Same
semantic role, two costumes. The eyebrow is now on all nine. Cost: 31px per
section and two or three words each. It is the cheapest device on the page -
no image, no new colour, no new component - and it is what makes the sections
*countable* at 25% zoom, which is the acceptance test.

The hero keeps its own kicker (`text-amber-deep`, not the `eyebrow` utility) on
purpose: it is a page-opening role, not a section-opening one.

**`PaperIn` got its internal structure.** It was the only stop still rendering
as heading + prose + prose, and section 1's measurement (below) named it the
worst case on the page at both widths. The four doors - photograph, PDF or doc,
spreadsheet, paste - were a clause buried inside the lede sentence. They are now
four ticket rules across the container, and the closing paragraph is split at
its natural seam. No numerals: the four doors are peers, unlike
`CustomerOutcomes`' four, which are ordered and numbered for that reason.

One word of copy changed, and only to become truer: the second door reads
"Drop the PDF or the doc in", because RC-38's accept list has always included a
Word document and the buried clause had dropped it. Everything else is the same
sentence re-set. The whole page moved +5 words, +0.3% - well inside the "few
percent in either direction" that section 3 allows.

### B. Vertical rhythm - MEASURED, AND THE OBVIOUS FIX WAS RULED OUT

Rendered at 390x844 and 1440x900 with every `[data-reveal]` forced revealed and
`prefers-reduced-motion` on. Isolation is a section's largest internal gap
against the gap that follows it; the run is the longest stretch of pixels
holding no image, no video and no rule.

| | before | after |
|---|---|---|
| page height @390 | 9,826 | 10,251 (+425, +4.3%) |
| page height @1440 | 8,455 | 8,733 (+278, +3.3%) |
| longest text-only run @390 | 990px, in `#intake` | **742px**, in `#intake` (-25%) |
| longest text-only run @1440 | 824px, in `#intake` | **682px**, now in `#problem` (-17%) |
| `#intake` isolation @390 | 8.35 | **2.91** |
| `#intake` isolation @1440 | 14.4 | **5.05** |
| horizontal overflow | none | none |

**The user asked for white space and the numbers said no.** Isolation before
ran 2.00 (`#who`) to 8.35 (`#intake`) at 390. Space was not scarce and it was
not uniform either - the flat-reading sections were at the *low* end. Adding air
was the one fix the measurement ruled out.

`#intake` held both records at once: the highest outer isolation on the page and
the lowest internal differentiation on it (a 20px largest internal gap). A
section can be perfectly separated from its neighbours and still read as a wall.
That is the whole finding, and it is why the fix was four rules rather than 2,000
pixels of air.

Height grew 4.3% at 390. That is the honest cost of nine eyebrows and one list,
paid against a 25% cut in the worst run, and it is nowhere near the 10.1-viewport
scale of the defect `SeeItRun.astro` documents. Every gain here came from
structure; none came from space.

### C. Section marks - DECLINED

No marks were added. The argument section 1 demanded was never made, because A
and B closed the complaint without them:

- The scanning behaviour that justified `FeatureAreaIcon`'s five marks - five
  similar-cadence phrases scanned as a list, glyph resolving before the words -
  does not exist on the homepage. The nine sections are read in sequence.
- The thing the reader could not do was *count the sections and tell them apart*.
  The eyebrow does that with the page's existing type register, and the ticket
  rules do it inside a section. Both survive the "would it work on paper" test
  that `CLAUDE.md` sets; a glyph beside every `h2` is what a printed page reaches
  for last.
- Nine marks would be a visible change of aesthetic direction on a page whose
  design note caps decoration at the ticket motif and amber eyebrows.

If the complaint returns after this pass, the next agent should re-measure before
reaching for marks: the remaining worst run is 742px at 390, under one viewport.

### D. Two candidate images - BOTH DECLINED, NO PLACEHOLDER SHIPPED

- **`PaperIn`.** Its own header already carries the argument and it still holds:
  capturing the diff review needs a staged import batch the walkthrough seed does
  not create, and a page whose argument is that the number never lies does not
  mock a screen. The honest options were a gap or a mock; the gap is now filled
  with structure instead. If the app repo's capture path ever produces a real
  import crop, the slot is described in that header.
- **`CustomerOutcomes`.** Declined on a different ground: there is no single
  screen that asserts what the section asserts. Its four cards span quoting,
  scaling, buying and price return - four different surfaces - so any crop would
  argue one quarter of the claim and would need its own RC row to do even that.
  A four-up screenshot strip at 390 is the failure mode the demo poster already
  hit once.

Section 4's first open question is therefore still open, and now cheaper: the
page no longer *needs* a capture run, so it is a want, not a blocker.

### A's own acceptance test - RUN

Section 2 names one test for A, and it is not a ratio: screenshot at 390 and
1440, scale to 25%, and see whether a reader who cannot read the words can count
the sections and tell argument from proof from ask. Captured at
`deviceScaleFactor: 0.25`, full page, reveals forced, reduced motion.

At both widths the nine stops are countable: an amber mark opens every one, and
the surface alternation carries the rest (cream at `#problem` and `#start`,
softgreen at `#outcomes`, paper between). The three registers separate on sight -
argument reads as card grids under rules, proof reads as the three images, and
the ask reads as the cream band with the only green buttons on the page below
the hero. `#intake` now reads as a four-across rule band rather than a grey
block, which is the single most visible change in the squint.

### E. Verification - GREEN

- 9 widths (320/360/390/480/640/768/1024/1280/1440) x 10 paths (`/`,
  `/features`, the five area pages, `/compare`, `/pricing`, `/contact`): zero
  horizontal overflow, all 200 OK.
- 200% root text at 390 on `/` and `/features`: no overflow.
- `npm run check`: 44 files, 0 errors, 0 warnings, 0 hints; claim guard passed.
- `npm run build`: 10 pages; `check-dist` clean, 166 inline svgs all carrying
  intrinsic `width`/`height`.

Nothing is committed.

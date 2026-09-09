# Brief: the homepage no longer fits on a phone

**Written** 2026-09-09 on `develop`. **For** whoever picks up the next landing work
(agent or human). **Status** WORKED 2026-09-09. Section 6 is the record. Section 1 carries a
correction to this brief's own first measurement; read it before quoting any run
figure from this repo.

**Origin.** The user, on the mobile view: "right now it is not very user friendly."
They asked for best practices and pointed at UXPin's mobile-first guide. Section 1
reports what the page actually measures, and section 2 explains why most of that
guide is already satisfied here and which single item is not.

---

## 0. Read this first, or you will fail the build

### Baseline this brief assumes

Branch `develop` at `7ecb2c0`. Working tree carries only regenerated
`.impeccable/review/*.png` screenshots. Thirteen homepage sections, pinned in order
at `scripts/check-landing-claims.mjs:278`. Every measurement below was taken on
`npm run build` output served by `astro preview` on `127.0.0.1:4321`.

### Non-negotiables that bite this brief in particular

Read `CLAUDE.md`, `BRIEF-enrich-landing-2026-08-23.md` §0, and
`BRIEF-visual-density-2026-08-26.md` §0. All still apply. These five decide what
this brief may and may not propose:

1. **Nothing may be hidden from a no-JS visitor** (principle 3). This is the
   constraint that kills the obvious fix. "Progressive disclosure" as normally
   built - a JS toggle that collapses a block - deletes content for a no-JS
   reader. Native `<details>` is the only disclosure primitive that survives here:
   closed is a browser state, not a script state, and the text stays in the DOM
   for search, for Reader mode, and for a reader with JS off. Anything else needs
   an argument this brief does not grant.
2. **Motion is transform/opacity only, two registers, inert under
   `prefers-reduced-motion`.** A disclosure that animates height is out. Leave
   `<details>` unanimated.
3. **One primary, one label.** `check-landing-claims.mjs` F1 (line 734) requires
   every `btn-primary` on the homepage to render `cta.label` verbatim, and line
   746 fails the build if the close ships `demoCta` as a second primary. Quiet
   secondaries stay capped at two. **This makes the UXPin guide's headline phone
   recommendation - a bottom navigation bar for primary actions - illegal on this
   page.** `StickyCta` already owns the bottom edge with the one primary. Do not
   propose a second one; the build will reject it and the design note says no.
4. **`expectedSectionOrder` pins all thirteen sections in order**
   (`check-landing-claims.mjs:278`). Any workstream that splits, merges, reorders
   or removes a section updates three places in that file: `surfaceFiles` (line 20
   - `site.ts` and `Hero.astro` are read *by position* and stay at indices 0 and
   1), the component require-list, and `expectedSectionOrder`.
5. **AA is the floor, amber is decoration or large text only, no ad-hoc colours
   outside `@theme`.**

### Out of scope, deliberately

- **Rewriting copy.** Not because the page does not need it - section 3 argues it
  probably does - but because user-facing copy pulls in the `story-content` skill
  and a saved Story Tracker per the global instructions, and that is a second
  pass with a different acceptance test. **This brief is structure and density
  only: defer, collapse, reorder, compress the container.** If you conclude the
  real fix is editorial, stop and write `BRIEF-mobile-copy-*.md` rather than
  quietly cutting sentences inside a structural pass.
- **A bottom nav bar.** See non-negotiable 3.
- **Making `btn-primary` full-width on mobile** (the UXPin guide's other layout
  rule). That utility is defined once in `global.css` and renders on every page of
  the site. It is a token decision with site-wide blast radius, not a mobile
  tweak. If a workstream wants it, it gets its own argument and its own
  verification across `/pricing`, `/contact`, `/demo`, `/onboarding` and the
  eleven feature guides - not a line item here.
- Dark mode, a second accent colour, testimonials, logos, stock photography. Same
  as every prior brief.

---

## 1. The measurement

Rendered from the built site at 390x844 and 1440x900, `prefers-reduced-motion`
reduced, every `[data-reveal]` forced revealed - the same protocol
`BRIEF-visual-density-2026-08-26.md` §5B used, so these numbers are directly
comparable to that record.

### The headline

| | 2026-08-26 (9 sections) | 2026-09-09 (13 sections) | change |
|---|---|---|---|
| page height @390 | 10,251px | **31,999px** | **+212%** |
| mobile viewports @844 | 12.1 | **37.9** | +25.8 |
| visible words | 1,188 | **4,388** | **+269%** |
| longest run with no image, video or rule @390 | 742px (0.88 vp) | **4,729px (5.6 vp)** | **+537%** |

> **CORRECTED 2026-09-09, same day.** The 4,388 figure counted the `sr-only`
> demo transcript (709 words) and counted the demo guide as open. Neither is
> visible to the reader this page is written for. The corrected figures are
> 3,681 visible words at the time of this measurement and **3,288** for a phone
> reader today, with 3,692 on desktop. Every other appearance of 4,388 below is
> left as written so this brief still reads as one measurement; treat all of
> them as the same overcount. Full reconciliation and the per-section word
> table: `BRIEF-copy-density-2026-09-09.md` section 1.

**Four independent in-repo measurements, same protocol, monotonic:**

| date | height @390 | source |
|---|---|---|
| 2026-08-26 | 10,251px | `BRIEF-visual-density-2026-08-26.md` §5B |
| 2026-08-29 | ~12,700px | `StickyCta.astro` header |
| 2026-09-06 | 30,488px | `index.astro` header |
| 2026-09-09 | **31,999px** | this brief |

The last two are three days and 1,511px apart, which is the check that this
harness agrees with the one that took the 09-06 figure. **The growth is not
gradual: roughly 18,000px of it landed in the single week between 08-29 and
09-06.** That is the week of commits to read if anyone wants to know how.

**The page tripled in fourteen days and nobody measured the phone column while it
happened.** Every one of the four sections added since - `NutritionFacts`, `Sage`,
`TeamAccess` and `TheOtherTools` - won its place on its own argument.
None of those arguments was wrong. The sum of them is a page that asks a reader who
arrives cold from an email, mid-shift, on a phone, to scroll thirty-eight screens.
`CLAUDE.md` states the job as "decide in under a minute."

### Where the height is

| section | h@390 | h@1440 | mobile penalty | words | media |
|---|---|---|---|---|---|
| hero | 1,825 | 1,616 | 1.13x | 260 | 9 |
| `#demo` (incl. `#demo-guide`) | 4,009 | 3,252 | 1.23x | 1,072 | 11 |
| &nbsp;&nbsp;of which `#demo-guide` | 2,975 | 1,833 | 1.62x | 393 | 8 |
| `#problem` | 2,214 | 1,352 | **1.64x** | 434 | **0** |
| `#who` | 1,208 | 758 | 1.59x | 170 | **0** |
| `#outcomes` | 3,890 | 3,025 | 1.29x | 277 | 16 |
| `#yield` | 1,951 | 1,370 | 1.42x | 205 | 7 |
| `#nutrition` | 3,597 | 2,174 | **1.65x** | 478 | 7 |
| `#intake` | 1,425 | 923 | 1.54x | 190 | 5 |
| `#sage` | 3,498 | 2,107 | **1.66x** | 423 | 12 |
| `#access` | 1,290 | 921 | 1.40x | 95 | **0** |
| `#alternatives` | 2,414 | 1,494 | 1.62x | 377 | 4 |
| `#trust` | 1,482 | 1,131 | 1.31x | 119 | 5 |
| `#start` | 2,647 | 1,602 | **1.65x** | 252 | 7 |
| **total** | **31,999** | **22,017** | **1.45x** | 4,388 | |

### What that table rules out

**It is not a broken grid.** The obvious hypothesis - one or two multi-column
blocks stacking into towers on a phone - is wrong. The penalty is 1.4x to 1.66x
*across every section*, and the worst offenders (`#problem` at 1.64x, `#who` at
1.59x) carry **zero media and no grid at all**. They are pure prose. The 1.45x is
what 4,388 words do when the measure narrows to ~38 characters. There is no
layout bug to fix here; the mobile column is expensive because the page is long.

**It is not the mobile-first mechanics either.** Everything on the UXPin
checklist that can be verified mechanically already passes - see section 2.

### The runs, and the metric that got them wrong twice

**CORRECTED 2026-09-09, before any code was written. Read this before trusting
any run figure in this repo.**

The first pass of this brief reported a longest text-only run of 4,729px spanning
`#demo` through `#outcomes`, and named `#problem` and `#who` as 3,422 consecutive
anchorless pixels. **Both numbers were artefacts of the measurement, not the
page.** The script counted only `img`, `video`, `svg`, `hr` and `picture` as
things the eye can land on. It therefore could not see a ticket rule, a card
border, or the 48px numbered markers running down the demo guide, which is most
of what actually breaks up this page. Widening it to count every border and every
background change swung it the other way: 890 "anchors" and no runs at all.

Measured properly - an anchor is an EDGE (media box, a visible top or bottom
border wider than 80px, or a background change against the parent's background) -
the page looks like this at 390:

| run @390 | viewports | where | ended by |
|---|---|---|---|
| 2,498px | 3.0 | `#demo-guide` | a surface |
| 866px | 1.0 | `#nutrition` | an image |
| 665px | 0.8 | `#problem` | a rule |
| 641px | 0.8 | `#nutrition` | a rule |
| 574px | 0.7 | `#who` | a rule |

**Everything except the demo guide is under one viewport.** A screenshot of
`#problem` and of the guide settles it faster than any of this: both are
well-structured, with ticket cards, numbered markers and a connector line. The
2026-08-26 structural work held, and the four sections added since inherited it.

**There is no wall on this page.** The complaint is length, and only length.

**Do not publish a fourth version of this metric.** It has now been wrong twice
in opposite directions and a screenshot answered the question in one look. Height
and viewport count need no proxy; use those.

---

## 2. What the UXPin guide asks for, and what this page already does

The user asked for best practices from
`uxpin.com/studio/blog/a-hands-on-guide-to-mobile-first-design`. Checked against
the rendered page, so the next agent does not spend a pass re-verifying:

| the guide asks for | this page | evidence |
|---|---|---|
| mobile-first CSS, `min-width` queries | **done** | Tailwind v4 is min-width by default; 106 `sm:`, 87 `lg:`; the hand-written blocks are `min-width` except four deliberate `max-width` exceptions |
| breakpoints where content breaks, not at devices | **done** | the thirteen homepage sections use four content-driven stops (`min-width: 40rem / 48rem / 52rem / 64rem`) on top of Tailwind's; across the whole `src/` tree there are eight |
| single-column flow on phones | **done** | every grid collapses; measured, no exceptions |
| no horizontal overflow | **done** | `document.scrollWidth` is exactly 390; zero elements extend past the viewport |
| 44x44 tap targets | **done, and deliberately above the requirement** | exactly one target under 44px on the whole page: the 1x1 skip link, which is correct. `btn-quiet` engineers a 44px hit box with padding cancelled by negative margin (`global.css`), `.feature-breadcrumb a` sets `min-height: 44px`, `StickyCta`'s button is `min-h-11`. Note WCAG 2.2 **SC 2.5.8 Target Size (Minimum) is 24x24 CSS px at AA**, which is this project's stated floor; 44x44 is **SC 2.5.5 (Enhanced), AAA**. The page is a level above its own bar here. Nothing to do. |
| thumb-reachable primary action | **done** | `StickyCta` is fixed to the bottom edge and covers 72.6% of the scroll (measured 2026-09-06, `index.astro` header). It already carries `padding-bottom: max(0.625rem, env(safe-area-inset-bottom))`, so the iOS home bar does not overlap it. |
| minimize text input | **n/a** | the homepage has no form |
| bottom navigation for primary actions | **excluded** | see non-negotiable 3 |
| full-width primary CTA | **excluded from this pass** | see out-of-scope |
| content prioritization: must-show / should-show / can-show / don't-show | **NOT DONE. This is the entire finding.** | 4,388 words and 37.9 viewports is a page with no priority tier at all: everything is must-show |

One density observation that is not a violation but is worth naming: the page
renders **195 text nodes below 14px** at 390 - 133 at 13px, 50 at 12px, 12 at
11px. No WCAG rule sets a minimum font size and the `--text-caption` /
`--text-label-sm` / `--text-micro` tokens are legitimate semantic stops. But a
phone reader meeting 195 pieces of fine print in one scroll experiences that as
density, and it compounds run 1. Treat it as a symptom to watch, not a bug to fix.

---

## 3. The ruling this brief voids

`BRIEF-visual-density-2026-08-26.md` §1 contains an explicit trap warning:

> The word count is **not** the problem, and a brief that reads as license to cut
> more copy will undo work that was measured and verified on 2026-08-26. [...]
> 1,188 words is not a lot for a page that has to survive a demo call.

**That ruling was made at 1,188 words and 10,251px. The page is now 4,388 words
and 31,999px. It no longer describes this page and it does not bind the next
pass.** Stating that plainly, in the repo's own "what this voids" convention, is
half the value of this brief: the next agent would otherwise read that warning and
conclude length is off the table, which is how the page got here.

What survives from that brief, and still binds:

- **Adding air was ruled out by measurement, and still is.** The problem was never
  scarce white space and it is not now. Do not add spacing.
- **Structure beat decoration.** Nine eyebrows and four ticket rules cut the worst
  run 25% for +4.3% height. That trade is the model. Icons were declined for a
  written reason; that reason has not changed.
- **The acceptance test is "can a reader find their way," never "is the word count
  lower."** Still true. But at 37.9 viewports, "find their way" now includes "get
  to the end," and that is new.

---

## 4. Workstreams

**STATUS: WORKED 2026-09-09.** A and the height lever shipped. B and C as
originally written were withdrawn - see the correction in section 1; the runs
they were written to fix do not exist. Section 6 is the record.

### A. Set the mobile budget, in writing - SHIPPED

**Problem.** Thirteen sections each won their place against a local argument. No
argument was ever made about the total. There is no number anyone is building
against, which is why the page grew 212% without anyone noticing.

**Done.** The budget is in `src/pages/index.astro`'s header comment, in the same
voice as the entries above it: a 30,000px ceiling at 390x844, the rule that a new
section names what it displaces, and the four-point growth series so the next
reader can see how the ceiling came to be needed.

### The height lever - SHIPPED

`#demo-guide` was 2,975px, 3.5 mobile viewports. It is the one stop on the page
that is explicitly an ALTERNATIVE to something the reader has just been given -
its own heading says "without pressing play" - so it is the only section that can
be folded without taking an argument off the page. It is now a native `<details>`,
served open and closed by script under 52rem.

### B and C - WITHDRAWN, NOT DECLINED

They were written against a metric that could not see the page's own ticket rules
and markers. The sections they named (`#problem`, `#who`, `#sage`, `#access`,
`#alternatives`) have no run over 900px and need no restructuring. Nothing was
declined on judgment; the defect was measured out of existence.

### D. Re-run the whole measurement and record it - SHIPPED

In `index.astro`'s header, and in section 6 below.

---

## 5. The harness

The measurement scripts used for this brief are throwaway; the protocol is not.
Reproduce with the repo's existing pattern rather than a new dependency:
`scripts/verify-homepage.mjs:1-45` boots system `chromium` over raw CDP and is the
boot sequence to copy. `playwright-core` is in `devDependencies` if preferred.

The protocol, so numbers stay comparable to 2026-08-26 and to this brief:

1. `npm run build`, then `npx astro preview --port 4321`. Measure the built site,
   never the dev server.
2. 390x844 and 1440x900. `Emulation.setEmulatedMedia` with
   `prefers-reduced-motion: reduce`.
3. Force every reveal before measuring:
   `document.querySelectorAll('[data-reveal]').forEach(e => { e.classList.remove('reveal-pending'); e.classList.add('revealed'); })`
4. Report, at both widths: total height; per-section height, word count and media
   count; the longest run holding no `img`, `video`, `svg`, `hr` or `picture`;
   `document.documentElement.scrollWidth` against the viewport width; and every
   interactive target under 24px and under 44px.

Then `npm run check` and `npm run build` - the claim check and the thirteen page
contracts are the guard that a structural pass did not silently change a claim.

---

## 6. Record: what was done, 2026-09-09

| | before | after | |
|---|---|---|---|
| height @390 | 31,999px | **29,088px** | -2,911px, -9.1% |
| mobile viewports | 37.9 | **34.5** | -3.4 |
| height @1440 | 22,017px | **22,017px** | unchanged |
| horizontal overflow | none | none | |
| page errors | none | none | |

**Desktop is byte-identical.** The summary is `display: none` above 52rem and the
script never closes the guide there, so that width renders exactly as before.

**What shipped, three changes.**

1. **`#demo-guide` is a phone-only disclosure** (`SeeItRun.astro`). Served
   `<details open>`; a bundled script closes it under 52rem. No-JS, or the script
   failing, leaves the guide fully readable - the failure direction is "too much
   content", never "missing content". The CSP (`script-src 'self'`) forbids the
   inline no-flash trick, so the collapse happens after paint; it is invisible
   because the guide begins 2,626px down, three viewports below the fold.
   Verified at 390, 768 and 1440: closed by default on the first two, open on the
   third, the summary is a 78px row (clearing WCAG 2.5.5 AAA's 44px, not just
   2.5.8 AA's 24px), it takes a visible focus ring, reopening restores the exact
   prior height, and the jump link opens the guide before the anchor resolves.

   **The no-JS claim was tested, not asserted.** Rendered at 390 with script
   execution disabled: the `<details>` carries `open` in the DOM, all eight steps
   render, content height 32,268px. Worth saying plainly because every other test
   here ran WITH JS and would have passed identically had the built HTML lost the
   attribute - the whole design rests on the served markup, so the served markup
   is what was checked.

2. **The jump link is hidden under `lg`.** It said "Follow the order in writing"
   one screen above a control that said the same four words. It stays in the
   served HTML for `check-dist.mjs` and stays visible at the widths where the
   guide is open by default.

3. **A stale claim was caught and fixed.** The guide's lede read "in six
   handoffs"; `guideSteps` holds eight, and has since 2026-09-06. The file header
   already recorded the correction, the prose did not, and the new summary was
   about to repeat it. Both strings now read `{guideSteps.length}` off the array,
   so neither can drift again. No guard in this repo counts steps against prose.

**One thing the first cut got wrong, kept here because it is the sort of thing
that ships.** The collapsed state first shortened the section's padding on both
edges. That moved the summary 32px DOWN at the instant of the click - measured at
390, top 383px closed against 415px open - which is the one piece of motion on
this page a reader's own finger is resting on. Only the bottom padding gives now.
Re-measured: 383px against 383px, zero shift. The collapse at load is invisible
because it happens below the fold; a shift on toggle would not have been.

**What was NOT done, and why.** No copy was cut. At 34.4 viewports the page is
still long, and section 1 shows the remaining cost is 4,388 words rather than any
structural defect. That is an editorial pass with a `story-content` tracker, which
is a different acceptance test from this one. The budget in `index.astro` is what
will force that conversation the next time a section wants in.

---

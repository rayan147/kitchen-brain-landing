# CostCook Landing Redesign Brief

**Date:** 2026-08-21 · **Repo:** `/home/rayan147/kitchen-brain-landing` · **Scope:** `/` (homepage) primarily, `/features` `/pricing` `/contact` for consistency only.

This document is an executable prompt. Hand it to an implementing agent whole, or work
it top to bottom yourself. Everything in §5 is verified against the tree at commit
`45acb9f`, not inherited from the 2026-08-01 audit.

---

## 0. How to use this prompt

> You are redesigning the CostCook landing page. Read `CLAUDE.md`, `DESIGN.md`, and
> `src/styles/global.css` first. Then follow §6 (target architecture) in the order given
> by §9. Do not begin editing until you have run §5's measurement step and confirmed the
> numbers still hold. Every change must satisfy every invariant in §7. Verify per §10
> before reporting done.

**Two things this brief is not.** It is not a licence to restyle: the palette, type, and
kitchen-ticket motif are locked (§1). It is not a copy rewrite for its own sake: every
sentence that changes must survive the truth pass (§7.1).

---

## 1. Decisions locked before work starts

| Decision | Value | Consequence |
|---|---|---|
| **Primary conversion** | Start the 15-day free trial (`cta` in `src/lib/site.ts`) | One primary action on the page. `demoCta` is demoted to a secondary assist for the hesitant buyer. `CLAUDE.md`'s "Single goal: book 15-minute demos" is stale and must be updated in the same PR. |
| **Design system** | Locked | Restructure, hierarchy, copy, proof placement, and CTA discipline are in scope. Palette, fonts, ticket motif, light-mode-only are not. |
| **Reference set** | Linear, Stripe, Loom, Notion | Borrowed **structurally**, never visually. See §2. |
| **Governing framework** | Krug, *Don't Make Me Think* | Operationalized as pass/fail tests in §3. |

---

## 2. What we take from each reference, and what we refuse

This is the most important section to get right. `CLAUDE.md` names as **anti-references**:
"generic AI-gradient SaaS pages, dashboard screenshots in perspective frames, dark
developer-tool landing pages." That is a fair description of how three of the four
references *look*. So we take mechanics, not surfaces.

### Linear — **one idea per viewport, and ruthless subtraction**

- **Take:** every scroll stop makes exactly one claim, in one heading, with one piece of
  evidence. Nothing competes. Copy is cut until removing another word breaks the meaning.
  Optical alignment: things that should line up actually line up, across sections, at every
  breakpoint.
- **Take:** the nav is nearly empty. Linear does not list its own page sections in its header.
- **Refuse:** the dark chrome, the glow gradients, the animated abstract geometry. We are
  cream paper and ink.

### Stripe — **credibility through the real artifact, plus progressive disclosure**

- **Take:** Stripe's landing page shows *actual code*, because the code is the product and a
  developer can verify it on sight. Our equivalent is the shop list, the prep sheet, and the
  plate cost with real numbers on it. Show the artifact the buyer already recognizes.
- **Take:** depth is available but never in the way. The homepage stays a billboard;
  `/features` carries exhaustiveness. That structure already exists and is correct.
- **Refuse:** the perspective-tilted browser chrome and the multi-column developer-doc density.

### Loom — **the demo is the proof, and it must look obviously playable**

- **Take:** placement. Loom puts the artifact of the product doing its job high, not at the
  bottom as an afterthought. Our 1:51 tour currently sits fourth of six.
- **Take:** the play affordance reads as a play affordance at a glance, with duration visible
  before the click, so the cost of the click is known.
- **Refuse:** the floating-bubble avatar aesthetic and the auto-playing background loop.

### Notion — **name the reader's exact situation, in their words**

- **Take:** the use-case specificity. Notion's tiles say "here is your literal job."
  Our version: "180 guests moved to 240 on Thursday," not "flexible event management."
- **Take:** warmth without jokes. Already the brand's strongest asset.
- **Refuse:** the illustration-forward tile grid and the multiplying template gallery.

**One-line synthesis for the implementer:** *Linear's discipline, Stripe's proof, Loom's
placement, Notion's specificity, rendered as a kitchen ticket on cream paper.*

---

## 3. Krug, as tests you can fail

Each of these is a pass/fail check on the finished page. Cite the test number when you
justify a change.

1. **K1 · Self-evident beats self-explanatory beats needs-explanation.** For every element,
   grade it. Anything landing on "needs explanation" either gets cut or gets a label.
2. **K2 · The trunk test.** Screenshot any point in the page, cold. In under five seconds
   a stranger must answer: what site is this, what section am I in, what can I do here,
   what do I do next. Run this at three scroll positions, not one.
3. **K3 · Billboard design 101.** The page is read at 40mph, not studied. Conventions where
   conventions exist. Visual hierarchy that mirrors the logical hierarchy. Obvious clickable
   things. Noise eliminated, not merely reduced.
4. **K4 · Omit needless words. Then omit half of what is left.** Happy talk gets deleted
   outright. Instructions get compressed to nothing.
5. **K5 · Don't make me hunt for the next click.** At every scroll depth, the next action
   is visible or is one predictable scroll away, and it is always the *same* action.
6. **K6 · Every question mark is a defect.** "What is this number?" "Is that a screenshot
   or a diagram?" "Do I click Start or book a demo?" Each one is a bug with an owner.
7. **K7 · Goodwill reservoir.** Every ambiguity, every dead end, every unanswered objection
   spends goodwill the cold-email arrival had very little of to begin with.

---

## 4. Who is on the other end

From `CLAUDE.md`, restated because the implementer must hold it while cutting:

Owner-operator caterer, 1 to 15 staff. On a phone. Possibly mid-shift with wet hands.
Arrived skeptical from a cold email. Has been burned by a big-platform funnel before.
Has roughly **sixty seconds** to decide whether to spend fifteen minutes. Will believe a
number they can check against their own sheet tonight, and will disbelieve any sentence
that sounds like it came from a marketing department.

---

## 5. Verified current state (2026-08-21)

Confirmed by reading the tree today. The 2026-08-01 audit's Critical #1 (the "kitchen
brain" h1) is **already fixed**; do not re-report it.

**Homepage is 6 sections**, in `src/pages/index.astro`:

`Hero` → `TheProblem` → `CustomerOutcomes` → `SeeItRun` → `BuiltForKitchens` → `BookDemo`

**Step zero for the implementer:** the audit's page-height figures (15,532px / 18.4 mobile
viewports) predate the cut to six sections and are stale. Re-measure before citing any
number. Serve a production build and record heading offsets at 390×844.

### Verified findings

| # | Sev | Krug | Evidence | Defect |
|---|---|---|---|---|
| **F1** | **P0** | K5, K6 | `Hero.astro:26` "Start CostCook" + `:36` "Watch the 1:51 product tour" + `:40` "Questions? Contact Rayan"; `SiteNav.astro` "Start"; `SeeItRun` 1 CTA; `CustomerOutcomes:47` "See every shipped feature"; `BookDemo:29` "Book a 15-min demo" + `:33` phone; footer repeats demo + email + phone | **Six distinct next-actions on one page, and the closing section pushes a different one than the hero.** The page ends on "Book a 15-min demo" while the declared primary is trial signup. The reader is asked to choose a funnel. Violates `CLAUDE.md`'s own "One slot, one claim / every path to conversion points at one place." |
| **F2** | **P0** | K3, K5 | `SeeItRun` is section 4 of 6 | **The strongest proof asset on the page is below the point most phone readers stop.** The 1:51 tour is the single artifact that answers "is this real" without requiring trust. Loom's lesson: it belongs at position 2 or 3. **This one has a cost; see §6 Stop 3 before executing.** |
| **F3** | **P2** | K6 | `EveryFeature.astro:18` `<h1 id="everything-heading">`; `FeatureBridge.astro:19` `<h2 id="everything-heading">` | Duplicate DOM id across two components. **The `h1` itself is correct** and must stay: `/features` renders `Base` + `EveryFeature` and nothing else, so that heading is the page title. Do not demote it. The collision is latent (`FeatureBridge` is dead, F4) and disappears at step 9; rename one id only if you want it closed sooner. |
| **F4** | **P1** | K4 | 13 of 21 files in `src/components/sections/` are imported nowhere: `BuiltAround`, `CatalogSystem`, `CostTransparency`, `CostingChain`, `FeatureBridge`, `GuidedSetup`, `OrderOperations`, `PurchaseLoop`, `TheLoop`, `TheWorkflow`, `TheYield`, `WhatWeDo`, `WhyUs` | Roughly 1,000 lines of dead sections. Some contain the page's best writing (`TheYield`'s shallot-trim argument, `WhyUs`'s competitor answer). They were cut wholesale rather than mined. **Read all 13 before writing new copy.** `FeatureBridge` being dead also means `/features` has lost its intended entry point; the only link to it is a small text link at `CustomerOutcomes:47`. |
| **F5** | **P1** | K7 | `TheYield.astro` (234 lines, `used_in=0`) is the only place the trim/yield argument exists; it appears on no live page | **The most falsifiable claim the product owns is not on the site.** You bought five pounds of shallots and charged for the peeled four; CostCook moves the yield through *both* the cost and the quantity, from one function, so they cannot drift. Nothing a competitor says answers this, and the section's own source comments cite the code line by line. Its removal cost the page its sharpest argument. **Note:** the spreadsheet objection itself is *not* unanswered — `TheProblem`'s three moments are rebutted 1:1 by `CustomerOutcomes` immediately after. The August audit's 12.2-viewport gap was an artifact of the 21-section page and closed when the page was cut to six. Do not re-fix it. |
| **F6** | **P2** | K3 | `SiteNav.astro:11` `class="hidden lg:block"` on every nav item | **Below 1024px the site has no navigation at all**, just wordmark plus a "Start" pill. Defensible for a one-pager, but it means `/pricing` and `/features` are unreachable from a phone header. Pricing in particular is a question the buyer will have. |
| **F7** | **P2** | K4 | `nav` in `site.ts`: "The problem", "What changes", "Watch it work" | Three of six nav items are in-page anchors. Linear's lesson: a header that indexes your own scroll is noise. Keep destinations (Pricing, Features, Contact), drop the anchors. |
| **F8** | **P2** | K6 | `site.ts:15` `founderName: 'Rayan'` with `// TODO(owner): add your last name` | An unresolved TODO on a page whose entire pitch is founder credibility. A half-name reads as less accountable than a full one. |
| **F9** | **P2** | — | Terminology grep: `shopping list` ×10, `buy list` ×1, `prep sheet` ×4, `pack list` ×5 | Largely fixed since the August audit. **One** stray `buy list` remains. Normalize it and add a claim-check rule so it cannot come back. |

**Not defects, do not "fix":** LCP ~2.0s / CLS 0 / 243KB on a 4×-throttled build is good.
There is no performance case for cutting the page. Cut for comprehension only.

---

## 6. Target architecture

Seven scroll stops. **One claim each.** If a section needs two headings to make its point,
it is two sections or it is one section too many.

### Stop 1 — Hero · *the bad Thursday, and the one button*

- **Keep** the current `h1`: "When the guest count changes, the kitchen plan shouldn't
  start over." It is a falsifiable moment in the largest type. That is correct and hard-won.
- **Cut** the third paragraph (`Hero.astro:20-23`). Two paragraphs above a CTA is already
  one more than Linear would allow. Fold "see the food cost before you quote" into the
  first paragraph and drop the supplier-approval sentence; it is a Stop 5 idea.
- **Demote** "Watch the 1:51 product tour" to a quiet text link *below* the primary button,
  not beside it. Two things beside each other read as a choice (K6). One thing above another
  reads as a sequence.
- **Move** the risk-reducing microcopy up. Under the button, one line: what it costs, that
  the trial is free, that nothing installs. This is the page's most under-read asset and it
  currently lives at the bottom.
- **Keep** the ticket figure and its caption. It is the best element on the page.
- **Test:** K2 at scroll 0. A stranger names the audience, the job, and the next click.

### Stop 2 — The problem · *unchanged in substance, tightened in words*

`TheProblem`'s three moments are strong and specific. Apply K4 to the bodies only. Do not
touch the headings.

### Stop 3 — See it run · **promoted from position 4**

This is F2's fix. Loom's placement lesson: the proof of "it is real" must arrive before the
reader is asked to believe a list of outcomes.

**The cost, stated plainly, because the implementer needs grounds to push back.** Today
`TheProblem`'s three moments are answered point for point by `CustomerOutcomes` right after
them: old price → "bring the real price back"; rebuild four times → "change the count once";
margin after service → "quote with the food cost in front of you." Promoting the video
inserts 1:51 of footage between a problem and its rebuttal, and that adjacency is the best
structural asset the page has.

**RESOLVED 2026-08-21 by measurement, not by the trunk test this section originally
deferred to.** Promote. The arithmetic at 390×844:

| | Before | After | Delta |
|---|---|---|---|
| First pain → its answer | 942px (1.12 vp) | 1,546px (1.83 vp) | **+0.72 vp cost** |
| Proof video starts at | 3,155px (3.7 vp) | 1,897px (2.2 vp) | **−1.5 vp gain** |

The cost is real, not zero. But the pairing was never co-visible on a phone even before:
at 1.12 viewports the reader has already scrolled a full screen past the pain before the
answer appears. The move makes a non-adjacency somewhat worse rather than destroying an
adjacency that existed, and it buys twice as much on the element that settles "is this
real" for a cold-email skeptic. Bigger gain, softer loss.

**Void this trade if** `CustomerOutcomes` is ever rewritten so its answers stop mirroring
`TheProblem`'s pains one for one. Then re-measure.

**Already satisfied, do not rebuild** (verified in `SeeItRun.astro` today): the duration chip
reads "Watch · 1 min 51 sec" and is scripting-gated so no-JS playback is never covered; the
poster is the vendor-grouped shop list; `preload="none"`; the sr-only transcript is present
and matched to the footage. The four things that drift together (chip duration, transcript,
`aria-label`, hero link duration) are guard-pinned in `check-landing-claims.mjs`. If you
change the section, keep all four in sync.

**One thing to fix here:** `SeeItRun.astro:96` renders a third `cta` link on the page as
`btn-quiet`. Under F1's one-action rule, decide whether this section keeps a CTA at all;
if it does, it is a quiet link, never a second primary button.

### Stop 4 — What changes · *the outcomes, now earned*

`CustomerOutcomes` as-is, following the video rather than preceding it. Its numbered
`01/02/03` mono rail is good ticket-motif work; keep it.

### Stop 5 — The case has the skins on · **new, recovered from `TheYield.astro`**

F5's fix. One section, one claim: **the trim is charged where it happens, and it moves the
quantity as well as the money.** You bought five pounds of shallots and charged for the
peeled four. Nothing else on the market says this, and the reader can check it against their
own sheet tonight, which is the whole point (K7).

- **Source the copy from `TheYield.astro`, do not write it fresh.** That file's header
  comments cite the app code line by line (`ingredientLineQty()`, the 100 percent default,
  the five-event floor on learned yield). Those citations are what makes the section survive
  the truth pass.
- **Compress hard.** `TheYield` is 234 lines and three layers deep. Stop 5 is one claim, one
  paragraph, one piece of evidence. Layer one ("you set it, and you can always overrule it")
  carries the argument alone. Layers two and three belong on `/features`.
- **Keep the restraint line.** The product publishing the limits of its own inference is the
  strongest available argument that the rest of its numbers are honest. If one sentence of
  that survives the compression, make it that one.

**Constraints:** not a competitor comparison table. Not a second explanation of the
spreadsheet problem, which Stops 2 and 4 already handle. If this section cannot be made to
carry a claim neither of them makes, fold the shallot line into `TheProblem` as a fourth
moment and keep the page at six stops. Six good stops beat seven.

### Stop 6 — Built for kitchens · *provenance, where it belongs*

`BuiltForKitchens` unchanged in position. Provenance earns its place *after* the argument,
never in the largest type at the top.

### Stop 7 — Close · **rebuilt around the trial**

F1's fix. `BookDemo` currently closes the page on a different funnel than the hero opened.
Rebuild it:

- **Primary:** the same `cta` label and href as the hero and the nav. Identical wording.
  A different label for the same destination re-opens the question the hero closed (K5).
- **Secondary, quiet:** "Rather see your own menu run first? Book 15 minutes." referencing
  `demoCta.href`. Phone stays, one line, smallest type.
- The trial terms restate here in full: price, 15 days, $0 today, cancel anytime.

**Global CTA rule:** every primary button on the homepage renders `cta.label` verbatim from
`site.ts`. Zero exceptions. Quiet mid-page links may use shorter contextual labels only for
`demoCta`, per `CLAUDE.md` P5.

---

## 7. Invariants — a change that breaks any of these is rejected

### 7.1 Truth
- Every sentence traces to shipped app behavior. Unbuilt features stay off the page.
- `node scripts/check-landing-claims.mjs` passes.
- No claim is added that could not survive a fifteen-minute demo call.

### 7.2 Voice
- **No em-dashes in user-facing text** (PR #49). The brief itself is internal; the page is not.
- No stock SaaS phrasing ("in one click", "seamlessly", "supercharge").
- "Kitchen Brain" never appears in prospect-facing copy.
- One vocabulary per artifact: **shopping list**, **prep sheet**, **pack list**. Fix the last
  `buy list`.

### 7.3 Design system
- No color outside `@theme` in `src/styles/global.css`. No ad-hoc hex anywhere.
- **Type comes from the tokens, same as color.** No ad-hoc `text-[clamp(...)]`. Today
  `Hero.astro:11` hand-rolls a clamp instead of using `--text-display`, while `/pricing`'s
  `h1` and `EveryFeature`'s `h1` both use `text-h2`. That is three treatments for one
  semantic role. Page `h1`s share one treatment unless there is a stated semantic reason,
  and that treatment is `text-display`. If the hero's h1 genuinely needs a smaller ceiling
  than 4.5rem, change the token or add a second named role; do not inline a one-off.
- Fraunces display over Instrument Sans body. Light mode only.
- The ticket motif is the one repeated accent device: cream/softamber surfaces, dashed rules,
  mono micro-labels, the 1.5° tilt. No new decorative devices.

### 7.4 Accessibility (AA is the floor)
- Amber is decoration and large text only; `amber-deep` for anything small.
- Exactly one `h1` per page. Heading levels never skip. **Fix F3.**
- No duplicate DOM ids across components rendered on the same page.
- Focus rings follow element radius. Every primary control ≥44px.
- The sr-only demo transcript matches the footage.

### 7.5 Motion
- Transform and opacity only. Two registers: `.anim-enter`, `[data-reveal]`.
- Fully inert under `prefers-reduced-motion`.
- Nothing hidden from no-JS visitors. Keyboard focus snaps animations to final state.

### 7.6 Build
- `npm run check` passes (`astro check` + claim check).
- `npm run build` + `postbuild` pass.

---

## 8. Files you will touch

| File | Change |
|---|---|
| `src/pages/index.astro` | Section order (§6). `SeeItRun` position decided by the Stop 3 test; new Stop 5 section added. |
| `src/components/sections/Hero.astro` | Cut third paragraph, demote tour link, promote trial microcopy. Replace the inline `text-[clamp(...)]` with the display token (§7.3). |
| `src/components/sections/BookDemo.astro` | Rebuild around `cta`; demote `demoCta`. Consider renaming the file to match its new job. |
| `src/components/sections/SeeItRun.astro` | Decide its CTA under F1. Leave the chip, poster, transcript, and guards alone. |
| `src/components/sections/EveryFeature.astro` | **Keep the `h1`.** Only rename the `everything-heading` id if closing F3 before step 9. |
| **New** `src/components/sections/*.astro` | Stop 5, compressed from `TheYield.astro`. |
| `src/lib/site.ts` | Nav: drop in-page anchors, keep destinations (F7). Resolve `founderName` TODO (F8). |
| `src/components/SiteNav.astro` | Decide the sub-`lg` nav question (F6). At minimum surface Pricing on mobile. |
| `CLAUDE.md` | Update "Single goal: book 15-minute demos" to reflect the trial-first funnel. |
| `src/components/sections/` (13 files) | After mining: delete the dead ones in a separate commit. |
| `src/styles/global.css` | Only if a genuinely new semantic role appears. Adding a token is a decision, not a convenience. |

---

## 9. Execution order

1. **Measure.** Production build, 390×844, record heading offsets and total height. This is
   the before-number every later claim is measured against.
2. **Read the 13 dead sections.** Mine the copy before deleting anything.
3. **F1 — CTA unification.** Nav, hero, close. One label, one destination, everywhere.
4. **F2 — the `SeeItRun` position test.** Build both orders, run the Stop 3 test, pick one,
   record the reasoning.
5. **Stop 5** — recover the yield argument from `TheYield.astro`.
6. **Hero tightening** per §6 Stop 1, including the display-token fix.
7. **F8, F9** — the small correctness fixes. F3 closes itself at step 9.
8. **F6, F7** — navigation decisions.
9. **Delete dead sections**, separate commit.
10. **Verify** per §10.
11. **`CLAUDE.md`** update, same PR as step 3.

Steps 3 and 4 are independently shippable and carry most of the value. If the work stops
early, stop after step 4.

---

## 10. Definition of done

**Measured**
- Re-measure at 390×844. Report before and after height and section count.
- LCP, CLS, total transfer on a production build; no regression against 2.0s / 0 / 243KB.

**Krug tests**
- K2 trunk test at three scroll positions: 0, 50%, 90%. Write the answers down.
- K5: count distinct next-actions on the homepage. **A next-action is any in-content link or
  button that leaves the page or opens a booking flow**: primary buttons, quiet text links,
  `tel:` and `mailto:` links. Site nav and the footer link block are excluded from the count;
  in-page anchors are excluded. By that definition the page has **six** today (hero Start,
  hero tour link, `CustomerOutcomes` → `/features`, `SeeItRun` Start, `BookDemo` demo,
  `BookDemo` phone). Target: **one primary, repeated verbatim, plus at most two quiet
  secondaries.**
- K6: list every question mark you can still find and either fix or justify each.

**Browser verification** — 1440×900, 1280×800, 1024×768, 768×1024, 390×844
- No horizontal overflow, no clipping, no console errors beyond the known
  `/_vercel/insights/script.js` 404.
- Keyboard: tab through the whole page; focus is always visible and never trapped.
- `prefers-reduced-motion: reduce`: all motion inert.
- JavaScript disabled: no content hidden.
- 200% text zoom: nothing overlaps.

**Checks**
- `npm run check` and `npm run build` pass.
- Contrast spot-check on every new text-on-surface pairing, against the ratios annotated in
  `global.css`.

**Report** — lead with what was implemented and measured. Separate verified facts from
inferences. Name anything left undone and why.

---

## 11. Out of scope, and open questions

**Out of scope:** palette or typeface changes; dark mode; new proof screenshots (unless a
current asset is found broken); anything requiring a change to the app itself; `/contact`
beyond consistency.

**Open, and worth resolving with three real buyers before the next iteration** (carried
forward from the August audit, still unanswered):

1. What did you look at last time you tried to fix costing? *(replaces the page's guess at
   its competitive set)*
2. If I asked for your recipes right now, what would you send me? *(the data-entry promise
   assumes a photographable binder exists)*
3. Walk me through the last time a client changed the guest count. What did you have to redo?
   *(validates the current `h1`)*

---

## 12. Execution record — 2026-08-21

Implemented in this repo the same day the brief was written. Verified facts below are
measured, not asserted.

### Measured, before and after (390×844, production build)

| | Before | After |
|---|---|---|
| Page height | 5,970px (7.1 viewports) | 7,116px (8.4 viewports) |
| Scroll stops | 6 | 7 |
| Proof video starts at | 3,155px (3.7 viewports) | 1,897px (2.2 viewports) |
| Distinct next-actions | 6 | 1 primary (repeated verbatim) + 2 quiet secondaries |
| Primary CTA destinations | **2 different ones** | 1 |
| Page `h1` type treatments | 3 | 1 |

The page got **taller**, deliberately: §5 F5's yield section was added back. The August
audit's 18.4-viewport figure was stale by a factor of 2.6, which is why §5 made
re-measurement step zero.

### Done

- **F1 — CTA unified.** Hero and close now render `cta.label` verbatim at the same href.
  The close section (`BookDemo.astro` → `StartHere.astro`) previously shipped a second
  `btn-primary` pointing at the booking calendar, so the page opened and closed on
  different funnels. `demoCta` survives as one quiet link. Hero's contact link and
  `SeeItRun`'s duplicate Start link were removed. Guarded: `check-landing-claims.mjs` now
  fails the build if either primary drifts or if the close ships the demo as a primary.
- **F2 — `SeeItRun` promoted** to position 3, and the question **closed by measurement**
  rather than left as an A/B. It cost 604px (0.72 viewports) of pain→answer recall distance
  and bought 1,258px (1.5 viewports) of earlier proof. The pairing was 1.12 viewports apart
  before the move, so it was never co-visible at 390px in the first place. Arithmetic and
  the void condition are recorded in `index.astro`.
- **F5 — yield section recovered.** `TheYield.astro` cut 234 → 86 lines and imported. Only
  the ledger-backed claim survived: the USDA reference chip and learned-yield inference have
  no row in `docs/release-claim-ledger.md`, so they came off the page rather than onto the
  ledger. That is the truth pass doing its job.
- **F4 — 12 dead sections deleted** after mining. F3's id collision resolved with them.
- **F6/F7 — nav rebuilt.** In-page anchors dropped; Pricing now reachable from a phone
  header for the first time.
- **Type role unified.** All four page `h1`s use `text-display`; the token absorbed the
  hero's curve and the inline `text-[clamp(...)]` is gone.

### Found while executing, not in the brief

- **`/features` had an h1→h3 heading skip** at every viewport. Group titles are now `h2`.
- **`btn-quiet` claimed a 44px touch target in its own comment and computed to 40px.**
  `padding-block` 0.625rem → 0.75rem.
- **`btn-primary`'s press transform was not gated** under `prefers-reduced-motion`, against
  invariant §7.5. Now gated.
- **Header overflowed at 200% zoom** once Pricing became always-visible. Header and nav list
  now wrap; verified clean at 320px, the WCAG 1.4.10 reflow target.
- **"then$49/month"** shipped glued for one build: Astro collapses a newline placed before an
  interpolation. Now scanned for across all four pages.
- **F9 was a false positive.** The `buy list` grep hit matched inside "Automatic rebuy list",
  a genuinely different artifact. Terminology was already clean.

### Verification run

- `npm run check` (astro check + claim guard): 0 errors, 0 warnings, 0 hints. Guard passed.
- `npm run build` + `postbuild`: pass.
- 4 pages × 5 viewports (1440×900, 1280×800, 1024×768, 768×1024, 390×844): no horizontal
  overflow, no duplicate ids, exactly one `h1` per page, no heading skips, no console errors
  beyond the known `/_vercel/insights/script.js` 404 (confirmed by network capture to be the
  only non-2xx; that script exists in production).
- JS disabled: no content hidden. Rendered text 5,816 chars vs 5,837 with JS.
- `prefers-reduced-motion: reduce`: zero animating elements.
- **Reflow (WCAG 1.4.10):** clean at 320px (the requirement), and still clean at 280 and
  240. A 1px overhang appears only at a 195px viewport, which is 200% zoom on a 390px phone
  and far below anything WCAG asks for. Measuring the same thing via `body.zoom = 2` reports
  a 1.7px overhang on the entire content column at once, which is a rounding artifact of the
  non-standard `zoom` property rather than a layout defect. Neither is a finding; both are
  recorded because two of the check scripts disagreed and the disagreement was tolerance,
  not behavior.
- Keyboard: 14-stop tab walk, focus visible at every stop, no traps.
- No em-dashes in rendered copy on any of the four pages.

### Closed on 2026-08-21, second pass

- **F8 — `founderName` is now `Rayan Ramirez`**, owner-supplied. It signs the provenance
  section and its image alt. The CTAs stay first-name ("Contact Rayan") deliberately: that
  is the chef-to-chef register a reader replies in. Byline verified on one line at 390, 768,
  and 1440. No `TODO(owner)` remains in `src/lib/`.
- **§6 Stop 3 resolved by measurement.** See above.

### Still left undone, and why

- **Section 11's three buyer questions** remain unanswered. They need three real caterers,
  not a build.
- **`Base.astro`'s Vercel Analytics TODO** is untouched and out of scope; it is the source
  of the known local 404.

### A note on where evidence came from

Every verification number in this record was taken against a **production build** (`astro
build` → `dist`, served on :4399). The `docker compose` environment on :4321 runs `astro
dev` and exists for eyeballing the page. Do not cite it as production evidence: dev serves
unminified CSS, no `postbuild` check, and different asset URLs.


---

## 13. Third pass — repositioning, 2026-08-21

Reviewer feedback: the page did not read like the named references, the hero screenshot was
ugly and badly placed, and **nobody could tell what problem it solves**. The scope is not
quoting; it is the whole manual chain. A product cheat sheet was supplied as the source.

### The diagnosis

The page was arguing a **narrow claim in its widest slot**. The hero's cropped
quoted-vs-today panel proved that a confirmed quote holds its price, which is a fine claim
and the wrong one to lead with: a reader who cannot yet say what the product *is* has no use
for a guarantee about its edge case. Meanwhile `TheProblem`'s three moments all sat in the
front half of the chain (price, order math, margin), so the page read as a quoting tool even
though the product runs to purchase orders, receiving, and inventory.

### What changed

- **The hero screenshot is gone, replaced by a drawn loop** (`src/components/LoopBand.astro`):
  `PRICE IN → COST IT → ORDER → SHOP → PREP → PACK`, with a return path labelled `RECEIVE`.
  This is the Stripe lesson applied properly: show the mechanism, not a crop of one screen.
- **The six stops are a condensation of `src/lib/workflow.ts`'s fourteen, never a different
  chain.** The mapping is written into the component header. `workflow.ts` was already the
  repo's canonical loop and was sitting unimported; a hero diagram that contradicted it would
  have been worse than none. Note this deliberately does **not** copy the cheat sheet's
  `Ingredient → Sub-recipe → Dish → …` chain, which is a data-model story and omits "price it
  wrong and it says so", which is the sale.
- **Layout fixed at the cause.** `grid items-center lg:grid-cols-[7fr_5fr]` vertically centred
  a short figure against a much taller text column, which is exactly the reported "too much
  margin, not centered". There is no side column now: one centred measure, then a
  full-container band.
- **The headline names the chain:** "Cost it, buy it, prep it, pack it. Enter the numbers
  once." The lede no longer re-lists the steps the band draws; saying it twice pushed the
  drawing below the fold on a phone.
- **`TheProblem` went from three moments to four**, adding "You retype the list to buy it"
  (the purchase order, the dock checklist, the short delivery) so the problem statement
  covers the same ground the product does. Order now walks the same direction as the band.
- **`CustomerOutcomes` went to four to match**, adding "Send the buying without retyping it"
  (RC-22, RC-26, RC-27). This was **required, not cosmetic**: `index.astro` records the 1:1
  pairing as the condition that keeps the `SeeItRun` promotion valid, so adding a pain
  without its answer would have silently voided a documented decision.

### The claim that could not ship as stated

The reviewer's words were "we price and automate the whole workflow". **"Automate" cannot go
on this page**, and `check-landing-claims.mjs` already forbids `handles it automatically`,
`no data entry`, and `nothing is re-keyed` because someone overclaimed here before. The cheat
sheet itself agrees: invoices "want a PDF, and I key the awkward ones by hand", extracted
values are "proposals, not saved catalog facts", price changes are "never silently applied".

The honest claim is **connection, not automation**: enter it once and the same numbers run
the chain. That is what the band and the headline say, and the return path says explicitly
"You approve it; nothing changes behind your back." `LoopBand.astro` was added to the guard's
`surfaceFiles` so its copy is scanned like every other surface.

### Measured

| | Pass 2 | Pass 3 |
|---|---|---|
| Page height | 7,116px (8.4 vp) | 7,704px (9.1 vp) |
| Problem → answer pairs | 3 | 4 |
| Hero side column | 5fr, mis-centred | none |

Heading-only read now opens on the chain rather than on a quote guarantee:

> Cost it, buy it, prep it, pack it. Enter the numbers once. → The spreadsheet works until
> the job changes. → Follow one 180-guest wedding from quote to shelf. → One order becomes
> the plan the whole kitchen can run. → The case has the skins on. → Built by a chef. Set up
> with your real work. → Put one real order through it.

### Verified

`npm run check` and `npm run build` pass. 4 pages × 5 viewports clean. Reflow clean at 320,
280, and 240px. No-JS: nothing hidden. Reduced motion: zero animating elements. No horizontal
overflow anywhere.

### Deliberately not done

- **A "three cost numbers" section** (theoretical food cost vs estimated buy cost vs actual
  spend). It is the most Stripe-like material in the cheat sheet and it **is** ledger-backed
  at **RC-30**, so it can ship. It was not added because it is a fifth thing beyond the four
  raised, and the page is already 9.1 viewports. Best home is probably `/features`, or the
  homepage if it replaces something.
- **A full 14-step loop section** from `workflow.ts`. The old `TheWorkflow.astro` rendered all
  fourteen with screenshots and was a large part of the original 18-viewport page. The band
  now carries the chain at hero grain and `SeeItRun` carries it as footage.
- **`public/proof/v2-hero-money-mobile.png` is now unreferenced.** Left in place rather than
  deleted; it is the asset to reuse if the quote-freeze claim gets its own section.

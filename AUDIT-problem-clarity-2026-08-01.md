# CostCook Landing — Problem-Clarity Audit

**Target:** `http://localhost:4321` (Astro dev, container `kitchen-brain-landing-site-1`)
**Date:** 2026-08-01 · **Source:** `/home/rayan147/kitchen-brain-landing`

---

## 0. CONTEXT provenance

The CONTEXT block arrived blank. I asked rather than guessed, and got three of five answers:

- **Buyer:** owner-caterer, 1–5 staff
- **Status quo:** all four — spreadsheet, gut feel, notebook+calculator, an existing food-cost tool
- **Price:** not decided yet

**Still unstated:** who you think you compete with, and your unpolished trade-show sentence. Findings
that would turn on those two are marked `[unresolved-context]` rather than asserted. I did **not**
substitute `PRODUCT.md` / `CONTEXT.md` for your answers — those are the same source the page was
written from, so using them would make every gap vanish by construction. I use them only as evidence
of the product's internal glossary (Pass 3).

---

## 1. Verdict

**Partly — and the gap is one of sequence, not substance.** This page states its problem better
than most B2B software pages ever manage: "Every order is a night of arithmetic," the shallots-with-
skins-on trim example, and "somebody broke a formula last spring" are specific, falsifiable, and
unmistakably written by someone who has done the job. The single reason it underperforms is that
**the fold spends its largest type on category and provenance ("The kitchen brain for caterers.
Built by a chef, not a software company") and asks for the demo at 539px — 780px before the page
names a problem at 1319px.** The page earns trust brilliantly; it just bills for it first.

---

## 2. Capture manifest

| Artifact | Status | Build |
|---|---|---|
| `mobile-fold.png` / `mobile-full.png` (390×844 @2x, touch) | ✅ viewed | dev |
| `desktop-fold.png` / `desktop-full.png` (1440×900) | ✅ viewed | dev |
| `mobile-proof-insitu.png`, `mobile-problem.png`, `mobile-hero2.png` | ✅ viewed | dev |
| `headings.json` (30 headings, offsets) | ✅ | dev |
| `ctas.json` (25 mobile / 25 desktop) | ✅ | dev |
| `copy.txt` (291 lines) · `copy-nojs.txt` (289 lines) | ✅ | dev |
| `images.json` + `img-scale.json` (6 img, 3 svg, 0 css-bg) | ✅ | dev |
| `a11y.json` · `taps.json` · `sticky.json` · `mobile-overflow.json` | ✅ | dev |
| `meta.json` | ✅ | dev |
| `perf.json` | ✅ | **production** |
| Source proof assets read directly from `public/proof/` | ✅ | n/a |

**Failures and deviations, stated plainly:**

- **First production build failed** (`EXIT=1`): `dist/_astro` is **root-owned**, written by the Docker
  container — `rolldown` hit `Permission denied (os error 13)`. I did not `chown` your repo. I
  rebuilt with `--outDir` into the scratchpad and served that on `:4399`. **All perf numbers below
  come from that production build**, CPU-throttled 4× with Fast-3G emulation at 390×844. No
  performance number in this report comes from the dev server.
- Playwright was **not** installed into the repo or `/tmp/lp-audit`; the repo's cached Chromium was
  reused from a scratchpad script.
- `deviceScaleFactor: 2` makes `images.json` report `scale: 0.45` for the proof shots. That is the
  expected @2x ratio, **not** a downscaling defect — verified visually. Not reported as a finding.

---

## 3. Blink test transcript (Pass 0, from `mobile-fold.png` only, unrepaired)

> **What does this thing do?** Something with catering and money. There's a green button and a big
> serif headline telling me it was built by a chef. Below the headline it says I type in a menu and
> a guest count and it gives me a shopping list, prep sheets, and what the plate costs. OK — *that*
> sentence I understand completely. That's the clearest thing here.
>
> **Who is it for?** Small caterers and meal-prep kitchens. It says so in orange caps at the top. No
> ambiguity. Good.
>
> **What problem does it solve, as a specific bad moment in someone's week?** I don't know. Nothing
> above the fold describes anything going wrong. It tells me what it *does* and who *made* it, but
> not what happens to me if I don't have it. There's no bad Tuesday here. I'm being sold a capability,
> not rescued from a moment.
>
> **What am I supposed to do next?** Book a 15-minute demo. It's said twice before I've scrolled —
> once in the header, once under the copy — with the same words both times. I get it.
>
> **What would I have to believe?** That typing my menu in is less work than what I do now. And I
> can't see a price, so I'd have to believe it's worth a call to find out. "Built by a chef, not a
> software company" is doing a lot of persuading before I've agreed there's a problem.
>
> **Also, honestly:** "The kitchen brain for caterers" — what's a kitchen brain? That's not a thing I
> have or want. I know what a prep sheet is. I don't know what a kitchen brain is.

**What resolved the confusion:** the subhead — *"Type in the menu and the guest count. It hands you
the shopping list, the prep sheets, and what the plate actually costs."* Nothing else above the fold
did. **The `<h1>` did not resolve it; the paragraph under it did.** On mobile, the sample ticket
card that would have shown the whole promise visually is cut off at the fold (starts ~1390px); on
desktop it sits fully in view at 1440×900 and is the single best element on the page.

---

## 4. Scorecard

| Dimension | Score | Why |
|---|---|---|
| Problem clarity | **4** | "Every order is a night of arithmetic" is excellent — but lands at 1319px, 1.6 viewports down |
| Problem specificity (falsifiable?) | **5** | The shallot-trim example is concretely refutable: a caterer who portions pre-peeled produce can say "not my problem" |
| Audience clarity | **5** | "Small caterers & meal-prep kitchens" in the eyebrow; zero drift to "restaurants" or "food businesses" (0 occurrences of each) |
| Problem→solution traceability | **3** | Zero orphan features (rare) — but the spreadsheet pain is answered **12.2 viewports** later, and the data-entry promise assumes a binder the buyer may not have (§4b) |
| Terminology consistency | **2** | shopping list (5) / buy list (2) / "Shop list" in-product; prep sheet (4) / prep list (4); pack list (1) / van sheet (1) |
| Objection handling | **4** | Spreadsheet and data-entry objections answered exceptionally; "my recipes are in my head" unanswered |
| Scannability / hierarchy | **3** | Heading-only read holds up well, but 15,532px = **18.4 mobile viewports**, incl. a 4,363px stretch with no `h2` |
| Proof | **3** | Real product screenshots with superb alt text — undermined by a text collision in the flagship asset and a "304.9 each" quantity |
| Mobile & accessibility | **5** | 0 contrast failures, 1 `h1`, skip link, landmarks, no sticky chrome, no horizontal overflow, motion gated on `prefers-reduced-motion`, survives JS-off (289/290 lines) |

---

## 4b. Pass 2 — Problem → solution traceability

Distances from `headings.json` offsets (mobile, 390×844; one viewport = 844px).

| Stated problem | Section that answers it | Distance |
|---|---|---|
| *"The math is done by hand, every time"* (@1616) — scale recipes, re-do it when the count moves | `04 · ONE NUMBER MOVES — Change the count, everything follows` (@3451) | **1,835px** (2.2 viewports) |
| *"And the cost at the end is a guess"* (@1887) — trim isn't charged | `01 · PLATE COST — What the plate actually costs` (@2713) | **826px** (1.0 viewport) |
| *"The thing holding it together is fragile"* (@2133) — one person's spreadsheet, broken formula, sauce written in three places | `WHY US → About that spreadsheet` (@12394) | **10,261px** (12.2 viewports) |

**Orphan features:** none. Every one of the five `WHAT IT DOES` items and all eight `HOW FAR IT GOES`
steps trace to a stated pain. That is genuinely rare and is the strongest structural signal on the
page that the positioning came before the feature list, not after.

**Orphan problem — one, and it undercuts the page's best section.** The data-entry promise
(`02 · NO DATA ENTRY`, @2950: *"Send photos of your recipe cards"*; and `:234`: *"Text me photos of
your recipe binder, sauce splatter and all"*) assumes a **photographable artifact exists**. For an
owner-caterer with 1–5 staff — your stated buyer — recipes are frequently in their head or in
fragments, not in a binder. The page raises "you don't type your binder in" as its killer objection
answer and never addresses the reader who has no binder to photograph. This is the page's most
persuasive claim resting on an unexamined premise. *(Cheapest test in §8, question 2.)*

**Distance failures — one, and it's the big one.** The spreadsheet pain is stated at 2,133px and
answered at 12,394px: **12.2 viewports apart**. `THE SPREADSHEET` names the single objection your
stated status-quo answer says every buyer holds ("a spreadsheet that mostly works"), and the rebuttal
(*"This replaces it"*) sits at 80% scroll depth. The two belong in the same screen.

**Ambiguous referents.** One found: `h3` *"Guest count in"* (@10304) followed by *"Change it Thursday
night and **everything below** changes with it"* (`:182`). Reading A — the order's downstream sheets
(shop, prep, pack), which is intended. Reading B — the remaining sections of the web page, which is
what "below" literally denotes in a scrolling document, and this line sits mid-page with five more
sections under it. Fix: *"and every sheet under it changes with it."*

---

## 5. Findings

Capped at the five that decide whether this page converts.

| # | Sev | Evidence | What breaks | Reviewer | Tag | Fix |
|---|---|---|---|---|---|---|
| 1 | **Critical** | `headings.json`: `h1` @191 = *"The kitchen brain for caterers. Built by a chef, not a software company."* · `scroll.json`: hero CTA @539 · first problem `h2` @1319 | The CTA arrives **780px before** the page names a problem. Krug: the page asks before it earns. And "kitchen brain" is the *internal project name* — verified: `CLAUDE.md:1` reads `# Kitchen Brain / CostCook`, and the booking URL is `calendly.com/rayan-costcook/**kitchen-brain**-demo`. That is builder vocabulary reaching the buyer. A caterer says "prep sheet," never "kitchen brain." Half the largest type on the page is spent on who built it, deployed before the reader has conceded a problem exists. | Positioning Critic + Chef | `[measured]` + `[heuristic]` | See §6 rewrite A. Concretely, in `src/components/sections/Hero.astro:26` replace the `h1` text with:<br>`Every order is a night of math. Do it once, at the counter.`<br>and move the provenance claim to the eyebrow, `Hero.astro:24`:<br>`Back-of-house software for small caterers & meal-prep kitchens · built by a chef` |
| 2 | **Critical** | `public/proof/menu-mobile.png`, top 100px: the app header renders `[icon] $ 11.75  ⊙ CostCook  Catalog` with **"Catalog" overlapping "per guest"**, and an orphaned `$ 11.75` fragment fused to the logo | This is the **first proof image** on a page whose entire argument is "the number never lies" and "shows its work." A skeptical operator's first look at the actual product shows colliding text and a broken toolbar. It reads as a UI bug, and it silently contradicts the page's core trust claim. | Senior Product Engineer + Chef | `[measured]` | Re-shoot `menu-mobile.png` **scrolled to top** (offset 0) so the sticky app header is not overlapping content mid-scroll. The other four assets were captured this way and are clean. Do not crop — recapture; the collision is baked into the 780×1688 source. |
| 3 | **Major** | `images.json` alt for `money-mobile.png`: *"Revenue is $3,300.00, likely food cost is $1,354.04, and cost per guest is $6.77… charge at least $22.57"* — but the image shows a **Quoted-vs-Today panel** (`$6.77` → `$6.96`, `+2.8% rise`), a Shop/Prep/Pack tab bar, and the start of the shop list. **No `$3,300`, `$1,354.04`, or `$22.57` appears anywhere in the image.** | **WCAG 1.1.1 (Non-text Content).** The alt does not serve an equivalent purpose — a screen-reader user is given a confident, numerically precise account of a screen that sighted users are not looking at. On a page whose thesis is "the number never lies," the accessible version of the proof states four numbers the proof does not contain. | UX/IA Designer | `[measured]` | Rewrite the alt to describe **what is in the image**: `alt="An order summary for the Rodriguez backyard wedding, 200 guests, confirmed with quantities and prices frozen. Quoted 2026-08-01 at $6.77 per guest and 41 percent food cost; today at current prices $6.96 per guest and 42.2 percent, a 2.8 percent rise, 1.2 percentage points higher. Below, the shop list begins with Downtown Bakery at $83.60, against a running total of $1,532.00 with 16 items left."` Alternatively re-shoot the asset to show the `$3,300 / $1,354.04` panel the copy cites — but fix the alt either way. |
| 4 | **Major** | `public/proof/shop-mobile.png`: `Bell pepper — Need 304.9 each · buy 13 × case 24 ct · $414.05` and `Cucumber — Need 88.9 each` | **Chef speaking, and this is the one that costs you the sale.** Nobody needs 304.9 bell peppers. A decimal count on a countable item is the exact tell that software wrote the sheet, not a cook — and it appears in the asset the page uses to prove *"Quantities in cases, a subtotal you can read down the phone"* (`copy.txt:140`). Everything else on this page earns the "built by a chef" claim; this one number spends it. Same shot: the rows wrap to five lines each ("Need 200 / each · buy / 2 × case / 120 ct · / $83.60") beside two adjacent `—` steppers that read as a duplicate minus button. | Chef (leading) + Senior Product Engineer | `[judgment]` + `[measured]` | **Landing-scope fix (do this):** re-shoot `shop-mobile.png` framed on the vendor rows that are already weight- or case-based — the Green Valley red onion (`3 × 25 lb bag`) and Roma tomato (`3 × 25 lb case`) lines read correctly and prove the same claim without a decimal count. **Product question (owner's call, flagged not prescribed):** whether counted units should display rounded in the shop list. I have not read the engine, and rounding is a real domain decision in a system whose premise is exact quantities — it is out of scope for an audit of `localhost:4321`. |
| 5 | **Major** | `copy.txt` counts: `shopping list` ×5, `buy list` ×2 (`:122`, `:124`), in-product `Shop list`, plus a fourth phrasing *"the list you shop"* (`:133`); `prep sheet` ×4, `prep list` ×4 (`:58`, `:124`, `:254`, `:266`); `pack list` ×1 (`:108`), `van sheet` ×1 (`:206`). Also `h3` *"Prices stay current on their own"* (`:114`) vs. its body *"Log an invoice, or tap through the new order guide"* (`:116`) | **Four** names for the buy artifact, a dead tie for the prep artifact, and two names for the pack artifact — in a product whose whole pitch is *"they are all the same numbers."* Naming the same sheet four ways quietly argues against the page's own thesis. Separately, "on their own" promises automation the body immediately withdraws — the reader supplies the invoice. That's the one place the page overclaims, and it's the objection ("who keeps prices current — me?") most likely to be top-of-mind. | UX/IA Designer + Positioning Critic | `[measured]` | Pick the in-product word and use it everywhere: **shopping list** (5 uses, and it's in the hero), **prep sheet**, **pack list**. Replace `buy list` at `:122` and `:124`, "the list you shop" at `:133`, the four `prep list` occurrences, and `van sheet` at `:206`. Rename the app's "Shop list" header to match. Change the `h3` at `:114` to `Prices stay current from your invoices` — same promise, no withdrawal. |

**Deliberately not reported as findings:** the `_vercel/insights/script.js` 404 (2 console errors — a
documented TODO, harmless, already commented in `Base.astro`); tap targets under 44px (13 elements,
all footer/nav links and `tel:` links — every primary CTA is ≥44px); proof-image `scale: 0.45` (correct
@2x behavior). Each is real; none changes whether this page sells.

---

## 6. Three hero rewrites

**A — The trigger moment.**
> **Eyebrow:** Back-of-house software for small caterers & meal-prep kitchens · built by a chef
> **H1:** The client moves 180 to 240 on Thursday. Do the math once.
> **Sub:** Type in the menu and the guest count. It hands you the shopping list, the prep sheets, and what the plate actually costs. Keep everything else you already use.

*Bets on:* the reader having lived that exact Thursday — it's already the strongest line in your
problem section (`copy.txt:58`), just buried at 1616px. *Gives up:* the chef-credibility punch in the
largest type, and it excludes readers whose counts rarely change.

**B — The cost of the status quo.**
> **Eyebrow:** Back-of-house software for small caterers & meal-prep kitchens
> **H1:** You bought five pounds of shallots. You charged for the peeled four.
> **Sub:** CostCook charges trim and yield where they happen, then hands back the shopping list, the prep sheets, and what the plate really costs.

*Bets on:* margin leakage the reader can verify against their own sheet tonight — the most
falsifiable claim you own, and the one nothing else on the market says. *Gives up:* immediate
category clarity (a reader must infer this is software from the eyebrow alone), and it leads with an
accusation, which risks defensiveness.

**C — The chef's identity.**
> **Eyebrow:** Back-of-house software for small caterers & meal-prep kitchens
> **H1:** It counts like a cook, not like a spreadsheet.
> **Sub:** Twelve years on the line went into how this thing counts. Type in the menu and the guest count; it hands back the shopping list, the prep sheets, and the real plate cost.

*Bets on:* tribal recognition — the reader buying from one of their own, which is your genuine
structural advantage over MarginEdge and meez. *Gives up:* any problem statement at all in the
headline; it's the highest-risk option and only works if the reader already knows costing hurts.

**Recommendation:** ship **A**. It's the only one that puts a falsifiable bad moment in the largest
type, and your existing subhead already carries the category, so you lose nothing by moving
provenance to the eyebrow. B is the stronger *idea* but demands more from a 20-second reader.

---

## 7. Keep / Kill / Clarify

| Section | Verdict | Why |
|---|---|---|
| Hero ticket card (`Hero.astro:43`) | **Keep** | Best element on the page. One order → shop, prep, plate, in the ticket's own monospace voice. On desktop it *is* the argument. |
| Hero `h1` | **Clarify** | Finding 1 — swap provenance out of the largest type. |
| `THE PROBLEM` (3 cards) | **Keep, move up** | "Tuesday, late" / trim / the fragile spreadsheet are the page's best writing. They belong closer to the fold, not at 1319–2133px. |
| `WHAT IT DOES` (5 items) | **Keep** | Every item answers a stated pain. No orphan features — rare. |
| `SEE IT RUN` (video, @4051) | **Keep** | The 55-sec transcript at `copy.txt:124` is unusually honest and makes the video indexable. |
| `WHAT IT LOOKS LIKE` (5 shots, 4966→9329px) | **Clarify** | 4,363px — **5.2 mobile viewports** — with no `h2` and no scroll cue. Cut to the two that carry new information (`shop`, `$ per plate`) and put the rest behind a "see more" or a horizontal swipe. This section alone is ~28% of page height. |
| `HOW FAR IT GOES` (8 steps) | **Clarify** | Its own lede admits it: *"Most of this you will not touch in week one."* Eight `h3`s across 9360→11421px arguing for features the reader has been told they won't use. Collapse to one line — "It keeps going: receiving, labels, month-end food cost" — and link out. This is the single biggest scroll saving available. *(Clarify, not Kill: the content earns its place for a returning evaluator — it's the volume, not the section, that's wrong.)* |
| `WHY US` + 4 cards | **Keep** | Answers the competitor objection directly `[unresolved-context: you didn't name who you think you compete with — "the big platforms" and "enterprise tools" are the page's guess, not yours]`. |
| `FROM THE CHEF` | **Keep** | Earns the claim the `h1` currently asserts. Let this section carry the provenance so the hero doesn't have to. |
| `BOOK A DEMO` (@14179) | **Clarify** | *"It's free while I build it out with the first kitchens"* is at **91% scroll depth**. That's your strongest risk-reducer and almost nobody reaches it. Promote to the hero microcopy at `Hero.astro:37`: `15 minutes · bring one real order · nothing to install · free while I build it out`. |

---

## 8. What I couldn't judge from the page alone

| Open question | Cheapest test |
|---|---|
| Does "kitchen brain" read as evocative or as jargon? The Chef voice says jargon; the UX Designer notes it's memorable and ownable. **I side with the Chef** (see §9). | 5-second test, n=10 caterers: show `mobile-fold.png` for 5s, then ask "what does this company sell, and who for?" Score how many say a costing/list tool unprompted. Run it against rewrite A as the B arm. |
| Whether decimal counts ("304.9 each") actually repel operators or read as precision | Show `shop-mobile.png` to 3 caterers, no framing, ask: "would you shop off this?" Say nothing about the number; see if they raise it. |
| Whether the trim/yield argument lands as revelation or as accusation | Ask 3 buyers: "when you cost a dish with shallots, what weight do you use — what you bought or what you used?" Their answer tells you whether B is a revelation or a scold. |
| Real competitive set `[unresolved-context]` | Ask 3 buyers: "last time you tried to fix costing, what did you look at?" Verbatim answers replace the page's "big platforms / enterprise tools" guess. |
| Whether "my recipes are in my head" is common — the page's data-entry promise assumes a photographable binder | Ask 3 buyers: "if I asked for photos of your recipes right now, what would you send me?" If the answer is "nothing, it's in my head," the strongest section on the page has a hole in it. |

**Five questions for three real buyers this week:** (1) what did you look at last time you tried to
fix costing? (2) if I asked for your recipes right now, what would you send me? (3) when you cost a
dish with shallots, do you use the weight you bought or the weight you used? (4) walk me through the
last time a client changed the guest count — what did you have to redo? (5) what would have to be
true for you to stop using your spreadsheet?

---

## 9. Where the reviewers disagree

**On "The kitchen brain for caterers":** the **UX/IA Designer** argues it's a distinctive, ownable
category phrase and that abandoning it costs brand memory. The **Chef** says he has never once heard
a working caterer use the phrase, and that it reads as the builder's pet name for the project — which
it is: it's the repo name.

**The Chef is right for this buyer.** The 5 a.m. cook and the owner-caterer both scan for words that
name things they physically handle — prep sheet, shopping list, plate cost. "Kitchen brain" names
nothing they hold. The Designer's memorability argument would win for a category-creation play aimed
at investors or press; it loses for a page whose entire credibility rests on sounding like it was
written from inside a walk-in. Keep the phrase for the product's internal identity. Keep it out of
the `h1`.

**On page length:** the **Senior Product Engineer** notes there's no performance case for cutting —
LCP 1996ms, CLS 0, 243KB total, 8 requests, everything lazy-loaded, on a 4×-throttled Fast-3G
production build. Those are genuinely good numbers. The **UX/IA Designer** counters that 18.4
viewports is a *comprehension* cost, not a bandwidth one, and NN/g scanning research says the eighth
`h3` of a section the page itself calls "you will not touch in week one" is read by nobody.

**The Designer is right.** The engineering here is clean enough that length costs nothing to serve —
which is exactly why it went unnoticed. Cut `HOW FAR IT GOES` on mobile.

---

## Appendix — production performance (build: `astro build` → static, served on :4399, CPU 4×, Fast 3G, 390×844)

| Metric | Value | Note |
|---|---|---|
| LCP | **1996 ms** | Element: `A.btn-primary.px-5` — **the CTA button is the LCP element**, not the headline |
| FCP | 1996 ms | Identical to LCP; single render pass |
| CLS | **0** | No layout shift recorded |
| TTFB | 12 ms | Static, local — not representative of Vercel |
| Total transfer | **243 KB** across 8 requests | `demo-poster.jpg` 122KB · Fraunces 68KB · Instrument Sans 30KB · CSS 26KB |
| Render-blocking | 1 (`index.D9Xuiq3z.css`, 26KB, 671ms) | Single blocking resource |
| 4xx/5xx | `/_vercel/insights/script.js` → 404 | Known TODO, documented in `Base.astro` |

LCP is a text/button paint gated on the 26KB blocking stylesheet and the 68KB Fraunces subset. The
headline uses Fraunces; `font-display: swap` is set, so the h1 paints in fallback first. Nothing here
needs fixing before the copy does.

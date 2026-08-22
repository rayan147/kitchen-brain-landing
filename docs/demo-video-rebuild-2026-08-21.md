# Prompt — rebuild the demo video and refresh the screenshots

Motion, better on-screen narration, one order plus the multi-order run, and the stills re-captured from the same dataset.

Paste everything below the line into a fresh session opened at `/home/rayan147/kitchen-brain-landing`.
Written 2026-08-21, after the landing page's third-pass repositioning (see `REDESIGN-BRIEF-2026-08-21.md` §13). Supersedes `docs/demo-video-and-screenshots-prompt.md`.

> **Executed 2026-08-21.** This document was written as a prompt and then carried out
> in the same session. What follows is the plan; the outcome, and the four things the plan
> got wrong, are recorded at the bottom under "What actually happened". Read that first if
> you are re-recording, because two of the four are traps that cost a full capture run each.

Read **"What is already true"** before doing anything. Several obvious-looking moves are already blocked, already decided, or already wrong.

---

## Role

You are re-recording the landing page's product walkthrough. Two repos:

- **LANDING** `/home/rayan147/kitchen-brain-landing` — Astro + Tailwind v4, static, deployed to Vercel on merge to `main`. Owns `public/demo.mp4`, `public/demo.webm`, `public/demo-poster.jpg`, the `SeeItRun` section, and the capture/assembly rig in `scripts/demo-video/`.
- **APP** `/home/rayan147/kitchen-brain-develop-demo` — SvelteKit. Owns the demo world (`demo/seed-demo.ts`), the beat-sheet capture (`demo/capture.spec.ts`), `demo/SHOT-LIST.md`, and `demo/SCRIPT.md`. This is the branch that records; nothing here may touch a real database.

Read `CLAUDE.md` in the landing repo first. Its rules bind every word you write: no em-dashes in user-facing text, no stock SaaS phrasing, "Kitchen Brain" never appears in prospect-facing copy, every claim traces to shipped behaviour, AA is the floor, and **the sr-only transcript must match the footage**.

## The owner's brief, verbatim, and what it means

> "lets recreate the Follow one 180-guest wedding from quote to shelf video since it has changed a lot and lets use a better narration, it does not sound humane and we should create one order but show as well we can create multi at the same time"

Then, mid-thread and overriding:

> "no sounds, music it is ok, but it needs to have some animations"

Read together, those are four instructions:

1. **Re-record.** The app has moved since the current cut and the landing page has been rebuilt around a different claim.
2. **"Better narration" means the on-screen writing, not a voice.** There is no voice track and there will not be one. The captions are the narration. They currently read as headlines rather than as somebody telling you what is happening; that is the "not humane" complaint, and it is a writing problem.
3. **Music is allowed. Speech is not.** Keep the cut silent of speech.
4. **It has to move.** Static holds with a caption bar under them is what exists now and it is what the owner is reacting to.

Plus the product point: the video must keep following **one** order, and must **also** show that several events can be planned in one run.

## What is already true (do not rediscover this)

### The rig

**Five generations coexist in `scripts/demo-video/`.** The current pair is `capture-silent.mjs` + `assemble-silent.mjs`, driven by the storyboard in `beats.mjs`. `capture-walkthrough.mjs`, `cards.html` and `speak.py` are the narrated generation, still **untracked** (`git status` shows `??`). `record-demo.mjs`, `record-redesign.mjs`, `capture-beats.mjs`, `assemble.sh`, `make-bed.mjs`, `beats.json`, `narration.md`, `make_voiceover.py`, `vo/`, `vo-silent/`, `voices/` are older or narration-only.

**Commit the untracked files before you touch anything**, so the next person inherits a rig that exists in history, then decide in one place which generation survives. Do not leave six.

**`beats.mjs`'s header comment says NO NARRATION, permanently, on two grounds.** One ground has since been invalidated and the owner has now settled the question anyway. Rewrite that comment rather than working around it. The accurate statement is: no speech track, by owner decision; a music bed is allowed; the captions carry every claim; motion carries the pace that a voice used to.

**`speak.py`'s docstring contains the single most useful note in the rig** and it applies to captions too, not just to speech:

> beats.mjs used to require `speak` to be a transliteration of the on-screen `caption`, and captions are telegraphic by design.

The inverse is the bug you are fixing. `caption` is currently written as if it were a headline for a voice that no longer exists: `"180 guests at $68 a head: $12,240 in, $4,845.61 of food. That is 39.6%, and it names the price that gets you to thirty."` Nobody says that. It is a sentence built to be read aloud by a machine, and now it is the only channel there is.

**Pacing is derived, not authored.** `holdFor()` in `beats.mjs` computes a hold from caption word count: `LEAD_IN 1.0 + words/2.8 + DWELL 2.4`, clamped to 7.5–13 s. That is why the current cut feels like a slideshow: every beat is a still image held for eight to thirteen seconds. Motion has to be scheduled inside that window, not bolted on after.

### The app and the data

**The demo world regenerates in about two minutes** (`demo/README.md` in the app repo):

```sh
docker compose up -d mailpit     # SMTP capture, web UI on :8025
npm run demo:seed                # ~25 s: fresh DB, 3 years of history
npm run demo:capture             # ~90 s: builds, boots preview on :4181, drives the beats
```

**The seeder is hard-guarded.** It only writes `file:e2e/.scratch/demo.db` and refuses anything else, including any `TURSO_DATABASE_URL`. Every vendor email is under the reserved `example.com`. The SMTP transport refuses non-loopback targets. Standing policy since PR #29: never record against production or real data. Do not weaken any of this to make a shot easier.

**Determinism has one seam.** The history generator is fully seeded, and `seed → capture` on the same calendar day reproduces the same world and the same figures. Across days, dates and date-derived figures shift with the anchor (`HISTORY_SEED_DATE=YYYY-MM-DD` pins it). Wall-clock times appear on receiving-provenance surfaces and differ between runs.

**The marquee order is created live by the capture spec**, not pre-baked. That is deliberate: the footage shows the real workflow.

**`demo/SHOT-LIST.md` is authoritative** and already covers the single-order spine end to end, shots 00 through 19 plus four phone shots. It does not cover the multi-order run. `demo/SCRIPT.md` carries two timecoded cuts, 90 s and 2:30, both written for a voice.

### Multi-order: exactly what ships, and exactly what does not

Verified in `kitchen-brain-develop-demo` on 2026-08-21. This is the part most likely to be overclaimed, so it is written out in full.

| Fact | Where it lives |
| --- | --- |
| The new-order form has an **"Add another event"** button | `src/lib/components/orders/new/NewOrderForm.svelte:529` |
| It is capped at 12 events (`disabled` at `additionalOrders.length >= 11`) | same file |
| The submit button relabels itself **"Create 3 orders"** | same file |
| A **"Live quote"** panel prices each event separately, then totals the run | `src/lib/components/orders/new/BatchQuoteSummary.svelte` — its own description reads "Each event stays separate; the production-run total is below." |
| Server-side it is `createOrderBatch`, **2 to 12 events**, all-or-nothing on validation error ("Fix the marked event details. No orders were created.") | `src/routes/orders/new/+page.server.ts:49-59` |
| Success redirects to `/orders/batch?ids=…` | same file, line 66 |
| That page is titled **"Combined production"**, subtitled `N orders created together · X guests · Shop, Prep, and Pack totals in one place` | `src/routes/orders/batch/+page.svelte` |
| It has Shop / Prep / Pack tabs over the combined run | same file |
| **Pack stays split by event.** The table has a "By event" column and says so: "Totals show what leaves the kitchen; each event allocation stays visible so trays reach the right order." | `src/lib/components/orders/batch/BatchPackList.svelte` |

**And the thing you must not imply.** `/orders/batch/+page.server.ts` exposes exactly two actions: `setOnHand` and `setSubOnHand`. **There is no confirm action and no purchase-order path on the combined run.** Confirming an order, freezing its prices, and sending its POs all remain per order. A caption that says or suggests "confirm all three and the POs go out" is false.

The true claim, and the one to write: **plan several events as one run; buy and confirm each order on its own.**

### The landing page pins that move with the footage

Change the cut and **all** of these drift. They have drifted twice before; commit `3e8d136` shipped a chip reading 48 sec over a 39.5 s cut.

| Pin | Location |
| --- | --- |
| `Watch · 1 min 51 sec` chip | `src/components/sections/SeeItRun.astro`, `#demo-play-badge` |
| `Watch the 1:51 product tour` hero link | `src/components/sections/Hero.astro` |
| **Build guard on that exact literal** | `scripts/check-landing-claims.mjs:92` — `requireText(publicCopy, 'Watch the 1:51 product tour', 'hero proof link')`. Update the guard in the same commit or the build fails. |
| `aria-label` on the `<video>` | `SeeItRun.astro` |
| `#demo-transcript` sr-only transcript | `SeeItRun.astro` — a full prose description of the footage, currently ~250 words |
| Poster frame | `public/demo-poster.jpg` |
| Section `<h2>` | `SeeItRun.astro` — currently "Follow one 180-guest wedding from quote to shelf." **This under-describes a cut that also shows a three-event run. It needs rewriting.** |
| Section lede | `SeeItRun.astro` |

`SeeItRun.astro` is in `surfaceFiles` in `check-landing-claims.mjs`, so everything you write there is scanned against the forbidden-claims list: `know the margin`, `no data entry`, `nothing is re-keyed`, `free while…`, `everything downstream re-reads`, `handles it automatically`.

### The claim ledger

Every claim on the page traces to a row in `docs/release-claim-ledger.md` (RC-01 … RC-33; the guard asserts all 33 exist). **There is no row for multi-order planning.** Grep confirms it: nothing matches batch, combined, or multiple orders.

You must add one before the caption can ship.

**Get the number by grepping, do not copy one from this document.** The ledger already runs past the
guard's loop bound: `grep -o 'RC-[0-9]*' docs/release-claim-ledger.md | sort -u | tail -3` returns
RC-33, RC-34, RC-35, while `check-landing-claims.mjs` only asserts RC-01 through RC-33. So the next free
row is RC-36 as of 2026-08-21, and the guard's bound is stale by two. Re-check before writing.

Suggested:

> **RC-36 · Several events can be planned as one production run.** *Shipped operations.* Evidence: `createOrderBatch` (2–12 events) in `src/routes/orders/new/+page.server.ts`; `/orders/batch` "Combined production" with Shop / Prep / Pack; pack allocation stays per event in `BatchPackList.svelte`. **Scope limit: confirmation and purchase orders remain per order; the combined run exposes only on-hand entry.** Verify: create two events from `/orders/new`, land on `/orders/batch`, check the Pack tab's "By event" column, and confirm no send action exists there.

Then bump the guard's loop bound in `check-landing-claims.mjs:94` to the highest row that exists, which
also closes the two-row gap that is already there.

## Decide these three before touching anything

### 1. Length, and where the strongest claim lands

The current cut is 1:51. External guidance for a homepage demo is 60–120 s, with completion falling off sharply past 60 s; 2–3 minutes belongs on a feature page, not above the fold of a decision.

The bigger problem is not total length, it is **ordering**. The strongest thing in the dataset is that the spreadsheet's $68 guess is under water, CostCook says 39.6% food cost, and it names $89.74 as the price that hits target — **before the quote goes out**. In the current storyboard that is beat `b2`, arriving after roughly twenty seconds of orders-list and recipe setup.

**Recommendation: hold the cut at or under 2:00, and get the money beat inside the first 30 seconds.** The multi-order beat should *replace* a beat, not extend the runtime. Candidates to cut or merge: `b0` (orders list) can fold into the opening card; `b9` (inventory) and `b8` (ingredient live cost) make one point twice.

If the owner wants everything, the long cut belongs on `/features` behind a quiet link, and the homepage keeps the short one.

### 2. Where the multi-order beat goes, and how long it gets

**Recommendation: a single inset of about 12 to 15 seconds, placed immediately after the order is created, then return to the wedding and never mention it again.**

Rationale: the owner asked to *also* show it, not to lead with it. The spine of the video is one job going all the way through, and that is what makes it credible. A second storyline competing for the same 90 seconds costs more than it buys. An inset says "and it does this too" without breaking the through-line.

Shape of the inset: `Add another event` clicked → a second and third event fill in → the Live quote panel shows three separate quotes and one run total → submit reads **Create 3 orders** → land on **Combined production** → the Pack tab, holding on the **"By event"** column → cut back to the wedding.

The last frame of that inset is the important one. Combined shopping is the obvious benefit and any competitor can claim it; **pack staying split by event is the proof that somebody who has actually loaded a van built this.**

### 3. Music: yes or no, and licensed how

The owner said music is acceptable, not that it is required. Two considerations before adding any:

- **Licensing.** A landing page is commercial use. The bed must be a track with a licence that covers it. Do not ship anything whose provenance you cannot name in the commit message.
- **Accessibility.** Speech in synchronized media triggers WCAG 1.2.2 (captions) and 1.2.3 (media alternative). A purely decorative music bed carrying no information does not, because nothing is conveyed by audio alone. The existing transcript already establishes this precedent and its wording is good: *"There is no narration; a music bed plays and every claim is written on screen, so nothing is carried by audio alone."* Keep a sentence to that effect, keep it true, and make sure the video is watchable muted, because most of the page's readers are on a phone mid-shift.

**Recommendation: ship the cut silent first.** It is the honest default and it is one fewer thing to get wrong. Add a bed only if the owner picks a track.

## Step 0 — numbers before prose

**Do this first. Every previous cut drifted here.** `demo/SCRIPT.md`'s own editing note is the rule: *"If a re-seeded capture shifts a figure, update the narration from the new shots, never the reverse."*

1. In the app repo: `docker compose up -d mailpit && npm run demo:seed && npm run demo:capture`.
2. Read `demo/out/state.json` for the run's order id and PO numbers.
3. Open every shot in `demo/out/screens/` and write down what the screen actually says. Diff it against `demo/SHOT-LIST.md` and against `beats.mjs`'s captions.
4. Produce a table of **every figure the video will show**, each with the shot it appears in. The current storyboard asserts: $12,240 revenue, $4,845.61 food, 39.6%, $89.74 target price, Baldor $690.82, PO-00783-002 at $516.08, $477.16 paid against $410.40 quoted, quoted $26.92 → today $27.12, +0.7%. Treat every one as unverified until you have seen it in this run's screenshot.
5. The chain has to close arithmetically for a viewer who checks. `beats.mjs` records the specific failure to avoid: an earlier cut narrated one menu and quoted a different menu's food cost, and the division did not work out.

Only then write captions.

## Step 1 — rewrite the captions as narration

This is the "not humane" fix and it is the highest-value work in the whole job.

**The rule: each card stands alone and lands on one number.** It is read at a glance, on a phone,
possibly at arm's length, with no voice to carry the grammar across from the card before it. Write to
that first.

*Then* apply the smell test: would a chef say this standing next to you? If it only works as a headline,
it fails. That test is the check, not the generator. Writing a spoken sentence and trimming it produces
exactly the clipped headline voice you are trying to get rid of, which is how the current captions were
written (see `speak.py`'s note: captions and speech are different jobs, and making either a
transliteration of the other ruins both).

Concretely:

- **One idea per card.** If it needs a semicolon or an "and", it is two cards.
- **Lead with the human fact, land on the figure.** Not `"180 guests at $68 a head: $12,240 in, $4,845.61 of food. That is 39.6%…"`. Closer to: `"You quoted $68 a head."` → `"The food costs $4,845."` → `"That is 39.6%. You are under water."` → `"It wants $89.74. You know before you send the quote."` Four cards, each landing on one number the frame behind it is showing.
- **Short lines.** Roughly 6 to 10 words. They are read at a glance on a phone, sometimes at arm's length.
- **Contractions and plain kitchen English.** `CLAUDE.md`'s voice: one founder-chef talking shop, honest, warm, unhurried. "The truck is never perfect" is already right. "It names the price that gets you to thirty" is not.
- **No em-dashes.** Hard rule, and the whole cut is user-facing copy.
- **Every figure on a card must be legible in the frame behind it.** If it is not on screen, it does not go on a card.
- **The caption must survive being read alone.** No card may depend on the previous card's grammar.

Restructure `beats.mjs` so a beat is a small sequence of cards with motion, not one paragraph over a
still.

**This is a breaking change to a shared module, so plan it as one commit.** `beats.mjs` exports `BEATS`,
`holdFor` and `CAPTION_DELAY`, and **both** `capture-silent.mjs` and `assemble-silent.mjs` import them.
A beat gains something like `cards: [{ text, at }]` in place of the single `caption` string; `holdFor`
becomes the sum over a beat's cards plus its scheduled motion rather than a word-count formula; and both
consumers need updating in the same change or the capture breaks halfway through a run. Do not discover
this mid-capture.

## Step 2 — add the motion

The owner's complaint is that it does not move. The rig already has most of the primitives, in `capture-walkthrough.mjs`: an injected fake cursor with eased transitions, a highlight ring that follows document coordinates through scrolls, `cinematicScroll()` with a proper ease, and scrollbar suppression. **Port them into the silent rig rather than rewriting them.**

What each beat should be doing while its cards are on screen:

- **Cursor and click.** A visible cursor travelling to the control, then the click, then the result. This is the single biggest legibility win: it tells the viewer a person is driving.
- **Real typing.** Guest count and price typed character by character, not filled in a frame. `demo/capture.spec.ts` already runs with `slowMo: 120` for exactly this reason.
- **The highlight ring.** Slide it onto the number the current card is talking about. One ring at a time.
- **Eased scroll, never a jump.** Already implemented; use it everywhere, including into the vendor groups.
- **Card motion.** Cards should enter and leave, not cut. A short rise-and-fade is enough and it matches the page's own `.anim-enter` register.
- **Beat transitions.** A quick cross-dissolve between beats reads as one continuous session. Hard cuts between full-page screenshots read as a slideshow, which is the current problem.

Three constraints on all of it:

- **Motion is transform and opacity only.** `CLAUDE.md` design principle 3. No layout animation, nothing that reflows.
- **Nothing important is only legible while moving.** Every figure gets a still moment.
- **The app's own animations stay disabled during capture** (`demo/playwright.config.ts` already does this) so the only motion in frame is motion you scheduled.

A note on the title and end cards: `scripts/demo-video/cards.html` already renders them in the page's own visual world (Fraunces, cream, ticket rule, brand lockup) at 1280×800 via `?card=title` / `?card=end`. Reuse it, and update its copy — the current title card says *"A catering order goes in. Your shopping list, prep, and food cost come out."*, which predates the page's current claim. The end card must carry `cta.label` from `src/lib/site.ts` (**"Start CostCook"**), not the old "Book a 15-min demo", because the page now has exactly one primary action and the video may not introduce a second.

## Step 3 — assemble

`assemble-silent.mjs` is the current assembler. It needs `ffmpeg-static` and `playwright-core`; `npm i --no-save` both, or add `ffmpeg-static` as a devDependency so the encode is reproducible.

Encode targets, matching what ships today: **1600×1000**, H.264 for `demo.mp4` (`-crf 26 -pix_fmt yuv420p -movflags +faststart`), VP9 for `demo.webm`, both silent unless a bed is added. Keep both sources; `SeeItRun.astro` lists WebM first.

Re-pick the poster from the new footage. The current one is the vendor-grouped shopping list with its caption bar, which is the right instinct: pick the frame that is most legible as a still and most obviously the product. No click ripple, no mid-transition frame.

**Delete every hardcoded scratchpad path in the rig and require the env var instead.** `capture-walkthrough.mjs` currently defaults `CUT_DIR` to a dead session directory. A default that points nowhere is worse than no default.

## Step 4 — update the page

In `src/components/sections/SeeItRun.astro`:

1. **Rewrite the `<h2>`.** "Follow one 180-guest wedding from quote to shelf." is now incomplete. The heading has to cover both what the video follows and that it also shows the multi-event run, in one line, in the page's voice. It is also read in the heading-only scan documented in the brief, so it has to still make sense as the third of seven headings.
2. **Rewrite the lede** to match.
3. **Rewrite `#demo-transcript` end to end.** This is a WCAG obligation, not housekeeping, and `CLAUDE.md` principle 4 pins it explicitly. It must describe the new footage in order, including the multi-order inset, and state that there is no narration.
4. **Update the `aria-label`** on the `<video>`.
5. **Update the chip** to the new duration, and the hero link, and `check-landing-claims.mjs:92`. All three in the same commit.
6. Add the ledger row and bump the guard's loop bound.

Then, in `docs/demo-video-and-screenshots-prompt.md`, add a one-line "Superseded by `docs/demo-video-rebuild-2026-08-21.md`" pointer at the top. It contains instructions that are now wrong and a fresh session will otherwise follow them.

## Step 5 — the screenshots

The owner asked for these in the same pass. They are in worse shape than the video, and the reason is that nobody has audited what the page actually loads.

### What the page actually uses: one pair

Grep the whole of `src/`. Excluding `/founder.jpg` and inline SVG, the homepage renders exactly **one** product screenshot, in `src/components/sections/TheYield.astro`:

- `/proof/yield-lines.png` (1964x988 file, displayed at 982 CSS px, so 2x)
- `/proof/yield-lines-mobile.png` (664x1036, shown below `sm:`)

Both captured **2026-08-02**. They predate the demo world entirely, and they are the section's whole argument: three columns in one row, used / yield / bought.

### What the page does not use: everything else

`public/proof/` holds 38 files, about 3.2 MB. After the two above:

- **22 are referenced only by `src/lib/workflow.ts`** — the 14-step loop table. That module is **not imported by any page**. It was left in place deliberately (`LoopBand.astro` condenses its ordering and its header comment says so), but its screenshots are shipped to every visitor's `public/` and loaded by nobody.
- **10 `v2-*` files** were copied in on 2026-08-07 from the app repo's `demo/out/landing/`. **Zero references in `src/`.** `v2-hero-money-mobile.png` became unreferenced in the third-pass repositioning when the hero screenshot was replaced by `LoopBand`.

Verify this yourself before acting on it, then make a decision and record it. Do not silently delete: `workflow.ts` is retained on purpose and its images may be part of that intent. Either wire the screenshots into a section that earns them, or move them out of `public/` so they stop shipping. `scripts/check-dist.mjs` will not catch this; it only checks inline SVG sizing.

### Re-capturing: what exists and what is missing

The app repo already has the producer. `demo/capture.spec.ts` line 345, `test('@landing proof crops for costcook.io')`, takes purpose-built **element crops** (not full pages) into `demo/out/landing/`, desktop and phone, and the phone pass is a second test around line 442. It produces: `v2-recipe-lines`, `v2-shop`, `v2-po-email`, `v2-receiving`, `v2-price-provenance`, `v2-inventory`, `v2-hero-money-mobile`, and the mobile variants.

**It does not produce a `yield-lines` crop.** The one screenshot the live page depends on is the one the rig does not regenerate, which is exactly why it is three weeks older than everything else. Add that crop to the `@landing` test so the page's only screenshot regenerates with the rest.

Element crops are the right pattern and it is worth saying why: a full-page screenshot shrunk into a figure is unreadable on a phone, and the page's own comment in `TheYield.astro` records the specific failure it caused (at 390px a full-width capture sheared the cost column into `$0.3`). Crop to the region that makes the point.

### The alt text is a claim, not a label

`TheYield.astro`'s alt text names specific figures: Roma tomato 110 g used at 91 percent yield so 121 g bought, cucumber 0.4 each at 90 percent, red onion 25 g at 88 percent, base cost $1.60. That text is read by screen readers **in place of** the image, so it is prospect-facing copy under every rule in `CLAUDE.md`, and it is a truth-pass surface.

If the new capture shows different numbers, **the alt text is rewritten from the new image**, along with the `figcaption` (which quotes 110 g and 121 g in prose) and the `width`/`height` attributes, which carry the file's pixel size and not the CSS size. Getting those wrong reintroduces layout shift.

### Screenshot work, in order

1. Run the same `demo:seed` + `demo:capture` from Step 0. One dataset for the video and the stills, so a reader who watches the video and then studies the screenshot sees the same kitchen and the same numbers. This is the point of doing both in one pass.
2. Add a `yield-lines` element crop (desktop and phone) to the `@landing` test in `demo/capture.spec.ts`.
   The phone crop stops after the PREP column, and that is a **capture-side** constraint: it belongs in
   the Playwright locator, scoping to the columns that fit, not in a crop applied to a wider screenshot
   afterwards. `TheYield.astro`'s comment explains why the full-width capture fails at 390 px.
3. Copy the new crops into `public/proof/`. Keep the naming scheme consistent; if `v2-` no longer means anything, rename in one commit rather than adding a `v3-` generation.
4. Rewrite `TheYield.astro`'s two alt texts, its figcaption, and both `width`/`height` pairs from the new files.
5. Decide the orphans: wire in, or move out of `public/`. Record the decision in the commit message.
6. Re-verify at 320, 390, and 1440 px that nothing overflows and no image forces horizontal scroll. `TheYield.astro` has a documented history here.
7. If a new screenshot makes a claim the page does not already make, it needs a ledger row like any other claim.

### Optional, and worth raising with the owner

If the multi-order run is worth a beat in the video, it may be worth a still on the page too: the **Combined production** Pack tab with its "By event" column is the most self-evidently real screen in the product. That is a new section, though, and the homepage is already 9.1 viewports. `/features` is the better home. Ask before adding; do not expand the homepage without a decision.

## Definition of done

- [ ] `npm run check` and `npm run build` pass in the landing repo.
- [ ] The chip, the hero link, the guard literal, and the actual encoded duration all agree, verified with `ffprobe`.
- [ ] Every figure on screen traces to a shot from **this** capture run, listed in a table in the commit or in `demo/SHOT-LIST.md`.
- [ ] The transcript describes the footage in order, and someone who reads it without watching learns the same things.
- [ ] The multi-order beat claims planning only. Nothing on screen or in a caption suggests the combined run confirms orders or sends purchase orders.
- [ ] A new ledger row covers multi-order planning, with its scope limit written down, and the guard's
      loop bound matches the highest row in the file.
- [ ] The cut is watchable muted, on a phone, with no speech.
- [ ] Something moves in every beat, and every figure still gets a still moment.
- [ ] No em-dashes anywhere in the captions or the cards.
- [ ] The end card's CTA is `cta.label` from `src/lib/site.ts`, and it is the only call to action in the video.
- [ ] The page's screenshots come from the same capture run as the video.
- [ ] `TheYield.astro`'s alt text, figcaption, and width/height attributes match the new files.
- [ ] The orphaned files in `public/proof/` have been wired in or moved out, and the decision is in the commit message.
- [ ] The rig that produced this cut is committed, has a README that describes it accurately, and the superseded generations are either deleted or labelled as history.

## Sources for the guidance above

- [SaaS Demo Best Practices in 2026 — Arcade](https://www.arcade.software/post/saas-demo-best-practices)
- [SaaS Demo Video Best Practices for Founders — DemoPolish](https://demopolish.com/blog/saas-demo-video-best-practices/)
- [Product Demo Video Best Practices 2026 — ngram](https://www.ngram.com/blog/product-demo-best-practices)
- [How to Write a Script for AI Voiceovers That Sounds Natural — Pixflow](https://pixflow.net/blog/how-to-write-a-script-for-ai-voiceovers-that-sounds-natural/)
- [Understanding WCAG SC 1.2.2: Captions (Prerecorded) — W3C](https://www.w3.org/TR/UNDERSTANDING-WCAG20/media-equiv-captions.html)
- [Video and Other Synchronized Media — Section508.gov](https://www.section508.gov/create/synchronized-media/)


---

## What actually happened

The plan held. Four things it did not anticipate, in the order they bit:

**1. The app's own capture harness was broken before any of this started.** `demo:capture`
had been failing since the multi-event refactor landed, and failing slowly: two locators sat
on elements that no longer matched until the 600-second test timeout. The menu picker now
previews six of fifteen menus, so `Wedding Plated Dinner` is only reachable through the
search box; and the purchasing sheet is a labelled `<section>` inside the shell's single
unnamed `<main>`, so `getByRole('main', { name: 'Purchasing sheet' })` matched nothing. Both
are fixed in the app repo. Nothing about the video could start until they were.

**2. The demo world could not demonstrate the one feature the page's only screenshot claims.**
`recipeLines.yieldPct` defaults to 100 and nothing in `demo:seed` ever set it, so every
recipe line in the world was 100 percent and a `yield-lines` crop would have shown a column
of "100%" under a section arguing that yield moves the quantity. The old `yield-lines.png`
came from `walkthrough-seed`, a different kitchen entirely, which is why its figures (110 g
tomato, $1.60 base cost) match nothing in the demo world. `demo/seed-demo.ts` now sets trim
yields and prep notes on five Greek Salad lines. Greek Salad and not Braised Short Rib for
two reasons: two of the short rib's three lines are sub-recipes, whose yield reads "Not set",
and it is on the Wedding Plated Dinner menu, so yields there would move every food-cost
figure the video narrates.

**3. The assembler was playing the beats in the wrong order, and had been all along.**
`Object.keys(meta).sort()` is lexicographic, and `'b10'` sorts before `'b2'`. The shipped
1:51 cut therefore played its closing beat third, and the poster offset was computed against
the same wrong sequence. Assembly order now comes from `BEATS`.

**4. The multi-event beat's date picker cost two runs.** A calendar day is a `div` carrying
`[data-calendar-day]`, and its accessible name is the whole date, so both
`getByRole('button', { name: '24' })` and a `button` selector wait until they time out. That
failure landed after ten good beats had already been recorded, and the rig threw away all of
them because it only wrote `meta.json` at the end. It writes after every beat now, and
`BEATS_ONLY=b04` re-records one beat into an existing cut.

### Figures, verified against this run

Every card figure was re-read off this run's screens rather than carried forward, and three
had drifted from the previous cut: food cost `$4,845.61` to **$4,847.96**, target price
`$89.74` to **$89.78**, per-guest `$26.92 / $27.12` to **$26.93 / $27.13**. The PO number is
now deliberately absent from every card: it embeds the order id, which is insertion order in
a fresh database.

### Decisions taken

- **Length:** 2:02, against the 1:51 it replaces. The money beat now lands at fifteen seconds
  instead of past twenty.
- **The inset:** seventeen seconds, immediately after the shopping list, ending on the Pack
  tab's by-event column and on the card that says confirming and buying stay per order.
- **Music:** kept. `assemble-silent.mjs` already generates its own bed and normalises it to
  -23 LUFS, so there is no licence to track and no third-party provenance to name. Shipping
  silent would have been a change, not the default.
- **The orphaned screenshots:** moved to `proof-archive/` at the repo root, not deleted.
  `public/proof/` went from 3.2 MB to 176 KB. See that directory's README.

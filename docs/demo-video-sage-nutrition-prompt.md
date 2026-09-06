# Prompt — re-record the "See it run" cut with Sage and nutrition facts

> **Executed 2026-09-06.** The cut is 2:53 and both beats are in it. Read this
> for the reasoning; read the commits for what was actually done. Four things
> this brief got wrong or could not know, corrected here so the next person
> does not re-derive them:
>
> - **The dish is Wild Mushroom Polenta, not the Braised Short Rib.** The short
>   rib's stock enters by volume and its nutrients include beef bones that are
>   strained out. The polenta is on the same wedding menu with four lines all
>   weighed in grams, so the dataset chain holds without the arithmetic problem.
> - **The runtime is 2:53, not the 2:45 recommended below.** Trimming would mean
>   re-timing four verified beats' move schedules, because a card's hold and a
>   ring's cue time are independent numbers. The trim candidates below still
>   stand if the owner wants them.
> - **The Sage beat needs a live model key on every future re-record.** The
>   canned test double must never be filmed, so `demo/serve.sh` now takes Sage's
>   provider and key explicitly and defaults them off. A re-record without one
>   fails at the beat's own assertion rather than shipping a script.
> - **The seed work in the app repo was larger than "prepare the route".** The
>   demo world had no nutrition data at all. It now carries four verified USDA
>   FoodData Central sources through `demo/nutrition-curation.ts`,
>   `scripts/extract-demo-nutrition.ts` and `demo/nutrition-fixture.json`.

Paste everything below the line into a fresh session opened at
`/home/rayan147/kitchen-brain-landing`. Written 2026-09-06 against the rig as it
exists on `hotfix/tour-csp-inline-script`. The format of the cut does not change:
silent, card-captioned, one order followed end to end, music bed, no speech
track. Only the content changes, because the app has shipped two things the
footage has never shown.

Read the "What is already true" section before doing anything. Three of the
obvious moves are already blocked, and one of them is blocked in the other repo.

---

## Role

You are adding two beats to the homepage walkthrough (`public/demo.{mp4,webm}`)
and re-recording the cut: **Sage**, the in-app assistant, and **nutrition facts**
on a recipe. Everything else about the cut stays as it is.

Two repos:

- **LANDING** `/home/rayan147/kitchen-brain-landing` — Astro, deployed to Vercel
  on merge to `main`. The video rig lives in `scripts/demo-video/`.
- **APP** `/home/rayan147/kitchen-brain-develop-demo` — branch `sandbox/demo`.
  It owns the seed and the capture spec the rig records against.

Read, in this order, before you touch anything:

1. `CLAUDE.md` here. It binds everything you write: no em-dashes in user-facing
   text, no stock SaaS phrasing, "Kitchen Brain" never appears in
   prospect-facing copy, every claim traces to shipped behaviour, AA is the
   floor, and the sr-only demo transcript must match the footage.
2. `scripts/demo-video/beats.mjs`, the whole header comment. It is the writing
   standard for a card and it is not negotiable: each card stands alone and
   lands on one number, uses the screen's own nouns, and every figure on a card
   must be legible in the frame behind it and must come from **this** capture
   run.
3. `scripts/demo-video/README.md`, for the ordering constraint on partial
   re-records and for the three frame checks.
4. `src/lib/sage.ts` and `src/lib/nutrition.ts` here. Their header comments are
   the claim boundary for the two new beats. Read them as instructions, not as
   background.

## What is already true (do not rediscover this)

**The demo world has no nutrition data at all.** `demo/seed-demo.ts` in the APP
repo creates no `ingredient_nutrition_profiles` rows and no allergen review
rows; grep it for `nutrition` and `allergen` and both come back empty. The
schema is there (`src/lib/server/db/schema.ts`, `ingredient_nutrition_profiles`,
sources `usda_fdc | ai_estimate | package | manual | legacy_import`) and the
route is live (`src/routes/catalog/recipes/[id]/nutrition-label/`), but the
Maple & Main wedding world does not populate it. **A nutrition beat therefore
requires seed work in the APP repo before a single frame can be captured.**
This is the largest piece of work in this task and it is not in this repo.

**The demo capture spec never visits Sage or nutrition.** `demo/capture.spec.ts`
drives recipes, orders, the PO inbox, receiving, ingredients and inventory.
Neither `sage` nor `nutrition` appears in it. `capture-silent.mjs` resolves its
targets against the world that spec leaves behind, so any route the spec does
not prepare is a route the rig cannot reliably reach by name.

**Sage itself is on by default in that world.** `compose.yaml` sets
`SAGE_ENABLED: '${SAGE_ENABLED:-enabled}'`. Sage reads records, so a question
scoped to the seeded wedding should produce a real answer with real sources
without any new seed data. Verify this against the running instance before you
plan the beat; do not assume it.

**The existing Sage and nutrition proof assets are off the cut's dataset chain,
and that chain is load-bearing.** `beats.mjs` records why: the pitch is "they are
all the same numbers", and an earlier cut broke by quoting one menu's food cost
over another menu's footage. `src/lib/nutrition.ts` proof is a 297 g Chicken
Burrito Bowl. `src/lib/sage.ts` proof carries a caption that says out loud it is
an example from a different kitchen than the wedding in the tour. **Neither
asset may be used as a source of figures for these beats.** They are for the
feature pages.

**The Sage feature page's video is a different artifact and stays one.**
`scripts/sage-video/assemble.mjs` builds `/proof/sage-walkthrough.*` from still
PNGs with ffmpeg. It is not this rig, it does not share beats, and you are not
merging them. What you must not do is let the two contradict each other: if a
homepage card and that walkthrough describe the same behaviour in incompatible
words, the homepage card is wrong and gets rewritten.

**The running time is stated in five places and pinned in three.**

| Where | Literal |
| --- | --- |
| `src/components/sections/SeeItRun.astro:250` | `Watch · 2 min 30 sec` |
| `src/components/sections/Hero.astro:97` | `Watch the 2:30 product tour` |
| `src/pages/compare.astro:165` | `Watch the 2:30 product tour` |
| `src/components/sections/FeatureIndex.astro:64` | `Watch the 2:30 product tour` |
| `scripts/check-landing-claims.mjs:529,530,605` | the same string, asserted three times |

`ffprobe` is not installed and `ffmpeg-static` does not ship one. The
assembler's own printed duration is the source of truth for all five.

## Decide these two before touching anything, and write the decision down

### 1. The dataset chain. This decides the whole task.

**Recommended: re-anchor both new beats onto the wedding.** Nutrition on the
Braised Short Rib the cut already follows through the shop list and the prep
list, and a Sage question scoped to the Alvarez-Whitman order or its date. This
keeps the through-line intact and it is the only option that lets a viewer keep
dividing one number by another across beats.

The cost is real and it is in the APP repo: `demo/seed-demo.ts` has to match the
short rib's ingredients to USDA profiles and record allergen review, and
`demo/capture.spec.ts` has to prepare and prove the recipe's nutrition section
the way it already proves the PO emails. Do that work there, in its own commit,
before you write a beat.

**The fallback, if that seed work is refused or the panel comes back too
incomplete to show:** break the chain deliberately, on one recipe, and spend a
card telling the viewer it is a different dish so nobody tries to reconcile the
figures. A broken chain that says so is survivable; a silent one is the exact
defect `beats.mjs` exists to prevent. Do not take this option because it is
faster. Record which option you took and why, at the top of the new beats.

### 2. The runtime budget.

The cut is 2:30 now. Two beats at the length of the existing ones puts it near
3:00, and completion falls off sharply past the first minute already.

**Recommended: hold the cut at or under 2:45.** Budget each new beat at 10 to 12
seconds including its lead-in and tail, then take the difference out of card
holds elsewhere rather than out of a beat. The candidates, in the order they
should be considered: `b04`'s inset (it is the only beat that leaves the
wedding, and it carries six cards), then `b02` and `b03`, whose longest holds
were set when they opened the cut. Do not cut `b03b`; the title card promises
prep and that beat is the only frame behind the promise.

If the owner would rather have a 3:00 cut, that is their call to make, not
yours. Say what it costs and then do what they say.

## The two new beats

Card copy is **not** written in this prompt, and you must not invent it here.
`beats.mjs` requires every figure to be read off this run's own screens, so the
cards get written after the capture, from the frames. What follows is intent,
placement and boundary.

### Nutrition

**Intent:** the recipe you already costed also answers the question a customer
asks first. One panel, per portion, computed from matched sources, with anything
missing said out loud.

**Placement:** immediately after `b03b` (prep), while the viewer is still on the
dish. The recipe route is reachable without disturbing the order, which puts
this beat in the `b05`-to-`b09` bucket in the README's terms: **it can be
re-recorded in isolation** and does not need `captureLast`.

**What the beat must show, in this order:** the four summary values at the top
of the recipe, the panel underneath them, and the sheet the recipe prints. If
the seeded profile is incomplete, show the incompleteness rather than hiding it.
That is the strongest thing this feature does and it is the one thing a
spreadsheet never says.

**Boundary, from `src/lib/nutrition.ts`.** Read that file's "WHAT MAY NOT BE
SAID" comment and treat all four items as hard limits, plus: the label printer
integration is still Coming (RC-35), and the sheet prints from the browser. No
card may go further than the sheet's own words.

### Sage

**Intent:** ask the kitchen a question in plain words and get an answer you can
check. The checkable part is the beat. An answer without its sources on screen
is a chatbot demo, which is the one thing this page cannot ship.

**Placement:** after `b09` (the paid price becoming the current cost) and before
`b10` (quoted versus today). By then the viewer has watched enough records
accumulate that a question about them has something to be about. It reads the
database and writes nothing, so it is also in the isolation bucket.

**What the beat must show:** the question as typed, the answer, and the "Where
this came from" sources in the same frame as the claim they support. Ring the
sources, not the sentence. If a wedding-scoped question does not produce a
source-carrying answer against the seeded world, that is a finding to report,
not a thing to work around by asking a question you already know the shape of.

**Boundary, from `src/lib/sage.ts`.** Read that file's "WHAT MAY NOT BE SAID"
comment and treat every item as a hard limit. Note that the claim check scans
whole files including comments, so do not spell the forbidden strings out
anywhere, including in a comment explaining that you did not. Two further
limits worth stating because a card will reach for both: Sage changes nothing on
its own, and the one thing it prepares waits for a person to approve it.

## Rules that apply to both new beats

**Every ring target is a string read off the live page, with its measured
y-range recorded in the comment above the beat.** This is not style. `b08`
shipped ringing two strings that did not exist on the receiving screen, both
moves threw, `runSchedule` swallowed the errors, and the beat played with no
ring at all. Measure at 1600x1000 against a caption-bar floor of y=768, the way
every existing beat's comment does.

**Use the screen's own nouns.** Not a synonym. The receiving beat's `case`
versus `clamshell` failure is written up in `beats.mjs`; do not add a third.

**One word for the piece of work, and it is `job`.** The two exceptions are
already in `beats.mjs` and you are not adding a third.

**Write the Story Tracker when you write the cards, not now.** The cards are
user-facing content, so `story-content` applies to them: build the two beats as
part of the one story the cut already tells and save the tracker beside the
content, with its pointer in the source. It cannot be written before the capture
because it would have to name figures that do not exist yet.

## Everything downstream of the footage

Re-record, then update all of it in the same change:

1. **The sr-only transcript** in `SeeItRun.astro`. It describes the cut in order
   and carries every figure the cards carry. It is a truth-pass surface and it
   is scanned like the rest of the file. Two new beats mean two new passages, in
   position.
2. **The video's `aria-label`** and the section lede, which currently names five
   things the cut shows. It will name more.
3. **The five duration literals** in the table above, from the assembler's
   printed figure. Run `grep -rn "2:30\|2 min 30" src scripts --exclude-dir=venv`
   after editing and confirm nothing is left behind.
4. **The written guide** (`guideSteps` in `SeeItRun.astro`). It walks the same
   order in six steps and it will be missing two.
5. **The poster.** It is chosen by card in `assemble-silent.mjs`, and there are
   two: the phone gets the default because at 390px the wide frame's caption
   band lands exactly where the native control bar draws. If the new beats do
   not change which card the poster comes from, say so explicitly in the commit
   rather than leaving it unmentioned.

## Prerequisites the executor must confirm, not assume

- The APP repo is at `/home/rayan147/kitchen-brain-develop-demo` on
  `sandbox/demo`, and it builds.
- Mailpit is up (`docker compose up -d mailpit`, UI on :8025). `b05` and `b06`
  read it.
- `HISTORY_SEED_DATE` is pinned and **pinned identically in both repos**. Dates
  and date-derived figures move with it. The marquee order's weekday moves with
  the real clock regardless, which is why no card names a weekday; keep it that
  way.
- Nothing in this pipeline touches a real database. The seeder writes
  `file:e2e/.scratch/demo.db` and refuses anything else, seeded vendor addresses
  are under the reserved `example.com`, and the SMTP transport refuses
  non-loopback targets. Standing policy since PR #29.

## Verify the artifact, not the plan

```sh
node scripts/demo-video/frame-check.mjs cards            # no card wraps to three lines
APP=http://localhost:4181 node scripts/demo-video/frame-check.mjs boxes
node scripts/demo-video/frame-check.mjs holds            # after assembling
node scripts/check-landing-claims.mjs
node scripts/verify-homepage.mjs
```

`holds` is the one that catches what watching does not. A card that sits still
over a page that sits still gives the compositor nothing to composite and the
idle seconds are simply missing from the file. Both new beats are static screens
with a ring on them, which is exactly the shape that failed before. Anything
`holds` flags, re-record with `BEATS_ONLY=` and assemble again.

Then watch the cut on a phone-width viewport, muted, at arm's length. That is
the device this page's readers are on and it is the only test that finds a card
nobody can read.

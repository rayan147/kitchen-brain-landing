# Prompt — re-record the demo video and add a screenshot section

> **Superseded by [`demo-video-rebuild-2026-08-21.md`](./demo-video-rebuild-2026-08-21.md).** Kept for history. Several
> instructions below are now wrong: the narration fork it asks you to decide has been
> settled (no speech track, music optional), and the "Under a minute of the real thing"
> heading it refers to no longer exists on the page.

Paste everything below the line into a fresh session opened at `/home/rayan147/kitchen-brain-landing`.
Written 2026-08-01 against the rig as it actually exists on `main`. Read the "What is already true" section before doing anything; several obvious-looking moves are already blocked.

---

## Role

You are replacing the landing page's demo video with a current walkthrough of the shipping software, and adding a screenshot section beside it. Two repos:

- **LANDING** `/home/rayan147/kitchen-brain-landing` — Astro, deployed to Vercel on merge to `main`.
- **APP** worktrees under `/home/rayan147/`, one per branch.

Read `CLAUDE.md` in the landing repo first. Its rules bind everything you write: no em-dashes in user-facing text, no stock SaaS phrasing, "Kitchen Brain" never appears in prospect-facing copy, every claim traces to shipped behaviour, AA is the floor, and **the sr-only demo transcript must match the footage**.

## What is already true (do not rediscover this)

**Five generations of rig coexist in `scripts/demo-video/`.** Only the oldest has a README, and that README is stale. The current one is `capture-walkthrough.mjs` (gen-5) plus `cards.html`, and **both are untracked** — `git status` shows them as `??`. Commit them before you change them, so the next person inherits a rig that exists in history.

**There is no assembly step for narrated footage.** This is the single biggest gap. `capture-walkthrough.mjs` emits per-beat WebM plus `meta.json` carrying a `trimStart` per beat; `make_voiceover.py` emits `vo/b1..b7.mp3` and `vo/timings.json`. **Nothing consumes either.** The only assembler, `assemble.sh`, belongs to gen-3, reads different filenames, and encodes with `-an`. Running the rig today produces footage and audio with no path to `public/demo.mp4`. You will have to write that step.

**ffmpeg is not installed** and `ffmpeg-static` is not a dependency of this repo. Fix that first or every encode fails.

**Both `capture-walkthrough.mjs` and `assemble.sh` default to dead session scratchpad paths.** `CUT_DIR` and `CHROME_PATH` must be passed; `assemble.sh` needs editing outright.

**`capture-walkthrough.mjs` targets `https://kitchen-brain-demo.vercel.app`**, signs in via a plain GET to `/demo`, and reuses one `storageState` across beats. `/demo` 404s unless that instance has both `SEED_DEMO_EMAIL` and `SEED_DEMO_PASSWORD` set.

**The page is already drifted from the footage it ships.** Fix these regardless of what else you do:
- The chip reads `Watch · 48 sec`. The actual `public/demo.mp4` is **39.56 s** (commit `3e8d136` replaced the binaries and never touched the component).
- The sr-only transcript says "silent, **captioned**". The current footage has no captions; the poster confirms a clean app frame.

## Decide these three before touching anything

**1. Which instance and which dataset.** The recording target and the numbers on screen come from here, so everything downstream depends on it.

- `sandbox/demo` (worktree `/home/rayan147/kitchen-brain-develop-demo`, container on `localhost:5280`) is 13 commits ahead of develop and carries the demo-readiness work: pack-out inventory consequence, label allergen provenance, readable purchases route. But it runs the **ordinary sample seed**.
- The **walkthrough seed** is the one with a story: Harbor & Vine Catering, Rodriguez backyard wedding at 200 guests on 2026-08-15, Fairview office lunch at 45 with a posted receiving checklist, a draft Aldridge tasting, two sent POs, a shorted cucumber line that creates a real follow-up, a Roma-to-hothouse substitution, and three import sources including one invoice deliberately left mid-review.

Recommended: **`sandbox/demo`'s UI running the walkthrough seed.** Neither instance is that today. Compose override on that worktree: `DATABASE_URL=file:/data/walkthrough.db`, `SEED_ON_BOOT=0`, then `npm run db:seed:walkthrough` in the container. The seed refuses any target whose basename is not exactly `walkthrough.db`, and refuses outright if any `TURSO_*` var is set. Standing policy since PR #29: **never record against production or real data.**

**2. Narrated or silent.** This is an accessibility fork, not a taste one.

- Silent video-only satisfies WCAG 1.2.1 (Level A) with the text alternative that already exists as the sr-only transcript.
- The committed `vo/` is **narrated** — 150.9 s across seven beats. Narration makes it synchronized media, which needs real captions (1.2.2) and a media alternative (1.2.3), not a hidden paragraph. A `<track kind="captions">` VTT is the honest answer, and `vo/preview.srt` gives you the timings to convert.

**3. Length.** The committed narration runs **150.9 s**. External guidance is 60–90 s for a homepage demo, with completion falling off sharply past 60 s. The section heading currently promises "Under a minute of the real thing."

Recommended: **cut the narration to about 90 s** and keep the headline honest, rather than shipping 2.5 minutes behind a headline that says under a minute. If the owner wants the full narrated walkthrough, it belongs on a separate page reached by a quiet link, not as the homepage's primary video.

## Step 0 — preflight

1. Commit `capture-walkthrough.mjs` and `cards.html` as they are, before editing.
2. Add ffmpeg. Prefer `npm i -D ffmpeg-static` so the encode is reproducible and the scratchpad fallback in `assemble.sh` can be deleted.
3. Delete every hardcoded scratchpad path in the rig and require the env var instead. A default that points at a dead session is worse than no default.
4. Rewrite `scripts/demo-video/README.md` to describe the rig that actually runs. Say plainly which generation is current and that the older scripts are kept for history.

## Step 1 — re-ground the narration against real data

**Do this before recording. The current narration is ground-truthed to a snapshot captured 2026-07-19 and the numbers have moved.** Known divergences against the walkthrough seed:

| Narration says | Walkthrough seed says |
|---|---|
| $13/guest, "$13.10/guest", "$2,600 in" | **$16.50**/guest |
| Skewers $5.50, 31.6 %, target 28 %, "charge ≥ $6.22" | Skewers **$6.75**, target **30 %** |
| Red onion is in two dishes | Red onion is in **four** |
| "almost 80 lb chicken, 59.5 lb in the pot" (~75 % yield) | chicken thigh yield is **92 %** |
| "5 cases of pita" | pita pack is **case 120 ct** |

Open `beats.json`, walk each beat against the running instance, and replace every figure with what the screen shows. Then reconcile `narration.md` by hand — there is no generator between the two files, and they drift silently.

**Hard invariant:** each beat's caption spans must concatenate token-for-token to its `narration`, or `make_voiceover.py` exits with `caption spans do not concatenate to the narration`. Numbers are spelled out in the narration ("sixteen fifty") and rendered as digits in the caption ("$16.50"); the span is the spoken form.

Also re-verify the hardcoded routes and selectors, which are the rig's most brittle surface: `/orders/3`, `/orders/3/prep`, `/orders/3/pack`, `/recipes/11`, and text matchers including `/Rodriguez backyard wedding/`, `/Summer BBQ · 200 guests/`, `/31.6%/`, `/charge ≥ \$6\.22/`, `/\$13\.10\/guest/`. Those IDs depend on insertion order in a fresh database and the percentages are now wrong. Two constraints are recorded in the rig's own comments and still apply: regex matching does not normalize whitespace and DOM lines wrap mid-sentence, and the recipe name appears twice on its page so an adjacent label must be matched instead.

## Step 2 — regenerate the voiceover

`venv/bin/python make_voiceover.py --ffmpeg /path/to/ffmpeg` regenerates `vo/*.mp3`, `timings.json`, and `preview.srt`. Voice `en-US-AndrewNeural` at `-8%`, loudnorm to −16 LUFS, 0.35 s tail pad.

Know the coupling before you run it: **`capture-walkthrough.mjs` schedules every action off caption `start` values in `timings.json`.** Changing narration silently re-times all footage. That is a feature when intended and a trap when not.

If the owner records the narration himself, note the documented one-way constraint: dropping a founder-read take into `bN.mp3` invalidates that beat's caption timings, and no re-timing code exists. Writing that re-timing is a real task, not a tweak.

## Step 3 — capture

```sh
CUT_DIR=/some/real/dir CHROME_PATH=/path/to/chrome \
  node scripts/demo-video/capture-walkthrough.mjs
```

What it does, so you can judge the output: title and end cards are **screenshots** of `cards.html` at `deviceScaleFactor: 2`; beats 2 to 6 are Playwright `recordVideo` WebM at 1280×800; each beat gets its own context; `meta.json` records `trimStart` because Playwright starts the tape at context creation, before navigation, so the loading frames must be cut. Every beat holds `duration + 1.2 s` so footage outlasts its narration. The rig injects a synthetic cursor and a green focus ring and hides scrollbars, and that injection must be re-run after every navigation.

Recording technique that the rig gives you for free but you should verify in the output: deliberate cursor movement with a brief pause on a control before clicking, steady scrolling, no zigzagging. A cursor at 1080p is nearly invisible on a phone, which is why the ring exists — confirm it actually reads at mobile size.

Record the viewport only. **The demo hostname contains the internal product name and must never appear in frame.**

## Step 4 — write the assembly step (the missing piece)

New script, `scripts/demo-video/assemble-walkthrough.mjs` or similar. It must:

1. Read `meta.json` and trim each beat by its `trimStart`.
2. Compose the two card screenshots as stills for their planned holds.
3. Mux `vo/bN.mp3` onto each beat.
4. Produce captions from `vo/timings.json`. Prefer a **sidecar WebVTT** loaded as `<track kind="captions" srclang="en" default>` over burned-in text: it is selectable, translatable, and satisfies 1.2.2 properly. Burned captions are a fallback, not the goal.
5. Join beats. Gen-3 used `xfade=transition=fadewhite:duration=0.4` with a white fade in and out; reuse that look.
6. Encode both: H.264 `-crf 23 -preset medium -movflags +faststart` and VP9 `-crf 34 -b:v 0`. **Keep the audio stream** — the `-an` in `assemble.sh` is why it cannot be reused.
7. Extract the poster: a clean frame with **no click-ripple**; the shopping list with the order header is the intended shot.
8. Copy `demo.mp4`, `demo.webm`, `demo-poster.jpg` into `public/`.

Watch the file size. Gen-3's still-composed cut ballooned to 2.4 MB; the current live-captured one is ~0.5 MB. Stay near the smaller number.

## Step 5 — update everything that moves in lockstep

`SeeItRun.astro` carries several values that must match the new footage. Missing one is how the current drift happened.

1. The chip text (`Watch · 48 sec`) — set to the real duration.
2. The `#demo-transcript` sr-only paragraph — must describe the actual footage. If it is now narrated, say so and stop calling it silent.
3. The `aria-label` if the storyboard changed.
4. The `<h2>` "Under a minute of the real thing" if the cut exceeds 60 s.
5. The poster comment claiming the shopping-list money shot.
6. Add `<track kind="captions">` if narrated.
7. `narration.md` reconciled with `beats.json`.

Keep `preload="none"` with the poster. That is a stated performance contract: zero video bytes move until play, so Lighthouse is untouched. Keep WebM before MP4 in source order, and keep `playsinline` and `muted`.

## Step 6 — the screenshot section

New section, placed **after** "See it run". Video proves it moves; stills let someone scan the same proof without pressing play, which is most of the traffic.

Design constraints, from the external evidence and this repo's own rules:

- **Three images, not a gallery.** Conversion drops after roughly six to eight distinct screenshots. Group into three pillars, one image each. The obvious three, matching the five features already on the page: the **shopping list** grouped by vendor in cases, the **prep sheet** in whole batches, and the **plate cost** with its food-cost percent.
- **Crop tight** to the thing being claimed, with a little padding for context. No browser chrome, no full-window captures, no perspective mockup frames — the repo's anti-references name "dashboard screenshots in perspective frames" explicitly.
- **A mobile variant per image.** A shot that reads at 1440 is unreadable at 390. The capture rig at `e2e/.scratch/shot-landing.mjs` in the app worktree already writes per-section phone crops; extend that pattern.
- **Alt text describes the screen and the claim**, not "screenshot of app". Screen readers cannot see an annotation, so anything an arrow would say has to be in the text.
- **Caption each image in one plain line** stating what it proves. That line is the argument; the image is the receipt.
- Annotation is optional and should be light. If you use it, high contrast that survives colour blindness, and never on more than one or two images.
- Every number visible in a screenshot must be real seeded data, and must agree with the copy beside it. If they disagree, **the screenshot wins and the copy changes.**

Capture these from the same instance as the video so the story is continuous: a visitor should recognise the Rodriguez wedding from the footage in the stills.

## Step 7 — verify

1. `npm run check` and `npm run build` (the `postbuild` runs `scripts/check-dist.mjs`).
2. Screenshot the page at 1440, 1024, and 390; confirm no horizontal overflow and that the new section reads on a phone.
3. Play the video start to finish and confirm: no loading frames, no click-ripple in the poster, no hostname in frame, captions in sync, and the chip duration matching reality.
4. Grep the finished page for em-dashes in user-facing copy, for "Kitchen Brain", and for stock SaaS phrasing.
5. Confirm every claim near the video and the screenshots traces to shipped behaviour, and that the visible numbers match the seeded data.
6. Report what changed, what you regenerated, and anything you could not verify.

## Reference — external guidance this section is built on

- Homepage demo videos: 60–90 s, completion falls off sharply past 60 s; the first 10 seconds decide whether anyone keeps watching; click-to-play with a strong poster rather than autoplay.
- Screen recording: deliberate cursor movement, half-second pause before a click, steady scroll, zoom or highlight on the moments that matter.
- Screenshots: three pillars beats a gallery; crop tight with light padding; separate mobile crops; alt text carries what an annotation would say.
- Silent video-only needs a text alternative (1.2.1, Level A). Narrated video is synchronized media and needs captions (1.2.2) plus a media alternative (1.2.3).

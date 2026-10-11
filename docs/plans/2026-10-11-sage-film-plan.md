# Sage film plan: a third composition on the film model, with the credit allowance

Date: 2026-10-11. Status: plan. Owner decisions answered 2026-10-11 (below). Nothing is captured or built yet.
Target: `/features/sage` → `#watch-sage` (`src/components/sections/SageFeature.astro:104`).
Built on branch `video/sage-film` (owner, 2026-10-11: "go", then "film in hero + redo page").

## Where things stand

- **The current walkthrough isn't Remotion.** It is 20 seconds of stills cut together by ffmpeg and ImageMagick (`scripts/sage-video/assemble.mjs`). It uses DejaVu fonts, a flat green end card and 3 VTT cues for 4 chapters, so it looks different from the other films.
- **The other two films are Remotion.** The wedding (`PromoFilm`) and the office lunch (`DropoffFilm`) both live in `video/`. They share one renderer (`Scene.tsx`), the `film-model.ts` beat table, the ChapterCard/Caption/EndCard/PhoneFrame/SplitScreen elements, and a zod-parsed manifest of strings the app printed. They render at 1920×1080 and 30 fps.
- **The allowance in the app (kitchen-brain develop 9bd986496):**
  - `SAGE_PERIOD_CREDITS = 2_000` per paid billing period, resetting on the Stripe charge day.
  - `SAGE_TRIAL_CREDITS = 300` during the free trial.
  - `maxCreditsPerTenantPerDay = 600`, a burst guard.
  - At 80% used, the Sage panel shows once: "Sage has used 1,640 of 2,000 credits. They reset on Wed Oct 28." It comes with a dismiss button.
  - Billing shows: "Sage: 1,240 of 2,000 credits used. Resets Wed Oct 28."
  - When the allowance is spent: "Sage has used this kitchen's allowance. It comes back on …, and every kitchen screen still works."

## Owner decisions (answered 2026-10-11)

- **1: follow develop now**, as with roles.
- **2: both numbers**, "2,000 Sage credits each paid month, 300 during the free trial". The 600-a-day guard stays off the page.
- **3: build on local develop ab176ed now.** Ship only after the peer pushes the lunch film.

The questions as asked:

1. **The allowance isn't in production.** `allowance.ts` is on kitchen-brain develop only. main, release and origin/main are at ed6ff5f01 without it. The site's rule is that the page claims only what has shipped. Choose one:
   - (a) hold the film until kitchen-brain ships the allowance (recommended);
   - (b) rule that, as with roles, the site follows develop for this.
2. **Which number the page states.** Every CTA leads to the trial, and the trial gets 300 credits, not 2,000. Recommended wording: "2,000 Sage credits each paid month, 300 during the free trial", with no mention of the 600-a-day guard. Alternative: show only the screens and let the app's own strings speak.
3. **The video base is the peer's unpushed work.** `film-model.ts` and the shared renderer exist only on local develop (ab176ed, 12 commits ahead of origin/main, the lunch-film work). Shipping a Sage film on that base means pushing those commits. Choose one:
   - wait for the peer to push;
   - authorize pushing them together.

   The new ledger row also has to wait on the RC-75 → RC-76 renumber.

## The story (story-content Steps 1–4, filled in properly in the tracker)

- **Idea.** An owner who is mid-setup and short on time wants a straight answer about their own costs. The wall is that they don't trust a chatbot's numbers or an open-ended AI bill.
- **The beat that's new.** Today's film ends on "you keep the final say". The new beat answers the next objection, "what does this cost me, and can it run away?": a fixed allowance shown in plain numbers, and the kitchen keeps working when it runs out.
- **Scenes:**
  1. Ask during setup.
  2. Starting questions.
  3. The answer with its records (short rib, $7.28).
  4. A draft waits for approval, if a frame exists; otherwise keep today's sign-off line.
  5. **The allowance:** the panel note at 80%, then the billing usage line.
  6. End card with the shared price and trial.
- **Length.** About 30 to 35 seconds, with chapter cards at the film model's 3.5 s. "Watch 20 seconds" becomes the real length.
- **Snap line (one only):** the app's own "every kitchen screen still works", if the owner allows the spent state on screen. Otherwise the reset date.

## Build (Remotion, after the decisions)

**Worktree.** Branch `video/sage-film` in `.gitworktrees/`, based on whatever base decision 3 settles.

**1. Capture.** Extend `scripts/capture-sage-proof.mjs` against the local demo world (localhost, sample kitchen Nair & Castellano):
   - Seed a business in an active, non-trialing period with about 1,640 credits in `sage_runs.credits`. Use sample data only; any test.app write needs approval first.
   - Shoot: setup + Ask Sage, starting questions, the short rib answer (desktop and phone), the panel's allowance note, and the billing usage line.
   - Write `public/proof/film-sage/manifest.json` with each frame's host and app sha, plus the printed strings: `allowanceNote`, `billingLine`, `periodCredits`, `trialCredits`, `resetsOn`, `answerCost`.

**2. Film table.**
   - `video/src/film-sage.ts`: the scenes and beats with rings and focus.
   - `manifest-sage.ts`: a zod schema in which every caption figure is a manifest string, so no typed "2,000" appears.
   - Register `SageFilm` in `Root.tsx`, reusing `Scene.tsx` and the elements. Keep the existing "Considered Strategy; not used" refusal, since the films differ only in data.

**3. Scripts.**
   - Add `frames:sage` and `render:sage` (through `render:check` with `FILM=sage`).
   - Extend `npm run vtt` so the VTT has one cue per caption.
   - Add tests in `film.test.ts` and `render-guard.test.ts` for the new table.

**4. Preview.** Open Remotion Studio (`npm run dev` in `video/`, composition `/SageFilm`) for review. Rendering waits for an explicit "render".

**5. Render, after approval.** Output `public/proof/sage-walkthrough.{mp4,webm}` + `.vtt` + poster, keeping the same paths so the embed doesn't change. Retire `scripts/sage-video/assemble.mjs`.

## Page and pins that change

- **SageFeature.astro:**
  - `videoChapters` (times and a new allowance chapter);
  - "Watch 20 seconds";
  - the chapter nav's "in 20 seconds";
  - the "Twenty seconds: …" intro;
  - the video `aria-label`;
  - the figcaption capture dates.
- **FAQ.** Add one answer, "Is there a limit on Sage?", using the wording from decision 2.
- **sage.astro.** Update the VIDEO note ("Twenty-second…").
- **Checks.** `scripts/check-sage-page.mjs` and `scripts/verify-sage.mjs` get the new length, chapter count and transcript.
- **Ledger.** `docs/release-claim-ledger.md` gets the allowance claim (number set after the renumber), and `check-landing-claims` picks it up.
- **Story.** Update `docs/stories/sage-feature.story.md` (revision entry, new beat, the snap line), with the `<!-- story -->` pointer unchanged.

## Verification

- `video/`: `npm test`, `npm run typecheck`, `npm run lint`, `render:check`.
- Site: `npm run build`, `npm run check`, `verify-sage.mjs` against the dev server. Watch the film at 1440 and 390 widths, with captions on.
- Reviews:
  - `english-elite-editor` on captions and page copy;
  - `humanize-reviewer` on captions;
  - `kb-caterer-owner`: does the allowance beat build trust or scare people?
- After deploy, check the film and the FAQ answer on costcook.io.

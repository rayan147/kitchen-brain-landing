# BRIEF: Retake the homepage screenshots

Paste everything below the line into a fresh session in this repo. It is written
as a prompt. The audit that produced it is at the bottom.

---

## The prompt

You are retaking every product capture on the CostCook homepage (`src/pages/index.astro`)
so that they are sharp, consistent, cropped to one claim each, and honest. Read
`CLAUDE.md` first: the page is editorial print, not SaaS; every capture is evidence for
a sentence that must survive a demo call; no perspective frames, no floating
screens, no mockups, no invented data. Do not change copy except alt text and
captions, which must be rewritten from the new pixels.

### What "better" means here (the rules)

1. **One capture, one claim.** Every image answers the one question its section
   asks and nothing else. Crop to the panel, table or answer that carries the
   claim. If a capture shows two things, split it or cut one. (Feature
   screenshots that show the whole product are the most common failure.)
2. **Always 2x, never a video frame.** Capture with Playwright at
   `deviceScaleFactor: 2` from the running app. Never cut a still from
   `demo.mp4`: the current hero and outcome crops are 1x frames with codec
   artifacts and read as blurry on every phone. Store the PNG at 2x, render at
   half its pixel width, keep `width`/`height` attributes at the stored size.
3. **One scale across the page.** The app's 16px body text must land at the
   same rendered size in every capture (about 14-15 CSS px on desktop, no
   smaller than 12 on a phone). Right now the yield table, the Sage answer and
   the nutrition panel are all at different effective zooms. Pick one viewport
   width per family (desktop captures at 1440 CSS px, the app harness's own
   discipline; at 1280 the lines table wraps its column heads. Phone captures
   at 390)
   and do not resize the PNG afterwards; crop instead.
4. **Crop tight, no dead space.** Trim to the content plus 16-24 px of the
   app's own padding. The Sage capture currently carries 300 px of empty cream
   below the input; cut it. Never crop through a word or a number.
5. **Phone gets its own capture, not a shrunk desktop one.** Every section
   that shows an image on phones ships a portrait capture taken at 390 CSS px
   (2x = 780 px wide) of the same record, cropped to the one element the
   section names. The rule that already exists in `Hero.astro` ("the whole
   panel at 390px renders its small text at 6px") applies everywhere.
6. **No cursor, no hover, no focus ring, no scrollbars, no toasts.** Move the
   mouse to (0,0) before every shot, blur the active element, wait for network
   idle and one animation frame, and hide `[data-sonner-toaster]` or its
   equivalent. Check every PNG by eye before saving.
7. **Same world, same day.** All captures come from the walkthrough demo world
   (Maple & Main, the wedding order, Greek Salad, Chicken Shawarma) seeded by
   `scripts/demo-video/seed.mjs` or `npm run demo:seed` in the app repo, so the
   numbers on the page agree with each other and with the video. Label every
   figure `SANDBOX BUILD · sandbox/demo · <date>` or `FROM THE TOUR · <mm:ss>`
   as the section already does, and record the SHA in the data file next to
   the capture.
8. **Frames stay ours.** The only frame is the existing ticket: hairline
   border, cream paper, `shadow-ticket`. No browser chrome, no device bezels,
   no drop shadows, no gradients. The annotation budget is zero; if the crop
   cannot explain itself, recrop, do not draw arrows.
9. **Alt text is a claim.** Rewrite each alt from the new pixels, word for
   word, numbers included. Then run `npm run check`; the claim guard pins
   several of these strings.
10. **Weight.** Run every PNG through `oxipng -o4` or `pngquant --quality
    80-95`; the page budget for all homepage captures together is 1.2 MB. Keep
    `loading="lazy"` on everything below the hero and `fetchpriority="high"` on
    the hero image only.

### The shot list (homepage, in stop order)

Read `src/lib/stops.ts` for the order. For each stop, the section, the claim its
image must prove, and the capture to take:

| Stop | Section file | The one claim | Desktop capture (1440 CSS, 2x) | Phone capture (390 CSS, 2x) |
|---|---|---|---|---|
| Hero | `Hero.astro` | Food cost against target, and the price that would have met it | Order pricing panel, "Live totals" through "Next step", nothing above or below | The "Next step" box alone |
| Outcomes | `CustomerOutcomes.astro` | Four outcomes: quote checked, prep list, PO, price corrected | Four tight crops, each the single element named in the outcome body, all four at the same zoom and roughly the same height so the 4-up row reads as one set | Same crops (they are already small) |
| Yield | `TheYield.astro` | AP quantity and cost per line, computed from yield | The ingredient table, header row through "Base cost", with one "View line calculation" expanded so the math is visible | One expanded line calculation, portrait |
| Nutrition | `NutritionFacts.astro` | Panel per portion, blanks stay blank | Recipe nutrition section, the four-number strip through the sources list | The printed label sheet (already portrait; recapture at the shared scale) |
| Sage | `Sage.astro` | An answer with its source under it | "You asked" through "Where this came from", cropped at the bottom of the source row | Same, at 390 |
| Everything else | | No image, deliberately (`PaperIn.astro` explains why) | | |

Where a section's data file (`src/lib/nutrition.ts`, `src/lib/sage.ts`,
`CustomerOutcomes.astro` `outcomes[]`, `Hero.astro`) hard-codes `width`/`height`,
update them to the new PNG sizes and the CSS render width to half.

### How to do it

1. Start the app repo's demo world (`kitchen-brain-develop-demo`, branch
   `sandbox/demo`): `npm run demo:seed`, then `vite dev --port 4181`; log in
   through `/demo`. Record the SHA.
2. Write one script, `scripts/capture-proof.mjs`, that owns every homepage
   capture: a list of `{ name, url, viewport, clip: locator, pad }` entries, a
   shared `prepare(page)` that applies rule 6, and `locator.screenshot()` with
   `scale: 'device'` so clips are element-bounded, not hand-drawn rectangles.
   Playwright lives at `/home/rayan147/kitchen-brain/node_modules/playwright`.
   Re-runnable in one command; that is the point.
3. Run it, open every PNG, and reject any that break a rule above. Fix the
   script, not the PNG.
4. Update the data files, alts and captions from the pixels. Optimize.
5. `npm run check && npm run build`, then `astro preview` and look at the
   homepage at 390, 768 and 1280 with DPR 2 in Playwright; screenshot each
   section and confirm text in the captures is at least as sharp as the page's
   own type.
6. Fill `docs/stories/homepage-captures.story.md` (Steps 1-3 and 11 at
   minimum: the reader is a caterer on a phone mid-shift deciding whether the
   demo is worth 15 minutes; the wall is "every SaaS screenshot I have seen was
   a mockup"). Commit on a branch with the script, the PNGs, and the data
   changes together.

### Do not

- Fake, stage, or Photoshop a screen. If the demo world cannot show a state,
  the section stays without an image and says why in a code comment, as
  `PaperIn.astro` and the "THE DIFFS" step already do.
- Add device frames, tilted mockups, gradients, blurred backgrounds, or
  annotations.
- Introduce a screenshot tool or SaaS "beautifier". The output is a PNG from
  the real app inside the ticket frame the page already has.
- Leave dead files. `src/lib/workflow.ts` references twelve `/proof/loop-*`,
  `setup-*`, `shop`, `cost`, `menu`, `money`, `prep` PNGs that were deleted in
  commit `0d3f3ad`; the `STEPS[].shot` data is unused. Delete the shot fields
  or recapture them, do not leave references to files that 404.

---

## The audit behind the prompt (2026-08-29)

What is on disk in `public/proof/` and how it renders:

| File | Pixels | Source | Problem |
|---|---|---|---|
| `hero-pricing.png` | 750x274 | video frame | 1x, codec artifacts, soft text; it is the first image on the page |
| `hero-pricing-mobile.png` | 440x160 | video frame | same, at the size a phone shows it at 1:1 |
| `outcome-quote/prep/po/price.png` | 300x140 to 1200x400 | video frames | four different scales in a 4-up row; smallest is 300 px wide |
| `yield-lines.png` | 2272x1370 | Playwright 2x | sharp, but a bare table with no line calculation open, so the yield claim is asserted not shown |
| `sage-answer.png` | 1622x1288 | Playwright 2x | sharp; bottom quarter is empty cream |
| `nutrition-panel.png` | 2272x2456 | Playwright 2x | sharp; different zoom from the yield table beside it in scroll order |
| `nutrition-label.png` | 768x2072 | Playwright 2x | fine |

Three capture pipelines exist (video frames via ffmpeg, ad-hoc Playwright runs,
`scripts/demo-video/capture-beats.mjs`) and none is the one the homepage uses.

What the research says, and which of it applies to this page:

- Real product screenshots beat abstract illustration and mockups for
  conversion; lead with the product in the hero, cropped to one thing, no
  multi-device fans. Applies, and the page already believes it.
- Crop each feature screenshot to the one thing it proves; "showing the whole
  product in every screenshot" is the most common failure. Applies to yield
  and nutrition.
- Export at 2x for retina; capture with the browser's device scale, not by
  upscaling. Applies to the hero and outcomes, which are 1x frames.
- Keep one consistent frame across all captures. The page has one (the
  ticket); the rule is to keep it, not add browser or device chrome.
- Use annotations sparingly, one accent colour, three at most. This page's
  brand says zero; the crop does the pointing.
- Automate marketing screenshots with code so they can be retaken after every
  release. This is the single biggest gap: no script owns these images.

Sources:
- https://framiq.app/blog/make-saas-screenshots-look-professional
- https://framiq.app/blog/saas-hero-section-design-guide
- https://screenhance.com/blog/saas-landing-page-screenshots
- https://www.testmo.com/guides/automating-marketing-screenshots/
- https://studiomaydit.com/blog/saas-landing-page-best-practices-2026
- https://www.vezadigital.com/post/best-saas-landing-page-examples
- https://bloggingwizard.com/landing-page-visuals/
- https://vwo.com/blog/eye-tracking-website-optimization/

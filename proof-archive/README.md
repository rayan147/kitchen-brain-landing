# Screenshots the site does not render

Thirty-five product screenshots that lived in `public/proof/` and were shipped
to every visitor while being loaded by nobody. Moved here on 2026-08-21, during
the demo-video and screenshot pass. Nothing is deleted; nothing ships.

Grep `src/` for what the site actually loads and, excluding `/founder.jpg` and
inline SVG, the answer is one pair: `/proof/yield-lines.png` and
`/proof/yield-lines-mobile.png`, in `src/components/sections/TheYield.astro`.
Those two stayed in `public/proof/`, which is now 176 KB instead of 3.2 MB.

## What is in here, and why it was orphaned

**Twenty-five referenced only by `src/lib/workflow.ts`** (`cost*`, `loop-*`,
`menu*`, `money*`, `prep*`, `setup-*`, `shop*`). That module describes the
fourteen-step loop as data and is imported by **no page**. It is retained on
purpose, not by accident: `LoopBand.astro` condenses its ordering into the
hero band's six stops and says so in its header comment, so the module is the
canonical order even though nothing renders it. Its images are a different
matter, and they were being served to every visitor to support a module that
draws nothing.

**Ten `v2-*` crops** copied in from the app repo on 2026-08-07 with **zero
references anywhere in `src/`**. `v2-hero-money-mobile.png` became unreferenced
when the third-pass repositioning replaced the hero screenshot with `LoopBand`.

## If you want one of these back

Do not move a file back into `public/` on its own. These were all captured
before the current demo world existed, so a screenshot from here and the video
on the homepage show different kitchens with different numbers. Regenerate it
instead: the `@landing` test in the app repo's `demo/capture.spec.ts` produces
the `v2-*` crops from the same run as the video, and adding a crop there is a
few lines. `scripts/demo-video/README.md` has the sequence.

Whatever comes back also needs alt text written from the new image. Alt text on
this page names specific figures and is read in place of the picture, so it is
prospect-facing copy and a truth-pass surface, not a label.

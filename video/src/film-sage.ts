import type { Film, FilmScene } from "./film-model";
import { SageManifestSchema } from "./manifest-sage";

// story: docs/stories/sage-feature.story.md
// The third film: Sage, for the hero of /features/sage. Ask beside the screen
// you are on, get an answer you can check line by line, and see what Sage
// costs to run: a fixed allowance, said once before it runs out. About 28
// seconds, no chapter cards (a hero film plays without sound or patience).
// The panel and billing frames are from a demo world of kitchen-brain develop
// (owner, 2026-10-11: the site follows develop for the allowance); the answer
// frame is the 2026-10-07 still. public/proof/film-sage/manifest.json names
// each frame's source.
//
// Rings are measured off the frames in public/proof/film-sage (percent of
// each frame's box); retune them whenever a frame is re-shot.

export const SAGE_ORDER = ["ask", "answer", "allowance", "end"] as const;

const SCENES: Record<(typeof SAGE_ORDER)[number], FilmScene> = {
  // Today, with the panel open: the starting questions come from the day.
  ask: {
    chapter: null,
    seconds: 5,
    beats: [
      {
        from: 0,
        to: 5,
        layout: "screen",
        frames: ["panel-ask-desktop.png"],
        caption: "Ask Sage beside the screen you are working on.",
        ring: { x: 68.5, y: 21, width: 30, height: 56 },
        focus: { x: 100, y: 40, scale: 1.12 },
      },
    ],
  },
  // The wedding's short rib, line by line, each line linked to its recipe.
  answer: {
    chapter: null,
    seconds: 9.5,
    beats: [
      {
        from: 0,
        to: 5,
        layout: "screen",
        frames: ["answer-desktop.png"],
        caption: "It answers from your records: {answerCost} a portion, and why.",
        // Pulled back to the top, so the caption sits under the third line.
        focus: { x: 50, y: 0, scale: 0.72 },
        fromScale: 0.72,
        ring: { x: 1.5, y: 22, width: 97, height: 12.5 },
      },
      {
        from: 5,
        to: 9.5,
        layout: "screen",
        frames: ["answer-desktop.png"],
        caption: "Every line links to its record. Sage changes nothing on its own.",
        // Pulled back to the top, so the caption sits under the third line.
        focus: { x: 50, y: 0, scale: 0.72 },
        fromScale: 0.72,
        ring: { x: 1.5, y: 38.5, width: 97, height: 60 },
      },
    ],
  },
  // What it costs to run: the panel's once-a-period note, then the count on
  // the billing page. The trial's smaller allowance is said, not hidden.
  allowance: {
    chapter: null,
    seconds: 10,
    beats: [
      {
        from: 0,
        to: 5,
        layout: "screen",
        frames: ["panel-note-desktop.png"],
        caption: "Sage tells you once, well before the month's credits run out.",
        ring: { x: 68.5, y: 10.5, width: 31, height: 10 },
        focus: { x: 100, y: 0, scale: 1.12 },
      },
      {
        from: 5,
        to: 10,
        layout: "screen",
        frames: ["billing-usage-desktop.png"],
        caption:
          "{periodCredits} Sage credits each paid month, {trialCredits} during the free trial.",
        ring: { x: 69.5, y: 45.5, width: 27, height: 7.5 },
        // In on the usage card: the line is the page's smallest type.
        focus: { x: 100, y: 40, scale: 1.6 },
      },
    ],
  },
  end: {
    chapter: null,
    seconds: 5,
    beats: [{ from: 0, to: 5, layout: "end", frames: [] }],
  },
};

export const SAGE: Film = {
  id: "SageFilm",
  title: null,
  order: SAGE_ORDER,
  scenes: SCENES,
  framesDir: "frames-sage",
  parseManifest: (json) => SageManifestSchema.parse(json),
};

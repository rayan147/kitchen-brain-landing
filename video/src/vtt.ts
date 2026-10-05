import { captionsFor, type SceneId } from "./film";
import type { Manifest } from "./manifest";

// When each caption is on screen, in seconds from the start of the film. Scene
// starts are PromoFilm's durations less the 15-frame fades (0, 165, 570, 1035,
// 1500, 1845, 2130 frames at 30 fps); the in-scene times are the scenes' own
// <Sequence> offsets. Change a scene's timing and change it here too.
const CUES: Record<SceneId, [number, number][]> = {
  coldOpen: [[2.5, 6]],
  charge: [[5.5 + 3, 5.5 + 14]],
  proposal: [
    [19 + 3, 19 + 9],
    [19 + 9, 19 + 16],
  ],
  deposit: [
    [34.5 + 2.5, 34.5 + 7],
    [34.5 + 10.3, 34.5 + 13],
    [34.5 + 13, 34.5 + 14.5],
    [34.5 + 14.5, 34.5 + 16],
  ],
  buy: [[50 + 3, 50 + 12]],
  invoices: [[61.5 + 3, 61.5 + 10]],
  close: [[71 + 1, 71 + 10]],
};

function stamp(seconds: number): string {
  const ms = Math.round(seconds * 1000);
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = (ms % 60_000) / 1000;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${s.toFixed(3).padStart(6, "0")}`;
}

export function toVtt(manifest: Manifest): string {
  const cues = (Object.keys(CUES) as SceneId[]).flatMap((id) => {
    const texts = captionsFor(id, manifest);
    if (texts.length !== CUES[id].length)
      throw new Error(
        `${id}: ${texts.length} captions but ${CUES[id].length} cue times`,
      );
    return CUES[id].map(([from, to], i) => ({ from, to, text: texts[i] }));
  });
  cues.sort((a, b) => a.from - b.from);
  return `WEBVTT\n\n${cues.map((c) => `${stamp(c.from)} --> ${stamp(c.to)}\n${c.text}`).join("\n\n")}\n`;
}

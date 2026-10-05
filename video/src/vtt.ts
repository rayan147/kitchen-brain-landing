import { FILM, SCENE_ORDER, resolveCaption, sceneStarts } from "./film";
import type { Manifest } from "./manifest";

function stamp(seconds: number): string {
  const ms = Math.round(seconds * 1000);
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = (ms % 60_000) / 1000;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${s.toFixed(3).padStart(6, "0")}`;
}

// The cues come from the same beats the film renders, so the player's text and
// the burned-in captions share one clock.
export function toVtt(manifest: Manifest): string {
  const starts = sceneStarts();
  const cues = SCENE_ORDER.flatMap((id) =>
    FILM[id].beats.flatMap((b) =>
      b.caption
        ? [
            {
              from: starts[id] + b.from,
              to: starts[id] + b.to,
              text: resolveCaption(b.caption, manifest),
            },
          ]
        : [],
    ),
  );
  cues.sort((a, b) => a.from - b.from);
  return `WEBVTT\n\n${cues.map((c) => `${stamp(c.from)} --> ${stamp(c.to)}\n${c.text}`).join("\n\n")}\n`;
}

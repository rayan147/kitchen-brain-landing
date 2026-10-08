// What a film is: an ordered table of scenes, each a run of timed beats, read
// by one renderer (Scene.tsx), the WebVTT writer and the render guard. The
// wedding (film.ts) and the office lunch (film-dropoff.ts) are two tables.
// Considered Strategy (a renderer per film); not used because the two films
// differ only in their data: scenes, captions, frames and a title or none.

// Percent of the frame box. `focus` pushes the camera toward (x, y) up to
// `scale`; `ring` circles what the caption names.
export type Ring = { x: number; y: number; width: number; height: number };
export type Focus = { x: number; y: number; scale: number };

// A beat is one stretch of screen time, in seconds from the scene's start.
// "screen": one desktop frame. "phone": one phone frame, placed where the
// split screen puts it. "split": desktop left, phone right. "title" and "end"
// are the film's two cards.
export type Beat = {
  from: number;
  to: number;
  layout: "screen" | "phone" | "split" | "title" | "end";
  frames: string[];
  caption?: string;
  ring?: Ring;
  focus?: Focus;
  scroll?: [number, number];
  // Where the caption sits: at the bottom unless what it names is there.
  captionAt?: "top";
  // The scale the camera starts from on a cut to a much closer frame, so the
  // cut does not jump (the Confirm dialog after the shop table).
  fromScale?: number;
};

export type FilmScene = {
  chapter: string | null;
  seconds: number;
  beats: Beat[];
};

export type Film = {
  // The composition id and the VTT's file name.
  id: string;
  title: string | null;
  order: readonly string[];
  scenes: Record<string, FilmScene>;
  // Under public/: where this film's frames and manifest live. Each film has
  // its own folder, because copying a film's frames clears its folder first.
  framesDir: string;
  // The film's manifest, parsed, never cast: a missing figure stops the render
  // instead of printing "undefined" into a caption. Every film's carries the
  // end card's price and trial.
  parseManifest: (json: unknown) => FilmManifest;
};

export type FilmManifest = { displayPrice: string; trialDays: string };

// Long enough for the longest question (12 words) at 4 words a second after
// its half-second fade-in.
export const CHAPTER_SECONDS = 3.5;
export const FPS = 30;
export const FADE_FRAMES = 15;

export function resolveCaption(template: string, figures: object): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = (figures as Record<string, unknown>)[key];
    if (typeof value !== "string") throw new Error(`unresolved token {${key}}`);
    return value;
  });
}

export function captionsOf(
  film: Film,
  scene: string,
  figures: object,
): string[] {
  return film.scenes[scene].beats.flatMap((b) =>
    b.caption ? [resolveCaption(b.caption, figures)] : [],
  );
}

/**
 * The camera scale a beat starts from: where the previous beat left it when
 * both show the same frames (each beat is its own Sequence, so otherwise the
 * zoom snaps back to 1 at the cut), else 1.
 */
export function cameraStartOf(
  film: Film,
  scene: string,
  index: number,
): number {
  const beats = film.scenes[scene].beats;
  const prev = beats[index - 1];
  const own = beats[index].fromScale ?? 1;
  if (!prev?.focus) return own;
  return prev.frames.join() === beats[index].frames.join()
    ? prev.focus.scale
    : own;
}

/**
 * Where the camera's origin starts: the previous beat's focus point when both
 * show the same frames, so carrying the scale over does not also snap the
 * origin (which shifts the page sideways at the cut), else null.
 */
export function cameraOriginOf(
  film: Film,
  scene: string,
  index: number,
): { x: number; y: number } | null {
  const beats = film.scenes[scene].beats;
  const prev = beats[index - 1];
  if (!prev?.focus || prev.frames.join() !== beats[index].frames.join())
    return null;
  return { x: prev.focus.x, y: prev.focus.y };
}

export function sceneFramesOf(film: Film, scene: string): string[] {
  return [...new Set(film.scenes[scene].beats.flatMap((b) => b.frames))];
}

/** Every frame the film shows, once. */
export function filmFramesList(film: Film): string[] {
  return [...new Set(film.order.flatMap((id) => sceneFramesOf(film, id)))];
}

/** Start of each scene in seconds, with the fades between scenes overlapping. */
export function sceneStartsOf(film: Film): Record<string, number> {
  let t = 0;
  const starts: Record<string, number> = {};
  for (const id of film.order) {
    starts[id] = t;
    t += film.scenes[id].seconds - FADE_FRAMES / FPS;
  }
  return starts;
}

export function totalFramesOf(film: Film): number {
  const total = film.order.reduce(
    (n, id) => n + film.scenes[id].seconds * FPS,
    0,
  );
  return total - (film.order.length - 1) * FADE_FRAMES;
}

/**
 * The frames over which a chapter card's question fades up: after the scene
 * fade that brings the card in, so the outgoing screen and the question never
 * share the screen, then over half a second.
 */
export function questionFadeFrames(fps: number): [number, number] {
  return [FADE_FRAMES, FADE_FRAMES + Math.round(0.5 * fps)];
}

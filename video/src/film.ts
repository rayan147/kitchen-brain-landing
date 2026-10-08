import type { Manifest } from "./manifest";

// story: docs/stories/promo-video.story.md
// The film follows the Nair & Castellano wedding, the one the homepage frames
// show, through develop's own event workflow (src/lib/events/derive.ts):
// Inquiry (a phone call), Menu & service (where the job is priced), Proposal
// and Client decision, Agreement and deposit, Book the event, then kitchen
// planning and Confirm order. One table drives the scenes, their timing and
// the WebVTT file, so the three cannot drift apart.
// Considered Template Method for scenes; not used because every scene is the
// same shape (a chapter card, then timed beats), which is data, not behaviour.

export const SCENE_ORDER = [
  "coldOpen",
  "menu",
  "decision",
  "agreement",
  "kitchen",
  "receive",
  "prep",
  "pack",
  "close",
] as const;
export type SceneId = (typeof SCENE_ORDER)[number];

export const TITLE = "Know what the job makes before you cook it.";

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

type Scene = { chapter: string | null; seconds: number; beats: Beat[] };

// Long enough for the longest question (12 words) at 4 words a second after
// its half-second fade-in.
export const CHAPTER_SECONDS = 3.5;

// Rings and focus points are measured off the frames of the 2026-10-07 walk
// of the Nair & Castellano wedding on local develop (percent of each frame's
// box); retune them whenever a frame is re-shot.
export const FILM: Record<SceneId, Scene> = {
  // The client calls; the inquiry goes in as she says it, date not decided.
  coldOpen: {
    chapter: null,
    seconds: 11.5,
    beats: [
      { from: 0, to: 2.5, layout: "title", frames: [] },
      {
        from: 2.5,
        to: 7,
        layout: "phone",
        frames: ["events-inquiry-mobile.png"],
        caption: "A client calls about a wedding. Write it down as it comes.",
        ring: { x: 3.5, y: 31.8, width: 32, height: 5.8 },
        scroll: [0, 0],
      },
      {
        from: 7,
        to: 11.5,
        layout: "phone",
        frames: ["events-inquiry-mobile.png"],
        caption: "Date not decided, about {guests} guests. Rough is fine.",
        ring: { x: 3.5, y: 77.5, width: 93, height: 19.5 },
        scroll: [100, 100],
      },
    ],
  },
  // Develop prints the price, food cost and target on the event's step 2,
  // Menu & service, so that is where the job is priced.
  menu: {
    chapter: "What do I charge a head?",
    seconds: 13.5,
    beats: [
      {
        from: 3.5,
        to: 8.5,
        layout: "screen",
        frames: ["events-menu-desktop.png"],
        caption: "{pricePerGuest} a guest. Food cost {proposalFoodCostPct}.",
        focus: { x: 22, y: 50, scale: 1.1 },
        ring: { x: 17.5, y: 49, width: 43, height: 20.5 },
      },
      {
        from: 8.5,
        to: 13.5,
        layout: "screen",
        frames: ["events-menu-desktop.png"],
        caption: "Under your {target} target. You know it before you send.",
        focus: { x: 80, y: 60, scale: 1.15 },
        ring: { x: 68, y: 70, width: 27.5, height: 9.5 },
      },
    ],
  },
  // The offer as she sees it on her phone, its total, her two buttons, then
  // her answer. The offer frame is the homepage capture of this wedding's
  // offer (a fresh world on the same build); the acceptance is this walk's.
  decision: {
    chapter: "Can the client say yes from a phone?",
    seconds: 15,
    beats: [
      {
        from: 3.5,
        to: 7.5,
        layout: "phone",
        frames: ["events-offer-mobile.png"],
        caption: "The offer, on the client's phone: {offerTotal}.",
        ring: { x: 5, y: 27, width: 90, height: 15.8 },
        scroll: [0, 0],
      },
      {
        from: 7.5,
        to: 11.5,
        layout: "phone",
        frames: ["events-offer-mobile.png"],
        caption: "Accept, or ask for changes. The client decides.",
        ring: { x: 2, y: 91.5, width: 96.5, height: 7.5 },
        scroll: [100, 100],
      },
      {
        from: 11.5,
        to: 15,
        layout: "phone",
        frames: ["events-accepted-mobile.png"],
        caption: "Accepted, from the phone. Next, the agreement.",
      },
    ],
  },
  // The deposit paid by card, the balance's due day, the agreement signed on
  // paper (local develop has no online signing, so the app takes the signed
  // copy), then Book the event once everything it asks for is in
  // (booking-requirements.ts).
  agreement: {
    chapter: "Signed, and deposit paid?",
    seconds: 21.5,
    beats: [
      {
        from: 3.5,
        to: 7.5,
        layout: "screen",
        frames: ["events-payments-paid-desktop.png"],
        caption: "Deposit {deposit}, paid by card from the link.",
        ring: { x: 2.5, y: 50, width: 53, height: 25 },
      },
      {
        from: 7.5,
        to: 11,
        layout: "screen",
        frames: ["events-payments-paid-desktop.png"],
        caption: "The balance, {balance}, is due {balanceDue}.",
        // The balance row is the card's foot; the caption sits on top.
        captionAt: "top",
        ring: { x: 2.5, y: 79, width: 96, height: 15 },
      },
      {
        from: 11,
        to: 15,
        layout: "screen",
        frames: ["events-agreement-desktop.png"],
        caption: "Signed on paper? Upload the copy. It stays with the event.",
        // A short card scaled up: at the bottom the caption covered its link.
        captionAt: "top",
      },
      {
        from: 15,
        to: 19,
        layout: "screen",
        frames: ["events-book-event-desktop.png"],
        caption: "A yes is not a booking. Signed and paid is.",
        ring: { x: 1.5, y: 28, width: 97, height: 30 },
      },
      {
        from: 19,
        to: 21.5,
        layout: "screen",
        frames: ["events-booked-desktop.png"],
        caption: "Booked.",
      },
    ],
  },
  kitchen: {
    chapter: "How much do I order so I\u2019m not short?",
    seconds: 17.5,
    beats: [
      {
        from: 3.5,
        to: 9,
        layout: "screen",
        frames: ["events-shop-desktop.png"],
        // "Uses 11.3 lb of 16.5 lb": the pack you open is not all food cost,
        // which the closeout's "at what you paid" figure leans on.
        caption:
          "Whole packs, by supplier, for {guests}. What's left stays on the shelf.",
        ring: { x: 2, y: 58.5, width: 96, height: 11 },
      },
      {
        from: 9,
        to: 13,
        layout: "screen",
        frames: ["events-confirm-desktop.png"],
        caption: "Confirm, and prices and quantities lock.",
        fromScale: 0.94,
        ring: { x: 74, y: 62, width: 22, height: 27 },
      },
      {
        from: 13,
        to: 17.5,
        layout: "screen",
        frames: ["events-po-desktop.png"],
        caption: "Each supplier gets only its own lines.",
      },
    ],
  },
  // After the plan is confirmed: the delivery (/orders/<id>/receiving), the
  // prep list and the pack list (the order's Prep and Pack tabs).
  receive: {
    chapter: "Did it all come off the truck?",
    seconds: 9.5,
    beats: [
      {
        from: 3.5,
        to: 9.5,
        layout: "screen",
        frames: ["events-receiving-desktop.png"],
        caption:
          "Check in the trucks. Anything short stays under Still to get.",
        // Still to get is at the frame's foot; the caption sits on top.
        captionAt: "top",
        ring: { x: 2, y: 75, width: 96, height: 20 },
      },
    ],
  },
  prep: {
    chapter: "What does the crew start on at 5\u00a0a.m.?",
    seconds: 9.5,
    beats: [
      {
        from: 3.5,
        to: 9.5,
        layout: "screen",
        frames: ["events-prep-desktop.png"],
        caption:
          "Bases first, then every dish: {mainPortions} portions of short rib.",
        ring: { x: 2.5, y: 49.8, width: 95, height: 6.8 },
      },
    ],
  },
  pack: {
    chapter: "Is everything in the van?",
    seconds: 9.5,
    beats: [
      {
        from: 3.5,
        to: 9.5,
        layout: "screen",
        frames: ["events-pack-desktop.png"],
        caption: "Every dish into the van, allergens on each label.",
        ring: { x: 2.5, y: 67, width: 95, height: 17 },
      },
    ],
  },
  // The closeout opens the day after the event and says "likely" until the
  // kitchen records what it used. The walk records it and closes the review,
  // so the share is final. Its figures are plan and paid, ingredients only, a
  // different basis from the menu's live-price figure, so the caption states
  // the share against the target and does not compare it with the quote.
  close: {
    chapter: null,
    seconds: 12,
    beats: [
      {
        from: 0,
        to: 7,
        layout: "screen",
        frames: ["events-closeout-desktop.png"],
        caption:
          "The day after, at what you paid: {dayAfterShare} of the price, under your {target} target.",
        captionAt: "top",
        ring: { x: 46.5, y: 63, width: 35, height: 30 },
      },
      { from: 7, to: 12, layout: "end", frames: [] },
    ],
  },
};

export function resolveCaption(template: string, manifest: Manifest): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = (manifest as unknown as Record<string, unknown>)[key];
    if (typeof value !== "string") throw new Error(`unresolved token {${key}}`);
    return value;
  });
}

export function captionsFor(scene: SceneId, manifest: Manifest): string[] {
  return FILM[scene].beats.flatMap((b) =>
    b.caption ? [resolveCaption(b.caption, manifest)] : [],
  );
}

/**
 * The camera scale a beat starts from: where the previous beat left it when
 * both show the same frames (each beat is its own Sequence, so otherwise the
 * zoom snaps back to 1 at the cut), else 1.
 */
export function cameraStart(scene: SceneId, index: number): number {
  const beats = FILM[scene].beats;
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
export function cameraOrigin(
  scene: SceneId,
  index: number,
): { x: number; y: number } | null {
  const beats = FILM[scene].beats;
  const prev = beats[index - 1];
  if (!prev?.focus || prev.frames.join() !== beats[index].frames.join())
    return null;
  return { x: prev.focus.x, y: prev.focus.y };
}

export function sceneFrames(scene: SceneId): string[] {
  return [...new Set(FILM[scene].beats.flatMap((b) => b.frames))];
}

export const FPS = 30;
export const FADE_FRAMES = 15;

/** Start of each scene in seconds, with the fades between scenes overlapping. */
export function sceneStarts(): Record<SceneId, number> {
  let t = 0;
  const starts = {} as Record<SceneId, number>;
  for (const id of SCENE_ORDER) {
    starts[id] = t;
    t += FILM[id].seconds - FADE_FRAMES / FPS;
  }
  return starts;
}

export function filmFrames(): number {
  const total = SCENE_ORDER.reduce((n, id) => n + FILM[id].seconds * FPS, 0);
  return total - (SCENE_ORDER.length - 1) * FADE_FRAMES;
}

/**
 * The frames over which a chapter card's question fades up: after the scene
 * fade that brings the card in, so the outgoing screen and the question never
 * share the screen, then over half a second.
 */
export function questionFadeFrames(fps: number): [number, number] {
  return [FADE_FRAMES, FADE_FRAMES + Math.round(0.5 * fps)];
}

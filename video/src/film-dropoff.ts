import type { Film, FilmScene } from "./film-model";
import { DropoffManifestSchema } from "./manifest-dropoff";

// story: docs/stories/promo-dropoff.story.md
// The second film: a weekday office lunch ordered on the kitchen's ordering
// site (order 59 on test, 2026-10-07/08). No proposal, no contract: the client
// orders, the order approves itself on a clear day with a priced menu, the
// client pays by card, and the kitchen shops, preps and packs. It ends on the
// lunch's food cost the day after. About 43 seconds, no chapter cards (the
// plan's length; the owner has not chosen one).
//
// Rings are measured off the frames in public/proof/film-dropoff (percent of
// each frame's box); retune them whenever a frame is re-shot.

export const DROPOFF_ORDER = [
  "order",
  "arrives",
  "paid",
  "kitchen",
  "lists",
  "close",
] as const;

const SCENES: Record<(typeof DROPOFF_ORDER)[number], FilmScene> = {
  // The client, on a phone, on the kitchen's ordering site.
  order: {
    chapter: null,
    seconds: 7,
    beats: [
      {
        from: 0,
        to: 3.5,
        layout: "phone",
        frames: ["dropoff-dishes-mobile.png"],
        caption: "A client orders lunch for {guests} on your site.",
        scroll: [30, 100],
      },
      {
        from: 3.5,
        to: 7,
        layout: "phone",
        frames: ["dropoff-review-mobile.png"],
        caption: "The price is set before anyone calls.",
      },
    ],
  },
  // In the app: priced, and approved without the owner, because the day was
  // clear and the menu had a price (the frame says so; nobody clicked Approve).
  arrives: {
    chapter: null,
    seconds: 7.5,
    beats: [
      {
        from: 0,
        to: 3.75,
        layout: "screen",
        frames: ["dropoff-arrived-price-desktop.png"],
        // The order's own figure, with misc. The closeout below leaves misc
        // out, so no caption sets the two against each other.
        caption: "It arrives priced. Food cost {foodCostWithMisc}.",
        ring: { x: 33, y: 42, width: 28.5, height: 56 },
      },
      {
        from: 3.75,
        to: 7.5,
        layout: "screen",
        frames: ["dropoff-arrived-approval-desktop.png"],
        caption: "A clear day and a priced menu: approved without waiting.",
        ring: { x: 1.5, y: 32, width: 97, height: 37 },
      },
    ],
  },
  // The pay page on the client's phone, then the order, now Paid. (A split
  // screen left the order's one-line header as a thin strip in a blank panel.)
  paid: {
    chapter: null,
    seconds: 6.5,
    beats: [
      {
        from: 0,
        to: 2.75,
        layout: "phone",
        frames: ["dropoff-pay-mobile.png"],
        caption: "The client pays {paid} by card.",
      },
      {
        from: 2.75,
        to: 6.5,
        layout: "screen",
        frames: ["dropoff-paid-desktop.png"],
        caption: "Paid. Nobody retyped it. Nobody chased the money.",
        ring: { x: 79.5, y: 6, width: 16.5, height: 14 },
      },
    ],
  },
  kitchen: {
    chapter: null,
    seconds: 8,
    beats: [
      {
        from: 0,
        to: 4,
        layout: "screen",
        frames: ["shop-desktop.png"],
        caption: "Whole packs, by supplier, for {guests} guests.",
      },
      {
        from: 4,
        to: 8,
        layout: "screen",
        frames: ["po-desktop.png"],
        caption: "Each supplier gets only its own lines.",
      },
    ],
  },
  lists: {
    chapter: null,
    seconds: 8,
    beats: [
      {
        from: 0,
        to: 3.5,
        layout: "screen",
        frames: ["prep-desktop.png"],
        caption: "A prep order the crew works top to bottom.",
      },
      {
        from: 3.5,
        to: 8,
        layout: "screen",
        frames: ["pack-desktop.png"],
        // The caption sits on top, off the stuffed pepper row it names; it
        // says what the client's note above it said.
        caption:
          "{vegetarianPortions} stuffed peppers for the vegetarians, every dish checked.",
        ring: { x: 3, y: 85, width: 93, height: 11.5 },
        captionAt: "top",
      },
    ],
  },
  // The closeout the day after, recorded and closed, against the target the
  // order was priced to. Not against the 29.3% on arrival: that one counts
  // misc, the closeout does not.
  close: {
    chapter: null,
    seconds: 10,
    beats: [
      {
        from: 0,
        to: 5,
        layout: "screen",
        frames: ["closeout-desktop.png"],
        caption:
          "The day after: food cost {closeoutPct}, under your {targetPct} target.",
        captionAt: "top",
        ring: { x: 72.5, y: 74, width: 25, height: 22 },
      },
      { from: 5, to: 10, layout: "end", frames: [] },
    ],
  },
};

export const DROPOFF: Film = {
  id: "DropoffFilm",
  title: null,
  order: DROPOFF_ORDER,
  scenes: SCENES,
  framesDir: "frames-dropoff",
  parseManifest: (json) => DropoffManifestSchema.parse(json),
};

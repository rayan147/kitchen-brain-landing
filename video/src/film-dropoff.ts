import type { Film, FilmScene } from "./film-model";
import { DropoffManifestSchema } from "./manifest-dropoff";

// story: docs/stories/promo-dropoff.story.md
// claim: RC-75 in docs/release-claim-ledger.md
// The second film: a weekday office lunch ordered on the kitchen's ordering
// site (order 59 on test, 2026-10-07/08). No proposal, no contract: the client
// orders, the order approves itself on a clear day with a priced menu, the
// client pays by card, and the kitchen shops, preps and packs. It ends on the
// lunch's food cost the day after. About 50 seconds, no chapter cards (the
// plan said about 40; the owner kept the reading time, 2026-10-08).
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
    seconds: 8,
    beats: [
      {
        from: 0,
        to: 3.5,
        layout: "phone",
        frames: ["dropoff-dishes-mobile.png"],
        caption: "A client orders lunch for {guests} on your site.",
        scroll: [45, 100],
      },
      {
        from: 3.5,
        to: 8,
        layout: "phone",
        frames: ["dropoff-review-mobile.png"],
        caption: "The client sees the price before anyone calls.",
        // The whole review, down to the send button, scrolled once.
        scroll: [0, 100],
      },
    ],
  },
  // In the app: priced, and approved without the owner, because the day was
  // clear and the menu had a price (the frame says so; nobody clicked Approve).
  arrives: {
    chapter: null,
    seconds: 8.5,
    beats: [
      {
        from: 0,
        to: 3.75,
        layout: "screen",
        // The food cost and target panels only: the order's food line counts
        // misc and the closeout's does not, so the two dollar figures never
        // share the film.
        frames: ["dropoff-arrived-price-desktop.png"],
        // "with misc": the closeout's share at the end leaves misc out, so
        // without the word the cost would seem to fall while it came in over.
        caption: "It arrives priced. Food cost {foodCostWithMisc}, with misc.",
        ring: { x: 1, y: 15, width: 41, height: 82 },
        // Pulled back so the cropped panel's left edge clears the frame.
        focus: { x: 50, y: 50, scale: 0.9 },
        fromScale: 0.9,
      },
      {
        from: 3.75,
        to: 8.5,
        layout: "screen",
        frames: ["dropoff-arrived-approval-desktop.png"],
        // The frame says the owner can still decline while nothing is paid;
        // the caption says so too, so "approved" does not read as lost control.
        caption:
          "Clear day, priced menu, so it approved itself. You can still decline.",
        ring: { x: 1.5, y: 32, width: 97, height: 37 },
        // Pulled back so the card's borders clear the frame edges.
        focus: { x: 50, y: 55, scale: 0.94 },
        fromScale: 0.94,
      },
    ],
  },
  // How the paid order got there: the review said nothing was due, the
  // order approved itself, then the client gets a pay link and pays from it.
  // Without this beat the film went from "No payment is due now" straight to
  // "Payment received" (owner, 2026-10-08).
  paid: {
    chapter: null,
    seconds: 7.5,
    beats: [
      {
        from: 0,
        to: 4,
        layout: "phone",
        frames: ["dropoff-pay-link-mobile.png"],
        caption: "The client gets a pay link and pays {paid} by card.",
      },
      {
        from: 4,
        to: 7.5,
        layout: "screen",
        frames: ["dropoff-paid-desktop.png"],
        caption: "Nobody typed the order twice or chased the money.",
        ring: { x: 79.5, y: 6, width: 16.5, height: 14 },
        // Pulled back to the scale of the frames around it.
        focus: { x: 50, y: 40, scale: 0.8 },
        fromScale: 0.8,
      },
    ],
  },
  // The shop list cut to its first three suppliers: the test account names
  // two others after real distributors.
  kitchen: {
    chapter: null,
    seconds: 8.5,
    beats: [
      {
        from: 0,
        to: 4.5,
        layout: "screen",
        frames: ["shop-top-desktop.png"],
        // The amber "Uses 0.9 gal of 1.6 gal" rows are the whole packs; the
        // caption says where the rest goes.
        caption:
          "Whole packs, by supplier, for {guests}. The rest stays on the shelf.",
        ring: { x: 61.5, y: 23, width: 19, height: 38 },
        // Pulled back so the third supplier's name clears the caption.
        focus: { x: 50, y: 0, scale: 0.86 },
        fromScale: 0.86,
      },
      {
        from: 4.5,
        to: 8.5,
        layout: "screen",
        frames: ["shop-top-desktop.png"],
        caption: "Each supplier gets only its own lines.",
        // The first supplier's send row: Email, to its own address.
        ring: { x: 3, y: 14.5, width: 94, height: 9.5 },
        focus: { x: 50, y: 0, scale: 0.86 },
        fromScale: 0.86,
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
        // On top, with the column pulled back below it: at the bottom it cut
        // the list's All / Left to do switch in half.
        captionAt: "top",
        focus: { x: 50, y: 100, scale: 0.8 },
        fromScale: 0.8,
      },
      {
        from: 3.5,
        to: 8,
        layout: "screen",
        // The whole pack frame again: the client's note ("Two of the forty
        // are vegetarian") is where the 2 comes from, above the check and the
        // stuffed pepper row. Pulled back so the caption on top sits on paper.
        frames: ["pack-desktop.png"],
        caption:
          "{vegetarianPortions} stuffed peppers, and no clashes with the guests' restrictions.",
        ring: { x: 3, y: 85.5, width: 93.5, height: 11.5 },
        focus: { x: 50, y: 100, scale: 0.72 },
        fromScale: 0.72,
        captionAt: "top",
      },
    ],
  },
  // The closeout the day after, recorded and closed, against the target the
  // order was priced to. Not against the 29.3% on arrival: that one counts
  // misc, the closeout does not.
  close: {
    chapter: null,
    seconds: 11.5,
    beats: [
      {
        from: 0,
        to: 6.5,
        layout: "screen",
        frames: ["closeout-card-desktop.png"],
        // The card's biggest figure is the over-plan amount, so the caption
        // says it first, and the ring takes in both figures it names.
        caption:
          "The next day it came in {closeoutOver} {closeoutDirection} plan, still under your {targetPct} target at {closeoutPct} without misc.",
        captionAt: "top",
        ring: { x: 49, y: 54.5, width: 46.5, height: 19 },
        focus: { x: 50, y: 60, scale: 0.96 },
        fromScale: 0.96,
      },
      { from: 6.5, to: 11.5, layout: "end", frames: [] },
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

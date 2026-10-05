# Promo video: one wedding, inquiry to booked — design

Date: 2026-10-05 · Branch: `feat/promo-video` (worktree `.gitworktrees/promo-video`, off landing `develop` 2a60571)
Story: `docs/stories/promo-video.story.md`

## Goal

A ~90 s promotional film for owner-caterers. It follows one real wedding through CostCook as shipped on production, seen from both sides: the caterer at her screen and the client on her phone. Each chapter opens on a question a chef actually asks and answers it with a real screen.

**Success:** a caterer watching muted on a phone can say what CostCook does for a wedding inquiry, and every figure and claim in the film passes the release-claim ledger.

## Decisions (owner, 2026-10-05)

| Decision | Ruling |
|---|---|
| Concept | One wedding, inquiry to booked, with chef-question chapter cards |
| Home | Landing repo, own `video/` package (React + Remotion kept out of the Astro build) |
| Audio | Burned-in captions + a music bed, `loudnorm` to -23 LUFS / -2 dBTP |
| World | The events world (Harbor & Hearth Catering, Priya Nair, Nair & Castellano wedding, 150 guests, Wedding Plated Dinner at $95.00 a guest, $3,500 deposit). One wedding, one set of numbers. |
| Capture source | kitchen-brain **production `origin/main`**, exported clean, as `scripts/capture-events-proof.mjs` already does. Not develop (1,214 commits ahead, client-payment unshipped). |
| Ending | The quote-time food-cost figure, then the price/trial card. No closeout. |
| v1 scope | 16:9 only. 9:16 cutdowns, homepage placement, and replacing `public/demo.mp4` are out of scope. |

## Hard constraints (release-claim ledger)

| ID | Constraint | Enforced by |
|---|---|---|
| RC-61 | "Booked" only after Confirm order; never for accepted or deposited | claims check: caption order rule |
| RC-63 | Client side names only "Accept proposal" and "Ask for changes" | claims check |
| RC-64 | No frame or quote of the e-signature page or its status track; e-signature may be named in a caption | capture FORBIDDEN list + claims check |
| RC-65 | Deposit is asked for and recorded by hand; no card payment, no balance reminder | claims check banned phrases |
| RC-69 | No closeout figures | no closeout frame in `film.ts` |
| RC-58 / never-claim | No "no typing", "nothing re-keyed", "fully automatic"; invoice email not claimed | claims check banned phrases |
| Price/trial | Read from `src/lib/site.ts` (`launch.displayPrice`, `trialDays`), never typed | import, not literal |
| House copy | No em dashes, no exclamation points in captions | claims check |
| Capture | Existing FORBIDDEN list (no "Kitchen Brain", "Test environment", Square, QuickBooks…) applies to every new frame | capture script |

## Scenes (1920×1080, 30 fps, ≈ 88 s)

Figures in `{braces}` are tokens filled from the capture manifest (see Data flow); none are typed by hand.

| # | Time | Chapter card | Frame(s) | Draft caption(s) | Motion |
|---|---|---|---|---|---|
| 0 | 0–6 s | — (title: "Know what the job makes before you cook it.") | `events-inquiry-mobile` (exists) | "A wedding. About {guests} guests. No date yet." | Phone slides in; client, guests fields lift in order |
| 1 | 6–20 s | "What do I charge a head?" | **new** `events-pricing-desktop`: the kitchen draft's pricing panel at $95.00 × 150 | "{pricePerGuest} a guest. Food cost {foodCostPct}. You see it before you quote." | Push in on the panel; highlight ring on the food-cost figure |
| 2 | 20–36 s | "Will she say yes without a meeting?" | Split screen. Left: **new** `events-proposal-sent-desktop`. Right: `events-offer-mobile` (re-shot) | "The proposal goes to her phone. No login." · "Accept proposal, or Ask for changes. Her call." | Left sends; right phone scrolls the offer; ring on "Accept proposal" |
| 3 | 36–52 s | "How do I hold the date?" | `events-deposit-desktop` (asked), **new** `events-deposit-recorded-desktop`, `events-confirm-desktop` | "Ask for {deposit}. Record it when it comes in: check, cash, transfer or your own card processor." · "Her yes is not a booking. Confirm order is." · "Prices and quantities freeze." | Received $0.00 → {deposit}; dialog rises; ring on Confirm order |
| 4 | 52–64 s | "How much do I buy so I'm not short at 5 a.m.?" | **new** `events-shop-desktop` (shop list grouped by supplier, whole packs) | "Whole packs, by supplier, for {guests}." | Slow pan down the list; one row's "needed / buying" highlighted |
| 5 | 64–74 s | "Do I have to type in every invoice?" | **new** `events-import-review-desktop` (upload review) | "Upload it. Confirm what it read. Type what it could not." | Matched rows tick in; one unmatched row held in amber |
| 6 | 74–88 s | — | Scene 1 frame again, then end card | "{pricePerGuest} a guest. {foodCostPct} food cost. Known before the call ended." · End card: "CostCook" · "{displayPrice}, per kitchen" · "{trialDays}-day free trial" · "costcook.io" | Callback push-in; fade to end card (≤ 4 s) |

E-signature appears at most as one caption clause in scene 3 ("The contract can go out for e-signature too."), with no frame, or is cut in Step 11 revision if the scene runs long.

## Architecture

```
video/                         own package.json; excluded from the Astro build
  remotion.config.ts
  public/frames/               PNGs copied from public/proof + new captures
  public/audio/bed.mp3
  src/
    index.ts                   registerRoot
    Root.tsx                   <Folder> Elements · Scenes; <Composition id="PromoFilm">
    PromoFilm.tsx              <TransitionSeries>, one <TransitionSeries.Sequence> per scene,
                               name + durationInFrames inline, premountFor={fps}
    film.ts                    Zod-parsed: per scene frames, captions (with tokens), highlight rects
    manifest.ts                reads frames/manifest.json (figures from capture); Zod-parsed
    tokens.ts                  colours + type steps copied from the landing's CSS
    scenes/                    ColdOpen, Charge, Proposal, HoldTheDate, Buy, Invoices, Close
    elements/                  ChapterCard, PhoneFrame, Screen, Highlight, SplitScreen, Caption, EndCard
```

- Each scene is its own file and a connected composition (Remotion multi-scene guidance) so it opens on its own timeline in Studio.
- Animation is `useCurrentFrame()` + inline `interpolate()` with `Easing.bezier`; no CSS transitions. `scale`/`translate` properties, not `transform`.
- Images through `<CanvasImage>` + `staticFile()`; fonts (Instrument Sans, Fraunces) via `@remotion/google-fonts`.
- Packages added with `npx remotion add` (`@remotion/transitions`, `@remotion/google-fonts`, `@remotion/media`, `zod`).

## Data flow (the number never lies)

1. `scripts/capture-events-proof.mjs` gains the five new frames and writes `public/proof/events-manifest.json`: the figures each frame shows (`foodCostPct`, `pricePerGuest`, `guests`, `deposit`, `revenue`), read off the page with the same locators that frame the shot.
2. A small copy step mirrors the frames and manifest into `video/public/frames/`.
3. `film.ts` captions reference tokens; `manifest.ts` fills them. A caption with an unresolved token fails the Zod parse, so Studio and render both refuse.
4. `scripts/check-landing-claims.mjs` gains a `2026-10-05 PROMO VIDEO` block that reads `video/src/film.ts` and fails on: a banned phrase (constraint table), an em dash or exclamation point, "booked/booking" in any caption before the Confirm order caption except the snap line's negation, a client-side button name other than the two allowed, a figure that disagrees with the manifest, and any frame path containing `sign` or `closeout`.

## Capture changes

- **New event date.** The current `EVENT.date` (2026-10-10) and the offer's respond-by date expire this week. Pick a Saturday about two weeks after the shoot day; change `EVENT.date`, the page copy and the alts in `src/lib/proof.ts` that name the date, in the same commit (the script's header rule).
- **New frames** (same clip rules: dsf 2, element-bounded, FORBIDDEN-checked): `events-pricing-desktop`, `events-proposal-sent-desktop`, `events-deposit-recorded-desktop`, `events-shop-desktop`, `events-import-review-desktop`.
- Re-shooting changes the existing `events-*` frames the site already uses. Their alts and the events page copy are re-verified (`check-events-proposals-page.mjs`) in the same commit.
- Source stays production `origin/main` (ed6ff5f01 unless main moves before the shoot).

## Audio

One instrumental bed (licensed or generated; source recorded in `video/public/audio/SOURCE.md`). After render: `ffmpeg … -af loudnorm=I=-23:TP=-2:LRA=7` and verify with `ebur128=peak=true` (integrated within ±1 LU of -23, true peak ≤ -2 dBTP).

## Deliverables

- `video/` Remotion project, Studio-previewable.
- On explicit request only: `public/promo.mp4` (H.264 + AAC), `public/promo-poster.jpg`, `public/promo.vtt` (captions as text for the player and screen readers).

## Verification

- Remotion Studio open during the build; each scene reviewed on its own timeline.
- `npx remotion still` one frame per scene, inspected at 1920 and at phone-width playback (captions readable at 390 CSS px: caption size ≥ 44 px at 1080p).
- `node scripts/check-landing-claims.mjs` green, including the new block, with one deliberately broken caption run first to prove the block fails.
- Loudness check as above.
- `npm run build` for the site unaffected (the `video/` package is not part of it).

## Out of scope

9:16 and per-chapter cutdowns; homepage placement and its running-time lockstep; replacing `public/demo.mp4`; card deposits, reminders and closeout scenes (each returns when its ledger row becomes claimable: `film.ts` keeps scene 3 swappable); voiceover; the homepage mockup's own claim conflicts (separate owner ruling).

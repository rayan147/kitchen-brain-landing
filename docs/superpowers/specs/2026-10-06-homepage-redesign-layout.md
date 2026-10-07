# Homepage redesign: layout rules (2026-10-06)

Owner-approved rules for the homepage rebuild on `feat/homepage-redesign`,
taken from a review of migoo.ai's structure (its rules, not its look: no blue
accent, no "all in one place" copy, no pricing tiers).

**Gate:** start after the promo-video session reports that its app (:4197) is
back up and Confirm order is done, and the 12 screenshots are retaken.

## Rules

1. **Alternate backgrounds instead of rules.** Sections alternate the cream
   paper color and the soft amber. The dashed ticket rule appears only on the
   ticket device.
2. **About four type sizes.** Fraunces display and Instrument Sans body, with
   one section padding value used for every section.
3. **One section shape.** Amber eyebrow, Fraunces heading, one sentence, one
   screenshot.
4. **Stage tabs for the event walk.** Inquiry → Proposal → Deposit →
   Confirm order → Shop / Prep in one slot, holding five or six of the 12
   screenshots. Without JavaScript all panels render stacked ("nothing
   hidden"); tabs are progressive enhancement with proper tab semantics.
5. **One accent word in the hero,** in kitchen green, matching the primary
   button and nothing else.
6. **One frame for all 12 screenshots.** Flat, 8px radius, one shadow, no
   tilt. The 1.5° tilt stays on the paper tickets only.

## Still applies

Truth pass, `cta.label` on every primary, AA contrast notes beside tokens,
no em-dashes in user-facing copy, story tracker updated before copy changes
(`docs/stories/homepage-event-story.story.md`).

## As built (2026-10-06)

Gate cleared (the video session's app came back up and Confirm order was done). Bands, in order, alternating from the hero:

| Band | Component | Tone | Frames | Rule notes |
|---|---|---|---|---|
| Hero | `HomeHero` | cream | hero-pricing (eager; video slot `[data-hero-media]`) | rule 5 accent word "makes" |
| How it fits | `HomeFlow` | amber | none | ticket device; rule 3 exception |
| Event walk | `HomeEventWalk` | cream | inquiry-mobile, proposal-mobile, payment-schedule, confirm-dialog, prep-list | rule 4 tabs, stacked without JS |
| Kitchen | `HomeKitchen` | amber | food-cost-breakdown, yield-lines, import-review, allergens-labels | four rows, each rule 3 |
| Front of house | `HomeFrontOfHouse` | cream | ordering-site, invoice-inbox | canvas drew it dark; light only |
| Sage | `HomeSage` | amber | sage-answer | |
| Close | `HomeClose` | cream | founder portrait, price card | rule 3 exception |

Words and frames: `src/lib/home.ts`. Shared band, sizes and frame: `src/components/home/HomeBand.astro`. Contract: `scripts/check-dist.mjs` (homepage block) and `scripts/check-landing-claims.mjs`.

## Revision (2026-10-06, owner): rule 4 replaced by the workflow rail

The stage tabs and the "How it fits together" tickets are gone. The event walk
is now the workflow rail (`docs/superpowers/specs/2026-10-06-workflow-rail.md`):
every stage visible, a carry line between stages, amber rings over the carried
figures. Bands re-alternate: hero cream, event walk amber, kitchen cream, front
of house amber, Sage cream, close amber.

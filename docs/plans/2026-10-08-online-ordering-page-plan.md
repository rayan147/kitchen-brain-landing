# Plan: an online ordering page, with the lunch film and the widget setup (2026-10-08)

<!-- story: docs/stories/online-ordering.story.md -->

**Owner ask (2026-10-08):** put the drop-off film
(`.gitworktrees/promo-dropoff/video/out/dropoff.mp4`) in the online ordering
part of the site so a caterer can see how it works; say plainly that the order
form can sit on their own website as a widget; explain the ordering-site
settings as the app names them. Work on `feat/online-ordering-page` (from
origin/develop 99531e0) in `.gitworktrees/release-inbox`, the worktree that
serves http://127.0.0.1:4330/.

## What is true in the app (local develop 7a7e407d9, read 2026-10-08)

Source: a read of `src/routes/settings/integrations/ordering-site/**`,
`src/lib/storefront/**`, `src/lib/server/public-ordering/redesign-admin.ts`,
`packages/widget-loader/**`. Path and labels are the app's own:

- **Where:** Settings › Integrations › card "Ordering site" › "Manage
  storefront". One screen, four tabs: **Setup, Menus, Look, Put on your
  website**. Status pill Live / Offline / Not set up yet. Changes save
  themselves ("All changes saved"); there is no Save button.
- **Setup:** name customers see (from Business profile unless overridden),
  smallest and largest group, notice and how far ahead (from Booking
  settings), Offer pickup (place, address, note) and Offer delivery (fee, tax
  on the fee), how customers pay: "Card, through CostCook" (Connect Stripe),
  "A partner collects it", or "You collect it" (the default). Estimated tax %.
- **Menus:** switch each menu on or off for the site; name on the site, price
  per guest (must be above $0), descriptions per menu and dish ("Draft them
  with Sage").
- **Look:** logo (PNG, JPG, SVG or WebP up to 2 MB), four colours (text,
  buttons, picked menu, page background), a contrast check ("Needs 4.5:1 for
  text"), preview Now / With fixes / Dark mode.
- **Put on your website:** your link (Copy, QR code) and its address name;
  "Websites that will show it" (only these can show the widget, up to 50);
  "Snippet for your web person" (Copy snippet, Email it to them); and whether
  the widget has been seen on a site, or blocked on one that isn't listed.
- **Snippet shape:** a `<div id="order-here">` and one `<script
  src=".../ordering.js" data-site-id="..." ...>`. The script is under 12 KiB
  (9.4 KB today) and mounts a sandboxed frame; a small stylesheet loads beside it.
- **Go live** stays disabled until: pickup or delivery is on (pickup needs a
  place and an address), at least one menu is on with a price above $0, and,
  only if paying by card through CostCook, Stripe can take cards. Websites and
  descriptions are suggestions, not blockers. "Take offline" shows clients
  "Not taking online orders right now."
- **Elsewhere, in Booking settings:** "Approve clear requests automatically"
  (off by default), notice hours, how far ahead.
- **After the request:** it lands in Orders awaiting your approval; approve,
  and the client gets a pay link (72 hours); their payment confirms it.

Not said on the page: the payment window as a setting (it is fixed at 72 h),
any widget test mode (there is none), the `?legacy` page, Square/QuickBooks,
the separate "Ordering integration" API-key screen.

## The film

`dropoff.mp4`: 49.5 s, 1920×1080 H.264 with music, captions in `dropoff.vtt`
(11 cues), committed on the peer branch after four review rounds. Its frames
are local captures of a 40-guest office lunch: ordered on the kitchen's site,
priced on arrival, approved itself, paid by card, shopped, prepped, closed out
at 29.1%.

- Copy to `public/film/dropoff.mp4` and `public/film/dropoff.vtt`; cut a
  poster JPG from the opening frame.
- `<video controls playsinline preload="none" poster>` with a `<track
  kind="captions" default>`; no autoplay. A "Read what the film shows"
  disclosure carries the 11 caption lines, the same pattern as the hero film
  (principle 4: the transcript matches the footage).
- The film's peer commits stay unpushed; only the rendered file and its
  captions come over.

## Where it goes (one slot, one claim)

1. **New page `/features/online-ordering`**, the guide for the ordering
   group, built like `/features/invoice-email`:
   - Opening: headline, one line, the film beside it.
   - "Two ways clients order": your own link, or the form on your website.
   - "Put it on your website": the three steps (add your website, send the
     snippet to your web person, check it was seen) with the snippet shape
     rendered as a ticket, placeholders not a working id.
   - "Set it up in the app": the four tabs and Go live, in the app's words,
     with captures of Setup and Put on your website from local develop
     (frames must not show localhost; the snippet frame is clipped above the
     code box and the code is printed in page text with placeholders).
   - "What the client sees, and what happens next": request, approve, pay
     link, payment confirms. The five boundaries from `ordering.ts`.
   - Close: the one primary CTA plus the quiet demo link.
2. **Homepage "Online ordering" row** gets a guide link, "How online ordering
   works", to that page (the invoice-email row already does this). The row keeps
   its widget screenshot: the homepage's one film stays the hero film.
3. **Features menu, /features hub and the "The day itself" area page** link the
   ordering group to the new page, the same way invoice email is linked.
4. `src/lib/ordering.ts` gains `seoDescription` and `orderingRoute`, and its
   "STILL NOT HERE" note is updated: the page now exists, built from local
   develop captures.

## Checks

- `scripts/check-online-ordering-page.mjs` in `postbuild`: the film, poster,
  captions track and transcript are present; the snippet has no real id; Go live
  lists exactly the app's blockers; there is one `btn-primary` labelled
  `cta.label`; no em dashes; never "booked" for a request.
- `npm run build`, `npm run check:claims`, astro check, verify-homepage and
  the feature-family verify against a 4330 preview.
- Browser check at 390, 768 and 1440: video plays, captions toggle, no
  horizontal scroll, keyboard reaches the transcript.
- Story tracker `docs/stories/online-ordering.story.md`; humanize-reviewer and
  kb-caterer-owner read the copy before it ships.

## Release

Rebuild 4330 from this branch for the owner to look at. Nothing is merged or
pushed until the owner says so.

# Ordering flow captures (2026-10-15)

Frames in `public/proof/ordering-flow/` and `public/proof/home/ordering-site*.png`,
written by `scripts/capture-ordering-flow-proof.mjs`.

- **App:** kitchen-brain develop 5e01c9fc7 plus the embed ready fix 61740a018
  (branch `fix/catalog-storefront-embed-ready`), app on :4193 in dev mode (the
  local http origins need it), ordering app on :4194 (preview build).
- **Kitchen:** the demo seed, renamed Harbor & Hearth Catering. Ordering site
  live with Coastal Dinner ($93), Wedding Plated Dinner ($95) and Cocktail
  Reception ($44); pickup at 12 Commercial Street, Portland, ME; delivery
  $25.00; 20 guest minimum; 72 hours notice; You collect it (no Stripe keys).
- **Host page:** a plain sample site on 127.0.0.1:4370 with the snippet pasted
  verbatim from Put on your website, its origin approved there.
- **Order:** one real order per run, Dana Okafor (sample), Company anniversary
  dinner, Thu Nov 5, 50 guests, delivered to 40 Fore Street, Portland. Booking
  rules approved it automatically (clear day, priced menu). The quote form is
  filled, never sent.

## Package photos (CC0 stand-ins)

Uploaded through Settings > Ordering site > Menus > Package photo. None is the
sample kitchen's food; the page says so under the frames.

| Package | Wikimedia Commons file | License | Author |
|---|---|---|---|
| Coastal Dinner | [Grilled plated salmon fillet.jpg](https://commons.wikimedia.org/wiki/File:Grilled_plated_salmon_fillet.jpg) | CC0 | see file page |
| Wedding Plated Dinner | [Steak Dinner 1 (Unsplash).jpg](https://commons.wikimedia.org/wiki/File:Steak_Dinner_1_(Unsplash).jpg) | CC0 | Alex Munsell |
| Cocktail Reception | [Canapés salados, Mazatlán, 29 de noviembre de 2022 03.jpg](https://commons.wikimedia.org/wiki/File:Canap%C3%A9s_salados,_Mazatl%C3%A1n,_29_de_noviembre_de_2022_03.jpg) | CC0 | see file page |

## Package descriptions (sample copy, 2026-10-15)

Written from each menu's own dish list and saved in the package editor's Menu
description field. The card shows the first two lines; the package view shows
all of it. Package cards never show "serves": a package is priced per guest,
and "serves about" appears once the client sets the head count.

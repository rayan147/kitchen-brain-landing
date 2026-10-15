# Story Tracker: /features/online-ordering (2026-10-08)

Source: `src/components/sections/OnlineOrderingFeature.astro`, data in
`src/lib/ordering.ts`. Plan: `docs/plans/2026-10-08-online-ordering-page-plan.md`.
App truth: kitchen-brain local develop 7a7e407d9, Settings > Integrations >
Ordering site (read 2026-10-08).

- [x] **1. Idea.** An owner-caterer who takes office lunches and drop-offs by
  phone and email (WHO) wants those orders to arrive already priced and paid
  (WANT), but today each one is retyped from a message, priced by habit, and
  chased for the money; their website has a contact form and nothing else
  (WALL).
- [x] **2. Character.** The reader. Want: let clients order off the website.
  Need: an order that lands priced against their own costs, with the money
  settled before they shop. Wound: the lunch typed in wrong, 40 became 14, and
  the invoice paid three weeks late. Flaw: "my web guy is busy, I will set it
  up later", so the form never goes up.
- [x] **3. Beats.** Opening image: a lunch order in an email, retyped. Theme:
  "you just say yes." Setup: the film. Catalyst: a client orders lunch for 40
  on your site. Debate: does it go on my website, and do I have to touch code?
  Break into two: two ways in (your link, or your website). B story: the web
  person, who pastes two lines. Fun and games: the four tabs. Midpoint: Go live
  lights up. Bad guys: a request that is not a booking, the price the browser
  never sends. All is lost: none (boundaries are stated, not dramatised). Break
  into three: approve, pay link, payment confirms. Final image: the order on the
  Shop list, priced, with nobody having retyped it.
- [x] **4. Scenes.** (1) Opening: headline, lede, film. (2) Two ways in.
  (3) Put it on your website: three steps and the snippet ticket. (4) Set it up
  in the app: four tabs, two captures, Go live checklist. (5) After they send
  it: approve, pay, confirmed; where it stops. (6) Close: start the trial.
- [x] **5. Voices.** Reader: "order form", "my website", "my web guy", "they
  pay up front". Product: the app's own labels, quoted exactly (Setup, Menus,
  Look, Put on your website, Snippet for your web person, Websites that will
  show it, Go live, Card, through CostCook, You collect it).
- [x] **6. Turns.** Opening: doubt to seeing it work. Two ways: "I need a new
  site" to "I keep mine". Website: "code" to "two lines my web person pastes".
  Setup: "a project" to "four tabs and a button". After: "is it booked?" to
  "the payment books it". Close: interest to the trial.
- [x] **7. Headline.** "The client fills in the order. You approve it."
  (intention: get the order without the typing; obstacle: control stays with
  the kitchen).
- [x] **8. Snap line (one).** "Your web person pastes two lines. You never
  touch the code." (`data-ordering-snap`)
- [x] **9. Scene.** Tuesday, 10 a.m., between lunch prep and a delivery; the
  phone shows a request that is already priced.
- [x] **10. Connection.** Second person throughout. Each section ends on a
  hand-off line (Next: ...), the family's device.
- [x] **11. Revise.** Cut the payment-partner detail to one clause; cut the
  logo limits; the Go live list is the app's blockers only, no suggestions.
  2026-10-08: the two Setup captures stack at their real size (790 px), and
  scroll inside their frame on a phone with an Open full-size link; side by
  side they shrank to about 70% and the owner found them hard to read.
  Close: "Put one menu on it and send yourself an order."

## Revision 2026-10-11: English edit
- Hero lede: "The request comes in priced." (no longer repeats the H1). Status line: "Find it under Settings > Integrations > Ordering site."
- Website section opens on the three steps and the reassurance that the hard one goes to whoever looks after your site.
- #after: Booking rules come straight after approve or decline; the Approving requests note moves below the rules; the You collect it line no longer repeats its card ("Picked You collect it in Setup? The client gets an approval email instead of a pay link.").
- Snippet note drops the third "touches nothing else on your page"; the Stripe limit says "CostCook won't save cards"; the second way in is "Or a form on your own website." (ordering.ts, this page only).

## Revision 2026-10-11: settled facts from the owner-call check
- Hero: the card link is for when "you take cards through CostCook". You collect it: "Your own invoice, a check, cash or ACH."
- Test order: "press Go live", then "cancel it in Orders" (the app's own instruction).

## Communication review · 2026-10-12

- [x] Steps 1–4: The same reader, job, obstacle, beat order and section roles still govern this piece.
- [x] Steps 5–10: The established kitchen voice, one point of view, evidence, scene and handoffs remain in place.
- [x] Step 11: The payment exception now names the Setup choice and explains that approval emails the client without a pay link.

## Revision 2026-10-15: the client's walk, shot on the catalog storefront

App truth: kitchen-brain develop 5e01c9fc7 with the embed ready fix 61740a018
(branch fix/catalog-storefront-embed-ready), captured by
`scripts/capture-ordering-flow-proof.mjs`.

- [x] **1–3.** Same reader, want and wall. The Catalyst ("a client orders lunch
  for 40 on your site") is now shown, not told: one real order walks through
  the widget.
- [x] **4. Scenes.** Scene 2 (Two ways in) gains "What your client sees": Pick
  (a package with its photo, the head count, the price), Check (the cart),
  Send (the receipt with what they were quoted), Or ask (Ask for a quote, no
  price until you reply), then the same order in Orders. Scene 4 re-shot its
  two Setup cards: Payments now shows the saved acceptance and payment rules,
  and a world with no Stripe keys, so You collect it is selected.
- [x] **6. Turn.** Doubt ("will my client manage it?") to trust: four frames a
  client would recognise from any shop, then the kitchen's side, costed.
- [x] **8. Snap.** "25.9% food cost against your 30% target", on an order
  nobody retyped.
- [x] **10. Hand-offs.** The walk ends in Orders, which is where scene 5
  ("After they send it") picks up.
- [x] **11. Proof and honesty.** Every figure is read off a frame. The order
  was approved automatically because the day was clear and the menu priced;
  the caption says so and keeps "if your booking rules say so". The package
  photos are CC0 stand-ins, and the page says that under the frames. A
  request is still never called booked.

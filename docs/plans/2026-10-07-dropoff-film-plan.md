# Plan: a second promo film, a drop-off order from the ordering site (2026-10-07)

<!-- story: docs/stories/promo-dropoff.story.md -->

**Status:** plan for owner review. Nothing captured or built yet.
**Companion to:** the wedding film (`docs/stories/promo-video.story.md`, merged to develop 1cec842).

## Goal

A 40-second film that shows the other way work arrives: a weekday office lunch
the client orders from the kitchen's ordering site, with no proposal or contract.
It ends on that order's food cost, the same promise as the wedding film. Every
frame is a real screen, captured from one walk on test.

## What the app actually does (checked on develop, not assumed)

The earlier note said "the customer orders and pays at checkout". That is wrong
on develop. The storefront takes **no money when the client orders**. The flow
is approve, then pay (#515, `e2e/booking-approve-then-pay.spec.ts`):

1. On the storefront, from a phone: choose a menu, then dishes, the event, contact
   details, and review. Then "send one request to the kitchen". The current estimate
   is shown before sending.
2. The request arrives in the app as an order waiting on the kitchen's approval.
3. The kitchen approves it. The client gets a pay link by email.
4. The client pays by card (Stripe test mode, typed by the owner by hand). The
   payment confirms the order and puts it on the Shop list.
5. From there it is the same kitchen path as the wedding: shop by supplier,
   supplier orders, receiving, prep, pack. The closeout opens the day after.

So the film's beat is "the client orders, you approve, they pay, it's in the
kitchen", not "they pay at checkout". Step 0 below confirms this on test before
anything is filmed.

## Story (Steps 1 to 4; the full tracker is `docs/stories/promo-dropoff.story.md`)

- **Idea:** A caterer who runs weekday office lunches wants orders to arrive
  priced and paid without retyping an email. Today the order comes as a message,
  gets priced by habit, and the real food cost shows up at month end.
- **Hero:** the same owner-caterer as the wedding film, on an ordinary Tuesday.
- **Snap line (draft):** "Nobody retyped it. Nobody chased the money."

| # | Scene | About | Frame (all real) |
|---|-------|-------|------------------|
| 1 | Ordering | 6 s | Phone: the storefront menu, guest count and estimate, then the review |
| 2 | Arrives | 5 s | Desktop: the request waiting on approval, with Approve ringed |
| 3 | Paid | 5 s | Phone: the pay page, then desktop "Paid" on the order |
| 4 | In the kitchen | 7 s | Shop by supplier for 40 guests, then the prep list |
| 5 | Out the door | 5 s | Pack list, with allergen labels |
| 6 | The number | 7 s | Closeout the day after: food cost share against the target |
| 7 | End card | 5 s | The same end card as the wedding film |

That comes to about 40 seconds with 15-frame fades. There is no chapter card per
scene (too slow at this length); one title card at 2 s is optional, decided in Step 3.

## The order

- A real-sounding office: "Bayside Dental, Thursday team lunch", 40 guests, delivery.
- A storefront menu with real recipes and costs: a lunch drop-off menu built on test
  through the app's own forms, the same way the wedding menu was. Price is about
  $24 a guest. The food cost must come out under the 30% target honestly, from
  the ingredient prices. If it doesn't, change the menu, not the numbers.
- A dietary line the client types in ("two vegetarian"), answered by a vegetarian
  dish on the menu, so the pack beat can show it, as the wedding did.

## Before the walk (test data, owner approval needed)

The storefront on test currently shows QA menus ("QA menu J1 2026-10-02", and
others) next to "Fresh Fruit Cup menu". Before filming:

- Hide or unpublish the QA menus from the storefront (or approve archiving them).
- Publish the lunch menu to the storefront.
- Switch the business profile to the film's kitchen (Harbor & Hearth) for the walk,
  then restore Test Kitchen (`test-profile-switch.mjs`, as for the wedding).
- Confirm the storefront takes the request on test and that the approve-then-pay link
  goes to an inbox the owner reads (test only emails approved addresses).

## Capture

New steps in the same capture script, reusing its helpers (sign-in, `shoot`,
FORBIDDEN guard, test banner guard, per-frame provenance):

| Step | Does | Writes to test |
|------|------|----------------|
| `order` | Storefront on a 390 px phone: menu, guests, dishes, event, contact, review, send. Frames: `dropoff-order-mobile`, `dropoff-review-mobile`. | yes (the request) |
| `approve` | The request in the app, then Approve. Frames: `dropoff-request-desktop`, `dropoff-approved-desktop`. | yes |
| (owner) | Pays by test card from the emailed link, by hand | Stripe test |
| `paid` | The order after payment. Frame: `dropoff-paid-desktop`. | no |
| `kitchen`, `buy`, `receive`, `lists` | The existing steps, pointed at this order (US customary units for shop and prep, then back to Metric) | yes |
| `closeout` | Local clock-shifted copy of test, kitchen's use recorded and the review closed, so the share is final | local only |

The steps that already exist get an `ORDER_HREF` input instead of reading it from
the wedding's event page. That is a small refactor of the script, not a copy.

## Video

- A second Remotion composition, `DropoffFilm`, with its own table
  (`video/src/film-dropoff.ts`) and its own VTT, on the same elements (Screen,
  Caption, PhoneFrame, SplitScreen, EndCard). No new element unless a beat needs one.
- Its own figures come from the capture manifest as tokens. No figure is typed
  into a caption; the test from the wedding film is reused.
- Same guards: `check-landing-claims.mjs` gets a block for the second film (banned
  phrases, no "she" or "her", the snap line required).
- Captions follow the house rules: plain kitchen English, no exclamation points,
  no em dashes, "the client", never a pronoun guess.

## Review and finish

1. Render, two-pass loudness to -16 LUFS, black-frame check.
2. The motion designer and caterer reviewers, as for the wedding film.
3. Fix pass, re-render, ledger rows (a new RC for "orders from the ordering site
   are approved, then paid by card") and the story tracker.
4. Merge to the landing repo's develop after the gates (astro check, claims, build).

## Owner input needed

1. **The order:** is a 40-guest office lunch the right job, or do you want pickup,
   a different size, or a different kind of client?
2. **Test data:** OK to hide the QA menus on the test storefront and build a lunch
   menu there?
3. **Your hand step:** one test-card payment from the pay link, like the deposit.
4. **Length:** 40 s with no chapter cards, or about 60 s with them?

## Risks

- The approve step or the pay link may behave differently on test than in the e2e
  spec. Step 0 (a practice order with a "delete me" name) finds that out first.
- Ordering selections reaching the kitchen plan was fixed on develop
  (`fix/ordering-selections-reach-kitchen`); the practice order confirms the shop
  list matches what was ordered.
- A drop-off's closeout needs the same local clock-shifted copy as the wedding's.

## Step 0, before anything is filmed

A practice order on test, named "Practice lunch (delete me)", walked from the
storefront through approval and payment. It checks the flow, the emails and the
frames, then gets archived. The real walk starts only after it goes through.

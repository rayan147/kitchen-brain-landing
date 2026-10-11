# Story Tracker — Run shopping, prep and packing from one confirmed event.

Source: `src/lib/features.ts`, `src/components/sections/FeatureSection.astro`; route `/features/the-day-itself`.

## Caterer first-visit revision · 2026-09-11

- [x] 1 Idea: A busy caterer wants to confirm an event, shop from the list, record deliveries, check prep and packing, but the shopping list and the food at the loading door disagree.
- [x] 2 Character: Six-person operation; spreadsheet competent; wants a quick answer, needs evidence, distrusts vague promises and delays setup.
- [x] 3 Plot: service gap → need for clarity → scattered records → a client question → doubt about setup → inspect CostCook → crew handoff → task examples → labelled result → missing evidence → risk of assuming → informed next step.
- [x] 4 Scenes: orientation, kitchen problem, first action, example, limits, questions, next step; each moves from uncertainty to an explicit answer. Existing layout retained.
- [x] 5 Voice: Plain kitchen English; reader questions are persona assumptions, not testimonials. No seamless, powerful or robust.
- [x] 6 Dialogue: Availability precedes commitment; every next step names its outcome.
- [x] 7 Intention/obstacle: Run shopping, prep and packing from one confirmed event. The obstacle: the shopping list and the food at the loading door disagree.
- [x] 8 Snap: There is no second trip to the store.
- [x] 9 Scene: A phone at the prep bench between services.
- [x] 10 Connection: You throughout; choose a task, inspect what it does, read limits, decide.
- [x] 11 Revision: Built pages, shared consumers, status wording, five responsive widths and 320px/200% text verified. Report: `docs/qa/features-caterer-2026-09-11/report.md`.

### Revision 2026-10-07: chef audit of the feature and resource routes
- Taking orders reads "In the app today", not "Available now".

## Revision 2026-10-11: English edit
- Group title "Opens on what needs attention." is "The home screen opens on what needs attention."
- Orders kicker "Orders, the event" is "Orders, shop, prep & pack" (two kickers no longer both say event).
- Lede left as is: the proposed event-first lede ("book the yes with Confirm order") conflicts with the events page edit that separates Book the event from Confirm order; held for the owner.

## Revision 2026-10-11: settled facts from the owner-call check
- Lede, consistent with the events page: "Take the inquiry and send the proposal. Book the event once the agreement is signed and the deposit is in. Confirm order then locks the menu and head count and gives you your shopping, prep and pack lists..."
- Deposit item: the client pays by card from an email link, or you record what arrives (2026-10-06 ruling); stale "recorded by hand" comment rewritten.
- Purchasing item lead "Follow-up list." (the app's word).

## Revision 2026-10-11: the booking item
- Events item "Confirm order is the booking." is "Book the event books it.": Book the event waits on the signed agreement and the deposit, and the event then reads Booked; Confirm order comes later and freezes quantities and prices (kitchen-brain develop 4f46543cf, BookEvent.svelte, EventHeader.svelte). "This event is booked" is not an app string. Matches the lede and the events page.


## Revision 2026-10-11: English edit (booking and reopen facts)
- "Honest reopen." item: "Reopening drops the frozen prices and goes back to today’s. Once purchasing starts, reopening is refused." (kitchen-brain develop 4f46543cf, orders/repository.ts reopenOrder drops the snapshot; matches faq.ts). Renders here via the orders group.

# Story Tracker — Promo video: one wedding, inquiry to booked (2026-10-05)

## My story

- **Piece:** promotional motion video, ~90 s, 16:9, silent-first (burned-in captions + music bed)
- **Title (working):** "Know what the job makes before you cook it." (the homepage hero line, carried into the film)
- **My hero's name:** Dana, owner-caterer of a six-person operation (same reader as `homepage-caterer-walkthrough.story.md`), watching on a phone between services, sound off
- **Content file(s):** `video/src/film.ts` (every caption), `video/src/scenes/*.tsx` (where each caption lands)
- **Spec:** `docs/superpowers/specs/2026-10-05-promo-video-design.md`

## Revision 2026-10-05 (develop workflow)

Beats now follow the app: 1 phone rings (Inquiry) · 3 menu and service set the scope · 4-5 Catalyst/Debate in the **proposal**, where the price and food cost are seen before sending · 6-7 Priya decides on her phone · 8 agreement signed, deposit paid from the link · 9 Midpoint: **Book the event** (signed, paid, a day with room) · 10 kitchen plan, whole packs, Confirm order freezes prices · 12 callback to the proposal price. Snap line: "Her yes is not a booking. Signed, paid and a day with room is." Invoice and reminder beats cut. Every frame is a real develop screenshot.

## Revision 2026-10-06 (as built, supersedes the revision above where they differ)

The film as shipped: 1 phone rings (Inquiry) · menu and service price the job ($95 a guest, 28.3% food cost, under the 30% target) · Priya opens the offer on her phone and accepts · agreement out for e-signature, deposit asked for and paid by card from the link, the balance reminder goes out on its own (kept: the owner finished the reminder in this lane on 2026-10-05, reversing the cut) · **Book the event** · whole packs by supplier, Confirm order, each supplier gets only its own lines · the delivery, the prep list, the van · Final Image: the day after, the closeout puts what was paid against what was planned, as likely. Snap line, as shipped: "Her yes is not a booking. Signed and paid is." It drops "a day with room" from the planned line; a deliberate simplification, since the Book frame on screen lists every requirement. The invoice beat stays cut. The menu callback before the closeout was dropped: its totals print the planned food cost rounded per guest ($4,039.50), a few cents off the closeout's $4,039.96 (an app rounding defect, reported).

## Revision 2026-10-07 (re-walk, supersedes the revisions above where they differ)

After a caterer's and a motion designer's review, the wedding was walked again, once, on test.app.costcook.io at develop 24664bd69 (owner rulings 2026-10-06: re-walk, keep the real distributor names, one walk on test). Beat 1 changes: the client asks on the kitchen's ordering site ("She asks on your site. A Saturday in June, 150 guests, plated."), and it lands as an inquiry with nothing retyped. The couple is new (Maya Lindqvist, Lindqvist & Shaw wedding, Sat Jun 19 2027, walked at develop 9a15fe297 after the revision-number fix), so no "No date yet". Her note asks for "something for the vegetarians", and the menu answers it: 138 short rib and 12 stuffed peppers, named on the pack beat. The offer carries staff, rentals and an 18% service fee, so the price she sees ($21,043.00) reads like a wedding's; the deposit is a quarter of it and the balance falls due ten days out, never on the day. Short rib is one 420 g plate per guest, so the pack list reads 150, not 300. The buying chapter drops "5 a.m."; Confirm ties to the final count; the pack beat names the allergen labels. Final Image: the closeout's likely share of the price, under the 30% target set at the menu, rather than its dollar gap, which sets a plan that counts 2% misc against purchases that do not (reported to the owner as an app defect). Snap line unchanged: "Her yes is not a booking. Signed and paid is."

## Revision 2026-10-07, third review (caterer)

Same wedding, same walk; no new walk. Fixed by re-shooting read-only pages and cropping walk shots, never by moving data:
- The agreement is re-shot signed ("Signed by both"); caption "Signed online, by her and by you."
- The offer gets four beats: her total, the stuffed peppers ringed for her 12 vegetarians, "Eight staff, seven hours, the rentals and the service fee" (the line prints "56 × $38.00"), then Accept.
- The balance ring moves to the amount and its due date; the caption claims no lead time for the reminder, which goes out on the due date (an app question, reported).
- Shop and prep are re-shot with the account in US customary units (a Maine kitchen buys by the pound); the shop caption adds "What's left stays on the shelf", the reason the closeout's cost is less than what was bought.
- Prep shows the dishes' portions instead of the first two bases, whose celery reads "44.2 each" (an app defect); caption "Bases first, then every dish: 138 short rib, 12 stuffed peppers."
- Receiving, booked and closeout are cropped below their date lines: the event's date on receiving read as trucks on the wedding morning, Booked printed "17:00–22:00", the closeout "2027-06-19" (both reported).

## Revision 2026-10-07, fourth walk (app fixed, then walked again)

The defects the third review left on screen were fixed in the app (develop d3c7c9add) and the wedding walked again as Ellison & Park, Sat Jun 12 2027. The offer now reads "8 staff for 7 hours at $38.00 an hour"; the balance reminder goes out three days before the due day ("reminder three days ahead"); receiving reads "1 still to get"; prep counts whole items. Owner, on the ending: "likely" read as unsure. The kitchen's use is recorded and the review closed, so the Final Image states the share plainly: "Priced at 24.8% before her yes. The day after: 24.9%, under your 30% target."

## The 11 steps

| # | Step | What you build | Done |
|---|------|----------------|------|
| 1 | The Idea | One sentence: WHO + WANT + WALL. | ☒ |
| 2 | Your Character | Hero's insides: want, need, wound, flaw. | ☒ |
| 3 | The Plot | 12 beats on the Save the Cat map. | ☒ |
| 4 | From Beats to Scenes | 12 beats → the scenes you will cut. | ☒ |
| 5 | Character Voices | The reader's voice and the product's voice. | ☒ |
| 6 | Writing Dialogue | Each scene turns a value, the McKee way. | ☒ |
| 7 | Sorkin Dialogue | Title card as intention vs obstacle. | ☒ |
| 8 | Cool Talk | One line of snap. | ☒ |
| 9 | Bringing a Scene to Life | Senses and setting for the key scene. | ☒ |
| 10 | Connecting Your Scenes | Hand-offs between scenes; POV locked. | ☒ |
| 11 | Revise and Finish | Cut, sharpen, make the ending land. | ☒ (draft; re-run after capture fills the figures) |

### Step 1 — The Idea

> A caterer who gets a call about a 150-guest wedding wants to quote a price per head she can stand behind and lock the date, but the real food cost only shows up after the event, when it is too late to change the price.

### Step 2 — Your Character

- **Want:** a number to say on the phone, and a yes from the client.
- **Need:** the food cost of that menu at that price, before she quotes, and one record that carries the job from the call to the shopping list.
- **Wound:** the wedding she quoted at a round number and found out in the month-end books that she had cooked it for almost nothing.
- **Flaw:** she quotes from memory and fixes it later. She checks the arithmetic, so one wrong figure and she stops watching.

### Step 3 — The Plot (12 beats)

| Beat | In this piece |
|------|---------------|
| 1 Opening Image | Phone rings. Priya Nair, a wedding, about 150, no date yet. |
| 2 Theme Stated | Title card: "Know what the job makes before you cook it." |
| 3 Set-Up | The inquiry goes in rough: "Rough answers are fine." |
| 4 Catalyst | Chapter card: "What do I charge a head?" |
| 5 Debate | $95 a guest feels right. Is it? The food-cost check answers before she quotes. |
| 6 Break into Two | The proposal goes out. The film splits: her screen, Priya's phone. |
| 7 B Story | Priya. The client opens it on her phone with no login and taps Accept proposal. |
| 8 Fun and Games | Deposit requested by email; Priya pays from the link on her phone; the balance reminder goes out on its own; Confirm order. Prices and quantities freeze. |
| 9 Midpoint | Booked: the one moment that word is true (after Confirm order, RC-61). |
| 10 Bad Guys Close In | Chapter card: "How much do I buy so I'm not short at 5 a.m.?" Whole packs, by supplier. |
| 11 All Is Lost | Chapter card: "Do I have to type in every invoice?" Upload, confirm what it read, type what it could not. |
| 12 Finale + Final Image | Priced before her yes, checked the day after: the closeout puts what was paid against what was planned, as likely until the kitchen records what it used. End card: price and trial from `src/lib/site.ts`. |

### Step 4 — From Beats to Scenes

| § | Scene | Beats | Value turn (− → +) |
|---|-------|-------|--------------------|
| 0 | Cold open | 1–3 | a call she has to answer now → it is written down, rough is fine |
| 1 | What do I charge a head? | 4–5 | a guess → a food cost she can see at that price |
| 2 | The proposal (split screen) | 6–7 | "will she say yes?" → Priya taps Accept proposal on her phone |
| 3 | Deposit, reminder and Confirm order | 8–9 | chasing a deposit by phone → paid from a link, reminder sent for her, a booked day, prices frozen |
| 4 | How much do I buy? | 10 | short at 5 a.m. → whole packs, by supplier |
| 5 | Invoices | 11 | an afternoon of typing → upload, confirm, type only the misses |
| 6 | Close | 12 | "did I price it right?" → she knew before she quoted |

### Step 5 — Character Voices

- **Reader's words (chapter cards):** "What do I charge a head?" "How much do I buy so I'm not short at 5 a.m.?" "Do I have to type in every invoice?"
- **Product voice (captions):** competent, calm, unfussy. Second person. Short sentences. No exclamation points, no em dashes, no "seamless / in one click / no typing".

### Step 6 — Dialogue (McKee): the turn in each scene

0. Pressure of the call → it is captured.
1. A round number → a food cost shown at that price.
2. Waiting on a client → her answer on her phone.
3. Chasing money → paid from a link; loose yes → a booked day that will not restate.
4. Dread of the 5 a.m. short → a list in whole packs.
5. A stack of paper → a review queue she confirms.
6. Doubt about the price → the number, shown again, unchanged.

### Step 7 — Sorkin: title card

- **Intention:** quote a price she can stand behind.
- **Obstacle:** the food cost arrives after the event.
- **Title:** "Know what the job makes before you cook it."

### Step 8 — Cool Talk: the one snap line

> "Her yes is not a booking. Confirm order is."

(The ledger's boundary line, said in the film's own voice, RC-61/RC-63. It is the one place the film tells the truth a sales video usually blurs.)

### Step 9 — Bringing a Scene to Life

Scene 2, the split screen. Left: the caterer's laptop on the pass, the draft open. Right: Priya's phone, the offer page, the total in a green box, two buttons at her thumb. The cut lands on her thumb's target: Accept proposal.

### Step 10 — Connecting Your Scenes

POV locked to second person ("you") for captions; Priya is named, never addressed. Each scene's last frame hands off: the inquiry's guest count becomes the pricing panel's guest count; the offer's total becomes the confirm dialog's revenue; the frozen order becomes the shop list; the shop list's prices become the invoice review; the film closes on the scene-1 figure.

### Step 11 — Revise and Finish

- Draft captions live in the spec's caption table; every figure is a token filled from the capture manifest, never typed.
- Capture source: kitchen-brain develop after the offer-walk-fixes merge (owner ruling 2026-10-05); RC-65 is updated in the ledger in the same lane.
- Claims withheld (ledger): no signing frame (RC-64); "booked" before Confirm order (RC-61); any no-typing promise (RC-58); invoice email as available (never-claim list).
- Re-run this step after the capture fills the tokens: cut every caption that a frame does not show at the moment it is on screen.

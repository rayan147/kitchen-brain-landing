# Story Tracker: know what the job makes before you cook it (2026-10-06)

## My story

- **Piece:** the homepage rebuilt from the owner's canvas (`Home-A-story`,
  claude.ai artifact PtGKGCeDp6tqrCnTnP9Hat) under the six layout rules in
  `docs/superpowers/specs/2026-10-06-homepage-redesign-layout.md`.
  Supersedes the section list of `homepage-event-story.story.md` (its truth
  notes still hold).
- **Hero (the reader):** Dana, owner-caterer, six on the crew, reading on a
  phone between services, skeptical from a cold email.
- **Content files:** `src/pages/index.astro`, `src/components/home/*.astro`,
  `src/lib/home.ts` (every figure and image), `src/lib/event-payments.ts`.
- **Evidence:** every screenshot is a real app frame
  (`docs/proof/home-manifest.json`); figures in copy are read off those frames.

## The 11 steps

| # | Step | Done |
|---|------|------|
| 1 | The Idea | [x] |
| 2 | Your Character | [x] |
| 3 | The Plot | [x] |
| 4 | From Beats to Scenes | [x] |
| 5 | Character Voices | [x] |
| 6 | Writing Dialogue | [x] |
| 7 | Sorkin Dialogue | [x] |
| 8 | Cool Talk | [x] |
| 9 | Bringing a Scene to Life | [x] |
| 10 | Connecting Your Scenes | [x] |
| 11 | Revise and Finish | [x] |

### Step 1: The Idea
> An **owner-caterer** who wants **to quote a price per head she can stand
> behind and get booked and paid on it**, but **the real food cost only shows
> up after the event, and the deposit, the lists and the invoices live in five
> other places.**

### Step 2: Your Character
- **Want:** a number to say on the phone, a yes, and the deposit in.
- **Need:** food cost at that price before she quotes, and one record that
  carries the job from the call to the shopping list and the books.
- **Wound:** the wedding she quoted at a round number and found out at month
  end she had cooked for almost nothing.
- **Flaw:** quotes from memory, fixes it later, retypes between tools.

### Step 3: The Plot (12 beats)
| Beat | In this piece |
|------|---------------|
| 1 Opening Image | Hero: the price per guest panel, $95.00 a guest at 26.2% food cost. |
| 2 Theme Stated | "Know what the job makes before you cook it." |
| 3 Set-Up | The flow strip: online order and custom event both end in one costed order. |
| 4 Catalyst | The call comes in: Inquiry tab, rough answers are fine. |
| 5 Debate | Proposal tab: the client decides on her phone, no login. |
| 6 Break into Two | Deposit tab: paid by card from an email link. |
| 7 B Story | The client: accepts, signs, pays on her phone. |
| 8 Fun and Games | Confirm order locks quantities and prices; Shop and Prep tab. |
| 9 Midpoint | Costs itself: the food cost broken open, dish by dish. |
| 10 Bad Guys Close In | Short at 5 a.m. (yield), the paperwork pile (import), the allergen sheet. |
| 11 All Is Lost | Invoices by email, orders from your own site: the front of house. |
| 12 Finale | Sage answers with its source; the founder; start the trial. |

### Step 4: From Beats to Scenes
| § | Section (component) | Beats | Value turn | Screenshot |
|---|---------------------|-------|------------|------------|
| 1 | HomeHero | 1, 2 | a guess → a price checked before the quote | hero-pricing (video slot later) |
| 2 | HomeFlow | 3 | five tools → one costed order | none (ticket device; stated exception) |
| 3 | HomeEventWalk (stage tabs) | 4–8 | chasing → booked, paid, lists built | inquiry-mobile, proposal-mobile, payment-schedule, confirm-dialog, prep-list |
| 4 | HomeKitchen (four rows) | 9, 10 | finding out at month end → knowing first | food-cost-breakdown, yield-lines, import-review, allergens-labels |
| 5 | HomeFrontOfHouse | 11 | orders and invoices chased → they come to you | ordering-site, invoice-inbox |
| 6 | HomeSage | 12 | "where did that number come from?" → the source shown | sage-answer |
| 7 | HomeClose | 12 | considering → first real order | none (founder and price card; stated exception) |

### Step 5: Character Voices
- **Reader's words:** "chase the deposit", "short at 5 a.m.", "a printout I
  lose", "was that right?", "wrote it by hand".
- **App's words, verbatim from the frames:** Accept proposal, Confirm order,
  Request payment, Needs review, Matched, Label, Make first.
- **Product voice:** plain, calm, chef-to-chef; no exclamation points, no
  em dashes, no "seamless / in one click / no typing / runs itself".

### Step 6: Dialogue (turns)
Each section turns one value; see Step 4. Every turn is shown by a frame, not
asserted.

### Step 7: Sorkin
- **Intention:** quote a price she can stand behind.
- **Obstacle:** the food cost arrives after the event.
- **Headline:** Know what the job makes before you cook it.

### Step 8: Cool Talk (the one snap line)
> A missing price is named, never counted as zero.

### Step 9: Bringing a Scene to Life
The pass at 2:40 p.m., gloves on, the phone face up beside the ticket rail:
Priya's yes comes in, then the deposit.

### Step 10: Connecting Your Scenes
- **POV:** second person, locked.
- **Hand-offs:** the hero's $95.00 a guest is the proposal's $95.00; the
  proposal's $14,250.00 is the payments block's total; Confirm order hands the
  same menu to Shop and Prep; the kitchen rows explain the hero's number.

### Step 11: Revise and Finish
- **Canvas copy changed by the truth pass** (each listed in the final report):
  "the workflow runs itself", "You don't type it", "nothing typed", "write
  themselves", "email themselves", "goes out on its own", "Sure matches go
  straight in" were rewritten to what the frames show (upload, confirm,
  review; a reminder on the day the balance is due).
- **Canvas brackets** "[$ from orders] / [$ from purchases]" are cut: no
  captured record backs a figure.
- **Final Image (CTA):** `cta.label`, with the trial terms from `launchPlan`.

### Revision 2026-10-06: the workflow rail
- The connection is now shown, not told: the event walk is one rail, and a
  carry line between stages names what passes on (Priya Nair · 150 guests;
  $14,250.00 accepted, asked as $3,500.00 now and $10,750.00 later; the booked
  wedding; the same menu, quantities and prices locked). Step 10's hand-offs
  live on the page itself.
- "How it fits together" (beat 3) is folded into the rail's lede.

### Revision 2026-10-07: designer and chef review
- **Final Image, re-aimed:** the close's heading was "Bring one real invoice.
  See it in 15 minutes.", which sold the demo at the moment the reader should
  meet the trial. It is now "Cost your first dish before your next quote.": it
  echoes the hero's theme (know the number before you cook) and hands off to the
  setup line (about fifteen minutes, RC-10) and the plan card's primary. The
  quiet links follow the card, so a phone reads the trial first.
- **One numbering:** only the rail's five steps are numbered. The kitchen rows
  lost their 02 to 05, which read as a second sequence.
- **One wedding date:** the chef caught the proposal frame (respond by Oct 12
  for an Oct 10 wedding) disagreeing with the payment and Sage frames (Dec 28).
  The proposal is re-shot on a Dec 28 wedding (see the manifest). Superseded
  the same day: the whole walk now runs on the local Dec 19 wedding (balance
  due Wed, Dec 9), and the deposit and Sage frames were re-shot there, Sage
  opened from the app sidebar.

### Revision 2026-10-07 (2): the chef's copy notes, owner rulings
- **The card says why:** "The card starts the subscription, and you pay $0
  until day 16" replaces "Card up front", the funnel line the chef ran from.
- **Unlimited crew:** "during launch" dropped by owner ruling (RC-34).
- **One number:** the costs row's pain line quotes the wedding's $95 a head,
  not a stray $38.
- **Not food only:** the hero caption and the proposal step say staff,
  rentals, delivery and a service fee go on the same proposal (RC-74).
- **Sage as a record lookup, not "AI":** "Ask what the wedding still owes. It
  shows you the record." The hand-off reads "Ask about a job".

### Revision 2026-10-07 (3): the chef's sample-data notes
- One lemon posset a guest, not two; celery weighed (600 g in the mirepoix,
  not 8 heads). The wedding now costs $24.92 a guest, 26.2% at $95.00, and
  every kitchen frame is re-shot from those records.
- The short rib keeps "No listed allergens": its recipe has no flour and no
  wine, and the page does not add an ingredient to make a chip appear.
- The wedding moves to Saturday, December 19, with the balance and the final
  guest count due Wednesday, December 9 (the app's own wording on the offer).

### Revision 2026-10-07 (3): header and footer, after a navbar and footer review
- **The mark where readers look:** the header spans the page, so the mark sits
  at the left gutter, and it is larger (24px wordmark from sm). On phones the
  bar is one row: the mark, Menu, Free trial; Features and Book a demo sit in
  Menu. No copy changed.
- **A footer you can scan:** links grouped under Product, See it work, Make the
  decision and Talk to us. One new line under the mark, "Catering software,
  built by a chef.", repeats the hero eyebrow (the founder line, verified on
  /who-its-for) so the footer says what the company is. No policy links yet:
  the site has no privacy or terms page (owner to supply).

### Revision 2026-10-07 (4): second designer and chef review
- **"Booked" means one thing:** the rail's eyebrow and heading end at the prep
  list ("One event, first call to prep list" / "From the first call to the
  prep list."), and step 03 carries "The Nair & Castellano wedding, deposit
  paid". Only step 04 (Confirm order) books the job.
- **Where the signature is:** step 03 opens with the agreement line, "Send
  the agreement for e-signature from your own template; it can carry the
  accepted proposal." (RC-64, a sentence with no frame). Worded as what the
  app does: the sample wedding's agreement is not prepared, so the heading
  stays "Paid by card from a link." and nothing says it was signed.
- **The balance, before the due day:** "Send the balance request whenever you
  choose, and if it is still owed on the due day, a reminder with a pay link
  goes out." (the Request payment button is in the frame).
- **No number the frames do not show:** the yield row's pain line drops "40 lb
  of short rib" (2 oz a plate against 300 portions) for "The recipe says what
  goes on the plate. You buy exactly that and you are short at 5 a.m."
- **Food only, said so:** the hero caption keeps the other lines as a "can"
  and says this sample prices the food only.
- **A second menu, named:** the ordering row says the Coastal Dinner is a
  separate menu from the wedding, so $93 does not read as a mismatch.
- **Sage, the record only:** the frame ends under the cited record; the
  suggested-step card and its green button are cropped off.
- **Navigation:** the phone Menu reads the footer's four groups, adds the phone
  number and email, and opens under the header with a backdrop and a Close
  button. Every demo link reads "Book a 15-min demo" (demoCta.label).
- **Pounds, from the app:** the kitchen is set to US customary units, and the
  rail's last frame is now the Shop tab on a phone: 138.9 lb of boneless short
  rib for 150 guests (two 210 g portions each), bought as 9 cases of 7 kg. The
  prep sheet was not re-shot: it prints each recipe in the units it was
  written in, so it stays metric with celery by the head (an app gap, not a
  page claim). The polenta's "about 240 g a portion" and the yield frame's
  grams remain.
- **Deposit legible on a phone:** the deposit block has its own phone capture
  below 48rem, with rings measured on it.

### Revision 2026-10-07 (5): third designer and chef review
- **"Book 15 minutes"** everywhere (demoCta.label, the label CLAUDE.md names);
  "Book a 15-min demo" read like a funnel. Its accessible name starts with
  the same words.
- **The boundary, plainer:** "Their yes books nothing. Confirm order does."
  Step 04 adds when: "Confirm once the final count is in."
- **The walk ends where its last frame does:** "From the first call to the
  shopping list."
- **The agreement line says what happens:** the accepted proposal goes with it
  as Schedule A (the app's default).
- **No "Available now"** over Sage; the status prints only while it is Coming.
- **Ordering row:** "Clients pick a set menu, like a $93 Coastal Dinner, ...
  You approve the request, and they pay by card." "Confirm" now means one
  thing on the page. The sample storefront asks for 20 guests and 72 hours.
- **Yield on a phone:** cropped to the tomato line, where the yield visibly
  moves the amount to buy.
- **Navigation:** the bar stays tappable over the backdrop, the page does not
  scroll under an open panel, Features opens like Menu below lg, Contact has
  its own "Talk to us" group in Resources, and Menu lists its actions first.
- **The shop list has a cushion:** the short rib line carries a 91% trim
  yield, so the wedding needs 152.7 lb and buys 10 cases of 7 kg (154.3 lb).
  Every cost frame was re-shot: $26.18 a guest, 27.6% at $95.00, $68.82
  margin. The case is still the supplier's 7 kg (a pound case did not save in
  the app's pack form).

### Revision 2026-10-07 (6): the same rules on every route (layout only)
No copy changed in this pass. The cream header is now the default on every
route and runs into each page's first section; the green button is only ever
the trial (nine feature guides had closed on the demo); every demo link is
the quiet link; no route scrolls sideways at 200% text on 320 or 390.

### Revision 2026-10-07 (7): the film in the hero
- **Beat:** the Opening Image is now the whole story in 1 min 58 s, one
  wedding from the client's ask to the food cost the day after. The H1 and the
  film's title card say the same sentence, so the film opens on the page's
  promise.
- **No autoplay:** it waits for a tap and nothing past the poster loads. The
  poster is the film's own $95.00 / 24.8% frame, not the old still, whose
  27.6% would have argued with the film.
- **Caption:** "One sample wedding, from the client's inquiry to the food cost
  the day after." The "this sample prices the food only" line went with the
  still: the film shows staff, rentals and the service fee on the offer.
- **Transcript:** the film's on-screen words, in order, in a "Read what the
  film shows" disclosure under the player (principle 4).
- **Open:** the film follows the Ellison & Park wedding (Jun 12, 2027,
  $5,250 deposit); the rail below follows Nair & Castellano (Dec 19, $3,500).
  Owner to choose which wedding the page keeps.
- **Playable (owner: "the video is not playable"):** the browser's own
  player with preload="metadata"; with "none", Chrome's player ignored clicks.
  The poster is now the "What do I charge a head?" chapter card, so the
  control bar covers nothing, and it names neither wedding.

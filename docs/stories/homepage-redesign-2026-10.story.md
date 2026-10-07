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
| 1 Opening Image | Hero: the price per guest panel, $95.00 a guest at 28.4% food cost. |
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
  The proposal is re-shot on a Dec 28 wedding (see the manifest).

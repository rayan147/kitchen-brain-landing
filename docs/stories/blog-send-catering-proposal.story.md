# Story Tracker — Send a catering proposal the client accepts (blog how-to)

## My story

- **Piece:** How-to guide (task steps, not a story; see memory "how-to guides are steps")
- **Title / headline:** How to send a catering proposal the client accepts on their phone
- **My hero's name:** The owner of Harbor & Hearth Catering, with the Nair & Castellano wedding inquiry saved
- **Content file(s):** `src/content/blog/send-catering-proposal.md`
- **Evidence:** RC-81 in `docs/release-claim-ledger.md` (kitchen-brain develop 9b84420f4, read 2026-10-12)
- **Schedule:** publishedDate 2026-10-22 (Thursday), order 24. Hidden until then (src/lib/blog.ts).
- **Data:** the memory wedding (Nair & Castellano, Sat Dec 19, 150 guests, $95, $3,500 deposit, balance due Dec 9), entered by hand: the demo seed has no events.

## The 11 steps

For a how-to, only Steps 1, 2 and 11 shape the page. The beats are not used.

| # | Step | Done |
|---|------|------|
| 1 | The Idea | ☑ |
| 2 | Your Character | ☑ |
| 3 | The Plot | ☑ (n/a for a how-to: numbered steps) |
| 4 | From Beats to Scenes | ☑ (before you start, build and send, what the client sees, after they accept, fixes, limits) |
| 5 | Character Voices | ☑ (reader: deposit, final count, text the link; product: the app's labels) |
| 6 | Writing Dialogue | ☑ (each step turns a draft into something the client can say yes to) |
| 7 | Sorkin Dialogue | ☑ (wants: a yes on the phone; obstacle: not knowing what the client will see) |
| 8 | Cool Talk | ☑ |
| 9 | Bringing a Scene to Life | ☑ (the client's phone, two buttons at the bottom) |
| 10 | Connecting Your Scenes | ☑ (second person throughout; the client's side shown, not narrated) |
| 11 | Revise and Finish | ☑ |

### Step 1 — The Idea

> A caterer with a saved inquiry who wants the client to say yes on their phone, but has never seen what the client's side looks like and worries a price goes out wrong.

### Step 2 — Your Character

- **Want:** Get the proposal out today and get a yes.
- **Need:** See the client's page before they do, so the deposit and the dates read right.
- **Wound:** A PDF quote with last month's deposit terms that the client signed anyway.
- **Flaw:** Sends first and checks the tax later.

### Step 8 — Cool Talk (the one snap line)

> "Nothing is charged today." (the app's own words on the client's accept window)

### Step 11 — Revise and Finish

- **Kept to the app's words:** "Publish every dish in that menu before using it here.", "No customer email", "The balance due date has already passed", "The event isn't booked until the customer accepts.", "Nothing is charged today.", "The current link keeps working until you send the update."
- **Overlap avoided:** the inquiry (first-call guide) and the agreement, deposit and booking (deposit guide) are linked, not repeated.
- **Removed claims:** email delivery (no mail server in the shoot); "Send a test to me" (source only); card payment on the offer page; anything the header food-cost figure says (28.9% at the top vs 28.3% on the service line, see report).
- **Final image:** the client's "Thank you. Proposal accepted" and your Send agreement button.

## Revision 2026-10-13 (re-shot on local develop fcc651477)

- Every image re-shot from the fixed app. 22 figures (was 21): a new p02b shows the event's Food cost strip and its note about whole batches.
- Step 2 now names the service figure **Plate cost** (the app's new label) and gives 28.4% (the app now judges the percent on the exact cost per guest). The new paragraph explains why the event's Food cost, 28.9%, reads higher: whole batches add $76.32, in the app's own words.
- Step 12: after acceptance the decision page reads **Client decision** / **Proposal accepted** above "Step 5 of 6: Agreement" (the old "Step 4 of 6" header is fixed).
- Dates in alt text follow the re-shoot day (sent Tue Oct 13, link until Tue Oct 20).
- Limits: food cost "only you see this", the proposal's own words.

# Story Tracker — Supplier price change by email (blog guide)

## My story

- **Piece:** How-to guide (task steps, not a story; owner rule 2026-10-12)
- **Title / headline:** How to see what a supplier's price rise does to your booked events
- **My hero's name:** The owner of Harbor & Hearth Catering, the morning a supplier's invoice email arrives
- **Content file(s):** `src/content/blog/supplier-price-change-by-email.md`
- **Evidence:** kitchen-brain local develop a340f35c1, read 2026-10-16 (Price changes `/purchases/price-impact`, Invoice inbox, import result handoff, `decide.ts` ten-minute undo, `write.ts` supersede, `price_anomaly_pct` default 40). Captures: `scripts/capture-blog-guides.mjs` GUIDE=supplier-price-change-by-email.

## The 11 steps

How-to rule: Steps 1, 2 and 11 are kept; beats do not shape the page.

| # | Step | What you build | Done |
|---|------|----------------|------|
| 1 | The Idea | One sentence: WHO + WANT + WALL. | ☑ |
| 2 | Your Character | Hero's insides: want, need, wound, flaw. | ☑ |
| 3 | The Plot | Not used for a how-to. | n/a |
| 4 | From Beats to Scenes | Sections are the task's parts: review, see, decide, later, fixes. | n/a |
| 5 | Character Voices | App labels verbatim in bold; plain kitchen English around them. | ☑ |
| 6 | Writing Dialogue | Not used for a how-to. | n/a |
| 7 | Sorkin Dialogue | Title names the job and the fear: the booked events. | ☑ |
| 8 | Cool Talk | One snap line (below). | ☑ |
| 9 | Bringing a Scene to Life | Not used for a how-to. | n/a |
| 10 | Connecting Your Scenes | Second person throughout; each part ends on the next part's button. | ☑ |
| 11 | Revise and Finish | Cut, check every claim against the app, ending is the reader's after. | ☑ |

---

### Step 1 — The Idea

> A caterer whose supplier invoices arrive by email wants to know, the day a price goes up, which booked events and drafts it hurts and by how much, but the invoice only shows the case price, and the quote they already sent shows nothing at all.

### Step 2 — Your Character

- **Want:** Get the invoice in and move on with the day.
- **Need:** See the dollars a price rise costs each upcoming event, decide once whether it's real, and have that decision written down.
- **Wound:** A wedding that was quoted on last month's protein price and quietly lost its margin.
- **Flaw:** Types in the new price and trusts that "everything updates", without looking at the events that can't update because they're already booked.

### Step 8 — Snap

> "So the Blackwood party still bills what you quoted; the $110.96 comes out of your margin."

### Step 11 — Revise and Finish

- Every label is the app's own, read off the rendered pages: Invoice inbox, Review, What this import changes, Import invoice and update costs, Review affected events, Open review, Upcoming events, What happened?, the three answers, Close review, Closed · Real change, Undo this answer, Looks unusual.
- Claims checked in code: the review is created only when a current cost changes (import result shows the button only with a review id); owners and managers answer (`hasRole OWNER, MANAGER`); ten-minute undo (`DECISION_UNDO_MINUTES`); a newer change supersedes an older open one for the same ingredient; Looks unusual at 40% either way (default).
- Not claimed: anything about backdated invoices; anything the app changes on its own beyond "the new price is wrong" reverting the price.
- Ending: the reader knows where every open price change waits and what it does not do for them.

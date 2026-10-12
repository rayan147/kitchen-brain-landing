# Story Tracker — Square: what sold at the counter, and what it cost to make

## My story

- **Piece:** Worked blog guide (HELD while Square is Coming)
- **Title:** Square and CostCook: what sold at the counter, and what it cost to make
- **My hero:** An owner-caterer who also runs a Saturday market stall on a Square register, and on Monday knows the takings but not the food cost
- **Content file:** `src/content/blog/square-counter-sales-food-cost.md`
- **Source of truth:** kitchen-brain main ed6ff5f01 and develop 3e933bcc1, read 2026-10-12: `src/routes/settings/integrations/square/+page.svelte`, `src/routes/analytics/sales/+page.svelte`, `docs/integrations/square.md` (publication, conflicts, sales, refunds, the hourly 48-hour check, sales food cost, publishing from a food cost warning, recovery).
- **Publication:** held by `src/lib/blog.ts` while `SQUARE_STATUS` is Coming (owner, 2026-10-12: "Coming, posts held").

## The 11 steps

| # | Step | Done |
|---|------|------|
| 1 | The Idea | ☑ |
| 2 | Your Character | ☑ |
| 3 | The Plot | ☑ |
| 4 | From Beats to Scenes | ☑ |
| 5 | Character Voices | ☑ |
| 6 | Writing Dialogue | ☑ |
| 7 | Sorkin Dialogue | ☑ |
| 8 | Cool Talk | ☑ |
| 9 | Bringing a Scene to Life | ☑ |
| 10 | Connecting Your Scenes | ☑ |
| 11 | Revise and Finish | ☑ |

### Step 1 — The Idea

An owner who sells at a counter as well as at events wants to know what Saturday's food cost them, but the register has never seen a recipe.

### Step 2 — Your Character

- **Want:** Saturday's food cost, by dish.
- **Need:** The register's sales next to today's recipe cost, without retyping either.
- **Wound:** A busy market season that felt profitable and wasn't.
- **Flaw:** Reading the till total as the answer.

### Step 3 — The Plot

| Beat | In this guide |
|---|---|
| Opening Image | Monday: the takings are known, the cost is not |
| Theme Stated | Square rings the sales; CostCook knows the recipes |
| Set-up | Who it's for, and the app's "you can skip this" |
| Catalyst | Connect Square |
| Debate | What will it send to my register? |
| Break into Two | Publish the dishes you pick, after a review |
| Fun and Games | A register-side price change caught, not overwritten |
| Midpoint | Sales come back; the iced tea needs a match |
| Bad Guys Close In | "At today's prices" is not what you paid then |
| All Is Lost | It doesn't deplete stock or report payouts, said plainly |
| Break into Three | Cook it again from what sold |
| Final Image | Monday, with every dish costed and next Saturday planned |

### Step 4 — From Beats to Scenes

Opening; who it's for; Steps 1 to 7 (connect, choose, review and publish, conflicts, sales back, Counter sales worked through, cook again); when a price moves; what it doesn't do; disconnecting; Monday after.

### Step 5 — Character Voices

- **Reader:** "What did the bowls cost me?" "Somebody changed the price on the register."
- **Product:** quoted app strings: "Connecting is not publishing.", "Some Square items changed", "In sync with Square", "What sold at the register, what it cost to make at today's prices, and how much to cook to do it again.", "Disconnect this Square account?"

### Step 6 — Writing Dialogue

Every step turns one value: unknown cost to known cost, fear of overwrites to a visible conflict, unmatched sales to a counted number.

### Step 7 — Sorkin Dialogue

Title: what sold, against what it cost. Intention (sell more) against obstacle (not knowing the cost).

### Step 8 — Cool Talk (the one snap line)

**"If you only book catering events, you can skip this integration."** The app's own sentence.

### Step 9 — Bringing a Scene to Life

A Saturday market stall, 42 bowls, 65 slices of focaccia, 18 short rib plates and 30 iced teas nobody set up.

### Step 10 — Connecting Your Scenes

Second person, one kitchen (Harbor & Hearth Catering), one Saturday from start to finish. The worked table is the turn: $291.25 ÷ $1,280 ≈ 22.8%, with the unmatched tea left out rather than counted as free.

### Step 11 — Revise and Finish

Cut: inventory depletion (not in the app), payouts and fees, any date, any other register brand. Numbers labelled illustrative.

## Gate before this guide publishes

- [ ] `SQUARE_STATUS` is 'yes' (see `src/lib/connections.ts` for the three conditions).
- [ ] Re-read every step and quoted string against the build that went live (develop-only strings today: "In sync with Square", "Changed in Square", the food cost warning publish path).
- [ ] Captures, live account, with alt text and figcaptions (check-blog requires them): settings after connecting; publication review with three dishes; the "Some Square items changed" conflict; Counter sales, desktop and phone.
- [ ] Replace the capture comments with the images; recompute readMinutes.

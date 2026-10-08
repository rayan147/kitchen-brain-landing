# Story Tracker — Promo film two: an office lunch from the ordering site (2026-10-07)

## My story

- **Piece:** second promotional motion video, about 40 s, 16:9, silent-first (burned-in captions and a music bed)
- **Title (working):** none on screen; the film opens on the client's phone
- **My hero's name:** Dana, the same owner-caterer as the wedding film (`promo-video.story.md`), on an ordinary weekday
- **Content file(s):** `video/src/film-dropoff.ts` (every caption), rendered as `video/out/dropoff.mp4` with `video/out/dropoff.vtt`
- **Plan:** `docs/plans/2026-10-07-dropoff-film-plan.md`

## The 11 steps

| # | Step | What you build | Done |
|---|------|----------------|------|
| 1 | The Idea | One sentence: WHO + WANT + WALL. | ☒ |
| 2 | Your Character | Hero's insides: want, need, wound, flaw. | ☒ |
| 3 | The Plot | 12 beats on the Save the Cat map. | ☒ |
| 4 | From Beats to Scenes | 12 beats → the scenes you will cut. | ☒ |
| 5 | Character Voices | The reader's voice and the product's voice. | ☒ |
| 6 | Writing Dialogue | Each scene turns a value. | ☒ |
| 7 | Sorkin Dialogue | Opening line as intention vs obstacle. | ☒ |
| 8 | Cool Talk | One line of snap. | ☒ |
| 9 | Bringing a Scene to Life | Senses and setting for the key scene. | ☒ |
| 10 | Connecting Your Scenes | Hand-offs; POV locked to "you" and "the client". | ☒ |
| 11 | Revise and Finish | Cut, sharpen, make the ending land. | ☒ |

### Step 1 — The Idea

> A caterer who runs weekday office lunches wants orders to arrive priced and paid without retyping an email, but today the order comes as a message, gets priced by habit, and its real food cost only shows up at month end.

### Step 2 — Your Character

- **Want:** a lunch order in, paid, on the shop list, without a phone call.
- **Need:** the price and the food cost settled before the cooking starts, and nothing retyped.
- **Wound:** the office lunch Dana typed in from an email as 14 instead of 40, found at 6 a.m.
- **Flaw:** says yes on the phone and sorts the details out later.

### Step 3 — The Plot (12 beats, compressed for 40 s)

| Beat | In this piece |
|------|---------------|
| 1 Opening Image | The client's phone on the kitchen's ordering site, choosing a lunch for 40 |
| 2 Theme Stated | The estimate on the review screen: the price is set before anyone calls |
| 3 Set-Up | (implied: no email, no retyping) |
| 4 Catalyst | The request lands in the app |
| 5 Debate | (none: the day was clear and the menu priced, so it approved itself) |
| 6 Break into Two | Approved without waiting; the client gets a pay link |
| 7 B Story | The client: two vegetarians, answered by a dish on the menu |
| 8 Fun and Games | Paid by card; the order goes straight to the Shop list by supplier |
| 9 Midpoint | Prep list for 40 |
| 10 Bad Guys Close In | (cut for length) |
| 11 All Is Lost | (cut for length) |
| 12 Finale + Final Image | The day after: the lunch's food cost share, under the target; end card |

### Step 4 — From Beats to Scenes

| § | Scene | Beats | Value turn |
|---|-------|-------|------------|
| 1 | Ordering | 1-3 | An email to retype → an order with a price |
| 2 | Arrives | 4-6 | Unknown request → priced, and approved without the owner |
| 3 | Paid | 6, 8 | Chasing money → paid by card |
| 4 | In the kitchen | 8-9 | A guess at what to buy → whole packs by supplier, a prep list |
| 5 | Out the door | 7 | "Did we remember the vegetarians?" → on the pack list |
| 6 | The number | 12 | Food cost at month end → the day after |

### Step 5 — Character Voices

- **The reader (the owner-caterer):** short, practical, about the day: "lunch for 40", "the price", "the vegetarians", "under target".
- **The product:** calm, states what happened and the number. No exclamation points, no "seamless", no pronoun guesses: "the client".

### Step 6 — Each scene turns a value

| Scene | From | To |
|-------|------|----|
| Ordering | an email to retype | an order with a price on the client's phone |
| Arrives | a request to judge | priced (food cost on arrival) and approved on its own |
| Paid | money to chase | paid by card, in full |
| Kitchen | a guess at what to buy | whole packs by supplier, each supplier its own lines |
| Lists | "did we remember the vegetarians?" | every dish checked, 2 stuffed peppers packed |
| The number | food cost at month end | the day after, under target |

### Step 7 — Opening line as intention vs obstacle

"A client orders lunch for 40 on your site." The client wants lunch; the obstacle the film removes (the email, the phone call) is named in the next line: "The price is set before anyone calls."

### Step 8 — Cool Talk

> "Nobody retyped it. Nobody chased the money." (once, on the paid beat)

### Step 9 — The key scene

The paid beat: the money tab's card, "$1,273.08 paid of $1,273.08", "Paid in full" ringed. The reader recognises the moment they usually spend texting a client for a deposit.

### Step 10 — Hand-offs and point of view

POV locked to "you" (the owner) and "the client". Each scene hands to the next by the order's own state: priced → approved → paid → shopped → prepped and packed → closed. No chapter cards at 43 seconds; 15-frame fades between scenes.

### Step 11 — Revise and finish

- Cut the split screen on the paid beat (the order header compacted into a thin strip once confirmed); the money tab's card replaced it.
- Cut "2 stuffed peppers packed" from under the caption: the caption moved to the top, off the row it names.
- Cut any comparison of the arrival's 29.3% (with misc) with the closeout's 29.1% (without): the ending compares the day-after share with the target only.
- Not "you approve": nobody clicked Approve; the frame says "Approved automatically".
- Every figure is a manifest token; `film-dropoff.test.ts` and `check-landing-claims.mjs` hold the rules.

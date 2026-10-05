# Story Tracker — Promo video: one wedding, inquiry to booked (2026-10-05)

## My story

- **Piece:** promotional motion video, ~90 s, 16:9, silent-first (burned-in captions + music bed)
- **Title (working):** "Know what the job makes before you cook it." (the homepage hero line, carried into the film)
- **My hero's name:** Dana, owner-caterer of a six-person operation (same reader as `homepage-caterer-walkthrough.story.md`), watching on a phone between services, sound off
- **Content file(s):** `video/src/film.ts` (every caption), `video/src/scenes/*.tsx` (where each caption lands)
- **Spec:** `docs/superpowers/specs/2026-10-05-promo-video-design.md`

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
| 8 Fun and Games | Deposit asked, deposit recorded, Confirm order. Prices and quantities freeze. |
| 9 Midpoint | Booked: the one moment that word is true (after Confirm order, RC-61). |
| 10 Bad Guys Close In | Chapter card: "How much do I buy so I'm not short at 5 a.m.?" Whole packs, by supplier. |
| 11 All Is Lost | Chapter card: "Do I have to type in every invoice?" Upload, confirm what it read, type what it could not. |
| 12 Finale + Final Image | Back to the number she quoted on: $95 a guest, its food cost, known before the call ended. End card: price and trial from `src/lib/site.ts`. |

### Step 4 — From Beats to Scenes

| § | Scene | Beats | Value turn (− → +) |
|---|-------|-------|--------------------|
| 0 | Cold open | 1–3 | a call she has to answer now → it is written down, rough is fine |
| 1 | What do I charge a head? | 4–5 | a guess → a food cost she can see at that price |
| 2 | The proposal (split screen) | 6–7 | "will she say yes?" → Priya taps Accept proposal on her phone |
| 3 | Deposit and Confirm order | 8–9 | an accepted offer that holds nothing → a booked day, prices frozen |
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
3. Loose yes → a booked day that will not restate.
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
- Claims withheld (ledger): no signing frame (RC-64); card deposits and balance reminders (RC-65, Coming on production); closeout figures (RC-69); "booked" before Confirm order (RC-61); any no-typing promise (RC-58); invoice email as available (never-claim list).
- Re-run this step after the capture fills the tokens: cut every caption that a frame does not show at the moment it is on screen.

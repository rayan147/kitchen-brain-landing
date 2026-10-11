# Story Tracker — What goes on a catering food label

## My story

- **Piece:** Worked blog guide
- **Title:** What has to go on a catering food label?
- **My hero:** An owner-caterer looking at six unlabelled yellow containers in the walk-in
- **Content file:** `src/content/blog/catering-food-labels.md`
- **Source of truth:** kitchen-brain `develop` 66d0703fe, read 2026-10-10 (four read-only research passes; exact strings and file:line in the session notes). kitchen-brain origin/main (ed6ff5f01, 2026-09-27) does not carry the Pack page "allergens not reviewed" warning (other label strings are on both); the site follows develop under the owner's standing rulings.

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

An owner-caterer who wants tomorrow’s cook to grab the right container, but the walk-in is full of "sauce" in marker.

### Step 2 — Your Character

- **Want:** Containers anyone can pick up and use safely.
- **Need:** Labels whose allergens come from the recipe and whose blanks mean "checked".
- **Wound:** The wrong container on the wrong food.
- **Flaw:** Labelling from memory, with a marker, at the end of a shift.

### Step 3 — The Plot

| Beat | In this guide |
|------|---------------|
| Opening Image | Six yellow containers that all say "sauce". |
| Theme Stated | A label is the note you leave the next cook. |
| Set-Up | Two labels, two readers. |
| Catalyst | Tomorrow someone who didn’t make it has to use it. |
| Debate | How much is enough on a kitchen label? |
| Break into Two | Seven lines. |
| B Story | The guest-facing label is a stricter job. |
| Fun and Games | Counting the use-by date: day made is day 1. |
| Midpoint | The allergen line is the one that matters. |
| Bad Guys Close In | A blank line looks like "none". |
| All Is Lost | Retail rules: ask your health department; the app’s nutrition label is an estimate. |
| Finale + Final Image | LEMON TAHINI DRESSING, USE BY OCT 19, CONTAINS: SESAME. |

### Step 4 — From Beats to Scenes

| § | Section | Beats | Value turn |
|---|---------|-------|------------|
| 1 | Opening | Opening + theme | "sauce" → a note |
| 2 | Two labels | Set-up | one label → two readers |
| 3 | Kitchen label | Break | marker → seven lines |
| 4 | Use-by | Fun and games | off by one → day 1 |
| 5 | Allergen line | Midpoint + bad guys | blank → reviewed |
| 6 | How CostCook prints | Promise | handwriting → from the recipe |
| 7 | Guest-facing label | All is lost | assumed compliance → ask your health department |
| 8 | Before the walk-in | Final image | guessing → reading |

### Step 5 — Character Voices

- **Reader:** "It’s the sauce.", "Who made this?", "Is that still good?"
- **Product:** calm, exact, names the app's own labels in bold; says plainly what it does not do. Banned: seamless, smart, peace of mind.

### Step 6 — Dialogue turns

"Sauce" becomes a name; a guess becomes a date counted from day 1; a blank becomes a reviewed answer; assumed compliance becomes a question for the health department.

### Step 7 — Headline / subhead

- **Intention:** Label the containers.
- **Obstacle:** The person reading the label isn’t the person who made it.
- **Headline:** What has to go on a catering food label?
- **Subhead:** A kitchen label tells tomorrow’s cook what’s in the container and when it has to go.

### Step 8 — The one snap line

> A blank allergen line on a CostCook label is never an all-clear.

### Step 9 — Bringing the scene to life

- **Where:** The walk-in at close.
- **Sensory detail:** Pale yellow deli containers, marker on tape.
- **Time:** End of shift, for 6 a.m. tomorrow.

### Step 10 — Connecting the scenes

- **POV:** Second person throughout.
- **Hand-offs:** two labels → seven lines → the date → the allergen line → how CostCook prints → the stricter label → checklist.

### Step 11 — Revise and finish

- Checked against develop: label lines (labels.ts, LabelSticker), stock presets (label-stock.ts), browser-only printing (transport.ts), use-by = made + days − 1 and the FDA Food Code 3-501.17 reference the app cites, frozen and thawed print no countdown, unreviewed ingredients print "N ingredients not reviewed", nutrition label disclaimers (estimate, recipe order, not a compliance claim).
- No claim of regulatory compliance, ingredient list by weight, direct thermal driver or PDF export.
- Thawing: says only that the thaw date is printed and the owner decides the rest (the app prints no countdown).
- External source: FDA Food Code page (fetched 2026-10-10; the guide says the state or county may differ).
- **Final image:** Tomorrow’s cook reaches for the container that says LEMON TAHINI DRESSING, USE BY OCT 19, CONTAINS: SESAME.

**Revision 2026-10-10: reviews applied.** Owner-caterer review: "a blank line is never an all-clear" was wrong for a fully reviewed recipe (labels.ts prints a blank when every ingredient was reviewed and none contains anything), so the guide now says a blank never hides an unreviewed ingredient; the 2 × 1 in stock is a die-cut roll, not thermal; the guest-facing section now says the major allergens have to be declared. Humanize review: the three same-shape sentences, "A label isn't decoration" and "Don't mix them up" rewritten; checklist renamed "In the walk-in".

**Revision: step-by-step guide with app captures.** Rebuilt as a step-by-step how-to on 2026-10-10 with seven phone captures (Ishikawa fundraiser, Wild Mushroom Polenta): the Pack warning, Parmesan's allergen page and save note, the reviewed dish row, storage and shelf life, the sticker (made Oct 10, use by Oct 16), containers and print.

**Revision, second review pass.** Second review pass (2026-10-11). Owner-caterer: the made date is the print date (LabelForm madeAt: today), so print the day you make it or set the use-by yourself; the closing quotes the sticker as printed (dish name in title case). Humanize: the opener and the warning line reworked.

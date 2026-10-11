# Story Tracker — A guest says no sesame

## My story

- **Piece:** Worked blog guide
- **Title:** A guest can’t have sesame. Which dishes can he eat?
- **My hero:** An owner-caterer answering a planner about one guest’s sesame allergy, a week before a wedding
- **Content file:** `src/content/blog/guest-allergy-menu-check.md`
- **Source of truth:** kitchen-brain `develop` 66d0703fe, read 2026-10-10 (four read-only research passes; exact strings and file:line in the session notes). kitchen-brain origin/main (ed6ff5f01, 2026-09-27) does not carry the confirm-dialog conflict list, "Confirm anyway" or the guest results groups; the site follows develop under the owner's standing rulings.

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

An owner-caterer who wants to tell the planner "we’ve got him", but is checking a menu by dish names while the sesame hides in a sub-recipe.

### Step 2 — Your Character

- **Want:** Answer the planner today, with confidence.
- **Need:** Know, dish by dish, which ingredient decides the answer for this guest.
- **Wound:** The dressing that went out on the side nobody thought of.
- **Flaw:** Reading the menu by dish name and memory.

### Step 3 — The Plot

| Beat | In this guide |
|------|---------------|
| Opening Image | The planner’s one-line text; the caterer swaps the hummus and says yes. |
| Theme Stated | A menu read by dish name gets this wrong sometimes; you need the ingredients all the way down. |
| Set-Up | Allergies arrive as texts and live in heads. |
| Catalyst | The green beans carry the tahini dressing. |
| Debate | Ask the planner again, or trust the swap? |
| Break into Two | Put the guest on the order, next to the food. |
| B Story | Tomorrow’s cook needs to know which plate. |
| Fun and Games | Ingredients, sub-recipes, nine allergens; conflict, check, no conflict. |
| Midpoint | "Unknown is never clear." |
| Bad Guys Close In | Blanks from ingredients nobody answered; Sage can only draft from a name. |
| All Is Lost | A conflict does not stop Confirm order; the promise is still yours. |
| Finale + Final Image | "We’ve got him", this time knowing which dressing was checked. |

### Step 4 — From Beats to Scenes

| § | Section | Beats | Value turn |
|---|---------|-------|------------|
| 1 | Opening | Opening + theme | confidence → doubt |
| 2 | Write the guest down | Set-up + break | text in a head → restriction on the order |
| 3 | Check down to the last spoonful | Fun and games | dish names → ingredients |
| 4 | Read the three answers | Midpoint | yes/no → conflict, check, no conflict |
| 5 | Answer the blanks | Bad guys | guess → package in hand |
| 6 | What happens when you confirm | All is lost + finale | software promise → owner’s promise |
| 7 | Before you answer | Final image | worry → a checked answer |

### Step 5 — Character Voices

- **Reader:** "Is that OK?", "We’ve got him.", "It’s tahini, obviously."
- **Product:** calm, exact, names the app's own labels in bold; says plainly what it does not do. Banned: seamless, smart, peace of mind.

### Step 6 — Dialogue turns

Confidence becomes doubt; a text becomes a recorded restriction; a dish name becomes its ingredients; a blank becomes a question; a promise stays with the owner.

### Step 7 — Headline / subhead

- **Intention:** Say yes to the guest.
- **Obstacle:** The allergen hides below the dish name.
- **Headline:** A guest can’t have sesame. Which dishes can he eat?
- **Subhead:** Check every dish against the guest, not your memory of the recipes.

### Step 8 — The one snap line

> Unknown is never clear.

### Step 9 — Bringing the scene to life

- **Where:** The office desk between services, planner’s email open.
- **Sensory detail:** The dressing quart in the walk-in nobody thinks of as a dish.
- **Time:** A week before the wedding.

### Step 10 — Connecting the scenes

- **POV:** Second person throughout.
- **Hand-offs:** guest on the order → ingredients → three answers → blanks → confirm → checklist.

### Step 11 — Revise and finish

- Every label and behaviour checked against develop: nine allergens (matrix.ts), the three outcomes (guards.ts), "Review allergens" gating Confirm order, conflicts warning not blocking, Sage never proposing free_from.
- Quoted the conflict line only up to the app’s em dash (house rule: no em dashes).
- One external source: the FDA food allergy page, confirmed to list the same nine (fetched 2026-10-10).
- Removed any claim of certification or of food being free of an allergen; the title asks which dishes he can eat, not whether the menu is "safe" (the restrictions page contract forbids safe, certified, guaranteed, allergen-free); the app’s own limit stated in its words.
- **Final image:** The caterer writes "We’ve got him" and knows which dressing was checked.

**Revision 2026-10-10: reviews applied.** Owner-caterer review: answers now use the app's five labels (Contains, May contain, Cross-contact risk, Confirmed free from, Not sure; allergen-checklist.ts); the Sage button is the ingredient's **Draft with Sage**, not the setup-only "Draft missing food facts"; "(from Lemon tahini dressing)" placed on the recipe's allergen chart; a check names the ingredient or counts the unreviewed; "Nothing to flag" replaces a "No conflict" label the app does not print; Confirm anyway stated as owner-only and skipping every open check. Humanize review: the "isn't X, it's Y" lines and the third-paragraph punchline rewritten; snap line kept.

**Revision: step-by-step guide with app captures.** Rebuilt as a step-by-step how-to on 2026-10-11 with eight phone captures from the demo world (kitchen-brain develop 66d0703fe, scripts/capture-blog-guides.mjs): a new order, the Lindqvist wedding on the Mediterranean Spread; a sesame restriction for table 4; the tahini (contains) and a bakery focaccia (may contain) answered from their labels; View dish checks showing one conflict and one check; the confirm dialog; Checked at confirm. The screenshots corrected two labels (the restriction type is Allergy; the ingredient answers are Contains, May contain, Cross-contact, Free from, Not checked) and surfaced the green "No conflicts" line shown before anything is reviewed, which the guide now warns about. The "(from Lemon tahini dressing)" example was dropped; the conflict line names the ingredient.

**Revision, second review pass.** Second review pass (2026-10-11). Owner-caterer: the opening no longer clears the shawarma (real za'atar carries sesame; the demo blend does not); the fix for a conflict on a buffet is a separately plated meal, labelled for table 4, written in the Who note; Step 4 names the path (Pack > Review N ingredients); Guest restrictions does not hold Confirm back; the confirm dialog lists conflicts only. Humanize: "Here's how", the stacked fragments and the callback closer cut.

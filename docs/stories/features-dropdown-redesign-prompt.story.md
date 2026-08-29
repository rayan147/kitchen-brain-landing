# Story Tracker — Features dropdown redesign prompt

## My story

- **Piece:** Implementation prompt for a global marketing-navigation redesign
- **Title / headline:** Redesign the Features dropdown around the kitchen job
- **My hero's name:** The working chef-owner evaluating CostCook
- **Content file(s):** `docs/prompts/features-dropdown-redesign.prompt.md`

## The 11 steps

| # | Step | What you build | Done |
|---|------|----------------|------|
| 1 | The Idea | One sentence: WHO + WANT + WALL. | ☒ |
| 2 | Your Character | Hero's insides: want, need, wound, flaw. | ☒ |
| 3 | The Plot | 12 beats on the Save the Cat map. | ☒ |
| 4 | From Beats to Scenes | 12 beats → the 6–8 sections you will write. | ☒ |
| 5 | Character Voices | The reader's voice and the product's voice. | ☒ |
| 6 | Writing Dialogue | Each section turns a value, the McKee way. | ☒ |
| 7 | Sorkin Dialogue | Headline and subhead as intention vs obstacle. | ☒ |
| 8 | Cool Talk | One line of snap. | ☒ |
| 9 | Bringing a Scene to Life | Senses and setting for the key scene. | ☒ |
| 10 | Connecting Your Scenes | Hand-offs between sections; POV locked. | ☒ |
| 11 | Revise and Finish | Cut, sharpen, make the ending land. Done! | ☒ |

### Step 1 — The Idea

> A working chef-owner who wants to confirm that CostCook handles the next real kitchen job, but a dense feature inventory makes them translate product structure into their own week.

### Step 2 — Your Character

- **Want (surface):** Find the relevant capability without reading the entire product catalog.
- **Need (real):** Recognize their own job and arrive at evidence that CostCook handles it.
- **Wound (the bad day):** A quote, delivery, or prep shift went wrong because the current number or plan was hard to find and harder to trust.
- **Flaw (the habit):** Scanning feature names for familiar software terms instead of starting from the kitchen problem they need to solve.

### Step 3 — The Plot (12 beats)

| Beat | In this piece |
|------|---------------|
| 1 Opening Image — life before | The visitor opens a long list and starts translating internal feature categories into today’s kitchen problem. |
| 2 Theme Stated — the truth they'll learn | Navigation should begin with the job the visitor came to check. |
| 3 Set-Up — the daily grind, the flaw on display | Recipes, prices, orders, purchasing, and inventory appear as a catalog rather than a recognizable week. |
| 4 Catalyst — the bad day / the wall hits | The visitor needs one answer now: can this handle the quote, the price list, or the event? |
| 5 Debate — “can it be different?” | A mega-menu risks becoming another dense wall or a copied SaaS pattern. |
| 6 Break into Two — they try the new way | The Features trigger opens into two short job groups: build and price, then run the event. |
| 7 B Story — the person/relationship it's really about | The navigation respects the operator who is deciding between software and the next kitchen task. |
| 8 Fun and Games — the promise of the premise | Specific links carry the visitor straight to recipes, imports, orders, purchasing, inventory, or setup. |
| 9 Midpoint — first real win, with a number | Eight or fewer primary destinations replace the need to scan the complete shipped-feature inventory. |
| 10 Bad Guys Close In — the edge cases, the doubts | Phone width, keyboard use, no JavaScript, zoom, and in-development items test whether the shortcut remains honest. |
| 11 All Is Lost / Dark Night — the risk if nothing changes | The operator leaves because the product may do the job, but the navigation makes them prove it alone. |
| 12 Finale + Final Image — life after; the CTA in their words | The visitor picks the part of the week that matters and lands on a page that names it immediately. |

### Step 4 — From Beats to Scenes (7 sections)

| § | Section | Beats it carries | Value turn (− → +) |
|---|---------|------------------|--------------------|
| 1 | Outcome and reference boundary | 1–2 | competitor imitation → CostCook-specific purpose |
| 2 | Product and workflow context | 3–4 | feature catalog → recognizable kitchen problem |
| 3 | Information architecture | 5–6 | menu sprawl → two job groups |
| 4 | Destinations and handoff | 7–8 | vague category → exact next screen |
| 5 | Interaction and responsive behavior | 9–10 | fast desktop demo → dependable real use |
| 6 | Architecture, accessibility, and tests | 10 | attractive concept → production contract |
| 7 | Definition of done | 11–12 | uncertain capability → clear evidence and next action |

### Step 5 — Character Voices

- **Reader's words for the problem:** “What does a plate cost?”, “the new price list,” “shop, prep, and pack,” “what actually arrived,” “what is on the shelf,” and “the first costed order,” sourced from `src/lib/features.ts` and the current feature-route copy.
- **Product voice:** competent, calm, unfussy.
- **Banned words:** seamless, powerful, optimize.

### Step 6 — Dialogue (McKee): the turn in each section

1. Familiar competitor reference → explicit boundary against copying.
2. Product taxonomy → the operator’s real task.
3. Five broad areas → two scan-friendly job groups with specific entry points.
4. Click → matching destination and page identity.
5. Ideal pointer path → keyboard, touch, zoom, reduced-motion, and no-JavaScript reliability.
6. Visual direction → measurable acceptance criteria.
7. “Make it like Meez” → a distinct, verifiable CostCook result.

### Step 7 — Sorkin: headline / subhead

- **Intention:** Let the visitor find the part of CostCook that handles the job in front of them.
- **Obstacle:** The complete feature inventory is too deep for global navigation, while broad areas still require interpretation.
- **Headline:** Redesign the Features dropdown around the kitchen job.
- **Subhead:** Use Meez’s scan-friendly mega-menu structure, then improve it with CostCook’s workflow language, honest deep links, and a touch-first fallback.

### Step 8 — Cool Talk: the one snap line

> Copy the information shape, not the brand skin.

### Step 9 — Bringing a Scene to Life

- **Where they are:** At a prep table or desk, checking CostCook between quoting and running an event.
- **What they see / hear / feel:** A phone or laptop, a price list or menu nearby, and little patience for translating software categories.
- **Time of day:** The point in the week when a price, list, or plan needs an answer now.

### Step 10 — Connecting Your Scenes

- **POV:** Second person for visitor-facing copy; imperative voice for implementation instructions.
- **Hand-offs:** Reference → CostCook truth → workflow choice → destinations → interaction → proof → handoff. Each section narrows from aspiration to a testable contract.

### Step 11 — Revise and Finish

- **Word count before → after:** First-pass notes of roughly 2,900 words → final prompt kept under roughly 2,500 words while preserving acceptance criteria.
- **Claims removed because they couldn't be shown:** No conversion lift, time-saved figure, customer count, adoption claim, or competitor performance claim was added.
- **Final Image:** The visitor picks the part of the week that matters and lands on a page that names it immediately.

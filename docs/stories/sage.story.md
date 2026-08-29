# Story Tracker — Sage

## My story

- **Piece:** Sage across the site: homepage section, header menu item, `/features` group, `/compare` row, `/pricing` card, FAQ entry
- **Title / headline:** Ask your kitchen a question. See where the answer came from.
- **My hero's name:** The owner-caterer who has been burned by "AI" on a pricing page and wants to know what the thing actually reads, what it can touch, and whether it is real
- **Content file(s):** `src/lib/sage.ts`, `src/components/sections/Sage.astro`, `src/lib/features.ts` (assistant group, menu item), `src/lib/comparison.ts` (row note), `src/lib/faq.ts` (#sage)

## The 11 steps

| # | Step | What you build | Done |
|---|------|----------------|------|
| 1 | The Idea | One sentence: WHO + WANT + WALL. | ☒ |
| 2 | Your Character | Hero's insides: want, need, wound, flaw. | ☒ |
| 3 | The Plot | 12 beats on the Save the Cat map. | ☒ |
| 4 | From Beats to Scenes | 12 beats → the sections you will write. | ☒ |
| 5 | Character Voices | The reader's voice and the product's voice. | ☒ |
| 6 | Writing Dialogue | Each section turns a value, the McKee way. | ☒ |
| 7 | Sorkin Dialogue | Headline and subhead as intention vs obstacle. | ☒ |
| 8 | Cool Talk | One line of snap. | ☒ |
| 9 | Bringing a Scene to Life | Senses and setting for the key scene. | ☒ |
| 10 | Connecting Your Scenes | Hand-offs between sections; POV locked. | ☒ |
| 11 | Revise and Finish | Cut, sharpen, make the ending land. | ☒ |

### Step 1 — The Idea

> An owner-caterer wants to know, before Saturday, what is wrong with Saturday's order without opening five screens, but every assistant they have met either made numbers up or was a chat box bolted onto a sales page.

### Step 2 — Your Character

- **Want:** One question, one answer, from their own numbers, on a phone.
- **Need:** To see the source under every line, so they can stop trusting the sentence and check the record.
- **Wound:** A confident wrong number. Software that "learned their business" and acted on it.
- **Flaw:** Reads the badge, not the paragraph. Will assume "Coming" means never, and "AI" means made up.

### Step 3 — The Plot

| Beat | In this piece |
|------|---------------|
| 1 Opening Image | Saturday's order, and the reader does not know what is wrong with it yet. |
| 2 Theme Stated | See where the answer came from. |
| 3 Set-Up | Six questions a kitchen actually asks, listed as the reader would type them. |
| 4 Catalyst | A real answer, captured: cucumber, $24.00 to $33.00, 37.5 percent, two purchases, with the record linked. |
| 5 Debate | Is it real, and what can it touch? |
| 6 Break into Two | Five checks read; one drafts; a person approves. |
| 7 B Story | The founder's honesty rule: the status is the ledger's, not the owner's. |
| 8 Fun and Games | The six guardrails, each one a test in the app repo. |
| 9 Midpoint | "It never changes a record on its own." |
| 10 Bad Guys Close In | It is behind a flag. It is not in the app you would start today. |
| 11 All Is Lost | The badge says Coming. The flaw says "so, never." |
| 12 Finale + Final Image | The paragraph says it plainly, links to the feature list, hands off to the rival beat. |

### Step 4 — From Beats to Scenes

| § | Section | Beats | Value turn |
|---|---------|-------|------------|
| 1 | Eyebrow, badge, headline, lede | 1–2 | a chat box → a question with a source |
| 2 | Six abilities | 3 | "AI" → six named things |
| 3 | The capture | 4–5 | claim → a real answer with its record |
| 4 | What it will not do | 6–9 | fear of a confident wrong number → six enforced limits |
| 5 | Status paragraph | 10–12 | badge → sentence |
| 6 | Feature menu / compare / pricing / FAQ | — | the same status word, everywhere, from one file |

### Step 5 — Character Voices

- **Reader's words:** Saturday, what needs my attention, what came up short, which prices went up, the shopping list, my kitchen, the truck.
- **Product voice:** the app's own labels, verbatim: "Where this came from", "from your records / calculated / Sage's read / missing evidence", "it never changes anything on its own".
- **Banned:** any model or provider name; "learns your business"; "never invents a number"; "AI-powered"; exclamation points; em-dashes.

### Step 6 — Dialogue

- Abilities: each line is a question then the mechanism (which screen or ledger it reads, who may ask).
- Capture: told → shown, with the fixture named so the reader is not misled into thinking it is the wedding.
- Guardrails: each lead is a promise; each detail names the enforcement, not the intention.
- Status: the badge word and a full sentence, so a skimmer and a reader get the same fact.

### Step 7 — Sorkin

- **Intention:** Show a real assistant that can be checked.
- **Obstacle:** It is not shipped, and the page may not say it is.
- **Headline:** "Ask your kitchen a question. See where the answer came from." Subhead carries the boundary: the one thing it can prepare waits for you to approve it.

### Step 8 — Cool Talk

**"It never changes a record on its own."** The app's own hint line, and the sentence that separates this from every assistant the reader has been sold.

### Step 9 — Bringing a Scene to Life

Thursday night, phone in one hand, the walk-in door open with a foot. One question typed with a thumb: what needs my attention for Saturday. The answer is four lines and a link, not a paragraph.

### Step 10 — Connecting Your Scenes

- POV: second person. The app's labels quoted, never paraphrased.
- Hand-off: PaperIn (how prices get in) → Sage (what you can ask about them) → TheOtherTools (the category, where "an assistant" sits on the comparison as a Coming row). `stops.ts` carries the order.
- Same word everywhere: `SAGE_STATUS` in `src/lib/sage.ts` feeds the row, the group, the chip, the badge, the FAQ.

### Step 11 — Revise and Finish

- Cut: the model name (never allowed), "never invents a number" (softened per the app's ledger), a "coming in the fall" line (no date allowed), the per-record "Ask Sage about this order" idea (designed, not built).
- Every capability traces to one of six tools in `src/lib/server/sage/tools.ts` and `proposals.ts` at sandbox/demo e8b69fe4; every guardrail to a test file; RC-49 lists them.
- Ending: the status sentence, then the hand-off. When the deployed flag is confirmed, the word flips in one file and that paragraph is replaced, not softened.

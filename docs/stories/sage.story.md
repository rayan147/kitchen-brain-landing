# Story Tracker — Sage

## My story

- **Piece:** Sage across the site: homepage section, header menu item, `/features` group, `/compare` row, `/pricing`, FAQ entry
- **Title / headline:** Ask your kitchen a question. See where the answer came from.
- **My hero's name:** The owner-caterer who has been burned by a confident assistant and wants to know what Sage reads, what it can touch, and how to check it
- **Content file(s):** `src/lib/sage.ts`, `src/lib/comparison.ts`, `src/components/SageIcon.astro`, `src/components/ComparisonCapabilityLabel.astro`, `src/components/sections/Sage.astro`, `src/components/sections/SageFeature.astro`, `src/components/SiteNav.astro`, `src/components/sections/FeatureSection.astro`, `src/pages/compare.astro`, `src/components/sections/FaqPage.astro`, `src/components/sections/ProductTour.astro`

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

> An owner-caterer wants to know, before Saturday, what is wrong with Saturday's order without opening five screens, but every assistant they have met either hid its evidence or tried to replace their judgment.

### Step 2 — Your Character

- **Want:** One question, one answer, from their own numbers, on a phone.
- **Need:** To see the source under every line, so they can stop trusting the sentence and check the record.
- **Wound:** A confident wrong number. Software that "learned their business" and acted on it.
- **Flaw:** Reads the fluent answer before checking the record underneath it.

### Step 3 — The Plot

| Beat | In this piece |
|------|---------------|
| 1 Opening Image | Saturday's order, and the reader does not know what is wrong with it yet. |
| 2 Theme Stated | See where the answer came from. |
| 3 Set-Up | Questions a kitchen actually asks are grouped by shift, recipes, stock, buying and setup. |
| 4 Catalyst | A real answer, captured: cucumber, $24.00 to $33.00, 37.5 percent, two purchases, with the record linked. |
| 5 Debate | Is it real, and what can it touch? |
| 6 Break into Two | Eleven checks read; one shopping-list proposal waits for a person to approve it. |
| 7 B Story | The founder's honesty rule: the status is the ledger's, not the owner's. |
| 8 Fun and Games | The six guardrails, each one a test in the app repo. |
| 9 Midpoint | "It never changes a record on its own." |
| 10 Bad Guys Close In | Roles, missing evidence, limits and the approval boundary test whether the answer is safe to use. |
| 11 All Is Lost | A faster answer without evidence would only be a faster risk. |
| 12 Finale + Final Image | Available now is stated plainly, and the dedicated guide shows the complete path. |

### Step 4 — From Beats to Scenes

| § | Section | Beats | Value turn |
|---|---------|-------|------------|
| 1 | Eyebrow, badge, headline, lede | 1–2 | a chat box → a question with a source |
| 2 | Twelve bounded jobs | 3 | "AI" → eleven named checks and one reviewed proposal |
| 3 | The capture | 4–5 | claim → a real answer with its record |
| 4 | What it will not do | 6–9 | fear of a confident wrong number → six enforced limits |
| 5 | Availability paragraph | 10–12 | badge → sentence and guide |
| 6 | Feature menu / compare / pricing / FAQ | — | the same status word, everywhere, from one file |

### Step 5 — Character Voices

- **Reader's words:** Saturday, what needs my attention, what came up short, which prices went up, the shopping list, my kitchen, the truck.
- **Product voice:** the app's own labels, verbatim: "Where this came from", "from your records / calculated / Sage's read / missing evidence", "it never changes anything on its own".
- **Banned:** any model or provider name; "learns your business"; "never invents a number"; "AI-powered"; exclamation points; em-dashes.

### Step 6 — Dialogue

- Abilities: each line is a question then the mechanism (which screen or ledger it reads, who may ask).
- Capture: told → shown, with the fixture named so the reader is not misled into thinking it is the wedding.
- Guardrails: each lead is a promise; each detail names the enforcement, not the intention.
- Availability: the badge word and a full sentence, so a skimmer and a reader get the same fact.

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
- Hand-off: PaperIn (how prices get in) → Sage (what you can ask about them) → TheOtherTools (the wider category comparison). `stops.ts` carries the order.
- Same word everywhere: `SAGE_STATUS` in `src/lib/sage.ts` feeds the row, the group, the chip, the badge, the FAQ.

### Step 11 — Revise and Finish

- Cut: the model name, absolute accuracy claims, the per-record "Ask Sage about this order" idea and autonomous action language.
- Every capability traces to the eleven read tools and one approval-bound shopping proposal on sandbox/demo `99321170`; every guardrail to a test file; RC-49 lists them.
- Ending: the availability sentence links to the dedicated guide and video, then the homepage story hands off.

## Revision — one Sage mark across the site (2026-08-30)

### 1. Idea ☒

An owner-caterer wants to recognize the same checkable assistant wherever Sage appears, but a generic chat bubble makes it look like every other ungrounded chatbot.

### 2. Character ☒

- **Want:** Spot Sage quickly in the feature path.
- **Need:** Recognize that questions lead to inspectable evidence, not autonomous action.
- **Wound:** A fluent assistant answer with no visible source.
- **Flaw:** Treating every chat-shaped icon as the same promise.

### 3. Plot ☒

| Beat | Icon story |
|---|---|
| Opening Image | An undifferentiated chat bubble. |
| Theme Stated | The answer should show where it came from. |
| Set-Up | Sage appears in navigation, the homepage, feature guides, FAQ, comparison and tour. |
| Catalyst | The reader meets a question while the kitchen record is already in motion. |
| Debate | Is this another assistant that answers without evidence? |
| Break into Two | A sage leaf enters the conversation shape. |
| B Story | The kitchen worker, not the assistant, remains the decision-maker. |
| Fun and Games | Evidence lines resolve beside the leaf. |
| Midpoint | One compact mark now identifies Sage across every decision surface. |
| Bad Guys Close In | Small sizes, print, mobile and adjacent labels test whether the mark survives. |
| All Is Lost | A decorative AI sparkle would erase the product's evidence boundary. |
| Finale + Final Image | The same leaf-to-evidence mark leads to the sourced Sage answer. |

### 4. Scenes ☒

1. Feature navigation: generic assistant → named Sage mark.
2. Homepage: availability badge → recognizable Sage identity.
3. Specialist guide: breadcrumb → branded, available product.
4. Decision pages: comparison, FAQ and tour → the same assistant, not a new concept.

### 5. Voices ☒

- **Reader:** “Show me the record.”
- **Product:** calm, checkable, kitchen-specific.
- **Banned:** robot face, magic sparkle, autonomous-agent symbolism.

### 6. Dialogue ☒

Each placement turns recognition into context: question → source, feature name → evidence contract.

### 7. Sorkin ☒

- **Intention:** Recognize Sage at a glance.
- **Obstacle:** Generic assistant imagery says nothing about why Sage is safe to use.
- **Visual line:** A leaf-shaped question becomes visible evidence.

### 8. Snap ☒

The existing page snap remains the only one: **“It never changes a record on its own.”**

### 9. Scene ☒

On a phone between kitchen tasks, the 20-pixel mark must read before the dropdown description does; on the specialist page it can open up to 40 pixels without changing its stroke language.

### 10. Connection ☒

The same component follows Sage from the feature dropdown to the homepage, specialist guide, broad feature area, comparison, FAQ and guided tour. Visible adjacent text carries the accessible name; the mark stays silent.

### 11. Revision ☒

Cut the old generic chat-bubble symbol, rejected a robot face and sparkle, kept one color, three internal strokes and a printable outline. No capability sentence or claim changed.

## Claim correction · 2026-09-27 (Sage tools and drafts)

- [x] 11 Revision: Sage now has 22 read-only tools and 3 draft kinds (the kitchen shopping list, one order's shopping list, a guest-count change on a draft order); nothing changes until a manager or owner approves the draft. "Eleven checks", "one proposal" and "shopping-list proposal" were stale, and "proposal" now names the client document, so Sage's output is called a draft everywhere. Beats, point of view and snap line unchanged. Gap report S1, S10, W2; ledger RC-46, RC-49.

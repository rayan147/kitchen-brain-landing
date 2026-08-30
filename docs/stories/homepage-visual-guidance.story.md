# Story Tracker — Homepage visual guidance pass

## My story

- **Piece:** Homepage, 2026-08-29 visual-and-guidance revision (no new claims; new figures, hand-offs, and one phone-only bar)
- **Title / headline:** Cost it, buy it, prep it, pack it. Enter the numbers once. (unchanged)
- **My hero's name:** The chef-owner, including a restaurant owner between regular service and a special event, reading on a phone mid-shift
- **Content file(s):** `src/components/sections/Hero.astro`, `TheProblem.astro`, `WhoThisIsFor.astro`, `CustomerOutcomes.astro`, `TheOtherTools.astro`, `src/components/SectionHandoff.astro`, `src/components/StickyCta.astro`, `src/lib/stops.ts`

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

> A chef-owner with changing event work wants to decide in under a minute whether this is real and aimed at that part of the kitchen, but labels like restaurant or caterer can hide the work they actually share.

### Step 2 — Your Character

- **Want:** See the thing, not read about it. Know in one thumb-scroll whether to keep going.
- **Need:** Evidence they can check against their own week (their numbers, their sheets, their Saturday).
- **Wound:** Sales funnels that promised a demo and delivered a pitch. Screens of copy with a mockup at the end.
- **Flaw:** Skims. Reads headings and pictures, skips paragraphs, leaves at the first blank screen.

### Step 3 — The Plot

The beats are the existing page's (STORY-SPINE-2026-08-27.md). This pass changes what each beat SHOWS, not what it says.

| Beat | In this piece |
|------|---------------|
| 1 Opening Image | The fold: the chain named, and now the product's pricing panel under the ask (Hero figure). |
| 2 Theme Stated | "Enter the numbers once." (unchanged) |
| 3 Set-Up | The four moments of the week, now dealt onto the counter as four tickets beside the diagnosis (TheProblem). |
| 4 Catalyst | Who the event-driven work is for, beside the product's real limits, in one frame (WhoThisIsFor). |
| 5 Debate | Is this real? The film. (unchanged) |
| 6 Break into Two | Four answers, each with the frame of the film that proves it (CustomerOutcomes). |
| 7 B Story | The yield. (unchanged) |
| 8 Fun and Games | Paper in. (unchanged) |
| 9 Bad Guys Close In | The other tools: the two calendars beside the lede rather than under it (TheOtherTools). |
| 10 All Is Lost | What you give up. (unchanged) |
| 11 Finale | Who made it. (unchanged) |
| 12 Final Image | Put one real order through it. (unchanged) |

### Step 4 — From Beats to Scenes

| § | Section | Beats | Value turn | What changed |
|---|---------|-------|------------|--------------|
| 1 | Hero | 1–2 | "software" → "that panel, for my order" | Pricing-panel crop straddling the fold |
| 2 | TheProblem | 3 | my week → my week, named | Ticket stack in the empty right column; provenance cut to two sentences |
| 3 | WhoThisIsFor | 4 | does my restaurant label exclude me → no, and here are the real limits | Limits ticket in the right column |
| 4 | SeeItRun | 5 | claim → footage | Hand-off only |
| 5 | CustomerOutcomes | 6 | four sentences → four frames | 2x2 crops with timestamps |
| 6–8 | TheYield, PaperIn, TheOtherTools | 7–10 | — | Hand-offs; calendars beside the lede |
| 9 | BuiltForKitchens | 11 | — | Hand-off |
| 10 | StartHere | 12 | — | Unchanged; the phone bar hides here |

### Step 5 — Character Voices

- **Reader's words:** the sheet, the case, the count, the truck, the invoice, Saturday, a head.
- **Product voice (new lines only):** mono micro-labels, the brand's one device: `ORDER · 180 GUESTS · $68 A HEAD`, `FROM THE TOUR · 0:29`, `NEXT · SEE IT RUN`, `LIMITS · THREE REQUIREMENTS`.
- **Banned:** seamless, powerful, in one click, exclamation points, em-dashes.

### Step 6 — Dialogue

- Hero figure: doubt (is there a product?) → evidence (there is, and it is already arguing about my price).
- TheProblem tickets: a list → a stack of paper on a counter, which is what the reader's problem physically is.
- WhoThisIsFor ticket: a business-type label → the work that fits and the requirements that do not.
- Outcome crops: told → shown, each with the second in the film it was cut from.
- Hand-offs: "am I done?" → "no, the next one is called this, and it is that way."

### Step 7 — Sorkin

- **Intention:** Show the reader the product before they have to trust a sentence about it.
- **Obstacle:** The truth pass. Nothing may be shown that the app does not ship, so every picture is a frame of the footage the ledger already vouches for (RC-48).
- **Headline:** unchanged. **New subhead (hero figcaption):** "The pricing panel from the tour below. Food cost against the target, and the price that would have met it, before the quote goes out."

### Step 8 — Cool Talk

The one snap line on the page, in the hero crop itself and named by its caption: **"Charge at least $89.78 per guest to meet the 30% target."** It is a real number from a real order and could not be about any other product. Nothing else added in this pass tries to be quotable.

### Step 9 — Bringing a Scene to Life

The key scene is the fold on a phone, one thumb in, screen dimmed by a walk-in light. What lands there now is a boxed line in amber on paper: charge at least $89.78 a head. The reader has been that number's wrong side.

### Step 10 — Connecting Your Scenes

- POV: second person throughout (unchanged). The founder's first-person line in TheProblem stays as testimony inside a "you" page, as before.
- Hand-offs: every section now ends with `NEXT · <the next eyebrow> ↓`, looked up from `src/lib/stops.ts` so the words on the arrow are the words on arrival. The hero keeps its own hand-off (the tour link). The close hands off to nothing.

### Step 11 — Revise and Finish

- Cut: TheProblem's provenance paragraph from four sentences to two (the full block still lives in BuiltForKitchens); TheOtherTools's "so the question" paragraph merged into the lede column, "and several do it well" dropped.
- Nothing claimed that was not already on the ledger. RC-48 added for the frame rule, not for a capability.
- Ending unchanged: the CTA is the Final Image and the phone bar carries the same words to it.
- Positioning correction: restaurant owners who cater, run special dinners, or build changing menus are explicitly included; only unsupported requirements remain in the limits ticket.

---

# Revision — “What it does instead” becomes one guided order

## My story

- **Piece:** The homepage CustomerOutcomes section, revised as a visual handoff guide
- **Title / headline:** What it does instead: keeps one order moving.
- **My hero's name:** The chef-owner checking whether the product replaces the four copies they rebuild for every changed event
- **Content file(s):** `src/components/sections/CustomerOutcomes.astro`

## The 11 steps

| # | Step | What changed | Done |
|---|------|--------------|------|
| 1 | The Idea | A chef-owner wants one event to carry from quote through costing, but every operational handoff restarts from a copied sheet. | ☒ |
| 2 | Your Character | The reader wants a plan the kitchen can run, needs each handoff to preserve the last decision, remembers a short delivery discovered too late, and copes by rebuilding from the last job. | ☒ |
| 3 | The Plot | The old copied handoffs become one order moving through Quote → Plan → Buy → Cost again. | ☒ |
| 4 | From Beats to Scenes | Four equal cards become four connected scenes with one value turn and one proof screen each. | ☒ |
| 5 | Character Voices | Reader: old price, guest count, whole packs, what we paid. Product: calm, exact, kitchen-literate. Banned: seamless, automatic, effortless. | ☒ |
| 6 | Writing Dialogue | Each scene turns a broken handoff into the record that replaces it: old price→checked cost, rebuilt lists→one count, copied emails→supplier packs, filed invoice→future cost. | ☒ |
| 7 | Sorkin Dialogue | Intention: keep the order moving. Obstacle: each step currently starts again. Headline and lede put those forces in the same sentence. | ☒ |
| 8 | Cool Talk | The page keeps its existing snap line, “Charge at least $89.78 per guest to meet the 30% target”; this section adds no competing flourish. | ☒ |
| 9 | Bringing a Scene to Life | The reader is between the office and prep table, following the order down the page as the count changes and the truck arrives. | ☒ |
| 10 | Connecting Your Scenes | Second-person point of view stays locked; the route key previews the order, the vertical rail preserves sequence, and the closing loop hands the paid price back to the next quote. | ☒ |
| 11 | Revise and Finish | Replaced repeated card scaffolds and generic numbering with a readable path, larger proof frames, explicit before/instead handoffs, and one closing loop. No capability claim was added. | ☒ |

## Beat map

| Beat | In this section |
|------|-----------------|
| Opening image | Four disconnected sheets have to be rebuilt. |
| Theme stated | One order should keep moving. |
| Set-up | An old price, four rebuilt lists, copied emails, and a filed invoice. |
| Catalyst | The quote is checked against the current food cost. |
| Debate | Will the next screen still use the same decision? |
| Break into two | The guest count carries into the plan. |
| B story | The crew gets one plan rather than the owner's reconstruction. |
| Fun and games | Whole packs group by supplier and the real delivery is recorded. |
| Midpoint | The product screens show each handoff rather than asking for trust. |
| Bad guys close in | Short, over, substituted, and missing deliveries stay visible. |
| All is lost | File the paid price away and the next quote starts old again. |
| Finale / final image | The paid price returns to future costing while the confirmed event stays frozen. |

## Scene map

| § | Scene | Beats | Value turn |
|---|-------|-------|------------|
| 1 | Route key | Opening, theme, set-up | disconnected copies → one visible path |
| 2 | Quote | Catalyst | old supplier price → checked cost |
| 3 | Plan | Debate, break into two, B story | four rebuilt lists → one guest count carried through |
| 4 | Buy | Fun and games, midpoint | copied email → whole packs by supplier |
| 5 | Cost again | Bad guys, all is lost | filed invoice → paid price in future costing |
| 6 | Loop close | Finale | finished event → a truer starting point for the next quote |

## Revision record

- **Word count:** 116 visible explanatory words before → 169 after; the extra words are compact input/output labels that replace inference rather than add a new paragraph.
- **Claims removed because they could not be shown:** none added; automatic purchasing, automatic supplier synchronization, guaranteed savings, and changed confirmed-event pricing remain excluded.
- **Final image:** “The next quote starts with what you paid.”
- 2026-08-30: the fold's audience line and the trust section's "Built for event production" now name restaurants too ("restaurants that cater"; "catering, meal-prep, and restaurant kitchens that plan work from menus and guest counts"). Both had still said caterers and meal-prep only, so the Opening Image excluded the reader the Who scene later welcomed. RC-01 amended; the claim guard pins both lines.

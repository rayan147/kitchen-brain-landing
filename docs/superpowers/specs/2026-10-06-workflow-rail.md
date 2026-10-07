# New pattern: Workflow rail (2026-10-06)

Status: built 2026-10-06 (owner chose the recommendation: rail replaces the tabs and the tickets; rings measured from the PNGs). Replaces rule 4 (stage tabs) and the separate
"How it fits together" ticket strip if the owner approves.

## Problem

The homepage has to show that the steps of one event are connected: what the
client accepted is what gets paid, and what gets paid is what the kitchen buys
and preps. The current pattern hides that:

- `HomeEventWalk` tabs show one stage at a time, so the reader never sees two
  stages together and has to remember what carried over.
- `HomeFlow` tickets show that the stages are connected, but with no data in
  them, so it reads as a claim, not proof.

## Existing patterns

| Related | What it shares | Why it is not enough |
|---|---|---|
| `HomeEventWalk` (tabs) | the five stages, their frames, no-JS stacking | one stage at a time; the connection is hidden |
| `HomeFlow` (tickets) | the whole loop at a glance | no frames, no figures, nothing carried |
| `SectionHandoff` | a "next" line between bands | links bands, not steps; no data |
| `HomeKitchen` rows | eyebrow, heading, sentence, frame | rows are independent, not a sequence |

## Proposed design: `HomeWorkflowRail`

One band. A vertical rail with a node per step on every width; on desktop the
step's copy sits left of the rail and the frame sits right. Between two steps,
a **carry line** on the rail names what passes forward, in the app's words and
with the figure that is visible in both frames.

```
 ● 01 Inquiry           [inquiry-mobile]
 │  carries: Priya Nair · 150 guests
 ● 02 Proposal          [proposal-mobile]
 │  carries: $14,250.00 accepted
 ● 03 Deposit           [payment-schedule]
 │  carries: $3,500.00 paid · $10,750.00 due Dec 28
 ● 04 Confirm order     [confirm-dialog]
 │  carries: the same menu, quantities locked
 ● 05 Shop / Prep       [prep-list]
```

### Data (in `src/lib/home.ts`, extending `eventStages`)

| Property | Type | Default | Description |
|---|---|---|---|
| `id` | string | required | stage id, also `data-event-stage` (check-dist pins the order) |
| `tab` → `label` | string | required | step name, the app's word |
| `heading`, `body`, `shot`, `guide` | as today | required | unchanged |
| `carries` | string \| undefined | undefined | the carry line to the NEXT step; the last step has none |
| `shot.focus` | `{ x, y, w, h }` in % \| undefined | undefined | the carried figure's box in the frame, drawn as a marker over the real image (never edits the PNG) |

### Variants

| Variant | Use when | Visual |
|---|---|---|
| `rail` (default) | the event walk on the homepage | vertical rail, nodes, carry lines, frames beside (desktop) or under (phone) |
| `compact` | a feature guide that walks part of the flow | rail and carry lines only, no frames |

### States

| State | Behavior | Notes |
|---|---|---|
| Default (no JS) | every step, carry line and frame renders, in order | nothing hidden; replaces the tabs' JS dependency |
| In view | the node of the step in view fills green-deep; earlier nodes stay filled | IntersectionObserver, `data-reveal` register; transform/opacity only |
| Reduced motion | nodes render filled, no transition | `prefers-reduced-motion` |
| Focus marker | an outline ring on `shot.focus`, label = the carried figure | `aria-hidden`; the figure is already in the alt text and the carry line |

### Tokens used

- **Colors:** rail `--color-hairline-strong`; node idle `--color-paper` with a
  `--color-green-deep` ring, node done `--color-green-deep`; carry line text
  `--color-amber-deep` (4.85:1 on softamber, 5.45:1 on cream, see
  `HomeBand.astro`); focus marker `--color-amber` (decoration only, never text).
- **Spacing:** steps `--spacing-section-tight` apart; band `--spacing-section`.
- **Type:** the four homepage sizes only: `--text-h2` step heading,
  `--text-body-lg` sentence, `--text-eyebrow` step number, carry line, marker
  label.
- **Elevation:** frames `--shadow-lift` (rule 6); the rail and nodes are flat.
- **Radius:** frames 8px; nodes round.

### Accessibility

- **Role:** an `<ol>` of steps; each step is an `<li>` with its `h3`. The carry
  line is a `<p>` inside the step it leaves ("Carries forward: …"), so it is
  read in order. No ARIA widget, so there is nothing to operate.
- **Keyboard:** nothing to operate; the guide links are ordinary links.
- **Screen reader:** "list, 5 items. 01 Inquiry, heading level 3 … Carries
  forward: Priya Nair, 150 guests." The rail and nodes are decorative
  (`aria-hidden`).

### Do and don't

| Do | Don't |
|---|---|
| carry a figure that is visible in both neighbouring frames | carry a figure only one frame shows |
| use the app's words (Accept proposal, Confirm order) | invent stage names |
| mark the real screenshot with an overlay | edit the PNG to highlight anything |
| keep one wedding and one set of numbers end to end | mix worlds (the test kitchen's 9.8% next to the hero's 28.4%) |

## Audit findings to fix with it

- Fixed 2026-10-06: `.home-shot` and the close's `.plan` used a hard-coded
  shadow; both read `--shadow-lift` now.
- The inquiry frame (local run, date not decided) and the payments and Sage
  frames (test, Dec 28) are one wedding from two copies of the app; the carry
  lines must only name figures they share (150 guests, $14,250.00, $3,500.00,
  $10,750.00), never the date.

## Open questions

- Owner: drop rule 4 (tabs) for the rail? The page grows by roughly four
  frames on a phone, still well under the old 18,500px.
- Keep `HomeFlow` as a one-line legend above the rail, or retire it?
- The `focus` boxes need measuring per frame (one Playwright pass reading the
  carried figure's box); worth it, or carry lines alone?

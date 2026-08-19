---
target: CostCook landing homepage
total_score: 17
max_score: 24
na_heuristics: 5,7,9,10
p0_count: 0
p1_count: 3
timestamp: 2026-08-19T17-18-50Z
slug: src-pages-index-astro
---
# CostCook homepage critique

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of system status | 3/4 | The tour and booking actions are clear. |
| 2 | Match with the real world | 3/4 | Strong kitchen language, but some internal product vocabulary. |
| 3 | User control and freedom | 3/4 | Clear choices, but no fast summary after the problem. |
| 4 | Consistency and standards | 4/4 | Strong, coherent visual and interaction system. |
| 5 | Error prevention | n/a | No meaningful form or destructive action. |
| 6 | Recognition rather than recall | 2/4 | Too many connected concepts must be remembered. |
| 7 | Flexibility and efficiency | n/a | Not applicable to this persuasion surface. |
| 8 | Aesthetic and minimalist design | 2/4 | Visually restrained but narratively over-complete. |
| 9 | Error recovery | n/a | No recoverable task flow on this page. |
| 10 | Help and documentation | n/a | Not required for this conversion task. |
| **Total** | | **17/24** | **Good craft, diluted persuasion** |

## Design Specificity Verdict

The page feels authored for CostCook: real product captures, exact numbers, chef vocabulary, receipt-like details, and a calm editorial visual system. It is not generic SaaS. Its structural weakness is that the homepage becomes a long feature tour rather than organizing the story around the buyer's most painful kitchen moment.

The scoped detector found no CLI issues in the homepage or its imported sections. Browser inspection at 1440x900 and 390x844 found no horizontal overflow or page exceptions. The page contains 12 sections and measures about 10,601 px on desktop and 12,323 px on mobile. The explicit problem is below the first viewport on both. The live detector produced eight markers; most were false positives from intentional eyebrow styling and list geometry, with a few minor line-length signals.

## Overall Impression

The page accurately explains the product, but better to a product analyst than to a time-poor chef-owner. A committed reader will understand the system well. A five-second visitor may understand "catering costing software" without feeling the urgent relief: no more rebuilding the costing, shopping, prep, and pack math every time a price or guest count changes.

## What's Working

- The hero is specific about the audience and outputs.
- Real product proof and exact figures create unusual credibility.
- The demo offer is low-risk: one real menu or order, 15 minutes, no generic sales deck.

## Priority Issues

### P1: The costly problem arrives too late

The strongest problem statement appears after the hero and eight-node core-loop rail. It names stale sheets but softens the consequences: an underpriced event, midnight rework, the wrong number of cases, or a shortage before service.

Fix: open with one lived catering failure, then state the product promise.

### P1: Automation is demonstrated but not stated plainly

The page says CostCook "carries" prices through the system, but never gives the blunt synthesis: enter the menu and guest count once; CostCook automatically does the scaling, costing, buying, prep, and packing math.

Fix: put that sentence near the hero.

### P1: The homepage proves too much at the wrong resolution

The core loop, costing chain, setup, catalog model, Shop/Prep/Pack, purchasing loop, cost definitions, and 96-feature bridge are accurate, but collectively delay the buyer's conclusion.

Fix: organize the homepage around three outcomes: quote profitably; change a guest count once and update the kitchen plan; record what arrived so the next quote stays current. Move deep completeness to `/features`.

### P2: Mechanism language outruns outcome language

Terms such as supplier evidence, costing chain, live consumers, and theoretical cost are truthful but make buyers translate the benefit themselves.

Fix: lead sections with the human consequence, then explain the mechanism.

### P2: Audience language may be too broad

"Small kitchen teams" can attract conventional restaurant buyers even though the product is built around catering and meal-prep event workflows, not POS or public ordering.

Fix: use "catering and event kitchens" or state the boundary directly.

## Persona Red Flags

- A first-time chef-owner may infer heavy setup after meeting eight domain nodes before the main pain.
- A spreadsheet-weary caterer sees their real anxieties distributed across many sections rather than resolved in one before/after story.
- A kitchen lead on a phone must scroll a very long page before seeing the complete operational value of Shop, Prep, and Pack.

## Minor Observations

- The hero image proves price drift, not the broader buy/prep/pack promise.
- "Nothing to install" is weaker reassurance than "start with an existing menu or supplier sheet."
- "96 specific things" signals complexity more than value.
- The founder-chef credibility is strong enough to appear earlier.

## Questions to Consider

- Is the sharper lead problem stale supplier prices, or quoting a large event wrong before knowing it?
- Is the real hero the costing chain, or never rebuilding four sheets after the guest count changes?
- Would one order shown across quote, kitchen, and receiving sell better than teaching the domain model?

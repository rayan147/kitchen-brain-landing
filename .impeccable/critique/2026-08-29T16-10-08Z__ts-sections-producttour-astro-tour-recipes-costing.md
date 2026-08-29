---
target: "http://127.0.0.1:4321/tour/main#tour-recipes-costing"
total_score: 26
max_score: 36
na_heuristics: 9
p0_count: 0
p1_count: 2
timestamp: 2026-08-29T16-10-08Z
slug: ts-sections-producttour-astro-tour-recipes-costing
---
# Product tour — Recipes & food costing

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of system status | 3 | Active stop and progress are clear. |
| 2 | Match system / real world | 4 | Kitchen language and the connected-event model feel authentic. |
| 3 | User control and freedom | 3 | Select, rail, previous, and next work; deep-link positioning does not. |
| 4 | Consistency and standards | 3 | Interaction patterns are coherent; local visual values drift from documented tokens. |
| 5 | Error prevention | 1 | The seeded chicken arithmetic contradicts itself. |
| 6 | Recognition rather than recall | 3 | Metrics, table, and cost path are co-located. |
| 7 | Flexibility and efficiency | 3 | Direct stop selection and sequential navigation are both available. |
| 8 | Aesthetic and minimalist design | 3 | Strong composition, but workspace text is over-compressed. |
| 9 | Error recovery | n/a | No data-entry or failure workflow exists on this persuasive surface. |
| 10 | Help and documentation | 3 | The coach explains why the stop matters and links to the full feature. |
| **Total** | | **26/36** | **Good** |

## Design Specificity Verdict

The event ticket, Juniper & Stone workspace, kitchen vocabulary, and traceable cost path feel authored for CostCook rather than borrowed from a generic SaaS tour. The main trust failure is not visual: the example math does not reconcile. The detector returned 69 advisories in `ProductTour.astro`: 32 undocumented colors, 32 off-ramp font sizes, and 5 radii. Most color/radius values plausibly belong to the deliberately denser in-product mock, but the font findings corroborate the rendered readability problem.

## Overall Impression

The stop tells the right story in the right order: recipe identity, outcome metrics, ingredient evidence, cost path, then operating consequence. Its biggest opportunity is to make the proof as trustworthy and readable as the framing.

## What's Working

- The seeded wedding persists across the hero and workspace, so the tour feels connected rather than like 11 unrelated screenshots.
- Desktop navigation exposes every stop while mobile replaces the rail with a conventional labelled select.
- Progress, active state, previous/next controls, semantic tables, and a feature-detail exit give the frame a clear scan and action path.

## Priority Issues

### [P1] The recipe arithmetic contradicts itself

**Why it matters:** At `$6.76 / kg`, `7.8 kg` of chicken costs about `$52.73`, not `$109.42`. The displayed `$109.42` line does reconcile with the `$4.56` plate share across 24 portions, so the quantity or unit-cost story is wrong. A costing product cannot use proof that fails inspection.

**Fix:** Choose the intended operational facts, recompute every dependent value, and add an invariant test covering line sum, batch cost, per-portion cost, and usable-cost math.

**Suggested command:** `$impeccable harden`

### [P1] Mobile hides the evidence the stop is meant to prove

**Why it matters:** The ingredient table is fixed at `38rem`; at 390 px, only Ingredient and Used are visible. Usable yield and Cost sit behind an unmarked horizontal swipe. Much of the workspace is also 9.8–12.3 px, making a dense product proof feel like a scaled-down desktop screenshot.

**Fix:** Replace the mobile table with stacked ingredient rows or a priority layout that keeps Ingredient, Yield, and Cost visible; raise supporting type to a documented readable floor.

**Suggested command:** `$impeccable adapt`

### [P2] The stop URL does not land on the selected stop

**Why it matters:** `/tour/main#tour-recipes-costing` selects Recipes & food costing but opens at the hero. The visitor must scroll roughly a viewport to discover the requested frame, so the URL is stateful without behaving like a deep link.

**Fix:** Give stop hashes real scroll targets or scroll the workspace into view after initial hash selection, with sticky-header offset and reduced-motion handling. Assert both selected state and viewport position.

**Suggested command:** `$impeccable harden`

### [P2] Reduced-motion handling misses the final handoff

**Why it matters:** The progress transition is disabled, but `Finish the tour` always calls smooth scrolling. Motion-sensitive users still receive the largest movement on the page.

**Fix:** Use instant scrolling when `prefers-reduced-motion: reduce` matches, and cover that branch in browser verification.

**Suggested command:** `$impeccable animate`

## Persona Red Flags

**Morgan, chef-owner checking the number:** The chicken line cannot be reconciled from quantity, yield, and unit cost. Trust breaks at the exact moment the tour promises inspectable arithmetic.

**Jordan, first-time mobile visitor:** The select and metrics are clear, but the table silently withholds the two decision columns and uses unusually small text. Jordan may conclude the product itself is cramped.

**Alex, keyboard/screen-reader user:** The tab pattern and global focus ring are solid. The selected panel is not focusable, however, and the direct hash does not move visual context to it, weakening orientation after state changes.

## Minor Observations

- The browser verifier checks active deep-link state but not scroll position or seeded arithmetic, which is why both high-impact failures pass.
- `aria-label` on the generic `.app-user` div has no dependable semantic role; either make it decorative or give it an appropriate role.
- The embedded app palette and radii are defensible, but the volume of local literals should be documented as a tour-specific surface system if retained.

## Questions to Consider

- Is the tour primarily a faithful product preview or an explanatory marketing model? The mobile layout currently tries to be both.
- Should a shared stop URL open directly on the workspace, or is seeing the wedding context first more important than precise linking?
- Which chicken fact is authoritative: 7.8 kg, $6.76/kg, or $4.56 per plate?

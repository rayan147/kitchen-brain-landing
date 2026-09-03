---
target: /features/nutrition-facts-and-allergens
total_score: 31
max_score: 36
na_heuristics: 7
p0_count: 0
p1_count: 2
timestamp: 2026-08-29T15-12-23Z
slug: ents-sections-nutritionfactsallergensfeature-astro
---
# Nutrition facts & allergens review

Method: dual-agent (A: order_design_review · B: order_detector_review)

## Design-specificity verdict

Highly product-specific. The 297 g Chicken Burrito Bowl, complete Nutrition Facts panel, USDA FoodData Central source, milk and soy evidence, incomplete-state language, and browser-printable sheet could not be transferred unchanged to generic software. The specialist route is the right hybrid for a low-frequency, high-information, safety-sensitive decision; no route or workflow restructuring is needed.

## Heuristic score

| # | Heuristic | Score | Key finding |
|---|---|---:|---|
| 1 | Visibility of system status | 4 | Complete, incomplete, source, reviewed-allergen, and calculated-estimate states are explicit. |
| 2 | Match with the real world | 4 | Portions, labels, supplier evidence, and Sunday-night meal prep are specific and natural. |
| 3 | User control and freedom | 3 | Chapter links, proof links, disclosures, and onward paths are strong; hero decisions were initially below the first viewport. |
| 4 | Consistency and standards | 3 | Strong visual system with route-local type and CTA drift before remediation. |
| 5 | Error prevention | 4 | Missing values stay missing, incomplete review stays visible, and regulatory limits are unusually clear. |
| 6 | Recognition rather than recall | 4 | Evidence and caveats stay adjacent to their claims. |
| 7 | Flexibility and efficiency | n/a | Persuasion surface, not a repeated operational task. |
| 8 | Aesthetic and minimalist design | 2 | The authentic composition was strong, but the duplicated macro panel crowded the decision frame. |
| 9 | Error recognition and recovery | 3 | Missing evidence is diagnosed and preserved, though recovery is explained rather than interactive. |
| 10 | Help and documentation | 4 | Contextual proof links, boundaries, disclosures, and six focused FAQs are comprehensive. |
| **Total** | | **31/36** | **Good; core story is strong.** |

## Technical evidence

- Detector: 17 advisory `design-system-font-size` findings before remediation. The shared display, H2, and H3 roles were genuine drift; small proof-label values were lower-impact exceptions.
- Desktop and 390 px mobile: no horizontal overflow, console errors, warnings, failed requests, duplicate IDs, or heading skips.
- 320 px at 200% text: 60 visible nodes escaped a 320 px viewport and the article reached 435 px while `overflow: clip` made the lost content unreachable.
- Reduced motion passed. The first no-JavaScript attempt timed out; the finished browser contract now verifies the server-rendered content with script execution disabled.

## Priority issues

1. **P1 — 320 px/200% text was clipped.** `overflow: clip` concealed widespread reflow failures. The finished page uses resilient wrapping, min-width recovery, and a browser contract that rejects every viewport escape.
2. **P1 — Both decisions and authentic proof fell below the mobile first viewport.** The hand-built macro panel duplicated the capture and consumed the decision frame. It was removed; shared type and tighter hero rhythm now keep both CTAs and the proof opening in view.
3. **P2 — The hero and major headings used a route-local type ramp.** The page now maps display, H2, and H3 roles to shared semantic tokens while retaining justified micro-label values in the proof motif.
4. **P2 — Proof links repeated an ambiguous label.** Each link now names the evidence it opens.
5. **P2 — Demo CTA copy and launch context drifted from adjacent routes.** Both demo actions use the centralized label, and the start decision now shows the 15-day trial, monthly price, and $0-today boundary.

## Pattern decision

The structural force is fixed editorial proof, capability selection, and a stable route contract. Strategy was considered and correctly refused because no algorithm or behavior is selected at runtime.

Questions skipped: the user explicitly asked to complete the same fix-all-and-merge workflow used for the preceding routes.

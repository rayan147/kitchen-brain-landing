---
target: "http://127.0.0.1:4321/features/team-and-access"
total_score: 22
max_score: 28
na_heuristics: 7,9,10
p0_count: 0
p1_count: 3
timestamp: 2026-08-29T16-35-59Z
slug: src-components-sections-teamaccessfeature-astro
---
# Team & Access critique

## Design health

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of status | 3 | Location and disclosures are clear; CTA outcome is not explained in-frame. |
| 2 | Match with the real world | 4 | Concrete kitchen roles and sensitive actions are excellent. |
| 3 | User control and freedom | 3 | Good exits and deep links; the first conversion ask arrives before the decisive limit. |
| 4 | Consistency and standards | 2 | Route-local type and undersized peripheral links drift from the feature family. |
| 5 | Error prevention | 4 | The page explicitly prevents overreading the access model. |
| 6 | Recognition over recall | 4 | Boundaries and unsupported cases remain visible. |
| 7 | Flexibility and efficiency | n/a | Persuasion/read surface, not an operational workflow. |
| 8 | Aesthetic and minimalist design | 2 | Memorable hero, but repeated role facts and oversized type dilute the comparison. |
| 9 | Error recovery | n/a | No transactional error state exists on this route. |
| 10 | Help and documentation | n/a | The route itself is the product guidance. |
| **Total** |  | **22/28** | **Good, with one verified accessibility failure** |

## Design-specificity verdict

This feels authored for CostCook, not interchangeable SaaS. The stacked staff passes, paper/ticket language, warm palette, serif/sans pairing, and candid permission limits are excellent. The existing normalized route is the right shape; no route or workflow restructuring is needed.

The detector returned 13 findings: 10 verified type-ramp deviations, two low-confidence system/documentation exceptions, and one false-positive rounded-card warning. Browser evidence uncovered the more serious issue the static scan could not: at 320px with 200% text, headings and CTAs extend past the viewport and are clipped by `overflow: clip`.

## Overall impression

The visual concept is stronger than the information architecture. The same access contract repeats across passes, facts, the ledger, the limit ticket, and FAQ, while the ledger styles permissions, inheritance, shared access, and prohibitions as equivalent facts.

## What works

- The route states that Staff can open cost screens, custom roles do not exist, and enforcement happens on the server.
- The stacked-pass hero is memorable, specific, and responsive below 800px.
- Five standard viewports have no visible overflow; hero CTAs fit; focus, Space-to-open FAQ, reduced motion, and no-JavaScript reading order pass.

## Priority issues

1. **P1 — 320px/200% text clips headings and controls.** Correct grid/min-width behavior, move local clamps to shared roles, and remove overflow masking.
2. **P1 — The decisive Staff limitation arrives after the first conversion ask.** Make the boundary action task-primary or surface cost visibility beside the hero actions.
3. **P1 — The role ledger mixes semantic categories.** Use one consistently phrased role contract or separate Can, Inherits/shared, and Cannot bypass.
4. **P2 — Navigation and typography drift from the feature family.** Use shared display, breadcrumb, and onward roles; add boundary-anchor scroll margin.
5. **P2 — The limitation creates an emotional dead end.** Add an honest consultation/not-a-fit next step without inventing a workaround.

## Persona red flags

- **First-time buyer:** cannot answer “Exactly what can my cook do?” from one consistent comparison.
- **Stress tester:** will question whether Manager inherits Staff access and what the shared workspace includes.
- **Distracted mobile visitor:** sees conversion actions before the high-risk cost-visibility answer.

## Minor observations

- Current location lacks `aria-current="page"`.
- The 768px header wraps into two rows but remains usable.
- Touch-action, tap-highlight policy, and boundary-anchor scroll margin are absent.
- Story Tracker records a target rather than the rendered 502-word article.
- Vercel Title Case guidance conflicts with CostCook sentence-case voice and is treated as policy tension, not a defect.

## Questions

- Should the route optimize first for conversion or access-risk resolution?
- What honest next step should follow a fine-grained-permissions disqualifier?
- Is the role model inheritance or shared baseline access plus protected actions?

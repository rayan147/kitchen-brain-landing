---
target: /features/purchasing-and-receiving
total_score: 28
max_score: 36
na_heuristics: 7
p0_count: 0
p1_count: 3
timestamp: 2026-08-29T14-45-27Z
slug: mponents-sections-purchasingreceivingfeature-astro
---
# Purchasing & receiving review

## Design-specificity verdict

Strongly product-specific. The sent PO, back-door count, short-case follow-up, receiving checklist, posting boundary, and amber variance vocabulary make this unmistakably catering software. No route or workflow restructuring is needed: the current denormalized persuasion sequence—commitment, discrepancy, receiving, posting, recovery, diligence, CTA—is appropriate.

## Heuristic score

| # | Heuristic | Score | Key finding |
|---|---|---:|---|
| 1 | Visibility of system status | 3 | The quantities and shortfall are clear, but the combined hero record remains labeled only “Sent.” |
| 2 | Match with the real world | 3 | Excellent back-door language; “diligence read” and “all-or-nothing posting” drift internal. |
| 3 | User control and freedom | 3 | Navigation and disclosures are clear; demo new-tab behavior is not visibly disclosed. |
| 4 | Consistency and standards | 3 | Strong visual system, but CTA labels, type roles, and inert control styling drift. |
| 5 | Error prevention | 3 | Recovery is honest; the substitute and received-price decision are not inspectable. |
| 6 | Recognition rather than recall | 3 | PO identity repeats well, but the posted price appears without visible provenance. |
| 7 | Flexibility and efficiency | n/a | Persuasion surface, not a repeated operational task. |
| 8 | Aesthetic and minimalist design | 3 | Calm and focused; the default-open capability list creates the main density break. |
| 9 | Error recognition and recovery | 4 | Each important failure preserves the problem and names the next action. |
| 10 | Help and documentation | 3 | Practical FAQ, though more evidence should be visible before it. |
| **Total** | | **28/36** | **Good; core story is sound, release-quality gaps remain.** |

## Technical audit score

| Dimension | Score | Key finding |
|---|---:|---|
| Accessibility | 2/4 | 320px at 200% text clips content; demo visible/accessibility labels drift. |
| Performance | 3/4 | Lean page, but blur is used in first-load motion. |
| Theming | 3/4 | Color tokens are coherent; the component owns a parallel type ramp. |
| Responsive | 2/4 | Normal desktop/mobile pass; text-stress reflow fails materially. |
| Implementation integrity | 2/4 | Product-specific system, with 16 detector advisories and several route-family inconsistencies. |
| **Total** | **12/20** | **Acceptable** |

## Overall impression

This is a persuasive, kitchen-literate page with an unusually complete send → receive → post → recover story. The biggest opportunity is to make its claimed financial truth fully inspectable while closing the accessibility and shared-system gaps that the normal screenshots hide.

## What is working

- The first viewport passes at 1440×900 and 390×844: both CTAs and the complete 10 → 9 → 1 evidence remain visible.
- “Ten cases ordered. Nine at the back door is not ten in the walk-in” turns the abstract variance problem into a memorable kitchen consequence.
- Recovery is excellent: send failure, shortage, and unexpected-line states each retain a direct next action.
- Semantics, keyboard order, focus indicators, reduced motion, no-JavaScript rendering, normal-width overflow, console, and network health all pass.

## Priority issues

1. **P1 — 320px/200% text reflow is clipped.** The article uses `overflow: clip`; at text stress the page remains 320px wide while its content reaches 421px, leaving at least 60 visible descendants outside the viewport. The received stage, PO sheet, receiving header, and recovery copy lose up to 101px with no recovery path. Remove clipping as a correctness mechanism and stack/shrink the affected grids and flex rows. This fails WCAG 2.2 1.4.10. Suggested command: `$impeccable adapt`.

2. **P1 — The financial write boundary is asserted, not inspectable.** The page promises to post the price that arrived, but the receiving board shows no ordered or received price; `$423.00` and `$47.00 / case` then appear only after posting. Show received unit price before commitment, preferably `Ordered $45/case → received $47/case`, and carry the exact value into the posted record. Suggested command: `$impeccable clarify`.

3. **P1 — Demo CTA visible and accessible names do not match.** Both visible labels say “Book 15 minutes,” while the shared accessible label is “Book a 15-min demo (opens in a new tab).” The visible phrase is not contained in the accessible name, creating speech-input ambiguity under WCAG 2.5.3. Render the centralized visible label in both places and visibly disclose the new-tab behavior if retained. Suggested command: `$impeccable harden`.

4. **P2 — The example screen blurs state and interactivity.** The hero record contains received/follow-up facts while its only top-level status says “Sent,” and `Email supplier`, `Print PO`, and `Handled by me` look like 50px buttons despite being inert `<strong>` elements. Separate PO status from receiving outcome, and style the handoff choices unmistakably as static example rows or clearly frame the scene as noninteractive. Suggested command: `$impeccable clarify`.

5. **P2 — Progressive disclosure and shared roles have drifted.** The capability `<details>` opens all nine entries by default; “diligence read” is internal language; breadcrumb/onward links are only 20–21px tall; the component creates a route-local type ramp with 16 detector advisories; and the first-load proof uses blur. Collapse the catalogue by default, use buyer language, apply the shared quiet-link target, map type to semantic tokens, and retain only opacity/transform motion. Suggested commands: `$impeccable distill`, `$impeccable typeset`, then `$impeccable polish`.

## Persona red flags

- **Jordan, first-time buyer:** may read the hero’s `Sent` badge as contradicting its received data, mistake the three bordered example choices for live controls, and distrust a posted price that was never shown at receiving.
- **Casey, distracted mobile visitor:** gets an excellent first viewport at normal text size, but the long default-open capability section and delicate micro-labels slow a one-handed scan; at 200% text, important content is physically clipped.
- **Riley, stress tester:** will ask which substitute and received price were approved, and will notice the unexplained jump from quantity-only receiving to `$47/case` after posting.

## Minor observations

- The H1 exceeds the documented shared display ceiling, even though it fits at normal viewports.
- The early handoff animation starts at 35% opacity with blur, temporarily obscuring the central proof.
- Breadcrumb and closing onward links have visible focus but miss the project’s 44px hit-area convention.
- The structural force is static editorial evidence and FAQ data. Strategy was correctly considered and refused; there is no runtime-swappable behavior to abstract.

## Questions to consider

- Should the fix pass add the missing received-price provenance, or preserve the current evidence model and limit scope to accessibility/consistency?
- Should illustrative controls read like a real product screenshot or like a clearly static production ticket?
- Should the complete nine-capability list stay available but collapsed, matching the adjacent order/shop/prep/pack page?

---
target: Order Shop Prep Pack feature page
total_score: 27
max_score: 36
na_heuristics: 7
p0_count: 0
p1_count: 3
timestamp: 2026-08-29T14-09-53Z
slug: src-pages-features-order-shop-prep-pack-astro
---
## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of System Status | 4 | Confirmed, 12/12, 7/7, 7/8, and “Not packed” make source, progress, and exception immediately legible. |
| 2 | Match System / Real World | 3 | Hotel pans, aisles, shelf checks, and the loading door are exact; “diligence read” and implementation vocabulary break the kitchen voice. |
| 3 | User Control and Freedom | 3 | Breadcrumbs, story anchors, native disclosures, and two clear exits work; new-tab behavior is not visibly disclosed. |
| 4 | Consistency and Standards | 3 | The Kitchen Ticket system is coherent, but this route forks the shared type ramp and CTA wording. |
| 5 | Error Prevention | 3 | Illustrative values and changed/aged/incomplete states are honest; Start lacks adjacent price/trial context. |
| 6 | Recognition Rather Than Recall | 3 | Source and stage context stay together; the 21-item open catalogue becomes scanning work. |
| 7 | Flexibility and Efficiency | n/a | Persuade surface with no repeated operational task. |
| 8 | Aesthetic and Minimalist Design | 2 | Strong composition is weakened by a clipped desktop decision path and an overexposed capability wall. |
| 9 | Error Recovery | 3 | Changed, aged, and incomplete states each name a distinct next action. |
| 10 | Help and Documentation | 3 | The FAQ answers real diligence questions; capability detail is useful but overexposed. |
| **Total** | | **27/36** | **Good foundation; three finish-contract blockers.** |

Severity used here: P1 blocks the documented finish contract or accessibility; P2 materially hurts comprehension, conversion, or consistency; P3 is bounded polish. No P0 issue was found.

## Design Specificity Verdict

Strongly product-specific. The production ticket, visible buy arithmetic, confirmed event source, separate Shop/Prep/Pack progress, and unresolved hotel pan could not be transferred unchanged to generic SaaS. This feels built for catering operations.

The problem is discipline, not identity. The route-local hero scale, default-open capability catalogue, and internal vocabulary weaken an otherwise excellent production-packet story.

The current route shape is correct. This is a low-risk inspect-and-decide workflow whose source, progress, exception, and recovery evidence benefit from remaining on one denormalized page. No child route, wizard, tab, modal, carousel, or workflow restructuring is needed.

**Deterministic scan:** the route wrapper passed cleanly. The primary component produced 16 `design-system-font-size` advisories at `OrderShopPrepPackFeature.astro:159-180`, `:188`, `:199`, `:229`, `:263-275`. Most are compact evidence roles, but the hero clamps are genuine drift tied to the first-viewport and text-reflow failures.

**Browser evidence:** fresh Chromium passes covered 1440×900, 1280×800, 390×844, 320×844 at 200% text, reduced motion, no JavaScript, keyboard focus, accessibility semantics, console, and network. Overlay injection succeeded in an isolated browser capture and was removed afterward; no user-visible overlay remains.

## Overall Impression

This is one of the site’s most convincing feature stories. The first ticket explains the proposition without a dashboard mockup, and the missing pan creates a credible emotional wound. The biggest opportunity is to protect that story from its own diligence material: fit the full decision path in the first desktop viewport, stop clipping low-vision text, and let the 21-item inventory stay collapsed until requested.

## What’s Working

- The hero ticket combines event identity, stage sequence, completion counts, and the unresolved hotel pan in one exact piece of evidence.
- “8 hotel pans prepped; 7 in the van” turns synchronization into a consequence a caterer can feel.
- Recovery is proof rather than reassurance: plan changed, aged plan, and pack still open preserve valid work and name the next action.
- Normal mobile is excellent: both actions, the full ticket, Pack 7/8, and the open line fit inside 390×844 without horizontal overflow.
- Reduced-motion and no-JavaScript paths pass; native disclosures, heading order, landmarks, keyboard order, and visible focus are sound.

## Priority Issues

### P1 — 200% text is clipped, not reflowed

**What:** At 320px with the root font doubled, `.orders-page` remains 320px wide but contains 390px of content while `overflow: clip` hides the extra 70px. Thirty-eight visible descendants extend outside the viewport, including the hero, confirmed state, source record, and recovery rows.

**Why it matters:** Low-vision readers lose words and state evidence with no horizontal recovery. This fails the surface brief and WCAG reflow intent.

**Fix:** Remove page-level clipping as a correctness mechanism; add `min-width: 0` at the actual grid/flex seams; let ticket-head/state content wrap; stack recovery labels and content under text stress; verify 320px at 200% without horizontal scrolling.

**Suggested command:** `$impeccable adapt`

### P1 — Desktop hero hides the bottom of both next actions

**What:** At 1440×900, hero actions run from roughly y=868 to y=924, leaving their lower 24px outside the first viewport. The 5rem local H1 and large vertical register cause the miss.

**Why it matters:** The ticket proves the feature, but the decision path is clipped on a common desktop viewport, directly contradicting the surface brief.

**Fix:** Return the H1 to the documented display scale (about the shared 3.75rem ceiling), then rebalance hero padding/column spacing so both 56px actions end above y=900 alongside the complete ticket.

**Suggested command:** `$impeccable layout`

### P1 — The capability disclosure defeats progressive disclosure

**What:** `<details open>` exposes all 21 capabilities. It occupies about 20% of the desktop document and 27% of mobile, creating the page’s emotional valley after the recovery proof.

**Why it matters:** The visitor moves from a clear operational story into a long catalogue, making the page slower to persuade and harder to use as diligence material.

**Fix:** Remove `open`. Keep the count and concise summary visible, and reveal the full shipped list on request. Group into 3–4 task clusters only if the open state still scans poorly.

**Suggested command:** `$impeccable distill`

### P2 — Secondary actions and quiet links are inconsistent

**What:** The visible label “Book 15 minutes” differs from the centralized “Book a 15-min demo” and its accessible new-tab label. The breadcrumb and “See every CostCook feature” links render as 20–21px-high text targets rather than the surface’s 44px standalone target.

**Why it matters:** The demo outcome is less obvious, visible/accessibility copy drift weakens trust, and two route-owned touch targets are unnecessarily unforgiving.

**Fix:** Render `{demoCta.label}` in both locations, visibly disclose external behavior only if needed, and apply the established quiet-link hit-area treatment to the breadcrumb and onward link.

**Suggested command:** `$impeccable harden`

### P2 — The route owns a parallel type scale

**What:** Sixteen literal sizes sit outside `DESIGN.md`; the hero, lede, operational labels, figures, and mobile overrides can drift independently from sibling routes. Tiny `.7rem` labels are especially delicate in the stated kitchen context.

**Why it matters:** Shared typography fixes will not reach this page, and the largest overrides already correlate with the desktop and 200% failures.

**Fix:** Map headline, lede, body, and label text to documented semantic roles. Add one documented micro-label role only if evidence labels genuinely need it; preserve hierarchy rather than blindly making every size identical.

**Suggested command:** `$impeccable typeset`

## Web Interface Guidelines Findings

### `src/components/sections/OrderShopPrepPackFeature.astro`

- `:156` — `overflow: clip` masks 320px/200% reflow failure; fix overflowing children instead.
- `:57`, `:151` — standalone navigation links miss the route’s 44px target contract.
- `:62`, `:150` — visible demo label differs from centralized accessible/outcome label.
- `:161-162`, `:263-266` — local hero type ramp causes first-viewport and text-stress failures.
- `:297-303` — handoff animates `filter: blur()`; keep the authored sequence to transform/opacity.

## Persona Red Flags

**Jordan, first-time caterer:** The ticket teaches the promise quickly, but “frozen event plan” arrives before its benefit. On desktop Jordan sees clipped hero actions and may miss the focused demo route. “Diligence read” sounds like internal product language.

**Casey, distracted mobile visitor:** Normal mobile is strong and the first viewport works. At 200% text, however, important content is clipped. Later, the 21-item capability wall creates a 2,300px interruption and the smallest labels demand too much attention mid-shift.

**Riley, deliberate stress tester:** Illustrative labels and recovery states build trust. Riley will notice the visible/accessible CTA mismatch and may question implementation-led language such as “durable checks stay on the server” when the page’s evidence is otherwise framed in kitchen consequences.

## Minor Observations

- Cognitive load is moderate: chunking, minimal choices, and progressive disclosure fail; the other five checks pass.
- Desktop header exposes seven destinations/actions, while mobile stays within four.
- The FAQ has five sibling questions, slightly above the four-item working-memory guideline, but native disclosure keeps this low risk.
- Route motion is bounded and reduced motion fully disables it; removing blur would preserve the idea with less visual latency.
- Local production preview returns one expected `/_vercel/insights/script.js` 404; no route Runtime exception or `console.error` appeared. Verify analytics only in deployment context.
- Images are code-native HTML/CSS/SVG with explicit dimensions; there is no route image CLS or lazy-loading defect.

## Questions to Consider

- Should the page optimize first for a 90-second buying decision or for a procurement checklist? The current open catalogue tries to do both.
- Should “frozen” remain the core term, or should its benefit be defined once before the word repeats?
- Does Start CostCook need one adjacent line of trial/price context, or should that commitment remain intentionally deferred to Pricing?

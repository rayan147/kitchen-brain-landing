<!-- story: docs/stories/homepage-caterer-fixes.story.md -->
# Caterer landing-page fixes — 2026-09-11

Implemented the eleven findings from the first-visit review. The routes and product behavior are unchanged; the homepage now leads with readable event costing and preparation, followed by one connected proof sequence and optional detail.

| Finding | Delivered change |
| --- | --- |
| F01 Setup effort late | First-dish effort appears before the hero CTA; the full upload/review/correct explanation and cancellation route appear within two phone viewports. The detailed setup and final trial ticket remain available. |
| F02 Ambiguous return loop | The opening names recipes, current prices, guest count and the lists produced. Approved prices feeding later quotes is explained in the event sequence. |
| F03 Unconditional target price | $89.78 is explicitly conditional on the example's 30% food-cost target. Inputs, percentage and food-only exclusions remain together. |
| F04 Unreadable mobile proof | The quote check is readable HTML rather than text baked into a scaled image. Original product screenshots remain inspectable, with full-size links. The event's proof precedes the optional full film. |
| F05 Demo versus booking | “Book a demo” is visible at every width and the accessible name begins with the same words. Watching the recording remains a distinct action. |
| F06 Repetition and length | Retired the duplicate hero loop, placed the event sequence before the film, condensed before/after treatments, made written tour optional on desktop too, and folded supplementary stories and capability details. |
| F07 Internal jargon | Replaced staged-facts, implementation-detail and recipe-lifecycle wording; Sage presents records, a proposal and approval, with examples and limits available on request. |
| F08 Launch teammate ambiguity | Hero links to explicit launch terms. Pricing, FAQ and team copy share one statement: unlimited teammates during launch; post-launch teammate limits have not been announced. No permanent entitlement was invented. |
| F09 Roadmap count | Names labels, par replenishment and Spanish without the obsolete “other three” sentence. Coming labels remain. |
| F10 Unexplained yield percentage | Removed the isolated 12% from the short equation; the original detailed screenshot remains available for inspection. |
| F11 Example provenance | The hero and tour identify a sample wedding in the working product. |

## Evidence

Settled screenshots and measurements came from a static preview of the built site, avoiding development-toolbar artifacts. Browser context: Chromium, reduced motion, the six widths below. The existing Docker development preview was not stopped or modified.

| Viewport | Page height | First proof y | Preparation y | Overflow |
| --- | ---: | ---: | ---: | ---: |
| 1440×900 | 12,387px | 140px | 712px | 0 |
| 1280×800 | 12,306px | 140px | 709px | 0 |
| 1024×768 | 12,016px | 140px | 710px | 0 |
| 768×1024 | 13,983px | 573px | 1,049px | 0 |
| 390×844 | 15,658px | 719px | 1,304px | 0 |
| 320×844 | 16,471px | 763px | 1,368px | 0 |

At 390px, default reading height fell from 23,617px to 15,658px: **33.7% shorter**. Full preparation moved from approximately y=20,783 to y=1,304, with a shorter preparation sentence before the first CTA. At desktop, height fell from 20,556px to 12,387px: **39.7% shorter**. Optional content remains reachable, so these are default-reading measurements, not totals with every disclosure open.

- [Phone opening](after-390.png)
- [Desktop opening](after-1440.png)
- [Phone optional features](after-390-more.png)
- [Desktop event proof](after-1440-outcomes.png)
- [Six-viewport verification](verification.json)

## Validation

- `npm run check`: passed; zero errors, two pre-existing unused-variable hints in unrelated scripts.
- `npm run build`: passed, including all 42 static pages and the full postbuild page-contract suite.
- `COSTCOOK_QA_URL=http://127.0.0.1:4341 npm run verify:homepage`: passed six viewports, touch targets, contained navigation, sticky CTA, 200% text at 320/390, reduced motion and no-JavaScript content.
- `COSTCOOK_QA_URL=http://127.0.0.1:4341 node scripts/verify-caterer-decision.mjs`: passed six viewports, early proof and setup, booking labels, launch destination, optional guide, open/closed state across resize, nested disclosure access, and native no-JavaScript disclosure use.
- Impeccable detector on hero, shared disclosure, event proof and optional-feature shell: no findings.
- `git diff --check`: passed.

Regression checks now assert the approved composition, concrete early-decision content, and semantic before/after labels. The obsolete duplicate-loop and minimum-twelve-sections checks were replaced; product claims and detailed proof contracts remain enforced. Native disclosure accessibility replaces the old open-by-default, breakpoint-controlled behavior.

The future teammate policy remains a business decision. The implemented copy exposes the currently unspecified boundary rather than promising perpetual unlimited access. This work does not change billing or establish a new entitlement. No deployment or app changes were performed.

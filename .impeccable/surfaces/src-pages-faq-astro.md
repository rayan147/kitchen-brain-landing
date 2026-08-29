---
version: 1
slug: "src-pages-faq-astro"
primary_target: "src/pages/faq.astro"
related_targets: ["src/components/sections/FaqPage.astro", "src/lib/faq.ts", "docs/stories/faq.story.md"]
---

# FAQ surface brief

## Thesis

The FAQ should reveal the catch before asking for trust. Lead with the trial, card, first charge, and cancellation path, then keep every answer open and directly linkable; refuse the generic accordion wall, search box that fails without JavaScript, and feature-card catalogue.

## Audience and job

The reader is an owner-caterer evaluating CostCook between kitchen work and customer decisions. They need to check cost, fit, workflow mechanics, limits, and who answers before they hand over a card or book time with Rayan.

## Workflow shape

This is a low-frequency, low-risk, information-dense read-and-decide workflow. Keep one bookmarkable route with four ordered reading frames: money, fit, work, and getting started. Use direct group and question anchors. Keep all 31 answers expanded so browser find, deep links, assistive technology, and no-JavaScript visitors receive the same content. No child routes, tabs, modal, search dependency, wizard, or accordion restructuring is needed.

## Direction

Extend the CostCook Kitchen Ticket world as a founder's answer sheet. The first viewport is an editorial split: the reader's suspicion and the page promise on the left, a compact before-you-start decision ticket on the right. Below it, a plain question-path map opens into four ruled answer chapters with sticky chapter context on wide screens. Answer counts belong in the map and are not repeated as chapter-count eyebrows. The forty-guest answer is the single snap moment. The closing action returns the reader to one real order.

## Content and constraints

The canonical content and claim citations live in `src/lib/faq.ts`; the story lives in `docs/stories/faq.story.md`. Do not invent guarantees, dates, testimonials, response times, savings, margins, integrations, or product behavior. Preserve FAQ structured data, stable question anchors, the claim guard, and the direct `FAQ` navigation destination.

## Motion and responsive behavior

The decision ticket settling into the first viewport is the sole route-specific motion owner. Remove it for reduced motion. At narrow widths, stack the editorial split, keep the four decision facts legible, retain 44-pixel action targets, and prevent horizontal scrolling at 320 pixels with 200% text zoom.

## Finish contract

The route is finished when the four hard answers are visible immediately; all 31 claim-backed answers and anchors remain present; the page works with JavaScript disabled; structured data stays complete; active navigation, keyboard focus, deep links, desktop, mobile, 200% text, and reduced-motion checks pass; and chapter headings do not repeat the answer counts already carried by the question-path map. The independent finish reviewer disposition is **ship** after removing the repeated chapter-count eyebrows, with no material fixes remaining.

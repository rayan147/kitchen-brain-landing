---
version: 1
slug: "src-pages-who-its-for-astro"
primary_target: "src/pages/who-its-for.astro"
related_targets: ["src/components/sections/WhoItsForPage.astro", "docs/stories/who-its-for.story.md"]
---

# Who it's for surface brief

## Thesis

The work decides whether CostCook fits, not the sign out front. Explain one shared planning pattern—menu, date, and guest count—across catering, meal prep, special dinners, and restaurants that run event-driven work; refuse a persona-card grid that turns business labels back into gates.

## Audience and job

An owner-chef is deciding whether CostCook belongs in the mix of work their kitchen actually runs. They need to recognize their operating pattern, understand what moves together, and see the real product limits before they start.

## Workflow shape

This is an occasional, low-risk, moderately explanatory read-and-decide workflow. Keep one bookmarkable route with six ordered frames and direct anchors. No child routes, modal, wizard, accordion, or ARIA tab restructuring is needed. “Who it's for” is a conventional shared-navigation destination, not an in-page tabs widget.

## Direction

Extend the CostCook Kitchen Ticket world. The first viewport pairs the direct work-based answer with a single physical planning ticket: recurring restaurant service beside a dated private dinner in the same kitchen. Below it, use ruled editorial sections and a connected operating line rather than a grid of equal feature cards. The service ticket settling into place is the sole route-specific motion owner. The snap line is: “The same kitchen can run Tuesday service and Saturday's private dinner.”

## Content and constraints

The story lives in `docs/stories/who-its-for.story.md`. Claims rest on RC-01, RC-03, RC-21, RC-22, RC-24, RC-25, RC-26, RC-30, and RC-44. Do not imply CostCook runs POS, table service, labor and overhead margin, every restaurant workflow, multiple-site inventory, FSMA 204 lot tracking, or fine-grained screen permissions.

## Motion and responsive behavior

The paired service ticket settles once from an already-visible default and becomes static under reduced motion. At narrow widths the two service halves stack in reading order, all actions remain at least 44 pixels, content reflows at 320 pixels and 200% text, and no horizontal scrolling appears.

## Built ground truth

The shipped route adds “Who it's for” to shared navigation and gives the destination its active state. The first viewport pairs the work-first headline with one service ticket that holds Tuesday regular service beside Saturday's private dinner. The remaining read carries four fit signals, a connected four-step path from menu and guests through purchases and cost, three actual product limits, and a closing real-menu action. The service ticket is the only route-specific motion owner; the finish fix removed all six inherited `data-reveal` hooks so the other frames remain immediately available without JavaScript or scroll-triggered entrance effects.

Desktop, responsive-header, mobile, keyboard, reduced-motion, JavaScript-off, and 320-pixel/200%-text checks passed. The emitted direction contract survived the production build, the four fit signals and four work steps stayed complete, the three limits remained visible, active navigation resolved correctly, every route action retained a 44-pixel minimum target, and the tested viewports had no horizontal overflow.

## Finish contract

The route is finished when the shared navigation exposes it; the first viewport answers fit within seconds; restaurant owners, caterers, meal prep operators, special-dinner kitchens, and changing-menu work are explicit; the three real limits remain plain; JavaScript-off and reduced-motion behavior retain all content; desktop, mobile, keyboard, 200% text, active-navigation, and build-contract checks pass; and the independent finish review and documentation pass are closed. The independent finish reviewer disposition is **ship** after one fix removed the six inherited `data-reveal` hooks, with no material fixes remaining.

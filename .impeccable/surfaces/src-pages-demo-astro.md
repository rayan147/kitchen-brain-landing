---
version: 1
slug: "src-pages-demo-astro"
primary_target: "src/pages/demo.astro"
related_targets:
  [
    "src/components/sections/DemoRequest.astro",
    "docs/stories/request-demo.story.md",
  ]
---

# Request a demo surface brief

## Thesis

One real kitchen job leads the demo. Refuse the generic SaaS lead form and feature parade: let the visitor name the work, prepare a visible founder-direct handoff, choose a 15-minute time, and retain self-serve exits without surrendering control of the message.

## Audience and job

A chef-owner, catering operator, or kitchen lead is deciding whether CostCook fits work already in front of them. They need to tell Rayan what should go on screen, understand what the short working session will cover, and choose a time without being told that the static site sent or received anything it cannot prove.

## Workflow shape

This is an occasional, medium-complexity, low-reversibility-cost request workflow with meaningful personal-data and truth-state risk. Keep one bookmarkable `/demo` route and normalize the request into three focused frames inside one ticket: Kitchen context, named contact, and prepared email/calendar handoff. Back navigation preserves entered work, native validation blocks incomplete required fields, and the Product tour / Start CostCook exits remain available below the agenda. No child route, modal, generic CRM form, feature carousel, or further workflow restructuring is needed.

## Direction

Preserve the Kitchen Ticket world: an off-white counter, one paper request ticket, green actions, amber rules, Fraunces decision type, and Instrument Sans working details. The first viewport pairs the direct promise and connected three-step demo path with the request ticket. The page stays asymmetrical and work-led rather than becoming a feature catalogue or a stack of floating form cards.

## Content and truth boundary

The story source is `docs/stories/request-demo.story.md`. Ask only for context that makes the working session useful. Do not promise a response time, qualification result, customer outcome, or successful transmission from the site. The browser prepares a `mailto:` message for Rayan; the visitor reviews and sends it in their own email app. The prepared state must keep saying that CostCook has not claimed the request was sent.

## Built ground truth

- **First viewport:** The headline `Put one real job on the screen.` and snap line `Bring the menu you would otherwise price twice.` lead into a visible Name the work → See it connected → Decide with the work visible path. Beside it, the paper ticket starts on `Kitchen` and identifies the session as `15 minutes · with Rayan`.
- **Frame 1 — Kitchen:** Business name, role, kitchen type, and location count are required. The optional workflow note asks what should be put through CostCook and accepts up to 600 characters. `Continue to your details` validates this frame before advancing.
- **Frame 2 — You:** First name, last name, and work email are required; phone is optional. Copy explains that the browser will prepare an email for review. A persistent safety note warns against passwords, payment-card details, and other sensitive information. `Back to kitchen` restores the first frame with its values intact.
- **Frame 3 — Time:** Valid submission builds a visible visitor-owned email handoff with the person's details, business context, and requested workflow, moves focus to `Your request is ready to send.`, and opens the email app. The primary next action opens Rayan's owner-supplied calendar in a safe new tab; direct email remains available as recovery.
- **Truth state:** The completed frame says the request is ready to send and explicitly states that CostCook has not claimed it was sent. Sending occurs only when the visitor sends the prepared email.
- **Agenda:** The next section bounds the working session into three five-minute parts: put in the brought work, follow the connected cost/workflow, then review setup, limits, and fit.
- **Alternate exits:** `Take the product tour` preserves a self-serve evaluation path and `Start CostCook` preserves the direct start path for visitors who do not want a call.

## Interaction, accessibility, and resilience

The progress labels use `aria-current="step"` and the progress wrapper announces changes politely. Fieldsets and legends preserve the two input groups, every control has a visible label, native validity is reported at the first invalid field, and scripted transitions move focus to the next frame or back to the restored first field. Fields are at least 48 pixels high and route actions retain 44-pixel minimum targets.

At 64rem and wider, the first viewport becomes a two-column editorial split and the request ticket stays visible with a modest sticky offset. At 48rem, fields and the agenda use two-column layouts where space permits. Below 30rem, form, prepared-state, and alternate actions stack full width. Without JavaScript, both input fieldsets remain open in source order and the form retains a direct `mailto:` action plus explicit fallback guidance. Reduced motion removes inherited entrance motion and the route remains understandable without animation.

## Verification and finish contract

Static build coverage enforces the page identity, story pointer, three frames, seven required fields, owner-supplied recipient, calendar handoff, site-wide `/demo` destination, truth-state copy, agenda, and self-serve recovery. Browser coverage validates empty-step blocking, Kitchen → You → Kitchen → You → Time transitions, prepared-state visibility, focus-oriented progression, and the retained mailto fallback.

Verification covers 1440×900, 1280×800, 1024×768, 768×1024, 390×844, and 320-pixel width at 200% text. It checks no page overflow, the ticket appearing within the mobile first viewport, usable form width, 44-pixel controls, reduced motion, JavaScript-off availability, direction-contract emission, and console/network health.

The independent finish reviewer disposition is **ship**, with no material fixes remaining. The surface is finished when the documentation boundary is recorded without changing the approved artifact.

## Surface boundary

The Kitchen / You / Time labels, exact fields, `mailto:` subject and body, sticky ticket behavior, three five-minute agenda rows, and Product tour / Start CostCook exits belong to `/demo`. The durable global rule is narrower: a static contact or demo workflow may prepare a visitor-owned email, but it must keep the handoff inspectable and must never promote `ready to send` into `sent`, `received`, or `confirmed` without proof.

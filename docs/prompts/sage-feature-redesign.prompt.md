# Redesign prompt — Sage

<!-- story: docs/stories/sage-feature.story.md -->

Redesign `/features/sage` as CostCook's specialist Sage feature page. Sage is available now and is part of the product, including an `Ask Sage` entry during setup. Treat the chef-owner as the hero: they want a faster answer, but they will not surrender judgment to a fluent sentence they cannot check.

Use the existing CostCook Kitchen Ticket world: warm cream paper, deep ink, working green, restrained amber, Fraunces editorial statements, Instrument Sans operational copy, square records, fine rules and authentic product captures. Avoid glossy AI conventions, purple gradients, robots, floating chat bubbles, card grids, fake metrics and invented product screens.

Build an asymmetrical first viewport around the headline “Ask your kitchen. Check the answer.” Show `Available now` clearly. Use the authentic Sage answer capture as the dominant evidence sheet and the authentic setup capture as the smaller starting point. The first viewport must make three facts obvious: Sage reads CostCook records, every answer exposes its sources, and prepared work waits for a person.

Include a wide, responsive, native-control video section titled “Watch Sage at work.” The video must use only authentic CostCook captures, carry persistent readable captions, avoid autoplay, work in MP4 and WebM, and show this sequence: Ask Sage during setup → setup-aware questions and Back to setup → an answer with “Where this came from” → the shopping-list approval boundary. Supply a static poster and a concise text transcript beside or below the player.

After the video, explain onboarding assistance as a concrete loop: setup progress saves, Sage offers questions fitted to the stage and records entered so far, and `Back to setup` returns to the unfinished stage. Then present exactly six supported jobs: attention summary, orders on a date, recipe cost explanation, ingredient price moves for managers/owners, receiving follow-ups, and a shopping-list draft for a manager/owner to approve.

Show the authentic cucumber answer as proof, including $24.00 to $33.00, 37.5 percent, two purchases and its linked source. Clearly label the capture and figures as sandbox fixture evidence if that remains the provenance of the asset.

Explain trust as behavior, not adjectives: source links come from checks that ran; kitchen scope comes from the signed-in session; role-restricted price data remains restricted; missing evidence is named; five tools read; one prepares a draft; approval rechecks the underlying records; limits and a kill switch keep the rest of CostCook available.

Add six FAQs covering availability, setup, what Sage can answer, whether it changes records, what happens when evidence is missing, and who can see prices or approve a draft. Close with a start action and a 15-minute demo action. Keep the single snap line “A missing number is an answer, too.”

Use semantic HTML, visible keyboard focus, 44-pixel standalone targets, reduced-motion support, no horizontal overflow, responsive image selection, a transcript for the silent video, and disclosures that remain useful without client-side JavaScript. Route the shared Sage feature-menu item to `/features/sage`, and keep availability sourced from `src/lib/sage.ts` so the homepage, pricing, comparison, FAQ and specialist page cannot drift.

Considered Strategy; not used because the specialist route, editorial selections and video chapters are fixed build-time content, not interchangeable runtime algorithms.

# Story Tracker — Team & Access

## My story

- **Piece:** Team and access specialist feature page
- **Title / headline:** Three roles. A short list of real boundaries.
- **My hero's name:** The chef-owner inviting a manager and a cook into one kitchen workspace
- **Content file(s):** `src/pages/features/team-and-access.astro`, `src/components/sections/TeamAccessFeature.astro`, `src/components/sections/TeamAccess.astro`, `src/lib/features.ts`, `src/lib/comparison.ts`, `src/lib/faq.ts`

## The 11 steps

| # | Step | What you build | Done |
|---|------|----------------|------|
| 1 | The Idea | One sentence: WHO + WANT + WALL. | ☒ |
| 2 | Your Character | Hero's insides: want, need, wound, flaw. | ☒ |
| 3 | The Plot | 12 beats on the Save the Cat map. | ☒ |
| 4 | From Beats to Scenes | 12 beats → the 7 sections you will write. | ☒ |
| 5 | Character Voices | The reader's voice and the product's voice. | ☒ |
| 6 | Writing Dialogue | Each section turns a value, the McKee way. | ☒ |
| 7 | Sorkin Dialogue | Headline and subhead as intention vs obstacle. | ☒ |
| 8 | Cool Talk | One line of snap. | ☒ |
| 9 | Bringing a Scene to Life | Senses and setting for the key scene. | ☒ |
| 10 | Connecting Your Scenes | Hand-offs between sections; POV locked. | ☒ |
| 11 | Revise and Finish | Cut, sharpen, make the ending land. | ☒ |

### Step 1 — The Idea

> A chef-owner who wants the crew inside one kitchen workspace but needs to know which sensitive jobs stay with an owner or manager, while the product does not yet offer a permission switch for every screen.

### Step 2 — Your Character

- **Want:** Invite the crew and understand who can handle setup, billing, team administration, recipe publishing and Sage actions.
- **Need:** A short, honest access model they can explain before adding anyone.
- **Wound:** A teammate seeing or changing something the owner assumed was restricted.
- **Flaw:** Reading the role name as a promise about every screen instead of checking the exact boundaries.

### Step 3 — The Plot

| Beat | In this piece |
|------|---------------|
| 1 Opening Image | The owner is about to invite a cook and a manager into the same workspace. |
| 2 Theme Stated | A role name only helps when the boundary underneath it is named. |
| 3 Set-Up | Billing, setup, team administration, recipe lifecycle work and Sage do not all carry the same risk. |
| 4 Catalyst | CostCook has Owner, Manager and Staff roles, with server-enforced boundaries on sensitive actions. |
| 5 Debate | Does that mean the owner can hide every cost or build a custom permission set? |
| 6 Break into Two | A plain role ticket shows what each role adds and what remains shared. |
| 7 B Story | The crew gets the operational record; judgment and sensitive changes stay visible. |
| 8 Fun and Games | Owner-only billing, owner/manager setup and team work, recipe lifecycle boundaries and Sage financial/proposal gates are listed exactly. |
| 9 Midpoint | The reader can explain the three roles without translating a permissions matrix. |
| 10 Bad Guys Close In | Invited teammates join as Staff today, and there is no per-screen or per-field permission builder. |
| 11 All Is Lost | Calling this “tiered access” without the limits would create the very surprise the roles should prevent. |
| 12 Finale + Final Image | The owner starts with the real boundaries and invites the crew with the right expectation. |

### Step 4 — From Beats to Scenes

| § | Section | Beats | Value turn |
|---|---------|-------|------------|
| 1 | Hero, constraint and role ticket | 1–2, 5 | role labels → named boundaries and limits before conversion |
| 2 | Why boundaries matter | 3–4 | one shared login → accountable teammates |
| 3 | Owner, Manager, Staff | 6–8 | vague hierarchy → the same three facts for every role |
| 4 | Shared workspace | 7–9 | fear of separation → one operational record |
| 5 | What this is not | 5, 10–11 | assumption → explicit limit and an honest fit check |
| 6 | Questions | 5, 10 | objection → plain answer |
| 7 | Closing action | 12 | uncertainty → informed invitation |

### Step 5 — Character Voices

- **Reader's words:** owner, manager, cook, invite the crew, billing, setup, publish, costs, who can see this.
- **Product voice:** candid, exact, calm. **Banned:** enterprise-grade, granular, flexible, seamless, complete control.

### Step 6 — Dialogue

- Hero: “three roles” as a label → three roles with a finite contract, including cost visibility before either conversion path.
- Roles: hierarchy → workspace access, protected work and boundary in the same order for every role.
- Shared workspace: restriction → collaboration with accountability.
- Limits: implied permission grid → a clear no, the current invitation behavior and a candid next step when that makes the product a poor fit.
- Close: hesitant invitation → informed next step.

### Step 7 — Sorkin

- **Intention:** Bring the crew into one workspace without giving up control of sensitive jobs.
- **Obstacle:** Role names are easy to overread.
- **Headline:** Three roles. A short list of real boundaries.
- **Subhead:** Owner, Manager and Staff keep a few sensitive actions where they belong. The rest stays one working kitchen record, and the limits are stated before you invite anyone.
- **Constraint before conversion:** Staff can open cost screens, and custom roles are not available.

### Step 8 — Cool Talk

> A role is a boundary, not a badge.

### Step 9 — Bringing a Scene to Life

- **Where:** At the office edge of the kitchen, an invitation open while the prep list is already moving.
- **What:** The owner knows who needs tomorrow's work but does not want billing or publishing rights to be assumed.
- **When:** The first week a manager and a cook start using the same system.

### Step 10 — Connecting Your Scenes

- **POV:** Second person throughout.
- **Hand-offs:** invite → see the cost-visibility constraint → inspect the role boundaries → see what stays shared → compare the same three facts for each role → name what is not configurable → check product fit or ask about the setup → settle objections → invite with the boundary understood.

### Step 11 — Revise and Finish

- **Word count before → after:** 502 → 479 rendered words; the final page remains under the 760-word target.
- **Claims removed:** full tiered access, custom roles, per-screen permissions, cost hiding, self-service manager assignment, audit-history guarantees.
- **Final Image:** Invite the crew knowing which work stays with you, which work a manager can carry, and which controls are not there yet.

---

## MOVED 2026-09-09 — this is a block inside `#more`, not a stop

See [[homepage-stop-merge]]. The section this tracker was written for is now one
of four blocks in `src/components/more/`, under one shared heading, one lede and
one hand-off in `src/components/sections/WhatElse.astro`. Its own eyebrow, h2,
lede and hand-off are gone; its h2 text survives as the block's h3.

**No claim, figure or `data-*` hook was cut**, and the build contract asserting
the homepage carries this proof still passes. What the working parts do now is
fold under 64rem behind `FoldedDetail.astro`, shipping open in the served HTML.
Every beat above still applies; only the frame around it changed.


## Caterer first-visit revision · 2026-09-11

- [x] 1 Idea: A busy owner of a six-person catering kitchen wants to give the crew access, but role names do not explain what a cook can see.
- [x] 2 Character: Wants a usable answer between services; needs a traceable result; remembers a costly spreadsheet mistake; habitually postpones setup.
- [x] 3 Plot: (1) interrupted service gap; (2) one dependable answer; (3) separate records; (4) role names do not explain what a cook can see; (5) asks what to enter; (6) tries the relevant CostCook task; (7) hands the result to the crew; (8) follows the worked example; (9) checks its labelled numbers; (10) reads missing-data and release limits; (11) sees the cost of guessing; (12) chooses a trial or booked demo.
- [x] 4 Scenes: hero, daily problem, task navigation, worked example, exceptions, detailed questions, next step. Turns: uncertainty to purpose; familiarity to need; confusion to action; doubt to evidence; risk to limits; questions to answers; hesitation to informed choice. Existing route and layout retained.
- [x] 5 Voices: Reader asks “What do I enter?” and “Can my kitchen use this today?” (persona prompts, not customer quotes). Product is calm, concrete and kitchen-literate; ban seamless, powerful and robust.
- [x] 6 Dialogue: Each scene answers the next practical question instead of explaining internal architecture.
- [x] 7 Intention/obstacle: give the crew access / role names do not explain what a cook can see. Headline: “Give your crew their own sign-in.” Supporting line: “Invite your crew by email to the same kitchen account. Compare what Owners, Managers and Staff can do, from daily prep to recipe publishing and billing.”
- [x] 8 Snap: “Know the boundary before the invitation leaves.” Retain this concrete detail; cut competing abstract slogans.
- [x] 9 Setting: Phone beside the prep bench, a short gap between services, crew waiting for the next list.
- [x] 10 Connection: You throughout; inputs lead to results, results to limits, limits to the trial decision. Shared terms keep the next action consistent.
- [x] 11 Revision: Build and claim checks passed; every feature route inspected at desktop and mobile, with native disclosures and no JavaScript. Five-width regression checks and 320px/200% text passed. Report: `docs/qa/features-caterer-2026-09-11/report.md`.

## Claim correction · 2026-09-27 (Sage tools and drafts)

- [x] 11 Revision: Sage now has 22 read-only tools and 3 draft kinds (the kitchen shopping list, one order's shopping list, a guest-count change on a draft order); nothing changes until a manager or owner approves the draft. "Eleven checks", "one proposal" and "shopping-list proposal" were stale, and "proposal" now names the client document, so Sage's output is called a draft everywhere. Beats, point of view and snap line unchanged. Gap report S1, S10, W2; ledger RC-46, RC-49.

## Claim correction · 2026-09-27 (what Staff can open)

- [x] 11 Revision: "All can open cost screens" and "everyone can open the costs" overstated it. Staff can open recipe costs and Analytics, but Today leaves out order money and client names for Staff, the calendar leaves money out for Staff, and Clients is for owners and managers (kitchen-brain today-work.ts:34-40, calendar/+page.server.ts:31). The no-per-screen-control boundary and the pinned "No." answers stand. Gap report S7.

### Revision 2026-10-07: chef audit of the feature and resource routes
- The role-stack caption "A role is a boundary, not a badge." became "Each role sees what its job needs." The hero primary is the trial; "Compare team roles" is the quiet link.

### Revision 2026-10-07: chef voice pass
Owner: make the site read like a chef wrote it. Copy only; the H1, the
"Before you invite" constraint, the access-check table, the not-the-right-fit
line, the FAQ, role summaries and the closing heading are unchanged (pinned
or RC-52 boundaries).
- **Repeat cut:** the second "Give each teammate their own sign-in." under
  the H1 is "Everyone signs in as themselves."
- **Limit, said plainly:** "CostCook does not let you hide one screen, expose
  one field, or assemble a custom role. ... that boundary is not available
  today." is "You cannot hide a screen, show just one field, or build your own
  role. If a cook needs the prep list but must not be able to open costs,
  CostCook cannot do that today." Same RC-52 meaning.
- **Consultant words out:** "workspace" (dt labels, closing body), "an action
  reserved for", "keep the sensitive work attached to the role that should
  carry it". The heading "What this is not." is "Where it stops."
- **Caption:** "Each role sees what its job needs." implied hidden screens,
  which the page says do not exist; it is now "Three roles, one kitchen
  account."

## Revision 2026-10-10: develop's roles, Staff without the money
- Owner ruling 2026-10-10: the page states local kitchen-brain develop c90d3b9c2's roles and ships now (`permissions.ts` ROLE_CAPS; role commit 58bebd7f5 is not on kitchen-brain main yet).
- The turn flips. The old wall, "a cook who needs the prep list can still open costs, so CostCook may not fit", is gone: Staff work orders, prep, deliveries and recipes, and costs and margins are stripped before their pages are sent. The hero constraint now tells the reader to pick Staff for anyone who should not see costs.
- Invites pick Staff or Manager; only the Owner invites, changes roles, or touches billing and settings. Managers carry the money (costs, Analytics, Sage, clients, purchasing, setup).
- What still stops: no single-screen control, no field-level control, no custom role. "The line is the role" carries that limit.
- Snap line: "The line is the role: Staff never see costs, Managers see the money but not billing, and only you run the team."

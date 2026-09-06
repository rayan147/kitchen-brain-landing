# Your initial setup: redesign of `/onboarding`

Date: 2026-09-06 · Branch: `feat/initial-setup-guide` (worktree from `develop`)
Source of truth for app facts: `kitchen-brain@sandbox/demo`, read 2026-09-06.
Research inputs: `docs/research/onboarding-guide-best-practices-2026-09-06.md`
(web research) and Krug, *Don't Make Me Think, Revisited* (owner's copy;
principles restated below in our own words, never quoted).

## 1. Problem

The current page ("Your first dish") answers one question well: what does
setup ask for. It ends at the shopping list and stops. A reader who finishes
it is left with two unanswered questions the owner named:

1. What should I do next?
2. How do I onboard the rest of my kitchen?

Both have honest, shipped answers in the app, and the page says nothing about
either. It also reads as long prose: seven sections, no visible map, and no
"you are done when" marker anywhere.

## 2. Decision (approved 2026-09-06)

One guide, three parts, same URL. `/onboarding` stays (FAQ link, nav, and
three check scripts depend on it). Label, title, breadcrumb and H1 become
**Your initial setup**. The page is restructured as Before / The five stages /
After, and the After part is new.

Rejected: a second route for "what next" (another nav item, another tracker,
a split story); a dated 30-day checklist (durations need owner confirmation
the ledger does not have).

## 3. Reader and story

Hero: the owner-operator with the trial page open in one tab, deciding whether
one evening is worth it, who has been burned by tools that wanted the whole
catalog first. Their second fear, new in this revision: "even if I get one
dish in, then what, and how does my crew ever use this?"

The story tracker at `docs/stories/onboarding.story.md` is rerun through all
eleven steps. The beat map extends past the shopping list: the Final Image is
no longer "she presses Start" but the crew opening a Shop list she built, on
their own phones, without her standing over them. One snap line stays: the
$32 case, 80% surviving the knife, 180 g on the plate, $1.62.

Point of view: second person, locked.

## 4. Page structure

Krug principles applied, in our words: make each choice mindless; design for
scanning, not reading; a clear visual hierarchy where nesting shows
belonging; obvious clickables; cut needless words and every line of happy
talk; street signs so the reader always knows where they are; pass the trunk
test from any scroll position; on a phone, allow zoom, expect no hover, and
keep one thing per screen.

### Part 0: hero (Before you start, in one screen)

- Breadcrumb `Home / Your initial setup`.
- Eyebrow `Your initial setup`. H1 keeps the earned claim: you do not need to
  enter your whole walk-in. Lede cut to three sentences: one dish, about
  fifteen minutes (RC-10), then what comes after.
- Primary CTA renders `cta.label` verbatim. One quiet link to the number.
- The setup ticket becomes the page map: three parts, each an in-page anchor,
  each with a one-line "done when". This is the mindless choice: the reader
  picks which of three questions they came with.

### Part 1: Before you start

Merge the current "The empty screen" and "What it asks you for" into one short
block. Keep the named fear and the optional welcome. Roughly half the current
words. Ends with the hand-off: the five stages are the work.

### Part 2: The five stages

Keep the verified stage table, the three doors (RC-58), the stage-one capture
(RC-48), the Sage paragraph (RC-49), the arithmetic figure (RC-55) and the
guards. Add to each stage row a `done when` line taken from the app's own
step list for that stage (`SETUP_STAGE_GUIDE[stage].steps`), so a reader in
the app recognises the checkmarks. Part label in the eyebrow: `Part 2 of 3`.
Ends with the hand-off to the completion screen.

### Part 3: After setup (new)

**3a. Where the app leaves you.** The real completion screen: heading "Your
kitchen is ready", the list of what was created, and two actions, "Open
shopping list" and "Go to Today". If the welcome goal was set, the ending
answers it in the owner's words. Source: `SetupCompletionSummary.svelte`.

**3b. The rest of your menu.** The next dish goes in through the same doors
as the first. One queue takes a photo, a PDF, a spreadsheet, a Word document
or pasted text and comes back as staged facts to confirm; what could not be
read is quoted back (RC-38, RC-39). Sage drafts a recipe from a card, photo,
PDF, text or link for you to read before it is costed (RC-58). Later prices
update future catalog and draft costs without rewriting confirmed orders
(RC-08). No sentence about extraction accuracy.

**3c. The rest of your crew.** Settings, then Team. Invite by email; the
teammate gets a one-time link and needs no password; they join as Staff.
Owner, Manager and Staff in one line each, with the honest caveat that Staff
can open cost screens and there is no custom role (RC-52). Link to
`/features/team-and-access` for the full boundary. One piece of advice, not
a claim: invite after the first order exists, so the crew arrives to a Shop,
Prep and Pack list rather than an empty kitchen.

**3d. Close.** The reader's life after: the number checked, the list on the
crew's phones. Primary CTA renders `cta.label`. The product tour link stays
as the quiet hand-off.

Every part ends with exactly one next action.

## 5. What stays off the page

- Any duration other than "about fifteen minutes" (RC-10).
- Sample data, `Load sample data`, any public sandbox.
- Any statement of what import extraction returns (RC-55 pins the stub).
- Any role behaviour not in RC-52; no permission builder, no per-screen
  control, no "Manager invitations".
- Em-dashes, stock SaaS phrases, happy talk, exclamation points.

## 6. Files

| File | Change |
|---|---|
| `src/components/sections/OnboardingPage.astro` | Restructure into three parts; add page map, done-when lines, After section. Keep the ticket motif, `.anim-enter` / `[data-reveal]` only. |
| `src/pages/onboarding.astro` | Title, description, direction contract. |
| `src/lib/site.ts` | `resourceNav` label `Your initial setup`, description updated. |
| `src/lib/faq.ts` | Setup answer link text; add one row on inviting the crew if none covers it. |
| `scripts/check-landing-claims.mjs` | Update onboarding pins; add pins for 3a (completion heading), 3b (RC-38 five doors), 3c (RC-52 Staff and one-time link); forbid "custom role", "permission", "extracts", "reads your invoice correctly". |
| `scripts/check-onboarding-page.mjs`, `scripts/verify-onboarding.mjs` | Active-nav label, new section ids, anchors resolve. |
| `docs/release-claim-ledger.md` | Surface row for `/onboarding` gains RC-08, RC-38, RC-39, RC-52. |
| `docs/stories/onboarding.story.md` | Rerun all eleven steps; record cuts and the extended beat map. |
| `docs/research/onboarding-guide-best-practices-2026-09-06.md` | Research report (moved from the main checkout). |

## 7. Design-pattern decision

The stage, door, guard, and new after-setup tracks remain plain data arrays
rendered by the template. Considered Strategy and Template Method for the
three parts; not used because the parts are one fixed composition with no
runtime variation. Stated in the component header comment.

## 8. Verification

- `node scripts/check-landing-claims.mjs` and `npm run build` green.
- `node scripts/check-onboarding-page.mjs` green on `dist/`.
- `node scripts/verify-onboarding.mjs`: 1440x900 and 390x844, zero horizontal
  overflow, anchors land on their headings, active nav reads the new label.
- 200% text, keyboard focus order through the page map and both CTAs, no-JS
  render, reduced motion.
- Five-second test on the hero: a reader can name the three parts.
- Trunk test from Part 3 alone: site, page, part, and next action all legible.
- Re-read every sentence against section 5.

## 9. Out of scope

App changes in kitchen-brain. Nav restructuring (six resource items remain
in two groups; confirmed no restructuring needed). Homepage copy.

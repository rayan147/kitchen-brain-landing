<!-- story: docs/stories/features-dropdown-redesign-prompt.story.md -->

# Implementation prompt: redesign the Features dropdown

Use this prompt in the CostCook landing-page repository to redesign the global **Features** dropdown and its handoff into the `/features` route family.

## Outcome

Turn the current narrow, one-column disclosure into a calm, useful mega-menu that lets a catering operator answer one question quickly:

> Does CostCook handle the part of my week I am worried about?

Use the information shape of [Meez’s “Features & Products” menu](https://www.getmeez.com/) as a reference: a wide panel, short icon-led destinations, clear titles, and one-line explanations. Improve on it by organizing CostCook around the visitor’s jobs rather than exposing a long undifferentiated product catalog.

**Copy the information shape, not the brand skin.** Do not reproduce Meez’s copy, colors, imagery, icons, spacing, CSS, or Webflow behavior.

## Product and repository context

- Product: CostCook, an Astro marketing site for independent catering kitchens.
- Primary reader: a working chef-owner or catering operator checking whether the product can support a real menu, quote, event, or purchasing workflow.
- Visual authority: `DESIGN.md`, `src/styles/global.css`, the shared header, existing brand assets, and established CostCook pages.
- Content truth: `src/lib/features.ts`, `src/lib/site.ts`, `docs/release-claim-ledger.md`, and the rendered product demo. Never invent claims, counts, availability, testimonials, or integrations.
- Existing route family: `/features`, `/features/recipes-and-costing`, `/features/getting-prices-in`, `/features/the-day-itself`, `/features/compliance-and-labels`, and `/features/team-and-connections` when present on the working branch.
- Existing visual language: warm off-white and paper surfaces, green actions, amber operational accents, Fraunces headings, Instrument Sans body copy, quiet rules, restrained shadows, and mostly square content containers.
- Preserve the current primary actions: `Sign in` and `Start CostCook`.

Before editing, inspect the current rendered header and every consumer of `SiteNav.astro`. Also inspect the `/features` hub and every feature-area route at desktop and phone widths. Do not assume this prompt’s file list is newer than the branch you are implementing against.

## Workflow decision

This is route-family work because the shared menu hands visitors into several feature pages.

The user is trying to **find the product capability that matches today’s kitchen problem** so that **they can decide whether to explore, start, or book a demo**.

Keep the existing route family. No new top-level feature routes are required. Add stable section anchors to existing area pages where deeper links materially improve the handoff. The menu may deepen navigation, but it must not create duplicate pages or a second taxonomy that disagrees with `src/lib/features.ts` or `/compare`.

Use a hybrid information shape:

- Denormalize the frequent, low-risk discovery step into the header so a visitor can scan the major jobs without first loading `/features`.
- Keep detailed capability lists normalized on the existing feature pages so the shared header never becomes a 140-item catalog.
- Preserve `/features` as the complete overview and diligence destination.

Assumption to verify: the most common prospect questions concern costing, getting prices in, running an event, purchasing/receiving, and inventory. If analytics or sales evidence contradicts that order, use the evidence and document the change.

## Required desktop information architecture

At large widths, open a wide panel visually attached to the **Features** trigger. Use two balanced groups and no more than eight primary destinations.

### Group 1: Build and price

1. **Recipes & food costing**
   See the recipe, yield, portion, and per-guest math with the work shown.
   Destination: the relevant recipe/costing page or stable section anchor.

2. **Menus & quotes**
   Price a menu before you say the number out loud.
   Destination: the menus section inside recipes and costing.

3. **Ingredients & supplier prices**
   Keep pack costs, yields, and supplier history attached to the food.
   Destination: the ingredients section inside recipes and costing.

4. **Invoices & price-list import**
   Bring in paper or spreadsheets, then confirm before anything changes.
   Destination: the import section inside getting prices in.

### Group 2: Run the event

1. **Orders, shop, prep & pack**
   Turn one menu and guest count into the plan for the day.
   Destination: the orders section inside the day itself.

2. **Purchasing & receiving**
   Send the order, record what arrived, and keep shortfalls visible.
   Destination: the purchasing section inside the day itself.

3. **Inventory & month cost**
   See what is on the shelf and compare expected use with actual spend.
   Destination: the best stable inventory or ledger anchor. If one link cannot honestly serve both, split it and remove a lower-priority item so the menu stays at eight or fewer.

4. **Team, setup & reliability**
   Get a kitchen started and keep the working screens usable on the floor.
   Destination: the team and connections page.

Add a quiet footer rail inside the panel:

- Primary text link: **Explore every shipped feature** → `/features`
- Optional secondary link only if it does not compete with the first: **Compare CostCook** → `/compare`
- Do not put the changing total feature count in global chrome unless it is derived from the same source and product explicitly approves the maintenance tradeoff.
- Do not present in-development work as available. If labels or integrations appear, mark them plainly as **Coming** and keep them visually secondary.

The menu copy above is a starting set, not permission to publish unsupported claims. Reconcile every sentence with the feature source and claim ledger before shipping. Keep each description to one short line at normal desktop width.

## Interaction requirements

### Desktop and keyboard

- Open on click or keyboard activation. Hover may keep an already-open panel open, but hover must not be the only way to reveal it.
- Use a conventional button/disclosure trigger with an accurate expanded state. Prefer the smallest semantic implementation that works with and without JavaScript.
- Keep the panel visually connected to the Features trigger; it must not appear under the CTA or float ambiguously in the page.
- Support `Enter` and `Space` to toggle, `Escape` to close and return focus, click-away to close, and focus-out after the final menu item.
- Define predictable arrow-key behavior only if implementing a true ARIA menu pattern. Do not add `role="menu"` to ordinary navigation links without implementing the entire pattern.
- Keep the current destination visibly distinct with `aria-current="page"`; for an anchored subsection, also make the containing area understandable after navigation.
- Do not trap focus. Do not move focus merely because the pointer crossed the trigger.

### Touch and mobile

- Do not squeeze the desktop mega-menu into a phone-width floating card.
- Use a full-width disclosure below the header or a compact navigation sheet that remains part of the document flow.
- Keep the two group labels, but stack their links into one clear reading order.
- Every trigger and destination must have at least a 44 × 44 CSS-pixel target.
- The menu must work at 320px wide, 200% text zoom, and with JavaScript unavailable.
- Opening the menu must not create horizontal scrolling, clip the final items, or hide the `Sign in` and `Start CostCook` actions without an explicit and recoverable mobile-nav design.

### Motion

- Keep motion quiet: a short opacity/vertical reveal and chevron rotation are enough.
- Use transform and opacity only, and fully respect `prefers-reduced-motion`.
- Do not animate height through a long content list or delay navigation for flourish.

## Visual direction

Make this feel like a widened CostCook kitchen ticket, not a generic SaaS card and not a Meez clone.

- Use `bg-paper` or the established paper surface, a ticket-rule/hairline border, and restrained existing shadow tokens.
- Keep titles in the body face for fast navigation scanning; reserve Fraunces for page identity, not every link.
- Use the existing `FeatureAreaIcon` language where it maps honestly. If more specific icons are needed, extend the same stroke weight and geometry rather than importing a mixed icon set.
- Align icons, titles, and descriptions to stable columns. The first words of each title should form a strong scan edge.
- Separate the two job groups with space and/or a quiet rule, not nested rounded cards.
- Green identifies actions and current emphasis; amber remains a small operational accent. Do not turn the panel into a broad green or amber wash.
- Keep the panel compact enough that the first page heading remains partly visible at 1440 × 900; the menu should orient, not take over the page.

## Route handoff

When a visitor chooses a deep item, the destination must answer “Where am I?” immediately.

- Add stable, explicit ids to the appropriate feature-group sections rather than deriving public anchors from display copy.
- Account for the sticky/global header in anchor positioning with `scroll-margin-top` or an equivalent token.
- The destination heading must match or clearly contain the menu label; do not send “Purchasing & receiving” to a page whose visible opening only says “The day itself” with no nearby purchasing identity.
- Preserve the feature page’s story and full capability list. The dropdown is a shortcut into it, not a replacement for it.
- Back/forward navigation and copied deep links must land reliably with and without JavaScript.

## Content and states

The hero is the reader; CostCook is the tool. Use second person consistently and plain kitchen English.

The dropdown itself is not a miniature landing page. Each item gets only:

1. a recognizable job name;
2. one concrete outcome or trust detail;
3. its destination.

Avoid “powerful,” “seamless,” “all-in-one,” “optimize,” “revolutionize,” and invented time or savings claims. Keep one point of view and do not mix “you,” “teams,” and “we” within the same item.

Implement and verify these visible states:

- closed;
- open;
- pointer hover;
- keyboard focus;
- current destination;
- reduced motion;
- JavaScript unavailable;
- narrow phone layout;
- long-text/200% zoom layout;
- a branch where an optional or coming destination is absent.

There is no loading, validation, or destructive state in this workflow. Do not invent them. Recovery is closing the panel, returning focus to the trigger, or using the `/features` overview.

## Architecture constraints

- Keep menu content data-driven from a typed source close to the existing feature metadata. Do not hand-copy the same destinations into desktop and mobile markup.
- Keep content data separate from disclosure behavior and presentation.
- Consult the repository’s required design-pattern guidance before code changes. Name the structural force and leave the required `Pattern: / Why: / Alternative rejected:` comment, or the explicit considered-but-not-used comment, at the chosen seam.
- Prefer progressive enhancement. The no-JavaScript experience must retain every destination.
- Keep the implementation local to shared navigation and feature-section anchors. Do not redesign unrelated header links, footer navigation, page heroes, or the overall brand system.
- Preserve server rendering and existing CSP constraints. Add no dependency for a disclosure interaction that platform primitives and a small script can support.

## Accessibility acceptance criteria

- WCAG 2.2 AA contrast for text, focus indicators, borders that convey state, and interactive controls.
- A visible focus indicator on every trigger and link.
- Correct accessible name, expanded state, current-page state, and logical DOM order.
- No content or action available only on hover.
- No focus loss when the menu closes.
- No content overlap or two-dimensional scrolling at 320 CSS pixels or 200% text zoom.
- Touch targets meet or exceed 44 × 44 CSS pixels.
- Screen-reader reading order matches the visual group order.

## Verification and regression coverage

Use browser verification, not source inspection alone.

Test at minimum:

- 1440 × 900 desktop;
- 1280 × 800 laptop;
- 1024 × 768 compact desktop/tablet landscape;
- 768 × 1024 tablet portrait;
- 390 × 844 phone;
- 320px-wide reflow stress case;
- 200% text zoom;
- reduced motion;
- JavaScript disabled.

Walk the complete flows:

1. Open Features, scan both groups, choose a top item, verify the anchored destination and page identity.
2. Open with keyboard, traverse every item, close with Escape, and verify focus returns to the trigger.
3. Tab out of the last item and verify the panel closes without hiding the new focus target.
4. Open on touch, scroll the full list, activate the final item, and use Back to return.
5. Copy a deep link into a fresh tab and verify it lands at the intended feature group.
6. Disable JavaScript and repeat the essential open-and-navigate path.

Add or update regression tests for:

- all configured dropdown destinations resolving successfully;
- unique, stable section ids;
- trigger expanded state and Escape behavior;
- focus-out/click-away behavior;
- no horizontal overflow at representative widths;
- the `/features` overview remaining available;
- coming items never being rendered as shipped.

Run the repository’s existing checks and production build. Report exact commands and results.

## Definition of done

- The menu answers the visitor’s capability question in one scan.
- It is recognizably CostCook and only structurally inspired by Meez.
- Desktop uses a clear two-group mega-menu; mobile uses an intentional stacked disclosure or sheet.
- Every link arrives at a matching, identifiable destination.
- The full feature inventory remains available without crowding global navigation.
- Keyboard, touch, screen-reader, reduced-motion, no-JavaScript, reflow, and deep-link paths are verified.
- No unsupported claim, copied competitor asset, new dependency, broken route, console error, network error, overflow, or focus loss ships.

At handoff, lead with the implemented outcome, list the final menu taxonomy, name any evidence-driven departures from this prompt, link changed files, and provide the browser/test evidence.

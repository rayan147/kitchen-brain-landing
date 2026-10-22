# Story Tracker: CostCook site footer (2026-10-22)

## My story

- **Piece:** shared site footer, following the owner's cream five-column reference.
- **Hero:** Dana, an owner-caterer reaching the end of a page on her phone.
- **Content file:** `src/components/SiteFooter.astro`; verified destinations come from `src/lib/site.ts`.
- **Boundary:** only existing pages and owner-supplied contact actions are linked. No policy, changelog, customer-story, security, support, or social destination is implied before one exists.

## The 11 steps

| # | Step | Done |
|---|------|------|
| 1 | The Idea | [x] |
| 2 | Your Character | [x] |
| 3 | The Plot | [x] |
| 4 | From Beats to Scenes | [x] |
| 5 | Character Voices | [x] |
| 6 | Writing Dialogue | [x] |
| 7 | Sorkin Dialogue | [x] |
| 8 | Cool Talk | [x] |
| 9 | Bringing a Scene to Life | [x] |
| 10 | Connecting Your Scenes | [x] |
| 11 | Revise and Finish | [x] |

### 1. Idea
An owner-caterer wants one credible next step after a page ends, but a thin, generic footer makes the product and the person behind it hard to find.

### 2. Character
- **Want:** find the product detail, answer, or person she needs without searching again.
- **Need:** clear, accurate destinations and an accountable founder.
- **Wound:** a sales page once promised help, then sent her into dead links or a form loop.
- **Flaw:** she will leave rather than hunt through a site map.

### 3. Plot: 12 beats
| Beat | Footer role |
|---|---|
| Opening Image | She reaches the end of a product page with one question left. |
| Theme | The next answer should be easy to find. |
| Set-Up | Pages cover features, proof, pricing, and fit. |
| Catalyst | She needs to decide what to inspect next. |
| Debate | Will the site answer, or require a sales call? |
| Break into Two | The grouped links offer direct routes. |
| B Story | The chef founder is reachable by email or phone. |
| Fun and Games | Product, tour, setup, comparison, and FAQ can be opened directly. |
| Midpoint | She gets a specific answer without hunting. |
| Bad Guys Close In | A reference mock includes links this site has not built. |
| All Is Lost | A dead link would break the trust earned above. |
| Finale / Final Image | She opens a real route or contacts Rayan. |

### 4. Scenes
| Section | Beats | Turn |
|---|---|---|
| Brand block | 1–3 | anonymous site → chef-led product |
| Product / See it work | 4–9 | uncertain next step → direct exploration |
| Make the decision / Talk to us | 5, 7, 10–12 | unanswered objection → answer or person |
| Copyright row | 12 | page end → clear close |

### 5. Voices
Reader: “Show me what it does,” “Can I talk to someone?” Product: plain, warm, precise. No “seamless,” invented trust claims, or fake urgency.

### 6. Dialogue
The navigation turns a page end into a choice; the contact column turns a generic site into a named, reachable person.

### 7. Intention and obstacle
- **Intention:** get the next answer.
- **Obstacle:** generic, incomplete footers hide useful paths.
- **Headings:** Product; See it work; Make the decision; Talk to us.
- **Supporting line:** Catering software, built by a chef.

### 8. Snap
The homepage's one snap line remains “A missing price is named, never counted as zero.” The footer adds none.

### 9. Scene
On a phone between service tasks, Dana reaches the bottom with one thumb and a question about setup or price.

### 10. Connection
The footer follows the page's decision order: product → proof → decision → contact. Labels match the shared Menu and the destination pages.

### 11. Revision
Cut mock links without verified destinations. Keep a short founder line, one tour invitation, and direct contact actions. Final image: she opens the answer she needs or reaches the founder.

## UX brief

- **User:** owner-caterer, often on a phone mid-shift.
- **Job:** find a credible next page or contact after finishing the current page.
- **Success:** every visible footer link resolves to an existing page, app action, email, or phone number.
- **Pattern:** fixed grouped footer navigation using the shared site map and brand lockup.
- **States:** static content; no loading or empty state. If a destination does not exist, omit it.
- **Primary action:** the page's existing trial CTA remains primary; the footer offers quiet routes and contact.
- **Accessibility:** landmarks, heading hierarchy, keyboard focus, 44px targets, legible contrast, 320px reflow.
- **Risk:** decorative fidelity must not create invented routes or claims.

No route or workflow restructuring is needed. The footer is a shared frame on every route; its destinations remain the shared navigation source used by the mobile Menu.

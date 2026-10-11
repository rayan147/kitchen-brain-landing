# Story Tracker: Blog, a catering order form on your own website

## My story

- **Piece:** blog guide, `/blog/catering-order-form-on-your-website`
  (2026-10-08). Post 2 of `docs/plans/2026-10-08-ordering-and-event-blog-plan.md`;
  same shape as `supplier-invoices-by-email`. Hands off to `/features/online-ordering`.
- **Hero:** the owner whose website catering page says "call us to order".
- **Content file:** `src/content/blog/catering-order-form-on-your-website.md`.
- **Gate:** owner lifted Gate 0 on 2026-10-08. Published with ordering.
- **Evidence (kitchen-brain develop 185451a1b):** website tab
  `routes/settings/integrations/ordering-site/website/+page.svelte` (labels,
  snippet shape :20, `Seen on`, `Blocked on … it isn't in your list.`, `Add it`,
  mailto subject "Your ordering widget"); 50 sites `redesign-admin.ts:424`;
  exact origin match `origin.ts`, `storefront-load.ts:36,62`; Go live and its
  blockers `+layout.svelte:135,210-216`, `storefront/issues.ts:95-150`.
- **Not claimed:** steps for any website builder; the widget's load-failure
  message on an unlisted site (read from code, not tested).

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

### Step 1: The Idea
> An **owner with a catering page that says "call us"** wants **the page to
> take the order**, but **they don't touch code and their web person needs to
> be told exactly what to do**.

### Step 2: Character
- **Want:** an order form on the site they already have.
- **Need:** a setup that is checked, not hoped for.
- **Wound:** a website change that "went live" and nobody noticed it broke.
- **Flaw:** sends the web person half the instructions.

### Step 3: The Plot
| Beat | In this piece |
|------|---------------|
| 1 Opening Image | The two-summers-old PDF menu and "call us to order". |
| 2 Theme | Your web person pastes two lines. |
| 3 Set-Up | Before you start: the exact address. |
| 4 Catalyst | Go live stays grey. |
| 5 Debate | www or not? |
| 6 Break into Two | Add the website, exactly. |
| 7 B Story | The note to the web person. |
| 8 Fun and Games | Copy snippet, Email it to them. |
| 9 Midpoint | Seen on your address. |
| 10 Bad Guys | Blocked on the other address. |
| 11 All Is Lost | Not seen on any site yet. |
| 12 Finale | The link works without a website. |

### Step 4: Scenes
Opening; Before you start; Steps 1 to 4; If it doesn't show; Your link works without a website.

### Step 5: Voices
Reader: "web person", "catering page", "lunch drop". Product: app labels verbatim.

### Step 6: Turns
Each step ends on a check the reader can see.

### Step 7: Headline
"How to put a catering order form on your own website."

### Step 8: Snap line (one)
"Your web person pastes two lines. You never touch the code." (the feature page's own line)

### Step 9: Scene
The catering page with the grazing-table photo.

### Step 10: Connection
Second person; links back to post 1 for payment rules.

### Step 11: Revise
Cut the untested "Ordering could not load" symptom. Cut builder-specific steps.

# Story Tracker — Should staff see food costs

## My story

- **Piece:** Worked blog guide
- **Title:** Should your kitchen staff see your food costs?
- **My hero:** An owner-caterer with a trusted lead cook, deciding whether to put the crew in the software
- **Content file:** `src/content/blog/should-staff-see-food-costs.md`
- **Source of truth:** kitchen-brain `develop` 66d0703fe, read 2026-10-10 (four read-only research passes; exact strings and file:line in the session notes). kitchen-brain origin/main (ed6ff5f01, 2026-09-27) does not carry server-side cost redaction (stripCostFields), Staff recipe editing or the Staff-or-Manager invite choice; on main, invites are Staff only and Staff cannot change recipes; the site follows develop under the owner's standing rulings.

## The 11 steps

| # | Step | Done |
|---|------|------|
| 1 | The Idea | ☑ |
| 2 | Your Character | ☑ |
| 3 | The Plot | ☑ |
| 4 | From Beats to Scenes | ☑ |
| 5 | Character Voices | ☑ |
| 6 | Writing Dialogue | ☑ |
| 7 | Sorkin Dialogue | ☑ |
| 8 | Cool Talk | ☑ |
| 9 | Bringing a Scene to Life | ☑ |
| 10 | Connecting Your Scenes | ☑ |
| 11 | Revise and Finish | ☑ |

### Step 1 — The Idea

An owner-caterer who wants the crew working from the system, but keeps them out because the system shows what the wedding costs.

### Step 2 — Your Character

- **Want:** The cooks on the same lists as everyone else.
- **Need:** Roles where the line is costs, enforced by the app, not by trust.
- **Wound:** A cook doing the math on an event out loud.
- **Flaw:** Keeping the crew off the software, so the whiteboard becomes the system.

### Step 3 — The Plot

| Beat | In this guide |
|------|---------------|
| Opening Image | A good lead cook, and a wedding price she can work out. |
| Theme Stated | A cook needs the quantity, not the price. |
| Set-Up | Owners keep cooks out; the whiteboard is wrong. |
| Catalyst | A prep day listed: no dollar sign on it. |
| Debate | Trust everyone, or nobody? |
| Break into Two | Three roles, the line is costs. |
| B Story | Thursday’s delivery. |
| Fun and Games | What Staff see; what drops out; the plain refusal page. |
| Midpoint | Prices are taken out on the server, not hidden in a column. |
| Bad Guys Close In | Receiving is shared: commit and paid amounts need a Manager. |
| All Is Lost | Who gets Manager. |
| Finale + Final Image | She checks in the delivery by the case; the price stays yours. |

### Step 4 — From Beats to Scenes

| § | Section | Beats | Value turn |
|---|---------|-------|------------|
| 1 | Opening | Opening + theme | trust → worry |
| 2 | What a cook needs | Catalyst | all or nothing → a list |
| 3 | Three roles | Break | vague → a line |
| 4 | What Staff see | Fun and games + midpoint | hidden column → removed on the server |
| 5 | Invite them | Promise | setup dread → one screen |
| 6 | Who gets Manager | Bad guys | title → trust |
| 7 | Before you send | Final image | whiteboard → shared lists |

### Step 5 — Character Voices

- **Reader:** "She’s good, but…", "I don’t want them doing the math."
- **Product:** calm, exact, names the app's own labels in bold; says plainly what it does not do. Banned: seamless, smart, peace of mind.

### Step 6 — Dialogue turns

Trust becomes worry; all-or-nothing becomes three roles; a hidden column becomes a removed field; a title becomes a decision about trust.

### Step 7 — Headline / subhead

- **Intention:** Put the crew in the system.
- **Obstacle:** The system shows what the job costs.
- **Headline:** Should your kitchen staff see your food costs?
- **Subhead:** Your cooks need the quantities, not the prices.

### Step 8 — The one snap line

> A cook needs to know it’s four cases. Not that it’s $219.

### Step 9 — Bringing the scene to life

- **Where:** The pass, during a prep day.
- **Sensory detail:** Twelve pounds of chicken thigh on the scale.
- **Time:** Thursday, delivery day.

### Step 10 — Connecting the scenes

- **POV:** Second person throughout.
- **Hand-offs:** need → roles → what Staff see → invite → who gets Manager → checklist.

### Step 11 — Revise and finish

- Checked against develop: ROLE_CAPS (permissions.ts), role descriptions quoted from the invite cards, route-capabilities for closed screens, the 403 page copy, quantity-only receiving, owner-only team.manage, 7-day links, removal copy.
- Avoided "every dollar hidden": the strip matches field names; the guide says prices, costs and margins.
- Corrected "plate cost stays where you left it": Staff can change quantities, so it says they cannot change a price.
- Said nothing about seats or per-user pricing (none found, not claimed).
- **Final image:** Thursday the lead cook checks in the delivery by the case from her phone; the price stays the owner’s business.

**Revision 2026-10-10: reviews applied.** Owner-caterer review: one consistent quantity, forty pounds of thigh in four 10-lb cases at $219 for the four (twelve pounds would not feed 120). Humanize review: the opening triad, the denial-first redaction line, the three matching "the person who" bullets and the tidy moral removed; checklist renamed "Check the invites" and cut to three; snap line kept.

**Revision: step-by-step guide with app captures.** Rebuilt as a step-by-step how-to on 2026-10-11 with eight phone captures: the invite as Staff, the join page, the Ishikawa fundraiser as owner and as Staff, the owner's recipe pricing card, the closed-screen page, the ••• menu (Change role, Remove from kitchen) and Who can do what. Verified on the Staff login that the recipe and prep pages carry no dollar figure. The Staff recipe page shows no Edit recipe button, so the guide no longer says Staff fix the method or yield; it quotes the roles table instead.

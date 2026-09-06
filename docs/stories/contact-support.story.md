# Story Tracker — Ask without leaving the page

## My story

- **Piece:** The contact page's ask, moved from a `mailto:` handoff to the same Contact support dialog the app already ships
- **Title / headline:** Ask about your kitchen
- **My hero's name:** An owner-caterer on a phone, mid-shift, who has a question they will not sign up to ask
- **Content file(s):** `src/components/sections/AskSupport.astro`, `src/pages/contact.astro`, `src/pages/contact/sent.astro`, `src/pages/contact/not-sent.astro`, `src/lib/faq.ts`
- **Behaviour:** `api/support.ts`, `src/lib/support.ts`
- **Mirrors:** kitchen-brain `src/lib/components/shell/SupportDialog.svelte` and `src/routes/api/support/+server.ts`

## The 11 steps

| # | Step | What you build | Done |
|---|------|----------------|------|
| 1 | The Idea | One sentence: WHO + WANT + WALL. | ☒ |
| 2 | Your Character | Hero's insides: want, need, wound, flaw. | ☒ |
| 3 | The Plot | 12 beats on the Save the Cat map. | ☒ |
| 4 | From Beats to Scenes | 12 beats → the sections you will write. | ☒ |
| 5 | Character Voices | The reader's voice and the product's voice. | ☒ |
| 6 | Writing Dialogue | Each section turns a value, the McKee way. | ☒ |
| 7 | Sorkin Dialogue | Headline and subhead as intention vs obstacle. | ☒ |
| 8 | Cool Talk | One line of snap. | ☒ |
| 9 | Bringing a Scene to Life | Senses and setting for the key scene. | ☒ |
| 10 | Connecting Your Scenes | Hand-offs between sections; POV locked. | ☒ |
| 11 | Revise and Finish | Cut, sharpen, make the ending land. Done! | ☒ |

### Step 1 — The Idea

> An owner-caterer with one real question about their kitchen wants an answer before they will hand over a card, but the only way to ask was a `mailto:` link that threw them out of the browser into a mail app that may not be signed in, holding an empty message they now have to compose themselves.

### Step 2 — Your Character

- **Want (surface):** Ask one question and get on with service.
- **Need (real):** Evidence that a person is on the other end, before committing anything.
- **Wound (the bad day):** Sent a question to a SaaS company and got a sequence of drip emails from a name that does not reply.
- **Flaw (the habit):** Will not start a trial to ask a pre-sales question, and will not fight their phone's mail app to send one either. So they close the tab.

### Step 3 — The Plot (12 beats)

| Beat | In this piece |
|------|---------------|
| 1 Opening Image — life before | A contact page whose main action ejects you from the browser. |
| 2 Theme Stated | A question you can ask in the place where you had it. |
| 3 Set-Up — the flaw on display | The reader has the question at 6am with wet hands, and no intention of switching apps. |
| 4 Catalyst — the wall hits | `mailto:` opens a blank compose window, or nothing at all, and the moment passes. |
| 5 Debate | Is anyone actually there, or is this a form that goes into a CRM? |
| 6 Break Into Two | A box, on the page, that says where the answer will go. |
| 7 B Story — the relationship | "This goes straight to my inbox and I reply to the address you leave here." One person, named. |
| 8 Fun and Games | Type the question. Nothing else to fill in, no account, no phone number required. |
| 9 Midpoint | Send. The button says Sending, then the box answers in place. |
| 10 Bad Guys Close In | The send fails. This is the beat most contact forms skip. |
| 11 All Is Lost / Dark Night | The old page's worst case: message vanishes, visitor believes a reply is coming, nobody replies. |
| 12 Break Into Three | The draft is kept, the failure is said out loud, and the email address is offered as the way out. |
| 13–15 Finale / Final Image | "Sent. I reply to every message myself, usually the same day." The reader is still on the page they were reading, question asked. |

### Step 4 — From Beats to Scenes

Four surfaces, one beat-group each:

1. **The ask (`AskSupport.astro`)** — beats 1–9. Turns "nobody is there" into "one person is, and here is where they will write."
2. **The failure state (in the same box)** — beats 10–12. Turns "it vanished" into "it did not send, and here is the address."
3. **`/contact/sent`** — the finale for a visitor without JavaScript, who cannot be answered in place.
4. **`/contact/not-sent`** — beat 12 for that same visitor. It exists because the alternative is lying to them.

### Step 5 — Character Voices

- **Reader's voice:** "your kitchen type, the step causing trouble, and what you have tried" — the reader's own units, taken from the aside that was already on this page.
- **Product's voice:** first person singular, because it is one founder-chef answering. "I reply to every message myself." No "we", no "our team", no "support ticket". If the copy said "we", the page would be making a promise about a company that does not exist yet.

### Step 6 — Writing Dialogue (the values each scene turns)

- The ask: **suspicion → willingness.** It turns on naming where the answer goes, not on adjectives about support.
- The failure: **abandonment → a second door.** A contact form that admits failure is more trustworthy than one that always says thank you.

### Step 7 — Sorkin (intention vs obstacle)

- **Intention:** "Ask about your kitchen."
- **Obstacle:** every form the reader has filled that fed a mailing list.
- **Push:** "The only place my answer can go." It justifies the one required field instead of collecting an address because forms collect addresses.

### Step 8 — Cool Talk (the one snap line)

> **The only place my answer can go.**

Six words under the email field doing the work a privacy paragraph usually does badly. It is the page's only ornament and it could not sit under any other product's email input.

### Step 9 — Bringing a Scene to Life

6am, phone in one hand, the walk-in door held with a hip, a question about whether the wedding on Saturday can be costed before the quote goes out. That reader has one hand and forty seconds. Everything above follows from that: one required field, a big touch target, a box that answers without navigating, and no mail app.

### Step 10 — Connecting Your Scenes

- **In:** the page's h1 asks "Questions before you start?" The box below is the answer to that question being takeable literally.
- **Across:** the aside "What helps me answer" now sits beside a form that can receive exactly those things.
- **Out:** the signed-in reader is still sent into the app, where Contact support carries their account email and current screen. That copy was corrected in the same change: it used to imply the app was the only route.
- **POV:** second person to the reader, first person singular for the founder. Locked.

### Step 11 — Revise and Finish

- **Truth pass.** Two places on the site claimed support lived only inside the app: `contact.astro` and `faq.ts:328`. Both were corrected in this change, because leaving them would have made the new form look like a trap.
- **The claim guard moved with the claim.** `check-landing-claims.mjs` pinned `mailto:` against `contact.astro`. After this change that assertion would have passed on a leftover unused constant, so it now asserts against the component, and pins the mailto as what it became: the way out, not the way in.
- **What is verified.** `npm run test:support` drives the endpoint through 18 checks (method, validation, header injection via CRLF in name and email, the bot trap, an unconfigured mailer, the no-script redirect, and rate limiting). `npm run verify:contact` drives the page in a browser: the form is a real POST that exists without JavaScript, the dialog centres and fits, focus enters it and returns to the button that opened it, a refusal keeps the draft, a success clears it, targets are ≥44px, and 320px at 200% text does not overflow.
- **One bug this caught, recorded because it was invisible.** Astro scopes component CSS to elements in the template. The dialog is created by script, so none of its styles applied and the modal rendered unstyled in the top-left corner, taller than the screen, while every existing check still passed. The styles are `:global` now and `verify-contact.mjs` asserts the dialog is centred and inside the viewport.
- **Not shipped, deliberately:** `DemoRequest.astro` still ends its three-step form with a `mailto:` handoff. It has exactly this problem and is the obvious next one, kept out so this change stays one concern.

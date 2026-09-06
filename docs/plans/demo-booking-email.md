# /demo: actually send the request, and put the calendar on the page

Branch `feat/demo-booking-email`, worktree
`/home/rayan147/kitchen-brain-landing-demo-booking`, based on `origin/main`
at `d5669c7` (the tip on GitHub, PR #70 merged).

## What is broken today

`src/components/sections/DemoRequest.astro` never sends anything. Step 2's
submit handler builds a `mailto:` string, waits 1800ms, and sets
`window.location.href = mailto`. So:

- Nothing reaches `rayan@costcook.io` unless the visitor has a configured
  desktop mail client AND notices the draft AND presses send. On a phone,
  which is the reader this site is written for, that is a coin flip.
- Nothing ever reaches `support@costcook.io`.
- The page says so out loud, in `.prepared-truth`: "CostCook has not claimed
  your request was sent. It is sent only when you send the prepared email."
  That line is honest about a design that should not exist.
- "Choose a 15-minute time" opens `calendar.app.google/...` in a new tab, so
  the visitor leaves the page to book.
- "Email Rayan directly" is a second exit next to it.

The repo already has every piece needed to fix this. `api/support.ts` +
`src/lib/support.ts` + `resend` in dependencies are the contact form's working
transport, deployed and proven. This work copies that shape onto `/demo`.

## What it becomes

1. Step 2 submit POSTs to `/api/demo-request`. Resend delivers one message to
   `rayan@costcook.io` and `support@costcook.io`, `replyTo` the visitor.
2. Only on a successful send does the ticket advance to step 3.
3. Step 3 is the Google appointment schedule **embedded in the page**. No new
   tab, no mailto, no "Email Rayan directly".
4. The copy stops hedging, because the send is now real.

## The one thing that could stop the embed

Verified by request, not assumed: the full schedule URL behind the shortlink is

    https://calendar.google.com/calendar/appointments/schedules/AcZssZ0xfUOfjHtWWy-FW4DGE8Ree6p29tr6zrGH3iZ0oYWhLJWqZhtszmFJqGa-JtB3yJ9bmEoT69Ll?gv=true

and it answers `200` with **no `X-Frame-Options` and no `frame-ancestors`**, so
Google permits framing. Permitting framing is not the same as the booking flow
working framed: Google's scheduler can lean on third-party cookies and storage,
which Safari and Firefox block in cross-site iframes, and the failure mode is a
blank or spinning frame rather than an error.

`vercel.json` also serves `frame-src 'none'`, and `frame-src` governs every
navigation the frame makes, not just its initial `src`. If the booking flow
touches `accounts.google.com` or a captcha host mid-way, an allowlist of only
`calendar.google.com` breaks it **in production only**, which is exactly how
the product tour shipped dead for six weeks.

So step 0 of the build is a test, and its result decides the design:

- Serve `dist/` behind `vercel.json`'s own CSP (`csp-server.mjs`, written this
  session), drive Chromium over CDP with **`Log.enable`** as well as `Runtime`,
  and complete a real booking: pick a slot, fill name and email, submit,
  confirm the slot is gone.
- Record the frame's full navigation chain during that booking and let it set
  the `frame-src` allowlist. Do not guess the hosts.
- If it does not survive framed, the honest fallback is one prominent
  "Open Rayan's calendar" action opening the schedule in a new tab. That still
  removes the mailto exit, which is the actual ask.

## Files

| File | Change |
|---|---|
| `src/lib/demo-request.ts` | **new.** Shape, validation, email composition for the nine demo fields. Mirrors `src/lib/support.ts` (permissive email pattern, control-character refusal, length caps). Exports the recipient list. |
| `api/demo-request.ts` | **new.** Mirrors `api/support.ts` line for line: POST-only, honeypot, per-instance rate limit, `RESEND_API_KEY` guard that is loud on the server and honest to the visitor, Resend's error-in-payload handling, content negotiation (JSON for `fetch`, 303 for a no-JS form post). **The `../src/lib/demo-request.js` specifier keeps its `.js` extension** — see the comment at the top of `api/support.ts`; without it the deployed function 500s while the local test passes. |
| `src/components/sections/DemoRequest.astro` | Step 2 gets `action="/api/demo-request" method="post"`, loses `enctype="text/plain"`, `data-recipient` and the mailto action. Submit handler `fetch`es, advances on success, shows an error and keeps the draft on failure. Step 3 becomes the embedded calendar; "Email Rayan directly" is deleted; `.prepared-truth` is rewritten. |
| `src/pages/demo/sent.astro`, `src/pages/demo/not-sent.astro` | **new.** Where the 303 lands a visitor without JavaScript. `sent` carries the same embedded calendar. Mirrors `src/pages/contact/sent.astro`. |
| `src/lib/site.ts` | `booking` gains `embedUrl` (the resolved schedule URL + `?gv=true`) beside the shortlink, with a comment that the shortlink is a 302 and cannot be framed. |
| `vercel.json` | `frame-src 'none'` → the allowlist the booking test produces. This is a real loosening of the site's security posture and gets a note saying which host and why. |
| `scripts/check-demo-page.mjs` | Retire the pins that describe the old behaviour: `data-recipient="rayan@costcook.io"`, `'Your request is ready to send.'`, `form.dataset.emailHandoff = 'holding'`, `}, 1800);`, and the `requiredFields !== 7` count. Add: the form action is `/api/demo-request`, the calendar iframe src is present, **no `mailto:` anywhere in the built demo HTML**, and `vercel.json`'s `frame-src` admits the iframe's host. That last cross-check is the one that stops a CSP tightening from silently blanking the calendar. |
| `scripts/verify-demo.mjs` | Line 260 asserts `action` starts with `mailto:` for the no-JS path; it becomes `/api/demo-request`. The prepared-state assertions (188-190) become send-then-calendar assertions. Its default base URL is `astro dev`, which sends **no CSP** — gets a comment saying so, and the browser pass is also run against `csp-server.mjs`. |
| `scripts/test-demo-endpoint.mjs` | **new**, mirroring `scripts/test-support-endpoint.mjs`: bundles the handler with esbuild and drives it with fake request/response objects. No network, no Resend account. Wired into `package.json` as `test:demo`. |
| `docs/stories/request-demo.story.md` | The scene's value turn changes: the old step 3 turns *hope → hope* ("your browser has a draft"), the new one turns *asked → booked*. Steps 3, 4, 6 and 11 of the tracker get revised, per the global story-content rule. |

## Two traps to avoid

**The honeypot must not be named `company`.** `api/support.ts` traps a filled
`company` field and answers 200 having sent nothing. This form already carries
`<input name="business" autocomplete="organization">`, so Chrome reads it as an
address profile and autofill will fill a `company` input. That would discard
real requests while telling the visitor it worked, and every guard would still
pass. Use a name autofill has no heuristic for, plus `autocomplete="off"`,
`tabindex="-1"` and an `aria-hidden` wrapper, and prove it by submitting with
autofill on.

**The iframe will collapse the step transition.** `transitionTo` animates the
form's height to `incoming.getBoundingClientRect().height`, and a lazy iframe
inside a `display:none` panel measures near zero until it loads. Give the
iframe an explicit `height` attribute and a CSS `min-height`.

## What stays the same

- `From` stays `orders@costcook.io` (`EMAIL_FROM || RESEND_FROM`). It is already
  verified in Resend; a new sender would need domain setup.
- `RESEND_API_KEY` needs no new configuration. The contact form proves it is set.
- No adapter. The endpoint lives in root `api/` for the reason `api/support.ts`
  documents: an adapter moves the build out of `dist/` and disables twenty
  postbuild guards to gain one route.
- `booking.url` keeps working for `demoCta` and the nav; only `/demo` embeds.

## Verification, in order

1. `node scripts/test-demo-endpoint.mjs` — validation, honeypot, rate limit,
   missing-key, Resend-error paths, all offline.
2. `npm run build` — every postbuild guard, including the updated demo contract.
3. Force-fail each new pin once, to prove it bites. Same discipline as `check-dist.mjs`.
4. `npm run verify:demo` against `astro preview`.
5. **`verify:demo` again against `csp-server.mjs`**, plus the real booking walked
   end to end in the frame with `Log.enable` on. A local server that sends no
   CSP is the harness that lied about the product tour; it does not get to
   certify this.
6. One real submission against a preview deploy, confirming both mailboxes.

## Settled

**No confirmation email to the visitor** (owner's call, 2026-09-06). One
message, to `rayan@costcook.io` and `support@costcook.io`, `replyTo` the
address they typed. Google's own booking confirmation reaches them a moment
later when they pick a time, so a second CostCook email would be the third
thing in their inbox saying the same thing. The page's own step 3 is what tells
them it sent, which is why step 3 must not appear until the send returns ok.

---

## What the step-0 test decided (2026-09-06)

**The embed works.** Driven over CDP behind a server replaying `vercel.json`'s
own CSP:

- With `frame-src https://calendar.google.com`, the schedule renders, a slot
  click opens Google's name/email/reCAPTCHA form inside the frame, and the
  frame document never navigates off `calendar.google.com`. The only other
  origins touched (`www.gstatic.com`, `play.google.com`) are subresources of
  Google's own document, governed by Google's CSP, not ours. So the allowlist
  is exactly one host, measured rather than guessed.
- With today's `frame-src 'none'` the visitor gets Chrome's "This content is
  blocked. Contact the site owner to fix the issue." That is the negative
  control, and it is what the guard now reproduces.

**One thing the test could not settle:** the final submit was not pressed,
because that books a real slot on Rayan's calendar and emails him. Everything up
to it renders in-frame.

**A bug the test caught that no header could have.** With `src` in the markup,
the calendar rendered as a ~150px column of wrapped text inside a 980px frame.
Chrome deliberately does NOT lazy-load a `display:none` iframe, it loads it
eagerly, so Google laid its page out against the hidden panel's viewport and
never reflowed; reassigning `src` afterwards did not fix it. The src is now
attached by script once step 3 is open and sized. `/demo/sent` keeps a plain
`src`, because it is visible and full width from first paint.

**Measured, and why the heights are what they are.** Inside the frame at ~408px
wide, Google's schedule stacks and runs 2,582px tall, so a 700px frame on a
phone hides every time behind a scrollbar inside an iframe. Mobile gets 1200px;
the wide layout puts the month beside four days of times and 700px is all of it.
The ticket also breaks out to full width at step 3, because in the 5fr column
the calendar had about 455px and Google answered with its narrow layout.

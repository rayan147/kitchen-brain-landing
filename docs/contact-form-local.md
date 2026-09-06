# Running the contact form locally

The contact form posts to `/api/support`, which is a Vercel function, not an
Astro route. Two consequences follow, and they are the whole of this document.

## `npm run dev` does not serve the endpoint

`astro dev` serves `dist/`-shaped static output and knows nothing about the
root `api/` directory. The page renders, the modal opens, and the send fails,
because nothing is listening on `/api/support`.

That is not a bug to fix by adding an adapter. An adapter moves the build from
`dist/` to `.vercel/output/static`, and the twenty postbuild guards read
`dist/` directly, so the site would lose its entire truth-pass suite to gain
one route. See the header of `api/support.ts`.

To exercise the endpoint, run the Vercel dev server instead, which serves the
Astro build and the function together:

```sh
npm run dev:api        # vercel dev, serves the page AND /api/support
```

The first run asks to link the project. Everything else on the site is
unaffected: `npm run dev` remains the fast path for pages.

## Mail goes to Mailpit, never to a person

Sending for real from a laptop would mean putting a production Resend key on
it. Instead the endpoint speaks SMTP to a local capture server, the same way
the app does (`kitchen-brain/src/lib/server/email/smtp.ts`).

Start Mailpit:

```sh
docker run --rm -p 1025:1025 -p 8025:8025 axllent/mailpit
```

Then, in `.env` (git-ignored):

```sh
EMAIL_TRANSPORT=smtp
SMTP_URL=smtp://127.0.0.1:1025
```

Send a question from `/contact` and read it at <http://localhost:8025>. The
captured message is the real thing: same compose path, same From, same
`Reply-To`, same body that production would send.

### Two knobs, and why

Both `EMAIL_TRANSPORT=smtp` and `SMTP_URL` are required. Neither does anything
alone. A single ambient variable must never be able to reroute mail, and a
stray `SMTP_URL` in an environment must never silently divert production
sending. `test:support` asserts exactly that: `SMTP_URL` on its own still sends
through Resend.

The capture branch is checked **before** Resend, on purpose. A developer who
has both a real key and a capture server configured captures rather than
delivers, because the safe outcome should not depend on remembering to unset
something.

`src/lib/smtp.ts` refuses any `SMTP_URL` that is not loopback **before it opens
a socket**, so this path cannot be turned into a delivery path by
configuration. That guard is what makes it safe for this file to live beside
the production sender.

## What runs in which environment

| Environment | Transport | Configured by |
|---|---|---|
| Local dev | Mailpit over loopback SMTP | `EMAIL_TRANSPORT` + `SMTP_URL` in `.env` |
| Preview | Resend | `RESEND_API_KEY` (Preview) |
| Production | Resend | `RESEND_API_KEY` (Production) |

With none of them set the endpoint answers `503` and tells the visitor the
message did not send, rather than accepting it and dropping it.

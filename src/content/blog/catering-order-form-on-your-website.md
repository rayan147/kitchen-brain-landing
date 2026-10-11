---
title: "How to put a catering order form on your own website"
description: "Add your site to the list, send your web person two lines and a note, go live, and check the form showed up. Plus what to do when it doesn't."
publishedDate: 2026-10-08
category: Running the event
menuGroup: Plan and buy
menuIcon: web
featured: false
order: 15
readMinutes: 5
featureHref: /features/online-ordering
featureLabel: See how online ordering works
---
<!-- story: docs/stories/blog-catering-order-form-on-your-website.story.md -->

Your website has a catering page. It has a photo of a grazing table, a PDF menu from two summers ago, and "call us to order." Clients do call, mid-service, and you take the order on the back of a ticket.

That page can take the order itself. CostCook gives you an order form that sits on your own site, under your own heading, and sends each request to Orders already priced. Your web person pastes two lines. You never touch the code.

## Before you start

You need to be the owner or a manager, with one menu already priced in CostCook. Know who looks after your website, and the exact address your site opens on. Type it into your browser and copy what the address bar shows, `www` or not.

Everything here is in **Settings > Integrations**. Press **Manage storefront** on the Ordering site card. It saves as you type.

## Step 1: Get it ready to go live

**Go live** stays grey until these are true. The app lists whatever is missing:

- Pickup or delivery is on, and pickup has a place and an address.
- At least one menu is on the site.
- Every menu on the site has a price above $0.
- If clients pay by card through CostCook, Stripe is connected and can take cards.

Missing dish descriptions show up as suggestions. They don't stop you.

How the client pays is in **Setup**, and what your approval does is in your booking rules. Both are covered in [how to take catering orders online](/blog/take-catering-orders-online).

## Step 2: Add your website, exactly

Open the last tab, **Put on your website**. Under **Websites that will show it**, type your site's address and press **Add website**. The form only shows on sites in that list, up to 50.

The address has to match the one your pages open on. `www.yourkitchen.com` and `yourkitchen.com` count as two different sites. Add the address exactly as your address bar shows it, and if your site opens on both, add both. If you leave off the `https://`, the app adds it.

## Step 3: Send your web person the snippet

Under **Snippet for your web person** are two lines. With blanks where your kitchen's own values go, they look like this:

```html
<div id="order-here"></div>
<script src="…/ordering.js" data-site-id="…" data-target="#order-here" data-ordering-origin="…"></script>
```

Never retype it. Press **Copy snippet**, or **Email it to them**: your own mail app opens with the subject "Your ordering widget" and the snippet in it, and you add their address.

Add a few lines of your own so they don't have to ask:

```text
Please paste both lines on our catering page, where the order
form should appear. Paste them as code (an HTML or embed block),
not as text. The first line marks the spot. The second loads the
form in its own frame, with its own small stylesheet, so what
clients type into it stays out of the rest of the page.
Tell me when it's on, and which address the page opens on.
```

## Step 4: Go live, then check it showed up

Back in CostCook, press **Go live**. It asks you once to be sure. After that, clients can pick a menu and send a request, and each one lands in Orders for you to confirm.

Then open your catering page and load it once. Back on **Put on your website**, under the snippet, the app says where the form has been seen and when: **Seen on** your address, with the date. Until a page with the snippet has opened, it says **Not seen on any site yet**.

Then send yourself an order. Turn off automatic approval first, or your test approves itself as a real order, and under a pay rule emails you a pay link. Use your own email and pick a day you're open. Check that it lands in **Orders** with a **New online request** badge, then decline it so it doesn't sit there like a real job.

## If it doesn't show

- **The form says "Not taking online orders right now."** Nothing's wrong. You haven't pressed Go live yet, or someone pressed **Take offline**.
- **Under the snippet: "Blocked on" your address, "it isn't in your list."** The form was pasted on a site you didn't add, often the `www` one when you added the other. Press **Add it** next to the message.
- **Still "Not seen on any site yet."** Nobody has opened a page with both lines on it. Ask your web person which page they pasted into, and check both lines are there, the `<div>` and the `<script>`.

## Your link works without a website

If you don't have a website yet, the same tab has **Your link**, with **Copy** and a **QR code**. It opens the same form on a page of its own. You can choose its **Address name** too: 3 to 40 lowercase letters, numbers and hyphens.

Put the link in your email signature, in the text you send your regulars, and the QR code on the menu you leave at a lunch drop. Orders from it land in **Orders** the same way.

# Onboarding guide best practices for a post-setup "what next" page

Date: 2026-09-06
Scope: How well-regarded products structure "getting started" guide pages for a small-business owner who sets up first and then brings in staff, plus the reading and usability research behind those choices. Sources are first-party help centers and docs, or primary usability research (Nielsen Norman Group, GOV.UK). Secondary blog summaries were excluded.

Note on access: the 7shifts knowledge base returned HTTP 403 to direct fetches. Its claims below are quoted from search-engine snippets of the kb.7shifts.com pages and should be re-verified in a browser before being cited in copy.

---

## 1. How guides keep the reader oriented (checklists, milestones, done-markers)

**Toast, Self-Service Onboarding Guide.** A five-stage sequence (Your Setup Guide, Kickoff, Build + Install, Configuration Check-in, Go-Live) framed as "typically a 14-day process". The guide page mirrors an in-app checklist: "you can access this checklist at any time using the setup icon in the top right corner." Go-Live is the explicit finish line ("begin processing credit card payments"). A recap email after kickoff restates responsibilities.
https://support.toasttab.com/en/article/Self-Service-Guide

**Toast, Remote & Onsite Onboarding Guide.** Six named phases over 4 to 6 weeks: Kickoff Call, Build Your Back-End, Train Your Staff, Install Hardware, Go-Live, After You Go Live. Each phase lists what the owner is responsible for (for example "Assign an internal onboarding manager", "Add employees to the system", "Schedule staff for training and go-live"). Staff training is its own phase, after back-end build and before hardware install.
https://support.toasttab.com/en/article/Remote-Onsite-Onboarding-Guide

**Stripe, Go-live checklist.** A flat list of checkboxes whose state persists: "As you complete each item and check it off, the state of each checkbox is stored within your browser's cache. You can refer back to this page at any time to see what you've completed so far." It also scopes itself by reader: "If you're using Stripe through a connected website or a plug-in, most won't apply."
https://docs.stripe.com/get-started/checklist/go-live

**Square, Set up your food & beverage business.** Five ordered steps: select hardware, verify identity and link bank, create a menu, set up the point of sale, download the app. Opens with a prerequisite ("Make sure you have an active Square subscription") and closes with "next" resources (dining options, floor plans, tickets). Employee access is handled by a shared 12-digit device code or individual sign-in, linked out rather than inlined.
https://squareup.com/help/us/en/article/6407-get-started-with-square-for-restaurants

**meez, Getting started on meez.** Four numbered steps with concrete quantities that double as done-markers: "Build your Recipes" (create 3 recipes including a sub-recipe), "Cost a Recipe", "Add Three Recipe Books", "Add Your Team". The count ("3 recipes", "three recipe books") tells the reader exactly when a step is complete.
https://intercom.help/getmeez/en/articles/5761352-getting-started-on-meez

**Linear, Start Guide.** Topic sections (Overview and demo, Create a workspace, Getting the most out of Linear, Video resources, Learn from real examples) with a "start here if you want to understand the layout" pointer, but no checklist and no completion markers. Useful as a counter-example: the reader is never told what "done" is.
https://linear.app/docs/start-guide

**Slack, Getting started for workspace creators.** Three phases in a fixed order: Customize your workspace, Create channels, Invite people and get them up to speed. Each phase gives exactly three concrete actions (three channel types, three customization items).
https://slack.com/help/articles/115004378828-onboard-your-company-to-slack-

**Shopify, Initial setup.** Four numbered sign-up steps followed by an "In this section" task list of 14 linked topics. No staff-account guidance on the page.
https://help.shopify.com/en/manual/intro-to-shopify/initial-setup

Takeaway: the guides that keep a reader oriented share four devices. Numbered phases with names. A stated total duration. A per-phase "you are responsible for" list. A named finish line (Go-Live, first schedule published, three recipes costed).

---

## 2. "What next?" and "how do I bring in my team?" on a guide page

**Setup-then-invite is the near-universal order.** Slack (invite is phase 3 of 3), Notion (invite is phase 2 of 4, "once your initial top-pages are up"), meez (invite is step 4 of 4), Toast (Train Your Staff comes after Build Your Back-End). The owner builds a skeleton the team can recognize before anyone else is let in.
https://www.notion.com/help/guides/how-to-set-up-your-notion-workspace-for-your-team
https://slack.com/help/articles/115004378828-onboard-your-company-to-slack-

**Role-split guide series.** 7shifts publishes parallel tracks: "Getting Started for Admins" (Add Your Staff), "Getting Started for Managers", and "7shifts 101: How to get started as an Employee". Each role gets its own short path rather than one long page.
https://kb.7shifts.com/hc/en-us/articles/31119735342227-Add-Your-Staff-Getting-Started-for-Admins
https://kb.7shifts.com/hc/en-us/articles/4417514273427-7shifts-101-How-to-get-started-as-an-Employee

**Day 7 / Day 30 framing with one activation milestone.** 7shifts "Your First 30 Days": "Your first schedule can be live in 7shifts within 7 days, and your full operation up and running within 30 days." The activation milestone is "assigning your team to departments and roles, sending shift invites, and publishing your first live schedule". Two sequencing rules matter for a kitchen: assign roles before sending invites "so their schedule view is correct when they log in for the first time", and "you don't need 100% activation before publishing your first schedule" so "prioritize activation for employees scheduled in the first week."
https://kb.7shifts.com/hc/en-us/articles/4417519871763-Your-First-30-Days-in-7shifts-What-to-Expect
https://kb.7shifts.com/hc/en-us/articles/50715987466899-Send-7shifts-Invites-and-Confirm-Employee-App-Activation

**Permission tiers named plainly.** Notion (Member, Membership admin, Workspace owner), meez (Viewer, Editor, Viewer-Manager, Editor-Manager, Owner), Basecamp (employee, outside collaborator, client). Every guide says who can invite and what a non-admin cannot do.
https://3.basecamp-help.com/article/699-inviting-people-to-your-account

**Owner named as internal lead.** Toast asks the owner to "Assign an internal onboarding manager" at kickoff and to "Ensure staff attendance at training sessions." Slack suggests "think of a few people to be Workspace Admins who can help ... as you're getting the rest of the team on board." xtraCHEF invites "anyone who will be hands-on with the xtraCHEF platform" to the kickoff call.
https://support.toasttab.com/en/article/xtraCHEF-Onboarding-Guide

**Training as a separate offer, not inline prose.** Basecamp offers three live classes (Intro, Become a Pro, Ask Us Anything); Toast has Toast Classroom plus a 60-minute session. The guide page links to training rather than embedding it.
https://5.basecamp-help.com/article/1071-live-classes

**Gap observed.** None of the guides surveyed states "what good looks like after 30 days" in outcome terms (for example, "every recipe costed, every order placed through the system"). 7shifts comes closest with "full operation up and running within 30 days." This is an opening: a plain, verifiable 30-day outcome statement would be differentiating and is consistent with the truth-pass rule.

---

## 3. Krug, Don't Make Me Think (Revisited), applied to a guide page

Chapter references follow the 3rd edition table of contents (Ch. 1 Don't make me think, Ch. 2 How we really use the Web, Ch. 3 Billboard Design 101, Ch. 4 Animal, Vegetable, or Mineral?, Ch. 5 Omit needless words, Ch. 6 Street signs and Breadcrumbs, Ch. 10 Mobile). Principles paraphrased, not quoted.
https://search.schlowlibrary.org/Record/425548/TOC
https://sensible.com/dont-make-me-think/

- **Self-evident over self-explanatory (Ch. 1).** Every step heading should be understandable without reading the paragraph under it. If a reader has to ask "is this for me?" or "is this step 2 or step 3?", the page has failed.
- **People scan, satisfice, and muddle through (Ch. 2).** Assume the reader will not read the intro, will click the first plausible link, and will not come back to learn the "right" way. Put the action in the first line of each step.
- **Billboard design (Ch. 3).** Clear visual hierarchy, conventions kept, page broken into clearly defined areas, obvious clickables, low noise. For a guide: one visual treatment for "do this now" links, another for "read later" links, never mixed.
- **Mindless choices (Ch. 4).** Readers do not mind several clicks if each click is unambiguous. Prefer three obvious forks ("I cook", "I buy", "I own the place") over one clever composite page.
- **Omit needless words (Ch. 5).** Cut half the words, then half again. Kill "happy talk" (welcome paragraphs, praise for the product) and instructions that explain what a button obviously does.
- **Street signs and breadcrumbs (Ch. 6).** A reader who lands from search on step 4 should know what site they are on, which guide, which step, and how far along. The trunk test: cover the page, uncover it, and check that site name, page name, section, local navigation and "you are here" are all visible.
- **Mobile (Ch. 10).** Small screens force prioritization; do not hide the essentials behind a hamburger, and keep tappable areas large.

---

## 4. Mobile-first, skeptical, time-poor readers

- **Scanning dominates.** NN/G found 79% of test users scanned any new page; 16% read word by word. Concise text alone improved measured usability 58%, scannable layout 47%, objective (non-promotional) language 27%, and all three combined 124%. The study notes promotional language "imposes a cognitive burden" because readers must filter hype to find facts.
  https://www.nngroup.com/articles/how-users-read-on-the-web/
- **F-pattern.** First lines and the first words of each line get the most fixations; put the most informative words first in headings and the key point in the first two paragraphs. The pattern persists on phones, where line wrapping shifts which words get seen.
  https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
- **Mobile comprehension is equal but costs more effort.** NN/G's replication found no practical comprehension difference between phone and desktop, but readers slowed by about 30 ms per word on hard content and re-read to compensate. Recommendation: keep it brief, and remember most mobile reading happens with fragmented attention.
  https://www.nngroup.com/articles/mobile-content-is-twice-as-difficult/
- **Chunking.** Short paragraphs, 50 to 75 character lines, headings with contrast, bold keywords, numbered lists, summary lines, and whitespace between chunks. NN/G warns against misusing Miller's "7 plus or minus 2" to cap menu length.
  https://www.nngroup.com/articles/chunking/
- **One thing per page.** GOV.UK's reasons: readers understand what is asked, focus on one thing, find their way through an unfamiliar process, it works on mobile, errors are easy to recover from, and answers can be saved per step. The Design System notes the Carer's Allowance team removed a 12-step progress bar "with no effect on completion rates or times", so progress signals are optional, not load-bearing.
  https://www.gov.uk/service-manual/design/form-structure
  https://design-system.service.gov.uk/patterns/question-pages/
- **Reduce cognitive load: structure, transparency, clarity, support.** Tell the reader up front how long it takes and what they need in hand; use single-column layout; use plain, positive wording; give examples.
  https://www.nngroup.com/articles/4-principles-reduce-cognitive-load/
- **Upfront tutorials underperform.** NN/G: tutorials pushed before use "don't result in better task performance"; help works when it appears as the user acts. For a guide page this argues for short "do this now" steps that link into the app rather than long explanations.
  https://www.nngroup.com/articles/onboarding-tutorials/

---

## 5. How kitchen tools sequence first setup and staff rollout

| Product | Setup order (first-party guide) | Staff onboarding |
|---|---|---|
| Galley | Terminology and data structure, ingredients (USDA import, trim yields), units and conversions, locations, vendors and vendor items, cost (link vendor items to ingredients), categorize, recipes and sub-recipes with yields, menus | Not mentioned in getting-started |
| meez | 3 recipes incl. a sub-recipe, cost one recipe, 3 recipe books, add your team with permission level | Step 4, after recipes are costed |
| MarketMan | Inventory items with category, supplier, product code, size, price ("the backbone of your account"); count cadence: high-value daily, full weekly, dry goods monthly | Not in the items article |
| xtraCHEF (Toast) | Self-onboarding 15 to 30 min (activate, locations, add users, accounting, COGS mapping, upload 10+ invoices), kickoff call, activation, wrap-up; then Pro track adds inventory training (60 min) and recipe training (60 min); "a few weeks to 90 days" | Users added in step 1; "invite anyone who will be hands-on" to kickoff |
| Toast POS | Kickoff, build back-end (employees, taxes, menu), train staff, install hardware, go-live, after go-live; 4 to 6 weeks (14 days self-serve) | Dedicated "Train Your Staff" phase, 60-min session |
| 7shifts | Sign up, add staff, assign departments and roles, send invites, build and publish first schedule (day 7), full operation by day 30 | Invite after roles assigned; activate first-week staff first |
| Square for Restaurants | Hardware, identity and bank, menu, POS setup, app | Device code or individual login; team members linked out |

Sources:
https://support.galleysolutions.com/how-do-i-get-started-with-galley
https://intercom.help/getmeez/en/articles/5761352-getting-started-on-meez
https://marketman.zendesk.com/hc/en-us/articles/206819195-Inventory-Items-The-backbone-of-your-MarketMan-account
https://support.toasttab.com/en/article/xtraCHEF-Onboarding-Guide
https://support.toasttab.com/en/article/Remote-Onsite-Onboarding-Guide
https://kb.7shifts.com/hc/en-us/articles/31134884076563-Build-and-Publish-Your-First-Schedule
https://squareup.com/help/us/en/article/6407-get-started-with-square-for-restaurants

Pattern across the costing tools: ingredients and vendor prices before recipes, recipes before menus, and a tiny first target (one costed recipe, three recipes, ten invoices) rather than "enter everything." Staff come in only after the owner has something real for them to see.

---

## Patterns to adopt

1. Numbered, named phases with a stated total duration ("first order in a week, whole kitchen in 30 days") and one named finish line per phase.
2. A concrete, countable done-marker per step (meez: "3 recipes"; xtraCHEF: "10+ invoices"), so the reader never wonders whether they are finished.
3. Setup before invite: owner builds ingredients, suppliers, and a few costed recipes, then invites staff into something recognizable.
4. Invite in waves: whoever works this week first, not everyone at once (7shifts rule).
5. Assign the role before sending the invite so the first login already looks right.
6. Role forks on the page: owner, cook, buyer. Each fork is a short, separate path (7shifts admin / manager / employee tracks).
7. "You are responsible for" list per phase (Toast), written in imperative verbs.
8. Prerequisites up front: what to have in hand and how long the step takes (NN/G transparency).
9. Link into the app for the action, keep explanation short (NN/G: help works at the moment of use, not before).
10. Trunk test every step: guide name, step number, and next step visible without scrolling on a 390 px viewport.
11. Most informative word first in every heading; key point in the first line of every step (F-pattern).
12. One step per screen height on mobile; if the page must be long, each step is a self-contained chunk with its own heading.
13. Objective language only. No praise for the product, no "in one click". Verified usability gain and consistent with the truth pass.
14. A plain "what good looks like at day 30" statement that the app can actually deliver today. No surveyed competitor does this well.
15. Progress signals are optional; a persisted checkbox (Stripe) is a nice touch but GOV.UK removed a 12-step indicator with no loss.

## Anti-patterns to avoid

- Topic-organized guides with no ordering or finish line (Linear Start Guide, Shopify's 14-link task list).
- Happy talk and welcome paragraphs before the first action (Krug Ch. 5; NN/G promotional-language penalty).
- Inviting the whole team into an empty account, or before roles are set.
- Upfront tutorial walls (NN/G: no measured performance gain).
- Mixing "do this now" and "read later" links with the same visual treatment.
- Composite mega-pages that serve owner, cook, and buyer in one scroll; prefer mindless forks.
- Long-line paragraphs on mobile; anything past 75 characters a line or five lines a paragraph.
- Promising a 30-day outcome the app cannot yet deliver; if it is not shipped, it stays off the page.
- Hiding the "where am I" cues behind a hamburger on mobile (Krug Ch. 10; trunk test).
- Relying on the reader to remember an earlier step; restate the prerequisite inline.

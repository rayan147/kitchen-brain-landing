# A spreadsheet column on /compare

Owner request, 2026-09-05: *"lets add the spreadsheet here as well
http://localhost:4321/compare"*, following the homepage work in RC-56.

## What /compare is today

Four columns over 40 rows in five groups: **Capability · CostCook · Parsley ·
meez**. The whole page rests on one rule, stated in `src/lib/comparison.ts` and
enforced by `check-landing-claims.mjs`:

> The only defensible claim about another company's product is what their own
> pricing page says on a given day.

So a competitor cell is a tier and a price, or `Not listed`, and it never gets a
status glyph, because a glyph beside a hedge reads as a verdict. That rule is
RC-40. The homepage version of it is RC-47: no sentence may state what another
product cannot do.

The spreadsheet has no pricing page and no tiers. It cannot be a fourth product
column, and it must not become one.

## Decision: the column reports the reader's labor, not the tool's ability

A blank sheet does nothing. Anything a sheet holds, somebody built and now
maintains. That is true without exception and it is not a claim about software,
so it is the only thing this column may say.

**The cell vocabulary is closed, two values, both about the reader's hands:**

| Value | Cell reads | When |
|---|---|---|
| `build` | You build it | the row is structure and formula: costing, scaling, prep lists, par levels |
| `key` | You key it in | the row is data arriving or leaving by hand: the catalog, USDA figures, invoices, a purchase order typed into an email |

Rejected: any value meaning *a spreadsheet cannot do this*. A sheet can email,
a sheet can hold permissions, a sheet has an API. Every one of those would be
the same false claim refused on the homepage yesterday, shipped on the page
whose entire discipline is that no cell asserts a capability.

Where a row lands softly on the sheet, or where the sheet is the better answer,
the row says so in a `sheetNote` rather than acquiring a third value.
`Unlimited teammates` is the first: the file shares for free, and the note says
so while naming the part that is not free (two people in one cell).

## Decision: a fifth legend row, and its own hedge in every header

The legend has four rows and three marks. `Not listed` deliberately has no mark.
The spreadsheet column needs the same restraint and a **different** sentence,
because it hedges a different thing: not what a company published, but what the
reader would carry.

- Legend row, no mark: *what you would build and maintain yourself. It is not a
  statement about what a spreadsheet is able to do.*
- `<th>` sub-label repeating in all five groups: `what you would maintain`,
  beside the existing `their pricing page`.
- No `CellMark` in this column, ever. `check-landing-claims.mjs` already asserts
  the mark renders exactly twice and only for `row.costcook`; that assertion
  stays untouched and must still pass.

## Why a column CostCook "wins" on every row is honest here

`compare.astro` says **"THE PAGE IS NOT ALLOWED TO WIN EVERY ROW"**, and the
guard enforces a floor on CostCook `no` rows. This column reads `build` or `key`
on all 40, which looks like a clean sweep and is not one:

- It is a description of labor, not a scorecard. `You build it` is a real
  answer, and for a kitchen with one menu it is often the right one.
- On the three rows CostCook marks **No** (lot tracking, fine-grained screen
  permissions, several locations), `You build it` is the *better* cell. The
  sheet wins those three outright, and the page should not hide it.

Both arguments go in the component comment and in the ledger row, or the next
reader will read the column as marketing and be right to.

## Layout

The desktop table goes from four columns to five. Two documented constraints
apply, both already measured on this page:

- `compare.astro:150` — below `sm` the table is one card per row, because a
  four-column price table at 390px shears the tier names.
- `compare.astro:161` — the phone `<dl>` uses `flex-wrap` because `w-24` plus a
  value reached 410px in a 390px viewport at 200% text.

So: the phone path gains a fourth `<dl>` row and inherits the wrap fix. The
desktop table gains a `w-40` column inside the existing `overflow-x-auto`
wrapper, which scrolls rather than shears. Both are measured at 1440, 390, and
390 at 200% text before this is called done, and the page body may never scroll
sideways at any of them.

`rowCount`, `costcookYes` and `costcookNo` are derived and the prose reads
*"All {spell(costcookNo)} are marked No in the table."* Nothing here re-derives
them.

## Ledger

**RC-57, new.** Not an RC-56 extension: RC-56 is scoped to the homepage and
`/compare` is governed by RC-40. The row states the two-value contract, the
no-glyph rule, and the release check: read every spreadsheet cell and confirm
none asserts a capability.

## Guard

`check-landing-claims.mjs`:
- RC loop bound 56 -> 57.
- Every row in `comparison.ts` carries a `sheet` value, and every value is one
  of the two. A new row without one fails the build.
- The two cell strings are pinned, so the vocabulary cannot quietly grow.
- The legend row and the `<th>` sub-label are pinned.
- No `CellMark` bound to `row.sheet`, the same assertion already protecting the
  competitor cells.
- The existing two-`CellMark` count still passes untouched.

`check-dist.mjs`: the emitted `/compare` HTML carries five header cells per
group table and a spreadsheet cell on every row. Source pins prove the strings
are written; only a dist read proves they render.

Every gate gets a mutation test.

## Story

`docs/stories/compare.story.md` is revised in place, per the skill's rule that a
revision updates the same tracker. The page keeps its existing snap line.

## Verification

1. `npm run check`
2. Mutation battery over every new gate
3. `npm run build`
4. Browser measurement of `/compare` at 1440x900, 390x844, and 390 at 200%
   text: no body overflow, no sheared cell, five columns present
5. Read the page

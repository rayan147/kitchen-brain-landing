---
title: "Import your invoices, recipes and ingredient list: what CostCook needs, and what happens"
description: "Your first week in CostCook starts with paperwork: a supplier invoice, an ingredient spreadsheet, a binder of recipe cards. What each import needs, the order that saves you work, and what you check before anything is saved."
publishedDate: 2026-10-12
category: Buying & suppliers
menuGroup: Plan and buy
menuIcon: invoice
featured: false
order: 22
readMinutes: 7
featureHref: /features/invoices-and-price-list-import
featureLabel: See imports staged for review in CostCook
---
<!-- story: docs/stories/blog-import-invoices-recipes-ingredient-lists.story.md -->
<!-- Read off kitchen-brain main ed6ff5f01 and develop 6450d7c54 on 2026-10-12 (RC-79).
     Every label and limit below is on both. Do not add develop-only wording (the
     late-invoice price hold, the column-mapper subtitles) until main carries it. -->

It's your first week in CostCook, and the paperwork is on the pass. Last Tuesday's Harbor Foods invoice. The produce company's order guide, saved as a spreadsheet. A binder of recipe cards, some typed, some in pencil.

You could type all of it in. Or you can bring each one in as it is, check what CostCook read, and save only what you've checked.

This guide covers all three imports: what each one needs from you, what happens on screen, and the order that saves you the most work. The kitchen is Harbor & Hearth Catering, and the documents are illustrative.

## Before you start

- **Who can import.** The workspace owner and managers. Staff don't see prices, so imports are closed to them.
- **Where.** Open **Import and review**. The first question is "What are you bringing in?", with four answers: **Recipe**, **Price sheet**, **Ingredient list** and **Invoice**.
- **What it takes.** A photo, a PDF, a CSV or Excel file, a Word document (DOCX), or pasted text. Recipes can also come from a web link. Invoices are the exception: **PDF or photo** only.

Nothing you bring in is saved until you review it and press the final button. Until then you can discard it, and the original files go with it.

## Do it in this order

**Ingredients first, recipes last.**

Every line of a recipe has to point at an ingredient. When the ingredient is already in CostCook, the line can match it. When it isn't, you create it right there, and a new ingredient needs a pack, a pack size and a price before it's saved. The app is blunt about why: "an ingredient with no price can't be costed."

So a recipe imported into an empty kitchen turns every line into a question. A recipe imported after the invoice and the ingredient list mostly matches what's already there, and the questions are the few things you've never bought.

1. The ingredient list or order guide, for the things you buy.
2. Recent invoices, for what you actually paid.
3. Recipes, once their ingredients are there to match.

## Import an ingredient list

Choose **Ingredient list** and add the file, a photo of the written list, or paste it. The progress on the card reads "Reading ingredients and matching your catalog", then "Held for your review".

**What each ingredient needs before it can be added:**

- **A name**, and how it's measured: a weight, a volume, or each.
- **A pack label**, like "case 6 × #10" or "25 lb sack".
- **What the pack contains**, as a number and a unit.
- **A cost above $0.**

Supplier and category are optional. Trim yield starts at 100%, so set it later on anything you trim.

On **Review ingredients**, fix any row that's short a pack or a price. If the list repeats things you already have, the review offers to skip them. Then **Add all** saves every row that's ready, and **Save changes** keeps one row's edits for later.

A photo works for a written list or a readable label. The app says what it can't do: "Photos of loose food cannot supply quantities or prices."

**If your list is already a clean spreadsheet**, there's a second door. From **Import and review**, open **Map supplier columns**, and follow the link to **Ingredients CSV import**. There, **Download the template**, fill it in, and keep its header exactly as it is:

```text
name,baseUnit,category,supplier,densityGPerMl,unitWeightG,packName,packSizeQty,packSizeUnit,packCost
```

It takes up to 1,000 rows. This door has no review screen. **Add these ingredients** adds every valid row straight away, and anything wrong is listed under **Rejected rows**, with the reason, for you to fix and import again.

## Import a supplier invoice

Choose **Invoice** and add the PDF, or take a photo of each page. Check your photos before they go: "Check that you can read the small print. Include quantities and totals."

Then read it, and open the review. You'll be asked for four things before it can be saved:

- **The supplier.** Pick Harbor Foods from your suppliers, or create it as the invoice is imported.
- **A home for every line.** Match it to an ingredient, create a new one, or exclude the line on purpose, like a pallet deposit.
- **Any quantity or price it was unsure of**, confirmed by you.
- **The printed total.** If the lines don't add up to it, CostCook says by how much.

It also needs an invoice number. If none can be found, it stops and tells you.

Then press **Import invoice and update costs**. That records each line as a purchase, and your ingredients' current costs follow the purchases. The result says how many purchases were created and how many costs changed.

Bringing the same invoice in twice is stopped: "This appears to duplicate invoice" with its number. Uploading the same file twice is caught too, with a link to the earlier copy.

**One requirement to know:** an invoice that arrives as a spreadsheet goes to price-sheet review instead, the same as a supplier's price list. It updates prices you choose to apply, and it doesn't log a purchase. If you want it on the books as a purchase, import the PDF.

## Import recipes

Choose **Recipe**. Recipes come in the most ways: a photo of the card, a PDF, a Word file, pasted text, a spreadsheet, or **Paste a link** to a recipe page, which must start with https://.

The review screen says "Nothing goes into your catalog until you finish this review." Each line shows where it stands: **Matched**, **New ingredient** or **Needs review**. Before the recipe can be created, every line needs:

- **An ingredient.** Match it or create a new one, with the pack and price a new one always needs.
- **A unit CostCook knows**, like g, kg, ml, l or each.
- **For a sub-recipe**, like the braise inside the short rib plate: what one batch makes, as a quantity and a unit.

When many lines need the same kind of answer, one button answers them all at once. **Finish later** keeps your decisions. Then **Create recipe**, or **Import reviewed recipes** when one file held several.

If a recipe with the same name already exists, you choose: update the one you have, or create a separate recipe.

A recipe you import goes straight into your recipes, costed, not into a drafts pile. That's why the review comes first.

## When something can't be read

Pencil in a margin, a coffee ring, a crease across the quantities. What CostCook couldn't make out is listed under "Couldn't read", and the rest of the document still comes through.

You're not left guessing: retake those pages, or retype those lines, and import them on their own.

## Limits worth knowing

- **Files** up to 3.5 MB each. **Photos** up to 12 MB, and up to 6 photos make one document. Keep separate documents as separate items.
- **PDFs** up to 50 pages.
- **Pasted text** up to 20,000 characters.
- **Excel**: only the first tab is read, and CostCook names the tabs it left out. Save each one as its own file.
- **A batch** holds up to 100 documents. Stay on the page while they're read: anything not yet read is lost if you leave.

## Before you save, and after

Before the final button, you can always back out. **Discard import** throws away the staged recipes, any new ingredients prepared in it and the original files. Ingredients already in your catalog stay.

After it, there's no undo button. A saved import reads "Nothing on it can change here." You correct things where they now live: edit the recipe or the ingredient, or fix the purchase in **Purchases**.

## Friday, after the first week

- Harbor Foods' invoice is in as purchases, at the prices you paid, matched line by line.
- The produce order guide is in as ingredients, each with a pack and a price.
- The binder is in as recipes, costed from those ingredients, with the pencilled lines retyped and checked.
- Nothing went in that you didn't look at first.

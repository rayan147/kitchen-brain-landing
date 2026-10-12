---
title: "How to import your ingredients, invoices and recipes into CostCook"
description: "A step-by-step guide: import your ingredient list, then your supplier invoices, then your recipes. What you need before you start, every step on screen, and what to do when something goes wrong."
publishedDate: 2026-10-12
category: Buying & suppliers
menuGroup: Plan and buy
menuIcon: invoice
featured: false
order: 22
readMinutes: 6
featureHref: /features/invoices-and-price-list-import
featureLabel: See imports staged for review in CostCook
---
<!-- story: docs/stories/blog-import-invoices-recipes-ingredient-lists.story.md -->
<!-- Read off kitchen-brain main ed6ff5f01 and develop 6450d7c54 on 2026-10-12 (RC-79).
     Every label and limit below is on both. Do not add develop-only wording (the
     late-invoice price hold, the column-mapper subtitles) until main carries it.
     Written as a how-to (owner, 2026-10-12): numbered steps, one action each,
     explanation kept out of the steps. -->

By the end of this guide, your ingredients, your supplier invoices and your recipes will be in CostCook, and your recipes will be costed.

You do it in three parts, in this order:

1. **Ingredients**: the things you buy.
2. **Invoices**: what you paid for them.
3. **Recipes**: what you make from them.

Do recipes last. Every recipe line has to match an ingredient that's already in CostCook. If it isn't there, you have to create it on the spot, with a pack and a price.

## Before you start

You need:

- **An owner or manager login.** Staff can't import.
- **Your ingredient list.** A spreadsheet, a PDF, or a photo of a written list.
- **Your supplier invoices**, as a PDF or a photo. A spreadsheet invoice won't record a purchase (see Part 2).
- **Your recipes.** Photos of the cards, PDFs, Word files, a spreadsheet, or a link to a recipe page.

Nothing is saved until you press the save button at the end of each review. Until then you can throw it away.

## Part 1: Import your ingredient list

1. Open **Import and review**.
2. Under "What are you bringing in?", choose **Ingredient list**.
3. Add your list with **Choose files**, **Take photo** or **Paste text instead**. If you took photos, press **Add document to queue**.
4. Press **Extract sources**. The card shows "Reading ingredients and matching your catalog", then "Held for your review".
5. Press **Review** on the card. You'll see **Review ingredients**, one row per ingredient.
6. Check each row. Every ingredient needs:
   - a **name**, and whether it's measured by weight, volume or each;
   - a **pack label**, like "case 6 × #10" or "25 lb sack";
   - **what the pack contains**, a number and a unit, like 25 lb;
   - a **cost** above $0.
7. Fix any row the app flags. If the list has things you already have, choose to skip them.
8. Press **Add all**. Your ingredients are saved.

**Tip:** a photo works for a written list or a readable label, not a photo of the food. The app says so: "Photos of loose food cannot supply quantities or prices."

### Optional: use the CostCook template instead

If you'd rather fill in a spreadsheet yourself:

1. On **Import and review**, open **Map supplier columns**.
2. Follow the link to **Ingredients CSV import**.
3. Press **Download the template** and fill it in. Don't change the first row:

```text
name,baseUnit,category,supplier,densityGPerMl,unitWeightG,packName,packSizeQty,packSizeUnit,packCost
```

4. Upload it and press **Add these ingredients**.

This route has **no review screen**. Every correct row is saved at once. Rows with a problem are listed under **Rejected rows** with the reason. Fix those and upload them again. The template takes up to 1,000 rows.

## Part 2: Import a supplier invoice

1. Open **Import and review** and choose **Invoice**.
2. Add the invoice: **Choose files** for a PDF, or **Take photo** for each page, then **Add document to queue**. Check that the small print, quantities and totals are readable in your photos.
3. Press **Extract sources**, then **Review** on the card. You'll see **Review extracted records**.
4. **Choose the supplier.** Pick it from your list, or create it here.
5. **Give every line a home.** Match it to an ingredient, create a new ingredient, or exclude the line (a pallet deposit, for example).
6. **Confirm anything CostCook was unsure of**, like a quantity or a price.
7. **Confirm the printed total.** If the lines don't add up to it, CostCook shows the difference.
8. Press **Import invoice and update costs**.

You'll see "Invoice imported", how many purchases were recorded, and how many ingredient costs changed.

**Got the invoice as a spreadsheet?** It goes to price-sheet review instead. That updates the prices you choose, but it doesn't record a purchase. To record the purchase, import the PDF or a photo.

## Part 3: Import your recipes

1. Open **Import and review** and choose **Recipe**.
2. Add the recipe with **Choose files**, **Take photo**, **Paste text instead**, or **Paste a link** to a recipe web page (the link must start with https://). If you took photos, press **Add document to queue**.
3. Press **Extract sources**, then **Review** on the card.
4. Look at each line. It shows **Matched**, **New ingredient** or **Needs review**.
5. For each line that isn't **Matched**:
   - match it to one of your ingredients, or create a new one (a new one needs a pack, a pack size and a price);
   - pick a unit if CostCook asks: g, kg, ml, l or each.
6. If the recipe uses a sub-recipe, like a sauce or a braise, enter what one batch makes: a quantity and a unit.
7. Press **Create recipe**. If the file held several recipes, press **Import reviewed recipes**.

The recipe is saved and costed straight away. It doesn't go into a drafts folder.

**Tip:** if a recipe with the same name already exists, CostCook asks whether to update it or create a separate recipe.

**Tip:** not finished? Press **Finish later**. Your decisions are kept.

## If something goes wrong

| What you see | What to do |
|---|---|
| "Couldn't read" and a list of items | Retake those pages, or retype those lines, and import them on their own. The rest of the document still comes through. |
| "Cost must be more than $0" | Add the pack price. An ingredient without a price can't be costed. |
| "Pack label is required" | Name the pack, like "case 6 × #10". |
| "Not a recognized unit" | Use g, kg, ml, l or each. |
| "This appears to duplicate invoice" | That invoice is already imported. Don't import it again. |
| "No invoice number could be identified." | Retake the photo so the invoice number is readable. |
| A file "is too large" | Photos can be up to 12 MB, other files up to 3.5 MB. |
| Only part of your Excel file came in | Only the first tab is read. Save each other tab as its own file. |
| "Header must be exactly" (template) | Download the template again and paste your rows under its first row. |

## Limits

- **Photos:** up to 12 MB each, and up to 6 photos per document.
- **Other files** (PDF, spreadsheet, Word): up to 3.5 MB each. PDFs up to 50 pages.
- **Pasted text:** up to 20,000 characters.
- **One batch:** up to 100 documents. Stay on the page until they're read, or the unread ones are lost.

## Undo and changes

**Before you save:** press **Discard import** (or **Discard list** for an ingredient list). The staged rows and the uploaded files are deleted. Nothing in your catalog changes.

**After you save:** there's no undo. Change things where they now live: edit the recipe or the ingredient, or correct the purchase in **Purchases**.

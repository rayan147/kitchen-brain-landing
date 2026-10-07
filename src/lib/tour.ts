/** Product tour content. story: docs/stories/product-tour.story.md */
import { featureMenuHref, featureMenuSections } from './features';
import { labelsAvailability } from './labels';
import { inboxLimits, invoiceEmailAvailability } from './invoice-email';
import { acceptanceBoundary, depositMethodsCapital, eventStep } from './events';

export const tourSeedKey = 'product-tour-connected-event';

export type TourMetric = {
	label: string;
	value: string;
	note?: string;
	tone?: 'plain' | 'good' | 'attention';
};

export type TourStop = {
	id: string;
	icon?: 'sage';
	featureId: string;
	label: string;
	appArea: string;
	title: string;
	intro: string;
	callout: string;
	featureHref: string;
	metrics: readonly TourMetric[];
	columns: readonly string[];
	rows: readonly (readonly string[])[];
	aside: {
		title: string;
		status?: string;
		lines: readonly { label: string; value: string; tone?: 'plain' | 'good' | 'attention' }[];
		footnote: string;
	};
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});
const formatCurrency = (value: number) => currencyFormatter.format(value);
const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

const recipeCostingInputs = {
	chickenUsedKg: 7.8,
	chickenUsableYield: 0.91,
	chickenPackKg: 10,
	chickenPackPrice: 127.66,
	otherIngredientCosts: [24.86, 9.84, 20.04],
	portions: 24
} as const;

const chickenPurchasedCostPerKg = roundMoney(recipeCostingInputs.chickenPackPrice / recipeCostingInputs.chickenPackKg);
const chickenUsableCostPerKg = roundMoney(chickenPurchasedCostPerKg / recipeCostingInputs.chickenUsableYield);
const chickenLineCost = roundMoney(
	(recipeCostingInputs.chickenUsedKg / recipeCostingInputs.chickenUsableYield) *
	(recipeCostingInputs.chickenPackPrice / recipeCostingInputs.chickenPackKg)
);
const recipeCost = roundMoney(chickenLineCost + recipeCostingInputs.otherIngredientCosts.reduce((total, cost) => total + cost, 0));

export const tourRecipeCostingProof = Object.freeze({
	...recipeCostingInputs,
	chickenPurchasedCostPerKg,
	chickenUsableCostPerKg,
	chickenLineCost,
	chickenPlateShare: roundMoney(chickenLineCost / recipeCostingInputs.portions),
	recipeCost,
	perPortionCost: roundMoney(recipeCost / recipeCostingInputs.portions),
	invoiceTotal: roundMoney(830.96 + recipeCostingInputs.chickenPackPrice),
	purchaseOrderTotal: roundMoney(622.72 + recipeCostingInputs.chickenPackPrice)
});

// Considered Chain of Responsibility; not used because these are one fixed
// set of related arithmetic invariants, not handlers that selectively consume
// different request types.
const expectedRecipeProof = {
	chickenPackPrice: 127.66,
	chickenPurchasedCostPerKg: 12.77,
	chickenUsableCostPerKg: 14.03,
	chickenLineCost: 109.42,
	chickenPlateShare: 4.56,
	recipeCost: 164.16,
	perPortionCost: 6.84,
	invoiceTotal: 958.62,
	purchaseOrderTotal: 750.38
} as const;
const recipeProofHasDrifted = Object.entries(expectedRecipeProof).some(
	([key, expectedValue]) => tourRecipeCostingProof[key as keyof typeof expectedRecipeProof] !== expectedValue
);
if (recipeProofHasDrifted) {
	throw new Error('Product tour recipe-costing proof no longer reconciles.');
}

// Considered Strategy; not used because the tour stops vary as static,
// validated content data and share one rendering behavior. A strategy per stop
// would turn editorial variation into unnecessary implementations.
export const tourStops: readonly TourStop[] = [
	{
		id: 'recipes-costing',
		featureId: 'math',
		label: 'Recipes & food costing',
		appArea: 'Recipes / Herb roast chicken',
		title: 'Keep the working recipe and its cost on one record.',
		intro: 'Open the dish the kitchen will cook and follow its price from purchased weight through usable yield to one portion.',
		callout: 'The same 7.8 kg of chicken has to survive the recipe, the purchase order, and the back door.',
		featureHref: featureMenuHref('math'),
		metrics: [
			{ label: 'Recipe cost', value: formatCurrency(tourRecipeCostingProof.recipeCost) },
			{ label: 'Per portion', value: formatCurrency(tourRecipeCostingProof.perPortionCost) },
			{ label: 'Food cost', value: '30.4%', tone: 'good' },
			{ label: 'Batch yield', value: '24 portions' }
		],
		columns: ['Ingredient', 'Used', 'Usable yield', 'Cost'],
		rows: [
			['Chicken thigh', `${tourRecipeCostingProof.chickenUsedKg} kg`, `${tourRecipeCostingProof.chickenUsableYield * 100}%`, formatCurrency(tourRecipeCostingProof.chickenLineCost)],
			['Herb marinade', '1.1 kg', '100%', '$24.86'],
			['Lemon', '12 each', '82%', '$9.84'],
			['Pan jus', '1.4 L', '100%', '$20.04']
		],
		aside: {
			title: 'Cost path',
			status: 'Complete',
			lines: [
				{ label: 'Case', value: `${formatCurrency(tourRecipeCostingProof.chickenPackPrice)} / ${tourRecipeCostingProof.chickenPackKg} kg` },
				{ label: 'Usable cost', value: `${formatCurrency(tourRecipeCostingProof.chickenUsableCostPerKg)} / kg` },
				{ label: 'Plate share', value: formatCurrency(tourRecipeCostingProof.chickenPlateShare) },
				{ label: 'Missing prices', value: 'None', tone: 'good' }
			],
			footnote: '$164.16 ÷ 24 portions = $6.84. At a sample selling price of $22.50 per portion, food cost is 30.4%. Food only; labor and overhead are extra. This tour table is a preview.'
		}
	},
	{
		id: 'menus-quotes',
		featureId: 'menus',
		label: 'Menus & quotes',
		appArea: 'Menus / Garden wedding supper',
		title: 'Say the per-guest price with the food cost beside it.',
		intro: 'Choose dishes and portions, enter 180 guests and a selling price, then check food cost against your target.',
		callout: 'At 180 guests, one dollar per head is a $180 decision.',
		featureHref: featureMenuHref('menus'),
		metrics: [
			{ label: 'Guests', value: '180' },
			{ label: 'Price per guest', value: '$28.00' },
			{ label: 'Food cost', value: '29.6%', tone: 'good' },
			{ label: 'Quoted total', value: '$5,040.00' }
		],
		columns: ['Menu dish', 'Per guest', 'Event cost', 'Food cost'],
		rows: [
			['Herb roast chicken', '1 portion', '$1,231.20', '24.4%'],
			['Charred market vegetables', '180 g', '$128.88', '2.6%'],
			['Rosemary focaccia', '2 pieces', '$76.50', '1.5%'],
			['Citrus salad', '120 g', '$54.80', '1.1%']
		],
		aside: {
			title: 'Quote check',
			status: 'Ready to confirm',
			lines: [
				{ label: 'Menu food cost', value: '$1,491.38' },
				{ label: 'Revenue after food cost', value: '$3,548.62', tone: 'good' },
				{ label: 'Target food cost', value: '31.0%' },
				{ label: 'Room to target', value: '1.4 pts', tone: 'good' }
			],
			footnote: '$1,491.38 food cost ÷ $5,040 revenue = 29.6%. The 31% target leaves 1.4 percentage points. Revenue after food cost still needs to cover labor, overhead and profit. Confirming preserves this quote.'
		}
	},
	{
		id: 'ingredients-prices',
		featureId: 'ingredients',
		label: 'Ingredients & supplier prices',
		appArea: 'Ingredients / Chicken thigh, boneless',
		title: 'Keep the buying facts attached to the ingredient.',
		intro: 'Compare the current pack, usable yield, supplier offers, and every recipe that will move when the price changes.',
		callout: 'A cheaper case is not cheaper if the usable kilo costs more.',
		featureHref: featureMenuHref('ingredients'),
		metrics: [
			{ label: '10 kg pack', value: formatCurrency(tourRecipeCostingProof.chickenPackPrice) },
			{ label: 'Purchased cost', value: `${formatCurrency(tourRecipeCostingProof.chickenPurchasedCostPerKg)} / kg` },
			{ label: 'Usable cost', value: `${formatCurrency(tourRecipeCostingProof.chickenUsableCostPerKg)} / kg` },
			{ label: 'Recipes affected', value: '6', tone: 'attention' }
		],
		columns: ['Supplier offer', 'Pack', 'Effective', 'Usable cost'],
		rows: [
			['Harbor Foods', `10 kg · ${formatCurrency(tourRecipeCostingProof.chickenPackPrice)}`, 'Aug 27', `${formatCurrency(tourRecipeCostingProof.chickenUsableCostPerKg)} / kg`],
			['Northline Produce', '10 kg · $131.20', 'Aug 25', '$14.42 / kg'],
			['Metro Wholesale', '5 kg · $67.10', 'Aug 20', '$14.75 / kg']
		],
		aside: {
			title: 'Ingredient facts',
			status: 'Costable',
			lines: [
				{ label: 'Usable after trim', value: '91%' },
				{ label: 'Costing quantity', value: 'Before cooking' },
				{ label: 'Storage area', value: 'Walk-in 1' },
				{ label: 'Allergens', value: 'None', tone: 'good' }
			],
			footnote: 'The current price keeps its supplier and effective date.'
		}
	},
	{
		id: 'invoice-import',
		featureId: 'import',
		label: 'Invoices & price-list import',
		appArea: 'Import / Harbor Foods invoice 88421',
		title: 'Review the invoice before saving its prices.',
		intro: 'Keep the original invoice beside the extracted rows, then confirm exact matches and resolve the uncertain ones.',
		callout: 'Three doubtful rows wait. The other sixteen do not need typing twice.',
		featureHref: featureMenuHref('import'),
		metrics: [
			{ label: 'Invoice total', value: formatCurrency(tourRecipeCostingProof.invoiceTotal) },
			{ label: 'Rows read', value: '19' },
			{ label: 'Exact matches', value: '16', tone: 'good' },
			{ label: 'Needs review', value: '3', tone: 'attention' }
		],
		columns: ['Source line', 'Matched ingredient', 'Pack price', 'Status'],
		rows: [
			['CHK THIGH BNLS 10KG', 'Chicken thigh, boneless', formatCurrency(tourRecipeCostingProof.chickenPackPrice), 'Exact'],
			['LEMON 140CT', 'Lemon', '$38.00', 'Exact'],
			['MIXED HERB CS', 'Choose ingredient', '$27.80', 'Review'],
			['OIL EVOO 4X3L', 'Olive oil, extra virgin', '$92.16', 'Exact']
		],
		aside: {
			title: 'Original document',
			status: 'Review in progress',
			lines: [
				{ label: 'Supplier', value: 'Harbor Foods' },
				{ label: 'Invoice date', value: 'Aug 27, 2026' },
				{ label: 'Computed total', value: formatCurrency(tourRecipeCostingProof.invoiceTotal), tone: 'good' },
				{ label: 'Difference', value: '$0.00', tone: 'good' }
			],
			footnote: 'Four of 19 invoice rows are shown. The total includes all 19. In CostCook, review and save the records before they change your prices.'
		}
	},
	{
		/* RC-73, added 2026-09-28 with the feature page. It follows the import
		   stop because it is import's front door: the same Harbor Foods invoice
		   arrives by email and waits in the review the stop above shows. The
		   status reads the one word in src/lib/invoice-email.ts. */
		id: 'invoice-email',
		featureId: 'inbox',
		label: 'Invoice email',
		appArea: 'Purchases / Invoice inbox',
		title: 'See what became of every email your suppliers send.',
		intro: 'Suppliers send invoices to your kitchen’s private address. Each email is listed with what it became, and an invoice waits in review.',
		callout: 'A statement is kept, not imported. It repeats invoices you already have.',
		featureHref: featureMenuHref('inbox', invoiceEmailAvailability.isComing),
		metrics: [
			{ label: 'Availability', value: invoiceEmailAvailability.word, tone: invoiceEmailAvailability.isComing ? 'attention' : 'good' },
			{ label: 'Emails shown', value: '4' },
			{ label: 'Waiting in review', value: '2', tone: 'attention' },
			{ label: 'Not imported', value: '2' }
		],
		columns: ['From', 'Received', 'What it became', 'Next'],
		rows: [
			['Harbor Foods', 'Tue 9:14 AM', 'Invoice', 'Review'],
			['Valley Dairy', 'Tue 2:40 PM', 'Credit memo', 'Review'],
			['Harbor Foods', 'Wed 8:02 AM', 'Statement', 'Kept'],
			['Green Leaf Produce', 'Wed 11:30 AM', 'Order confirmation', 'Nothing to import']
		],
		aside: {
			title: 'Invoice email',
			status: invoiceEmailAvailability.word,
			lines: [
				{ label: 'Address', value: 'Private to your kitchen' },
				{ label: 'Message for your rep', value: 'Written for you' },
				{ label: 'Old address after a change', value: `${inboxLimits.graceDays} days` },
				{ label: 'Counts before review', value: 'Nothing', tone: 'good' }
			],
			footnote: invoiceEmailAvailability.isComing
				? 'Illustrative inbox. Invoice email is marked Coming: it is built and not receiving email for trial kitchens yet.'
				: 'Illustrative inbox. Set the address up in Settings > Invoice email.'
		}
	},
	{
		id: 'nutrition-allergens',
		featureId: 'nutrition',
		label: 'Nutrition facts & allergens',
		appArea: 'Recipes / Herb roast chicken / Nutrition',
		title: 'Keep the label numbers and allergen review on the recipe.',
		intro: 'See nutrition estimates per portion, review the ingredient sources and allergens, then use the recipe’s print action in CostCook.',
		callout: 'A blank nutrient stays blank. It never becomes a made-up zero.',
		featureHref: featureMenuHref('nutrition'),
		metrics: [
			{ label: 'Calories', value: '418 kcal' },
			{ label: 'Protein', value: '34.6 g' },
			{ label: 'Carbohydrate', value: '18.2 g' },
			{ label: 'Total fat', value: '22.8 g' }
		],
		columns: ['Ingredient profile', 'Recipe amount', 'Profile source', 'Status'],
		rows: [
			['Chicken thigh, cooked', '265 g', 'USDA reference', 'Linked'],
			['Herb marinade', '46 g', 'Recipe calculation', 'Complete'],
			['Pan jus', '58 ml', 'Recipe calculation', 'Complete'],
			['Lemon', '0.5 each', 'USDA reference', 'Linked']
		],
		aside: {
			title: 'Per-portion review',
			status: '15 of 15 present',
			lines: [
				{ label: 'Sodium', value: '612 mg' },
				{ label: 'Dietary fiber', value: '2.1 g' },
				{ label: 'Added sugars', value: '0 g' },
				{ label: 'Contains', value: 'Milk, soy', tone: 'attention' }
			],
			footnote: 'Illustrative tour values; nutrition is a calculated estimate and requires review for your use.'
		}
	},
	{
		/* RC-60, added 2026-09-09 with the capability's feature page. It follows
		   nutrition because it is the same question from the other end: nutrition
		   is what is in the dish, this is who is eating it. Every value is the
		   demo world's garden wedding, and the callout is the boundary, not a
		   feature: a stop that ended on "all clear" would be the one line on this
		   tour that promises something the product does not. */
		id: 'guest-restrictions',
		featureId: 'guards',
		label: 'Guests\u2019 restrictions',
		appArea: 'Orders / Garden wedding supper / Guests\u2019 restrictions',
		title: 'Check every dish against the guests who asked.',
		intro: 'Record who is eating by allergen or by diet, then read each dish back as conflict, check or clear with the ingredient that caused it named.',
		callout: 'An ingredient nobody reviewed is never clear. The order says how many are left.',
		featureHref: featureMenuHref('guards'),
		metrics: [
			{ label: 'Restrictions', value: '4' },
			{ label: 'Conflicts', value: '1' },
			{ label: 'Checks', value: '3' },
			{ label: 'Not reviewed', value: '4' }
		],
		columns: ['Dish', 'Restriction', 'Answer', 'Reason'],
		rows: [
			['Herb pesto', 'bride, Tree nuts', 'Conflict', 'Walnuts (contains)'],
			['Braised short rib', 'Halal', 'Check', 'Meat depends on the source'],
			['Roasted carrots', 'Gluten-free', 'Clear', 'Every ingredient reviewed'],
			['Garden salad', 'Vegan', 'Check', '2 ingredients not reviewed']
		],
		aside: {
			title: 'Checked at confirm',
			status: 'Frozen reading',
			lines: [
				{ label: 'Order', value: 'Garden wedding supper' },
				{ label: 'Checked', value: 'At confirm' },
				{ label: 'Later recipe edits', value: 'Original check kept', tone: 'attention' },
				{ label: 'Re-check', value: 'Saves a new check' }
			],
			footnote: 'Illustrative examples of restriction results; summary counts cover the whole order, beyond the rows shown. Clear means no conflict found in reviewed records. Your kitchen still checks the food and preparation.'
		}
	},
	{
		id: 'labels-printing',
		featureId: 'labels',
		label: 'Labels & printing',
		appArea: 'Prep / Garden wedding supper / Labels',
		title: 'Choose the date and allergen facts before a sticker prints.',
		intro: 'Labels start from the prep list. The cook settles the storage and use-by facts, then CostCook freezes what each sticker said for reprints.',
		callout: 'A label can repeat the date you chose. It cannot choose a food-safety date for you.',
		featureHref: featureMenuHref('labels', labelsAvailability.isComing),
		metrics: [
			{ label: 'Availability', value: labelsAvailability.word, tone: labelsAvailability.isComing ? 'attention' : 'good' },
			{ label: 'Containers', value: '24' },
			{ label: 'Output', value: 'Browser print dialog' },
			{ label: 'Reprint', value: 'Frozen record', tone: 'good' }
		],
		columns: ['Prep item', 'Storage', 'Use by', 'Confirmed allergens'],
		rows: [
			['Herb roast chicken', 'Refrigerated', 'Aug 31', 'Milk, soy'],
			['Charred market vegetables', 'Refrigerated', 'Aug 31', 'None confirmed'],
			['Rosemary focaccia', 'Room temperature', 'Aug 30', 'Wheat'],
			['Citrus salad', 'Refrigerated', 'Aug 30', 'None confirmed']
		],
		aside: {
			title: 'Label setup',
			status: labelsAvailability.word,
			lines: [
				{ label: 'Stock', value: '2 × 1 in roll' },
				{ label: 'Made on', value: 'Aug 29, 2026' },
				{ label: 'Use-by source', value: 'Cook chose', tone: 'attention' },
				{ label: 'Sticker count', value: '24' }
			],
			footnote: 'Output opens the browser print dialog; no direct printer connection is built. Label stock is set once in Settings > Labels.'
		}
	},
	{
		/* RC-61, RC-63, RC-65, added 2026-09-27 with the capability's feature
		   page. It opens the Run the event column, as it does in the Features
		   dropdown: the event starts at the inquiry, and the order stop after it
		   is what Confirm order hands the kitchen. Same illustrative world as the
		   menu stop (Garden wedding supper, 180 guests at $28.00). The deposit
		   is paid by card from an email link, or recorded by hand. */
		id: 'events-proposals',
		featureId: 'events',
		label: 'Events & proposals',
		appArea: 'Events / Garden wedding supper',
		title: 'Send the proposal, then book the yes.',
		intro: 'Take the inquiry, send the priced proposal to the client’s phone, and press Confirm order once they accept.',
		callout: acceptanceBoundary,
		featureHref: featureMenuHref('events'),
		metrics: [
			{ label: 'Guests', value: '180' },
			{ label: 'Price per guest', value: '$28.00' },
			{ label: 'Proposal total', value: '$5,040.00' },
			{ label: 'Client decision', value: 'Accepted', tone: 'good' }
		],
		columns: ['Step', 'Where it stands', 'What happened'],
		rows: [
			[eventStep.inquiry, 'Captured', 'Date first, details later'],
			[eventStep.proposal, 'Sent', 'Link open for 7 days'],
			[eventStep.decision, 'Accepted', 'On their phone, no login'],
			[eventStep.agreement, 'Complete', 'Accepted proposal attached'],
			[eventStep.booked, 'Confirm order', 'Quantities and prices frozen']
		],
		aside: {
			title: 'Deposit',
			// Card payment for event deposits is live (owner ruling 2026-10-06,
			// src/lib/event-payments.ts); this aside said Coming and contradicted
			// /compare and /faq (chef audit 2026-10-07).
			status: 'Card, by email link',
			lines: [
				{ label: 'Asked for', value: '$1,000.00' },
				{ label: 'Received', value: '$0.00', tone: 'attention' },
				{ label: 'Paid by', value: 'Card, from the email link' },
				{ label: 'Or record by hand', value: depositMethodsCapital }
			],
			footnote: 'Illustrative tour values. The client pays the deposit by card from an email link; you can still record a payment by hand.'
		}
	},
	{
		id: 'orders-plan',
		featureId: 'orders',
		label: 'Orders, shop, prep & pack',
		appArea: 'Orders / Garden wedding supper',
		title: 'Run shop, prep, and pack from the quote you confirmed.',
		intro: 'Confirm the order to work from shopping, prep and pack lists for 180 guests. Previously loaded pages stay readable offline; reconnect to save check-offs.',
		callout: 'One guest count. Three lists. No second round of typing.',
		featureHref: featureMenuHref('orders'),
		metrics: [
			{ label: 'Event', value: 'Sat, Aug 29' },
			{ label: 'Guests', value: '180' },
			{ label: 'Food cost', value: '$1,491.38' },
			{ label: 'Plan status', value: 'Confirmed', tone: 'good' }
		],
		columns: ['Plan item', 'Need', 'Ready', 'Working status'],
		rows: [
			['Chicken thigh, boneless', '58.5 kg', '48.5 kg', '10 kg to grab'],
			['Herb marinade', '8.3 kg', '8.3 kg', 'Ready'],
			['Rosemary focaccia', '360 pieces', '240 pieces', '1 batch in prep'],
			['Hot boxes', '6 each', '6 each', 'Packed']
		],
		aside: {
			title: 'Today’s plan',
			status: '36 of 42 checked',
			lines: [
				{ label: 'Shop', value: '10 of 12' },
				{ label: 'Prep', value: '18 of 22' },
				{ label: 'Pack', value: '8 of 8', tone: 'good' },
				{ label: 'Allergen notes', value: '4 visible', tone: 'attention' }
			],
			footnote: 'A changed plan clears only the check-offs it makes stale.'
		}
	},
	{
		id: 'purchasing-receiving',
		featureId: 'purchasing',
		label: 'Purchasing & receiving',
		appArea: 'Purchasing / PO-1047 / Receive',
		title: 'Compare what you sent with what came through the back door.',
		intro: 'Open the purchase order, record the delivered quantity, and keep the short line visible until someone handles it.',
		callout: 'The invoice says delivered. The back door says two kilos short.',
		featureHref: featureMenuHref('purchasing'),
		metrics: [
			{ label: 'Purchase order', value: 'PO-1047' },
			{ label: 'Ordered', value: formatCurrency(tourRecipeCostingProof.purchaseOrderTotal) },
			{ label: 'Received lines', value: '11 of 12' },
			{ label: 'Needs follow-up', value: '1', tone: 'attention' }
		],
		columns: ['Delivery line', 'Ordered', 'Received', 'Verdict'],
		rows: [
			['Chicken thigh, boneless', '10.0 kg', '8.0 kg', 'Short 2.0 kg'],
			['Lemon', '2 cases', '2 cases', 'Received'],
			['Extra virgin olive oil', '1 case', '1 case', 'Received'],
			['Mixed herbs', '1 case', '1 case', 'Received']
		],
		aside: {
			title: 'Save the delivery',
			status: 'Ready with warning',
			lines: [
				{ label: 'Purchase rows', value: '12' },
				{ label: 'Prices to update', value: '11' },
				{ label: 'Follow-up line', value: 'Chicken thigh', tone: 'attention' },
				{ label: 'Unexpected items', value: 'None', tone: 'good' }
			],
			footnote: 'Four of 12 delivery lines are shown. Save the reviewed delivery to record purchases and update eligible prices. Shortfalls stay visible for follow-up.'
		}
	},
	{
		id: 'inventory',
		featureId: 'inventory',
		label: 'Inventory',
		appArea: 'Inventory / Walk-in 1',
		title: 'Build the next shopping list from a count you can trust.',
		intro: 'Start with a stock count, then follow deliveries, waste and packed orders. Check the count date before using it to reduce a shopping list.',
		callout: '“Never counted” is an answer. Zero is a different one.',
		featureHref: featureMenuHref('inventory'),
		metrics: [
			{ label: 'Shelf value', value: '$3,842.18' },
			{ label: 'Fresh counts', value: '42', tone: 'good' },
			{ label: 'Stale counts', value: '6', tone: 'attention' },
			{ label: 'Never counted', value: '3', tone: 'attention' }
		],
		columns: ['Ingredient', 'On hand', 'Next need', 'Count trust'],
		rows: [
			['Chicken thigh, boneless', '48.5 kg', '58.5 kg', 'Fresh · 6:12 AM'],
			['Lemon', '164 each', '96 each', 'Fresh · 6:18 AM'],
			['Mixed herbs', '3.2 kg', '4.1 kg', 'Stale · Aug 22'],
			['Rosemary focaccia', '—', '360 pieces', 'Never counted']
		],
		aside: {
			title: 'Shopping gap',
			status: '7 lines to buy',
			lines: [
				{ label: 'Chicken thigh', value: '10.0 kg', tone: 'attention' },
				{ label: 'Mixed herbs', value: '4.1 kg · count first', tone: 'attention' },
				{ label: 'Trusted surplus', value: '5 lines', tone: 'good' },
				{ label: 'Refused estimates', value: '3' }
			],
			footnote: 'The summary covers all stock records; four are shown. Missing or stale counts do not reduce buying. For chicken, 58.5 kg needed − 48.5 kg on hand = 10 kg to buy.'
		}
	},
	{
		id: 'purchases-month-cost',
		featureId: 'ledger',
		label: 'Purchases & month cost',
		appArea: 'Purchases / August cost review',
		title: 'Name the month’s gap without guessing what caused it.',
		intro: 'Compare recipe-calculated food use for August with recorded purchases. Deduct recorded waste to see the amount still unexplained.',
		callout: 'The gap is evidence to review, not a waste number to blame on the crew.',
		featureHref: featureMenuHref('ledger'),
		metrics: [
			{ label: 'Planned food use', value: '$8,420.00' },
			{ label: 'Actual spend', value: '$8,891.40' },
			{ label: 'Difference to explain', value: '$471.40', tone: 'attention' },
			{ label: 'Inventory trust', value: 'Counted', tone: 'good' }
		],
		columns: ['Cost evidence', 'Amount', 'Source', 'Review'],
		rows: [
			['Attributed purchases', '$8,891.40', 'Purchase ledger', 'Complete'],
			['Theoretical usage', '$8,420.00', 'Confirmed orders', 'Complete'],
			['Logged waste', '$186.50', '7 signed entries', 'Explained'],
			['Still unaccounted', '$284.90', 'Month verdict', 'Review']
		],
		aside: {
			title: 'Price movement',
			status: '5 moved over 5%',
			lines: [
				{ label: 'Chicken thigh', value: '+7.2%', tone: 'attention' },
				{ label: 'Olive oil', value: '+5.8%', tone: 'attention' },
				{ label: 'Lemon', value: '−3.1%', tone: 'good' },
				{ label: 'Corrections', value: '2 signed' }
			],
			footnote: '$8,891.40 spent − $8,420 planned = $471.40. Subtract $186.50 recorded waste: $284.90 still needs checking. Price changes compare current and previous prices; three of the month’s ingredients are shown.'
		}
	},
	{
		id: 'team-access',
		featureId: 'team',
		label: 'Team & access',
		appArea: 'Settings / Team & access',
		title: 'See what each team role can do.',
		intro: 'Invite teammates by email. Owners, Managers and Staff have different actions; Staff can open recipe costs and Analytics. Invitations join as Staff.',
		callout: 'The cook can open the work. Publishing, billing, and approvals still have named owners.',
		featureHref: featureMenuHref('team'),
		metrics: [
			{ label: 'Owners', value: '1' },
			{ label: 'Managers', value: '2' },
			{ label: 'Staff', value: '8' },
			{ label: 'Open invites', value: '1', tone: 'attention' }
		],
		columns: ['Sensitive action', 'Owner', 'Manager', 'Staff'],
		rows: [
			['Manage billing', 'Allowed', 'Not allowed', 'Not allowed'],
			['Invite teammates', 'Allowed', 'Allowed', 'Not allowed'],
			['Publish recipes', 'Allowed', 'Not allowed', 'Not allowed'],
			['Approve Sage drafts', 'Allowed', 'Allowed', 'Not allowed']
		],
		aside: {
			title: 'Pending invitation',
			status: 'Joins as Staff',
			lines: [
				{ label: 'Teammate', value: 'Morgan Lee' },
				{ label: 'Invited by', value: 'Alex R' },
				{ label: 'Cost screens', value: 'Visible' },
				{ label: 'Custom screen rules', value: 'Not available', tone: 'attention' }
			],
			footnote: 'You cannot hide individual screens from selected teammates or create custom roles.'
		}
	},
	{
		id: 'sage',
		icon: 'sage',
		featureId: 'assistant',
		label: 'Sage, the assistant',
		appArea: 'Sage / Saturday event check',
		title: 'Ask the question, then inspect the records behind the answer.',
		intro: 'Sage checks your own CostCook records, names missing evidence, and keeps its drafts behind your approval.',
		callout: 'An answer without its source is just another number to recheck.',
		featureHref: featureMenuHref('assistant'),
		metrics: [
			{ label: 'Question', value: 'Saturday risk check' },
			{ label: 'Records checked', value: '7' },
			{ label: 'Needs attention', value: '2', tone: 'attention' },
			{ label: 'Changes made', value: 'None', tone: 'good' }
		],
		columns: ['Sage found', 'Evidence', 'Impact', 'Next action'],
		rows: [
			['Chicken delivery is 2 kg short', 'PO-1047 receiving', 'Saturday order', 'Open follow-up'],
			['Mixed-herb count is stale', 'Walk-in 1 count', 'Shopping gap', 'Count stock'],
			['Quote remains below target', 'Garden wedding menu', '29.6% food cost', 'No action'],
			['Allergen notes are present', '4 recipe profiles', 'Pack list', 'Review at pack-out']
		],
		aside: {
			title: 'Answer sources',
			status: 'Read-only check',
			lines: [
				{ label: 'Order', value: 'Garden wedding supper' },
				{ label: 'Purchase order', value: 'PO-1047' },
				{ label: 'Inventory area', value: 'Walk-in 1' },
				{ label: 'Drafts waiting', value: '0', tone: 'good' }
			],
			footnote: 'Sage drafts wait for a manager or owner to approve.'
		}
	}
];

const dropdownFeatureIds = featureMenuSections.flatMap((section) => section.items.map((item) => item.featureId));
const tourFeatureIds = tourStops.map((stop) => stop.featureId);

if (
	new Set(tourFeatureIds).size !== dropdownFeatureIds.length ||
	dropdownFeatureIds.some((featureId) => !tourFeatureIds.includes(featureId))
) {
	throw new Error('Product tour must include every Features dropdown destination exactly once.');
}

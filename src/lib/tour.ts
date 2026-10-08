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

// US units and a real plate (chef audit 2026-10-07): 8 oz of trimmed raw thigh
// a portion (about 6 oz cooked), so 12 lb for 24 portions, bought in 40 lb
// cases. The 91% trim yield is applied to everything bought downstream (the
// orders and inventory stops), not only to the cost.
const recipeCostingInputs = {
	chickenUsedLb: 12,
	chickenUsableYield: 0.91,
	chickenPackLb: 40,
	chickenPackPrice: 139.6,
	otherIngredientCosts: [8.4, 3.97, 6.3],
	portions: 24
} as const;

const chickenPurchasedCostPerLb = roundMoney(recipeCostingInputs.chickenPackPrice / recipeCostingInputs.chickenPackLb);
const chickenUsableCostPerLb = roundMoney(chickenPurchasedCostPerLb / recipeCostingInputs.chickenUsableYield);
const chickenLineCost = roundMoney(
	(recipeCostingInputs.chickenUsedLb / recipeCostingInputs.chickenUsableYield) *
	(recipeCostingInputs.chickenPackPrice / recipeCostingInputs.chickenPackLb)
);
const recipeCost = roundMoney(chickenLineCost + recipeCostingInputs.otherIngredientCosts.reduce((total, cost) => total + cost, 0));

export const tourRecipeCostingProof = Object.freeze({
	...recipeCostingInputs,
	chickenPurchasedCostPerLb,
	chickenUsableCostPerLb,
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
	chickenPackPrice: 139.6,
	chickenPurchasedCostPerLb: 3.49,
	chickenUsableCostPerLb: 3.84,
	chickenLineCost: 46.02,
	chickenPlateShare: 1.92,
	recipeCost: 64.69,
	perPortionCost: 2.7,
	invoiceTotal: 970.56,
	purchaseOrderTotal: 762.32
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
		title: 'The recipe you cook, with what it costs on the same page.',
		intro: 'Open the dish and follow the price from the case you bought, through the trim, down to one portion.',
		callout: 'The same 12 lb of chicken is in the recipe, on the purchase order and at the back door.',
		featureHref: featureMenuHref('math'),
		metrics: [
			{ label: 'Recipe cost', value: formatCurrency(tourRecipeCostingProof.recipeCost) },
			{ label: 'Per portion', value: formatCurrency(tourRecipeCostingProof.perPortionCost) },
			{ label: 'Food cost', value: '30.0%', tone: 'good' },
			{ label: 'Batch yield', value: '24 portions' }
		],
		columns: ['Ingredient', 'Used', 'Trim yield', 'Cost'],
		rows: [
			['Chicken thigh', `${tourRecipeCostingProof.chickenUsedLb} lb`, `${tourRecipeCostingProof.chickenUsableYield * 100}%`, formatCurrency(tourRecipeCostingProof.chickenLineCost)],
			['Herb marinade', '2.4 lb', '100%', '$8.40'],
			// $38.00 for a 140-count case (the invoice stop) is $0.27 a lemon;
			// 12 at 82% usable is $3.97.
			['Lemon', '12 each', '82%', '$3.97'],
			['Pan jus', '1.5 qt', '100%', '$6.30']
		],
		aside: {
			title: 'Cost path',
			status: 'Complete',
			lines: [
				{ label: 'Case', value: `${formatCurrency(tourRecipeCostingProof.chickenPackPrice)} / ${tourRecipeCostingProof.chickenPackLb} lb` },
				{ label: 'Usable cost', value: `${formatCurrency(tourRecipeCostingProof.chickenUsableCostPerLb)} / lb` },
				{ label: 'Plate share', value: formatCurrency(tourRecipeCostingProof.chickenPlateShare) },
				{ label: 'Missing prices', value: 'None', tone: 'good' }
			],
			footnote: '$64.69 ÷ 24 portions = $2.70. At a $9.00 selling price, food cost is 30.0%. Food only; labor and overhead are extra. This tour table is a preview.'
		}
	},
	{
		id: 'menus-quotes',
		featureId: 'menus',
		label: 'Menus & quotes',
		appArea: 'Menus / Garden wedding supper',
		title: 'Quote the price a head with the food cost right next to it.',
		intro: 'Pick the dishes and portions, put in 180 guests and a price, and see the food cost against your target.',
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
			['Herb roast chicken', '1 portion', '$485.17', '9.6%'],
			['Charred market vegetables', '6 oz', '$128.88', '2.6%'],
			['Rosemary focaccia', '2 pieces', '$76.50', '1.5%'],
			['Citrus salad', '4 oz', '$54.80', '1.1%']
		],
		aside: {
			title: 'Quote check',
			status: 'Ready to confirm',
			lines: [
				{ label: 'Menu food cost', value: '$1,491.38' },
				{ label: 'Revenue after food cost', value: '$3,548.62', tone: 'good' },
				{ label: 'Target food cost', value: '30.0%' },
				{ label: 'Room to target', value: '0.4 pts', tone: 'good' }
			],
			footnote: 'Four of the menu’s seven dishes are shown; the food cost covers all seven. $1,491.38 food cost ÷ $5,040 revenue = 29.6%. The kitchen’s 30% target leaves 0.4 percentage points. Revenue after food cost still needs to cover labor, overhead and profit. Confirming preserves this quote.'
		}
	},
	{
		id: 'ingredients-prices',
		featureId: 'ingredients',
		label: 'Ingredients & supplier prices',
		appArea: 'Ingredients / Chicken thigh, boneless',
		title: 'What you pay for chicken lives on the chicken.',
		intro: 'The pack you buy now, what is left after trim, what each supplier wants for it, and every recipe that moves when the price does.',
		callout: 'A cheaper case is not cheaper if the usable pound costs more.',
		featureHref: featureMenuHref('ingredients'),
		metrics: [
			{ label: '40 lb case', value: formatCurrency(tourRecipeCostingProof.chickenPackPrice) },
			{ label: 'Purchased cost', value: `${formatCurrency(tourRecipeCostingProof.chickenPurchasedCostPerLb)} / lb` },
			{ label: 'Usable cost', value: `${formatCurrency(tourRecipeCostingProof.chickenUsableCostPerLb)} / lb` },
			{ label: 'Recipes affected', value: '6', tone: 'attention' }
		],
		columns: ['Supplier offer', 'Pack', 'Effective', 'Usable cost'],
		rows: [
			['Harbor Foods', `40 lb · ${formatCurrency(tourRecipeCostingProof.chickenPackPrice)}`, 'Aug 27', `${formatCurrency(tourRecipeCostingProof.chickenUsableCostPerLb)} / lb`],
			['Coastal Meats', '40 lb · $143.20', 'Aug 25', '$3.93 / lb'],
			['Metro Wholesale', '20 lb · $73.80', 'Aug 20', '$4.05 / lb']
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
		title: 'Look the invoice over before its prices go in.',
		intro: 'The invoice sits next to the lines read off it. Confirm the ones that match and sort out the ones that do not.',
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
			['CHK THIGH BNLS 40LB', 'Chicken thigh, boneless', formatCurrency(tourRecipeCostingProof.chickenPackPrice), 'Exact'],
			['LEMON 140CT', 'Lemon', '$38.00', 'Exact'],
			['MIXED HERB CS', 'Choose ingredient', '$27.80', 'Review'],
			['OIL EVOO 4X1GAL', 'Olive oil, extra virgin', '$92.16', 'Exact']
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
			footnote: 'Four of 19 invoice rows are shown. The total includes all 19. In CostCook, nothing changes your prices until you review and save it.'
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
		intro: 'Suppliers send invoices to your kitchen’s own private address. Every email is listed with what it turned out to be, and an invoice waits for you to review it.',
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
		title: 'Nutrition and allergens, on the recipe.',
		intro: 'See the nutrition estimate per portion, check where each ingredient’s numbers came from and its allergens, then print from the recipe in CostCook.',
		callout: 'A blank nutrient stays blank. It never becomes a made-up zero.',
		featureHref: featureMenuHref('nutrition'),
		metrics: [
			// One portion: about 6 oz of cooked thigh plus marinade and jus.
			{ label: 'Calories', value: '498 kcal' },
			{ label: 'Protein', value: '44.6 g' },
			{ label: 'Carbohydrate', value: '5.2 g' },
			{ label: 'Total fat', value: '32.1 g' }
		],
		columns: ['Ingredient profile', 'Recipe amount', 'Profile source', 'Status'],
		rows: [
			['Chicken thigh, cooked', '6 oz', 'USDA reference', 'Linked'],
			['Herb marinade', '1.6 oz', 'Recipe calculation', 'Complete'],
			['Pan jus', '2 fl oz', 'Recipe calculation', 'Complete'],
			['Lemon', '0.5 each', 'USDA reference', 'Linked']
		],
		aside: {
			title: 'Per-portion review',
			status: '15 of 15 present',
			lines: [
				{ label: 'Sodium', value: '612 mg' },
				{ label: 'Dietary fiber', value: '0.4 g' },
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
		intro: 'Put in who is eating, by allergen or by diet. Each dish comes back as conflict, check or clear, and names the ingredient behind it.',
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
			// The menu's own dishes (chef audit 2026-10-07: these were dishes the
			// garden wedding does not serve).
			['Rosemary focaccia', 'Gluten-free · 2 guests', 'Conflict', 'Bread flour (contains wheat)'],
			['Herb roast chicken', 'Halal', 'Check', 'Meat depends on the source'],
			// The bride is the tree-nut allergy, as on the guards guide.
			['Charred market vegetables', 'bride, Tree nuts', 'Clear', 'Every ingredient reviewed'],
			['Citrus salad', 'Vegan', 'Check', '2 ingredients not reviewed']
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
		intro: 'Labels start from the prep list. The cook sets the storage and the use-by, and CostCook keeps what each sticker said so a reprint matches.',
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
		intro: 'Take the inquiry, send the priced proposal to the client’s phone, and when they accept, press Confirm order.',
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
		intro: 'Confirm the order and you work from shopping, prep and pack lists for 180 guests. A page you already opened still reads with no signal; you need to reconnect to save check-offs.',
		callout: 'Type the guest count once. All three lists come off it.',
		featureHref: featureMenuHref('orders'),
		metrics: [
			{ label: 'Event', value: 'Sat, Aug 29' },
			{ label: 'Guests', value: '180' },
			{ label: 'Food cost', value: '$1,491.38' },
			{ label: 'Plan status', value: 'Confirmed', tone: 'good' }
		],
		columns: ['Plan item', 'Need', 'Ready', 'Working status'],
		rows: [
			// 7.5 batches of 12 lb trimmed is 90 lb; at 91% that is 98.9 lb bought.
			['Chicken thigh, boneless', '98.9 lb', '80 lb', '18.9 lb to grab'],
			['Herb marinade', '18 lb', '18 lb', 'Ready'],
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
		intro: 'Open the purchase order, put in what actually came, and the short line stays in view until somebody deals with it.',
		callout: 'The invoice says delivered. The back door says five pounds short.',
		featureHref: featureMenuHref('purchasing'),
		metrics: [
			{ label: 'Purchase order', value: 'PO-1047' },
			{ label: 'Ordered', value: formatCurrency(tourRecipeCostingProof.purchaseOrderTotal) },
			{ label: 'Received lines', value: '11 of 12' },
			{ label: 'Needs follow-up', value: '1', tone: 'attention' }
		],
		columns: ['Delivery line', 'Ordered', 'Received', 'Verdict'],
		rows: [
			['Chicken thigh, boneless', '40 lb', '35 lb', 'Short 5 lb'],
			['Mixed herbs', '2 cases', '2 cases', 'Received'],
			['Extra virgin olive oil', '1 case', '1 case', 'Received'],
			['Bread flour', '1 bag', '1 bag', 'Received']
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
			footnote: 'Four of 12 delivery lines are shown. Save the delivery once you have checked it, and the purchases are recorded and the prices that qualify update. Anything short stays in view until you follow it up.'
		}
	},
	{
		id: 'inventory',
		featureId: 'inventory',
		label: 'Inventory',
		appArea: 'Inventory / Walk-in 1',
		title: 'Build the next shopping list from a count you can trust.',
		intro: 'Count the shelf, then deliveries, waste and packed orders move the number from there. Look at when it was counted before you let it cut the shopping list.',
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
			['Chicken thigh, boneless', '80 lb', '98.9 lb', 'Fresh · 6:12 AM'],
			// 12 usable lemons a batch at 82% is 14.6 bought; × 7.5 batches ≈ 110.
			['Lemon', '164 each', '110 each', 'Fresh · 6:18 AM'],
			['Mixed herbs', '7 lb', '9 lb', 'Stale · Aug 22'],
			['Rosemary focaccia', '—', '360 pieces', 'Never counted']
		],
		aside: {
			title: 'Shopping gap',
			status: '7 lines to buy',
			lines: [
				{ label: 'Chicken thigh', value: '18.9 lb', tone: 'attention' },
				{ label: 'Mixed herbs', value: '9 lb · count first', tone: 'attention' },
				{ label: 'Trusted surplus', value: '5 lines', tone: 'good' },
				{ label: 'Refused estimates', value: '3' }
			],
			footnote: 'The summary covers all stock records; four are shown. Missing or stale counts do not reduce buying. For chicken, 98.9 lb needed − 80 lb on hand = 18.9 lb to buy: one 40 lb case.'
		}
	},
	{
		id: 'purchases-month-cost',
		featureId: 'ledger',
		label: 'Purchases & month cost',
		appArea: 'Purchases / July cost review',
		title: 'Name the month’s gap without guessing what caused it.',
		intro: 'Put what July’s food should have cost next to what it did cost. Take off the waste you logged and you see what is still unexplained.',
		callout: 'The gap is something to look into. Do not hang it on the crew as waste.',
		featureHref: featureMenuHref('ledger'),
		metrics: [
			{ label: 'Should have cost', value: '$8,420.00' },
			{ label: 'Did cost', value: '$8,891.40' },
			{ label: 'Difference to explain', value: '$471.40', tone: 'attention' },
			{ label: 'Inventory trust', value: 'Counted', tone: 'good' }
		],
		columns: ['Cost evidence', 'Amount', 'Source', 'Review'],
		rows: [
			['Did cost (what you paid)', '$8,891.40', 'Purchase ledger', 'Complete'],
			['Should have cost (recipe estimate)', '$8,420.00', 'Confirmed orders', 'Complete'],
			['Logged waste', '$186.50', '7 signed entries', 'Explained'],
			['Still unaccounted', '$284.90', 'Month verdict', 'Review']
		],
		aside: {
			title: 'Price movement',
			status: '5 moved more than 5%',
			lines: [
				{ label: 'Chicken thigh', value: '+7.2%', tone: 'attention' },
				{ label: 'Olive oil', value: '+5.8%', tone: 'attention' },
				{ label: 'Mixed herbs', value: '+6.4%', tone: 'attention' },
				{ label: 'Corrections', value: '2 signed' }
			],
			footnote: '$8,891.40 did cost − $8,420 should have cost = $471.40. Subtract $186.50 recorded waste: $284.90 still needs checking. Price changes compare current and previous prices; three of the month’s ingredients are shown.'
		}
	},
	{
		id: 'team-access',
		featureId: 'team',
		label: 'Team & access',
		appArea: 'Settings / Team & access',
		title: 'Who on the crew can do what.',
		intro: 'Invite people by email. Owners, Managers and Staff can each do different things, and Staff can open recipe costs and Analytics. Everyone invited joins as Staff.',
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
		title: 'Ask, then check the records behind the answer.',
		intro: 'Sage looks through your own CostCook records, says what is missing, and nothing it drafts goes through until you approve it.',
		callout: 'An answer that will not show its source is one more number to check yourself.',
		featureHref: featureMenuHref('assistant'),
		metrics: [
			{ label: 'Question', value: 'Saturday risk check' },
			{ label: 'Records checked', value: '7' },
			{ label: 'Needs attention', value: '2', tone: 'attention' },
			{ label: 'Changes made', value: 'None', tone: 'good' }
		],
		columns: ['Sage found', 'Evidence', 'Impact', 'Next action'],
		rows: [
			['Chicken delivery is 5 lb short', 'PO-1047 receiving', 'Saturday order', 'Open follow-up'],
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

// story: docs/stories/homepage-caterer-fixes.story.md
/**
 * The FAQ, as data. story: docs/stories/faq.story.md
 *
 * EVERY ANSWER NAMES ITS ROWS. `claims` lists the release-claim-ledger rows an
 * answer rests on, and scripts/check-landing-claims.mjs fails the build if any
 * of them is not in docs/release-claim-ledger.md. An answer with no row to
 * stand on is not allowed in this file; the fix is a ledger row first, then
 * the answer. Rows are read off the marketed release, never a branch.
 *
 * WHAT AN ANSWER MAY NOT DO. Soften a `no`. Promise a date for a `coming`.
 * Say what another product cannot do (RC-40, RC-47 scope that to /compare).
 * Use the two no-typing phrases the ledger excludes. Say "margin" for a
 * food-cost number without saying it is food-only (the app shows a food-only
 * gross-margin figure on event totals and recipe pricing; gap report S4).
 *
 * ORDER. Groups run in the order the reader asks them: the money first,
 * because that is what a cold-email visitor opens this page for, then fit,
 * then mechanics, then getting started. Within a group, most-asked first.
 *
 * No pattern: this is a table. The page renders it once; nothing selects
 * among behaviours. Considered a Builder for answers with links; not used
 * because a link is a string with markup, and there are three of them.
 */
import { launchPlan, site } from './site';
import { labelsAvailability } from './labels';
import { comingPlans } from './coming-plans';
import { orderingAvailability } from './ordering';
import { dietary } from './dietary';

export interface FaqEntry {
	/** Stable id for deep links (#cancel). Lowercase, hyphenated. */
	id: string;
	icon?: 'sage';
	question: string;
	/** Plain paragraphs. A paragraph may contain one inline <a>; nothing else. */
	answer: readonly string[];
	claims: readonly string[];
}

export interface FaqGroup {
	id: string;
	title: string;
	entries: readonly FaqEntry[];
}

const price = launchPlan.displayPrice;
const days = launchPlan.trialDays;

export const faq: readonly FaqGroup[] = [
	{
		id: 'money',
		title: 'The trial, the bill, and leaving',
		entries: [
			{
				id: 'trial',
				question: 'What does the trial actually cost?',
				answer: [
					`Nothing for ${days} days. Stripe takes a card when you start and charges $0 during the trial. On day sixteen billing begins at ${price} per kitchen unless you cancelled first.`
				],
				claims: ['RC-34']
			},
			{
				id: 'card',
				question: 'Why a card up front?',
				answer: [
					'The trial starts a subscription that bills automatically on day 16 unless you cancel first. Stripe handles your card details; you pay $0 during the trial.'
				],
				claims: ['RC-34']
			},
			{
				id: 'cancel',
				question: 'How do I cancel?',
				answer: [
					'The workspace owner cancels from Settings, then Billing, through Stripe. No email to me, no notice period, no talking anyone out of it. Cancel inside the trial and nothing is ever charged.'
				],
				claims: ['RC-34']
			},
			{
				id: 'price',
				question: `Is ${price} the price, or a promotion?`,
				answer: [
					`${price} is the launch price and it will not stay there. When it moves it moves for kitchens that sign up after, never for yours. The price you start on is the price you keep.`
				],
				claims: ['RC-34']
			},
			{
				id: 'seats',
				question: 'Do I pay per person?',
				answer: [
					`No. The subscription is per kitchen, not per teammate. The verified owner manages billing and invites the crew. ${launchPlan.crewTerms}`
				],
				claims: ['RC-34']
			},
			{
				id: 'export',
				question: 'Can I take my work with me if I leave?',
				answer: [
					'The whole recipe book exports as a spreadsheet from the recipe list, any time. Ingredient prices do not export yet. That one is on me to build.'
				],
				claims: ['RC-34']
			}
		]
	},
	{
		id: 'fit',
		title: 'Whether it fits your kitchen',
		entries: [
			{
				id: 'who',
				question: 'Who is this for?',
				answer: [
					'Catering and meal prep run by an owner-operator with a small crew. You price jobs that change, you buy for dates rather than a steady week, and nobody down the hall owns the spreadsheet. You can start with one recipe, then use a menu and guest count to plan an event.'
				],
				claims: ['RC-01', 'RC-03', 'RC-44']
			},
			{
				id: 'restaurant',
				question: 'I run a restaurant. Will CostCook fit?',
				answer: [
					'Yes, for the part of your business that moves by event, menu, date, and guest count: catering, special dinners, and other changing menus. CostCook carries that plan through recipe costing, shopping, prep, pack, purchasing, and food cost. You can run regular restaurant service alongside that work and still belong here. The <a href="/compare">comparison page</a> shows the product limits that may still matter to you.'
				],
				claims: ['RC-01', 'RC-03', 'RC-21', 'RC-22', 'RC-24', 'RC-25', 'RC-26', 'RC-30', 'RC-40', 'RC-44']
			},
			{
				id: 'locations',
				question: 'We have more than one kitchen. Can each see its own shelf?',
				answer: [
					'No. One subscription covers one kitchen. There is no per-site inventory and no roll-up across sites.'
				],
				claims: ['RC-44']
			},
			{
				id: 'permissions',
				question: 'Can I give a cook the prep list without showing them the costs?',
				answer: [
					'No. Owner, Manager and Staff protect specific sensitive actions, but there is no per-screen control, so a cook on Staff can still open recipe costs and Analytics. A little is held back: Staff do not see order money or client names on Today, the calendar leaves money out for Staff, and Clients is for owners and managers. The <a href="/features/team-and-access">Team &amp; Access guide</a> names every current boundary.'
				],
				claims: ['RC-44', 'RC-52']
			},
			{
				id: 'roles',
				question: 'What do Owner, Manager and Staff mean?',
				answer: [
					'The Owner manages billing and publishes recipes. Owners and Managers can handle setup, invite teammates and approve Sage drafts. Staff use the shared kitchen lists and can open cost screens, including recipe costs and Analytics. Staff do not see order money or client names on Today, the calendar leaves money out for Staff, and Clients is for owners and managers. Invitations join as Staff today. See the <a href="/features/team-and-access">team role comparison</a> for each action.'
				],
				claims: ['RC-52']
			},
			{
				id: 'fsma',
				question: 'Does it do lot tracking for FSMA 204?',
				answer: ['No. CostCook does not provide the lot tracking a facility under a traceability rule needs.'],
				claims: ['RC-44']
			},
			{
				id: 'labels',
				question: 'Does it do nutrition labels?',
				answer: [
					'As a calculated estimate, yes. The fifteen nutrients an FDA panel carries are computed per recipe, per portion, from USDA FoodData Central records you match to each ingredient, and a recipe says plainly when a value is missing rather than counting it as zero. Print nutrition label on the recipe makes a sheet with the panel, the ingredient statement and the allergen line for your browser to print onto label stock. The sheet says it is a calculated estimate, not a retail-label compliance claim.',
					labelsAvailability.nutritionFaqCrosslink
				],
				claims: ['RC-42', 'RC-47', 'RC-50']
			},
			{
				id: 'guest-restrictions',
				question: 'Can I check a menu against guest allergies and diets?',
				answer: [dietary.faq],
				claims: ['RC-50']
			},
			{
				id: 'label-printing',
				question: 'Does it print kitchen labels with a use-by date?',
				answer: labelsAvailability.faqStatus,
				claims: ['RC-35', 'RC-51']
			},
			{
				id: 'spanish',
				question: 'Is there a Spanish version?',
				answer: [comingPlans.spanish.faq],
				claims: ['RC-47']
			},
			{
				id: 'sage',
				icon: 'sage',
				question: 'What is Sage?',
				answer: [
					'An assistant inside CostCook with twenty-two read-only tools across the shift, orders, recipes, stock, buying and setup. Every answer shows where its numbers came from. It can prepare three kinds of draft (the kitchen shopping list, one order’s shopping list, and a guest-count change on a draft order), and nothing changes until a manager or owner approves the draft. It cannot reach another kitchen and it never changes a record on its own.',
					'Sage is available now and stays within reach during setup. Its starting questions follow the setup stage and the records entered so far, and a Back to setup action returns you to the unfinished stage. See the <a href="/features/sage">Sage feature guide and video</a>.'
				],
				claims: ['RC-46', 'RC-49']
			},
			{
				id: 'integrations',
				question: 'Does it connect to Square or QuickBooks?',
				answer: [
					'No. Square, QuickBooks and an API for custom connections are marked Coming and are not available in your trial or subscription. No release date is promised. Check the <a href="/compare">comparison page</a> if these connections are essential.'
				],
				claims: ['RC-35', 'RC-45', 'RC-46']
			},
			{
				id: 'ordering',
				question: 'Can clients order from me through CostCook?',
				answer: orderingAvailability.faqStatus,
				claims: ['RC-59']
			},
			{
				id: 'margin',
				question: 'Will it tell me my margin?',
				answer: [
					'It tells you food cost: the theoretical food cost of an event, the food-cost percentage against a target you set, and the selling price that would meet that target. Labor and overhead are not in it. Where the event totals and recipe pricing show a food-only gross margin, it is the price less food cost, not your business margin after labor and overhead.'
				],
				claims: ['RC-04', 'RC-05', 'RC-30']
			}
		]
	},
	{
		id: 'how',
		title: 'How the work moves',
		entries: [
			{
				id: 'quote',
				question: 'How does a proposal get its food cost?',
				answer: [
					'Build the event menu from your costed recipes or a saved menu, and the menu and service step shows the food cost before the proposal goes to the client. For a job you take by phone without a proposal, a draft order shows revenue, theoretical food cost, food cost per guest and the percentage against your target. While either is a draft, those numbers follow your current ingredient prices.'
				],
				claims: ['RC-03', 'RC-04', 'RC-06', 'RC-61']
			},
			{
				id: 'frozen',
				question: 'If a supplier price changes after I quote, does my quote change?',
				answer: [
					'No. Confirming an order freezes its plan, its costing inputs and its money. Later prices update your catalog and any draft orders, and the confirmed event shows you quoted-versus-today so you can see the drift, but nothing rewrites it.'
				],
				claims: ['RC-07', 'RC-08']
			},
			{
				id: 'guests',
				question: 'The client added forty guests. What do I retype?',
				answer: [
					'The guest count.',
					'Recipes scale from it, shared ingredients roll together, whole packs recalculate, and the Shop, Prep and Pack tabs stay on the same plan.'
				],
				claims: ['RC-03', 'RC-22', 'RC-24', 'RC-25']
			},
			{
				id: 'shopping',
				question: 'What does the shopping list look like?',
				answer: [
					'Grouped by supplier, rounded to the whole packs you actually buy, with a supplier subtotal. Sub-recipes like a stock or a mirepoix are treated as batches to make rather than things to shop for, and a recent, trusted stock count reduces the buying; missing or stale counts do not.'
				],
				claims: ['RC-18', 'RC-22']
			},
			{
				id: 'orders',
				question: 'Does it send the purchase orders?',
				answer: [
					'Yes, when you say so. Confirming an order contacts no supplier. When you are ready, press Order from suppliers and pick, for each supplier, email, print or handle it yourself, or choose I’ll shop it myself. Each purchase order has its own number, in whole packs. Email is email: the app records the send, and I do not promise delivery into anyone’s inbox.'
				],
				claims: ['RC-26', 'RC-33']
			},
			{
				id: 'receiving',
				question: 'What happens when the truck is short?',
				answer: [
					'Receiving records what the delivery actually was against what you ordered: full, over, short, substituted, missing, or unexpected, with the received value beside the ordered value. Review the quantities and prices, then save the delivery.'
				],
				claims: ['RC-27', 'RC-37']
			},
			{
				id: 'price-back',
				question: 'How does the price I paid get back into my costing?',
				answer: [
					'The newest qualifying purchase, by purchase date, can become the current price of that ingredient, with the receiving it came from on record. It moves future costing and draft orders. It never rewrites a confirmed event.'
				],
				claims: ['RC-08', 'RC-28']
			},
			{
				id: 'multi-event',
				question: 'Can I shop and prep for several events at once?',
				answer: [
					'Yes, for the planning. Two to twelve events can be created together and open a combined Shop, Prep and Pack workspace that totals the shopping and the prep across all of them, with the pack list keeping a column per event. Confirming, freezing prices and sending purchase orders all stay per order; the combined run does not confirm or buy.'
				],
				claims: ['RC-36']
			},
			{
				id: 'inventory',
				question: 'Is the inventory a live count?',
				answer: [
					`No. A physical count sets the baseline; purchases, waste and completed Pack move it from there, and the app tells you how fresh the number is. You can set a par level per ingredient and it will tell you whether you are below it, judged only from a trusted count. Inventory > Build shopping list builds what to buy for confirmed events and your par, by supplier. Only a recent count is taken off the buy.`
				],
				claims: ['RC-31', 'RC-43']
			}
		]
	},
	{
		id: 'start',
		title: 'Getting started, and getting help',
		entries: [
			{
				id: 'setup',
				question: 'What does setup actually involve?',
				answer: [
					'One dish you already cook, not your whole walk-in. A skippable welcome asks what kind of kitchen you run and the name of that dish, then five stages ask for the next thing the dish needs: your kitchen and one supplier, the dish’s ingredients and their pack prices, their food facts, the dish itself, then a menu with a date and a guest count.',
					'It ends on that dish’s plate cost with the arithmetic beside it, and a shopping list in whole packs. <a href="/onboarding">See the five stages, the number they end on, and what comes after</a>.'
				],
				claims: ['RC-10', 'RC-14', 'RC-55']
			},
			{
				id: 'after-setup',
				question: 'What do I do after setup, and how does my crew get in?',
				answer: [
					'Setup ends on a screen that says your kitchen is ready and offers the shopping list for your first order. The next dishes come in through the same doors as the first: a photo, a PDF, a spreadsheet, a Word document or pasted text, ready for you to review before saving.',
					'To bring in the crew, open Settings, then Team, and type an email address. They receive a one-time link, need no password, and join as Staff. Staff can open cost screens, including recipe costs and Analytics, and there is no custom role. <a href="/onboarding#after-crew">See the after-setup part of the guide</a>.'
				],
				claims: ['RC-38', 'RC-39', 'RC-52']
			},
			{
				id: 'prices-in',
				question: 'How do my supplier prices get in?',
				answer: [
					'Photograph the price list, drop in the PDF or the Word document, upload the spreadsheet, or paste the text. Review the supplier, ingredients, pack sizes and prices before saving. Nothing changes your costing until you save the reviewed records, and whatever could not be read is quoted back as it appeared rather than guessed. Keying an awkward invoice in by hand is still a supported way to do it.'
				],
				claims: ['RC-09', 'RC-26', 'RC-38', 'RC-39']
			},
			{
				id: 'catalog',
				question: 'Do I have to type every ingredient?',
				answer: [
					'No. CostCook includes roughly 1,500 ingredient names and supplier abbreviations to help match your paperwork. You still enter or import your own pack sizes and prices.'
				],
				claims: ['RC-41']
			},
			{
				id: 'recipes-in',
				question: 'How do my recipes get in?',
				answer: [
					'Upload a photo, PDF, spreadsheet or document, or paste the recipe text. Review the draft before saving it. Recipes can carry sub-recipes and a trim yield on each line, and the yield moves how much you buy as well as what the plate costs.'
				],
				claims: ['RC-16', 'RC-19', 'RC-38']
			},
			{
				id: 'phone',
				question: 'Does it work on a phone in a walk-in with one bar?',
				answer: [
					'Previously loaded order pages remain readable with no signal and show when they were cached. A page you did not load before going offline shows the offline fallback, and actions that write data need a connection. With a connection, core pages are server-rendered and remain readable with JavaScript off.'
				],
				claims: ['RC-54']
			},
			{
				id: 'help',
				question: 'Who answers when I write?',
				answer: [
					`I do. Ask on the <a href="/contact#ask-form">contact page</a> and the answer comes back to the address you leave, or call ${site.phone}. Inside the app, Contact support sends your account email and the screen you are on with the message.`
				],
				claims: ['RC-01']
			},
			{
				id: 'demo',
				question: 'Can someone run my menu through it before I start?',
				answer: [
					'Yes. Book fifteen minutes and bring one menu and a guest count. We put it through and you see the shopping list, the prep sheet, the pack list and the food cost it gives back. Your numbers, not a sales demo’s.'
				],
				claims: ['RC-01']
			}
		]
	}
];

export const faqCount = faq.reduce((sum, group) => sum + group.entries.length, 0);

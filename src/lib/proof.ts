import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The pixel size of a capture in public/proof, read from the PNG itself at
 * build time.
 *
 * WHY NOT TYPE THE NUMBERS. The event captures are re-taken whenever the app
 * changes (scripts/capture-events-proof.mjs), and the offer frame went from
 * 780x2204 to 780x2260 in one afternoon. A typed width and height would ship a
 * stretched screenshot the next time that happens, and nothing else would
 * notice. The IHDR chunk is always the first chunk of a PNG, so width and
 * height sit at bytes 16 to 24.
 *
 * Considered Proxy (a cached image-metadata service); not used because this
 * runs once per image per build and a plain function is the whole job.
 */
export function pngSize(publicPath: string): { width: number; height: number } {
	const file = readFileSync(join(process.cwd(), 'public', publicPath));
	if (file.toString('ascii', 12, 16) !== 'IHDR') {
		throw new Error(`${publicPath} is not a PNG this build can measure`);
	}
	return { width: file.readUInt32BE(16), height: file.readUInt32BE(20) };
}

/**
 * The event captures: one wedding carried through every frame by
 * scripts/capture-events-proof.mjs (notes: docs/landing-capture/
 * events-captures.md). The events guide renders all of them and the
 * homepage's EventBooking section renders the offer, so both read this one
 * map: the alt text and the pixel size cannot drift between the two.
 *
 * The service time is typed once because two alts name it, and on 2026-09-27
 * they disagreed ("5 to 10 p.m." against "17:00 to 22:00"). The app prints
 * 17:00 to 22:00, in the kitchen's zone (America/New_York), on both frames.
 *
 * Considered Factory Method (a capture class per frame kind); not used
 * because every frame is the same three fields and `shot` builds them all.
 */

const shot = (src: string, alt: string) => ({ src, alt, ...pngSize(src) });

// Re-shot 2026-10-07 from app 7a7e407d9 (local develop, the owner's chosen
// source) for Sat Dec 19, the homepage's wedding. scripts/capture-events-proof.mjs.
export const eventProof = {
	inquiry: shot(
		'/proof/events-inquiry-mobile.png',
		'The New inquiry form on a phone, with Save at the top and the note: Only a client or event name is required. Rough answers are fine. Who’s asking: client Priya Nair, marked New client, phone (207) 555-0187, reached by Phone call, with Email, Website form, Referral, Repeat client and Other as the other choices. The event: name Nair & Castellano wedding, no date chosen and Date not decided yet ticked, 150 guests with This is an estimate ticked, and a link to add time, venue, style and budget. Buttons at the bottom: Save and build menu, and Save inquiry only.'
	),
	workspace: shot(
		'/proof/events-workspace-desktop.png',
		'The event page for the Nair & Castellano wedding, marked Inquiry, with Edit details. Chips: Sat, Dec 19, 2026, in 73 days; 150 guests; 5:00 PM to 10:00 PM; add a venue; Priya Nair. A six-step bar: Inquiry, captured; Menu & service, 2 of 3, you are here; Proposal, price and send; Client decision, accept or decline; Agreement, send and collect signature; Booked, kitchen planning opens. The Next step card reads Set the menu and service, for 150 guests, with Dishes 6 saved, Service style plated and Staff & rentals optional, and the buttons Set menu and service and Start from a saved menu. Beside it, an upcoming follow-up for Thu, Oct 8, tomorrow, owned by Marisol Vega, with Mark done and Snooze.'
	),
	offer: shot(
		'/proof/events-offer-mobile.png',
		'The client’s proposal page on a phone, from Harbor & Hearth Catering, with a phone icon. Proposal for Priya Nair: Nair & Castellano wedding, please respond by Wed, Oct 14, 7 days left. Total for your event $14,250.00, 150 guests at $95.00 per guest. Your event: date December 19, 2026, 150 guests, venue to be confirmed, service time 5:00 PM to 10:00 PM Eastern Time, and the line We’ll confirm these details with you before the event. What we’ll serve: Wedding Plated Dinner, $14,250.00, 150 guests at $95.00 per guest, with six dishes: braised short rib, creamed spinach, focaccia and whipped goat cheese, lemon posset, roasted beet and citrus, and wild mushroom polenta. Buttons at the bottom: Ask for changes, and Accept proposal.'
	),
	deposit: shot(
		'/proof/events-deposit-desktop.png',
		'The Deposit and payments panel on the event: Asked for $3,500.00, Received $0.00, Nothing received yet, and Payment requests go to priya.nair@example.com. Below, two payments to request, each check, cash or transfer with a link to add payment instructions: the deposit, $3,500.00 owed, and the balance, $10,750.00 owed, due Wed, Dec 9. At the bottom, the link Record the money on the kitchen draft.'
	),
	draft: shot(
		'/proof/events-kitchen-draft-desktop.png',
		'The Kitchen draft section on the event: The kitchen draft is ready. It is tentative: it holds no day and draws no crew until you confirm the order. Below it, the link Open the kitchen draft.'
	),
	book: shot(
		'/proof/events-book-desktop.png',
		'The Book the event panel: Still missing before you book: the agreement is not prepared yet, so nobody has signed it; the $3,500.00 deposit has not come in yet. A link, Go to the deposit. A box asking Why book without them?, with the note Your reason is kept with the event, with your name and the time, and the button Book anyway.'
	),
	confirm: shot(
		'/proof/events-confirm-desktop.png',
		'A dialog titled Confirm order?: Confirming locks quantities and prices for Nair & Castellano wedding. Shopping, prep and pack lists become checklists. Buttons: Keep editing, and Confirm.'
	),
	calendar: shot(
		'/proof/events-calendar-desktop.png',
		'The calendar in week view for Dec 13 to Dec 19, 2026, with Month, Week, Today and + New order, and the filters Confirmed 1, Drafts 0 and Requests 0. Sunday to Friday each read 0 of 3 orders and 0 of 2 vans. Saturday the 19th reads 1 of 3 orders and 0 of 2 vans and holds one card: 5:00 PM, Nair & #783, Confirmed, 150 guests, $14,250.00, 28.4% food cost.'
	)
};


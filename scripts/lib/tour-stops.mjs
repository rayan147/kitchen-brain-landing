import { readFileSync } from 'node:fs';

/**
 * How many stops the product tour has, read from src/lib/tour.ts once for
 * every script that counts tabs, scenes or Features menu entries
 * (check-product-tour-page.mjs, verify-product-tour.mjs,
 * verify-features-menu.mjs). It was typed as 14 in five places.
 *
 * WHY DERIVING DOES NOT WEAKEN THE CHECK. The old comments pinned the number
 * so a stop silently disappearing would fail. Two things still catch that:
 *  - src/lib/tour.ts throws at build time unless the stops and the Features
 *    dropdown destinations match one for one, so a stop cannot vanish alone;
 *  - MIN_TOUR_STOPS below is the floor. The tour only grows as a capability
 *    ships with its page (13 on 2026-09-09, RC-60; 14 on 2026-09-27, RC-61).
 *    Lowering the floor is a decision, recorded here with its ledger row.
 *
 * Read by regex, not imported: tour.ts imports './features' without an
 * extension, which Node's type stripping cannot resolve.
 *
 * Considered Singleton (a cached tour model); not used because each script is
 * its own process and reads the file once; a module-level constant is the
 * whole job.
 */
export const MIN_TOUR_STOPS = 14;

const source = readFileSync(new URL('../../src/lib/tour.ts', import.meta.url), 'utf8');
const start = source.indexOf('export const tourStops');
const end = source.indexOf('\n];', start);
if (start === -1 || end === -1) throw new Error('tour-stops: could not find tourStops in src/lib/tour.ts');

/** One stop per `featureHref:` line, which every TourStop must carry. */
export const tourStopCount = (source.slice(start, end).match(/^\t\tfeatureHref: /gm) ?? []).length;

if (tourStopCount < MIN_TOUR_STOPS) {
	throw new Error(
		`tour-stops: src/lib/tour.ts has ${tourStopCount} stops, below the floor of ${MIN_TOUR_STOPS}. ` +
			'A stop leaves only when its capability does; lower MIN_TOUR_STOPS with the ledger row if that happened.'
	);
}

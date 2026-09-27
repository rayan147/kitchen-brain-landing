/**
 * The homepage's stops, in the order the visitor meets them: ONE explicit
 * list for every script that checks the order (check-landing-claims.mjs
 * reads the component order in src/pages/index.astro and the ids in
 * src/lib/stops.ts against it; check-dist.mjs and verify-homepage.mjs read
 * the rendered section ids). It was typed three times.
 *
 * It stays a hand-written list on purpose. Its job is to fail when
 * src/lib/stops.ts and index.astro drift apart, so it may not be derived from
 * either of them.
 *
 * The order, and why. The hero, then EventBooking (since 2026-09-27: the page
 * is event-first, so inquiry to booked is proven first), the kitchen answers,
 * then the film (SeeItRun, fourth: the footage still runs before the page
 * argues the diagnosis), the diagnosis, and the diligence after it.
 * Story: docs/stories/homepage-event-story.story.md
 *
 * Considered Iterator; not used because this is a flat, fixed list read by
 * plain array methods.
 */
export const homepageStops = [
	{ id: 'booking', component: 'EventBooking' },
	{ id: 'outcomes', component: 'CustomerOutcomes' },
	{ id: 'demo', component: 'SeeItRun' },
	{ id: 'problem', component: 'TheProblem' },
	{ id: 'yield', component: 'TheYield' },
	{ id: 'trust', component: 'BuiltForKitchens' },
	{ id: 'who', component: 'WhoThisIsFor' },
	{ id: 'more', component: 'WhatElse' },
	{ id: 'alternatives', component: 'TheOtherTools' },
	{ id: 'start', component: 'StartHere' }
];

/** Section ids, in order, as src/lib/stops.ts and the built page carry them. */
export const homepageStopIds = homepageStops.map((stop) => stop.id);

/** Components, in order, as src/pages/index.astro composes them after the hero. */
export const homepageComponentOrder = ['<Hero />', ...homepageStops.map((stop) => `<${stop.component} />`)];

/**
 * The homepage's scroll stops, in page order, with the word each one's
 * eyebrow uses. ONE list, read by SectionHandoff so every "next" line on the
 * page is derived from the same order src/pages/index.astro renders, and by
 * scripts/check-landing-claims.mjs, which pins this array to that order.
 *
 * Why it exists (2026-08-29): the page was ten text sections and nothing on it
 * told the eye where to go next. Each section ended in a paragraph. A hand-off
 * line typed by hand in nine files is nine chances to point at the wrong
 * neighbour after a reorder, and index.astro records that this page has been
 * reordered three times. So the neighbour is looked up, never typed.
 *
 * FOUR STOPS BECAME ONE ON 2026-09-09. nutrition, intake, sage and access are
 * one stop, #more, and the four blocks live in src/components/more. The
 * measurement and the owner decision behind it are in the note at the head of
 * src/components/sections/WhatElse.astro. Twelve stops, then nine.
 *
 * TWO LABELS CHANGED ON 2026-09-09. They read "The hard part" and "Before any
 * of that", which name a section's PLACE in the argument rather than its
 * subject. A caterer scanning headings on a phone reads this list and nothing
 * else, and neither of those two told her whether the stop was about her week.
 * They are now the subject in her words: trim and yield, invoices and price
 * lists. Nothing else about either section changed, and both hand-off lines
 * read the new words because they were never typed twice.
 *
 * `id` is the section's DOM id (the anchor the hand-off scrolls to). `label`
 * is the eyebrow text of that section, so the hand-off names the stop in the
 * same words the reader will see when they arrive.
 */
export const stops = [
	{ id: 'demo', label: 'See it run' },
	{ id: 'problem', label: 'What goes wrong' },
	{ id: 'who', label: 'Who this is for' },
	{ id: 'outcomes', label: 'What it does instead' },
	{ id: 'yield', label: 'Trim and yield' },
	{ id: 'more', label: 'What else is in it' },
	{ id: 'alternatives', label: 'The other tools' },
	{ id: 'trust', label: 'Who made it' },
	{ id: 'start', label: 'Start here' }
] as const;

export type StopId = (typeof stops)[number]['id'];

/** The stop after `id`, or undefined for the last one (the close hands off to nothing). */
export function nextStop(id: StopId) {
	const index = stops.findIndex((stop) => stop.id === id);
	return index >= 0 ? stops[index + 1] : undefined;
}

/**
 * The event's front half, inquiry to booked, as the facts every surface shares.
 * story: docs/stories/homepage-event-story.story.md and
 * docs/stories/features-events-and-proposals.story.md
 *
 * WHY ONE FILE. The homepage's EventBooking section, the events guide, the
 * product tour stop, /compare, /pricing (through coming-plans.ts) and the
 * /features group all name the same six steps, the same ways a deposit is
 * recorded and the same acceptance boundary. Typed six times, they had
 * already drifted: the tour dropped "your own card processor" from the
 * deposit and /compare swapped the boundary's full stop for a semicolon. Each
 * fact is written here once and read everywhere; the built-page contracts
 * (scripts/check-events-proposals-page.mjs) still pin the rendered sentences
 * word for word, so a change here that breaks the truth fails the build.
 *
 * PROVENANCE. The row ids are docs/research/2026-09-27-app-inventory.yaml,
 * production rows only. They are for review and are never rendered.
 *
 * Considered Composite; not used because six fixed sibling steps are data,
 * not a part/whole tree, and every surface renders them with one loop.
 * Considered Flyweight; not used because these are a handful of strings, and
 * sharing them is a module export, not an object pool.
 */

/** The app's own step bar on the event page, in its order (inventory A-03). */
export const eventStep = {
	inquiry: 'Inquiry',
	menu: 'Menu & service',
	proposal: 'Proposal',
	decision: 'Client decision',
	agreement: 'Agreement',
	booked: 'Booked'
} as const;

export type EventStepName = (typeof eventStep)[keyof typeof eventStep];

/** The six steps in order, each with the inventory rows it rests on. */
export const eventSteps: readonly { name: EventStepName; rows: readonly string[] }[] = [
	{ name: eventStep.inquiry, rows: ['A-01'] },
	{ name: eventStep.menu, rows: ['A-04'] },
	{ name: eventStep.proposal, rows: ['A-06'] },
	{ name: eventStep.decision, rows: ['A-07', 'A-08'] },
	{ name: eventStep.agreement, rows: ['A-10', 'A-11', 'A-12'] },
	{ name: eventStep.booked, rows: ['A-13', 'A-14', 'A-15'] }
];

/**
 * How an event deposit arrives today (A-14, RC-65): recorded by hand, in one
 * of these. Card payment for a booked event is a Coming plan
 * (coming-plans.ts), so this list is the whole truth until that ships.
 */
export const depositMethods = 'a check, cash, a transfer or your own card processor';

/** The same list opening a label or a sentence. */
export const depositMethodsCapital = depositMethods.replace(/^./, (c) => c.toUpperCase());

/** The acceptance boundary (A-07, D-04): the client's yes books nothing. */
export const acceptanceBoundary = 'Their yes is not a signature or a booking. Confirm order is.';

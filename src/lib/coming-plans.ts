/**
 * Owner-confirmed additions that are Coming soon as of 2026-08-30.
 * Story: docs/stories/homepage-coming-plans.story.md
 *
 * Kitchen label printing is deliberately absent: its status is release-flag
 * aware and remains owned by src/lib/labels.ts.
 */

// Considered Strategy; not used because availability and wording vary as
// shared data, not as behavior selected or swapped at runtime.
export const comingPlans = {
	parBuying: {
		id: 'par-buying',
		title: 'Buying that tops you back up to par',
		comparisonLabel: 'Buying that tops up to par',
		verdict: 'coming' as const,
		homepage:
			'Build the buy from the par level you set, not only from the jobs already on the books.',
		comparisonNote:
			'Coming soon. Today shopping covers the jobs on the books minus trusted on-hand quantity; it does not yet replenish to par.',
		faq:
			'Buying that tops stock back up to the par level you set is Coming soon. Today the shopping list covers the jobs on the books minus trusted on-hand quantity; it does not yet replenish to par. No date is promised.'
	},
	dietary: {
		id: 'dietary',
		title: 'Dietary characteristics',
		comparisonLabel: 'Dietary characteristics',
		verdict: 'coming' as const,
		homepage:
			'Carry characteristics such as vegan or gluten-free on the recipe instead of keeping a separate note.',
		comparisonNote:
			'Coming soon. Dietary characteristics are not assessed in the app today, and nothing is inferred from an ingredient name.',
		faq:
			'Dietary characteristics such as vegan and gluten-free are Coming soon. They are not assessed in the app today, and nothing is inferred from an ingredient name. No date is promised.'
	},
	spanish: {
		id: 'spanish',
		title: 'Spanish',
		comparisonLabel: 'English and Spanish',
		verdict: 'coming' as const,
		homepage: 'Use CostCook in Spanish as well as English.',
		comparisonNote: 'Coming soon. CostCook is English only today; no date is promised.',
		faq:
			'A Spanish version is Coming soon. CostCook is English only today, and no date is promised.'
	}
} as const;

export const comingPlanList = Object.values(comingPlans);

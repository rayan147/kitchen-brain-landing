/**
 * The published blog: every post whose feature is live.
 * story: docs/stories/blog-supplier-invoices-by-email.story.md
 *
 * A guide that walks a reader through setting up a Coming feature sends them
 * to do something the app cannot do yet (RC-73: a supplier told to email an
 * address production does not receive). So a post whose `featureHref` points
 * at a feature still marked Coming is not built, listed or linked; it
 * publishes on the same commit that flips the feature's word.
 *
 * Considered Proxy (a guarded collection wrapper); not used because there are
 * two rules and three callers, and a function holds them. The rules are data:
 * the set below, read from each feature's own status module (invoice email,
 * and online ordering since its two guides, 2026-10-08).
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { invoiceEmailAvailability, invoiceEmailRoute } from './invoice-email';
import { orderingAvailability, orderingRoute } from './ordering';

const comingFeatureRoutes = new Set<string>([
	...(invoiceEmailAvailability.isComing ? [invoiceEmailRoute] : []),
	...(orderingAvailability.isComing ? [orderingRoute] : [])
]);

export const isPublished = (post: CollectionEntry<'blog'>) => !comingFeatureRoutes.has(post.data.featureHref);

/** Published posts in reading order. */
export const getPublishedPosts = async () =>
	(await getCollection('blog', isPublished)).sort((a, b) => a.data.order - b.data.order);

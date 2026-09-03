import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Considered Factory Method; not used because every post is one content type
// rendered by one stable template. Astro's content loader already owns entry
// construction, so another creator hierarchy would only duplicate it.
const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		publishedDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		category: z.enum(['Costing & pricing', 'Recipes & yield', 'Running the event', 'Buying & suppliers']),
		featured: z.boolean().default(false),
		order: z.number().int().positive(),
		readMinutes: z.number().int().positive(),
		featureHref: z.string().startsWith('/'),
		featureLabel: z.string()
	})
});

export const collections = { blog };


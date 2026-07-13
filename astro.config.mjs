// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Fully static one-pager — no adapter; Vercel serves the dist/ output.
export default defineConfig({
	site: 'https://kitchen-brain-landing.vercel.app',
	vite: {
		plugins: [tailwindcss()]
	}
});

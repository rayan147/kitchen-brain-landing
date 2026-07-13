// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Fully static one-pager — no adapter; Vercel serves the dist/ output.
export default defineConfig({
	site: 'https://kitchen-brain-landing.vercel.app',
	vite: {
		plugins: [tailwindcss()],
		build: {
			// Never inline the hoisted script bundle: the CSP in vercel.json
			// allows script-src 'self' with no 'unsafe-inline'.
			assetsInlineLimit: 0
		}
	}
});

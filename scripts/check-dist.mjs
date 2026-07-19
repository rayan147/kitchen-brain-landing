// Build-output guard (issue #54): every inline <svg> in the built pages
// must carry intrinsic width/height attributes. A viewBox-only svg is
// sized by CSS alone, and until the external hashed stylesheet applies
// it paints at 100% container width — the full-screen logo flash.
// Runs as postbuild, so `npm run build` (local and Vercel) enforces it.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist', import.meta.url).pathname;
// \s so stroke-width can't satisfy the check; a bare number before the
// closing quote so width="100%" (container-relative, the exact failure
// mode) can't either.
const sized = (tag) => /\swidth="\d+(?:\.\d+)?"/.test(tag) && /\sheight="\d+(?:\.\d+)?"/.test(tag);

const pages = readdirSync(dist, { recursive: true, encoding: 'utf8' }).filter((f) =>
	f.endsWith('.html')
);
let svgCount = 0;
let failed = false;
for (const page of pages) {
	const html = readFileSync(join(dist, page), 'utf8');
	const svgs = html.match(/<svg\b[^>]*>/g) ?? [];
	svgCount += svgs.length;
	for (const tag of svgs.filter((t) => !sized(t))) {
		console.error(`check-dist: ${page}: inline svg missing intrinsic width/height:\n  ${tag}`);
		failed = true;
	}
}
if (failed) process.exit(1);
console.log(`check-dist: ${svgCount} inline svg(s) across ${pages.length} page(s) all carry intrinsic width/height`);

/**
 * Blog screenshots: a markdown image of an app capture becomes the site's
 * captured-frame figure.
 * story: docs/stories/blog-catering-food-labels.story.md
 *
 *   ![alt](/proof/blog/<slug>/<name>.png "Caption")
 *
 * becomes <figure class="blog-shot"> holding a <picture> and a <figcaption>.
 * When <name>-mobile.png sits beside it, phones and tablets get that capture
 * and 64rem up gets <name>.png (the onboarding page's split, RC-48). A
 * <name>-mobile.png written on its own is a phone-only frame at every width.
 * Width and height come from the PNG itself, because check-dist refuses an
 * image without them and a capture is shown at half its pixel width (stored
 * at device scale 2) or narrower, never wider.
 *
 * Pattern: Visitor, at Sätteri's seam. Why: the processor walks the tree and
 * dispatches by tag; this plugin only answers for <p>. Alternative rejected: a
 * rehype plugin, which Astro 7 runs only with @astrojs/markdown-remark
 * installed (a new dependency for one rewrite).
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const publicDir = resolve(import.meta.dirname, '../public');
const BLOG_PROOF = '/proof/blog/';

/** Width and height from a PNG's IHDR chunk. */
const pngSize = (path) => {
	const bytes = readFileSync(path);
	return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
};

const element = (tagName, properties, children = []) => ({ type: 'element', tagName, properties, children });

const figureFor = (img) => {
	const src = String(img.properties.src);
	const mobileSrc = src.replace(/\.png$/, '-mobile.png');
	const hasMobile = !src.endsWith('-mobile.png') && existsSync(resolve(publicDir, `.${mobileSrc}`));
	const desk = pngSize(resolve(publicDir, `.${src}`));
	const shown = hasMobile ? { src: mobileSrc, ...pngSize(resolve(publicDir, `.${mobileSrc}`)) } : { src, ...desk };
	const style = `--phone-w: ${shown.width / 2}px; --desk-w: ${(hasMobile ? desk.width : shown.width) / 2}px`;
	const picture = element('picture', {}, [
		...(hasMobile ? [element('source', { media: '(min-width: 64rem)', srcSet: src, width: desk.width, height: desk.height })] : []),
		element('img', {
			src: shown.src,
			alt: img.properties.alt ?? '',
			width: shown.width,
			height: shown.height,
			loading: 'lazy',
			decoding: 'async',
			style
		})
	]);
	const caption = img.properties.title;
	return element('figure', { className: ['blog-shot'] }, [
		picture,
		...(caption ? [element('figcaption', {}, [{ type: 'text', value: String(caption) }])] : [])
	]);
};

const isShotImage = (child) =>
	child.type === 'element' && child.tagName === 'img' && String(child.properties?.src ?? '').startsWith(BLOG_PROOF);

/**
 * A Sätteri hast plugin (Astro 7's default Markdown processor): the paragraph
 * that holds nothing but one blog capture is replaced by its figure.
 */
const blogFigures = {
	name: 'blog-figures',
	element: {
		filter: ['p'],
		visit(node, ctx) {
			const children = node.children.filter((child) => !(child.type === 'text' && child.value.trim() === ''));
			if (children.length !== 1 || !isShotImage(children[0])) return;
			ctx.replaceNode(node, figureFor(children[0]));
		}
	}
};

export default blogFigures;

import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';

// The caterer's decision path on the homepage: does the page say what the job
// makes, put the trial and the 15-minute booking where a skeptical owner on a
// phone finds them, stay inside its length budget, and send the pricing
// question to plain launch terms?
//
// Rewritten 2026-10-09 (issue #82). The first version (2026-09-11) asserted
// the back-of-house homepage's sections ("The event you sold is the event you
// cook.", the demo-guide disclosure, "Four more areas…"), which the 2026-10-06
// redesign removed, so it timed out on its first wait. The copy it checks now
// comes from the source of truth (src/lib/home.ts, src/lib/site.ts), not a
// retyped string, so a copy edit cannot strand it again.
//
// Considered Strategy; not used because viewports vary data in one fixed
// visitor journey. Native details owns disclosure state.
const base = process.env.COSTCOOK_QA_URL || 'http://127.0.0.1:4321';
const evidence = 'docs/qa/caterer-landing-fixes-2026-09-11';
await mkdir(evidence, { recursive: true });

const homeSource = await readFile(new URL('../src/lib/home.ts', import.meta.url), 'utf8');
const siteSource = await readFile(new URL('../src/lib/site.ts', import.meta.url), 'utf8');
const opening = homeSource.match(/opening:\s*'([^']+)'/)?.[1];
const ctaLabel = siteSource.match(/export const cta = \{[\s\S]*?label:\s*'([^']+)'/)?.[1];
const demo = siteSource.match(/export const demoCta = \{[\s\S]*?label:\s*'([^']+)',\s*ariaLabel:\s*'([^']+)',\s*href:\s*'([^']+)'/);
assert(opening && ctaLabel && demo, 'could not read the hero line, the trial label or the booking link from source');
const [, demoLabel, demoAria, demoHref] = demo;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/snap/bin/chromium', args: ['--no-sandbox'] });
const results = [];
try {
  for (const [width, height] of [[1440, 900], [1280, 800], [1024, 768], [768, 1024], [390, 844], [320, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { level: 1, name: opening, exact: true }).waitFor();

    const geometry = await page.evaluate((label) => {
      const primary = [...document.querySelectorAll('main .btn-primary')].find((a) => a.textContent.trim().endsWith(label));
      return {
        overflow: document.documentElement.scrollWidth - innerWidth,
        pageHeight: document.documentElement.scrollHeight,
        headerHeight: document.querySelector('header').getBoundingClientRect().height,
        primaryBottom: primary ? primary.getBoundingClientRect().bottom : Infinity
      };
    }, ctaLabel);
    assert.equal(geometry.overflow, 0, `${width}: overflow`);
    assert(geometry.headerHeight < 150, `${width}: header must remain compact`);
    // The trial is the one action; a phone reader meets it on the first screen.
    assert(geometry.primaryBottom <= height, `${width}: "${ctaLabel}" ends at ${Math.round(geometry.primaryBottom)}px, below the first ${height}px screen`);
    // PHONE LENGTH BUDGET. 18,500px since the event-first repositioning
    // (2026-09-27); the 2026-10-06 redesign measured about 16,800px at 390.
    // It is still a budget: a new section pays for itself by cutting elsewhere.
    if (width === 390) assert(geometry.pageHeight < 18500, `default mobile read is ${geometry.pageHeight}px, over the 18,500px budget`);
    await page.screenshot({ path: `${evidence}/after-${width}.png` });

    // The quiet alternative: the booking link, in the header, to /demo.
    const booking = page.getByRole('link', { name: demoAria, exact: true }).first();
    await booking.waitFor({ state: 'attached' });
    assert.equal((await booking.innerText()).trim(), demoLabel);
    assert.equal(await booking.getAttribute('href'), demoHref);

    await page.goto(`${base}/pricing#launch-terms`, { waitUntil: 'networkidle' });
    assert.match(await page.locator('#launch-terms').innerText(), /15 days are free/, `${width}: launch terms lost the trial line`);
    assert.deepEqual(errors, [], `${width}: browser errors`);
    results.push({ width, height, ...geometry, errors });
    await page.close();
  }

  // Without JavaScript the film's transcript still opens (native details).
  const noScript = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await noScript.goto(base);
  const transcript = noScript.locator('main details').filter({ hasText: 'Read what the film shows' }).first();
  await transcript.locator('summary').click();
  assert.equal(await transcript.evaluate((element) => element.open), true, 'native disclosure works without JavaScript');
  await noScript.close();

  await writeFile(`${evidence}/verification.json`, JSON.stringify({ viewports: results, noScript: 'passed' }, null, 2));
  console.log(JSON.stringify({ passed: true, viewports: results.map(({ width, pageHeight }) => ({ width, pageHeight })), noScript: true }));
} finally {
  await browser.close();
}

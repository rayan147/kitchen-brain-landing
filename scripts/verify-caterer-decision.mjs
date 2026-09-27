import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';

// Considered Strategy; not used because viewports vary data in one fixed visitor
// journey. Native details owns disclosure state; no custom state machine is needed.
const base = process.env.COSTCOOK_QA_URL || 'http://127.0.0.1:4321';
const evidence = 'docs/qa/caterer-landing-fixes-2026-09-11';
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/snap/bin/chromium', args: ['--no-sandbox'] });
const results = [];
try {
  for (const [width, height] of [[1440,900], [1280,800], [1024,768], [768,1024], [390,844], [320,844]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'The event you sold is the event you cook.', exact: true }).waitFor();
    const hero = page.getByRole('region', { name: 'The event you sold is the event you cook.', exact: true });
    assert.match(await hero.innerText(), /First dish: about fifteen minutes/);
    assert.match(await hero.innerText(), /\$89\.78 per guest to meet a 30% food-cost target/);
    assert.match(await hero.innerText(), /packaging, rentals, staff/);
    assert.match(await hero.innerText(), /Cancel before day 16/);
    for (const image of await page.locator('main img').all()) {
      if (await image.isVisible()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(image => image.decode());
      }
    }
    await page.evaluate(() => scrollTo(0, 0));
    const geometry = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - innerWidth,
      pageHeight: document.documentElement.scrollHeight,
      proofTop: document.querySelector('main figure').getBoundingClientRect().top,
      setupTop: document.querySelector('[data-first-dish-preparation]').getBoundingClientRect().top,
      headerHeight: document.querySelector('header').getBoundingClientRect().height
    }));
    assert.equal(geometry.overflow, 0, `${width}: overflow`);
    assert(geometry.headerHeight < 150, `${width}: header must remain compact`);
    if (width <= 390) {
      assert(geometry.proofTop < height, `${width}: proof must begin in the first viewport`);
      assert(geometry.setupTop < height * 2, `${width}: preparation must appear within two viewports`);
    }
    if (width === 390) assert(geometry.pageHeight < 16000, 'default mobile read must stay below the new 16,000px budget');
    await page.screenshot({ path: `${evidence}/after-${width}.png` });
    const booking = page.getByRole('banner').getByRole('link', { name: 'Book a demo: prepare a 15-minute CostCook session', exact: true });
    assert.equal((await booking.innerText()).trim(), 'Book a demo');
    assert.equal(await booking.getAttribute('href'), '/demo');
    const guide = page.locator('[data-demo-guide-disclosure]');
    assert.equal(await guide.evaluate(element => element.open), false, 'written tour is optional at every width');
    await guide.locator('summary').click();
    assert.equal(await guide.evaluate(element => element.open), true);
    await page.setViewportSize({ width: width < 1024 ? 1280 : 390, height });
    assert.equal(await guide.evaluate(element => element.open), true, 'resize preserves open choice');
    await guide.locator('summary').click();
    await page.setViewportSize({ width, height });
    assert.equal(await guide.evaluate(element => element.open), false, 'resize preserves closed choice');
    const more = page.getByRole('region', { name: 'Four more areas, and where each one stops.', exact: true });
    const importSummary = more.getByText('Bring in invoices and recipes', { exact: true });
    await importSummary.click();
    await more.getByRole('heading', { name: 'Upload invoices. Check the prices before they change.', exact: true }).waitFor();
    assert.match(await more.innerText(), /correct|confirmation|confirm/i);
    await importSummary.click();
    await page.goto(`${base}/pricing#launch-terms`, { waitUntil: 'networkidle' });
    assert.match(await page.locator('#launch-terms').innerText(), /Post-launch teammate limits have not been announced/);
    assert.deepEqual(errors, [], `${width}: browser errors`);
    results.push({ width, height, ...geometry, errors });
    await page.close();
  }
  const noScript = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await noScript.goto(base);
  const guide = noScript.locator('[data-demo-guide-disclosure]');
  await guide.locator('summary').click();
  assert.equal(await guide.evaluate(element => element.open), true, 'native disclosure works without JavaScript');
  await noScript.getByText('Inspect the pricing panel', { exact: true }).click();
  assert(await noScript.getByRole('link', { name: 'Open the full-size pricing panel in a new tab' }).isVisible());
  await noScript.close();
  await writeFile(`${evidence}/verification.json`, JSON.stringify({ viewports: results, noScript: 'passed' }, null, 2));
  console.log(JSON.stringify({ passed: true, viewports: results, noScript: true }, null, 2));
} finally {
  await browser.close();
}

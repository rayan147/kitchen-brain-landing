import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { homepageStopIds } from './lib/homepage-stops.mjs';

// Considered Strategy; not used because the same static assertions run at
// every fixed viewport. No behavior is swapped at runtime.
// Considered Map; not used because these three viewports are read once in
// order. A plain array has bounded size and a single linear pass.
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'phone', width: 390, height: 844 },
  { name: 'small-phone', width: 320, height: 568 }
];

const url = process.env.COSTCOOK_QA_URL ?? 'http://127.0.0.1:4321/';
const chromePath = process.env.CHROME_PATH ?? (existsSync('/opt/google/chrome/google-chrome') ? '/opt/google/chrome/google-chrome' : undefined);
const browser = await chromium.launch({ executablePath: chromePath, headless: true, args: ['--no-sandbox'] });

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });

    assert.match(await page.locator('#hero-heading').innerText(), /Know the food cost before you quote the job/);
    assert.equal(await page.locator('main h1').count(), 1);
    assert.deepEqual(await page.locator('main > section[id]').evaluateAll((sections) => sections.map((section) => section.id)), homepageStopIds);
    assert.equal(await page.locator('.journey li').count(), 5);
    assert.equal(await page.locator('.journey svg').count(), 5);
    assert.equal(await page.locator('.entry-path').count(), 3);
    assert.equal(await page.locator('.entry-path .route-steps').count(), 3);
    assert.equal(await page.locator('.entry-path > p:first-of-type').count(), 3);
    assert.equal(await page.locator('.route-connector').isVisible(), viewport.width >= 640);
    assert.match(await page.locator('.entry-path').first().innerText(), /Update and resend a revision/);
    assert.match(await page.locator('.entry-path').first().innerText(), /agreement for signature/);
    assert.match(await page.locator('.entry-path').first().innerText(), /Request the deposit/);
    assert.match(await page.locator('#event-walk .payment-thread').innerText(), /remaining balance/);
    assert.match(await page.locator('#event-walk').innerText(), /Compare food cost/);
    assert.match(await page.locator('#event-walk').innerText(), /After confirmation, each route joins the same kitchen work/);
    assert.match(await page.locator('[data-hero-media]').innerText(), /29\.2%/);
    assert.match(await page.locator('[data-hero-media]').innerText(), /Illustrative summary/);
    assert.match(await page.locator('[data-hero-media]').innerText(), /Within 30% target/);
    assert.match(await page.locator('[data-hero-media]').innerText(), /Quoted event price/);
    assert.match(await page.locator('[data-hero-media]').innerText(), /Estimated food cost/);
    assert.match(await page.locator('.hero-demo').innerText(), /Book 15 minutes with the founder/);
    assert.match(await page.locator('#connections').innerText(), /stripe/);
    assert.match(await page.locator('#connections').innerText(), /QuickBooks Online/);
    assert.match(await page.locator('#connections').innerText(), /Coming/);
    assert.equal(await page.locator('#connections .connection').count(), 5);
    const promo = page.locator('[data-promo-video]');
    await promo.locator('summary').first().click();
    assert.equal(await promo.locator('video').isVisible(), true);
    assert.equal(await promo.locator('video source').count(), 4);
    await promo.locator('.hero-transcript summary').click();
    assert.match(await promo.innerText(), /A client calls about a wedding/);
    await promo.locator('summary').first().click();

    const primary = page.locator('[data-hero-cta]');
    assert.match(await primary.innerText(), /Start free trial/);
    if (viewport.width >= 768) {
      const trialTop = await primary.evaluate((element) => element.getBoundingClientRect().top);
      const videoTop = await promo.locator('summary').first().evaluate((element) => element.getBoundingClientRect().top);
      assert.equal(trialTop, videoTop, `${viewport.name}: trial and film actions share a row`);
    }
    await primary.focus();
    assert.equal(await primary.evaluate((element) => element === document.activeElement), true);
    assert.equal(await page.locator('#kitchen .dish-row').count(), 4);
    assert.match(await page.locator('#kitchen .cost-total').innerText(), /\$22\.96/);
    assert.match(await page.locator('#kitchen .cost-total').innerText(), /24\.2% food cost/);
    await page.locator('#kitchen .cost-proof summary').click();
    assert.equal(await page.locator('#kitchen img').getAttribute('alt')?.then((alt) => alt.length > 40), true);
    await page.locator('#kitchen img').scrollIntoViewIfNeeded();
    assert.equal(await page.locator('#kitchen img').evaluate(async (image) => { await image.decode(); return image.naturalWidth > 0; }), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${viewport.name}: page overflows horizontally`);
    if (viewport.name === 'small-phone') {
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'small-phone: page overflows at 200% text');
    }
    assert.deepEqual(errors, [], `${viewport.name}: page errors`);
    await page.close();
  }

  const noScript = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await noScript.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  assert.equal(await noScript.locator('.journey li').count(), 5);
  await noScript.locator('[data-promo-video] > summary').click();
  assert.equal(await noScript.locator('[data-promo-video] video').isVisible(), true);
  assert.equal(await noScript.locator('#connections a[href="/features/integrations"]').count(), 1);
  assert.equal(await noScript.locator('[data-hero-cta]').count(), 1);
  await noScript.close();
  console.log('verify-homepage: four viewports, product proof, navigation, keyboard focus, no-JS content and no overflow passed');
} finally {
  await browser.close();
}

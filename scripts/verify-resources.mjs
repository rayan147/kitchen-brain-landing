import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

// Considered Strategy; not used because routes and widths are test data;
// one browser workflow verifies their shared navigation and copy contracts.
const base = process.env.COSTCOOK_QA_URL || 'http://127.0.0.1:4321';
const output = 'docs/qa/resources-caterer-2026-09-11';
const routes = ['/tour/main', '/who-its-for', '/onboarding', '/compare', '/faq', '/contact', '/contact/sent', '/contact/not-sent'];
const widths = [[1440,900], [1280,800], [1024,768], [768,1024], [390,844]];
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/snap/bin/chromium', args: ['--no-sandbox'] });
const results = [];
const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };
try {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  // Never send a real support request during verification.
  await context.route('**/api/support', route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ok:false}) }));
  const page = await context.newPage();
  page.on('pageerror', error => failures.push(error.message));
  for (const route of routes) {
    const slug = route.slice(1).replaceAll('/', '-');
    for (const [width,height] of widths) {
      await page.setViewportSize({width,height});
      const response = await page.goto(base+route);
      check(response.ok(), route+' responds');
      await page.locator('main h1').waitFor();
      await page.evaluate(() => document.fonts.ready);
      const metrics = await page.evaluate(() => ({ width:innerWidth, scroll:document.documentElement.scrollWidth, heading:document.querySelector('main h1')?.textContent?.trim() }));
      check(metrics.scroll <= width+1, `${route} overflow at ${width}: ${metrics.scroll}`);
      check(await page.locator('main h1').count()===1, `${route} has one page heading`);
      const broken = await page.locator('main a[href^="#"]').evaluateAll(links => links.map(a=>a.getAttribute('href')).filter(href=>href.length>1 && !document.getElementById(decodeURIComponent(href.slice(1)))));
      check(!broken.length, `${route} broken anchors: ${broken}`);
      if (!route.startsWith('/contact')) {
        const terms = await page.locator('[data-feature-trial-terms]').innerText();
        check(/Card required/.test(terms) && /Cancel before day 16/.test(terms) && /per kitchen/.test(terms),route+' clear trial terms');
      }
      if ([390,1440].includes(width)) {
        await page.screenshot({path:`${output}/${slug}-${width}.png`});
        await writeFile(`${output}/${slug}-text.txt`,await page.locator('main').innerText());
      }
      results.push({route,...metrics});
    }
    await page.setViewportSize({width:390,height:844});
    await page.addStyleTag({content:'html {font-size:200% !important;}'});
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' 200% text reflow');
  }
  // Every tour stop must remain operable and readable, including the Coming preview.
  for (const [width,height] of widths) {
    await page.setViewportSize({width,height});
    await page.goto(base+'/tour/main');
    const tabs=page.getByRole('tab',{includeHidden:true});
    assert.equal(await tabs.count(),13);
    for(let i=0;i<13;i++) {
      if(await page.getByLabel('Tour stop',{exact:true}).isVisible()) await page.getByLabel('Tour stop',{exact:true}).selectOption({index:i});
      else await tabs.nth(i).click();
      const panel=page.locator('#'+await tabs.nth(i).getAttribute('aria-controls'));
      await panel.waitFor({state:'visible'});
      await page.waitForFunction(() => !document.documentElement.dataset.tourDirection);
      assert.equal(await page.getByRole('tabpanel').count(),1);
      check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`tour stop ${i+1} reflow at ${width}`);
      if([390,1440].includes(width)) await panel.screenshot({path:`${output}/tour-stop-${i+1}-${width}.png`});
    }
  }
  // Header destinations are present through the desktop and mobile disclosures.
  for(const [width,height] of [widths[0], widths[4]]) {
    await page.setViewportSize({width,height});await page.goto(base+'/');
    const trigger = width===390 ? page.locator('header summary',{hasText:/^Menu$/}) : page.getByLabel('Resources: tour, fit, setup, comparisons and contact',{exact:true});
    await trigger.focus();await page.keyboard.press('Enter');
    for(const route of routes.slice(0,6)) check(await page.locator(`header a[href="${route}"]:visible`).count()>0,`${width} menu includes ${route}`);
    await page.screenshot({path:`${output}/menu-${width}.png`});
    await page.keyboard.press('Escape');
  }
  // Contact validation, preserved draft after failure, acknowledgement and focus return.
  await page.goto(base+'/contact');
  const open=page.getByRole('button',{name:'Ask a question',exact:true});await open.click();
  const dialog=page.getByRole('dialog');await dialog.waitFor();
  await page.getByRole('button',{name:'Send question',exact:true}).click();
  check(await page.getByLabel('Email for the reply',{exact:true}).evaluate(el=>!el.validity.valid),'empty email is rejected');
  await page.getByLabel('Email for the reply',{exact:true}).fill('caterer@example.test');
  await page.getByLabel('What can I help with?',{exact:true}).fill('Can I start with my existing recipe spreadsheet?');
  await page.getByRole('button',{name:'Send question',exact:true}).click();
  await page.getByText('Your message could not be sent. Your draft is still here, so please try again.',{exact:true}).waitFor();
  check((await page.getByLabel('What can I help with?',{exact:true}).inputValue()).includes('spreadsheet'),'failed send retains draft');
  await page.screenshot({path:`${output}/contact-error.png`});
  await context.unroute('**/api/support');
  await context.route('**/api/support',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true})}));
  await page.getByRole('button',{name:'Send question',exact:true}).click();
  await page.getByText('Question sent. Rayan will reply to caterer@example.test.',{exact:true}).waitFor();
  await page.screenshot({path:`${output}/contact-success.png`});
  await dialog.waitFor({state:'hidden'});
  check(await open.evaluate(el=>el===document.activeElement),'contact returns focus');
  check(await page.locator('[data-support-receipt]').isVisible(),'persistent receipt');
  await context.close();
  const noJs=await browser.newContext({javaScriptEnabled:false});const fallback=await noJs.newPage();
  for(const route of routes.slice(0,6)) {
    await fallback.goto(base+route);check(await fallback.locator('main h1').isVisible(),route+' no-JS heading');
    if(route==='/tour/main') {
      const guide = fallback.getByRole('link',{name:'the complete feature index',exact:true});
      check(await guide.isVisible(),'tour no-JS recovery link visible');
      await guide.click();
      check(new URL(fallback.url()).pathname.replace(/\/$/,'')==='/features','tour fallback reaches feature index');
    }
    if(route==='/contact') check(await fallback.getByLabel('Email for the reply',{exact:true}).isVisible(),'inline contact form without JS');
  }
  await noJs.close();
} finally {
  await browser.close();
  await writeFile(`${output}/verification.json`,JSON.stringify({results,failures},null,2));
}
assert.deepEqual(failures,[]);
console.log('Resources verified: 8 routes × 5 widths, 200% text, 13 tour stops, navigation, no-JS and mocked contact recovery/success.');

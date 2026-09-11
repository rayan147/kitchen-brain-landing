import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
// Considered Strategy; not used because both closing sections share one
// geometry contract and differ only in their route and accessible heading.
const base = process.env.COSTCOOK_QA_URL || 'http://localhost:4321';
const out='docs/qa/resources-closing-regression';await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/snap/bin/chromium',args:['--no-sandbox']});
const failures=[],results=[];
try {
 const page=await browser.newPage({reducedMotion:'reduce'});
 page.on('pageerror', e=>failures.push(e.message));
 for(const [route,id] of [['/tour/main#tour-recipes-costing','tour-close-heading'],['/who-its-for','close-heading']]) {
  for(const [width,height] of [[1440,900],[1280,800],[1024,768],[768,1024],[390,844]]) {
   await page.setViewportSize({width,height});await page.goto(base+route);await page.evaluate(()=>document.fonts.ready);
   const section=page.locator(`section[aria-labelledby="${id}"]`);
   await section.scrollIntoViewIfNeeded();
   const rect=await section.evaluate(el=>{
    const heading=el.querySelector('h2').getBoundingClientRect();
    const links=[...el.querySelectorAll('a')].filter(a=>a.className.includes('btn-')).map(a=>a.getBoundingClientRect());
    return {headingWidth:heading.width,headingHeight:heading.height,overlap:links.some(r=>r.left<heading.right&&r.right>heading.left&&r.top<heading.bottom&&r.bottom>heading.top),overflow:document.documentElement.scrollWidth>innerWidth+1};
   });
   if(width>=1024 && rect.headingWidth<300) failures.push(`${route} at ${width}: heading squeezed to ${rect.headingWidth}px`);
   if(rect.overlap||rect.overflow) failures.push(`${route} at ${width}: ${JSON.stringify(rect)}`);
   results.push({route,width,...rect});
   await section.screenshot({path:`${out}/${id}-${width}.png`});
  }
 }
 await page.goto(base+'/tour/main#tour-recipes-costing');
 await page.locator('#tour-panel-recipes-costing').waitFor({state:'visible'});
 await page.getByRole('button',{name:'Next: Menus & quotes',exact:true}).click();
 await page.locator('#tour-panel-menus-quotes').waitFor({state:'visible'});
 await page.getByRole('button',{name:'Previous stop',exact:true}).click();
 await page.locator('#tour-panel-recipes-costing').waitFor({state:'visible'});
} finally {await browser.close();await writeFile(`${out}/results.json`,JSON.stringify({results,failures},null,2));}
assert.deepEqual(failures,[]);console.log('Closing geometry and tour deep-link navigation passed.');

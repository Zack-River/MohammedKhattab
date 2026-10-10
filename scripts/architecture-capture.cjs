/* eslint-disable @typescript-eslint/no-require-imports -- Evidence capture runs as a Node script. */
const { chromium } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const phase = process.env.CAPTURE_PHASE || 'baseline';
const destination = path.resolve('docs/evidence/architecture-acceptance', phase);
const routes = ['/ta3allam', '/ta3allam/courses', '/ta3allam/courses?category=motion', '/ta3allam/courses?q=missing-term', '/ta3allam/courses/editing-foundations', '/ta3allam/courses/motion-essentials', '/ta3allam/login', '/ta3allam/dashboard', '/ta3allam/dashboard/courses', '/ta3allam/dashboard/profile', '/ta3allam/dashboard/resources', '/ta3allam/dashboard/certificates', '/ta3allam/learn/editing-foundations/first-cut', '/ta3allam/courses/unknown-course'];
(async () => {
 fs.mkdirSync(destination, {recursive:true});
 const browser = await chromium.launch({headless:true});
 const results=[];
 for (const [app,baseURL,paths] of [['workshop','http://localhost:3040',['/7days-freelance']], ['lms','http://localhost:3040',routes]]) {
  for (const width of [320,390,768,1440]) {
   const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
   const page=await context.newPage();
   for (const route of paths) {
    const errors=[];
    const onError=(error)=>errors.push(String(error));
    page.on('pageerror',onError);
    await page.goto(baseURL+route);
    await page.evaluate(()=>document.fonts.ready);
    await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(resolve=>requestAnimationFrame(resolve));}scrollTo(0,0);});
    await page.locator('body').evaluate(async()=>{
     await Promise.all([...document.images].map(image=>image.complete ? Promise.resolve():new Promise(resolve=>{image.onload=resolve;image.onerror=resolve;setTimeout(resolve,1500);})));
    });
    const name=`${app}-${route.replace(/[^a-z0-9]+/gi,'-')}-${width}`;
    await page.screenshot({path:path.join(destination,name+'.png'),fullPage:true,mask:app==='workshop'?[page.locator('.countdown-numbers'),page.locator('.recent-signup-toast')]:[]});
    const geometry=await page.locator('section,.lms-course-card,h1,.lms-primary-action,.faq-answer-panel').evaluateAll(elements=>elements.map(element=>{
     const rect=element.getBoundingClientRect();const css=getComputedStyle(element);
     return {tag:element.tagName,id:element.id,class:element.className,x:rect.x,y:rect.y+scrollY,width:rect.width,height:rect.height,color:css.color,background:css.backgroundColor,font:css.fontFamily,weight:css.fontWeight};
    }));
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    results.push({app,route,width,name,geometry,overflow,errors});
    page.off('pageerror',onError);
   }
   await context.close();
   process.stdout.write(`${app} ${width}: captured\n`);
  }
 }
 const performance=[];
 for(const [app,url] of [['workshop','http://localhost:3040/7days-freelance'],['lms','http://localhost:3040/ta3allam']]){
  for(let run=0;run<5;run++){
   const context=await browser.newContext({viewport:{width:1440,height:900}});
   const page=await context.newPage();
   await page.addInitScript(()=>{
    window.__audit={cls:0,longTasks:[],frames:[]};
    new PerformanceObserver(list=>list.getEntries().forEach(entry=>{if(!entry.hadRecentInput)window.__audit.cls+=entry.value;})).observe({type:'layout-shift',buffered:true});
    new PerformanceObserver(list=>window.__audit.longTasks.push(...list.getEntries().map(entry=>entry.duration))).observe({type:'longtask',buffered:true});
   });
   await page.goto(url); await page.evaluate(()=>document.fonts.ready);
   await page.evaluate(async()=>{
    let last=performance.now();
    for(let i=0;i<120;i++) await new Promise(resolve=>requestAnimationFrame(now=>{window.__audit.frames.push(now-last);last=now;scrollBy(0,60);resolve();}));
   });
   performance.push({app,run,...await page.evaluate(()=>({ ...window.__audit,resources:performance.getEntriesByType('resource').filter(entry=>/\.(js|css)(\?|$)/.test(entry.name)).map(entry=>({url:entry.name.replace(location.origin,''),bytes:entry.encodedBodySize}))}))});
   await context.close();
  }
 }
 fs.writeFileSync(path.join(destination,'screens.json'),JSON.stringify(results,null,2));
 fs.writeFileSync(path.join(destination,'performance.json'),JSON.stringify(performance,null,2));
 await browser.close();
})().catch(error=>{process.stderr.write(String(error)+'\n');process.exit(1);});

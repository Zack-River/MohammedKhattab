/* eslint-disable @typescript-eslint/no-require-imports -- Production layout-shift evidence. */
const {chromium}=require('@playwright/test'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1440,height:900}});
 await page.addInitScript(()=>{
  window.shiftEvidence=[];
  new PerformanceObserver(list=>list.getEntries().forEach(entry=>{
   if(!entry.hadRecentInput)window.shiftEvidence.push({time:entry.startTime,value:entry.value,sources:entry.sources.map(source=>({tag:source.node?.tagName,id:source.node?.id,class:source.node?.className,previous:source.previousRect,current:source.currentRect}))});
  })).observe({type:'layout-shift',buffered:true});
 });
 await page.goto('http://localhost:3040/7days-freelance');await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(async()=>{for(let i=0;i<120;i++)await new Promise(resolve=>requestAnimationFrame(()=>{scrollBy(0,60);resolve();}));});
 const evidence=await page.evaluate(()=>window.shiftEvidence);fs.writeFileSync('docs/evidence/architecture-acceptance/layout-shifts.json',JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence));await browser.close();
})().catch(error=>{console.error(error);process.exitCode=1;});

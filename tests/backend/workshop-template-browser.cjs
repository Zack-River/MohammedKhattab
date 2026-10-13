/* eslint-disable @typescript-eslint/no-require-imports -- Real editor interactions and responsive main navigation. */
const {chromium,expect}=require('@playwright/test'),fs=require('node:fs');
module.exports=async({manager,slug,url,verify})=>{
 const browser=await chromium.launch(),page=await browser.newPage({reducedMotion:"reduce"}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error'&&/hydration|hydrated|didn.t match/i.test(message.text()))errors.push(message.text());});
 try{
  await page.context().request.post(url+'/api/auth/login',{headers:{Origin:url},data:{email:manager.email,password:manager.password}});
  const path='/admin/dashboard/courses/'+slug+'/template';
  for(const width of [320,390,768,1440]) {
   await page.setViewportSize({width,height:900});await page.goto(url+path);await page.waitForLoadState('networkidle');
   await page.locator('.lms-template-editor > fieldset > details').first().locator('summary').first().click();
   await expect(page.getByLabel('الوصف',{exact:true}).first()).toBeVisible();
   verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Template editor fits '+width);
   if([390,1440].includes(width)){await page.evaluate(()=>scrollTo(0,0));fs.mkdirSync('docs/evidence/workshop-template',{recursive:true});await page.screenshot({path:`docs/evidence/workshop-template/editor-${width}.png`,fullPage:true});}
  }
  await page.getByLabel('الوصف',{exact:true}).first().fill('Saved using the reusable template editor');
  const response=page.waitForResponse(r=>r.url().endsWith('/api/admin/courses/'+slug+'/template')&&r.request().method()==='POST');
  await page.getByRole('button',{name:'حفظ التصميم',exact:true}).click();verify((await response).status()===200,'Browser saves template through protected API');
  await expect(page.getByText('تم حفظ التصميم',{exact:true})).toBeVisible();
  await page.reload();await page.locator('.lms-template-editor > fieldset > details').first().locator('summary').first().click();
  await expect(page.getByLabel('الوصف',{exact:true}).first()).toHaveValue('Saved using the reusable template editor');verify(true,'Edited template survives reload');
  for(const width of [390,1440]) {
   await page.setViewportSize({width,height:900});await page.goto(url+'/featured/'+slug);await page.waitForLoadState('networkidle');
   await expect(page.getByText('Saved using the reusable template editor',{exact:true})).toBeVisible();
   verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Featured workshop fits '+width);
   verify(await page.locator('header.lms-site-header').count()===1&&await page.locator('header').count()===1,'Featured workshop has exactly one shared navbar at '+width);
   if(width===390){await page.getByRole('button',{name:'فتح قائمة التنقل',exact:true}).click();await expect(page.locator('.lms-marketing-links')).toBeVisible();}
   await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`docs/evidence/workshop-template/public-${width}.png`,fullPage:true});
  }
  verify(errors.length===0,'Template editor and public page have no runtime or hydration errors');
 }finally{await browser.close();}
};

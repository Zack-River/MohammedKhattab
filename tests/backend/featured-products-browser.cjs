/* eslint-disable @typescript-eslint/no-require-imports -- Bundle template editing and responsive public urgency. */
const {chromium,expect}=require('@playwright/test');
module.exports=async({manager,url,bundleSlug,api,verify})=>{
 const browser=await chromium.launch(),page=await browser.newPage({reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 try{
  await page.context().request.post(url+'/api/auth/login',{headers:{Origin:url},data:{email:manager.email,password:manager.password}});
  await page.clock.install();
  await page.goto(url+'/admin/dashboard/commerce/bundles/'+bundleSlug+'/template');
  await page.locator('.lms-template-editor > fieldset > details').first().locator('summary').first().click();
  await page.getByLabel('الوصف',{exact:true}).first().fill('Bundle content saved from browser');
  const response=page.waitForResponse(r=>r.url().endsWith(api)&&r.request().method()==='POST');
  await page.getByRole('button',{name:'حفظ التصميم',exact:true}).click();verify((await response).status()===200,'Shared browser editor saves bundle template');
  for(const width of [390,1440]){
   await page.setViewportSize({width,height:900});await page.goto(url+'/bundles/'+bundleSlug);
   await expect(page.getByRole('heading',{name:'Distinct bundle heading',exact:true})).toBeVisible();
   verify(await page.locator('header.lms-site-header').count()===1&&await page.locator('footer').count()===1,'Bundle has one navbar/footer at '+width);
   await expect(page.locator('.top-scarcity-bar')).toContainText('Actual bundle sale');
   await expect(page.locator('.top-scarcity-bar')).not.toContainText('بيشاهدوا');
   verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Bundle featured layout fits '+width);
   await expect(page.locator('.hero-section a[href="/checkout/'+bundleSlug+'?kind=bundle"]').first()).toHaveAttribute('href','/checkout/'+bundleSlug+'?kind=bundle');
  }
  await page.clock.fastForward(3_700_000);await expect(page.locator('.top-scarcity-bar')).toHaveCount(0);verify(true,'Offer strip disappears at the real deadline without reloading');
  verify(errors.length===0,'Bundle editor and public page have no runtime errors');
 }finally{await browser.close();}
};

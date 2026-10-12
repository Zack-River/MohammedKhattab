/* eslint-disable @typescript-eslint/no-require-imports -- Checkout browser acceptance using the local test gateway. */
const {chromium,expect}=require('@playwright/test'),fs=require('node:fs');
module.exports=async function({url,user,slug,verify}){
 const browser=await chromium.launch(),context=await browser.newContext(),page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  const login=await context.request.post(url+'/api/auth/login',{data:{email:user.email,password:user.password},headers:{Origin:url}});
  verify(login.ok(),'Browser authenticates checkout customer');
  for(const viewport of [{width:320,height:568},{width:390,height:844},{width:1440,height:900}]){
   await page.setViewportSize(viewport);await page.goto(url+'/checkout/'+slug);
   await expect(page.getByRole('heading',{name:'إتمام الاشتراك',exact:true})).toBeVisible();
   const button=page.getByRole('button',{name:'الانتقال للدفع الآمن',exact:true});await expect(button).toBeVisible();
   const total=page.locator('.lms-payment-total');verify(await total.evaluate(el=>getComputedStyle(el).display==='flex'),'Price summary uses an actual responsive row');
   const box=await button.boundingBox();verify(box.width>=44&&box.height>=44&&box.x>=0&&box.x+box.width<=viewport.width,'Checkout action fits '+viewport.width+'px viewport');
   verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Checkout has no horizontal overflow at '+viewport.width+'px');
   await expect.poll(()=>page.locator('.lms-profile-card').evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
   if(viewport.width!==320){fs.mkdirSync('docs/evidence/payments',{recursive:true});await page.screenshot({path:`docs/evidence/payments/checkout-${viewport.width}.png`,fullPage:true});}
  }
  await page.getByRole('button',{name:'الانتقال للدفع الآمن',exact:true}).click();
  await expect(page).toHaveURL(/http:\/\/127\.0\.0\.1:3046\/ts\/[^?]+\?lg=ar$/);
  verify(true,'Checkout button redirects to the hosted provider instead of handling card data');
  verify(errors.length===0,'Checkout has no hydration or runtime errors');
 }finally{await browser.close();}
};

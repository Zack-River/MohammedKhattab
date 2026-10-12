/* eslint-disable @typescript-eslint/no-require-imports -- Commerce UI and responsive checkout with isolated data. */
const {chromium,expect}=require('@playwright/test'),fs=require('node:fs');
module.exports=async({manager,user,bundleSlug,coupon,url,verify})=>{
 const browser=await chromium.launch(),page=await browser.newPage({timezoneId:'Africa/Cairo'}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',message=>{if(message.type()==='error'&&/hydration|hydrated|didn.t match/i.test(message.text()))errors.push(message.text());});
 try {
  await page.context().request.post(url+'/api/auth/login',{headers:{Origin:url},data:{email:manager.email,password:manager.password}});
  for(const width of [320,390,768,1440]) {
   await page.setViewportSize({width,height:900});await page.goto(url+'/admin/dashboard/commerce/coupons');await page.waitForLoadState('networkidle');
   verify(await page.locator('tbody tr').count()<=5,'Admin commerce shows at most five records at '+width);
   verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Admin commerce fits '+width);
   await page.locator('.lms-admin-table-wrap').scrollIntoViewIfNeeded();await expect(page.locator('.lms-admin-table-wrap')).toHaveCSS('opacity','1');verify(true,'Commerce records reveal on screen at '+width);await page.evaluate(()=>scrollTo(0,0));
   if([390,1440].includes(width)){fs.mkdirSync('docs/evidence/commerce',{recursive:true});await page.screenshot({path:`docs/evidence/commerce/admin-coupons-${width}.png`,fullPage:true});}
   await page.getByRole('button',{name:'إضافة جديد',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();
   verify(await page.getByRole('dialog').evaluate(el=>el.getBoundingClientRect().left>=0&&el.getBoundingClientRect().right<=innerWidth),'Commerce dialog fits '+width);
   await page.getByRole('button',{name:'إغلاق',exact:true}).click();
  }
  await page.setViewportSize({width:1440,height:1000});await page.goto(url+'/admin/dashboard/commerce/bundles');await page.waitForLoadState('networkidle');
  await page.getByRole('button',{name:'تعديل',exact:true}).first().click();await expect(page.getByLabel('سعر الباقة (ج.م)')).toHaveValue('1200');
  verify(await page.getByRole('checkbox',{name:'مفعّل',exact:true}).isChecked(),'Edit modal preserves bundle fields');
  await page.getByRole('button',{name:'إغلاق',exact:true}).click();
  await page.goto(url+'/admin/dashboard/commerce/coupons');await page.waitForLoadState('networkidle');
  const scheduled=page.locator('tbody tr').filter({hasText:'LATER_'});await scheduled.getByRole('button',{name:'تعديل',exact:true}).click();
  const date=page.locator('input[name="startsAt"]');await expect(date).not.toHaveValue('');
  const scheduledRecord=JSON.parse((await manager.api('/api/admin/commerce/coupons')).data).records.find(record=>record.key.startsWith('LATER_'));
  const roundTrip=await date.evaluate(el=>new Date(el.value).toISOString());verify(Math.abs(Date.parse(roundTrip)-Date.parse(scheduledRecord.startsAt))<60000,'Cairo-local date preserves stored campaign instant after hydration');
  await page.getByRole('button',{name:'إغلاق',exact:true}).click();
  const uiCode='UI_'+require('node:crypto').randomUUID().replaceAll('-','').slice(0,12).toUpperCase();
  await page.getByRole('button',{name:'إضافة جديد',exact:true}).click();
  await page.getByLabel('الاسم',{exact:true}).fill('Browser coupon');await page.getByLabel('الرابط أو كود الكوبون',{exact:true}).fill(uiCode);
  await page.getByRole('checkbox',{name:'مفعّل',exact:true}).check();await page.getByRole('dialog').getByRole('button',{name:'حفظ',exact:true}).click();await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByLabel('بحث بالاسم أو الكود').fill(uiCode);await page.getByRole('button',{name:'تطبيق',exact:true}).click();await expect(page.locator('tbody tr')).toHaveCount(1);
  verify(true,'Browser creates coupon and combined search finds it');
  await page.getByRole('button',{name:'حذف',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'حذف',exact:true}).click();await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.locator('tbody tr')).toHaveCount(0);
  verify(true,'Browser deletes unused coupon through confirmation dialog');
  await page.goto(url+'/admin/dashboard/sales');await expect(page.getByRole('heading',{name:'المبيعات',exact:true})).toBeVisible();verify(await page.locator('tbody tr').count()<=5,'Admin sales table uses real paginated orders');
  await page.context().request.post(url+'/api/auth/logout',{headers:{Origin:url},data:{}});
  await page.context().request.post(url+'/api/auth/login',{headers:{Origin:url},data:{email:user.email,password:user.password}});
  for(const width of [320,390,768,1440]) {
   await page.setViewportSize({width,height:900});await page.goto(url+'/checkout/'+bundleSlug+'?kind=bundle');await page.waitForLoadState('networkidle');
   await expect(page.getByLabel('كود الخصم',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'الانتقال للدفع الآمن',exact:true})).toBeVisible();
   verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Bundle checkout fits '+width);
   const input=page.getByLabel('كود الخصم',{exact:true});verify(await input.evaluate(el=>getComputedStyle(el).backgroundColor==='rgb(16, 19, 23)'&&el.getBoundingClientRect().height>=44),'Coupon field uses shared dark input at '+width);
   if(width===390) await page.screenshot({path:'docs/evidence/commerce/checkout-390.png',fullPage:true});
  }
  await page.getByLabel('كود الخصم',{exact:true}).fill(coupon);await page.getByRole('button',{name:'تطبيق الكوبون',exact:true}).click();
  await expect(page.getByText('خصم الكوبون',{exact:true})).toBeVisible();await expect(page.locator('.lms-payment-total dd')).toHaveText('1100 ج.م');
  verify(true,'Applying coupon visibly updates checkout breakdown');
  await page.getByRole('button',{name:new RegExp('إزالة الكوبون')}).click();await expect(page.locator('.lms-payment-total dd')).toHaveText('1200 ج.م');
  verify(true,'Removing coupon restores current bundle total');
  fs.mkdirSync('docs/evidence/commerce',{recursive:true});await page.screenshot({path:'docs/evidence/commerce/checkout-1440.png',fullPage:true});
  await page.goto(url+'/bundles/'+bundleSlug);await expect(page.locator('.lms-bundle-card li')).toHaveCount(2);verify(true,'Bundle detail lists included courses with individual links');
  verify(errors.length===0,'Commerce pages have no hydration or runtime errors');
 } finally {await browser.close();}
};

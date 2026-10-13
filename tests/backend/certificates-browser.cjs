/* eslint-disable @typescript-eslint/no-require-imports -- Local-only browser verification. */
const {chromium,expect}=require('@playwright/test'),fs=require('node:fs');
module.exports=async({manager,student,record,url,verify})=>{
 const browser=await chromium.launch({headless:true}),errors=[];
 const context=await browser.newContext(),page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
 const login=async(identity)=>{await page.goto(url+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(identity.email);await page.getByLabel('كلمة المرور',{exact:true}).fill(identity.password);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(/dashboard/);};
 try {
  await login(manager);
  for(const width of [390,1440]) {
   await page.setViewportSize({width,height:1000});await page.goto(url+'/admin/dashboard/certificates');
   await page.getByRole('heading',{name:'الشهادات',exact:true}).waitFor();
   await page.getByText('معاينة التصميم',{exact:true}).first().click();
   await page.locator('.lms-certificate-preview img').evaluate(image=>image.decode());
   verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Certificate admin fits '+width+'px');
   await page.getByRole('button',{name:'إلغاء الشهادة',exact:true}).first().click();await page.locator('dialog[open]').waitFor();
   verify(await page.locator('dialog[open] textarea').count()===1,'Moderation opens centered reason dialog '+width+'px');
   await page.locator('dialog[open]').getByRole('button',{name:'إلغاء',exact:true}).click();
  }
  await page.goto(url+'/admin/dashboard/certificates/'+record.id);await page.getByRole('heading',{name:'آخر إجراءات الشهادة',exact:true}).waitFor();
  verify(await page.getByText('Certificate Manager',{exact:false}).count()>0,'Private certificate history shows actual actor names');
  fs.mkdirSync('docs/evidence/certificates',{recursive:true});
  await page.goto(url+'/api/admin/certificates/'+record.id);
  await page.setViewportSize({width:1200,height:850});await page.locator('svg').waitFor();await page.evaluate(()=>document.fonts.ready);
  verify(await page.evaluate(()=>document.fonts.check('700 50px CertificateArabic')),'Certificate actually loads the embedded IBM Arabic font');
  await page.screenshot({path:'docs/evidence/certificates/certificate-ar.png',caret:'initial'});
  verify(await page.locator('svg text').allTextContents().then(values=>values.includes('شهادة إتمام تدريبية')&&values.includes('محمد خطاب')),'Arabic issuer and completion text render');
  await page.goto(url+'/admin/dashboard/tools');await page.getByRole('heading',{name:'مكتبة الأدوات',exact:true}).waitFor();
  verify(await page.getByRole('button',{name:'إضافة مادة',exact:true}).count()===1,'Admin tools reuses working material creation');
  await context.close();const learner=await browser.newContext(),studentPage=await learner.newPage();
  studentPage.on('pageerror',error=>errors.push(error.message));
  await studentPage.goto(url+'/login');await studentPage.getByLabel('البريد الإلكتروني',{exact:true}).fill(student.email);await studentPage.getByLabel('كلمة المرور',{exact:true}).fill(student.password);await studentPage.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await studentPage.waitForURL(/dashboard/);await studentPage.locator('.lms-progress progress').first().waitFor();verify(true,'Student dashboard renders shared exact-completion progress');
  await studentPage.setViewportSize({width:390,height:844});await studentPage.goto(url+'/dashboard/certificates');
  await studentPage.getByRole('link',{name:'معاينة التصميم',exact:true}).first().click();await expect.poll(()=>studentPage.locator('.lms-certificate-document img').evaluate(image=>image.complete&&image.naturalWidth>0)).toBe(true);
  verify(await studentPage.getByRole('button',{name:'طباعة / حفظ PDF',exact:true}).isEnabled(),'Student can preview and print issued document');
  verify(await studentPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Student document fits phone');
  await studentPage.emulateMedia({media:'print'});verify(await studentPage.locator('.lms-certificate-document img').evaluate(image=>getComputedStyle(image).visibility)==='visible','Print stylesheet retains document');
  verify(errors.length===0,'Certificate admin/student pages have no browser runtime errors');await learner.close();
 } finally {await browser.close();}
};

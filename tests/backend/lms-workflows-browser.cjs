/* eslint-disable @typescript-eslint/no-require-imports -- Real student/admin browser acceptance. */
const { chromium, expect } = require('@playwright/test');
module.exports=async({url,student,manager,slug,verify})=>{
 const browser=await chromium.launch({headless:true}),page=await browser.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 const login=async(user)=>{await page.goto(url+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(user.email);await page.getByLabel('كلمة المرور',{exact:true}).fill(user.password);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await expect(page).toHaveURL(/dashboard$/);};
 try {
  await login(student);await page.goto(url+'/learn/'+slug+'/second');
  const links=page.locator('.lms-lesson-outline nav a');
  verify((await links.allTextContents()).map(text=>text.match(/Lesson (first|second|third)/)[1]).join(',')==='second,first,third','Sidebar follows section order before unassigned lessons');
  await page.getByRole('link',{name:'الدرس التالي',exact:true}).click();await expect(page).toHaveURL(url+'/learn/'+slug+'/first');
  verify(true,'Next lesson follows the same order as curriculum and sidebar');
  await page.getByRole('link',{name:'الدرس السابق',exact:true}).click();await expect(page).toHaveURL(url+'/learn/'+slug+'/second');
  verify(true,'Previous lesson returns to preceding section lesson');
  await expect(page.locator('.lms-outline-check.is-complete')).toHaveCount(1);
  await page.goto(url+'/dashboard/purchases');
  await expect(page.locator('.lms-commerce-table tbody tr')).toHaveCount(5);
  verify(true,'Payment history displays at most five orders per page');
  await page.getByRole('link',{name:'التالي',exact:true}).click();await expect(page.locator('.lms-commerce-table tbody tr')).toHaveCount(2);
  verify(true,'Payment history pagination preserves remaining owned records');
  for(const width of [320,390,768,1440]) {
   await page.setViewportSize({width,height:900});await page.goto(url+'/dashboard/purchases?q=Pending&status=pending');
   await expect(page.locator('.lms-commerce-table tbody tr')).toHaveCount(1);
   verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Payment history fits '+width+'px');
  }
  const receipt=page.getByRole('link',{name:'عرض حالة الطلب',exact:true});
  await receipt.scrollIntoViewIfNeeded();await expect(page.locator('.lms-admin-table-wrap')).toHaveCSS('opacity','1');
  await receipt.click();await expect(page).toHaveURL(/\/payments\//,{timeout:15000});
  verify(true,'Pending request has a recoverable private status destination');
  for(const status of ['failed','expired']) {
   let polls=0,receiptPath='';const listener=request=>{if(receiptPath && request.url().endsWith('/api'+receiptPath+'/reconcile')) polls++;};page.on('request',listener);
   await page.goto(url+'/dashboard/purchases?status='+status);
   await expect(page.locator('.lms-admin-table-wrap')).toHaveCSS('opacity','1');
   const link=page.getByRole('link',{name:'عرض حالة الطلب',exact:true});receiptPath=await link.getAttribute('href');await link.click();
   await expect(page).toHaveURL(/\/payments\//,{timeout:15000});await expect(page.locator('.lms-payment-card')).toBeVisible();
   verify(polls===0,'Terminal '+status+' receipt avoids automatic gateway polling');page.off('request',listener);
  }
  await page.context().clearCookies();await login(manager);
  const profile=await manager.api('/api/admin/users/'+student.id),username=JSON.parse(profile.data).user.username;
  await page.goto(url+'/admin/dashboard/users/'+username);await expect(page.locator('progress').first()).toHaveAttribute('value','33');
  verify(true,'Admin user page renders shared progress visualization');
  verify(errors.length===0,'Learning and payment history flows have no browser exceptions');
 }finally{await browser.close();}
};

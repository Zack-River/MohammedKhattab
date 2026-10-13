/* eslint-disable @typescript-eslint/no-require-imports -- Browser checks use disposable local accounts. */
const {chromium,expect}=require('@playwright/test');
async function login(page,url,account){
 await page.goto(url+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(account.email);
 await page.getByLabel('كلمة المرور',{exact:true}).fill(account.password);
 await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(/\/dashboard/);
}
module.exports=async({manager,student,verify,url,admin,session,slug,lessonId})=>{
 const browser=await chromium.launch({headless:true});const page=await browser.newPage();const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await login(page,url,manager);await page.goto(url+'/admin/dashboard/live-sessions');
  for(const width of [320,390,1440]){
   await page.setViewportSize({width,height:900});
   verify(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),`Admin schedule fits ${width}px`);
  }
  await page.screenshot({path:'/tmp/khatab-live-admin.png',fullPage:true});
  await page.getByRole('button',{name:'إضافة جلسة مباشرة',exact:true}).click();
  await expect(page.locator('input[name="startsLocal"]')).toBeVisible();
  await expect(page.locator('input[name="endsLocal"]')).toBeVisible();
  verify(true,'Admin has reusable date/time scheduling form');
  await page.getByRole('button',{name:'إلغاء',exact:true}).click();
  await page.getByRole('button',{name:'حذف',exact:true}).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('dialog').getByRole('button',{name:'إلغاء',exact:true}).last().click();
  await expect(page.getByRole('dialog')).toHaveCount(0);verify(true,'Deletion uses dismissible themed centered dialog');
  await page.context().clearCookies();await login(page,url,student);
  // Short real-time boundaries test server clock, polling and rendered link removal together.
  await admin.from('live_sessions').update({starts_at:new Date(Date.now()+5000).toISOString(),ends_at:new Date(Date.now()+12000).toISOString()}).eq('id',session.id);
  await page.goto(url+'/dashboard/live-sessions');
  await expect(page.getByText('لم تبدأ بعد',{exact:true})).toBeVisible();
  await expect(page.getByRole('link',{name:'انضم للجلسة',exact:true})).toHaveCount(0);
  verify(true,'Upcoming schedule has start time and no join link');
  await expect(page.getByRole('link',{name:'انضم للجلسة',exact:true})).toBeVisible({timeout:12000});
  verify(true,'Join action appears automatically at start without reload');
  await expect(page.getByRole('link',{name:'انضم للجلسة',exact:true})).toHaveCount(0,{timeout:15000});
  await expect(page.getByText('انتهت',{exact:true})).toBeVisible();
  await expect(page.getByText('انتهت في:',{exact:false})).toBeVisible();
  verify(true,'At end the link disappears and actual end time remains');
  await page.screenshot({path:'/tmp/khatab-live-student.png',fullPage:true});
  for(const width of [320,390,1440]){
   await page.setViewportSize({width,height:900});
   verify(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),`Student schedule fits ${width}px`);
  }
  await page.goto(url+`/courses/${slug}`);await expect(page.getByRole('heading',{name:'الجلسات والدروس المباشرة',exact:true})).toBeVisible();
  verify(true,'Recorded course details show live sessions');
  await page.goto(url+`/learn/${slug}/${lessonId}`);
  await expect(page.getByRole('heading',{name:'الجلسات والدروس المباشرة',exact:true})).toBeVisible();
  await expect(page.getByText('Critique section',{exact:false}).first()).toBeVisible();
  verify(true,'Recorded lesson page includes assigned live session and section title');
  verify(errors.length===0,'Live-session pages have no browser errors');
 }finally{await browser.close();}
};

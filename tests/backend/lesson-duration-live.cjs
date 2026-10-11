/* eslint-disable @typescript-eslint/no-require-imports -- Read-only hosted automatic-duration acceptance. */
const {chromium,expect}=require('@playwright/test'),fs=require('node:fs');process.loadEnvFile('.env.local');
(async()=>{
 const origin=process.env.TARGET_URL||'https://ta3allam.vercel.app',browser=await chromium.launch(),checks=[],errors=[];
 try{
  const page=await browser.newPage();page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/api/admin/courses/**',route=>route.request().method()==='POST'?route.abort():route.continue());
  await page.goto(origin+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill('admin@ta3allam.com');await page.getByLabel('كلمة المرور',{exact:true}).fill(process.env.TA3ALLAM_ADMIN_PASSWORD);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL('**/admin/dashboard');
  const listing=await (await page.request.get(origin+'/api/admin/courses')).json();const slug=listing.courses.find(course=>course.chapters>0)?.slug;if(!slug)throw new Error('No existing chapter available for read-only lesson modal verification');
  const endpoint=origin+'/api/admin/courses/'+slug,before=await (await page.request.get(endpoint)).json();
  await page.goto(origin+'/admin/dashboard/courses/'+slug+'/content');await page.getByRole('button',{name:'إضافة درس',exact:true}).first().click();
  const dialog=page.getByRole('dialog'),duration=dialog.getByLabel('مدة الدرس بالثواني',{exact:true});await expect(duration).toHaveValue('');await expect(duration).toHaveAttribute('readonly','');checks.push('Read-only duration has no manually entered default');
  await dialog.getByLabel('رابط فيديو الدرس',{exact:true}).fill('https://drive.google.com/file/d/1pVLFPEqSMCXJAjAR3VRl69hg_3zVQctu/view');await expect(duration).toHaveValue(/^[1-9][0-9]*$/,{timeout:45000});const seconds=Number(await duration.inputValue());checks.push('Real supplied Drive file duration calculated through protected stream');
  await page.setViewportSize({width:390,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'docs/evidence/backend/lesson-duration-live-390.png'});checks.push('Automatic duration fits mobile lesson dialog');
  await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);checks.push('Closing dialog restores page');
  expect(await (await page.request.get(endpoint)).json()).toEqual(before);checks.push('Existing course unchanged');expect(errors).toEqual([]);checks.push('No browser runtime errors');
  fs.writeFileSync('docs/evidence/backend/lesson-duration-live.json',JSON.stringify({origin,slug,seconds,checkedAt:new Date().toISOString(),checks,errors,readOnly:true},null,2));console.log(`${checks.length} read-only lesson-duration checks passed; supplied Drive file: ${seconds} seconds.`);
 }finally{await browser.close();}
})().catch(error=>{console.error(error.message);process.exitCode=1;});

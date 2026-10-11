/* eslint-disable @typescript-eslint/no-require-imports -- Read-only production acceptance. */
const {chromium,expect}=require('@playwright/test'),fs=require('node:fs');process.loadEnvFile('.env.local');
(async()=>{
 const origin=process.env.TARGET_URL||'https://ta3allam.vercel.app',browser=await chromium.launch(),errors=[],checks=[];
 try{
  const page=await browser.newPage();page.on('pageerror',error=>errors.push(error.message));
  expect((await page.request.get(origin+'/api/admin/courses')).status()).toBe(401);checks.push('Guest list denied');
  await page.goto(origin+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill('admin@ta3allam.com');await page.getByLabel('كلمة المرور',{exact:true}).fill(process.env.TA3ALLAM_ADMIN_PASSWORD);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL('**/admin/dashboard',{timeout:60000});
  await page.goto(origin+'/admin/dashboard/courses');await expect(page.getByRole('table')).toBeVisible();
  expect(await page.locator('thead th').count()).toBe(8);checks.push('Eight course overview columns');
  const response=await page.request.get(origin+'/api/admin/courses');expect(response.status()).toBe(200);const records=await response.json();expect(records.courses.length).toBeLessThanOrEqual(5);expect(records.total).toBeGreaterThan(0);checks.push('Authenticated database counts with bounded pagination');
  await page.getByRole('searchbox',{name:'البحث عن دورة',exact:true}).fill(records.courses[0].title);await page.getByRole('button',{name:'تطبيق',exact:true}).click();await expect(page.locator('tbody tr')).toHaveCount(1);checks.push('Search finds exact course');
  for(const width of [320,390,768,1440,1920]){
   await page.setViewportSize({width,height:1000});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(await page.locator('tbody tr').count()).toBeLessThanOrEqual(5);checks.push(`Responsive ${width}px`);
   if(width<=390){expect(await page.locator('.lms-page-heading').evaluate(element=>element.querySelector('h1').getBoundingClientRect().bottom<=element.querySelector('.btn-primary').getBoundingClientRect().top)).toBe(true);checks.push(`Stacked mobile heading ${width}px`);}
   await page.getByRole("table").scrollIntoViewIfNeeded();await expect(page.locator(".lms-admin-table-wrap")).toHaveCSS("opacity","1");await page.evaluate(()=>window.scrollTo(0,0));if(width===390||width===1440)await page.screenshot({path:`docs/evidence/backend/admin-courses-live-${width}.png`,fullPage:true});
  }
  await page.goto(origin+'/admin/dashboard/courses/new');await expect(page.getByLabel('رابط الدورة',{exact:true})).toBeVisible();checks.push('Create draft screen accessible');
  await page.goto(origin+'/admin/dashboard/courses/'+records.courses[0].slug);await expect(page.getByLabel('اسم الدورة',{exact:true})).toBeVisible();expect(await page.getByLabel('رابط فيديو الدرس',{exact:true}).count()).toBe(0);checks.push('Overview editor excludes lesson details');
  await page.getByRole('link',{name:'الفصول والأقسام والدروس',exact:true}).click();await expect(page).toHaveURL(/\/content$/);checks.push('Dedicated content route');
  expect(errors).toEqual([]);fs.writeFileSync('docs/evidence/backend/admin-courses-live.json',JSON.stringify({origin,checkedAt:new Date().toISOString(),checks,courseTotal:records.total,errors,readOnly:true},null,2));console.log(`${checks.length} read-only hosted course-management checks passed; zero runtime errors.`);
 }finally{await browser.close();}
})().catch(error=>{console.error(error.message);process.exitCode=1;});

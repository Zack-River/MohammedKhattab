/* eslint-disable @typescript-eslint/no-require-imports -- Read-only production course-editor verification. */
const {chromium,expect}=require('@playwright/test'),fs=require('node:fs');process.loadEnvFile('.env.local');
(async()=>{
 const origin=process.env.TARGET_URL||'https://ta3allam.vercel.app',slug=process.env.TARGET_COURSE_SLUG||'testing-course',browser=await chromium.launch(),checks=[],errors=[];
 try{
  const page=await browser.newPage();page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/api/admin/courses/**',route=>route.request().method()==='POST'?route.abort():route.continue());
  await page.goto(origin+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill('admin@ta3allam.com');await page.getByLabel('كلمة المرور',{exact:true}).fill(process.env.TA3ALLAM_ADMIN_PASSWORD);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL('**/admin/dashboard',{timeout:60000});
  const endpoint=origin+'/api/admin/courses/'+slug;let response=await page.request.get(endpoint);expect(response.status()).toBe(200);const before=await response.json();expect(Number.isSafeInteger(before.revision)).toBe(true);checks.push('Revision present on real course record');
  await page.goto(origin+'/admin/dashboard/courses/'+slug);await expect(page.locator('.lms-course-editor-layout > section')).toHaveCount(3);checks.push('Three focused course form cards');
  await expect(page.getByLabel('مدة الدورة',{exact:true})).toBeVisible();checks.push('Required duration remains editable');
  await expect(page.getByLabel('السعر (ج.م)',{exact:true})).toHaveAttribute('type','text');checks.push('Price uses a plain text input');
  const free=page.getByRole('checkbox',{name:'مجاني',exact:true});expect(await free.isChecked()).toBe(before.course.offer.amount===0);checks.push('Explicit free choice reflects stored price');
  for(const width of [320,390,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1000});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);checks.push(`Editor fits ${width}px`);
   if(width>1024){const boxes=await page.locator('.lms-course-editor-layout > section').evaluateAll(elements=>elements.map(element=>{const r=element.getBoundingClientRect();return {y:r.y,bottom:r.bottom};}));expect(Math.abs(boxes[0].y-boxes[1].y)).toBeLessThan(2);expect(Math.abs(boxes[0].bottom-boxes[2].bottom)).toBeLessThan(2);checks.push(`Desktop card alignment ${width}px`);}
   if(width===390||width===1440){for(const card of await page.locator('.lms-course-editor-layout > section').all()){await card.scrollIntoViewIfNeeded();await expect(card).toHaveCSS('opacity','1');}await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`docs/evidence/backend/course-form-live-${width}.png`,fullPage:true});}
  }
  await page.getByRole('link',{name:'الفصول والأقسام والدروس',exact:true}).click();await expect(page).toHaveURL(/\/content$/);await page.getByRole('button',{name:'إضافة فصل',exact:true}).click();let dialog=page.getByRole('dialog');await expect(dialog.getByLabel('الاسم',{exact:true})).toBeVisible();checks.push('Chapter creation dialog available');await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);
  await page.setViewportSize({width:390,height:900});await page.getByRole('button',{name:'إضافة فصل',exact:true}).click();dialog=page.getByRole('dialog');const box=await dialog.boundingBox();expect(Math.abs(box.x+box.width/2-195)).toBeLessThan(2);expect(Math.abs(box.y+box.height/2-450)).toBeLessThan(2);checks.push('Mobile dialog centered');await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'إضافة فصل',exact:true})).toBeFocused();checks.push('Dialog restores keyboard focus');
  await page.goto(origin+'/admin/dashboard/courses/new');await expect(page.getByLabel('السعر (ج.م)',{exact:true})).toHaveAttribute('type','text');await expect(page.getByRole('checkbox',{name:'مجاني',exact:true})).not.toBeChecked();checks.push('Create form reuses text price and explicit free choice');
  response=await page.request.get(endpoint);expect(await response.json()).toEqual(before);checks.push('Course metadata and revision unchanged by verification');expect(errors).toEqual([]);checks.push('Zero browser runtime errors');
  fs.writeFileSync('docs/evidence/backend/curriculum-live.json',JSON.stringify({origin,slug,checkedAt:new Date().toISOString(),checks,errors,readOnly:true},null,2));console.log(`${checks.length} read-only hosted course-editor checks passed.`);
 }finally{await browser.close();}
})().catch(error=>{console.error(error.message);process.exitCode=1;});

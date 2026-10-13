/* eslint-disable @typescript-eslint/no-require-imports -- Disposable local browser accounts. */
const {chromium,expect}=require('@playwright/test');
module.exports=async({admin,manager,student,slug,url,verify})=>{
 const browser=await chromium.launch({headless:true}),page=await browser.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/hydration|hydrated|didn.t match/i.test(m.text())) errors.push(m.text());});
 try {
  await page.goto(url+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(manager.email);await page.getByLabel('كلمة المرور',{exact:true}).fill(manager.password);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(/\/dashboard/);
  const profile=(await admin.from('profiles').select('username').eq('id',student.id).single()).data;
  await page.goto(url+'/admin/dashboard/users/'+profile.username);
  const card=page.locator('.lms-resource-card').filter({hasText:'Enrollment test course'});
  await expect(card.getByRole('link')).toHaveAttribute('href','/courses/'+slug);
  await expect(card.getByText('الوصول موقوف',{exact:true})).toBeVisible();
  for(const width of [320,390,1440]){await page.setViewportSize({width,height:900});verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Enrollment management fits ${width}px`);}
  await card.getByRole('button',{name:'استعادة الاشتراك',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('dialog').getByLabel('سبب التغيير',{exact:true}).fill('Browser restoration after review');await page.getByRole('dialog').getByRole('button',{name:'تأكيد التغيير',exact:true}).click();await expect(page.getByRole('dialog')).toHaveCount(0);await expect(card.getByText('اشتراك نشط',{exact:true})).toBeVisible();verify(true,'Browser restores enrollment through guarded API');
  await card.getByRole('button',{name:'إيقاف الوصول',exact:true}).click();await page.getByRole('dialog').getByLabel('سبب التغيير',{exact:true}).fill('Browser revocation');await page.getByRole('dialog').getByRole('button',{name:'تأكيد التغيير',exact:true}).click();await expect(page.getByRole('dialog')).toHaveCount(0);await expect(card.getByText('الوصول موقوف',{exact:true})).toBeVisible();verify(true,'Browser revokes without deleting progress card');
  await card.getByRole('button',{name:'استعادة الاشتراك',exact:true}).click();
  const revision=(await admin.from('enrollments').select('revision').eq('user_id',student.id).eq('course_slug',slug).single()).data.revision;
  await manager.api(`/api/admin/users/${student.id}/enrollments`,{courseSlug:slug,action:'restore',reason:'Competing administrator',revision});
  await page.getByRole('dialog').getByLabel('سبب التغيير',{exact:true}).fill('Draft retained on conflict');await page.getByRole('dialog').getByRole('button',{name:'تأكيد التغيير',exact:true}).click();
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('تغيّر الاشتراك');await expect(page.getByRole('dialog').getByLabel('سبب التغيير',{exact:true})).toHaveValue('Draft retained on conflict');verify(true,'Stale browser edit preserves reason and explains conflict');
  await page.getByRole('dialog').getByRole('button',{name:'إلغاء',exact:true}).click();await page.reload();
  await page.getByRole('button',{name:'إضافة اشتراك',exact:true}).click();const dialog=page.getByRole('dialog');
  await dialog.getByRole('combobox',{name:'الدورة',exact:true}).click();await page.getByRole('option').filter({hasText:'المونتاج باستخدام Premiere Pro'}).click();
  await dialog.getByLabel('سبب التغيير',{exact:true}).fill('Browser manual grant');await dialog.getByRole('button',{name:'تأكيد التغيير',exact:true}).click();await expect(dialog).toHaveCount(0);await expect(page.locator('.lms-resource-card')).toHaveCount(2);verify(true,'Browser grants a new course with required reason');
  await page.setViewportSize({width:390,height:900});await page.screenshot({path:'/tmp/khatab-enrollment-mobile.png',fullPage:true,caret:'initial'});
  verify(errors.length===0,'Enrollment browser workflow has no hydration or runtime errors');
 }catch(error){console.log("Browser errors:",JSON.stringify(errors));await page.screenshot({path:"/tmp/khatab-enrollment-failure.png",fullPage:true,caret:"initial"});throw error;}finally{await browser.close();}
};

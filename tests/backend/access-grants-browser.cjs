/* eslint-disable @typescript-eslint/no-require-imports -- Real responsive administrator grant flows. */
const {chromium,expect}=require('@playwright/test');
module.exports=async({admin,manager,outsider,slugs,bundle,verify,url})=>{
 const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 try {
  const endpoint=`/api/admin/users/${outsider.id}/enrollments`;
  const revoked=await manager.api(endpoint,{courseSlug:slugs[1],action:'revoke',revision:1,reason:'Atomic bundle fixture'});verify(revoked.status===200,'Atomic fixture revokes existing member');
  const result=await manager.api(endpoint,{action:'grant',kind:'bundle',slug:bundle,expiresAt:new Date(Date.now()+86400000).toISOString(),reason:'Atomic bundle check',revisions:{[slugs[0]]:0,[slugs[1]]:2,[slugs[2]]:0}});
  const after=(await admin.from('enrollments').select('course_slug').eq('user_id',outsider.id)).data;verify(result.status===409&&after.length===1&&after[0].course_slug===slugs[1],'Revoked bundle member rolls back earlier course grants');
  verify((await manager.api(endpoint,{courseSlug:slugs[1],action:'restore',revision:2,reason:'Restore before browser flow'})).status===200,'Restoration preserves timed grant expiry');
  await page.goto(url+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(manager.email);await page.getByLabel('كلمة المرور',{exact:true}).fill(manager.password);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(/dashboard/);
  const profile=(await admin.from('profiles').select('username').eq('id',outsider.id).single()).data;await page.goto(url+'/admin/dashboard/users/'+profile.username);
  await page.getByRole('button',{name:'منح وصول مجاني',exact:true}).click();const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();
  for(const width of [320,390,1440]){await page.setViewportSize({width,height:900});verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Free grant dialog fits '+width+'px');}
  await dialog.getByRole('combobox',{name:'الدورة',exact:true}).click();await page.getByRole('option',{name:slugs[0],exact:true}).click();
  await dialog.getByRole('combobox',{name:'مدة الوصول',exact:true}).click();await page.getByRole('option',{name:'مدة مخصصة بالأيام',exact:true}).click();await dialog.getByLabel('عدد الأيام',{exact:true}).fill('2');
  await dialog.getByLabel('سبب التغيير',{exact:true}).fill('Browser timed grant');await dialog.getByRole('button',{name:'تأكيد التغيير',exact:true}).click();await expect(dialog).toHaveCount(0);
  const record=(await admin.from('enrollments').select('access_expires_at').eq('user_id',outsider.id).eq('course_slug',slugs[0]).single()).data;verify(Date.parse(record.access_expires_at)>Date.now()+47*3600000,'Browser creates a custom two-day grant');
  await expect(page.locator('.lms-resource-card').filter({hasText:slugs[0]}).getByText(/الوصول حتى/)).toBeVisible();verify(true,'Subscription card shows access expiry');
  await page.getByRole('button',{name:'منح وصول مجاني',exact:true}).click();await dialog.getByRole('combobox',{name:'نوع المحتوى',exact:true}).click();await page.getByRole('option',{name:'الباقة',exact:true}).click();
  await dialog.getByRole('combobox',{name:'الباقة',exact:true}).click();await page.getByRole('option',{name:'Access test bundle',exact:true}).click();await dialog.getByLabel('سبب التغيير',{exact:true}).fill('Browser lifetime bundle grant');
  await dialog.getByRole('button',{name:'تأكيد التغيير',exact:true}).click();await expect(dialog).toHaveCount(0);await expect(page.locator('.lms-resource-card')).toHaveCount(3);
  const rows=(await admin.from('enrollments').select('access_expires_at').eq('user_id',outsider.id).in('course_slug',slugs)).data;verify(rows.length===3&&rows.every(r=>r.access_expires_at===null),'Browser bundle grant extends all temporary members to lifetime');
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/tmp/khatab-access-grants-mobile.png',fullPage:true,caret:'initial'});verify(errors.length===0,'Free-access flow has no browser runtime errors');
 }finally{await browser.close();}
};

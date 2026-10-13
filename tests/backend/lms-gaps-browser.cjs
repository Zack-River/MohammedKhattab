/* eslint-disable @typescript-eslint/no-require-imports -- Disposable local browser accounts. */
const {chromium,expect}=require('@playwright/test');
async function login(page,url,account){
 await page.goto(url+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(account.email);await page.getByLabel('كلمة المرور',{exact:true}).fill(account.password);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(/\/dashboard/);
}
module.exports=async({manager,student,verify,url,slug,lessonId})=>{
 const browser=await chromium.launch({headless:true}),page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',message=>{if(message.type()==='error'&&/hydration|hydrated|didn.t match/i.test(message.text())) errors.push(message.text());});
 try{
  await login(page,url,manager);await page.goto(url+'/admin/dashboard/resources?q=Paging&filter=text');
  await expect(page.locator('tbody tr')).toHaveCount(5);
  for(const width of [320,390,1440]){await page.setViewportSize({width,height:900});verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Admin materials fit ${width}px`);if(width===390) await page.screenshot({path:'/tmp/khatab-material-admin.png',fullPage:true,caret:'initial'});}
  await page.getByRole('button',{name:'إضافة مادة',exact:true}).click();await expect(page.getByLabel('اسم المادة',{exact:true})).toBeVisible();await expect(page.getByLabel('النص أو رابط HTTPS',{exact:true})).toBeVisible();
  verify(true,'Admin material editor exposes reusable fields and lesson assignment');
  const editor=page.locator('.lms-material-form');await editor.getByLabel('اسم المادة',{exact:true}).fill('Paging Browser exercise');await editor.getByLabel('نوع الملف أو المادة',{exact:true}).fill('TXT');await editor.getByLabel('النص أو رابط HTTPS',{exact:true}).fill('Browser authored material');
  await editor.getByRole('combobox',{name:'الدورة',exact:true}).click();await page.getByRole('option',{name:'Material course '+slug,exact:true}).click();await editor.getByRole('checkbox').first().check();
  await editor.getByRole('combobox',{name:'الدورة',exact:true}).click();await page.getByRole('option',{name:'Material course '+slug+'-two',exact:true}).click();await editor.getByRole('checkbox').first().check();
  await editor.getByRole('button',{name:'حفظ المادة',exact:true}).click();await expect(editor).toHaveCount(0);
  let authored=JSON.parse((await manager.api('/api/admin/resources?q=Paging%20Browser%20exercise')).data).materials[0];verify(authored?.assignments.length===2,'Material editor creates and retains assignments across course selections');
  await page.getByRole('row').filter({hasText:'Paging Browser exercise'}).getByRole('button',{name:'تعديل',exact:true}).click();await expect(page.locator('.lms-material-form').getByLabel('اسم المادة',{exact:true})).toHaveValue('Paging Browser exercise');
  await page.locator('.lms-material-form').getByLabel('اسم المادة',{exact:true}).fill('Paging Browser exercise edited');await page.locator('.lms-material-form').getByRole('button',{name:'حفظ المادة',exact:true}).click();await expect(page.locator('.lms-material-form')).toHaveCount(0);
  authored=JSON.parse((await manager.api('/api/admin/resources?q=Paging%20Browser%20exercise')).data).materials[0];verify(authored.title==='Paging Browser exercise edited'&&authored.assignments.length===2,'Material editor updates without dropping assignments');
  await manager.api('/api/admin/resources',{operation:'delete',id:authored.id,revision:authored.revision});await page.reload();
  await page.getByRole('button',{name:'حذف',exact:true}).first().click();await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('dialog').getByRole('button',{name:'إلغاء',exact:true}).click();verify(true,'Material deletion uses accessible dismissible dialog');
  await page.goto(url+'/admin/dashboard/activity');for(const width of [320,390,1440]){await page.setViewportSize({width,height:900});verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`History fits ${width}px`);}
  await page.context().clearCookies();await login(page,url,student);await page.goto(url+'/dashboard/resources?q=Paging&filter=text');await expect(page.locator('.lms-resource-card')).toHaveCount(5);await page.getByRole('link',{name:'التالي',exact:true}).click();await expect(page.locator('.lms-resource-card')).toHaveCount(1);verify(true,'Student materials preserve combined filters through pagination');
  for(const width of [320,390,1440]){await page.setViewportSize({width,height:900});verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Student library fits ${width}px`);}
  const lessonUrl=url+`/learn/${slug}/${lessonId}`;await page.goto(lessonUrl);await expect(page.getByLabel('ملاحظاتي الخاصة',{exact:true})).toHaveValue('Saved across devices');
  await page.getByLabel('ملاحظاتي الخاصة',{exact:true}).fill('Browser-saved note');await page.getByRole('button',{name:'حفظ الملاحظات',exact:true}).click();await expect(page.getByText('محفوظة في حسابك',{exact:true})).toBeVisible();await page.reload();await expect(page.getByLabel('ملاحظاتي الخاصة',{exact:true})).toHaveValue('Browser-saved note');verify(true,'Explicit note save survives reload');
  const other=await browser.newPage();await login(other,url,student);await other.goto(lessonUrl);await expect(other.getByLabel('ملاحظاتي الخاصة',{exact:true})).toHaveValue('Browser-saved note');verify(true,'Private note is available in a separate browser context');
  await other.getByLabel('ملاحظاتي الخاصة',{exact:true}).fill('Second device note');await other.getByRole('button',{name:'حفظ الملاحظات',exact:true}).click();await expect(other.getByText('محفوظة في حسابك',{exact:true})).toBeVisible();
  await page.getByLabel('ملاحظاتي الخاصة',{exact:true}).fill('Draft remains on conflict');await page.getByRole('button',{name:'حفظ الملاحظات',exact:true}).click();await expect(page.locator('.lms-notes').getByRole('alert')).toContainText('تغيّرت الملاحظات');await expect(page.getByLabel('ملاحظاتي الخاصة',{exact:true})).toHaveValue('Draft remains on conflict');verify(true,'Stale browser save preserves draft and explains conflict');await other.close();
  await page.reload();await page.getByLabel('ملاحظاتي الخاصة',{exact:true}).fill('');await page.getByRole('button',{name:'حفظ الملاحظات',exact:true}).click();await expect(page.getByText('محفوظة في حسابك',{exact:true})).toBeVisible();
  await page.evaluate(({key})=>localStorage.setItem(key,'Legacy browser notes'),{key:`ta3llam-notes:${encodeURIComponent(student.email)}:${slug}:${lessonId}`});await page.reload();await expect(page.getByRole('button',{name:'استيراد ملاحظات هذا المتصفح',exact:true})).toBeVisible();await expect(page.getByLabel('ملاحظاتي الخاصة',{exact:true})).toHaveValue('');await page.getByRole('button',{name:'استيراد ملاحظات هذا المتصفح',exact:true}).click();await expect(page.getByLabel('ملاحظاتي الخاصة',{exact:true})).toHaveValue('Legacy browser notes');verify(true,'Legacy local notes import requires an explicit action');
  await page.screenshot({path:'/tmp/khatab-material-notes.png',fullPage:true,caret:'initial'});
  verify(errors.length===0,'New resource/history/note screens have no browser errors');
 }finally{await browser.close();}
};

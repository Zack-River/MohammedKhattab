/* eslint-disable @typescript-eslint/no-require-imports -- Local-only ephemeral accounts and protected phone queue checks. */
const {chromium,expect}=require('@playwright/test');
const fs=require('node:fs');
module.exports=async function checks({admin,provision,anonymous,verify,url}) {
  const manager=await provision('Phone Manager'),student=await provision('Phone Student');
  await admin.from('admin_users').insert({user_id:manager.id});
  const pending=[student];
  for(let i=0;i<5;i++) pending.push(await provision('Phone Pending '+i));
  const ids=pending.map(user=>user.id);
  await admin.from('account_contacts').update({phone_verified_at:null}).in('user_id',ids);
  const contact=(await admin.from('account_contacts').select('*').eq('user_id',student.id).single()).data;
  const endpoint='/api/admin/users/'+student.id+'/verification';
  verify((await anonymous(endpoint,{field:'phone',value:contact.phone_e164})).status===401,'Anonymous cannot confirm phones');
  verify((await student.api(endpoint,{field:'phone',value:contact.phone_e164})).status===403,'Student cannot confirm phones');
  const browser=await chromium.launch({headless:true});
  try {
    const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(url+'/admin/dashboard/phone-confirmations');await expect(page).toHaveURL(/\/login/);
    verify(true,'Anonymous queue access redirects to login');
    await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(student.email);await page.getByLabel('كلمة المرور',{exact:true}).fill(student.password);
    await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await expect(page).toHaveURL(url+'/dashboard');
    await page.goto(url+'/admin/dashboard/phone-confirmations');await expect(page).toHaveURL(url+'/dashboard');verify(true,'Student queue access denied');
    await page.goto(url+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(manager.email);await page.getByLabel('كلمة المرور',{exact:true}).fill(manager.password);
    await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await expect(page).toHaveURL(url+'/admin/dashboard');
    await page.goto(url+'/admin/dashboard/settings');
    const identity=page.locator('.lms-settings-identity');
    await expect(identity.getByLabel('كلمة المرور الحالية',{exact:true})).toHaveCount(0);
    await expect(page.getByLabel('رقم الهاتف',{exact:true})).toHaveAttribute('placeholder','+44-7700900123');
    verify(true,'Generic reserved example and no initial contact password field');
    const phone=page.getByLabel('رقم الهاتف',{exact:true}),original=await phone.inputValue();
    await phone.fill('+44-7700900123');await expect(identity.getByLabel('كلمة المرور الحالية',{exact:true})).toBeVisible();
    await phone.fill(original);await expect(identity.getByLabel('كلمة المرور الحالية',{exact:true})).toHaveCount(0);
    verify(true,'Sensitive edit reveals password only until contact value restored');
    await identity.getByLabel('الاسم الأول',{exact:true}).fill('Updated');await identity.getByRole('button',{name:'حفظ التغييرات',exact:true}).click();
    await expect(identity.getByRole('status')).toContainText('تم حفظ');verify(true,'Name-only changes save without a current password');
    fs.mkdirSync('docs/evidence/phone-confirmations',{recursive:true});
    for(const width of [320,390,768,1440,1920]) {
      await page.setViewportSize({width,height:1000});verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Settings fits '+width+'px');
      if(width>=1440) verify(await page.locator('.lms-settings-layout').evaluate(el=>el.children[0].getBoundingClientRect().top===el.children[1].getBoundingClientRect().top),'Desktop settings uses adjacent columns');
      await page.screenshot({path:'docs/evidence/phone-confirmations/settings-'+width+'.png',fullPage:true});
    }
    await page.goto(url+'/admin/dashboard/phone-confirmations');await expect(page.locator('.lms-phone-requests article')).toHaveCount(5);
    await page.getByRole('link',{name:'التالي',exact:true}).click();await expect(page).toHaveURL(/page=2/);
    await expect(page.locator('.lms-phone-requests article')).toHaveCount(1);verify(true,'Pending queue paginates at five accounts');
    await page.getByRole('link',{name:'السابق',exact:true}).click();
    const row=page.locator('.lms-phone-requests article').filter({hasText:student.email});
    await expect(row).toBeVisible();
    await admin.from('account_contacts').update({phone_e164:'+447700900124'}).eq('user_id',student.id);
    await row.getByRole('button',{name:'تأكيد الرقم بعد التواصل',exact:true}).click();await expect(row.getByRole('alert')).toBeVisible();
    verify((await admin.from('account_contacts').select('phone_verified_at').eq('user_id',student.id).single()).data.phone_verified_at===null,'Stale queue value cannot verify changed phone');
    await page.reload();
    // Changing the number moves this account to the final page in updated-time order.
    await page.getByRole('link',{name:'التالي',exact:true}).click();
    await page.locator('.lms-phone-requests article').filter({hasText:student.email}).getByRole('button',{name:'تأكيد الرقم بعد التواصل',exact:true}).click();
    await expect(page.locator('.lms-phone-requests article').filter({hasText:student.email})).toHaveCount(0);
    verify(Boolean((await admin.from('account_contacts').select('phone_verified_at').eq('user_id',student.id).single()).data.phone_verified_at),'Manual confirmation persists and removes pending entry');
    await page.goto(url+'/admin/dashboard/phone-confirmations');
    for(const width of [320,390,768,1440]) {
      await page.setViewportSize({width,height:1000});verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Phone queue fits '+width+'px');
      await page.screenshot({path:'docs/evidence/phone-confirmations/queue-'+width+'.png',fullPage:true});
    }
    verify(errors.length===0,'Settings and phone queue have no runtime errors');
  } finally {await browser.close();}
};

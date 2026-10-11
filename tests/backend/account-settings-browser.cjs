/* eslint-disable @typescript-eslint/no-require-imports -- Real local browser acceptance with ephemeral accounts. */
const {chromium,expect}=require('@playwright/test');
const fs=require('node:fs');
async function login(page,url,user) {
  await page.goto(url+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(user.email);await page.getByLabel('كلمة المرور',{exact:true}).fill(user.password);
  await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await expect(page).toHaveURL(user.admin ? url+'/admin/dashboard' : url+'/dashboard');
}
module.exports=async function accountBrowser({manager,student,url,verify,config,admin}) {
  const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  fs.mkdirSync('docs/evidence/account',{recursive:true});
  try {
    await login(page,url,{...manager,admin:true});
    const trigger=page.getByRole('button',{name:'قائمة الحساب',exact:true}), panel=page.locator('.ds-action-panel');
    for(const viewport of [{width:320,height:568},{width:390,height:844},{width:844,height:390},{width:1440,height:900}]) {
      await page.setViewportSize(viewport);await trigger.click();await expect(panel).toBeVisible();
      const rect=await panel.boundingBox();verify(rect.x>=0 && rect.y>=0 && rect.x+rect.width<=viewport.width+1 && rect.y+rect.height<=viewport.height+1,'Avatar menu fits '+viewport.width+'×'+viewport.height);
      verify(await panel.getByRole('link').count()===3 && await panel.getByRole('button').count()===1,'Avatar menu has Profile, Settings, Support and Logout');
      await page.mouse.click(2,viewport.height-2);await expect(panel).not.toBeVisible();verify(true,'Click outside dismisses the menu');
      await trigger.focus();await trigger.press('ArrowDown');await expect(panel.getByRole('link',{name:'الملف الشخصي',exact:true})).toBeFocused();
      await page.keyboard.press('Escape');await expect(panel).not.toBeVisible();await expect(trigger).toBeFocused();verify(true,'Keyboard open and Escape restore focus');
    }
    await trigger.click();await page.getByRole('link',{name:'المستخدمون',exact:true}).focus();await expect(panel).not.toBeVisible();verify(true,'Moving focus outside closes the account menu');
    await trigger.click();await panel.getByRole('link',{name:'الملف الشخصي',exact:true}).click();await expect(page).toHaveURL(url+'/admin/dashboard/profile');
    verify(await page.getByRole('heading',{name:'دوراتك',exact:true}).count()===0,'Admin profile omits student course list');
    await trigger.click();await panel.getByRole('link',{name:'الإعدادات',exact:true}).click();await expect(page).toHaveURL(url+'/admin/dashboard/settings');
    await expect(page.getByLabel('البريد الإلكتروني',{exact:true})).toBeEditable();verify(true,'Admin email is editable in its own dashboard');
    const nextEmail='changed-'+require('node:crypto').randomUUID()+'@example.com', identityForm=page.locator('.lms-account-stack form').first();
    await identityForm.getByLabel('رقم الهاتف',{exact:true}).fill('+20-1201024880');await identityForm.getByLabel('البريد الإلكتروني',{exact:true}).fill(nextEmail);await identityForm.getByLabel('كلمة المرور الحالية',{exact:true}).fill(manager.password);
    await identityForm.getByRole('button',{name:'حفظ التغييرات',exact:true}).click();await expect(identityForm.getByRole('status')).toContainText('تم حفظ بيانات الحساب');
    const pendingAccount=await(await page.request.get(url+'/api/account/settings')).json();verify(pendingAccount.pendingEmail===nextEmail && !pendingAccount.emailVerified && pendingAccount.email===manager.email,'Admin email change is pending and unverified while old identity remains usable');
    const pendingMessages=await(await fetch(config.MAILPIT_URL+'/api/v1/messages')).json();
    const approvals=[manager.email,nextEmail].map(email=>pendingMessages.messages.find(m=>m.To.some(to=>to.Address===email)));
    verify(approvals.every(Boolean),'Secure email change sends confirmation to both old and new addresses');
    for(const approval of approvals) {
      const mail=await(await fetch(config.MAILPIT_URL+'/api/v1/message/'+approval.ID)).json();
      const link=mail.HTML.match(/href="([^"]+\/auth\/v1\/verify[^\"]+)"/)?.[1].replaceAll('&amp;','&');
      await page.goto(link);
    }
    const oldEmail=manager.email;manager.email=nextEmail;
    verify(Boolean((await admin.from('admin_users').select('user_id').eq('user_id',manager.id).maybeSingle()).data),'Admin email confirmation preserves account role');
    verify(!(await admin.from('admin_allowlist').select('email').eq('email',oldEmail).maybeSingle()).data,'Old admin email no longer grants administrator access');
    const confirmedIdentity=await admin.auth.admin.getUserById(manager.id);verify(confirmedIdentity.data.user.email===nextEmail && !confirmedIdentity.data.user.new_email,'Both confirmation links update the trusted Auth identity');
    await login(page,url,{...manager,admin:true});
    await page.goto(url+'/admin/dashboard/settings');await expect(page.getByLabel('البريد الإلكتروني',{exact:true})).toHaveValue(nextEmail);
    const confirmedAccount=await(await page.request.get(url+'/api/account/settings')).json();verify(confirmedAccount.emailVerified && !confirmedAccount.pendingEmail,'Confirming both email links restores verified email automatically');

    await trigger.click();await expect(panel.getByRole('link',{name:'الدعم والمساعدة',exact:true})).toHaveAttribute('href','https://wa.me/201558590242');verify(true,'Support points to Mohammed Khattab WhatsApp');
    await panel.getByRole('button',{name:'تسجيل الخروج',exact:true}).click();await expect(page).toHaveURL(url+'/login');
    await login(page,url,student);await page.goto(url+'/dashboard/settings');
    await expect(page.getByLabel('البريد الإلكتروني',{exact:true})).toHaveAttribute('readonly','');verify(true,'Student email is locked');
    for(const width of [320,390,1440]) {await page.setViewportSize({width,height:844});verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Settings has no horizontal overflow at '+width);await page.screenshot({path:'docs/evidence/account/settings-'+width+'.png',fullPage:true});}
    await page.goto(url+'/dashboard/profile');await expect(page.getByRole('heading',{name:'دوراتك',exact:true})).toBeVisible();verify(true,'Student profile includes its course area');
    await page.goto(url+'/forgot-password');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(student.email);await page.getByRole('button',{name:'إرسال رابط الاستعادة',exact:true}).click();await expect(page.getByRole('status')).toContainText('إذا كان البريد مسجلًا');
    const messages=await(await fetch(config.MAILPIT_URL+'/api/v1/messages')).json();
    const message=messages.messages.find(m=>m.To.some(to=>to.Address===student.email));verify(Boolean(message),'Recovery email reaches the local email inbox');
    const mail=await(await fetch(config.MAILPIT_URL+'/api/v1/message/'+message.ID)).json();
    const link=mail.HTML.match(/href="([^"]+\/auth\/v1\/verify[^\"]+)"/)?.[1].replaceAll('&amp;','&');verify(Boolean(link),'Recovery email contains provider verification link');
    await page.goto(link);await expect(page).toHaveURL(url+'/reset-password');verify(true,'Email recovery callback grants a protected reset session');
    await page.getByLabel('كلمة المرور الجديدة',{exact:true}).fill('Email-Recovered-Password-19!');await page.getByLabel('تأكيد كلمة المرور الجديدة',{exact:true}).fill('Email-Recovered-Password-19!');
    await page.getByRole('button',{name:'حفظ كلمة المرور الجديدة',exact:true}).click();await expect(page.getByRole('status')).toContainText('تم تغيير كلمة المرور');verify(true,'Recovery link allows a password reset without current password');
    verify((await admin.from('account_recovery_grants').select('*').eq('user_id',student.id)).data.length===0,'Recovery authorization is consumed once');
    await page.goto(url+'/login');await login(page,url,{...student,password:'Email-Recovered-Password-19!'});verify(true,'Recovered password signs in successfully');
    verify(errors.length===0,'Account screens produce no browser runtime errors');
  } finally {await browser.close();}
};

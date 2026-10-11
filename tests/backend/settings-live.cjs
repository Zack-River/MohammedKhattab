/* eslint-disable @typescript-eslint/no-require-imports -- Read-only acceptance against the production build. */
const {chromium,expect}=require('@playwright/test');
process.loadEnvFile('.env.local');
const url=process.env.TARGET_URL||'http://localhost:3040';
(async()=>{
  const browser=await chromium.launch({headless:true});
  try {
    const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(url+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill('admin@ta3allam.com');
    await page.getByLabel('كلمة المرور',{exact:true}).fill(process.env.TA3ALLAM_ADMIN_PASSWORD);
    await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await expect(page).toHaveURL(url+'/admin/dashboard',{timeout:30000});
    await page.goto(url+'/admin/dashboard/settings');
    await expect(page.locator('.lms-settings-identity').getByLabel('كلمة المرور الحالية',{exact:true})).toHaveCount(0);
    await expect(page.getByLabel('رقم الهاتف',{exact:true})).toHaveAttribute('placeholder','+44-7700900123');
    for(const width of [320,390,768,1440,1920]) {
      await page.setViewportSize({width,height:1000});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      if(width>=1440) await expect.poll(() => page.locator('.lms-settings-layout').evaluate(el=>el.children[0].getBoundingClientRect().top===el.children[1].getBoundingClientRect().top && Math.abs(el.children[0].getBoundingClientRect().bottom-el.children[2].getBoundingClientRect().bottom)<1)).toBe(true);
    }
    await page.goto(url+'/admin/dashboard/phone-confirmations');
    await expect(page.getByRole('heading',{name:'طلبات تأكيد رقم الهاتف',exact:true})).toBeVisible();
    expect(await page.locator('.lms-phone-requests article').count()).toBeLessThanOrEqual(5);
    for(const width of [320,390,768,1440]) {
      await page.setViewportSize({width,height:1000});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    }
    expect(errors).toEqual([]);console.log('Settings and phone queue read-only acceptance passed:',url);
  } finally {await browser.close();}
})().catch(error=>{console.error(error.message);process.exitCode=1;});

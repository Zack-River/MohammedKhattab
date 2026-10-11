/* eslint-disable @typescript-eslint/no-require-imports -- Read-only deployed analytics acceptance, credentials from ignored env. */
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
  await expect(page.getByRole('heading',{name:'المنصة في أرقام',exact:true})).toBeVisible({timeout:30000});
  const response=await page.request.get(url+'/api/admin/analytics');expect(response.status()).toBe(200);
  const data=await response.json();expect(data.timezone).toBe('Africa/Cairo');
  for(const width of [390,1440]) {
   await page.setViewportSize({width,height:960});await expect(page.locator('.recharts-surface')).toBeVisible();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   await page.screenshot({path:`docs/evidence/admin-analytics/${url.startsWith('https')?'live':'production'}-${width}.png`,fullPage:true});
  }
  await page.getByRole('link',{name:'هذا الشهر',exact:true}).click();await expect(page).toHaveURL(/period=month/);
  await page.getByRole('link',{name:'كل الوقت',exact:true}).click();await expect(page).toHaveURL(/period=all/);
  await page.getByRole('link',{name:'المستخدمون',exact:true}).click();await expect(page).toHaveURL(url+'/admin/dashboard/users');
  await expect(page.getByRole('searchbox')).toBeVisible();expect(errors).toEqual([]);
  console.log('Read-only analytics acceptance passed:',url,'responsive charts, admin API, period tabs, user navigation; zero browser errors.');
 } finally {await browser.close();}
})().catch(error=>{console.error(error.message);process.exitCode=1;});

/* eslint-disable @typescript-eslint/no-require-imports -- Isolated protected rendering, viewport deferral and motion acceptance. */
const {chromium,expect}=require('@playwright/test');
module.exports=async function performance({admin,provision,verify,url}) {
 const manager=await provision('Performance Manager');await admin.from('admin_users').insert({user_id:manager.id});
 const browser=await chromium.launch();try {
  const page=await browser.newPage({viewport:{width:390,height:600}}),errors=[],sessions=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('/session'))sessions.push(r.url());});
  await page.goto(url+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(manager.email);await page.getByLabel('كلمة المرور',{exact:true}).fill(manager.password);
  await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await expect(page).toHaveURL(url+'/admin/dashboard');
  sessions.length=0;const response=await page.goto(url+'/admin/dashboard');
  verify((await response.text()).includes('lms-app-main'),'Authorized dashboard content is present in server HTML');
  await expect(page.locator('.lms-app-main')).toBeVisible();await page.waitForTimeout(600);
  verify(sessions.length===0,'Initial authorized dashboard avoids redundant browser session calls');
  await expect(page.locator('.recharts-surface')).toHaveCount(0);verify(true,'Offscreen chart is not mounted');
  await page.locator('.analytics-chart-slot').scrollIntoViewIfNeeded();await expect(page.locator('.recharts-surface')).toBeVisible();verify(true,'Chart loads when approaching its viewport');
  await expect(page.locator('.analytics-panel[data-reveal]')).not.toHaveCount(0);verify(true,'Admin panels register with shared fade engine');
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(url+'/admin/dashboard/settings');
  verify(await page.locator('[data-reveal]').evaluateAll(nodes=>nodes.every(node=>node.getAnimations().length===0)),'Reduced motion skips admin reveal effects');
  await page.goto(url+'/');const videos=[];page.on('request',r=>{if(r.url().endsWith('.mp4'))videos.push(r.url());});
  await expect(page.locator('.hero-video-shell')).toBeVisible();verify(videos.length===0,'No video retrieval before activation');
  await page.locator('.hero-video-shell .media-player-poster').click();await expect(page.locator('.hero-video-shell video')).toBeVisible();verify(true,'Lazy playback loads after play');
  await page.locator('.instructor-photo-img').scrollIntoViewIfNeeded();await expect(page.locator('.instructor-photo-img')).toHaveAttribute('src',/\/_next\/image\?/);
  verify(true,'Local content images use responsive Next image optimization');verify(errors.length===0,'No performance/motion runtime errors');
 } finally {await browser.close();}
};

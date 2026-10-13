/* eslint-disable @typescript-eslint/no-require-imports -- Actual public links and redirect destinations, isolated local catalog fixture. */
const assert=require('node:assert/strict'),{randomUUID}=require('node:crypto'),{chromium,expect}=require('@playwright/test');
module.exports=async({admin,anonymous,verify,url})=>{
 const slug='navigation-'+randomUUID(),source=(await admin.from('courses').select('metadata').eq('slug','editing-foundations').single()).data.metadata;
 assert.ok(!(await admin.from('courses').insert({slug,metadata:{...source,slug,featured:true,title:'Public navigation fixture'},amount:499,published:true,position:0})).error);
 const browser=await chromium.launch(),page=await browser.newPage({reducedMotion:'reduce'});
 try{
  const response=await anonymous('/courses/7days-freelance');
  verify(response.status===200&&!response.headers.get('location')&&response.data.includes('lms-course-details-page'),'Canonical seven-day course renders without redirect interception');
  for(const width of [390,1440]){
   await page.setViewportSize({width,height:900});
   for(const path of ['/','/courses','/founder','/bundles']){
    await page.goto(url+path);await page.waitForLoadState('networkidle');
    verify(await page.locator('a[href^="/featured/"]').count()===0,`${path} has no advertising navigation at ${width}`);
   }
   await page.goto(url+'/');
   const homeLink=page.locator('.lms-course-card .lms-card-title a').first(),homeHref=await homeLink.getAttribute('href');
   assert.match(homeHref,/^\/courses\/[a-z0-9-]+$/);await homeLink.click();
   await expect(page).toHaveURL(url+homeHref);await expect(page.locator('.lms-course-details-page')).toBeVisible();
   verify(true,'Home course opens normal details at '+width);
   await page.goto(url+'/courses?q=Public%20navigation%20fixture');
   const course=page.locator('.lms-course-card').filter({has:page.getByRole('heading',{name:'Public navigation fixture',exact:true})});
   await course.locator('a[href="/courses/'+slug+'"]').first().click();
   await expect(page).toHaveURL(url+'/courses/'+slug);await expect(page.locator('.lms-course-details-page')).toBeVisible();
   verify(true,'Catalog featured course opens normal details at '+width);
   await page.goto(url+'/founder');await page.locator('a.personal-course[href="/courses/7days-freelance"]').click();
   await expect(page).toHaveURL(url+'/courses/7days-freelance');await expect(page.locator('.lms-course-details-page')).toBeVisible();
   verify(true,'Founder workshop opens normal details at '+width);
  }
  await page.goto(url+'/featured/'+slug);await expect(page.locator('.hero-section')).toBeVisible();
  verify(true,'Direct advertising link remains available');
 }finally{await browser.close();await admin.from('courses').delete().eq('slug',slug);}
};

/* eslint-disable @typescript-eslint/no-require-imports -- Featured campaign selection through the admin UI. */
const {expect}=require('@playwright/test');
module.exports=async({browser,manager,url,liveSlug,verify})=>{
 const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(url+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(manager.email);await page.getByLabel('كلمة المرور',{exact:true}).fill(manager.password);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await expect(page).toHaveURL(url+'/admin/dashboard');
 await page.goto(url+'/featured/'+liveSlug);await page.waitForLoadState('networkidle');await expect(page.getByRole('heading',{level:1})).toHaveText('ورشة تجريبية مباشرة');await expect(page.locator('.hero-video-shell')).toHaveCount(0);await expect(page.locator('.roadmap-timeline .day-item')).toHaveCount(0);verify(true,'Featured workshop browser uses own title and no invented media or timeline');
 await page.goto(url+'/admin/dashboard/courses/'+liveSlug);await page.waitForLoadState('networkidle');const featured=page.getByRole('checkbox',{name:'تصميم الصفحة المميزة',exact:true});
 await expect(featured).toBeChecked();await featured.uncheck();await page.getByRole('button',{name:'حفظ التغييرات',exact:true}).click();await expect(page.getByRole('status')).toHaveText('تم حفظ التغييرات');
 await page.reload();await page.waitForLoadState('networkidle');await expect(featured).not.toBeChecked();verify(true,'Admin can remove featured status and retain it after refresh');
 await page.goto(url+'/workshops/'+liveSlug);await expect(page.locator('.lms-course-details-page')).toBeVisible();await expect(page.getByRole('heading',{name:'ورشة تجريبية مباشرة',exact:true})).toBeVisible();await expect(page.getByText('سيُعلن محتوى الورشة قبل موعدها.',{exact:true})).toBeVisible();verify(true,'Unfeatured workshop switches to its own shared detail page');
 await page.goto(url+'/admin/dashboard/courses/new');await page.waitForLoadState('networkidle');await expect(page.getByRole('checkbox',{name:'تصميم الصفحة المميزة',exact:true})).toBeVisible();
 await page.getByRole('combobox',{name:'نوع الدورة',exact:true}).click();await page.getByRole('option',{name:'مباشرة',exact:true}).click();await expect(page.getByRole('checkbox',{name:'تصميم الصفحة المميزة',exact:true})).toBeVisible();verify(true,'Creation exposes featured layout for recorded courses and live workshops');
 verify(errors.length===0,'Featured workshop and editor have no browser runtime errors');await page.close();
};

/* eslint-disable @typescript-eslint/no-require-imports -- Isolated browser acceptance checks. */
const { chromium, expect } = require('@playwright/test');
module.exports=async({manager,verify,url,prefix,slugs})=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(url+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(manager.email);await page.getByLabel('كلمة المرور',{exact:true}).fill(manager.password);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await expect(page).toHaveURL(url+'/admin/dashboard');
  await page.goto(url+'/admin/dashboard/courses?q='+prefix);
  await expect(page.getByRole('heading',{name:'إدارة الدورات',exact:true})).toBeVisible();
  verify(await page.locator('thead th').count()===8,'Course table has eight overview columns');
  verify(await page.locator('tbody tr').count()===5,'Five course records rendered per page');
  await page.getByRole('link',{name:'التالي',exact:true}).click();await expect(page).toHaveURL(/page=2/);await expect(page.locator('tbody tr')).toHaveCount(2);
  verify(new URL(page.url()).searchParams.get('q')===prefix,'Pagination preserves search');
  await page.getByRole('checkbox',{name:'منشورة',exact:true}).check();
  await page.getByRole('combobox',{name:'ترتيب حسب',exact:true}).click();await page.getByRole('option',{name:'الطلاب',exact:true}).click();
  await page.getByRole('button',{name:'تطبيق',exact:true}).click();await expect(page.locator('tbody tr')).toHaveCount(1);
  verify(!new URL(page.url()).searchParams.has('page') && new URL(page.url()).searchParams.get('sort')==='students','Changing filters resets pagination and retains ordering');
  await page.goto(url+'/admin/dashboard/courses?q='+prefix);
  for(const width of [320,390,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1000});
   verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Course dashboard fits ${width}px without overflow`);
   verify(await page.locator('tbody tr').count()<=5,`At most five course cards on ${width}px page`);
   const row=page.locator('tbody tr').filter({hasText:`${prefix} دورة 6`});
   await row.getByRole('button',{name:'حذف',exact:true}).click();const dialog=page.getByRole('dialog',{name:'حذف الدورة',exact:true});await expect(dialog).toBeVisible();
   const box=await dialog.boundingBox();verify(Math.abs(box.x+box.width/2-width/2)<2 && Math.abs(box.y+box.height/2-500)<2,`Course delete dialog centered at ${width}px (${JSON.stringify(box)})`);
   await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(row.getByRole('button',{name:'حذف',exact:true})).toBeFocused();
   if(width===390||width===1440){await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`docs/evidence/backend/admin-courses-${width}.png`,fullPage:true});}
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(url+'/admin/dashboard/courses/'+slugs[0]);
  await expect(page.getByLabel('اسم الدورة',{exact:true})).toBeVisible();verify(await page.getByLabel('رابط فيديو الدرس',{exact:true}).count()===0,'Course overview does not contain lesson editors');
  await page.getByRole('link',{name:'الفصول والأقسام والدروس',exact:true}).click();await expect(page).toHaveURL(/\/content$/);await expect(page.getByRole('heading',{name:'قسم تجريبي',exact:true})).toBeVisible();
  verify(await page.locator('form').count()>0,'Lesson editing appears on separate content page');
  await page.goto(url+'/admin/dashboard/courses?q='+prefix);const row=page.locator('tbody tr').filter({hasText:`${prefix} دورة 6`});await row.getByRole('button',{name:'حذف',exact:true}).click();await page.getByRole('button',{name:'تأكيد الحذف',exact:true}).click();await expect(row).toHaveCount(0);verify(true,'Confirmed deletion refreshes course table');
  await page.getByRole('link',{name:'إنشاء دورة',exact:true}).click();await expect(page).toHaveURL(url+'/admin/dashboard/courses/new');
  await expect(page.getByLabel('رابط الدورة',{exact:true})).toBeVisible();
  const newSlug=prefix+'-browser';slugs.push(newSlug);
  await page.getByLabel('اسم الدورة',{exact:true}).fill('دورة من نموذج الإنشاء');
  await page.getByLabel('رابط الدورة',{exact:true}).fill(newSlug);
  await page.getByLabel('الوصف',{exact:true}).fill('وصف محفوظ من نموذج إنشاء الدورة');
  await page.getByLabel('السعر (ج.م)',{exact:true}).fill('333');
  await page.getByRole('button',{name:'إنشاء دورة',exact:true}).click();
  await expect(page).toHaveURL(url+'/admin/dashboard/courses/'+newSlug);
  await expect(page.getByLabel('اسم الدورة',{exact:true})).toHaveValue('دورة من نموذج الإنشاء');
  await page.reload();await expect(page.getByLabel('السعر (ج.م)',{exact:true})).toHaveValue('333');
  verify(true,'Browser-created draft persists and opens its editor');
  await page.setViewportSize({width:320,height:900});verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Course creation form fits 320px');
  verify(errors.length===0,'Course dashboard has no browser JavaScript errors');
 }finally{await browser.close();}
};

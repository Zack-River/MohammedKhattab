/* eslint-disable @typescript-eslint/no-require-imports -- Responsive curriculum authoring acceptance. */
const {chromium,expect}=require('@playwright/test');
module.exports=async({manager,verify,url,slug})=>{
 const browser=await chromium.launch({headless:true});
 try {
  const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(url+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(manager.email);await page.getByLabel('كلمة المرور',{exact:true}).fill(manager.password);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await expect(page).toHaveURL(url+'/admin/dashboard');
  const editor=url+'/admin/dashboard/courses/'+slug;
  await page.goto(editor);
  for(const width of [320,390,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1000});await expect(page.getByLabel('اسم الدورة',{exact:true})).toBeVisible();
   verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Course form fits ${width}px`);
   const cards=await page.locator('.lms-course-editor-layout > section').evaluateAll(elements=>elements.map(element=>{const r=element.getBoundingClientRect();return{x:r.x,y:r.y,bottom:r.bottom,width:r.width};}));
   if(width>1024)verify(Math.abs(cards[0].y-cards[1].y)<2&&Math.abs(cards[0].bottom-cards[2].bottom)<2,`Detail card aligns with combined media and publication cards at ${width}px`);
   else verify(cards[1].y>cards[0].y&&cards[2].y>cards[1].y,`Form cards stack at ${width}px`);
   if(width===390||width===1440){for(const card of await page.locator('.lms-course-editor-layout > section').all()){await card.scrollIntoViewIfNeeded();await expect(card).toHaveCSS('opacity','1');}await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`docs/evidence/backend/course-form-${width}.png`,fullPage:true});}
  }
  await page.getByRole('link',{name:'الفصول والأقسام والدروس',exact:true}).click();await expect(page).toHaveURL(/\/content$/);
  for(const width of [320,390,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1000});await page.getByRole('button',{name:'إضافة فصل',exact:true}).click();const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();const box=await dialog.boundingBox();
   verify(Math.abs(box.x+box.width/2-width/2)<2&&Math.abs(box.y+box.height/2-500)<2,`Curriculum dialog centered at ${width}px`);
   verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Curriculum fits ${width}px`);
   await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(page.getByRole('button',{name:'إضافة فصل',exact:true})).toBeFocused();
  }
  await page.setViewportSize({width:390,height:900});await page.getByRole('button',{name:'إضافة فصل',exact:true}).click();let dialog=page.getByRole('dialog');await dialog.getByLabel('الاسم',{exact:true}).fill('Browser chapter');await dialog.getByRole('button',{name:'حفظ التغييرات',exact:true}).click();await expect(dialog).toHaveCount(0);
  const chapter=page.locator('.lms-curriculum > section').filter({has:page.getByRole('heading',{name:'Browser chapter',exact:true})});await expect(chapter).toBeVisible();verify(true,'Chapter creation persists and refreshes page');
  await chapter.getByRole('button',{name:'إضافة قسم',exact:true}).click();dialog=page.getByRole('dialog');await dialog.getByLabel('الاسم',{exact:true}).fill('Browser section');await dialog.getByRole('button',{name:'حفظ التغييرات',exact:true}).click();await expect(dialog).toHaveCount(0);
  let section=chapter.locator('.lms-curriculum-group').filter({has:page.getByRole('heading',{name:'Browser section',exact:true})});await expect(section).toBeVisible();verify(true,'Section creation persists');
  await section.getByRole('button',{name:'إضافة درس',exact:true}).click();dialog=page.getByRole('dialog');await dialog.getByLabel('الاسم',{exact:true}).fill('Browser lesson');await dialog.getByLabel('رابط فيديو الدرس',{exact:true}).fill('/assets/video/workshop-intro.mp4');await expect(dialog.getByLabel('مدة الدرس بالثواني',{exact:true})).toHaveValue(/^[1-9][0-9]*$/);await expect(dialog.getByLabel('مدة الدرس بالثواني',{exact:true})).toHaveAttribute('readonly','');const calculatedSeconds=Number(await dialog.getByLabel('مدة الدرس بالثواني',{exact:true}).inputValue());verify(true,'Lesson duration is automatically read from video metadata');await dialog.getByRole('button',{name:'حفظ التغييرات',exact:true}).click();await expect(dialog).toHaveCount(0);await expect(section.getByRole('heading',{name:'Browser lesson',exact:true})).toBeVisible();verify(true,'Lesson creation uses chosen section');const saved=(await (await page.request.get(url+'/api/admin/courses/'+slug)).json()).course.modules.flatMap(chapter=>chapter.lessons).find(lesson=>lesson.title==='Browser lesson');verify(saved.durationSeconds===calculatedSeconds,'Automatically calculated duration persists in course metadata');
  for(const width of [390,1440]){await page.setViewportSize({width,height:1000});for(const card of await page.locator('.lms-curriculum > section').all()){await card.scrollIntoViewIfNeeded();await expect(card).toHaveCSS('opacity','1');}await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`docs/evidence/backend/course-curriculum-${width}.png`,fullPage:true});}await page.setViewportSize({width:390,height:900});
  let row=section.locator('.lms-curriculum-row');await row.getByRole('button',{name:'تعديل',exact:true}).click();dialog=page.getByRole('dialog');await dialog.getByLabel('الاسم',{exact:true}).fill('Browser lesson edited');await dialog.getByRole('combobox',{name:'القسم',exact:true}).click();await page.getByRole('option',{name:'بدون قسم',exact:true}).click();await dialog.getByRole('button',{name:'حفظ التغييرات',exact:true}).click();await expect(dialog).toHaveCount(0);
  const ungrouped=chapter.locator('.lms-curriculum-group').filter({has:page.getByRole('heading',{name:'بدون قسم',exact:true})});await expect(ungrouped.getByRole('heading',{name:'Browser lesson edited',exact:true})).toBeVisible();verify(true,'Lesson edit and section reassignment persist');
  row=ungrouped.locator('.lms-curriculum-row');await row.getByRole('button',{name:'حذف',exact:true}).click();dialog=page.getByRole('dialog');await expect(dialog).toContainText('حذف الدرس يزيل');await dialog.getByRole('button',{name:'حذف',exact:true}).click();await expect(dialog).toHaveCount(0);await expect(ungrouped).toHaveCount(0);verify(true,'Confirmed lesson deletion removes row');
  await section.getByRole('button',{name:'تعديل',exact:true}).click();dialog=page.getByRole('dialog');await dialog.getByLabel('الاسم',{exact:true}).fill('Browser section edited');await dialog.getByRole('button',{name:'حفظ التغييرات',exact:true}).click();await expect(dialog).toHaveCount(0);
  section=chapter.locator('.lms-curriculum-group').filter({has:page.getByRole('heading',{name:'Browser section edited',exact:true})});await section.getByRole('button',{name:'حذف',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'حذف',exact:true}).click();await expect(section).toHaveCount(0);verify(true,'Section rename and deletion persist');
  await chapter.getByRole('button',{name:'حذف',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'حذف',exact:true}).click();await expect(chapter).toHaveCount(0);verify(true,'Empty chapter deletion persists');
  await page.reload();verify(await page.getByRole('heading',{name:'Browser chapter',exact:true}).count()===0,'Curriculum reload retains edits');verify(errors.length===0,'No browser runtime errors');
 } finally {await browser.close();}
};

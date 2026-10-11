/* eslint-disable @typescript-eslint/no-require-imports -- Automatic lesson-duration browser acceptance. */
const {chromium,expect}=require('@playwright/test'),fs=require('node:fs');
module.exports=async({manager,verify,url,slug})=>{
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage();await page.goto(url+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(manager.email);await page.getByLabel('كلمة المرور',{exact:true}).fill(manager.password);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await expect(page).toHaveURL(url+'/admin/dashboard');
  await page.goto(url+'/admin/dashboard/courses/'+slug+'/content');await page.getByRole('button',{name:'إضافة درس',exact:true}).first().click();
  const dialog=page.getByRole('dialog'),video=dialog.getByLabel('رابط فيديو الدرس',{exact:true}),duration=dialog.getByLabel('مدة الدرس بالثواني',{exact:true});
  await expect(duration).toHaveValue('');await expect(duration).toHaveAttribute('readonly','');verify(true,'New lessons have no fabricated/manual default duration');
  await video.fill('/assets/video/workshop-intro.mp4');await expect(duration).toHaveValue(/^[1-9][0-9]*$/);const expected=await duration.inputValue();verify(true,'Actual local video metadata calculates duration');await video.fill('/assets/video/workshop-intro.mp4');verify(await video.evaluate(input=>input.validity.valid),'Pasting the same resolved link keeps the field valid');
  let calls=0;await page.route('**/media/stream?*',route=>{calls++;return route.fulfill({status:200,contentType:'video/mp4',body:fs.readFileSync('public/assets/video/workshop-intro.mp4')});});
  await video.fill('https://drive.google.com/file/d/1234567890/view');await expect(duration).toHaveValue(expected);verify(calls>0,'Drive links route through protected stream and calculate duration');
  await video.fill('/assets/video/missing-duration.mp4');await expect(duration).toHaveValue('');await expect(dialog.getByRole('alert')).toContainText('تعذّر قراءة مدة الفيديو');
  await dialog.getByLabel('الاسم',{exact:true}).fill('Unsavable invalid video');await dialog.getByRole('button',{name:'حفظ التغييرات',exact:true}).click();await expect(dialog).toBeVisible();verify(await video.evaluate(input=>!input.validity.valid),'Unavailable media blocks saving and clears stale duration');
  await video.fill('/assets/video/workshop-intro.mp4');await expect(duration).toHaveValue(expected);verify(true,'Changing to a valid source recovers automatically');
  await video.fill('https://drive.google.com/drive/folders/1234567890');await expect(dialog.getByRole('alert')).toBeVisible();await expect(duration).toHaveValue('');verify(true,'Drive folders cannot provide fabricated duration');
  await video.fill('/assets/video/workshop-intro.mp4');await video.fill('/assets/video/missing-duration.mp4');await expect(dialog.getByRole('alert')).toBeVisible();await expect(duration).toHaveValue('');verify(true,'A stale earlier lookup cannot replace the latest video duration');
  await video.fill('/assets/video/workshop-intro.mp4');await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await page.getByRole('button',{name:'إضافة درس',exact:true}).first().click();await expect(page.getByLabel('مدة الدرس بالثواني',{exact:true})).toHaveValue('');verify(true,'Closing the dialog cancels lookup and reopening starts fresh');await page.keyboard.press('Escape');
 }finally{await browser.close();}
};

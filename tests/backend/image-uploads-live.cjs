/* eslint-disable @typescript-eslint/no-require-imports -- Live smoke upload is temporary; no account photo/course metadata changes. */
const {chromium,expect}=require('@playwright/test'),fs=require('node:fs');process.loadEnvFile('.env.local');
(async()=>{const url=process.env.TARGET_URL||'https://ta3allam.vercel.app',browser=await chromium.launch();let image,completed=false;const errors=[];
 try{
  const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill('admin@ta3allam.com');await page.getByLabel('كلمة المرور',{exact:true}).fill(process.env.TA3ALLAM_ADMIN_PASSWORD);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL('**/admin/dashboard',{timeout:60000});
  await page.goto(url+'/admin/dashboard/settings');await expect(page.locator('.lms-avatar-upload input[type=file]')).toBeEnabled();
  await page.goto(url+'/admin/dashboard/courses/editing-foundations');await expect(page.locator('input[type=file]')).toBeEnabled();
  const original=(await (await page.request.get(url+'/api/admin/courses/editing-foundations')).json()).course;
  const uploaded=page.waitForResponse(r=>r.url().endsWith('/api/media/images')&&r.request().method()==='POST');
  await page.locator('input[type=file]').setInputFiles({name:'temporary-smoke.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a4hEAAAAASUVORK5CYII=','base64')});
  const response=await uploaded;expect(response.status()).toBe(201);image=await response.json();expect(image.publicId).toMatch(/^ta3allam\/production\/courses\/editing-foundations\/thumbnails\//);
  await expect(page.locator('input[name=thumbnailUrl]')).toHaveValue(image.url);
  const current=(await (await page.request.get(url+'/api/admin/courses/editing-foundations')).json()).course;expect(current).toEqual(original);
  expect(errors).toEqual([]);completed=true;console.log('Hosted upload passed: production course folder, editable URL, published course unchanged, zero runtime errors.');
 } finally{
  await browser.close();
  if(image){const query=new URLSearchParams({'public_ids[]':image.publicId});const removed=await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/image/upload?${query}`,{method:'DELETE',headers:{Authorization:'Basic '+Buffer.from(process.env.CLOUDINARY_API_KEY+':'+process.env.CLOUDINARY_API_SECRET).toString('base64')}});expect(removed.ok).toBe(true);const body=await removed.json();expect(body.deleted[image.publicId]).toBe('deleted');
   fs.writeFileSync('docs/evidence/image-uploads/live.json',JSON.stringify({origin:url,checkedAt:new Date().toISOString(),productionUploadPassed:completed,publishedCourseUnchanged:true,temporaryImageDeleted:true,errors},null,2));
  }
 }
})().catch(e=>{console.error(e.message);process.exitCode=1;});

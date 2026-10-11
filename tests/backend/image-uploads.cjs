/* eslint-disable @typescript-eslint/no-require-imports -- Isolated DB fixtures, real Cloudinary images; every uploaded test image is deleted. */
const {chromium,expect}=require('@playwright/test'),fs=require('node:fs'),assert=require('node:assert/strict');
module.exports=async function imageUploads({admin,provision,anonymous,verify,url}) {
 const student=await provision('Image Student'),manager=await provision('Image Manager'),other=await provision('Image Other');
 await admin.from('admin_users').insert({user_id:manager.id});
 const originalCourse=(await admin.from('courses').select('metadata').eq('slug','editing-foundations').single()).data;
 const checks=[];let completed=false;const record=(condition,label)=>{verify(condition,label);checks.push(label);};
 const images=[],png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a4hEAAAAASUVORK5CYII=','base64');
 const form=(kind='avatar',file=new File([png],'sample.png',{type:'image/png'}),slug='editing-foundations')=>{const f=new FormData();f.set('kind',kind);f.set('file',file);if(kind==='course')f.set('courseSlug',slug);return f;};
 const upload=async(api,body,options)=>{const r=await api('/api/media/images',body,options);if(r.status===201)images.push(JSON.parse(r.data).publicId);return r;};
 const browser=await chromium.launch();
 try {
  record((await upload(anonymous,form())).status===401,'Guest upload denied');
  record((await upload(student.api,form(),{headers:{Origin:'https://other.example'}})).status===403,'Cross-origin upload denied');
  record((await upload(student.api,form('course'))).status===403,'Student cannot upload course thumbnails');
  record((await upload(student.api,form('avatar',new File(['<svg/>'],'fake.png',{type:'image/png'})))).status===400,'Spoofed image content rejected');
  record((await upload(student.api,form('avatar',new File([png],'video.mp4',{type:'video/mp4'})))).status===400,'Videos rejected; Drive remains the video source');
  record((await upload(student.api,form('avatar',new File([new Uint8Array(3*1024*1024+1)],'large.png',{type:'image/png'})))).status===413,'Oversized image rejected');
  record((await upload(manager.api,form('course',undefined,'missing-course'))).status===404,'Unknown course rejected');
  const own=form();own.set('userId',other.id);own.set('publicId','victim/path');own.set('folder','victim/path');
  const result=await upload(student.api,own),image=JSON.parse(result.data);record(result.status===201,'Valid avatar uploaded through real Cloudinary');
  record(image.publicId.startsWith(`ta3allam/development/users/${student.id}/avatars/`),'Server derives owner folder and ignores client folder/owner');
  record((await admin.from('profiles').select('avatar_url').eq('id',student.id).single()).data.avatar_url===image.url,'Own avatar URL persists in isolated profile');
  record((await admin.from('profiles').select('avatar_url').eq('id',other.id).single()).data.avatar_url===null,'Other profile is unchanged');
  record(/no-store/.test(result.headers.get('cache-control')),'Upload responses never cached');
  record(!/api_secret|signature|test-secret/.test(result.data),'Client response contains no provider credentials');
  process.loadEnvFile('.env.local');const authorization='Basic '+Buffer.from(process.env.CLOUDINARY_API_KEY+':'+process.env.CLOUDINARY_API_SECRET).toString('base64');
  const resource=await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/image/upload/${encodeURIComponent(image.publicId)}`,{headers:{Authorization:authorization}});
  const stored=await resource.json();record(resource.ok&&stored.asset_folder===image.publicId.slice(0,image.publicId.lastIndexOf('/')),'Cloudinary Media Library folder matches owner namespace');
  const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(url+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(manager.email);await page.getByLabel('كلمة المرور',{exact:true}).fill(manager.password);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL('**/admin/dashboard');
  await page.goto(url+'/admin/dashboard/settings');
  await expect(page.locator('.lms-avatar-upload input[type=file]')).toHaveCount(1);
  for(const width of [320,390,768,1440,1920]){await page.setViewportSize({width,height:1000});record(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Avatar settings do not overflow at ${width}px`);}
  await expect.poll(()=>page.locator('.lms-settings-layout').evaluate(el=>Math.abs(el.children[0].getBoundingClientRect().bottom-el.children[2].getBoundingClientRect().bottom)<1)).toBe(true);
  record(true,'Desktop settings card heights remain aligned');
  await expect(page.locator('.lms-avatar-upload input[type=file]')).toBeEnabled();
  const avatarResponse=page.waitForResponse(r=>r.url().endsWith('/api/media/images')&&r.request().method()==='POST');
  await page.locator('.lms-avatar-upload input[type=file]').setInputFiles({name:'avatar.png',mimeType:'image/png',buffer:png});
  const avatarUpload=await avatarResponse;assert.equal(avatarUpload.status(),201);const managerImage=await avatarUpload.json();images.push(managerImage.publicId);
  await expect(page.locator('.lms-avatar-upload img')).toHaveAttribute('src',managerImage.url);record(true,'Avatar uploader refreshes the saved profile image');
  await page.goto(url+'/admin/dashboard/courses/editing-foundations');
  await expect(page.locator('input[type=file]')).toBeEnabled();
  const responsePromise=page.waitForResponse(r=>r.url().endsWith('/api/media/images')&&r.request().method()==='POST');
  await page.locator('input[type=file]').setInputFiles({name:'course.png',mimeType:'image/png',buffer:png});
  const response=await responsePromise;assert.equal(response.status(),201);const thumbnail=await response.json();images.push(thumbnail.publicId);
  record(thumbnail.publicId.startsWith('ta3allam/development/courses/editing-foundations/thumbnails/'),'Course thumbnail is in its course folder');
  await expect(page.locator('input[name=thumbnailUrl]')).toHaveValue(thumbnail.url);record(true,'Reusable uploader fills the editable thumbnail URL');
  for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:1000});record(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Course uploader does not overflow at ${width}px`);}
  await page.getByRole('button',{name:'حفظ التغييرات',exact:true}).first().click();
  await expect.poll(async()=>(await admin.from('courses').select('metadata').eq('slug','editing-foundations').single()).data.metadata.thumbnailUrl).toBe(thumbnail.url);
  record(true,'Saving the course persists the uploaded thumbnail');
  await page.reload();await expect(page.locator('input[name=thumbnailUrl]')).toHaveValue(thumbnail.url);record(true,'Saved thumbnail survives reload');
  record(errors.length===0,'No upload UI runtime errors');
  record((await manager.api(`/api/admin/users/${student.id}`,{action:'ban'})).status===200,'Fixture student banned');
  record((await upload(student.api,form())).status===401,'Banned session cannot upload');
  record((await manager.api(`/api/admin/users/${student.id}`,{action:'restore'})).status===200,'Fixture student restored');
  completed=true;
 } finally {
  await browser.close();await admin.from('courses').update({metadata:originalCourse.metadata}).eq('slug','editing-foundations');process.loadEnvFile('.env.local');
  if(images.length){const parameters=new URLSearchParams();images.forEach(id=>parameters.append('public_ids[]',id));const r=await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/image/upload?${parameters}`,{method:'DELETE',headers:{Authorization:'Basic '+Buffer.from(process.env.CLOUDINARY_API_KEY+':'+process.env.CLOUDINARY_API_SECRET).toString('base64')}});assert.ok(r.ok,'Test Cloudinary images removed');}
  fs.mkdirSync('docs/evidence/image-uploads',{recursive:true});fs.writeFileSync('docs/evidence/image-uploads/acceptance.json',JSON.stringify({checkedAt:new Date().toISOString(),passed:completed,checks,cloudImagesCleaned:images.length},null,2));
 }
};

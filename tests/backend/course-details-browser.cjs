/* eslint-disable @typescript-eslint/no-require-imports -- Responsive shared course details and real enrollment state. */
const {chromium,expect}=require('@playwright/test'),fs=require('node:fs');
module.exports=async({manager,student,admin,course,liveSlug,url,verify})=>{
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  let sdk=0;await page.route('https://www.youtube.com/iframe_api',route=>{sdk++;return route.fulfill({contentType:'application/javascript',body:fs.readFileSync('tests/helpers/youtube-sdk.fixture','utf8')});});
  await page.route('**/embed/**',route=>route.fulfill({contentType:'text/html',body:'<html></html>'}));
  await page.goto(url+'/courses/'+course.slug);await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading',{level:1})).toHaveText(course.title);await expect(page.getByRole('heading',{name:'عن الدورة',exact:true})).toBeVisible();
  await expect(page.locator('.lms-course-prose p')).toHaveCount(2);await expect(page.getByRole('heading',{name:'فهم الأساسيات',exact:true})).toBeVisible();
  verify(await page.locator('header.lms-site-header').count()===1&&await page.locator('.lms-course-price strong').innerText()==='499 ج.م','One shared header and database price');
  verify(sdk===0&&await page.locator('iframe').count()===0,'Intro player is deferred until explicit activation');
  verify(await page.getByRole('link',{name:course.modules[0].lessons[0].title,exact:true}).count()===1&&await page.getByRole('link',{name:course.modules[0].lessons[1].title,exact:true}).count()===0,'Guests see preview links and locked private lessons');
  const summary=page.locator('.lms-course-curriculum summary').first();await summary.focus();await page.keyboard.press('Enter');await expect(page.locator('.lms-course-curriculum details').first()).not.toHaveAttribute('open','');await page.keyboard.press('Enter');verify(true,'Curriculum disclosures work with keyboard');
  for(const width of [320,390,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1000});await page.locator('.lms-course-intro').scrollIntoViewIfNeeded();await expect(page.locator('.lms-course-intro')).toHaveCSS('opacity','1');
   verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Details fit ${width}px without overflow`);
   const boxes=await page.locator('.lms-course-overview,.lms-course-intro,.lms-course-detail-body,.lms-course-detail-sidebar').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right};}));
   verify(width>1024?boxes[3].right<=boxes[1].left:boxes[0].bottom<=boxes[1].top&&boxes[1].bottom<=boxes[3].top&&boxes[3].bottom<=boxes[2].top,`Correct desktop/sidebar or mobile purchase order at ${width}px`);
   if(width===390||width===1440){for(const section of await page.locator('main [data-reveal]').all()){await section.scrollIntoViewIfNeeded();await expect(section).toHaveCSS('opacity','1');}await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`docs/evidence/backend/course-details-${width}.png`,fullPage:true});}
  }
  await page.setViewportSize({width:1440,height:1000});await page.getByRole('button',{name:'شاهد الفيديو التعريفي',exact:true}).click();await expect(page.locator('.lms-course-intro iframe')).toHaveCount(1);verify(sdk===1,'Custom shared player accepts YouTube intro links');
  await page.waitForFunction(()=>Boolean(window.__customPlayerTest?.players?.length));await page.evaluate(()=>window.__customPlayerTest.players[0].emit(0));await expect(page.getByRole('button',{name:'شاهد الفيديو التعريفي',exact:true})).toBeVisible();verify(await page.locator('.lms-course-intro iframe').count()===0,'Finished intro returns to thumbnail and releases iframe');
  await page.getByRole('button',{name:'شاهد الفيديو التعريفي',exact:true}).click();await expect(page.locator('.lms-course-intro iframe')).toHaveCount(1);await page.locator('footer').scrollIntoViewIfNeeded();await expect(page.locator('.lms-course-intro iframe')).toHaveCount(0);verify(true,'Off-screen intro resets and disposes playback');
  await page.goto(url+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(student.email);await page.getByLabel('كلمة المرور',{exact:true}).fill(student.password);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await expect(page).toHaveURL(url+'/dashboard');
  await page.goto(url+'/courses/'+course.slug);await page.getByRole('button',{name:'اشترك الآن',exact:true}).click();await expect(page).toHaveURL(url+'/checkout/'+course.slug);verify(true,'Purchase action reaches existing checkout without charging');
  await admin.from('enrollments').insert({user_id:student.id,course_slug:course.slug});await page.goto(url+'/courses/'+course.slug);
  await expect(page.getByRole('link',{name:course.modules[0].lessons[1].title,exact:true})).toBeVisible();await page.getByRole('button',{name:'كمّل تعلّمك',exact:true}).click();await expect(page).toHaveURL(url+'/learn/'+course.slug+'/'+course.modules[0].lessons[0].id);verify(true,'Enrolled learners get unlocked lesson links and continue action');
  await admin.from('courses').update({metadata:{...course,introVideoUrl:'/assets/video/workshop-intro.mp4'}}).eq('slug',course.slug);await page.goto(url+'/courses/'+course.slug);
  await page.getByRole('button',{name:'شاهد الفيديو التعريفي',exact:true}).click();await expect(page.locator('.lms-course-intro video')).toBeVisible();await expect(page.locator('.lms-course-intro video')).toHaveJSProperty('controls',false);verify(true,'Native intros retain the same custom player without browser controls');
  await admin.from('courses').update({metadata:{...course,introVideoUrl:'',thumbnailUrl:''}}).eq('slug',course.slug);await page.goto(url+'/courses/'+course.slug);
  await expect(page.getByRole('button',{name:'شاهد الفيديو التعريفي',exact:true})).toHaveCount(0);await expect(page.locator('.lms-course-intro .lms-course-art')).toBeVisible();verify(true,'Courses without media show their themed artwork without an invalid play action');
  await require('./featured-workshop-browser.cjs')({browser,manager,url,liveSlug,verify});
  await admin.from('enrollments').insert({user_id:student.id,course_slug:liveSlug});await page.goto(url+'/workshops/'+liveSlug);
  await expect(page.getByRole('link',{name:'متابعة الورشة',exact:true})).toHaveAttribute('href',/^https:\/\/wa\.me\//);verify(true,'Enrolled live workshop without lessons has a working support action');
  verify(errors.length===0,'Detail pages have no browser runtime or hydration errors');
 }finally{await browser.close();}
};

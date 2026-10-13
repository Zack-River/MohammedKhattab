/* eslint-disable @typescript-eslint/no-require-imports -- Isolated recorded-template authorization and routing regression. */
const assert=require('node:assert/strict'),{randomUUID}=require('node:crypto'),{chromium,expect}=require('@playwright/test');
module.exports=async({admin,manager,student,anonymous,verify,url})=>{
 const slug='recorded-featured-'+randomUUID(),path='/api/admin/courses/'+slug,parse=r=>JSON.parse(r.data);
 const source=parse(await anonymous('/api/courses/editing-foundations'));
 const course={...source,slug,delivery:'recorded',featured:true};
 const edit=current=>({title:course.title,description:course.description,amount:499,category:course.category,thumbnailUrl:'',introVideoUrl:'',revision:current.revision,published:true});
 try{
  assert.ok(!(await admin.from('courses').insert({slug,metadata:course,amount:499,published:true,position:101})).error);
  const template=parse(await manager.api(path+'/template'));
  verify(template.revision===0,'Recorded courses have editable template defaults');
  template.document.content.hero.title=['Recorded featured heading'];template.document.showCountdown=false;
  verify((await manager.api(path+'/template',{document:template.document,revision:0})).status===200,'Admin saves recorded course template');
  verify((await student.api(path+'/template')).status===403,'Student cannot manage recorded template');
  verify((await student.direct.from('workshop_templates').select('course_slug').eq('course_slug',slug)).data?.length===1,'RLS permits published recorded featured template reads');
  verify(!(await student.direct.from('workshop_templates').update({revision:99}).eq('course_slug',slug).select()).data?.length,'RLS denies recorded template student writes');
  const featured=await anonymous('/featured/'+slug);
  verify(featured.status===200&&featured.data.includes('Recorded featured heading')&&featured.data.includes('roadmap-section'),'Recorded featured design renders at independent featured URL');
  const details=await anonymous('/courses/'+slug);verify(details.data.includes('lms-course-details-page')&&!details.data.includes('Recorded featured heading'),'Featured course retains its separate normal details');
  const wrongRoute=await anonymous('/workshops/'+slug);
  verify(wrongRoute.status===404 || (wrongRoute.data.includes('lms-not-found') && !wrongRoute.data.includes('Recorded featured heading')),'Recorded course cannot become a live workshop URL');
  const browser=await chromium.launch(),page=await browser.newPage({reducedMotion:'reduce'});
  try{
   await page.context().request.post(url+'/api/auth/login',{headers:{Origin:url},data:{email:manager.email,password:manager.password}});
   await page.goto(url+'/admin/dashboard/courses/'+slug);
   await require('./admin-video-preview-browser.cjs')({page,url,slug,verify});
   await expect(page.getByRole('checkbox',{name:'تصميم الصفحة المميزة'})).toBeChecked();
   await expect(page.getByRole('link',{name:'تصميم الصفحة المميزة',exact:true})).toBeVisible();verify(true,'Recorded editor exposes layout control and template tab');
   for(const width of [390,1440]){
    await page.setViewportSize({width,height:900});await page.goto(url+'/featured/'+slug);
    await expect(page.getByRole('heading',{name:'Recorded featured heading',exact:true})).toBeVisible();
    verify(await page.locator('header.lms-site-header').count()===1,'Recorded featured page has one navbar at '+width);
    verify(await page.locator('footer').count()===1,'Recorded featured page has one footer at '+width);
    verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Recorded featured layout fits '+width);
   }
  }finally{await browser.close();}
  let current=parse(await manager.api(path));
  verify((await manager.api(path,{...edit(current),featured:false})).status===200,'Admin disables recorded featured layout');
  const ordinary=await anonymous('/courses/'+slug);
  verify(ordinary.status===200&&ordinary.data.includes('lms-course-details-page')&&!ordinary.data.includes('Recorded featured heading'),'Disabling layout restores standard recorded details');
  verify(!(await student.direct.from('workshop_templates').select('course_slug').eq('course_slug',slug)).data?.length,'Disabled recorded template hidden by RLS');
  current=parse(await manager.api(path));
  verify(current.course.delivery==='recorded'&&current.course.modules.length===source.modules.length,'Layout edits preserve recorded delivery and curriculum');
 }finally{await admin.from('courses').delete().eq('slug',slug);}
};

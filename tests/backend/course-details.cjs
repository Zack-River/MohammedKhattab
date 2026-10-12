/* eslint-disable @typescript-eslint/no-require-imports -- Isolated detail-template and featured-setting acceptance. */
const assert=require('node:assert/strict'),{randomUUID}=require('node:crypto');
module.exports=async({admin,provision,anonymous,verify,url})=>{
 const manager=await provision('Detail Manager'),student=await provision('Detail Student');
 assert.ok(!(await admin.from('admin_users').insert({user_id:manager.id})).error);
 const slug='details-'+randomUUID(),liveSlug=slug+'-live',parse=r=>JSON.parse(r.data);
 const source=parse(await anonymous('/api/courses/editing-foundations'));
 const first=source.modules[0].lessons[0],second=source.modules[0].lessons[1];
 const course={...source,slug,description:'تعلّم المونتاج خطوة بخطوة.\n\nطبّق على مشروعك وراجع النتيجة.',introVideoUrl:'https://youtu.be/svTNN9S7ipc',thumbnailUrl:'/assets/images/personal/workshop.png',modules:[{id:'chapter-one',title:'البداية والتطبيق',sections:[{id:'section-one',title:'فهم الأساسيات',lessonIds:[first.id]}],lessons:[{...first,preview:true},{...second,preview:false}]},{id:'chapter-two',title:'الخطوة التالية',lessons:[{...first,id:'next-step',preview:false}]}]};
 const live={slug:liveSlug,title:'ورشة تجريبية مباشرة',description:'وصف خاص بالورشة التجريبية',amount:500,category:'business',delivery:'live',duration:'٧ أيام',featured:false};
 const edit=current=>({title:current.course.title,description:current.course.description,amount:current.course.offer.amount,category:current.course.category,duration:current.course.duration,thumbnailUrl:'',introVideoUrl:'',published:true,revision:current.revision});
 const read=async()=>parse(await manager.api('/api/admin/courses/'+liveSlug));
 try{
  assert.ok(!(await admin.from('courses').insert({slug,metadata:course,amount:499,published:true,position:100})).error);
  assert.ok(!(await admin.from('lessons').insert(course.modules.flatMap(chapter=>chapter.lessons.map(lesson=>({course_slug:slug,id:lesson.id,preview:lesson.preview,video_url:'/assets/video/workshop-intro.mp4'}))))).error);
  verify((await student.api('/api/admin/courses',live)).status===403,'Students cannot set featured workshop status');
  verify((await manager.api('/api/admin/courses',live)).status===201,'Admin creates ordinary workshop');
  let current=await read();verify(current.course.featured===false,'Ordinary status persists');
  verify((await manager.api('/api/admin/courses/'+liveSlug,{...edit(current),featured:'true'})).status===400,'Non-boolean featured edit rejected');
  verify((await manager.api('/api/admin/courses/'+liveSlug,edit(current))).status===200,'Ordinary live workshop publishes');
  const ordinary=await anonymous('/workshops/'+liveSlug);verify(ordinary.status===200&&ordinary.data.includes('lms-course-details-page')&&!ordinary.data.includes('roadmap-section'),'Ordinary workshops render shared details');
  current=await read();verify((await manager.api('/api/admin/courses/'+liveSlug,{...edit(current),featured:true})).status===200,'Admin enables featured design');
  const featured=await anonymous('/workshops/'+liveSlug);verify(featured.status===200&&featured.data.includes('roadmap-section')&&!featured.data.includes('lms-course-details-page'),'Featured workshops render campaign template');
  verify(!featured.data.includes('تأسيس العقلية والبرنامج الأساسي')&&!featured.data.includes('class="hero-video-shell"'),'New featured workshops do not inherit the seven-day curriculum or intro video');
  const legacy=await anonymous('/workshops/7days-freelance');verify(legacy.status===200&&legacy.data.includes('roadmap-section'),'Existing seven-day workshop keeps approved design');
  await require('./course-details-browser.cjs')({manager,student,admin,course,liveSlug,url,verify});
  current=await read();verify((await manager.api('/api/admin/courses/'+liveSlug,{...edit(current),amount:0,featured:false})).status===200,'Free ordinary live workshop can be saved');
  const free=await anonymous('/workshops/'+liveSlug);verify(free.data.includes('احجز مكانك')&&free.data.includes('https://wa.me/'),'Free live workshops without lessons provide a booking action');
 }finally{await admin.from('courses').delete().in('slug',[slug,liveSlug]);}
};

/* eslint-disable @typescript-eslint/no-require-imports -- Isolated featured template CRUD and permission checks. */
const assert=require('node:assert/strict'),{randomUUID}=require('node:crypto');
module.exports=async({admin,provision,anonymous,verify,url})=>{
 const manager=await provision('Template Manager'),student=await provision('Template Student');
 assert.ok(!(await admin.from('admin_users').insert({user_id:manager.id})).error);
 const slug='template-'+randomUUID(),path='/api/admin/courses/'+slug+'/template',parse=r=>JSON.parse(r.data);
 try {
  // Next dev may serve the shallow catalog before discovering nested routes.
  for(let attempt=0;attempt<20;attempt++){
   const ready=await anonymous(path);
   if(ready.status!==404 || !ready.data.startsWith('<!DOCTYPE html>')) break;
   if(attempt===19) throw new Error('Template API route discovery did not complete');
   await new Promise(resolve=>setTimeout(resolve,500));
  }
  const body={slug,title:'Editable featured workshop',description:'A workshop with unique editable marketing content.',amount:500,category:'business',delivery:'live',duration:'7 days',featured:true};
  verify((await manager.api('/api/admin/courses',body)).status===201,'Admin creates featured workshop');
  let course=parse(await manager.api('/api/admin/courses/'+slug));
  verify((await manager.api('/api/admin/courses/'+slug,{...body,revision:course.revision,published:true,thumbnailUrl:'',introVideoUrl:''})).status===200,'Featured workshop publishes');
  const guest=await anonymous(path);verify(guest.status===401,`Guest cannot read template editor (${guest.status}: ${guest.data.slice(0,160)})`);
  verify((await student.api(path)).status===403,'Student cannot read template editor');
  let record=parse(await manager.api(path));verify(record.revision===0&&record.document.order.length===9,'Unsaved template derives course defaults');
  const v=record.document;v.content.hero.title=['Unique featured heading'];v.content.hero.description='Completely edited hero description';v.content.faq.items=[{question:'Unique question?',answer:'Unique custom answer.'}];v.order=v.order.filter(k=>k!=='guarantee');v.showCountdown=false;v.showSignup=false;
  v.content.hero.showVideo=true;v.content.hero.video.source.url='https://youtu.be/svTNN9S7ipc';
  verify((await student.api(path,{document:v,revision:0})).status===403,'Student cannot save template');
  verify((await manager.api(path,{document:v,revision:0},{headers:{Origin:'https://hostile.example'}})).status===403,'Cross-origin template write blocked');
  verify((await manager.api(path,{document:v,revision:0})).status===200,'Admin saves custom content and section visibility');
  verify((await manager.api(path,{document:v,revision:0})).status===409,'Concurrent initial template write rejects stale revision');
  record=parse(await manager.api(path));verify(record.revision===1&&record.document.content.hero.title[0]==='Unique featured heading','Template persists full content');
  const publicPage=await anonymous('/featured/'+slug);
  verify(publicPage.status===200&&publicPage.data.includes('Unique featured heading')&&publicPage.data.includes('Unique question?')&&!publicPage.data.includes('guarantee-section'),'Published template uses edited text and hides section');
  verify(publicPage.data.includes('lms-site-header')&&!publicPage.data.includes('top-scarcity-bar'),'Featured template uses main navbar and hides countdown');
  verify(!(await student.direct.from('workshop_templates').update({revision:99}).eq('course_slug',slug).select()).data?.length,'RLS prevents student direct writes');
  const bad=structuredClone(v);bad.content.hero.action.href='javascript:alert(1)';verify((await manager.api(path,{document:bad,revision:1})).status===400,'Unsafe template link rejected');
  bad.content.hero.action.href='/';bad.content.hero.section.id='hacked';verify((await manager.api(path,{document:bad,revision:1})).status===400,'Template cannot break section IDs or animation contract');
  v.order=['hero','faq',...v.order.filter(k=>!['hero','faq'].includes(k))];
  verify((await manager.api(path,{document:v,revision:1})).status===200,'Admin saves custom section order');
  const reordered=await anonymous('/featured/'+slug);verify(reordered.data.indexOf('id="faq"')<reordered.data.indexOf('id="roadmap"'),'Saved section order controls public layout');
  verify((await manager.api(path,{document:v,revision:1})).status===409,'Stale template edit cannot overwrite newer document');
  verify((await anonymous('/api/courses/'+slug+'/template-media?clip=../../secret')).status===404,'Public media endpoint rejects arbitrary clip lookup');
  await require('./recorded-featured.cjs')({admin,manager,student,anonymous,verify,url});
  await require('./workshop-template-browser.cjs')({manager,slug,url,verify});
  course=parse(await manager.api('/api/admin/courses/'+slug));
  verify((await manager.api('/api/admin/courses/'+slug,{...body,revision:course.revision,published:false,thumbnailUrl:'',introVideoUrl:''})).status===200,'Workshop can return to draft');
  verify(!(await student.direct.from('workshop_templates').select('course_slug').eq('course_slug',slug)).data?.length,'Draft template hidden by RLS');
 }finally{await admin.from('courses').delete().eq('slug',slug);}
};

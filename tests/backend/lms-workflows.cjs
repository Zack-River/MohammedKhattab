/* eslint-disable @typescript-eslint/no-require-imports -- Isolated database-backed learning acceptance. */
const assert = require('node:assert/strict'), { randomUUID } = require('node:crypto');
module.exports = async ({ admin, provision, anonymous, verify, url }) => {
 const student = await provision('Workflow Student'), other = await provision('Workflow Other'), manager = await provision('Workflow Manager');
 assert.ok(!(await admin.from('admin_users').insert({user_id:manager.id})).error);
 const slug='workflow-'+randomUUID(), resource='resource-'+randomUUID(), parse=r=>JSON.parse(r.data);
 const source=parse(await anonymous('/api/courses/editing-foundations'));
 const make=id=>({...source.modules[0].lessons[0],id,title:'Lesson '+id,preview:id==='second',resourceIds:[]});
 const course={...source,slug,title:'Workflow acceptance course',modules:[{id:'chapter',title:'Learning chapter',sections:[{id:'intro',title:'Introduction section',lessonIds:['second','first']}],lessons:[make('first'),make('second'),make('third')]}]};
 try {
  assert.ok(!(await admin.from('courses').insert({slug,metadata:course,amount:499,published:true})).error);
  assert.ok(!(await admin.from('lessons').insert(course.modules[0].lessons.map(l=>({course_slug:slug,id:l.id,preview:l.preview,video_url:'/assets/video/workshop-intro.mp4'})))).error);
  assert.ok(!(await admin.from('resources').insert({id:resource,title:'Database-only learning resource',description:'Live resource',type:'TXT',content:'Protected practice checklist'})).error);
  assert.ok(!(await admin.from('lesson_resources').insert({resource_id:resource,course_slug:slug,lesson_id:'second'})).error);
  const preview=await anonymous('/learn/'+slug+'/second');
  verify(preview.status===200&&!preview.data.includes('Database-only learning resource'),'Anonymous preview hides protected resources');
  verify(!preview.data.includes('أتممت هذا الدرس'),'Preview does not invite visitors to mutate completion or auto-enroll');
  verify((await other.api('/api/resources/'+resource)).status===404,'Unenrolled account cannot download resource');
  assert.ok(!(await admin.from('enrollments').insert({user_id:student.id,course_slug:slug})).error);
  const lesson=await student.api('/learn/'+slug+'/second');
  verify(lesson.data.includes('Database-only learning resource'),'Learner sees database resource absent from seed and public metadata');
  verify(lesson.data.includes('Introduction section'),'Learner outline displays actual section titles');
  verify((await student.api('/api/resources/'+resource)).data==='Protected practice checklist','Enrolled learner downloads actual resource content');
  verify((await student.api('/api/progress',{courseSlug:slug,lessonId:'second',completed:true})).status===200,'Completion is persisted for owned course');
  let detail=parse(await manager.api('/api/admin/users/'+student.id));
  let progress=detail.subscriptions.find(s=>s.slug===slug);
  verify(progress.count===1&&progress.total===3&&progress.percent===33,'Admin reports real current curriculum progress');
  verify((await other.api('/api/admin/users/'+student.id)).status===403,'Student cannot inspect another learner progress');
  const intent=randomUUID();
  const orders=Array.from({length:7},(_,index)=>({user_id:student.id,course_slug:slug,course_title:index===0?'Pending workflow order':'Paid workflow order '+index,amount_minor:49900,live:false,status:index===0?'pending':index===1?'failed':index===2?'expired':'paid',provider_intent_key:index===0?intent:null}));
  orders.push({user_id:other.id,course_slug:slug,course_title:'Other learner secret order',amount_minor:49900,live:false,status:'paid'});
  const inserted=await admin.from('payment_orders').insert(orders).select('id');assert.ok(!inserted.error,inserted.error?.message);
  const history=await student.api('/dashboard/purchases');
  verify(history.status===200&&!history.data.includes('Other learner secret order'),'History only lists current account orders');
  verify(!history.data.includes(intent),'History excludes provider intent keys');
  const filtered=await student.api('/dashboard/purchases?q=Pending&status=pending');
  verify(filtered.data.includes('Pending workflow order')&&!filtered.data.includes('Paid workflow order 1'),'History search and status combine');
  const denied=await anonymous('/dashboard/purchases');
  verify(denied.status===307||denied.data.includes('NEXT_REDIRECT'),'History requires authentication');
  await require('./lms-workflows-browser.cjs')({url,student,manager,slug,verify});
  assert.ok(!(await admin.from('lesson_progress').upsert({user_id:student.id,course_slug:slug,lesson_id:'third',completed:true})).error);
  detail=parse(await manager.api('/api/admin/users/'+student.id));progress=detail.subscriptions.find(s=>s.slug===slug);
  verify(progress.count===2&&progress.percent===67,'Admin progress updates without modifying enrollment or price');
 } finally {
  await admin.from('payment_orders').delete().eq('course_slug',slug);
  await admin.from('enrollments').delete().eq('course_slug',slug);
  await admin.from('courses').delete().eq('slug',slug);
  await admin.from('resources').delete().eq('id',resource);
 }
};

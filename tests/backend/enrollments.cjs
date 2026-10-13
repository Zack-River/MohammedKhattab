/* eslint-disable @typescript-eslint/no-require-imports -- Isolated local integration coverage. */
const assert=require('node:assert/strict');
module.exports=async({admin,provision,anonymous,verify,url,config})=>{
 const manager=await provision('Enrollment Manager'),student=await provision('Enrollment Student'),outsider=await provision('Enrollment Outsider');
 assert.ok(!(await admin.from('admin_users').insert({user_id:manager.id})).error);
 const slug='backend-enrollment-course',endpoint=`/api/admin/users/${student.id}/enrollments`,created=[];
 const source=(await admin.from('courses').select('*').eq('slug','editing-foundations').single()).data;
 const lessonId=source.metadata.modules[0].lessons[0].id;
 const lesson=(await admin.from('lessons').select('*').eq('course_slug',source.slug).eq('id',lessonId).single()).data;
 assert.ok(!(await admin.from('courses').insert({...source,slug,metadata:{...source.metadata,slug,title:'Enrollment test course'}})).error);
 assert.ok(!(await admin.from('lessons').insert({...lesson,course_slug:slug,preview:false})).error);
 const input={courseSlug:slug,action:'grant',reason:'Manual admission after support review',revision:0};
 const notePath=`/api/courses/${slug}/lessons/${lessonId}/notes`;
 try {
  verify((await anonymous(endpoint,input)).status===401,'Guest cannot manage enrollment');
  verify((await student.api(endpoint,input)).status===403,'Student cannot manage enrollment');
  verify((await manager.api(endpoint,input,{headers:{Origin:'https://evil.example'}})).status===403,'Cross-origin enrollment mutation denied');
  for(const patch of [{reason:''},{reason:'x'.repeat(501)},{action:'delete'},{revision:-1},{revision:'0'},{courseSlug:"x'; drop table courses;--"}]) verify((await manager.api(endpoint,{...input,...patch})).status===400,'Invalid enrollment request rejected');
  verify(Boolean((await outsider.direct.rpc('manage_enrollment',{p_user:student.id,p_slug:slug,p_action:'grant',p_reason:'forged',p_revision:0})).error),'Direct student RPC cannot grant access');
  await admin.from('account_contacts').update({phone_verified_at:null}).eq('user_id',student.id);
  verify((await manager.api(endpoint,input)).status===403,'New manual enrollment retains verification gate');
  await admin.from('account_contacts').update({phone_verified_at:new Date().toISOString()}).eq('user_id',student.id);
  const baseline=JSON.parse((await manager.api('/api/admin/analytics')).data).metrics.totalEnrollments;
  const grants=await Promise.all([manager.api(endpoint,input),manager.api(endpoint,input)]);
  verify(grants.map(r=>r.status).sort().join(',')==='200,409','Concurrent grants have one winner');
  verify((await student.direct.from('lessons').select('video_url').eq('course_slug',slug)).data.length===1,'Granted student can read protected playback');
  assert.ok(!(await student.direct.from('lesson_progress').insert({user_id:student.id,course_slug:slug,lesson_id:lessonId,completed:true})).error);
  verify((await student.api(notePath,{text:'Preserved private note',revision:0})).status===200,'Granted student saves a private note');
  const material=await admin.from('resources').insert({id:'backend-entitlement-material',title:'Enrollment material',description:'',type:'TXT',kind:'text',content:'retained material'}).select('id').single();assert.ok(!material.error);created.push(material.data.id);
  assert.ok(!(await admin.from('lesson_resources').insert({resource_id:material.data.id,course_slug:slug,lesson_id:lessonId})).error);
  const session=await admin.from('live_sessions').insert({course_slug:slug,title:'Enrollment live',starts_at:new Date(Date.now()-60000).toISOString(),ends_at:new Date(Date.now()+3600000).toISOString()}).select('id').single();assert.ok(!session.error,JSON.stringify(session.error));
  await admin.from('live_session_links').insert({session_id:session.data.id,join_url:'https://meet.google.com/aaa-bbbb-ccc'});
  verify((await student.direct.from('live_session_links').select('join_url').eq('session_id',session.data.id)).data.length===1,'Granted learner has active live joining link');
  const revoke={...input,action:'revoke',revision:1,reason:'Support requested suspension of this course'};
  verify((await manager.api(endpoint,revoke)).status===200,'Administrator revokes course access');
  const row=(await admin.from('enrollments').select('*').eq('user_id',student.id).eq('course_slug',slug).single()).data;
  verify(row.active===false&&row.revision===2,'Revocation keeps durable enrollment with incremented revision');
  const listed=JSON.parse((await manager.api('/api/admin/courses?q=Enrollment%20test')).data).courses.find(course=>course.slug===slug);
  verify(listed.students===0,'Admin course student count excludes revoked access');
  verify(JSON.parse((await manager.api('/api/admin/analytics')).data).metrics.totalEnrollments===baseline,'Analytics excludes revoked entitlement without deleting its history');
  for(const [table,select,filter] of [['lessons','video_url','course_slug'],['lesson_progress','*','course_slug'],['lesson_notes','*','course_slug'],['lesson_resources','*','course_slug'],['resources','content','id'],['live_session_links','join_url','session_id']]) {
   const value=table==='resources' ? material.data.id : table==='live_session_links' ? session.data.id : slug;
   const r=await student.direct.from(table).select(select).eq(filter,value);
   verify(!r.error&&r.data.length===0,'Revoked JWT denied '+table);
  }
  verify((await student.api('/api/resources/'+material.data.id)).status===404,'Revoked material download denied');
  verify((await student.api(notePath)).status===403,'Revoked note endpoint denied');
  const state=JSON.parse((await student.api('/api/enrollments')).data);
  verify(!state.enrolled.includes(slug)&&!state.completed.includes(slug+'/'+lessonId),'Learner state excludes revoked course and its progress');
  verify((await student.api('/api/enrollments',{courseSlug:slug})).status===403,'Self enrollment cannot override administrative revocation');
  verify((await student.api('/api/progress',{courseSlug:slug,lessonId,completed:false})).status===403,'Progress API denies revoked enrollment');
  verify(Boolean((await student.direct.from('enrollments').insert({user_id:student.id,course_slug:'motion-essentials',active:true,revision:99})).error),'Student cannot supply administrative state or revision on insert');
  verify(Boolean((await student.direct.rpc('save_lesson_note',{p_slug:slug,p_lesson:lessonId,p_text:'Forged',p_revision:1})).error),'Revoked learner cannot bypass note API through RPC');
  verify(Boolean((await student.direct.from('lesson_progress').upsert({user_id:student.id,course_slug:slug,lesson_id:lessonId,completed:false})).error),'Revoked learner cannot write progress directly');
  verify(Boolean((await student.direct.from('enrollments').update({active:true}).eq('course_slug',slug)).error),'Learner cannot restore enrollment directly');
  const before=(await admin.from('lesson_progress').select('*').eq('user_id',student.id)).data;
  verify(before.some(p=>p.course_slug===slug&&p.completed),'Revocation preserves completed lesson in storage');
  const restore={...input,action:'restore',revision:2,reason:'Resolved support review'};
  const restores=await Promise.all([manager.api(endpoint,restore),manager.api(endpoint,restore)]);
  verify(restores.map(r=>r.status).sort().join(',')==='200,409','Concurrent restores reject stale writer');
  verify(JSON.parse((await student.api(notePath)).data).text==='Preserved private note','Restoration recovers saved notes');
  verify((await student.direct.from('lesson_progress').select('*').eq('course_slug',slug)).data[0].completed,'Restoration recovers saved progress');
  const events=(await manager.direct.from('enrollment_events').select('*').eq('user_id',student.id).order('revision')).data;
  verify(events.map(e=>e.action).join(',')==='grant,revoke,restore'&&events.every(e=>e.actor_id===manager.id&&e.reason),'History records reason and verified administrator actor');
  verify((await student.direct.from('enrollment_events').select('*')).data.length===0,'Student cannot read private administrative reasons');
  verify(Boolean((await manager.direct.from('enrollment_events').insert({user_id:student.id,course_slug:slug,action:'grant',reason:'fake',revision:8})).error),'History cannot be forged even by admin direct JWT');
  await require('./enrollments-payment.cjs')({admin,student,manager,endpoint,input,slug,verify});
  await require('./enrollments-race.cjs')({admin,manager,outsider,slug,lessonId,config,verify});
  await require('./enrollments-browser.cjs')({admin,manager,student,slug,url,verify});
 } finally {
  await admin.from('payment_orders').delete().eq('user_id',student.id);
  await admin.from('resources').delete().in('id',created);
  await admin.from('courses').delete().eq('slug',slug);
 }
};

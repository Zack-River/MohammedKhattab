/* eslint-disable @typescript-eslint/no-require-imports -- Disposable local accounts; no production issuance. */
const assert=require('node:assert/strict');
const json=result=>JSON.parse(result.data);
module.exports=async({admin,provision,anonymous,verify,url})=>{
 const manager=await provision('Certificate Manager'),student=await provision('أحمد محمد علي'),other=await provision('Certificate Outsider');
 assert.ok(!(await admin.from('admin_users').insert({user_id:manager.id})).error);
 const slug='backend-certificate-course',base=(await admin.from('courses').select('*').eq('slug','editing-foundations').single()).data;
 const sourceLesson=(await admin.from('lessons').select('*').eq('course_slug',base.slug).limit(1).single()).data;
 const lessons=Array.from({length:3},(_,index)=>({...sourceLesson,id:'certificate-lesson-'+index,course_slug:slug}));
 const metadataLessons=lessons.map(lesson=>({...base.metadata.modules[0].lessons[0],id:lesson.id}));
 assert.ok(!(await admin.from('courses').insert({...base,slug,metadata:{...base.metadata,slug,title:'دورة اختبار الشهادات',modules:[{id:'chapter',title:'Chapter',lessons:metadataLessons}]}})).error);
 assert.ok(!(await admin.from('lessons').insert(lessons)).error);
 const extras=[];
 const endpoint='/api/admin/certificates',issue={operation:'issue',slug},username=(await admin.from('profiles').select('username').eq('id',student.id).single()).data.username;
 try {
  for(const path of [endpoint,endpoint+'/preview']) {
   verify((await anonymous(path)).status===401,'Guest cannot read '+path);
   verify((await student.api(path)).status===403,'Student cannot read '+path);
  }
  verify((await anonymous('/api/certificates',issue)).status===401,'Guest cannot issue certificates');
  verify((await student.api('/api/certificates',issue)).status===403,'Enrollment required for issuance');
  assert.ok(!(await admin.from('enrollments').insert({user_id:student.id,course_slug:slug})).error);
  verify((await student.api('/api/certificates',issue)).status===403,'Incomplete course denied');
  verify((await manager.api(endpoint,{...issue,username})).status===403,'Admin issuance cannot bypass completion');
  for(const lesson of lessons.slice(0,2)) assert.ok(!(await admin.from('lesson_progress').insert({user_id:student.id,course_slug:slug,lesson_id:lesson.id,completed:true})).error);
  verify((await student.api('/api/certificates',issue)).status===403,'One unfinished lesson blocks issuance');
  verify(!(await student.direct.rpc('eligible_certificate_courses')).data.some(course=>course.slug===slug),'Lightweight eligibility excludes unfinished courses');
  verify((await student.api('/api/certificates',{...issue,username})).status===400,'Student cannot specify another identity');
  verify((await other.direct.rpc('issue_certificate',{p_slug:slug,p_username:username})).error?.message.includes('FORBIDDEN'),'Direct RPC cannot impersonate a learner');
  verify((await student.api('/api/certificates',issue,{headers:{Origin:'https://evil.example'}})).status===403,'Cross-origin issuance denied');
  const missing=await student.api('/api/certificates/'+slug);verify(missing.status===403,'GET never auto-issues a certificate');
  verify((await admin.from('certificates').select('id').eq('course_slug',slug)).data.length===0,'Denied requests have no issuance side effects');
  assert.ok(!(await admin.from('lesson_progress').insert({user_id:student.id,course_slug:slug,lesson_id:lessons[2].id,completed:true})).error);
  const eligible=(await student.direct.rpc('eligible_certificate_courses')).data;verify(eligible.some(course=>course.slug===slug)&&eligible.every(course=>Object.keys(course).sort().join(',')==='slug,title'),'Eligibility returns exact completion and minimal title/slug only');
  const race=await Promise.all([student.api('/api/certificates',issue),student.api('/api/certificates',issue)]);
  verify(race.every(result=>result.status===200),'Concurrent issuance is idempotent');
  let records=(await admin.from('certificates').select('*').eq('course_slug',slug)).data;verify(records.length===1,'Exactly one saved certificate per learner/course');
  const record=records[0];
  verify(!(await student.direct.rpc('eligible_certificate_courses')).data.some(course=>course.slug===slug),'Issued courses disappear from issuance choices');
  verify((await manager.api(endpoint+'/invalid-id')).status===404,'Invalid certificate identifier is a 404, not a database error');
  verify(record.lesson_count===3&&record.learner_name==='أحمد محمد علي'&&record.course_title==='دورة اختبار الشهادات','Issuer snapshots real name/title/completed lesson count');
  verify((await admin.from('certificate_events').select('id').eq('certificate_id',record.id)).data.length===1,'Retry creates no duplicate issuance audit event');
  verify((await student.direct.from('certificates').update({status:'revoked'}).eq('id',record.id)).error?.code==='42501','Student cannot write certificates directly');
  verify((await student.direct.from('certificates').insert({user_id:student.id,course_slug:slug,learner_name:'Fake',course_title:'Fake',lesson_count:1})).error?.code==='42501','Student cannot forge certificate rows');
  verify((await other.direct.from('certificates').select('*').eq('id',record.id)).data.length===0,'RLS hides other learner certificate');
  verify((await student.direct.from('certificate_events').select('*')).data.length===0,'Private administrative reasons remain hidden');
  verify((await manager.direct.from('certificate_events').delete().eq('certificate_id',record.id)).error?.code==='42501','Administrator JWT cannot delete certificate audit evidence');
  verify((await manager.direct.from('certificates').update({learner_name:'Fake'}).eq('id',record.id)).error?.code==='42501','Administrator JWT cannot rewrite saved snapshots');
  verify((await student.direct.rpc('moderate_certificate',{p_id:record.id,p_action:'revoke',p_reason:'Fake',p_revision:1})).error?.message.includes('FORBIDDEN'),'Direct moderation is administrator-only');
  const own=json(await student.api('/api/certificates?q=%D8%A7%D8%AE%D8%AA%D8%A8%D8%A7%D8%B1&filter=issued'));verify(own.total===1&&own.certificates.length===1,'Student search and status filter combine');
  verify(json(await manager.api(endpoint+'?q=%D8%A7%D8%AE%D8%AA%D8%A8%D8%A7%D8%B1&filter=revoked')).total===0,'Admin search and state filter combine');
  const malicious=await manager.api(endpoint+'?q='+encodeURIComponent('x),status.eq.revoked,learner_name.ilike.%'));
  verify(malicious.status===200&&json(malicious).total===0,'Search syntax cannot inject PostgREST filters');
  const svg=await student.api('/api/certificates/'+slug);verify(svg.status===200&&svg.data.includes('شهادة إتمام تدريبية')&&svg.data.includes(record.id),'Download uses saved Arabic document and serial');
  verify(svg.headers.get('content-type').startsWith('image/svg+xml')&&/no-store/.test(svg.headers.get('cache-control')),'Document is a private vector download');
  await admin.from('profiles').update({name:'Changed Name'}).eq('id',student.id);
  await admin.from('courses').update({metadata:{...base.metadata,slug,title:'Changed course',modules:[{id:'chapter',title:'Chapter',lessons:metadataLessons}]}}).eq('slug',slug);
  const immutable=await student.api('/api/certificates/'+slug);verify(immutable.data.includes('أحمد محمد علي')&&!immutable.data.includes('Changed Name')&&immutable.data.includes('دورة اختبار الشهادات'),'Later name/course changes cannot rewrite issued document');
  const moderation={operation:'revoke',id:record.id,revision:1,reason:'Administrator review'};
  verify((await manager.api(endpoint,{...moderation,reason:''})).status===400,'Moderation requires a nonempty reason');
  verify((await manager.api(endpoint,moderation,{headers:{Origin:'https://evil.example'}})).status===403,'Cross-origin moderation denied');
  const changes=await Promise.all([manager.api(endpoint,moderation),manager.api(endpoint,moderation)]);verify(changes.map(result=>result.status).sort().join(',')==='200,409','Concurrent moderation has one winner');
  verify((await student.api('/api/certificates/'+slug)).status===403,'Revoked certificates cannot download');
  verify((await student.api('/api/certificates',issue)).status===403,'Reissue cannot bypass administrator revocation');
  verify(json(await manager.api(endpoint+'?q=%D8%A7%D8%AE%D8%AA%D8%A8%D8%A7%D8%B1&filter=revoked')).certificates.some(row=>row.id===record.id),'Revoked status is searchable by saved learner');
  const revoked=await manager.api(endpoint+'/'+record.id);verify(revoked.status===200&&revoked.data.includes('شهادة ملغاة'),'Administrator preview visibly marks revoked certificate');
  verify((await other.api(endpoint+'/'+record.id)).status===403,'Student cannot access admin document');
  verify((await manager.api(endpoint,{operation:'restore',id:record.id,revision:1,reason:'Reviewed'})).status===409,'Stale restore rejected');
  verify((await manager.api(endpoint,{operation:'restore',id:record.id,revision:2,reason:'Reviewed'})).status===200,'Admin restores with current revision');
  verify((await student.api('/api/certificates/'+slug)).status===200,'Restored document downloads with original serial');
  assert.ok(!(await admin.from('enrollments').update({active:false}).eq('user_id',student.id).eq('course_slug',slug)).error);
  verify((await student.api('/api/certificates/'+slug)).status===403,'Enrollment revocation blocks document access');
  await admin.from('enrollments').update({active:true}).eq('user_id',student.id).eq('course_slug',slug);
  await admin.from('courses').update({published:false}).eq('slug',slug);
  verify((await student.api('/api/certificates/'+slug)).status===403,'Unpublished course blocks document access');
  await admin.from('courses').update({published:true}).eq('slug',slug);
  const history=(await admin.from('certificate_events').select('*').eq('certificate_id',record.id)).data;
  verify(history.length===3&&history.every(row=>row.actor_id),'Issue/revoke/restore each have immutable actor/reason/time records');
  await require('./certificate-pagination.cjs')({admin,student,manager,base,sourceLesson,extras,verify});
  await require('./certificates-browser.cjs')({manager,student,record,url,verify});
 } finally {
  if(extras.length) {await admin.from('certificates').delete().in('course_slug',extras);await admin.from('courses').delete().in('slug',extras);}
  await admin.from('certificates').delete().eq('course_slug',slug);
  await admin.from('courses').delete().eq('slug',slug);
 }
};

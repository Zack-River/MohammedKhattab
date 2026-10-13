/* eslint-disable @typescript-eslint/no-require-imports -- Real issuance into disposable local course fixtures. */
const assert=require('node:assert/strict');
module.exports=async({admin,student,manager,base,sourceLesson,extras,verify})=>{
 for(let index=0;index<6;index++) {
  const slug='backend-certificate-pagination-'+index;extras.push(slug);
  assert.ok(!(await admin.from('courses').insert({...base,slug,metadata:{...base.metadata,slug,title:'Pagination course '+index,modules:[{id:'chapter',title:'Chapter',lessons:[{...base.metadata.modules[0].lessons[0],id:sourceLesson.id}]}]}})).error);
  assert.ok(!(await admin.from('lessons').insert({...sourceLesson,course_slug:slug})).error);
  assert.ok(!(await admin.from('enrollments').insert({user_id:student.id,course_slug:slug})).error);
  assert.ok(!(await admin.from('lesson_progress').insert({user_id:student.id,course_slug:slug,lesson_id:sourceLesson.id,completed:true})).error);
  verify((await student.api('/api/certificates',{operation:'issue',slug})).status===200,'Pagination fixture issued from actual completion '+index);
 }
 const query='?q=Pagination&filter=issued',endpoint='/api/admin/certificates';
 const first=JSON.parse((await manager.api(endpoint+query)).data),second=JSON.parse((await manager.api(endpoint+query+'&page=2')).data);
 verify(first.total===6&&first.certificates.length===5&&second.certificates.length===1,'Admin certificates use five-record pagination');
 verify(!first.certificates.some(row=>second.certificates.some(other=>other.id===row.id)),'Stable certificate pagination has no duplicate rows');
 const own=JSON.parse((await student.api('/api/certificates'+query)).data);verify(own.total===6&&own.certificates.length===5,'Student certificate pagination matches admin');
 const record=first.certificates[0];await manager.api(endpoint,{operation:'revoke',id:record.id,revision:record.revision,reason:'Filter fixture'});
 const filtered=JSON.parse((await manager.api(endpoint+'?q=Pagination&filter=revoked')).data);
 verify(filtered.total===1&&filtered.certificates[0].id===record.id,'Combined certificate status/search excludes all unrelated courses');
};

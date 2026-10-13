/* eslint-disable @typescript-eslint/no-require-imports -- Isolated local integration coverage. */
const assert=require('node:assert/strict');
const json=r=>JSON.parse(r.data);
module.exports=async({admin,provision,anonymous,verify,url})=>{
 const manager=await provision('Materials Manager'),student=await provision('Notes Student'),outsider=await provision('Unenrolled Student');
 assert.ok(!(await admin.from('admin_users').insert({user_id:manager.id})).error);
 const slug='backend-material-course',secondSlug=slug+'-two',endpoint='/api/admin/resources',created=[];
 const source=(await admin.from('courses').select('*').eq('slug','editing-foundations').single()).data;assert.ok(source);
 const lessonId=source.metadata.modules[0].lessons[0].id;
 const lesson=(await admin.from('lessons').select('*').eq('course_slug',source.slug).eq('id',lessonId).single()).data;assert.ok(lesson);
 for(const target of [slug,secondSlug]){
  assert.ok(!(await admin.from('courses').insert({...source,slug:target,metadata:{...source.metadata,slug:target,title:'Material course '+target}})).error);
  assert.ok(!(await admin.from('lessons').insert({...lesson,course_slug:target})).error);
 }
 try{
  await admin.from('enrollments').insert({user_id:student.id,course_slug:slug});
  for(const path of [endpoint,'/api/admin/activity']){
   verify((await anonymous(path)).status===401,'Guest denied '+path);
   verify((await student.api(path)).status===403,'Student denied '+path);
  }
  const input={revision:0,title:'Private exercise',description:'Lesson practice',type:'TXT',kind:'text',content:'private-material-body',assignments:[{courseSlug:slug,lessonId},{courseSlug:secondSlug,lessonId}]};
  verify((await manager.api(endpoint,input,{headers:{Origin:'https://evil.example'}})).status===403,'Cross-origin material mutation rejected');
  for(const patch of [{kind:'link',content:'javascript:alert(1)'},{kind:'link',content:'https://user:pass@example.com'},{assignments:[]},{assignments:[input.assignments[0],input.assignments[0]]},{content:'x'.repeat(2001)},{assignments:[{courseSlug:slug,lessonId:'missing'}]}]) verify((await manager.api(endpoint,{...input,...patch})).status===400,'Invalid material rejected');
  const create=await manager.api(endpoint,input);assert.equal(create.status,200,create.data);
  let material=json(await manager.api(endpoint+'?q=Private%20exercise')).materials[0];assert.ok(material);created.push(material.id);
  verify(material.assignments.length===2,'Material retains multi-course attachments');
  verify(Boolean((await outsider.direct.rpc('save_admin_material',{p_input:input})).error),'Student cannot author through direct RPC');
  const privateUrl='/api/resources/'+material.id;
  verify((await anonymous(privateUrl)).status===401,'Material download requires login');
  verify((await outsider.api(privateUrl)).status===404,'Material hidden from unenrolled student');
  const download=await student.api(privateUrl);verify(download.status===200&&download.data===input.content&&download.headers.get('content-disposition').includes('.txt'),'Owner downloads stored text');
  verify((await outsider.direct.from('resources').select('*').eq('id',material.id)).data.length===0,'Material body denied through direct JWT');
  const edit={...input,id:material.id,revision:material.revision,title:'Updated exercise'};
  const races=await Promise.all([manager.api(endpoint,edit),manager.api(endpoint,edit)]);
  verify(races.map(r=>r.status).sort().join(',')==='200,409','Concurrent material edits have one winner');
  material=json(await manager.api(endpoint+'?q=Updated%20exercise')).materials[0];
  const invalid=await manager.api(endpoint,{...edit,revision:material.revision,assignments:[{courseSlug:slug,lessonId:'missing'}]});
  verify(invalid.status===400&&(await admin.from('lesson_resources').select('*').eq('resource_id',material.id)).data.length===2,'Invalid attachment change rolls back without losing links');
  verify((await manager.api(endpoint,{...edit,revision:material.revision,kind:'link',content:'https://drive.google.com/file/d/example/view'})).status===200,'Admin switches material to HTTPS link');
  const redirect=await student.api(privateUrl);verify(redirect.status===302&&redirect.headers.get('location').includes('drive.google.com')&&redirect.headers.get('referrer-policy')==='no-referrer','Protected link redirects after access check');
  const publicCourse=await anonymous('/api/courses/'+slug);verify(!publicCourse.data.includes('drive.google.com/file/d/example')&&!publicCourse.data.includes('private-material-body'),'Public course payload excludes material content and links');
  const notePath=`/api/courses/${slug}/lessons/${lessonId}/notes`;
  verify((await anonymous(notePath)).status===401,'Notes require login');
  verify((await outsider.api(notePath)).status===403,'Notes require enrollment');
  const empty=await student.api(notePath);assert.equal(empty.status,200,empty.data);verify(json(empty).text===''&&json(empty).revision===0,'First note starts at revision zero');
  const firstSaves=await Promise.all([student.api(notePath,{text:'Private cloud note',revision:0}),student.api(notePath,{text:'Competing note',revision:0})]);
  verify(firstSaves.map(r=>r.status).sort().join(',')==='200,409','Concurrent first note saves cannot overwrite each other');
  let note=json(await student.api(notePath));
  verify((await student.api(notePath,{text:'Saved across devices',revision:note.revision})).status===200,'Owner updates note with current revision');
  verify((await student.api(notePath,{text:'Lost update',revision:note.revision})).status===409,'Stale note edit rejected');
  verify((await student.api(notePath,{text:'x'.repeat(4001),revision:2})).status===400,'Note length bounded');
  verify((await student.api(notePath,{text:'x',revision:2},{headers:{Origin:'https://evil.example'}})).status===403,'Cross-origin note save rejected');
  await admin.from('enrollments').insert({user_id:outsider.id,course_slug:slug});
  verify(json(await outsider.api(notePath)).revision===0&&(await outsider.direct.from('lesson_notes').select('*').eq('user_id',student.id)).data.length===0,'Other enrolled student cannot read owner notes');
  await admin.from('enrollments').delete().eq('user_id',outsider.id).eq('course_slug',slug);
  verify((await manager.direct.from('lesson_notes').select('*').eq('user_id',student.id)).data.length===0,'Admin normal session cannot read a student private note');
  verify(Boolean((await student.direct.from('lesson_notes').update({text:'Forged'}).eq('user_id',student.id)).error),'Direct note writes cannot bypass revision guard');
  verify(Boolean((await outsider.direct.rpc('save_lesson_note',{p_slug:slug,p_lesson:lessonId,p_text:'Forged',p_revision:0})).error),'Unenrolled JWT cannot call note-saving RPC');
  await admin.auth.admin.updateUserById(student.id,{ban_duration:'24h'});
  verify((await student.api(notePath)).status===401&&(await student.direct.from('lesson_notes').select('*')).data.length===0,'Suspension blocks notes with existing cookies and JWT');
  await admin.auth.admin.updateUserById(student.id,{ban_duration:'none'});
  await admin.from('courses').update({published:false}).eq('slug',slug);
  verify((await student.api(notePath)).status===403&&(await student.api(privateUrl)).status===404,'Unpublished course denies notes and materials');
  await admin.from('courses').update({published:true}).eq('slug',slug);
  await admin.from('enrollments').delete().eq('user_id',student.id).eq('course_slug',slug);
  verify((await student.api(notePath)).status===403&&(await student.direct.from('lesson_notes').select('*')).data.length===0,'Enrollment revocation hides retained note');
  await admin.from('enrollments').insert({user_id:student.id,course_slug:slug});
  verify(json(await student.api(notePath)).text==='Saved across devices','Retained note returns after restored access');
  const history=json(await manager.api('/api/admin/activity?q='+material.id+'&filter=resources'));
  verify(history.records.some(row=>row.actor_id===manager.id&&row.action==='UPDATE'),'Content history attributes signed-in admin edit');
  verify(history.records.every(row=>!('content' in row)&&!('before' in row)&&!JSON.stringify(row).includes('private-material-body')),'History stores field names without sensitive payloads');
  verify((await student.direct.from('admin_activity').select('*')).data.length===0,'Student JWT cannot read admin history');
  verify((await student.direct.from('admin_activity').delete().eq('entity','resources')).error!==null,'Student cannot delete history');
  verify((await manager.direct.from('admin_activity').delete().eq('entity','resources')).error!==null,'Administrator JWT cannot delete history');
  verify(Boolean((await manager.direct.from('admin_activity').insert({actor_id:manager.id,entity:'courses',target:'fake',action:'INSERT'})).error),'Admin cannot forge history rows');
  const attachments=json(await manager.api('/api/admin/activity?q='+material.id+'&filter=lesson_resources'));
  verify(attachments.total>0,'Attachment changes have durable history');
  for(let index=0;index<6;index++){
   assert.equal((await manager.api(endpoint,{...input,title:'Paging material '+index,assignments:[input.assignments[0]]})).status,200);
  }
  const first=json(await manager.api(endpoint+'?q=Paging&filter=text')),second=json(await manager.api(endpoint+'?q=Paging&filter=text&page=2'));
  created.push(...first.materials.map(row=>row.id),...second.materials.map(row=>row.id));
  verify(first.materials.length===5&&second.materials.length===1,'Search and type filters combine with five-record pagination');
  await require('./lms-gaps-browser.cjs')({manager,student,verify,url,slug,lessonId,materialId:material.id});
  material=json(await manager.api(endpoint+'?q=Updated%20exercise')).materials[0];
  verify((await manager.api(endpoint,{operation:'delete',id:material.id,revision:material.revision-1})).status===409,'Stale material deletion rejected');
  verify((await manager.api(endpoint,{operation:'delete',id:material.id,revision:material.revision})).status===200,'Current material deleted');
  verify((await admin.from('lesson_resources').select('*').eq('resource_id',material.id)).data.length===0,'Material deletion removes attachment rows');
 }finally{
  await admin.from('resources').delete().in('id',created);await admin.from('courses').delete().in('slug',[slug,secondSlug]);
 }
};

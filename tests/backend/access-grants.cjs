/* eslint-disable @typescript-eslint/no-require-imports -- Isolated duration, bundle and access-boundary tests. */
const assert=require('node:assert/strict');
module.exports=async({admin,provision,anonymous,verify,url})=>{
 const manager=await provision('Access Manager'),student=await provision('Access Learner'),outsider=await provision('Access Outsider');
 assert.ok(!(await admin.from('admin_users').insert({user_id:manager.id})).error);
 const key='access-'+require('node:crypto').randomUUID().slice(0,8),slugs=[key+'-one',key+'-two',key+'-three'],bundle=key+'-bundle',endpoint=`/api/admin/users/${student.id}/enrollments`;
 const source=(await admin.from('courses').select('*').eq('slug','editing-foundations').single()).data,lessonId=source.metadata.modules[0].lessons[0].id;
 const lesson=(await admin.from('lessons').select('*').eq('course_slug',source.slug).eq('id',lessonId).single()).data;
 const until=new Date(Date.now()+86400000).toISOString(),body={action:'grant',kind:'course',slug:slugs[0],expiresAt:until,reason:'Local access-duration check',revisions:{[slugs[0]]:0}};
 let material,session,expiredBuyer;
 const grant=(patch={})=>manager.api(endpoint,{...body,...patch});
 try {
  for(const slug of slugs){assert.ok(!(await admin.from('courses').insert({...source,slug,amount:1200,published:true,metadata:{...source.metadata,slug,title:slug}})).error);assert.ok(!(await admin.from('lessons').insert({...lesson,course_slug:slug,preview:false})).error);}
  assert.ok(!(await admin.from('commerce_bundles').insert({slug:bundle,title:'Access test bundle',description:'',amount_minor:200000,enabled:true})).error);
  assert.ok(!(await admin.from('commerce_bundle_courses').insert(slugs.map((course_slug,position)=>({bundle_slug:bundle,course_slug,position})))).error);
  verify((await anonymous(endpoint,body)).status===401,'Guests cannot grant timed access');verify((await student.api(endpoint,body)).status===403,'Students cannot grant access');
  verify((await manager.api(endpoint,body,{headers:{Origin:'https://evil.example'}})).status===403,'Free grant rejects cross-origin requests');
  for(const patch of [{expiresAt:'yesterday'},{expiresAt:new Date(Date.now()-1000).toISOString()},{expiresAt:'infinity'},{expiresAt:null,revisions:{}},{kind:'other'},{revisions:{[slugs[0]]:-1}},{reason:''}]) verify((await grant(patch)).status===400,'Invalid access grant is rejected');
  verify(Boolean((await outsider.direct.rpc('grant_enrollment_access',{p_user:student.id,p_kind:'course',p_slug:slugs[0],p_until:until,p_reason:'Forged',p_revisions:{[slugs[0]]:0}})).error),'Direct student RPC cannot grant another user');
  await admin.from('account_contacts').update({phone_verified_at:null}).eq('user_id',student.id);verify((await grant()).status===403,'Free grant preserves verification gate');await admin.from('account_contacts').update({phone_verified_at:new Date().toISOString()}).eq('user_id',student.id);
  const concurrent=await Promise.all([grant(),grant()]);verify(concurrent.map(r=>r.status).sort().join(',')==='200,409','Concurrent timed grants have one winner');
  const rows=()=>admin.from('enrollments').select('*').eq('user_id',student.id).order('course_slug');
  let records=(await rows()).data;verify(Date.parse(records[0].access_expires_at)===Date.parse(until)&&records[0].access_origin==='admin','Duration stored independently of payment');
  verify((await student.direct.from('lessons').select('id').eq('course_slug',slugs[0])).data.length===1,'Temporary access permits protected lessons');
  verify(!(await student.direct.from('lesson_progress').insert({user_id:student.id,course_slug:slugs[0],lesson_id:lessonId,completed:true})).error,'Temporary access permits progress');
  const note=`/api/courses/${slugs[0]}/lessons/${lessonId}/notes`;verify((await student.api(note,{text:'Retained after expiry',revision:0})).status===200,'Temporary access permits notes');
  material=(await admin.from('resources').insert({id:key+'-material',title:'Timed resource',description:'',type:'TXT',kind:'text',content:'fixture'}).select('id').single()).data.id;
  assert.ok(!(await admin.from('lesson_resources').insert({resource_id:material,course_slug:slugs[0],lesson_id:lessonId})).error);
  session=(await admin.from('live_sessions').insert({course_slug:slugs[0],title:'Timed live',starts_at:new Date(Date.now()-60000).toISOString(),ends_at:new Date(Date.now()+3600000).toISOString()}).select('id').single()).data.id;assert.ok(!(await admin.from('live_session_links').insert({session_id:session,join_url:'https://meet.google.com/aaa-bbbb-ccc'})).error);
  verify((await student.api('/api/certificates',{operation:'issue',slug:slugs[0]})).status===200,'Completed temporary enrollment can issue certificate');
  const baseline=JSON.parse((await manager.api('/api/admin/analytics')).data).metrics.totalEnrollments;
  await admin.from('enrollments').update({access_expires_at:new Date(Date.now()-1000).toISOString()}).eq('user_id',student.id).eq('course_slug',slugs[0]);
  for(const [table,column,value] of [['lessons','course_slug',slugs[0]],['lesson_progress','course_slug',slugs[0]],['lesson_notes','course_slug',slugs[0]],['lesson_resources','course_slug',slugs[0]],['resources','id',material],['live_session_links','session_id',session]]){const r=await student.direct.from(table).select('*').eq(column,value);verify(!r.error&&r.data.length===0,'Expired JWT denied '+table);}
  const state=JSON.parse((await student.api('/api/enrollments')).data);verify(!state.enrolled.includes(slugs[0]),'Learner state excludes expired access');
  verify((await student.api(note)).status===403,'Expired note API denies access');verify((await student.api('/api/resources/'+material)).status===404,'Expired resource download is denied');verify((await student.api('/api/certificates/'+slugs[0])).status===403,'Expired certificate download is denied');
  verify((await student.api('/api/progress',{courseSlug:slugs[0],lessonId,completed:false})).status===403,'Expired progress write is denied');
  verify((await student.api('/api/enrollments',{courseSlug:slugs[0]})).status===403,'Paid course cannot self-renew expired free access');
  verify(JSON.parse((await manager.api('/api/admin/analytics')).data).metrics.totalEnrollments===baseline-1,'Analytics excludes expired subscriptions');
  verify(Boolean((await student.direct.from('enrollments').update({access_expires_at:null}).eq('course_slug',slugs[0])).error),'Student cannot extend grant through direct writes');
  assert.ok(!(await admin.from('enrollments').insert({user_id:student.id,course_slug:slugs[1]})).error);
  const full={kind:'bundle',slug:bundle,expiresAt:null,revisions:{[slugs[0]]:1,[slugs[1]]:1,[slugs[2]]:0}};
  verify((await grant(full)).status===200,'Bundle grants lifetime access atomically');records=(await rows()).data;verify(records.length===3&&records.every(r=>r.access_expires_at===null)&&records.find(r=>r.course_slug===slugs[1]).access_origin==='standard','Bundle preserves existing standard lifetime access');
  verify((await student.api(note)).status===200&&JSON.parse((await student.api(note)).data).text==='Retained after expiry','Renewal recovers private notes');
  verify((await admin.from('lesson_progress').select('lesson_id').eq('user_id',student.id)).data.length===1,'Expiry preserves original progress');
  verify((await admin.from('payment_orders').select('id').eq('user_id',student.id)).data.length===0,'Administrator grants create no invoice or payment');
  const events=(await admin.from('enrollment_events').select('*').eq('user_id',student.id)).data;verify(events.some(e=>e.bundle_slug===bundle&&e.access_expires_at===null)&&events.some(e=>Date.parse(e.access_expires_at)===Date.parse(until)),'Audit captures bundle, duration and administrator reason');
  // A shorter grant must never replace lifetime or paid access.
  verify((await grant({expiresAt:until,revisions:{[slugs[0]]:2}})).status===200&&(await rows()).data.every(r=>r.access_expires_at===null),'Shorter gifts cannot shorten existing lifetime access');
  assert.equal((await manager.api(endpoint,{courseSlug:slugs[1],action:'revoke',revision:1,reason:'Explicit revocation'})).status,200);
  const outsiderEndpoint=`/api/admin/users/${outsider.id}/enrollments`;assert.equal((await manager.api(outsiderEndpoint,{...body,slug:slugs[1],revisions:{[slugs[1]]:0}})).status,200);
  const atomic=await grant({...full,revisions:{[slugs[0]]:2,[slugs[1]]:2,[slugs[2]]:1}});verify(atomic.status===409,'Bundle grant does not bypass an explicitly revoked member');
  verify((await outsider.direct.from('enrollment_access').select('*').eq('user_id',student.id)).data.length===0,'Access view retains ownership RLS');
  const expired=await provision('Expired Access Buyer');expiredBuyer=expired.id;const expiredEndpoint=`/api/admin/users/${expired.id}/enrollments`;
  assert.equal((await manager.api(expiredEndpoint,body)).status,200);await admin.from('enrollments').update({access_expires_at:new Date(Date.now()-1000).toISOString()}).eq('user_id',expired.id);
  const checkout=await expired.api('/api/payments/checkout',{courseSlug:slugs[0]});verify(checkout.status===200,'Expired free access can proceed to test checkout');
  const order=(await admin.from('payment_orders').select('*').eq('user_id',expired.id).single()).data;
  const transaction=require('node:crypto').randomInt(1000000,2000000000);const settled=await admin.rpc('settle_course_payment',{p_order:order.id,p_intent:order.provider_intent_key,p_transaction:transaction,p_amount:order.amount_minor,p_currency:order.currency});assert.ok(!settled.error,JSON.stringify(settled.error));
  const paid=(await admin.from('enrollments').select('*').eq('user_id',expired.id).single()).data;verify(paid.access_origin==='standard'&&paid.access_expires_at===null&&paid.active,'Test settlement upgrades expired gift to lifetime paid access');
  const replay=await admin.rpc('settle_course_payment',{p_order:order.id,p_intent:order.provider_intent_key,p_transaction:transaction,p_amount:order.amount_minor,p_currency:order.currency});verify(!replay.error&&(await admin.from('enrollments').select('revision').eq('user_id',expired.id).single()).data.revision===paid.revision,'Payment replay does not rewrite access again');
  assert.equal((await manager.api(expiredEndpoint,{courseSlug:slugs[0],action:'revoke',revision:paid.revision,reason:'Payment replay revocation check'})).status,200);
  assert.ok(!(await admin.rpc('settle_course_payment',{p_order:order.id,p_intent:order.provider_intent_key,p_transaction:transaction,p_amount:order.amount_minor,p_currency:order.currency})).error);verify(!(await admin.from('enrollments').select('active').eq('user_id',expired.id).single()).data.active,'Payment replay cannot bypass revoked access');
  await require('./access-catalog.cjs')({admin,manager,provision,verify,source});
  await require('./access-grants-browser.cjs')({admin,manager,student,outsider,slugs,bundle,endpoint,verify,url});
 } finally {if(expiredBuyer)await admin.from('payment_orders').delete().eq('user_id',expiredBuyer);await admin.from('certificates').delete().eq('user_id',student.id);if(material)await admin.from('resources').delete().eq('id',material);await admin.from('commerce_bundles').delete().eq('slug',bundle);await admin.from('courses').delete().in('slug',slugs);}
};

/* eslint-disable @typescript-eslint/no-require-imports -- Local catalog access fixtures only. */
const assert=require('node:assert/strict');
module.exports=async({admin,manager,provision,verify,source})=>{
 const learner=await provision('Catalog Access Learner'),prefix='catalog-'+require('node:crypto').randomUUID().slice(0,8),slugs=Array.from({length:24},(_,i)=>prefix+'-'+i),draft=prefix+'-draft',future=prefix+'-future';
 const endpoint=`/api/admin/users/${learner.id}/enrollments`,until=new Date(Date.now()+86400000).toISOString();
 const body={action:'grant',kind:'all',slug:'all',expiresAt:until,reason:'Current catalog access test',revisions:{}};
 const rows=async()=>(await admin.from('enrollments').select('*').eq('user_id',learner.id)).data;
 try{
  assert.ok(!(await admin.from('courses').insert([...slugs,draft].map(slug=>({...source,slug,published:slug!==draft,metadata:{...source.metadata,slug,title:slug}})))).error);
  const published=(await admin.from('courses').select('slug').eq('published',true)).data;
  const result=await manager.api(endpoint,body);verify(result.status===200,'All-catalog option supports more than twenty courses');
  let entries=await rows();verify(entries.length===published.length&&entries.every(e=>Date.parse(e.access_expires_at)===Date.parse(until)),'Catalog grants every current published course with the selected duration');
  verify(!entries.some(e=>e.course_slug===draft),'Catalog excludes unpublished drafts');
  verify((await admin.from('payment_orders').select('id').eq('user_id',learner.id)).data.length===0,'Catalog grants create no payment order');
  verify((await manager.api(endpoint,{...body,expiresAt:null})).status===409,'Stale catalog snapshots cannot overwrite existing access');
  verify((await rows()).every(e=>Date.parse(e.access_expires_at)===Date.parse(until)),'Catalog conflict rolls back every change');
  assert.ok(!(await admin.from('courses').insert({...source,slug:future,published:true,metadata:{...source.metadata,slug:future}})).error);
  verify(!(await rows()).some(e=>e.course_slug===future),'Later publications are not silently included in an earlier grant');
  await admin.from('enrollments').update({active:false}).eq('user_id',learner.id).eq('course_slug',slugs[23]);
  let revisions=Object.fromEntries(entries.map(e=>[e.course_slug,e.revision]));
  verify((await manager.api(endpoint,{...body,expiresAt:null,revisions})).status===409,'Catalog grants respect explicitly revoked access');
  entries=await rows();verify(entries.every(e=>Date.parse(e.access_expires_at)===Date.parse(until))&&!entries.some(e=>e.course_slug===future),'Revoked catalog member atomically rolls back inserts and renewals');
  await admin.from('enrollments').update({active:true,access_expires_at:null,access_origin:'standard'}).eq('user_id',learner.id).eq('course_slug',slugs[23]);
  verify((await manager.api(endpoint,{...body,expiresAt:null,revisions})).status===200,'Catalog can be renewed to lifetime with fresh revisions');
  entries=await rows();verify(entries.length===published.length+1&&entries.every(e=>e.access_expires_at===null),'Lifetime catalog grant covers current catalog and preserves existing lifetime access');
  verify(entries.find(e=>e.course_slug===slugs[23]).access_origin==='standard','Catalog grant preserves paid/standard access origin');
  revisions=Object.fromEntries(entries.map(e=>[e.course_slug,e.revision]));
  verify((await manager.api(endpoint,{...body,revisions})).status===200&&(await rows()).every(e=>e.access_expires_at===null),'Timed catalog grants never shorten lifetime subscriptions');
 }finally{await admin.from('courses').delete().in('slug',[...slugs,draft,future]);}
};

/* eslint-disable @typescript-eslint/no-require-imports -- No production provider traffic or charges. */
const assert=require('node:assert/strict'),{randomUUID}=require('node:crypto');
module.exports=async({admin,provision,verify})=>{
 const manager=await provision('Readiness Manager'),student=await provision('Readiness Student');
 await admin.from('admin_users').insert({user_id:manager.id});
 const slug='readiness-'+randomUUID(),emptySlug=slug+'-empty';
 try {
  const course=await student.api('/api/payments/checkout',{courseSlug:'editing-foundations'});
  verify(course.status===409&&JSON.parse(course.data).code==='COURSE_CONTENT_NOT_READY','Live checkout rejects original sample lessons before creating an order');
  const bundle={key:slug,title:'Readiness bundle',description:'Local acceptance bundle',amountMinor:10000,courseSlugs:['editing-foundations','motion-essentials'],courseSlug:null,bundleSlug:null,discountType:'percent',discountValue:10,startsAt:null,endsAt:null,enabled:true,stackable:false,minimumMinor:0,maximumUses:null,perUserLimit:1,revision:0};
  assert.equal((await manager.api('/api/admin/commerce/bundles',bundle)).status,200);
  const result=await student.api('/api/payments/checkout',{bundleSlug:slug});
  verify(result.status===409&&JSON.parse(result.data).code==='COURSE_CONTENT_NOT_READY','Bundle live checkout checks every included course');
  const source=(await admin.from('courses').select('metadata').eq('slug','editing-foundations').single()).data.metadata;
  assert.ok(!(await admin.from('courses').insert({slug:emptySlug,metadata:{...source,slug:emptySlug},amount:499,published:true})).error);
  assert.ok(!(await admin.from('lessons').insert({course_slug:emptySlug,id:'editor-mindset',video_url:'',preview:false})).error);
  const incomplete=await student.api('/api/payments/checkout',{courseSlug:emptySlug});
  verify(incomplete.status===409&&JSON.parse(incomplete.data).code==='COURSE_CONTENT_NOT_READY','Recorded lessons without video links cannot start live paid checkout');
  const orders=await admin.from('payment_orders').select('id',{count:'exact'}).eq('user_id',student.id);assert.ok(!orders.error);
  verify(orders.count===0,'Rejected readiness creates no pending orders, provider intents or charges');
  verify((await student.api('/learn/editing-foundations/editor-mindset')).status===200,'Readiness guard preserves free preview');
 } finally {await admin.from('commerce_bundles').delete().eq('slug',slug);await admin.from('courses').delete().eq('slug',emptySlug);}
};

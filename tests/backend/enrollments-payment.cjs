/* eslint-disable @typescript-eslint/no-require-imports -- Local payment settlement without external provider calls. */
const assert=require('node:assert/strict');
module.exports=async({admin,student,manager,endpoint,input,slug,verify})=>{
 const order=await admin.from('payment_orders').insert({user_id:student.id,course_slug:slug,course_title:'Enrollment receipt',amount_minor:120000,live:false,status:'pending',provider_intent_key:require('node:crypto').randomUUID()}).select('*').single();assert.ok(!order.error);
 await admin.from('payment_order_items').insert({order_id:order.data.id,course_slug:slug});
 verify((await manager.api(endpoint,{...input,action:'revoke',revision:3,reason:'Revoke before delayed settlement'})).status===200,'Revoke before payment callback');
 const checkout={p_user:student.id,p_kind:'course',p_slug:slug,p_coupon:null,p_live:false};
 verify((await admin.rpc('begin_commerce_payment',checkout)).error?.message.includes('ENROLLMENT_REVOKED'),'Revoked pending order cannot reopen checkout');
 const params={p_order:order.data.id,p_intent:order.data.provider_intent_key,p_transaction:8765432,p_amount:120000,p_currency:'EGP'};
 for(let i=0;i<2;i++) {const r=await admin.rpc('settle_course_payment',params);assert.ok(!r.error,r.error?.message);}
 const row=(await admin.from('enrollments').select('active,revision').eq('user_id',student.id).eq('course_slug',slug).single()).data;
 verify((await admin.rpc('begin_commerce_payment',checkout)).error?.message.includes('ENROLLMENT_REVOKED'),'Revoked paid course cannot create a replacement charge');
 verify(!row.active&&row.revision===4,'Delayed and duplicate settlements cannot restore revoked access');
 const receipt=await student.api('/api/payments/'+order.data.id);assert.equal(receipt.status,200,receipt.data);
 const body=JSON.parse(receipt.data);verify(body.status==='paid'&&!body.enrolled&&body.accessRevoked,'Receipt distinguishes paid from revoked course access');
 const page=await student.api('/payments/'+order.data.id);verify(page.status===200&&page.data.includes('لا تدفع مرة أخرى'),'Receipt renders without requesting another payment');
};

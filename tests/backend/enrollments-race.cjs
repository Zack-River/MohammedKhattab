/* eslint-disable @typescript-eslint/no-require-imports -- Isolated local lock-order verification. */
const {Client}=require('pg');
const assert=require('node:assert/strict');
module.exports=async({admin,manager,outsider,slug,lessonId,config,verify})=>{
 const endpoint=`/api/admin/users/${outsider.id}/enrollments`;
 assert.equal((await manager.api(endpoint,{courseSlug:slug,action:'grant',revision:0,reason:'Local concurrency fixture'})).status,200);
 const db=new Client({connectionString:config.DB_URL});await db.connect();
 try {
  const token=(await outsider.direct.auth.getSession()).data.session.access_token;
  const claims=JSON.parse(Buffer.from(token.split('.')[1],'base64url').toString());
  await db.query('begin');await db.query("select set_config('request.jwt.claims',$1,true)",[JSON.stringify(claims)]);await db.query('set local role authenticated');
  await db.query('select public.save_lesson_note($1,$2,$3,0)',[slug,lessonId,'Committed before revocation']);
  await db.query('insert into public.lesson_progress(user_id,course_slug,lesson_id,completed) values($1,$2,$3,true)',[outsider.id,slug,lessonId]);
  const pending=manager.api(endpoint,{courseSlug:slug,action:'revoke',revision:1,reason:'Concurrent revocation'});
  let blocked=false;
  for(let attempt=0;attempt<60;attempt++) {
   const result=await db.query('select exists(select 1 from pg_stat_activity where pg_backend_pid()=any(pg_blocking_pids(pid))) waiting');
   if(result.rows[0].waiting){blocked=true;break;}
   await new Promise(resolve=>setTimeout(resolve,50));
  }
  verify(blocked,'Revocation waits for in-flight note and progress transaction');
  await db.query('commit');verify((await pending).status===200,'Revocation completes after learning write commits');
  const row=(await admin.from('enrollments').select('active').eq('user_id',outsider.id).eq('course_slug',slug).single()).data;
  const note=(await admin.from('lesson_notes').select('text').eq('user_id',outsider.id).eq('course_slug',slug).single()).data;
  const progress=(await admin.from('lesson_progress').select('completed').eq('user_id',outsider.id).eq('course_slug',slug).single()).data;
  verify(!row.active&&note.text==='Committed before revocation'&&progress.completed,'Serialized revocation preserves the completed learning write');
 }finally{await db.query('rollback').catch(()=>{});await db.end();}
};

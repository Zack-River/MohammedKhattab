/* eslint-disable @typescript-eslint/no-require-imports -- Isolated course-management integration checks. */
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
module.exports = async ({ admin, provision, anonymous, verify, url }) => {
 const manager = await provision('Catalog Manager'), student = await provision('Catalog Student');
 assert.ok(!(await admin.from('admin_users').insert({user_id:manager.id})).error);
 const prefix = 'catalog-' + randomUUID().slice(0,8), slugs = [];
 const body = index => ({slug:`${prefix}-${index}`,title:`${prefix} دورة ${index}`,description:'وصف دورة تجريبية للاختبار',amount:100+index,category:'editing',delivery:'recorded'});
 const parse = response => JSON.parse(response.data);
 const list = query => manager.api('/api/admin/courses?' + new URLSearchParams(query));
 try {
  verify((await anonymous('/api/admin/courses')).status === 401,'Guest cannot read course management');
  verify((await student.api('/api/admin/courses')).status === 403,'Student cannot read course management');
  verify(Boolean((await student.direct.rpc('search_admin_courses')).error),'Direct student RPC cannot read course management');
  verify((await student.api('/api/admin/courses',body(0))).status === 403,'Student cannot create course');
  verify((await manager.api('/api/admin/courses',body(0),{headers:{Origin:'https://attacker.example'}})).status === 403,'Cross-origin course creation blocked');
  for (const value of [{slug:'Bad Slug'}, {slug:'new'}, {amount:-1}, {category:'all'}, {delivery:'unknown'}, {title:''}]) {
   // "new" is reserved by the create-page route.
   verify((await manager.api('/api/admin/courses',{...body(0),...value})).status === 400,`Invalid course creation blocked: ${Object.keys(value)[0]}=${Object.values(value)[0]}`);
  }
  for (let index=0;index<7;index++) {
   const response=await manager.api('/api/admin/courses',body(index));
   verify(response.status===201,`Course draft ${index} created`);slugs.push(body(index).slug);
  }
  verify((await manager.api('/api/admin/courses',body(0))).status===409,'Duplicate course slug rejected');
  let result=parse(await list({q:prefix}));
  verify(result.total===7 && result.courses.length===5 && result.hasNext,'Five courses per page with total and next page');
  verify(result.courses.every(course=>!course.published && course.lessons===0 && course.chapters===0 && course.sections===0 && course.students===0 && course.createdAt && course.updatedAt),'Empty drafts have real timestamps and zero separate counts');
  verify(parse(await list({q:prefix,page:'2'})).courses.length===2,'Second page returns remaining courses');
  verify(parse(await list({q:prefix,page:'3'})).courses.length===0,'Out-of-range page is empty');
  verify((await anonymous('/api/courses/'+slugs[0])).status===404,'Draft is hidden from public catalog');
  const draft=parse(await manager.api('/api/admin/courses/'+slugs[0])).course;
  const edit={title:draft.title,description:draft.description,amount:200,category:'editing',thumbnailUrl:'',introVideoUrl:'',published:false};
  verify((await manager.api('/api/admin/courses/'+slugs[0],edit)).status===200,'Empty draft can be edited');
  verify((await manager.api('/api/admin/courses/'+slugs[0],{...edit,published:true})).status===400,'Empty recorded draft cannot be published');
  const timestamps=(await admin.from('courses').select('created_at,updated_at').eq('slug',slugs[0]).single()).data;
  const seed=(await admin.from('courses').select('metadata').eq('slug','editing-foundations').single()).data.metadata;
  const metadata={...seed,slug:slugs[0],title:body(0).title,modules:seed.modules.map((chapter,index)=>({...chapter,sections:index===0?[{id:'first-section',title:'قسم تجريبي',lessonIds:[chapter.lessons[0].id]}]:[]}))};
  assert.ok(!(await admin.from('courses').update({metadata,published:true}).eq('slug',slugs[0])).error);
  const lesson=metadata.modules[0].lessons[0];
  assert.ok(!(await admin.from('lessons').insert({id:lesson.id,course_slug:slugs[0],video_url:'/assets/video/workshop-intro.mp4'})).error);
  result=parse(await list({q:slugs[0]})).courses[0];
  verify(result.lessons===1 && result.chapters===metadata.modules.length && result.sections===1,'Chapter, section and actual lesson counts are distinct');
  let stored=(await admin.from('courses').select('created_at,updated_at').eq('slug',slugs[0]).single()).data;
  verify(stored.created_at===timestamps.created_at && new Date(stored.updated_at)>new Date(timestamps.updated_at),'Curriculum changes update date without changing creation date');
  const previous=stored.updated_at;
  assert.ok(!(await admin.from('lessons').delete().eq('course_slug',slugs[0])).error);
  stored=(await admin.from('courses').select('updated_at').eq('slug',slugs[0]).single()).data;
  verify(new Date(stored.updated_at)>new Date(previous),'Lesson deletion updates course timestamp');
  assert.ok(!(await admin.from('lessons').insert({id:lesson.id,course_slug:slugs[0],video_url:'/assets/video/workshop-intro.mp4'})).error);
  assert.ok(!(await admin.from('enrollments').insert({user_id:student.id,course_slug:slugs[0]})).error);
  verify(parse(await list({q:prefix,sort:'students',direction:'desc'})).courses[0].students===1,'Sort by students places subscribed course first');
  verify(parse(await list({q:prefix,sort:'students',direction:'asc'})).courses[0].students===0,'Ascending student sort reverses order');
  verify(parse(await list({q:prefix,sort:'created',direction:'asc'})).courses[0].slug===slugs[0],'Creation sorting ascending');
  verify(parse(await list({q:prefix,sort:'created',direction:'desc'})).courses[0].slug===slugs[6],'Creation sorting descending');
  verify(parse(await list({q:prefix,sort:'updated',direction:'desc'})).courses[0].slug===slugs[0],'Updated sorting reflects latest real edit');
  verify(parse(await list({q:prefix,status:'published',category:'editing',delivery:'recorded'})).total===1,'Search, publication, category and delivery filters combine');
  verify(parse(await list({q:prefix,status:'draft'})).total===6,'Draft filter excludes published course');
  verify(parse(await manager.api('/api/admin/courses?q='+prefix+'&status=draft&status=published')).total===7,'Publication statuses combine without dropping either group');
  verify(parse(await list({q:'editing-foundations'})).courses[0].createdAt===null,'Unknown legacy creation dates remain unknown');
  verify(parse(await list({q:prefix,category:'motion'})).total===0,'Category filter combines with search');
  for (const q of ['%','_']) verify(parse(await list({q})).total===0,`Search treats ${q} literally`);
  for (const query of [{sort:'price'},{direction:'bad'},{status:'bad'},{page:'0'},{page:'-1'},{q:'x'.repeat(101)}]) verify((await list(query)).status===400,'Invalid course query rejected');
  verify(Boolean((await manager.direct.rpc('search_admin_courses',{p_limit:6})).error),'RPC caps page size at five');
  const remove=slug=>'/api/admin/courses/'+slug+'/delete';
  verify((await student.api(remove(slugs[1]),{confirmSlug:slugs[1]})).status===403,'Student cannot delete course');
  verify(Boolean((await student.direct.rpc('delete_admin_course',{p_slug:slugs[1]})).error),'Direct student deletion RPC denied');
  verify((await manager.api(remove(slugs[1]),{confirmSlug:slugs[1]},{headers:{Origin:'https://attacker.example'}})).status===403,'Cross-origin deletion blocked');
  verify((await manager.api(remove(slugs[1]),{confirmSlug:'wrong'})).status===400,'Delete confirmation must match course');
  verify((await manager.api(remove(slugs[0]),{confirmSlug:slugs[0]})).status===409,'Subscribed course deletion blocked');
  await require('./admin-course-management-browser.cjs')({manager,verify,url,prefix,slugs});
  verify((await manager.api(remove(slugs[2]),{confirmSlug:slugs[2]})).status===200,'Unsubscribed course can be deleted');
  verify((await manager.api(remove(slugs[2]),{confirmSlug:slugs[2]})).status===404,'Missing course deletion returns not found');
  const liveInput={...body(8),delivery:'live'};
  verify((await manager.api('/api/admin/courses',liveInput)).status===201,'Live draft creation succeeds without duration');slugs.push(liveInput.slug);
  const liveEndpoint='/api/admin/courses/'+liveInput.slug,liveEdit={...edit,title:liveInput.title,published:true};
  const missingDuration=await manager.api(liveEndpoint,liveEdit);
  verify(missingDuration.status===400 && parse(missingDuration).code==='COURSE_DURATION_REQUIRED','Live publication identifies missing duration explicitly');
  verify((await manager.api(liveEndpoint,{...liveEdit,published:false})).status===200,'Live course remains editable as a draft without duration');
  verify((await manager.api(liveEndpoint,{...liveEdit,duration:'x'.repeat(81)})).status===400,'Oversized course duration rejected');
  verify((await manager.api(liveEndpoint,{...liveEdit,duration:42})).status===400,'Non-text course duration rejected');
  verify((await manager.api(liveEndpoint,{...liveEdit,duration:' ٧ أيام '})).status===200,'Live course publishes after providing duration');
  verify(parse(await anonymous('/api/courses/'+liveInput.slug)).duration==='٧ أيام','Saved duration is normalized and public');
  verify((await manager.api(liveEndpoint,liveEdit)).status===200 && parse(await manager.api(liveEndpoint)).course.duration==='٧ أيام','Legacy edits without duration retain existing duration');
  assert.ok(!(await admin.from('admin_users').delete().eq('user_id',manager.id)).error);
  verify((await manager.api('/api/admin/courses')).status===403,'Revoked admin access is immediately denied');
  verify(Boolean((await manager.direct.rpc('search_admin_courses')).error),'RPC rechecks revoked membership');
 } finally { await admin.from('enrollments').delete().in('course_slug',slugs);await admin.from('courses').delete().in('slug',slugs); }
};

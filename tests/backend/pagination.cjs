/* eslint-disable @typescript-eslint/no-require-imports -- Isolated, protected list boundary checks. */
const assert=require('node:assert/strict'),{chromium,expect}=require('@playwright/test');
module.exports=async({admin,provision,verify,url})=>{
 const manager=await provision('Paging Manager'),student=await provision('Paging Student');
 assert.ok(!(await admin.from('admin_users').insert({user_id:manager.id})).error);
 const filters='?q=missing-pagination-result&filter=text&page=9999',adminPaths=[
  ['/api/admin/resources','materials',filters],['/api/admin/certificates','certificates',filters],['/api/admin/activity','records',filters],
  ['/api/admin/live-sessions','sessions','?q=missing-pagination-result&page=9999'],['/api/admin/sales','records','?q=missing-pagination-result&status=paid&page=9999'],
  ['/api/admin/commerce/bundles','records','?q=missing-pagination-result&page=9999'],['/api/admin/commerce/coupons','records','?q=missing-pagination-result&page=9999'],
 ];
 for(const [path,key,query] of adminPaths) {const result=await manager.api(path+query);assert.equal(result.status,200,path);const body=JSON.parse(result.data);verify(body.total===0&&body[key].length===0,'Empty out-of-range API remains usable: '+path);}
 const baseline=JSON.parse((await manager.api('/api/admin/resources')).data),beyond=await manager.api('/api/admin/resources?page=9999');assert.ok(baseline.total>0);const beyondBody=JSON.parse(beyond.data);
 verify(beyond.status===200&&beyondBody.total===baseline.total&&beyondBody.materials.length===0,'Out-of-range page preserves the actual nonzero filtered count');
 const own=await student.api('/api/certificates?q=missing-pagination-result&page=9999');verify(own.status===200&&JSON.parse(own.data).total===0,'Student certificate page fallback retains ownership');
 const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
 const login=async(account)=>{await page.goto(url+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(account.email);await page.getByLabel('كلمة المرور',{exact:true}).fill(account.password);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await page.waitForURL(/dashboard/);};
 try {
  await login(manager);
  const pages=[['resources',filters],['certificates',filters],['activity',filters],['live-sessions','?q=missing-pagination-result&page=9999'],['sales','?q=missing-pagination-result&page=9999'],['commerce/bundles','?q=missing-pagination-result&page=9999'],['commerce/coupons','?q=missing-pagination-result&page=9999'],['phone-confirmations','?page=9999']];
  for(const [path,query] of pages) {await page.goto(url+'/admin/dashboard/'+path+query);await expect(page.getByRole('heading',{level:1}).first()).toBeVisible();verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Out-of-range admin page renders on phone: '+path);}
  await page.waitForURL(/phone-confirmations/);
  await page.goto(url+'/admin/dashboard/resources?q=missing-pagination-result&filter=text&page=2');await page.waitForURL(/tools\?/);await expect(page.getByRole('heading',{name:'مكتبة الأدوات',exact:true})).toBeVisible();const params=new URL(page.url()).searchParams;
  verify(params.get('q')==='missing-pagination-result'&&params.get('filter')==='text'&&params.get('page')==='2','Old Tools bookmark retains all filters with an empty page');
  await browser.close();const learner=await chromium.launch({headless:true}),studentPage=await learner.newPage({viewport:{width:390,height:844}});studentPage.on('pageerror',error=>errors.push(error.message));
  try {await studentPage.goto(url+'/login');await studentPage.getByLabel('البريد الإلكتروني',{exact:true}).fill(student.email);await studentPage.getByLabel('كلمة المرور',{exact:true}).fill(student.password);await studentPage.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();await studentPage.waitForURL(/dashboard/);
   for(const [path,query] of [['resources',filters],['certificates',filters],['purchases','?q=missing-pagination-result&page=9999']]) {await studentPage.goto(url+'/dashboard/'+path+query);await expect(studentPage.getByRole('heading',{level:1}).first()).toBeVisible();verify(await studentPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Out-of-range student page renders on phone: '+path);}
  }finally{await learner.close();}
  verify(errors.length===0,'Paging boundary checks have no browser runtime errors');
 }finally{await browser.close();}
};

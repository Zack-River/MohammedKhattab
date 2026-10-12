/* eslint-disable @typescript-eslint/no-require-imports -- Isolated analytics database and responsive browser acceptance. */
const {Client}=require('pg');
const {chromium,expect}=require('@playwright/test');
const fs=require('node:fs');
module.exports=async function analyticsChecks({admin,provision,anonymous,verify,url,config}) {
  const manager=await provision('Analytics Manager');
  await admin.from('admin_users').insert({user_id:manager.id});
  const initial=JSON.parse((await manager.api('/api/admin/analytics')).data);
  const current=await provision('Analytics Current'), previous=await provision('Analytics Previous');
  verify((await anonymous('/api/admin/analytics')).status===401,'Anonymous analytics access denied');
  verify((await current.api('/api/admin/analytics')).status===403,'Student analytics access denied');
  verify(Boolean((await current.direct.rpc('admin_dashboard_snapshot')).error),'Direct student RPC denied');
  const db=new Client({connectionString:config.DB_URL});await db.connect();
  try {
    await db.query("update auth.users set raw_user_meta_data=raw_user_meta_data || '{\"acquisition_source\":\"youtube\"}'::jsonb where id=$1",[current.id]);
    await db.query("update auth.users set created_at=((date_trunc('week',now() at time zone 'Africa/Cairo') - interval '7 days') + ((now() at time zone 'Africa/Cairo')-date_trunc('week',now() at time zone 'Africa/Cairo'))/2) at time zone 'Africa/Cairo' where id=$1",[previous.id]);
    const {rows}=await db.query('select slug from public.courses order by slug limit 2');
    for(const row of rows) await db.query('insert into public.enrollments(user_id,course_slug) values($1,$2)',[current.id,row.slug]);
    await db.query('insert into public.enrollments(user_id,course_slug,created_at) select id,$2,created_at from auth.users where id=$1',[previous.id,rows[0].slug]);
    const response=await manager.api('/api/admin/analytics'),data=JSON.parse(response.data);
    verify(response.status===200&&/no-store/.test(response.headers.get('cache-control')),'Admin analytics returns uncached aggregates');
    verify(data.timezone==='Africa/Cairo','Analytics uses explicit Cairo timezone');
    verify(data.metrics.totalStudents===initial.metrics.totalStudents+2,'Admin accounts excluded from total students');
    verify(data.metrics.studentsWeek===initial.metrics.studentsWeek+1,'Current week excludes prior-week signup');
    verify(data.metrics.studentsPreviousWeek===initial.metrics.studentsPreviousWeek+1,'Previous week uses equal elapsed duration');
    verify(data.metrics.enrollmentsWeek===initial.metrics.enrollmentsWeek+2,'Actual enrollments counted separately from signups');
    verify(data.metrics.enrollmentsPreviousWeek===initial.metrics.enrollmentsPreviousWeek+1,'Previous enrollment comparison counts actual records');
    verify(data.courses.week[0].count>=1&&data.courses.all[0].count>=data.courses.week[0].count,'Popular course ranking is based on enrollments');
    verify(data.sources.some(s=>s.source==='youtube'&&s.count===1),'Recorded attribution retained');
    verify(data.sources.some(s=>s.source==='unknown'),'Missing attribution stays unknown');
    verify(!JSON.stringify(data).includes(current.email)&&!('revenue' in data.metrics),'Aggregate response omits email and invented revenue');
    verify(data.daily.length===Number(new Intl.DateTimeFormat('en',{timeZone:'Africa/Cairo',day:'numeric'}).format(new Date())),'Daily chart ends at Cairo today');
    const browser=await chromium.launch({headless:true});
    try {
      const page=await browser.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.goto(url+'/login');await page.getByLabel('البريد الإلكتروني',{exact:true}).fill(manager.email);
      await page.getByLabel('كلمة المرور',{exact:true}).fill(manager.password);await page.getByRole('button',{name:'تسجيل الدخول',exact:true}).click();
      await expect(page).toHaveURL(url+'/admin/dashboard');await expect(page.getByRole('heading',{name:'المنصة في أرقام',exact:true})).toBeVisible();
      verify(!/Supabase|مصدر البيانات/.test(await page.locator('.analytics-overview').innerText()),'Technical data-source copy removed from Home');
      await expect(page.locator('.analytics-chart-summary strong')).toHaveText(String(data.metrics.studentsMonth));
      fs.mkdirSync('docs/evidence/admin-analytics',{recursive:true});
      for(const width of [320,390,768,1440]) {
        await page.setViewportSize({width,height:960});await expect(page.locator('.recharts-surface')).toBeVisible();
        verify(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Analytics has no overflow at ${width}px`);
        await page.screenshot({path:`docs/evidence/admin-analytics/home-${width}.png`,fullPage:true});
      }
      await page.getByLabel('اشتراكات',{exact:true}).check();await expect(page.getByLabel('اشتراكات',{exact:true})).toBeChecked();
      await expect(page.locator('.analytics-chart-summary strong')).toHaveText(String(data.metrics.enrollmentsMonth));
      await page.getByText('عرض الأرقام اليومية',{exact:true}).click();await expect(page.locator('.analytics-data-table table')).toBeVisible();
      await page.getByRole('link',{name:'هذا الشهر',exact:true}).click();await expect(page).toHaveURL(/period=month/);
      await page.getByRole('link',{name:'كل الوقت',exact:true}).click();await expect(page).toHaveURL(/period=all/);
      await page.getByRole('button',{name:'تحديث الأرقام',exact:true}).click();await expect(page.getByRole('button',{name:'تحديث الأرقام',exact:true})).toBeEnabled();
      verify(await page.getByText('غير متاح',{exact:true}).count()===0,'Week and month revenue show actual verified-payment totals');
      await page.getByRole('link',{name:'المستخدمون',exact:true}).click();await expect(page).toHaveURL(url+'/admin/dashboard/users');
      await expect(page.getByRole('heading',{name:'إدارة المستخدمين',exact:true})).toBeVisible();
      verify(errors.length===0,'Chart and navigation have no browser errors');
    } finally {await browser.close();}
    await admin.from('admin_users').delete().eq('user_id',manager.id);
    verify((await manager.api('/api/admin/analytics')).status===403,'Revoked admin denied immediately');
    verify(Boolean((await manager.direct.rpc('admin_dashboard_snapshot')).error),'Revoked admin RPC denied');
  } finally {await db.end();}
};

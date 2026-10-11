/* eslint-disable @typescript-eslint/no-require-imports -- Isolated admin/RLS and editor checks. */
const { chromium, expect } = require('@playwright/test');
module.exports = async function adminChecks({ admin, provision, anonymous, student, verify, url }) {
  const endpoint = '/api/admin/courses/7days-freelance';
  verify((await anonymous(endpoint)).status === 401, 'Anonymous cannot access course editor API');
  verify((await student.api(endpoint)).status === 403, 'Student cannot access course editor API');
  verify(Boolean((await student.direct.from('admin_users').insert({ user_id: student.id })).error), 'Student cannot assign own admin role');
  verify(Boolean((await student.direct.from('admin_allowlist').insert({ email: student.email })).error), 'Student cannot add admin allowlist email');
  await student.direct.auth.updateUser({ data: { role: 'admin' } });
  verify((await student.api(endpoint)).status === 403, 'User metadata cannot grant admin privileges');
  verify(Boolean((await student.direct.from('enrollments').insert({ user_id: student.id, course_slug: '7days-freelance' })).error), 'Live workshop cannot self-enroll directly');
  const manager = await provision('Course Manager');
  verify(!(await admin.from('admin_users').insert({ user_id: manager.id })).error, 'Trusted admin membership assigned');
  const original = (await admin.from('courses').select('metadata,amount,published').eq('slug','7days-freelance').single()).data;
  try {
    const record = await manager.api(endpoint);
    verify(record.status === 200, 'Admin reads course editor data');
    const saved = { title: 'ورشة اختبار الإدارة', description: 'وصف جديد محفوظ في قاعدة البيانات', amount: 777, category: 'editing',
      thumbnailUrl: '/assets/images/workshop-intro-poster.jpg', introVideoUrl: '/assets/video/workshop-intro.mp4', published: true };
    verify((await manager.api(endpoint,saved)).status === 200, 'Admin edits name description price category and media');
    const publicCourse = JSON.parse((await anonymous('/api/courses/7days-freelance')).data);
    verify(publicCourse.title === saved.title && publicCourse.offer.amount === 777 && publicCourse.category === 'editing', 'Database edits appear in public catalog');
    verify((await anonymous('/workshops/7days-freelance')).data.includes(saved.title), 'Workshop landing reads database changes');
    verify((await manager.api(endpoint,{ ...saved, thumbnailUrl: 'javascript:alert(1)' })).status === 400, 'Unsafe media URL rejected');
    verify((await manager.api(endpoint,{ ...saved, amount: -1 })).status === 400, 'Negative price rejected');
    verify((await manager.api(endpoint,saved,{ headers: { Origin: 'https://attacker.example' } })).status === 403, 'Cross-origin admin mutation rejected');
    verify((await student.api(endpoint,saved)).status === 403, 'Student cannot mutate through admin API');
    verify((await manager.api(endpoint,{ ...saved, published: false })).status === 200, 'Admin unpublishes course');
    verify((await anonymous('/api/courses/7days-freelance')).status === 404, 'Unpublished course disappears publicly');
    verify((await manager.api(endpoint)).status === 200, 'Admin retains unpublished course access');
    await manager.api(endpoint,saved);
    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage();
      await page.goto(url + '/login');
      await page.getByLabel('البريد الإلكتروني', { exact: true }).fill(manager.email);
      await page.getByLabel('كلمة المرور', { exact: true }).fill(manager.password);
      await page.getByRole('button', { name: 'تسجيل الدخول', exact: true }).click();
      await expect(page.getByRole('link', { name: 'إدارة الدورات', exact: true })).toBeVisible();
      await page.goto(url + '/dashboard/admin/courses/7days-freelance');
      await page.getByLabel('اسم الدورة', { exact: true }).fill('ورشة محفوظة من لوحة التحكم');
      await page.getByLabel('السعر (ج.م)', { exact: true }).fill('888');
      await page.getByRole('button', { name: 'حفظ التغييرات', exact: true }).click();
      await expect(page.getByRole('status')).toHaveText('تم حفظ التغييرات');
      await page.reload();
      await expect(page.getByLabel('اسم الدورة', { exact: true })).toHaveValue('ورشة محفوظة من لوحة التحكم');
      verify(true, 'Browser editor persists changes across refresh');
      await page.setViewportSize({ width: 390, height: 900 });
      verify(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Admin editor fits mobile');
      await page.screenshot({ path: 'docs/evidence/backend/admin-editor-390.png', fullPage: true });
    } finally { await browser.close(); }
    const driveCourse = { ...saved, introVideoUrl: 'https://drive.google.com/file/d/1ZHecu6hIzcXtpyMxa-Rexq0csHcmOKJt/view' };
    verify((await manager.api(endpoint,driveCourse)).status === 200, 'Google Drive link persists in admin editor');
    const view = await anonymous('/workshops/7days-freelance');
    verify(view.data.includes('/api/courses/7days-freelance/intro'), 'Drive intro uses the custom streaming player');
    const media = await fetch(url + '/api/courses/7days-freelance/intro', { headers: { Range: 'bytes=0-1023' }, signal: AbortSignal.timeout(15000) });
    const reader = media.body.getReader();
    const sample = await reader.read();
    await reader.cancel();
    verify(media.ok && media.headers.get('content-type').startsWith('video/') && Buffer.from(sample.value).includes(Buffer.from('ftyp')), 'Drive streaming retrieves actual MP4 bytes and supports cancellation');
    const privateVideo = '/api/admin/courses/editing-foundations/lessons/first-cut';
    const initial = (await admin.from('lessons').select('video_url').eq('course_slug','editing-foundations').eq('id','first-cut').single()).data.video_url;
    try {
      verify((await manager.api(privateVideo,{ videoUrl: driveCourse.introVideoUrl })).status === 200, 'Admin can edit protected lesson video');
      verify((await student.api(privateVideo,{ videoUrl: driveCourse.introVideoUrl })).status === 403, 'Student cannot edit protected lesson video');
      verify((await anonymous('/api/courses/editing-foundations/lessons/first-cut/stream')).status === 403, 'Protected stream enforces enrollment before retrieving Drive bytes');
    } finally { await admin.from('lessons').update({ video_url: initial }).eq('course_slug','editing-foundations').eq('id','first-cut'); }
  } finally { await admin.from('courses').update(original).eq('slug','7days-freelance'); }
  const response = await anonymous('/7days-freelance?test=1');
  verify(response.status === 308 && response.headers.get('location').includes('/workshops/7days-freelance?test=1'), 'Legacy workshop redirects with query preserved');
  const legacyDetail = await anonymous('/ta3allam/courses/7days-freelance');
  verify(legacyDetail.status === 308, 'Generic workshop detail URL redirects to approved landing');
  const copy = { ...original.metadata, slug: 'test-live-free', offer: { ...original.metadata.offer, amount: 0 } };
  await admin.from('courses').insert({ slug: copy.slug, metadata: copy, amount: 0, published: true, position: 100 });
  try { verify(Boolean((await student.direct.from('enrollments').insert({ user_id: student.id, course_slug: copy.slug })).error), 'RLS also blocks zero-price live self-enrollment'); }
  finally { await admin.from('courses').delete().eq('slug',copy.slug); }
  const provider = await admin.auth.admin.createUser({ email: `allowlist-${Date.now()}@example.com`, password: 'Local-Test-Password-19!', email_confirm: true });
  const id = provider.data.user.id;
  try {
    const email = provider.data.user.email;
    await admin.from('admin_allowlist').insert({ email });
    await admin.auth.admin.updateUserById(id,{ email_confirm: true });
    verify((await admin.from('admin_users').select('*').eq('user_id',id)).data.length === 1, 'Verified allowlisted email receives role through trusted trigger');
    await admin.auth.admin.updateUserById(id,{ email: `not-allowed-${Date.now()}@example.com`, email_confirm: true });
    verify((await admin.from('admin_users').select('*').eq('user_id',id)).data.length === 0, 'Changing away from allowlisted email removes admin role');
    await admin.from('admin_allowlist').delete().eq('email',email);
  } finally { await admin.auth.admin.deleteUser(id); }
};

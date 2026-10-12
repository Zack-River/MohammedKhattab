/* eslint-disable @typescript-eslint/no-require-imports -- Node integration runner with local-only credentials. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { spawn } = require('node:child_process');
const { createClient } = require('@supabase/supabase-js');
const config = JSON.parse(fs.readFileSync('/tmp/khatab-supabase-status.json', 'utf8'));
assert.match(config.API_URL, /^http:\/\/127\.0\.0\.1:/, 'Tests require isolated local Supabase');
if (!/^postgresql:\/\/postgres:postgres@127\.0\.0\.1:/.test(config.DB_URL)) throw new Error('Tests require an isolated local database');
const url = 'http://localhost:3045';
const env = { ...process.env, NEXT_PUBLIC_SUPABASE_URL: config.API_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: config.PUBLISHABLE_KEY ?? config.ANON_KEY, APP_ORIGIN: url, SUPABASE_SECRET_KEY: config.SECRET_KEY ?? config.SERVICE_ROLE_KEY };
let paymentMock;
if(['payments','commerce'].includes(process.env.BACKEND_SUITE)) {
 paymentMock=require('./payment-gateway.cjs').paymentGateway();paymentMock.server.listen(3046,'127.0.0.1');
 Object.assign(env,{FAWATERAK_TOKEN_URL:'http://127.0.0.1:3046/oauth/token',FAWATERAK_CLIENT_ID:'local-payment-client',FAWATERAK_CLIENT_SECRET:'local-payment-secret',HASH_API_KEY:'local-payment-hmac',FAWATERAK_TEST_ORIGIN:'http://127.0.0.1:3046'});
}
const log = fs.openSync('/tmp/khatab-backend-server.log', 'w');
const server = spawn('node', ['node_modules/next/dist/bin/next', 'dev', '--hostname', '127.0.0.1', '--port', '3045'], { env, stdio: ['ignore', log, log] });
const admin = createClient(config.API_URL, config.SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const identities = [];
let checks = 0;
const verify = (condition, label) => { assert.ok(condition, label); console.log(`PASS ${++checks}: ${label}`); };
function account() {
  const cookies = new Map();
  return async (path, body, options = {}) => {
    const headers = { Cookie: [...cookies].map(([k,v]) => `${k}=${v}`).join('; '), ...options.headers };
    if (body !== undefined) { if (!(body instanceof FormData)) headers['Content-Type'] = 'application/json'; headers.Origin ??= url; }
    const response = await fetch(url + path, { ...options, headers, method: options.method ?? (body === undefined ? 'GET' : 'POST'), body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body), redirect: 'manual' });
    for (const value of response.headers.getSetCookie()) {
      const [pair] = value.split(';'); const index = pair.indexOf('='); cookies.set(pair.slice(0,index), pair.slice(index + 1));
    }
    return { status: response.status, data: await response.text(), headers: response.headers };
  };
}
const parse = response => JSON.parse(response.data);
async function provision(name) {
  const email = `test-${require("node:crypto").randomUUID()}@example.com`, password = 'Local-Test-Password-19!';
  const result = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { name } });
  assert.ok(!result.error, 'Local fixture user created'); identities.push(result.data.user.id);
  if (process.env.BACKEND_SUITE !== 'account-settings') {
    const phone = '+2012' + String(require('node:crypto').randomInt(10000000,99999999));
    assert.ok(!(await admin.from('account_contacts').update({phone_e164:phone}).eq('user_id',result.data.user.id)).error);
    assert.ok(!(await admin.from('account_contacts').update({phone_verified_at:new Date().toISOString()}).eq('user_id',result.data.user.id)).error);
  }
  const direct = createClient(config.API_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  assert.ok(!(await direct.auth.signInWithPassword({ email, password })).error, 'Local fixture can authenticate');
  const api = account(); verify((await api('/api/auth/login', { email, password })).status === 200, `${name}: real login`);
  return { id: result.data.user.id, email, password, direct, api };
}
async function run() {
  for (let attempt = 0; attempt < 90; attempt++) {
    try { if ((await fetch(url + '/api/courses')).ok) break; } catch {}
    if (attempt === 89) throw new Error('Local Next.js server did not start; inspect /tmp/khatab-backend-server.log');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  const anonymous = account();
  // Local-only test isolation prevents a previous suite's budget from affecting another suite.
  const budgetDb = new (require('pg').Client)({ connectionString: config.DB_URL });
  await budgetDb.connect(); await budgetDb.query('delete from private.request_buckets'); await budgetDb.end();
  if (process.env.BACKEND_SUITE === 'security') {
    await require('./security.cjs')({ admin, provision, anonymous, verify, url, config }); return;
  }
  if (process.env.BACKEND_SUITE === 'workshop-template') {
    await require('./workshop-template.cjs')({admin,provision,anonymous,verify,url});return;
  }
  if (process.env.BACKEND_SUITE === 'commerce') {
    await require('./commerce.cjs')({admin,provision,anonymous,verify,url,gateway:paymentMock,config});return;
  }
  if (process.env.BACKEND_SUITE === 'payments') {
    await require('./payments.cjs')({admin,provision,anonymous,verify,url,gateway:paymentMock});return;
  }
  if (process.env.BACKEND_SUITE === 'course-price') {
    await require('./course-price.cjs')({admin,provision,verify,url});
    return;
  }
  if (process.env.BACKEND_SUITE === 'course-details') {
    await require('./course-details.cjs')({admin,provision,anonymous,verify,url});return;
  }
  if (process.env.BACKEND_SUITE === 'curriculum-authoring') {
    await require('./curriculum-authoring.cjs')({admin,provision,anonymous,verify,url});
    return;
  }
  if (process.env.BACKEND_SUITE === 'admin-course-management') {
    await require('./admin-course-management.cjs')({admin,provision,anonymous,verify,url});
    return;
  }
  if (process.env.BACKEND_SUITE === 'image-uploads') {
    await require('./image-uploads.cjs')({admin,provision,anonymous,verify,url});
    return;
  }
  if (process.env.BACKEND_SUITE === 'performance') {
    await require('./performance.cjs')({admin,provision,verify,url});
    return;
  }
  if (process.env.BACKEND_SUITE === 'phone-confirmations') {
    await require('./phone-confirmations.cjs')({admin,provision,anonymous,verify,url});
    return;
  }
  if (process.env.BACKEND_SUITE === 'admin-analytics') {
    await require('./admin-analytics.cjs')({admin,provision,anonymous,verify,url,config});
    return;
  }
  if (process.env.BACKEND_SUITE === 'navigation') {
    const manager=await provision('Navigation Manager'),student=await provision('Navigation Student');
    assert.ok(!(await admin.from('admin_users').insert({user_id:manager.id})).error);
    await require('./navigation-browser.cjs')({url,manager,student,verify});
    return;
  }
  if (process.env.BACKEND_SUITE === 'account-settings-browser') {
    const manager=await provision('Account Manager'),student=await provision('Account Student');
    await admin.from('admin_users').insert({user_id:manager.id});
    await require('./account-settings-browser.cjs')({manager,student,url,verify,config,admin});
    return;
  }
  if (process.env.BACKEND_SUITE === 'account-settings') {
    await require('./account-settings.cjs')({ admin, provision, anonymous, verify, url, config });
    return;
  }
  if (process.env.BACKEND_SUITE === 'username-controls') {
    await require('./username-controls.cjs')({ admin, provision, anonymous, verify, url, config });
    return;
  }
  if (process.env.BACKEND_SUITE === 'admin-user-search') {
    await require('./admin-user-search.cjs')({ admin, provision, anonymous, verify, url, config });
    return;
  }
  if (process.env.BACKEND_SUITE === 'admin-users-browser') {
    const manager = await provision('User Manager'), target = await provision('Moderation Student');
    await admin.from('admin_users').insert({ user_id: manager.id });
    await admin.from('enrollments').insert({ user_id: target.id, course_slug: 'editing-foundations' });
    await require('./admin-users-browser.cjs')({ manager, target, verify, url });
    return;
  }
  if (process.env.BACKEND_SUITE === 'admin-users') {
    const student = await provision('API Student');
    await require('./admin-users.cjs')({ admin, provision, anonymous, student, verify, url });
    return;
  }
  const catalog = await anonymous('/api/courses');
  verify(catalog.status === 200, 'Anonymous catalog is database-backed');
  const courses = parse(catalog).courses, course = courses[0];
  const lessons = course.modules.flatMap(section => section.lessons), privateLesson = lessons.find(lesson => !lesson.preview), preview = lessons.find(lesson => lesson.preview);
  verify(lessons.every(lesson => !lesson.videoUrl), 'Public metadata excludes playback URLs');
  const playback = lesson => `/api/courses/${course.slug}/lessons/${lesson.id}/playback`;
  for (const path of ['/api/profile','/api/progress','/api/enrollments','/api/auth/session',`/api/certificates/${course.slug}`])
    verify((await anonymous(path)).status === 401, `Anonymous denied ${path}`);
  const protectedPage = await anonymous('/dashboard');
  verify(protectedPage.headers.get('location')?.includes('/login') || (protectedPage.data.includes('NEXT_REDIRECT') && protectedPage.data.includes('/login')), 'Protected dashboard redirects (including streamed redirects)');
  verify((await anonymous(playback(privateLesson))).status === 403, 'Private playback denied without enrollment');
  verify((await anonymous(playback(preview))).status === 200, 'Published preview playback is public');
  verify((await anonymous('/api/auth/login', { email: 'wrong@example.com', password: 'Incorrect-Password-19!' })).status === 401, 'Wrong password rejected');
  verify((await anonymous('/api/auth/signup', { name: 'x', email: 'invalid', password: 'short' })).status === 400, 'Invalid signup rejected');
  verify((await anonymous('/api/auth/signup', { payload: 'x'.repeat(17000) })).status === 413, 'Oversized JSON payload rejected');
  verify((await anonymous('/api/auth/login', { email: 'wrong@example.com', password: 'Incorrect-Password-19!' }, { headers: { Origin: 'https://attacker.example' } })).status === 403, 'Cross-origin login rejected');
  verify((await anonymous('/api/profile', undefined, { headers: { Cookie: 'ta3allam-state=forged' } })).status === 401, 'Forged demo cookie grants no authority');
  const a = await provision('Student A'), b = await provision('Student B');
  verify((await a.api('/api/auth/session')).status === 200, 'Verified session endpoint');
  await require('./browser.cjs')({ url, config, admin, identities, verify, student: a });
  await require('./dashboard-access.cjs')({ url, student: a, verify });
  await require('./admin.cjs')({ admin, provision, anonymous, student: b, verify, url, config });
  await require('./admin-users.cjs')({ admin, provision, anonymous, student: b, verify, url });
  verify((await a.api('/api/enrollments', { courseSlug: course.slug })).status === 403, 'Paid course cannot self-enroll through API');
  verify(Boolean((await a.direct.from('enrollments').insert({ user_id: a.id, course_slug: course.slug })).error), 'RLS blocks direct paid enrollment');
  verify(Boolean((await a.direct.from('profiles').upsert({ id: b.id, name: 'Impersonation' })).error), 'RLS blocks profile ownership forgery');
  verify((await a.direct.from('profiles').select('*').eq('id', b.id)).data.length === 0, 'RLS hides other student profile');
  const attemptedPrice = await a.direct.from('courses').update({ amount: 0 }).eq('slug',course.slug).select('amount');
  const persistedPrice = (await admin.from('courses').select('amount').eq('slug',course.slug).single()).data.amount;
  verify((attemptedPrice.error || attemptedPrice.data?.length === 0) && Number(persistedPrice) === course.offer.amount, 'Students cannot alter prices');
  verify((await a.api('/api/progress', { courseSlug: course.slug, lessonId: privateLesson.id, completed: true })).status === 403, 'Progress requires enrollment');
  const free = { ...course, slug: 'backend-test-free', offer: { ...course.offer, amount: 0 } };
  assert.ok(!(await admin.from('courses').upsert({ slug: free.slug, metadata: free, amount: 0, published: true, position: 99 })).error);
  verify((await a.api('/api/enrollments', { courseSlug: free.slug })).status === 200, 'Free enrollment succeeds');
  verify((await a.api('/api/enrollments', { courseSlug: free.slug })).status === 200, 'Free enrollment is idempotent');
  assert.ok(!(await admin.from('enrollments').insert({ user_id: a.id, course_slug: course.slug })).error);
  verify((await a.api(playback(privateLesson))).status === 200, 'Trusted grant unlocks private playback');
  verify((await b.api(playback(privateLesson))).status === 403, 'Grant never unlocks another account');
  verify((await b.direct.from('enrollments').select('*').eq('user_id', a.id)).data.length === 0, 'Direct requests hide another account enrollment');
  const updates = await Promise.all(lessons.slice(0,2).map(lesson => a.api('/api/progress', { courseSlug: course.slug, lessonId: lesson.id, completed: true })));
  verify(updates.every(result => result.status === 200), 'Concurrent progress updates succeed');
  const progress = parse(await a.api('/api/progress'));
  verify(lessons.slice(0,2).every(lesson => progress.completed.includes(`${course.slug}/${lesson.id}`)), 'Concurrent progress preserves both lessons');
  verify((await b.direct.from('lesson_progress').select('*').eq('user_id', a.id)).data.length === 0, 'RLS hides another account progress');
  verify(Boolean((await b.direct.from('lesson_progress').insert({ user_id: a.id, course_slug: course.slug, lesson_id: privateLesson.id, completed: true })).error), 'RLS rejects forged progress owner');
  verify((await a.api('/api/progress', { courseSlug: course.slug, lessonId: 'missing', completed: true })).status === 404, 'Unknown lesson rejected');
  verify((await a.api(`/api/certificates/${course.slug}`)).status === 403, 'Incomplete course certificate denied');
  for (const lesson of lessons) await a.api('/api/progress', { courseSlug: course.slug, lessonId: lesson.id, completed: true });
  verify((await a.api(`/api/certificates/${course.slug}`)).status === 200, 'Completed enrolled course certificate allowed');
  const resourceId = lessons.flatMap(lesson => lesson.resourceIds)[0];
  if (resourceId) {
    verify((await a.api(`/api/resources/${resourceId}`)).status === 200, 'Enrolled student can download resource');
    verify((await b.api(`/api/resources/${resourceId}`)).status === 404, 'Other student cannot download resource');
  }
  const profile = await a.api('/api/profile', { name: 'Updated Student', email: a.email });
  verify(profile.status === 200 && parse(profile).name === 'Updated Student', 'Own profile updates persist');
  verify(/no-store/.test(profile.headers.get('cache-control')), 'Personalized responses never cached');
  const changedEmail = await a.api('/api/profile', { name: 'Updated Student', email: `changed-${Date.now()}@example.com` });
  verify(changedEmail.status === 403 && parse(changedEmail).code === 'EMAIL_LOCKED', 'Student email change is locked on the legacy endpoint');
  await admin.from('enrollments').delete().eq('user_id',a.id).eq('course_slug',course.slug);
  verify((await a.api(playback(privateLesson))).status === 403, 'Revoked grant immediately denies playback');
  verify((await a.api('/api/auth/logout', {})).status === 200, 'Logout succeeds');
  verify((await a.api('/api/auth/session')).status === 401, 'Logout removes authenticated session');
}
(async () => {
  try { await run(); console.log(`Backend integration: ${checks} checks passed`); }
  finally {
    for (const id of identities) {
      const user=await admin.auth.admin.getUserById(id);
      if(user.data.user?.email) await admin.from("admin_allowlist").delete().eq("email",user.data.user.email);
      await admin.from("admin_users").delete().eq("user_id", id);
      await admin.auth.admin.deleteUser(id);
    }
    await admin.from('courses').delete().eq('slug','backend-test-free');
    paymentMock?.server.close();server.kill('SIGTERM'); fs.closeSync(log);
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });

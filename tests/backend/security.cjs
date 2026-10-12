/* eslint-disable @typescript-eslint/no-require-imports -- Adversarial tests against isolated services only. */
const assert = require('node:assert/strict');
const { randomUUID, createHash } = require('node:crypto');
const { Client } = require('pg');
module.exports = async function securityChecks({ admin, provision, anonymous, verify, url, config }) {
  assert.match(config.DB_URL, /^postgresql:\/\/postgres:postgres@127\.0\.0\.1:/);
  const db = new Client({ connectionString: config.DB_URL });
  await db.connect();
  const learner = await provision('Security Learner'), manager = await provision('Security Manager');
  await admin.from('admin_users').insert({ user_id: manager.id });
  const slug = 'security-' + randomUUID(), intent = randomUUID(), order = randomUUID();
  try {
    const template = (await admin.from('courses').select('metadata').eq('published', true).limit(1).single()).data.metadata;
    await db.query('insert into public.courses(slug,amount,metadata,published) values($1,1200,$2,true)', [slug, { ...template, slug, title: "Security's fixture" }]);
    await db.query("insert into public.payment_orders(id,user_id,course_slug,course_title,amount_minor,provider_intent_key,status,expires_at,live) values($1,$2,$3,'Security fixture',120000,$4,'pending',now()-interval '1 minute',false)", [order, learner.id, slug, intent]);
    await require('../security/payment-locks.cjs')({ connectionString: config.DB_URL, user: learner.id, slug, order, intent });
    verify(true, 'Checkout expiration and settlement cannot deadlock');
    const settled = await db.query("select status,(select count(*) from public.enrollments where user_id=$2 and course_slug=$3) as enrollments from public.payment_orders where id=$1", [order, learner.id, slug]);
    verify(settled.rows[0].status === 'paid' && Number(settled.rows[0].enrollments) === 1, 'Raced payment remains paid with exactly one enrollment');
    const bucket = createHash('sha256').update(randomUUID()).digest('hex');
    const budgets = await Promise.all(Array.from({ length: 20 }, () => admin.rpc('consume_request_budget', { p_bucket: bucket, p_limit: 7, p_seconds: 60 })));
    verify(budgets.every(r => !r.error) && budgets.filter(r => r.data.allowed).length === 7, 'Concurrent distributed limiter accepts exactly its budget');
    verify(Boolean((await learner.direct.rpc('consume_request_budget', { p_bucket: bucket, p_limit: 10000, p_seconds: 1 })).error), 'Students cannot reset or enlarge request budgets');
    verify((await db.query("select has_table_privilege('anon','private.request_buckets','SELECT') as readable")).rows[0].readable === false, 'Anonymous roles cannot inspect limiter identities');
    await db.query("update private.request_buckets set expires_at=now()-interval '1 second' where bucket=$1", [bucket]);
    verify((await admin.rpc('consume_request_budget', { p_bucket: bucket, p_limit: 7, p_seconds: 60 })).data.allowed, 'Expired windows recover automatically');
    const attack = "' OR TRUE; DROP TABLE public.courses; --";
    const searched = await manager.direct.rpc('search_admin_courses', { p_search: attack });
    verify(!searched.error && searched.data.total === 0, 'SQL injection text is treated as literal search data');
    verify(!(await manager.direct.rpc('search_admin_courses', { p_search: "Security's fixture" })).error, 'Legitimate apostrophes remain valid search input');
    verify(Boolean((await manager.direct.rpc('search_admin_courses', { p_sort: attack })).error), 'SQL-like sort expressions fail the database allowlist');
    verify(Boolean((await manager.direct.rpc('search_admin_courses', { p_page: 2147483647 })).error), 'Oversized pagination cannot overflow offsets');
    verify((await db.query('select count(*) from public.courses where slug=$1', [slug])).rows[0].count === '1', 'Injection attempts cannot delete course data');
    await learner.direct.auth.updateUser({ data: { role: 'admin', admin: true } });
    verify((await learner.api('/api/admin/users')).status === 403, 'Forged user metadata cannot elevate administrator permissions');
    verify((await anonymous('/api/admin/users')).status === 401, 'Anonymous admin data remains inaccessible');
    verify(Boolean((await learner.direct.rpc('settle_course_payment', { p_order: order, p_intent: intent, p_transaction: 999001, p_amount: 120000, p_currency: 'EGP' })).error), 'Direct Data API calls cannot forge settlements');
    const oversized = await fetch(url + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: url }, body: JSON.stringify({ payload: 'x'.repeat(17000) }) });
    verify(oversized.status === 413, 'Oversized API bodies are denied before authentication');
    const crossSite = await learner.api('/api/auth/logout', {}, { headers: { 'Sec-Fetch-Site': 'cross-site' } });
    verify(crossSite.status === 403, 'Cross-site fetch metadata denies session mutations');
    await require('../security/browser.cjs')({ url, verify });
    // Invalid payloads exercise application throttling without hitting password authentication.
    const responses = [];
    for (let i = 0; i < 31; i++) responses.push(await anonymous('/api/auth/login', {}));
    const limited = responses.find(r => r.status === 429);
    verify(Boolean(limited) && Number(limited.headers.get('retry-after')) > 0, 'Repeated auth attempts receive 429 and Retry-After');
    const spoofed = await anonymous('/api/auth/login', {}, { headers: { 'X-Forwarded-For': '198.51.100.77', 'X-Vercel-Forwarded-For': '198.51.100.77' } });
    verify(spoofed.status === 429, 'Spoofed IP headers cannot bypass local throttling');
    verify((await anonymous('/api/courses')).status === 200, 'Auth throttling does not block browsing courses');
  } finally {
    await db.query('delete from public.payment_orders where course_slug=$1', [slug]);
    await db.query('delete from public.courses where slug=$1', [slug]);
    await db.query('delete from private.request_buckets');
    await db.end();
  }
};

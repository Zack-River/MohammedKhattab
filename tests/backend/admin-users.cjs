/* eslint-disable @typescript-eslint/no-require-imports -- Isolated real Auth, API, RLS and browser acceptance tests. */
module.exports = async function userManagementChecks({ admin, provision, anonymous, student, verify, url }) {
  const manager = await provision('User Manager'), target = await provision('Moderation Student');
  await admin.from('admin_users').insert({ user_id: manager.id });
  const base = '/api/admin/users', endpoint = `${base}/${target.id}`;
  const json = response => JSON.parse(response.data);
  verify((await anonymous(base)).status === 401, 'Anonymous cannot list private users');
  verify((await anonymous('/admin/dashboard')).headers.get('location')?.includes('/login'), 'Anonymous admin dashboard redirects to login');
  verify((await student.api(base)).status === 403, 'Student cannot list private users');
  const deniedPage = await student.api('/admin/dashboard');
  verify(deniedPage.headers.get('location')?.endsWith('/dashboard') || (deniedPage.data.includes('NEXT_REDIRECT') && deniedPage.data.includes('/dashboard')), 'Student admin page redirects to private student dashboard');
  verify((await student.api(endpoint)).status === 403, 'Student cannot read another user detail');
  verify((await student.api(endpoint,{ action: 'promote' })).status === 403, 'Student cannot promote users');
  verify(Boolean((await student.direct.rpc('promote_admin_user',{ target_id: student.id })).error), 'Database rejects direct student role promotion');
  const list = await manager.api(base);
  verify(list.status === 200 && json(list).users.some(user => user.id === target.id && user.email === target.email), 'Admin sees names usernames and emails');
  verify(!list.data.includes('encrypted_password') && !list.data.includes('access_token'), 'User listing exposes only selected public account fields');
  verify(/no-store/.test(list.headers.get('cache-control')), 'User data is never cached');
  verify((await manager.api(base + '?page=-1')).status === 400, 'Invalid pagination rejected');
  verify((await manager.api(base + '?page=99999')).status === 200 && json(await manager.api(base + '?page=99999')).users.length === 0, 'Empty pagination is handled');
  verify((await manager.api(`${base}/not-an-id`)).status === 400, 'Malformed user ID rejected');
  verify((await manager.api(`${base}/00000000-0000-0000-0000-000000000000`)).status === 404, 'Unknown user returns 404');
  verify((await manager.api(endpoint, { action: 'suspend', period: 'forever' })).status === 400, 'Unsupported suspension duration rejected');
  verify((await manager.api(endpoint, { action: 'remove' }, { headers: { Origin: 'https://attacker.example' } })).status === 403, 'Cross-origin user deletion rejected');
  verify((await manager.api(`${base}/${manager.id}`, { action: 'remove' })).status === 403, 'Admin cannot delete self');
  verify((await manager.api(`${base}/${manager.id}`, { action: 'ban' })).status === 403, 'Admin cannot ban self');
  verify(Boolean((await admin.auth.admin.updateUserById(manager.id,{ ban_duration: '24h' })).error), 'Database prevents administrator ban races');
  await admin.from('enrollments').insert({ user_id: target.id, course_slug: 'editing-foundations' });
  const detail = json(await manager.api(endpoint));
  verify(detail.user.name === 'Moderation Student' && /^moderationstudent[0-9]{6}$/.test(detail.user.username), 'User detail contains real profile and username');
  verify(detail.subscriptions.some(course => course.slug === 'editing-foundations'), 'User detail reads actual subscribed courses');
  for (const [period, hours] of [['day',24],['week',168],['month',720],['year',8760]]) {
    verify((await manager.api(endpoint,{ action: 'suspend', period })).status === 200, `${period} suspension succeeds`);
    const until = json(await manager.api(endpoint)).user.suspendedUntil;
    verify(Math.abs((Date.parse(until)-Date.now())/3600000-hours) < 0.01, `${period} suspension has correct expiry`);
    verify((await target.api('/api/auth/session')).status === 401, 'Suspension blocks previously issued API session');
    verify((await target.direct.from('enrollments').select('*')).data.length === 0, 'Suspension blocks direct Data API with existing JWT');
    verify((await target.direct.from('lessons').select('*').eq('course_slug','editing-foundations')).data.length === 0, 'Suspension blocks direct course playback retrieval');
    verify((await manager.api(endpoint,{ action: 'restore' })).status === 200, 'Admin restores access before expiry');
    verify((await target.api('/api/auth/session')).status === 200, 'Restored account regains authorized session access');
  }
  verify((await manager.api(endpoint,{ action: 'ban' })).status === 200, 'Permanent ban succeeds');
  verify(json(await manager.api(endpoint)).user.permanentlyBanned, 'Permanent ban has separate status from suspension');
  const denied = await target.direct.auth.signInWithPassword({ email: target.email, password: target.password });
  verify(Boolean(denied.error), 'Banned account cannot sign in');
  await manager.api(endpoint,{ action: 'restore' });
  await admin.auth.admin.updateUserById(target.id,{ ban_duration: '1s' });
  await new Promise(resolve => setTimeout(resolve, 1200));
  verify((await target.api('/api/auth/session')).status === 200, 'Expired suspension automatically restores access');
  await require('./admin-users-browser.cjs')({ manager, target, verify, url });
  verify((await manager.api(endpoint,{ action: 'remove' })).status === 200, 'Admin can delete student account');
  verify((await manager.api(endpoint)).status === 404, 'Deleted user disappears from private detail');
  verify((await admin.from('enrollments').select('*').eq('user_id',target.id)).data.length === 0, 'Delete cascades subscribed courses');
  verify((await target.api('/api/auth/session')).status === 401, 'Deleted user existing session is denied');
  verify((await target.direct.rpc('account_access_allowed')).data !== true, 'Deleted user old JWT cannot pass database access check');
  const promoted = await provision('Promoted User');
  try {
    verify((await manager.api(`${base}/${promoted.id}`,{ action: 'promote' })).status === 200, 'Admin promotes confirmed student');
    verify((await promoted.api(base)).status === 200, 'Promoted user gains admin access');
    await admin.auth.admin.updateUserById(promoted.id,{ email_confirm: true });
    verify((await promoted.api(base)).status === 200, 'Promotion persists after provider email confirmation updates');
    verify((await manager.api(`${base}/${promoted.id}`,{ action: 'ban' })).status === 403, 'Other administrators are protected');
  } finally { await admin.from('admin_allowlist').delete().eq('email',promoted.email); }
};

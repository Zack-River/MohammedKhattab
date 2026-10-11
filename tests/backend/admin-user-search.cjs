/* eslint-disable @typescript-eslint/no-require-imports -- Real isolated database and browser fixtures. */
const { Client } = require('pg');
const { chromium, expect } = require('@playwright/test');
module.exports = async function userSearchChecks({ admin, provision, anonymous, verify, url, config }) {
  const manager = await provision('Search Manager');
  await admin.from('admin_users').insert({ user_id: manager.id });
  const prefix = `Filter-${Date.now()}`, fixtures = [];
  for (let index = 0; index < 8; index++) fixtures.push(await provision(`${prefix} Account ${index}`));
  const [suspended, banned, old, expired, promoted] = fixtures;
  await manager.api(`/api/admin/users/${suspended.id}`, { action: 'suspend', period: 'week' });
  await manager.api(`/api/admin/users/${banned.id}`, { action: 'ban' });
  await manager.api(`/api/admin/users/${promoted.id}`, { action: 'promote' });
  const db = new Client({ connectionString: config.DB_URL });
  await db.connect();
  try {
    await db.query("update auth.users set created_at = now() - interval '30 days' where id = $1", [old.id]);
    await db.query("update auth.users set banned_until = now() - interval '1 minute' where id = $1", [expired.id]);
  } finally { await db.end(); }
  const params = { p_page: 1, p_limit: 5, p_search: '', p_statuses: [], p_admins_only: false };
  verify(Boolean((await fixtures[5].direct.rpc('search_admin_users', params)).error), 'Database rejects direct student user search');
  verify((await anonymous('/api/admin/users?q=' + prefix)).status === 401, 'Anonymous cannot search accounts');
  const get = async query => { const response = await manager.api('/api/admin/users?' + query); verify(response.status === 200, `Search request succeeds: ${query}`); return JSON.parse(response.data); };
  const first = await get('q=' + prefix), second = await get('q=' + prefix + '&page=2');
  verify(first.users.length === 5 && first.total === 8 && first.hasNext, 'Search paginates five of eight matches');
  verify(second.users.length === 3 && second.total === 8 && !second.hasNext, 'Second page includes remaining matches');
  verify(new Set([...first.users, ...second.users].map(user => user.id)).size === 8, 'Pages contain no overlapping or missing accounts');
  const specific = await get('q=' + encodeURIComponent(old.email.toUpperCase()));
  verify(specific.users.length === 1 && specific.users[0].id === old.id, 'Case-insensitive email search finds account beyond first page');
  const username = (await manager.api('/api/admin/users/' + old.id)).data;
  const byUsername = await get('q=' + JSON.parse(username).user.username);
  verify(byUsername.users[0]?.id === old.id, 'Username search works');
  const blocked = await get('q=' + prefix + '&status=suspended');
  verify(blocked.total === 1 && blocked.users[0].id === suspended.id, 'Suspended filter excludes permanent bans and expired suspension');
  const bannedOnly = await get('q=' + prefix + '&status=banned');
  verify(bannedOnly.total === 1 && bannedOnly.users[0].id === banned.id, 'Banned filter matches permanent restriction');
  const both = await get('q=' + prefix + '&status=suspended&status=banned&newcomers=1');
  verify(both.total === 2, 'Both status filters combine with search and newcomer window');
  const admins = await get('q=' + prefix + '&admins=1&newcomers=1');
  verify(admins.total === 1 && admins.users[0].id === promoted.id, 'Admin and newcomer filters intersect with search');
  const newcomers = await get('q=' + prefix + '&newcomers=1');
  verify(newcomers.total === 7 && !newcomers.users.some(user => user.id === old.id), 'Newcomers excludes accounts older than seven days');
  verify((await get('q=' + prefix + '&admins=1&status=banned')).total === 0, 'Contradictory filters show an empty result');
  verify((await get('q=' + encodeURIComponent("%' OR 1=1 --"))).total === 0, 'Search treats wildcard and SQL syntax literally');
  for (const query of ['status=unknown', 'admins=yes', 'newcomers=30', 'q=' + 'x'.repeat(101)])
    verify((await manager.api('/api/admin/users?' + query)).status === 400, `Malformed query rejected: ${query.slice(0, 30)}`);
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(url + '/login');
    await page.getByLabel('البريد الإلكتروني', { exact: true }).fill(manager.email);
    await page.getByLabel('كلمة المرور', { exact: true }).fill(manager.password);
    await page.getByRole('button', { name: 'تسجيل الدخول', exact: true }).click();
    await expect(page).toHaveURL(url + '/admin/dashboard');
    await page.goto(url + '/admin/dashboard/users');
    await page.getByRole('searchbox').fill(prefix);
    await page.getByRole('button', { name: 'تطبيق البحث والفلاتر' }).click();
    await expect(page).toHaveURL(new RegExp('q=' + prefix));
    await expect(page.locator('.lms-admin-table tbody tr')).toHaveCount(5);
    await page.getByRole('link', { name: 'التالي', exact: true }).click();
    await expect(page).toHaveURL(new RegExp('page=2.*q=' + prefix));
    await expect(page.locator('.lms-admin-table tbody tr')).toHaveCount(3);
    await page.getByLabel('المنضمون خلال آخر ٧ أيام').check();
    await page.getByRole('button', { name: 'تطبيق البحث والفلاتر' }).click();
    await expect(page).toHaveURL(new RegExp('newcomers=1'));
    verify(!new URL(page.url()).searchParams.has('page'), 'Changing filters resets pagination to page one');
    await expect(page.locator('.lms-admin-table tbody tr')).toHaveCount(5);
    await page.getByLabel('معلّق', { exact: true }).check();
    await page.getByLabel('محظور', { exact: true }).check();
    await page.getByRole('button', { name: 'تطبيق البحث والفلاتر' }).click();
    await expect(page.locator('.lms-admin-table tbody tr')).toHaveCount(2);
    verify(await page.getByRole('searchbox').inputValue() === prefix, 'Combined filters preserve search');
    await page.screenshot({ path: 'docs/evidence/admin-dashboard/filters-mobile.png', fullPage: true });
    await page.reload(); await expect(page.getByLabel('معلّق', { exact: true })).toBeChecked();
    await page.goBack(); await expect(page.getByLabel('معلّق', { exact: true })).not.toBeChecked();
    verify(true, 'Filter values survive refresh and browser history');
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      verify(await page.evaluate(() => Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) <= innerWidth), `Search/filter UI fits ${width}px`);
    }
    await page.getByRole('link', { name: 'مسح الفلاتر', exact: true }).click();
    await expect(page).toHaveURL(url + '/admin/dashboard/users');
    await expect(page.getByRole('searchbox')).toHaveValue('');
    verify((await page.locator('.lms-admin-table tbody tr').count()) <= 5, 'Clear filters keeps five-record page limit');
    verify(errors.length === 0, 'Search/filter browser has no JavaScript errors');
  } finally { await browser.close(); }
};

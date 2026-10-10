/* eslint-disable @typescript-eslint/no-require-imports -- Isolated real-account access regression. */
const { chromium, expect } = require('@playwright/test');
module.exports = async function dashboardAccess({ url, student, verify }) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const login = async () => {
    await page.goto(url + '/ta3allam/login');
    await page.getByLabel('البريد الإلكتروني', { exact: true }).fill(student.email);
    await page.getByLabel('كلمة المرور', { exact: true }).fill(student.password);
    await page.getByRole('button', { name: 'تسجيل الدخول', exact: true }).click();
    await expect(page).toHaveURL(/\/ta3allam\/dashboard$/);
  };
  try {
    await login();
    const admin = await context.request.get(url + '/api/admin/courses/7days-freelance');
    verify(admin.status() === 403, 'Signed-in student cannot use admin course APIs');
    await context.clearCookies();
    await page.locator('a[href="/ta3allam/dashboard/profile"]').first().click();
    await expect(page, 'Lost session navigation').toHaveURL(/\/ta3allam\/login$/);
    verify(true, 'Lost session cannot navigate through a retained dashboard layout');
    await login();
    await page.locator('a[href="/ta3allam/dashboard/profile"]').first().click();
    await expect(page).toHaveURL(/\/ta3allam\/dashboard\/profile$/);
    await page.getByRole('button', { name: 'تسجيل الخروج', exact: true }).click();
    await expect(page, 'Logout navigation').toHaveURL(/\/ta3allam\/login$/);
    await page.waitForLoadState('load');
    await page.goBack();
    await expect(page, 'Back navigation after logout').toHaveURL(/\/ta3allam\/login$/);
    verify(true, 'Back after logout cannot restore cached dashboard content');
    const response = await context.request.get(url + '/ta3allam/dashboard', { maxRedirects: 0 });
    verify(response.status() === 307 && !(await response.text()).includes('lms-dashboard'), 'Logout removes access before dashboard rendering');
  } finally { await browser.close(); }
};

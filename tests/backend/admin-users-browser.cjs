/* eslint-disable @typescript-eslint/no-require-imports -- Isolated browser acceptance checks. */
const { chromium, expect } = require('@playwright/test');
module.exports = async function userManagementBrowser({ manager, target, verify, url }) {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(url + '/login');
    await page.getByLabel('البريد الإلكتروني', { exact: true }).fill(manager.email);
    await page.getByLabel('كلمة المرور', { exact: true }).fill(manager.password);
    await page.getByRole('button', { name: 'تسجيل الدخول', exact: true }).click();
    await page.waitForURL('**/dashboard');
    await page.goto(url + '/admin/dashboard');
    await expect(page.getByRole('heading', { name: 'إدارة المستخدمين', exact: true })).toBeVisible();
    const row = page.getByRole('row').filter({ hasText: target.email });
    await expect(row).toContainText('Moderation Student');
    await row.getByRole('combobox').selectOption('week');
    await row.getByRole('button', { name: 'تعليق الحساب', exact: true }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'تأكيد', exact: true }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(row).toContainText('المتبقي:');
    await row.getByRole('link', { name: 'عرض المستخدم', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'الدورات المشترك بها', exact: true })).toBeVisible();
    await expect(page.getByText('البريد الإلكتروني', { exact: true })).toBeVisible();
    await expect(page.getByText('المتبقي:', { exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'استعادة الوصول', exact: true }).click();
    await expect(page.getByText('نشط', { exact: true })).toBeVisible();
    await page.setViewportSize({ width: 390, height: 900 });
    verify(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'User detail fits mobile viewport');
    await page.goto(url + '/admin/dashboard');
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('row').filter({ hasText: target.email })).toBeVisible();
    const viewport = await page.evaluate(() => ({ root: document.documentElement.scrollWidth, body: document.body.scrollWidth, width: innerWidth }));
    verify(Math.max(viewport.root, viewport.body) <= viewport.width, `User table scrolls within mobile viewport (${JSON.stringify(viewport)})`);
    await page.screenshot({ path: 'docs/evidence/backend/admin-users-390.png', fullPage: true });
    verify(errors.length === 0, 'Admin users dashboard has no browser JavaScript errors');
  } finally { await browser.close(); }
};

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
    await expect(page).toHaveURL(url + '/admin/dashboard');
    verify(true, 'Administrator login automatically opens administrator dashboard');
    await expect(page.getByRole('link', { name: 'المستخدمون', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'الدورات', exact: true })).toBeVisible();
    await page.goto(url + '/dashboard');
    await expect(page).toHaveURL(url + '/admin/dashboard');
    verify(true, 'Generic dashboard link resolves to administrator dashboard');
    await page.goto(url + '/admin/dashboard');
    await expect(page.getByRole('heading', { name: 'إدارة المستخدمين', exact: true })).toBeVisible();
    const row = page.getByRole('row').filter({ hasText: target.email });
    await expect(row).toContainText('Moderation Student');
    await row.getByRole('button', { name: 'إدارة الحساب', exact: true }).click();
    const management = page.getByRole('dialog', { name: 'إدارة الحساب', exact: true });
    await expect(management).toBeVisible();
    await management.getByRole('combobox').selectOption('week');
    await management.getByRole('button', { name: 'تعليق الحساب', exact: true }).click();
    await expect(page.getByRole('dialog', { name: 'تأكيد الإجراء', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'تأكيد الإجراء', exact: true })).toHaveCount(0);
    await expect(management.getByRole('button', { name: 'تعليق الحساب', exact: true })).toBeFocused();
    await management.getByRole('button', { name: 'تعليق الحساب', exact: true }).click();
    await page.getByRole('button', { name: 'تأكيد', exact: true }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(row).toContainText('المتبقي:');
    await row.getByRole('link', { name: 'عرض المستخدم', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'الدورات المشترك بها', exact: true })).toBeVisible();
    await expect(page.getByText('البريد الإلكتروني', { exact: true })).toBeVisible();
    await expect(page.getByText('المتبقي:', { exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'إدارة الحساب', exact: true }).click();
    await page.getByRole('button', { name: 'استعادة الوصول', exact: true }).click();
    await expect(page.getByText('نشط', { exact: true })).toBeVisible();
    await page.setViewportSize({ width: 390, height: 900 });
    verify(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'User detail fits mobile viewport');
    await page.goto(url + '/admin/dashboard');
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('row').filter({ hasText: target.email })).toBeVisible();
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const viewport = await page.evaluate(() => ({ root: document.documentElement.scrollWidth, body: document.body.scrollWidth, width: innerWidth }));
      verify(Math.max(viewport.root, viewport.body) <= viewport.width, `Account records fit viewport (${JSON.stringify(viewport)})`);
      if (width <= 1024) {
        const name = await row.locator('.lms-admin-name').boundingBox();
        verify(name.width >= 150, `Account identity has readable width at ${width}px`);
      }
      await row.getByRole('button', { name: 'إدارة الحساب', exact: true }).click();
      await expect(management).toBeVisible();
      const bounds = await management.boundingBox();
      verify(bounds.x >= 0 && bounds.x + bounds.width <= width && bounds.y >= 0 && bounds.y + bounds.height <= 900, `Management dialog fits ${width}px viewport`);
      const targets = await management.locator('button, select').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().height));
      verify(targets.every(height => height >= 44), `Dialog controls have 44px touch targets at ${width}px`);
      await page.keyboard.press('Tab');
      verify(await management.evaluate(element => element.contains(document.activeElement)), `Keyboard focus remains inside dialog at ${width}px`);
      if (width === 390) await page.screenshot({ path: 'docs/evidence/backend/admin-users-management-390.png', fullPage: true });
      await page.keyboard.press('Escape');
      await expect(management).not.toBeVisible();
      await expect(row.getByRole('button', { name: 'إدارة الحساب', exact: true })).toBeFocused();
    }
    await page.setViewportSize({ width: 390, height: 900 });
    await page.screenshot({ path: 'docs/evidence/backend/admin-users-390.png', fullPage: true });
    verify(errors.length === 0, 'Admin users dashboard has no browser JavaScript errors');
    await page.getByRole('button', { name: 'تسجيل الخروج', exact: true }).click();
    await page.waitForURL('**/login');
    await page.getByLabel('البريد الإلكتروني', { exact: true }).fill(target.email);
    await page.getByLabel('كلمة المرور', { exact: true }).fill(target.password);
    await page.getByRole('button', { name: 'تسجيل الدخول', exact: true }).click();
    await expect(page).toHaveURL(url + '/dashboard');
    await expect(page.getByRole('link', { name: 'المستخدمون', exact: true })).toHaveCount(0);
    verify(true, 'Student login stays on student dashboard without administrator navigation');
  } finally { await browser.close(); }
};

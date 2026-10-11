/* eslint-disable @typescript-eslint/no-require-imports -- Browser checks against isolated local accounts. */
const { chromium, expect } = require('@playwright/test');
const fs = require('node:fs');
module.exports = async function browserChecks({ url, config, admin, identities, verify, student }) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  fs.mkdirSync('docs/evidence/backend', { recursive: true });
  try {
    await page.goto(url + '/login');
    await page.getByLabel('البريد الإلكتروني', { exact: true }).fill(student.email);
    await page.getByLabel('كلمة المرور', { exact: true }).fill(student.password);
    await page.getByRole('button', { name: 'تسجيل الدخول', exact: true }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    verify(true, 'Browser login navigates to protected dashboard');
    await page.getByRole('button', { name: 'قائمة الحساب', exact: true }).click();
    await page.getByRole('button', { name: 'تسجيل الخروج', exact: true }).click();
    await expect(page).toHaveURL(/\/login$/);
    verify(true, 'Browser logout returns to login');
    await page.goto(url + '/signup');
    await page.getByRole('button', { name: 'إنشاء حساب', exact: true }).click();
    await expect(page.getByLabel('اسمك', { exact: true })).toBeFocused();
    verify(true, 'Invalid browser signup focuses first field');
    const email = `signup-browser-${Date.now()}@example.com`, password = 'Local-Test-Password-19!';
    await page.getByLabel('اسمك', { exact: true }).fill('طالب جديد');
    await page.getByLabel('البريد الإلكتروني', { exact: true }).fill(email);
    await page.getByLabel('كلمة المرور', { exact: true }).fill(password);
    await page.getByLabel('تأكيد كلمة المرور', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'إنشاء حساب', exact: true }).click();
    await expect(page.getByRole('status').filter({ hasText: 'راجع بريدك الإلكتروني' })).toBeVisible();
    verify(!page.url().endsWith('/dashboard'), 'Signup waits for email confirmation');
    const users = await admin.auth.admin.listUsers();
    const created = users.data.users.find(user => user.email === email);
    if (created) identities.push(created.id);
    verify(Boolean(created && !created.email_confirmed_at), 'Signup creates an unconfirmed real account');
    const messages = await (await fetch(config.MAILPIT_URL + '/api/v1/messages')).json();
    const message = messages.messages.find(message => message.To.some(recipient => recipient.Address === email));
    verify(Boolean(message), 'Supabase sends confirmation email to local Mailpit');
    const mail = await (await fetch(config.MAILPIT_URL + '/api/v1/message/' + message.ID)).json();
    const link = mail.HTML.match(/href="([^"]+\/auth\/v1\/verify[^\"]+)"/)?.[1].replaceAll('&amp;', '&');
    verify(Boolean(link), 'Confirmation email includes valid Auth verification link');
    await page.goto(link);
    await expect(page).toHaveURL(/\/dashboard$/);
    verify(true, 'Email verification and PKCE callback establish browser session');
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(url + '/login');
      await expect(page.locator('.lms-auth-card')).toBeVisible();
      verify(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Auth layout fits ${width}px`);
      await page.screenshot({ path: `docs/evidence/backend/login-${width}.png`, fullPage: true });
    }
    verify(errors.length === 0, 'Real authentication browser flows have no JavaScript errors');
  } finally { await browser.close(); }
};

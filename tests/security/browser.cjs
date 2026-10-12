/* eslint-disable @typescript-eslint/no-require-imports -- Browser CSP acceptance. */
const { chromium, expect } = require('@playwright/test');
module.exports = async function({ url, verify }) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const failures = [];
    page.on('pageerror', error => failures.push(error.message));
    page.on('console', message => { if (/Content Security Policy|violates.*directive/.test(message.text())) failures.push(message.text()); });
    for (const path of ['/', '/founder', '/login']) {
      const response = await page.goto(url + path);
      const headers = await response.allHeaders();
      const nonce = headers['content-security-policy'].match(/'nonce-([^']+)'/)[1];
      verify(headers['x-content-type-options'] === 'nosniff' && headers['x-frame-options'] === 'DENY', 'Security headers protect ' + path);
      verify(await page.locator('script[nonce]').first().evaluate((el, expected) => el.nonce === expected, nonce), 'Next.js hydration receives the response nonce on ' + path);
      await expect(page.locator('body')).toBeVisible();
    }
    verify(failures.length === 0, 'Real browsers render and hydrate without CSP violations');
    // Simulate a reflected HTML injection, not DevTools' privileged JS execution.
    await page.route('**/login?csp-test=1', async route => {
      const response = await route.fetch();
      const body = (await response.text()).replace('</body>', '<script>window.__injected=true</script></body>');
      await route.fulfill({ response, body });
    });
    await page.goto(url + '/login?csp-test=1');
    verify(await page.evaluate(() => window.__injected !== true), 'Untrusted inline scripts are blocked by CSP');
  } finally { await browser.close(); }
};

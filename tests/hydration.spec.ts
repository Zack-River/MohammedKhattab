import { expect, test } from "@playwright/test";

test("extension-injected body attributes do not warn or prevent hydration", async ({
  page,
  baseURL,
}) => {
  const hydrationWarnings: string[] = [];
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /hydrat|didn't match/i.test(message.text())
    )
      hydrationWarnings.push(message.text());
  });
  // Simulate a document-start extension without altering Next's streamed response.
  await page.addInitScript(() => {
    const inject = () => {
      if (!document.body) return false;
      document.body.setAttribute("cz-shortcut-listen", "true");
      return true;
    };
    if (!inject()) {
      const observer = new MutationObserver(() => {
        if (inject()) observer.disconnect();
      });
      observer.observe(document, { childList: true, subtree: true });
    }
  });
  // Next's dev-origin guard permits localhost by default, unlike its IP alias.
  await page.goto(baseURL!.replace("127.0.0.1", "localhost"));
  await expect(page.locator("body")).toHaveAttribute(
    "cz-shortcut-listen",
    "true",
  );
  await expect(page.locator('[data-motion="hero-heading"]')).toHaveAttribute(
    "data-reveal-state",
    /entering|visible/,
  );
  expect(hydrationWarnings).toEqual([]);
  await page.locator('[data-rhythm-choice="energetic"]').click();
  await expect(page.locator("[data-final-edit]")).toHaveAttribute(
    "data-final-rhythm",
    "energetic",
  );
  expect(hydrationWarnings).toEqual([]);
});

test("body tolerance leaves child hydration warnings enabled in development", async ({
  page,
  request,
  baseURL,
}) => {
  const target = baseURL!.replace("127.0.0.1", "localhost");
  const response = await request.get(target);
  test.skip(
    !(await response.text()).includes("browser_dev_hmr-client"),
    "React attribute mismatch diagnostics require a development server",
  );
  const warnings: string[] = [];
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /hydrat|didn't match/i.test(message.text())
    )
      warnings.push(message.text());
  });
  await page.addInitScript(() => {
    const observer = new MutationObserver(() => {
      const heading = document.querySelector("h1");
      if (!heading) return;
      heading.setAttribute("data-test-child-mismatch", "injected");
      observer.disconnect();
    });
    observer.observe(document, { childList: true, subtree: true });
  });
  await page.goto(target);
  await expect
    .poll(() =>
      warnings.some((message) => message.includes("data-test-child-mismatch")),
    )
    .toBe(true);
});

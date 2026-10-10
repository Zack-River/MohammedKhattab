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
  await page.goto(baseURL!.replace("127.0.0.1", "localhost") + "/7days-freelance");
  await expect(page.locator("body")).toHaveAttribute(
    "cz-shortcut-listen",
    "true",
  );
  expect(hydrationWarnings).toEqual([]);
  await page.locator(".faq-question-btn").first().click();
  await expect(page.locator(".faq-question-btn").first()).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  expect(hydrationWarnings).toEqual([]);
});


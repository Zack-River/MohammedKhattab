import { expect,test } from "@playwright/test";
test("body tolerance leaves child hydration warnings enabled in development", async ({
  page,
  baseURL,
}) => {
  const target = baseURL!.replace("127.0.0.1", "localhost") + "/7days-freelance";
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

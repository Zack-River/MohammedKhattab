import { expect, test } from "@playwright/test";

test("T24 filtered replacements enter on the retained grid", async ({
  page,
}) => {
  await page.goto("/ta3allam/courses");
  await expect(page.locator(".lms-course-card")).toHaveCount(6);
  // Remove motion cards first: retained occurrences must not replay.
  await page.getByRole("link", { name: "مونتاج الفيديو", exact: true }).click();
  await expect(page.locator(".lms-course-card")).toHaveCount(3);
  await page.locator("[data-reveal-scope=cards]").evaluate((element) => {
    element.setAttribute("data-retained-grid", "yes");
  });
  await page.getByRole("link", { name: "موشن جرافيك", exact: true }).click();
  await expect(page.locator(".lms-course-card")).toHaveCount(1);
  await expect(page.locator("[data-retained-grid=yes]")).toHaveCount(1);
  await expect
    .poll(
      () =>
        page
          .locator(".lms-card-entrance")
          .evaluate(
            (element) =>
              element
                .getAnimations()
                .filter((animation) => animation.playState === "running")
                .length,
          ),
      { timeout: 800 },
    )
    .toBe(1);
});

test("T27 reduced-motion initial load subscribes to preference changes", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = MediaQueryList.prototype.addEventListener;
    MediaQueryList.prototype.addEventListener = function (
      ...args: Parameters<typeof original>
    ) {
      if (this.media.includes("prefers-reduced-motion") && args[0] === "change")
        document.documentElement.dataset.motionSubscribed = "true";
      return original.apply(this, args);
    };
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/ta3allam");
  await expect(page.locator("html")).toHaveAttribute(
    "data-motion-subscribed",
    "true",
  );
  await expect(page.locator(".faq-header")).toBeAttached();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page
    .locator(".faq-header")
    .evaluate((element) => element.scrollIntoView({ behavior: "instant" }));
  await expect
    .poll(
      () =>
        page
          .locator(".faq-header")
          .evaluate(
            (element) =>
              element
                .getAnimations()
                .filter((animation) => animation.playState === "running")
                .length,
          ),
      { timeout: 800 },
    )
    .toBe(1);
});

test("T29 mobile FAQ panel has zero closed height", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/ta3allam");
  const panel = page.locator(".faq-answer-panel").first();
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  expect(
    await panel.evaluate((element) => element.getBoundingClientRect().height),
  ).toBeLessThanOrEqual(1);
  await page.locator(".faq-question-btn").first().click();
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  expect(
    await panel.evaluate((element) => element.getBoundingClientRect().height),
  ).toBeGreaterThan(1);
  await page.locator(".faq-question-btn").first().click();
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  expect(
    await panel.evaluate((element) => element.getBoundingClientRect().height),
  ).toBeLessThanOrEqual(1);
});

test("T30 production reveal timing is milliseconds after CSS optimization", async ({
  page,
}) => {
  await page.goto("/ta3allam/courses");
  const entrance = page.locator(".lms-card-entrance").last();
  await expect
    .poll(() =>
      entrance.evaluate((element) =>
        element
          .getAnimations()
          .map((animation) => animation.effect?.getTiming().duration),
      ),
    )
    .toContain(500);
  await entrance.evaluate((element) =>
    element.scrollIntoView({ behavior: "instant" }),
  );
  await expect
    .poll(() =>
      entrance.evaluate((element) => {
        const css = getComputedStyle(element);
        return Number(css.opacity) > 0 && Number(css.opacity) < 1;
      }),
    )
    .toBe(true);
});

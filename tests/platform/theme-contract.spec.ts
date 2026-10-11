import { expect, test } from "@playwright/test";

test("T06 radius does not control spacing or footer measure", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const measure = () =>
    page
      .locator(".lms-navbar,.lms-secondary-button,.lms-footer p")
      .evaluateAll((elements) =>
        elements.map((element) => {
          const css = getComputedStyle(element);
          return { padding: css.padding, gap: css.gap, width: css.maxWidth };
        }),
      );
  const before = await measure();
  await page.evaluate(() => {
    document.documentElement.style.setProperty("--radius-md", "40px");
    document.documentElement.style.setProperty("--portfolio-radius", "55px");
    document.documentElement.style.setProperty(
      "--measure-testimonial-summary",
      "2ch",
    );
  });
  expect(await measure()).toEqual(before);
  const spacing = await page
    .locator(".lms-secondary-button")
    .first()
    .evaluate((node) => ({
      padding: getComputedStyle(node).padding,
      radius: getComputedStyle(node).borderRadius,
    }));
  await page.evaluate(() =>
    document.documentElement.style.setProperty("--space-control", "43px"),
  );
  const changed = await page
    .locator(".lms-secondary-button")
    .first()
    .evaluate((node) => ({
      padding: getComputedStyle(node).padding,
      radius: getComputedStyle(node).borderRadius,
    }));
  expect(changed.radius).toBe(spacing.radius);
  expect(changed.padding).not.toBe(spacing.padding);
});

test("T08 palette follows primary without changing production identity", async ({
  page,
}) => {
  await page.goto("/");
  const tokens = () =>
    page.evaluate(() => {
      const sample = document.createElement("div");
      document.body.append(sample);
      const values = [
        "--primary-red-glow",
        "--primary-red-subtle",
        "--primary-red-border",
        "--color-ffa59c",
        "--color-d42010",
      ].map((token) => {
        sample.style.backgroundColor = `var(${token})`;
        return getComputedStyle(sample).backgroundColor;
      });
      sample.remove();
      return values;
    });
  const before = await tokens();
  await page.evaluate(() =>
    document.documentElement.style.setProperty("--primary-red", "#2255fc"),
  );
  const after = await tokens();
  after.forEach((color, index) => expect(color).not.toBe(before[index]));
  expect(after.every((color) => color !== "rgba(0, 0, 0, 0)")).toBe(true);
});

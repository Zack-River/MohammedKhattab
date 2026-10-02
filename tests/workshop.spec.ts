import { expect, test } from "@playwright/test";
import { getSafeEmbedUrl } from "../app/lib/video";
import { contactLinks } from "../app/config/site";

test.beforeEach(async ({ page }) => {
  // External media must not make local interaction checks depend on the network.
  await page.route(/https:\/\/.*youtube.*/, (route) =>
    route.fulfill({ body: "" }),
  );
});

test("stats animate when visible and retain their formatted target", async ({
  page,
}) => {
  await page.goto("/");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  // Capture changes rather than racing a short-lived intermediate value.
  await page
    .locator("[data-stat]")
    .first()
    .evaluate((element) => {
      const observed: string[] = [];
      (window as Window & { statChanges?: string[] }).statChanges = observed;
      new MutationObserver(() =>
        observed.push(element.textContent ?? ""),
      ).observe(element, {
        childList: true,
        characterData: true,
        subtree: true,
      });
      element.scrollIntoView({ block: "center", behavior: "instant" });
    });
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as Window & { statChanges?: string[] }).statChanges?.includes(
          "00+",
        ),
      ),
    )
    .toBe(true);
  await expect(page.locator("[data-stat]").first()).toHaveText("03+");
  await expect(page.locator("[data-stat]").nth(2)).toHaveText("100%");
  expect(errors).toEqual([]);
});

test("FAQ is exclusive and its accessibility references resolve", async ({
  page,
}) => {
  await page.goto("/");
  const questions = page.locator("[data-faq-question]");
  await questions.nth(0).click();
  await expect(questions.nth(0)).toHaveAttribute("aria-expanded", "true");
  const panelId = await questions.nth(0).getAttribute("aria-controls");
  await expect(page.locator(`[id="${panelId}"]`)).toHaveAttribute(
    "aria-hidden",
    "false",
  );
  await questions.nth(1).click();
  await expect(questions.nth(0)).toHaveAttribute("aria-expanded", "false");
  await expect(questions.nth(1)).toHaveAttribute("aria-expanded", "true");
  await questions.nth(1).click();
  await expect(questions.nth(1)).toHaveAttribute("aria-expanded", "false");
});

test("mobile navigation closes on Escape, outside click and selection", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.locator("[data-menu-toggle]");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  // The open menu overlays the heading; click exposed page space below it.
  await page.mouse.click(8, 820);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page.locator("[data-navigation] a").last().click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("video opens a permitted autoplay embed and all enrollment links agree", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("[data-video-play]").click();
  const source = await page.locator("[data-hero-video]").getAttribute("src");
  expect(new URL(source!).searchParams.get("autoplay")).toBe("1");
  const links = await page
    .locator('a[href^="https://wa.me/"]')
    .evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("href")),
    );
  expect(links.length).toBeGreaterThan(1);
  expect(links.every((link) => link === contactLinks.whatsapp)).toBe(true);
});

test("reduced motion preserves content and timeline advances and resets", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const days = page.locator("[data-timeline-day]");
  await days
    .last()
    .evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
  await expect(days.last()).toHaveAttribute("aria-current", "step");
  await expect(days.first()).toHaveAttribute("data-status", "passed");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(
    page.locator('[data-timeline-day][aria-current="step"]'),
  ).toHaveCount(0);
  await page
    .locator("[data-stat]")
    .first()
    .evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
  await expect(page.locator("[data-stat]").first()).toHaveText("03+");
  await expect(page.locator("[data-stat]").nth(2)).toHaveText("100%");
});

test("embed policy rejects malformed, non-HTTPS and unrelated hosts", () => {
  for (const raw of [
    "not-a-url",
    "http://youtube.com/embed/abc",
    "https://youtube.com.evil.example/embed/abc",
    "javascript:alert(1)",
  ]) {
    expect(getSafeEmbedUrl(raw)).toBeNull();
  }
  expect(getSafeEmbedUrl("https://www.youtube.com/embed/abc")).toContain(
    "autoplay=1",
  );
});

test("responsive layouts fit and mobile state resets at the shared lg breakpoint", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.locator("[data-menu-toggle]");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  const breakpoint = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return (
      parseFloat(style.getPropertyValue("--breakpoint-lg")) *
      parseFloat(style.fontSize)
    );
  });
  await page.setViewportSize({ width: breakpoint, height: 900 });
  await expect(toggle).toBeHidden();
  await page.setViewportSize({ width: breakpoint - 1, height: 900 });
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  for (const width of [320, 390, 768, breakpoint - 1, breakpoint, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    const clipped = await page
      .locator("h1, h2, header a, [data-menu-toggle]")
      .evaluateAll((elements) =>
        elements
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            return (
              rect.width > 0 && (rect.left < -1 || rect.right > innerWidth + 1)
            );
          })
          .map((element) => element.textContent),
      );
    expect(clipped, `clipped content at ${width}px`).toEqual([]);
  }
});

test("live reduced-motion changes stop the editing story and settle visible counters", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.setViewportSize({ width: 1440, height: 1000 });
  const frame = page.locator("[data-edit-frame]");
  await page
    .locator("[data-editing-story]")
    .evaluate((element) =>
      element.scrollIntoView({ block: "start", behavior: "instant" }),
    );
  await expect
    .poll(() =>
      frame.evaluate((element) => element.getAttribute("style") ?? ""),
    )
    .not.toBe("");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() =>
      frame.evaluate((element) => element.getAttribute("style") ?? ""),
    )
    .toBe("");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page
    .locator("[data-stat]")
    .first()
    .evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
  await expect
    .poll(() => page.locator("[data-stat]").nth(2).textContent())
    .not.toBe("100%");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-stat]").nth(2)).toHaveText("100%");
  const portrait = page.locator("[data-instructor-image]");
  await expect
    .poll(() =>
      portrait.evaluate(
        (element) => (element as HTMLImageElement).naturalWidth,
      ),
    )
    .toBeGreaterThan(0);
});

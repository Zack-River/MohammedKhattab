import { expect, test } from "@playwright/test";
import { projectRoutes } from "../config/project-navigation";

test("restores the approved section order and original workshop content", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/7days-freelance");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "أقوى الإديتورز",
  );
  expect(
    await page
      .locator("main > section")
      .evaluateAll((sections) => sections.map((section) => section.id)),
  ).toEqual([
    "hero",
    "clients",
    "transformation",
    "roadmap",
    "testimonials",
    "instructor",
    "guarantee",
    "faq",
    "enroll",
  ]);
  await expect(page.locator(".reel-card")).toHaveCount(4);
  await expect(page.locator(".day-item")).toHaveCount(7);
  await expect(page.locator(".review-card")).toHaveCount(3);
  await expect(page.locator(".featured-review-card")).toHaveCount(1);
  expect(
    await page.evaluate(() => ({
      background: getComputedStyle(document.body).backgroundColor,
      brand: getComputedStyle(document.documentElement)
        .getPropertyValue("--primary-red")
        .trim(),
      direction: document.documentElement.dir,
    })),
  ).toEqual({
    background: "rgb(16, 19, 23)",
    brand: "#fc3522",
    direction: "rtl",
  });
  expect(errors).toEqual([]);
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`all content and images fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/7days-freelance");
    await page.evaluate(async () => {
      await document.fonts.ready;
      // Marquee duplicates can stay outside the viewport indefinitely.
      // Load every local image for this asset check, including those duplicates.
      document.querySelectorAll("img").forEach((image) => {
        image.loading = "eager";
      });
      // Trigger lazy images as the visitor reads the full page.
      for (const section of document.querySelectorAll("main > section")) {
        section.scrollIntoView();
        await new Promise((resolve) => setTimeout(resolve, 80));
      }
    });
    await expect
      .poll(() =>
        page.evaluate(() =>
          Array.from(document.images).every(
            (image) => image.complete && image.naturalWidth > 0,
          ),
        ),
      )
      .toBe(true);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    expect(
      await page
        .locator(".day-card")
        .evaluateAll((cards) =>
          cards.every(
            (card) =>
              card.getBoundingClientRect().left >= 0 &&
              card.getBoundingClientRect().right <= innerWidth,
          ),
        ),
    ).toBe(true);
  });
}

test("mobile navigation supports links, outside click, Escape, and resizing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/7days-freelance");
  const toggle = page.locator("[data-menu-toggle]");
  const links = page.locator(".nav-links");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(links).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(links).not.toBeVisible();
  await toggle.click();
  await page.mouse.click(5, 850);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page.locator('.nav-links a[href="#roadmap"]').click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(links).toBeVisible();
  await page.setViewportSize({ width: 390, height: 900 });
  await expect(links).not.toBeVisible();
});

test("FAQ has linked accessible panels and one open answer", async ({
  page,
}) => {
  await page.goto("/7days-freelance");
  const questions = page.locator(".faq-question-btn");
  await questions.first().click();
  await expect(questions.first()).toHaveAttribute("aria-expanded", "true");
  const panel = await questions.first().getAttribute("aria-controls");
  await expect(page.locator(`[id="${panel}"]`)).toBeVisible();
  await questions.nth(1).click();
  await expect(questions.first()).toHaveAttribute("aria-expanded", "false");
  await expect(questions.nth(1)).toHaveAttribute("aria-expanded", "true");
  await questions.nth(1).press("Enter");
  await expect(questions.nth(1)).toHaveAttribute("aria-expanded", "false");
});

test("hovering a day badge highlights its own card and scrolling fills the roadmap", async ({
  page,
}) => {
  await page.goto("/7days-freelance");
  const day = page.locator(".day-item").nth(2);
  await day.scrollIntoViewIfNeeded();
  await day.locator(".day-badge-num").hover();
  await expect
    .poll(() =>
      day
        .locator(".day-card")
        .evaluate((card) => getComputedStyle(card).transform),
    )
    .not.toBe("none");
  await page.locator(".day-item").last().scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator(".timeline-progress")
        .evaluate((line) =>
          Number(
            getComputedStyle(line).transform.match(
              /matrix\([^,]+, [^,]+, [^,]+, ([^,]+)/,
            )?.[1] ?? 0,
          ),
        ),
    )
    .toBeGreaterThan(0.5);
});

test("hero MP4 loads only after playback and enrollment links are working contact URLs", async ({
  page,
}) => {
  await page.goto("/7days-freelance");
  await expect(
    page.locator(".hero-video-shell video, .hero-video-shell iframe"),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "تشغيل الفيديو التعريفي" }).click();
  await expect(page.locator(".hero-video-shell video")).toHaveAttribute(
    "src",
    "/assets/video/workshop-intro.mp4",
  );
  await expect(page.locator(".hero-video-shell iframe")).toHaveCount(0);
  expect(
    await page
      .locator("a.btn-primary:not([data-instructor-actions] a)")
      .evaluateAll((links) =>
        links.every((link) =>
          (link as HTMLAnchorElement).href.startsWith(
            "https://wa.me/201558590242",
          ),
        ),
      ),
  ).toBe(true);
  await expect(page.locator("[data-instructor-actions] a")).toHaveAttribute("href", projectRoutes.portfolio);
  await expect(page.locator(".footer-social-links a")).toHaveCount(4);
});

test("reduced motion keeps the same layout without decorative animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/7days-freelance");
  expect(
    await page
      .locator(".creators-track")
      .evaluate((track) => getComputedStyle(track).animationName),
  ).toBe("none");
  expect(
    await page
      .locator(".hero-video-shell")
      .evaluate((shell) => getComputedStyle(shell).animationName),
  ).toBe("none");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

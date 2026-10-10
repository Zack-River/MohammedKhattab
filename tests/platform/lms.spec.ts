import { expect, test } from "@playwright/test";

test("approved identity and landing content", async ({ page }) => {
  await page.goto("/ta3allam");
  await expect(page.locator("h1")).toContainText("خطوة صغيرة اليوم");
  await expect(page.locator(".lms-course-card")).toHaveCount(3);
  await expect(page.locator(".faq-item")).toHaveCount(5);
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(() => ({
      brand: getComputedStyle(document.documentElement)
        .getPropertyValue("--primary-red")
        .trim(),
      bg: getComputedStyle(document.body).backgroundColor,
      font: getComputedStyle(document.body).fontFamily,
      dir: document.documentElement.dir,
    })),
  ).toMatchObject({
    brand: "#fc3522",
    bg: "rgb(16, 19, 23)",
    font: expect.stringContaining("IBM Plex Sans Arabic"),
    dir: "rtl",
  });
});

test("catalog filters and search", async ({ page }) => {
  await page.goto("/ta3allam/courses");
  await expect(page.locator(".lms-course-card")).toHaveCount(6);
  await page.getByRole("link", { name: "موشن جرافيك", exact: true }).click();
  await expect(page.locator(".lms-course-card")).toHaveCount(1);
  await page.goto("/ta3allam/courses");
  await page.getByRole("searchbox").fill("Photoshop");
  await page.getByRole("button", { name: "ابحث", exact: true }).click();
  await expect(page.locator(".lms-course-card")).toHaveCount(1);
  await page.getByRole("searchbox").fill("missing-term");
  await page.getByRole("button", { name: "ابحث", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "لم نجد دورة بهذا البحث" }),
  ).toBeVisible();
});

test("enrollment and progress persist", async ({ page }) => {
  await page.goto("/ta3allam/courses/motion-essentials");
  await page.getByRole("button", { name: "جرّب التسجيل في الدورة" }).click();
  await expect(page).toHaveURL(/learn\/motion-essentials\/motion-workspace/);
  await page.getByRole("button", { name: "أتممت هذا الدرس" }).click();
  await expect(
    page.getByRole("button", { name: "تم إتمام الدرس", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "تم إتمام الدرس", exact: true }),
  ).toBeVisible();
  await page.goto("/ta3allam/dashboard/courses");
  await expect(page.locator(".lms-course-card")).toHaveCount(2);
  await expect(
    page.locator(".lms-course-card").filter({ hasText: "After Effects" }),
  ).toContainText("25%");
});

test("deferred video and saved lesson notes", async ({ page }) => {
  await page.route("https://www.youtube-nocookie.com/**", (route) =>
    route.fulfill({ contentType: "text/html", body: "<title>Preview</title>" }),
  );
  await page.goto("/ta3allam/learn/editing-foundations/first-cut");
  await expect(page.locator("iframe")).toHaveCount(0);
  await page
    .getByLabel("ملاحظاتك", { exact: true })
    .fill("راجع اختيار اللقطات.");
  await page.reload();
  await expect(page.getByLabel("ملاحظاتك", { exact: true })).toHaveValue(
    "راجع اختيار اللقطات.",
  );
  await page.getByRole("button", { name: /تشغيل أول كات/ }).click();
  await expect(page.locator("iframe")).toHaveAttribute(
    "src",
    /youtube-nocookie\.com/,
  );
});

test("demo entry and profile updates", async ({ page }) => {
  await page.goto("/ta3allam/signup");
  await page.getByLabel("اسمك", { exact: true }).fill("طالب التجربة");
  await page
    .getByLabel("البريد الإلكتروني", { exact: true })
    .fill("student@example.com");
  await page.getByLabel("كلمة المرور", { exact: true }).fill("demo-pass-123");
  await page.getByLabel("تأكيد كلمة المرور", { exact: true }).fill("demo-pass-123");
  await page.getByRole("button", { name: "إنشاء حساب تجريبي" }).click();
  await expect(page).toHaveURL(/dashboard$/);
  await expect(page.locator(".lms-page-heading")).toContainText("طالب التجربة");
  await page.goto("/ta3allam/dashboard/profile");
  await expect(page.getByLabel("اسمك", { exact: true })).toHaveValue(
    "طالب التجربة",
  );
  await page.getByLabel("اسمك", { exact: true }).fill("طالب جديد");
  await page.getByRole("button", { name: "حفظ التغييرات" }).click();
  await expect(page.getByRole("status")).toHaveText("تم حفظ بياناتك");
});

test("API validation, isolation, downloads and earned certificates", async ({
  request,
  playwright,
}) => {
  expect(
    (await (await request.get("/api/courses?category=motion")).json()).courses,
  ).toHaveLength(1);
  expect((await request.get("/api/courses/missing")).status()).toBe(404);
  expect(
    (
      await request.post("/api/profile", {
        data: { name: "a", email: "invalid" },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/enrollments", {
        headers: { origin: "https://other.test" },
        data: { courseSlug: "motion-essentials" },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/progress", {
        data: {
          courseSlug: "motion-essentials",
          lessonId: "keyframes",
          completed: true,
        },
      })
    ).status(),
  ).toBe(403);
  expect(
    (await request.get("/api/certificates/editing-foundations")).status(),
  ).toBe(403);
  const course = (
    await (await request.get("/api/courses/editing-foundations")).json()
  ).course;
  for (const courseModule of course.modules)
    for (const lesson of courseModule.lessons)
      expect(
        (
          await request.post("/api/progress", {
            data: {
              courseSlug: course.slug,
              lessonId: lesson.id,
              completed: true,
            },
          })
        ).ok(),
      ).toBeTruthy();
  expect(
    (await request.get("/api/certificates/editing-foundations")).status(),
  ).toBe(200);
  const other = await playwright.request.newContext({
    baseURL: process.env.TEST_BASE_URL ?? "http://localhost:3040",
  });
  expect(
    (await other.get("/api/certificates/editing-foundations")).status(),
  ).toBe(403);
  await other.dispose();
  const resource = await request.get("/api/resources/project-checklist");
  expect(resource.headers()["content-disposition"]).toContain("attachment");
  expect(await resource.text()).toContain("\n\n");
});

for (const width of [320, 768, 1440])
  test(`all screens fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (/hydration|hydrated|didn.t match/i.test(message.text()))
        errors.push(message.text());
    });
    for (const route of [
      "/ta3allam",
      "/ta3allam/courses",
      "/ta3allam/courses/editing-foundations",
      "/ta3allam/dashboard",
      "/ta3allam/dashboard/courses",
      "/ta3allam/dashboard/resources",
      "/ta3allam/dashboard/certificates",
      "/ta3allam/dashboard/profile",
      "/ta3allam/learn/editing-foundations/first-cut",
      "/ta3allam/login",
    ]) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        route,
      ).toBeLessThanOrEqual(width);
    }
    expect(errors).toEqual([]);
  });

test("mobile navigation and FAQ", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/ta3allam");
  await page.getByRole("button", { name: "فتح قائمة التنقل" }).click();
  await page
    .locator(".lms-marketing-links")
    .getByRole("link", { name: "الدورات", exact: true })
    .click();
  await expect(page).toHaveURL(/courses$/);
  await page.goto("/ta3allam/dashboard");
  await page.getByRole("button", { name: "فتح قائمة التنقل" }).click();
  await page
    .locator(".lms-sidebar nav")
    .getByRole("link", { name: "مكتبة الأدوات" })
    .click();
  await expect(page).toHaveURL(/dashboard\/resources$/);
  const toggle = page.getByRole("button", { name: "فتح قائمة التنقل" });
  await toggle.click();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await page.goto("/ta3allam");
  const question = page.locator(".faq-question-btn").first();
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await question.press("Enter");
  await expect(question).toHaveAttribute("aria-expanded", "false");
});

test("invalid routes show 404", async ({ page }) => {
  const response = await page.goto("/ta3allam/courses/missing");
  // This dynamic layout streams before notFound; Next returns 200 + fallback/noindex.
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading")).toContainText("الصفحة مش موجودة");
  const lessonResponse = await page.goto("/ta3allam/learn/editing-foundations/missing");
  expect(lessonResponse?.status()).toBe(200);
  await expect(page.getByRole("heading")).toContainText("الصفحة مش موجودة");
  await expect(
    page.locator('meta[name="robots"][content*="noindex"]').first(),
  ).toHaveAttribute("content", /noindex/);
});

test("course cards prioritize mock price and registration", async ({
  page,
}) => {
  // This case checks static hierarchy; live motion/hover ownership has its own cases.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/ta3allam/courses");
  const card = page.locator(".lms-course-card").first();
  await expect(card.locator(".lms-course-price strong")).toContainText("499");
  await expect(
    card.locator(
      ".lms-price-caption, .lms-price-label, .lms-art-top, .lms-art-bottom, .lms-card-tags, .lms-card-details",
    ),
  ).toHaveCount(0);
  const title = card.locator("h3 a");
  await expect(title).toHaveText("أساسيات المونتاج باستخدام Premiere Pro");
  await title.hover();
  await expect(title).toHaveCSS("color", "rgb(252, 53, 34)");
  await expect(title).toHaveCSS("text-decoration-line", "none");
  const action = card.getByRole("link", { name: "اشترك الآن", exact: true });
  await expect(action).toHaveCSS("background-color", "rgb(252, 53, 34)");
  const titleBox = await card.locator("h3").boundingBox();
  const actionBox = await action.boundingBox();
  const coverBox = await card.locator(".lms-card-cover").boundingBox();
  const priceBox = await card.locator(".lms-course-price").boundingBox();
  const metaBox = await card.locator(".lms-card-meta").boundingBox();
  expect(actionBox!.y).toBeGreaterThan(titleBox!.y);
  expect(titleBox!.y).toBeLessThan(coverBox!.y);
  expect(priceBox!.x + priceBox!.width).toBeLessThanOrEqual(metaBox!.x);
  await expect(card.locator("h3 a")).toHaveAttribute(
    "href",
    "/ta3allam/courses/editing-foundations",
  );
  await expect(card.locator(".lms-card-cover")).toHaveAttribute(
    "href",
    "/ta3allam/courses/editing-foundations",
  );
  await action.click();
  await expect(page).toHaveURL(/editing-foundations#course-enrollment/);
  await expect(
    page.locator("#course-enrollment .lms-course-price strong"),
  ).toContainText("499");
  await expect(
    page.getByRole("button", { name: "كمّل تعلّمك", exact: true }),
  ).toBeVisible();
});

test("readable action labels, metadata and lesson status on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  const readability = async (selector: string) =>
    page
      .locator(selector)
      .first()
      .evaluate((element) => {
        const parse = (value: string) => value.match(/[\d.]+/g)!.map(Number);
        const composite = (foreground: number[], background: number[]) =>
          foreground
            .slice(0, 3)
            .map(
              (value, index) =>
                value * (foreground[3] ?? 1) +
                background[index] * (1 - (foreground[3] ?? 1)),
            );
        const luminance = (color: number[]) =>
          color.slice(0, 3).reduce((sum, value, index) => {
            const channel = value / 255;
            return (
              sum +
              (channel <= 0.04045
                ? channel / 12.92
                : ((channel + 0.055) / 1.055) ** 2.4) *
                [0.2126, 0.7152, 0.0722][index]
            );
          }, 0);
        const ancestors: Element[] = [];
        for (
          let node: Element | null = element;
          node;
          node = node.parentElement
        )
          ancestors.unshift(node);
        const background = ancestors.reduce(
          (color, node) =>
            composite(parse(getComputedStyle(node).backgroundColor), color),
          [255, 255, 255],
        );
        const style = getComputedStyle(element);
        const foreground = composite(parse(style.color), background);
        const a = luminance(foreground),
          b = luminance(background);
        return {
          size: parseFloat(style.fontSize),
          weight: Number(style.fontWeight),
          contrast: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
        };
      });
  await page.goto("/ta3allam/courses");
  const action = page.locator(".lms-card-action").first();
  for (const hover of [false, true]) {
    if (hover) await action.hover();
    const label = await readability(".lms-card-action");
    expect(label.contrast).toBeGreaterThanOrEqual(3);
    expect(label.size).toBeGreaterThanOrEqual(20);
    expect(label.weight).toBeGreaterThanOrEqual(700);
    await expect(action).toHaveCSS("color", "rgb(255, 255, 255)");
  }
  expect((await readability(".lms-card-meta")).size).toBeGreaterThanOrEqual(14);
  expect(
    (await readability(".lms-nav-button")).contrast,
  ).toBeGreaterThanOrEqual(4.5);
  expect((await readability(".lms-search input")).size).toBeGreaterThanOrEqual(
    16,
  );
  expect(
    (await readability(".lms-search button")).contrast,
  ).toBeGreaterThanOrEqual(4.5);
  await page.goto("/ta3allam/learn/editing-foundations/first-cut");
  const status = await readability(".lms-outline-module a small");
  expect(status.size).toBeGreaterThanOrEqual(14);
  expect(status.contrast).toBeGreaterThanOrEqual(4.5);
  const lessonTitle = await readability(".lms-outline-module a");
  expect(lessonTitle.size).toBeGreaterThan(status.size);
  expect(lessonTitle.weight).toBeGreaterThan(status.weight);
  expect(
    (await readability(".lms-lesson-information p")).size,
  ).toBeGreaterThanOrEqual(16);
  expect(
    (await readability(".lms-notes textarea")).size,
  ).toBeGreaterThanOrEqual(16);
  await page.goto("/ta3allam/dashboard/profile");
  expect(
    (await readability(".lms-profile-form input")).size,
  ).toBeGreaterThanOrEqual(16);
});

test("FAQ transitions finish and reduced motion exposes reveal content", async ({
  page,
}) => {
  await page.goto("/ta3allam");
  const question = page.locator(".faq-question-btn").first();
  const panel = page.locator(".faq-answer-panel").first();
  await question.scrollIntoViewIfNeeded();
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(panel).toHaveAttribute("inert", "");
  const opening = await question.evaluate(async (button) => {
    const panel = document.getElementById(
      button.getAttribute("aria-controls")!,
    )!;
    panel.getBoundingClientRect();
    (button as HTMLButtonElement).click();
    await Promise.resolve();
    panel.getBoundingClientRect();
    return panel
      .getAnimations()
      .some((animation) => animation.playState === "running");
  });
  expect(opening).toBe(true);
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await expect
    .poll(async () => (await panel.boundingBox())?.height ?? 0)
    .toBeGreaterThan(0);
  await question.click();
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(panel).toHaveAttribute("inert", "");
  await expect
    .poll(async () => (await panel.boundingBox())?.height ?? 0)
    .toBe(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await question.click();
  await expect(panel).toHaveCSS("transition-duration", "0s");
  await expect
    .poll(() => page.evaluate(() => document.getAnimations().length))
    .toBe(0);
  const opacity = await page
    .locator(".lms-reveal")
    .evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).opacity),
    );
  expect(opacity.every((value) => value === "1")).toBe(true);
});

test("landing hero visibly enters on load and respects reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/ta3allam");
  const heading = page.locator(".hero-headline");
  await expect
    .poll(() =>
      heading.evaluate((element) => {
        const style = getComputedStyle(element);
        return (
          Number(style.opacity) > 0 &&
          Number(style.opacity) < 1 &&
          new DOMMatrix(style.transform).m42 > 0
        );
      }),
    )
    .toBe(true);
  await expect
    .poll(() => heading.evaluate((element) => element.getAnimations().length))
    .toBe(0);
  await expect(heading).toHaveCSS("opacity", "1");
  await expect(heading).toHaveCSS("transform", "none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  const hero = page.locator(".lms-landing-hero");
  await expect
    .poll(() =>
      hero.evaluate(
        (element) => element.getAnimations({ subtree: true }).length,
      ),
    )
    .toBe(0);
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS("opacity", "1");
  await expect(page.locator(".lms-hero-actions .btn-primary")).toBeVisible();
});

test("course entrances and hover movement are visible and independent", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 720 });
  await page.goto("/ta3allam/courses");
  const entrance = page.locator(".lms-card-entrance").last();
  await expect
    .poll(() =>
      entrance.evaluate((element) =>
        element
          .getAnimations()
          .some((animation) => animation.playState === "paused"),
      ),
    )
    .toBe(true);
  await entrance.evaluate((element) =>
    element.scrollIntoView({ behavior: "instant" }),
  );
  await expect
    .poll(() =>
      entrance.evaluate((element) =>
        element
          .getAnimations()
          .some((animation) => animation.playState === "running"),
      ),
    )
    .toBe(true);
  await expect
    .poll(() => entrance.evaluate((element) => element.getAnimations().length))
    .toBe(0);
  const card = entrance.locator(".lms-course-card");
  await card.hover();
  await expect
    .poll(() =>
      card.evaluate(
        (element) => new DOMMatrix(getComputedStyle(element).transform).m42,
      ),
    )
    .toBe(-8);
  const artwork = card.locator(".lms-card-cover svg");
  await expect
    .poll(() =>
      artwork.evaluate(
        (element) => new DOMMatrix(getComputedStyle(element).transform).m11,
      ),
    )
    .toBeCloseTo(1.055, 3);
  const button = card.locator(".lms-card-action");
  await button.hover();
  await expect
    .poll(() =>
      button.evaluate(
        (element) => new DOMMatrix(getComputedStyle(element).transform).m42,
      ),
    )
    .toBe(-4);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(card).toHaveCSS("transform", "none");
  await expect(artwork).toHaveCSS("transform", "none");
  await expect(button).toHaveCSS("transform", "none");
});

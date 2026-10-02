import { expect, test } from "@playwright/test";

test("the editing story assembles a clip while native scrolling keeps the desk visible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const story = page.locator("[data-editing-story]");
  await story.evaluate((element) =>
    scrollTo({
      top: element.getBoundingClientRect().top + scrollY - 300,
      behavior: "instant",
    }),
  );
  const frame = page.locator("[data-edit-frame]");
  await expect
    .poll(() => frame.evaluate((element) => element.style.transform))
    .not.toBe("");
  const initial = await frame.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await story
    .locator("article")
    .nth(1)
    .evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
  await expect(page.locator("[data-editing-desk]")).toBeInViewport();
  await expect
    .poll(() =>
      frame.evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe(initial);
  await story
    .locator("article")
    .last()
    .evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
  await expect(page.locator("[data-edit-ready]")).toHaveCSS("opacity", "1");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("Motion powers an interruptible before/after interaction with accessible controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const demo = page.locator("[data-edit-preview]");
  await demo.scrollIntoViewIfNeeded();
  const choices = demo.locator("[data-demo-choice]");
  await expect(choices.first()).toHaveAttribute("aria-pressed", "true");
  await choices.last().click();
  await expect(demo).toHaveAttribute("data-edit", "edited");
  await expect(choices.last()).toHaveAttribute("aria-pressed", "true");
  await expect(demo.locator("[data-demo-content]")).toHaveAttribute(
    "data-demo-animation",
    "complete",
  );
  await choices.first().click();
  await choices.last().click();
  await choices.first().click();
  await expect(demo).toHaveAttribute("data-edit", "raw");
  await expect(demo.locator("[data-demo-content]")).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await choices.last().click();
  await expect(demo).toHaveAttribute("data-edit", "edited");
  await expect(demo.locator("[data-demo-content]")).not.toHaveAttribute(
    "data-demo-animation",
  );
  await expect(demo.locator("[data-demo-content]")).toHaveCSS(
    "transform",
    "none",
  );
});

test("the native horizontal gallery works with buttons and keyboard at both screen sizes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const size of [
    { width: 390, height: 844 },
    { width: 1440, height: 1000 },
  ]) {
    await page.setViewportSize(size);
    await page.goto("/");
    const showcase = page.locator("[data-showcase]");
    await showcase.scrollIntoViewIfNeeded();
    const next = showcase.getByRole("button", { name: "التالي", exact: true });
    for (let i = 0; i < 3; i++) {
      await next.click();
      await expect(showcase.locator('[aria-live="polite"]')).toHaveText(
        `${i + 2} / 4`,
      );
    }
    await expect(next).toBeDisabled();
    await expect(
      showcase.locator("[data-showcase-card]").last(),
    ).toBeInViewport();
    await showcase.locator("[data-showcase-viewport]").focus();
    await page.keyboard.press("ArrowLeft");
    await expect(showcase.locator('[aria-live="polite"]')).toHaveText("3 / 4");
    await showcase.getByRole("link", { name: "كمّل لخطة التعلم ↓" }).click();
    await expect(page.locator("#roadmap h2")).toBeInViewport();
  }
});

test("chapter navigation follows the story and marks a real finish", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const progress = page.locator("[data-journey-progress]");
  await expect(progress.locator('[aria-current="step"]')).toHaveAttribute(
    "href",
    "#hero",
  );
  for (const id of [
    "transformation",
    "clients",
    "roadmap",
    "instructor",
    "enroll",
  ]) {
    await page
      .locator(`#${id}`)
      .evaluate((element) =>
        scrollTo({
          top:
            element.getBoundingClientRect().top + scrollY - innerHeight * 0.3,
          behavior: "instant",
        }),
      );
    await expect(progress.locator('[aria-current="step"]')).toHaveAttribute(
      "href",
      `#${id}`,
    );
  }
  await expect(page.locator("#enroll")).toContainText("وصلت لآخر الرحلة");
  await expect(progress).toContainText("وصلت للنهاية");
  await expect(page.locator("#enroll [data-button-link]")).toHaveAttribute(
    "href",
    /^https:\/\/wa.me\//,
  );
});

test("live reduced motion and viewport changes restore the complete static editing illustration", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const frame = page.locator("[data-edit-frame]");
  await page.locator("[data-editing-story]").scrollIntoViewIfNeeded();
  await expect
    .poll(() => frame.evaluate((element) => element.style.transform))
    .not.toBe("");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(frame).toHaveCSS("transform", "none");
  await expect(page.locator("[data-edit-ready]")).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect
    .poll(() => frame.evaluate((element) => element.style.transform))
    .not.toBe("");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(frame).toHaveCSS("transform", "none");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});

test("the complete journey remains readable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCSS("opacity", "1");
  await expect(page.locator("[data-edit-caption]")).toHaveCSS("opacity", "1");
  await page.locator("#roadmap").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-timeline-day]")).toHaveCount(7);
  await page.locator("[data-more-reviews] summary").click();
  await expect(page.locator("[data-more-reviews]")).toHaveAttribute("open", "");
  await page.locator("#enroll").scrollIntoViewIfNeeded();
  await expect(page.locator("#enroll [data-button-link]")).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await context.close();
});

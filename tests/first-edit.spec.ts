import { expect, test } from "@playwright/test";

test("one editing decision carries through lessons and final result", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const demo = page.locator("[data-edit-preview]");
  await demo.locator('[data-rhythm-choice="energetic"]').click();
  await expect(demo).toHaveAttribute("data-selected-rhythm", "energetic");
  await expect(
    demo.locator('[data-rhythm-choice="energetic"]'),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(demo.locator("[data-choice-feedback]")).toContainText(
    "ثلاث لحظات",
  );
  const outcomes = page.locator("[data-lesson-outcomes]");
  await outcomes.scrollIntoViewIfNeeded();
  await expect(outcomes).toContainText("بنكمل على اختيارك: سريعة");
  await outcomes.locator("[data-outcome-day]").nth(2).click();
  await expect(outcomes.locator("[data-clip-preview]")).toHaveAttribute(
    "data-clip-stage",
    "color",
  );
  await outcomes.locator("[data-outcome-day]").last().click();
  await expect(outcomes.locator("[data-clip-caption]")).toContainText(
    "قهوتك. وبداية جديدة.",
  );
  const final = page.locator("[data-final-edit]");
  await final.scrollIntoViewIfNeeded();
  await expect(final).toHaveAttribute("data-final-rhythm", "energetic");
  await expect(final).toContainText("دي النسخة اللي اخترتها");
  await expect(final.locator("[data-clip-caption]")).toContainText(
    "قهوتك. وبداية جديدة.",
  );
  await final.getByRole("link").click();
  await demo.locator('[data-rhythm-choice="calm"]').click();
  await expect(final).toHaveAttribute("data-final-rhythm", "calm");
});

test("real footage loads only after playback and pauses outside the viewport", async ({
  page,
}) => {
  const mediaRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes(".mp4")) mediaRequests.push(request.url());
  });
  await page.goto("/");
  await expect(page.locator("[data-clip-video]")).toHaveCount(0);
  expect(mediaRequests).toEqual([]);
  const demo = page.locator("[data-edit-preview]");
  await demo.locator('[data-rhythm-choice="energetic"]').click();
  await demo.locator("[data-clip-play]").click();
  const video = demo.locator("video");
  await expect(video).toHaveAttribute("src", /first-edit-energetic\.mp4$/);
  await expect
    .poll(() => video.evaluate((v) => (v as HTMLVideoElement).duration))
    .toBeGreaterThan(4);
  await expect
    .poll(() => video.evaluate((v) => (v as HTMLVideoElement).currentTime))
    .toBeGreaterThan(0);
  await page.locator("#enroll").scrollIntoViewIfNeeded();
  await expect
    .poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused))
    .toBe(true);
  expect(
    mediaRequests.some((url) => url.includes("first-edit-energetic.mp4")),
  ).toBe(true);
  expect(mediaRequests.some((url) => url.includes("first-edit-raw.mp4"))).toBe(
    false,
  );
});

test("raw and edited comparisons use different real source durations", async ({
  page,
}) => {
  await page.goto("/");
  const demo = page.locator("[data-edit-preview]");
  await demo.locator("[data-clip-play]").click();
  await expect
    .poll(() =>
      demo.locator("video").evaluate((v) => (v as HTMLVideoElement).duration),
    )
    .toBeGreaterThan(7.9);
  await demo.locator('[data-rhythm-choice="calm"]').click();
  await expect(demo.locator("video")).toHaveAttribute(
    "src",
    /first-edit-calm\.mp4$/,
  );
  await expect
    .poll(() =>
      demo.locator("video").evaluate((v) => (v as HTMLVideoElement).duration),
    )
    .toBeLessThan(6.2);
  await demo.locator('[data-rhythm-choice="energetic"]').click();
  await expect(demo.locator("video")).toHaveAttribute(
    "src",
    /first-edit-energetic\.mp4$/,
  );
  await expect
    .poll(() =>
      demo.locator("video").evaluate((v) => (v as HTMLVideoElement).duration),
    )
    .toBeLessThan(4.5);
  await demo.locator("[data-demo-choice]").first().click();
  await expect(demo.locator("video")).toHaveAttribute(
    "src",
    /first-edit-raw\.mp4$/,
  );
});

test("keyboard choices and direct arrival at the finish remain understandable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#enroll");
  const final = page.locator("[data-final-edit]");
  await expect(final).toContainText("معاينة للنسخة الهادية");
  await final.getByRole("link").click();
  const choice = page.locator('[data-rhythm-choice="energetic"]');
  await choice.focus();
  await page.keyboard.press("Enter");
  await expect(choice).toHaveAttribute("aria-pressed", "true");
  await expect(final).toContainText("دي النسخة اللي اخترتها");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
});

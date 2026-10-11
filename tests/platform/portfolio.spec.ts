import { readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";
import source from "../../config/personal-portfolio.json";

test("portfolio preserves reference sections, copy, links and real media", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/founder");
  await expect(page).toHaveTitle(/محمد خطاب/);
  await expect(page.locator("main > section")).toHaveCount(7);
  for (const content of [
    source.hero,
    source.about,
    source.journey,
    source.clients,
    source.work,
    source.courses,
    source.collaboration,
  ]) {
    const section = page.locator(`main > section[id="${content.id}"]`);
    await expect(section).toContainText(content.title);
    await expect(section).toContainText(content.description);
  }
  await expect(page.locator(".personal-about-grid blockquote")).toHaveText(
    source.about.quote,
  );
  await expect(page.locator(".personal-milestone")).toHaveCount(4);
  await expect(page.locator(".personal-client")).toHaveCount(6);
  await expect(page.locator(".personal-work-card")).toHaveCount(4);
  await expect(page.locator(".personal-course")).toHaveCount(2);
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.locator("video")).toHaveCount(0);
  await expect(
    page.locator(".personal-collaboration a").first(),
  ).toHaveAttribute("href", source.collaboration.actions[0].href);
  expect(errors).toEqual([]);
});

for (const width of [320, 390, 768, 1440])
  test(`portfolio responsive layout and assets at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/founder#courses");
    await expect(page.locator("#courses")).toBeInViewport();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.locator("#hero").scrollIntoViewIfNeeded();
    const portrait = page.locator(".personal-portrait img");
    await expect(portrait).toBeVisible();
    expect(
      await portrait.evaluate(
        (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
      ),
    ).toBe(true);
    await page.locator("#courses").scrollIntoViewIfNeeded();
    for (const image of await page.locator(".personal-course img").all()) {
      await expect
        .poll(() =>
          image.evaluate(
            (image: HTMLImageElement) =>
              image.complete && image.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
    if (width < 992) {
      await page.locator(".personal-menu-toggle").click();
      await expect(page.locator("[id^=personal-navigation-]")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.locator("[id^=personal-navigation-]")).toBeHidden();
      await expect(page.locator(".personal-menu-toggle")).toBeFocused();
      await page.locator(".personal-menu-toggle").click();
      await page.locator("[id^=personal-navigation-] a[href='#portfolio']").click();
      await expect(page.locator("[id^=personal-navigation-]")).toBeHidden();
      await expect(page).toHaveURL(/#portfolio$/);
    }
  });

test("portfolio player remains inline and resets the prior sample", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/founder#portfolio");
  const cards = page.locator(".personal-work-card");
  await cards.nth(0).getByRole("button", { name: /تشغيل/ }).click();
  await expect(cards.nth(0).locator("video")).toBeVisible();
  expect(await page.evaluate(() => !!document.fullscreenElement)).toBe(false);
  await cards.nth(1).getByRole("button", { name: /تشغيل/ }).click();
  await expect(cards.nth(0).locator("video")).toHaveCount(0);
  await expect(cards.nth(1).locator("video")).toBeVisible();
  await page.locator("#collab").scrollIntoViewIfNeeded();
  await expect(cards.nth(1).locator("video")).toHaveCount(0);
});

test("portfolio shares smooth hover and progressing timeline with reduced motion support", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/founder");
  await expect(page.locator(".personal-work-card").first()).toHaveCSS(
    "transition-duration",
    "0.5s",
  );
  await page.locator("#journey").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator(".personal-timeline")
        .evaluate((el) =>
          Number(getComputedStyle(el).getPropertyValue("--personal-progress")),
        ),
    )
    .toBeGreaterThan(0);
  await page.locator("#clients").scrollIntoViewIfNeeded();
  await expect(page.locator(".personal-timeline .is-active")).toHaveCount(4);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".personal-portrait")).toHaveCSS(
    "animation-name",
    "none",
  );
});

test("original section copy is preserved apart from authorized reel and upcoming preview changes", async ({
  page,
}) => {
  const html = readFileSync(
    "docs/evidence/portfolio-reference/source.html",
    "utf8",
  );
  await page.goto("/founder");
  const differences = await page.evaluate((html) => {
    const reference = new DOMParser().parseFromString(html, "text/html");
    // HTML formatting inserts whitespace between blocks; React does not.
    // Compare every meaningful text node in order, retaining word spacing.
    const text = (root: Element | null) => {
      if (!root) return "";
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const parts: string[] = [];
      while (walker.nextNode()) {
        const value = (walker.currentNode.textContent ?? "")
          .replace(/\s+/g, " ")
          .trim();
        if (value) parts.push(value);
      }
      return parts.join(" ");
    };
    return [
      ...reference.querySelectorAll("body > section, body > footer"),
    ].flatMap((section) => {
      const actual =
        section.tagName === "FOOTER"
          ? document.querySelector(".personal-footer")
          : document.querySelector(`main > section[id="${section.id}"]`);
      const actualCopy = actual?.cloneNode(true) as Element | null;
      // User approved removing reel captions and replacing the upcoming thumbnail.
      section
        .querySelectorAll(".reel-title, .reel-stats")
        .forEach((node) => node.remove());
      actualCopy
        ?.querySelectorAll(".p-ref-reel-title, .p-ref-reel-stats")
        .forEach((node) => node.remove());
      section.querySelector('.course-yt-card[href="#collab"] .course-yt-thumb')?.remove();
      actualCopy?.querySelector('.personal-course-upcoming .p-ref-course-yt-thumb')?.remove();
      actualCopy?.querySelectorAll("[data-project-navigation]").forEach((node) => node.remove());
      section.querySelector(".footer-designer-credit")?.remove();
      actualCopy?.querySelector(".p-ref-footer-designer-credit")?.remove();
      const expected = text(section);
      const received = text(actualCopy);
      return expected === received
        ? []
        : [{ section: section.id || "footer", expected, received }];
    });
  }, html);
  expect(differences).toEqual([]);
});

test("navigation clears the previous section highlight when returning to the original hero", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/founder#about");
  await expect(
    page.locator("[id^=personal-navigation-] a[href='#about']"),
  ).toHaveAttribute("aria-current", "location");
  await page.locator(".p-ref-brand-logo").click();
  await expect(page.locator("[id^=personal-navigation-] [aria-current]")).toHaveCount(
    0,
  );
  await expect(page.locator(".p-ref-brand-name")).toHaveClass(
    /p-ref-is-hero-active/,
  );
});

test("reels have no visible captions and the upcoming course uses shared artwork", async ({ page }) => {
  await page.goto("/founder");
  await expect(page.locator(".p-ref-reel-title, .p-ref-reel-stats, .personal-work-caption")).toHaveCount(0);
  await expect(page.locator(".personal-work-card .media-player-poster")).toHaveCount(4);
  const upcoming = page.locator(".personal-course-upcoming");
  await expect(upcoming.locator(".coming-soon-label")).toHaveText("قريباً");
  await expect(upcoming.locator(".coming-soon-detail")).toHaveText("COMING SOON");
  await expect(upcoming.locator(".coming-soon-art")).toHaveAttribute("aria-hidden", "true");
  await expect(upcoming.locator("img, .p-ref-course-yt-badge")).toHaveCount(0);
  await expect(page.locator(".personal-course:not(.personal-course-upcoming) img")).toHaveCount(1);
  await expect(page.locator(".personal-course:not(.personal-course-upcoming) .p-ref-course-yt-badge")).toHaveText("متاح للتسجيل الآن");
});

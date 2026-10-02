import { expect, test } from "@playwright/test";

test("scroll reveals individual cards in sequence and preserves their hover lift", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const grid = page.locator('#transformation [data-motion="grid"]');
  const cards = grid.locator("article");
  await expect(cards.first()).toHaveAttribute("data-reveal-state", "waiting");
  await expect(grid).toHaveCSS("opacity", "1");
  await expect(cards.first()).toHaveCSS("opacity", "0");
  // Observe actual rendered opacity during entry, not only state attributes.
  await cards.first().evaluate((element) => {
    const values: number[] = [];
    (window as Window & { entryOpacity?: number[] }).entryOpacity = values;
    const sample = () => {
      values.push(Number(getComputedStyle(element).opacity));
      if (values.length < 90) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
    element.scrollIntoView({ block: "center", behavior: "instant" });
  });
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as Window & { entryOpacity?: number[] }).entryOpacity?.some(
          (value) => value > 0 && value < 1,
        ),
      ),
    )
    .toBe(true);
  await expect(cards.first()).toHaveAttribute("data-reveal-state", "visible");
  await expect(cards.last()).toHaveAttribute("data-reveal-state", "waiting");
  await cards
    .last()
    .evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
  await expect(cards.last()).toHaveAttribute("data-reveal-state", "visible");
  await expect(cards.last()).toHaveCSS("opacity", "1");
  await cards.first().hover();
  await expect(cards.first()).toHaveCSS("translate", "0px -4px");
  // Scroll-away/return must not hide a completed card again.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await cards
    .first()
    .evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
  await expect(cards.first()).toHaveCSS("opacity", "1");
  expect(errors).toEqual([]);
});

test("roadmap entrances keep the progress fill visible and markers readable on hover", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const day = page.locator("[data-timeline-day]").nth(2);
  const card = day.locator('[data-motion="roadmap-day"]');
  await expect(card).toHaveAttribute("data-reveal-state", "waiting");
  await day.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await expect(card).toHaveAttribute("data-reveal-state", "visible");
  const line = page.locator("[data-timeline-progress]");
  await expect
    .poll(() =>
      line.evaluate((element) => element.getBoundingClientRect().height),
    )
    .toBeGreaterThan(0);
  await expect(line).toHaveCSS("scale", "none");
  await day.hover();
  const colors = await day
    .locator("[data-timeline-marker]")
    .evaluate((element) => ({
      background: getComputedStyle(element).backgroundColor,
      digit: getComputedStyle(element.children[0]).color,
    }));
  expect(colors.digit).not.toBe(colors.background);
});

test("buttons provide hover and press feedback while reduced motion removes movement", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const button = page.locator("#hero [data-button-link]");
  await expect(page.locator('[data-motion="hero-cta"]')).toHaveAttribute(
    "data-reveal-state",
    "visible",
  );
  await button.hover();
  await expect(button).toHaveCSS("translate", "0px -2px");
  await page.mouse.down();
  await expect(button).toHaveCSS("scale", "0.95");
  await page.mouse.move(0, 0);
  await page.mouse.up();
  await expect(button).toHaveCSS("scale", "none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await button.hover();
  await expect(button).toHaveCSS("translate", "none");
  await page.mouse.down();
  await expect(button).toHaveCSS("scale", "none");
  await page.mouse.move(0, 0);
  await page.mouse.up();
});

test("mobile menu and FAQ animate between their visible states", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.locator("[data-menu-toggle]");
  const menu = page.locator("[data-navigation]");
  await toggle.click();
  await expect(menu).toBeVisible();
  await expect(menu).toHaveCSS("opacity", "1");
  await toggle.click();
  await expect(menu).toBeHidden();
  const question = page.locator("[data-faq-question]").first();
  await question.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await expect(question.locator("..")).toHaveAttribute(
    "data-reveal-state",
    "visible",
  );
  const panelId = await question.getAttribute("aria-controls");
  const panel = page.locator(`[id="${panelId}"]`);
  await expect
    .poll(() =>
      panel.evaluate((element) => element.getBoundingClientRect().height),
    )
    .toBe(0);
  await question.click();
  await expect
    .poll(() =>
      panel.evaluate((element) => element.getBoundingClientRect().height),
    )
    .toBeGreaterThan(0);
  await expect(panel).not.toHaveAttribute("inert");
  await question.click();
  await expect
    .poll(() =>
      panel.evaluate((element) => element.getBoundingClientRect().height),
    )
    .toBe(0);
  await expect(panel).toHaveAttribute("inert", "");
});

test("the scroll-active day and hovered marker highlight their own adjacent card", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const days = page.locator("[data-timeline-day]");
  const activeDay = days.nth(2);
  await activeDay.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await page.mouse.move(0, 0);
  await expect(activeDay).toHaveAttribute("data-status", "active");
  const activeCard = activeDay.locator('[data-motion="roadmap-day"]');
  await expect(activeCard).toHaveAttribute("data-reveal-state", "visible");
  await expect(activeCard).toHaveCSS("translate", "-4px");
  await expect(activeCard).not.toHaveCSS("box-shadow", "none");

  const pendingDay = days.nth(3);
  const pendingCard = pendingDay.locator('[data-motion="roadmap-day"]');
  await expect(pendingDay).toHaveAttribute("data-status", "pending");
  await expect(pendingCard).toHaveCSS("translate", "none");
  await pendingDay.locator("[data-timeline-marker]").hover();
  await expect(pendingCard).toHaveCSS("translate", "-4px");
  await page.mouse.move(0, 0);
  await expect(pendingCard).toHaveCSS("translate", "none");
  await expect(activeCard).toHaveCSS("translate", "-4px");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(activeCard).toHaveCSS("translate", "none");
  await expect(activeCard).not.toHaveCSS("box-shadow", "none");
});

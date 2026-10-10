import { expect, test } from "@playwright/test";

for (const site of [
  { name: "workshop", url: "http://localhost:3040/7days-freelance", menu: ".nav-links", toggle: ".mobile-nav-toggle", card: ".client-work-card", reveal: ".clients-grid" },
  { name: "LMS", url: "http://localhost:3040/ta3allam", menu: ".lms-marketing-links", toggle: ".lms-mobile-toggle", card: ".lms-course-card", reveal: ".lms-card-entrance" },
]) {
  test(`${site.name} shares smooth motion and animates FAQ/menu in both directions`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(site.url);
    const theme = await page.locator("body").evaluate((node) => {
      const style = getComputedStyle(node);
      return ["--motion-duration-control", "--motion-duration-surface", "--motion-duration-reveal", "--motion-easing"]
        .map((token) => style.getPropertyValue(token).trim());
    });
    // Production CSS minification may express milliseconds in seconds.
    expect(theme.slice(0, 3).map((value) => parseFloat(value) * (value.endsWith("ms") ? 1 : 1000)))
      .toEqual([300, 500, 500]);
    expect(theme[3].match(/[\d.]+/g)?.map(Number)).toEqual([0.4, 0, 0.2, 1]);
    await expect.poll(() => page.locator(site.reveal).first().evaluate((node) =>
      node.getAnimations().some((animation) => animation.effect?.getTiming().duration === 500),
    )).toBe(true);
    const card = page.locator(site.card).first();
    const cardMotion = await card.evaluate((node) => {
      const style = getComputedStyle(node);
      const index = style.transitionProperty.split(", ").indexOf("transform");
      return style.transitionDuration.split(", ")[index];
    });
    expect(parseFloat(cardMotion)).toBe(0.5);
    const menu = page.locator(site.menu);
    const toggle = page.locator(site.toggle);
    await expect(menu).toHaveAttribute("inert", "");
    await toggle.click();
    await expect(menu).toHaveAttribute("aria-hidden", "false");
    await expect.poll(() => menu.evaluate((node) => node.getAnimations().some((animation) =>
      animation instanceof CSSTransition && animation.transitionProperty === "opacity" && animation.effect?.getTiming().duration === 500,
    ))).toBe(true);
    await expect.poll(() => menu.evaluate((node) => getComputedStyle(node).opacity)).toBe("1");
    await toggle.click();
    await expect(menu).toHaveAttribute("inert", "");
    await expect.poll(() => menu.evaluate((node) => node.getAnimations().some((animation) =>
      animation instanceof CSSTransition && animation.transitionProperty === "opacity",
    ))).toBe(true);
    await expect.poll(() => menu.evaluate((node) => getComputedStyle(node).visibility)).toBe("hidden");
    const question = page.locator(".faq-question-btn").first();
    const panel = page.locator(".faq-answer-panel").first();
    await question.click();
    await expect(panel).toHaveAttribute("aria-hidden", "false");
    await expect.poll(() => panel.evaluate((node) => node.getAnimations().some((animation) =>
      animation instanceof CSSTransition && animation.transitionProperty === "grid-template-rows" && animation.effect?.getTiming().duration === 500,
    ))).toBe(true);
    await expect.poll(() => panel.evaluate((node) => node.getAnimations().length)).toBe(0);
    const height = await panel.evaluate((node) => node.getBoundingClientRect().height);
    expect(height).toBeGreaterThan(0);
    await question.click();
    await expect(panel).toHaveAttribute("inert", "");
    expect(await panel.evaluate((node) => node.getBoundingClientRect().height)).toBeGreaterThan(0);
    await expect.poll(() => panel.evaluate((node) => node.getBoundingClientRect().height)).toBe(0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await question.click();
    await expect.poll(() => panel.evaluate((node) => node.getAnimations().length)).toBe(0);
    await question.click();
    await expect.poll(() => panel.evaluate((node) => node.getBoundingClientRect().height)).toBe(0);
    await toggle.click();
    await expect.poll(() => menu.evaluate((node) => getComputedStyle(node).opacity)).toBe("1");
    await toggle.click();
    await expect.poll(() => menu.evaluate((node) => getComputedStyle(node).visibility)).toBe("hidden");
    expect(await menu.evaluate((node) => node.getAnimations().length)).toBe(0);
  });
}

for (const site of [
  { name: "workshop", url: "http://localhost:3040/7days-freelance", card: ".client-work-card" },
  { name: "LMS", url: "http://localhost:3040/ta3allam", card: ".lms-course-card" },
]) {
  test(`${site.name} hover and leave visibly interpolate instead of snapping`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(site.url);
    await page.mouse.move(0, 0);
    const card = page.locator(site.card).first();
    await card.scrollIntoViewIfNeeded();
    // Settle ancestor entrance transforms before measuring the hover itself.
    await expect.poll(() => card.evaluate((node) => {
      for (let parent = node.parentElement; parent; parent = parent.parentElement)
        if (parent.getAnimations().some((animation) => animation.playState === "running")) return false;
      return true;
    })).toBe(true);
    const offset = () => card.evaluate((node) => new DOMMatrixReadOnly(getComputedStyle(node).transform).m42);
    expect(await offset()).toBe(0);
    // Sample the browser's transition timeline directly; hover() itself can
    // consume part of the duration when the test machine is busy.
    const sampleQuarter = () => card.evaluate((node) => {
      const animation = node.getAnimations().find((entry) =>
        entry instanceof CSSTransition && entry.transitionProperty === "transform",
      );
      if (!animation?.effect) throw new Error("Expected a live transform transition");
      const duration = Number(animation.effect.getTiming().duration);
      animation.pause();
      animation.currentTime = duration / 4;
      const y = new DOMMatrixReadOnly(getComputedStyle(node).transform).m42;
      animation.play();
      return { duration, y };
    });
    await card.hover();
    const entering = await sampleQuarter();
    expect(entering.duration).toBe(500);
    const enterQuarter = entering.y;
    await expect.poll(() => card.evaluate((node) => node.getAnimations().length)).toBe(0);
    const hovered = await offset();
    expect(hovered).toBeLessThan(0);
    expect(enterQuarter).toBeLessThan(0);
    expect(enterQuarter).toBeGreaterThan(hovered);
    // The old front-loaded curve travelled ~60% in 200ms; the new curve settles gradually.
    expect(enterQuarter / hovered).toBeLessThan(0.5);
    await page.mouse.move(0, 0);
    const leaving = await sampleQuarter();
    expect(leaving.duration).toBe(500);
    const leaveQuarter = leaving.y;
    expect(leaveQuarter).toBeGreaterThan(hovered);
    expect(leaveQuarter).toBeLessThan(0);
    expect(leaveQuarter / hovered).toBeGreaterThan(0.5);
    await expect.poll(offset).toBe(0);
    // Reversing before completion must continue from the current visual position.
    await card.hover();
    const beforeLeave = (await sampleQuarter()).y;
    await page.mouse.move(0, 0);
    const afterLeave = await offset();
    expect(afterLeave).toBeLessThan(0);
    expect(Math.abs(afterLeave - beforeLeave)).toBeLessThan(Math.abs(hovered) / 2);
    await expect.poll(offset).toBe(0);
  });
}

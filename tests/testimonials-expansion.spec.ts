import { expect, test } from "@playwright/test";

test("one featured review and three smaller reviews expand from a centered primary action", async ({ page }) => {
  await page.goto("/7days-freelance");
  const section = page.locator("#testimonials");
  await expect(section.locator(".featured-review-card")).toHaveCount(1);
  await expect(section.locator(".review-card")).toHaveCount(3);
  const more = section.getByRole("button", { name: "عرض المزيد", exact: true });
  await more.scrollIntoViewIfNeeded();
  await expect(more).toHaveAttribute("aria-expanded", "false");
  const geometry = await more.evaluate(node => {
    const button = node.getBoundingClientRect();
    const parent = node.parentElement!.getBoundingClientRect();
    return { color: getComputedStyle(node).color, center: Math.abs(button.x + button.width / 2 - parent.x - parent.width / 2) };
  });
  expect(geometry.color).toBe("rgb(252, 53, 34)");
  expect(geometry.center).toBeLessThan(1);
  await more.hover();
  await expect(more).toHaveCSS("text-decoration-line", "underline");
  await more.click();
  await expect(section.locator(".review-card")).toHaveCount(9);
  await expect(section.locator(".review-revealed")).toHaveCount(6);
  await expect(more).toHaveCount(0);
  await expect(section.locator(".featured-review-card")).toHaveCount(1);
});

test("fullscreen action is hidden until hover or keyboard focus; play remains inline", async ({ page }) => {
  await page.goto("/7days-freelance");
  const player = page.locator(".hero-video-shell .media-player");
  await player.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const control = player.getByRole("button", { name: "ملء الشاشة", exact: true });
  await expect(control).toHaveCSS("opacity", "0");
  await player.hover();
  await expect(control).toHaveCSS("opacity", "1");
  const position = await control.evaluate(node => {
    const rect = node.getBoundingClientRect(), parent = node.parentElement!.getBoundingClientRect();
    return { right: rect.right > parent.x + parent.width / 2, top: rect.y < parent.y + parent.height / 2 };
  });
  expect(position).toEqual({ right: true, top: true });
  await player.locator(".media-player-poster").click();
  await expect(player.locator("video")).toBeVisible();
  expect(await page.evaluate(() => document.fullscreenElement)).toBeNull();
  await page.mouse.move(0, 0);
  await expect(control).toHaveCSS("opacity", "0");
  await page.keyboard.press("Tab");
  await control.focus();
  await expect(control).toHaveCSS("opacity", "1");
});

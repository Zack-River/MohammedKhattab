import { expect, test } from "@playwright/test";
for (const width of [320, 1440]) {
  test(`navigation separates sections from catalog destinations at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const header = page.locator("header.lms-site-header");
    if (width === 320) await header.getByRole("button", { name: "فتح قائمة التنقل", exact: true }).click();
    const courses = header.getByRole("link", { name: "الدورات", exact: true });
    await expect(courses).toHaveAttribute("href", "/#courses");
    await expect(header.getByRole("link", { name: "تعرّف على مؤسس تعلّم", exact: true })).toHaveAttribute("href", "/founder");
    await expect(header.getByRole("link", { name: "عن المدرب", exact: true })).toHaveCount(0);
    await courses.click();
    await expect(page).toHaveURL(/\/#courses$/);
    await expect(page.locator("#courses")).toBeInViewport();
    await expect(page.locator("#courses").getByRole("link", { name: "كل الدورات", exact: true })).toHaveAttribute("href", "/courses");
    await page.goto("/founder");
    const founder = page.locator(".personal-header");
    if (width === 320) await founder.getByRole("button", { name: "فتح القائمة", exact: true }).click();
    const links = founder.locator("nav a");
    const labels = await links.allTextContents();
    expect(labels.indexOf("كورساتي")).toBe(labels.indexOf("تعلّم") + 1);
    await expect(founder.getByRole("link", { name: "تعلّم", exact: true })).toHaveAttribute("href", "/");
    const catalog = founder.getByRole("link", { name: "كورساتي", exact: true });
    await expect(catalog).toHaveAttribute("href", "/courses");
    await expect(catalog).not.toHaveAttribute("aria-current", "location");
    await expect(founder.getByRole("link", { name: "ورشة التغيير", exact: true })).toHaveCount(0);
    await catalog.click();
    await expect(page).toHaveURL(/\/courses$/);
    if (width === 320) await page.locator("header.lms-site-header").getByRole("button", { name: "فتح قائمة التنقل", exact: true }).click();
    const returnToCourses = page.locator("header.lms-site-header").getByRole("link", { name: "الدورات", exact: true });
    await expect(returnToCourses).toHaveAttribute("href", "/#courses");
    await returnToCourses.click();
    await expect(page).toHaveURL(/\/#courses$/);
    await expect(page.locator("#courses")).toBeInViewport();
  });
}

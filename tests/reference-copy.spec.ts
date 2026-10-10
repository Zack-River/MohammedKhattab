import { expect, test } from "@playwright/test";
import referenceCopy from "./fixtures/reference-copy.json";

test("all unchanged sections retain original wording after portfolio population", async ({
  page,
}) => {
  await page.goto("/7days-freelance");
  for (const [id, text] of Object.entries(referenceCopy)) {
    if (id === "clients") continue; // Real portfolio assets replace the approved demo reels.
    const section =
      id === "footer" ? page.locator("footer") : page.locator(`main > #${id}`);
    if (id === "testimonials")
      await section.getByRole("button", { name: "عرض المزيد", exact: true }).click();
    expect(
      await section.evaluate((node) => {
        const copy = node.cloneNode(true) as Element;
        copy.querySelectorAll("[data-project-navigation], [data-instructor-actions], .footer-designer-credit").forEach((link) => link.remove());
        return copy.textContent?.replace(/\s+/g, "");
      }),
    ).toBe(id === "footer" ? text.replace("تمالتصميمبواسطةمحمدفرجاني", "") : text);
  }
  await expect(page.locator(".top-live-item")).toContainText("بيشاهدوا الآن");
  await expect(page.locator("#clients h2")).toHaveText(
    "ثقة العملاء وكبار صناع المحتوى في الوطن العربي",
  );
  await expect(
    page.getByText("ينتهي الخصم خلال :", { exact: true }),
  ).toBeVisible();
});

test("reference signup popup appears and its close button works", async ({
  page,
}) => {
  await page.goto("/7days-freelance");
  const popup = page.locator(".recent-signup-toast");
  await expect(popup).toHaveClass(/is-active/, { timeout: 7000 });
  await expect(popup).toContainText("انضم حديثًا للورشة");
  await popup.getByRole("button", { name: "إغلاق" }).click();
  await expect(popup).toHaveAttribute("aria-hidden", "true");
});

test("reference blur treatments survive CSS compilation", async ({ page }) => {
  await page.goto("/7days-freelance");
  expect(
    await page
      .locator(".site-navbar")
      .evaluate((node) => getComputedStyle(node).backdropFilter),
  ).toBe("blur(14px)");
  expect(
    await page
      .locator(".client-work-tag")
      .first()
      .evaluate((node) => getComputedStyle(node).backdropFilter),
  ).toBe("blur(8px)");
});

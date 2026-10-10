import { test, expect } from "@playwright/test";
import { workshopCourseConfig } from "../config/workshop-course";
import { projectRoutes } from "../config/project-navigation";
import { courses } from "../modules/data/courses";
import { validateCourseEdit } from "../modules/features/admin/helpers/validate-course-edit";
import { driveFileId } from "../modules/helpers/media/drive-file-id";
import { readFileSync } from "node:fs";
test("workshop is a live database course with the approved landing and working card", async ({ page, request }) => {
  const response = await request.get(`/api/courses/${workshopCourseConfig.slug}`);
  const course = await response.json();
  expect(course).toMatchObject({ slug: workshopCourseConfig.slug, delivery: "live", duration: "7 أيام", modules: [] });
  await page.goto("/ta3allam/courses");
  await expect(page.locator(".lms-course-card")).toHaveCount(courses.length);
  const card = page.locator(".lms-course-card").filter({ hasText: course.title });
  await expect(card).toContainText("Live + مسجل");
  await expect(card).not.toContainText("0 دروس");
  await expect(card.locator("h3 a")).toHaveAttribute("href",projectRoutes.workshop);
  await card.locator("h3 a").click();
  await expect(page).toHaveURL(new RegExp(projectRoutes.workshop + "$"));
  await expect(page.locator(".hero-section")).toBeVisible();
  await expect(page.locator(".site-header")).toHaveCount(1);
});
test("legacy workshop links redirect without losing section anchors or query strings", async ({ page, request }) => {
  const response = await request.get("/7days-freelance?source=old", { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe(`${projectRoutes.workshop}?source=old`);
  await page.goto("/7days-freelance#instructor");
  await expect(page).toHaveURL(new RegExp(projectRoutes.workshop + "#instructor$"));
});
test("admin inputs reject malformed values and seeds preserve existing edits", () => {
  const valid = { title: "ورشة التغيير", description: "ورشة مباشرة في سبعة أيام", amount: 499, category: "business", thumbnailUrl: "/assets/images/workshop-intro-poster.jpg", introVideoUrl: "https://drive.google.com/file/d/1ZHecu6hIzcXtpyMxa-Rexq0csHcmOKJt/view", published: true };
  expect(validateCourseEdit(valid)).not.toBeNull();
  for (const changed of [{ amount: -1 }, { amount: Infinity }, { category: "unknown" }, { published: "true" }, { thumbnailUrl: "javascript:alert(1)" }, { thumbnailUrl: "/assets/../../private" }]) expect(validateCourseEdit({ ...valid, ...changed })).toBeNull();
  expect(driveFileId(valid.introVideoUrl)).toBe("1ZHecu6hIzcXtpyMxa-Rexq0csHcmOKJt");
  expect(driveFileId("https://attacker.example/file/d/12345678")).toBeNull();
  const seed = readFileSync("supabase/seed.sql","utf8");
  expect(seed).toContain("on conflict(slug) do nothing");
  expect(seed).toContain("on conflict(course_slug,id) do nothing");
});

import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
test("T05 T34 workshop serves its build identity and critical font hints", async ({
  request,
}) => {
  const build = readFileSync(".next/BUILD_ID", "utf8").trim();
  const staged = readFileSync(
    "/tmp/khatab-acceptance-artifacts/platform/.next/BUILD_ID",
    "utf8",
  ).trim();
  expect(staged).toBe(build);
  const html = await (await request.get("/7days-freelance")).text();
  expect(html).toContain(build);
  expect(html).toContain('as="font"');
  for (const weight of [400, 700])
    expect(html).toContain(`/assets/fonts/ibm-plex-arabic-${weight}.ttf`);
});
test("T36 approved instructor asset is loaded at all matrix widths", async ({
  page,
  request,
}) => {
  const expected = readFileSync("public/assets/images/instructor.png");
  const served = await (
    await request.get("/assets/images/instructor.png")
  ).body();
  expect(createHash("sha256").update(served).digest("hex")).toBe(
    createHash("sha256").update(expected).digest("hex"),
  );
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/7days-freelance");
    const image = page.locator(".instructor-photo-img");
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (node) =>
            node instanceof HTMLImageElement &&
            node.complete &&
            node.naturalWidth > 0,
        ),
      )
      .toBe(true);
    await expect(image).toHaveAttribute(
      "src",
      "/assets/images/instructor.png",
    );
  }
});

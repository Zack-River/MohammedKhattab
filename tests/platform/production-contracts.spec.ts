import { expect, test } from "@playwright/test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
const files = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? files(join(directory, entry.name))
      : [join(directory, entry.name)],
  );
test("T05 T21 T33 T37 server-only export assets and standalone artifact identity", async ({
  request,
  page,
}) => {
  const sourceId = readFileSync(".next/BUILD_ID", "utf8").trim();
  const stagedId = readFileSync(
    "/tmp/khatab-acceptance-artifacts/platform/.next/BUILD_ID",
    "utf8",
  ).trim();
  expect(stagedId).toBe(sourceId);
  const html = await (await request.get("/")).text();
  expect(html).toContain(stagedId);
  expect(html).toContain('as="font"');
  expect(html).toContain("/assets/fonts/ibm-plex-arabic-700.ttf");
  const portrait = readFileSync("public/assets/images/instructor.webp");
  expect(
    await (await request.get("/assets/images/instructor.webp")).body(),
  ).toEqual(portrait);
  await page.setViewportSize({ width: 320, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
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
  const font = JSON.parse(readFileSync("modules/styles/certificate-font.json", "utf8"))
    .base64 as string;
  expect(font.length).toBeGreaterThan(10000);
  for (const file of files(".next/static/chunks").filter((file) =>
    file.endsWith(".js"),
  ))
    expect(readFileSync(file, "utf8"), file).not.toContain(font.slice(0, 120));
  expect(
    files(".next/server/chunks").some(
      (file) =>
        file.endsWith(".js") &&
        readFileSync(file, "utf8").includes(font.slice(0, 120)),
    ),
  ).toBe(true);
  const fonts = await request.get("/assets/fonts/ibm-plex-arabic-700.ttf");
  expect(fonts.status()).toBe(200);
  expect((await fonts.body()).length).toBeGreaterThan(10000);
  const before = await (await request.get("/api/enrollments")).json();
  for (const [path, body, status] of [
    ["/api/enrollments", { courseSlug: "unknown" }, 404],
    ["/api/enrollments", {}, 400],
    [
      "/api/progress",
      {
        courseSlug: "editing-foundations",
        lessonId: "missing",
        completed: true,
      },
      404,
    ],
    [
      "/api/progress",
      {
        courseSlug: "editing-foundations",
        lessonId: "first-cut",
        completed: "yes",
      },
      400,
    ],
  ] as const) {
    const response = await request.post(path, { data: body });
    expect(response.status(), path).toBe(status);
    expect(response.headers()["content-type"]).toContain("application/json");
    expect(await response.json()).toHaveProperty("error");
  }
  expect(await (await request.get("/api/enrollments")).json()).toEqual(before);
  expect((await request.get("/api/resources/missing")).status()).toBe(404);
  expect((await request.get("/api/certificates/missing")).status()).toBe(404);
  const course = (
    await (await request.get("/api/courses/editing-foundations")).json()
  ).course;
  for (const courseModule of course.modules)
    for (const lesson of courseModule.lessons)
      expect(
        (
          await request.post("/api/progress", {
            data: {
              courseSlug: course.slug,
              lessonId: lesson.id,
              completed: true,
            },
          })
        ).status(),
      ).toBe(200);
  expect(
    (
      await request.post("/api/profile", {
        data: { name: 'طالب <& "', email: "certificate@example.com" },
      })
    ).status(),
  ).toBe(200);
  const certificate = await request.get(
    "/api/certificates/editing-foundations",
  );
  expect(certificate.status()).toBe(200);
  expect(certificate.headers()["content-type"]).toBe(
    "image/svg+xml; charset=utf-8",
  );
  expect(certificate.headers()["content-disposition"]).toBe(
    'attachment; filename="ta3llam-editing-foundations.svg"',
  );
  const svg = await certificate.text();
  expect(svg).toContain(font);
  expect(svg).toContain('stroke="#fc3522"');
  expect(svg).toContain("طالب &lt;&amp; &quot;");
  expect(
    await page.evaluate((text) => {
      const xml = new DOMParser().parseFromString(text, "image/svg+xml");
      return {
        errors: xml.querySelectorAll("parsererror").length,
        root: xml.documentElement.localName,
      };
    }, svg),
  ).toEqual({ errors: 0, root: "svg" });
});

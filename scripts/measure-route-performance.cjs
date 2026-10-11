/* eslint-disable @typescript-eslint/no-require-imports -- Production browser measurements, separate from screenshot capture. */
const fs = require("node:fs"),
  path = require("node:path"),
  { chromium } = require("@playwright/test");
const destination = path.resolve(
  __dirname,
  "../docs/evidence/architecture-acceptance/final",
);
const routes = [
  "/",
  "/courses",
  "/courses?category=motion",
  "/courses?q=missing-term",
  "/courses/editing-foundations",
  "/courses/motion-essentials",
  "/login",
  "/dashboard",
  "/dashboard/courses",
  "/dashboard/profile",
  "/dashboard/resources",
  "/dashboard/certificates",
  "/learn/editing-foundations/first-cut",
  "/courses/unknown-course",
];
(async () => {
  const browser = await chromium.launch();
  const rows = [];
  for (const [app, url, paths] of [
    ["workshop", "http://localhost:3040", ["/7days-freelance"]],
    ["lms", "http://localhost:3040", routes],
  ])
    for (const route of paths) {
      for (let run = 0; run < 5; run++) {
        const context = await browser.newContext({
            viewport: { width: 1440, height: 900 },
          }),
          page = await context.newPage();
        await page.addInitScript(() => {
          window.__audit = {
            cls: 0,
            longTasks: [],
            frames: [],
            scrollStart: 0,
            scrollEnd: 0,
          };
          new PerformanceObserver((list) =>
            list.getEntries().forEach((entry) => {
              if (!entry.hadRecentInput) window.__audit.cls += entry.value;
            }),
          ).observe({ type: "layout-shift", buffered: true });
          new PerformanceObserver((list) =>
            window.__audit.longTasks.push(
              ...list
                .getEntries()
                .map((entry) => ({
                  start: entry.startTime,
                  duration: entry.duration,
                })),
            ),
          ).observe({ type: "longtask", buffered: true });
        });
        await page.route("https://www.youtube.com/**", (route) =>
          route.fulfill({ body: "Preview deliberately deferred" }),
        );
        await page.goto(url + route);
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(async () => {
          window.__audit.scrollStart = performance.now();
          let last = performance.now();
          for (let i = 0; i < 120; i++)
            await new Promise((resolve) =>
              requestAnimationFrame((now) => {
                window.__audit.frames.push(now - last);
                last = now;
                scrollBy(0, 60);
                resolve();
              }),
            );
          window.__audit.scrollEnd = performance.now();
          await new Promise((resolve) => requestAnimationFrame(resolve));
        });
        rows.push({
          app,
          route,
          run,
          ...(await page.evaluate(() => ({
            ...window.__audit,
            resources: performance
              .getEntriesByType("resource")
              .filter((entry) => /\.(js|css)(\?|$)/.test(entry.name))
              .map((entry) => ({
                url: entry.name.replace(location.origin, ""),
                bytes: entry.encodedBodySize,
              })),
          }))),
        });
        await context.close();
      }
      console.log(`${app} ${route}: five runs`);
    }
  await browser.close();
  fs.writeFileSync(
    path.join(destination, "route-performance.json"),
    JSON.stringify(rows, null, 2) + "\n",
  );
  const median = (values) =>
    values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
  const p95 = (values) =>
    [...values].sort((a, b) => a - b)[Math.floor(values.length * 0.95)];
  const summaries = [];
  for (const key of new Set(rows.map((row) => row.app + " " + row.route))) {
    const runs = rows.filter((row) => row.app + " " + row.route === key);
    summaries.push({
      route: key,
      cls: median(runs.map((row) => row.cls)),
      p95FrameMs: median(runs.map((row) => p95(row.frames))),
      jsBytes: median(
        runs.map((row) =>
          row.resources
            .filter((r) => r.url.includes(".js"))
            .reduce((sum, r) => sum + r.bytes, 0),
        ),
      ),
      cssBytes: median(
        runs.map((row) =>
          row.resources
            .filter((r) => r.url.includes(".css"))
            .reduce((sum, r) => sum + r.bytes, 0),
        ),
      ),
      scrollLongTasks: runs.map(
        (row) =>
          row.longTasks.filter(
            (task) =>
              task.start >= row.scrollStart && task.start <= row.scrollEnd,
          ).length,
      ),
    });
  }
  fs.writeFileSync(
    path.join(destination, "route-performance-summary.json"),
    JSON.stringify(summaries, null, 2) + "\n",
  );
  console.log(JSON.stringify(summaries, null, 2));
  if (
    summaries.some(
      (row) => row.cls > 0.1 || row.scrollLongTasks.some((count) => count > 1),
    )
  )
    process.exitCode = 1;
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

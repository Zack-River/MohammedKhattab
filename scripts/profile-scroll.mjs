import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const target = process.env.TARGET_URL || "http://127.0.0.1:3022";
const output = process.argv[2] || "docs/evidence/scroll-before.json";
const duration = Number(process.env.PROFILE_DURATION_MS || 8000);
const trials = Number(process.env.PROFILE_TRIALS || 3);
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || "/opt/brave.com/brave/brave",
  args: ["--no-sandbox"],
});
const results = [];
try {
  for (const [device, viewport] of Object.entries({
    desktop: { width: 1440, height: 1000 },
    mobile: { width: 390, height: 844 },
  })) {
    if (process.argv[3] && device !== process.argv[3]) continue;
    for (let trial = 1; trial <= trials; trial++) {
      const context = await browser.newContext({
        viewport,
        isMobile: device === "mobile",
        hasTouch: device === "mobile",
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const cdp = await context.newCDPSession(page);
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await cdp.send("Performance.enable");
      await page.goto(target, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1200);
      await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(0, 0);
      });
      const pageMarkers = await page.evaluate(() => ({
        editingStory: Boolean(document.querySelector("[data-editing-story]")),
        pinSpacers: document.querySelectorAll(".pin-spacer").length,
        webpImages: Array.from(document.images).filter((image) =>
          (image.currentSrc || image.src).includes(".webp"),
        ).length,
      }));
      if (
        output.endsWith("scroll-after.json") &&
        (!pageMarkers.editingStory ||
          pageMarkers.pinSpacers ||
          !pageMarkers.webpImages)
      ) {
        throw new Error(
          `Expected redesigned production app; received ${JSON.stringify(pageMarkers)}`,
        );
      }
      console.log(JSON.stringify({ device, trial, pageMarkers }));
      const before = await cdp.send("Performance.getMetrics");
      const traceEvents = [];
      cdp.on("Tracing.dataCollected", ({ value }) =>
        traceEvents.push(...value),
      );
      await cdp.send("Tracing.start", {
        categories:
          "devtools.timeline,v8.execute,disabled-by-default-devtools.timeline",
        transferMode: "ReportEvents",
      });
      const scroll = await page.evaluate(async (durationMs) => {
        const intervals = [];
        const longTasks = [];
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries())
            longTasks.push({
              start: entry.startTime,
              duration: entry.duration,
            });
        });
        observer.observe({ type: "longtask", buffered: false });
        const start = performance.now();
        let previous = start;
        const distance = document.documentElement.scrollHeight - innerHeight;
        await new Promise((resolve) => {
          function frame(now) {
            intervals.push(now - previous);
            previous = now;
            const progress = Math.min(1, (now - start) / durationMs);
            window.scrollTo(0, distance * progress);
            if (progress < 1) requestAnimationFrame(frame);
            else resolve();
          }
          requestAnimationFrame(frame);
        });
        await new Promise((resolve) => setTimeout(resolve, 100));
        observer.disconnect();
        const sorted = [...intervals].sort((a, b) => a - b);
        const percentile = (q) =>
          sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))];
        const scripts = performance
          .getEntriesByType("resource")
          .filter((entry) => entry.initiatorType === "script");
        return {
          measurementStartMs: start,
          durationMs: performance.now() - start,
          scrollDistancePx: distance,
          frames: intervals.length,
          frameIntervalMs: {
            median: percentile(0.5),
            p95: percentile(0.95),
            p99: percentile(0.99),
            max: Math.max(...intervals),
            over33: intervals.filter((v) => v > 33).length,
            over50: intervals.filter((v) => v > 50).length,
          },
          longTasks,
          scriptBytes: {
            decoded: scripts.reduce(
              (sum, entry) => sum + entry.decodedBodySize,
              0,
            ),
            transferred: scripts.reduce(
              (sum, entry) => sum + entry.transferSize,
              0,
            ),
            count: scripts.length,
          },
          scriptResources: scripts.map((entry) => ({
            name: entry.name,
            startTime: entry.startTime,
            responseEnd: entry.responseEnd,
            decodedBodySize: entry.decodedBodySize,
            requestedDuringScroll: entry.startTime >= start,
          })),
          domCount: document.querySelectorAll("*").length,
          pinSpacers: document.querySelectorAll(".pin-spacer").length,
        };
      }, duration);
      const after = await cdp.send("Performance.getMetrics");
      const traceDone = new Promise((resolve) =>
        cdp.once("Tracing.tracingComplete", resolve),
      );
      await cdp.send("Tracing.end");
      await traceDone;
      const metrics = Object.fromEntries(
        after.metrics.map(({ name, value }) => [name, value]),
      );
      const initial = Object.fromEntries(
        before.metrics.map(({ name, value }) => [name, value]),
      );
      const names = [
        "LayoutDuration",
        "RecalcStyleDuration",
        "ScriptDuration",
        "TaskDuration",
        "LayoutCount",
        "RecalcStyleCount",
      ];
      const delta = Object.fromEntries(
        names.map((name) => [name, metrics[name] - initial[name]]),
      );
      const hotspots = traceEvents
        .filter(
          (event) =>
            ["Layout", "UpdateLayoutTree", "FunctionCall"].includes(
              event.name,
            ) && event.dur >= 2000,
        )
        .sort((a, b) => b.dur - a.dur)
        .slice(0, 15)
        .map((event) => ({
          name: event.name,
          durationMs: event.dur / 1000,
          data: event.args?.data,
          stack: event.args?.beginData?.stackTrace,
        }));
      const result = {
        device,
        trial,
        viewport,
        pageMarkers,
        cpuThrottle: 4,
        ...scroll,
        metricsDelta: delta,
        hotspots,
        errors,
      };
      results.push(result);
      console.log(
        JSON.stringify({
          device,
          trial,
          intervals: scroll.frameIntervalMs,
          longTasks: scroll.longTasks.length,
          delta,
        }),
      );
      await context.close();
    }
  }
  await mkdir(dirname(output), { recursive: true });
  await writeFile(
    output,
    JSON.stringify(
      {
        recordedAt: new Date().toISOString(),
        target,
        duration,
        notes:
          "Synthetic rAF-driven full-document scroll, headless Chromium, 4x CPU throttle. Relative repeatable diagnostic, not a device FPS benchmark. Task/Script/Layout durations use CDP seconds; trace hotspots use milliseconds. Same duration with different page heights changes scroll velocity; compare alongside distance.",
        results,
      },
      null,
      2,
    ) + "\n",
  );
} finally {
  await browser.close();
}

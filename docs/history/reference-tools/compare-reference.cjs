/* eslint-disable @typescript-eslint/no-require-imports -- Standalone browser verification script. */
const { chromium } = require("playwright");
const { readFileSync, mkdirSync, writeFileSync } = require("node:fs");
const base = process.env.TEST_BASE_URL || "http://localhost:3040/7days-freelance";
const directory = "docs/evidence/component-refactor";
const fonts = readFileSync("packages/design-system/styles/fonts.css", "utf8");
const css = readFileSync("content/reference/workshop.css", "utf8");
let original = readFileSync("content/reference/workshop.html", "utf8")
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<link\b[^>]*>/gi, "")
  .replace("</head>", `<style>${fonts}\n${css}</style></head>`)
  .replaceAll('src="assets/', 'src="/assets/')
  .replace(/https:\/\/flagcdn.com\/w80\/(\w+)\.png/g, "/assets/flags/$1.png");
for (const [source, local] of Object.entries({
  "أسامة عصام الدين_.jpg": "osama-essam-eldeen.jpg",
  "بلال طرخان_.jpg": "bilal-tarkhan.jpg",
  "عبدالله الغفيص_.jpg": "abdullah-alghufais.jpg",
  "محمد الخضير_.jpg": "mohammed-alkhudair.jpg",
  "مستر أحمد.jpg": "mr-ahmed.jpg",
  "نجم الدين.jpg": "najm-eldeen.jpg",
}))
  original = original.replaceAll(source, local);

const stable = `*, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; } .recent-signup-toast, .timeline-track, .timeline-progress, nextjs-portal { visibility: hidden !important; }`;

async function capture(page, url, destination) {
  await page.goto(url);
  await page.addStyleTag({ content: stable });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images, async (image) => {
        image.loading = "eager";
        await image.decode();
      }),
    );
    if (window.innerWidth > 1024) {
      const brand = document
        .querySelector(".nav-brand-title")
        .getBoundingClientRect();
      const cta = document
        .querySelector(".nav-cta-btn")
        .getBoundingClientRect();
      const links = document.querySelectorAll(".nav-link-item a");
      document.documentElement.style.setProperty(
        "--inner-corridor-width",
        `${Math.round(brand.left - cta.right)}px`,
      );
      document.documentElement.style.setProperty(
        "--top-capsule-width",
        `${Math.round(links[0].getBoundingClientRect().right - links[links.length - 1].getBoundingClientRect().left)}px`,
      );
    }
    document
      .querySelectorAll(".timer-unit-box b")
      .forEach(
        (digit, index) => (digit.textContent = ["03", "19", "27", "13"][index]),
      );
    window.scrollTo(0, 0);
  });
  const geometry = await page
    .locator("header, main > section, footer")
    .evaluateAll((elements) =>
      elements.map((element) => {
        const { x, y, width, height } = element.getBoundingClientRect();
        return {
          id: element.id || element.tagName.toLowerCase(),
          x,
          y,
          width,
          height,
          text: element.textContent.replace(/\s+/g, ""),
        };
      }),
    );
  const png = await page.screenshot({ path: destination, fullPage: true });
  return { geometry, png };
}

(async () => {
  mkdirSync(directory, { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  try {
    for (const width of [320, 390, 768, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
      });
      await context.route(`${base}/__reference`, (route) =>
        route.fulfill({ contentType: "text/html", body: original }),
      );
      const page = await context.newPage();
      await page.clock.setFixedTime(new Date("2026-10-07T12:00:00Z"));
      const reference = await capture(
        page,
        `${base}/__reference`,
        `${directory}/original-${width}.png`,
      );
      const restored = await capture(
        page,
        base,
        `${directory}/refactored-${width}.png`,
      );
      const raster = await page.evaluate(
        async ({ reference, restored }) => {
          const load = async (data) => {
            const image = new Image();
            image.src = `data:image/png;base64,${data}`;
            await image.decode();
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext("2d");
            context.drawImage(image, 0, 0);
            return {
              width: image.width,
              height: image.height,
              data: context.getImageData(0, 0, image.width, image.height).data,
            };
          };
          const a = await load(reference),
            b = await load(restored);
          if (a.width !== b.width || a.height !== b.height)
            return {
              sameSize: false,
              reference: [a.width, a.height],
              restored: [b.width, b.height],
            };
          let differentPixels = 0;
          const bounds = { left: a.width, top: a.height, right: 0, bottom: 0 };
          for (let i = 0; i < a.data.length; i += 4)
            if (
              a.data[i] !== b.data[i] ||
              a.data[i + 1] !== b.data[i + 1] ||
              a.data[i + 2] !== b.data[i + 2] ||
              a.data[i + 3] !== b.data[i + 3]
            ) {
              differentPixels++;
              const x = (i / 4) % a.width,
                y = Math.floor(i / 4 / a.width);
              bounds.left = Math.min(bounds.left, x);
              bounds.top = Math.min(bounds.top, y);
              bounds.right = Math.max(bounds.right, x);
              bounds.bottom = Math.max(bounds.bottom, y);
            }
          return {
            sameSize: true,
            imageSize: [a.width, a.height],
            differentPixels,
            bounds: differentPixels ? bounds : null,
          };
        },
        {
          reference: reference.png.toString("base64"),
          restored: restored.png.toString("base64"),
        },
      );
      const geometry = reference.geometry.map((section, index) => {
        const next = restored.geometry[index];
        return {
          id: section.id,
          textMatches: section.text === next.text,
          delta: Object.fromEntries(
            ["x", "y", "width", "height"].map((key) => [
              key,
              next[key] - section[key],
            ]),
          ),
        };
      });
      results.push({ width, raster, geometry });
      console.log(
        JSON.stringify({
          width,
          raster,
          geometryMatches: geometry.every((section) =>
            Object.values(section.delta).every((value) => value === 0),
          ),
        }),
      );
      await context.close();
    }
    writeFileSync(
      `${directory}/comparison.json`,
      JSON.stringify(results, null, 2),
    );
    if (
      results.some(
        (result) =>
          !result.raster.sameSize || result.raster.differentPixels !== 0,
      )
    )
      process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

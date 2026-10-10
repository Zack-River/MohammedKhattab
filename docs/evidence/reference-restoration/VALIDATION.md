# Approved reference reconstruction — 2026-10-03

Reference pages: https://warshataltagheer.vercel.app/ and https://mohamedkhattab.vercel.app/.

The workshop was reconstructed section by section from the original HTML and stylesheet saved in `content/reference/`. Every section and footer retain the source wording, including the countdown, viewer label, video caption, and signup popup. Existing working contact and YouTube integrations remain configured behind the matching visual design.

## Static visual comparison

Full-page original/restored captures use the same Chromium browser, local fonts and source-identical images, 1× device scale, a 900px viewport height, and widths of 320, 390, 768, and 1440px. All images are decoded before capture. Original HTML/CSS is served locally beside the reconstruction to avoid remote resource or browser differences.

At all four widths, the header, nine sections, and footer have identical position and dimensions, and normalized section text matches. The full-page raster comparison reports **zero differing pixels** at every width. See `geometry-and-copy.json`, `pixel-comparison.json`, and the paired PNG captures.

For a deterministic static comparison, animations/transitions are disabled equally on both pages, timer digits are fixed to 03:19:27:13, signup popups and scroll-dependent timeline tracks are hidden, and Next development chrome is hidden. The measurements therefore verify static design fidelity in this controlled browser; they do not claim identical animation frames or rendering across every browser.

## Application validation

ESLint, TypeScript, and the Webpack production build passed. Browser checks cover hydration controls, responsive layouts, assets, section order/copy, menu/FAQ controls, roadmap hover/progress, deferred YouTube embedding, contact links, countdown persistence/expiry, popup dismissal, compiled blur, and reduced motion. The final run passed all **19 browser checks** in 30.9 seconds on `http://localhost:3030`. Next.js development origin protection blocks client scripts through the alternate `127.0.0.1` origin, so the Playwright default now uses localhost.

The runtime dependency audit reported zero vulnerabilities; the upstream ESLint development-chain advisory is recorded in README. The reconstruction retains reusable components, focused hooks, and centralized theme values. No changes were pushed or deployed.

## Viewport entrances restored

The reference's JavaScript-only entrance effects are now restored using native Web Animations and IntersectionObserver. Timing, offsets, and stagger groups are centralized in `app/config/reference-motion.ts`. Entrances run once at the 75% viewport threshold, respect reduced motion, and leave content visible when JavaScript is disabled. Completed animation effects are canceled so original hover transforms can resume. The added regression checks reproduced the missing fade before implementation and passed afterward; the complete suite passed 21 checks in 35.1 seconds. Static screenshots above remain representative because their reduced-motion settings disable these entrances.

# Component architecture refactor — 2026-10-07

The route now renders a typed page template. Individual sections accept content props and are exported for independent composition. Shared primitives own repeated presentation; page records, assets, labels, destinations, and interaction defaults are supplied by `app/data/workshop/content.ts` and its adjacent record files. No runtime libraries were added.

The development suite passed **26 checks in 37.6 seconds**, including both hydration checks. A production-server run passed 24 checks with one development-only hydration diagnostic skipped, before the accidental-route guard was added. Checks cover dependency boundaries, prop-driven copy/assets, accidental Next.js special filenames, alternate-content SSR rendering, independent control IDs, campaign storage and timing, plus the existing design and interaction regressions.

The comparison in `comparison.json` and paired PNGs reports **zero differing pixels at 320, 390, 768, and 1440px**, with identical section dimensions/positions and normalized copy. Captures use Chromium 153, local original HTML/CSS, local fonts/images, a 900px viewport height, and device scale 1. Animations/transitions are disabled equally, timer digits are fixed to 03:19:27:13, popup/timeline decoration is hidden, and the original desktop corridor calculation is applied to both pages. This verifies static fidelity under those controlled conditions.

`scripts/compare-reference.cjs` reproduces the comparison against a running server (`TEST_BASE_URL`, default `http://localhost:3030`). Browser checks require Playwright Chromium; a host Brave command was unavailable inside this restarted WSL environment, so Chromium was restored and its missing libraries were loaded from a temporary folder for validation.

Next.js reserves special filenames even inside nested app folders. Page content uses `content.ts`, and the shared icon renderer uses `ui-icon.tsx`; the architecture guard prevents these accidental routes from returning. The valid application routes are `/` and `/_not-found`.

Final ESLint, standalone TypeScript, `git diff --check`, and Webpack production-build checks passed. The build prerendered the home page successfully and produced no accidental content/component routes. No changes were committed, pushed, or deployed.

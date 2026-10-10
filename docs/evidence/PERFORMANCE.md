> Historical evidence for the superseded journey/player redesign. The current reference reconstruction is documented in `DESIGN_SYSTEM.md`; these results do not measure its performance.

# Scroll profiling: redesign comparison

The redesign removes the observed repeated global ScrollTrigger refresh stalls and reduces mobile style work and slow frames in this synthetic run. Desktop style work decreases, but desktop total task, script, and layout time increase. These results do **not** support a blanket claim that the redesign is faster everywhere.

## Collection

- Production server: `http://127.0.0.1:3022`, old build before and completed redesign after.
- Headless local Brave/Chromium through Playwright/CDP, CPU throttled 4×.
- Three fresh-browser-context trials per viewport: desktop 1440×1000 and mobile 390×844.
- Each trial waits for network idle, fonts, and 1.2 seconds; then performs an 8-second rAF-driven full-document scroll.
- CDP tracing is enabled in both sets. Timing deltas cover the scroll run and its approximately 100 ms settle period. Metrics below are medians of the three trials, independently per metric.
- After-build preflight confirms the editing story, eight WebP images, and zero GSAP pin spacers in every trial. No concurrent browser tests or builds ran during after collection.
- Final desktop trials were collected after a desktop-only change to preload the editing timeline one viewport ahead. Mobile trials are retained from the preceding redesigned build because that change does not run on mobile. `scroll-after.json` records both collection times and source files explicitly.
- Reproduce: `node scripts/profile-scroll.mjs docs/evidence/scroll-after.json`. The default executable is `/opt/brave.com/brave/brave`; override with `PLAYWRIGHT_CHROMIUM_EXECUTABLE` when needed.

Raw records: [before](scroll-before.json), [final after](scroll-after.json), [intermediate redesign](scroll-intermediate.json), and [corrected desktop trials](scroll-corrected-desktop.json). They contain trial-level intervals, long tasks, resource sizes, DOM counts, and the slowest trace events with compiled source positions. Corrected desktop trials additionally record each script request and response time relative to the measurement start.

## Main-thread work

Durations are CDP seconds accumulated across each measured run. Percentage changes compare the exact medians shown; positive means more work.

| Desktop metric               |   Before |    After |  Change |
| ---------------------------- | -------: | -------: | ------: |
| Style recalculation duration | 1.057463 | 0.819589 |  −22.5% |
| Script duration              | 0.481544 | 0.687139 |  +42.7% |
| Layout duration              | 0.089786 | 0.153903 |  +71.4% |
| Total task duration          | 4.257832 | 4.532449 |   +6.4% |
| Layout count                 |       49 |      106 | +116.3% |
| Style recalculation count    |      582 |    1,182 | +103.1% |

| Mobile metric                |   Before |    After |  Change |
| ---------------------------- | -------: | -------: | ------: |
| Style recalculation duration | 1.079107 | 0.549664 |  −49.1% |
| Script duration              | 0.455125 | 0.478824 |   +5.2% |
| Layout duration              | 0.066515 | 0.133259 | +100.3% |
| Total task duration          | 4.634724 | 3.824496 |  −17.5% |
| Layout count                 |       68 |      102 |  +50.0% |
| Style recalculation count    |      684 |    1,055 |  +54.2% |

## Observed scheduling and loaded resources

Frame intervals measure rAF callback spacing in this environment, not device FPS or presentation smoothness.

Zero recorded long tasks does not mean every frame was fast: corrected desktop trial 3 still had two intervals exceeding 50 ms (maximum 50.1 ms), although the other two trials had none. The table's zero is the median across trials.

| Metric                                      | Desktop before → after | Mobile before → after |
| ------------------------------------------- | ---------------------: | --------------------: |
| Median frame interval                       |         16.7 → 16.7 ms |        16.7 → 16.7 ms |
| 95th percentile interval                    |         16.8 → 16.8 ms |        16.8 → 16.7 ms |
| 99th percentile interval                    |         33.4 → 33.3 ms |        33.4 → 16.8 ms |
| Frames exceeding 33 ms                      |                 17 → 6 |                12 → 2 |
| Frames exceeding 50 ms                      |                  1 → 0 |                 2 → 0 |
| Long tasks during sweep                     |                  2 → 0 |                 3 → 0 |
| Decoded script bytes                        |      621,494 → 624,007 |     621,494 → 509,905 |
| Transferred script bytes including overhead |      198,117 → 199,276 |     198,117 → 153,834 |
| Script resource count                       |                  8 → 8 |                 8 → 6 |
| DOM elements                                |              734 → 805 |             733 → 803 |
| GSAP pin spacers                            |                  1 → 0 |                 0 → 0 |
| Scroll distance                             |     12,418 → 10,915 px |    10,902 → 12,026 px |

Mobile decoded script loading falls by 111,589 bytes (18.0%), because the desktop editing timeline does not load GSAP on mobile. Desktop loaded script bytes remain approximately unchanged. These sizes cover script resources observed by the end of the sweep, not all possible interaction bundles or a claim about initial JavaScript.

## Hotspot evidence and resolution

Before trace events repeatedly identify the old application chunk `3g2t_in3yutao.js:1:1585` as a 60–89 ms callback. Inspecting the production chunk maps this position directly to the root `ResizeObserver` scheduling `ScrollTrigger.refresh()` in `useScrollReveals`. A second 59 ms callback at column 12095 maps to the showcase resize observer's global refresh. Those global refresh callbacks are removed from the redesign. Native entrance animation and CSS sticky layout replace their layout ownership; the remaining GSAP desktop story has one scoped timeline and does not pin or add spacers.

The old horizontal showcase also read `scrollWidth`, `clientWidth`, and every card's `offsetLeft` in each ScrollTrigger update. The new native gallery caches card positions on resize and updates its index from the cache. Roadmap geometry now reads all marker rectangles before writing track styles, and its React state changes only when the active day changes. Counter frames update their text nodes directly.

After traces contain no corresponding global-refresh callback. The intermediate redesigned build still showed a 38–42 ms ScrollTrigger scroll handler at `2p2jd75im6m_h.js:1:13812` once per desktop trial. Moving the desktop scene preload one viewport ahead removed that large mid-scroll callback: its largest corrected-trial occurrences are approximately 8–15 ms. React scheduler callbacks are around 9–11 ms. On mobile the largest listed application/runtime callbacks are around 12–16 ms. No long tasks were recorded in any of the six final after trials.

The corrected desktop resource timing confirms that both GSAP chunks finished loading **before** the measurement started in all three trials: approximately 1,830 ms, 1,795 ms, and 800 ms ahead. No script request began during any corrected desktop sweep. The intermediate build had median desktop task time 4.737760 seconds, two long tasks, and ten intervals exceeding 33 ms; corrected medians are 4.532449 seconds, zero long tasks, and six such intervals. These are sequential runs with the usual machine variance, not a controlled isolated experiment.

## Limits and remaining work

- This is a small synthetic diagnostic on one shared machine with headless rendering and tracing overhead. Baseline desktop trial 1 had 97 intervals over 33 ms, versus 17 and 12 in its other trials; medians avoid overclaiming from that outlier. Results are not a real-phone benchmark, Core Web Vitals result, or proof of universal smoothness.
- Equal sweep duration and changed page height produce different scroll velocities and different amounts of content entering view. The visual redesign also adds approximately 70 DOM elements; increased layout and script work cannot be interpreted as the cost of an isolated animation substitution.
- The intermediate redesign deferred GSAP initialization until its scene approached during scrolling. The final build preloads a viewport ahead; on this page and desktop viewport, its script requests complete before the sweep. This confirmation applies to the tested geometry and wait period; fast scrolling on a cold network or different viewport still requires real-device checks.
- Lower style duration with more style recalculations means smaller individual operations, not an absence of style work. Layout duration and desktop task duration remain higher and are the next targets if a stricter desktop work budget is required.
- Traces store the slowest selected events, not a full CPU sampling profile. Callback attribution is supported by compiled source inspection; it does not assign every millisecond to a particular React component.
- No page errors were recorded in either set. Gesture interactions, video playback, and lower-end physical devices require separate checks.

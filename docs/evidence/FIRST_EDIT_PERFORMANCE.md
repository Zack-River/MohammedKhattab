> Historical evidence for the superseded journey/player redesign. The current reference reconstruction is documented in `DESIGN_SYSTEM.md`; these results do not measure its performance.

# First-edit journey: production scroll check

Collected on 2026-10-02 after the connected coffee-clip implementation. Headless local Chromium, 4× CPU throttle, three trials per viewport, an eight-second full-document scroll with tracing. No builds or browser tests ran alongside collection. The predecessor is the completed six-chapter redesign, not the original site.

| Metric | Previous desktop | Current desktop | Previous mobile | Current mobile |
| --- | ---: | ---: | ---: | ---: |
| Total task duration (s) | 4.532 | 4.489 | 3.824 | 3.519 |
| Style duration (s) | 0.820 | 0.762 | 0.550 | 0.491 |
| Script duration (s) | 0.687 | 0.649 | 0.479 | 0.428 |
| Layout duration (s) | 0.154 | 0.151 | 0.133 | 0.120 |
| Frames over 33ms | 6 | 7 | 2 | 0 |
| Frames over 50ms | 0 | 0 | 0 | 0 |
| Long tasks | 0 | 0 | 0 | 0 |
| Decoded script bytes | 624,007 | 632,532 | 509,905 | 518,522 |

No long tasks or frame intervals over 50ms were recorded in any current trial. There were no page errors. Local task-duration medians are slightly lower than the preceding build, while the desktop slow-frame median moves from six to seven; this small difference does not establish a performance regression or universal improvement. Page length and content changed, so equal-duration scrolling produces different velocities. These synthetic results are not physical-device FPS or Core Web Vitals.

The four new browser checks separately confirm actual encoded playback, media requested only after interaction, offscreen pausing, and rhythm continuity. Scrolling alone never mounts a video source. Video decoding during explicit playback is outside this scroll-only diagnostic.

Raw evidence: [current](scroll-first-edit.json), [preceding redesign](scroll-after.json). Reproduce using `node scripts/profile-scroll.mjs docs/evidence/scroll-first-edit.json`.

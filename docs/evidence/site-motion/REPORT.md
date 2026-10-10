# Website motion verification — 2026-10-09

Workshop production build `SGVhGCDY03HUsnG78W2DT` on 3022; LMS production build
`HymcJryBvMIHR3EwyL7Aa` on 3040/3042. Shared source, new production artifacts and
restarted isolated reuse fixture; no stale build is used.

- Workshop suite: **54 passed (1.8m)**, `workshop-tests.log`.
- LMS suite: **47 passed (1.5m)**, `lms-tests.log`.
- Root/LMS lint and TypeScript passed; both apps and fixture built successfully.
- Architecture guard: **255 files, no violations**. Reproduction snapshot: **321 files**.

`tests/site-motion.spec.ts` verifies both apps' production numeric timings and curve,
1000ms native reveal effects, 800ms card transform transitions, animated menu opacity
in both directions, FAQ grid-height transitions, immediate inert state on closure
and reduced-motion cleanup. Existing regressions verify responsive layouts, menus,
keyboard controls, no-JavaScript content, reveal lifecycle and video stream release.

Source changes preserve approved content, dimensions and colors. Timings/easing are
shared theme roles, with native CSS/WAAPI and no new animation dependency. This
verification does not close the historical performance-baseline gaps.


## Hover/leave revision — 2026-10-09

Workshop build `3h_M5GC6p6CnY0PQ8ivQM` on 3022; LMS build
`XGsAHQjbMxvhgwYp32H96` on 3040/3042. Shared curve now
`cubic-bezier(0.4, 0, 0.2, 1)` with 1000ms surfaces and 600ms controls/colors.

- Fresh workshop suite: **56 passed (2.0m)**, `hover-workshop-tests.log`.
- Fresh LMS suite: **47 passed (1.1m)**, `hover-lms-tests.log`.
- Targeted motion suite: **4 passed**. Root/LMS lint/types/build and fixture build pass.
- Architecture: 255 files, zero violations. Source snapshot: 321 files.

`hover-live.json` records intermediate quarter-second positions in both directions.
Workshop moves −0.82px towards −5px, then remains −4.33px after leaving; LMS moves
−1.59px towards −8px, then remains −6.41px after leaving. Both finish at zero.
Recorded clips: `workshop-hover.webm` and `lms-hover.webm`. New tests assert hover-in,
hover-out and continuity on interrupted hover, in addition to menu/FAQ/reduced motion.

The first LMS run failed five old 800ms expectations. Those were changed to 1000ms
to match the new requirement; interpolation and collapse checks remain strict.
The fresh final full LMS run passes. No dependency or playback cleanup was changed.


## Confirmed Windows blocker and marquee fix — 2026-10-09

Windows animation setting is disabled (`windows-animation-setting.json`). A clean
Windows Brave diagnostic profile matches reduced motion, so the live workshop
computes card transition=none and marquee animation=none. Diagnostic-only media
emulation restores the existing 1s transition and marquee without a code change.
See `windows-brave-diagnosis.json`. No OS/user-browser setting was changed.

Separate correction: creator marquee now moves left and accounts for the loop gap.
The old direction failed its new test; the corrected code passes. Windows Brave
reports −350.586px quarter-cycle movement and a 0.037px seam discrepancy.
Workshop suite: **58 passed (1.8m)**, `reels-workshop-tests.log`. New targeted checks:
2 passed. Root/LMS lint/types/build and fixture build pass; 255 architecture files
without violations; 322 snapshot files. LMS runtime was not rerun for this step.

Builds: workshop `a9x_-gF7XqDcRhElbUH9y` (3022), LMS
`B9WeCZ8iMF0Yxg9CB3Q4P` (3040/3042). Code retains reduced-motion accessibility
and hover-to-pause. To see motion in the user's browser, enable Animation effects
in Windows' Accessibility > Visual effects settings and reload.


## Half-second timing — 2026-10-09

The user confirmed animations work and requested 0.5s. Surface/reveal timings are
500ms, controls/colors 300ms; curve, press timing and marquee speed stay unchanged.
Production optimization emitted `.5s`, exposing a latent LMS parser rejection.
The parser now accepts valid leading-dot CSS times; its corrected production
build passes the relevant motion/interaction suite without the error boundary.

Workshop targeted checks: **14 passed (38.3s)** (`half-second-workshop-tests.log`).
LMS targeted checks: **12 passed (25.3s)** (`half-second-lms-tests.log`). Fresh
root/LMS lint/types/build and fixture build passed. Full suites were not rerun.
Architecture: 255 files, zero violations; source snapshot: 322 files.

Builds: workshop `ita4oY7agGJsvSlATBAWc`, LMS `pbhh82Yv6djW_JdJhZk3v`.
All three app ports and fixture were restarted. Windows diagnosis and earlier
recordings above capture the previous 1s timing, not the current 500ms default.

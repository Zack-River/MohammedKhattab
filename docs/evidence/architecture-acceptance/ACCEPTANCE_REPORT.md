# Architecture acceptance report — 2026-10-08

Implementation phases 0–6 are complete. Phase 7 has passing functional, architecture, motion, visual and production checks. **Unqualified acceptance remains open for the full comparative performance scope (T34): Phase 0 recorded before-refactor performance for the two homepages, not every LMS route.** Current measurements cover every specified route; missing historical route measurements cannot be manufactured. This report does not assert universal pixel identity, complete WCAG compliance or production authentication.

## Executed evidence

- Root/LMS lint, TypeScript and production builds: separate `final-{workshop,lms}-{lint,types,build}.log` files.
- Complete zero-retry production suites: **32 workshop / 47 LMS passed**, `final-workshop-tests.log`, `final-lms-tests.log`.
- Three repetitions of all motion/interaction/lifecycle cases, one worker, zero retries: **39 passed**, `final-motion-repeat.log`.
- Critical navigation/filter/enrollment/profile/notes/FAQ flows in Chromium, Firefox and WebKit: **15 passed**, `final-crossbrowser-tests.log`.
- Separate development diagnostic: **1 passed**, `final-development-hydration.log`. Extension-body tolerance does not suppress child mismatch detection.
- Pure-domain and invalid-model cases: **10 passed**, `domain-coverage-tests.log`; V8 block-range coverage **95.33%**, `domain-coverage.json`. This includes function entry ranges and is not an Istanbul branch report.
- Runtime import/style guard: both apps and shared source; current scan **231 files, zero violations**. Guards reject concrete-data imports, transitive cookie/fs access (including dynamic import/require), copied base colors, duplicated route builders/card markup and import cycles.
- Complete maintained-source inventory: `final-source-inventory.json`; source snapshots and lockfile hashes in the reproduction prompt.
- Both standalone artifacts run from `/tmp`, separately from source cwd. `production-artifacts.json` identifies builds; tests check served HTML build IDs, public font bytes and absence of embedded certificate font from client chunks.

## Visual review

All 60 retained screenshots are stored unmasked except the baseline's existing countdown/signup masks. Raw differences remain in `final/comparison.json`. `scripts/verify-visual.cjs` passes 60/60 with **four named exceptions**, never a wholesale baseline replacement:

1. Landing at 320/390/768: five erroneous 16px closed FAQ gaps removed. Section height decreases by exactly 80px; panel heights are zero; subsequent content shifts by exactly those removed rows. The comparator aligns those specific rows and still checks every section's geometry and remaining pixels.
2. Editing detail at 320: duration follows the numeric 7200-second lesson total (`ساعتان`). The shorter metadata row removes 38 raster pixels. Only that small metadata text region is excepted; subsequent raster-edge matching permits the existing 1px geometry tolerance.
3. Within the 320 landing exception, Phase 0 missed the lazy instructor portrait. The final asset is loaded, has the approved bytes and preserves frame geometry. Only the recorded portrait-load region is excluded from that defective reference; asset response/decode checks and the other three widths verify the image independently. This is a baseline capture defect, not a new design direction.

All other matrix geometry remains within 1 CSS px, changed-pixel ratio within 0.1% at the specified channel threshold, overflow zero and captured page errors empty. Review retained red highlights, title/image order, right-side information, left-side prices and purchase actions alongside the course-card assertions. The workshop intro source changed only after the user supplied it; activation remains deferred and has its own exact embed assertion.

## Performance scope and limits

`baseline/performance.json` and `final/performance.json` use the same capture script: four-width screenshot warm-up, then five fresh-context 1440×900 homepage runs with local fonts ready and 120 scroll frames. No synthetic throttling or preview playback. Compare medians; startup tasks are included in the original long-task arrays.

The canonical capture is the before/after comparison. `final/route-performance.json` additionally contains five current runs for every specified route, with timestamped scroll-task intervals. That separate fresh-browser diagnostic has a different warm-up sequence; its frame timings are not interchangeable with the screenshot-warmed baseline. No route's median CLS exceeds 0.1, and no run has repeated long tasks during scrolling. Historical per-route transferred-byte/frame deltas are unavailable.

No third-party runtime library was added; `@khatab/design` is a private local source package. Server font data stays in server chunks. The homepage byte/CLS/frame budgets are checked in `performance-gate.json`; full historical per-route comparison remains open. WSL restarted between captures, so cross-run hardware scheduling/server-runtime conditions also limit stronger performance claims.

The approved workshop retains legacy compact white-on-red text. LMS compact actions use dark labels and small accents use readable tint roles; its contrast assertions pass. The palette fixture verifies primary-derived roles. Preserving the workshop reference is not a claim that every legacy text treatment meets normal-text WCAG contrast.

## Finding closure ledger

| Finding | Implemented ownership / review | Evidence |
| --- | --- | --- |
| A01 | One private design package; import adapters and explicit product variants | T03–T05, T35–T37 |
| A02 | Semantic spacing/radius/footer roles, no unrelated aliases | T06, T36 |
| A03 | Typography/leading/layer/motion roles; documented synthetic weights | T07, T36 |
| A04 | Primary-derived accent colors and readable roles | T08, T36; legacy contrast limitation above |
| A05 | Supplied LandingModel, brand/header/footer/hero actions | T18–T19, T35 |
| A06 | Cohesive marketing/detail/learning/card composition | T20–T21, T35 |
| A07 | Configured featured IDs/order, explicit lesson resources | T11–T12, T17 |
| A08 | Validating route/API/section builders | T13, T37 |
| A09 | Shared profile validation, cookie and scoped-note policy | T14–T15, T37 |
| A10 | Numeric lesson-derived summaries, category registry, numbering | T16, T32 |
| A11 | Framework-free selectors/state operations; separate cookie adapter | T04, T17, T21 |
| A12 | One supplied grid for public/dashboard/recommendations | T23–T24 |
| A13 | Explicit section markers/coherent hero group, independent offscreen targets | T25–T26 |
| A14 | Occurrence registration, preference changes, one owner and cleanup | T24, T27–T28; 39 repeat passes |
| A15 | Zero-height closed LMS FAQ at all matrix widths | T29 |
| A16 | Explicit transition properties, pointer policy, resolved units, separate transforms | T09, T30–T31 |
| A17 | Shared primitives; deliberate typed variants/actions/icon sets | T03, T22, T35 |
| A18 | Unique React IDs and independent instance state | T19, T31 |
| A19 | Semantic supplied copy and canonical identity facts | T18, T20, T33 |
| A20 | Pure XML renderer; server presentation; thin certificate transport | T33, T37 |
| A21 | Controlled canonical-token export, generated server font/palette | T10, T33, T37 |
| A22 | Both-app guards and full suites implemented; **historical per-route performance evidence remains open** | T01–T02, T35–T38; T34 scope limit |
| A23 | Empty preview/progress/catalog, closed artwork/action contracts | T17, T22, T32 |

## Case ledger

| Case | Executed assertions / evidence | Status |
| --- | --- | --- |
| T01 | Immutable Phase 0 hashes/status/checks/screens and initial red-motion reproductions | Pass |
| T02 | Both-app/shared runtime guard plus complete final source/test/script inventory | Pass |
| T03 | Same resolved package source, single CSS imports, explicit heading variants | Pass |
| T04 | Transitive pure/UI/client boundaries and cycle tests, framework-free domain execution | Pass |
| T05 | Independent builds, fresh staged artifacts, served build/font identity | Pass |
| T06 | Radius/spacing mutations, independent footer measure, visual geometry | Pass |
| T07 | Computed font roles, pointer media and breakpoint −1/0/+1 | Pass |
| T08 | Primary override fixture and LMS contrast assertions | Pass with documented legacy workshop contrast exception |
| T09 | No transition-all; touch/fine-pointer movement and reduced-motion checks | Pass |
| T10 | Alias/missing/cycle/unsupported token tests and generated/UI agreement | Pass |
| T11 | Shuffled catalog/modules, explicit preview/lesson order and absent preview | Pass |
| T12 | Per-lesson associations, empty resources and unknown-resource validation | Pass |
| T13 | Injection-rejecting path builders and production routes | Pass |
| T14 | Shared normalized profile boundaries and invalid API/cookie sanitation | Pass |
| T15 | Two learner/course/lesson scopes, same-key notification and policy owners | Pass |
| T16 | Numeric duration total, category owner and 01/09/10/11 formatting | Pass |
| T17 | Empty/none/some/all/duplicate/unknown progress and safe optional next | Pass |
| T18 | Two supplied landing models, alternate assets/actions and no default-copy leakage | Pass |
| T19 | Repeated profile/note/menu/FAQ IDs and instance independence | Pass |
| T20 | Alternate section order/exclusion and extracted detail/learning composition | Pass |
| T21 | Minimal stats/continue/outline/resource/certificate models | Pass |
| T22 | Action type contracts, accessible errors/loading, duplicate-submit prevention, invalid models | Pass |
| T23 | Public/dashboard/recommendation/enrolled grid variants and disabled motion | Pass |
| T24 | Retained grid, replacement occurrences, search/empty/history | Pass; three repeats |
| T25 | Alternate standalone identifiers/markers and nested ownership | Pass; three repeats |
| T26 | Offscreen paused targets and independent mobile triggers | Pass; three repeats |
| T27 | Both preference directions, active cancellation and future unread targets | Pass; three repeats |
| T28 | Ten clean lifecycles, removed/reinserted occurrence, observer/listener/animation cleanup | Pass; three repeats |
| T29 | Four-width open/close/intermediate/rapid keyboard FAQ frames, inert/ARIA | Pass; three repeats |
| T30 | Actual 3040 live/seeked 1000ms entrance and 800ms hover, touch/press/title states | Pass; three repeats |
| T31 | Focus/control checks and critical keyboard flows across three browsers | Pass |
| T32 | Invalid published data, empty safe models, rejecting progress/artwork/action contracts | Pass |
| T33 | Escaped valid XML, concrete colors, embedded font, safe response filename | Pass |
| T34 | Canonical homepage comparison and all-route current measurements | Partial: historical per-route comparisons absent |
| T35 | Deliberate violations and permitted fixtures, dynamic/transitive imports and cycles | Pass |
| T36 | 60-screen gate with four explicit exceptions and independent portrait proof | Pass with recorded exceptions |
| T37 | Exact statuses/schema/downloads, demo persistence, deferred embed, streamed noindex fallbacks | Pass |
| T38 | Builds/checks/suites/repeats/browsers and closure documents | Partial until T34's complete comparative scope can be evidenced |

## Continuing this work

Run current-source checks and retain the baseline. Do not claim all mandatory gates closed while T34's historical scope is missing. Future changes can use these complete per-route current measurements as their baseline. Recover an authentic pre-refactor LMS artifact/source if the original all-route comparative requirement must be signed off; otherwise an explicit revised performance scope is required. No baseline regeneration or fabricated historical measurements is authorized.

> Current routing: one root Next.js application. Portfolio `/`, Ta3llam `/ta3allam`, workshop `/7days-freelance`; routes/APIs under root `app/`, feature modules under `modules/`. Earlier references to separate app builds are historical. See root `WORK_CHECKPOINT.md` for actual verification results.

# Architecture acceptance test specification

Status: executed evidence and case-by-case results are in [the acceptance report](docs/evidence/architecture-acceptance/ACCEPTANCE_REPORT.md). T34/T38 retain the historical per-route performance limitation. Read with [ARCHITECTURE_REFACTOR_PLAN.md](ARCHITECTURE_REFACTOR_PLAN.md) and [CURRENT_ARCHITECTURE_AUDIT.md](CURRENT_ARCHITECTURE_AUDIT.md). The plan's completion ledger maps every finding to tests.

## Test discipline

Use the existing TypeScript/Playwright tooling for browser, structural and pure-domain checks. A new runner is not required. Source guards should use the existing TypeScript compiler AST/import resolution where appropriate; broad regex matching is not proof of dependency isolation. Fixtures must not become publicly deployed demo routes.

Each case needs an ID, assertions, result and evidence. Failures must name the violated contract. No final `test.skip`, `test.fixme`, expected failure, automatic screenshot update or "200 or 404" fallback used to conceal a broken contract. Do not claim a planned test has passed.

Use fresh browser contexts per case, deterministic catalog/profile fixtures, isolated cookies/local storage and a stubbed external YouTube response. Wait for fonts/images and application readiness. Use web-first assertions and animation state/frame sampling rather than arbitrary long sleeps. Repeat timing/lifecycle cases three times with zero retries for acceptance; retain traces on any failure.

## Routes and viewport matrix

- Workshop: `/`, existing menu, roadmap, countdown, FAQ and deferred-video interactions.
- LMS: `/`, `/ta3allam/courses`, filtered/search/empty catalog, `/ta3allam/courses/editing-foundations`, `/ta3allam/courses/motion-essentials`, `/ta3allam/login`, `/ta3allam/dashboard`, `/ta3allam/dashboard/courses`, `/ta3allam/dashboard/profile`, `/ta3allam/dashboard/resources`, `/ta3allam/dashboard/certificates`, `/ta3allam/learn/editing-foundations/first-cut`, and unknown course/lesson paths.
- Visual identity/overflow: 320×900, 390×900, 768×1024, 1440×900. Capture each route at all widths, including lower sections after reveals settle.
- Motion: 390×900 and 1440×720; fine-pointer hover and touch emulation tested separately. Sample breakpoint boundaries at documented width −1, width, width +1.
- Accessibility: keyboard-only plus normal/reduced-motion modes. Run critical navigation, FAQ, filter, enrollment and notes cases in Chromium, Firefox and WebKit before final acceptance. Provision missing browser binaries during implementation; unavailable coverage must be reported, not counted as passing.
- JavaScript disabled: content, course titles/prices and ordinary navigation remain readable; interactive demo mutations are not required to work without JS.

## Structural and theme cases

| ID | Setup and action | Strict pass condition |
| --- | --- | --- |
| T01 | Record status/hash, root/LMS scripts, URLs and current checks before refactor. | Evidence distinguishes app, revision and pre-existing failures; baseline files remain immutable through the comparison. |
| T02 | Scan maintained runtime/config/test files in both apps and shared source. | Every in-scope file is inventoried; no app is excluded because root lint/TS excludes it. Each finding has an implementation/test ledger entry. |
| T03 | Resolve shared UI/style/type imports from both apps. Modify a base token in an isolated fixture. | Both consume one source; test token affects both; explicit product variants remain distinct. No manual base copies, duplicate primitive implementations or double base CSS import. |
| T04 | Traverse imports from UI/client exports and pure selectors. Import pure progress in a framework-free test process. | No path to cookies, `next/headers`, fs, concrete site/course data or server barrel from pure modules/shared UI; explicit Next navigation adapters are allowed. No cycles. |
| T05 | Build/start each app independently from its own directory using the proposed shared package. | Shared exports resolve, React has no duplicate-runtime failure, required styles/fonts are served, metadata/export assets are present. Production tracing includes shared server assets; client chunks exclude server utilities. |
| T06 | Snapshot computed padding/gaps/radii/measures; vary only radius tokens in a fixture, then spacing tokens separately. | Radius affects rounding only; spacing affects intended geometry only. Footer width is independent of testimonial width. Production migration preserves original geometry within 1 CSS px. |
| T07 | Inspect type/layer/motion roles, fonts and media conditions; render representative headings/body/quotes. | Each configurable visual role has an owner; supported/synthetic font policy is explicit. Breakpoint conditions agree with documented tokens. No accidental literal-value ban on structural CSS/SVG. |
| T08 | Override primary brand in a fixture and compare all intended accent backgrounds/borders/glows/gradients/text. | All primary-derived roles follow the new palette; no stale original-red dependent role. Production stays #fc3522/#101317. Required normal-text contrast ≥4.5:1, large-text/UI contrast ≥3:1; pre-existing contrast exceptions are reported for a deliberate design-preserving resolution. |
| T09 | Analyze loaded CSS and test action/card state rules at pointer/breakpoint variants. | Zero `transition: all` in maintained loaded styles; no unguarded hover movement for touch; no contradictory obsolete state declarations or new `!important` patches hiding them. |
| T10 | Resolve direct/aliased export tokens from different cwd; exercise missing, cyclic and unsupported expressions. | Concrete supported colors agree with computed UI roles. Unsupported/missing/cyclic values fail clearly. No unresolved `var(...)` reaches SVG/metadata; no second manual palette. |

## Domain, data and component reuse cases

| ID | Setup and action | Strict pass condition |
| --- | --- | --- |
| T11 | Shuffle catalog/modules while configuring the same preview course/lesson and showcase IDs. | Same featured identity and configured display order/limit; no hero dependence on index 0. Unknown configured ID produces a defined fallback/validation error, never an unsafe property access. |
| T12 | Supply three lessons with different resource IDs plus a lesson with none. | Each renders only its associated resources in configured order; no global `slice(0,2)` fallback. Unknown resource association is rejected or explicitly omitted by validated policy. |
| T13 | Exercise route/API builders with valid IDs and malformed path fragments; inspect call sites. | Generated destinations match App Router endpoints; invalid segments cannot inject unintended path/query/hash. Components use owned builders; section links target actual unique section IDs. |
| T14 | Test profile name lengths 1/2/60/61 and email lengths 100/101 plus malformed email, whitespace and tampered cookie data. | UI/API/persistence use identical normalized constraints; valid boundary values accepted, invalid values rejected/sanitized by documented policy. No partial persistence after validation failure. |
| T15 | Save notes for two learners/scopes, courses and lessons; reload, notify another mounted instance, unmount. | Keys/event namespace come from one policy; intended same-key synchronization works, unrelated notes remain isolated, cleanup removes listeners. Cookie version/lifetime and demo seeds have single owners. |
| T16 | Change lesson duration/count/category registry; number items 1,9,10,11. | Card/artwork/detail/curriculum agree on summaries; first-course default duration equals numeric lesson total unless editorial override is named. Category rename changes all labels; numbering is 01/09/10/11, never 010. |
| T17 | Calculate progress for none/some/all lessons, empty course, duplicate/unknown completion IDs. | Finite percent in [0,100], deduplicated valid completions, consistent counts; empty is 0/0 with 0%, optional next is absent. At full completion no unsafe `next.id` use; summary model is framework-independent. |
| T18 | Render hero/header/footer/brand with two distinct typed models and alternate actions/assets/copy. | Output follows supplied model with no leaked Ta3llam defaults; default feature composition still renders approved identity/copy. UI progress/accessibility labels are supplied, not imported from global copy. |
| T19 | Mount two profile forms, note editors, menus and FAQ instances, then interact with only one. | No duplicate IDs; label/control/ARIA references resolve to their own instance; state of the second instance does not change. SSR/hydration association remains stable. |
| T20 | Compose alternate landing/detail/learning layouts with reordered/excluded sections and changed content. | Cohesive extracted sections render independently without renderer edits; no duplicated card/section implementation in routes. Identity/certificate/instructor facts derive from one record; copy keys convey meaning. |
| T21 | Supply minimal continue/stats/outline/resource/certificate models without full LearningState/catalog. | Renderers work without domain lookup or persistence import. Routes resolve data and compose; missing optional next/resource states remain usable. |
| T22 | Exercise navigation actions, mutation buttons, loading/disabled/error states, icon variants and empty states. | Correct anchor/Next navigation/button semantics; no nested interactive elements or duplicate submission. Feedback is accessible. Type checks reject href without label and unsupported action/artwork variants. |

## Motion and interaction cases

### T23 — One course grid, all real contexts

Render public, two-column dashboard, recommendations and enrolled-card models. Assert exact record count, order, layout and progress/action data. Each grid declares motion policy explicitly; disabling it leaves content visible. Entrance wrapper and hovered article must be distinct elements. All existing purchase/detail/continue destinations must work.

### T24 — Filter replacement on the existing grid

Visit `/ta3allam/courses`, settle initial entrances, retain the grid DOM reference, then select motion, another category, search and no-result search. Track stable occurrence IDs before/after each update.

Pass: newly mounted eligible cards register exactly once and show a real intermediate entrance frame; retained unchanged cards do not replay. Removed cards leave no live animation/registration. An empty result does not error; returning to results animates newly mounted occurrences. Repeat using browser back/forward and client-side navigation. A changed CSS duration or an opacity-1 card with no animation is a failure.

### T25 — Standalone section motion contracts

Render hero, instructor, FAQ, transformation and coaching sections outside the landing, with alternate class names/section IDs. Supply the supported explicit contract/markers.

Pass: intended targets enter without generic engine knowledge of those page classes. A motion-disabled section stays readable. Nesting section and page wrappers produces one registration per target, never duplicate entrance transforms.

### T26 — Mobile targets enter when actually read

At 390×900 place instructor image above copy that starts below the trigger region. Scroll until only the image qualifies, then slowly reveal the copy. Repeat for stacked course cards.

Pass: offscreen targets have not completed their entrance prematurely. Each eligible target runs upon crossing the documented viewport boundary. Coherent groups may stagger; distant stacked children must have independent triggers. Restored scroll positions and initially visible targets remain readable and do not get stuck hidden.

### T27 — Preference changes in both directions

Load with reduced motion, assert visible content with no entrance animations, then switch reduction off. Add a new eligible item and scroll to a previously unobserved target. In a fresh case, switch reduction on during an active entrance and back off.

Pass: subscription exists from initial load; enabling reduction cancels active/pending motion and settles content visibly. After disabling reduction, new/future targets animate; already read targets do not hide/replay. Reduced mode removes nonessential transform motion from entrances/hover/press while preserving clear interaction feedback. No reload is required and no animation/listener duplicates accumulate.

### T28 — Lifecycle and cleanup

Run ten navigation/filter cycles, unmount/re-mount the fixture and update options. Instrument engine-owned observers/listeners/active animations in test fixtures.

Pass: one owner per target; completed effects release hover transforms. Unmount returns engine-owned counts to baseline; option replacement cancels old ownership. No callbacks mutate detached elements, console errors or increasing retained registrations. Essential preference listeners may remain while a scope is mounted, not after unmount.

### T29 — FAQ fully collapses on mobile and desktop

At every visual width, inspect closed → open → closed and rapid toggles. Record bounding height over animation frames. Test multiple items and keyboard activation.

Pass: closed content panel height ≤1 CSS px, `aria-hidden=true`, inert and no focusable descendants reachable; open height fits content with no clipping. During both transitions at least one frame has height strictly between endpoints. After settling, no leftover gap (the audited 16px is a failure). ARIA expansion matches intended state; rapid toggles settle to the last action.

### T30 — Real smooth transitions, hover and touch policy

On `/` at port 3040 and course-grid contexts, inspect WAAPI/CSS timing and sampled geometry. For deterministic timing assertions, pause a test-observed animation and seek to intermediate time; also require one live observed intermediate frame.

Pass: entrance duration equals its resolved 1000ms token and surface duration equals 800ms, allowing ±1ms serialization tolerance. Active entrance opacity is strictly between 0 and 1 with translation approaching rest; hover translation has an intermediate value before settling to the token-defined lift. Title changes color without underline. Pointer leave/rapid re-entry settle correctly. Touch emulation has no persistent hover lift; press/focus feedback works. No overlapping entrance/hover ownership overrides the card transform.

### T31 — Keyboard and motion accessibility

Tab through header, filter, card links/action, FAQ, profile and lesson controls in both preference modes. Trigger controls with Enter/Space as appropriate.

Pass: visible focus, correct accessible names/roles, no hidden FAQ focus, no keyboard trap, unique control associations and announced mutation errors/status. Reading order and action hierarchy follow RTL. No interaction depends solely on hover or animation.

## Defensive contracts and export cases

| ID | Setup and action | Strict pass condition |
| --- | --- | --- |
| T32 | Supply empty catalog/modules, missing preview, unknown artwork kind, negative/over-100/NaN progress and invalid empty-state action. | Published invalid data fails validation with useful errors. Supported empty UI has no crash or NaN/undefined URL. Progress rejects invalid model or clamps at documented boundary (choose one policy consistently); unsupported variant/action fails type checks. |
| T33 | Render/download certificate with Arabic, quotes, `<`, `&`, alternate issuer, fonts and aliased theme tokens. | SVG is valid XML with escaped content, embedded/local font strategy works and concrete colors match theme. Card/export issuer facts agree. Filename is safe; pure renderer has no Next/cookie/HTTP import. |

## Final regression gates

### T34 — Performance compared under identical conditions

Capture production transferred JS/CSS by route, layout shifts and scroll frame/long-task traces before/after with the same browser, hardware, viewport, fixtures and warm-up. Use five runs and compare medians. Document throttling and exclude external preview playback from the scroll comparison.

Pass budgets: no new third-party runtime dependency; no newly introduced server module in client chunks; no duplicate base CSS; compressed JS/CSS route totals increase by no more than the larger of 5% or 5KiB each without an explained, reviewed necessity. CLS ≤0.1; p95 scroll frame duration does not regress more than 10%; no new repeated >50ms scroll-handler task. A noisy measurement is inconclusive and must be rerun, not called a pass. These are proposed comparative acceptance budgets, not measured current results.

### T35 — Architecture guards actually detect regressions

In a disposable fixture, introduce: a UI import of concrete course data, a client import reaching cookie code, copied base token ownership, duplicated route builder and a page owning duplicated reusable card markup. Run the relevant guards/review assertions and restore fixture state.

Pass: each intended boundary violation is caught with its location/rule; permitted feature defaults, intrinsic SVG values and Next route conventions are not rejected. Test helpers must enumerate root, LMS and shared sources. This validates the guards themselves rather than relying on successful no-op scans.

### T36 — Accepted visual identity and responsive parity

Compare route screenshots/section geometry against Phase 0, fonts loaded and animations settled. Freeze countdown/signup only in fixtures and mask dynamic text only, never entire cards/sections. Use the same browser/OS/fonts.

Pass: no unapproved text, ordering, palette, typography or hierarchy change; section/card bounds within 1 CSS px; screenshot changed-pixel ratio ≤0.1% with a per-pixel threshold of 0.1 and every visible cluster reviewed. No horizontal overflow >1px at matrix widths. Existing workshop reference-copy/design checks stay passing. Only recorded bug fixes (FAQ gap), explicit duration correction and agreed accessibility repairs may receive narrowly documented updated expectations; do not globally refresh baselines. Inspect red highlights and price/purchase prominence separately.

### T37 — Production API and navigation smoke

Build/start both apps on isolated test ports and assert running artifact identity. Exercise all listed LMS screens and current API endpoints for courses, course detail, profile, enrollment, progress, resource and certificate downloads. Verify fresh-context demo state, enrollment persistence, completion, notes and profile update. Stub video delivery; require zero iframe before user activation and the intended embed after activation. Collect console/page errors and hydration warnings.

Pass: successful endpoints return their explicitly specified status/content type/schema; invalid request/unknown ID/blocked entitlement paths return their exact documented status without mutating state. API unknown records must return 404. Page not-found behavior is asserted per route: non-streamed response 404; a documented streamed not-found response can be 200 only with correct fallback and noindex. Never use a blanket `status === 200 || status === 404`. No hydration errors in a clean browser; no suppressHydrationWarning workaround hiding app mismatch. Certificate/resource response headers and actual downloaded contents must be verified.

### T38 — Full verification and closure evidence

Run both apps' lint, TypeScript, build and complete suites, then attach case results, screenshots/traces and the A01–A23 closure ledger. Shared code changes require both consumers' validation. Any baseline failure, missing browser or environment limitation is explicit.

Current commands (run in the specified app directory; these scripts already exist):

```sh
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e
```

Both test suites use the root Playwright configuration and default to `http://localhost:3040`, configurable through `TEST_BASE_URL`. Start the single production artifact before testing. The root config starts the separately built reuse fixture on 3043; development hydration diagnostics have their own auto-started dev server. During Phase 0, make LMS test targeting configurable and verify the intended production server rather than accidentally testing an old running build. Keep the user's live server intact by using isolated test ports. Proposed architecture/domain tests must be wired into the final check command; a browser-only pass is insufficient.

Pass: every mandatory case has evidence, both complete suites and builds pass, timing cases pass three consecutive zero-retry runs, all audit findings have ownership review plus mapped tests, and no unexplained visual/performance regressions remain. Numerical coverage alone cannot substitute for these cases; target >80% coverage of newly extracted domain branches and cover every listed invariant/error branch.

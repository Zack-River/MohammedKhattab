# Architecture refactor plan

Status: implementation phases 0–6 complete; phase 7 verification recorded in [the acceptance report](docs/evidence/architecture-acceptance/ACCEPTANCE_REPORT.md). Full historical per-route performance comparison remains open; do not claim unconditional acceptance.

Source: [CURRENT_ARCHITECTURE_AUDIT.md](CURRENT_ARCHITECTURE_AUDIT.md). Acceptance specification: [ARCHITECTURE_ACCEPTANCE_TESTS.md](ARCHITECTURE_ACCEPTANCE_TESTS.md). All 23 findings must be closed with evidence, not merely renamed files or extracted constants.

## Outcome and constraints

The workshop and Ta3llam LMS must consume one maintained design foundation, while each product retains its approved variants. New pages must be composable from supplied content and reusable sections. Catalog, progress, navigation and persistence rules must have clear owners. Animations must work through filtering, navigation, preference changes and mobile layouts.

Preserve #fc3522, #101317, local IBM Plex Sans Arabic, Arabic RTL, red highlights, accepted section geometry and course-card hierarchy. Keep the title above the image, information on the right, price on the left, a prominent purchase action, and title hover color without an underline. No redesign, third-party animation/UI packages, authentication/payment expansion or global state-library migration is part of this refactor.

Centralization means one authority **per responsibility**. It does not mean a giant constants file. SVG geometry, mathematical identities, intrinsic image sizes, HTTP codes and structural CSS remain in their appropriate implementations. Components are split by responsibility and demonstrated reuse, not arbitrary line limits.

## Target ownership

| Owner | Responsibilities | Excludes |
| --- | --- | --- |
| Shared design foundation | Base tokens, reusable primitives, reusable marketing contracts, generic interaction hooks/engine | Concrete workshop/LMS content, catalog, cookies, HTTP handlers |
| App theme entry points | Import shared base; explicit workshop/LMS variant deltas | Copied base palettes or unrelated domain constants |
| Catalog feature | Course/category records, validation, summaries, featured selection, resource relationships | DOM rendering, cookies |
| Learning feature | Pure progress selectors, state operations, narrow view models | Browser/Next I/O in pure modules |
| Persistence adapters | Cookie and local-storage access, serialization, policy integration | Course artwork or UI labels |
| Navigation/integration configuration | Typed route and endpoint builders, external destinations, section identifiers | Visual measurements |
| Page/content configuration | Semantic copy, identity, section content, selection settings | Renderer implementation |
| Components/hooks | Supplied models, presentation, local interaction state and cleanup | Concrete page datasets or implicit entitlement decisions |
| Routes/API handlers | Resolve inputs, call feature operations, compose/return results | Repeated cards, pure calculation, SVG templates |

Preferred shared-source layout: a private local `packages/design-system/` package consumed by both apps, with separate style, UI, interaction and type exports. Keep the existing app locations and scripts. Server-only utilities must not be re-exported from a client-facing barrel. Each app's existing theme file remains its documented entry point and imports the canonical base before variant deltas. Do not import workshop page data into the LMS.

This package structure is implemented and independently built by both consumers. Phase 1 must prove source resolution, independent builds, CSS ordering and production tracing before broad migration. If packaging cannot pass those gates, revise this plan explicitly; silently retaining two manual copies does not resolve A01. Read the installed Next.js guides when implementing configuration changes.

## Execution sequence

Each phase is a reviewable change set. Run its focused tests and both applications' applicable checks before proceeding. Do not hide regressions by replacing screenshots or weakening assertions.

### Phase 0 — Lock the baseline and introduce failure reproductions

1. Record source revision/diff, runtime URL/port, dependencies and current validation results separately for each app. Preserve existing user changes.
2. Capture settled screenshots and computed geometry for all listed routes/widths in the acceptance specification. Freeze dynamic countdown/signup values only in fixtures; retain production behavior.
3. Add focused regressions for filter replacement, reduced-motion preference changes, mobile FAQ collapse and touch hover rules. Demonstrate the confirmed failures on current code.
4. Set up alternate-data and repeated-instance fixtures using the existing test toolchain. Keep fixture routes/helpers out of production output.
5. Record current bundle/CSS sizes and repeatable scroll measurements. Establish a controlled environment before setting comparative performance gates.

Gate: T01–T02, a documented baseline, and failing reproductions for T24/T27/T29. These expected initial failures are evidence, not permission to ignore them in final validation. Existing unexpected failures must be recorded separately from new regressions.

### Phase 1 — Establish common ownership and dependency rules

Addresses A01, A22; prepares A17/A21.

1. Inventory paired implementations; distinguish identical shared behavior from intentional product variants.
2. Move a small primitive and base token set into the shared package first. Prove both apps can consume them in development and production without broad client boundaries.
3. Migrate genuinely shared primitives, types, hooks and base styles. Keep product-specific sections/styles local or behind explicit variants.
4. Replace copied foundation files with imports/re-exports where compatibility is needed. Remove redundant base CSS loading.
5. Add import-boundary and source-ownership guards across both apps and the shared package. Audit transitive imports, not just import-string patterns.
6. Document how app-specific overrides work. Update design/agent documentation only to reflect the verified ownership model.

Gate: T03–T05, T35 and both app builds; workshop/LMS screenshots retain their separate approved variants. Shared dependency resolution and required assets must work from each app directory and the packaged production artifact.

### Phase 2 — Make theme and component CSS semantic

Addresses A02–A04, A15–A16, A21.

1. Replace radius-as-spacing, testimonial-as-footer-measure and unrelated shadow/icon aliases with correctly named roles. Preserve their current computed values during migration.
2. Add typography weight/leading, stacking and motion roles. Make requested synthetic font weights an explicit documented policy; do not silently change text weight during refactoring.
3. Define semantic accent roles and their relationship to the primary brand color. Keep readable accent text distinct from action backgrounds. Remove independent old-red values that are meant to follow the primary.
4. Consolidate each component's base, responsive, hover, focus and pressed rules in one owner. Remove contradictory unconditional hover rules and `transition: all`; eliminate obsolete overrides rather than appending another patch.
5. Fix FAQ wrapper ownership so closed panels occupy zero content height at every supported width while preserving inert/ARIA behavior.
6. Replace ad hoc server theme readers with a controlled, documented resolver/export contract sourced from canonical CSS tokens. Support the actual alias/color forms used; reject unresolved/cyclic/unsupported forms clearly. No second hand-maintained palette and no dependence on arbitrary process cwd.

Gate: T06–T10, T29–T31, T33/T36 and visual parity. The only intended FAQ visual change is removal of the erroneous collapsed gap. Alternate-brand fixtures must not alter the production brand.

### Phase 3 — Normalize domain models and remove positional policy

Addresses A07–A11, A19, A23.

1. Introduce typed route/API builders and shared section identifiers. Keep external contact destinations separate.
2. Own profile constraints in one domain validator reused by UI, API and persisted-state sanitation. Own cookie lifetime/version, note key/event builders and demo seed records in their appropriate modules.
3. Normalize category IDs/labels and numeric lesson durations. Derive lesson counts and displayed duration through selectors. Correct the existing 2h15m/2h conflict using lesson totals, unless an explicitly named editorial duration is intentionally configured.
4. Configure featured course IDs, preview lesson ID, showcase/recommendation limits and resource associations explicitly. Define order, unknown-ID and empty-catalog behavior.
5. Extract pure progress calculations from Next cookie access. Return typed optional next-lesson data; resolve view models before rendering.
6. Validate published catalog invariants and handle empty fixtures safely. Add exhaustive artwork variants, bounded progress and action contracts that cannot produce an unlabeled link.
7. Replace opaque copy keys with semantic page/domain models and a single identity record. Labels still reach reusable renderers through props.

Gate: T11–T17 and T32. Reordering data cannot change configured featured identity; all routes and mutation behavior remain correct. Intentionally corrected duration text is an explicit baseline exception, not a license to rewrite unrelated copy.

### Phase 4 — Separate page composition from reusable presentation

Addresses A05–A06, A17–A19, A23.

1. Supply hero, brand, header/footer and landing with typed content models. Keep feature wrappers that provide approved defaults.
2. Extract the skill strip, course showcase, coaching benefits and final CTA as cohesive sections.
3. Extract course overview/metadata/outcomes/enrollment presentation and learning shell/header/actions/takeaways/resources. Keep request/data resolution in routes/features.
4. Extract resource and display-certificate cards. Pass narrow models to continue cards, stats and lesson outlines instead of whole learning state.
5. Provide deliberate navigation-action and button-action contracts, consistent loading/disabled/error feedback, and governed icon variants. Do not force unrelated artwork through one universal icon abstraction.
6. Replace fixed instance IDs with generated or caller-supplied unique IDs. Keep state local to the instance.
7. Render two alternate page compositions without editing the components. Record retained portability primitives and remove obsolete files only when their role has been resolved.

Gate: T18–T22, T32, T35–T36. A route may compose sections; it may not own duplicated reusable card markup or domain math. No requirement to extract a decorative span solely for file length.

### Phase 5 — Unify course grids and repair motion lifecycle

Addresses A12–A14, remaining A16.

1. Extend CourseGrid to accept resolved card items, optional progress/action models, layout variants and an explicit motion policy. Use it for public, dashboard, recommendation and enrolled-course presentations.
2. Preserve separate entrance wrappers and card hover transforms. Avoid applying competing transforms to the same element.
3. Replace generic page-class selectors with explicit reveal markers/group contracts. A reusable section declares its targets or receives the contract; the generic engine does not know instructor/coaching/hero classes.
4. Define one registration owner per target and stable identity per rendered occurrence. Register new items after filter/navigation changes without replaying unchanged items. A removed item cancels cleanly; reinserted items form a new occurrence and may enter once.
5. Subscribe to preference changes even when starting in reduced motion. Enabling reduction cancels animations and leaves content visible. Disabling it registers future/new/unrevealed content without hiding or replaying already read content.
6. Trigger vertically stacked content when its actual target enters the configured viewport region. Retain grouped staggering only where the group is a coherent visible unit.
7. Use the documented 800ms surface / 1000ms entrance durations and easing roles. Eliminate stale scopes/options and clean up listeners, observers and animations on route changes/unmount.

Gate: T23–T28, T30–T31, T34. Verify visible intermediate states on the actual LMS landing at port 3040, not merely token text. The audited preference bug is resolved by a documented future-target policy; replaying the already visible hero is not required.

### Phase 6 — Separate certificate export from transport

Addresses A20 and integration of A19/A21.

1. Define one certificate model derived from learner, course, issuer identity and eligibility.
2. Extract pure escaping/rendering, export presentation configuration and font/asset access. Retain intrinsic SVG coordinates in the artwork implementation.
3. Limit the API route to validated lookup/eligibility, renderer invocation and response headers/status.
4. Verify trace inclusion and concrete theme colors in production output; share issuer facts with the display card without forcing screen markup and SVG markup to be identical.

Gate: T33 and T36–T37, including blocked/unearned and successful downloads.

### Phase 7 — Close findings and freeze the reusable contract

Addresses A22 and verifies all A01–A23.

1. Run the full acceptance matrix in production builds of both apps.
2. Run architecture, pure-domain, alternate-data, multiple-instance, route/API, accessibility, visual and motion checks. Repeat lifecycle tests to detect instability.
3. Compare performance with Phase 0 under identical conditions and inspect new client dependencies/CSS loading.
4. Update DESIGN_SYSTEM.md with actual token roles, ownership, component contracts and motion rules. Update reproduction documentation without blessing unrelated visual differences.
5. Attach results, screenshots/traces, production smoke evidence and a finding-to-change/test ledger. Every finding requires its mapped tests plus review of the actual owner/boundary.

Gate: all mandatory cases pass; no skipped or expected-failure cases in the final suite; no unexplained console/hydration errors, design drift or performance regressions. An unresolved finding stays open with a specific reason.

## Change review and rollback policy

Review shared exports, CSS cascade and dependency graphs alongside screenshots. File splitting alone is insufficient evidence of SOLID: pure calculations must be importable without framework I/O; UI must accept alternate models; API handlers must delegate domain/rendering work; supported component variants must satisfy the same contract.

Use small phase-specific diffs. Keep a failing test and repair the implementation rather than deleting the assertion. If a phase breaks approved geometry or shared-package production consumption, stop the next phase and repair/revert that phase's changes without discarding the user's unrelated work. No destructive reset is part of this plan.

## Completion ledger

| Finding | Phase | Required tests |
| --- | --- | --- |
| A01 | 1 | T03–T05, T35–T37 |
| A02 | 2 | T06, T36 |
| A03 | 2 | T07, T36 |
| A04 | 2 | T08, T36 |
| A05 | 4 | T18–T19, T35 |
| A06 | 4 | T20–T21, T35 |
| A07 | 3 | T11–T12, T17 |
| A08 | 3 | T13, T37 |
| A09 | 3 | T14–T15, T37 |
| A10 | 3 | T16, T32 |
| A11 | 3–4 | T04, T17, T21 |
| A12 | 5 | T23–T24 |
| A13 | 5 | T25–T26 |
| A14 | 5 | T24, T27–T28 |
| A15 | 2 | T29 |
| A16 | 2–5 | T09, T30–T31 |
| A17 | 1/4 | T03, T22, T35 |
| A18 | 4 | T19, T31 |
| A19 | 3–4 | T18, T20, T33 |
| A20 | 6 | T33, T37 |
| A21 | 2/6 | T10, T33, T37 |
| A22 | 0/1/7 | T01–T02, T34–T38 |
| A23 | 3–4 | T17, T22, T32 |

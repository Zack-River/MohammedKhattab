> Historical audit: its findings predate the completed refactor and unified routing. Current routes and APIs are under root `app/`; see `WORK_CHECKPOINT.md` and `README.md` for verified state.

# Current architecture and reuse audit

Date: 2026-10-07. Scope: the current workshop application and `lms/`, including the landing at `http://localhost:3040/`.

Investigation only. No application code, CSS, data, dependencies, build or server configuration was changed during this audit. This report describes the implementation as it exists, including the hero animation added before this audit was requested.

## Conclusion

Centralization and reuse are **partial**. The workshop has stronger content-injection boundaries than the LMS. The LMS has useful small components, but a folder split does not establish independent, customizable components. Several renderers still own concrete page data, route decisions, selection rules or domain calculations. Two separate copies of the foundation can drift independently.

The major problems are ownership and coupling, rather than oversized React files: the largest renderer is the 187-line course artwork, the landing composition is 130 lines, the lesson route is 120 lines, and the course-detail route is 106 lines. These are not automatically “god components”; the mixed responsibilities below explain which boundaries actually need attention.

## Coverage and evidence

- Reviewed 175 runtime source/style files: 77 in the workshop and 98 in the LMS, totaling 15,939 lines, including duplicated styles. Identical sources were compared; import-only copies were reviewed through their differences.
- Also reviewed both projects' package, Next, ESLint, TypeScript and Playwright configurations; all maintained test sources/helpers; both reference scripts; and the session helper. See the file inventory below.
- Read both AGENTS/design contracts and current architecture documents. Historical reference HTML/CSS, frozen reproduction source blocks, fixtures, screenshots, font/image binaries, licenses, lockfiles, generated declarations, `.next` and `node_modules` are reference/dependency artifacts, not independently authored live components. Assets were inventoried, not visually re-audited or decoded byte by byte.
- Read-only local import-graph inspection found **no cycles among resolved local runtime modules**. This is not a complete package/runtime dependency proof.
- Found **23 source pairs identical after normalizing the workshop import prefix**, including the 3,053-line workshop stylesheet and animation engine. Ten pairs are byte-identical.
- **19 LMS component files import concrete `data/` modules**. Some feature defaults are reasonable; this is evidence of concrete coupling, not 19 separate automatic SOLID violations.
- Stylesheet inspection found no raw hex/RGB color declarations in either workshop stylesheet or `lms/styles/lms.css`. The LMS CSS references have no missing theme token definitions. Colors and dimensional values are substantially centralized already.
- Radius/portfolio-radius tokens are used for padding, margins or gaps in **60 declarations in workshop.css** and **59 in lms.css**. The copied workshop file contributes the same 60 declarations to the LMS. These counts count declarations, not individual token occurrences.
- Workshop CSS has 69 `!important` occurrences and three `transition: all` declarations; LMS CSS has five `!important` occurrences. Responsive overrides are not inherently defects; conflicting ownership is assessed separately below.
- Browser checks against the existing running production app confirmed filter/reveal lifecycle and mobile FAQ issues. No build, dependency changes or new test source was required for these checks.
- Runtime source fingerprint, using sorted path + per-file SHA-256: `9216c0c5a6d243da2079e361faa78c45e79a91b55bd748ff0d1e28ae4789955e`.

## Findings

“High” means a current behavior gap or a substantial obstacle to the requested reuse/centralization. “Medium” means a maintainability or customization gap. This is an architecture audit, not a security certification.

### A01 — High: the design foundation is copied, not shared

Evidence: [workshop theme](app/styles/theme.css:4), [LMS theme](lms/styles/theme.css:4), [workshop styles](app/styles/workshop.css:1), [LMS workshop copy](lms/styles/workshop.css:1), paired UI components/hooks/types. Both projects have independent package/configuration boundaries; neither imports a common foundation.

Consequence: changing one theme or renderer does not update the other. FAQ behavior, heading context and transition durations have already diverged. Some differences are requested product variants and should remain explicit, rather than being flattened into one visual output.

Direction: one maintained base foundation with explicit workshop/LMS variants, or an explicitly generated/versioned copy workflow if independent project distribution is required. Do not make the LMS import the workshop's concrete page data as a shortcut.

### A02 — High: spacing is coupled to radius and unrelated tokens

Evidence: [LMS navigation padding](lms/styles/lms.css:29), [secondary action padding](lms/styles/lms.css:103), [search gap](lms/styles/lms.css:444), [workshop capsule](app/styles/workshop.css:253). `--radius-md` is used for padding/gaps and `--portfolio-radius` for workshop padding and shadow offsets. LMS footer copy width uses `--measure-testimonial-summary`.

Consequence: rounding the cards changes whitespace and other geometry. A testimonial-width adjustment also changes footer copy. A value being a CSS variable is not sufficient semantic centralization.

Direction: semantic spacing, measure, icon and shadow roles referencing stable base measurements. Preserve current computed values during migration; do not redesign the page.

### A03 — Medium: theme policy does not cover all visual roles

Evidence: [LMS weights/leading](lms/styles/lms.css:10), [header stacking](lms/styles/lms.css:703), [workshop hover scale](lms/styles/workshop.css:1304), [quote font](app/styles/workshop.css:1709), [font assets](lms/styles/fonts.css:1), [workshop entrance configuration](app/config/reference-motion.ts:3).

There are 15 literal font-weight and 20 literal line-height declarations in LMS CSS; copied workshop CSS has 58 and 36 respectively. Several easing curves/scales and stacking levels remain literal. `Georgia, serif` is embedded in a selector. Font assets supply weights 400–700 while some selectors request 800/900; any synthetic weight should be an explicit design decision. Workshop JS motion has its own configurable numeric values rather than using CSS theme timing.

Direction: named roles for typography, layering and motion; font assets remain font declarations. Do not extract every `0`, `1fr`, percentage, aspect ratio, SVG coordinate or time-unit conversion into a giant constants object. Media-query literals are expected because native CSS conditions do not resolve custom properties; verify them against documented breakpoints.

### A04 — Medium: the primary color does not control its supporting palette

Evidence: [LMS palette](lms/styles/theme.css:10) and the independent `--color-rgba-252-53-34-*` declarations throughout that file. There are 24 literal red-alpha values, plus literal red shades/tints.

Consequence: changing only `--primary-red` leaves borders, glows, gradients and readable accent text tied to the old red. These values are centrally located, but the relationships are not centralized.

Direction: explicit semantic accent roles with deliberate derivation or a complete configurable brand palette. Preserve readability distinctions and the approved red identity.

### A05 — High: landing content cannot be injected into the main renderers

Evidence: [LandingHero](lms/components/marketing/landing-hero.tsx:1), [Landing](lms/features/marketing/landing.tsx:15), [Brand](lms/components/layout/brand.tsx:2), [ProgressBar](lms/components/ui/progress-bar.tsx:1). Hero, header, footer and brand have no content props; the UI progress primitive imports site copy. The workshop's [HeroSection](app/components/workshop/hero-section.tsx:10) already demonstrates a content contract.

Consequence: another landing or brand requires editing existing renderers or replacing global modules. Moving strings into `interface-copy.ts` has centralized their location but has not made the renderers independently customizable.

Direction: typed landing/hero/layout models assembled at the composition boundary; shared UI takes labels and accessibility text through props. Feature wrappers may provide defaults without making the underlying primitive concrete to one site.

### A06 — High: reusable sections are embedded in route/page compositions

Evidence: [Landing](lms/features/marketing/landing.tsx:22) contains the skill strip, course showcase, coaching-benefit records/rendering and final CTA. [CoursePage](<lms/app/(public)/courses/[slug]/page.tsx:34>) contains overview, metadata, outcomes and enrollment panel. [LessonPage](lms/app/learn/[slug]/[lessonId]/page.tsx:36) contains shell/header, title, actions, takeaways and resources. [ResourcesPage](lms/app/dashboard/resources/page.tsx:15) and [CertificatesPage](lms/app/dashboard/certificates/page.tsx:26) own card markup.

Consequence: these patterns cannot be composed on a new page without copying markup and decision logic. Existing small instructor/FAQ/transformation components do not solve the inline sections.

Direction: extract cohesive reusable sections/cards and their contracts, leaving route orchestration and data resolution in the route/feature boundary. Avoid extracting individual decorative spans solely to reduce file size.

### A07 — High: content selection relies on array positions

Evidence: [hero course/module selection](lms/components/marketing/landing-hero.tsx:59), [landing first three](lms/features/marketing/landing.tsx:50), [dashboard first two](lms/app/dashboard/page.tsx:62), [lesson first two resources](lms/app/learn/[slug]/[lessonId]/page.tsx:99), [unused featured flag](lms/data/courses.ts:37).

Consequence: reorder the catalog and the hero changes; the advertised `featured` flag does not control the featured section. Every lesson gets the first two global resources rather than its own related resources. Empty catalogs/modules cause unsafe access in the hero.

Direction: explicit featured/preview course IDs, configured display limits and course/lesson resource associations. The component should receive the already-selected model and handle missing optional content.

### A08 — Medium: navigation and API paths have multiple owners

Evidence: [navigation records](lms/data/site.ts:15), [card path builders](lms/components/courses/course-card.tsx:20), [enrollment navigation/API](lms/components/courses/enroll-button.tsx:18), [lesson resource URLs](lms/app/learn/[slug]/[lessonId]/page.tsx:102), [profile mutation](lms/components/account/profile-form.tsx:23). Section IDs such as `coaching` and `courses` are repeated in composition, navigation and motion selectors.

Direction: typed route/endpoint builders and section identifiers owned by their domains. HTTP status codes and Next.js route filenames are conventions, not theme values. Leave external contact destinations in integration configuration.

### A09 — Medium: validation and storage policy are scattered

Evidence: [profile fields](lms/components/account/profile-form.tsx:41), [API profile validation](lms/app/api/profile/route.ts:14), [cookie sanitation](lms/features/learning/service.ts:43), [cookie name/default seed](lms/features/learning/service.ts:6), [cookie lifetime](lms/features/learning/service.ts:63), [notes event name](lms/hooks/use-lesson-notes.ts:7), [notes key](lms/app/learn/[slug]/[lessonId]/page.tsx:114).

Name/email limits 2/60/100 are repeated rather than shared. Demo course and completed-lesson IDs live inside the persistence service. Storage/event namespaces are hardcoded independently.

Direction: shared profile validation rules, demo seed data, persistence policy and key builders, separate from visual theme configuration. Keep demo state explicitly distinct from real identity/entitlements.

### A10 — Medium: course summaries have competing sources of truth

Evidence: [course duration/category labels](lms/data/courses.ts:24), [category registry](lms/data/courses.ts:331), [card lesson count](lms/components/courses/course-card.tsx:42), [artwork lesson count](lms/components/courses/course-artwork.tsx:181), [catalog lesson helper](lms/features/catalog/service.ts:16).

The first course claims 2h15m while its six stored lesson durations total 2h. Category labels are copied into each course despite the category registry. Lesson flatten/count logic is repeated in renderers. The category union is separately maintained in `types/lms.ts`. Prefixing numbers with `0` produces `010` for a tenth item in curriculum/outline/hero.

Direction: normalize records and calculate summaries once through catalog helpers/view models; model lesson duration numerically and format at display boundaries, unless editorial duration is intentionally a separate field. Use deliberate numbering formatting.

### A11 — Medium: pure calculations share a module with Next.js persistence

Evidence: [learning service](lms/features/learning/service.ts:1), [ContinueCard](lms/components/learning/continue-card.tsx:7), [DashboardStats](lms/components/learning/dashboard-stats.tsx:4), [LessonOutline](lms/components/learning/lesson-outline.tsx:4).

`courseProgress` is a pure calculation but comes from a module importing `next/headers`, concrete catalog data and UI copy. Components take the entire `LearningState` to calculate view data themselves. These components currently render on the server; this is not a demonstrated client-bundle error. It prevents the calculation from being reused cleanly in a client or independent test context.

Direction: pure progress selectors and typed progress models separated from cookie adapters and seed configuration. Supply view models to presentation components. API validation and state operations should similarly have domain ownership instead of being rebuilt in each handler.

### A12 — High: CourseGrid cannot serve the dashboard variants

Evidence: [CourseGrid props](lms/components/courses/course-grid.tsx:4), [dashboard library grid](lms/app/dashboard/courses/page.tsx:21), [dashboard duplicated grids](lms/app/dashboard/page.tsx:44).

The shared grid accepts only courses, renders no progress and fixes its class/scope. Dashboard routes implement their own grids to attach progress and a two-column modifier. Consequently the same card layout has different entrance coverage depending on page.

Direction: one grid composition that accepts resolved card models, layout modifiers and explicit motion policy; keep CourseCard independent from its entrance wrapper.

### A13 — High: reveal registration depends on hidden page selectors

Evidence: [RevealContent](lms/components/marketing/reveal-content.tsx:4), [readRevealOptions](lms/lib/reveal-options.ts:23), [workshop configurable wrapper](app/components/workshop/workshop-content.tsx:9).

The LMS wrapper exposes only two scope names and cannot receive reveal options, although its hook supports them. The resolver knows hero classes, instructor layout, stage children, coaching and FAQ selectors. Rendering a reusable section by itself does not attach its motion. Changing its DOM/classes silently changes animation coverage. A group triggered by a parent also starts animations on children below the viewport: on a stacked mobile instructor section, the copy can finish entering before it is actually read.

Direction: explicit component/group motion contracts or declarative reveal markers; timing remains in theme tokens. Composition should declare motion ownership and avoid duplicating parent/child transforms.

### A14 — High, browser-confirmed: reveal lifecycle does not register changing children

Evidence: [hook dependency list](lms/hooks/use-scroll-reveals.ts:24), [one-time query](lms/lib/scroll-reveals.ts:12), [preference handler](lms/lib/scroll-reveals.ts:82).

Live reproduction at 1440×720: visit `/courses`, allow initial animations to settle, click the motion category. The same `[data-reveal-scope=cards]` DOM wrapper remains, but the rendered card wrapper has **zero animations** and opacity 1. The effect depends on the ref object/options, not the changed card set.

Second reproduction: load `/` with reduced motion enabled, then switch to no preference. The media query is false but hero/card reveal animations remain zero because the initial early return installed no subscription. Cancellation when reduction is enabled is intentional; reactivation policy is not implemented.

Direction: define registration on child/content changes and preference lifecycle, with cleanup and once-per-item behavior. Preserve visible content when animation is disabled. Add lifecycle tests rather than only fresh-page motion tests.

### A15 — High, browser-confirmed: inherited mobile FAQ padding prevents full collapse

Evidence: [legacy mobile wrapper padding](lms/styles/workshop.css:2869), [new animated inner wrapper](lms/components/marketing/faq-item.tsx:38), [new collapse rules](lms/styles/lms.css:1990).

At 390×900, the first panel is **16px high while closed**, expands to approximately 112.59px, and returns to **16px rather than zero** after closing. It correctly stays inert and aria-hidden. The inherited mobile padding establishes a nonzero minimum for the new grid wrapper. The existing transition test uses a desktop viewport and misses this.

Direction: one owner for the FAQ wrapper/spacing and expansion styles; verify closed geometry at mobile and desktop widths. Preserve accessibility state and both transition directions.

### A16 — High: later motion patches leave contradictory legacy rules active

Evidence: [unconditional secondary hover](lms/styles/lms.css:119), [unconditional card hover](lms/styles/lms.css:259), [fine-pointer hover block](lms/styles/lms.css:2029), [inherited primary hover](lms/styles/workshop.css:520).

The later fine-pointer block specifies -8px/-4px movement, but earlier unconditional :hover rules still move cards -5px and secondary/primary buttons -2px outside that media condition. Therefore the documented “touch avoids sticky hover” policy is not guaranteed by CSS. This is a cascade finding; actual behavior varies by touch browser and was not device-tested here. Three inherited `transition: all` rules also remain despite the LMS design document's prohibition.

Direction: consolidate each component's state rules and responsive variants, rather than appending more overrides. Review global reset, heading, button and inherited workshop selectors when isolating LMS component styles.

### A17 — Medium: shared primitives are copied or bypassed

Evidence: [unused ActionLink](lms/components/ui/action-link.tsx:5), [direct card action](lms/components/courses/course-card.tsx:53), [Symbol paths](lms/components/ui/symbol.tsx:2), [Icon paths](lms/components/ui/ui-icon.tsx:4), [inline resource cards](lms/app/dashboard/resources/page.tsx:16).

The local import graph has no runtime importers for LMS ActionLink, Eyebrow or SocialLinks. Do not remove them solely from that count: some may be retained portability primitives. Most actions bypass ActionLink; it only renders an anchor and supports primary styling, so it does not meet the Next Link/button use cases. Arrow/play/menu paths exist in two icon systems; some art direction differences may be intentional, but their selection/defaults are not governed by one contract. Repeated form/CTA error markup also remains inline.

Direction: a usable shared action contract for navigation and button operations, explicit icon variants and reusable feedback/card patterns. Keep feature-specific markup when it has a different responsibility.

### A18 — Medium: repeated instances have fixed DOM IDs

Evidence: [profile IDs](lms/components/account/profile-form.tsx:35), [notes ID](lms/components/learning/lesson-notes.tsx:8), [student navigation ID](lms/components/layout/dashboard-shell.tsx:42).

These work in the current single-instance screens, but render two instances and IDs/label/control associations collide. Public header and FAQ already use `useId`; the policy is inconsistent.

Direction: per-instance generated IDs or explicit unique ID props. Test more than one instance with distinct data, rather than claiming universal reuse from one working screen.

### A19 — Medium: central copy is opaque and duplicated

Evidence: [interface copy](lms/data/interface-copy.ts:1), [site copy](lms/data/site.ts:119), [course-detail instructor string](lms/data/interface-copy.ts:34), [instructor record](lms/data/site.ts:31), [artwork literal](lms/components/courses/course-artwork.tsx:181), [profile placeholder](lms/components/account/profile-form.tsx:56).

Keys such as `routeText1ValueValueValue` and `landingText19` describe extraction order, not meaning. Certificate title, instructor identity, brand descriptions and some course/navigation labels have independent duplicates. The course-detail instructor name does not derive from the instructor record. `LESSONS` and `you@example.com` remain literal visible copy in renderers.

Direction: semantic domain/page copy models and a single identity record; distinguish intentionally different wording from duplicate facts. Make component labels customizable through their models rather than merely renaming one global bag.

### A20 — Medium: certificate generation owns presentation inside an API route

Evidence: [certificate route](lms/app/api/certificates/[slug]/route.ts:37), especially the complete SVG template on line 40.

Authorization/demo checks, font file loading, XML escaping, artwork rendering and download response are in one handler. Font family, font sizes, border/radius choices and filename brand prefix are embedded there. Colors already correctly come from theme; intrinsic SVG coordinate geometry need not become CSS variables.

Direction: certificate export model and renderer, configured font/brand/export presentation, with the route limited to validating the request and returning the artifact. The display certificate card is a separate current renderer inside a page, not a shared export contract.

### A21 — Medium: server theme access is a fragile source-file parser

Evidence: [LMS theme reader](lms/lib/theme.ts:1), [workshop metadata parser](app/layout.tsx:8), [tracing include](lms/next.config.ts:7).

The parser depends on process working directory and the literal CSS source format. It returns the first matching text without resolving aliases or selectors. Changing a color token into `var(--color-canvas)` would yield that expression instead of a concrete color for SVG/export consumers. Current direct color tokens work, and output tracing explicitly includes the source file, so no present deployment failure is asserted.

Direction: one documented/exportable token contract with deliberate alias resolution or build-time generation, rather than separate ad hoc readers. Avoid introducing a second manually maintained palette.

### A22 — High: architecture verification does not cover the LMS

Evidence: [architecture guards](tests/architecture.spec.ts:19), [reuse fixtures](tests/helpers/component-reuse.fixture:1), [LMS suite](lms/tests/lms.spec.ts:1), [root ESLint exclusion](eslint.config.mjs:8), [root TS exclusion](tsconfig.json:39), [LMS motion tests](lms/tests/lms.spec.ts:328).

Workshop guards check `app/components`/`app/hooks` and its supplied content. They do not inspect `lms/components`/`lms/hooks`. The separate LMS lint config can lint the LMS when run there; root lint success is not LMS verification. LMS tests cover the current screens but do not verify alternate hero/brand data, multiple profile/notes instances, token semantics, catalog replacement/reordering/empty modules, filter reveal registration or mobile zero-height FAQ collapse. Existing 404 tests also permit 200 or 404, so they check visible fallback/noindex more strongly than precise status behavior.

Direction: project-specific boundary and reuse checks plus focused behavior regressions for confirmed issues. Do not import the workshop guard unchanged: define permissible feature defaults and stricter primitive boundaries first. Existing identity/copy tests should remain independent checks against accidental redesign.

### A23 — Medium: empty/invalid models are outside current component contracts

Evidence: [progress calculation](lms/features/learning/service.ts:66), [progress UI](lms/components/ui/progress-bar.tsx:11), [EmptyState optional link label](lms/components/ui/empty-state.tsx:8), [artwork branch](lms/components/courses/course-artwork.tsx:29).

An empty course produces division by zero and `next: undefined`, while cards/continue/enrollment assume `next.id`. ProgressBar trusts any supplied percent/count/total. EmptyState permits an href without a label. CourseArtwork defaults any non-timeline/motion/design variant to business, so an added variant is not exhaustively checked. Current demo records do not exercise these cases.

Direction: enforce validated catalog/domain invariants and explicit optional next-lesson models; define progress bounds and action props as useful contracts. Split artwork variants if they need independent customization, retaining intrinsic SVG paths/coordinates as artwork rather than theme constants.

## SOLID assessment

| Principle | Current evidence | Appropriate boundary |
| --- | --- | --- |
| Single responsibility | Landing/route compositions own inline sections and selection; certificate handler owns rendering; progress service mixes pure math and cookies | Separate page orchestration, presentational sections, pure selectors and I/O adapters |
| Open/closed | New hero data/artwork variant/layout requires renderer edits; fixed reveal scope controls coverage | Inject typed models and supported variants; compose sections without copying their internals |
| Liskov substitution | There is no meaningful inheritance hierarchy here; unsupported or empty inputs expose contract assumptions | State and validate invariants; do not invent inheritance merely to claim SOLID |
| Interface segregation | Artwork consumes a full Course; learning renderers consume full LearningState; fixed grid cannot express progress/layout needs | Narrow view models for actual responsibilities, avoiding dozens of ornamental props |
| Dependency inversion | LMS primitives/sections depend on concrete copy/catalog and Next persistence through shared modules | Resolve defaults/data at feature boundaries; pure UI/calculations depend on supplied contracts |

## Preserve what is already working

- Keep #fc3522, #101317, local IBM Plex Sans Arabic, RTL, approved red accents, current card information order and accepted page identity.
- Retain prop-driven instructor/FAQ/transformation sections, existing domain helpers, deferred YouTube loading, timer/observer cleanup and the separate card entrance wrapper.
- Keep ordinary structural CSS, SVG artwork geometry, intrinsic asset sizes, HTTP conventions and mathematical identities in their proper implementations. These are not all defects to extract.
- Demo cookie persistence, shared preview video and mock prices are declared demo scope; their existence is not an accidental hardcoded production integration.
- One authoritative owner **per responsibility** is the target. Putting colors, API errors, routes, validation, demo records and storage policy into one massive constants file would create another coupling problem.

## Recommended implementation order after the audit

1. Establish the authoritative shared foundation/variant policy and explicit LMS dependency rules. Preserve current computed visuals before migration.
2. Untangle semantic theme roles, red palette relationships and component-owned CSS; resolve the confirmed FAQ/cascade conflict.
3. Introduce route/endpoint/validation/storage builders and normalize catalog/progress models with pure selectors.
4. Make the landing/layout content injectable; extract the cohesive inline sections and reusable course-detail/learning/resource/certificate patterns.
5. Extend CourseGrid for the actual public/dashboard models; make motion ownership and content/preference lifecycle explicit.
6. Add meaningful boundary, alternate-data, multiple-instance, filter/navigation and mobile motion checks; compare the accepted design at existing breakpoints.

This is a proposed refactor order, not implemented work. The confirmed browser issues above are observations on the existing production app; tests/build/lint results from earlier turns are not presented as a fresh audit pass.

## File-by-file inventory

The inventory below records each maintained runtime/support source and the findings that apply. “No separate finding” means reviewed without an additional issue in this audit's scope; it does not certify the file for every production concern. Copied modules inherit foundation findings even when their individual logic is sound.

### Runtime sources and styles

| File | Lines | Review note |
| --- | ---: | --- |
| [app/components/ui/action-link.tsx](app/components/ui/action-link.tsx) | 35 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/ui/asset-image.tsx](app/components/ui/asset-image.tsx) | 21 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/ui/container.tsx](app/components/ui/container.tsx) | 13 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/ui/eyebrow.tsx](app/components/ui/eyebrow.tsx) | 21 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/ui/microcopy.tsx](app/components/ui/microcopy.tsx) | 22 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/ui/rich-text.tsx](app/components/ui/rich-text.tsx) | 22 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/ui/section-heading.tsx](app/components/ui/section-heading.tsx) | 36 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/ui/section.tsx](app/components/ui/section.tsx) | 13 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/ui/social-icon.tsx](app/components/ui/social-icon.tsx) | 51 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/ui/social-links.tsx](app/components/ui/social-links.tsx) | 31 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/ui/ui-icon.tsx](app/components/ui/ui-icon.tsx) | 59 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/author-identity.tsx](app/components/workshop/author-identity.tsx) | 43 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/clients-section.tsx](app/components/workshop/clients-section.tsx) | 30 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/creator-chip.tsx](app/components/workshop/creator-chip.tsx) | 22 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/creator-marquee.tsx](app/components/workshop/creator-marquee.tsx) | 26 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/discount-countdown.tsx](app/components/workshop/discount-countdown.tsx) | 45 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/faq-accordion.tsx](app/components/workshop/faq-accordion.tsx) | 27 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/faq-item.tsx](app/components/workshop/faq-item.tsx) | 41 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/faq-section.tsx](app/components/workshop/faq-section.tsx) | 16 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/featured-review.tsx](app/components/workshop/featured-review.tsx) | 22 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/final-cta-section.tsx](app/components/workshop/final-cta-section.tsx) | 35 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/guarantee-section.tsx](app/components/workshop/guarantee-section.tsx) | 37 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/hero-section.tsx](app/components/workshop/hero-section.tsx) | 30 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/hero-video.tsx](app/components/workshop/hero-video.tsx) | 35 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/index.ts](app/components/workshop/index.ts) | 10 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/instructor-photo.tsx](app/components/workshop/instructor-photo.tsx) | 20 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/instructor-section.tsx](app/components/workshop/instructor-section.tsx) | 34 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/instructor-stats.tsx](app/components/workshop/instructor-stats.tsx) | 25 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/recent-signup-toast.tsx](app/components/workshop/recent-signup-toast.tsx) | 41 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/reel-card.tsx](app/components/workshop/reel-card.tsx) | 24 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/review-card.tsx](app/components/workshop/review-card.tsx) | 13 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/roadmap-day.tsx](app/components/workshop/roadmap-day.tsx) | 48 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/roadmap-formula.tsx](app/components/workshop/roadmap-formula.tsx) | 29 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/roadmap-section.tsx](app/components/workshop/roadmap-section.tsx) | 32 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/roadmap-timeline.tsx](app/components/workshop/roadmap-timeline.tsx) | 34 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/scarcity-bar.tsx](app/components/workshop/scarcity-bar.tsx) | 37 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/site-footer.tsx](app/components/workshop/site-footer.tsx) | 26 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/site-header.tsx](app/components/workshop/site-header.tsx) | 30 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/site-navigation.tsx](app/components/workshop/site-navigation.tsx) | 66 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/testimonials-section.tsx](app/components/workshop/testimonials-section.tsx) | 39 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/transformation-section.tsx](app/components/workshop/transformation-section.tsx) | 37 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/transformation-stage.tsx](app/components/workshop/transformation-stage.tsx) | 15 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/workshop-content.tsx](app/components/workshop/workshop-content.tsx) | 18 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/components/workshop/workshop-page.tsx](app/components/workshop/workshop-page.tsx) | 43 | A01: reviewed prop-driven workshop renderer; no additional component-boundary finding |
| [app/config/offer.ts](app/config/offer.ts) | 8 | Reviewed configured workshop records/settings; reference values are intentionally supplied here |
| [app/config/reference-motion.ts](app/config/reference-motion.ts) | 72 | A03, A13: configured workshop timing/selectors separate from theme; intentional reference baseline |
| [app/config/reference-ui.ts](app/config/reference-ui.ts) | 8 | Reviewed configured workshop records/settings; reference values are intentionally supplied here |
| [app/config/site.ts](app/config/site.ts) | 57 | Reviewed configured workshop records/settings; reference values are intentionally supplied here |
| [app/data/workshop/clients.ts](app/data/workshop/clients.ts) | 97 | Reviewed configured workshop records/settings; reference values are intentionally supplied here |
| [app/data/workshop/content.ts](app/data/workshop/content.ts) | 298 | Reviewed configured workshop records/settings; reference values are intentionally supplied here |
| [app/data/workshop/curriculum.ts](app/data/workshop/curriculum.ts) | 94 | Reviewed configured workshop records/settings; reference values are intentionally supplied here |
| [app/data/workshop/faq.ts](app/data/workshop/faq.ts) | 37 | Reviewed configured workshop records/settings; reference values are intentionally supplied here |
| [app/data/workshop/reviews.ts](app/data/workshop/reviews.ts) | 103 | Reviewed configured workshop records/settings; reference values are intentionally supplied here |
| [app/data/workshop/signup.ts](app/data/workshop/signup.ts) | 22 | Reviewed configured workshop records/settings; reference values are intentionally supplied here |
| [app/data/workshop.ts](app/data/workshop.ts) | 6 | Reviewed configured workshop records/settings; reference values are intentionally supplied here |
| [app/globals.css](app/globals.css) | 3 | Reviewed; no separate finding in this audit's scope |
| [app/hooks/use-accordion.ts](app/hooks/use-accordion.ts) | 9 | A01: reviewed workshop behavior/helper; no additional finding beyond copied/selector lifecycle where shared |
| [app/hooks/use-discount-countdown.ts](app/hooks/use-discount-countdown.ts) | 35 | A01: reviewed workshop behavior/helper; no additional finding beyond copied/selector lifecycle where shared |
| [app/hooks/use-inner-corridor.ts](app/hooks/use-inner-corridor.ts) | 49 | A01: reviewed workshop behavior/helper; no additional finding beyond copied/selector lifecycle where shared |
| [app/hooks/use-mobile-navigation.ts](app/hooks/use-mobile-navigation.ts) | 39 | A01: reviewed workshop behavior/helper; no additional finding beyond copied/selector lifecycle where shared |
| [app/hooks/use-reference-signup.ts](app/hooks/use-reference-signup.ts) | 27 | A01: reviewed workshop behavior/helper; no additional finding beyond copied/selector lifecycle where shared |
| [app/hooks/use-roadmap-progress.ts](app/hooks/use-roadmap-progress.ts) | 86 | A01: reviewed workshop behavior/helper; no additional finding beyond copied/selector lifecycle where shared |
| [app/hooks/use-scroll-reveals.ts](app/hooks/use-scroll-reveals.ts) | 23 | A01: reviewed workshop behavior/helper; no additional finding beyond copied/selector lifecycle where shared |
| [app/hooks/use-video-embed.ts](app/hooks/use-video-embed.ts) | 13 | A01: reviewed workshop behavior/helper; no additional finding beyond copied/selector lifecycle where shared |
| [app/layout.tsx](app/layout.tsx) | 67 | A21: ad hoc theme parser; other metadata is already configured |
| [app/lib/countdown.ts](app/lib/countdown.ts) | 43 | A01: reviewed workshop behavior/helper; no additional finding beyond copied/selector lifecycle where shared |
| [app/lib/scroll-reveals.ts](app/lib/scroll-reveals.ts) | 92 | A01: reviewed workshop behavior/helper; no additional finding beyond copied/selector lifecycle where shared |
| [app/lib/timeline.ts](app/lib/timeline.ts) | 3 | A01: reviewed workshop behavior/helper; no additional finding beyond copied/selector lifecycle where shared |
| [app/lib/video.ts](app/lib/video.ts) | 25 | A01: reviewed workshop behavior/helper; no additional finding beyond copied/selector lifecycle where shared |
| [app/page.tsx](app/page.tsx) | 6 | Reviewed; no separate finding in this audit's scope |
| [app/styles/fonts.css](app/styles/fonts.css) | 28 | A01, A03: copied font declarations; supplied weights 400/500/600/700 |
| [app/styles/theme.css](app/styles/theme.css) | 276 | A01–A04: independent foundation; radius/spacing aliases and literal palette relationships |
| [app/styles/workshop.css](app/styles/workshop.css) | 3053 | A01–A03, A16: reference stylesheet; global roles, literals and overrides |
| [app/types/interactions.ts](app/types/interactions.ts) | 40 | A01, A10, A23: reviewed contracts; duplicated foundation and domain assumptions where applicable |
| [app/types/marketing.ts](app/types/marketing.ts) | 139 | A01, A10, A23: reviewed contracts; duplicated foundation and domain assumptions where applicable |
| [app/types/ui.ts](app/types/ui.ts) | 58 | A01, A10, A23: reviewed contracts; duplicated foundation and domain assumptions where applicable |
| [app/types/workshop.ts](app/types/workshop.ts) | 26 | A01, A10, A23: reviewed contracts; duplicated foundation and domain assumptions where applicable |
| [lms/app/(public)/courses/[slug]/page.tsx](<lms/app/(public)/courses/[slug]/page.tsx>) | 106 | A06, A08, A11, A19: embedded overview/outcomes/enrollment and duplicate instructor fact |
| [lms/app/(public)/courses/page.tsx](<lms/app/(public)/courses/page.tsx>) | 47 | A08, A10, A12: route/query defaults and fixed course grid; otherwise focused composition |
| [lms/app/(public)/layout.tsx](<lms/app/(public)/layout.tsx>) | 15 | Reviewed; no separate finding in this audit's scope |
| [lms/app/(public)/login/page.tsx](<lms/app/(public)/login/page.tsx>) | 32 | A05–A06, A19: inline onboarding copy/step composition |
| [lms/app/api/certificates/[slug]/route.ts](lms/app/api/certificates/[slug]/route.ts) | 47 | A08, A20–A21: eligibility/font/export/rendering/HTTP in one handler |
| [lms/app/api/courses/[slug]/route.ts](lms/app/api/courses/[slug]/route.ts) | 15 | A08, A11, A19: route validation/download boundaries and shared error ownership |
| [lms/app/api/courses/route.ts](lms/app/api/courses/route.ts) | 10 | A08, A11, A19: route validation/download boundaries and shared error ownership |
| [lms/app/api/enrollments/route.ts](lms/app/api/enrollments/route.ts) | 21 | A08, A11, A19: route validation/download boundaries and shared error ownership |
| [lms/app/api/profile/route.ts](lms/app/api/profile/route.ts) | 30 | A09, A11, A19: field validation duplicated with UI/cookie and opaque copy keys |
| [lms/app/api/progress/route.ts](lms/app/api/progress/route.ts) | 39 | A08, A11, A19: route validation/download boundaries and shared error ownership |
| [lms/app/api/resources/[id]/route.ts](lms/app/api/resources/[id]/route.ts) | 20 | A08, A11, A19: route validation/download boundaries and shared error ownership |
| [lms/app/dashboard/certificates/page.tsx](lms/app/dashboard/certificates/page.tsx) | 54 | A06, A08, A11, A20: eligibility selector and inline certificate renderer |
| [lms/app/dashboard/courses/page.tsx](lms/app/dashboard/courses/page.tsx) | 40 | A11–A12: repeated enrolled selector and nonshared grid |
| [lms/app/dashboard/layout.tsx](lms/app/dashboard/layout.tsx) | 10 | Reviewed; no separate finding in this audit's scope |
| [lms/app/dashboard/page.tsx](lms/app/dashboard/page.tsx) | 69 | A06–A07, A11–A12: inline selectors and repeated course grids |
| [lms/app/dashboard/profile/page.tsx](lms/app/dashboard/profile/page.tsx) | 33 | A06, A19: inline profile presentation and concrete copy |
| [lms/app/dashboard/resources/page.tsx](lms/app/dashboard/resources/page.tsx) | 35 | A06, A08, A17: card rendering/download path in route |
| [lms/app/error.tsx](lms/app/error.tsx) | 14 | Reviewed; no separate finding in this audit's scope |
| [lms/app/globals.css](lms/app/globals.css) | 4 | Reviewed; no separate finding in this audit's scope |
| [lms/app/layout.tsx](lms/app/layout.tsx) | 24 | A05, A19, A21: global copy/asset metadata and theme parser dependency |
| [lms/app/learn/[slug]/[lessonId]/page.tsx](lms/app/learn/[slug]/[lessonId]/page.tsx) | 120 | A06–A09, A11, A17, A23: lesson shell/data decisions/resources/notes namespace |
| [lms/app/loading.tsx](lms/app/loading.tsx) | 17 | A07, A12: fixed three-card placeholder; page defaults not independently configurable |
| [lms/app/not-found.tsx](lms/app/not-found.tsx) | 20 | Reviewed; no separate finding in this audit's scope |
| [lms/app/page.tsx](lms/app/page.tsx) | 4 | Reviewed; no separate finding in this audit's scope |
| [lms/components/account/profile-form.tsx](lms/components/account/profile-form.tsx) | 73 | A08–A09, A17–A19: submission/navigation, field policy, fixed IDs and literal placeholder |
| [lms/components/courses/catalog-filters.tsx](lms/components/courses/catalog-filters.tsx) | 44 | A05, A08, A10: concrete categories/copy and route construction |
| [lms/components/courses/course-artwork.tsx](lms/components/courses/course-artwork.tsx) | 187 | A05, A10, A17, A19, A23: concrete brand, count, literal label and closed variant branch |
| [lms/components/courses/course-card.tsx](lms/components/courses/course-card.tsx) | 63 | A08, A10, A12, A17, A23: route/count/action/progress assumptions |
| [lms/components/courses/course-grid.tsx](lms/components/courses/course-grid.tsx) | 14 | A12–A14: fixed layout/model, marketing dependency and content lifecycle |
| [lms/components/courses/course-price.tsx](lms/components/courses/course-price.tsx) | 23 | A05, A19: concrete default label; typed offer is a useful boundary |
| [lms/components/courses/curriculum.tsx](lms/components/courses/curriculum.tsx) | 38 | A08, A10: route construction and numbering |
| [lms/components/courses/enroll-button.tsx](lms/components/courses/enroll-button.tsx) | 49 | A08, A11, A17: endpoint/navigation orchestration in renderer |
| [lms/components/layout/brand.tsx](lms/components/layout/brand.tsx) | 15 | A05, A08, A19: concrete identity and home route |
| [lms/components/layout/dashboard-shell.tsx](lms/components/layout/dashboard-shell.tsx) | 93 | A05–A06, A08, A17–A18: header/sidebar/help composition and fixed navigation ID |
| [lms/components/layout/site-footer.tsx](lms/components/layout/site-footer.tsx) | 28 | A05, A08, A19: concrete identity/navigation/copy |
| [lms/components/layout/site-header.tsx](lms/components/layout/site-header.tsx) | 61 | A05, A08, A17: concrete navigation/copy and inline actions; unique control ID already present |
| [lms/components/learning/completion-button.tsx](lms/components/learning/completion-button.tsx) | 54 | A08, A11, A17: chained endpoint orchestration and feedback rendering |
| [lms/components/learning/continue-card.tsx](lms/components/learning/continue-card.tsx) | 37 | A08, A11, A17, A23: route/action/progress calculation and next assumption |
| [lms/components/learning/dashboard-stats.tsx](lms/components/learning/dashboard-stats.tsx) | 44 | A10–A11: concrete statistic selection and progress calculation |
| [lms/components/learning/lesson-notes.tsx](lms/components/learning/lesson-notes.tsx) | 21 | A05, A18: concrete labels and fixed textarea ID |
| [lms/components/learning/lesson-outline.tsx](lms/components/learning/lesson-outline.tsx) | 62 | A08, A10–A11: route/number/progress calculation responsibilities |
| [lms/components/learning/lesson-player.tsx](lms/components/learning/lesson-player.tsx) | 45 | A05, A17: concrete copy and duplicated deferred-player presentation |
| [lms/components/marketing/faq-accordion.tsx](lms/components/marketing/faq-accordion.tsx) | 27 | Reviewed; no separate finding in this audit's scope |
| [lms/components/marketing/faq-item.tsx](lms/components/marketing/faq-item.tsx) | 44 | A01, A15: correct aria/inert state but new wrapper conflicts with copied mobile padding |
| [lms/components/marketing/faq-section.tsx](lms/components/marketing/faq-section.tsx) | 16 | Reviewed; no separate finding in this audit's scope |
| [lms/components/marketing/instructor-photo.tsx](lms/components/marketing/instructor-photo.tsx) | 20 | Reviewed; no separate finding in this audit's scope |
| [lms/components/marketing/instructor-section.tsx](lms/components/marketing/instructor-section.tsx) | 35 | Reviewed; no separate finding in this audit's scope |
| [lms/components/marketing/instructor-stats.tsx](lms/components/marketing/instructor-stats.tsx) | 25 | Reviewed; no separate finding in this audit's scope |
| [lms/components/marketing/landing-hero.tsx](lms/components/marketing/landing-hero.tsx) | 83 | A05–A07, A10, A13: concrete catalog/copy, positional preview and implicit reveal contract |
| [lms/components/marketing/reveal-content.tsx](lms/components/marketing/reveal-content.tsx) | 22 | A13–A14: restricted scopes and no supplied options/content registration contract |
| [lms/components/marketing/transformation-section.tsx](lms/components/marketing/transformation-section.tsx) | 38 | Reviewed; no separate finding in this audit's scope |
| [lms/components/marketing/transformation-stage.tsx](lms/components/marketing/transformation-stage.tsx) | 15 | Reviewed; no separate finding in this audit's scope |
| [lms/components/ui/action-link.tsx](lms/components/ui/action-link.tsx) | 35 | A01, A17: reviewed primitive; copied foundation or explicit local UI variant |
| [lms/components/ui/asset-image.tsx](lms/components/ui/asset-image.tsx) | 21 | A01, A17: reviewed primitive; copied foundation or explicit local UI variant |
| [lms/components/ui/container.tsx](lms/components/ui/container.tsx) | 13 | A01, A17: reviewed primitive; copied foundation or explicit local UI variant |
| [lms/components/ui/empty-state.tsx](lms/components/ui/empty-state.tsx) | 26 | A17, A23: fixed empty icon and optional href without required label |
| [lms/components/ui/eyebrow.tsx](lms/components/ui/eyebrow.tsx) | 21 | A01, A17: reviewed primitive; copied foundation or explicit local UI variant |
| [lms/components/ui/microcopy.tsx](lms/components/ui/microcopy.tsx) | 22 | A01, A17: reviewed primitive; copied foundation or explicit local UI variant |
| [lms/components/ui/page-heading.tsx](lms/components/ui/page-heading.tsx) | 22 | A01, A17: reviewed primitive; copied foundation or explicit local UI variant |
| [lms/components/ui/progress-bar.tsx](lms/components/ui/progress-bar.tsx) | 23 | A05, A11, A23: concrete copy and unchecked progress contract |
| [lms/components/ui/rich-text.tsx](lms/components/ui/rich-text.tsx) | 22 | A01, A17: reviewed primitive; copied foundation or explicit local UI variant |
| [lms/components/ui/section-heading.tsx](lms/components/ui/section-heading.tsx) | 37 | A01, A17: reviewed primitive; copied foundation or explicit local UI variant |
| [lms/components/ui/section.tsx](lms/components/ui/section.tsx) | 13 | A01, A17: reviewed primitive; copied foundation or explicit local UI variant |
| [lms/components/ui/social-icon.tsx](lms/components/ui/social-icon.tsx) | 51 | A01, A17: reviewed primitive; copied foundation or explicit local UI variant |
| [lms/components/ui/social-links.tsx](lms/components/ui/social-links.tsx) | 31 | A01, A17: reviewed primitive; copied foundation or explicit local UI variant |
| [lms/components/ui/symbol.tsx](lms/components/ui/symbol.tsx) | 40 | A01, A17: reviewed primitive; copied foundation or explicit local UI variant |
| [lms/components/ui/ui-icon.tsx](lms/components/ui/ui-icon.tsx) | 59 | A01, A17: reviewed primitive; copied foundation or explicit local UI variant |
| [lms/data/courses.ts](lms/data/courses.ts) | 337 | A07, A10, A23: selection/metadata/category duplication and unconstrained modules |
| [lms/data/interface-copy.ts](lms/data/interface-copy.ts) | 112 | A19: opaque extraction keys and duplicate identity/certificate facts |
| [lms/data/offers.ts](lms/data/offers.ts) | 20 | No separate finding: configured illustrative prices and offer wording, intentionally demo data |
| [lms/data/resources.ts](lms/data/resources.ts) | 27 | A07: resource records exist but lessons have no association contract |
| [lms/data/site.ts](lms/data/site.ts) | 191 | A05, A08, A19: content exists but identity/navigation/copy ownership and injection are incomplete |
| [lms/features/catalog/index.ts](lms/features/catalog/index.ts) | 7 | Reviewed feature exports; preserve domain boundary findings of exported service |
| [lms/features/catalog/service.ts](lms/features/catalog/service.ts) | 20 | A07, A10: concrete catalog adapter; reusable lookup helpers already exist |
| [lms/features/learning/index.ts](lms/features/learning/index.ts) | 6 | Reviewed feature exports; preserve domain boundary findings of exported service |
| [lms/features/learning/service.ts](lms/features/learning/service.ts) | 78 | A09–A11, A23: seed/cookie/validation/pure calculation ownership |
| [lms/features/marketing/index.ts](lms/features/marketing/index.ts) | 1 | Reviewed feature exports; preserve domain boundary findings of exported service |
| [lms/features/marketing/landing.tsx](lms/features/marketing/landing.tsx) | 130 | A05–A08, A13: inline page models/sections, positional course selection and fixed IDs |
| [lms/hooks/use-accordion.ts](lms/hooks/use-accordion.ts) | 9 | Reviewed; no separate finding in this audit's scope |
| [lms/hooks/use-api-mutation.ts](lms/hooks/use-api-mutation.ts) | 26 | A05, A11: global failure copy/default and concrete API utility |
| [lms/hooks/use-lesson-notes.ts](lms/hooks/use-lesson-notes.ts) | 31 | A09: fixed notes event namespace; storage cleanup present |
| [lms/hooks/use-mobile-menu.ts](lms/hooks/use-mobile-menu.ts) | 39 | No separate finding: theme breakpoint lookup and listener cleanup present |
| [lms/hooks/use-scroll-reveals.ts](lms/hooks/use-scroll-reveals.ts) | 24 | A13–A14: option resolution/children/preference lifecycle |
| [lms/hooks/use-video-embed.ts](lms/hooks/use-video-embed.ts) | 13 | Reviewed; no separate finding in this audit's scope |
| [lms/lib/api.ts](lms/lib/api.ts) | 37 | A11, A19: browser/server helper mix and concrete UI failure default; generic response cast is not runtime validation |
| [lms/lib/reveal-options.ts](lms/lib/reveal-options.ts) | 53 | A13–A14: page-specific selectors and grouping in generic option resolver |
| [lms/lib/scroll-reveals.ts](lms/lib/scroll-reveals.ts) | 92 | A01, A14: copied engine; registration is initial-only |
| [lms/lib/theme.ts](lms/lib/theme.ts) | 14 | A21: cwd/regex/alias assumptions |
| [lms/lib/video.ts](lms/lib/video.ts) | 25 | Reviewed; no separate finding in this audit's scope |
| [lms/styles/fonts.css](lms/styles/fonts.css) | 28 | A01, A03: copied font declarations; supplied weights 400/500/600/700 |
| [lms/styles/lms.css](lms/styles/lms.css) | 2080 | A02–A03, A12, A15–A16: semantic coupling and inherited/append-only state conflicts |
| [lms/styles/theme.css](lms/styles/theme.css) | 337 | A01–A04, A21: independent theme; role aliases, typography and palette relationships incomplete |
| [lms/styles/workshop.css](lms/styles/workshop.css) | 3053 | A01–A03, A15–A16: copied full stylesheet including unused workshop patterns and FAQ padding |
| [lms/types/interactions.ts](lms/types/interactions.ts) | 40 | A01, A10, A23: reviewed contracts; duplicated foundation and domain assumptions where applicable |
| [lms/types/lms.ts](lms/types/lms.ts) | 52 | A01, A10, A23: reviewed contracts; duplicated foundation and domain assumptions where applicable |
| [lms/types/marketing.ts](lms/types/marketing.ts) | 139 | A01, A10, A23: reviewed contracts; duplicated foundation and domain assumptions where applicable |
| [lms/types/ui.ts](lms/types/ui.ts) | 58 | A01, A10, A23: reviewed contracts; duplicated foundation and domain assumptions where applicable |
| [lms/types/workshop.ts](lms/types/workshop.ts) | 26 | A01, A10, A23: reviewed contracts; duplicated foundation and domain assumptions where applicable |

### Configuration and verification sources

| File | Lines | Review note |
| --- | ---: | --- |
| [package.json](package.json) | 26 | A01: independent package/dependency boundary |
| [next.config.ts](next.config.ts) | 9 | A01, A21: separate application/tracing configuration |
| [eslint.config.mjs](eslint.config.mjs) | 9 | A22: independent project validation scope; parent excludes LMS |
| [tsconfig.json](tsconfig.json) | 43 | A22: independent project validation scope; parent excludes LMS |
| [playwright.config.ts](playwright.config.ts) | 13 | A22: independent suite/server target; no architectural guards added |
| [lms/package.json](lms/package.json) | 26 | A01: independent package/dependency boundary |
| [lms/next.config.ts](lms/next.config.ts) | 13 | A01, A21: separate application/tracing configuration |
| [lms/eslint.config.mjs](lms/eslint.config.mjs) | 9 | A22: independent project validation scope; parent excludes LMS |
| [lms/tsconfig.json](lms/tsconfig.json) | 42 | A22: independent project validation scope; parent excludes LMS |
| [lms/playwright.config.ts](lms/playwright.config.ts) | 6 | A22: independent suite/server target; no architectural guards added |
| [lms/tests/lms.spec.ts](lms/tests/lms.spec.ts) | 399 | A22: useful screen checks; missing lifecycle/mobile/alternate-model assertions |
| [scripts/compare-reference.cjs](scripts/compare-reference.cjs) | 202 | Reference-only verification: intentionally fixes copy/timer/geometry; not runtime configuration |
| [scripts/prepare-reference.py](scripts/prepare-reference.py) | 77 | Historical reconstruction helper: embeds old replacement text/contact paths; not imported by live apps |
| [session.sh](session.sh) | 2 | No application role: CLI resume helper |
| [tests/architecture.spec.ts](tests/architecture.spec.ts) | 79 | A22: guards cover workshop only |
| [tests/countdown.spec.ts](tests/countdown.spec.ts) | 92 | A22: reviewed workshop regression scope; no new test execution claimed |
| [tests/helpers/component-reuse.fixture](tests/helpers/component-reuse.fixture) | 32 | A22: workshop reuse fixture; no LMS equivalent |
| [tests/helpers/render-reuse.cjs](tests/helpers/render-reuse.cjs) | 61 | A22: helper resolves/compiles workshop components only |
| [tests/hydration.spec.ts](tests/hydration.spec.ts) | 78 | A22: reviewed workshop regression scope; no new test execution claimed |
| [tests/reference-copy.spec.ts](tests/reference-copy.spec.ts) | 39 | A22: reviewed workshop regression scope; no new test execution claimed |
| [tests/reference-design.spec.ts](tests/reference-design.spec.ts) | 211 | A22: reviewed workshop regression scope; no new test execution claimed |
| [tests/reusability.spec.ts](tests/reusability.spec.ts) | 55 | A22: workshop content/instance checks only |
| [tests/scroll-reveals.spec.ts](tests/scroll-reveals.spec.ts) | 27 | A22: reviewed workshop regression scope; no new test execution claimed |

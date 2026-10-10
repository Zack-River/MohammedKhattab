# Function and helper boundaries

This is the current production-code contract for the single Next.js project. Preserve the approved UI, data, theme and routes when reorganizing code.

## Ownership and naming

| Folder | Responsibility |
| --- | --- |
| `packages/design-system/helpers/browser/` | Shared browser operations such as frame scheduling |
| `packages/design-system/helpers/media/` | Native/YouTube commands, snapshots, keyboard handling, appearance and SDK integration |
| `packages/design-system/helpers/motion/` | Reveal ownership, registration, animation creation, viewport observation and cleanup |
| `packages/design-system/helpers/theme/` | Parsing inherited numeric and time tokens |
| `app/helpers/roadmap/`, `app/helpers/navigation/` | Workshop geometry and layout calculations |
| `modules/helpers/portfolio/` | Portfolio header, section observer and timeline operations |
| `modules/features/catalog/helpers/` | Lesson lookup, duration/number formatting, selection and published-catalog validation |
| `modules/features/learning/helpers/` | Pure course-progress summaries; database mutations live in repositories |
| `modules/features/learning/client/` | Enrollment/completion command sequences and decoded client requests |
| `modules/lib/http-request.ts`, `server-request.ts` | Separate client transport and server parsing/origin policy |
| `modules/features/*/models/` | Owned content projections for individual page sections |
| `modules/features/learning/read-lesson-context.ts` | Server course/lesson lookup and access decisions |

A helper file owns a named operation. Do not add an unrelated `utils.ts` collection. Share an implementation when consumers have the same responsibility; keep page-specific DOM selectors with their page owner. Curated helper indexes expose a coherent domain surface, without pulling server services into browser imports.

React state and effects remain in hooks. Helpers do not call React hooks. Browser operations are called by handlers/effects and return cleanup where needed; they do not read browser globals at import time. Canonical Supabase helpers own session cookies. Server services own verified identity and Next.js access decisions; focused repositories own database queries. Page-model builders may bind owned content; portable helpers and renderers receive data rather than importing concrete catalog records.

Keep session state local to its owning effect. The only shared reveal state is the existing WeakMap for occurrence ownership; the SDK loader retains its existing shared pending request. Do not introduce a global store for component state. Unmount, source changes, reduced-motion changes and replacement playback must still release observers, timers, animations and media requests.

## Size checks

`npm run test:architecture` uses TypeScript AST inspection and the production import graph:

- Non-rendering function bodies: at most **35 lines**.
- Hook coordination bodies: at most **45 lines**; hook files: at most **60 lines**.
- Helper files: at most **80 lines**.
- Component/UI/page files: at most **100 lines**.

Aim below these ceilings. Split responsibilities rather than compressing statements to fit a number. JSX is checked through component file size instead of treating every markup line as procedural logic. Centralized data, contracts and CSS are excluded from these executable-code budgets; do not scatter theme values or split records merely to reduce line counts. Size checks support manual responsibility review and cannot prove that a function does one job.

Dependency checks also apply to the new helper folders: shared/browser/domain helpers must not transitively import concrete page data or server-only dependencies. Mutation tests verify that oversized helper files/functions and leaked content/server dependencies fail the gate.

## Verification

Run root lint, TypeScript, architecture checks, production build, reuse-fixture build and the full Playwright suite. Meaningful regression cases cover original section text, responsive layouts, alternate content, enrollment/progress, profile submission, exclusive playback, source abort/reset, fullscreen, hover transitions, reduced motion and reveal lifecycles. The isolated YouTube fixture uses a deterministic SDK stub to verify deferred loading, keyboard/seek/mute commands, instance destruction, shared SDK reuse and failed-load retry without contacting YouTube.

The reveal lifecycle test bundles the real helper graph instead of copying its implementation. Update `WORK_CHECKPOINT.md` with observed results, and refresh `DESIGN_REPRODUCTION_PROMPT.md` after source changes.

## Canonical ownership and configurable contracts

Import portable presentation, hooks and contracts directly from `@khatab/design/*`. Do not add forwarding-only files to `app/` or `modules/`; the architecture gate rejects them and redundant shared stylesheet adapters. Product components may select a real variant (for example the LMS plain section context or reveal-enabled instructor image). App Router entry points and product model builders remain composition roots.

- `useMenuDismissal({ rootRef, open, onClose, ... })` requires owner, state and action. Optional `toggleRef`/`focusSelector`, `breakpointToken`, `inclusiveBreakpoint` and `restoreFocus` configure behavior. `subscribeDismissal` owns event subscription and returns cleanup. `useMobileMenu({ breakpointToken?, initialOpen? })` supplies reusable state and refs; workshop retains its public container/state contract through a small composition hook.
- `useScrollReveals({ rootRef, options?, enabled? })` requires the owner. Defaults use inherited canonical theme tokens; explicit `options` replace them. `createScrollReveals({ root, options, preference })` requires all lifecycle dependencies and returns disposal. Both pages now use the same hook and engine.
- `subscribeNativePlayer({ video, sourceUrl, publish, playbackScope? })` requires media and publication ownership. Coordination defaults to the video's owning document; an alternate panel/document/shadow root can scope sibling playback.
- `mountYouTubePlayer({ host, url, title, session, loadAPI?, timeoutMs? })` keeps lifecycle ownership required and SDK loading/timeout policy replaceable. Defaults remain the shared loader and approved player policy. Internal helpers import the underlying helper/config directly, without a reverse dependency on a facade.
- `dashboardStats({ state, courses, labels })` and `lessonOutline({ course, state, lessonHref })` are separate pure domain projections. URL policy is supplied by the lesson composition model, not imported by the domain helper. Renderer types reference the respective projection contract.

Named options are used for lifecycle/configuration contracts with multiple dependencies. Small scalar calculations keep straightforward positional arguments. Add optional parameters only for real variation; do not make required dependencies optional or add service factories merely to meet a line-count target.

Regression gates include compile-only negative contracts for missing owners/actions/publication/URL policies, mutation checks for duplicate forwarding files, scoped/default media coordination, inside/outside dismissal, focus restoration overrides and subscription cleanup. Existing visual/copy, responsive, motion, player and learner/API suites remain the behavioral acceptance gate.

## Semantic acceptance beyond size limits

Shared instructor/transformation/FAQ sections receive explicit `contextVariant` and `reveal` presentation settings. No page-specific forwarding wrapper owns their DOM. Creator destinations and deliberate portfolio variants live in `config/creator-contacts.ts`; the portfolio model binds archived copy to live identity and validates action presentation.

`useAsyncCommand` owns exclusion across a complete multi-step workflow. `startCourse` and `setLessonCompletion` receive required domain identifiers and API/navigation ports; HTTP success payloads require decoders. Demo learning responses explicitly allow an empty email; profile submissions retain strict email validation.

YouTube and native playback expose equivalent play/end/control policies. Each provider retains its own cleanup mechanics, with shared finite/clamp rules before SDK calls or native property writes. Lessons compose the shared deferred player and viewport reset rather than maintaining a second iframe lifecycle.

Tests in `reuse-repairs`, `learning-command-contracts`, `player-provider-parity` and `reuse-tooling` cover these semantic contracts. The forwarding guard resolves aliases and relative targets to canonical ownership, while preserving legitimate feature entry points. Exact-copy and file-size scans supplement these cases; they cannot replace them.

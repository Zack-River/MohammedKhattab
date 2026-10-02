# Architecture audit — story and performance redesign

The page now follows the UX storyboard in [UX_JOURNEY.md](docs/research/UX_JOURNEY.md). It uses server-rendered narrative sections with narrow interactive boundaries.

## Ownership

| Responsibility | Owner |
| --- | --- |
| Page order and story chapters | `app/page.tsx`, `app/data/journey.ts` |
| Workshop content and discriminated roadmap data | `app/data/workshop.ts`, `app/types/workshop.ts` |
| Identity, metadata, contact and enrollment policy | `app/config/site.ts` |
| Palette, typography, spacing, effect geometry | `app/styles/theme.css` plus standard Tailwind scales |
| Animation policy | `app/config/motion.ts` |
| Simple one-time entrances | `useScrollReveals`: shared observer + native Web Animations |
| Editing-desk choreography | `useEditingStory`: one lazy, scoped GSAP timeline |
| Editing-desk position | CSS sticky in `EditingStory` |
| Before/after state and Motion mini lifecycle | `useEditPreview` |
| Horizontal gallery | Native scrolling; `useHorizontalShowcase` caches measurements on resize |
| Chapter milestones | `useJourneyProgress`: observer updates at chapter changes |
| Reading line | Native CSS scroll timeline |
| Timeline progress and hover ownership | Stable measurement wrappers, cached geometry, state changes only when the active day changes |
| Stats | Observer starts DOM text animation, with updates only when its displayed integer changes |

Shared `Container`, `Section`, `Heading`, `Card` and `ButtonLink` stay business-independent. Workshop wrappers supply content or behavior. `cn()` resolves class conflicts and includes the theme's custom typography names. Header, FAQ and gallery accessibility IDs use `useId`; DOM queries are scoped to their component refs.

## Performance findings addressed

The prior production trace attributed repeated 60–90ms callbacks to page/viewport ResizeObserver-driven global ScrollTrigger refreshes. Those observers and refresh routes were removed. Native entrances do not require scroll geometry refresh. CSS sticky replaces the large gallery pin/spacer; its gallery reads cached offsets during scroll. Roadmap geometry batches reads before writes. Off-screen shadow loops, the pointer-parallax grid and duplicated moving creator chips were retired.

Portrait and avatar payloads were reduced using preoptimized WebP assets while retaining source images. GSAP loads only when the desktop story approaches the viewport; Motion mini loads only after demo interaction. No full Motion React engine is imported. Each animation layer has a single owner and cleanup restores its original state.

## SOLID application

Sections own presentation and composition; hooks own browser subscriptions and local state; pure helpers own calculations and media policy. Reusable contracts stay focused. Roadmap variants remain discriminated and active/passed/pending remains one state. New content, chapters and ordinary reveal targets extend data/configuration rather than requiring new infrastructure. There is no global state store or inheritance hierarchy because this single-page domain does not need either.

## Verification and limits

The production browser suite covers 28 behaviors, including observable intermediate animation, editing assembly, interruptible before/after transitions, mobile navigation, native gallery/keyboard controls, chapter progression and finish, real video embed policy, consistent contact links, FAQ accessibility, roadmap hover/active relationships, live reduced-motion cleanup, resizing through 320–1440px and reading without JavaScript. Lint, strict TypeScript, production build, dependency audit, visual captures and local CPU-throttled profiling complement those checks.

The profiling report in [PERFORMANCE.md](docs/evidence/PERFORMANCE.md) is a local synthetic diagnostic, not field-device FPS or a Core Web Vitals claim. Real playback depends on YouTube; browser tests stub external media and verify the local permitted-embed behavior. Credited stock training footage is clearly distinguished from Mohammed’s published work. FirstEditProvider owns one visit-scoped rhythm choice; ClipPreview owns the explicit playback gate; MediaPlayer/useMediaPlayer own the lazy Plyr adapter, custom controls, retry and offscreen pause, while LessonOutcomes owns only its selected day. The archived source HTML remains reference material and is not rendered by the live app.

The connected first-edit journey is documented in [FIRST_EDIT_JOURNEY.md](docs/research/FIRST_EDIT_JOURNEY.md). Performance evidence for that subsequent build is in `docs/evidence/scroll-first-edit.json`; the earlier comparison report retains its original build scope.

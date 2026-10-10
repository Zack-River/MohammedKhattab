# LMS architecture

## Ownership

| Folder | Responsibility |
| --- | --- |
| Root `../app/` | Routes, layouts, metadata, loading/error boundaries and HTTP handlers |
| `components/ui/` | Shared presentation primitives with typed props |
| `components/layout/` | Public navigation, student shell, brand and footer |
| `components/courses/` | Course cards, artwork, curriculum, filters and enrollment action |
| `components/learning/` | Player, lesson outline, notes, progress and completion controls |
| `components/account/` | Reusable profile entry/edit form |
| `components/marketing/` | Approved instructor, FAQ, section and landing treatments |
| `features/` | Public domain services and marketing page composition |
| `data/` | Course records, brand/navigation, resource content and interface copy |
| `hooks/` | Local interaction state: API mutation, notes, menu, reveal, accordion, video |
| `types/` | Shared typed data and component contracts |
| `lib/` | HTTP utilities, video/reveal helpers and server theme access |
| `styles/` | Shared style import adapters, LMS theme deltas and LMS layouts |

Pages primarily compose components and read server data. Catalog services own course lookup/filtering. Pure learning selectors own progress/state operations; the service adapter owns demo cookie persistence. Route handlers validate requests before changing state. Client components own only interactive controls, not the whole application. There is no global client store.

## Extension rules

Keep colors, spacing, sizes, motion and breakpoints in `styles/theme.css`. Reuse semantic tokens in styles rather than introducing per-page constants. `lib/theme.ts` consumes build-generated concrete theme JSON for server-generated metadata and certificate artwork. `styles/workshop.css` retains the approved section/button/card treatments; `styles/lms.css` supplies LMS-specific layouts.

Put new records and visible copy in `data/`, with contracts in `types/`. Pass course, lesson, profile or section models into components. Reuse the existing primitives before creating new ones. Keep network mutation state in `useApiMutation`, menu behavior in `useMobileMenu`, and lesson notes in `useLessonNotes`.

Server components read the catalog and learning services directly; browser mutations use Next.js APIs. A production backend should replace cookie persistence behind the learning service boundary and add authenticated user identity and entitlement checks. Demo profile entry must not be treated as authentication.

Native links, buttons, labels, keyboard interaction, reduced-motion handling and deferred YouTube embedding keep the student journey familiar and lightweight. Assets and four font weights are served locally. No GSAP, Motion, smooth-scroll or player package is needed for this version.


Shared source lives in `../packages/design-system/`, consumed through `@khatab/design` exports. App-local primitives/hooks/types re-export shared implementations where appropriate. Avoid client-facing barrels that reach server utilities. `../config/identity.ts` and `../config/fonts.ts` hold shared facts; `config/` holds owned route, category and persistence policies. Catalog records derive summaries once, and published data is validated.

`components/marketing/landing-page.tsx` is supplied composition; `features/marketing/landing.tsx` supplies approved defaults. Domain view models resolve before rendering. The certificate renderer is pure; presentation imports generated server-only palette/font data. Prebuild generation and standalone tracing remove runtime cwd assumptions.

The private reuse fixture lives under `tests/fixtures/reuse/` and builds separately with `npm run test:fixtures:build`. It is not a route in the shipped LMS. Acceptance source guards traverse both apps and shared imports, detect cycles and are validated with deliberately invalid fixtures.

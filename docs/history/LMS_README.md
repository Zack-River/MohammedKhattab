# Ta3llam feature modules

This directory is part of the unified root Next.js application. Run `npm run dev`, `npm run build` and `npm run start` from the repository root. Legacy commands here delegate to the root app.

The portfolio is `/`, Ta3llam is `/ta3allam`, and the workshop is `/7days-freelance` on the same origin. All routes and APIs live in root `app/`. This directory owns reusable LMS/portfolio components, features, hooks, content, styles and tests; modules use `@lms/*`.

Browser tests can still run here with `TEST_BASE_URL=http://localhost:3040 npm run test:e2e`, or from the root with `npm run test:lms`. The isolated reuse fixture on port 3043 is test infrastructure, not another product app. Root `public/` owns all assets; `public` here is its compatibility symlink.

The remaining notes below describe the LMS feature behavior and earlier standalone setup.

# تعلّم / Ta3llam LMS

An independent Next.js App Router project with an Arabic RTL landing page and a complete student UI, using the approved Mohammed Khattab / workshop design identity.

## Run locally

```sh
cd lms
npm ci
npm run dev
```

Open http://localhost:3040. For production: `npm run build` then `npm run start`. The parent workshop project has its own package and remains independent.

## Screens

- `/`: landing page, featured courses, learning steps, instructor, FAQ.
- `/portfolio`: Mohammed Khattab’s seven-section portfolio, original reference copy and local work samples.
- `/ta3allam/courses`: searchable catalog with category filters.
- `/ta3allam/courses/[slug]`: course overview, outcomes, curriculum, enrollment.
- `/ta3allam/login`: demo profile entry.
- `/ta3allam/dashboard`: progress overview and next lesson.
- `/ta3allam/dashboard/courses`: enrolled courses.
- `/ta3allam/dashboard/resources`: downloadable project templates.
- `/ta3allam/dashboard/certificates`: earned demo certificates.
- `/ta3allam/dashboard/profile`: editable student profile.
- `/ta3allam/learn/[slug]/[lessonId]`: lesson player, curriculum, completion, notes, resources.

## Working demo APIs

| Endpoint | Methods | Purpose |
| --- | --- | --- |
| `/api/courses` | GET | Catalog; optional `q` and `category` filters |
| `/api/courses/[slug]` | GET | Course and curriculum |
| `/api/enrollments` | GET, POST | List/start enrollment; `{ courseSlug }` |
| `/api/progress` | GET, POST | Read/update completion; `{ courseSlug, lessonId, completed }` |
| `/api/profile` | GET, POST | Read/update profile; `{ name, email }` |
| `/api/resources/[id]` | GET | Download a text template |
| `/api/certificates/[slug]` | GET | Download an SVG demo certificate after course completion |

Six demo courses cover montage, graphic design, motion graphics and freelancing, with 22 lessons. The landing page also introduces personal coaching as a separate service; coaching booking is not implemented. Cards show different illustrative EGP prices configured in `data/offers.ts`; registration remains free in this demo and no payment is taken. Enrollment, completion and profile data persist in a browser-specific HttpOnly cookie for 30 days. Notes persist locally per learner, course and lesson. A fresh browser starts with one enrolled course and two completed lessons. Clearing browser data resets the demo. All lessons use the same explicitly labelled YouTube preview; replace video IDs with actual lesson material in `data/courses.ts`.

This version provides demo identity, not account authentication. It does not include a production database, payments, protected course delivery or accredited certificates. The editable cookie is demo state, not an authorization mechanism. Student state does not synchronize across devices.

## Design and architecture

The primary color is `#fc3522`, the canvas is `#101317`, and IBM Plex Sans Arabic is bundled locally. Canonical theme values live in `../packages/design-system/styles/theme.css`, imported by `styles/theme.css` before LMS deltas; UI copy and course content live in `data/`. Components, hooks, domain services and route handlers have separate ownership. No animation or media-player dependency was added. Read [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) and [ARCHITECTURE.md](ARCHITECTURE.md) before extending screens.

## Validation

```sh
npm run lint
npx tsc --noEmit
npm run build
npm run test:fixtures:build
npm run test:e2e -- --workers=1 --retries=0
```

Install Playwright Chromium once with `npx playwright install chromium`; Linux may also require `npx playwright install-deps chromium`. The E2E suite expects the app already running on port 3040 (override with `TEST_BASE_URL`) and automatically starts the independently built reuse fixture on 3043. Critical cross-browser checks use `npm run test:crossbrowser`. Evidence and desktop/mobile screenshots are in `docs/evidence/`.

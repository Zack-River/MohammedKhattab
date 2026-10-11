# Mohammed Khattab / Ta3llam

One Next.js 16 application with a portfolio, Ta3llam LMS and freelance workshop. All pages share the approved Arabic RTL design, IBM Plex Sans Arabic, `#fc3522` primary color and `#101317` background. Read [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) before modifying the UI.

## Run

Run every command from this directory. There is one dependency installation, lockfile, Next.js configuration and production build.

```sh
npm ci
npm run dev
```

Open **http://localhost:3040**. For production, run `npm run build` followed by `npm start`.

| URL | Page |
| --- | --- |
| `/` | Mohammed Khattab portfolio |
| `/ta3allam` | Ta3llam landing |
| `/ta3allam/7days-freelance` | Seven-day live freelance workshop |
| `/ta3allam/dashboard/admin/courses` | Admin course editor |
| `/ta3allam/courses`, `/ta3allam/courses/[slug]` | Catalog and course details |
| `/ta3allam/dashboard/*` | Student account |
| `/ta3allam/learn/[slug]/[lessonId]` | Learning player |
| `/ta3allam/login`, `/ta3allam/signup` | Supabase account entry |
| `/api/*` | Auth, catalog and protected learning APIs |

Existing `/portfolio`, `/workshop`, `/ta3llam/*` and top-level learning URLs redirect to the corresponding canonical pages, preserving query parameters.

## Workspace

| Location | Responsibility |
| --- | --- |
| `app/` | The only App Router, layouts, API handlers and workshop composition |
| `modules/` | Portfolio and LMS components, domain services, data, hooks and styles; source modules with no independent installation or build |
| `config/` | Shared identity, fonts, page navigation, designer credit and portfolio records |
| `packages/design-system/` | Internal shared library for primitives, player, motion and canonical theme; consumed by the root app, not a separate website |
| `public/` | The only production asset directory |
| `tests/` | Site and platform regression suites |
| `tests/platform/fixtures/reuse/` | Isolated test harness for alternate content and component reuse; uses root dependencies/assets and is not shipped as a page |
| `scripts/` | Generation, architecture checks and validation helpers |
| `app/helpers/`, `modules/helpers/`, feature `helpers/` | Focused operations kept with their owning page or domain |
| `docs/architecture/` | Architecture audit, acceptance cases and refactor records |
| `docs/evidence/` | Reference captures and validation evidence |
| `docs/history/`, `docs/research/` | Historical records, not current setup instructions |

Imports use `@/*` for root source, `@platform/*` for `modules/` and `@khatab/design/*` for the internal shared library. Canonical tokens live in `packages/design-system/styles/theme.css`; shared styles are imported directly by `app/globals.css`; app and platform theme files are the theme entry point and explicit product variants. Forwarding-only component/hook/type copies are prohibited by the architecture gate. `predev` and `prebuild` generate server palette exports and the server-only certificate font.

The player uses native media and shared custom controls. No animation or player dependencies are required. The LMS uses Supabase Auth and Postgres with per-user RLS. Accounts, published courses, enrollments, progress and protected resources are database-backed. Course content and prices remain seeded examples. Verified admins can edit course names, descriptions, prices, categories, publication, thumbnails, intro videos and lesson video links. Payments and private object-storage streaming are not included in this stage.

## Validation

```sh
npm run lint
npm run typecheck
npm run test:architecture
npm run build
npm run test:fixtures:build
npx playwright install chromium
npm run test:e2e -- --workers=2
```

Start the production app on 3040 before browser checks, or set `TEST_BASE_URL`. The unified Playwright configuration runs `site` and `platform` suites and starts the isolated reuse harness on 3043. `npm run test:platform` selects platform checks; `npm run test:crossbrowser` runs the existing multi-browser learner checks. Development hydration diagnostics use `playwright.development.config.ts` separately against a development server.

`node scripts/prepare-standalone.cjs` stages the single production artifact for artifact-identity checks. `node scripts/refresh-design-snapshot.cjs` refreshes [DESIGN_REPRODUCTION_PROMPT.md](DESIGN_REPRODUCTION_PROMPT.md). [WORK_CHECKPOINT.md](WORK_CHECKPOINT.md) records changes and their verification.

Function ownership, folder naming and enforced size limits are documented in [Function boundaries](docs/architecture/FUNCTION_BOUNDARIES.md). Shared browser/media/motion helpers live in the internal design library; page-specific helpers stay with their page owner.

## Supabase setup

Copy `.env.example` to `.env.local` and supply the project URL, publishable key and application origin. Never commit database credentials or place a service-role key in browser variables. Production origin: **https://ta3allam.vercel.app**. Set `APP_ORIGIN=https://ta3allam.vercel.app`; save the same three app variables in Vercel. Supabase Auth Site URL must match that origin, with `/api/auth/callback` allowed as a redirect. Set the provider minimum password length to 8. Localhost callbacks are valid for development on the machine opening the email link.

The dedicated project schema is already applied. Migrations in `supabase/migrations/` are authoritative; `supabase/seed.sql` is generated from the existing course/resource records using `npm run backend:seed:generate`. Course and lesson seeds preserve existing rows so subsequent runs do not overwrite dashboard edits. Public course metadata excludes lesson playback URLs. Paid enrollment requires a trusted grant; clicking subscribe never grants paid access. Protected playback requires a published preview or an enrollment. Downloads and certificates require the corresponding enrolled account; certificates also require course completion.

For isolated backend tests, start local Supabase using `npx supabase start -x realtime,storage-api,imgproxy,postgres-meta,studio,edge-runtime,logflare,vector,supavisor`, then `npx supabase status -o json > /tmp/khatab-supabase-status.json`. Run `npm run backend:test` with Chromium installed. The runner requires a loopback Supabase URL, starts a temporary Next dev server on 3045, creates two test accounts, checks API and direct RLS isolation, exercises browser login/logout/email confirmation, and removes fixtures. It never runs destructive tests against the hosted project. `npx supabase db reset --local` verifies migration/seed reproducibility.

See [backend plan and acceptance](docs/architecture/BACKEND_PLAN.md) and [backend verification](docs/evidence/backend/VERIFICATION.md). Legacy LMS browser cases written for anonymous demo-cookie access require authenticated fixtures; they are not evidence that the new authorization rules failed, and are not reported as a passing full regression gate.

Admin membership is server-controlled through the private email allowlist and verified account identity. Supabase Auth stores bcrypt password hashes. `scripts/backend/provision-admins.cjs` is a one-time operational tool using `SUPABASE_SECRET_KEY` and password environment variables named in `config/admin-accounts.json`; keep these in ignored `.env.local`. They are not required by the deployed app and must never use a public prefix. The workshop starts at 499 ج.م and retains WhatsApp booking; a catalog entry does not grant enrollment. Public Google Drive video links can be streamed through the shared player; private Drive permissions remain the file owner’s responsibility.

Dashboard access is enforced before rendering in the session proxy and authenticated student data reader. The client dashboard also verifies the server session on navigation and browser restoration so cached UI cannot survive logout. Login/logout use document navigation to discard route caches. Public course previews remain accessible; admin membership remains server-controlled.

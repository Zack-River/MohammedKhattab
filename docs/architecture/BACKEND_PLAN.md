# Supabase backend — stage one

Scope authorized on 2026-10-10: Supabase accounts/sessions, persisted catalog, enrollment, progress and protected resources. Payments and admin tools are deferred. Hosted destination is the dedicated Ta3llam project `tatseklsvfdpuxuepbfo`. Schema and seed are applied through its Session pooler; local Supabase is isolated for destructive/reset and integration checks.

## Boundaries

- Next.js `app/api` adapters call small feature handlers. Services own workflows; repository functions own database queries. UI receives existing course/learner contracts. Supabase client setup, environment validation and session refresh have one owner.
- Supabase Auth owns password hashing, credentials, email confirmation and session revocation. No application password table or demo cookie authority. Verified users own profile, enrollment and progress rows.
- Public catalog records contain course information and lesson descriptions, never protected video URLs or resource bodies. Playback requires a published preview or an active enrollment. Private records have independent database RLS policies.
- Free courses allow authenticated self-enrollment. Paid courses require a trusted enrollment grant; the API never treats a purchase-button click as payment. Future verified payment webhooks/admin services may grant access.
- The same services power server-rendered pages and Next.js APIs. API failures use consistent status codes and Arabic messages; personalized responses are not cached. Session refresh preserves cookies and no-store headers. No unrelated hosted projects are modified.

## Data

Profiles reference Supabase Auth users. Published course metadata, protected lessons, enrollment rows, lesson progress, resources and lesson-resource relations use primary/foreign keys and relevant indexes. RLS is enabled on all public tables with explicit grants. Learners cannot publish courses, reassign ownership, read another learner's rows, grant paid access or access non-preview playback without enrollment.

## Acceptance

1. Real signup/login/logout; incorrect credentials rejected; email-confirmation responses do not pretend login succeeded.
2. Invalid payloads, cross-origin writes and missing configuration fail clearly; passwords/tokens never appear in response DTOs or logs.
3. Anonymous catalog access succeeds but never reveals protected video URLs or attachment content.
4. Unauthenticated learning/profile/progress/resource/certificate requests fail; protected pages redirect to login.
5. Two independent users cannot read or modify each other's profile/enrollment/progress via either Next APIs or direct Supabase requests.
6. Free enrollment is idempotent; paid self-enrollment and direct database forgery are rejected.
7. Preview playback is public; other playback requires active enrollment. Unknown IDs fail without granting access.
8. Progress only references enrolled, existing course lessons; concurrent updates do not erase other completed lessons. Certificates require complete enrolled courses.
9. Profile email changes use Supabase confirmation; local profile updates cannot impersonate another account.
10. Database migration/seed/type generation and local reset are reproducible. Lint, TypeScript, architecture, build and backend integration tests pass. Existing UI regressions are recorded separately and never hidden by weakening assertions.

## Hosted rollout

Production origin is `https://mohammed-khattab.vercel.app`. Save the three app environment variables in Vercel and configure the Supabase Auth Site URL/callback. Migrations, catalog order and seed are applied; local and hosted advisors report no issues. Hosted schema/RLS and the running local app catalog are verified. Production login/email confirmation still requires the dashboard settings and live deployment verification. Never reuse another application's project or create a billed project without the required organization/cost selection.

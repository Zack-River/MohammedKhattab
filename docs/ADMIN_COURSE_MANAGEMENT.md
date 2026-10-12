# Admin course management

The protected course list at `/admin/dashboard/courses` reuses the Users table, narrow-screen record layout, custom selectors/checkboxes, dialog and pagination. It shows course name/status, creation and last-update dates, student count, lesson count, chapter count, section count, and edit/delete actions. Five records appear per page at every viewport.

Search matches title or slug literally. Publication states combine with category, delivery type and search; ordering supports creation date, last update and student count in either direction. Changing filters starts at page one; pagination retains them. Queries return counts from the database rather than downloading the full catalog or student records.

`/admin/dashboard/courses/new` creates an unpublished draft with validated name, slug, description, price, category and delivery. The `new` slug is reserved. A live course needs a duration before publishing; the overview editor exposes that field and identifies it explicitly if missing. Existing metadata/thumbnail/intro editing remains on `/admin/dashboard/courses/[slug]`. Curriculum authoring is on `/admin/dashboard/courses/[slug]/content`, reached through the content tab. Focused dialogs create, rename and delete chapters/sections, and create/edit/delete lessons. Sections may move between chapters with their lessons; lessons can select their chapter and section, or remain unassigned. The course comes from the editor route. Drag-and-drop/manual ordering and cross-course transfers are not part of this stage.

Existing modules count as chapters. Optional named `sections` group each chapter's existing lesson IDs; empty groups count as sections, but a lesson cannot belong to two groups or reference another chapter. Courses without nested groups show zero sections. Lesson counts come from actual `lessons` rows, and student counts from `enrollments`.

Creation timestamps were never recorded for legacy courses. They remain NULL and display “غير مسجل”; no fabricated historical dates are introduced. New drafts receive actual creation/update times, and subsequent course or lesson changes update the course timestamp. Dates render in Africa/Cairo consistently on the server and client.

Deletion requires a same-origin authenticated admin request plus a matching course confirmation. The database rechecks active account access and current admin membership, locks the course, and rejects any course with enrollments. Unpublishing remains available instead. Unsubscribed deletion cascades existing dependent rows. Student or guest API/RPC access cannot create, inspect management data or delete courses.

Implementation uses focused helpers/repositories, typed request/response boundaries and shared Arabic copy. No dependencies were added. Migration: `supabase/migrations/20261011213753_admin_course_management.sql`. Local verification: `BACKEND_SUITE=admin-course-management npm run backend:test`, three course-contract unit cases, full backend regression, lint, typecheck, architecture and production build. Hosted checks in `tests/backend/admin-courses-live.cjs` are read-only.

## Responsive editor and curriculum authoring

The overview uses one form with three focused cards: course details on the right, media and publication on the left. At desktop widths the detail card spans both rows; at 1024px and below cards stack in reading order. All dimensions and interaction styles reuse theme tokens. A shared textarea primitive supplies labels, hints, errors and accessible descriptions. Form groups accept typed data/copy; they do not fetch data or manage curriculum.

Curriculum presentation is composed from course, chapter, section and lesson components. A shared action/dialog handles each operation. Validation, form decoding, legacy chapter normalization, chapter mutation, section mutation, lesson mutation, publication validation and persistence each have focused helpers. Chapter IDs are stable, optional on historical metadata and persisted on the first curriculum edit; lesson IDs and resources are retained on moves and edits. Legacy section IDs resolve within their source chapter.

`POST /api/admin/courses/[slug]/content` accepts `kind`, `operation`, `revision`, identifiers and the fields appropriate to the entity. Lesson fields include title, description, duration in seconds, video URL, free-preview flag, chapter and optional section. Identifiers are generated on creation. Video URLs live only in protected `lessons` rows; metadata continues to contain blank playback URLs.

The guarded database transaction locks the selected course, compares its revision, writes the targeted lesson and updates curriculum together. Failure rolls back all writes. A revision trigger also covers overview and legacy lesson-video writes. Stale overview/curriculum saves return 409 instead of overwriting another administrator's edits. Revision is a concurrency token; adding its initial zero does not fabricate creation/update dates or rewrite existing metadata. The private lesson writer is unavailable to frontend roles, and the private privileged transaction checks live admin membership and account access. No new table-level insert/delete permission is granted to students or administrators.

Non-empty chapters/sections must have their content moved or removed before deletion. Lesson deletion is confirmed and clears the lesson's progress/resource links through existing foreign keys. Edits/moves preserve progress and resources. Published courses cannot be left incomplete: unpublish before adding an empty chapter or deleting the last lesson; republish after completing the curriculum. Empty named sections are allowed.

Migration: `supabase/migrations/20261011222701_curriculum_authoring.sql`. Acceptance suites: `BACKEND_SUITE=curriculum-authoring npm run backend:test` (API, security, conflict/rollback, progress preservation and responsive authoring), existing course-management suite, full backend regression, and `npx tsx --test tests/backend/course-contracts.test.ts tests/backend/curriculum-helpers.test.ts`. Browser evidence covers 320/390/768/1024/1440/1920px; screenshots are under `docs/evidence/backend/course-form-*` and `course-curriculum-*`.

Application commit `1faf406` deployed successfully. Hosted migration and advisors passed; all eight existing courses retained their content, prices, publication state and historical timestamps. Live acceptance passed 16 new editor checks and 14 existing course-management checks, with zero runtime errors. Production verification opens dialogs without saving; actual authoring/destructive scenarios run only against isolated local fixtures. Evidence: `docs/evidence/backend/curriculum-live.json` and `admin-courses-live.json`.

## Course price input

Both create/edit forms reuse `CoursePriceField` and `useCoursePrice`. Paid prices use a plain text input with a numeric mobile keyboard, accepting only positive whole digits; Arabic/Persian digits normalize to Latin. A separate `مجاني` choice disables the field and posts canonical amount zero. An empty paid input is required and cannot silently become a free course. Creation defaults to an empty paid input, so free creation requires an explicit choice. The shared `validCourseAmount` helper validates bounded integers in both create/edit APIs, preserving zero as the existing free representation. No schema or existing-price migration is needed. Tests: `tests/backend/course-price.test.ts` and `BACKEND_SUITE=course-price npm run backend:test`.

Price update `a5703ee` deployed successfully. Nineteen read-only live editor checks passed, including text price fields in create/edit, explicit free creation, responsive layout and unchanged existing course data.

## Shared creation/editor design

Creation and editing compose `CourseFormLayout`, `CourseFields` and `CourseMediaFields`, retaining one responsive three-card layout. Creation supplies slug/delivery controls and a draft-only save action. Live schedule duration, thumbnail URL and intro URL are validated and persisted on initial creation; older API payloads can omit them. Uploading a thumbnail requires saving the draft first, preserving existing upload permissions. Creation request state is in `useCreateCourse`; form decoding and response validation remain separate helpers.

Shared-form update `3c6d25d` is deployed. Five contract tests, 44 price/creation API-browser checks and 96 course-management regression checks passed. Twenty-eight read-only live checks confirmed responsive creation/editor parity and unchanged course data, with zero runtime errors.

## Automatic lesson duration

`LessonMediaFields` composes the video URL and read-only duration. `useLessonVideoDuration` owns lookup state and native form validity; `lessonProbeSource` validates/resolves the source; `probeVideoDuration` requests native video metadata and releases its media source on completion, failure, timeout or abort. Drive file URLs use the authenticated course `/media/stream` endpoint, while direct URLs are probed by the browser. The duration is rounded up to whole seconds and validated against the existing maximum. Failed or pending lookups clear stale values and prevent saving; retry is available. Existing durations are preserved for unchanged lesson links. Stored private playback URLs remain outside public metadata.

Automatic-duration release `f95e764` is deployed. All 98 isolated curriculum API/browser checks passed, followed by six read-only live checks using the supplied real Drive video (42 seconds), with zero runtime errors and unchanged course data.

## Automatic course duration

Recorded courses derive their total from the canonical lesson `durationSeconds` values through `courseDuration`, using the existing Arabic duration formatter. Public catalog, learning and admin reads share this calculation. Section references do not count lessons twice. Adding, editing or deleting a lesson updates the next read automatically; an empty course has no duration. The displayed total is rounded to minutes, while lesson seconds retain their precision.

Both create/edit forms show recorded duration as read-only with a centralized explanatory hint. Recorded overview writes ignore manual totals and keep no independent stored duration. Legacy recorded totals are ignored when reading, so no data migration is required. Live workshops retain their editable schedule duration and existing publication requirement. Switching delivery on creation updates the field's editability.

Acceptance covers automatic totals after lesson creation/edit/removal, public/admin agreement, stale or forged overview totals, section deduplication, read-only recorded forms, live delivery switching and live schedule persistence. Tests: `tests/security/course-duration.test.ts`, `tests/backend/course-create-fields.test.ts`, and isolated `curriculum-authoring`, `course-price` and `admin-course-management` suites.

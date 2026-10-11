# Admin course management

The protected course list at `/admin/dashboard/courses` reuses the Users table, narrow-screen record layout, custom selectors/checkboxes, dialog and pagination. It shows course name/status, creation and last-update dates, student count, lesson count, chapter count, section count, and edit/delete actions. Five records appear per page at every viewport.

Search matches title or slug literally. Publication states combine with category, delivery type and search; ordering supports creation date, last update and student count in either direction. Changing filters starts at page one; pagination retains them. Queries return counts from the database rather than downloading the full catalog or student records.

`/admin/dashboard/courses/new` creates an unpublished draft with validated name, slug, description, price, category and delivery. The `new` slug is reserved. A live course needs a duration before publishing; the overview editor exposes that field and identifies it explicitly if missing. Existing metadata/thumbnail/intro editing remains on `/admin/dashboard/courses/[slug]`. Curriculum details and existing lesson-video editing are on `/admin/dashboard/courses/[slug]/content`, reached through the content tab. Creating/reordering chapters, sections and lessons is a separate future authoring stage; this change provides the overview and content separation, not that additional editor.

Existing modules count as chapters. Optional named `sections` group each chapter's existing lesson IDs; empty groups count as sections, but a lesson cannot belong to two groups or reference another chapter. Courses without nested groups show zero sections. Lesson counts come from actual `lessons` rows, and student counts from `enrollments`.

Creation timestamps were never recorded for legacy courses. They remain NULL and display “غير مسجل”; no fabricated historical dates are introduced. New drafts receive actual creation/update times, and subsequent course or lesson changes update the course timestamp. Dates render in Africa/Cairo consistently on the server and client.

Deletion requires a same-origin authenticated admin request plus a matching course confirmation. The database rechecks active account access and current admin membership, locks the course, and rejects any course with enrollments. Unpublishing remains available instead. Unsubscribed deletion cascades existing dependent rows. Student or guest API/RPC access cannot create, inspect management data or delete courses.

Implementation uses focused helpers/repositories, typed request/response boundaries and shared Arabic copy. No dependencies were added. Migration: `supabase/migrations/20261011213753_admin_course_management.sql`. Local verification: `BACKEND_SUITE=admin-course-management npm run backend:test`, three course-contract unit cases, full backend regression, lint, typecheck, architecture and production build. Hosted checks in `tests/backend/admin-courses-live.cjs` are read-only.

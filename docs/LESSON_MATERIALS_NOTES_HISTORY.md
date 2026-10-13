# Lesson materials, private notes and content history

## Admin lesson materials

Open `/admin/dashboard/resources` from the materials tab. Add a name, description, a short type label (for example PDF/TXT/Project), and choose:

- **Downloadable text**: the content becomes an authenticated `.txt` download.
- **External link**: enter a full HTTPS URL. The protected resource endpoint checks enrollment before redirecting. External file permissions and copied URLs are controlled by the storage provider.

Select a course and check its lessons. Selecting another course retains the prior selections, so one resource can serve several courses. At least one valid lesson is required; the limit is 50 attachments. Save commits content and attachments atomically. Editing/deleting checks the current revision and rejects a stale screen with a conflict rather than overwriting another admin's work. Deletion removes all attachments to that resource.

Search and type filters combine; there are five records per page. Students have the same filters in `/dashboard/resources`, restricted to their published enrolled courses. Lesson pages load actual database attachments. Resource content/URLs are not embedded in public course or student library metadata. This feature does not add material file uploads, video uploads, HTML execution or rich-text rendering.

## Private lesson notes

An enrolled learner types in **My private notes** and uses **Save notes**. Saved text is retrieved from their account in other browsers/devices. The status distinguishes saved and unsaved text. The limit is 4,000 characters; save requests are bounded by the existing body/rate policies.

Simultaneous edits use a revision number. When another device saved first, the later save receives 409 `NOTE_CONFLICT`; its draft remains visible so the learner can retain it and reload/reconcile. Save before leaving the lesson. Note state resets when the lesson route changes.

Old browser-local notes can be imported explicitly when the cloud note is empty. They are never silently uploaded or merged into an existing cloud note. Guests/non-enrolled previews retain the original local-note component and its browser-local description.

Normal authenticated clients, including admins, cannot read another learner's notes. Access requires owner identity, active account, enrollment and published course. Removing enrollment hides but retains notes; restoring enrollment restores them. Removing the lesson/course/account cascades to its notes.

## Content history

Open `/admin/dashboard/activity`. Search target identifiers, filter the entity and navigate five records at a time. Times use the shared Cairo timezone and include seconds.

Database triggers record changes to courses, lessons, resources, resource attachments, live sessions, workshop templates, bundles, discounts and admin memberships. Each row includes actor ID if available, action, target, time and changed column names. Repeated lesson IDs include course slug in their target. No credentials, lesson notes, private media URLs, material content or before/after bodies enter the table.

Rows cannot be forged, changed or deleted by administrator/student JWTs. A service-origin change has no signed-in human actor and is displayed as **System / administrative service**. Deleted actors remain as IDs with an unavailable-account label. This is content/role history, not a complete sign-in, moderation, contact-verification or payment audit. Database operators retain maintenance access. Retention/archival needs an explicit operational policy.

## Endpoints and data

| Endpoint | Contract |
| --- | --- |
| `GET /api/admin/resources` | Admin-only bounded list with combined `q`, `filter=text/link/all`, `page`. |
| `POST /api/admin/resources` | Admin-only create/update; `id` absent + revision 0 creates. Existing ID/current revision updates. `operation=delete` deletes with revision. |
| `GET /api/resources/[id]` | Authorized text attachment or HTTPS 302 with no referrer; unknown/unauthorized material is 404. |
| `GET /api/courses/[slug]/lessons/[lessonId]/notes` | Enrolled owner note or empty text/revision 0. |
| `POST /api/courses/[slug]/lessons/[lessonId]/notes` | `{text,revision}`; returns canonical saved text/revision or conflict. |
| `GET /api/admin/activity` | Admin-only bounded history list with `q`, known entity `filter`, `page`. |

Migration: `20261013045229_lms_materials_notes_history.sql`. Existing resources gain kind/revision/timestamps; they retain their content/relationships. Their initial timestamps reflect migration time, not reconstructed historical edit times. History begins with changes after this migration; it does not fabricate older events. New notes and history tables use RLS, explicit grants and guarded mutation functions. Notes' lesson FK and list ordering have indexes. The shared admin course-choice projection and record filter/pagination components serve the new workflows without adding a dependency.

## Acceptance

`BACKEND_SUITE=lms-gaps npm run backend:test` provisions disposable local users/courses/materials and tests authorization, direct JWT/RPC boundaries, races, atomic attachment failures, download/redirect behavior, privacy, suspension/revocation/publication, immutable history, search/pagination, explicit save, another browser, conflicts, old-note import and 320/390/1440px layouts. It follows no external resource link and creates no payment. Local Chromium requires the documented WSL browser libraries. Check `WORK_CHECKPOINT.md` for the final verified results.

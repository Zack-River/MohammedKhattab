# Scheduled live sessions

Administrators use `/admin/dashboard/live-sessions` (sidebar: Live Sessions) to create, edit, hide or delete a session. The shared editor accepts a recorded course or live workshop, optional chapter and section, title, description, meeting URL, start date/time, end date/time and timezone. Cairo is the default; Riyadh and UTC are also available. Times are entered in the selected timezone, converted by PostgreSQL to UTC, and displayed in that session's timezone. A session must have a positive duration of at most 24 hours. Nonexistent local times during daylight-saving changes are rejected.

The administrative table combines title search and upcoming/active/ended filters, with five records per page and the existing mobile card layout. Edits and deletions use optimistic revisions; competing mutations cannot silently overwrite each other. Deletion uses the existing accessible modal and cascades the saved meeting URL.

Students see sessions on normal course details, recorded lesson pages and `/dashboard/live-sessions`. The dashboard aggregates only enrolled courses. Optional chapter/section names are shown alongside the course. A session is upcoming before its start, active from its start inclusive until its end exclusive, and ended at or after its end. Upcoming cards show the scheduled start without a joining action. Active cards show joining only to enrolled students. Ended cards show the actual end date/time and no joining action.

The browser uses a server-time snapshot plus elapsed monotonic time, ticks every second, refreshes metadata every 30 seconds and on returning to the tab, and aborts pending fetches on unmount. Schedule edits/visibility changes reach an already-open page on its next refresh. Clock ticks change upcoming/active/ended states without a page reload. The server and database enforce exact access boundaries independently of the displayed timer.

## Access and storage

- `live_sessions` stores schedule metadata, course/chapter/section assignment, visibility and revision. Public queries select only metadata for enabled sessions on published courses.
- `live_session_links` stores the private meeting URL separately. It is excluded from public schedule APIs and server-rendered student page payloads.
- Student cards link to `/api/courses/[slug]/live-sessions/[id]/join`, not the meeting URL. This endpoint verifies identity, course/session identity, visibility, enrollment and the current window, then returns an uncached redirect.
- RLS also checks enrollment, course publication, session visibility, timing and authoritative suspension/deletion state. Access cannot be recovered using direct REST queries or an old JWT after suspension. Active administrators can inspect URLs at any time to configure sessions.
- Client roles have no direct write privileges. Admin-checked RPCs save metadata and URL atomically and serialize competing changes with row locks and revision checks. Requests use existing CSRF, bounded JSON, authentication and proxy rate limits.
- The platform controls disclosure of the URL. It does not close an external meeting room or revoke a URL a participant has already copied. Room admission, recording and termination remain controlled by the selected meeting provider.

## Verification

Run `npm run test:security`, then `BACKEND_SUITE=live-sessions npm run backend:test` against the existing isolated local Supabase test configuration. The latter uses disposable users and course fixtures, never follows an external meeting URL and cleans up its data. Browser checks require the installed Playwright browser and its operating-system dependencies.

Coverage includes administrator-only CRUD, CSRF, calendar/time validation including a Cairo DST gap, private URL separation, start/end boundaries, enrolled/guest/outsider access, direct REST and RPC attempts, optimistic edit/delete races, disabled and unpublished sessions, suspension with existing tokens, student schedule ownership, automatic browser state changes, themed deletion confirmation and responsive views at 320/390/1440 pixels. No real meeting schedule is seeded by migrations.

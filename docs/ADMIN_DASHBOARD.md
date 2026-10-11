# Administrator dashboard

## Routes and shared UI

- `/admin/dashboard`: administrator-only Users tab, paginated 20 accounts at a time.
- `/admin/dashboard/users/[id]`: administrator-only account details and actual course subscriptions. No public `/users` profile pages.
- `/admin/dashboard/courses` and `/admin/dashboard/courses/[slug]`: existing database-backed course and media editor.
- Previous `/dashboard/admin/courses` URLs redirect to the new editor.

The existing dashboard shell, form/buttons, font and theme are reused. User presentation receives typed label props; account data, moderation configuration, validation and server repositories remain separate. `modules/styles/admin.css` uses canonical theme tokens.

## Responsive account presentation

The design follows [Carbon's table guidance](https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines) for consistent rows and progressive disclosure, [NN/G's record-focused tasks](https://www.nngroup.com/articles/data-tables/), and [WCAG reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html). The direction is restrained and utilitarian: white names, muted secondary data, neutral row hover, and the existing red identity for meaningful emphasis. No new dependencies or palette are introduced.

Desktop keeps five aligned columns: avatar/name/role, username, email, status and actions. Long identifiers are visually truncated; their complete values remain in the cell title and private detail page. Existing usernames are not changed. At 1024px and below, the same semantic table becomes stacked account records; 480–1024px places username and email beside each other. All fields and actions remain available without horizontal scrolling. Explicit table/row/cell roles preserve table semantics when display styles change.

Each student has View and Manage actions. Manage opens a native modal with account identity and grouped access, administrator permission and deletion controls. Suspension duration lives inside this modal. Restricting, promoting and deleting still require a separate confirmation; Restore remains immediate. Escape cancels the current modal and restores focus to its opener, keyboard focus stays within the active modal, and pending requests prevent cancellation. Protected administrators show a concise protected-account label with the explanation in its title. Shared dialog, identity and moderation-control components are reusable on private details.

Controls have a minimum 44px height. Dialogs fit the viewport, scroll internally and lock background scrolling. Browser acceptance checks 320, 390, 768, 1024 and 1440px, record-name width, nested cancellation, focus restoration, keyboard containment, touch targets and actual suspension/restoration. UI checks complement the unchanged API/RLS authorization tests.

## Accounts and moderation

Name, username and optional HTTPS avatar are read from profiles; email, confirmation and restrictions are read from Supabase Auth. Existing accounts receive unique `user-<UUID>` usernames. Missing images display an initial instead of an invented profile photo.

Suspensions: 24 hours, 7 days, 30 days and 365 days. Administrators see the expiry in UTC and a remaining days/hours/minutes counter, refreshed each minute. Restore clears a suspension or ban immediately. Expiry automatically restores access. Supabase's duration API represents the permanent-ban option with 100 years; it is displayed as a ban rather than a countdown.

Banning, suspending, deleting and promoting require a confirmation dialog. Deleting uses Supabase Auth and cascades profile, enrollment and progress data. Promotion requires a confirmed, unrestricted account and atomically maintains both the trusted email allowlist and administrator membership. Administrators are protected from deletion and banning, including concurrent promotion/moderation through an Auth-table trigger. An operational role removal is required before deliberately deleting an administrator; no demotion UI is added in this stage.

## Server and database enforcement

`SUPABASE_SECRET_KEY` must be configured in Vercel Production, with no `NEXT_PUBLIC_` prefix. Only `modules/lib/supabase/admin.ts` constructs the server-only Auth administrator client. The browser never receives the key, password hashes or provider tokens.

All user management APIs validate current identity and trusted administrator membership. Mutations also enforce same-origin requests, bounded JSON, UUIDs and permitted action/duration values. Personalized responses are private and uncached.

Private database authorization checks the current Auth row and its restriction timestamp, so previously issued JWTs cannot retrieve protected data after suspension, ban or deletion. Restrictive authenticated policies add this check to existing ownership and administrator rules. Public course previews remain public to anonymous visitors. Privileged implementation functions live in the private schema; public RPC wrappers use invoker permissions. Promotion checks `auth.uid()`; user-editable metadata never grants roles.

## Verification

Run `npm run backend:test` against the dedicated local Supabase stack. It uses temporary accounts, exercises the real Auth and Data APIs and cleans them up. `BACKEND_SUITE=admin-users` selects the moderation suite; `BACKEND_SUITE=admin-users-browser` selects browser/layout checks. It never moderates production accounts.

Coverage includes anonymous/student denial, direct RPC escalation, field minimization, uncached responses, malformed IDs/pagination/durations, cross-origin deletion, administrator protection, real subscriptions, all suspension durations, already-issued API/JWT restrictions, early restore, automatic expiry, native login rejection, permanent-ban display, deletion cascades, durable promotion, browser confirmation/restore and mobile table bounds. Full-page screenshot widths must also match the mobile viewport; checking only the HTML element's scroll width misses clipped absolute-positioned overflow.

Evidence and release status: `docs/evidence/admin-dashboard/VERIFICATION.md` and `WORK_CHECKPOINT.md`.

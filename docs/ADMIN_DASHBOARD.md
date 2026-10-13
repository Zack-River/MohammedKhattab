# Administrator dashboard

## Routes and shared UI

- `/admin/dashboard`: administrator-only analytics home.
- `/admin/dashboard/users`: Users tab, paginated five accounts at a time, including phones.
- `/admin/dashboard/users/[username]`: administrator-only account details and actual course subscriptions. No public `/users` profile pages.
- `/admin/dashboard/courses` and `/admin/dashboard/courses/[slug]`: existing database-backed course and media editor.
- `/admin/dashboard/resources`: material authoring and lesson assignments.
- `/admin/dashboard/activity`: immutable content/role history. See [materials, notes and history](LESSON_MATERIALS_NOTES_HISTORY.md).
- `/admin/dashboard/live-sessions`: scheduling with protected joining windows.
- Previous `/dashboard/admin/courses` URLs redirect to the new editor.

The existing dashboard shell, form/buttons, font and theme are reused. User presentation receives typed label props; account data, moderation configuration, validation and server repositories remain separate. `modules/styles/admin.css` uses canonical theme tokens.

## Responsive account presentation

The design follows [Carbon's table guidance](https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines) for consistent rows and progressive disclosure, [NN/G's record-focused tasks](https://www.nngroup.com/articles/data-tables/), and [WCAG reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html). The direction is restrained and utilitarian: white names, muted secondary data, neutral row hover, and the existing red identity for meaningful emphasis. No new dependencies or palette are introduced.

Desktop keeps five aligned columns: avatar/name/role, username, email, status and actions. Long identifiers are visually truncated; their complete values remain in the cell title and private detail page. Existing usernames are not changed. At 1024px and below, the same semantic table becomes stacked account records; 480–1024px places username and email beside each other. All fields and actions remain available without horizontal scrolling. Explicit table/row/cell roles preserve table semantics when display styles change.

Each student has View and Manage actions. Manage opens a native modal with account identity and grouped access, administrator permission and deletion controls. Suspension duration lives inside this modal. Restricting, promoting and deleting still require a separate confirmation; Restore remains immediate. Escape cancels the current modal and restores focus to its opener, keyboard focus stays within the active modal, and pending requests prevent cancellation. Protected administrators show a concise protected-account label with the explanation in its title. Shared dialog, identity and moderation-control components are reusable on private details.

Controls have a minimum 44px height. Dialogs fit the viewport, scroll internally and lock background scrolling. Browser acceptance checks 320, 390, 768, 1024 and 1440px, record-name width, nested cancellation, focus restoration, keyboard containment, touch targets and actual suspension/restoration. UI checks complement the unchanged API/RLS authorization tests.

## Search and combined filters

The default search matches name, username or email as a case-insensitive literal substring. The “الاسم يبدأ بـ” radio option instead searches the beginning of the full name, using `lower(name) ^@ lower(p_search)` and the `profiles_name_prefix_idx` SP-GiST expression index. It supports Arabic and Latin case folding; punctuation is literal, not wildcard SQL. Search mode combines with every existing filter and persists through pagination. Status choices are Suspended and Banned; selecting both matches either status. Admin-only and Newcomers (last seven days) intersect with those choices and the search. Expired suspensions do not match Suspended. Permanent bans do not match Suspended. An empty status selection includes every status.

`userAdministration` centralizes page size (five), search length (100) and newcomer days (seven). `readUserQuery` validates page, search and allowed filter values for the page and API. `userQueryUrl` preserves search/filter choices in pagination links. Submitting the GET form resets to page one; Clear removes all choices. The URL restores values after refresh or browser Back. A total-result count is calculated before pagination.

Filtering happens in the database through `public.search_admin_users`, using the administrator's verified session, then orders by creation time and ID descending for deterministic pagination. Its invoker wrapper calls a private function that must join private Auth data: the function checks active identity and trusted administrator membership internally before reading accounts, and is unavailable to anonymous callers. It projects only account DTO fields, never Auth secrets. Search uses literal substring matching rather than SQL interpolation or wildcard syntax. Private fields never reach students.

Isolated coverage: `BACKEND_SUITE=admin-user-search npm run backend:test` creates eight matching accounts, tests disjoint five/three pages, search beyond page one, role/date/status intersections, expired/old records, malformed parameters, literal SQL/wildcard input, direct student RPC denial, browser pagination/reset/refresh/Back and narrow layouts. Hosted verification only reads real accounts; no production users are moderated.

## Accounts and moderation

Name, username and optional HTTPS avatar are read from profiles; email, confirmation and restrictions are read from Supabase Auth. Default usernames merge the first and last words of the stored name, lowercase and remove punctuation, then append six cryptographically random digits. Non-English first/last names use a friendly English gerund-adjective base instead; actual display names are preserved. The private database helpers `username_base` and `generate_default_username` own generation; the trigger serializes same-profile upserts and reserves every candidate using transaction advisory locks plus the unique constraint. Existing non-ASCII handles are migrated; valid chosen English handles are preserved. Students can edit their own handle at `/dashboard/profile`; ASCII username validation is shared in `modules/helpers/validation/username.ts`, the server normalizes input, and conflicting handles return HTTP 409. Owner-only RLS remains in force. Missing images display an initial instead of an invented profile photo.

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

## Shared control acceptance

Filters use the design-system Checkbox and Radio; duration and category use Select; publishing uses Checkbox. These are the same reusable implementations, with native form semantics and modal-safe top-layer dropdowns. No new dependency is added. `BACKEND_SUITE=username-controls npm run backend:test` checks concurrent generation/renames, Arabic/single names, legacy backfill preservation, owned-profile editing, name-prefix indexing/filtering and responsive modal controls. `tests/platform/form-controls.spec.ts` checks independent controlled/uncontrolled instances, disabled options, keyboard selection/typeahead, required validity, native submitted values, reset, light dismissal, reduced motion and 320px bounds. Fixture screens are excluded from the production app.

### English handles and administrator URLs

User detail links use `/admin/dashboard/users/[username]`. Server-side resolution requires administrator access before looking up the profile, then uses its immutable UUID for subscriptions and moderation. Existing UUID bookmarks redirect to the stored handle; missing handles return 404. Username changes update new links immediately. No public user profile was added.

`unique-names-generator@4.7.1` is pinned as migration tooling. `npx tsx scripts/backend/generate-username-helper.ts` regenerates the private SQL vocabulary using curated gerunds and friendly adjectives. PostgreSQL cryptographic random digits, advisory locks and the unique index remain authoritative for signup and rename uniqueness; no generator is shipped to the browser. Handles accept English letters, digits, hyphens and underscores (3–48 characters).

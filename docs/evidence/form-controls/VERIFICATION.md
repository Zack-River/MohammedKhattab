# Username and shared form control acceptance

Verified on 2026-10-11 using isolated local Supabase fixtures and real read-only hosted administrator sessions.

- `BACKEND_SUITE=username-controls npm run backend:test`: 56 checks passed. Twelve concurrent same-name signups, Arabic and single names, unique renames and simultaneous conflict, custom-handle preservation during name-only upsert, owner-only editing, validation, legacy backfill preservation, parameterized name-prefix index eligibility and responsive browser controls.
- `BACKEND_SUITE=admin-user-search npm run backend:test`: 47 checks passed. All existing search/date/status/role intersections, pagination, malformed inputs and mobile limits preserved.
- `BACKEND_SUITE=admin-users npm run backend:test`: 100 checks passed. Protected roles, RLS, timed restrictions, restoration, account removal, promotion and browser dialogs.
- `playwright test --project=platform tests/platform/form-controls.spec.ts tests/platform/reuse.spec.ts`: 7 tests passed, including native required-field validity, disabled states, Arrow/Home/End/typeahead selection, radio/checkbox keyboard behavior, native submitted values, form reset, instance IDs, light dismissal and reduced-motion handling.
- Full lint, TypeScript, production build, architecture (471 files / zero violations) and secret scan passed. Local and hosted Supabase advisors found no issues. SQL lint passed and migration shadow comparison has no schema differences. Migration includes only the new helpers/index/search contract and selective legacy-default backfill; seeds were not reapplied.
- `local-verification.json`: 19 read-only checks passed against the staged production build using the real hosted administrator. Menus fit 320×568, 390×844, 844×390 and 1440×900; no page overflow or JavaScript errors. Real usernames and prefix search are verified. No live profile, moderation or course edits were submitted.

The `modal-*`, `filters-390` and `profile-390` screenshots use isolated ephemeral fixtures. `local-*` uses the production build and hosted data. `live-*` is reserved for fresh checks after Vercel serves the application commit.

Implementation references: [WAI-ARIA combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), [native Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API), and [PostgreSQL SP-GiST text-prefix operators](https://www.postgresql.org/docs/current/spgist.html).

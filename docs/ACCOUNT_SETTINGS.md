# Accounts, settings and verification

The avatar opens Profile, Settings, WhatsApp Support and Logout. The shared ActionMenu uses a native top-layer popover, outside-click dismissal, focus-leave dismissal, keyboard navigation and Escape/focus return. Labels and destinations are supplied by configuration; menu appearance and timing use the existing theme. Administrator membership stays attached to the immutable account ID when its confirmed email changes; the former allowlisted email is removed. Admin profile/settings remain under `/admin/dashboard`; student pages use `/dashboard`.

Profile is read-only: image, name, English username, email and phone. Students also see their enrolled courses; administrators see the administration destination. Settings edits first/last name, username and phone. Student email is read-only and the API rejects email edits, including the legacy profile endpoint. Admins may request an email change. Phone/email changes require the current password. Password changes require current password, a new password and matching confirmation. Supabase Auth owns password hashing; passwords are never saved in application tables.

## API and schema

- `GET/POST /api/account/settings`: authenticated owned account, strict numbering-plan validation with pinned `libphonenumber-js/max`; displayed phone format `+20-1201024880`, stored E.164 `+201201024880`.
- `POST /api/account/password`: reauthentication uses an isolated Supabase client, then updates the active account password.
- `POST /api/account/verification`: resends signup confirmation or an authenticated owned pending email-change confirmation.
- `POST /api/auth/forgot-password`: requests an email recovery link; successful responses do not reveal whether an email exists.
- `POST /api/auth/reset-password`: requires a fresh recovery authorization bound to the verified Auth session; consumes it once before updating the password and signing out.
- `POST /api/admin/users/[id]/verification`: administrator-only manual confirmation of the exact current phone. Email confirmation is automatic via email, not manually approved.

A server-only `save_account_settings` RPC saves identity and phone atomically, so a username conflict cannot partially change the account. `profiles` stores first/last names, username and avatar; its compatibility display name stays synchronized by a trigger. `account_contacts` stores contact values and separate confirmation timestamps. Its owner can read, but cannot write confirmation status. Email status follows Auth's confirmed email and pending changes through an Auth trigger. `account_verification_events` records administrator, target, confirmed phone and timestamp. `account_recovery_grants` stores expiring, single-use session-bound recovery permission. Audit/recovery tables have no student/anonymous grants. Relevant indexes cover username uniqueness, name/first-name prefixes, email, phone, verification history and recovery-session foreign keys.

Initial missing phones are unverified. Phone edits clear their timestamp automatically; pending email edits immediately clear email verification. Both contacts must be verified before any new enrollment, including trusted inserts. A database trigger enforces this and serializes with contact edits. Existing enrollment/progress/resource/playback access does not depend on these contact flags. Moderation still applies. Direct Supabase Auth email edits also invalidate enrollment eligibility while pending, even if attempted outside the app.

## Gmail delivery setup — credentials pending

Configure **Supabase → Authentication → Email → SMTP Settings**. Gmail sends the messages; Supabase generates and verifies the signup, email-change and recovery links. No email library or duplicate password/token database is necessary.

- Enable Custom SMTP.
- Sender email: the Gmail account being used.
- Sender name: Ta3allam.
- Host: `smtp.gmail.com`.
- Port: `465` (TLS), or `587` if your SMTP configuration uses STARTTLS.
- Username: the full Gmail address.
- Password: a Google **App Password**, not the Gmail account password. Enable Google 2-Step Verification first.
- Enable email confirmations and secure/double email-change confirmation. Keep password minimum at least eight.
- Site URL: `https://ta3allam.vercel.app`.
- Allowed redirect URL: `https://ta3allam.vercel.app/api/auth/callback`.
- Local development callback URLs must also be explicitly allowed when testing a hosted project locally. Local acceptance instead uses isolated Supabase and its local email inbox.

Do not commit the App Password or put it in any `NEXT_PUBLIC_` variable. Gmail credentials belong only in Supabase's SMTP settings. Google and Supabase impose email sending limits; this is not unlimited delivery. Supabase's default sender is restricted to team addresses, so production student email delivery needs this SMTP configuration.

Sources: [Supabase SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [Google App Passwords](https://support.google.com/accounts/answer/185833).

## Acceptance

Run `BACKEND_SUITE=account-settings npm run backend:test` against isolated local Supabase. It covers validation/reauthentication, RLS/role enforcement, contact invalidation, audit, indexed lookup, new-versus-existing enrollment access, responsive menus/settings and an actual local-inbox password recovery link. `BACKEND_SUITE=account-settings-browser` reruns just the browser/email flow. Production Gmail inbox delivery remains pending until credentials and SMTP configuration are provided.

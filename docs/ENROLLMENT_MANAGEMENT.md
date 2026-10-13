# Manual course access management

Open `/admin/dashboard/users/[username]`. Add a course with **Add enrollment**, or use **Revoke access** / **Restore enrollment** on its subscription card. Each action requires an administrator-only reason. The most recent five actions show the actor, course and time; all events remain stored.

## Access and financial rules

- New manual grants require the student's email and phone to be verified, matching the existing enrollment gate. Existing access can be restored without repeating contact verification. Account suspension and unpublished courses still block learning.
- Revocation preserves the enrollment anchor, lesson completion and private notes. It hides protected playback, progress, notes, material downloads and live joining links. Public preview lessons remain public. Restoration recovers previous learning history.
- Revocation does not refund a payment. Delayed/replayed single-course and bundle settlements insert missing enrollments without updating an existing inactive row. Students cannot pay again to bypass revocation; receipts identify revoked access separately from pending activation and link to support.
- Course-list student counts and enrollment analytics count active subscriptions. Historical enrollment date is retained through restore; restoration is not a new sale or signup.
- Already delivered bytes and copied third-party links cannot be recalled. Subsequent platform access is denied; external storage permissions remain the provider's responsibility.

## API and database

`POST /api/admin/users/[uuid]/enrollments` accepts:

```json
{"courseSlug":"editing-foundations","action":"grant","reason":"Support review","revision":0}
```

Actions: `grant`, `revoke`, `restore`. Grant uses revision `0`; other actions use the existing subscription revision. Successful response: `{"saved":true}`. Stale or invalid state transitions return `409 ENROLLMENT_CONFLICT`. Unverified new grants return `403 CONTACT_VERIFICATION_REQUIRED`.

The signed-in administrator client calls `manage_enrollment`; both API and RPC verify authoritative membership and active account access. UUID/slug/action/reason/revision are validated. Reasons are bounded to 500 characters. RPC serializes with payment checkout/settlement using the existing per-user commerce lock, then locks contact/course/enrollment rows in compatible order. Notes and progress acquire a shared enrollment lock so revocation cannot commit before an in-flight learning write finishes.

`enrollments.active` defaults to true for existing rows; `revision` defaults to 1. Authenticated clients can insert only `user_id,course_slug`, under existing verified free-course policies; they cannot change state/revision. `enrollment_events` is RLS protected, admin-readable, immutable through authenticated clients, and contains actor/action/reason/revision/time. Service operators retain maintenance access; deletion of the account/course cascades its event rows. This is course-access history, not a financial refund ledger or full moderation history.

## Verification

Run `BACKEND_SUITE=enrollments npm run backend:test` against the isolated local Supabase configuration. Browser coverage requires the existing Chromium system-library path documented in the checkpoint. Tests cover auth/CSRF, direct JWT/RPC denial, invalid input, contact verification, concurrent/stale mutations, actual note/progress transaction lock contention, active enrollment counts, protected content, preserved history, delayed/replayed settlement, receipts and actual admin forms at 320/390/1440px. No live charge or production account mutation is made.

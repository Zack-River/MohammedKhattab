# Manual course access management

Open `/admin/dashboard/users/[username]`. Give complimentary course/bundle access with **Grant free access**, or use **Revoke access** / **Restore enrollment** on its subscription card. Each action requires an administrator-only reason. The most recent five actions show the actor, course and time; all events remain stored.

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

## Free course and bundle access (2026-10-13)

On an administrator's private user page, choose **منح وصول مجاني**. Select a course, enabled bundle or **كل الدورات والباقات** (all courses and bundles), then lifetime, one day, one week, 30 days, 365 days or custom whole days (1–3,650). Supply a private reason and save. Expiry is stored as an absolute timestamp and displayed with Cairo date/time on the subscription card. Expired access can be renewed or extended to lifetime using the same dialog. Existing explicit revocation must be restored separately before a gift can extend access.

A bundle grant is one atomic transaction covering its current published course members. A revoked member or stale revision rolls back the whole operation. Existing paid/lifetime access is preserved; a shorter gift does not shorten a longer grant. Future bundle membership changes do not rewrite previous gifts; grant the updated bundle explicitly if needed. Disabled bundles or unpublished members cannot be granted through this flow. New grants retain the existing email/phone verification requirement.

No payment gateway request, invoice, payment record or revenue is created by an administrator grant. Existing progress, enrollment date and private notes remain after expiry. The database's `enrollment_current` function and security-invoker `enrollment_access` view enforce expiry at query time; no scheduled job is required. Protected lesson/progress/note/material/live-link policies and certificate issuance/downloads use effective access. Analytics and course student counts exclude expired access. Administrative history retains the grant reason, actor, duration and bundle identifier.

An expired gift to a paid course can proceed to normal checkout. Verified payment settlement upgrades an active manual grant to standard lifetime access; payment replays do not repeatedly rewrite access or bypass an explicit revocation. A legitimately free catalog course can be enrolled again through `enroll_free_course` with normal account/contact/publication/price guards.

The existing administrative enrollment endpoint also accepts:

```json
{
  "action": "grant",
  "kind": "bundle",
  "slug": "editing-bundle",
  "expiresAt": null,
  "reason": "Complimentary access after support review",
  "revisions": { "editing-foundations": 0, "motion-essentials": 2 }
}
```

`kind` is `course` or `bundle`; `expiresAt: null` means lifetime. Timed grants use a future ISO timestamp within the permitted duration. `revisions` snapshots the existing revision for each member (zero for a missing enrollment). The signed-in administrator calls guarded `grant_enrollment_access`; its private per-course helper has no public execute permission. Client inserts cannot set origin or expiry, and clients cannot extend grants through direct writes. Existing revoke/restore requests remain compatible.

Migration: `20261013151301_admin_access_duration.sql`. New focused suite: `BACKEND_SUITE=access-grants npm run backend:test`. All gateway interactions in that suite use the isolated local mock and never charge money.

## All courses and bundles

Choose **كل الدورات والباقات** in the same dialog. No individual product selector is required. The grant snapshots every currently published course, including the courses contained in bundles, and applies the selected lifetime or duration once per course. Drafts and future publications are excluded. Bundles are course collections; no duplicate subscription or bundle payment is created. Reapply explicitly to include later publications.

The same endpoint accepts `kind: "all"`, `slug: "all"`, the chosen `expiresAt`, a private reason and existing enrollment revisions. A student with no subscriptions uses `revisions: {}`. Missing members expect revision zero; an existing membership missing from a stale snapshot causes a conflict. Unlike the per-bundle limit of 20 members, this option resolves the full published catalog inside the guarded transaction. Revision data is bounded to 12,000 bytes and requests retain their existing ingress size limit. Existing lifetime/paid access, contact verification, revocation and atomic rollback rules are unchanged. Each changed course has its own audit entry.

Migration: `20261013160045_admin_catalog_access.sql`. The access-grants suite includes a catalog larger than 20 courses, draft/future exclusion, timed/lifetime renewal, preservation of paid access, stale/revoked rollback and a real browser catalog submission.

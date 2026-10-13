# LMS workflow research and implementation audit

Date: 2026-10-13. Scope: the current unified Ta3llam Next.js application, its admin and student journeys. This is a workflow/source audit with targeted regression tests, not a claim that every possible LMS feature exists or every security vulnerability has been eliminated.

## Research basis

The closest useful comparisons are creator-led video schools and established course-management platforms. Features are selected for this project's editing/design/motion courses, live workshops and bundles; their visual design is not copied.

| Official reference | Relevant behavior | Ta3llam application |
| --- | --- | --- |
| [Teachable learner navigation](https://support.teachable.com/en/articles/11682425-navigate-and-view-course-content) | Sections in the curriculum, manual completion, private notes, lesson materials and navigation | Keep deliberate manual completion; reconcile lesson order and section display; retrieve authorized materials from the database. |
| [Teachable student dashboard](https://support.teachable.com/en/articles/11691026-student-dashboard) | A dashboard helps learners return to purchased learning | Preserve the library/continue card; expose recoverable payment requests in a private history. |
| [Thinkific progress reports](https://support.thinkific.com/hc/en-us/articles/360030369974-Progress-Reports) | Administrators inspect individual learners' course completion | Add actual completed/total lesson counts to the existing private admin user record. |
| [Canvas module progress](https://community.instructure.com/en/kb/articles/660912-how-do-i-use-modules-to-view-the-progress-of-students-in-a-course) | Organized module requirements and individual progress inspection | Use the saved course hierarchy and existing progress records; do not invent requirements or watch-time evidence. |
| [Moodle activity completion](https://docs.moodle.org/503/en/Activity_completion) | Completion can explicitly be learner-marked | Retain manual completion rather than pretending video playback proves mastery. |
| [Teachable transaction history](https://support.teachable.com/en/articles/11682567-transaction-history-and-reports) | Transactions are inspectable and have distinct states | Preserve admin sales and add student-owned payment history with search/status/pagination and links to private receipts. |
| [Moodle course reuse](https://docs.moodle.org/500/en/Reusing_activities) | Course reuse and backup are separate operational features | Record course duplication/import and restore verification as future operational work. |
| [Teachable refund handling](https://support.teachable.com/en/articles/15661427-issue-refunds-and-manage-disputes) | Refunds need their own transaction workflow | Do not represent a local status change as a provider refund. A provider-backed refund workflow remains outstanding. |

These references inform feature decisions. They do not determine Ta3llam's refund policy, certification claims, supported media rights or business terms.

## Code paths traced

Reviewed the route inventory and traced implementation through:

- Accounts: identity/session guards, role checks, account field validation, verified-contact enrollment rules and existing manual phone confirmation workflows.
- Catalog/authoring: published course retrieval, public sanitization, duration totals, chapter/section grouping, curriculum mutations, revisions and publication assertions.
- Learning: lesson access and playback, outline/actions, resume/progress, browser-local notes, resources, certificate authorization and student dashboard composition.
- Administration: individual user subscriptions, analytics queries, course management, sales/commerce list repositories and their authorization boundaries.
- Commerce: catalog offers, canonical quotes, checkout ownership, immutable payment receipts, gateway environment, reconciliation, signed webhook settlement and payment status rendering/polling.
- Media: image upload authorization/signature checks, deferred playback contracts and existing controlled media URL handling.

Source inventory includes route/features/components/hooks/helpers/tests. Architecture validation parses production boundaries and function/file size budgets. The acceptance suite focuses on changed workflows; it does not replace the existing security and commerce suites.

## Findings resolved

| ID | Prior behavior / evidence | Implemented result |
| --- | --- | --- |
| L01 | `courseLessons` flattened the chapter's backing array; public curriculum grouped sections separately. Resume and next lesson could disagree with displayed course order. | One grouping helper determines section lesson ID order, then unassigned lessons. Resume, next/previous, numbering and completion use it. Indexed lookup avoids scanning all lessons per section ID. |
| L02 | Learner outline rendered chapters and flat lessons only. Its React key was the chapter title. | Render actual section groups, use chapter identifiers (stable legacy fallback), distinguish protected lessons with a lock and course destination, and display preview availability. |
| L03 | Editing an assigned lesson removed then appended its section ID. Once ordered navigation was corrected, this moved an edited lesson to the end. | Preserve its original position when staying in the same section; assignment to a different section appends intentionally. |
| L04 | `lessonInformationModel` imported static seed resources; newly stored resources were invisible or public metadata could advertise unavailable downloads. | Query normalized `lesson_resources` and `resources` using the learner session. Enrollment/publication RLS applies to both queries. Only enrolled viewers fetch materials; no content payload is embedded in the page. |
| L05 | Completion from a preview tried enrollment first, including paid courses and unauthenticated visitors. | Preview viewers receive a course action. Manual completion is offered only for owned courses; the protected progress endpoint remains authoritative. Add previous-lesson navigation. |
| A01 | Admin subscription cards exposed course/date but no completion evidence. | Show real completed/total/percentage through the existing shared progress component; ignore removed/foreign lesson keys. No simulated watch-time or completion dates. |
| R01 | Read-only hosted query found six published seed courses with 22 instances of the original sample video, plus 12 empty recorded video links in the montage bootcamp. | Before creating a new live paid course/bundle order, check all quoted course members for the known seed video (including alternate YouTube formats) and empty recorded lesson links. Reject with an actionable error without creating a pending order or provider intent. Existing access, previews, zero-total grants and isolated mock/staging tests remain available. |
| P01 | Students lacked an order list and had to retain a receipt URL to recover checkout status. | `/dashboard/purchases`: authenticated owner-only orders, combined title/status filters, five records per page, stable pagination, explicit live/test label and private status links. |
| P02 | Failed/expired receipts used pending confirmation advice and initiated automatic reconciliation. | Correct state-specific advice. Terminal failed/expired and fully activated paid receipts skip automatic polling; pending and paid-awaiting-activation retain appropriate checks. |
| A02 | Sales/commerce list parameter normalization differed between HTML and API; repeated query values were unsafe in some page assumptions. | Shared bounded commerce query parser validates known states, handles repeated parameters, and centralizes page size. Admin-only list repositories verify roles before using privileged clients. |
| U01 | Browser event capture: receipt mousedown hit the link, but mouseup/click hit its cell while the entrance moved the table. | Shared `data-reveal-motion="fade"` variant preserves opacity/timing without moving transaction-table hit areas; default card motion remains unchanged. |
| T01 | Security concurrency fixture acquired a retired per-course advisory key, then contacts, then invoked current per-user commerce functions. This manufactured a lock inversion. | Regression barrier now holds the actual per-user commerce lock before contacts; checkout/settlement assertions remain intact. No database function was rewritten to accommodate the obsolete fixture. |
| C01 | Public FAQ/footer/player text still described the platform as a free demo without real accounts/payment. | Replace those currently rendered claims with actual preview, verified account and payment behavior. Seed data remains seed data; no existing course price is silently rewritten. |

## Reuse and access contracts

- Sales filters, table and row are shared between admin sales and student history. The student variant omits customer data and adds a receipt link. No duplicate student table implementation or forwarding adapters.
- Database reads remain server-side. Student history explicitly filters `user_id` and uses the signed-in client/RLS, selecting only receipt fields. It does not expose checkout URL, provider intent, transaction credentials or another user's identity.
- Lesson resources use database relationships, not a client-provided list or the seed module. A preview does not grant enrollment, materials or completion rights.
- Progress calculations are shared with the student experience and derive from the current curriculum. Admin reporting does not mutate access or completion.
- Existing theme, Arabic RTL layout, player and 500ms reveal effects are retained. Added styles reference existing tokens. No package, external service, schema or production data change is required. The live paid checkout guard checks the known original seed video and empty recorded lesson links; it is not a general content approval system and does not cancel previously issued provider invoices.

## Acceptance cases

Automated local acceptance uses separate admin/student/other-student accounts and isolated course/resource/payment fixtures:

1. Sidebar, next/previous and resume agree with saved section order, including unassigned lessons.
2. Editing a lesson retains section position and does not mutate the input model.
3. Unknown/removed/other-course completion keys do not inflate progress.
4. Anonymous preview renders but has no completion action or protected resource; a student without enrollment cannot download it.
5. Enrolled student sees a database-only resource absent from seed data and receives the real content from the protected endpoint.
6. Admin sees the user's actual progress; another student cannot inspect that record.
7. Student history hides another user's orders and provider keys, combines search and status, and requires authentication.
8. Pagination renders at most five orders and preserves the remaining records.
9. History fits 320/390/768/1440px; receipt links recover private request status.
10. Failed/expired receipts do not automatically contact the gateway. These tests use a local mock provider, never a live checkout or charge.
11. Known states and bounded pagination are shared; repeated/unsupported parameters cannot crash the list pages.
12. Live-mode acceptance blocks sample course and bundle checkout before order creation. Its Node fetch preloader blocks all live provider network access, even if the tested guard fails.
13. Existing commerce/payment authorization, amount verification, race/idempotency and coupon tests still pass.

## Remaining gaps and dependencies

These are recorded honestly, not represented by decorative buttons or fabricated metrics:

| Priority | Gap | Completion criteria / dependency |
| --- | --- | --- |
| High | Replace published sample content | Six hosted course entries still contain the known seed video (22 lesson rows). The montage bootcamp also has 12 empty recorded lesson links. Replace those lesson links with approved course material before new live paid checkout; no existing media or course data was overwritten during the audit. |
| Resolved (2026-10-13) | Admin lesson-resource authoring UI | Searchable admin materials tab with atomic attachments, revision checks and protected text/HTTPS delivery. See `LMS_PRODUCT_GAP_AUDIT.md`. |
| High / partial | Video-position resume and cross-device private notes | Account-scoped private notes are implemented with explicit save/conflicts. Playback-position resume remains outstanding; existing resume means the next incomplete lesson. |
| High | Live workshop operational scheduling | Saved timezone/window scheduling and protected join links are implemented. Cohorts/capacity, announcements/calendar/reminders remain operational work; course owner supplies session instructions. |
| High | Refund workflow and terms/privacy content | Verify supported Fawaterak refund APIs/sandbox, record verified refund events, adjust entitlements and net revenue consistently. Owner must provide actual policies; no refund or legal policy is invented. |
| Medium | Admin moderation/content audit history | Durable searchable content/role history is implemented. Moderation/contact-verification attribution and a retention policy remain; neither security events nor content history claim a complete administrative audit trail. |
| Medium | Operational recovery | Verify database restore, media link recovery and course export/import/duplication with revision/entitlement preservation. Git history alone is not a database backup. |
| Medium | Certificate verification | Existing private completion-gated download is present. Persistent serials/public verification and issuance/revocation require a distinct certificate model. |
| Optional | Assignments, quizzes, moderated discussions | Add only when teaching workflows require submission/review/scoring. Not prerequisites for the current video-training platform. |

## Verification record

See the latest entry in `WORK_CHECKPOINT.md` for fresh command results, check counts and deployment status. Do not interpret passing local suites as proof of live provider delivery, performance at production scale, or absence of all vulnerabilities.

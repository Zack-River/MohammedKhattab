# LMS product gaps — 13 October 2026

## Scope and method

Inventoried the current unified Next.js app, database migrations, tests, admin and student routes. The automated source pass read 1,061 text source/config/test files (38,387 lines); the route inventory includes 49 page files and 50 API files, including legacy redirects. This is an inventory and focused workflow audit, not a claim that every line was manually reviewed or that no vulnerability remains. Traced authoring, resource access, learner state/notes, identity and role checks, scheduling, checkout/settlement, certificates, analytics and user administration. The architecture gate separately parses production file/function budgets and import boundaries.

Research was compared with actual implemented workflows. The selected features reuse Ta3llam's approved visual system; reference products do not determine its design, legal policies, enrollment terms or content rights.

## Similar platforms and the decisions they support

| Reference | Observed capability | Ta3llam decision |
| --- | --- | --- |
| [Teachable lesson editor](https://support.teachable.com/en/articles/11682455-add-lesson-content) | Lessons can include downloadable resources and different media/content blocks. | Close the missing material-authoring workflow using protected text downloads and external HTTPS resources. Do not add an unrequested file storage vendor or a rich-text editor. |
| [Teachable learner navigation](https://support.teachable.com/en/articles/11682425-navigate-and-view-course-content) | Learner navigation and accessible course content are distinct from authoring. | Keep resources attached to actual lessons and visible only with an enrollment. Existing ordered next/previous/resume behavior stays in place. Private notes save to the account across devices. |
| [Moodle logs](https://docs.moodle.org/503/en/Logs) | Administrative activity is inspectable through logs. | Add durable content-change history with actor, entity, target, action, time and changed field names. Never copy passwords, notes or media URLs into logs. |
| [Thinkific manual enrollment](https://support.thinkific.com/hc/en-us/articles/360030716993-Manually-Enroll-Students-into-a-Product) | Administrators can deliberately enroll students outside ordinary purchases. | Implemented durable active/revoked enrollment state with revision-checked admin controls, protected reasons and progress preservation. Payment callbacks cannot undo revocation. |
| [Teachable progress reports](https://support.teachable.com/en/articles/11682571-student-progress-reports) | Progress inspection is an administrator workflow. | Existing admin user subscriptions already expose real completed/current lesson counts; avoid a duplicate or fabricated watch-time report. |

## Gaps fixed in this iteration

| ID | Evidence before change | Result |
| --- | --- | --- |
| M01 | `resources` and `lesson_resources` were readable, but there was no admin authoring tab or bounded mutation endpoint. | `/admin/dashboard/resources`: create, edit, delete, multi-course lesson assignments, searchable five-record table/mobile cards, type filter and revision-checked atomic writes. |
| M02 | Student library rendered every readable resource without filters or pagination. | `/dashboard/resources`: combined search/type filters, stable five-record pagination and existing resource cards/reveal effects. Only protected internal download URLs enter the student page. |
| N01 | `useLessonNotes` saved exclusively in localStorage. | Enrolled learners get account-scoped private notes, explicit Save, cross-device retrieval, a 4,000-character limit, revision conflict handling and explicit import of legacy browser notes. Preview notes remain browser-local with accurate copy. |
| A01 | Structured security events did not provide a durable content-change trail. | `/admin/dashboard/activity`: searchable entity-filtered history, five records/page, admin-only access and immutable rows. Tracks course/lesson/material/attachment/session/template/commerce/admin-role changes. Service-origin writes are labelled as service/system, never fabricated as a person. |
| S01 | Generic response headers overwrote a protected resource redirect's stricter referrer setting. | Resource endpoints explicitly override Referrer-Policy to `no-referrer`; redirects still require the enrolled session. |
| U01 | Browser testing reproduced typing before textarea hydration, which altered the submitted text. | Reuse shared `useHydrated` to gate editing until React attaches. Notes reset by lesson route key so navigating between lessons does not carry another lesson's state. |
| E01 | Admin subscriptions were read-only; deletion would destroy progress and allow callbacks to regrant access. | Manual grant/revoke/restore on private user pages; active-state access guards, preserved learning records, private reason/actor history and revoked receipt/support behavior. |
| R01 | Two hydration hooks implemented the same boolean snapshot contract; live-session choices duplicated course projection. | Reuse the design-system hydration hook and one admin course-choice repository. Presentation receives only IDs/titles, not private media URLs. |

## Remaining priorities

| Priority | Gap | Concrete completion criteria |
| --- | --- | --- |
| High | Replace remaining sample/empty course video links | Owner supplies approved missing material; maintain existing live-payment content checks. This iteration does not overwrite hosted course content or create provider invoices. Previous audit recorded six sample courses and missing bootcamp links; those counts are historical, not a new live recount. |
| Completed | Manual enrollment/revocation administration | Revision-checked grant/restore/revoke with private reason/actor history; progress/notes preserved; all learner access guards and payment retry semantics updated. See `../ENROLLMENT_MANAGEMENT.md`. |
| High | Playback-position resume | Account-scoped bounded checkpoints for both native and YouTube players, revision/timestamp protection, throttled writes, correct seeking and completion semantics. Current resume goes to the next incomplete lesson. |
| High | Refunds and published policies | Verify supported Fawaterak refund operations, sandbox/provider evidence, ledger events, entitlements and net revenue. Owner supplies actual refund/terms/privacy policies. No fake refund button or invented policy. |
| Medium | Live operations beyond scheduling | Existing timezone/window/session link behavior is complete. Capacity/cohorts, calendar export, announcements and email reminders remain separate features with delivery/retry/consent rules. |
| Medium | Complete moderation history and retention | Content/role history is now present. Ban/restore/delete and contact-confirmation actions need durable human actor attribution across service-role APIs. Select an actual retention policy rather than auto-deleting audit evidence. |
| Medium | Database recovery and course reuse | Tested restore procedure, media recovery, export/import and duplication without copying enrollments, payments or private notes. Git backup is not a database backup. |
| Medium | Certificate verification | Persist issuance/serial/revocation and build verification after establishing valid business claims. Existing private completion-gated download is unchanged. |
| Optional | Assignments, quizzes and moderated discussions | Add when the teaching workflow needs submission/review/scoring; define grading and moderation before implementing decorative tabs. |

## Security and operational boundaries

- Material writes verify administrator membership both in Next.js and in guarded database RPCs. Revision checks and row locks protect edits/deletes; assignment replacement is atomic. Search is parameterized and wildcard input is stripped.
- Students cannot directly write materials or notes. Notes are owner-only and enrollment/publication/active-account scoped. A normal administrator session cannot read another student's notes. The backend uses the signed-in client for notes, not the service key.
- Revoked enrollment hides notes without destroying them; restoring access restores the saved text. Course/lesson/account deletion removes notes through foreign keys.
- History contains identifiers and field names only. It is not a full authentication/payment/moderation audit and does not record private student notes. Administrators cannot forge or delete rows through their JWT. Database operators still retain privileged maintenance access.
- HTTPS resource redirects enforce access to the platform endpoint; copied URLs and external file permissions remain the storage provider's responsibility. They are not uploaded to Cloudinary and the app does not fetch arbitrary resource URLs server-side.
- Manual note saving is intentional. Users must save before leaving; local legacy text is never silently uploaded or allowed to replace an existing cloud note. A conflicting draft remains in the textarea while the user decides how to reconcile it.
- Existing ingress/body/rate budgets cover the added APIs. No new package, payment provider call, hosted seed rewrite or visual direction is introduced.

## Verification

See the latest `WORK_CHECKPOINT.md` entry for final test counts, migration/advisor/replay results and actual deployment state. Local test accounts/course/material fixtures are isolated; no external resource URL is followed and no live charge is requested.

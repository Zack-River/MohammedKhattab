# Tools and Arabic completion certificates

## Administrator workflows

- `/admin/dashboard/tools` manages the student Tools library. Existing `/admin/dashboard/resources` bookmarks redirect here. This is the existing resources/lesson-attachments workflow, not a parallel store: create/edit/delete text downloads or safe HTTPS links, assign to lessons across courses, combine search/type filtering, and paginate five records per page. Access follows active enrollment and course publication. External storage permissions remain with the provider.
- `/admin/dashboard/certificates` previews the theme, issues a certificate using an existing username and course, searches saved learner/course names, filters issued/revoked certificates, and lists five per page. Issuance requires active enrollment in a published course and completion of **every** current lesson; administrators cannot bypass this requirement.
- Revoke/restore opens the centered existing dialog with a required reason and revision conflict protection. The document page displays the last five audit events. Revoked administrator previews have a visible Arabic watermark. Browser Save as PDF / print uses landscape artwork without the surrounding dashboard.

## Student workflows

- `/dashboard/resources` reads the same administrator-managed materials; no static runtime resource list or public download bypass was added.
- `/dashboard/certificates` offers explicit issuance for eligible courses without existing certificates. Search/status filters and five-record pagination apply to saved certificates. Repeated/concurrent issuance returns the existing record and does not undo revocation.
- `/dashboard/certificates/[slug]` previews an authorized issued certificate; the original API download remains `/api/certificates/[slug]`. GET reads never issue records. Use POST `/api/certificates` with `{ "operation": "issue", "slug": "course-slug" }` first.
- Saved certificates retain the learner name, course name, completed lesson count, UUID serial and issue timestamp from issuance. Renaming a learner/course or extending the curriculum does not rewrite the earned document. Revoked access, an unpublished course or a revoked certificate blocks learner download.

## Arabic document system

The 1200 × 850 landscape SVG embeds the project's IBM Plex Sans Arabic font, uses theme-exported `#101317`, `#FC3522`, and white, and requires no remote fonts or new dependency. An SVG-only response policy permits embedded data fonts while disabling scripts and network sources; the main website policy stays separate. The browser checks that the actual font loads, not merely that its CSS exists. All document wording is Arabic; the serial is a technical identifier. Frame, red corner accents, triangle brand mark, main heading, learner name, wrapped course title, lesson count, issuer, issue date, serial and qualification statement are shared between student and admin renders. The issuer is Mohammed Khattab, founder of Ta3allam; no forged signature image, accreditation seal or invented qualification is used.

Research: [OpenLearn's actual statement](https://www.open.edu/openlearn/ocw/blocks/ocwstatement/statement.php?id=955) shows learner, course, issue date and a qualification boundary. This informs the data hierarchy, not the visual identity. Certificate copy/presentation/model/XML wrapping and document response have separate responsibilities. Preview copy is centralized. Long names scale and wrap within the name region; course titles wrap by words; all dynamic XML text is escaped.

SVG is the downloadable original. Browser print-to-PDF is available; it is not a server-generated PDF attachment. Serial verification is private to authenticated learner/admin screens, not a new public user profile or public verification endpoint. Previously generated demo SVG files are not automatically recognized as issued records.

## Database and security

Migration `20261013061849_tools_certificates.sql` adds certificates and immutable event history with explicit grants, RLS and indexed user/course/status/date relationships. Signed-in clients use guarded `issue_certificate` and `moderate_certificate` RPCs with empty search paths. Direct browser writes are denied. Issuance serializes per learner/course, locks enrollment/course/progress rows and checks all lessons. Revoke/restore uses row locking and exact revision checks. Student-supplied usernames and administrative reasons cannot be used to impersonate another student or moderate certificates. Administrative event reasons remain private.

Completion reflects the platform's explicit lesson-completion action, not verified watch time, assessment scores, professional competence or live attendance. Workshops without tracked lessons cannot produce a certificate through this completion rule; an attendance workflow must be defined before that claim can be made. An issued certificate prevents physical course deletion while present; archive/unpublish instead. Account deletion cascades its certificate/event records; that retention behavior must be considered before introducing public lifetime verification.

## Student/admin parity audit

| Student feature | Administrator counterpart | Result / boundary |
| --- | --- | --- |
| Learning library / progress | Course authoring, user subscription progress and enrollment controls | Existing complete workflow; active access guards retained. |
| Tools / lesson downloads | Tools library, multi-course lesson assignments | Same records, matching tab naming; no duplicated implementation. |
| Completion certificates | Issuance, preview, search/filter, revoke/restore, private event history | Implemented this iteration; exact lesson completion replaces rounded percentage eligibility. |
| Purchases / receipts | Sales, offers, bundles/coupons, payment reconciliation | Existing workflow; gateway-backed refunds remain separate. |
| Live schedule / join window | Live Sessions authoring and time-window protections | Existing scheduling workflow; attendance/capacity/reminders remain separate. |
| Profile/settings/contact verification | Users and phone confirmation requests | Existing workflow; granular moderation-history retention remains a separate gap. |
| Private lesson notes | No administrator reading of private notes | Intentional privacy boundary; not a missing admin tab. |

Playback-position resume, grading/assignments, formal live attendance, supported refunds, calendar reminders and recovery/retention policy remain tracked product gaps. This iteration does not claim these are implemented or invent decorative controls for them.

See `WORK_CHECKPOINT.md` for the actual fresh test and deployment results.

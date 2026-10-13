# Current checkpoint — Product-gap audit, materials, private notes and history (2026-10-13)

- Compared actual admin/student workflows with official Teachable, Thinkific and Moodle references. Recorded implemented and remaining priorities in `docs/audits/LMS_PRODUCT_GAP_AUDIT.md`; this is an inventory/focused workflow audit, not a claim of manual review of every source line or absence of all vulnerabilities. Updated stale README/admin routes and feature claims, the previous workflow audit and the design contract.
- Added `/admin/dashboard/resources`: create/edit/delete materials, protected text or external HTTPS delivery, multi-course lesson assignments, atomic writes, revision conflict checks, combined search/type filters and five-record table/mobile cards. Student `/dashboard/resources` now uses the same filters/pagination contract. Attachments are updated as a delta so unchanged links do not generate spurious history events. Existing resources/content remain intact.
- Enrolled learners now explicitly save private notes to their account with 4,000-character limits, optimistic revisions, retained conflict drafts and cross-browser retrieval. Legacy browser notes require explicit import into an empty cloud note; previews keep accurate browser-local behavior. Normal admin JWTs cannot read students' private notes. Revocation hides retained notes; restored access restores them. Route keys prevent state leaking between lessons.
- Added `/admin/dashboard/activity`: immutable admin-only content/role history with actor, entity, identifier, action, actual Cairo timestamp and changed field names. Covers courses, lessons, materials/attachments, sessions, templates, bundles, discounts and admin membership. No notes, credentials, private URLs or before/after content enter logs. Service-origin actions are honestly labelled system/service; full moderation/contact-verification attribution and retention remain outstanding.
- Reused existing design components/theme/reveals and shared course-choice/filter/pagination helpers. Removed the duplicate hydration hook. Fixed real pre-hydration note editing and a generic security-header override of the resource redirect's `no-referrer` policy. Browser screenshot caret injection was identified as a test artifact and removed without suppressing hydration diagnostics. No dependency, external charge, live meeting or hosted course seed was added.
- **247 checks passed:** 71 new material/note/history API/RLS/browser cases; 58 live-session regressions; 29 security integration checks; 31 learning/payment-history regressions; 58 helper/security tests. New coverage includes real browser material creation/editing retaining multi-course assignments, concurrency, protected downloads, other enrolled students, suspended/unenrolled access, immutable history, combined filters/pagination, cloud saves/reload/second browser, preserved stale drafts, legacy import and 320/390/1440px layouts. The security runner was rerun successfully with WSL browser libraries after an environment-only launch failure.
- Lint, TypeScript, architecture (885 production files / zero violations) and production build passed. Local/hosted migration `20261013045229_lms_materials_notes_history.sql` applied without seeding; both advisors reported no issues and shadow migration replay found no schema differences. Read-only hosted checks confirmed guests are denied notes, history and resource tables. Source snapshot verified (1,061 files), secret scan checked 1,879 files with zero violations, and diff checks passed.
- Usage, endpoint contracts and boundaries: `docs/LESSON_MATERIALS_NOTES_HISTORY.md`. Playback-position resume, safe manual entitlement administration, provider-backed refunds/policies, operational recovery, certificate verification and expanded live operations remain explicitly documented priorities. Published implementation `6d459e3ddbfc98ecff2132e30da4c4645584af9c` to main; Vercel reported a successful deployment. All nine live checks passed: guest denial for the three new private APIs, real administrator login, authenticated uncached material/history APIs, both administrative pages with the new sidebar tabs, and normal public course details. These live checks did not author content, enroll users, request payment or follow external resource links.

# Current checkpoint — Scheduled live sessions (2026-10-13)

- Added `/admin/dashboard/live-sessions` and its sidebar tab with reusable course/chapter/section assignment, date/time/timezone controls, HTTPS meeting link, visibility, create/edit/delete, combined search/status filters and five-record pagination. The existing table becomes mobile cards; deletion uses the existing centered accessible dialog. The shared theme and dependencies are unchanged.
- Recorded courses can include scheduled live lessons, and the same scheduler supports live workshops. Normal course details, recorded lesson pages and `/dashboard/live-sessions` reuse the same cards. Upcoming cards show start time without joining; active enrolled sessions allow joining; ended cards remove joining and display the actual end time. Server-clock-based updates work without reloading.
- Kept meeting URLs in a separate private table. Public metadata, rendered student payloads and schedule refreshes contain no meeting URLs. The joining API and RLS independently enforce ownership, publication, visibility, account access and exact start/end windows. Admin mutations are atomic and revision-checked. Tested direct REST/RPC attempts, suspended accounts with old JWTs and revoked admin roles.
- All 58 live-session API/RLS/browser checks and 56 security/helper tests passed (114). Coverage includes recorded/live assignment, optimistic races, filter combinations, pagination, automatic timing and layouts at 320/390/1440px. Test fixtures are isolated and cleaned; no external meeting URL is followed and no hosted session is seeded.
- Lint, architecture (856 production files / zero violations) and production build/TypeScript passed. Local and hosted migrations are applied, advisors reported no issues, and shadow migration replay produced no schema differences. Read-only hosted checks confirm public schedule metadata is readable and the private link table is denied to guests. Exact source snapshot verified (1,029 files), secret scan checked 1,842 files with zero violations, and diff checks passed.
- Usage and implementation boundaries are documented in `docs/LIVE_SESSIONS.md`; design additions are recorded in `DESIGN_SYSTEM.md`. Meeting providers retain responsibility for closing rooms or revoking copied links. Published implementation commit `c43608a` to main; Vercel reported a successful deployment. Production checks confirmed both management/student APIs return 401 to guests, the public schedule API returns uncached metadata without joining URLs, and both private pages redirect guests to login.

# Current checkpoint — Remove course redirect interception (2026-10-13)

- Found the remaining redirect layer in `next.config.ts`: `/courses/7days-freelance` was intercepted before its page. Live HTTP verification reproduced a 308 response pointing to the same URL. Removed that obsolete canonical-course rule; only legacy aliases redirect to course details.
- Added actual public-navigation browser acceptance across home, catalog, founder and bundles at 390/1440px. All public pages have no featured navigation; home/catalog/founder clicks land on normal course details. Direct featured advertising links remain usable. All 16 checks passed using isolated local data, with fixture cleanup and no hosted writes or payments.
- Added a regression guard preventing self-redirects, canonical course interception and featured destinations in public redirects. All 52 helper/security checks and architecture (826 production files / zero violations) passed. Lint and production build/TypeScript passed. Reproduction snapshot refreshed and verified (996 files), secret scan passed (1,806 files / zero violations), and diff checks passed; live availability depends on Vercel deployment.

# Current checkpoint — Promotional links stay separate (2026-10-13)

- Public course title/image links now always open `/courses/[slug]`, regardless of featured status. Founder workshop links also open normal course details. Bundle listing titles open `/bundles/[slug]`.
- `/featured/[slug]` (bundles add `?kind=bundle`) remains available as a direct advertising destination. Only the private admin editor links to it for campaign preview. Checkout/enrollment links and featured templates remain unchanged.
- Passed 51 security/helper checks, architecture (826 files / zero violations), lint and production build/TypeScript. Source snapshot verified (994 files), secret scan passed (1,804 files / zero violations), and diff checks passed. No hosted data or database schema change is required.

# Current checkpoint — Admin video previews and separate featured URLs (2026-10-13)

- Course introduction fields (create/edit) and lesson media dialogs compose one reusable video preview with the existing full-control player. Draft YouTube/direct sources preview immediately; Drive uses the protected admin stream and requires a saved course. Changing the source releases previous playback; playback starts on activation, resets off-screen and shows existing player errors. Labels remain supplied and centralized, with no new package/theme values.
- `/featured/[slug]` now owns published featured course/workshop marketing; `/featured/[slug]?kind=bundle` handles featured bundles without course/bundle slug ambiguity. `/courses/[slug]` always renders standard details for recorded/live courses; `/bundles/[slug]` retains bundle details. Payment routes and canonical pricing remain unchanged. Former `/workshops/[slug]` URLs redirect to course details. Catalog marketing links, founder workshop links and the admin View Featured Page action use the separate featured route.
- Reused the existing public template subject resolver and media authorization rather than duplicating them. Unpublished/unfeatured targets cannot render featured pages. Delivery and feature toggles remain independent, and template documents were not overwritten.
- Passed 58 course/template/admin-preview API/browser checks, 38 featured bundle/offer checks and 46 course-details/player/navigation checks (142). Coverage includes actual native playback metadata, Drive draft-proxy routing with local intercepted media, source replacement, unsafe URLs, 320–1920px details, single headers/footers, protected editing and canonical redirects. No real payment/provider media request or hosted data write was made. All 51 helper/security tests also passed (193 checks total). Lint, architecture (826 production files / zero violations), and production build/TypeScript passed. Exact source snapshot refreshed and verified (994 files); secret audit inspected 1,804 files with zero violations; diff checks passed; live availability depends on Vercel deployment.

# Current checkpoint — LMS workflow audit and fixes (2026-10-13)

- Researched official Teachable, Thinkific, Canvas and Moodle documentation, then traced student, admin, authoring, account, media and commerce workflows. Findings, source links, acceptance cases and remaining dependencies are in `docs/audits/LMS_WORKFLOW_AUDIT.md`.
- Unified saved section order across curriculum display, resume, next/previous navigation and completion. Editing a lesson preserves its section position. Learner outlines show actual sections, preview availability and protected destinations; live lessons return to workshop URLs.
- Replaced seed-only learning resources with narrow session/RLS-backed reads from normalized lesson relationships. Preview viewing no longer attempts enrollment/completion. Administrators see real completed/total lesson progress in private user subscriptions.
- Added authenticated `/dashboard/purchases` with owner-only receipt fields, combined search/status filters, five rows per page and shared admin/student table components. Terminal payment states have correct advice and stop automatic polling. A browser-reproduced moving receipt hit area is fixed with the shared stationary fade variant; default reveals remain unchanged.
- Read-only hosted inspection found six published sample courses containing 22 original placeholder lesson videos, and 12 empty recorded video links in the montage bootcamp. New live paid checkout rejects those products and bundles before creating orders/provider intents. Actual approved content must replace these links; existing access/previews remain available. The guard is not a full editorial approval system and cannot cancel previously issued invoices.
- Automated acceptance: 31 LMS API/browser checks, 7 live-content guard checks, 92 commerce/payment/race checks, 29 security API/SQL/browser checks, 8 curriculum checks and 49 security/helper tests (216 checks). Local tests use isolated fixtures and mock providers; live-mode acceptance explicitly blocks provider network calls. Corrected the security regression's retired per-course lock barrier to the current per-user commerce barrier, preserving concurrency assertions.
- Final lint, architecture (822 production files / zero violations) and production build/TypeScript passed. Exact reproduction snapshot refreshed and verified (988 files); secret audit inspected 1,800 files with zero violations; diff checks passed. No package, schema migration, hosted content write or real payment was made. Remaining priorities include material authoring, playback-position resume/cross-device notes, live scheduling, audited refunds, administration history and restore verification. Ready for main-branch push; live availability depends on the Vercel deployment of this checkpoint.

# Current checkpoint — Featured bundles and real sales (2026-10-13)

- Extended featured layouts to bundles via the same reusable editor, section components, document repository and media handler. Bundle creation/editing exposes the layout switch and the bundle table exposes its editor link. Defaults aggregate included curricula and route purchase actions to bundle checkout.
- Replaced demo viewer/rolling countdown urgency with the canonical active offer name and fixed database deadline. Expired/future/disabled offers do not display; undated offers have no timer; expiration hides the strip without a reload. Prototype viewer/signup UI is excluded from featured pages.
- Retained one template table with exclusive course/bundle foreign keys, per-target uniqueness, optimistic revisions and current-admin write policies. Public bundle visibility checks enabled/featured status and all member publication without exposing server-only commerce configuration.
- Verified 37 real-offer/bundle API/browser checks, 52 existing template checks, 92 commerce/payment/browser regressions and 40 security unit tests (221 total). Lint and architecture (813 files, zero violations) passed. Local/hosted migrations are applied; local/hosted advisors found no issues and shadow replay produced no schema diff. Final production build/TypeScript passed. Long campaign names are bounded beside the timer without overflowing the mobile layout. No production products/offers were seeded; payment testing used the isolated mock gateway.

# Current checkpoint — Featured layout for recorded and live courses (2026-10-13)

- Removed the delivery restriction from admin creation/editing, the template editor/API, public media gating and template RLS. Page layout is independent of course delivery.
- Recorded featured pages keep `/courses/[slug]`; live workshops keep `/workshops/[slug]`. Standard and featured pages each render one shared navbar and one footer. Curriculum and automatic duration remain unchanged by layout selection.
- Added recorded template API/RLS/browser regression checks, including disabling the featured layout and checking 390/1440px views. Validation: 52 featured-template API/RLS/browser checks, 44 course-details/enrollment/player regressions and 35 security unit tests passed. Lint and architecture (803 files, zero violations) passed. Local and hosted database advisors found no issues; shadow migration replay produced no schema diff. Production build/TypeScript passed. No credentials were added to tracked files.

# Work checkpoint — Khatab / Ta3llam

Last updated: **2026-10-13**. This file records the actual implementation and verification state. Update it after meaningful changes or check runs; never turn an unfinished gate into a completed checkbox without evidence.

## Latest checkpoint — customizable featured workshop templates

- Featured workshops now use the shared login-aware Ta3llam navbar, including responsive navigation and the current role's dashboard link. Ordinary workshops/courses retain their details page. Extracted the common server header adapter without changing its public navigation content.
- Added **تصميم الورشة المميزة** to live-workshop course editors at `/admin/dashboard/courses/[slug]/template`. Each workshop can edit all nine sections' text/rich highlights, media/poster links, image descriptions, actions, repeated records, instructor/FAQ/reviews, footer and countdown/signup content. Repeated items can be added/removed/moved; sections can be hidden/reordered, with the introduction required. Nested media/label groups collapse. Countdown and explicitly demo-labelled signup notifications have independent visibility toggles. Defaults can be restored locally with confirmation and saved afterward.
- Preserved shared theme tokens, stable section IDs, icon geometry and reveal behavior. The reusable template accepts injected header/composition options; its section contract lives in the shared design package. New presentation components, labels context, focused state hook, validators, ordering/media helpers and repository remain separated. No new dependency or arbitrary HTML/CSS editor was added.
- Per-workshop documents persist in RLS-protected `workshop_templates` with optimistic revisions. Published featured content is readable; draft content and all writes require current admin authorization. APIs enforce same-origin, bounded bodies, safe links, structure/depth/items/timing validation and stale-write rejection. Template requests alone allow 128 KiB; documents are capped at 96 KiB. Drive marketing media resolves stored clip identifiers, without arbitrary URL proxying or changes to private lesson access.
- Verification: **34 template API/browser checks**, **44 existing course-details/workshop checks**, **35 security unit checks**, isolated shared-component rendering, lint, architecture (**803 files / zero violations**) and production build including TypeScript passed. Browser checks cover real save/reload, section visibility/order, single shared navbar, guest/student/cross-origin denial, RLS and 320/390/768/1440px layouts. Fixed the reuse fixture to recognize Next image optimization; nested-route readiness is explicit in the new dev-server fixture. Invalid generated development types were preserved in a temporary backup and removed from the active build inputs before the successful clean build.
- Applied `20261012203714_featured_workshop_templates.sql` locally and hosted. Fresh shadow replay has no schema differences; local/hosted advisors report no issues. No live workshop template was overwritten or seeded. Documentation: `docs/WORKSHOP_TEMPLATES.md`; reduced-motion screenshots: `docs/evidence/workshop-template/`. Saved content is a snapshot: later course metadata edits do not overwrite it. Payment prices remain database-derived; administrators control marketing action destinations.

## Latest checkpoint — sales, offers, bundles and coupons

- Added admin Sales and commercial management tabs for bundles, offers and coupons. Lists combine search/status filters with five records per page; create/edit/delete dialogs reuse the approved controls and responsive table/card layout. Sales display persisted orders and discounts, student links, dates/statuses and explicit test/live labels. Editor choices fetch only identifiers/names, not complete course curricula.
- Added normalized bundle membership, scoped percentage/fixed offers and coupons, start/end dates, minimum subtotal, per-student/total capacity and optional offer stacking. Published bundles appear in the catalog and `/bundles/[slug]`; course cards show actual sale prices and strike through original prices. No promotions were activated or seeded in production.
- Checkout quotes and charges server prices in minor currency units, guards stale totals, serializes coupon reservations and overlapping user orders, and snapshots included courses/discounts. Verified settlement grants every purchased bundle course idempotently; changed contacts defer access until re-verification. Zero-total sales/coupons grant access atomically without a provider call. Referenced records are deletion-protected; revision checks reject stale admin edits. A zero sale retains the paid-product checkout path, including featured workshop CTAs.
- **Verification passed:** 92 commerce API/browser checks (Cairo-timezone date round-trip without hydration mismatch; 320/390/768/1440px, real CRUD/search, actual view reveals, coupon apply/remove, scopes/dates/limits, concurrency, provider price/replay, zero totals and full bundle enrollment); 56 existing payment regression checks; 44 course-details/workshop checks; 30 security/unit checks. Production build/TypeScript, lint and architecture (777 files, zero violations) passed. The YouTube regression fixture now waits for SDK readiness before emitting a mocked event.
- Applied `20261012190453_commerce_sales_bundles_coupons.sql` locally and to hosted Supabase without seeds. Fresh shadow replay produced no schema differences; local/hosted advisors found no issues. Hosted read-only pricing/bundle checks confirm the new RPCs and zero active campaign/bundle records. No real gateway transaction or charge was made. Existing payment audit data and historical payment screenshots remain intact.
- Contract/limitations: `docs/COMMERCE.md`; new screenshots in `docs/evidence/commerce/`. Bundles are not prorated for owned courses. Provider-backed coupon reservations remain reserved after local expiry until confirmed failed; refunds/manual release are outside this first stage. Updated the design-system contract and source reproduction snapshot. Frontend availability still depends on the deployment of this commit.

## Latest checkpoint — shared course details and featured workshops

- Built the user-requested course-details structure from the supplied HTML reference using the existing theme, shared player, controls and reveal system. Recorded courses and ordinary workshops have title/category, preview, paragraph-preserving description, optional outcomes, grouped chapter/section curriculum and enrollment/instructor panels. Desktop uses a sticky sidebar; mobile places enrollment after the preview and before detailed content. No package was added.
- Added the workshop-only **ورشة مميزة** setting to admin creation/editing, strict boolean decoding/validation and protected persistence. Only featured live workshops select the marketing template. The existing seven-day workshop remains featured with its approved copy and design. Other featured workshops use their own intro and curriculum rather than seven-day media/lesson names. Ordinary workshops retain their `/workshops/[slug]` URLs.
- Components, pure grouping/selection helpers, page data adapters and centralized copy remain separated. The same curriculum grouping helper now serves admin and public views. Shared MediaPlayer selects the existing native/YouTube backend; reusable choice controls separate accessible label and hint with stable IDs. Removed replaced/unused detail CSS. No private playback permission was changed.
- Verified **44 course-details API/browser checks**, **46 shared price/creation regression checks**, **24 security unit tests** and **six creation/curriculum helper tests**. Coverage includes six viewport widths, keyboard disclosures, preview/private links, checkout navigation without payment, enrolled state, native/YouTube deferred playback, poster/reset cleanup, missing media, workshop support/booking and the actual featured toggle. Lint, production build/TypeScript and architecture (724 files, zero violations) passed.
- Applied `20261012170000_featured_workshop_template.sql` locally and to hosted Supabase without seeding. Read-only hosted verification confirms the existing live workshop is published and featured; advisors found no issues. The migration preserves any explicit saved choice. Design documentation: `docs/COURSE_DETAILS.md`; screenshots: `docs/evidence/backend/course-details-390.png` and `course-details-1440.png`.

## Latest checkpoint — automatic recorded-course duration

- Recorded course totals derive from canonical lesson seconds through one reusable helper on public/catalog/learning/admin reads. Lesson creation, editing and removal update the next read; section references are not counted twice. Existing stale recorded totals are ignored without a migration. Display uses the existing minute-rounded Arabic formatter.
- Create/edit duration fields are read-only for recorded courses; recorded overview writes cannot override the lesson total. Live workshops retain their manually entered schedule and publication validation. Delivery selection on creation controls the field's editability. Copy remains centralized; no dependencies or design styles were added.
- Acceptance passed: 103 curriculum/API/browser checks, 46 price/shared-form checks, 96 course-management checks, 21 security unit tests and two creation contract tests. Browser tests wait for revision refresh and page-load completion before successive interactions. Lint, architecture (708 files / zero violations), production build including TypeScript, secret scan and diff checks passed. Updated course-management documentation and exact source reproduction snapshot (854 files).

## Latest checkpoint — real montage bootcamp content

- Created hosted draft `montage-income-bootcamp`: **معسكر المونتاج والربح منه🎬**, 599 EGP, supplied description and all 29 lesson names. Recorded the supplied 1,500 EGP previous price in the existing offer caption; no thumbnail/intro was invented. Removed unrelated WordPress navigation/admin/footer text from the supplied copy.
- Organized one chapter into four editable sections: capsules, main lectures, applications and freelancing. Matched all 17 playlist videos using their lecture numbers and durations, retaining the supplied curriculum order despite L17 appearing before L16 in YouTube. Two one-second duration differences use the actual source durations.
- Twelve lesson URLs remain empty because the playlist does not contain those videos. Course stays unpublished; no downloads/Drive uploads, enrollments or charges were made. Exact-copy, mapping and unique-section-assignment checks passed; anonymous API access returns 404. Import report: `docs/content/MONTAGE_INCOME_BOOTCAMP.md`.

## Latest checkpoint — YouTube course-video support

- Individual YouTube watch, short/share, mobile, Shorts, live-video and embed links normalize through the shared media helper and use the existing deferred YouTube backend with custom controls. Direct files and protected Drive routing remain supported. Playlist-only URLs are not individual lessons. No downloading, playlist import or rehosting was performed.
- Added a reusable cancellable YouTube metadata probe through the existing shared iframe SDK; it reads duration without playing, polls delayed metadata, times out, and destroys the temporary player/iframe/timers on completion or cancellation. The lesson hook selects YouTube or native metadata probing and retains the same validation and maximum duration. Updated centralized admin form hints; no new dependency or design style added.
- Verified 99 isolated curriculum/API/browser checks and 19 security unit tests. Browser acceptance covers YouTube automatic duration without playback and cleanup; URL tests cover supported forms, unsafe hosts/credentials/ports, playlist-only rejection and unchanged Drive/direct routing. Lint, production build and architecture passed (707 source files). YouTube videos must permit embedding; private/restricted/removed videos can fail, and source visibility remains controlled by YouTube.

## Latest checkpoint — opaque Fawaterak intent keys

- Confirmed `a6e4891` deployed successfully, then reproduced the remaining rejection with the real customer/order payload. Fawaterak returns an 18-character alphanumeric intent key, despite the documentation declaring UUID. Our validator, webhook validator, database column and settlement argument all assumed UUID; the previous URL-only fix was incomplete.
- Added a bounded opaque-key helper, reused by checkout and HMAC verification. Converted the provider column to text with a format constraint and replaced the service-only settlement signature while preserving its advisory/contact/order lock sequence, amount/currency/reference checks, and enrollment idempotency. Order IDs remain UUIDs. Applied the generated migration to hosted Supabase; both local and hosted advisors found no issues.
- Recovered the user's unfinished order using the corrected gateway code and stored the genuine checkout URL/intent on hosted Supabase. Its status is pending. No payment was charged, no enrollment was granted, and email/SMS remained disabled.
- Mock provider now emits non-UUID keys; 56 isolated payment checks, 29 security integration checks and 16 security unit tests passed, covering hosted redirect, signed opaque-key callbacks, replay/idempotency, activation, deadlock prevention, privileged RPC denial and legacy UUID compatibility. Lint, architecture and the production build passed. A live read-only lookup of the recovered intent passed our transaction validation and confirmed unpaid status, transaction ID zero and the correct amount.

## Latest checkpoint — Fawaterak short checkout links

- Traced the production 503 followed by 409: the hosted order had no saved provider link and remained in `creating`. Live OAuth succeeds; a single diagnostic unpaid link creation returned a valid `/ts/<id>` URL, which our `/transactions/`-only validation rejected. No payment or customer message was sent.
- Extracted checkout-link validation into a small reusable helper. Accepts `/ts/` and `/transactions/` links only on the configured provider origin; rejects malformed URLs, unrelated paths, credentials, foreign origins, and invalid intent UUIDs. Existing five-minute recovery and concurrency safeguards remain intact.
- Updated the mock gateway and browser test to reproduce the real short URL including Arabic language query. All 56 isolated payment checks, 15 security unit tests, lint, TypeScript, production build and architecture validation passed. Live paid settlement remains for the merchant to test; this verification did not charge money.

## Latest checkpoint — OWASP 2025 hardening

- Reviewed all ten current OWASP categories and recorded controls, evidence and remaining operational work in `docs/security/OWASP_REVIEW.md`. No exploitable SQL injection was found in reviewed parameterized/static SQL paths; adversarial literal-search and sort-input tests pass.
- Reproduced a PostgreSQL payment deadlock (`40P01`) with two coordinated connections. Fixed settlement's lock order to match checkout creation; preserved immutable payment validation and idempotent enrollment. Unpaid reconciliation now returns committed paid state when it loses a race.
- Added distributed atomic request budgets for documents, reads, auth, emails, uploads, mutations and payment callbacks; uploads also use a per-account budget. Counters are private, identities are HMAC-hashed, untrusted forwarded IP headers are ignored, expired cleanup is capped, and outages fail closed with 503. Denials supply 429/Retry-After.
- Added bounded body read deadlines, early oversized-request denial, strict JSON media types, configured-origin/Fetch Metadata checks, nonce CSP and security headers, secret-free security events, safe Drive redirect/header deadlines/ranges, Cloudinary redirect rejection, and a hydration guard for validated auth submission. Reused existing design and the shared hydration hook; no runtime dependency added.
- Applied `20261012132220_security_budgets_and_payment_locks.sql` to hosted Supabase without seeds. Hosted timeout/privilege checks pass: anonymous 3s, authenticated/service 8s; only the server can call the rate-budget RPC. Local and hosted advisors found no issues.
- **Verification:** 12 security unit tests, four upload unit tests, 29 isolated security/API/browser checks, 56 payment checks, all 190 backend regressions, 27 analytics checks, and 10 production-build browser checks passed (**328 total**). Lint, TypeScript, production build, architecture (703 files / no violations), secret scan and diff check passed. Source reproduction snapshot: 846 files. Local production app is serving port 3040.
- Runtime dependency audit has zero findings. Five high dev-tooling findings share an unfixed braces advisory; the exception and 19 October review date are documented. Installed Next/React versions and CI action commits are pinned; CI uses npm ci and gates security/runtime audit/quality checks.
- Vercel edge firewall/DDoS rules and operational alert/retention configuration still require hosting-account setup. App/database budgets mitigate resource abuse but cannot guarantee availability or cost protection under distributed volumetric attacks. Direct Supabase requests retain RLS/RPC/provider protections and are not wrapped by the Next.js limiter. No live flooding or real payment was performed.
- Application commit `34a63ed` deployed successfully to Vercel; GitHub Security and quality CI passed (run `38257401591`). All **11 low-volume live smoke checks passed**: nonce CSP matches HTML, production script bypass/eval is disallowed, security headers are live, homepage/founder/login render, private APIs deny guests, cross-origin mutations return 403, oversized signup returns 413 without account creation, and unsigned payment callbacks return 401. The docs-only `def4639` deployment was canceled; no application code differs from the verified release. Final evidence: `docs/security/VERIFICATION.json`.

## Latest checkpoint — Fawaterak hosted checkout

- Implemented OAuth API v3 using the locally supplied server credentials. Read-only live OAuth and enabled-method checks succeeded; available methods are Fawry, electronic wallets, Aman and Basata. No real payment was charged.
- Added responsive RTL checkout and owner-only payment-result pages, with purchase actions wired to recorded courses and the live workshop. Reused the existing theme/card/button styles; introduced no runtime package. Server adapters, payload/signature/transaction helpers, order repositories, UI components and polling state are separated into small files.
- Added durable price snapshots, active-order uniqueness and row locking, verified-contact gating, safe hosted redirects, bounded provider requests, private token caching, a persisted reconciliation cooldown, failed/expired retry states, and signed webhooks verified against an independent provider transaction lookup. Privileged settlement atomically records payment and grants one enrollment; replay is idempotent. Changed contact verification defers activation while retaining payment and prevents a second charge.
- Payment records survive user deletion; courses containing payment records must be unpublished rather than deleted. Weekly/monthly admin revenue now uses confirmed live payments, with test payments excluded and comparisons retained. Refund accounting/access revocation are outside this implementation.
- All six generated migrations were applied to hosted Supabase without seeds. Local and hosted database advisors found no issues. The 56 isolated payment/API/browser checks, 190 full backend regression checks and 27 analytics regression checks passed. Checkout fits 320px, 390px and 1440px with no overflow or browser runtime errors. Architecture passed for 692 source files. The production build and five read-only checks against the built local app passed. Application commit `6631f95` deployed successfully to Vercel. Five read-only production checks passed, including login/ownership guards and signed-webhook rejection.
- The live webhook handler confirms that the required Fawaterak server variables are configured in Vercel. A live paid transaction/webhook remains untested; no payment was charged. Setup and behavior: `docs/PAYMENTS.md`; screenshots: `docs/evidence/payments/checkout-390.png` and `checkout-1440.png`.

## Latest checkpoint — automatic lesson duration

- Replaced the manual/default lesson-seconds input with a read-only calculated field. A shared lesson-media component, focused hook, safe-source helper and cancellable native metadata probe read the actual duration after an administrator supplies a video URL. Direct videos and Google Drive file links are supported; Drive folders and inaccessible/unsupported files show a clear error.
- Added an administrator-only course media stream that reuses the existing Drive streaming implementation, range support and cancellation. The server accepts only Drive file IDs on a fixed upstream host, requires trusted administrator access and an existing course, and returns private/no-store responses. No Google API key, new dependency or database schema change is needed.
- Changing the URL clears stale duration immediately. Metadata loading is debounced, bounded by a timeout, and cancelled when changing the source or closing the dialog. Saving is blocked until a positive bounded integer duration is available. Existing stored durations remain unchanged when only editing unrelated lesson fields; replacing the link recalculates duration. Seconds round up to match the existing integer contract.
- The metadata URL contract, lint, TypeScript, architecture (659 files / no violations), secret/diff checks and production build passed. All 98 isolated curriculum API/browser checks passed, including actual media duration persistence, failed/stale lookup blocking, same-link validity, cancellation, Drive proxy routing and permissions. Six read-only checks passed against the built app at localhost:3040, with the real supplied Drive file automatically resolving to 42 seconds and the course unchanged. Application commit `f95e764` is deployed (Vercel success). Six read-only production checks passed: the real Drive video calculated as 42 seconds in the lesson modal, mobile layout fit, and existing course data stayed unchanged, with zero runtime errors. Evidence: `docs/evidence/backend/lesson-duration-live.json` and `lesson-duration-live-390.png`.

## Latest checkpoint — shared new-course and editor forms

- `/admin/dashboard/courses/new` now composes the same `CourseFormLayout`, details, price/free choice, textarea and media fields as the existing editor. Both retain the three-card responsive design and aligned desktop edges. Creation-only slug/delivery controls remain in the details card; the save card explains that creation saves a draft.
- Added duration, thumbnail URL and introductory video URL to validated creation/persistence. Old API creation payloads remain supported. Thumbnail uploads require the saved course; the creation media card explains this and accepts an image URL immediately. No image-upload authorization or database schema changes were made.
- Extracted creation command state/navigation into a focused hook and form/response decoding into small helpers. Shared fields and layout receive labels and defaults via props; theme values and styling remain unchanged.
- Five contract tests and 44 isolated API/browser checks passed, including integer/free behavior, creation media/duration persistence, six widths and aligned desktop cards. TypeScript, lint and architecture passed. The alignment test now waits for reveal transforms to finish before comparing geometry. All 96 course-management regression checks and the production build passed. Twenty-eight read-only checks passed against the built app at localhost:3040; desktop/mobile screenshots were inspected. Application commit `3c6d25d` deployed successfully. Twenty-eight read-only live checks passed, covering both forms, six viewport widths, aligned desktop edges, existing curriculum controls and unchanged real course data, with zero runtime errors. Evidence: `docs/evidence/backend/curriculum-live.json` and `course-create-live-390.png` / `course-create-live-1440.png`.

## Latest checkpoint — positive integer prices and explicit free option

- Replaced price number/spinner inputs in both create/edit forms with one reusable text-price component and focused state hook. Paid prices accept only positive whole digits, including Arabic/Persian digits normalized to Latin; empty paid values are required, and zero/negative/fractional/exponent/letter values are rejected. Existing amount limits remain enforced.
- Added the shared-design `مجاني` checkbox. Selecting it disables the price field and submits the existing canonical free amount (zero). Paid/free changes persist; choosing paid again restores the previous positive value or requires a new one. No existing course amounts or database schema were changed.
- Shared API validation now accepts only bounded integer amounts; zero still represents a free course. Three price contract tests and 34 isolated API/browser checks passed, including paid/free persistence, Arabic digits, invalid values, explicit free creation and 320/390/768/1440px layout. All 96 course-management regression checks passed, along with TypeScript, lint, architecture (649 files / no violations), production build and diff checks. Source reproduction snapshot refreshed. Application commit `a5703ee` is deployed (Vercel success). Nineteen read-only live checks passed, confirming text inputs in both forms, the explicit free option, responsive layout and unchanged real course data, with zero runtime errors. Evidence: `docs/evidence/backend/curriculum-live.json`.

## Latest checkpoint — responsive course editor and curriculum authoring

- Reorganized the overview into details/media/publication cards, using the settings layout: aligned desktop columns and a readable single column at 1024px and below. Added a reusable accessible textarea field and typed editor props; retained duration and existing thumbnail upload/video inputs.
- Added focused chapter/section/lesson creation, edit and deletion dialogs on the course content tab. Sections can move with their lessons; lessons select a chapter and optional section within the current course. A shared edit/delete control and shared dialog/save state replace repeated controls and the obsolete video-only editor.
- Kept chapter, section and lesson mutation in separate helpers; validation, form decoding, legacy ID normalization, metadata construction and persistence each have focused functions. Existing lesson identities, progress, resources and order survive edits/moves. Non-empty containers require content removal or reassignment before deletion. Published courses remain valid; destructive lesson deletion is confirmed and cleans dependent progress/resource links.
- Added guarded atomic curriculum persistence and revision conflict checks, including overview and legacy lesson-video writes. Stale edits return 409; database errors roll back all changes. Playback URLs remain outside public metadata. Local schema migration generated from reviewed changes: `20261011222701_curriculum_authoring.sql`; database advisors and schema lint passed.
- Passed 80 curriculum API/browser checks, 96 existing course-management checks, 190 full backend regression checks, eight contract/reuse unit cases, lint, TypeScript, diff/secret checks and architecture (646 files, no violations). Tested editor layout and dialog centering/focus at 320/390/768/1024/1440/1920px. Screenshots: `docs/evidence/backend/course-form-*` and `course-curriculum-*`.
- Release status: production build passed; hosted migration applied without seeds, and hosted advisors passed. A read-only hash comparison confirmed all eight hosted course records retain their content, prices, publication state and historical timestamps. Sixteen read-only checks passed against the built standalone app at localhost:3040. Application commit `1faf406` is deployed (Vercel success). Sixteen new read-only editor checks and fourteen existing management checks passed live, with zero runtime errors and the real course record unchanged. Live evidence: `docs/evidence/backend/curriculum-live.json`, `course-form-live-390.png`, `course-form-live-1440.png` and `admin-courses-live.json`. Documentation: `docs/ADMIN_COURSE_MANAGEMENT.md`.

## Latest checkpoint — live-course publishing duration

- Diagnosed the reported 400: `testing-course` was created as live with an empty duration, and the editor did not expose that required metadata field. Added `مدة الدورة` with shared limits/help and a specific missing-duration error. Legacy save requests that omit duration preserve its stored value; drafts may remain incomplete.
- Application commit `b5ab1a3` is deployed. Read-only verification on the real `testing-course` editor confirmed the duration field is visible, the removed description is absent and course data is unchanged.
- Verified live draft → missing-duration error → duration entry → successful publication and persistence in the isolated browser/API suite. Passed 96 focused checks, 190 full backend regression checks, four contract unit cases, lint, TypeScript/production build, architecture and diff checks. Refreshed the reproduction snapshot; local editor screenshot includes the new field.

## Latest checkpoint — course editor heading cleanup

- Removed the requested instructional description below the course editor title and its unused copy entry. Refreshed the design reproduction snapshot.
- Targeted lint, TypeScript, production build and diff checks passed.

## Latest checkpoint — course management table and separate content page

- Replaced course cards with the Users-style table/cards: name/status, creation/update dates, student/lesson/chapter/section counts and edit/delete actions. Added combined search, publication/category/delivery filters and creation/update/student sorting; five records per page with persistent filter pagination. Added top-right Create Course action and a validated draft form. Narrow-screen headings stack above the action; active editor tabs use the existing accent treatment.
- Kept course metadata/media editing on its overview and moved chapter/section/lesson details and video editing to the content tab. Optional sections group canonical lesson IDs; they are distinct from chapters. Curriculum creation/reordering remains a future authoring stage. Shared pagination now serves Users, Courses and phone requests; generic search-parameter conversion is shared.
- Added guarded admin RPCs, insert RLS, search/date indexes and actual new-course/update timestamps. Legacy historical dates remain unknown. Same-origin confirmed deletion is blocked for courses with subscriptions. Hosted migration applied without seeds, price or content changes.
- Verified three contract unit cases, 87 isolated management API/browser checks, 190 existing backend regression checks, responsive layouts/dialogs at 320–1920px, lint, architecture (618 files / no violations), production build/TypeScript and secret scan. Local and hosted database advisors and local schema lint passed. Application commit `56e38fb` is deployed. Fourteen read-only hosted checks passed at `https://ta3allam.vercel.app`, including guest denial, eight columns, database counts, search, responsive layouts, draft screen and separate content route; zero browser errors. Live evidence: `docs/evidence/backend/admin-courses-live.json`. Documentation: `docs/ADMIN_COURSE_MANAGEMENT.md`; focused screenshots: `docs/evidence/backend/admin-courses-390.png` and `admin-courses-1440.png`.

## Latest checkpoint — Cloudinary avatars and course thumbnails

- Added authenticated, same-origin `POST /api/media/images`, accepting bounded JPEG/PNG/WebP images only. Destination folders derive from the environment and verified user ID or admin-authorized course slug. Videos remain on Drive; reference assets remain local. Credentials are ignored locally and server-only; the user confirmed saving them in Vercel Production.
- Added reusable typed upload control to account Settings and course editing. Avatars immediately persist/refresh; thumbnails fill the URL and publish on course Save. Added hydration gating for native file-selection events, optimized delivery URLs, and preserved responsive settings card alignment.
- Cloudinary credentials and actual Media Library folders verified. Four unit cases and 36 isolated image integration checks passed, including real Cloudinary uploads, owner isolation, banned/guest denial, MIME/size/video rejection, URL persistence/reload and responsive layouts. Temporary test images were deleted. Existing full backend suite passed 190 checks. Production build/TypeScript, lint and architecture (591 files / zero violations) passed. Application commit `b6c0f98` is successfully deployed. Hosted temporary thumbnail upload passed with the production folder and editable URL, no published course change and zero runtime errors; the test image was deleted. Live evidence: `docs/evidence/image-uploads/live.json`.
- No new dependencies or database schema changes. Existing profile and course metadata columns are reused. Documentation: `docs/CLOUDINARY_IMAGES.md`; evidence: `docs/evidence/image-uploads/`.

## Latest checkpoint — measured loading bottlenecks and viewport deferral

- Baseline captured six public/five admin routes. Found duplicate initial client session checks hiding server-authorized dashboards (about 0.9–1.1s per check), repeated role/state queries, unoptimized images, eagerly imported playback/chart code, and US functions accessing a London database.
- Initial server-authorized dashboards now render immediately; client navigation and history/BFCache restores still verify sessions. Cached role/student-state reads are request-scoped, and student layout reads run concurrently. Verified claims refresh in Proxy; live server authorization remains in place.
- Configured London functions, enabled optimized local images/existing instructor WebP, split playback imports until play, and deferred chart plotting near view with reserved height. Extended the existing fade/reduced-motion engine to protected panels and public account screens.
- Passed 190 isolated backend checks and 11 performance checks, production build/TypeScript, lint and architecture. Local production analytics/settings checks passed. Details and measurement limits: `docs/PERFORMANCE_LOADING.md`.
- Application commit `48b33df` and checkpoint `5836f27` are successfully deployed. Hosted response confirms London execution. Live comparison records zero initial session checks across all five admin pages and roughly 72% less first-home image transfer. Observed admin load events changed from 1.2–1.7s to 0.29–0.38s in single diagnostic runs, not a guaranteed benchmark. Hosted responsive analytics/settings checks and seven additional viewport/media checks passed with zero runtime errors. Local 6/6 media tests passed. Full results and limits are recorded in `docs/PERFORMANCE_LOADING.md` and `docs/evidence/performance-2026-10-11/`.

## Latest checkpoint — aligned settings card heights

- Stretched the desktop identity/contact card across its two grid rows, aligning its top with the verification card and its bottom with the password card. Mobile remains stacked.
- Production build/TypeScript, targeted lint and diff checks passed. Local and live responsive acceptance passed, checking both top and bottom alignment at 1440px and 1920px plus small-screen overflow. Application commit `84a80ab` is deployed.

## Latest checkpoint — responsive settings and manual phone-confirmation queue

- Replaced the private phone placeholder with the fictional reserved example `+44-7700900123`. The account's own saved number remains visible to its owner.
- Scoped settings to a two-column desktop layout using the available content width; cards stack below 1024px. Contact current-password inputs are absent on initial load and appear only for a phone/email edit; password changes retain their required current password. Name-only changes save without it.
- Added admin navigation/page `/admin/dashboard/phone-confirmations`, automatically listing saved unverified numbers, five accounts per page. User links open their admin detail; admins confirm only after private inquiry. Extracted a shared confirmation button for queue and existing detail. The existing exact-value API, verification audit and enrollment restrictions stay in place. No schema changes or dependencies.
- New isolated suite passed **29 checks**, including guest/student denial, five-account pagination, stale-number rejection, confirmation persistence/removal, 320/390/768/1440 queue layouts and 1920px desktop settings. Existing account/security/email suite passed **86 checks**. Build, TypeScript, lint and architecture passed. Evidence: `docs/evidence/phone-confirmations/`.
- Local production checks passed on port 3040. Application commit `cae3a87` deployed; read-only real-admin live checks passed at `https://ta3allam.vercel.app`: generic placeholder, initially absent contact-password field, adjacent desktop columns, five-card pending queue, responsive settings/queue and zero runtime errors.

## Latest checkpoint — Admin Home hierarchy and source-caption cleanup

- Removed every technical data-source caption from Home cards and panels, including the Supabase Auth, subscriptions, learning and payment-source lines. Removed their unused props and content keys from the shared panel/product card contracts.
- Simplified KPI cards, widened the primary chart, enlarged the plotting area, and added a prominent selected monthly total with an equal-duration comparison. Metric selection updates both the chart and summary. Course tabs/ranking accents and quieter revenue cards retain the approved dark/red identity; calculation details live in the expandable explanation.
- Revenue remains unavailable; referral sources remain actual account attribution rather than visitor counts. No backend aggregation, permissions, payments, or dependency changes.
- Production build, TypeScript, lint and architecture checks passed. The isolated analytics suite passed 27 checks, including source-copy removal, selected totals, permissions and four responsive widths. Updated screenshots are in `docs/evidence/admin-analytics/`. Local production runtime refreshed on port 3040.
- Application commit `bf51743` is deployed. Live real-admin checks passed at `https://ta3allam.vercel.app`: technical source text absent, selected chart totals match the API, revenue unavailable, four viewport widths without overflow, period/user navigation working, and zero browser errors.

## Latest checkpoint — hosted email templates saved

- The user confirmed that all custom email templates were pasted and saved in hosted Supabase after the common-placeholder update.
- Sent a fresh production password-reset request for the existing administrator address through `/api/auth/forgot-password`; it returned HTTP 200 with `sent: true`. No password was changed and no recovery URL/token was stored or logged.
- Template source/placeholder/rendering checks are already passing. Recipient Inbox appearance for this newest message remains a manual check; sender Sent-mail lookup did not locate it, so delivered HTML replacement has not been independently verified.

## Latest checkpoint — email placeholder contract

- Audited and regenerated all nine Supabase email templates and the hosted payload using only the seven variables supplied by the user. Removed NewEmail/OldEmail/Phone/OldPhone details; notifications now use generic copy. Existing confirmation URLs, reauthentication tokens, site links and account email placeholders remain intact.
- Added shared `packages/design-system/email/variables.ts` and generated `supabase/templates/variables.json`. The generator rejects unknown and malformed placeholders; harmless whitespace variants are accepted. Product content and the shared renderer consume the same constants.
- Passed the placeholder contract tests, all 27 responsive email renders, targeted lint, TypeScript, architecture (562 files / zero violations), and production build. Updated manual installation guidance. Hosted templates still require the user to paste and save the regenerated HTML in Supabase; no hosted Auth settings were changed by this task.

## Latest checkpoint — admin Home analytics and themed auth emails

- Added Home at `/admin/dashboard`; moved user management to `/admin/dashboard/users`, preserving username detail routes. Added real Cairo-time signup/enrollment metrics, a Recharts daily chart with previous-month comparison and accessible table, week/month/all-time enrollment rankings, signup attribution, learning summary and explicit source labels. Revenue remains unavailable until actual payments exist.
- Analytics RPC checks live admin authority inside a private definer, exposes only aggregated records via an invoker wrapper, and has no anonymous execution grant. Local/hosted database advisors and SQL lint passed. Migration `20261011161615_admin_dashboard_analytics.sql` is applied to the dedicated hosted database.
- Passed 26 analytics, 47 user-search and 68 username/form-control checks with isolated fixtures, including revoked-admin/anonymous/student denial and four responsive widths. Production build, TypeScript, lint and architecture (561 files / no violations) passed. Screenshots: `docs/evidence/admin-analytics/`.
- Gmail SMTP authentication passed; the user saved hosted SMTP settings. The live password-reset request returned HTTP 200 and the user confirmed Inbox delivery. No password was changed. Credentials remain out of Git and public variables.
- Added nine Arabic auth/security email templates using a reusable shared renderer, canonical theme roles and centralized content. Build regeneration, local auth config, hosted payload, safe publish script and installation guide are included. All nine passed 27 responsive rendering checks and token/CTA checks. Screenshots: `docs/evidence/email-design/`. The user chose manual hosted installation. Supabase-ready HTML and matching subjects are documented in `docs/EMAIL_DESIGN.md`; custom hosted activation remains pending the user pasting/saving those templates. Gmail delivery is already confirmed, and a clearly labelled themed preview was sent to the same administrator Inbox.
- Release: application commit **fc87d90** was pushed and Vercel deployment succeeded. Read-only real-admin acceptance passed at `https://ta3allam.vercel.app`: authenticated Home, protected analytics API, responsive charts, month/all-time tabs and moved Users page; no browser runtime errors. An initial five-second login assertion timed out during the two-stage cold redirect; the production assertion now allows 30 seconds and passed. Final local build **0H0DL3c8iDzosbO7Pl1qy** is running on port 3040. Live evidence: `docs/evidence/admin-analytics/live-390.png` and `live-1440.png`.

## Latest checkpoint — Ta3allam navbar section order

- Reordered the marketing navbar to match the homepage: الدورات → كيف تتعلّم؟ → تعرّف على مؤسس تعلّم → الكوتشينج → الأسئلة الشائعة. Section destinations are unchanged.
- Existing mobile/desktop navigation tests now compare navbar fragment IDs against rendered page section order. Both browser tests passed along with production build, TypeScript, targeted lint, architecture and diff checks. Local build: **r_FaZRVeZeqNm8IJwnP0-**. Application commit **84b4ff5** deployed successfully. Both live mobile/desktop navigation tests passed, including navbar links matching rendered section order. Evidence: `docs/evidence/navbar-section-order/`.

## Latest checkpoint — instructor statistic display

- Changed the homepage instructor statistic beside “خطوة في كل مرة” from `01` to `1` in its centralized page content. Shared statistic rendering stays unchanged; the design reproduction snapshot is refreshed.
- Confirmed `config/personal-portfolio.json` remains the active founder content/metadata source, adapted by `config/personal-portfolio-model.ts` for current navigation and destinations.
- Production build, TypeScript, targeted lint and diff checks passed. Application commit **730b315** deployed successfully. Live homepage returned HTTP 200 and the exact “خطوة في كل مرة” statistic value was verified as `1`.

## Latest checkpoint — mobile account/dashboard access

- Reproduced the live bug: the account link was present in authenticated HTML but explicitly `display: none` at 320px, 390px and 768px. Removed that mobile hiding rule and kept the account link non-wrapping/non-shrinking with the shared 44px touch target beside the menu toggle.
- Added mobile visibility/in-viewport assertions for guest/student/admin actions to the existing navigation regression. No authorization or session logic changed.
- Build, TypeScript, lint and architecture (529 files / zero violations) passed. Real-account browser checks passed for admin/student/guest at 320/390/768/1440px: all 12 action links visible and clickable, correct destination, no navbar overflow; mobile account targets are 44px high. Local build: **KVgXVWyfzQMz-C57c1V5q**. Application commit **b981acd** deployed successfully. All 12 live admin/student/guest checks passed at `https://ta3allam.vercel.app`: dashboard/learning actions visible and clickable at all four widths, correct destinations, and zero navbar overflow. Evidence: `docs/evidence/mobile-dashboard-access/`.

## Latest checkpoint — shared interactive cursors

- Removed the universal cursor-default reset that blocked cursor inheritance on clickable children. Added shared `interactions.css` for links, buttons, semantic interactive roles, disclosure summaries and action/choice inputs. Nested logos, images, text and icons inherit the interactive target's cursor; disabled/pending controls retain their disabled cursor.
- Build, TypeScript, lint and architecture (529 files / zero violations) passed. Browser audit across home, founder, workshop, catalog, login and signup at 320px/1440px checked **1,175 interactive elements/descendants**, with zero cursor mismatches and disabled-control checks passing. Local build: **lYWONWQIXklno7_Df_Dig**. Application commit **8b9fa41** deployed successfully. Live browser audit passed at `https://ta3allam.vercel.app`: **1,190 interactive elements/descendants**, six pages at mobile/desktop widths, zero mismatches, with disabled-control checks passing. Evidence: `docs/evidence/interactive-cursors/`.

## Latest checkpoint — founder courses section and catalog text link

- Founder navbar “كورساتي” now scrolls to its own `#courses` section, immediately after “تعلّم”. Section highlighting includes the original courses section again; external destinations are excluded from the section observer.
- Added centered “شوف كل الدورات” → `/courses` below the original course cards. Shared ActionLink now supports an optional text variant: white text with an arrow, primary red and underline on hover/focus; no button background. Existing primary actions retain their styling. Labels/destinations remain in the page model and shared styles use canonical theme values.
- Production build, TypeScript, lint, architecture (528 files / zero violations), and all 12 navigation/portfolio browser tests passed. Tests verify 320px/1440px section/catalog clicks, local highlight, default white/hover red/underline/arrow, responsive assets, original text and media behavior. Local build: **s6lWJ8VCPSL2_QsMcpRGd**. Application commit **a551ff7** deployed successfully. Both live mobile/desktop tests passed at `https://ta3allam.vercel.app`, including section navigation, active tab, white/arrow default, red underlined hover and catalog navigation. Evidence: `docs/evidence/portfolio-course-navigation/`.

## Latest checkpoint — founder section before portfolio page

- “تعرّف على مؤسس تعلّم” in the public navbar now targets the homepage `/#instructor` section. Its existing reusable instructor component shows the primary “اعرف أكتر عن محمد خطاب” button linking to `/founder`.
- Existing founder and course navbar destinations remain as approved. No new component, stylesheet, dependency or visual tokens were needed.
- Build, TypeScript, lint and architecture (527 files / zero violations) passed. Both 320px/1440px navigation tests passed, including the section click and its portfolio button. Local production build: **mHXntNvW-EAFON6XbdLVP**. Application commit **91ba5ef** deployed successfully. Both live mobile/desktop tests passed at `https://ta3allam.vercel.app`, verifying the navbar reaches the same instructor section and its button opens `/founder`. Evidence: `docs/evidence/founder-section/`.

## Latest checkpoint — founder and course navigation destinations

- Public nav: “تعرّف على مؤسس تعلّم” links to `/founder`; “الدورات” links to the homepage `/#courses` section. The existing “كل الدورات” button retains `/courses`.
- Founder nav: workshop remains removed; “تعلّم” → `/` is immediately followed by “كورساتي” → `/courses`. Original portfolio content and its courses section remain intact. Catalog URL ownership is centralized.
- Added reusable fragment-aware NavigationLink plus post-commit fragment alignment to correct cross-layout scrolling when sections arrive through streaming. Corrected stale founder section highlighting by tracking all intersecting sections and restricting active styling to local fragment links.
- TypeScript, ESLint, architecture (**527 files / zero violations**), secret scan and production build passed. All **12 navigation/portfolio browser tests** passed, including 320px/1440px click destinations, cross-page scrolling, menus, section highlighting, reference copy, responsive assets and media behavior. Production build **rujJ02MVoHb7JHZ9uLZzU** is running at `http://localhost:3040`. Application commit **de0251c** deployed successfully to `https://ta3allam.vercel.app`. All **3 targeted live navigation tests** passed: direct homepage fragments, mobile/desktop cross-page destinations, founder tab order and section highlight reset. Evidence: `docs/evidence/navigation-destinations/`.

## Latest checkpoint — session-aware public navbars

- Removed the workshop link from shared navigation and marketing links, including the founder's navbar. Workshop/course pages remain available.
- Guests see “ابدأ التعلّم” and no dashboard action. Signed-in students see “لوحة التعلّم” → `/dashboard`; admins see “لوحة الإدارة” → `/admin/dashboard`. The guest action is hidden for both signed-in roles. A small server adapter validates identity/access/admin membership and passes presentation-only link data to the reusable header.
- Added home and email-auth routes to session-refresh matching. Existing mobile menu, colors, fonts and spacing are reused.
- TypeScript, ESLint, architecture (**525 files / zero violations**), production build, secret scan and reusable landing fixture passed. Navigation browser acceptance passed **35 checks**; the actual local production build passed **33 read-only checks** for guest/student/admin navigation and 320px layouts. Local build **b9_G2piyYaTK3ZmqkJt74** is running at `http://localhost:3040`. Application commit **8ec43b7** was pushed and deployed successfully. **33 read-only live checks** passed at `https://ta3allam.vercel.app` for guest/student/admin navigation, mobile layouts and absence of runtime/hydration errors. Evidence: `docs/evidence/navigation/`.

## Latest checkpoint — account dropdown, settings and contact verification (implemented; Gmail setup pending)

- Added reusable avatar/action menu with Profile, Settings, WhatsApp Support and Logout. Admin destinations remain inside `/admin/dashboard`; outside click/focus-leave, keyboard navigation and responsive placement are implemented.
- Added read-only profiles and settings with normalized first/last names, English usernames, strict international phone formatting and current-password-protected sensitive edits. Student email edits are rejected by both endpoints. Separate password change and email recovery/confirmation screens use Supabase Auth.
- Added normalized contacts, trusted phone-review audit and single-use recovery-session grants; owner-read-only RLS, indexes, Auth synchronization and a global new-enrollment database guard preserve existing course access during verification.
- TypeScript, full ESLint, architecture (**523 files / zero violations**), production build, secret scan and local SQL lint/advisors passed. Migration replay has zero schema drift. The account suite passed **86 checks**, the broader backend regression **190 checks**, and username/shared-control regression **68 checks**. Recovery and both email-change confirmation messages were tested in the isolated local inbox. Fixed an older email-based role trigger that revoked admin membership after an email change; roles now stay attached to account IDs.
- Hosted migration **20261011040427** and hosted advisors passed. The new production build **xs3a6mV7BksJO3xAcTbIm** is running at **http://localhost:3040**; **28 read-only production checks** passed for real admin/student settings, permissions, profiles, responsive layouts and anonymous protection. Application commit **bd98a11** was pushed and Vercel confirmed successful deployment. **28 read-only live checks** passed on **https://ta3allam.vercel.app** for real admin/student account menus, profiles, email permissions, responsive settings and anonymous protection, with no runtime errors. Hosted Auth also reports email authentication enabled and email confirmations required. Evidence: `docs/evidence/account/`.
- Email delivery uses Gmail SMTP through Supabase Auth; the Google App Password and actual Gmail delivery test are pending. Setup and contracts: `docs/ACCOUNT_SETTINGS.md`.

## Latest checkpoint — English usernames and username-based admin URLs

- English first/last names retain merged handles with six secure random digits. Other scripts and mixed-script names use curated English gerund-adjective defaults, generated through pinned `unique-names-generator` migration tooling. Display names remain unchanged.
- Shared API validation and the database constraint enforce ASCII handles. Migration converts existing non-English handles while preserving valid English choices; global uniqueness and concurrent rename protection remain in the database.
- User detail routes and all links use `/admin/dashboard/users/[username]`; authorized lookup resolves immutable IDs for moderation/subscriptions. Legacy UUID bookmarks redirect; unknown usernames return 404. No public profile pages were introduced.
- Production build, TypeScript, targeted ESLint, architecture (472 files / zero violations), local SQL lint/advisors and secret scan passed. Expanded backend/browser acceptance passed all **68 checks**, including mixed scripts, DB constraint rejection, migration preservation, canonical links and legacy redirects. Migration replay has zero schema drift. Hosted migration and advisors passed. Application commit **8203798** deployed successfully; **9 read-only local production checks and 9 live checks** passed for English handles, canonical links, legacy UUID/case redirects, unknown handles and anonymous protection. Local build: `FR7YCT78ThHRABpECq09L`.

## Latest checkpoint — streamlined administrator navigation

- Removed the administrator sidebar callout (title, description and explore-courses action), removed the same description below the users heading, and removed Explore Courses from the administrator header.
- Shared dashboard shell exposes `showSidebarHelp` and `showBrowseLink`, enabled by default for students and disabled only by the administrator layout. User/course navigation, profile access and logout remain available.
- TypeScript, targeted ESLint, architecture (471 files / zero violations) and production build passed. Read-only real-admin browser checks passed all **16 assertions locally and 16 live**, covering users, course list/editor and the mobile menu with zero JavaScript errors. Application commit **3f81148** deployed successfully to `https://ta3allam.vercel.app`. Final local build: `GU3sGtPnV5MI_cd9efZlo`.

## Latest checkpoint — usernames, indexed name search and shared form controls

- Default handles now merge first/last name words with six cryptographically random digits. Arabic and single names are supported. Private SQL helpers reserve candidates with transaction advisory locks and the existing unique constraint. Same-profile upserts lock before reading the handle, preserving user choices even during concurrent name/username edits. Only exact legacy `user-UUID` defaults are backfilled.
- Added editable owned usernames to `/dashboard/profile`, shared Unicode validation/normalization and clear HTTP 409 conflicts. Existing name/email-only API consumers preserve the username. RLS ownership and trusted administrator enforcement remain.
- Added `profiles_name_prefix_idx` (SP-GiST on `lower(name)`) and the “الاسم يبدأ بـ” search mode. The RPC applies the indexable prefix predicate before projection/pagination. It combines with all existing filters and retains five-record pages. Mode choices are centralized in `user-moderation.ts`.
- Added reusable design-system Select, Checkbox and Radio, integrated throughout filters, suspension controls and the course editor. Controlled/uncontrolled inputs, native FormData/validity/reset, disabled options, typeahead, keyboard navigation, focus, modal-safe top-layer menus, viewport placement and reduced motion are covered. All visual roles are centralized; no dependency was added. The profile form now reuses FormField instead of duplicated input markup.
- Isolated acceptance passed: **56 username/control checks**, **47 search/filter checks**, **100 moderation/security checks**, and **7 standalone control/reuse tests**. Tests include same-name concurrent signup, concurrent rename conflict, preserving chosen handles during upsert, Arabic prefix search, actual index eligibility, legacy backfill preservation, student profile editing, modal keyboard interactions and 320–1440px layouts. TypeScript, full lint, architecture (471 source files, zero violations), production build and secret scan passed. Local SQL lint/advisors: no issues; shadow schema: no differences. Migration `20261011022423_usernames_and_name_search.sql` is applied to the hosted database; hosted advisors report no issues; no seeds ran.
- Read-only real-admin production-build checks passed: **19 checks**, prefix mode plus checkbox combination, backfilled usernames, owned profile field, shared editor controls, modal menus at 320×568/390×844/844×390/1440×900 and zero JavaScript errors. No hosted accounts were renamed or moderated. Application source commit **d72cbd8** deployed successfully. Fresh live verification passed the same **19 read-only checks** at `https://ta3allam.vercel.app`, including prefix/filter combinations, generated default usernames, modal-safe dropdowns across all four viewports, shared course controls and the owned profile editor, with zero JavaScript errors. Final local build: `gaOWcUxWjmzt8W8j6dwiD`. Evidence and reusable API contracts: `docs/evidence/form-controls/`, `DESIGN_SYSTEM.md`, `docs/ADMIN_DASHBOARD.md`.

## Latest checkpoint — centered administrator dialogs

- Reproduced the offset in the previous production build. The global zero-margin reset overrides native dialog auto margins; at 1440px the management and confirmation dialogs were displaced 440px horizontally from the viewport center.
- Shared `.lms-admin-dialog` now sets `position: fixed`, `inset: 0`, and `margin: auto`, centering both management and confirmation dialogs. Existing viewport bounds, internal scrolling, backdrop, Escape handling and focus restoration remain.
- Read-only real-admin production-build verification passed for both dialogs at 1440×900, 1280×720, 768×1024, 390×844, 320×568 and 844×390: both center offsets are within one pixel, dialogs fit each viewport, cancel restores focus, and zero browser JavaScript errors. No production moderation actions were submitted. Added an exact center assertion to the existing responsive browser regression. Build/TypeScript, targeted ESLint and architecture (461 files, zero violations) passed. Final local build: `4WzLwRSo85fb7AKTu3V6j`.
- Application commit **79354cd** deployed successfully. Fresh live checks verified both dialogs centered within one pixel at all six screen sizes, fitting the viewport with working Escape/focus return and zero JavaScript errors. Evidence: `docs/evidence/admin-dashboard/modal-center-*`.

## Latest checkpoint — account search, filters and five-card pagination

- Added name/username/email search and combinable Suspended, Banned, Admin-only and last-seven-days Newcomers filters. Status selections match either selected status; role and join date intersect with search and status. Expired restrictions and older accounts are handled correctly.
- Database query filters the full account population before returning five records; phone pages never exceed five cards. Desktop uses the same five-record pages. Pagination preserves applied choices, submitting search/filters resets page one, Clear resets all, and refresh/Back restores form values from the URL. Exact result total is shown.
- New private Auth-query function requires active trusted admin membership internally; public wrapper is invoker-only and anonymous execution is revoked. The server uses the verified admin session rather than passing unrestricted Auth records through the browser. Inputs and response DTO are validated. RPC types were regenerated from the local schema.
- Search/filter acceptance: **47 checks passed** using eight isolated matching accounts, disjoint five/three pages, cross-page and case-insensitive search, combined filters, date/expiry rules, literal SQL/wildcard input, direct student RPC denial, malformed inputs and 320–1440px browser checks. Existing moderation/security suite: **95 checks passed**. TypeScript, lint, architecture (461 files, zero violations), SQL lint/advisors and production build passed. Shadow schema comparison: no differences. Hosted migration applied; advisors report no issues.
- Hosted migration tooling now seeds only when explicitly invoked with `--seed`; ordinary migrations cannot reapply resource seeds. No seeds ran in this release. The existing catalog and account data are preserved.
- Final local production browser checks passed with the real hosted administrator: search totals, empty intersections, combined admin/newcomer/status filters, URL persistence, filter-preserving pagination and five-record bounds at 320/390/768/1024/1440px; zero JavaScript errors. Final build: `hQTlcDWPehAQNnHmvcX95`. Application commit **f6e3a58** deployed successfully to `https://ta3allam.vercel.app/admin/dashboard`. Fresh live browser checks passed for real search totals, all filter combinations, empty results, reset/refresh, pagination preserving filters and five-record bounds at all five widths; zero JavaScript errors. Migration: `20261011020418_admin_user_search.sql`. Evidence: `docs/evidence/admin-dashboard/filters-*`.

## Latest checkpoint — responsive administrator account UI

- Researched Carbon data tables, NN/G record tasks and WCAG reflow before implementing a restrained admin layout using the approved dark/red/Arabic identity. Sources and component contracts are documented in `docs/ADMIN_DASHBOARD.md`.
- Desktop aligns avatar/name/role, bounded username, email, status and actions. At 1024px and below records stack; tablet username/email fields share a row. Long account identifiers remain unchanged and fully available in private details. Neutral hover replaces the full-row red wash.
- Fixed an unstyled `btn-secondary` reference by using the actual shared `lms-secondary-button`. Moved moderation into a reusable native management dialog with access, permission and deletion groups; View stays visible. Separate confirmation remains for suspension, ban, promotion and deletion. Protected admins have a concise label. Restoring access remains available before expiry.
- Added shared dialog and identity components plus focused moderation controls. Verified 44px control heights, viewport-fitting dialogs, background scroll locking, nested Escape cancellation, keyboard containment and focus restoration. Fixed the desktop column-width rule that squeezed mobile names.
- Focused isolated moderation suite: **91 checks passed**. Final responsive browser suite: **31 checks passed** at 320, 390, 768, 1024 and 1440px, including meaningful identity width, actual suspension/restore, admin entry and student isolation. TypeScript, ESLint, architecture (457 files, zero violations) and final production build passed. Reproduction snapshot refreshed (555 source files); credential scan: 1182 files, zero violations. No schema or dependency changes.
- Final local production browser verification passed: real hosted-admin login, Users/Courses navigation, account/details, layout and management-modal focus at all five widths, and logout protection; zero JavaScript errors. Final application commit **811226f** deployed successfully to `https://ta3allam.vercel.app/admin/dashboard`. The real administrator passed the same five-width live browser checks, shared pagination styling/navigation, Users/Courses navigation, private details and logout protection; zero JavaScript errors. Final local production artifact: `8wLfE45_yTAqi8IVt0RCB`. Pagination links use the actual shared secondary-button class. Evidence: `docs/evidence/admin-dashboard/redesign-*.log` and local account/management screenshots.

## Latest checkpoint — administrator entry route

- Reproduced the reported issue: `admin@ta3allam.com` has trusted administrator membership and its deployed users API returns 200, but the shared login destination `/dashboard` previously rendered student content. This was an entry-routing error, not a missing role.
- `/dashboard` now checks trusted administrator membership before rendering student content and redirects administrators to `/admin/dashboard`. The shared login, confirmation callback and public dashboard links all benefit from this single role-based decision. Students remain on `/dashboard`. The administrative link in optional student views is now correctly labelled “لوحة الإدارة”.
- Browser acceptance covers automatic administrator login, generic dashboard link routing, Users/Courses navigation and a subsequent student login that stays on its student dashboard. Full isolated backend: **162 checks passed**. TypeScript, lint, architecture (454 files, zero violations) and production build passed. All **18 auth/access regression tests** passed. Real hosted-admin browser verification against the new local production artifact confirms automatic admin entry, generic dashboard link routing, Users/Courses navigation and logout protection. Application commit **e094a4a** deployed successfully. Live browser verification with `admin@ta3allam.com` confirms automatic entry at `/admin/dashboard`, generic `/dashboard` redirection, Users/Courses navigation, private details and logout protection; zero JavaScript errors. Evidence: `docs/evidence/admin-dashboard/entry-*.log` and `entry-local-verification.json`.

## Latest checkpoint — administrator users dashboard

- Added `/admin/dashboard` with Users and Courses navigation. Users table includes actual names, generated unique usernames, emails, account status, detail links and moderation. `/admin/dashboard/users/[id]` is administrator-only and shows a profile photo/initial, identity details and actual database enrollments. No public user-profile pages were added.
- Suspensions support 1 day, 1 week, 30 days and 365 days; administrators see the expiry and remaining days/hours/minutes and can restore access early. Ban, deletion and confirmed-account promotion use real Supabase Auth/database operations with confirmation dialogs. Administrator accounts are protected from banning/deletion, including concurrent promotion/moderation.
- Added a server-only Auth administrator client, validated/uncached user APIs and immediate account restriction checks for existing sessions/JWTs. RLS retains ownership rules and adds current-account restriction checks; promotion atomically maintains trusted membership and allowlisting. Profile usernames/avatar fields and authorization helpers are migration-backed.
- Reused the existing dashboard shell, save-command hook, typography, theme and component patterns. User content is supplied through typed props. Existing course editor moved to `/admin/dashboard/courses`; older editor links redirect. Mobile table scrolls inside its positioned container; visual inspection exposed absolute-label overflow that the original root-only width check missed, and the stronger body/root/screenshot check now passes.
- Verification: full backend **159 checks passed**; focused moderation **69 passed**; final focused browser **5 passed**; final regression **47 passed**. Production and reuse builds, TypeScript/lint, architecture (**454 files, zero violations**), credential scan, fresh migration shadow comparison, SQL lint and local/hosted database advisors passed. An initial unrelated founder-anchor assertion failed under parallel load; its isolated rerun and the final 47-test run passed without application/test weakening. Production artifact `Gq3NTBq8iC-mN7j4pfupE` runs at localhost:3040; real hosted-admin browser login/table/detail/mobile/editor/logout checks passed with zero JavaScript errors.
- Hosted migration `20261011011243_admin_user_management.sql` applied successfully; hosted verification retains nine RLS tables and zero public playback leaks. Application commit **10c07c3** is deployed successfully on `https://ta3allam.vercel.app`; its server-only secret is confirmed working. Live administrator browser checks passed for table/detail/subscriptions/mobile/editor/logout with zero JavaScript errors. Live student login succeeded, user-management API returned 403, the administrator page redirected to the student dashboard, and anonymous user API returned 401. Details: `docs/ADMIN_DASHBOARD.md`; evidence: `docs/evidence/admin-dashboard/`.

## Latest checkpoint — Ta3allam root routes

- User moved Ta3allam to `/`, recorded courses to `/courses/[slug]`, workshops to `/workshops/[slug]`, and Mohammed's portfolio to `/founder`. The subsequent public user-profile request was explicitly cancelled; no `/users` pages, profile schema or migration were added.
- Moved route files into the root App Router and retained existing feature components, copy, styles and media. Public catalog/auth pages keep their shared route-group layout; landing, founder and workshop keep their own approved compositions. Private dashboard and lesson routes are `/dashboard/*` and `/learn/*`; account entry is `/login` and `/signup`.
- Central route builders now produce the new URLs; live course links select workshop routes. Workshop routing accepts only published live-course records. Old `/ta3allam/*`, `/ta3llam/*`, workshop detail and short links redirect without losing query parameters or anchors. `/portfolio` opens `/founder`.
- Session proxy matching and protected-session/data checks cover the new dashboard paths. The Auth callback endpoint remains `/api/auth/callback`, so the existing provider origin/callback configuration remains valid.
- Backend suite: **91 checks passed** after the route change. Production and isolated reuse builds passed. Final targeted browser checks: **47 passed**, covering canonical routes, query/anchor redirects, login/dashboard guards, founder copy/responsiveness/media and workshop copy. TypeScript, lint and architecture (421 files, zero violations) passed; credential scan found zero violations. Evidence: `docs/evidence/routing-update/`. The initial not-found status assertion was corrected to the documented Next.js streaming behavior while enforcing noindex and absent course/workshop content. Application commit **eb13e56** deployed successfully to `https://ta3allam.vercel.app`. Live checks verified all main pages, course detail, workshop canonical URL, legacy redirects, root auth callback, protected dashboard and student login/logout/history/admin denial. Zero browser JavaScript errors. Evidence: `docs/evidence/routing-update/live-deployment.json`.

## Deployment follow-up — 2026-10-11

- Confirmed code and verification commits are pushed, working tree was clean, and Vercel reports successful deployment of `40a89f8`.
- The latest Vercel status links to a project named `ta3allam`; `https://ta3allam.vercel.app` serves this application. The previously verified `mohammed-khattab.vercel.app` currently returns Vercel `DEPLOYMENT_NOT_FOUND` for every route, including `/`. This is a deployment/domain change, not a dashboard route failure.
- Fresh HTTP checks on `ta3allam.vercel.app`: anonymous dashboard, library, profile and admin pages return 307 to login; the requested student account logs in successfully, authenticated dashboard returns 200, admin editing API returns 403, and logout returns 200. Today's check does not claim a new browser-history test run; the browser evidence recorded below remains the prior verification.
- User confirmed **https://ta3allam.vercel.app** as the production origin and confirmed updating Vercel/Supabase URLs. Independently verified `/api/auth/callback` redirects to `https://ta3allam.vercel.app/ta3allam/login` and the workshop canonical URL uses the new origin. Local ignored `APP_ORIGIN` and README were aligned; historical deployment evidence retains its original hostname.

## Latest checkpoint — dashboard authentication boundary

- Reproduced eight failing access regressions: logged-out dashboard routes returned streamed HTTP 200 responses instead of blocking before rendering. Layout redirects were present, but student child pages used an anonymous empty-state fallback. Layouts also persist during client navigation.
- Added a pre-render dashboard guard in the session proxy using provider-verified identity, and an authenticated student-state reader used by every student data page. Resource pages check identity before rendering. Public course previews retain their intentional anonymous behavior; protected APIs and RLS remain authoritative.
- Login/logout now perform document navigation to discard client route caches. A shared protected-session hook verifies identity on pathname changes, browser page restoration and history navigation, withholding cached dashboard UI until verified. Added real-account regression checks for lost-session navigation, Back after logout, admin denial and absence of streamed dashboard content.
- Created and verified `student@ta3allam.com` with the supplied password through Supabase Auth; confirmed no admin membership. Passwords are not recorded in source or this checkpoint.
- Final checks passed: **91 backend checks**, **21 targeted production-browser tests**, plus four real hosted-student checks against the local production build. TypeScript, lint, architecture (421 files, zero violations) and production build passed. Eight access tests failed before the fix and pass afterward. Earlier Back-button test synchronization was corrected, and an independently reproduced memory-cache restoration gap was fixed with server-session revalidation. Application commit **529ace5** deployed successfully. Live checks confirmed six logged-out dashboard routes redirect before rendering, student login works, admin APIs deny students, lost-session navigation redirects, and Back after logout cannot restore access. Evidence: `docs/evidence/backend/dashboard-live-deployment.json`.

## Latest checkpoint — live workshop and course administration

- Added the seven-day live workshop to the database catalog with an initial editable price of **499 ج.م**, category business and supplied intro/poster. Canonical landing: `/ta3allam/7days-freelance`; legacy workshop and generic course-detail links permanently redirect there. The approved workshop layout and initial copy remain intact; edited course text/media appear on its landing.
- Added `/ta3allam/dashboard/admin/courses` and individual course editors for name, description, price, category, publication, thumbnail, intro and lesson video links. Course/lesson seeds preserve existing edits. Public Google Drive video streaming supports byte ranges and cancellation; protected lessons require playback authorization.
- Provisioned both requested verified admin accounts through Supabase Auth. Actual stored passwords were verified as bcrypt hashes without recording hashes or credentials. Private allowlist and membership tables, verified-email trigger and RLS prevent student role forgery. Runtime editing uses the authenticated session, not the operational secret key.
- Four migrations applied locally and hosted; nine public tables have RLS. Hosted/local database advisors reported no issues. Backend suite: **87 checks passed**. TypeScript, ESLint, architecture boundaries (418 files, zero violations), production and isolated reuse builds passed. Clean database reset and rerun: **87 checks passed**; targeted browser/domain/copy/routing checks: **29 passed**, zero failures. Both hosted admin credentials and memberships verified. Application commit **0ffbb05** pushed and Vercel deployment succeeded. Live workshop routes, both admin browser logins/editors/API access, anonymous denial and zero browser errors verified at `https://mohammed-khattab.vercel.app`. Evidence: `docs/evidence/backend/admin-live-deployment.json`. No claim that the full historical demo suite is green.

## Previous checkpoint — Supabase backend and production preparation

- Replaced demo-cookie authority with real Supabase Auth accounts, verified sessions, email confirmation, callback, refresh and logout. Kept the approved account-screen design. Profile email changes wait for provider confirmation; protected navigation redirects unauthenticated learners to login.
- Installed pinned Supabase SDK/SSR dependencies and adapted the shadcn Supabase client registry block to Next.js 16 `proxy.ts`. Browser/server/session helpers each have one owner. API adapters call focused feature handlers and repositories; obsolete demo persistence/sanitation helpers were removed.
- Applied two migrations and the generated seed to the dedicated Ta3llam hosted project `tatseklsvfdpuxuepbfo`. Catalog order is preserved. Seven RLS-protected tables hold profiles, courses, lessons, enrollment, progress, resources and resource links. Public metadata is sanitized to exclude playback URLs; paid access requires a trusted grant. Progress updates preserve concurrent changes, downloads require enrollment, certificates require completion, and revocation denies playback immediately.
- Local reset, hosted schema checks, local/hosted advisors, TypeScript, lint, architecture, production build and isolated fixture build passed. **55 local real-backend/browser checks and 26 targeted Playwright tests passed**. Evidence: `docs/evidence/backend/VERIFICATION.md`. Historical anonymous/demo LMS regression cases still need authenticated fixtures; the full historical suite is not claimed green.
- Port 3040 serves the unified production build connected to hosted Supabase. User confirmed production environment variables and Auth URLs for `https://mohammed-khattab.vercel.app`. Application commit `020a592` was pushed to `main` and Vercel deployed it successfully. Live browser checks verified portfolio/workshop/LMS/login/signup (all HTTP 200), six database courses, no public playback leaks, protected API HTTP 401 and zero browser errors. Evidence: `docs/evidence/backend/live-deployment.json`. No unrelated Supabase projects were modified. Payments, admin tools and private storage streaming are deferred.

## Previous checkpoint — validated demo account screens

- User explicitly selected **validated demo screens**, without real accounts or password authentication. Added `/ta3allam/login` and `/ta3allam/signup` with the approved dark surfaces, red accents, local Arabic font and responsive account layout. Both screens are live on port 3040.
- Shared `AuthPage`/`AuthForm`/field composition and reusable `FormField`/`PasswordField` replace duplicated login/signup layouts. Centralized Arabic copy/page models, field lists and validation limits. Focused pure helpers handle normalization, individual-field validation, complete payload validation and decoded responses; a hook owns form state, pending feedback and navigation.
- Both client forms and Next.js POST endpoints validate required fields, email syntax, name/password limits and matching signup confirmation. Accessible errors, first-error focus, autocomplete, visibility controls, disabled pending controls and Arabic retry messages are implemented. Demo profile persistence excludes passwords and retains existing learning progress. Successful entry opens the dashboard; the screens clearly disclose that no real account/password verification occurs.
- Lint, TypeScript, architecture (362 files, zero violations), production build and isolated reuse-fixture build passed. Ten new auth tests passed, including mobile/desktop layouts, identity normalization, API rejection, no password persistence, form errors, password toggles, links, success and failed-request recovery. Four screenshots saved under `docs/evidence/auth-screens/`. Reproduction snapshot refreshed and verified against 446 source files.
- Initial three-worker regression run: 157 passed and four existing motion/scroll assertions failed. All twenty checks in the affected test files passed unchanged in an isolated one-worker run. Final one-worker full run: **160 passed, one failure**, zero retries/skips, 4.7 minutes. The remaining existing LMS hover test failed to capture a live transform transition after `hover()` returned; it passed unchanged in the isolated run. All ten auth checks passed in every run. **The full regression gate is not clean**; do not represent the entire suite as accepted. Details and original logs: `docs/evidence/auth-screens/validation.json`. Build `mljwSIVkP_o04g4BuCaAq` is live. No packages, real authentication service, account database, commit, push or deployment added.

## Latest checkpoint — all twelve reuse audit findings repaired

- Resolved R01–R12 from the deep audit. Lessons now use the shared custom player; native/YouTube adapters honor the same selected control/end/play policy and share finite numeric bounds. Literal emphasis preserves all alternate About text. Canonical shared instructor/transformation/FAQ sections replace duplicate page implementations and redundant reveal wrappers.
- Creator destinations are owned by `config/creator-contacts.ts`, including explicitly named approved portfolio variants. The portfolio model binds provenance copy to live identity and validates action presentation. Action icon/variant/external settings survive reordering; hero/header/footer targets are configurable and menu/FAQ control IDs remain independent between instances.
- Learning commands and hooks own enrollment/completion orchestration and exclude duplicate clicks across the entire sequence. Client transport requires success decoders and is separated from server request parsing/origin policy. Demo learning responses allow an empty email explicitly; profile submission remains strict.
- Removed remaining data forwarders/duplicate exports, strengthened canonical-owner forwarding checks, consumed the numbering helper, removed obsolete CSS at its generator and output, pruned unused captured literals and archived superseded reference tools. Published/dynamic theme roles and deliberate layout/contact variants remain documented contracts.
- Main production and isolated reuse-fixture builds passed. Fresh full regression suite: **151 passed**, zero failures/retries/skips, three workers, 2.3 minutes. New cases cover provider/end/viewport parity, native numeric setters, text round trips, section variants/IDs, action reordering, whole-workflow failures/pending/retry, decoded success payloads, guard mutations and isolated CSS regeneration. Existing copy/design/responsive/motion/API checks pass.
- Build `2TfiZPXdOfpOfFWe9nmAt` is served at `http://localhost:3040`. Reproduction snapshot refreshed: 425 source files. Architecture gate: 342 files, zero violations. Final lint/typecheck/check verification is recorded in `docs/evidence/reuse-repairs/validation.json`. Resolution table: `docs/architecture/DEEP_REUSE_AUDIT.md`.
- Initial focused failures were test-harness/locator/viewport issues; corrected the React source loader and asserted actual lifecycle conditions. Distinct portfolio model filename also prevents Node JSON/TS ambiguity. No new package, commit, push or deployment. Approved marketing UI/copy/theme/routes retained; learner playback intentionally upgraded to the canonical player.

## Latest checkpoint — deep semantic reuse audit (findings open)

- Completed another source/ownership/contract review without modifying application code, design, routes, media or dependencies. Pre-report inventory: 952 files; 344 production source/config/style files and 18,690 lines. Production ledger and complete classified inventory are in `docs/evidence/deep-reuse-audit/`; binary/history/generated artifacts are explicitly distinguished from handwritten implementation review.
- Found 12 remaining issues/reuse gaps: legacy lesson iframe bypasses the shared player; YouTube loses advertised control/end policy; instructor/transformation/FAQ sections have two owners; contact/social facts have multiple owners; About emphasis can corrupt alternate text; portfolio actions/hero IDs have positional/literal coupling; enrollment/progress orchestration remains embedded in buttons; native numeric validation differs from YouTube; forwarding/export layers escape the guard; a numbering helper is tested but not consumed by renderers; obsolete CSS/token candidates remain; a reference tool points to removed inputs.
- Fresh deterministic probes reproduce About text loss and missing YouTube forwarded props. Earlier browser observations confirm a lesson iframe remains mounted after scroll and native NaN seek/volume throws; these observations are not labelled as a fresh 2026-10-10 browser run. Probe methods and limitations are recorded in the report.
- Fresh architecture gate passed (335 files, zero rule violations), lint and TypeScript passed, and the reproduction snapshot verified 412 source files. Exact executable copy scan found no identical groups, and route-level import reachability found no unreachable TS/TSX files; neither excludes semantic duplication or unused barrel exports. Previous 138-test complete browser success remains historical evidence, not acceptance of the new cases. No build or full browser suite rerun was needed for this documentation-only audit.
- Findings remain OPEN with proposed repairs and strict acceptance cases in `docs/architecture/DEEP_REUSE_AUDIT.md`. Audit completion does not mean the architecture is certified fully reusable. No commit, push or deployment performed.

## Latest checkpoint — canonical shared ownership and configurable contracts

- Removed 52 forwarding-only component, hook, library and type files from `app/` and `modules/`; all consumers now import canonical `@khatab/design/*` exports. Removed five shared font/workshop/player stylesheet adapters; `app/globals.css` imports their authoritative styles directly. Theme entry points and explicit product variants remain intentional. Removed the unused workshop player-label alias and YouTube facade; media helpers now depend directly on their helper/config owners.
- Shared menu dismissal now handles Escape, outside pointer events, desktop breakpoints and focus restoration for workshop, portfolio and LMS. It accepts required ownership/state/action inputs plus optional focus/breakpoint policy. Shared mobile-menu state remains reusable. One reveal hook and theme-options helper replace the separate page lifecycle implementations.
- Consolidated identical FAQ items and near-identical accordion implementations into shared UI. Required FAQ items and optional reveal/class settings preserve both references. A source-content comparison across app/modules/shared/config found zero identical production TS/TSX/CSS file groups after consolidation; that is an exact-copy check, not a claim that every similar pattern should be merged.
- Split dashboard statistics and lesson-outline projections into separate pure domain helper files. Lesson URLs are supplied by the composition model through a required URL-builder contract. Native subscription has named required inputs and optional playback scope; YouTube mount has named ownership inputs and optional SDK-loader/timeout overrides. Scalar helpers keep simple positional arguments.
- Architecture mutations now reject shared forwarding-only modules (including comment-prefixed copies) and redundant shared stylesheet adapters. Compile-only negative cases protect required owner/action/publication/URL inputs. Browser helper cases cover inside/outside dismissal, optional focus policy, listener disposal and scoped/default sibling playback. Details and parameter contracts: `docs/architecture/FUNCTION_BOUNDARIES.md`.
- Root lint, TypeScript, production build and reuse-fixture build passed. Architecture gate: 335 source/style files, zero violations. Full fresh-artifact browser suite: **138 passed**, zero failures/retries/skips, using three workers. Three final architecture tests also passed after switching the scanner to the canonical type directory (no dependence on empty legacy folders). An earlier run overlapped lint/build and missed intermediate animation windows; an isolated check confirmed the 500 ms transitions and the fresh complete run passed unchanged motion assertions. Validation: `docs/evidence/shared-consolidation/validation.json`.
- Live production build: `blmGjDpltv87wO56bTZWc` on `http://localhost:3040`. Reproduction snapshot refreshed and verified against 412 source files. Approved colors, fonts, spacing, animations, visible copy, media, routes and API behavior remain intact; no packages were added.

## Latest checkpoint — focused helpers and small function boundaries

- Extracted shared native/YouTube playback operations into `packages/design-system/helpers/media/`, reveal ownership/registration/animation/observation/cleanup into `helpers/motion/`, frame scheduling into `helpers/browser/` and token parsing into `helpers/theme/`. Hooks retain React state and lifecycle coordination; browser reads happen in handlers/effects, not at import time.
- Workshop roadmap/corridor calculations are in `app/helpers/`. Portfolio header, section observation and timeline operations are in `modules/helpers/portfolio/`. Catalog calculations, duration formatting and validation are in feature `helpers/`; learning progress/enrollment/completion/ID sanitation are focused helper files. Pure domain indexes expose those operations without importing server services.
- Split landing section models, profile submission, portfolio navigation hooks, dashboard header/sidebar, course artwork variants, hero preview and lesson context/content models. The root lesson route now composes focused models/views. Shared player policy is in design-system `config/`; time/action/keyboard/appearance calculations are helpers. No dependency, CSS, theme, visible-copy, media or route changes were introduced.
- Enforced executable-code budgets in the AST architecture gate: helper files <=80 lines, hook files <=60, component/UI/page files <=100; non-rendering bodies <=35, hook coordination <=45. Data/type/CSS records remain centralized and are excluded from these executable budgets. JSX is governed by file size; limits support responsibility review rather than proving semantic purity. Details: `docs/architecture/FUNCTION_BOUNDARIES.md`.
- Added negative mutation cases for oversized functions/files and helper content/server leakage. Added native snapshot edge cases and an isolated YouTube SDK test covering deferred loading, keyboard/seek/mute, instance destruction, shared loader reuse and failure/retry. Reveal lifecycle tests now bundle the real helper graph, preserving coverage of ownership and ten clean lifecycles without copying implementation.
- Verification: root lint, TypeScript, production and isolated-fixture builds passed; architecture gate inspected 394 files with zero violations; focused checks passed (16); final complete suite passed (135 tests, zero retries/skips, 2.0 minutes). An initial full run had 134 passes and one genuine extraction regression: artwork validation occurred only in the child. Restored immediate parent-boundary validation through `validateArtworkKind`; kept the existing defensive test intact. New SDK test initially matched Next's route announcer along with the error alert; scoped that assertion to the player region.
- Current production build: `cKL2Ivcb1KssxvtqR5JlZ`, serving all pages/APIs at http://localhost:3040. Reproduction snapshot refreshed and verified (469 files). Evidence summary: `docs/evidence/function-boundaries/validation.json`. No commit, push or deployment performed.

## Latest checkpoint — single-project workspace consolidation

- One production Next.js project remains at the repository root, with one dependency installation, lockfile, Next configuration, App Router, ESLint/TypeScript setup and build. Main local URL: http://localhost:3040. Redundant compatibility servers on 3022/3042 were stopped.
- Removed the superseded LMS installation (~466 MB), build cache (~732 MB), manifest/lockfile/configuration, public compatibility symlink, generated reports and duplicate ignore file. Removed the unused asset-sync compatibility script, session command scratch file and empty tooling directories.
- Portfolio/LMS source is now `modules/`, imported via `@platform/*`. Workshop remains under `app/`; shared portable primitives, player, motion and canonical theme remain in the internal `packages/design-system/` library. No page text, design tokens, production media or public URLs were changed.
- Consolidated all tests under `tests/`, with learner/portfolio cases in `tests/platform/`. One root Playwright config owns site/platform suites; cross-browser and development configurations are root-level specialized checks. The alternate-content fixture is test infrastructure, not a deployed website, and uses root dependencies/assets through managed links. Its media no longer depends on the retired port 3022.
- Historical audits/research and former LMS documentation moved into `docs/architecture/` and `docs/history/`; unique evidence is preserved under `docs/evidence/learning-history/`. One byte-identical duplicate capture was removed. Root README and design guide document current ownership and commands.
- Architecture alias resolution now follows the actual root/module aliases. Mutation cases use the module alias and still detect invalid dependencies. The stale primary-button test now verifies the explicitly requested instructor portfolio action separately from WhatsApp enrollment links.
- Verification passed: root lint, TypeScript, production build, reuse-fixture build, dependency resolution, architecture guard (297 files / zero violations), targeted checks (24 passed) and final complete consolidated suite (131 passed / zero retries / zero skips, 2.3 minutes). Source snapshot: 366 files, refreshed and verified.
- First complete run: 129 passed / 2 failed. One stale button expectation was corrected; the 320px initial portfolio anchor assertion passed unchanged in targeted and final complete reruns. No production navigation change was made; this intermittent observation is retained here rather than concealed.
- Current production build: `wXUjVsTBxtwFC30wLoHnx`, staged once under `/tmp/khatab-acceptance-artifacts/platform` and serving all pages/APIs on 3040. Summary: `docs/evidence/workspace-consolidation/validation.json`. No commit, push or deployment performed.

## Latest checkpoint — shared Zack River designer credit

- Replaced the old designer attribution in the portfolio and workshop, and added the same attribution to Ta3allam/public LMS footers. All use “Designed By Zack River” linking to `https://zackriver.com` in the current tab.
- `config/designer.ts` owns the label and destination; shared `DesignerCredit` receives a typed link record through props. Hover and keyboard focus use the canonical primary red and shared control transition. Alternate models can supply their own credits; no designer identity is embedded in renderers.
- Root lint, TypeScript, production and reuse-fixture builds passed. Architecture guard: 297 files, zero violations. Three workshop reference checks and 15 portfolio/reuse checks passed, preserving all copy except the explicitly requested attribution replacement.
- Browser verification covered portfolio, workshop, Ta3allam, catalog and login footers: one attribution each, correct destination, red hover/focus. Normal-motion hover and leave passed after the footer entrance settled; initial immediate-hover sampling was displaced by the existing entrance transform. Mobile footer has no horizontal overflow and clicking navigates to the configured external URL (destination interception used for the check). Screenshot: `docs/evidence/designer-credit/mobile-footer.png`.
- Current platform build: `QivjmdCiwbppzex53uNlN`, served on 3040 and compatibility ports 3022/3042. Reproduction snapshot refreshed.

## Latest checkpoint — workshop instructor portfolio action

- Added “شاهد ملفي وأعمالي” beneath the instructor statistics at `/7days-freelance#instructor`. It uses the shared primary `ActionLink` and points to `projectRoutes.portfolio` (`/`).
- Instructor content accepts an optional configurable action; both instructor renderers support it. Only the workshop model supplies this action. Spacing uses `--space-xl` in shared CSS; source wording is preserved.
- Root lint, TypeScript, production build and architecture guard passed (294 files, zero violations). Three reference-copy/behavior checks passed. Browser verification confirmed visible links and successful portfolio navigation at 390px and 1440px; screenshots are in `docs/evidence/instructor-portfolio/`.
- Current local platform build: `dt2pLgCF1_6w-6LnG0cnu`, served on 3040 and compatibility ports 3022/3042.

## Latest checkpoint — Ta3allam route namespace

- Kept one Next.js application. Portfolio stays `/`; workshop stays `/7days-freelance`; the LMS landing is now `/ta3allam` using the requested URL spelling.
- Moved the catalog, course details, login, dashboard and lesson routes beneath `app/ta3allam/`. Canonical examples: `/ta3allam/courses`, `/ta3allam/courses/[slug]`, `/ta3allam/dashboard`, `/ta3allam/login`, `/ta3allam/learn/[slug]/[lessonId]`.
- All production page destinations derive from `projectRoutes.learning` through `lms/config/navigation.ts`. Header/footer links, course actions, breadcrumbs, learner navigation and landing section links resolve within that namespace. Shared root `/api/*` handlers and existing cookie/note storage remain available.
- Added 307 compatibility redirects for `/ta3llam/*` and root `/courses/*`, `/dashboard/*`, `/learn/*`, `/login/*`. Browser checks verify nested paths and query filters survive redirects. Portfolio/workshop compatibility redirects remain.
- Root lint, TypeScript and production build passed. Architecture guard: 294 files, zero violations; its literal-route/duplicate-builder checks now cover scoped route paths. All 38 targeted checks passed: eight unified-routing/architecture checks and 30 domain/LMS/media checks, including enrollment/progress persistence, profile, API contracts, course filtering, learner pages, responsive behavior and players.
- Latest build: `Vn8cpWL5dPrRrgsoYLEdF`, running from the single staged platform artifact on main port 3040 and compatibility ports 3022/3042. README, design contract and reproduction snapshot updated. Earlier checkpoints below describe superseded route locations.

## Latest checkpoint — one Next.js application, three main pages

- Consolidated routing, layouts, boundaries and demo APIs under root `app/`. Portfolio is `/`; Ta3llam is `/ta3llam`; the seven-day workshop is `/7days-freelance`. `/portfolio` and `/workshop` redirect to their canonical URLs. Existing catalog, learning, dashboard and API URLs remain available.
- Removed the separate LMS router and Next.js configuration. Feature modules remain under `lms/` using `@lms/*`; workshop components remain under `app/components/workshop`. Root npm commands own the single build; legacy LMS commands delegate to them.
- Centralized main-page destinations/labels in `config/project-navigation.ts`. Portfolio header links to Ta3llam/workshop; reusable data-driven footer navigation connects all three. Portfolio’s available workshop card now links internally without opening a separate tab. LMS section anchors point to `/ta3llam#...`.
- One asset tree: root `public/`; `lms/public` is a compatibility symlink. One root layout, stylesheet assembly, font preload configuration and standalone build. All pages retain their theme, layouts, source text, shared players and existing interactions.
- Verification: root lint/TypeScript/production build passed; architecture guard inspected 294 files with zero violations. The 35-test root integration/workshop/architecture batch passed. The 63-test LMS batch initially passed 62; the remaining reuse fixture inherited the newly introduced project links. Its alternate models now explicitly supply custom labels/destinations, and all five reuse tests passed after rebuilding the fixture. No assertions were removed to hide that failure.
- Final-build checks: 10 route/build/asset/scroll checks passed; four motion checks passed after replacing wall-clock quarter-duration sampling with the browser’s actual transition timeline. Production animation settings were preserved. The previously timed hover tests sampled too late under browser/test load; their exact 500ms/interpolation/reversal expectations remain enforced.
- Verified desktop/mobile images at 1440/390px: `docs/evidence/unified-project/`. Images were decoded before final mobile captures. Root portfolio and existing workshop/LMS layouts were visually inspected. Same-origin navigation, redirects, source-copy preservation, cookies/enrollment/progress, profile updates, resource/certificate APIs, responsive layouts, video/fullscreen/reset and media byte ranges are covered by the passing checks.
- Current single build: `tKgrzHvlT-jJVKI2Okrxj`, staged at `/tmp/khatab-acceptance-artifacts/platform`. Port 3040 is the main preview; compatibility ports 3022 and 3042 now serve the exact same application/build. Earlier checkpoints below describe superseded separate-app builds.

## Latest checkpoint — researched coming-soon poster redesign

- Reviewed online coming-soon poster references, including high-contrast typography and red/black geometric teaser artwork. Replaced the previous thin-frame treatment with a white Arabic headline, oversized outlined background type and diagonal red announcement strip.
- Updated the existing reusable `ComingSoon` Server Component. Label/detail, color, dimensions and aspect ratio remain configurable. Typography scales with the component container; all visual values remain in shared theme tokens. Decorative repetitions are hidden from screen readers. No packages were added.
- Root and LMS lint, production builds and TypeScript passed. Architecture guard: 291 files, zero violations. All 10 portfolio browser tests passed, including responsive layouts at 320/390/768/1440px, source-copy preservation and shared artwork. Desktop/mobile captures were visually inspected: `docs/evidence/coming-soon/poster-1440.png` and `poster-390.png`.
- Latest local builds: workshop `ieTCZg9JI5ybam783QgMc` at 3022; Ta3llam/portfolio `z8pRmtl_nuJELyBXNzxCx` at 3040 and 3042. Earlier checkpoints below describe superseded artwork/builds.

## Latest checkpoint — uncaptioned reels and reusable coming-soon artwork

- Removed visible reel titles and view counts from the shared workshop/Ta3llam card and the portfolio grid. Accessible player labels and source metadata remain available.
- Replaced the upcoming portfolio course thumbnail and corner badge with the shared `ComingSoon` component. Label, optional detail, dimensions, aspect ratio, class and accent color are configurable; presentation uses canonical theme tokens. Available workshop imagery and course text are preserved.
- Root and LMS lint, production builds and TypeScript passed. Architecture guard: 291 files, zero violations. All 24 targeted browser tests passed (16 portfolio/marketing and 8 workshop player), covering caption removal, upcoming artwork, responsive layout, reference copy and playback/reset/fullscreen behavior.
- Visually inspected desktop and mobile artwork; captures: `docs/evidence/coming-soon/courses-1440.png` and `upcoming-390.png`. Mobile preview measures 356 × 200px with the approved #fc3522 accent.
- Updated all local runtime builds: workshop `u-OhhPHJZdLZyTmUMJgZh` at port 3022; Ta3llam/portfolio `QtNCXv2TUTcyrkTBH8eXS` at ports 3040 and 3042.

## Current status

**Unified app:** portfolio `/`, Ta3llam `/ta3llam` and workshop `/7days-freelance` share root routing, APIs and assets. Original portfolio text and section composition have been restored; see the checkpoints below. The reference is now recreated as a Next.js route at `http://localhost:3040/portfolio` (also port 3042), with seven reusable sections, centralized reference copy, local imagery, real source videos and shared theme/player/motion. Final checks are recorded below.

**Latest media update:** four curated portfolio reels and the workshop hero play original MP4 files. The reel duration badges are removed; workshop and Ta3llam videos play inline with a fullscreen button on hover. See [the latest checkpoint](#latest-checkpoint--shared-media-on-ta3llam).

**The architecture refactor is implemented. Final acceptance is not unconditionally signed off.** Most verification has passed; complete historical performance comparisons for every route are unavailable. The latest complete suites passed after correcting a test assumption about the approved portrait variants (PNG for the workshop, WebP for the LMS). See the verification table for the last recorded results.

The approved design identity is retained: `#fc3522`, `#101317`, local IBM Plex Sans Arabic, Arabic RTL, red highlights and the existing course-card hierarchy. No new third-party animation, player or UI runtime library was installed. Existing user changes were preserved; no commit, push or deployment was performed.

## What has been implemented

### 1. Shared foundation and theme centralization

- Created the private local `@khatab/design` package at `packages/design-system/`; both applications consume the same maintained source.
- Moved shared UI primitives, marketing types, accordion/video hooks, reveal engine, font declarations and workshop styles into that package.
- Replaced paired app implementations with imports/re-exports or small explicit adapters.
- Kept intentional workshop/LMS variants, including badge/plain headings and filled/stroked icons.
- Canonical shared tokens now live in `packages/design-system/styles/theme.css`. `app/styles/theme.css` and `lms/styles/theme.css` remain the product entry points; LMS-only deltas stay in its file.
- Separated spacing from radii and footer width from testimonial width. Added semantic typography, leading, layer, shadow and motion roles.
- Made supporting primary-color treatments derive from the primary palette. Preserved readable accent/compact-action roles.
- Removed `transition: all` and contradictory unconditional hover movement; movement now follows fine-pointer and reduced-motion policies.
- Added controlled prebuild/predev generation of concrete palette and workshop motion exports; missing, cyclic and unsupported token expressions fail clearly.
- Documented the intentional synthesis of font weights 800/900 over the local 400–700 files.

### 2. Domain, navigation and persistence ownership

- Added a shared creator/platform identity record in `config/identity.ts`.
- Centralized LMS route/API builders and section identifiers in `lms/config/navigation.ts`, with segment validation and query encoding.
- Centralized category/artwork vocabulary in `lms/config/catalog.ts`.
- Centralized cookie version/lifetime and learner/course/lesson note keys/events in `lms/config/persistence.ts`.
- Added one normalized profile validator shared by form, API and persisted-state sanitation.
- Separated pure catalog/progress/state operations from Next.js cookie I/O.
- Added published-catalog validation and defined unknown/missing preview/resource behavior.
- Replaced positional featured-course/preview selection with configured identities and order.
- Derived course summaries from numeric lesson totals; corrected the editing course to `ساعتان` (7200 seconds).
- Fixed numbering at 10+ items and safe empty/full-completion behavior.
- Added sanitation for tampered state and exact invalid/unknown API responses without partial mutation.

### 3. Reusable composition and component separation

- Added a supplied LandingModel and LandingPage composition with optional sections, order, header/footer and motion policy.
- Extracted the skill strip, showcase, coaching and closing sections.
- Separated course overview, outcomes, curriculum and enrollment presentation.
- Separated learning header/title/actions/info, outline, resources and certificate cards.
- Made ContinueCard, DashboardStats, LessonOutline, ResourceCard and CertificateCard accept narrow models.
- Unified public, dashboard, recommendation and enrolled-course layouts through CourseGrid.
- Supplied copy, actions and assets through typed props; feature/default composition owns concrete data.
- Added typed navigation/mutation action contracts, loading/disabled/error feedback and duplicate-submit protection.
- Replaced repeated fixed control IDs with stable unique React IDs.
- Demonstrated alternate content, assets, destinations, ordering and independent instances in a separately built test-only fixture. The fixture is not shipped as an LMS route.
- Added defensive progress, empty-action and artwork contracts plus negative TypeScript assertions.

### 4. Motion and interaction fixes

- Fixed the duration parser: optimized CSS `1s` now resolves to 1000ms instead of 1ms. This was a concrete cause of the previously invisible animation.
- Preserved 1000ms entrances, 800ms surface movement, explicit easing/distance/stagger and independent hover transforms.
- Replaced hidden page-class dependencies in the generic engine with supplied groups/explicit reveal markers.
- Registered newly mounted filter results without replaying retained cards.
- Added one owner per target, removed/reinserted occurrence handling and completed-effect release.
- Subscribed to reduced-motion changes from initial reduced visits; active/pending motion settles and future unread targets can animate after reduction is disabled.
- Kept stacked/offscreen targets paused until their own viewport trigger.
- Verified cleanup across ten lifecycle cycles and nested scopes.
- Removed the erroneous 16px padding from closed LMS FAQ panels while preserving the workshop's intended answer variant.
- Verified real intermediate FAQ/entrance/hover frames, touch policy, keyboard focus and actual timing at `http://localhost:3040/`.

### 5. Certificate export and production artifacts

- Extracted a pure SVG/XML certificate renderer with escaped supplied content.
- Separated export presentation from HTTP transport and eligibility.
- Generated the embedded local certificate font for server use; it does not appear in client chunks.
- Removed runtime theme/font filesystem dependence on process cwd.
- Built both applications as standalone artifacts and staged public/static assets.
- Fixed preview staging to use fresh directories rather than merge stale build files.
- Added tests for the actual served build identity, font hints/bytes, certificate content/headers and exact API status contracts.
- Added server-registered font preloads. This substantially reduced measured font-swap layout shifts without changing the final typography/layout.
- Preserved ColorZilla body-attribute tolerance and separately proved that real child hydration mismatches remain detectable in development.

### 6. User-supplied video references

- Stored the seven portfolio Shorts exactly as supplied in `config/creator-media.ts`.
- Set the workshop intro to `https://youtu.be/h1G6qEPRIPg` through its content configuration.
- Verified the deferred player targets the new privacy-enhanced intro embed after activation.
- Kept portfolio references separate from course lessons; LMS videos remain clearly labelled demo previews.
- Did not invent portfolio titles, descriptions or thumbnails. Shorts metadata requests were throttled.
- Portfolio references are saved for reuse; they have not replaced the approved placeholder reel presentation.

### 7. Verification tools and documentation

- Added AST/transitive import, cycle, route/card ownership and CSS guards across both apps/shared source.
- Validated the guards with deliberate invalid fixtures, including dynamic import/require paths.
- Added domain, invalid-model, reuse, instance, lifecycle, motion, API and export checks to the existing Playwright/TypeScript toolchain.
- Captured 60 screenshots across 15 route scenarios and four widths, with geometry/overflow/error records.
- Retained the original baseline and raw differences; added a failing visual gate with narrowly recorded exceptions.
- Captured five-run homepage comparisons and five current performance runs for every specified route.
- Updated root/LMS design-system, architecture and README documentation.
- Refreshed `DESIGN_REPRODUCTION_PROMPT.md` with the shared-source snapshot, hashes and both lockfile identities. Its refresh script has a `--check` mode and does not regenerate screenshot baselines.
- Added the complete finding/case ledger in `docs/evidence/architecture-acceptance/ACCEPTANCE_REPORT.md`.

## Verification checkpoint

| Check | Latest recorded state | Evidence |
| --- | --- | --- |
| Workshop build | Passed; includes the supplied intro | `final-workshop-build.log` |
| LMS build | Passed | `final-lms-build.log` |
| Root/LMS lint and TypeScript | Passed, including latest lint refresh | `final-*-lint.log`, `final-*-types.log` |
| Full LMS suite | **47 passed**, zero retries | `final-lms-tests.log` |
| Full workshop suite | **32 passed**, zero retries; the incorrect WebP test assumption was corrected to the approved PNG portrait | `final-workshop-tests.log` |
| Repeated motion/lifecycle/interaction suite | **39 passed**, three repeats, one worker, zero retries | `final-motion-repeat.log` |
| Chromium / Firefox / WebKit critical flows | **15 passed** | `final-crossbrowser-tests.log` |
| Development child-hydration diagnostic | **1 passed** | `final-development-hydration.log` |
| Pure domain / invalid presentation | **10 passed** | `domain-coverage-tests.log` |
| V8 extracted-domain block-range coverage | **95.33%**; methodology documented | `domain-coverage.json` |
| Runtime architecture scan | **231 files, zero violations** | `scripts/architecture-boundaries.cjs` |
| Maintained source/config/test/script inventory | **290 files** | `final-source-inventory.json` |
| Design source snapshot | **290 files verified** | `scripts/refresh-design-snapshot.cjs --check` |
| Visual matrix | **60/60 passed with four documented exceptions**, not 60 identical screenshots | `final/visual-gate.json`, `final/comparison.json` |
| Current all-route performance | 75 measurements; all median CLS ≤0.1, no repeated scroll long tasks | `final/route-performance*.json` |
| Full comparative performance acceptance | **Open**: no historical before-refactor measurements for non-homepage routes | T34/T38 in acceptance report |

Evidence paths above are relative to `docs/evidence/architecture-acceptance/` unless stated otherwise. Earlier failure logs/traces represent actual findings or test synchronization mistakes; do not count them as current passes without the latest rerun.

## Visual/performance exceptions and limitations

- The FAQ fix removes exactly five 16px closed gaps at 320/390/768 and shifts lower content by 80px.
- The corrected editing duration reflows its metadata at 320 and removes 38 raster pixels; other card hierarchy remains unchanged.
- Phase 0 missed the lazy portrait in the 320 LMS landing capture. The loaded approved asset/frame is verified independently; that precise baseline defect is recorded.
- The matched screenshot-warmed homepage measurements showed CLS about 0.016 workshop / 0.0003 LMS and reduced transferred LMS JavaScript. Separate fresh-browser route diagnostics use a different warm-up and are not interchangeable with those comparative measurements.
- Historical per-route performance is missing, and WSL restarted between baseline/final measurements. Do not claim unconditional T34 acceptance or stronger hardware-controlled performance conclusions.
- The approved workshop retains some legacy compact white-on-red text. LMS contrast roles have dedicated assertions; this work is not a blanket WCAG certification.
- Demo cookie/profile state is not production authentication, entitlement, payments or cross-device persistence.

## Running previews

| Application | URL | Build ID |
| --- | --- | --- |
| User LMS preview | http://localhost:3040/ | `2qJ3LSY82ni33W9f6nlH7` |
| Isolated LMS acceptance preview | http://localhost:3042/ | `2qJ3LSY82ni33W9f6nlH7` |
| Workshop preview | http://localhost:3022/ | `JJDUfHIZ5jhSqSO8kWtmn` |

They run from staged artifacts under `/tmp/khatab-acceptance-artifacts/`, not source dev servers. WSL restarts can remove `/tmp` staging/browser libraries and stop previews; rebuild/restage before trusting an old URL. No app was published.

## What remains

- [x] Finish and record the latest full workshop suite: 32 passed after the portrait test correction.
- [x] Record the latest lint refresh: both apps passed; checkpoint table updated.
- [ ] Refresh final visual/performance evidence if further UI/runtime changes occur. The newly supplied intro changes the activation source, not the untouched initial poster/layout.
- [ ] Close T34/T38 only with authentic historical per-route evidence or an explicitly revised comparative scope. Do not fabricate data or silently lower budgets.
- [x] Populate portfolio with the six supplied originals and verified thumbnails/durations; latest media checkpoint below.

## Next-session handoff

1. Read `AGENTS.md`, `DESIGN_SYSTEM.md`, this checkpoint and the acceptance report before editing.
2. Inspect the latest evidence logs and running artifact IDs; preserve the user's dirty/untracked tree.
3. Resolve outstanding checks before claiming final acceptance. Update this file and the case/finding ledger after each completed check.
4. Validate both consumers after shared-source changes. Keep fixture routes separate from production.
5. Keep canonical ownership, the approved design and real supplied media references. No unsolicited design/library changes, destructive reset, commit/push or deployment.

## Update log

- **2026-10-08:** Continued the architecture plan; repaired optimized timing, reveal lifecycle, FAQ collapse, font preload registration and stale artifact staging; completed functional/reuse/export/browser checks; recorded visual exceptions and comparative-performance limits.
- **2026-10-08:** Stored seven supplied portfolio Shorts and wired the supplied workshop intro; added this tracking checkpoint at the user's request.

- **2026-10-08:** Final checkpoint refresh: workshop 32/32, LMS 47/47, both lint refreshes passed, 290-file snapshot verified. Historical performance scope remains the explicit acceptance limitation.

- **2026-10-08:** Reverified the running workshop at port 3022 uses `h1G6qEPRIPg`; its focused browser playback test passed (1/1). The video iframe loads only after pressing play.


## Previous checkpoint — custom workshop player

**2026-10-08:** Implemented custom playback controls on http://localhost:3022/ for `h1G6qEPRIPg`, with play/pause/replay, timeline/time, mute/volume, fullscreen and keyboard shortcuts. The approved inactive frame is preserved. The YouTube API is deferred until activation; native controls are disabled. Shared renderers/hooks/types, centralized Arabic labels and canonical player tokens own the implementation. No player npm package/download button was added; LMS lesson player behavior is unchanged.

- Both application production builds, lint and TypeScript checks passed.
- Full workshop suite: **38 passed**, including six new custom-player cases (real API command behavior via deterministic fixture, four widths, failure/retry).
- Full LMS regression suite: **47 passed**.
- Architecture guard: **243 runtime files, zero violations**.
- Actual unstubbed YouTube playback was also verified: the intro reports 1:01 duration, the custom pause/volume/fullscreen controls are enabled, and there are no page errors. Evidence: `docs/evidence/custom-video-player/live-provider-check.json` and `live-provider-1440.png`.
- Current builds: workshop `3cUNCi-l_OKt0dNUztXoT`; LMS (3040/3042) `Nm-FttgrRRRcgL78yTUBZ`.
- User then requested removal of the clickable YouTube logo/share-link icons. **This is pending a direct MP4/original media source**: supported YouTube embed parameters do not remove branding/share UI. No MP4/WebM/MOV source was found in public assets. A direct MP4 URL was requested; do not count icon removal as completed.
- Earlier architecture acceptance evidence is retained as a prior checkpoint; its historical per-route performance limitation remains open. New custom-player tests/builds are in `docs/evidence/custom-video-player/`.


## Previous checkpoint — original MP4 portfolio and hero

**2026-10-08:** Completed the requested local playback trial before building access APIs.

- Downloaded six work samples from the supplied Drive folder, then the newly added
  `ورشة التغيير.mp4` intro. Original downloads are outside the repository in
  `/tmp/khatab-portfolio-originals`; original Drive files are unchanged.
- Replaced the four placeholder reels with all six real videos in the existing
  workshop portfolio grid. Posters come from actual footage; titles describe it.
  Original filenames/IDs remain in `config/portfolio.ts`; measured durations,
  dimensions and file sizes are in `config/portfolio-media.json`.
- Reels retain 9:16 and show **only the centered play/pause button** while playing.
  No timeline, volume bar, fullscreen bar, download action or provider link is
  displayed. Finishing unmounts the video and restores its original thumbnail;
  clicking again starts from the beginning. Starting another reel pauses the
  previous native video. Keyboard play/pause and failure/retry remain available.
- The hero now plays the supplied original MP4 through the **full custom controls**:
  play/pause/replay, seeking/time, mute/volume and fullscreen. Its inactive approved
  presentation/copy is retained. The source is in `config/creator-media.ts` and
  technical metadata is in `config/workshop-intro-media.json`.
- Native playback makes no YouTube iframe/SDK requests, so the previously requested
  clickable YouTube logo/share icons are gone for both hero and portfolio.
- Shared `PlayerShell`, `VideoControls`, native/fullscreen hooks, source contracts,
  neutral playback formatting/action functions and canonical theme styles own the
  implementation. Controls are explicit variants, not independently copied players.
  Fixed seek-state timing so consecutive timeline/keyboard seeks use the new position.
- H.264/AAC web copies use progressive `+faststart`, maximum 1280px without upscaling.
  Portfolio total: **946.28 MB → 41.65 MB**; intro: **160.65 MB → 9.57 MB**.
  Assets load only after clicking their posters. Byte-range serving was verified.
  The encoding recipe is recorded in `public/assets/video/portfolio/README.md`.
- Both production builds, lint and TypeScript checks passed. Complete workshop suite:
  **46 passed**; complete LMS suite: **47 passed**. All six actual reels, hero controls,
  failure/retry, native fullscreen/replay, centered controls at 320/390/768/1440,
  thumbnail restoration/restart, source deferral and byte ranges were tested.
- Architecture guard: **248 runtime files, zero violations**. Current source snapshot:
  **311 files**; refreshed after generated build files changed. Original visual
  baselines remain immutable; authorized media population changes the portfolio.
- Evidence: `docs/evidence/portfolio-player/` contains build/lint/type/test logs,
  actual hero playback JSON (1280×720, 61.12 seconds, no provider requests/page errors),
  and screenshots of portfolio/active reel/hero at desktop and mobile widths.
- Local workshop: **http://localhost:3022/**, build `kMJY2KbfRTp0ZGoLP3SwA`.
  Portfolio: **http://localhost:3022/#clients**. LMS 3040/3042 remains build
  `73dFbtK8NvjvW_flYW1ph`; lesson-demo playback is unchanged.
- **Next phase:** authentication/private storage/signed access APIs. Current MP4s are
  deliberately public local test assets. No protection or download prevention is
  claimed. No npm player package, commit, push or deployment was added.
- The prior architecture acceptance limit for unavailable historical per-route
  performance comparisons remains open; this playback completion does not close it.


## Previous checkpoint — hero thumbnail and minimal player

**2026-10-09:** Completed the requested hero update.

- Hero now displays the original YouTube thumbnail for `h1G6qEPRIPg`, downloaded
  locally to `public/assets/images/workshop-intro-poster.jpg`. Provenance lives in
  `creatorMedia.workshopIntroThumbnailSource`; playback remains the supplied MP4.
- Only the centered play/pause button is rendered during hero playback, with no
  controls bar, timeline, volume or fullscreen buttons. Completion restores the
  thumbnail, just like the six portfolio reels.
- `VideoContent` accepts optional poster/controls-variant/return-to-poster settings;
  page data supplies them. `HeroVideo` composes shared image/player components.
  The default full-control variant remains reusable by other callers.
- Preserved the existing hero border and 16:9 shell. Geometry checks measure the
  actual video ratio and account for the original 1px border rather than comparing
  the inner viewport as though it had no border. No layout tolerance was added to
  playback-button centering. Native controls and controls-bar counts are zero.
- Build, lint and TypeScript passed; the complete workshop suite passed **46/46**
  with one worker. LMS type checking passed; its previous **47/47** regression
  result remains recorded (no LMS UI/runtime changes in this update).
- Browser libraries and staged servers were restored after the WSL session reset.
  Workshop at **http://localhost:3022/** now serves build `nccrmyu5M76rlAgIjD7w-`.
  LMS ports 3040/3042 still serve `73dFbtK8NvjvW_flYW1ph`.
- Current screenshots and live playback evidence are in
  `docs/evidence/portfolio-player/hero-thumbnail-{1440,390}.png`, `hero-{1440,390}.png`
  and `live-hero-check.json`: one button, zero controls bars and no page errors.
  Architecture guard: **248 files, zero violations**; source snapshot: **311 files**.
- `DESIGN_SYSTEM.md`, the reproduction snapshot and evidence report are updated.
  Access APIs remain the next phase; no commit/push/deployment was performed.


## Previous checkpoint — reusable configurable MediaPlayer

**2026-10-09:** Completed the reusable player requested by the user.

- Public component: `packages/design-system/ui/media-player.tsx`; workshop adapter:
  `app/components/ui/media-player.tsx`. Props are defined in shared `types/media-player.ts`.
- Required inputs: `videoUrl`, `thumbnailUrl`. `width`/`height` accept numeric pixel
  values or CSS strings; `color` sets a scoped button/timeline accent. Default sizes
  and colors stay in the global theme. Aspect ratio, labels, poster slots, optional
  full controls and thumbnail restoration are customizable too.
- HeroVideo and all six playable ReelCards now compose the component. Playback
  logic still uses shared deferred/native/shell/fullscreen code. There are no
  independent copied players. Arabic default labels moved to a shared library;
  the old workshop configuration is a re-export adapter.
- Button styling works without workshop/reel classes. Caller colors survive hover
  and playback; dimensions apply to both the poster and active player. Changing a
  video URL remounts deferred state so returning to an old source also stays inactive.
- Added an isolated test page outside production routes. It verifies numeric and
  CSS-string sizes, two independent colors, real native playback, source/thumbnail
  updates and completion. Its initial full-response mock did not support seeking;
  the final test uses actual byte-range video serving and passes.
- Workshop build/lint/types passed; isolated fixture build passed; LMS lint/types
  passed. Full workshop suite: **47 passed**. Previous LMS runtime suite remains
  **47 passed**, unchanged and not rerun in this step.
- Architecture guard: **252 files, zero violations**. Reproduction snapshot:
  **317 source files**. Evidence includes `custom-player-props.json` and screenshot:
  320×180 green and 240×150 red independent instances; color stays green during play.
- Preview **http://localhost:3022/** serves workshop build `kozYYw7yZr0mIRhVzbLjC`.
  LMS 3040/3042 remains `73dFbtK8NvjvW_flYW1ph`; test-only fixture uses 3043.
- Usage docs: `docs/MEDIA_PLAYER.md`. Updated design contract and source snapshot.
  No new npm dependency, access API, commit, push or deployment was added.


## Previous checkpoint — click to pause and scroll reset

**2026-10-09:** Completed the requested playback interaction and cleanup.

- Overlay players render no pause button during playback. Clicking the video
  pauses it; the centered play button appears while paused. Clicking that button
  resumes playback. Space/K remain available, with focus retained on the player.
- Shared MediaPlayer defaults `resetOnScrollOut` to true. The dedicated viewport
  hook resets deferred activation when the player leaves the viewport. Scrolling
  back shows the thumbnail without loading or playing until another click.
  Small scrolls that leave the player visible do not interrupt playback.
- Native cleanup removes listeners, pauses, clears `src`, and calls `load()` to
  cancel outstanding retrieval and release the buffer. Cleanup applies to scroll,
  completion, source changes and unmount. Cancelled play promises are ignored;
  effect replay restores the source in development. Already transferred bytes
  cannot be undone. No access APIs or new dependencies were added.
- A throttled HTTP media response test confirms an unfinished response closes
  after scroll reset. Additional checks verify thumbnail restoration, released
  source/readiness, no automatic reload, and restart from the beginning.
- Fresh workshop production build, root lint/types, fixture build and LMS
  lint/types passed. Full workshop suite: **49 passed (1.3m)**. Architecture guard:
  **253 files, zero violations**. Reproduction snapshot: **318 source files**.
- Live hero/reel check confirms **zero buttons during playback**, and reset leaves
  the detached video paused, without `src`, at `readyState=0`. Evidence:
  `docs/evidence/portfolio-player/scroll-reset-live.json` and `scroll-reset-tests.log`.
- Workshop preview **http://localhost:3022/** serves build `Tsnml6L26MOjGrtIhFAlw`.
  LMS 3040/3042 remains `73dFbtK8NvjvW_flYW1ph`; LMS runtime suite was not rerun
  because its player usage is unchanged. Isolated shared-player fixture uses 3043.
- Updated `docs/MEDIA_PLAYER.md`, `DESIGN_SYSTEM.md` and the reproduction snapshot.
  Historical architecture/performance gates remain as previously recorded.


## Previous checkpoint — reset previous player on activation

**2026-10-09:** Completed resetting the previous video when another starts.

- Shared `useExclusivePlayer` coordinates deferred instances before mounting the
  new media source. Starting another video resets the previous instance even if
  paused, loading or buffering. Native play events also claim playback on resume.
- Previous playback unmounts, restores its original supplied thumbnail, clears
  its source and aborts retrieval through the existing native cleanup. Switching
  back starts from zero. Subscription listeners are removed on unmount.
- New browser checks cover playing and paused previous players, switching back,
  and cancellation of a real throttled unfinished HTTP media response. Isolated
  reusable-player checks: **6 passed**. Full workshop suite: **52 passed (1.1m)**.
- Fresh workshop production build, root lint/types, fixture build and LMS lint/types
  passed. Architecture guard: **254 files, zero violations**. Reproduction snapshot:
  **319 source files**. LMS runtime suite was not rerun; its usage is unchanged.
- Live adjacent-reel evidence confirms work-01 returns to its own thumbnail, its
  old source is absent and readiness is zero, while work-02 plays without errors.
  Evidence: `docs/evidence/portfolio-player/exclusive-playback-live.json` and
  `exclusive-playback-tests.log`.
- Workshop **http://localhost:3022/** serves build `6fCMGht_0JFvRQhvRXapZ`.
  LMS 3040/3042 remains `73dFbtK8NvjvW_flYW1ph`; test fixture remains 3043.
- Updated player usage docs, design contract and source snapshot. No new dependency,
  API, commit, push or deployment. Historical acceptance gaps remain recorded above.


## Previous checkpoint — shared website motion

**2026-10-09:** Completed smoother motion across the entire workshop and LMS.

- Canonical motion roles now drive both apps: shared cubic-bezier(0.22, 0.61, 0.36, 1),
  400ms control/color feedback, 800ms surface transitions, 1000ms reveals and 120ms
  press feedback. Removed independent LMS timings and replaced anonymous workshop
  transition durations with semantic roles. Existing positions/layouts stay intact.
- Card lifts/shadows, buttons, play icons, highlights, badges, roadmap cards,
  reviews, links and toast transitions use the shared motion. Native reveal groups
  alias canonical durations; their completed transforms still release for hover.
- Fixed the workshop FAQ's abrupt `hidden` toggling and non-interpolable max-height.
  Both apps share grid-height/opacity transitions and clipped inner wrappers, with
  closed panels inert and aria-hidden. Removed the LMS's duplicated panel CSS.
- Mobile menus fade/slide open and closed instead of switching display. A shared
  theme-breakpoint subscription makes closed menus inert, and restores normal
  desktop links after resizing. Pointer input is blocked immediately on closure.
- Player views/paused play buttons fade in; prior stream cancellation still occurs
  immediately. Reduced motion clears transition/animation delays and skips fades,
  while retaining accessible, visible content. No new runtime dependencies.
- Browser checks assert actual production reveal duration, card transform timing,
  menu opacity transitions in both directions, FAQ grid-height transitions and
  reduced-motion completion for both sites. An initial assertion compared raw CSS
  units; corrected it to compare numeric timings because production minification
  converts milliseconds to seconds. No timing tolerance was weakened.
- Fresh workshop/LMS production builds, isolated fixture build, root/LMS lint/types
  passed. Full workshop suite: **54 passed (1.8m)**. Full LMS suite: **47 passed
  (1.5m)**. Architecture: **255 files, zero violations**. Snapshot: **321 source files**.
- Workshop **http://localhost:3022/**: build `SGVhGCDY03HUsnG78W2DT`.
  LMS **http://localhost:3040/** and **http://localhost:3042/**: `HymcJryBvMIHR3EwyL7Aa`.
  Test fixture on 3043 was rebuilt and restarted too.
- Evidence logs: `docs/evidence/site-motion/workshop-tests.log`, `lms-tests.log`.
  Docs: `docs/MOTION_SYSTEM.md`, design contract and reproduction snapshot updated.
  Historical performance acceptance gaps remain recorded above; no commit/push/deploy.


## Previous checkpoint — gradual hover in and out

**2026-10-09:** Revised global motion after the user found hovering/leaving too instant.

- Live investigation confirmed both cards did interpolate; the former ease-out curve
  covered ~60% of its travel in 200ms, making it feel front-loaded. Native CSS also
  shortens reversal after a brief hover rather than restarting a full transition.
- Canonical curve is now `cubic-bezier(0.4, 0, 0.2, 1)`, with **1000ms** surface
  transitions and **600ms** color/control transitions. Section reveals remain 1000ms
  and press feedback remains 120ms. Both apps inherit these roles, in both directions.
- Added real hover-in/out tests at 1440px for both apps: intermediate positions after
  250ms, fully hovered/resting positions, and pointer leave before completion.
  Tests retain native reversal behavior and assert continuity, not fake fixed delay.
- Recorded live evidence: workshop quarter-enter −0.82px of −5px, quarter-leave
  −4.33px; LMS quarter-enter −1.59px of −8px, quarter-leave −6.41px; both finish at zero.
  `docs/evidence/site-motion/hover-live.json`, `workshop-hover.webm`, `lms-hover.webm`.
- Fresh root/LMS lint/types and builds, plus fixture build, passed. Targeted motion
  checks: **4 passed**. Full workshop regression suite: **56 passed (2.0m)**.
  Full LMS regression suite: **47 passed (1.1m)**.
- The first LMS run had five failures because its timing assertions still required
  800ms; updated those exact expectations to the requested 1000ms without weakening
  interpolation/collapse assertions, then started a fresh full regression run.
- Architecture: **255 files, zero violations**. Snapshot: **321 source files**.
  Player source cancellation, reduced motion and approved layout/content stay intact.
- Workshop 3022 build: `3h_M5GC6p6CnY0PQ8ivQM`; LMS 3040/3042 build:
  `XGsAHQjbMxvhgwYp32H96`. All servers and isolated fixture were restarted.
- Design contract, motion docs, player docs and reproduction snapshot updated.
  No dependencies, access API, commit, push or deployment added.


## Previous checkpoint — Windows reduced-motion root cause

**2026-10-09:** Identified the actual reason the user saw all motion as static.

- Windows `SPI_GETCLIENTAREAANIMATION` returned false. A separate clean Windows
  Brave diagnostic profile, using the real OS preference, reported reducedMotion=true
  even with hover/fine-pointer support. Linux headless tests did not inherit that
  Windows preference; prior passing motion tests missed this environment difference.
- On actual Windows Brave at workshop 3022, computed card transition was `none` and
  creator marquee animation was `none`. Overriding only the diagnostic tab to
  no-preference immediately restored the 1s transform and marqueeScroll animation.
  The matching site CSS and reveal hooks deliberately respect reduced motion.
- No system setting or existing browser profile was modified. The temporary
  diagnostic browser was closed. User action: Windows Settings > Accessibility >
  Visual effects > Animation effects on, then reload the site to see entrance motion.
- Fixed a separate requested marquee direction issue: old quarter-cycle translation
  was +344.5px (rightwards). Track now moves left, with RTL chip content preserved.
  Included half-gap correction so duplicated sets align at the loop seam. Existing
  size, palette, duration and hover-to-pause behavior remain. No further timing tweaks.
- A failing direction test was run before the CSS fix; it passes afterwards. New
  regression also reproduces reduced-mode static reels and recovery after preference
  changes. Windows Brave confirms quarter translation −350.586px, seam ~0.037px.
- Evidence: `docs/evidence/site-motion/windows-animation-setting.json`,
  `windows-brave-diagnosis.json`, `reels-workshop-tests.log`.
- Fresh root/LMS lint/types/build and fixture build pass. New targeted tests: **2
  passed**. Full workshop suite: **58 passed (1.8m)**. Architecture: **255 files,
  zero violations**. Snapshot: **322 files**. LMS runtime suite was not rerun in this
  step; no LMS component uses the changed creator marquee. Its prior 47-pass gate
  and new production build remain recorded; do not call it a fresh 47-pass run.
- Workshop 3022: `a9x_-gF7XqDcRhElbUH9y`. LMS 3040/3042:
  `B9WeCZ8iMF0Yxg9CB3Q4P`. All artifacts and fixture restaged/restarted.
- Updated motion docs and design contract. No dependencies, access APIs, commit,
  push or deployment. Historical performance-baseline acceptance gaps stay open.


## Previous checkpoint — half-second motion

**2026-10-09:** User confirmed animation works and requested 1s → 0.5s.

- Canonical surface and reveal durations are now **500ms** for both apps; color/
  control feedback is **300ms** so it remains faster. Curve stays unchanged; press
  feedback remains 120ms and the marquee's 38s speed stays unchanged.
- Updated existing motion assertions to exact 500ms timings. Hover tests sample
  at 125ms to retain quarter-duration interpolation and reversal checks.
- Production CSS minifies 500ms to `.5s`. The LMS motion reader rejected this valid
  leading-dot syntax and triggered its client error boundary. Corrected the parser
  to accept leading-dot fractional durations while keeping invalid values rejected.
  The initial motion runs exposed this failure; corrected production runs pass.
- Fresh root/LMS lint/types/build and fixture build passed. Targeted workshop
  checks: **14 passed (38.3s)**; LMS motion/interaction checks: **12 passed (25.3s)**.
  Full suites were not rerun for this timing change. Architecture: **255 files,
  zero violations**. Source snapshot: **322 files**.
- Updated artifacts and restarted all ports. Workshop 3022: `ita4oY7agGJsvSlATBAWc`.
  LMS 3040/3042: `pbhh82Yv6djW_JdJhZk3v`; fixture remains 3043.
- Evidence: `docs/evidence/site-motion/half-second-workshop-tests.log` and
  `half-second-lms-tests.log`. Updated design/motion/player docs and snapshot.
  No dependencies, commit, push or deployment added.


## Previous checkpoint — four curated work samples

- Reviewed frames across all six local videos. Selected China (01), baby-care products (03), hair care (05), and store tour (06) for their variety of illustrated editing, product graphics, typography, and live footage.
- `config/portfolio.ts` centralizes selection using `featured`; the data adapter preserves each selected work’s original media index. All six original records and assets remain available.
- Removed duration badges from both playable and fallback reel cards and removed their unused CSS. Playback, portrait ratio, hover effects and creator marquee remain.
- Fresh verification: root lint, TypeScript, workshop and LMS production builds passed; architecture check: 255 files, zero violations; targeted portfolio/player/marquee browser suite: **16 passed (20.0s)**. The browser test explicitly checks the four titles, their correct video sources, and absence of duration badges.
- Production artifacts refreshed and local workshop restarted on **3022**; LMS restarted on **3040/3042**. Workshop build: `qxliZwhHfop-V6xgwoH5b`; LMS build: `xd9--7UXnuCkeQdz0YQvF`.
- This is targeted verification for this change, not a new full architecture/performance acceptance run.


## Previous checkpoint — fullscreen video playback

- Hero and four curated reel thumbnail clicks request native fullscreen synchronously from the activation gesture. The reusable `fullscreenOnPlay` prop remains opt-in for other consumers.
- Preserved original portrait/landscape framing with `object-fit: contain`; fullscreen dimensions override the inline width/height props. No cropping or forced device rotation.
- Added a visible localized exit control with existing theme tokens and safe-area spacing. Escape and the exit button return to inline playback; finishing restores the thumbnail and exits fullscreen. Clicking video still pauses.
- Fresh verification: root lint and both production builds (including TypeScript) passed; architecture guard: 255 files, zero violations; fullscreen, hero/reel playback and marquee browser tests: **19 passed (41.4s)**. Dedicated tests cover portrait/landscape intrinsic dimensions, no native controls, pause, exit button, Escape, and end-to-poster fullscreen exit.
- Local servers refreshed: workshop **3022**, LMS **3040/3042**. Workshop build `DonvP87KNvrDQYhlJhDMV`; LMS build `bTdYoT5DAWKoSubRMoeXJ`.
- Browser fullscreen rejection falls back to inline playback; tested behavior is Chromium native fullscreen. No device orientation lock or new dependency was added. This is targeted verification, not a new full performance acceptance run.


## Previous checkpoint — testimonial preview and manual fullscreen

- Testimonials initially show the featured wide card plus three smaller cards. `TestimonialsContent.expansion` holds the visible count and localized show-more label. A separate client `ReviewList` owns expansion while the section heading/featured card remain server components. Existing `ReviewCard` is reused.
- Centered `عرض المزيد` uses primary red, gains an underline on hover, and reveals the six remaining reviews with a reduced-motion-aware shared fade. Other consumers can supply different initial counts/labels or omit expansion to show all reviews.
- Hero and reel activation stays inline. A shared top-right fullscreen toggle fades in on hover, exposes keyboard focus, stays available on touch devices, and remains visible as an exit button during fullscreen. Mouse focus no longer keeps it visible after hover ends. Thumbnail caption moved to the left to avoid overlap.
- Fullscreen continues to preserve intrinsic portrait/landscape framing; exit button, Escape, video-click pause and completion-to-poster reset remain supported. No new dependencies or theme literals were added.
- Fresh verification: root lint, workshop/LMS production builds including TypeScript passed; architecture guard **256 files, zero violations**; targeted browser suite **33 passed (42.6s)**. Includes collapsed/expanded testimonial counts, primary color, centered action, hover underline, manual fullscreen/hover-out/focus, playback, responsive layouts and preserved wording after expansion.
- Evidence: [browser log](docs/evidence/testimonial-expansion/browser-tests.log), [initial layout](docs/evidence/testimonial-expansion/initial-desktop.png), [expanded layout](docs/evidence/testimonial-expansion/expanded-desktop.png). Layout captures use reduced motion and hide the sticky header in the capture page to avoid covering the section; product header behavior is unchanged.
- Local workshop **3022** build `t4gph5xg6A2bjWcUiFQ7o`; LMS **3040/3042** build `RQYpzYSLHU6Y9ooSgtHP9`. This is targeted verification, not a new full architecture/performance acceptance run.


## Previous checkpoint — icon-only fullscreen controls

- Removed fullscreen/exit control fill and button border, including hover/focus background inherited from the generic control. Icons use the shared subtle red border token as a thin SVG outline; existing hit areas and hover/fullscreen behavior remain.
- Fresh verification: root lint and both production builds passed. Fullscreen and testimonial/hover browser checks: **5 passed (13.1s)**. Live computed styles confirmed transparent backgrounds and zero button border for both enter/exit controls, including hover; SVG stroke resolves to the primary red at 35% opacity.
- Refreshed local workshop **3022** build `g8Iz5utQwmsa2GVrtRu12` and LMS **3040/3042** build `xNc4vhabJh68lpzwunASP`. Shared styles and documentation updated; no new dependencies.


## Previous checkpoint — higher-contrast fullscreen icons

- Replaced the red SVG outline with two compact black drop shadows using existing shared size/color tokens. Fullscreen and exit icons stay white with transparent backgrounds and no button border.
- Fresh verification: root lint and workshop/LMS production builds passed; fullscreen regression checks **3 passed (9.5s)**. Live enter/exit style inspection confirmed no stroke, transparent background, and black drop shadows in both states.
- Local workshop **3022** build `Q6Tm06YkD8KV3E-ns1U-k`; LMS **3040/3042** build `X4-zIS8g1IdQnZT4IbXsy`. Shared documentation and reproduction snapshot refreshed.


## Previous checkpoint — fullscreen pointer cursor

- Shared fullscreen/exit control now explicitly uses `cursor: pointer`.
- Fresh verification: root lint and both production builds passed. Live browser inspection confirmed `pointer` for both enter/exit states, with transparent backgrounds and the existing black icon shadow retained.
- Workshop **3022** build `lFY3k1A1fGuIxT1LIdlX0`; LMS **3040/3042** build `Cpu2boZQqqS-R5OJlTlNs`. Reproduction snapshot refreshed.


## Latest checkpoint — shared media on Ta3llam

**Scope:** user confirmed work on the available workshop/Ta3llam apps only for now. No independent portfolio project is present or modified. Ports 3040 and 3042 serve the same LMS application.

- Promoted hero video, work-sample/testimonial sections, reel/review cards, review expansion, featured review, author identity and creator marquee/chips to the shared `@khatab/design/ui` package. Workshop paths re-export these implementations.
- Centralized the supplied intro binding and shared proof content in `config/marketing-intro.ts`, `marketing-proof.ts`, `workshop-clients.ts` and `student-reviews.ts`. All four featured original work videos and their existing thumbnails are retained; no new source media was invented.
- Ta3llam’s hero now uses the supplied intro MP4 and original YouTube thumbnail through the custom player. Its optional course preview remains available to alternate model consumers. Added optional/orderable work-sample and testimonial sections to LandingModel, connected to the existing 500ms page reveal policy.
- Ta3llam work samples show four portrait cards without duration badges and the shared moving creator strip. Testimonials show one wide review plus three smaller cards, then the centered red `عرض المزيد` action with hover underline and fade-in expansion.
- Both apps use the same inline-play, video-click pause, exclusive player reset, source-release-on-scroll/end-to-poster behavior and manual fullscreen controls. Fullscreen icons are white with black shadows, transparent backgrounds, no borders and pointer cursors; original orientation remains contained.
- Added a checked media-sync script to LMS predev/prebuild so supplied videos, posters and creator portraits exist in standalone production assets. Existing course navigation, demo lesson delivery and APIs remain functional.
- Fixed a zero-width video wrapper caused by the centered hero flex layout. Responsive tests now check the intro’s 16:9 geometry explicitly. Corrected a new fullscreen test to await the asynchronous browser exit event. Two pre-existing transient timing/focus assertions passed unchanged in isolated and final serial runs; initial evidence remains archived.
- Fresh verification: root/LMS lint, TypeScript checks and both production builds passed; isolated reuse fixture rebuilt; architecture guard **270 files, zero violations**. Workshop targeted browser checks: **35 passed (1.1m)**. Full LMS browser suite: **53 passed (1.4m)**, including six new supplied-media/responsive/fullscreen/testimonial cases.
- Evidence: [workshop tests](docs/evidence/shared-marketing-media/workshop-tests.log), [LMS tests](docs/evidence/shared-marketing-media/lms-tests.log), [Ta3llam hero](docs/evidence/shared-marketing-media/3040-hero.png), [work samples](docs/evidence/shared-marketing-media/3040-samples.png), [testimonials](docs/evidence/shared-marketing-media/3040-testimonials.png). Matching captures exist for 3042; layout captures use reduced motion.
- Local workshop **3022** build `u7_FO1FghkxkkpyiBuElK`; Ta3llam **3040/3042** build `TgTcNTYZQnRjn5b4R8OMK`; refreshed reuse fixture **3043**. No new packages, commit, push or deployment. Historical performance comparisons remain outside this change’s acceptance evidence.

## Previous checkpoint — personal portfolio in Next.js

**Completed 2026-10-09.** The supplied [personal reference](https://mohamedkhattab.vercel.app/#courses) is recreated at **http://localhost:3040/portfolio** and **http://localhost:3042/portfolio**. The workshop remains on port 3022. These portfolio URLs belong to the existing Ta3llam App Router project.

- Captured source HTML, stylesheet, script, structured copy and desktop/mobile screenshots in `docs/evidence/portfolio-reference/`. Source JavaScript is archived as `main.js.txt`; it is not executed by the application.
- Preserved all seven section headings/descriptions, about quote and values, four journey entries, six client identities, two course announcements, collaboration contacts and footer/social copy. Navigation includes a return link to Ta3llam; the LMS “عن المدرب” destination now opens this portfolio.
- Added a thin page/metadata entry, a feature composition, eleven focused presentation components and two lifecycle-cleaned navigation/timeline hooks. Central reference content lives in `config/personal-portfolio.json`; shared creator/client/work data remains in its existing owner.
- Downloaded the portrait and course cover artwork into local public assets, with predev/prebuild synchronization. Replaced the reference’s four placeholder YouTube embeds and placeholder view counts with the four real curated MP4 samples and their actual titles. No unsupported view counts were carried onto those samples. Upcoming source course announcements do not add new courses to the LMS catalog or API.
- Applied the existing red/dark/local Arabic font identity and shared 500ms easing, native scroll reveals, restrained hover transitions, animated portrait halo and scroll-linked timeline. Reduced motion disables movement. Scoped portfolio CSS preserves other page layouts; portfolio dimensions and color treatments are in the canonical shared theme.
- Reused the custom player with inline playback, click-to-pause, hover/focus fullscreen icon, end-to-thumbnail reset, offscreen stream cleanup and exclusive sample activation. No runtime dependencies were added.

**Verification:** root and LMS lint passed without warnings; root TypeScript passed; LMS production build/TypeScript passed; architecture guard inspected **288 files with zero violations**. The full Ta3llam browser suite passed **60/60 tests in 1.6 minutes**, including seven portfolio checks for copy, section order/count, local assets, 320/390/768/1440 layouts, mobile navigation/Escape/focus, hash navigation, inline/exclusive/offscreen playback, 500ms hover timing, timeline progress and reduced motion. Evidence: `docs/evidence/portfolio-reference/lms-regression.log`, `nextjs-1440.png`, `nextjs-390.png`. Both portfolio URLs return HTTP 200. Current LMS production build: `Se6Hr_sTXYrAijar87i8I`; workshop build remains `u7_FO1FghkxkkpyiBuElK`. Source reproduction snapshot contains **361 files**.

No commit, push or deployment was performed. Earlier historical performance-comparison limitations remain unchanged; this checkpoint does not claim those outstanding architecture gates were resolved.

## Latest checkpoint — original portfolio design restored

**Completed 2026-10-09.** Corrected the previous portfolio adaptation after the user identified unwanted changes to the original copy and section designs.

- Restored the original seven-section composition from the archived reference markup and stylesheet: portrait/halo hero, editorial about quote and values, original timeline columns and spaced year/title row, six client cards, portrait work cards with captions over the image, whole-card course links, collaboration panel and original footer. Restored the centered mobile hero and original responsive grid breakpoints.
- Restored all four original work-card captions and view-count strings, original portrait work thumbnails and original document title. These count strings reproduce the reference content; they are not independently verified counts for the supplied replacement MP4 videos. Kept the actual supplied videos and shared custom-player behavior.
- Reference copy remains in `config/personal-portfolio.json`; scoped `p-ref-*` styles are derived from the original stylesheet through `scripts/prepare-portfolio-styles.py`. The generator centralizes 156 reference constants in the canonical theme and replaces source transitions with the shared 500ms timing and easing. No new runtime packages were added.
- Removed the extra Ta3llam item from the portfolio navigation to preserve the original five links. Fixed the navigation spy’s overlapping-section selection and return-to-hero reset. Vertical viewport margins are resolved against viewport height so the detection band remains usable on wide screens; observers/listeners are cleaned up on resize/unmount.
- Added an independent full-copy test using the original HTML fixture rather than the app content configuration. It compares every meaningful text node in order across all seven sections and the footer, preserving word spacing while ignoring HTML formatting whitespace. Added a regression test for course highlight and return-to-hero reset.

**Fresh verification:** the complete Ta3llam suite passed **62/62 tests in 1.5 minutes**, including all nine portfolio checks. Root/LMS lint passed; root TypeScript and LMS build/TypeScript passed; architecture guard inspected **289 files with zero violations**. Evidence: `docs/evidence/portfolio-reference/restoration-final-regression.log`, `nextjs-1440.png`, `nextjs-390.png`. Both ports 3040 and 3042 serve the restored portfolio; 3042 returned HTTP 200. Current LMS build: `cVqbttxjJ4v0Uzfv6w16v`. Workshop build remains `u7_FO1FghkxkkpyiBuElK` on port 3022. Source reproduction snapshot contains **362 files**.

Open **http://localhost:3040/portfolio#courses** to review the original courses section. The Ta3llam homepage at `/` is a separate page. No commit, push or deployment was performed; historical performance-comparison limitations remain recorded above.

## Latest media correction — shared reel thumbnails

Replaced the portfolio’s shared portrait thumbnail override with each video’s existing poster from `config/workshop-clients.ts`. Portfolio, workshop and Ta3llam now display the same four per-video thumbnails (`work-01`, `work-03`, `work-05`, `work-06`). Original portfolio copy and section composition remain unchanged. Removed the unnecessary thumbnail prop from the portfolio section and feature composition.

LMS lint/build passed; all nine portfolio tests passed. A live browser comparison confirmed identical thumbnail URLs across all three pages. Current LMS build: `8YvUe18vzdB2dL80yXW69`, serving ports 3040 and 3042.

## Latest checkpoint — verified YouTube reel titles and views

Retrieved public metadata from all seven supplied YouTube links and matched the six local Drive assets to their published counterparts using visible footage and durations. The four featured reels now share the following published captions across portfolio, Ta3llam and workshop:

| Local sample | YouTube ID | Published title | Retrieved views |
| --- | --- | --- | --- |
| work-01 | cR13mNQ5Pk8 | من أعمالى في المونتاج #محمد_خطاب | 1,358 |
| work-03 | MrEkWzW4OfU | Final0 | 2 |
| work-05 | aASn28qlMCI | Fianl | 12 |
| work-06 | hhmFYyx5MgI | Osama work | 17 |

Metadata was fetched on 2026-10-09 at approximately 15:32 UTC. Counts are a verified snapshot rather than live counters. `config/portfolio-youtube.json` owns the associations/title/count/time data; `config/workshop-clients.ts` supplies the shared cards. The portfolio no longer has separate placeholder caption data or indexes into a second caption array. Source descriptions/file labels remain available in `config/portfolio.ts`. Posters and native MP4 playback remain the same across all pages. Original section copy/layout remains intact except for these explicitly requested reel-caption replacements.

`python3 scripts/sync-youtube-metadata.py` refreshes the known associations from public YouTube metadata, validates every response before replacing the last snapshot and archives source evidence. Rebuild both applications after refreshing. No runtime YouTube API/player dependency was introduced.

**Verification:** root/LMS lint and production builds/TypeScript passed; architecture guard reported 289 files and zero violations. All 16 targeted LMS media/portfolio tests and all nine workshop portfolio-player tests passed. A live browser comparison confirmed identical titles, counts and posters on all three pages. Evidence: `docs/evidence/youtube-metadata/lms-tests.log`, `workshop-tests.log` and seven source metadata JSON files. New production builds: workshop `W05z3xZBzXbsjlBUXOVza`, LMS `KarcpmPWgwTalCdrZryhS`. Reproduction snapshot: 363 files. No commit, push or deployment was performed.

# Ta3allam security review — 12 October 2026

Scope: Next.js routes/proxy, authentication and account changes, administrative functions, Supabase RLS/RPCs, payment settlement, media streaming/uploads, dependencies and deployment configuration. This is a code and regression-test review, not a certification or assurance against every attack.

The current reference is **OWASP Top 10:2025**, rather than the older 2021 ordering. Sources: [OWASP](https://top10.owasp.org/2025/), [SQL injection prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet), [DoS prevention](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html), [business logic security](https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html), [Supabase API security](https://supabase.com/docs/guides/api/securing-your-api), [database timeouts](https://supabase.com/docs/guides/database/postgres/timeouts), [Vercel trusted IP headers](https://vercel.com/docs/headers/request-headers). Installed Next.js CSP/proxy guides and Supabase changelog were checked before implementation.

## Findings fixed

- **Reproduced payment deadlock:** checkout expiration locked contacts before orders, while settlement locked orders before contacts. A deterministic two-connection test failed with PostgreSQL `40P01`. Settlement now uses checkout's advisory-lock → contact-row → order-row order, rereads the locked order, validates non-null payment arguments, and retains idempotent enrollment insertion.
- **Stale payment status after a race:** unpaid-state writes already excluded paid orders, but returned the old snapshot when settlement won. The loser now reads the committed payment state.
- **Missing application request budgets:** private atomic PostgreSQL counters now span Vercel instances. Public documents, API reads, authentication, emails, uploads, mutations and signed callbacks use independent budgets. Uploads also have a per-account budget. Fixed windows do not slide on rejected attempts. Expired rows are pruned in capped batches with `SKIP LOCKED`.
- **Slow/unbounded request lifetime:** streaming bodies enforce size and elapsed time even without Content-Length. JSON has a 16 KiB limit and 10-second deadline; image bodies retain the existing 3 MiB image limit plus multipart allowance and a 30-second deadline. Declared excessive bodies fail before authentication; JSON forms require their correct content type. Readers do not await potentially stalled cancellation hooks.
- **CSRF trusted the incoming Host:** mutation origins now match configured APP_ORIGIN, including scheme. Cross-site Fetch Metadata is rejected even without Origin. Signed payment callbacks are exempt from browser-origin checks and still require HMAC and independent provider verification. Non-browser clients without Origin remain subject to authorization/signatures.
- **Pre-hydration auth submission:** reused the shared hydration hook to keep submit controls disabled until their validated handlers are attached.
- **Missing browser security policy:** fresh script nonces, strict-dynamic CSP, framing/object/form restrictions, nosniff, referrer and permissions headers. Next hydration receives the same nonce as the response. Root rendering awaits a request; nonce HTML is private/no-store and cannot be statically shared. Inline styles remain allowed for existing charts/motion; production scripts allow neither unsafe-inline nor unsafe-eval. Development eval remains necessary for Next.js debugging.
- **Drive redirect/timeout gaps:** each redirect is validated against HTTPS Google-owned download/CDN hosts with a hop limit. Requests have a header deadline; ongoing media retains browser cancellation without a fixed playback cutoff. Malformed, multi-range, reversed and unsafe-integer ranges are rejected. Cloudinary POSTs cannot follow redirects.
- **Missing security event records:** bounded structured events include a code, status and server-generated request ID; no emails, IPs, passwords, URLs with tokens, request bodies or provider exceptions. Repeated flood/forbidden denials are sampled. 5xx and invalid payment-signature errors are recorded. Operational log retention/alerts are still a deployment responsibility.
- **Dependency drift:** installed Next/React versions are pinned, with the existing lockfile retained. A CI workflow pins action commits, uses npm ci, and gates production dependency audit, security tests, lint, architecture, build, types and secret scans.

## All ten categories

| OWASP 2025 category | Controls and evidence | Limitations / follow-up |
| --- | --- | --- |
| A01 Broken Access Control | Server identity and database admin membership, ownership-scoped receipts/learning/resources, RLS, revoked privileged RPCs; tests deny anonymous/student admin access, forged metadata and direct settlement. | An admin is intentionally powerful. Protect admin mailboxes and enable provider MFA when the product supports it. |
| A02 Security Misconfiguration | Security headers/CSP, server-only credentials, API no-store, private limiter table, SQL empty search_path; local/hosted database advisor checks. | Edge firewall and production alerts require Vercel account configuration; they are not silently claimed as enabled here. |
| A03 Software Supply Chain Failures | Lockfile, pinned runtime versions, immutable CI action references, runtime npm audit and secret scan. | Five high dev-tooling findings share the unfixed braces advisory below. |
| A04 Cryptographic Failures | Supabase manages salted password hashing and sessions; payment HMAC uses timing-safe comparison; HTTPS provider URLs; private credentials and HMAC-hashed rate identities. | Secret rotation, provider encryption and backup access are operational responsibilities. No custom password storage was introduced. |
| A05 Injection | Supabase parameterized queries, static SQL, allowlisted sorting; React escaping and no user-data HTML/eval sinks found. Tests submit SQL-like searches/sort expressions and verify tables remain intact. | No exploitable SQL injection was found in reviewed paths. Quotes are valid data and are not indiscriminately stripped. |
| A06 Insecure Design | Database constraints, course revision CAS, payment serialization/replay defenses, verification-gated new enrollments, resource budgets. | Fixed-window rate limits are abuse mitigation, not a replacement for edge DDoS protection. |
| A07 Authentication Failures | Server getUser/access checks, email confirmation, current-password checks for sensitive changes, expiring session-bound recovery grants, auth/email budgets. | Supabase's direct Auth API has its own provider limits; Next.js limits do not wrap that separate service. |
| A08 Software or Data Integrity Failures | Server-owned course amounts, signed callbacks plus provider amount/currency/reference checks, unique payment/enrollment keys, atomic recovery consumption, revision conflicts. | Hosted gateway outcomes must remain the authority; redirects never grant access. Refund automation remains outside this stage. |
| A09 Security Logging and Alerting Failures | Safe structured security records, request IDs, sampled denial logs, CI checks and repeatable local tests. | Configure Vercel/Supabase retention, alert recipients and incident response; application logs alone do not provide automatic monitoring. |
| A10 Mishandling of Exceptional Conditions | Body/upstream/database timeouts, controlled errors, fail-closed limiter outages, Retry-After, abortable streams and concurrency regressions. | An unavailable database intentionally returns 503 instead of bypassing protection; provider retries remain necessary for webhook delivery. |

## Rate policies and trust boundaries

Canonical settings: `modules/config/security.ts`; existing image limits remain in `modules/config/image-upload.ts`.

| Scope | Budget |
| --- | --- |
| Public document requests | 600 / minute / edge IP |
| API reads | 600 / minute / edge IP |
| Login + signup | 30 / 15 minutes / edge IP |
| Recovery + confirmation emails | 8 / 15 minutes / edge IP |
| Image uploads | 15 / minute / edge IP **and account** |
| Other API mutations | 120 / minute / edge IP |
| Payment JSON webhook | 300 / minute / edge IP |

Only Vercel's overwritten `x-vercel-forwarded-for` is trusted when the server identifies itself as running on Vercel (`VERCEL=1`). Arbitrary forwarded headers are ignored locally. Other deployment platforms need an explicitly trusted ingress adapter; the safe fallback shares one bucket. Supabase server secrets salt identities; rotating that secret also rotates bucket identifiers. Bodies and database counters are never controlled by client-supplied limits. Shared campus/NAT addresses share IP limits, so adjust central policies based on observed legitimate traffic.

API limits do **not** protect requests sent directly to Supabase. RLS and RPC grants remain the authorization boundary there; PostgreSQL roles use 3-second anonymous and 8-second authenticated/service statement limits. Provider Auth has its own rate limits. Non-Next.js static/image-optimization assets rely on hosting/CDN defenses. Large distributed attacks with many genuine IPs require Vercel edge firewall/DDoS controls before requests reach app/database compute; database throttling alone cannot guarantee cost or availability under those attacks. No live flooding was performed.

## Dependency exception — review by 19 October 2026

`npm audit` reports five high findings from dev-only `braces` → micromatch → fast-glob → Next ESLint tooling. [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) covers stack exhaustion on nested glob patterns. The registry's latest braces is still 3.0.3; no patched release was available at review time. Application routes do not use this chain or accept glob expressions, and uploaded assets are not stored in the source workspace. Runtime audit has zero findings. npm's suggested force fix downgrades Next ESLint to 14.2.35 and is deliberately not applied. Recheck the advisory/registry by the review date and update tooling once a compatible fix is released. CI evaluates runtime findings as a gate; this dev-only exception is not hidden or represented as fixed.

## Reproduce checks

- `npm run test:security` — bounded bodies, stalled cancellation, trusted origins/IPs, ranges, redirect SSRF, policy configuration.
- `BACKEND_SUITE=security npm run backend:test` — isolated database concurrency, injection, authorization, real-browser CSP and request throttling.
- `BACKEND_SUITE=payments npm run backend:test` — isolated provider mock, callback replay, price tampering, ownership and payment UI.
- `npm run backend:test` — authentication, ownership/RLS, learning, administration and browser regressions.
- `npm run lint`, `npm run typecheck`, `npm run test:architecture`, `npm run build`, `node scripts/backend/check-secrets.cjs`, `npm audit --omit=dev`.

Backend tests require the pre-existing isolated local Supabase instance and `/tmp/khatab-supabase-status.json`; they explicitly refuse non-loopback test configuration. Browser binaries/libraries are prerequisites. Production receives only migrations and code, never fixture seeds. Live checks are low-volume read-only/denied-request smoke checks.

## Verification receipt

- Local unit/integration/production-build acceptance: **328 checks passed** (12 security unit, 4 image unit, 29 security integration, 56 payment, 190 backend, 27 analytics, 10 production-browser).
- Lint, types, production build, architecture (703 files), secret scan and diff check passed; unrelated regenerated screenshots restored.
- Local/hosted database advisors: no issues. Hosted RPC grants and role timeout values verified after migration; no hosted test fixtures or seeds.
- Release code: `34a63edd9546f9d4719b6428f705858809624e68`; [GitHub CI run](https://github.com/Zack-River/MohammedKhattab/actions/runs/38257401591) passed every gate, including a fresh npm ci/build without local credentials.
- **Deployed and verified:** Vercel reports success for application release `34a63ed`. All 11 low-volume production checks pass: CSP/nonce/script restrictions, security headers, public page rendering, guest denial on admin/payment APIs, CSRF denial, oversized-body denial and unsigned-webhook denial. The docs-only `def4639` deployment was canceled; application code remains the verified release. No production load test, real charge or account mutation was performed. Receipt: `VERIFICATION.json`.

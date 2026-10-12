# Fawaterak payments

Ta3allam uses Fawaterak OAuth API v3 and its hosted Arabic checkout. No card information is handled or stored by this app. Gateway documentation: https://app.fawaterk.com/documentation.

## Production setup

Save these server-only variables in Vercel Production and redeploy:

- `FAWATERAK_CLIENT_ID`
- `FAWATERAK_CLIENT_SECRET`
- `FAWATERAK_TOKEN_URL` — `https://app.fawaterk.com/oauth/token`
- `HASH_API_KEY` — Fawaterak's merchant API key used for the transaction webhook HMAC.
- `APP_ORIGIN` — the deployed website origin, currently `https://ta3allam.zackriver.com`
- `SUPABASE_SECRET_KEY` — the existing Supabase server key.

The locally supplied `PROVIDER_KEY` belongs to Fawaterak's embedded browser integration. This implementation uses server-created hosted checkout, so it does not expose or require that key.

Each transaction sends `${APP_ORIGIN}/api/payments/fawaterak/webhook_json` as its paid/pending webhook URL. The `_json` suffix requests JSON callbacks. Browser success, failure, pending, and back URLs all return to `/payments/<order UUID>`; browser redirects never grant course access.

## Purchase and activation

- `/checkout/<course slug>` reviews the currently published course and price.
- `POST /api/payments/checkout` accepts only `courseSlug`; price and currency come from the database.
- Verified email and manually verified phone are required before checkout. Existing free enrollment remains available through the enrollment API.
- A database lock and active-order uniqueness constraint prevent concurrent checkout requests creating duplicate intents. Unused pending links are reused until expiry; interrupted creation becomes retryable after five minutes.
- The server verifies the webhook HMAC, fetches the provider transaction independently, and compares intent, transaction ID, merchant reference, EGP currency, and the immutable order amount.
- A service-only database function atomically records payment and activates enrollment. Repeated callbacks create one enrollment. Unpaid callbacks and forged success redirects cannot activate a course.
- If contact verification changes during checkout, the payment is retained and activation waits for reverification. The student opens their payment result and selects “التحقق من الدفع” after verification; no second payment is required.
- The result page polls briefly and offers manual reconciliation. A persisted 15-second cooldown limits provider lookup requests across browser tabs and server instances.
- Order APIs and pages are owner-only. Students cannot execute settlement functions or edit payment records.
- Financial records survive account deletion, and courses with payment records cannot be deleted. Unpublish them instead.
- Admin weekly/monthly revenue counts confirmed **live** payments in EGP before provider fees. Test/staging payments are excluded. Refund accounting and automatic refund access revocation are not implemented.

## Hosted checkout URL compatibility

Fawaterak currently returns shortened `/ts/<id>?lg=ar` URLs, in addition to documented `/transactions/<intent>` URLs. Both are accepted only on the configured gateway origin. Foreign origins, embedded credentials, unrelated paths, malformed URLs and invalid intent UUIDs are rejected. A failed creation without a saved checkout URL holds its order for five minutes before a retry can replace it; this avoids duplicate concurrent intents after uncertain upstream failures.

## Validation

`LD_LIBRARY_PATH=/tmp/khatab-browser-libs/root/usr/lib/x86_64-linux-gnu BACKEND_SUITE=payments npm run backend:test`

The isolated suite starts a local mock provider and local Supabase. It covers checkout ownership, contact verification, immutable pricing, callback signatures, currency/reference/transaction mismatches, concurrent replay, reconciliation throttling, activation after reverification, revenue authorization, and responsive browser checkout. The mock origin is accepted only in development against a local Supabase URL and cannot be used in a production build.

Real credentials have passed read-only OAuth and enabled-payment-method checks. A real transaction and callback must still be exercised after production variables are saved; tests never charge money.

# Sales, offers, bundles and coupons

## Administrator workflow

- `/admin/dashboard/sales`: read-only real payment orders, student links, final amount, discount, coupon, status and date. Test payments are explicitly labelled. Search and status filters combine; five rows per page.
- `/admin/dashboard/commerce/bundles`: create/edit/remove a bundle, set a positive whole-EGP price, select 2–20 distinct courses, enable or disable it. All included courses must be published before enabling. Published bundles appear below the course catalog and on `/bundles` and `/bundles/[slug]`.
- `/admin/dashboard/commerce/offers`: assign an offer to exactly one course or bundle. Choose percentage or whole-EGP fixed discount, optional start/end dates, and enable/disable. One enabled offer per target; disable the previous offer before enabling another. Dates are entered in the administrator's device timezone and stored as timestamptz. Initial rendering stays deterministic until hydration, then displays local dates; Cairo-timezone round-trip is browser-tested.
- `/admin/dashboard/commerce/coupons`: uppercase code, percentage/fixed discount, optional course/bundle restriction, dates, minimum subtotal, total capacity, per-student limit and optional offer stacking. Blank target means global. Blank total limit means unlimited. Per-student limit defaults to one. Codes/URLs are immutable after creation.
- Optimistic revisions protect edits from lost updates. Referenced coupons/bundles cannot be deleted; disable them. A course referenced by a bundle/discount/payment cannot be deleted without first removing eligible references; existing enrollments/payments retain their existing protections.

No example promotions were activated on production. Configure the intended prices and campaigns through these screens.

## Student workflow

A course sale displays its original price struck through and its actual sale price. Offers do not change the underlying catalog base price. Bundle details list all included courses. Checkout accepts a coupon and shows base price → offer reduction → coupon reduction → final amount. Removing the coupon requests a fresh quote.

One product (course or bundle) and at most one coupon per checkout. Percentage calculations floor to the nearest minor currency unit; reductions clamp at the subtotal. A non-stackable coupon cannot be used when an offer applies. Minimum spend is checked after the offer. This version does not prorate partially owned bundles: a bundle containing an already owned course is rejected/redirected to the library. Pending overlapping orders cannot produce another checkout.

Email/phone verification remains mandatory, including zero-total purchases. A 100% discount grants access atomically without a gateway transaction. Paid checkout uses the existing Fawaterak integration. Browser input never supplies the charged price; an optional expected total only guards against unexpected price changes and cannot override database pricing.

## Data and pricing architecture

Migration `20261012190453_commerce_sales_bundles_coupons.sql` adds normalized bundles, bundle members, discounts and payment-order items. Existing course orders are backfilled; a trigger maintains single-course item snapshots for older clients. Existing payments are preserved.

The quote RPC owns pricing. Catalog sale prices and bundle listings are fetched in batches. Payment creation rechecks publication, dates, target restrictions, contacts, enrollment and coupon capacity within its transaction. User-level advisory locks prevent overlapping purchases; discount-row locks serialize competing reservations. Order items and `pricing_snapshot` preserve courses, prices and applied codes across later configuration changes. Webhook settlement verifies the original amount and grants all snapshot courses idempotently. Contact changes defer access but preserve the payment; re-verification activates the whole bundle on reconciliation.

Coupon capacity counts paid orders and active reservations. A provider intent retains its reservation after local expiry until the provider confirms failure, protecting against delayed valid callbacks. This is deliberately conservative: an expired provider-backed order can still occupy capacity until its status is reconciled. Refunds and manual reservation release are not included in this first version.

New configuration/item tables have RLS enabled and no anonymous/authenticated grants. RPCs are callable only by the service role. Next.js admin APIs require a current authorized admin identity; mutation endpoints also require the configured same origin and existing request budgets/body limits. Public quotes exclude internal coupon identifiers and configuration. Student receipts remain owner-only. Admin sales responses omit gateway keys/checkout URLs.

## Files and verification

Presentation lives in small `modules/components/commerce/` components, interaction state in focused hooks, decoders/validation in `modules/features/commerce/helpers/`, reads/writes in repositories, and page composition in feature adapters. Arabic copy and input limits are centralized. Shared forms, select menus, checkboxes, dialogs, tables, pagination, buttons, tokens and reveal behavior are reused; no package was added.

Run `BACKEND_SUITE=commerce npm run backend:test` with isolated local Supabase and browser libraries, then `BACKEND_SUITE=payments npm run backend:test`, `npm run test:security`, `npm run test:architecture`, lint and production build. Commerce acceptance covers authorization/RLS, server prices, dates/scopes/stacking/minimum, race limits, snapshots, replay, zero-total checkout, deletion/revision guards, real sales records, browser create/delete/search, coupon apply/remove and 320/390/768/1440px layouts. All gateway tests use the isolated simulator; no real payment is charged.

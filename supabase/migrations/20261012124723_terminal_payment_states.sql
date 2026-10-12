ALTER TABLE "public"."payment_orders"
  DROP CONSTRAINT "payment_orders_status_check";

ALTER TABLE "public"."payment_orders"
  ADD CONSTRAINT "payment_orders_status_check" CHECK ((status = ANY (ARRAY['creating'::text, 'pending'::text, 'paid'::text, 'expired'::text, 'failed'::text])));


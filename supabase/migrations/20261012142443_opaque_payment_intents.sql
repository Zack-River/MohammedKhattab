SET local check_function_bodies = off;

DROP FUNCTION "public"."settle_course_payment"(uuid, uuid, bigint, integer, text);

ALTER TABLE "public"."payment_orders"
  ALTER COLUMN "provider_intent_key" DROP DEFAULT;

ALTER TABLE "public"."payment_orders"
  ALTER COLUMN "provider_intent_key" TYPE text USING "provider_intent_key"::text;

CREATE OR REPLACE FUNCTION public.settle_course_payment (
  p_order       uuid,
  p_intent      text,
  p_transaction bigint,
  p_amount      integer,
  p_currency    text
)
  RETURNS void
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
declare o public.payment_orders;
begin
 if p_order is null or p_intent is null or p_transaction is null or p_amount is null or p_currency is null then
  raise exception 'PAYMENT_MISMATCH';
 end if;
 -- Use the same lock order as begin_course_payment: advisory, contacts, order.
 select * into o from public.payment_orders where id=p_order;
 if o.id is null then raise exception 'PAYMENT_MISMATCH'; end if;
 perform pg_advisory_xact_lock(hashtextextended(o.user_id::text||o.course_slug,0));
 perform 1 from public.account_contacts where user_id=o.user_id for update;
 select * into o from public.payment_orders where id=p_order for update;
 if o.id is null or o.provider_intent_key is distinct from p_intent or o.amount_minor<>p_amount or o.currency<>p_currency or p_transaction<=0 then raise exception 'PAYMENT_MISMATCH'; end if;
 if o.status='paid' and o.transaction_id<>p_transaction then raise exception 'PAYMENT_MISMATCH'; end if;
 update public.payment_orders set status='paid',transaction_id=p_transaction,paid_at=coalesce(paid_at,now()) where id=p_order;
 if private.contacts_verified(o.user_id) then
  insert into public.enrollments(user_id,course_slug) values(o.user_id,o.course_slug) on conflict(user_id,course_slug) do nothing;
 end if;
end $function$;

REVOKE ALL ON FUNCTION "public"."settle_course_payment"(uuid, text, bigint, integer, text) FROM PUBLIC, "anon", "authenticated";

ALTER TABLE "public"."payment_orders"
  ADD CONSTRAINT "payment_orders_intent_format_check" CHECK (((provider_intent_key IS NULL) OR (provider_intent_key ~ '^[a-zA-Z0-9_-]{1,128}$'::text)));

REVOKE ALL ON FUNCTION "public"."settle_course_payment"(uuid, text, bigint, integer, text) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."settle_course_payment"(uuid, text, bigint, integer, text) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."settle_course_payment"(uuid, text, bigint, integer, text) TO "service_role";

NOTIFY pgrst, 'reload schema';


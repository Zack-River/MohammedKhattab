SET local check_function_bodies = off;

CREATE TABLE "private"."request_buckets" (
  "bucket"       text                     NOT NULL,
  "window_start" timestamp with time zone NOT NULL,
  "hits"         integer                  NOT NULL,
  "expires_at"   timestamp with time zone NOT NULL,
  CONSTRAINT "request_buckets_bucket_check" CHECK ((length(bucket) = 64)),
  CONSTRAINT "request_buckets_hits_check" CHECK ((hits > 0)),
  CONSTRAINT "request_buckets_pkey" PRIMARY KEY (bucket)
);

ALTER TABLE "private"."request_buckets"
  ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.consume_request_budget (
  p_bucket  text,
  p_limit   integer,
  p_seconds integer
)
  RETURNS jsonb
  LANGUAGE plpgsql
  SET search_path TO ''
  SET statement_timeout TO '3s'
  AS $function$
declare b private.request_buckets; t timestamptz:=clock_timestamp();
begin
 if p_bucket is null or p_limit is null or p_seconds is null or p_bucket !~ '^[a-f0-9]{64}$' or p_limit not between 1 and 10000 or p_seconds not between 1 and 3600 then
  raise exception 'INVALID_INPUT';
 end if;
 -- Cleanup is capped so a request cannot trigger an unbounded delete.
 delete from private.request_buckets where bucket in
  (select bucket from private.request_buckets where expires_at<t order by expires_at limit 64 for update skip locked);
 insert into private.request_buckets as existing(bucket,window_start,hits,expires_at)
 values(p_bucket,t,1,t+make_interval(secs=>p_seconds))
 on conflict(bucket) do update set
  window_start=case when existing.expires_at<=t then t else existing.window_start end,
  hits=case when existing.expires_at<=t then 1 else least(existing.hits+1,p_limit+1) end,
  expires_at=case when existing.expires_at<=t then t+make_interval(secs=>p_seconds) else existing.expires_at end
 returning * into b;
 return jsonb_build_object('allowed',b.hits<=p_limit,'retryAfter',greatest(1,ceil(extract(epoch from b.expires_at-t))::integer));
end $function$;

REVOKE ALL ON FUNCTION "public"."consume_request_budget"(text, integer, integer) FROM PUBLIC, "anon", "authenticated";

CREATE OR REPLACE FUNCTION public.settle_course_payment (
  p_order       uuid,
  p_intent      uuid,
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

CREATE INDEX request_buckets_expiry_idx ON private.request_buckets USING btree (expires_at);

REVOKE ALL ON FUNCTION "public"."consume_request_budget"(text, integer, integer) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."consume_request_budget"(text, integer, integer) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."consume_request_budget"(text, integer, integer) TO "service_role";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "private"."request_buckets" TO "service_role";

-- Role settings are not captured by schema diff; apply them explicitly to Data API roles.
ALTER ROLE anon SET statement_timeout='3s';
ALTER ROLE authenticated SET statement_timeout='8s';
ALTER ROLE service_role SET statement_timeout='8s';
NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';

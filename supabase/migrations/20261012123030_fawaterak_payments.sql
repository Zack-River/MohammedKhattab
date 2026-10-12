SET local check_function_bodies = off;

CREATE TABLE "public"."payment_orders" (
  "id"                  uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"             uuid,
  "course_slug"         text                     NOT NULL,
  "course_title"        text                     NOT NULL,
  "amount_minor"        integer                  NOT NULL,
  "currency"            text                     NOT NULL DEFAULT 'EGP'::text,
  "status"              text                     NOT NULL DEFAULT 'creating'::text,
  "provider_intent_key" uuid,
  "checkout_url"        text,
  "transaction_id"      bigint,
  "live"                boolean                  NOT NULL,
  "created_at"          timestamp with time zone NOT NULL DEFAULT now(),
  "expires_at"          timestamp with time zone NOT NULL DEFAULT (now() + '2 days'::interval),
  "paid_at"             timestamp with time zone,
  CONSTRAINT "payment_orders_amount_minor_check" CHECK ((amount_minor > 0)),
  CONSTRAINT "payment_orders_currency_check" CHECK ((currency = 'EGP'::text)),
  CONSTRAINT "payment_orders_pkey" PRIMARY KEY (id),
  CONSTRAINT "payment_orders_provider_intent_key_key" UNIQUE (provider_intent_key),
  CONSTRAINT "payment_orders_status_check" CHECK ((status = ANY (ARRAY['creating'::text, 'pending'::text, 'paid'::text, 'expired'::text]))),
  CONSTRAINT "payment_orders_transaction_id_key" UNIQUE (transaction_id)
);

ALTER TABLE "public"."payment_orders"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."payment_orders" FROM "anon";

CREATE OR REPLACE FUNCTION public.begin_course_payment (
  p_user uuid,
  p_slug text,
  p_live boolean
)
  RETURNS jsonb
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
declare c public.courses; o public.payment_orders;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_user::text||p_slug,0));
 if exists(select 1 from public.enrollments where user_id=p_user and course_slug=p_slug) then raise exception 'ALREADY_ENROLLED'; end if;
 select * into c from public.courses where slug=p_slug and published;
 if c.slug is null or c.amount<=0 then raise exception 'INVALID_PAYMENT_COURSE'; end if;
 update public.payment_orders set status='expired' where user_id=p_user and course_slug=p_slug and status in ('creating','pending') and (expires_at<now() or (status='creating' and created_at<now()-interval '5 minutes'));
 select * into o from public.payment_orders where user_id=p_user and course_slug=p_slug and status in ('creating','pending');
 if o.id is not null then return jsonb_build_object('order',to_jsonb(o),'created',false); end if;
 insert into public.payment_orders(user_id,course_slug,course_title,amount_minor,live) values(p_user,p_slug,c.title,c.amount*100,p_live) returning * into o;
 return jsonb_build_object('order',to_jsonb(o),'created',true);
end $function$;

REVOKE ALL ON FUNCTION "public"."begin_course_payment"(uuid, text, boolean) FROM PUBLIC, "anon", "authenticated";

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
 select * into o from public.payment_orders where id=p_order for update;
 if o.id is null or o.provider_intent_key is distinct from p_intent or o.amount_minor<>p_amount or o.currency<>p_currency or p_transaction<=0 then raise exception 'PAYMENT_MISMATCH'; end if;
 if o.status='paid' then
  if o.transaction_id<>p_transaction then raise exception 'PAYMENT_MISMATCH'; end if;
  return;
 end if;
 update public.payment_orders set status='paid',transaction_id=p_transaction,paid_at=now() where id=p_order;
 if o.user_id is not null then
  insert into public.enrollments(user_id,course_slug) values(o.user_id,o.course_slug) on conflict(user_id,course_slug) do nothing;
 end if;
end $function$;

REVOKE ALL ON FUNCTION "public"."settle_course_payment"(uuid, uuid, bigint, integer, text) FROM PUBLIC, "anon", "authenticated";

ALTER TABLE "public"."payment_orders"
  ADD CONSTRAINT "payment_orders_course_slug_fkey" FOREIGN KEY (course_slug) REFERENCES public.courses(slug) ON DELETE RESTRICT;

ALTER TABLE "public"."payment_orders"
  ADD CONSTRAINT "payment_orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX payment_orders_active_idx ON public.payment_orders USING btree (user_id, course_slug)
  WHERE (status = ANY (ARRAY['creating'::text, 'pending'::text]));

CREATE INDEX payment_orders_course_idx ON public.payment_orders USING btree (course_slug);

CREATE INDEX payment_orders_paid_idx ON public.payment_orders USING btree (paid_at)
  WHERE ((status = 'paid'::text) AND live);

CREATE INDEX payment_orders_user_created_idx ON public.payment_orders USING btree (user_id, created_at DESC);

CREATE POLICY "payment_owner_read" ON "public"."payment_orders"
  FOR SELECT
  TO "authenticated"
  USING (((user_id = ( SELECT auth.uid() AS uid)) AND ( SELECT public.account_access_allowed() AS account_access_allowed)));

REVOKE ALL ON FUNCTION "public"."begin_course_payment"(uuid, text, boolean) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."begin_course_payment"(uuid, text, boolean) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."begin_course_payment"(uuid, text, boolean) TO "service_role";

REVOKE ALL ON FUNCTION "public"."settle_course_payment"(uuid, uuid, bigint, integer, text) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."settle_course_payment"(uuid, uuid, bigint, integer, text) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."settle_course_payment"(uuid, uuid, bigint, integer, text) TO "service_role";

REVOKE ALL ON TABLE "public"."payment_orders" FROM "authenticated";

GRANT SELECT ON TABLE "public"."payment_orders" TO "authenticated";

REVOKE ALL ON TABLE "public"."payment_orders" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."payment_orders" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."payment_orders" TO "service_role";


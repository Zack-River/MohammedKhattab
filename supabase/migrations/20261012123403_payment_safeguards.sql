SET local check_function_bodies = off;

ALTER TABLE "public"."payment_orders"
  ADD COLUMN "last_checked_at" timestamp WITH time zone;

CREATE OR REPLACE FUNCTION private.delete_admin_course (
  p_slug text
)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
begin
 if not private.account_access_allowed() or not exists(select 1 from public.admin_users where user_id=(select auth.uid())) then raise exception 'FORBIDDEN' using errcode='42501'; end if;
 perform 1 from public.courses where slug=p_slug for update;
 if not found then raise exception 'NOT_FOUND' using errcode='P0002'; end if;
 if exists(select 1 from public.enrollments where course_slug=p_slug) then raise exception 'COURSE_HAS_STUDENTS' using errcode='P0001'; end if;
 if exists(select 1 from public.payment_orders where course_slug=p_slug) then raise exception 'COURSE_HAS_PAYMENTS' using errcode='P0001'; end if;
 delete from public.courses where slug=p_slug;
end $function$;

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
 perform 1 from public.account_contacts where user_id=p_user for update;
 if not exists(select 1 from public.account_contacts x join auth.users u on u.id=x.user_id where x.user_id=p_user and x.email=u.email and x.pending_email is null and nullif(u.email_change,'') is null and x.email_verified_at is not null and u.email_confirmed_at is not null and x.phone_e164 is not null and x.phone_verified_at is not null) then raise exception 'CONTACT_VERIFICATION_REQUIRED'; end if;
 if exists(select 1 from public.enrollments where user_id=p_user and course_slug=p_slug) then raise exception 'ALREADY_ENROLLED'; end if;
 select * into c from public.courses where slug=p_slug and published for share;
 if c.slug is null or c.amount<=0 then raise exception 'INVALID_PAYMENT_COURSE'; end if;
 update public.payment_orders set status='expired' where user_id=p_user and course_slug=p_slug and status in ('creating','pending') and (expires_at<now() or (status='creating' and created_at<now()-interval '5 minutes'));
 select * into o from public.payment_orders where user_id=p_user and course_slug=p_slug and status in ('creating','pending');
 if o.id is not null then return jsonb_build_object('order',to_jsonb(o),'created',false); end if;
 insert into public.payment_orders(user_id,course_slug,course_title,amount_minor,live) values(p_user,p_slug,c.metadata->>'title',c.amount*100,p_live) returning * into o;
 return jsonb_build_object('order',to_jsonb(o),'created',true);
end $function$;

CREATE OR REPLACE FUNCTION public.claim_payment_check (
  p_order uuid
)
  RETURNS boolean
  LANGUAGE sql
  SET search_path TO ''
  AS $function$
 with claimed as(update public.payment_orders set last_checked_at=now() where id=p_order and (last_checked_at is null or last_checked_at<now()-interval '15 seconds') returning id) select exists(select 1 from claimed);
$function$;

REVOKE ALL ON FUNCTION "public"."claim_payment_check"(uuid) FROM PUBLIC, "anon", "authenticated";

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
 if o.status='paid' and o.transaction_id<>p_transaction then raise exception 'PAYMENT_MISMATCH'; end if;
 update public.payment_orders set status='paid',transaction_id=p_transaction,paid_at=coalesce(paid_at,now()) where id=p_order;
 perform 1 from public.account_contacts where user_id=o.user_id for update;
 if exists(select 1 from public.account_contacts x join auth.users u on u.id=x.user_id where x.user_id=o.user_id and x.email=u.email and x.pending_email is null and nullif(u.email_change,'') is null and x.email_verified_at is not null and u.email_confirmed_at is not null and x.phone_e164 is not null and x.phone_verified_at is not null) then
  insert into public.enrollments(user_id,course_slug) values(o.user_id,o.course_slug) on conflict(user_id,course_slug) do nothing;
 end if;
end $function$;

REVOKE ALL ON FUNCTION "public"."claim_payment_check"(uuid) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."claim_payment_check"(uuid) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."claim_payment_check"(uuid) TO "service_role";


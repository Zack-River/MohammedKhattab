SET local check_function_bodies = off;

CREATE OR REPLACE FUNCTION private.payment_revenue_snapshot()
  RETURNS jsonb
  LANGUAGE plpgsql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare local_now timestamp:=now() at time zone 'Africa/Cairo'; week_start timestamptz:=date_trunc('week',local_now) at time zone 'Africa/Cairo'; month_start timestamptz:=date_trunc('month',local_now) at time zone 'Africa/Cairo'; result jsonb;
begin
 if not private.account_access_allowed() or not exists(select 1 from public.admin_users where user_id=(select auth.uid())) then raise exception 'FORBIDDEN' using errcode='42501'; end if;
 select jsonb_build_object('week',coalesce(sum(amount_minor) filter(where paid_at>=week_start),0),'month',coalesce(sum(amount_minor) filter(where paid_at>=month_start),0),'previousWeek',coalesce(sum(amount_minor) filter(where paid_at>=week_start-interval '7 days' and paid_at<now()-interval '7 days'),0),'previousMonth',coalesce(sum(amount_minor) filter(where paid_at>=month_start-interval '1 month' and paid_at<(local_now-interval '1 month') at time zone 'Africa/Cairo'),0)) into result from public.payment_orders where status='paid' and live;
 return result;
end $function$;

CREATE OR REPLACE FUNCTION public.payment_revenue_snapshot()
  RETURNS jsonb
  LANGUAGE sql
  STABLE
  SET search_path TO ''
  AS $function$ select private.payment_revenue_snapshot(); $function$;

REVOKE ALL ON FUNCTION "public"."payment_revenue_snapshot"() FROM PUBLIC, "anon";

REVOKE ALL ON FUNCTION "private"."payment_revenue_snapshot"() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "private"."payment_revenue_snapshot"() TO "authenticated";

GRANT EXECUTE ON FUNCTION "public"."payment_revenue_snapshot"() TO "authenticated";

REVOKE ALL ON FUNCTION "public"."payment_revenue_snapshot"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."payment_revenue_snapshot"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."payment_revenue_snapshot"() TO "service_role";


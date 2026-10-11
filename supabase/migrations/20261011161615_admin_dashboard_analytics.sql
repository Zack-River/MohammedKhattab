SET local check_function_bodies = off;

CREATE OR REPLACE FUNCTION private.admin_dashboard_snapshot()
  RETURNS jsonb
  LANGUAGE plpgsql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare
  zone constant text := 'Africa/Cairo';
  local_now timestamp := now() at time zone zone;
  week_local timestamp := date_trunc('week', local_now);
  month_local timestamp := date_trunc('month', local_now);
  week_start timestamptz := week_local at time zone zone;
  previous_week_start timestamptz := (week_local - interval '7 days') at time zone zone;
  previous_week_end timestamptz := (local_now - interval '7 days') at time zone zone;
  month_start timestamptz := month_local at time zone zone;
  previous_month_local timestamp := month_local - interval '1 month';
  previous_month_start timestamptz := previous_month_local at time zone zone;
  previous_month_end timestamptz := least(previous_month_local + (local_now - month_local), month_local) at time zone zone;
  result jsonb;
begin
  if not private.account_access_allowed() or not exists(select 1 from public.admin_users where user_id = (select auth.uid())) then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;
  with students as materialized (
    select u.id, u.created_at, case when u.raw_user_meta_data->>'acquisition_source' in ('youtube','facebook','instagram','tiktok','google','direct')
      then u.raw_user_meta_data->>'acquisition_source' else 'unknown' end as source
    from auth.users u where u.deleted_at is null and u.created_at <= now()
      and not exists(select 1 from public.admin_users a where a.user_id = u.id)
  ), subscriptions as materialized (
    select e.* from public.enrollments e join students s on s.id = e.user_id where e.created_at <= now()
  ), student_days as (
    select (created_at at time zone zone)::date as day, count(*) as value from students
    where created_at >= previous_month_start group by 1
  ), subscription_days as (
    select (created_at at time zone zone)::date as day, count(*) as value from subscriptions
    where created_at >= previous_month_start group by 1
  ), days as (
    select d::date as day, previous_month_local::date + (d::date - month_local::date) as previous_day
      from generate_series(month_local, local_now::date::timestamp, interval '1 day') d
  ), daily as (
    select jsonb_build_object('day',d.day,'students',coalesce(s.value,0),'enrollments',coalesce(e.value,0),
      'previousStudents',case when d.previous_day < month_local::date then coalesce(ps.value,0) end,
      'previousEnrollments',case when d.previous_day < month_local::date then coalesce(pe.value,0) end) as record, d.day
    from days d left join student_days s on s.day=d.day left join subscription_days e on e.day=d.day
      left join student_days ps on ps.day=d.previous_day left join subscription_days pe on pe.day=d.previous_day
  ), course_counts as (
    select c.slug, c.metadata, c.published, p.period,
      count(e.user_id) filter(where e.created_at >= p.start_at) as count,
      count(e.user_id) filter(where e.created_at >= p.previous_start and e.created_at < p.previous_end) as previous
    from public.courses c cross join (values
      ('week',week_start,previous_week_start,previous_week_end),
      ('month',month_start,previous_month_start,previous_month_end),
      ('all','-infinity'::timestamptz,null::timestamptz,null::timestamptz)
    ) p(period,start_at,previous_start,previous_end)
    left join subscriptions e on e.course_slug=c.slug group by c.slug,c.metadata,c.published,p.period
  ), ranked_courses as (
    select *,row_number() over(partition by period order by count desc,slug) as rank from course_counts where count > 0
  ), source_counts as (
    select source,count(*) as count from students where created_at >= month_start group by source
  )
  select jsonb_build_object(
    'generatedAt',now(),'timezone',zone,'weekStart',week_start,'monthStart',month_start,
    'metrics',jsonb_build_object(
      'studentsWeek',(select count(*) from students where created_at >= week_start),
      'studentsPreviousWeek',(select count(*) from students where created_at >= previous_week_start and created_at < previous_week_end),
      'studentsMonth',(select count(*) from students where created_at >= month_start),
      'studentsPreviousMonth',(select count(*) from students where created_at >= previous_month_start and created_at < previous_month_end),
      'totalStudents',(select count(*) from students),
      'enrollmentsWeek',(select count(*) from subscriptions where created_at >= week_start),
      'enrollmentsPreviousWeek',(select count(*) from subscriptions where created_at >= previous_week_start and created_at < previous_week_end),
      'enrollmentsMonth',(select count(*) from subscriptions where created_at >= month_start),
      'enrollmentsPreviousMonth',(select count(*) from subscriptions where created_at >= previous_month_start and created_at < previous_month_end),
      'totalEnrollments',(select count(*) from subscriptions),
      'studentsEnrolled',(select count(distinct user_id) from subscriptions),
      'publishedCourses',(select count(*) from public.courses where published),
      'completedLessons',(select count(*) from public.lesson_progress lp join students s on s.id=lp.user_id where lp.completed)),
    'daily',(select coalesce(jsonb_agg(record order by day),'[]'::jsonb) from daily),
    'courses',(select jsonb_object_agg(period, records) from (
      select p.period,coalesce((select jsonb_agg(jsonb_build_object('slug',r.slug,'title',r.metadata->>'title',
        'thumbnail',r.metadata->>'thumbnailUrl','delivery',coalesce(r.metadata->>'delivery','recorded'),
        'published',r.published,'count',r.count,'previous',r.previous) order by rank)
        from ranked_courses r where r.period=p.period and r.rank<=5),'[]'::jsonb) as records
      from (values ('week'),('month'),('all')) p(period)) buckets),
    'sources',(select coalesce(jsonb_agg(jsonb_build_object('source',source,'count',count) order by count desc,source),'[]'::jsonb) from source_counts)
  ) into result;
  return result;
end;
$function$;

CREATE OR REPLACE FUNCTION public.admin_dashboard_snapshot()
  RETURNS jsonb
  LANGUAGE sql
  STABLE
  SET search_path TO ''
  AS $function$
  select private.admin_dashboard_snapshot();
$function$;

REVOKE ALL ON FUNCTION "public"."admin_dashboard_snapshot"() FROM PUBLIC, "anon";

CREATE INDEX enrollments_created_course_idx ON public.enrollments USING btree (created_at, course_slug);

REVOKE ALL ON FUNCTION "private"."admin_dashboard_snapshot"() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "private"."admin_dashboard_snapshot"() TO "authenticated";

GRANT EXECUTE ON FUNCTION "public"."admin_dashboard_snapshot"() TO "authenticated";

REVOKE ALL ON FUNCTION "public"."admin_dashboard_snapshot"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."admin_dashboard_snapshot"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."admin_dashboard_snapshot"() TO "service_role";

-- Preserve enrollment anchors and learning history when administrators revoke access.
alter table public.enrollments add column active boolean not null default true;
alter table public.enrollments add column revision integer not null default 1 check(revision>0);
revoke insert on public.enrollments from authenticated;
grant insert(user_id,course_slug) on public.enrollments to authenticated;
create policy active_enrollment_insert on public.enrollments as restrictive for insert to authenticated with check(active and revision=1);
create policy active_progress on public.lesson_progress as restrictive for all to authenticated
 using(exists(select 1 from public.enrollments e where e.user_id=(select auth.uid()) and e.course_slug=lesson_progress.course_slug and e.active))
 with check(exists(select 1 from public.enrollments e where e.user_id=(select auth.uid()) and e.course_slug=lesson_progress.course_slug and e.active));
alter policy "admin_lessons_read" on public."lessons" using (((EXISTS ( SELECT 1
   FROM admin_users
  WHERE (admin_users.user_id = ( SELECT auth.uid() AS uid)))) OR ((EXISTS ( SELECT 1
   FROM courses c
  WHERE ((c.slug = lessons.course_slug) AND c.published))) AND (preview OR (EXISTS ( SELECT 1
   FROM enrollments e
  WHERE ((e.course_slug = lessons.course_slug) AND (e.active AND e.user_id = ( SELECT auth.uid() AS uid)))))))));
alter policy "lesson_access" on public."lessons" using (((EXISTS ( SELECT 1
   FROM courses c
  WHERE ((c.slug = lessons.course_slug) AND c.published))) AND (preview OR (EXISTS ( SELECT 1
   FROM enrollments e
  WHERE ((e.course_slug = lessons.course_slug) AND (e.active AND e.user_id = ( SELECT auth.uid() AS uid))))))));
alter policy "live_session_join_window" on public."live_session_links" using ((account_access_allowed() AND ((EXISTS ( SELECT 1
   FROM admin_users a
  WHERE (a.user_id = ( SELECT auth.uid() AS uid)))) OR (EXISTS ( SELECT 1
   FROM ((live_sessions s
     JOIN enrollments e ON ((e.course_slug = s.course_slug)))
     JOIN courses c ON ((c.slug = s.course_slug)))
  WHERE ((s.id = live_session_links.session_id) AND (e.active AND e.user_id = ( SELECT auth.uid() AS uid)) AND c.published AND s.enabled AND (s.starts_at <= statement_timestamp()) AND (s.ends_at > statement_timestamp())))))));
alter policy "resource_links" on public."lesson_resources" using (((EXISTS ( SELECT 1
   FROM admin_users
  WHERE (admin_users.user_id = ( SELECT auth.uid() AS uid)))) OR (EXISTS ( SELECT 1
   FROM (enrollments e
     JOIN courses c ON ((c.slug = e.course_slug)))
  WHERE ((e.course_slug = lesson_resources.course_slug) AND (e.active AND e.user_id = ( SELECT auth.uid() AS uid)) AND c.published)))));
alter policy "own_lesson_notes" on public."lesson_notes" using (((user_id = ( SELECT auth.uid() AS uid)) AND account_access_allowed() AND (EXISTS ( SELECT 1
   FROM (enrollments e
     JOIN courses c ON ((c.slug = e.course_slug)))
  WHERE ((e.active AND e.user_id = ( SELECT auth.uid() AS uid)) AND (e.course_slug = lesson_notes.course_slug) AND c.published)))));
CREATE OR REPLACE FUNCTION public.save_lesson_note(p_slug text, p_lesson text, p_text text, p_revision integer)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_revision integer;
begin
 perform 1 from public.enrollments where user_id=auth.uid() and course_slug=p_slug for share;
 if not public.account_access_allowed() or not exists(select 1 from public.enrollments e join public.courses c on c.slug=e.course_slug join public.lessons l on l.course_slug=c.slug where e.active and e.user_id=auth.uid() and c.slug=p_slug and c.published and l.id=p_lesson) then raise exception 'FORBIDDEN'; end if;
 if p_text is null or length(p_text)>4000 or p_revision is null or p_revision<0 then raise exception 'INVALID_INPUT'; end if;
 perform pg_advisory_xact_lock(hashtextextended('note:'||auth.uid()::text||':'||p_slug||':'||p_lesson,0));
 select revision into v_revision from public.lesson_notes where user_id=auth.uid() and course_slug=p_slug and lesson_id=p_lesson for update;
 if coalesce(v_revision,0) is distinct from p_revision then raise exception 'NOTE_CONFLICT'; end if;
 insert into public.lesson_notes(user_id,course_slug,lesson_id,text) values(auth.uid(),p_slug,p_lesson,p_text)
 on conflict(user_id,course_slug,lesson_id) do update set text=excluded.text,revision=lesson_notes.revision+1,updated_at=now() returning revision into v_revision;
 return v_revision;
end $function$
;
create table public.enrollment_events (
 id bigint generated always as identity primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 course_slug text not null references public.courses(slug) on delete cascade,
 actor_id uuid, action text not null check(action in ('grant','revoke','restore')),
 reason text not null check(length(btrim(reason)) between 1 and 500),
 revision integer not null check(revision>0), created_at timestamptz not null default now(),
 unique(user_id,course_slug,revision)
);
create index enrollment_events_user_created_idx on public.enrollment_events(user_id,created_at desc,id desc);
alter table public.enrollment_events enable row level security;
revoke all on public.enrollment_events from public,anon,authenticated;
grant select on public.enrollment_events to authenticated;
grant all on public.enrollment_events to service_role;
create policy admin_enrollment_events on public.enrollment_events for select to authenticated using(public.account_access_allowed() and exists(select 1 from public.admin_users where user_id=(select auth.uid())));
create function public.manage_enrollment(p_user uuid,p_slug text,p_action text,p_reason text,p_revision integer)
 returns void language plpgsql security definer set search_path='' as $$
declare e public.enrollments;
begin
 if not public.account_access_allowed() or not exists(select 1 from public.admin_users where user_id=auth.uid()) then raise exception 'FORBIDDEN'; end if;
 if p_user is null or p_slug is null or p_action is null or p_action not in ('grant','revoke','restore') or p_reason is null or length(btrim(p_reason)) not between 1 and 500 or p_revision is null or p_revision<0 or p_revision>=2147483647 then raise exception 'INVALID_INPUT'; end if;
 perform pg_advisory_xact_lock(hashtextextended('commerce:'||p_user::text,0));
 perform 1 from public.account_contacts where user_id=p_user for update;
 if not exists(select 1 from auth.users where id=p_user and deleted_at is null) then raise exception 'NOT_FOUND'; end if;
 perform 1 from public.courses where slug=p_slug for share;
 if not found then raise exception 'NOT_FOUND'; end if;
 select * into e from public.enrollments where user_id=p_user and course_slug=p_slug for update;
 if coalesce(e.revision,0)<>p_revision then raise exception 'ENROLLMENT_CONFLICT'; end if;
 if p_action='grant' then
  if e.user_id is not null then raise exception 'ENROLLMENT_CONFLICT'; end if;
  if not private.contacts_verified(p_user) then raise exception 'CONTACT_VERIFICATION_REQUIRED'; end if;
  insert into public.enrollments(user_id,course_slug) values(p_user,p_slug);
 else
  if e.user_id is null or (p_action='restore' and e.active) or (p_action='revoke' and not e.active) then raise exception 'ENROLLMENT_CONFLICT'; end if;
  update public.enrollments set active=(p_action='restore'),revision=revision+1 where user_id=p_user and course_slug=p_slug;
 end if;
 insert into public.enrollment_events(user_id,course_slug,actor_id,action,reason,revision) values(p_user,p_slug,auth.uid(),p_action,btrim(p_reason),p_revision+1);
end $$;
revoke all on function public.manage_enrollment(uuid,text,text,text,integer) from public,anon;
grant execute on function public.manage_enrollment(uuid,text,text,text,integer) to authenticated;

-- Fence in-flight progress writes against a concurrent revocation.
create function private.guard_progress_access() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if auth.role()='authenticated' then
  perform 1 from public.enrollments where user_id=auth.uid() and user_id=new.user_id and course_slug=new.course_slug and active for share;
  if not found then raise exception 'FORBIDDEN' using errcode='42501'; end if;
 end if;return new;
end $$;
revoke all on function private.guard_progress_access() from public,anon,authenticated;
create trigger guard_progress_access before insert or update on public.lesson_progress for each row execute function private.guard_progress_access();

create or replace function private.assert_commerce_access(p_user uuid,p_courses text[]) returns void language plpgsql set search_path='' as $$
begin
 if exists(select 1 from public.enrollments where user_id=p_user and course_slug=any(p_courses) and not active) then raise exception 'ENROLLMENT_REVOKED'; end if;
 if exists(select 1 from public.enrollments where user_id=p_user and course_slug=any(p_courses)) then raise exception 'ALREADY_ENROLLED'; end if;
 if exists(select 1 from public.payment_orders o join public.payment_order_items i on i.order_id=o.id where o.user_id=p_user and i.course_slug=any(p_courses) and o.status='paid') then raise exception 'PAYMENT_ALREADY_PAID'; end if;
 if exists(select 1 from public.payment_orders o join public.payment_order_items i on i.order_id=o.id where o.user_id=p_user and i.course_slug=any(p_courses) and o.status in ('creating','pending')) then raise exception 'PAYMENT_OVERLAP'; end if;
end $$;

CREATE OR REPLACE FUNCTION public.begin_commerce_payment(p_user uuid, p_kind text, p_slug text, p_coupon text, p_live boolean, p_expected integer DEFAULT NULL::integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare q jsonb; o public.payment_orders; v_courses text[];
begin
 perform pg_advisory_xact_lock(hashtextextended('commerce:'||p_user::text,0));
 perform 1 from public.account_contacts where user_id=p_user for update;
 if not private.contacts_verified(p_user) then raise exception 'CONTACT_VERIFICATION_REQUIRED'; end if;
 update public.payment_orders set status='expired' where user_id=p_user and status in ('creating','pending') and (expires_at<now() or (status='creating' and created_at<now()-interval '5 minutes'));
 select * into o from public.payment_orders where user_id=p_user and status in ('creating','pending') and ((p_kind='course' and course_slug=p_slug) or (p_kind='bundle' and bundle_slug=p_slug));
 if exists(select 1 from public.enrollments e join public.payment_order_items i on i.course_slug=e.course_slug where i.order_id=o.id and e.user_id=p_user and not e.active) then raise exception 'ENROLLMENT_REVOKED'; end if;
 if o.id is not null then
  if p_expected is not null and p_expected<>o.amount_minor then raise exception 'PAYMENT_PRICE_CHANGED'; end if;
  if exists(select 1 from public.enrollments e join public.payment_order_items i on i.course_slug=e.course_slug where i.order_id=o.id and e.user_id=p_user) then raise exception 'ALREADY_ENROLLED'; end if;
  if coalesce(o.pricing_snapshot->>'couponCode','')<>coalesce(upper(p_coupon),'') then raise exception 'PAYMENT_PRICE_LOCKED'; end if;
  return jsonb_build_object('order',to_jsonb(o),'created',false);
 end if;
 -- Lock configuration before reading. Bundle edits use bundle -> courses -> discounts ordering too.
 if p_kind='bundle' then perform 1 from public.commerce_bundles where slug=p_slug for share; end if;
 q:=private.commerce_product(p_kind,p_slug);
 select array_agg(value) into v_courses from jsonb_array_elements_text(q->'courseSlugs');
 perform 1 from public.courses where slug=any(v_courses) order by slug for share;
 perform 1 from public.commerce_discounts where (kind='offers' and ((p_kind='course' and course_slug=p_slug) or (p_kind='bundle' and bundle_slug=p_slug))) or (kind='coupons' and key=upper(p_coupon)) order by id for update;
 q:=public.quote_commerce(p_kind,p_slug,p_coupon,p_user);
 if (q->>'baseMinor')::integer<=0 then raise exception 'INVALID_PAYMENT_COURSE'; end if;
 if p_expected is not null and p_expected<>(q->>'totalMinor')::integer then raise exception 'PAYMENT_PRICE_CHANGED'; end if;
 perform private.assert_commerce_access(p_user,v_courses);
 insert into public.payment_orders(user_id,course_slug,bundle_slug,course_title,amount_minor,live,coupon_id,pricing_snapshot)
 values(p_user,case when p_kind='course' then p_slug end,case when p_kind='bundle' then p_slug end,q->>'title',(q->>'totalMinor')::integer,p_live,(q->>'couponId')::uuid,q) returning * into o;
 insert into public.payment_order_items(order_id,course_slug) select o.id,unnest(v_courses) on conflict do nothing;
 if o.amount_minor=0 then
  update public.payment_orders set status='paid',paid_at=now() where id=o.id returning * into o;
  insert into public.enrollments(user_id,course_slug) select p_user,unnest(v_courses) on conflict do nothing;
 end if;
 return jsonb_build_object('order',to_jsonb(o),'created',true);
end $function$
;

-- Count currently active entitlements in admin catalog and analytics.
CREATE OR REPLACE FUNCTION private.admin_dashboard_snapshot()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
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
    select e.* from public.enrollments e join students s on s.id = e.user_id where e.active and e.created_at <= now()
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
$function$
;
CREATE OR REPLACE FUNCTION private.search_admin_courses(p_search text DEFAULT ''::text, p_category text DEFAULT 'all'::text, p_statuses text[] DEFAULT '{}'::text[], p_delivery text DEFAULT 'all'::text, p_sort text DEFAULT 'created'::text, p_direction text DEFAULT 'desc'::text, p_page integer DEFAULT 1, p_limit integer DEFAULT 5)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare result jsonb; pattern text:='%'||replace(replace(replace(lower(p_search),'\','\\'),'%','\%'),'_','\_')||'%';
begin
 if not private.account_access_allowed() or not exists(select 1 from public.admin_users where user_id=(select auth.uid())) then raise exception 'FORBIDDEN' using errcode='42501'; end if;
 if p_search is null or p_category is null or p_statuses is null or p_delivery is null or p_sort is null or p_direction is null or p_page is null or p_limit is null or length(p_search)>100 or p_page<1 or p_page>999999 or p_limit<1 or p_limit>5 or p_sort not in ('created','updated','students') or p_direction not in ('asc','desc') or p_category not in ('all','editing','motion','design','business') or p_delivery not in ('all','recorded','live') or not(p_statuses <@ array['published','draft']) then raise exception 'INVALID_INPUT' using errcode='22023'; end if;
 with filtered as materialized (
  select c.*, (select count(*) from public.enrollments e where e.active and e.course_slug=c.slug) as students,
   (select count(*) from public.lessons l where l.course_slug=c.slug) as lessons,
   jsonb_array_length(coalesce(c.metadata->'modules','[]')) as chapters,
   (select coalesce(sum(jsonb_array_length(coalesce(m->'sections','[]'))),0) from jsonb_array_elements(coalesce(c.metadata->'modules','[]')) m) as sections
  from public.courses c where (p_search='' or lower(c.metadata->>'title') like pattern escape '\' or c.slug like pattern escape '\')
   and (p_category='all' or c.metadata->>'category'=p_category)
   and (p_delivery='all' or coalesce(c.metadata->>'delivery','recorded')=p_delivery)
   and (cardinality(p_statuses)=0 or (c.published and 'published'=any(p_statuses)) or (not c.published and 'draft'=any(p_statuses)))
 ), ordered as (
  select *,row_number() over(order by
   case when p_sort='created' and p_direction='desc' then created_at end desc nulls last,
   case when p_sort='created' and p_direction='asc' then created_at end asc nulls last,
   case when p_sort='updated' and p_direction='desc' then updated_at end desc nulls last,
   case when p_sort='updated' and p_direction='asc' then updated_at end asc nulls last,
   case when p_sort='students' and p_direction='desc' then students end desc,
   case when p_sort='students' and p_direction='asc' then students end asc,slug) as rank from filtered
 ), paged as (select * from ordered order by rank offset (p_page-1)*p_limit limit p_limit)
 select jsonb_build_object('courses',coalesce((select jsonb_agg(jsonb_build_object('slug',slug,'title',metadata->>'title','category',metadata->>'category','delivery',coalesce(metadata->>'delivery','recorded'),'published',published,'createdAt',created_at,'updatedAt',updated_at,'students',students,'lessons',lessons,'chapters',chapters,'sections',sections) order by rank) from paged),'[]'), 'total',(select count(*) from filtered),'page',p_page,'hasNext',(select count(*) from filtered)>p_page*p_limit) into result;
 return result;
end;$function$
;

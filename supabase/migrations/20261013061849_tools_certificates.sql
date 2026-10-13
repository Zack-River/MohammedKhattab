-- Completion certificates are immutable snapshots, never writable by a browser.
create table public.certificates (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 course_slug text not null references public.courses(slug) on delete restrict,
 learner_name text not null, course_title text not null,
 lesson_count integer not null check(lesson_count>0),
 issued_at timestamptz not null default now(),
 status text not null default 'issued' check(status in ('issued','revoked')),
 revision integer not null default 1 check(revision>0),
 unique(user_id,course_slug)
);
create index certificates_course_idx on public.certificates(course_slug);
create index certificates_issued_idx on public.certificates(issued_at desc,id);
create index certificates_status_idx on public.certificates(status,issued_at desc);
create index certificates_learner_search_idx on public.certificates using gin(learner_name extensions.gin_trgm_ops);
create index certificates_course_search_idx on public.certificates using gin(course_title extensions.gin_trgm_ops);
create table public.certificate_events (
 id bigint generated always as identity primary key,
 certificate_id uuid not null references public.certificates(id) on delete cascade,
 actor_id uuid, action text not null check(action in ('issue','revoke','restore')),
 reason text not null check(length(btrim(reason)) between 1 and 500),
 revision integer not null, created_at timestamptz not null default now(),
 unique(certificate_id,revision)
);
alter table public.certificates enable row level security;
alter table public.certificate_events enable row level security;
revoke all on public.certificates,public.certificate_events from public,anon,authenticated;
grant select on public.certificates,public.certificate_events to authenticated;
grant all on public.certificates,public.certificate_events to service_role;
grant all on sequence public.certificate_events_id_seq to service_role;
create policy certificates_read on public.certificates for select to authenticated using(public.account_access_allowed() and (user_id=(select auth.uid()) or exists(select 1 from public.admin_users where user_id=(select auth.uid()))));
create policy certificate_events_admin on public.certificate_events for select to authenticated using(public.account_access_allowed() and exists(select 1 from public.admin_users where user_id=(select auth.uid())));

create function public.issue_certificate(p_slug text,p_username text default null)
 returns uuid language plpgsql security definer set search_path='' as $$
declare v_user uuid:=auth.uid(); v_course public.courses; v_existing public.certificates; v_count integer; v_name text; v_id uuid;
begin
 if v_user is null or not public.account_access_allowed() then raise exception 'FORBIDDEN'; end if;
 if p_username is not null then
  if not exists(select 1 from public.admin_users where user_id=auth.uid()) then raise exception 'FORBIDDEN'; end if;
  select id into v_user from public.profiles where username=p_username;
  if v_user is null then raise exception 'NOT_FOUND'; end if;
 end if;
 select * into v_course from public.courses where slug=p_slug for share;
 if not found then raise exception 'NOT_FOUND'; end if;
 if not v_course.published then raise exception 'CERTIFICATE_INELIGIBLE'; end if;
 perform 1 from public.enrollments where user_id=v_user and course_slug=p_slug and active for share;
 if not found then raise exception 'CERTIFICATE_INELIGIBLE'; end if;
 perform pg_advisory_xact_lock(hashtextextended('certificate:'||v_user::text||':'||p_slug,0));
 select * into v_existing from public.certificates where user_id=v_user and course_slug=p_slug for update;
 if v_existing.id is not null then
  if v_existing.status='revoked' then raise exception 'CERTIFICATE_REVOKED'; end if;
  return v_existing.id;
 end if;
 -- Serialize with current lesson/progress edits; reject even a single incomplete lesson.
 perform 1 from public.lessons where course_slug=p_slug for share;
 perform 1 from public.lesson_progress where user_id=v_user and course_slug=p_slug for share;
 select count(*) into v_count from public.lessons where course_slug=p_slug;
 if v_count=0 or exists(select 1 from public.lessons l where l.course_slug=p_slug and not exists(select 1 from public.lesson_progress p where p.user_id=v_user and p.course_slug=l.course_slug and p.lesson_id=l.id and p.completed)) then raise exception 'CERTIFICATE_INELIGIBLE'; end if;
 select name into v_name from public.profiles where id=v_user;
 if v_name is null then raise exception 'CERTIFICATE_INELIGIBLE'; end if;
 insert into public.certificates(user_id,course_slug,learner_name,course_title,lesson_count) values(v_user,p_slug,v_name,v_course.metadata->>'title',v_count) returning id into v_id;
 insert into public.certificate_events(certificate_id,actor_id,action,reason,revision) values(v_id,auth.uid(),'issue','إتمام جميع دروس الدورة',1);
 return v_id;
end $$;
revoke all on function public.issue_certificate(text,text) from public,anon;
grant execute on function public.issue_certificate(text,text) to authenticated;

create function public.moderate_certificate(p_id uuid,p_action text,p_reason text,p_revision integer)
 returns void language plpgsql security definer set search_path='' as $$
declare v_certificate public.certificates;
begin
 if not public.account_access_allowed() or not exists(select 1 from public.admin_users where user_id=auth.uid()) then raise exception 'FORBIDDEN'; end if;
 if p_action is null or p_action not in ('revoke','restore') or p_reason is null or length(btrim(p_reason)) not between 1 and 500 or p_revision is null or p_revision<1 or p_revision>=2147483647 then raise exception 'INVALID_INPUT'; end if;
 select * into v_certificate from public.certificates where id=p_id for update;
 if not found then raise exception 'NOT_FOUND'; end if;
 if v_certificate.revision<>p_revision or (p_action='revoke' and v_certificate.status='revoked') or (p_action='restore' and v_certificate.status='issued') then raise exception 'CERTIFICATE_CONFLICT'; end if;
 update public.certificates set status=case when p_action='restore' then 'issued' else 'revoked' end,revision=revision+1 where id=p_id;
 insert into public.certificate_events(certificate_id,actor_id,action,reason,revision) values(p_id,auth.uid(),p_action,btrim(p_reason),p_revision+1);
end $$;
revoke all on function public.moderate_certificate(uuid,text,text,integer) from public,anon;
grant execute on function public.moderate_certificate(uuid,text,text,integer) to authenticated;

-- A lightweight title/slug result replaces full catalog/curriculum reads on certificates pages.
create function public.eligible_certificate_courses() returns table(slug text,title text)
 language sql stable security invoker set search_path='' as $$
 select c.slug,c.metadata->>'title' from public.courses c
 join public.enrollments e on e.course_slug=c.slug and e.user_id=(select auth.uid()) and e.active
 where c.published and public.account_access_allowed()
 and not exists(select 1 from public.certificates cert where cert.user_id=(select auth.uid()) and cert.course_slug=c.slug)
 and exists(select 1 from public.lessons l where l.course_slug=c.slug)
 and not exists(select 1 from public.lessons l where l.course_slug=c.slug and not exists(select 1 from public.lesson_progress p where p.user_id=(select auth.uid()) and p.course_slug=c.slug and p.lesson_id=l.id and p.completed))
 order by c.position,c.slug;
$$;
revoke all on function public.eligible_certificate_courses() from public,anon;
grant execute on function public.eligible_certificate_courses() to authenticated;

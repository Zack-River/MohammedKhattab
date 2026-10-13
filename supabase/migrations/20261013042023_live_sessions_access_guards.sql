revoke all on public.live_sessions,public.live_session_links from public,anon,authenticated;
grant select on public.live_sessions to anon,authenticated;
grant select on public.live_session_links to authenticated;
drop policy if exists live_session_public_schedule on public.live_sessions;
drop policy if exists live_session_visible_schedule on public.live_sessions;
drop policy if exists live_session_admin_schedule on public.live_sessions;
create policy live_session_visible_schedule on public.live_sessions for select to anon using (
 enabled and exists(select 1 from public.courses c where c.slug=course_slug and c.published)
);
create policy live_session_admin_schedule on public.live_sessions for select to authenticated using (
 (enabled and exists(select 1 from public.courses c where c.slug=course_slug and c.published))
 or (public.account_access_allowed() and exists(select 1 from public.admin_users a where a.user_id=(select auth.uid())))
);
drop policy if exists live_session_join_window on public.live_session_links;
create policy live_session_join_window on public.live_session_links for select to authenticated using (
 public.account_access_allowed() and (exists(select 1 from public.admin_users a where a.user_id=(select auth.uid()))
 or exists(
  select 1 from public.live_sessions s join public.enrollments e on e.course_slug=s.course_slug
  join public.courses c on c.slug=s.course_slug
  where s.id=session_id and e.user_id=(select auth.uid()) and c.published and s.enabled
  and s.starts_at<=statement_timestamp() and s.ends_at>statement_timestamp()
 ))
);
create or replace function public.save_live_session(p_input jsonb) returns uuid language plpgsql security definer set search_path='' as $$
declare
 v_id uuid; v_slug text:=p_input->>'courseSlug'; v_start timestamptz; v_end timestamptz;
 v_zone text:=p_input->>'timezone'; v_course jsonb; v_revision integer; v_chapter jsonb;
 v_chapter_id text:=nullif(p_input->>'chapterId',''); v_section_id text:=nullif(p_input->>'sectionId','');
begin
 if not public.account_access_allowed() or not exists(select 1 from public.admin_users where user_id=auth.uid()) then raise exception 'FORBIDDEN'; end if;
 if not exists(select 1 from pg_catalog.pg_timezone_names where name=v_zone) then raise exception 'INVALID_INPUT'; end if;
 v_start:=(p_input->>'startsLocal')::timestamp at time zone v_zone;
 v_end:=(p_input->>'endsLocal')::timestamp at time zone v_zone;
 if v_start is null or v_end is null or v_end<=v_start or v_end-v_start>interval '24 hours'
 or v_start at time zone v_zone<>(p_input->>'startsLocal')::timestamp
 or v_end at time zone v_zone<>(p_input->>'endsLocal')::timestamp then raise exception 'INVALID_INPUT'; end if;
 select metadata into v_course from public.courses where slug=v_slug for share;
 if not found then raise exception 'NOT_FOUND'; end if;
 if v_chapter_id is not null then
  select value into v_chapter from jsonb_array_elements(v_course->'modules') where value->>'id'=v_chapter_id;
  if v_chapter is null then raise exception 'INVALID_INPUT'; end if;
 end if;
 if v_section_id is not null and (v_chapter is null or not exists(select 1 from jsonb_array_elements(v_chapter->'sections') where value->>'id'=v_section_id)) then raise exception 'INVALID_INPUT'; end if;
 if nullif(p_input->>'id','') is null then
  if coalesce((p_input->>'revision')::int,0)<>0 then raise exception 'COURSE_CONFLICT'; end if;
  insert into public.live_sessions(course_slug,title,description,starts_at,ends_at,timezone,chapter_id,section_id,enabled)
  values(v_slug,p_input->>'title',coalesce(p_input->>'description',''),v_start,v_end,v_zone,v_chapter_id,v_section_id,(p_input->>'enabled')::boolean) returning id into v_id;
 else
  v_id:=(p_input->>'id')::uuid;
  select revision into v_revision from public.live_sessions where id=v_id for update;
  if not found then raise exception 'NOT_FOUND'; end if;
  if v_revision is distinct from (p_input->>'revision')::int then raise exception 'COURSE_CONFLICT'; end if;
  update public.live_sessions set course_slug=v_slug,title=p_input->>'title',description=coalesce(p_input->>'description',''),starts_at=v_start,ends_at=v_end,timezone=v_zone,chapter_id=v_chapter_id,section_id=v_section_id,enabled=(p_input->>'enabled')::boolean,revision=revision+1,updated_at=now() where id=v_id;
 end if;
 insert into public.live_session_links(session_id,join_url) values(v_id,p_input->>'joinUrl')
 on conflict(session_id) do update set join_url=excluded.join_url;
 return v_id;
end $$;
create or replace function public.delete_live_session(p_id uuid,p_revision integer) returns boolean language plpgsql security definer set search_path='' as $$
declare v_revision integer;
begin
 if not public.account_access_allowed() or not exists(select 1 from public.admin_users where user_id=auth.uid()) then raise exception 'FORBIDDEN'; end if;
 select revision into v_revision from public.live_sessions where id=p_id for update;
 if not found then raise exception 'NOT_FOUND'; end if;
 if v_revision is distinct from p_revision then raise exception 'COURSE_CONFLICT'; end if;
 delete from public.live_sessions where id=p_id;
 return true;
end $$;
revoke all on function public.save_live_session(jsonb),public.delete_live_session(uuid,integer) from public,anon;
grant execute on function public.save_live_session(jsonb),public.delete_live_session(uuid,integer) to authenticated;

-- Keep material content private; resource metadata remains enrollment-scoped.
alter table public.resources add column kind text not null default 'text' check(kind in ('text','link'));
alter table public.resources add column revision integer not null default 1 check(revision>0);
alter table public.resources add column created_at timestamptz not null default now();
alter table public.resources add column updated_at timestamptz not null default now();
drop policy resource_access on public.resources;
create policy resource_access on public.resources for select to authenticated using (
 exists(select 1 from public.admin_users where user_id=(select auth.uid()))
 or exists(select 1 from public.lesson_resources r where r.resource_id=resources.id)
);
drop policy resource_links on public.lesson_resources;
create policy resource_links on public.lesson_resources for select to authenticated using (
 exists(select 1 from public.admin_users where user_id=(select auth.uid()))
 or exists(select 1 from public.enrollments e join public.courses c on c.slug=e.course_slug where e.course_slug=lesson_resources.course_slug and e.user_id=(select auth.uid()) and c.published)
);
create function public.save_admin_material(p_input jsonb) returns text language plpgsql security definer set search_path='' as $$
declare v_id text:=nullif(p_input->>'id',''); v_revision integer; v_assignments jsonb:=p_input->'assignments';
begin
 if not public.account_access_allowed() or not exists(select 1 from public.admin_users where user_id=auth.uid()) then raise exception 'FORBIDDEN'; end if;
 if length(btrim(coalesce(p_input->>'title',''))) not between 1 and 160 or (p_input->>'description') is null or length(p_input->>'description')>500
 or length(coalesce(p_input->>'type','')) not between 1 and 40 or length(coalesce(p_input->>'content','')) not between 1 and 2000
 or coalesce(p_input->>'kind','') not in ('text','link') or (p_input->>'kind'='link' and p_input->>'content' !~ '^https://[^[:space:]@]+$')
 or coalesce(jsonb_typeof(v_assignments),'')<>'array' or jsonb_array_length(v_assignments) not between 1 and 50 then raise exception 'INVALID_INPUT'; end if;
 if jsonb_array_length(v_assignments)<>(select count(distinct (a."courseSlug",a."lessonId")) from jsonb_to_recordset(v_assignments) a("courseSlug" text,"lessonId" text)) then raise exception 'INVALID_INPUT'; end if;
 perform 1 from public.courses where slug in (select a."courseSlug" from jsonb_to_recordset(v_assignments) a("courseSlug" text,"lessonId" text)) order by slug for share;
 if exists(select 1 from jsonb_to_recordset(v_assignments) a("courseSlug" text,"lessonId" text) left join public.lessons l on l.course_slug=a."courseSlug" and l.id=a."lessonId" where l.id is null) then raise exception 'INVALID_INPUT'; end if;
 if v_id is null then
  if (p_input->>'revision')::integer is distinct from 0 then raise exception 'MATERIAL_CONFLICT'; end if;
  v_id:=gen_random_uuid()::text;
  insert into public.resources(id,title,description,type,content,kind) values(v_id,p_input->>'title',p_input->>'description',p_input->>'type',p_input->>'content',p_input->>'kind');
 else
  select revision into v_revision from public.resources where id=v_id for update;
  if not found then raise exception 'NOT_FOUND'; end if;
  if v_revision is distinct from (p_input->>'revision')::integer then raise exception 'MATERIAL_CONFLICT'; end if;
  update public.resources set title=p_input->>'title',description=p_input->>'description',type=p_input->>'type',content=p_input->>'content',kind=p_input->>'kind',revision=revision+1,updated_at=now() where id=v_id;
 end if;
 delete from public.lesson_resources r where resource_id=v_id and not exists(select 1 from jsonb_to_recordset(v_assignments) a("courseSlug" text,"lessonId" text) where a."courseSlug"=r.course_slug and a."lessonId"=r.lesson_id);
 insert into public.lesson_resources(resource_id,course_slug,lesson_id) select v_id,a."courseSlug",a."lessonId" from jsonb_to_recordset(v_assignments) a("courseSlug" text,"lessonId" text) on conflict do nothing;
 return v_id;
end $$;
create function public.delete_admin_material(p_id text,p_revision integer) returns boolean language plpgsql security definer set search_path='' as $$
declare v_revision integer;
begin
 if not public.account_access_allowed() or not exists(select 1 from public.admin_users where user_id=auth.uid()) then raise exception 'FORBIDDEN'; end if;
 select revision into v_revision from public.resources where id=p_id for update;
 if not found then raise exception 'NOT_FOUND'; end if;
 if v_revision is distinct from p_revision then raise exception 'MATERIAL_CONFLICT'; end if;
 delete from public.resources where id=p_id;return true;
end $$;
revoke all on function public.save_admin_material(jsonb),public.delete_admin_material(text,integer) from public,anon;
grant execute on function public.save_admin_material(jsonb),public.delete_admin_material(text,integer) to authenticated;

create table public.lesson_notes (
 user_id uuid not null references auth.users(id) on delete cascade,
 course_slug text not null, lesson_id text not null,
 text text not null default '' check(length(text)<=4000), revision integer not null default 1 check(revision>0),
 updated_at timestamptz not null default now(), primary key(user_id,course_slug,lesson_id),
 foreign key(course_slug,lesson_id) references public.lessons(course_slug,id) on delete cascade
);
alter table public.lesson_notes enable row level security;
revoke all on public.lesson_notes from public,anon,authenticated;
grant select on public.lesson_notes to authenticated;
grant all on public.lesson_notes to service_role;
create policy own_lesson_notes on public.lesson_notes for select to authenticated using (
 user_id=(select auth.uid()) and public.account_access_allowed() and exists(select 1 from public.enrollments e join public.courses c on c.slug=e.course_slug where e.user_id=(select auth.uid()) and e.course_slug=lesson_notes.course_slug and c.published)
);
create index lesson_notes_lesson_idx on public.lesson_notes(course_slug,lesson_id);
create function public.save_lesson_note(p_slug text,p_lesson text,p_text text,p_revision integer) returns integer language plpgsql security definer set search_path='' as $$
declare v_revision integer;
begin
 if not public.account_access_allowed() or not exists(select 1 from public.enrollments e join public.courses c on c.slug=e.course_slug join public.lessons l on l.course_slug=c.slug where e.user_id=auth.uid() and c.slug=p_slug and c.published and l.id=p_lesson) then raise exception 'FORBIDDEN'; end if;
 if p_text is null or length(p_text)>4000 or p_revision is null or p_revision<0 then raise exception 'INVALID_INPUT'; end if;
 perform pg_advisory_xact_lock(hashtextextended('note:'||auth.uid()::text||':'||p_slug||':'||p_lesson,0));
 select revision into v_revision from public.lesson_notes where user_id=auth.uid() and course_slug=p_slug and lesson_id=p_lesson for update;
 if coalesce(v_revision,0) is distinct from p_revision then raise exception 'NOTE_CONFLICT'; end if;
 insert into public.lesson_notes(user_id,course_slug,lesson_id,text) values(auth.uid(),p_slug,p_lesson,p_text)
 on conflict(user_id,course_slug,lesson_id) do update set text=excluded.text,revision=lesson_notes.revision+1,updated_at=now() returning revision into v_revision;
 return v_revision;
end $$;
revoke all on function public.save_lesson_note(text,text,text,integer) from public,anon;
grant execute on function public.save_lesson_note(text,text,text,integer) to authenticated;

-- No content, credentials, meeting URLs, notes or before/after payloads enter history.
create table public.admin_activity (
 id bigint generated always as identity primary key,
 actor_id uuid, target text not null, entity text not null, action text not null check(action in ('INSERT','UPDATE','DELETE')),
 changed_fields text[] not null default '{}', created_at timestamptz not null default now()
);
create index admin_activity_created_idx on public.admin_activity(created_at desc,id desc);
create index admin_activity_entity_created_idx on public.admin_activity(entity,created_at desc);
alter table public.admin_activity enable row level security;
revoke all on public.admin_activity from public,anon,authenticated;
grant select on public.admin_activity to authenticated;
grant all on public.admin_activity to service_role;
create policy admin_activity_read on public.admin_activity for select to authenticated using (public.account_access_allowed() and exists(select 1 from public.admin_users where user_id=(select auth.uid())));
create function private.record_content_change() returns trigger language plpgsql security definer set search_path='' as $$
declare v_row jsonb; v_fields text[];
begin
 v_row:=case when tg_op='DELETE' then to_jsonb(old) else to_jsonb(new) end;
 if tg_op='UPDATE' then
  select array_agg(key order by key) into v_fields from jsonb_each(to_jsonb(new)) where key not in ('updated_at','revision') and value is distinct from to_jsonb(old)->key;
  if v_fields is null then return new;end if;
 end if;
 insert into public.admin_activity(actor_id,target,entity,action,changed_fields)
 values(auth.uid(),case when tg_table_name='lesson_resources' then (v_row->>'resource_id')||'/'||(v_row->>'course_slug')||'/'||(v_row->>'lesson_id') when tg_table_name='lessons' then (v_row->>'course_slug')||'/'||(v_row->>'id') else coalesce(v_row->>'course_slug',v_row->>'slug',v_row->>'key',v_row->>'id',v_row->>'user_id','') end,tg_table_name,tg_op,coalesce(v_fields,'{}'));
 if tg_op='DELETE' then return old;end if;return new;
end $$;
revoke all on function private.record_content_change() from public,anon,authenticated;
do $$declare t text;begin
 foreach t in array array['courses','lessons','resources','lesson_resources','live_sessions','workshop_templates','commerce_bundles','commerce_discounts','admin_users'] loop
 execute format('create trigger record_content_change after insert or update or delete on public.%I for each row execute function private.record_content_change()',t);
 end loop;
end $$;

create index resources_updated_idx on public.resources(updated_at desc,id);

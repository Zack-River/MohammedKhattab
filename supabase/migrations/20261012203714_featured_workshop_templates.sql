create table public.workshop_templates (
 course_slug text primary key references public.courses(slug) on delete cascade,
 document jsonb not null check (jsonb_typeof(document) = 'object' and octet_length(document::text) <= 131072),
 revision integer not null default 1 check (revision > 0),
 updated_at timestamptz not null default now()
);
alter table public.workshop_templates enable row level security;
grant select on public.workshop_templates to anon, authenticated;
grant insert, update, delete on public.workshop_templates to authenticated;
grant all on public.workshop_templates to service_role;
create policy workshop_template_public on public.workshop_templates for select to anon using (exists(select 1 from public.courses c where c.slug = course_slug and c.published and c.metadata->>'delivery' = 'live' and c.metadata->>'featured' = 'true'));
create policy workshop_template_read on public.workshop_templates for select to authenticated using (exists(select 1 from public.admin_users a where a.user_id = (select auth.uid())) or exists(select 1 from public.courses c where c.slug = course_slug and c.published and c.metadata->>'delivery' = 'live' and c.metadata->>'featured' = 'true'));
create policy workshop_template_insert on public.workshop_templates for insert to authenticated with check (exists(select 1 from public.admin_users a where a.user_id = (select auth.uid())) and exists(select 1 from public.courses c where c.slug = course_slug and c.metadata->>'delivery' = 'live'));
create policy workshop_template_update on public.workshop_templates for update to authenticated using (exists(select 1 from public.admin_users a where a.user_id = (select auth.uid()))) with check (exists(select 1 from public.admin_users a where a.user_id = (select auth.uid())) and exists(select 1 from public.courses c where c.slug = course_slug and c.metadata->>'delivery' = 'live'));
create policy workshop_template_delete on public.workshop_templates for delete to authenticated using (exists(select 1 from public.admin_users a where a.user_id = (select auth.uid())));

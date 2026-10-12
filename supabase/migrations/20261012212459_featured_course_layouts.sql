-- Featured layout is independent of recorded/live delivery.
drop policy workshop_template_public on public.workshop_templates;
drop policy workshop_template_read on public.workshop_templates;
drop policy workshop_template_insert on public.workshop_templates;
drop policy workshop_template_update on public.workshop_templates;
create policy workshop_template_public on public.workshop_templates for select to anon using (exists(select 1 from public.courses c where c.slug = course_slug and c.published and c.metadata->>'featured' = 'true'));
create policy workshop_template_read on public.workshop_templates for select to authenticated using (exists(select 1 from public.admin_users a where a.user_id = (select auth.uid())) or exists(select 1 from public.courses c where c.slug = course_slug and c.published and c.metadata->>'featured' = 'true'));
create policy workshop_template_insert on public.workshop_templates for insert to authenticated with check (exists(select 1 from public.admin_users a where a.user_id = (select auth.uid())) and exists(select 1 from public.courses c where c.slug = course_slug));
create policy workshop_template_update on public.workshop_templates for update to authenticated using (exists(select 1 from public.admin_users a where a.user_id = (select auth.uid()))) with check (exists(select 1 from public.admin_users a where a.user_id = (select auth.uid())) and exists(select 1 from public.courses c where c.slug = course_slug));

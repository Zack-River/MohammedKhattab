-- Bundle configuration stays server-only; RLS consults a narrow public-visibility predicate.
create function public.is_public_featured_bundle(p_slug text) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.commerce_bundles b where b.slug=p_slug and b.enabled and b.featured
 and (select count(*) from public.commerce_bundle_courses bc where bc.bundle_slug=b.slug) between 2 and 20
 and not exists(select 1 from public.commerce_bundle_courses bc join public.courses c on c.slug=bc.course_slug where bc.bundle_slug=b.slug and not c.published));
$$;
revoke all on function public.is_public_featured_bundle(text) from public;
grant execute on function public.is_public_featured_bundle(text) to anon,authenticated,service_role;
drop policy workshop_template_public on public.workshop_templates;
drop policy workshop_template_read on public.workshop_templates;
create policy workshop_template_public on public.workshop_templates for select to anon using (exists(select 1 from public.courses c where c.slug = course_slug and c.published and c.metadata->>'featured' = 'true') or (select public.is_public_featured_bundle(bundle_slug)));
create policy workshop_template_read on public.workshop_templates for select to authenticated using (exists(select 1 from public.admin_users a where a.user_id = (select auth.uid())) or exists(select 1 from public.courses c where c.slug = course_slug and c.published and c.metadata->>'featured' = 'true') or (select public.is_public_featured_bundle(bundle_slug)));

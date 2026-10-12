-- Reuse one template document/revision model for course and bundle products.
alter table public.commerce_bundles add column featured boolean not null default false;
alter table public.workshop_templates drop constraint workshop_templates_pkey;
alter table public.workshop_templates alter column course_slug drop not null;
alter table public.workshop_templates add column id uuid primary key default gen_random_uuid();
alter table public.workshop_templates add constraint workshop_template_course_unique unique(course_slug);
alter table public.workshop_templates add column bundle_slug text unique references public.commerce_bundles(slug) on delete cascade;
alter table public.workshop_templates add constraint workshop_template_one_target check(num_nonnulls(course_slug,bundle_slug)=1);
drop policy workshop_template_public on public.workshop_templates;
drop policy workshop_template_read on public.workshop_templates;
drop policy workshop_template_insert on public.workshop_templates;
drop policy workshop_template_update on public.workshop_templates;
create policy workshop_template_public on public.workshop_templates for select to anon using (exists(select 1 from public.courses c where c.slug = course_slug and c.published and c.metadata->>'featured' = 'true') or exists(select 1 from public.commerce_bundles b where b.slug = bundle_slug and b.enabled and b.featured and (select count(*) from public.commerce_bundle_courses bc where bc.bundle_slug=b.slug) between 2 and 20 and not exists(select 1 from public.commerce_bundle_courses bc join public.courses c on c.slug=bc.course_slug where bc.bundle_slug=b.slug and not c.published)));
create policy workshop_template_read on public.workshop_templates for select to authenticated using (exists(select 1 from public.admin_users a where a.user_id = (select auth.uid())) or exists(select 1 from public.courses c where c.slug = course_slug and c.published and c.metadata->>'featured' = 'true') or exists(select 1 from public.commerce_bundles b where b.slug = bundle_slug and b.enabled and b.featured and (select count(*) from public.commerce_bundle_courses bc where bc.bundle_slug=b.slug) between 2 and 20 and not exists(select 1 from public.commerce_bundle_courses bc join public.courses c on c.slug=bc.course_slug where bc.bundle_slug=b.slug and not c.published)));
create policy workshop_template_insert on public.workshop_templates for insert to authenticated with check (exists(select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy workshop_template_update on public.workshop_templates for update to authenticated using (exists(select 1 from public.admin_users a where a.user_id = (select auth.uid()))) with check (exists(select 1 from public.admin_users a where a.user_id = (select auth.uid())));

create or replace function public.save_commerce_bundle(p_input jsonb) returns void language plpgsql set search_path='' as $$
declare b public.commerce_bundles; slugs text[]; expected integer:=(p_input->>'revision')::integer;
begin
 select array_agg(value) into slugs from jsonb_array_elements_text(p_input->'courseSlugs');
 if cardinality(slugs) not between 2 and 20 or cardinality(slugs)<>(select count(distinct x) from unnest(slugs) x) then raise exception 'INVALID_INPUT'; end if;
 select * into b from public.commerce_bundles where slug=p_input->>'key' for update;
 if (b.slug is null and expected<>0) or (b.slug is not null and b.revision<>expected) then raise exception 'COMMERCE_CONFLICT'; end if;
 perform 1 from public.courses where slug=any(slugs) order by slug for share;
 if (select count(*) from public.courses where slug=any(slugs))<>cardinality(slugs) or ((p_input->>'enabled')::boolean and exists(select 1 from public.courses where slug=any(slugs) and not published)) then raise exception 'INVALID_BUNDLE_COURSES'; end if;
 if b.slug is null then
  insert into public.commerce_bundles(slug,title,description,amount_minor,enabled,featured) values(p_input->>'key',p_input->>'title',p_input->>'description',(p_input->>'amountMinor')::integer,(p_input->>'enabled')::boolean,coalesce((p_input->>'featured')::boolean,false));
 else
  update public.commerce_bundles set title=p_input->>'title',description=p_input->>'description',amount_minor=(p_input->>'amountMinor')::integer,enabled=(p_input->>'enabled')::boolean,featured=coalesce((p_input->>'featured')::boolean,b.featured),revision=revision+1,updated_at=now() where slug=b.slug;
 end if;
 delete from public.commerce_bundle_courses where bundle_slug=p_input->>'key';
 insert into public.commerce_bundle_courses(bundle_slug,course_slug,position) select p_input->>'key',value,ordinality-1 from jsonb_array_elements_text(p_input->'courseSlugs') with ordinality;
end $$;

create or replace function public.commerce_bundle_catalog() returns jsonb language sql stable set search_path='' as $$
 with eligible as materialized (
  select b.slug,b.title,b.description,b.featured from public.commerce_bundles b
  where b.enabled and (select count(*) from public.commerce_bundle_courses bc where bc.bundle_slug=b.slug) between 2 and 20
  and not exists(select 1 from public.commerce_bundle_courses bc join public.courses c on c.slug=bc.course_slug where bc.bundle_slug=b.slug and not c.published)
  order by b.created_at desc limit 100
 ) select coalesce(jsonb_agg(jsonb_build_object('slug',slug,'title',title,'description',description,'featured',featured,'quote',public.quote_commerce('bundle',slug))),'[]') from eligible;
$$;

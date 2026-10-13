-- Catalog grants snapshot current published courses, not future publications.
create or replace function public.grant_enrollment_access(p_user uuid,p_kind text,p_slug text,p_until timestamptz,p_reason text,p_revisions jsonb)
returns integer language plpgsql security definer set search_path='' as $$
declare slugs text[]; member_slug text; changed integer:=0; expected integer;
begin
 if not public.account_access_allowed() or not exists(select 1 from public.admin_users where user_id=auth.uid()) then raise exception 'FORBIDDEN'; end if;
 if p_user is null or p_kind is null or p_kind not in ('course','bundle','all') or p_slug is null or p_slug!~'^[a-z0-9]+(-[a-z0-9]+)*$' or length(p_slug)>100 or p_reason is null or length(btrim(p_reason)) not between 1 and 500 or (p_until is not null and (not isfinite(p_until) or p_until<=statement_timestamp() or p_until>statement_timestamp()+interval '10 years')) or p_revisions is null or jsonb_typeof(p_revisions)<>'object' or octet_length(p_revisions::text)>12000 then raise exception 'INVALID_INPUT'; end if;
 if p_kind='all' and p_slug<>'all' then raise exception 'INVALID_INPUT'; end if;
 perform pg_advisory_xact_lock(hashtextextended('commerce:'||p_user::text,0));
 perform 1 from public.account_contacts where user_id=p_user for update;
 if not exists(select 1 from auth.users where id=p_user and deleted_at is null) then raise exception 'NOT_FOUND'; end if;
 if not private.contacts_verified(p_user) then raise exception 'CONTACT_VERIFICATION_REQUIRED'; end if;
 if p_kind='bundle' then
  perform 1 from public.commerce_bundles where slug=p_slug and enabled for share;
  if not found then raise exception 'NOT_FOUND'; end if;
  select array_agg(course_slug order by course_slug) into slugs from public.commerce_bundle_courses where bundle_slug=p_slug;
 elsif p_kind='all' then
  select array_agg(slug order by slug) into slugs from public.courses where published;
 else slugs:=array[p_slug]; end if;
 if coalesce(cardinality(slugs),0)=0 or (p_kind<>'all' and cardinality(slugs)>20) then raise exception 'INVALID_INPUT'; end if;
 perform 1 from public.courses where slug=any(slugs) order by slug for share;
 if (select count(*) from public.courses where slug=any(slugs) and published)<>cardinality(slugs) then raise exception 'NOT_FOUND'; end if;
 foreach member_slug in array slugs loop
  if p_kind='all' and not (p_revisions ? member_slug) then expected:=0;
  else
  if not (p_revisions ? member_slug) or jsonb_typeof(p_revisions->member_slug)<>'number' or (p_revisions->>member_slug)!~'^[0-9]{1,10}$' or (p_revisions->>member_slug)::numeric>=2147483647 then raise exception 'INVALID_INPUT'; end if;
  expected:=(p_revisions->>member_slug)::integer;
  end if;
  if private.grant_course_access(p_user,member_slug,p_until,p_reason,case when p_kind='bundle' then p_slug end,expected) then changed:=changed+1; end if;
 end loop;
 return changed;
end $$;
revoke all on function public.grant_enrollment_access(uuid,text,text,timestamptz,text,jsonb) from public,anon;
grant execute on function public.grant_enrollment_access(uuid,text,text,timestamptz,text,jsonb) to authenticated;


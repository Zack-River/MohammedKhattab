SET local check_function_bodies = off;

CREATE OR REPLACE FUNCTION private.search_admin_users (
  p_page        integer,
  p_limit       integer,
  p_search      text,
  p_statuses    text[],
  p_admins_only boolean,
  p_new_since   timestamp with time zone
)
  RETURNS jsonb
  LANGUAGE plpgsql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
begin
  if not private.account_access_allowed() or not exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  ) then raise exception 'FORBIDDEN' using errcode = '42501'; end if;
  if p_page is null or p_page < 1 or p_page > 999999 or p_limit is null or p_limit < 1 or p_limit > 20
    or p_search is null or length(p_search) > 100 or p_statuses is null
    or not p_statuses <@ array['suspended','banned']::text[] or array_position(p_statuses, null) is not null
    or p_admins_only is null then raise exception 'INVALID_INPUT' using errcode = '22023'; end if;
  return (
    with accounts as (
      select u.id, coalesce(p.name, u.raw_user_meta_data->>'name', '—') as name,
        coalesce(p.username, 'user-' || replace(u.id::text, '-', '')) as username,
        coalesce(u.email, '—') as email,
        case when coalesce(p.avatar_url, u.raw_user_meta_data->>'avatar_url') ~ '^https://'
          then coalesce(p.avatar_url, u.raw_user_meta_data->>'avatar_url') end as avatar_url,
        a.user_id is not null as is_admin, u.email_confirmed_at is not null as confirmed,
        u.banned_until, coalesce(u.banned_until > now() + interval '3650 days', false) as is_banned,
        coalesce(u.banned_until > now() and u.banned_until <= now() + interval '3650 days', false) as is_suspended,
        u.created_at
      from auth.users u left join public.profiles p on p.id = u.id
        left join public.admin_users a on a.user_id = u.id
      where u.deleted_at is null
    ), matched as materialized (
      select * from accounts where
        (p_search = '' or strpos(lower(concat_ws(' ', name, username, email)), lower(p_search)) > 0)
        and (cardinality(p_statuses) = 0 or ('suspended' = any(p_statuses) and is_suspended)
          or ('banned' = any(p_statuses) and is_banned))
        and (not p_admins_only or is_admin) and (p_new_since is null or created_at >= p_new_since)
    ), records as (
      select * from matched order by created_at desc, id desc limit p_limit offset ((p_page - 1) * p_limit)
    )
    select jsonb_build_object('page', p_page, 'total', (select count(*) from matched),
      'hasNext', (select count(*) from matched) > p_page * p_limit,
      'users', coalesce((select jsonb_agg(jsonb_build_object(
        'id', id, 'name', name, 'username', username, 'email', email, 'avatarUrl', avatar_url,
        'admin', is_admin, 'confirmed', confirmed, 'suspendedUntil', banned_until, 'permanentlyBanned', is_banned
      ) order by created_at desc, id desc) from records), '[]'::jsonb))
  );
end;
$function$;

CREATE OR REPLACE FUNCTION public.search_admin_users (
  p_page        integer,
  p_limit       integer,
  p_search      text,
  p_statuses    text[],
  p_admins_only boolean,
  p_new_since   timestamp with time zone DEFAULT NULL::timestamp WITH time zone
)
  RETURNS jsonb
  LANGUAGE sql
  STABLE
  SET search_path TO ''
  AS $function$
  select private.search_admin_users(p_page, p_limit, p_search, p_statuses, p_admins_only, p_new_since);
$function$;

REVOKE ALL ON FUNCTION "public"."search_admin_users"(integer, integer, text, text[], boolean, timestamp WITH time zone) FROM PUBLIC, "anon";

REVOKE ALL ON FUNCTION "private"."search_admin_users"(integer, integer, text, text[], boolean, timestamp WITH time zone) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "private"."search_admin_users"(integer, integer, text, text[], boolean, timestamp WITH time zone) TO "authenticated";

GRANT EXECUTE ON FUNCTION "public"."search_admin_users"(integer, integer, text, text[], boolean, timestamp WITH time zone) TO "authenticated";

REVOKE ALL ON FUNCTION "public"."search_admin_users"(integer, integer, text, text[], boolean, timestamp WITH time zone) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."search_admin_users"(integer, integer, text, text[], boolean, timestamp WITH time zone) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."search_admin_users"(integer, integer, text, text[], boolean, timestamp WITH time zone) TO "service_role";


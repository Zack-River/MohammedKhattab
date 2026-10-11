SET local check_function_bodies = off;

ALTER TABLE "public"."profiles"
  DROP CONSTRAINT "profiles_username_check";

DROP FUNCTION "public"."search_admin_users"(integer, integer, text, text[], boolean, timestamp WITH time zone);

DROP FUNCTION "private"."search_admin_users"(integer, integer, text, text[], boolean, timestamp WITH time zone);

CREATE OR REPLACE FUNCTION private.assign_username()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare existing_username text;
begin
  -- Serialize same-profile upserts before reading the current handle.
  if tg_op='INSERT' then
    select username into existing_username from public.profiles where id=new.id for update;
  else existing_username := old.username; end if;
  if new.username is null or new.username='' then
    new.username := coalesce(existing_username, private.generate_default_username(new.name));
  end if;
  new.username := lower(trim(new.username));
  perform pg_advisory_xact_lock(hashtextextended(new.username,0));
  if exists (select 1 from public.profiles where username=new.username and id<>new.id) then
    raise exception 'USERNAME_TAKEN' using errcode='23505';
  end if;
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION private.generate_default_username (
  full_name text
)
  RETURNS text
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare candidate text; bytes bytea;
begin
  for attempt in 1..128 loop
    bytes := extensions.gen_random_bytes(4);
    candidate := private.username_base(full_name) || (100000 + ((get_byte(bytes,0)::bigint*16777216 + get_byte(bytes,1)*65536 + get_byte(bytes,2)*256 + get_byte(bytes,3)) % 900000))::text;
    perform pg_advisory_xact_lock(hashtextextended(candidate,0));
    if not exists (select 1 from public.profiles where username=candidate) then return candidate; end if;
  end loop;
  raise exception 'USERNAME_GENERATION_EXHAUSTED' using errcode='23505';
end;
$function$;

CREATE OR REPLACE FUNCTION private.search_admin_users (
  p_page        integer,
  p_limit       integer,
  p_search      text,
  p_statuses    text[],
  p_admins_only boolean,
  p_new_since   timestamp with time zone,
  p_search_mode text
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
    or p_admins_only is null or p_search_mode is null or p_search_mode not in ('contains','prefix') then raise exception 'INVALID_INPUT' using errcode = '22023'; end if;
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
      where u.deleted_at is null and (p_search_mode <> 'prefix' or p_search='' or u.id in (
        select id from public.profiles where lower(name) ^@ lower(p_search)
      ))
    ), matched as materialized (
      select * from accounts where
        (p_search_mode = 'prefix' or p_search = '' or strpos(lower(concat_ws(' ', name, username, email)), lower(p_search)) > 0)
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

CREATE OR REPLACE FUNCTION private.username_base (
  full_name text
)
  RETURNS text
  LANGUAGE sql
  IMMUTABLE
  SET search_path TO ''
  AS $function$
  with words as (select regexp_split_to_array(trim(full_name), '\s+') as parts)
  select coalesce(nullif(left(regexp_replace(lower(parts[1] || case when cardinality(parts)>1 then parts[cardinality(parts)] else '' end), '[^[:alnum:]]', '', 'g'),42),''),'user') from words;
$function$;

CREATE OR REPLACE FUNCTION public.search_admin_users (
  p_page        integer,
  p_limit       integer,
  p_search      text,
  p_statuses    text[],
  p_admins_only boolean,
  p_new_since   timestamp with time zone DEFAULT NULL::timestamp WITH time zone,
  p_search_mode text                     DEFAULT 'contains'::text
)
  RETURNS jsonb
  LANGUAGE sql
  STABLE
  SET search_path TO ''
  AS $function$
  select private.search_admin_users(p_page, p_limit, p_search, p_statuses, p_admins_only, p_new_since, p_search_mode);
$function$;

REVOKE ALL ON FUNCTION "public"."search_admin_users"(integer, integer, text, text[], boolean, timestamp WITH time zone, text) FROM PUBLIC, "anon";

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_username_check" CHECK (((username ~ '^[[:alnum:]][[:alnum:]_-]{2,47}$'::text) AND (username = lower(username))));

CREATE INDEX profiles_name_prefix_idx ON public.profiles USING spgist (lower(name));

CREATE TRIGGER profiles_username_update
  BEFORE UPDATE OF username ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION private.assign_username();

REVOKE ALL ON FUNCTION "private"."generate_default_username"(text) FROM PUBLIC;

REVOKE ALL ON FUNCTION "private"."search_admin_users"(integer, integer, text, text[], boolean, timestamp WITH time zone, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "private"."search_admin_users"(integer, integer, text, text[], boolean, timestamp WITH time zone, text) TO "authenticated";

REVOKE ALL ON FUNCTION "private"."username_base"(text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."search_admin_users"(integer, integer, text, text[], boolean, timestamp WITH time zone, text) TO "authenticated";

REVOKE ALL ON FUNCTION "public"."search_admin_users"(integer, integer, text, text[], boolean, timestamp WITH time zone, text) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."search_admin_users"(integer, integer, text, text[], boolean, timestamp WITH time zone, text) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."search_admin_users"(integer, integer, text, text[], boolean, timestamp WITH time zone, text) TO "service_role";


-- Replace only the historical generated handle; keep all chosen usernames intact.
UPDATE public.profiles SET username = private.generate_default_username(name)
WHERE username = 'user-' || replace(id::text, '-', '');

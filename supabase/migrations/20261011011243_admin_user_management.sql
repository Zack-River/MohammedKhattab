-- User pages remain private to administrators. No public profile routes are added.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

alter table public.profiles add column username text;
alter table public.profiles add column avatar_url text;
update public.profiles set username = 'user-' || replace(id::text, '-', '');
alter table public.profiles add constraint profiles_username_key unique (username);
alter table public.profiles add constraint profiles_username_check check (username ~ '^[a-z0-9][a-z0-9_-]{2,47}$');
alter table public.profiles add constraint profiles_avatar_check check (avatar_url is null or avatar_url ~ '^https://');

create function private.assign_username() returns trigger language plpgsql set search_path = '' as $$
begin
  new.username := coalesce(nullif(new.username, ''), 'user-' || replace(new.id::text, '-', ''));
  return new;
end;
$$;
revoke all on function private.assign_username() from public, anon, authenticated;
create trigger assign_username before insert on public.profiles for each row execute function private.assign_username();
alter table public.profiles alter column username set not null;
alter table public.profiles alter column username set default '';

-- Checks authoritative Auth state, including deletion and already-issued JWTs.
create function private.account_access_allowed() returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from auth.users where id = (select auth.uid()) and (banned_until is null or banned_until <= now()));
$$;
revoke all on function private.account_access_allowed() from public, anon;
grant execute on function private.account_access_allowed() to authenticated;
create function public.account_access_allowed() returns boolean language sql stable security invoker set search_path = '' as $$
  select private.account_access_allowed();
$$;
revoke all on function public.account_access_allowed() from public, anon;
grant execute on function public.account_access_allowed() to authenticated;

-- Restrictive policies AND with existing ownership/admin policies, never grant access.
do $$
declare t text;
begin
  foreach t in array array['profiles','courses','lessons','enrollments','lesson_progress','resources','lesson_resources','admin_users'] loop
    execute format('create policy active_account on public.%I as restrictive for all to authenticated using ((select private.account_access_allowed())) with check ((select private.account_access_allowed()))', t);
  end loop;
end;
$$;

-- Role promotion is one transaction, durable across Auth email-confirmation updates.
create function private.promote_admin_user(target_id uuid) returns void language plpgsql security definer set search_path = '' as $$
declare target_email text;
begin
  if not private.account_access_allowed() or not exists(select 1 from public.admin_users where user_id = (select auth.uid())) then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;
  select lower(email) into target_email from auth.users where id = target_id and email_confirmed_at is not null
    and (banned_until is null or banned_until <= now()) for update;
  if target_email is null then raise exception 'INVALID_INPUT' using errcode = '22023'; end if;
  insert into public.admin_allowlist(email) values(target_email) on conflict do nothing;
  insert into public.admin_users(user_id) values(target_id) on conflict do nothing;
end;
$$;
revoke all on function private.promote_admin_user(uuid) from public, anon;
grant execute on function private.promote_admin_user(uuid) to authenticated;
create function public.promote_admin_user(target_id uuid) returns void language sql security invoker set search_path = '' as $$
  select private.promote_admin_user(target_id);
$$;
revoke all on function public.promote_admin_user(uuid) from public, anon;
grant execute on function public.promote_admin_user(uuid) to authenticated;

-- Serializes with promotion's auth.users row lock: no concurrent ban/delete of an administrator.
create function private.protect_administrator() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if exists(select 1 from public.admin_users where user_id = old.id) then
    if tg_op = 'DELETE' then raise exception 'PROTECTED_ADMIN' using errcode = '42501'; end if;
    if new.banned_until is distinct from old.banned_until and new.banned_until > now() then
      raise exception 'PROTECTED_ADMIN' using errcode = '42501';
    end if;
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;
revoke all on function private.protect_administrator() from public, anon, authenticated;
create trigger protect_administrator before update of banned_until or delete on auth.users
  for each row execute function private.protect_administrator();

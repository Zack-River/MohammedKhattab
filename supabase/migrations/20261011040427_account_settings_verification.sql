SET local check_function_bodies = off;

DROP TRIGGER "sync_admin_membership" ON "auth"."users";

DROP FUNCTION "public"."sync_admin_membership"();

CREATE TABLE "public"."account_contacts" (
  "user_id"           uuid                     NOT NULL,
  "email"             text                     NOT NULL,
  "pending_email"     text,
  "phone_e164"        text,
  "email_verified_at" timestamp with time zone,
  "phone_verified_at" timestamp with time zone,
  "updated_at"        timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "account_contacts_phone_check" CHECK (((phone_e164 IS NULL) OR (phone_e164 ~ '^\+[1-9][0-9]{6,14}$'::text))),
  CONSTRAINT "account_contacts_pkey" PRIMARY KEY (user_id)
);

ALTER TABLE "public"."account_contacts"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."account_contacts" FROM "anon";

CREATE TABLE "public"."account_recovery_grants" (
  "user_id"    uuid                     NOT NULL,
  "session_id" uuid                     NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  CONSTRAINT "account_recovery_grants_pkey" PRIMARY KEY (user_id)
);

ALTER TABLE "public"."account_recovery_grants"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."account_recovery_grants" FROM "anon", "authenticated";

CREATE TABLE "public"."account_verification_events" (
  "id"          bigint                   GENERATED ALWAYS AS IDENTITY NOT NULL,
  "user_id"     uuid                     NOT NULL,
  "reviewer_id" uuid,
  "field"       text                     NOT NULL,
  "value"       text                     NOT NULL,
  "verified_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "account_verification_events_field_check" CHECK ((field = ANY (ARRAY['email'::text, 'phone'::text]))),
  CONSTRAINT "account_verification_events_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."account_verification_events"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."account_verification_events" FROM "anon", "authenticated";

ALTER TABLE "public"."profiles"
  ADD COLUMN "first_name" text NOT NULL DEFAULT ''::text;

ALTER TABLE "public"."profiles"
  ADD COLUMN "last_name" text NOT NULL DEFAULT ''::text;

REVOKE ALL ON SEQUENCE "public"."account_verification_events_id_seq" FROM "anon";

REVOKE ALL ON SEQUENCE "public"."account_verification_events_id_seq" FROM "authenticated";

CREATE OR REPLACE FUNCTION private.confirm_account_contact (
  p_user_id uuid,
  p_field   text,
  p_value   text
)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare contact public.account_contacts;
begin
 if not private.account_access_allowed() or not exists(select 1 from public.admin_users where user_id=(select auth.uid())) then raise exception 'FORBIDDEN' using errcode='42501'; end if;
 if p_field is distinct from 'phone' or p_value is null then raise exception 'INVALID_INPUT' using errcode='22023'; end if;
 select * into contact from public.account_contacts where user_id=p_user_id for update;
 if not found or contact.phone_e164 is null or contact.phone_e164<>p_value then raise exception 'CONTACT_CHANGED' using errcode='40001'; end if;
 update public.account_contacts set phone_verified_at=now() where user_id=p_user_id;
 insert into public.account_verification_events(user_id,reviewer_id,field,value) values(p_user_id,(select auth.uid()),p_field,p_value);
end; $function$;

CREATE OR REPLACE FUNCTION private.contacts_verified (
  account_id uuid
)
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
 select exists(select 1 from public.account_contacts c join auth.users u on u.id=c.user_id
 where c.user_id=account_id and c.email=u.email and c.pending_email is null and nullif(u.email_change,'') is null
 and c.email_verified_at is not null and u.email_confirmed_at is not null
 and c.phone_e164 is not null and c.phone_verified_at is not null);
$function$;

CREATE OR REPLACE FUNCTION private.current_contacts_verified()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
 select private.account_access_allowed() and private.contacts_verified((select auth.uid()));
$function$;

CREATE OR REPLACE FUNCTION private.guard_new_enrollment()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
begin
 perform 1 from public.account_contacts where user_id=new.user_id for update;
 if not exists(select 1 from public.enrollments where user_id=new.user_id and course_slug=new.course_slug)
 and not private.contacts_verified(new.user_id) then
 raise exception 'CONTACT_VERIFICATION_REQUIRED' using errcode='P0001'; end if; return new;
end; $function$;

CREATE OR REPLACE FUNCTION private.reset_contact_verification()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
begin
 if new.phone_e164 is distinct from old.phone_e164 then new.phone_verified_at:=null; end if;
 new.updated_at:=now(); return new;
end; $function$;

CREATE OR REPLACE FUNCTION private.sync_admin_membership()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
begin
 if exists(select 1 from public.admin_users where user_id=new.id) then
  if TG_OP='UPDATE' and new.email is distinct from old.email then
   delete from public.admin_allowlist where email=lower(old.email);
   insert into public.admin_allowlist(email) values(lower(new.email)) on conflict do nothing;
  end if;
 elsif new.email_confirmed_at is not null and exists(select 1 from public.admin_allowlist where email=lower(new.email)) then
  insert into public.admin_users(user_id) values(new.id) on conflict do nothing;
 end if;
 return new;
end;
$function$;

CREATE OR REPLACE FUNCTION private.sync_auth_contacts()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare display_name text;
begin
 if tg_op='INSERT' then
  display_name:=trim(coalesce(new.raw_user_meta_data->>'name',''));
  if length(display_name)<2 or length(display_name)>60 then display_name:='طالب جديد'; end if;
  insert into public.profiles(id,name) values(new.id,display_name) on conflict(id) do nothing;
 end if;
 insert into public.account_contacts(user_id,email,pending_email,email_verified_at)
 values(new.id,coalesce(new.email,''),nullif(new.email_change,''),case when nullif(new.email_change,'') is null then new.email_confirmed_at end)
 on conflict(user_id) do update set email=excluded.email,pending_email=excluded.pending_email,email_verified_at=excluded.email_verified_at;
 return new;
end; $function$;

CREATE OR REPLACE FUNCTION private.sync_profile_names()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
begin
 if tg_op='INSERT' or new.name is distinct from old.name then
  if new.first_name='' then new.first_name:=split_part(new.name,' ',1); new.last_name:=trim(substr(new.name,length(new.first_name)+1)); end if;
 end if;
 if tg_op='UPDATE' and (new.first_name is distinct from old.first_name or new.last_name is distinct from old.last_name) then
  new.name:=trim(new.first_name || ' ' || new.last_name);
 elsif tg_op='UPDATE' and new.name is distinct from old.name then
  new.first_name:=split_part(new.name,' ',1); new.last_name:=trim(substr(new.name,length(new.first_name)+1));
 end if; return new;
end; $function$;

CREATE OR REPLACE FUNCTION public.confirm_account_contact (
  p_user_id uuid,
  p_field   text,
  p_value   text
)
  RETURNS void
  LANGUAGE sql
  SET search_path TO ''
  AS $function$ select private.confirm_account_contact(p_user_id,p_field,p_value); $function$;

REVOKE ALL ON FUNCTION "public"."confirm_account_contact"(uuid, text, text) FROM PUBLIC, "anon";

CREATE OR REPLACE FUNCTION public.contacts_verified()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SET search_path TO ''
  AS $function$ select private.current_contacts_verified(); $function$;

REVOKE ALL ON FUNCTION "public"."contacts_verified"() FROM PUBLIC, "anon";

CREATE OR REPLACE FUNCTION public.save_account_settings (
  p_user_id    uuid,
  p_first_name text,
  p_last_name  text,
  p_username   text,
  p_phone      text
)
  RETURNS void
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
begin
 update public.profiles set first_name=p_first_name,last_name=p_last_name,username=p_username where id=p_user_id;
 if not found then raise exception 'NOT_FOUND' using errcode='P0002'; end if;
 update public.account_contacts set phone_e164=p_phone where user_id=p_user_id;
 if not found then raise exception 'NOT_FOUND' using errcode='P0002'; end if;
end; $function$;

REVOKE ALL ON FUNCTION "public"."save_account_settings"(uuid, text, text, text, text) FROM PUBLIC, "anon", "authenticated";

ALTER TABLE "public"."account_contacts"
  ADD CONSTRAINT "account_contacts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."account_recovery_grants"
  ADD CONSTRAINT "account_recovery_grants_session_id_fkey" FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;

ALTER TABLE "public"."account_recovery_grants"
  ADD CONSTRAINT "account_recovery_grants_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."account_verification_events"
  ADD CONSTRAINT "account_verification_events_reviewer_id_fkey" FOREIGN KEY (reviewer_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE "public"."account_verification_events"
  ADD CONSTRAINT "account_verification_events_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_first_name_check" CHECK ((length(first_name) <= 60));

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_last_name_check" CHECK ((length(last_name) <= 60));

CREATE INDEX account_contacts_email_idx ON public.account_contacts USING btree (lower(email));

CREATE INDEX account_contacts_phone_idx ON public.account_contacts USING btree (phone_e164)
  WHERE (phone_e164 IS NOT NULL);

CREATE INDEX account_recovery_session_idx ON public.account_recovery_grants USING btree (session_id);

CREATE INDEX profiles_first_name_prefix_idx ON public.profiles USING spgist (lower(first_name));

CREATE INDEX verification_events_user_idx ON public.account_verification_events USING btree (user_id, field, verified_at DESC);

CREATE TRIGGER sync_admin_membership
  AFTER INSERT OR UPDATE OF email, email_confirmed_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION private.sync_admin_membership();

CREATE TRIGGER reset_contact_verification
  BEFORE UPDATE ON public.account_contacts
  FOR EACH ROW
  EXECUTE FUNCTION private.reset_contact_verification();

CREATE TRIGGER enrollment_verified_contacts
  BEFORE INSERT OR UPDATE OF user_id, course_slug ON public.enrollments
  FOR EACH ROW
  EXECUTE FUNCTION private.guard_new_enrollment();

CREATE TRIGGER profiles_names
  BEFORE INSERT OR UPDATE OF name, first_name, last_name ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION private.sync_profile_names();

CREATE POLICY "own_contacts" ON "public"."account_contacts"
  FOR SELECT
  TO "authenticated"
  USING (((user_id = ( SELECT auth.uid() AS uid)) AND ( SELECT private.account_access_allowed() AS account_access_allowed)));

REVOKE ALL ON FUNCTION "private"."confirm_account_contact"(uuid, text, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "private"."confirm_account_contact"(uuid, text, text) TO "authenticated";

REVOKE ALL ON FUNCTION "private"."contacts_verified"(uuid) FROM PUBLIC;

REVOKE ALL ON FUNCTION "private"."current_contacts_verified"() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "private"."current_contacts_verified"() TO "authenticated";

REVOKE ALL ON FUNCTION "private"."guard_new_enrollment"() FROM PUBLIC;

REVOKE ALL ON FUNCTION "private"."reset_contact_verification"() FROM PUBLIC;

REVOKE ALL ON FUNCTION "private"."sync_admin_membership"() FROM PUBLIC;

REVOKE ALL ON FUNCTION "private"."sync_auth_contacts"() FROM PUBLIC;

REVOKE ALL ON FUNCTION "private"."sync_profile_names"() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."confirm_account_contact"(uuid, text, text) TO "authenticated";

REVOKE ALL ON FUNCTION "public"."confirm_account_contact"(uuid, text, text) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."confirm_account_contact"(uuid, text, text) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."confirm_account_contact"(uuid, text, text) TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."contacts_verified"() TO "authenticated";

REVOKE ALL ON FUNCTION "public"."contacts_verified"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."contacts_verified"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."contacts_verified"() TO "service_role";

REVOKE ALL ON FUNCTION "public"."save_account_settings"(uuid, text, text, text, text) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."save_account_settings"(uuid, text, text, text, text) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."save_account_settings"(uuid, text, text, text, text) TO "service_role";

REVOKE ALL ON SEQUENCE "public"."account_verification_events_id_seq" FROM "postgres";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."account_verification_events_id_seq" TO "postgres";

REVOKE ALL ON SEQUENCE "public"."account_verification_events_id_seq" FROM "service_role";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."account_verification_events_id_seq" TO "service_role";

REVOKE ALL ON TABLE "public"."account_contacts" FROM "authenticated";

GRANT SELECT ON TABLE "public"."account_contacts" TO "authenticated";

REVOKE ALL ON TABLE "public"."account_contacts" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."account_contacts" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."account_contacts" TO "service_role";

REVOKE ALL ON TABLE "public"."account_recovery_grants" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."account_recovery_grants" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."account_recovery_grants" TO "service_role";

REVOKE ALL ON TABLE "public"."account_verification_events" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."account_verification_events" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."account_verification_events" TO "service_role";


-- Auth-schema triggers and data changes are intentionally explicit: schema pull excludes auth.
CREATE TRIGGER sync_account_contacts
AFTER INSERT OR UPDATE OF email,email_change,email_confirmed_at ON auth.users
FOR EACH ROW EXECUTE FUNCTION private.sync_auth_contacts();

UPDATE public.profiles SET first_name=split_part(name,' ',1),
last_name=trim(substr(name,length(split_part(name,' ',1))+1));
INSERT INTO public.profiles(id,name)
SELECT id,CASE WHEN length(trim(coalesce(raw_user_meta_data->>'name',''))) BETWEEN 2 AND 60
THEN trim(raw_user_meta_data->>'name') ELSE 'طالب جديد' END FROM auth.users ON CONFLICT(id) DO NOTHING;
INSERT INTO public.account_contacts(user_id,email,pending_email,email_verified_at)
SELECT id,coalesce(email,''),nullif(email_change,''),CASE WHEN nullif(email_change,'') IS NULL THEN email_confirmed_at END
FROM auth.users ON CONFLICT(user_id) DO NOTHING;
REVOKE ALL ON FUNCTION public.confirm_account_contact(uuid,text,text),public.contacts_verified() FROM PUBLIC,anon;

REVOKE ALL ON FUNCTION public.save_account_settings(uuid,text,text,text,text) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON SEQUENCE public.account_verification_events_id_seq FROM anon,authenticated;

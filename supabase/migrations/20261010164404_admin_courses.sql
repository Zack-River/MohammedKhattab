SET local check_function_bodies = off;

DROP POLICY "free_enrollment" ON "public"."enrollments";

CREATE TABLE "public"."admin_allowlist" (
  "email" text NOT NULL,
  CONSTRAINT "admin_allowlist_email_check" CHECK ((email = lower(email))),
  CONSTRAINT "admin_allowlist_pkey" PRIMARY KEY (email)
);

ALTER TABLE "public"."admin_allowlist"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."admin_allowlist" FROM "anon", "authenticated";

CREATE TABLE "public"."admin_users" (
  "user_id" uuid NOT NULL,
  CONSTRAINT "admin_users_pkey" PRIMARY KEY (user_id)
);

ALTER TABLE "public"."admin_users"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."admin_users" FROM "anon";

CREATE OR REPLACE FUNCTION public.sync_admin_membership()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
begin
  if new.email_confirmed_at is not null and exists(select 1 from public.admin_allowlist where email = lower(new.email)) then
    insert into public.admin_users(user_id) values(new.id) on conflict do nothing;
  else
    delete from public.admin_users where user_id = new.id;
  end if;
  return new;
end;
$function$;

REVOKE ALL ON FUNCTION "public"."sync_admin_membership"() FROM PUBLIC, "anon", "authenticated";

ALTER TABLE "public"."admin_users"
  ADD CONSTRAINT "admin_users_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE TRIGGER sync_admin_membership
  AFTER INSERT OR UPDATE OF email, email_confirmed_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_admin_membership();

CREATE POLICY "own_admin_membership" ON "public"."admin_users"
  FOR SELECT
  TO "authenticated"
  USING ((user_id = ( SELECT auth.uid() AS uid)));

CREATE POLICY "admin_catalog_read" ON "public"."courses"
  FOR SELECT
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM public.admin_users
  WHERE (admin_users.user_id = ( SELECT auth.uid() AS uid)))));

CREATE POLICY "admin_catalog_update" ON "public"."courses"
  FOR UPDATE
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM public.admin_users
  WHERE (admin_users.user_id = ( SELECT auth.uid() AS uid)))))
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admin_users
  WHERE (admin_users.user_id = ( SELECT auth.uid() AS uid)))));

CREATE POLICY "free_enrollment" ON "public"."enrollments"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((user_id = ( SELECT auth.uid() AS uid)) AND (EXISTS ( SELECT 1
   FROM public.courses c
  WHERE
    ((c.slug = enrollments.course_slug) AND c.published AND (c.amount = (0)::numeric) AND (COALESCE((c.metadata ->> 'delivery'::text), 'recorded'::text) <> 'live'::text) AND
    (((c.metadata -> 'offer'::text) ->> 'amountLabel'::text) IS NULL))))));

CREATE POLICY "admin_lessons_read" ON "public"."lessons"
  FOR SELECT
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM public.admin_users
  WHERE (admin_users.user_id = ( SELECT auth.uid() AS uid)))));

CREATE POLICY "admin_lessons_update" ON "public"."lessons"
  FOR UPDATE
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM public.admin_users
  WHERE (admin_users.user_id = ( SELECT auth.uid() AS uid)))))
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admin_users
  WHERE (admin_users.user_id = ( SELECT auth.uid() AS uid)))));

REVOKE ALL ON FUNCTION "public"."sync_admin_membership"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."sync_admin_membership"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."sync_admin_membership"() TO "service_role";

REVOKE ALL ON TABLE "public"."admin_allowlist" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."admin_allowlist" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."admin_allowlist" TO "service_role";

REVOKE ALL ON TABLE "public"."admin_users" FROM "authenticated";

GRANT SELECT ON TABLE "public"."admin_users" TO "authenticated";

REVOKE ALL ON TABLE "public"."admin_users" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."admin_users" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."admin_users" TO "service_role";

REVOKE ALL ON TABLE "public"."courses" FROM "authenticated";

GRANT SELECT, UPDATE ON TABLE "public"."courses" TO "authenticated";

REVOKE ALL ON TABLE "public"."lessons" FROM "authenticated";

GRANT SELECT, UPDATE ON TABLE "public"."lessons" TO "authenticated";


DROP POLICY "admin_catalog_read" ON "public"."courses";

DROP POLICY "admin_lessons_read" ON "public"."lessons";

CREATE POLICY "admin_catalog_read" ON "public"."courses"
  FOR SELECT
  TO "authenticated"
  USING ((published OR (EXISTS ( SELECT 1
   FROM public.admin_users
  WHERE (admin_users.user_id = ( SELECT auth.uid() AS uid))))));

ALTER POLICY "catalog_read" ON "public"."courses" TO "anon";

CREATE POLICY "admin_lessons_read" ON "public"."lessons"
  FOR SELECT
  TO "authenticated"
  USING (((EXISTS ( SELECT 1
   FROM public.admin_users
  WHERE (admin_users.user_id = ( SELECT auth.uid() AS uid)))) OR ((EXISTS ( SELECT 1
   FROM public.courses c
  WHERE ((c.slug = lessons.course_slug) AND c.published))) AND (preview OR (EXISTS ( SELECT 1
   FROM public.enrollments e
  WHERE ((e.course_slug = lessons.course_slug) AND (e.user_id = ( SELECT auth.uid() AS uid)))))))));

ALTER POLICY "lesson_access" ON "public"."lessons" TO "anon";


CREATE TABLE "public"."courses" (
  "slug"      text          NOT NULL,
  "metadata"  jsonb         NOT NULL,
  "amount"    numeric(12,2) NOT NULL,
  "published" boolean       NOT NULL DEFAULT false,
  CONSTRAINT "courses_amount_check" CHECK ((amount >= (0)::numeric)),
  CONSTRAINT "courses_pkey" PRIMARY KEY (slug),
  CONSTRAINT "courses_slug_check" CHECK ((slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'::text))
);

ALTER TABLE "public"."courses"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."enrollments" (
  "user_id"     uuid                     NOT NULL,
  "course_slug" text                     NOT NULL,
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "enrollments_pkey" PRIMARY KEY (user_id, course_slug)
);

ALTER TABLE "public"."enrollments"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."lesson_progress" (
  "user_id"     uuid    NOT NULL,
  "course_slug" text    NOT NULL,
  "lesson_id"   text    NOT NULL,
  "completed"   boolean NOT NULL DEFAULT false,
  CONSTRAINT "lesson_progress_pkey" PRIMARY KEY (user_id, course_slug, lesson_id)
);

ALTER TABLE "public"."lesson_progress"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."lesson_progress" FROM "anon";

CREATE TABLE "public"."lesson_resources" (
  "resource_id" text NOT NULL,
  "course_slug" text NOT NULL,
  "lesson_id"   text NOT NULL,
  CONSTRAINT "lesson_resources_pkey" PRIMARY KEY (resource_id, course_slug, lesson_id)
);

ALTER TABLE "public"."lesson_resources"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."lesson_resources" FROM "anon";

CREATE TABLE "public"."lessons" (
  "course_slug" text    NOT NULL,
  "id"          text    NOT NULL,
  "preview"     boolean NOT NULL DEFAULT false,
  "video_url"   text    NOT NULL,
  CONSTRAINT "lessons_pkey" PRIMARY KEY (course_slug, id)
);

ALTER TABLE "public"."lessons"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profiles" (
  "id"   uuid NOT NULL,
  "name" text NOT NULL,
  CONSTRAINT "profiles_name_check" CHECK (((char_length(name) >= 2) AND (char_length(name) <= 60))),
  CONSTRAINT "profiles_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."profiles"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."profiles" FROM "anon";

CREATE TABLE "public"."resources" (
  "id"          text NOT NULL,
  "title"       text NOT NULL,
  "description" text NOT NULL,
  "type"        text NOT NULL,
  "content"     text NOT NULL,
  CONSTRAINT "resources_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."resources"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."resources" FROM "anon";

ALTER TABLE "public"."enrollments"
  ADD CONSTRAINT "enrollments_course_slug_fkey" FOREIGN KEY (course_slug) REFERENCES public.courses(slug) ON DELETE CASCADE;

ALTER TABLE "public"."enrollments"
  ADD CONSTRAINT "enrollments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."lesson_progress"
  ADD CONSTRAINT "lesson_progress_user_id_course_slug_fkey" FOREIGN KEY (user_id, course_slug) REFERENCES public.enrollments(user_id, course_slug) ON DELETE CASCADE;

ALTER TABLE "public"."lessons"
  ADD CONSTRAINT "lessons_course_slug_fkey" FOREIGN KEY (course_slug) REFERENCES public.courses(slug) ON DELETE CASCADE;

ALTER TABLE "public"."lesson_progress"
  ADD CONSTRAINT "lesson_progress_course_slug_lesson_id_fkey" FOREIGN KEY (course_slug, lesson_id) REFERENCES public.lessons(course_slug, id) ON DELETE CASCADE;

ALTER TABLE "public"."lesson_resources"
  ADD CONSTRAINT "lesson_resources_course_slug_lesson_id_fkey" FOREIGN KEY (course_slug, lesson_id) REFERENCES public.lessons(course_slug, id) ON DELETE CASCADE;

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."lesson_resources"
  ADD CONSTRAINT "lesson_resources_resource_id_fkey" FOREIGN KEY (resource_id) REFERENCES public.resources(id) ON DELETE CASCADE;

CREATE INDEX enrollments_course_idx ON public.enrollments USING btree (course_slug);

CREATE INDEX progress_lesson_idx ON public.lesson_progress USING btree (course_slug, lesson_id);

CREATE INDEX resource_lesson_idx ON public.lesson_resources USING btree (course_slug, lesson_id);

CREATE POLICY "catalog_read" ON "public"."courses"
  FOR SELECT
  TO "anon", "authenticated"
  USING (published);

CREATE POLICY "free_enrollment" ON "public"."enrollments"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((user_id = ( SELECT auth.uid() AS uid)) AND (EXISTS ( SELECT 1
   FROM public.courses c
  WHERE ((c.slug = enrollments.course_slug) AND c.published AND (c.amount = (0)::numeric))))));

CREATE POLICY "own_enrollments" ON "public"."enrollments"
  FOR SELECT
  TO "authenticated"
  USING ((user_id = ( SELECT auth.uid() AS uid)));

CREATE POLICY "progress_create" ON "public"."lesson_progress"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));

CREATE POLICY "progress_read" ON "public"."lesson_progress"
  FOR SELECT
  TO "authenticated"
  USING ((user_id = ( SELECT auth.uid() AS uid)));

CREATE POLICY "progress_update" ON "public"."lesson_progress"
  FOR UPDATE
  TO "authenticated"
  USING ((user_id = ( SELECT auth.uid() AS uid)))
  WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));

CREATE POLICY "resource_links" ON "public"."lesson_resources"
  FOR SELECT
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM (public.enrollments e
     JOIN public.courses c ON ((c.slug = e.course_slug)))
  WHERE ((e.course_slug = lesson_resources.course_slug) AND (e.user_id = ( SELECT auth.uid() AS uid)) AND c.published))));

CREATE POLICY "lesson_access" ON "public"."lessons"
  FOR SELECT
  TO "anon", "authenticated"
  USING (((EXISTS ( SELECT 1
   FROM public.courses c
  WHERE ((c.slug = lessons.course_slug) AND c.published))) AND (preview OR (EXISTS ( SELECT 1
   FROM public.enrollments e
  WHERE ((e.course_slug = lessons.course_slug) AND (e.user_id = ( SELECT auth.uid() AS uid))))))));

CREATE POLICY "profiles_create" ON "public"."profiles"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((id = ( SELECT auth.uid() AS uid)));

CREATE POLICY "profiles_read" ON "public"."profiles"
  FOR SELECT
  TO "authenticated"
  USING ((id = ( SELECT auth.uid() AS uid)));

CREATE POLICY "profiles_update" ON "public"."profiles"
  FOR UPDATE
  TO "authenticated"
  USING ((id = ( SELECT auth.uid() AS uid)))
  WITH CHECK ((id = ( SELECT auth.uid() AS uid)));

CREATE POLICY "resource_access" ON "public"."resources"
  FOR SELECT
  TO "authenticated"
  USING ((EXISTS ( SELECT 1
   FROM public.lesson_resources r
  WHERE (r.resource_id = resources.id))));

REVOKE ALL ON TABLE "public"."courses" FROM "anon";

GRANT SELECT ON TABLE "public"."courses" TO "anon";

REVOKE ALL ON TABLE "public"."courses" FROM "authenticated";

GRANT SELECT ON TABLE "public"."courses" TO "authenticated";

REVOKE ALL ON TABLE "public"."courses" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."courses" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."courses" TO "service_role";

REVOKE ALL ON TABLE "public"."enrollments" FROM "anon";

GRANT SELECT ON TABLE "public"."enrollments" TO "anon";

REVOKE ALL ON TABLE "public"."enrollments" FROM "authenticated";

GRANT INSERT, SELECT ON TABLE "public"."enrollments" TO "authenticated";

REVOKE ALL ON TABLE "public"."enrollments" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."enrollments" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."enrollments" TO "service_role";

REVOKE ALL ON TABLE "public"."lesson_progress" FROM "authenticated";

GRANT INSERT, SELECT, UPDATE ON TABLE "public"."lesson_progress" TO "authenticated";

REVOKE ALL ON TABLE "public"."lesson_progress" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."lesson_progress" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."lesson_progress" TO "service_role";

REVOKE ALL ON TABLE "public"."lesson_resources" FROM "authenticated";

GRANT SELECT ON TABLE "public"."lesson_resources" TO "authenticated";

REVOKE ALL ON TABLE "public"."lesson_resources" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."lesson_resources" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."lesson_resources" TO "service_role";

REVOKE ALL ON TABLE "public"."lessons" FROM "anon";

GRANT SELECT ON TABLE "public"."lessons" TO "anon";

REVOKE ALL ON TABLE "public"."lessons" FROM "authenticated";

GRANT SELECT ON TABLE "public"."lessons" TO "authenticated";

REVOKE ALL ON TABLE "public"."lessons" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."lessons" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."lessons" TO "service_role";

REVOKE ALL ON TABLE "public"."profiles" FROM "authenticated";

GRANT INSERT, SELECT, UPDATE ON TABLE "public"."profiles" TO "authenticated";

REVOKE ALL ON TABLE "public"."profiles" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "service_role";

REVOKE ALL ON TABLE "public"."resources" FROM "authenticated";

GRANT SELECT ON TABLE "public"."resources" TO "authenticated";

REVOKE ALL ON TABLE "public"."resources" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."resources" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."resources" TO "service_role";


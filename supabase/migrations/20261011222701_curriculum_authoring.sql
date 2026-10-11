SET local check_function_bodies = off;

ALTER TABLE "public"."courses"
  ADD COLUMN "revision" integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION private.bump_course_revision()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
begin new.revision := old.revision + 1; return new; end;$function$;

CREATE OR REPLACE FUNCTION private.save_admin_curriculum (
  p_slug       text,
  p_revision   integer,
  p_modules    jsonb,
  p_lesson     jsonb   DEFAULT NULL::jsonb,
  p_deleted_id text    DEFAULT NULL::text
)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare current_revision integer;
begin
 if not private.account_access_allowed() or not exists(select 1 from public.admin_users where user_id=(select auth.uid())) then raise exception 'FORBIDDEN' using errcode='42501'; end if;
 select revision into current_revision from public.courses where slug=p_slug for update;
 if not found then raise exception 'NOT_FOUND' using errcode='P0002'; end if;
 if p_revision is null or p_revision <> current_revision then raise exception 'COURSE_CONFLICT' using errcode='40001'; end if;
 if p_modules is null or jsonb_typeof(p_modules)<>'array' then raise exception 'INVALID_INPUT' using errcode='22023'; end if;
 if exists(select 1 from jsonb_array_elements(p_modules) m, jsonb_array_elements(m->'lessons') l where coalesce(l->>'videoUrl','')<>'') then raise exception 'INVALID_INPUT' using errcode='22023'; end if;
 perform private.write_curriculum_lesson(p_slug,p_lesson,p_deleted_id);
 update public.courses set metadata=jsonb_set(metadata,'{modules}',p_modules) where slug=p_slug;
end;$function$;

CREATE OR REPLACE FUNCTION private.write_curriculum_lesson (
  p_slug       text,
  p_lesson     jsonb,
  p_deleted_id text
)
  RETURNS void
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
begin
 if p_deleted_id is not null then delete from public.lessons where course_slug=p_slug and id=p_deleted_id; end if;
 if p_lesson is not null then
  insert into public.lessons(course_slug,id,video_url,preview) values(p_slug,p_lesson->>'id',p_lesson->>'video_url',(p_lesson->>'preview')::boolean)
  on conflict(course_slug,id) do update set video_url=excluded.video_url,preview=excluded.preview;
 end if;
end;$function$;

CREATE OR REPLACE FUNCTION public.save_admin_curriculum (
  p_slug       text,
  p_revision   integer,
  p_modules    jsonb,
  p_lesson     jsonb   DEFAULT NULL::jsonb,
  p_deleted_id text    DEFAULT NULL::text
)
  RETURNS void
  LANGUAGE sql
  SET search_path TO ''
  AS $function$
 select private.save_admin_curriculum(p_slug,p_revision,p_modules,p_lesson,p_deleted_id);
$function$;

REVOKE ALL ON FUNCTION "public"."save_admin_curriculum"(text, integer, jsonb, jsonb, text) FROM PUBLIC, "anon";

CREATE TRIGGER courses_revision
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION private.bump_course_revision();

REVOKE ALL ON FUNCTION "private"."bump_course_revision"() FROM PUBLIC;

REVOKE ALL ON FUNCTION "private"."save_admin_curriculum"(text, integer, jsonb, jsonb, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "private"."save_admin_curriculum"(text, integer, jsonb, jsonb, text) TO "authenticated";

REVOKE ALL ON FUNCTION "private"."write_curriculum_lesson"(text, jsonb, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."save_admin_curriculum"(text, integer, jsonb, jsonb, text) TO "authenticated";

REVOKE ALL ON FUNCTION "public"."save_admin_curriculum"(text, integer, jsonb, jsonb, text) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."save_admin_curriculum"(text, integer, jsonb, jsonb, text) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."save_admin_curriculum"(text, integer, jsonb, jsonb, text) TO "service_role";


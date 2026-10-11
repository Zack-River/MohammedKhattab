SET local check_function_bodies = off;

CREATE EXTENSION IF NOT EXISTS "pg_trgm" SCHEMA "extensions";

ALTER TABLE "public"."courses"
  ADD COLUMN "created_at" timestamp WITH time zone;

ALTER TABLE "public"."courses"
  ADD COLUMN "updated_at" timestamp WITH time zone;

-- Legacy creation dates were not recorded. Defaults apply only to new courses.
ALTER TABLE public.courses ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE public.courses ALTER COLUMN updated_at SET DEFAULT now();
GRANT INSERT ON public.courses TO authenticated;

CREATE OR REPLACE FUNCTION private.delete_admin_course (
  p_slug text
)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
begin
 if not private.account_access_allowed() or not exists(select 1 from public.admin_users where user_id=(select auth.uid())) then raise exception 'FORBIDDEN' using errcode='42501'; end if;
 perform 1 from public.courses where slug=p_slug for update;
 if not found then raise exception 'NOT_FOUND' using errcode='P0002'; end if;
 if exists(select 1 from public.enrollments where course_slug=p_slug) then raise exception 'COURSE_HAS_STUDENTS' using errcode='P0001'; end if;
 delete from public.courses where slug=p_slug;
end;$function$;

CREATE OR REPLACE FUNCTION private.search_admin_courses (
  p_search    text    DEFAULT ''::text,
  p_category  text    DEFAULT 'all'::text,
  p_statuses  text[]  DEFAULT '{}'::text[],
  p_delivery  text    DEFAULT 'all'::text,
  p_sort      text    DEFAULT 'created'::text,
  p_direction text    DEFAULT 'desc'::text,
  p_page      integer DEFAULT 1,
  p_limit     integer DEFAULT 5
)
  RETURNS jsonb
  LANGUAGE plpgsql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare result jsonb; pattern text:='%'||replace(replace(replace(lower(p_search),'\','\\'),'%','\%'),'_','\_')||'%';
begin
 if not private.account_access_allowed() or not exists(select 1 from public.admin_users where user_id=(select auth.uid())) then raise exception 'FORBIDDEN' using errcode='42501'; end if;
 if p_search is null or p_category is null or p_statuses is null or p_delivery is null or p_sort is null or p_direction is null or p_page is null or p_limit is null or length(p_search)>100 or p_page<1 or p_page>999999 or p_limit<1 or p_limit>5 or p_sort not in ('created','updated','students') or p_direction not in ('asc','desc') or p_category not in ('all','editing','motion','design','business') or p_delivery not in ('all','recorded','live') or not(p_statuses <@ array['published','draft']) then raise exception 'INVALID_INPUT' using errcode='22023'; end if;
 with filtered as materialized (
  select c.*, (select count(*) from public.enrollments e where e.course_slug=c.slug) as students,
   (select count(*) from public.lessons l where l.course_slug=c.slug) as lessons,
   jsonb_array_length(coalesce(c.metadata->'modules','[]')) as chapters,
   (select coalesce(sum(jsonb_array_length(coalesce(m->'sections','[]'))),0) from jsonb_array_elements(coalesce(c.metadata->'modules','[]')) m) as sections
  from public.courses c where (p_search='' or lower(c.metadata->>'title') like pattern escape '\' or c.slug like pattern escape '\')
   and (p_category='all' or c.metadata->>'category'=p_category)
   and (p_delivery='all' or coalesce(c.metadata->>'delivery','recorded')=p_delivery)
   and (cardinality(p_statuses)=0 or (c.published and 'published'=any(p_statuses)) or (not c.published and 'draft'=any(p_statuses)))
 ), ordered as (
  select *,row_number() over(order by
   case when p_sort='created' and p_direction='desc' then created_at end desc nulls last,
   case when p_sort='created' and p_direction='asc' then created_at end asc nulls last,
   case when p_sort='updated' and p_direction='desc' then updated_at end desc nulls last,
   case when p_sort='updated' and p_direction='asc' then updated_at end asc nulls last,
   case when p_sort='students' and p_direction='desc' then students end desc,
   case when p_sort='students' and p_direction='asc' then students end asc,slug) as rank from filtered
 ), paged as (select * from ordered order by rank offset (p_page-1)*p_limit limit p_limit)
 select jsonb_build_object('courses',coalesce((select jsonb_agg(jsonb_build_object('slug',slug,'title',metadata->>'title','category',metadata->>'category','delivery',coalesce(metadata->>'delivery','recorded'),'published',published,'createdAt',created_at,'updatedAt',updated_at,'students',students,'lessons',lessons,'chapters',chapters,'sections',sections) order by rank) from paged),'[]'), 'total',(select count(*) from filtered),'page',p_page,'hasNext',(select count(*) from filtered)>p_page*p_limit) into result;
 return result;
end;$function$;

CREATE OR REPLACE FUNCTION private.touch_course_from_lesson()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
begin
 update public.courses set updated_at=clock_timestamp() where slug=coalesce(new.course_slug,old.course_slug);
 return coalesce(new,old);
end;$function$;

CREATE OR REPLACE FUNCTION private.touch_course_updated_at()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
begin
 if new is distinct from old then new.updated_at:=clock_timestamp(); end if;
 return new;
end;$function$;

CREATE OR REPLACE FUNCTION public.delete_admin_course (
  p_slug text
)
  RETURNS void
  LANGUAGE sql
  SET search_path TO ''
  AS $function$select private.delete_admin_course(p_slug);$function$;

REVOKE ALL ON FUNCTION "public"."delete_admin_course"(text) FROM PUBLIC, "anon";

CREATE OR REPLACE FUNCTION public.search_admin_courses (
  p_search    text    DEFAULT ''::text,
  p_category  text    DEFAULT 'all'::text,
  p_statuses  text[]  DEFAULT '{}'::text[],
  p_delivery  text    DEFAULT 'all'::text,
  p_sort      text    DEFAULT 'created'::text,
  p_direction text    DEFAULT 'desc'::text,
  p_page      integer DEFAULT 1,
  p_limit     integer DEFAULT 5
)
  RETURNS jsonb
  LANGUAGE sql
  STABLE
  SET search_path TO ''
  AS $function$select private.search_admin_courses(p_search,p_category,p_statuses,p_delivery,p_sort,p_direction,p_page,p_limit);$function$;

REVOKE ALL ON FUNCTION "public"."search_admin_courses"(text, text, text[], text, text, text, integer, integer) FROM PUBLIC, "anon";

CREATE INDEX courses_category_idx ON public.courses USING btree (((metadata ->> 'category'::text)));

CREATE INDEX courses_created_at_idx ON public.courses USING btree (created_at DESC NULLS LAST, slug);

CREATE INDEX courses_title_search_idx ON public.courses USING gin (lower((metadata ->> 'title'::text)) extensions.gin_trgm_ops);

CREATE INDEX courses_updated_at_idx ON public.courses USING btree (updated_at DESC NULLS LAST, slug);

CREATE TRIGGER courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION private.touch_course_updated_at();

CREATE TRIGGER lessons_course_updated_at
  AFTER INSERT OR DELETE OR UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION private.touch_course_from_lesson();

CREATE POLICY "admin_catalog_insert" ON "public"."courses"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.admin_users
  WHERE (admin_users.user_id = ( SELECT auth.uid() AS uid)))));

COMMENT ON EXTENSION "pg_trgm" IS 'text similarity measurement and index searching based on trigrams';

REVOKE ALL ON FUNCTION "private"."delete_admin_course"(text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "private"."delete_admin_course"(text) TO "authenticated";

REVOKE ALL ON FUNCTION "private"."search_admin_courses"(text, text, text[], text, text, text, integer, integer) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "private"."search_admin_courses"(text, text, text[], text, text, text, integer, integer) TO "authenticated";

REVOKE ALL ON FUNCTION "private"."touch_course_from_lesson"() FROM PUBLIC;

REVOKE ALL ON FUNCTION "private"."touch_course_updated_at"() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION "public"."delete_admin_course"(text) TO "authenticated";

REVOKE ALL ON FUNCTION "public"."delete_admin_course"(text) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."delete_admin_course"(text) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."delete_admin_course"(text) TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."search_admin_courses"(text, text, text[], text, text, text, integer, integer) TO "authenticated";

REVOKE ALL ON FUNCTION "public"."search_admin_courses"(text, text, text[], text, text, text, integer, integer) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."search_admin_courses"(text, text, text[], text, text, text, integer, integer) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."search_admin_courses"(text, text, text[], text, text, text, integer, integer) TO "service_role";


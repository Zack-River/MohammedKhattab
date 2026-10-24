-- Allow unrestricted administrator course deletion by cascading student connections and records

-- 1. Certificates
alter table public.certificates drop constraint if exists certificates_course_slug_fkey;
alter table public.certificates add constraint certificates_course_slug_fkey
  foreign key (course_slug) references public.courses(slug) on delete cascade;

-- 2. Commerce bundle courses
alter table public.commerce_bundle_courses drop constraint if exists commerce_bundle_courses_course_slug_fkey;
alter table public.commerce_bundle_courses add constraint commerce_bundle_courses_course_slug_fkey
  foreign key (course_slug) references public.courses(slug) on delete cascade;

-- 3. Commerce discounts
alter table public.commerce_discounts drop constraint if exists commerce_discounts_course_slug_fkey;
alter table public.commerce_discounts add constraint commerce_discounts_course_slug_fkey
  foreign key (course_slug) references public.courses(slug) on delete set null;

-- 4. Payment order items
alter table public.payment_order_items drop constraint if exists payment_order_items_course_slug_fkey;
alter table public.payment_order_items add constraint payment_order_items_course_slug_fkey
  foreign key (course_slug) references public.courses(slug) on delete cascade;

-- 5. Payment orders
alter table public.payment_orders drop constraint if exists payment_orders_course_slug_fkey;
alter table public.payment_orders add constraint payment_orders_course_slug_fkey
  foreign key (course_slug) references public.courses(slug) on delete cascade;

-- 6. Update private.delete_admin_course function
create or replace function private.delete_admin_course (
  p_slug text
)
  returns void
  language plpgsql
  security definer
  set search_path to ''
  as $function$
begin
 if not private.account_access_allowed() or not exists(select 1 from public.admin_users where user_id=(select auth.uid())) then
   raise exception 'FORBIDDEN' using errcode='42501';
 end if;
 perform 1 from public.courses where slug=p_slug for update;
 if not found then
   raise exception 'NOT_FOUND' using errcode='P0002';
 end if;

 -- Clean up student and commercial links to ensure clean cascade and execution
 delete from public.certificates where course_slug=p_slug;
 delete from public.enrollment_events where course_slug=p_slug;
 delete from public.enrollments where course_slug=p_slug;
 delete from public.commerce_bundle_courses where course_slug=p_slug;
 update public.commerce_discounts set course_slug=null where course_slug=p_slug;
 delete from public.payment_order_items where course_slug=p_slug;
 delete from public.payment_orders where course_slug=p_slug;

 delete from public.courses where slug=p_slug;
end $function$;

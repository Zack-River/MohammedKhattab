-- Commercial configuration is server-only. No coupons or draft bundles are exposed by the Data API.
create table public.commerce_bundles (
 slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug)<=100),
 title text not null check (length(trim(title)) between 1 and 160),
 description text not null default '' check (length(description)<=4000),
 amount_minor integer not null check (amount_minor between 100 and 100000000),
 enabled boolean not null default false,
 revision integer not null default 1,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.commerce_bundle_courses (
 bundle_slug text not null references public.commerce_bundles(slug) on delete cascade,
 course_slug text not null references public.courses(slug) on delete restrict,
 position integer not null check(position between 0 and 19),
 primary key(bundle_slug,course_slug), unique(bundle_slug,position)
);
create index commerce_bundle_courses_course_idx on public.commerce_bundle_courses(course_slug);
create table public.commerce_discounts (
 id uuid primary key default gen_random_uuid(),
 kind text not null check(kind in ('offers','coupons')),
 key text not null unique,
 title text not null check(length(trim(title)) between 1 and 160),
 description text not null default '' check(length(description)<=4000),
 course_slug text references public.courses(slug) on delete restrict,
 bundle_slug text references public.commerce_bundles(slug) on delete restrict,
 discount_type text not null check(discount_type in ('percent','fixed')),
 discount_value integer not null,
 starts_at timestamptz, ends_at timestamptz,
 enabled boolean not null default false, stackable boolean not null default false,
 minimum_minor integer not null default 0 check(minimum_minor between 0 and 100000000),
 maximum_uses integer check(maximum_uses between 1 and 1000000),
 per_user_limit integer not null default 1 check(per_user_limit between 1 and 1000000),
 revision integer not null default 1, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check (ends_at is null or starts_at is null or ends_at>starts_at),
 check (not(course_slug is not null and bundle_slug is not null)),
 check (kind<>'offers' or course_slug is not null or bundle_slug is not null),
 check (discount_value between 1 and case when discount_type='percent' then 100 else 100000000 end),
 check ((kind='coupons' and key ~ '^[A-Z0-9_-]{1,40}$') or (kind='offers' and key ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(key)<=100))
);
create unique index commerce_one_course_offer_idx on public.commerce_discounts(course_slug) where enabled and kind='offers';
create unique index commerce_one_bundle_offer_idx on public.commerce_discounts(bundle_slug) where enabled and kind='offers';
create index commerce_discounts_bundle_idx on public.commerce_discounts(bundle_slug);
create index commerce_discounts_course_idx on public.commerce_discounts(course_slug);
create index commerce_discounts_listing_idx on public.commerce_discounts(kind,updated_at desc);
alter table public.commerce_bundles enable row level security;
alter table public.commerce_bundle_courses enable row level security;
alter table public.commerce_discounts enable row level security;
revoke all on public.commerce_bundles,public.commerce_bundle_courses,public.commerce_discounts from public,anon,authenticated;
grant select,insert,update,delete on public.commerce_bundles,public.commerce_bundle_courses,public.commerce_discounts to service_role;

alter table public.payment_orders alter column course_slug drop not null;
alter table public.payment_orders add column bundle_slug text references public.commerce_bundles(slug) on delete restrict;
alter table public.payment_orders add column coupon_id uuid references public.commerce_discounts(id) on delete restrict;
alter table public.payment_orders add column pricing_snapshot jsonb;
alter table public.payment_orders add constraint payment_product_check check ((course_slug is not null)::integer+(bundle_slug is not null)::integer=1);
alter table public.payment_orders drop constraint payment_orders_amount_minor_check;
alter table public.payment_orders add constraint payment_orders_amount_minor_check check(amount_minor>=0);
create unique index payment_orders_bundle_active_idx on public.payment_orders(user_id,bundle_slug) where status in ('creating','pending');
create index payment_orders_bundle_idx on public.payment_orders(bundle_slug);
create index payment_orders_coupon_idx on public.payment_orders(coupon_id,user_id,status);
create table public.payment_order_items (
 order_id uuid not null references public.payment_orders(id) on delete cascade,
 course_slug text not null references public.courses(slug) on delete restrict,
 primary key(order_id,course_slug)
);
insert into public.payment_order_items(order_id,course_slug) select id,course_slug from public.payment_orders;
create index payment_order_items_course_idx on public.payment_order_items(course_slug,order_id);
alter table public.payment_order_items enable row level security;
revoke all on public.payment_order_items from public,anon,authenticated;
grant select,insert,update,delete on public.payment_order_items to service_role;

create function private.discount_minor(p_base integer,p_type text,p_value integer) returns integer
language sql immutable strict set search_path='' as $$
 select least(p_base,case when p_type='percent' then floor(p_base::numeric*p_value/100)::integer else p_value end);
$$;
create function private.commerce_product(p_kind text,p_slug text) returns jsonb language plpgsql set search_path='' as $$
declare result jsonb;
begin
 if p_kind='course' then
  select jsonb_build_object('kind',p_kind,'slug',slug,'title',metadata->>'title','baseMinor',(amount*100)::integer,'courseSlugs',jsonb_build_array(slug)) into result from public.courses where slug=p_slug and published;
 elsif p_kind='bundle' then
  select jsonb_build_object('kind',p_kind,'slug',b.slug,'title',b.title,'baseMinor',b.amount_minor,'courseSlugs',jsonb_agg(c.slug order by bc.position)) into result
  from public.commerce_bundles b join public.commerce_bundle_courses bc on bc.bundle_slug=b.slug join public.courses c on c.slug=bc.course_slug
  where b.slug=p_slug and b.enabled group by b.slug having count(*) between 2 and 20 and bool_and(c.published);
 end if;
 if result is null then raise exception 'INVALID_PAYMENT_COURSE'; end if;
 return result;
end $$;
-- Reservations with provider intents survive local expiry until the provider confirms failure.
-- This prevents a delayed valid webhook from exceeding a coupon limit.
create function private.coupon_reserved(p_coupon uuid,p_user uuid default null) returns integer language sql stable set search_path='' as $$
 select count(*)::integer from public.payment_orders where coupon_id=p_coupon and (p_user is null or user_id=p_user)
 and (status='paid' or status in ('creating','pending') and expires_at>now() or provider_intent_key is not null and status<>'failed');
$$;
create function private.apply_coupon(p_quote jsonb,p_code text,p_user uuid) returns jsonb language plpgsql set search_path='' as $$
declare c public.commerce_discounts; subtotal integer; reduction integer;
begin
 if p_code is null or p_code='' then return p_quote; end if;
 if p_user is null then raise exception 'UNAUTHENTICATED'; end if;
 select * into c from public.commerce_discounts where kind='coupons' and key=upper(p_code);
 subtotal:=(p_quote->>'baseMinor')::integer-(p_quote->>'offerMinor')::integer;
 if c.id is null or not c.enabled or c.starts_at>now() or c.ends_at<=now()
 or c.course_slug is not null and (p_quote->>'kind'<>'course' or c.course_slug<>p_quote->>'slug')
 or c.bundle_slug is not null and (p_quote->>'kind'<>'bundle' or c.bundle_slug<>p_quote->>'slug')
 or subtotal<c.minimum_minor or not c.stackable and (p_quote->>'offerMinor')::integer>0
 or c.maximum_uses is not null and private.coupon_reserved(c.id)>=c.maximum_uses
 or private.coupon_reserved(c.id,p_user)>=c.per_user_limit then raise exception 'COUPON_UNAVAILABLE'; end if;
 reduction:=private.discount_minor(subtotal,c.discount_type,c.discount_value);
 return p_quote||jsonb_build_object('couponMinor',reduction,'totalMinor',subtotal-reduction,'couponCode',c.key,'couponId',c.id);
end $$;
create function public.quote_commerce(p_kind text,p_slug text,p_coupon text default null,p_user uuid default null) returns jsonb language plpgsql set search_path='' as $$
declare q jsonb; d public.commerce_discounts; reduction integer:=0;
begin
 q:=private.commerce_product(p_kind,p_slug);
 select * into d from public.commerce_discounts where kind='offers' and enabled and (starts_at is null or starts_at<=now()) and (ends_at is null or ends_at>now())
 and ((p_kind='course' and course_slug=p_slug) or (p_kind='bundle' and bundle_slug=p_slug));
 if d.id is not null then reduction:=private.discount_minor((q->>'baseMinor')::integer,d.discount_type,d.discount_value); end if;
 q:=q||jsonb_build_object('offerMinor',reduction,'couponMinor',0,'totalMinor',(q->>'baseMinor')::integer-reduction,'offerTitle',d.title,'couponCode',null,'endsAt',d.ends_at);
 return private.apply_coupon(q,p_coupon,p_user);
end $$;
create function public.catalog_offer_prices() returns jsonb language sql stable set search_path='' as $$
 select coalesce(jsonb_object_agg(c.slug,jsonb_build_object('baseMinor',c.amount*100,'totalMinor',c.amount*100-private.discount_minor((c.amount*100)::integer,d.discount_type,d.discount_value),'title',d.title,'endsAt',d.ends_at)),'{}')
 from public.courses c join public.commerce_discounts d on d.course_slug=c.slug and d.kind='offers' and d.enabled and (d.starts_at is null or d.starts_at<=now()) and (d.ends_at is null or d.ends_at>now()) where c.published;
$$;

create function private.assert_commerce_access(p_user uuid,p_courses text[]) returns void language plpgsql set search_path='' as $$
begin
 if exists(select 1 from public.enrollments where user_id=p_user and course_slug=any(p_courses)) then raise exception 'ALREADY_ENROLLED'; end if;
 if exists(select 1 from public.payment_orders o join public.payment_order_items i on i.order_id=o.id where o.user_id=p_user and i.course_slug=any(p_courses) and o.status='paid') then raise exception 'PAYMENT_ALREADY_PAID'; end if;
 if exists(select 1 from public.payment_orders o join public.payment_order_items i on i.order_id=o.id where o.user_id=p_user and i.course_slug=any(p_courses) and o.status in ('creating','pending')) then raise exception 'PAYMENT_OVERLAP'; end if;
end $$;
create function public.begin_commerce_payment(p_user uuid,p_kind text,p_slug text,p_coupon text,p_live boolean,p_expected integer default null) returns jsonb language plpgsql set search_path='' as $$
declare q jsonb; o public.payment_orders; v_courses text[];
begin
 perform pg_advisory_xact_lock(hashtextextended('commerce:'||p_user::text,0));
 perform 1 from public.account_contacts where user_id=p_user for update;
 if not private.contacts_verified(p_user) then raise exception 'CONTACT_VERIFICATION_REQUIRED'; end if;
 update public.payment_orders set status='expired' where user_id=p_user and status in ('creating','pending') and (expires_at<now() or (status='creating' and created_at<now()-interval '5 minutes'));
 select * into o from public.payment_orders where user_id=p_user and status in ('creating','pending') and ((p_kind='course' and course_slug=p_slug) or (p_kind='bundle' and bundle_slug=p_slug));
 if o.id is not null then
  if p_expected is not null and p_expected<>o.amount_minor then raise exception 'PAYMENT_PRICE_CHANGED'; end if;
  if exists(select 1 from public.enrollments e join public.payment_order_items i on i.course_slug=e.course_slug where i.order_id=o.id and e.user_id=p_user) then raise exception 'ALREADY_ENROLLED'; end if;
  if coalesce(o.pricing_snapshot->>'couponCode','')<>coalesce(upper(p_coupon),'') then raise exception 'PAYMENT_PRICE_LOCKED'; end if;
  return jsonb_build_object('order',to_jsonb(o),'created',false);
 end if;
 -- Lock configuration before reading. Bundle edits use bundle -> courses -> discounts ordering too.
 if p_kind='bundle' then perform 1 from public.commerce_bundles where slug=p_slug for share; end if;
 q:=private.commerce_product(p_kind,p_slug);
 select array_agg(value) into v_courses from jsonb_array_elements_text(q->'courseSlugs');
 perform 1 from public.courses where slug=any(v_courses) order by slug for share;
 perform 1 from public.commerce_discounts where (kind='offers' and ((p_kind='course' and course_slug=p_slug) or (p_kind='bundle' and bundle_slug=p_slug))) or (kind='coupons' and key=upper(p_coupon)) order by id for update;
 q:=public.quote_commerce(p_kind,p_slug,p_coupon,p_user);
 if (q->>'baseMinor')::integer<=0 then raise exception 'INVALID_PAYMENT_COURSE'; end if;
 if p_expected is not null and p_expected<>(q->>'totalMinor')::integer then raise exception 'PAYMENT_PRICE_CHANGED'; end if;
 perform private.assert_commerce_access(p_user,v_courses);
 insert into public.payment_orders(user_id,course_slug,bundle_slug,course_title,amount_minor,live,coupon_id,pricing_snapshot)
 values(p_user,case when p_kind='course' then p_slug end,case when p_kind='bundle' then p_slug end,q->>'title',(q->>'totalMinor')::integer,p_live,(q->>'couponId')::uuid,q) returning * into o;
 insert into public.payment_order_items(order_id,course_slug) select o.id,unnest(v_courses) on conflict do nothing;
 if o.amount_minor=0 then
  update public.payment_orders set status='paid',paid_at=now() where id=o.id returning * into o;
  insert into public.enrollments(user_id,course_slug) select p_user,unnest(v_courses) on conflict do nothing;
 end if;
 return jsonb_build_object('order',to_jsonb(o),'created',true);
end $$;
create or replace function public.begin_course_payment(p_user uuid,p_slug text,p_live boolean) returns jsonb language sql set search_path='' as $$
 select public.begin_commerce_payment(p_user,'course',p_slug,null,p_live);
$$;
create or replace function public.settle_course_payment(p_order uuid,p_intent text,p_transaction bigint,p_amount integer,p_currency text) returns void language plpgsql set search_path='' as $$
declare o public.payment_orders;
begin
 if p_order is null or p_intent is null or p_transaction is null or p_amount is null or p_currency is null then raise exception 'PAYMENT_MISMATCH'; end if;
 select * into o from public.payment_orders where id=p_order;
 if o.id is null then raise exception 'PAYMENT_MISMATCH'; end if;
 perform pg_advisory_xact_lock(hashtextextended('commerce:'||o.user_id::text,0));
 perform 1 from public.account_contacts where user_id=o.user_id for update;
 select * into o from public.payment_orders where id=p_order for update;
 if o.provider_intent_key is distinct from p_intent or o.amount_minor<>p_amount or o.currency<>p_currency or p_transaction<=0 or o.amount_minor=0 then raise exception 'PAYMENT_MISMATCH'; end if;
 if o.status='paid' and o.transaction_id<>p_transaction then raise exception 'PAYMENT_MISMATCH'; end if;
 update public.payment_orders set status='paid',transaction_id=p_transaction,paid_at=coalesce(paid_at,now()) where id=p_order;
 if private.contacts_verified(o.user_id) then
  insert into public.enrollments(user_id,course_slug) select o.user_id,course_slug from public.payment_order_items where order_id=o.id on conflict do nothing;
 end if;
end $$;

create function public.save_commerce_bundle(p_input jsonb) returns void language plpgsql set search_path='' as $$
declare b public.commerce_bundles; slugs text[]; expected integer:=(p_input->>'revision')::integer;
begin
 select array_agg(value) into slugs from jsonb_array_elements_text(p_input->'courseSlugs');
 if cardinality(slugs) not between 2 and 20 or cardinality(slugs)<>(select count(distinct x) from unnest(slugs) x) then raise exception 'INVALID_INPUT'; end if;
 select * into b from public.commerce_bundles where slug=p_input->>'key' for update;
 if (b.slug is null and expected<>0) or (b.slug is not null and b.revision<>expected) then raise exception 'COMMERCE_CONFLICT'; end if;
 perform 1 from public.courses where slug=any(slugs) order by slug for share;
 if (select count(*) from public.courses where slug=any(slugs))<>cardinality(slugs) or ((p_input->>'enabled')::boolean and exists(select 1 from public.courses where slug=any(slugs) and not published)) then raise exception 'INVALID_BUNDLE_COURSES'; end if;
 if b.slug is null then
  insert into public.commerce_bundles(slug,title,description,amount_minor,enabled) values(p_input->>'key',p_input->>'title',p_input->>'description',(p_input->>'amountMinor')::integer,(p_input->>'enabled')::boolean);
 else
  update public.commerce_bundles set title=p_input->>'title',description=p_input->>'description',amount_minor=(p_input->>'amountMinor')::integer,enabled=(p_input->>'enabled')::boolean,revision=revision+1,updated_at=now() where slug=b.slug;
 end if;
 delete from public.commerce_bundle_courses where bundle_slug=p_input->>'key';
 insert into public.commerce_bundle_courses(bundle_slug,course_slug,position) select p_input->>'key',value,ordinality-1 from jsonb_array_elements_text(p_input->'courseSlugs') with ordinality;
end $$;
create function public.save_commerce_discount(p_kind text,p_input jsonb) returns void language plpgsql set search_path='' as $$
declare d public.commerce_discounts; expected integer:=(p_input->>'revision')::integer;
begin
 select * into d from public.commerce_discounts where key=p_input->>'key' for update;
 if (d.id is null and expected<>0) or (d.id is not null and (d.revision<>expected or d.kind<>p_kind)) then raise exception 'COMMERCE_CONFLICT'; end if;
 if d.id is null then
  insert into public.commerce_discounts(kind,key,title,description,course_slug,bundle_slug,discount_type,discount_value,starts_at,ends_at,enabled,stackable,minimum_minor,maximum_uses,per_user_limit)
  values(p_kind,p_input->>'key',p_input->>'title',p_input->>'description',p_input->>'courseSlug',p_input->>'bundleSlug',p_input->>'discountType',(p_input->>'discountValue')::integer,(p_input->>'startsAt')::timestamptz,(p_input->>'endsAt')::timestamptz,(p_input->>'enabled')::boolean,(p_input->>'stackable')::boolean,(p_input->>'minimumMinor')::integer,(p_input->>'maximumUses')::integer,(p_input->>'perUserLimit')::integer);
 else
  update public.commerce_discounts set title=p_input->>'title',description=p_input->>'description',course_slug=p_input->>'courseSlug',bundle_slug=p_input->>'bundleSlug',discount_type=p_input->>'discountType',discount_value=(p_input->>'discountValue')::integer,starts_at=(p_input->>'startsAt')::timestamptz,ends_at=(p_input->>'endsAt')::timestamptz,enabled=(p_input->>'enabled')::boolean,stackable=(p_input->>'stackable')::boolean,minimum_minor=(p_input->>'minimumMinor')::integer,maximum_uses=(p_input->>'maximumUses')::integer,per_user_limit=(p_input->>'perUserLimit')::integer,revision=expected+1,updated_at=now() where id=d.id;
 end if;
end $$;
create function public.delete_commerce_record(p_kind text,p_key text,p_revision integer) returns void language plpgsql set search_path='' as $$
begin
 if p_kind='bundles' then
  delete from public.commerce_bundles where slug=p_key and revision=p_revision;
 else
  delete from public.commerce_discounts where kind=p_kind and key=p_key and revision=p_revision;
 end if;
 if not found then raise exception 'COMMERCE_CONFLICT'; end if;
end $$;
-- Populate legacy single-course writes too; new bundle writes explicitly insert their snapshot items.
create function private.single_course_order_item() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.course_slug is not null then insert into public.payment_order_items(order_id,course_slug) values(new.id,new.course_slug) on conflict do nothing; end if;
 return new;
end $$;
create trigger single_course_order_item after insert on public.payment_orders for each row execute function private.single_course_order_item();
revoke all on function private.single_course_order_item() from public,anon,authenticated;

revoke all on function private.discount_minor(integer,text,integer),private.commerce_product(text,text),private.coupon_reserved(uuid,uuid),private.apply_coupon(jsonb,text,uuid),private.assert_commerce_access(uuid,text[]) from public,anon,authenticated;
grant execute on function private.discount_minor(integer,text,integer),private.commerce_product(text,text),private.coupon_reserved(uuid,uuid),private.apply_coupon(jsonb,text,uuid),private.assert_commerce_access(uuid,text[]) to service_role;
revoke all on function public.quote_commerce(text,text,text,uuid),public.catalog_offer_prices(),public.begin_commerce_payment(uuid,text,text,text,boolean,integer),public.save_commerce_bundle(jsonb),public.save_commerce_discount(text,jsonb),public.delete_commerce_record(text,text,integer) from public,anon,authenticated;
grant execute on function public.quote_commerce(text,text,text,uuid),public.catalog_offer_prices(),public.begin_commerce_payment(uuid,text,text,text,boolean,integer),public.save_commerce_bundle(jsonb),public.save_commerce_discount(text,jsonb),public.delete_commerce_record(text,text,integer) to service_role;
notify pgrst,'reload schema';

create function public.commerce_bundle_catalog() returns jsonb language sql stable set search_path='' as $$
 with eligible as materialized (
  select b.slug,b.title,b.description from public.commerce_bundles b
  where b.enabled and (select count(*) from public.commerce_bundle_courses bc where bc.bundle_slug=b.slug) between 2 and 20
  and not exists(select 1 from public.commerce_bundle_courses bc join public.courses c on c.slug=bc.course_slug where bc.bundle_slug=b.slug and not c.published)
  order by b.created_at desc limit 100
 ) select coalesce(jsonb_agg(jsonb_build_object('slug',slug,'title',title,'description',description,'quote',public.quote_commerce('bundle',slug))),'[]') from eligible;
$$;
revoke all on function public.commerce_bundle_catalog() from public,anon,authenticated;
grant execute on function public.commerce_bundle_catalog() to service_role;
notify pgrst,'reload schema';

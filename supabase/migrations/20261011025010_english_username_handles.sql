SET local check_function_bodies = off;

ALTER TABLE "public"."profiles"
  DROP CONSTRAINT "profiles_username_check";

CREATE OR REPLACE FUNCTION private.generate_default_username (
  full_name text
)
  RETURNS text
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare candidate text;
begin
 for attempt in 1..128 loop
  candidate := coalesce(private.username_base(full_name), private.username_fallback_base(private.username_random_number(2147483647)))
   || (100000 + private.username_random_number(900000))::text;
  perform pg_advisory_xact_lock(hashtextextended(candidate,0));
  if not exists(select 1 from public.profiles where username=candidate) then return candidate; end if;
 end loop;
 raise exception 'USERNAME_GENERATION_EXHAUSTED' using errcode='23505';
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
with words as (select regexp_split_to_array(trim(full_name), '\s+') as parts), names as (
 select parts[1] || case when cardinality(parts)>1 then parts[cardinality(parts)] else '' end as value from words
)
select case when value ~ '^[A-Za-z0-9''.-]+$' and value ~ '[A-Za-z]'
 then nullif(left(regexp_replace(lower(value), '[^a-z0-9]', '', 'g'),42),'') end from names;
$function$;

CREATE OR REPLACE FUNCTION private.username_fallback_base (
  seed integer
)
  RETURNS text
  LANGUAGE sql
  IMMUTABLE
  SET search_path TO ''
  AS $function$
select (array['building-bold','building-brave','building-bright','building-calm','building-clever','building-gentle','building-happy','building-kind','building-lively','building-patient','building-proud','building-quiet','building-sunny','building-swift','building-warm','building-wise','coding-bold','coding-brave','coding-bright','coding-calm','coding-clever','coding-gentle','coding-happy','coding-kind','coding-lively','coding-patient','coding-proud','coding-quiet','coding-sunny','coding-swift','coding-warm','coding-wise','creating-bold','creating-brave','creating-bright','creating-calm','creating-clever','creating-gentle','creating-happy','creating-kind','creating-lively','creating-patient','creating-proud','creating-quiet','creating-sunny','creating-swift','creating-warm','creating-wise','dancing-bold','dancing-brave','dancing-bright','dancing-calm','dancing-clever','dancing-gentle','dancing-happy','dancing-kind','dancing-lively','dancing-patient','dancing-proud','dancing-quiet','dancing-sunny','dancing-swift','dancing-warm','dancing-wise','drawing-bold','drawing-brave','drawing-bright','drawing-calm','drawing-clever','drawing-gentle','drawing-happy','drawing-kind','drawing-lively','drawing-patient','drawing-proud','drawing-quiet','drawing-sunny','drawing-swift','drawing-warm','drawing-wise','dreaming-bold','dreaming-brave','dreaming-bright','dreaming-calm','dreaming-clever','dreaming-gentle','dreaming-happy','dreaming-kind','dreaming-lively','dreaming-patient','dreaming-proud','dreaming-quiet','dreaming-sunny','dreaming-swift','dreaming-warm','dreaming-wise','exploring-bold','exploring-brave','exploring-bright','exploring-calm','exploring-clever','exploring-gentle','exploring-happy','exploring-kind','exploring-lively','exploring-patient','exploring-proud','exploring-quiet','exploring-sunny','exploring-swift','exploring-warm','exploring-wise','growing-bold','growing-brave','growing-bright','growing-calm','growing-clever','growing-gentle','growing-happy','growing-kind','growing-lively','growing-patient','growing-proud','growing-quiet','growing-sunny','growing-swift','growing-warm','growing-wise','learning-bold','learning-brave','learning-bright','learning-calm','learning-clever','learning-gentle','learning-happy','learning-kind','learning-lively','learning-patient','learning-proud','learning-quiet','learning-sunny','learning-swift','learning-warm','learning-wise','painting-bold','painting-brave','painting-bright','painting-calm','painting-clever','painting-gentle','painting-happy','painting-kind','painting-lively','painting-patient','painting-proud','painting-quiet','painting-sunny','painting-swift','painting-warm','painting-wise','reading-bold','reading-brave','reading-bright','reading-calm','reading-clever','reading-gentle','reading-happy','reading-kind','reading-lively','reading-patient','reading-proud','reading-quiet','reading-sunny','reading-swift','reading-warm','reading-wise','running-bold','running-brave','running-bright','running-calm','running-clever','running-gentle','running-happy','running-kind','running-lively','running-patient','running-proud','running-quiet','running-sunny','running-swift','running-warm','running-wise','singing-bold','singing-brave','singing-bright','singing-calm','singing-clever','singing-gentle','singing-happy','singing-kind','singing-lively','singing-patient','singing-proud','singing-quiet','singing-sunny','singing-swift','singing-warm','singing-wise','swimming-bold','swimming-brave','swimming-bright','swimming-calm','swimming-clever','swimming-gentle','swimming-happy','swimming-kind','swimming-lively','swimming-patient','swimming-proud','swimming-quiet','swimming-sunny','swimming-swift','swimming-warm','swimming-wise','traveling-bold','traveling-brave','traveling-bright','traveling-calm','traveling-clever','traveling-gentle','traveling-happy','traveling-kind','traveling-lively','traveling-patient','traveling-proud','traveling-quiet','traveling-sunny','traveling-swift','traveling-warm','traveling-wise','writing-bold','writing-brave','writing-bright','writing-calm','writing-clever','writing-gentle','writing-happy','writing-kind','writing-lively','writing-patient','writing-proud','writing-quiet','writing-sunny','writing-swift','writing-warm','writing-wise'])[1 + (seed % 256)];
$function$;

CREATE OR REPLACE FUNCTION private.username_random_number (
  upper_bound integer
)
  RETURNS integer
  LANGUAGE sql
  SET search_path TO ''
  AS $function$
with random_bytes as (select extensions.gen_random_bytes(4) as bytes)
select ((get_byte(bytes,0)::bigint*16777216 + get_byte(bytes,1)*65536 + get_byte(bytes,2)*256 + get_byte(bytes,3)) % upper_bound)::integer from random_bytes;
$function$;

-- Preserve valid chosen English handles; migrate only non-ASCII/invalid handles.
UPDATE public.profiles SET username = private.generate_default_username(name)
WHERE username !~ '^[a-z0-9][a-z0-9_-]{2,47}$';

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_username_check" CHECK (((username ~ '^[a-z0-9][a-z0-9_-]{2,47}$'::text) AND (username = lower(username))));

REVOKE ALL ON FUNCTION "private"."username_fallback_base"(integer) FROM PUBLIC;

REVOKE ALL ON FUNCTION "private"."username_random_number"(integer) FROM PUBLIC;


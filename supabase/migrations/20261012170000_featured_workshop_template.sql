-- Preserve the approved existing workshop design; subsequent choices belong to admins.
update public.courses
set metadata = jsonb_set(metadata, '{featured}', 'true'::jsonb)
where slug = '7days-freelance'
  and metadata->>'delivery' = 'live'
  and not (metadata ? 'featured');

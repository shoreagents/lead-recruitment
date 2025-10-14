-- Add slug column to users and auto-generate from first/last name + last 4 of user id

BEGIN;

-- 1) Add column and unique index
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS slug text;

CREATE UNIQUE INDEX IF NOT EXISTS users_slug_key ON public.users (slug);

-- 2) Helper function to slugify text
CREATE OR REPLACE FUNCTION public.slugify_text(input text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  -- Use A-Z in the character class so uppercase letters are NOT stripped
  SELECT trim(both '-' from lower(regexp_replace(coalesce(input, ''), '[^A-Za-z0-9]+', '-', 'g')));
$$;

-- 3) Function to compute user slug
CREATE OR REPLACE FUNCTION public.compute_user_slug(p_first text, p_last text, p_id uuid)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT concat_ws('-',
           nullif(public.slugify_text(p_first), ''),
           nullif(public.slugify_text(p_last), ''),
           right(translate(p_id::text, '-', ''), 4)
         );
$$;

-- 4) Trigger to set slug on insert/update of name fields
CREATE OR REPLACE FUNCTION public.users_set_slug_trigger()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.slug IS NULL OR TG_OP = 'INSERT' OR NEW.first_name IS DISTINCT FROM OLD.first_name OR NEW.last_name IS DISTINCT FROM OLD.last_name THEN
    NEW.slug := public.compute_user_slug(NEW.first_name, NEW.last_name, NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS users_set_slug ON public.users;
CREATE TRIGGER users_set_slug
BEFORE INSERT OR UPDATE OF first_name, last_name ON public.users
FOR EACH ROW EXECUTE FUNCTION public.users_set_slug_trigger();

-- 5) Backfill existing rows
UPDATE public.users u
SET slug = public.compute_user_slug(u.first_name, u.last_name, u.id)
WHERE slug IS NULL;

COMMIT;



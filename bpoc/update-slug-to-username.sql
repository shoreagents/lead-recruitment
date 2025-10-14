-- Update slug system to use username instead of first/last name + ID
-- This script will modify the existing functions and update all user slugs

BEGIN;

-- 1) Update the compute_user_slug function to use username
CREATE OR REPLACE FUNCTION public.compute_user_slug(p_username text, p_id uuid)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  -- If username is provided, use it directly (already unique)
  -- If no username, fallback to a simple user-{last4} format
  SELECT CASE 
    WHEN p_username IS NOT NULL AND trim(p_username) != '' THEN 
      public.slugify_text(p_username)
    ELSE 
      concat('user-', right(translate(p_id::text, '-', ''), 4))
  END;
$$;

-- 2) Update the trigger function to use username for slug generation
CREATE OR REPLACE FUNCTION public.users_set_slug_trigger()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- Update slug when username changes, or when slug is null, or on insert
  IF NEW.slug IS NULL OR TG_OP = 'INSERT' OR NEW.username IS DISTINCT FROM OLD.username THEN
    NEW.slug := public.compute_user_slug(NEW.username, NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

-- 3) Update the trigger to watch username changes instead of first_name/last_name
DROP TRIGGER IF EXISTS users_set_slug ON public.users;
CREATE TRIGGER users_set_slug
BEFORE INSERT OR UPDATE OF username ON public.users
FOR EACH ROW EXECUTE FUNCTION public.users_set_slug_trigger();

-- 4) Update existing user slugs to use their usernames
-- This will update all existing users to have slugs based on their usernames
UPDATE public.users 
SET slug = public.compute_user_slug(username, id)
WHERE username IS NOT NULL AND trim(username) != '';

-- 5) For users without usernames, set a temporary slug until they set their username
UPDATE public.users 
SET slug = concat('user-', right(translate(id::text, '-', ''), 4))
WHERE username IS NULL OR trim(username) = '';

COMMIT;

-- Verify the changes
SELECT 
  id, 
  username, 
  slug, 
  first_name, 
  last_name 
FROM public.users 
ORDER BY created_at DESC 
LIMIT 10;

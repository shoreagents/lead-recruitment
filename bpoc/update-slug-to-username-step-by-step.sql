-- Step-by-step script to update slug system to use username
-- Run these commands one by one in DBeaver

-- Step 1: Update the compute_user_slug function
CREATE OR REPLACE FUNCTION public.compute_user_slug(p_username text, p_id uuid)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE 
    WHEN p_username IS NOT NULL AND trim(p_username) != '' THEN 
      public.slugify_text(p_username)
    ELSE 
      concat('user-', right(translate(p_id::text, '-', ''), 4))
  END;
$$;

-- Step 2: Update the trigger function
CREATE OR REPLACE FUNCTION public.users_set_slug_trigger()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.slug IS NULL OR TG_OP = 'INSERT' OR NEW.username IS DISTINCT FROM OLD.username THEN
    NEW.slug := public.compute_user_slug(NEW.username, NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

-- Step 3: Drop and recreate the trigger
DROP TRIGGER IF EXISTS users_set_slug ON public.users;
CREATE TRIGGER users_set_slug
BEFORE INSERT OR UPDATE OF username ON public.users
FOR EACH ROW EXECUTE FUNCTION public.users_set_slug_trigger();

-- Step 4: Update existing slugs (run this after users have set their usernames)
UPDATE public.users 
SET slug = public.compute_user_slug(username, id)
WHERE username IS NOT NULL AND trim(username) != '';

-- Step 5: Check the results
SELECT 
  id, 
  username, 
  slug, 
  first_name, 
  last_name 
FROM public.users 
ORDER BY created_at DESC 
LIMIT 10;

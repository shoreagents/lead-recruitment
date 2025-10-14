-- Add custom gender label field to users table
-- Stores a free-text preferred gender label when gender = 'others'

BEGIN;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS gender_custom TEXT NULL;

COMMIT;



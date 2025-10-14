-- Add gender column to users with limited choices (male, female, others)
-- Input is stored as TEXT, validated by a CHECK constraint (case-insensitive)

BEGIN;

-- 1) Add the column if it doesn't exist
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS gender TEXT;

-- 2) Enforce allowed values (case-insensitive); allow NULL
ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_gender_check;

ALTER TABLE public.users
  ADD CONSTRAINT users_gender_check
  CHECK (gender IS NULL OR lower(gender) IN ('male', 'female', 'others'));

COMMIT;



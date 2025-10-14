-- Add work_setup column to user_work_status with enum choices

BEGIN;

-- 1) Create enum type if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'work_setup_enum'
  ) THEN
    CREATE TYPE public."work_setup_enum" AS ENUM (
      'Work From Office',
      'Work From Home',
      'Hybrid',
      'Any'
    );
  END IF;
END$$;

-- 2) Add column (nullable)
ALTER TABLE public.user_work_status
  ADD COLUMN IF NOT EXISTS work_setup public."work_setup_enum" NULL;

COMMIT;



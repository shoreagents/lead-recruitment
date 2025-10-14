-- Add completed_data boolean column to user_work_status, mirroring users.completed_data

BEGIN;

ALTER TABLE public.user_work_status
  ADD COLUMN IF NOT EXISTS completed_data boolean DEFAULT false;

-- Ensure existing NULLs are set to false
UPDATE public.user_work_status SET completed_data = false WHERE completed_data IS NULL;

-- Optionally make it NOT NULL (uncomment if desired)
-- ALTER TABLE public.user_work_status ALTER COLUMN completed_data SET NOT NULL;

COMMIT;



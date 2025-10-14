-- Essential fix for recruiter_jobs table
-- Run this in DBeaver to fix the "Failed to create job" error

-- Add recruiter_id column
ALTER TABLE public.recruiter_jobs ADD COLUMN recruiter_id uuid;

-- Copy user IDs to recruiter_id
UPDATE public.recruiter_jobs SET recruiter_id = id;

-- Make recruiter_id NOT NULL
ALTER TABLE public.recruiter_jobs ALTER COLUMN recruiter_id SET NOT NULL;

-- Drop old constraints
ALTER TABLE public.recruiter_jobs DROP CONSTRAINT IF EXISTS recruiter_jobs_id_fkey;
ALTER TABLE public.recruiter_jobs DROP CONSTRAINT IF EXISTS recruiter_jobs_pkey;

-- Generate new UUIDs for id column
UPDATE public.recruiter_jobs SET id = gen_random_uuid();

-- Add new constraints
ALTER TABLE public.recruiter_jobs ADD CONSTRAINT recruiter_jobs_pkey PRIMARY KEY (id);
ALTER TABLE public.recruiter_jobs ADD CONSTRAINT recruiter_jobs_recruiter_id_fkey FOREIGN KEY (recruiter_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Add index
CREATE INDEX idx_recruiter_jobs_recruiter_id ON public.recruiter_jobs USING btree (recruiter_id);

SELECT 'Table fixed! You can now create multiple jobs per recruiter.' as result;

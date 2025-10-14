-- Fix for empty recruiter_jobs table
-- Run this if you have no existing job data

-- Add recruiter_id column
ALTER TABLE public.recruiter_jobs ADD COLUMN recruiter_id uuid;

-- Make recruiter_id NOT NULL
ALTER TABLE public.recruiter_jobs ALTER COLUMN recruiter_id SET NOT NULL;

-- Drop old constraints
ALTER TABLE public.recruiter_jobs DROP CONSTRAINT IF EXISTS recruiter_jobs_id_fkey;
ALTER TABLE public.recruiter_jobs DROP CONSTRAINT IF EXISTS recruiter_jobs_pkey;

-- Set id to auto-generate UUIDs for new records
ALTER TABLE public.recruiter_jobs ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Add new constraints
ALTER TABLE public.recruiter_jobs ADD CONSTRAINT recruiter_jobs_pkey PRIMARY KEY (id);
ALTER TABLE public.recruiter_jobs ADD CONSTRAINT recruiter_jobs_recruiter_id_fkey FOREIGN KEY (recruiter_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Add index
CREATE INDEX idx_recruiter_jobs_recruiter_id ON public.recruiter_jobs USING btree (recruiter_id);

SELECT 'Empty table fixed! You can now create jobs.' as result;

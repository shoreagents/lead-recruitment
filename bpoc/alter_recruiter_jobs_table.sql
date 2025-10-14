-- Alter the existing recruiter_jobs table to fix the structure
-- This preserves existing data and just changes the column structure

-- First, backup existing data
CREATE TABLE IF NOT EXISTS recruiter_jobs_backup AS SELECT * FROM recruiter_jobs;

-- Add the new recruiter_id column
ALTER TABLE public.recruiter_jobs 
ADD COLUMN IF NOT EXISTS recruiter_id uuid;

-- Copy the id values to recruiter_id (since id currently contains the user ID)
UPDATE public.recruiter_jobs 
SET recruiter_id = id;

-- Make recruiter_id NOT NULL
ALTER TABLE public.recruiter_jobs 
ALTER COLUMN recruiter_id SET NOT NULL;

-- Drop the foreign key constraint on id
ALTER TABLE public.recruiter_jobs 
DROP CONSTRAINT IF EXISTS recruiter_jobs_id_fkey;

-- Drop the primary key constraint on id
ALTER TABLE public.recruiter_jobs 
DROP CONSTRAINT IF EXISTS recruiter_jobs_pkey;

-- Change id to be auto-generated (this will generate new UUIDs for existing rows)
ALTER TABLE public.recruiter_jobs 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Update existing rows to have new UUIDs for id
UPDATE public.recruiter_jobs 
SET id = gen_random_uuid() 
WHERE id = recruiter_id; -- Only update rows where id still equals the old user ID

-- Add the new primary key constraint on id
ALTER TABLE public.recruiter_jobs 
ADD CONSTRAINT recruiter_jobs_pkey PRIMARY KEY (id);

-- Add foreign key constraint on recruiter_id
ALTER TABLE public.recruiter_jobs 
ADD CONSTRAINT recruiter_jobs_recruiter_id_fkey 
FOREIGN KEY (recruiter_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Create index on recruiter_id for better performance
CREATE INDEX IF NOT EXISTS idx_recruiter_jobs_recruiter_id ON public.recruiter_jobs USING btree (recruiter_id);

-- Update column comments
COMMENT ON COLUMN public.recruiter_jobs.id IS 'Auto-generated primary key for each job';
COMMENT ON COLUMN public.recruiter_jobs.recruiter_id IS 'References users.id - the recruiter who created the job';

-- Show the results
SELECT 'Table structure updated successfully!' as status;
SELECT COUNT(*) as total_jobs FROM recruiter_jobs;
SELECT 'Each recruiter can now create multiple jobs' as note;

-- Show the new table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'recruiter_jobs' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

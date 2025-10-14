-- Fix the recruiter_jobs table structure
-- The current structure has id as both primary key and user reference, which is wrong

-- First, backup existing data
CREATE TABLE IF NOT EXISTS recruiter_jobs_backup AS SELECT * FROM recruiter_jobs;

-- Drop the existing table and constraints
DROP TABLE IF EXISTS public.recruiter_jobs CASCADE;

-- Create the corrected table structure
CREATE TABLE public.recruiter_jobs (
    id uuid DEFAULT gen_random_uuid() NOT NULL, -- Auto-generated primary key for each job
    recruiter_id uuid NOT NULL, -- References users.id - the recruiter who created the job
    company_id text NULL, -- References users.company - the company of the logged-in recruiter
    job_title text NOT NULL,
    work_arrangement public."work_arrangement_enum" NULL,
    salary_min int4 NULL,
    salary_max int4 NULL,
    job_description text NOT NULL,
    requirements _text DEFAULT '{}'::text[] NULL,
    responsibilities _text DEFAULT '{}'::text[] NULL,
    benefits _text DEFAULT '{}'::text[] NULL,
    skills _text DEFAULT '{}'::text[] NULL,
    experience_level public."experience_level_enum" NULL,
    application_deadline date NULL,
    industry text NULL,
    department text NULL,
    work_type text DEFAULT 'full-time'::text NOT NULL,
    currency text DEFAULT 'PHP'::text NOT NULL,
    salary_type text DEFAULT 'monthly'::text NOT NULL,
    status text DEFAULT 'new_request'::text NOT NULL, -- Job status: new_request (default), active, inactive, closed
    "views" int4 DEFAULT 0 NOT NULL, -- Number of times the job has been viewed
    applicants int4 DEFAULT 0 NOT NULL, -- Number of applicants for this job
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    priority public."priority_enum" DEFAULT 'medium'::priority_enum NOT NULL,
    shift public."shift_enum" DEFAULT 'day'::shift_enum NOT NULL,
    
    CONSTRAINT recruiter_jobs_pkey PRIMARY KEY (id),
    CONSTRAINT recruiter_jobs_salary_max_check CHECK (((salary_max IS NULL) OR (salary_max >= 0))),
    CONSTRAINT recruiter_jobs_salary_min_check CHECK (((salary_min IS NULL) OR (salary_min >= 0))),
    CONSTRAINT recruiter_jobs_status_check CHECK ((status = ANY (ARRAY['new_request'::text, 'active'::text, 'inactive'::text, 'closed'::text])))
);

-- Create indexes for better performance
CREATE INDEX idx_recruiter_jobs_recruiter_id ON public.recruiter_jobs USING btree (recruiter_id);
CREATE INDEX idx_recruiter_jobs_company_id ON public.recruiter_jobs USING btree (company_id);
CREATE INDEX idx_recruiter_jobs_created_at ON public.recruiter_jobs USING btree (created_at);
CREATE INDEX idx_recruiter_jobs_shift ON public.recruiter_jobs USING btree (shift);
CREATE INDEX idx_recruiter_jobs_status ON public.recruiter_jobs USING btree (status);

-- Add table and column comments
COMMENT ON TABLE public.recruiter_jobs IS 'Table to store job postings created by recruiters';
COMMENT ON COLUMN public.recruiter_jobs.id IS 'Auto-generated primary key for each job';
COMMENT ON COLUMN public.recruiter_jobs.recruiter_id IS 'References users.id - the recruiter who created the job';
COMMENT ON COLUMN public.recruiter_jobs.company_id IS 'References users.company - the company of the logged-in recruiter';
COMMENT ON COLUMN public.recruiter_jobs.status IS 'Job status: new_request (default), active, inactive, closed';
COMMENT ON COLUMN public.recruiter_jobs."views" IS 'Number of times the job has been viewed';
COMMENT ON COLUMN public.recruiter_jobs.applicants IS 'Number of applicants for this job';

-- Create trigger for updated_at
CREATE TRIGGER update_recruiter_jobs_updated_at 
    BEFORE UPDATE ON public.recruiter_jobs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add foreign key constraint to users table
ALTER TABLE public.recruiter_jobs 
ADD CONSTRAINT recruiter_jobs_recruiter_id_fkey 
FOREIGN KEY (recruiter_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Migrate data from backup (if any exists)
INSERT INTO recruiter_jobs (
    recruiter_id, company_id, job_title, job_description, industry, department, 
    work_type, work_arrangement, experience_level, salary_min, salary_max, 
    currency, salary_type, application_deadline, priority, shift,
    requirements, responsibilities, benefits, skills, status, views, applicants, created_at, updated_at
)
SELECT 
    id as recruiter_id,  -- The old id was the user ID, now it becomes recruiter_id
    company_id,
    job_title,
    job_description,
    industry,
    department,
    work_type,
    work_arrangement,
    experience_level,
    salary_min,
    salary_max,
    currency,
    salary_type,
    application_deadline,
    priority,
    shift,
    requirements,
    responsibilities,
    benefits,
    skills,
    status,
    views,
    applicants,
    created_at,
    updated_at
FROM recruiter_jobs_backup;

-- Show migration results
SELECT 'Migration completed successfully!' as status;
SELECT COUNT(*) as migrated_jobs FROM recruiter_jobs;
SELECT 'You can now create multiple jobs per recruiter' as note;

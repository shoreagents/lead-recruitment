-- Create recruiter_jobs table with same fields as processed_job_requests
-- but with modified id and company_id references, and updated status enum

CREATE TABLE public.recruiter_jobs (
    id uuid NOT NULL, -- Changed to reference recruiter user who created the job
    company_id text NULL, -- Changed to reference users.company field
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
    status text DEFAULT 'new_request'::text NOT NULL, -- Changed to text with new_request default
    "views" int4 DEFAULT 0 NOT NULL,
    applicants int4 DEFAULT 0 NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    priority public."priority_enum" DEFAULT 'medium'::priority_enum NOT NULL,
    shift public."shift_enum" DEFAULT 'day'::shift_enum NOT NULL,
    
    -- Primary key constraint
    CONSTRAINT recruiter_jobs_pkey PRIMARY KEY (id),
    
    -- Salary constraints
    CONSTRAINT recruiter_jobs_salary_max_check CHECK (((salary_max IS NULL) OR (salary_max >= 0))),
    CONSTRAINT recruiter_jobs_salary_min_check CHECK (((salary_min IS NULL) OR (salary_min >= 0))),
    
    -- Status constraint to ensure valid values
    CONSTRAINT recruiter_jobs_status_check CHECK (status IN ('new_request', 'active', 'inactive', 'closed'))
);

-- Create indexes for better performance
CREATE INDEX idx_recruiter_jobs_company_id ON public.recruiter_jobs USING btree (company_id);
CREATE INDEX idx_recruiter_jobs_created_at ON public.recruiter_jobs USING btree (created_at);
CREATE INDEX idx_recruiter_jobs_shift ON public.recruiter_jobs USING btree (shift);
CREATE INDEX idx_recruiter_jobs_status ON public.recruiter_jobs USING btree (status);

-- Create trigger for updated_at timestamp
CREATE TRIGGER update_recruiter_jobs_updated_at 
    BEFORE UPDATE ON public.recruiter_jobs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add foreign key constraints
-- id references users.id (the recruiter who created the job)
ALTER TABLE public.recruiter_jobs 
    ADD CONSTRAINT recruiter_jobs_id_fkey 
    FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE;

-- company_id references users.company field (the company of the logged-in recruiter)
-- Note: This is a text field reference, so we'll add a check constraint instead of FK
-- ALTER TABLE public.recruiter_jobs 
--     ADD CONSTRAINT recruiter_jobs_company_id_fkey 
--     FOREIGN KEY (company_id) REFERENCES public.users(company) ON DELETE SET NULL;

-- Comments for documentation
COMMENT ON TABLE public.recruiter_jobs IS 'Table to store job postings created by recruiters';
COMMENT ON COLUMN public.recruiter_jobs.id IS 'References users.id - the recruiter who created the job';
COMMENT ON COLUMN public.recruiter_jobs.company_id IS 'References users.company - the company of the logged-in recruiter';
COMMENT ON COLUMN public.recruiter_jobs.status IS 'Job status: new_request (default), active, inactive, closed';
COMMENT ON COLUMN public.recruiter_jobs.views IS 'Number of times the job has been viewed';
COMMENT ON COLUMN public.recruiter_jobs.applicants IS 'Number of applicants for this job';

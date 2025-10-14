-- Create recruiter_jobs table with corrected schema
-- The id should be auto-generated, and recruiter_id should reference the user

CREATE TABLE public.recruiter_jobs (
    id uuid DEFAULT gen_random_uuid() NOT NULL, -- Auto-generated primary key
    recruiter_id uuid NOT NULL, -- References the recruiter user who created the job
    company_id text NULL, -- References users.company field of the logged-in recruiter
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
    status text DEFAULT 'new_request'::text NOT NULL, -- Default 'new_request', choices: 'new_request', 'active', 'inactive', 'closed'
    "views" int4 DEFAULT 0 NOT NULL,
    applicants int4 DEFAULT 0 NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    priority public."priority_enum" DEFAULT 'medium'::priority_enum NOT NULL,
    shift public."shift_enum" DEFAULT 'day'::shift_enum NOT NULL,
    
    CONSTRAINT recruiter_jobs_pkey PRIMARY KEY (id),
    CONSTRAINT recruiter_jobs_salary_max_check CHECK (((salary_max IS NULL) OR (salary_max >= 0))),
    CONSTRAINT recruiter_jobs_salary_min_check CHECK (((salary_min IS NULL) OR (salary_min >= 0))),
    CONSTRAINT recruiter_jobs_status_check CHECK ((status IN ('new_request', 'active', 'inactive', 'closed')))
);

-- Create indexes for better performance
CREATE INDEX idx_recruiter_jobs_recruiter_id ON public.recruiter_jobs USING btree (recruiter_id);
CREATE INDEX idx_recruiter_jobs_created_at ON public.recruiter_jobs USING btree (created_at);
CREATE INDEX idx_recruiter_jobs_shift ON public.recruiter_jobs USING btree (shift);
CREATE INDEX idx_recruiter_jobs_status ON public.recruiter_jobs USING btree (status);

-- Create trigger for updated_at
CREATE TRIGGER update_recruiter_jobs_updated_at 
    BEFORE UPDATE ON public.recruiter_jobs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add foreign key constraint to users table
ALTER TABLE public.recruiter_jobs 
ADD CONSTRAINT recruiter_jobs_recruiter_id_fkey 
FOREIGN KEY (recruiter_id) REFERENCES public.users(id) ON DELETE CASCADE;

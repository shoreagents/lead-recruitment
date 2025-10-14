-- Migration script for recruiter_jobs table
-- This handles both creating a new table and migrating from the old structure

-- First, check if the table exists and what structure it has
DO $$
BEGIN
    -- Check if the table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'recruiter_jobs' AND table_schema = 'public') THEN
        -- Check if it has the old structure (id as primary key referencing user)
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'recruiter_jobs' AND column_name = 'id' AND table_schema = 'public') 
           AND NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'recruiter_jobs' AND column_name = 'recruiter_id' AND table_schema = 'public') THEN
            
            RAISE NOTICE 'Found old table structure. Migrating...';
            
            -- Create a backup of the old table
            CREATE TABLE recruiter_jobs_backup AS SELECT * FROM recruiter_jobs;
            
            -- Drop the old table
            DROP TABLE recruiter_jobs CASCADE;
            
            -- Create the new table with correct structure
            CREATE TABLE public.recruiter_jobs (
                id uuid DEFAULT gen_random_uuid() NOT NULL,
                recruiter_id uuid NOT NULL,
                company_id text NULL,
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
                status text DEFAULT 'new_request'::text NOT NULL,
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
            
            RAISE NOTICE 'Migration completed. Migrated % rows.', (SELECT COUNT(*) FROM recruiter_jobs);
            
        ELSE
            RAISE NOTICE 'Table already has correct structure or different structure. Skipping migration.';
        END IF;
    ELSE
        RAISE NOTICE 'Table does not exist. Creating new table...';
        
        -- Create the new table
        CREATE TABLE public.recruiter_jobs (
            id uuid DEFAULT gen_random_uuid() NOT NULL,
            recruiter_id uuid NOT NULL,
            company_id text NULL,
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
            status text DEFAULT 'new_request'::text NOT NULL,
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
        
        RAISE NOTICE 'New table created successfully.';
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recruiter_jobs_recruiter_id ON public.recruiter_jobs USING btree (recruiter_id);
CREATE INDEX IF NOT EXISTS idx_recruiter_jobs_created_at ON public.recruiter_jobs USING btree (created_at);
CREATE INDEX IF NOT EXISTS idx_recruiter_jobs_shift ON public.recruiter_jobs USING btree (shift);
CREATE INDEX IF NOT EXISTS idx_recruiter_jobs_status ON public.recruiter_jobs USING btree (status);

-- Create trigger for updated_at
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_recruiter_jobs_updated_at') THEN
        CREATE TRIGGER update_recruiter_jobs_updated_at 
            BEFORE UPDATE ON public.recruiter_jobs 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Add foreign key constraint to users table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'recruiter_jobs_recruiter_id_fkey' 
                   AND table_name = 'recruiter_jobs') THEN
        ALTER TABLE public.recruiter_jobs 
        ADD CONSTRAINT recruiter_jobs_recruiter_id_fkey 
        FOREIGN KEY (recruiter_id) REFERENCES public.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Show final table structure
SELECT 'Migration completed. Final table structure:' as status;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'recruiter_jobs' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Create recruiter_applications table if it doesn't exist
-- This table stores applications for recruiter-posted jobs

-- Check if table exists and create if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'recruiter_applications') THEN
        CREATE TABLE public.recruiter_applications (
            id uuid DEFAULT gen_random_uuid() NOT NULL,
            user_id uuid NOT NULL,
            job_id uuid NOT NULL,
            resume_id uuid NOT NULL,
            resume_slug text NOT NULL,
            status text DEFAULT 'submitted'::text NOT NULL,
            created_at timestamptz DEFAULT now() NOT NULL,
            updated_at timestamptz DEFAULT now() NULL,
            CONSTRAINT recruiter_applications_pkey PRIMARY KEY (id),
            CONSTRAINT recruiter_applications_user_job_uidx UNIQUE (user_id, job_id),
            CONSTRAINT recruiter_applications_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.recruiter_jobs(id) ON DELETE CASCADE,
            CONSTRAINT recruiter_applications_resume_id_fkey FOREIGN KEY (resume_id) REFERENCES public.saved_resumes(id) ON DELETE RESTRICT,
            CONSTRAINT recruiter_applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
        );
        
        -- Create indexes for better performance
        CREATE INDEX idx_recruiter_applications_job_id ON public.recruiter_applications USING btree (job_id);
        CREATE INDEX idx_recruiter_applications_user_id ON public.recruiter_applications USING btree (user_id);
        CREATE INDEX idx_recruiter_applications_created_at ON public.recruiter_applications USING btree (created_at);
        
        RAISE NOTICE 'recruiter_applications table created successfully';
    ELSE
        RAISE NOTICE 'recruiter_applications table already exists';
    END IF;
END $$;

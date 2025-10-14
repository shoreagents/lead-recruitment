-- Create applications table for storing user job applications
-- This table uses the application_status_enum type for status values
CREATE TABLE IF NOT EXISTS applications (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id BIGINT NOT NULL REFERENCES processed_job_requests(id) ON DELETE CASCADE,
    resume_id UUID NOT NULL REFERENCES saved_resumes(id) ON DELETE RESTRICT,
    resume_slug TEXT NOT NULL,
    status application_status_enum DEFAULT 'submitted' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    position INTEGER DEFAULT 0,
    CONSTRAINT applications_pkey PRIMARY KEY (id),
    CONSTRAINT applications_user_job_uidx UNIQUE (user_id, job_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS applications_job_idx ON applications USING btree (job_id);
CREATE INDEX IF NOT EXISTS applications_status_idx ON applications USING btree (status);
CREATE INDEX IF NOT EXISTS applications_user_idx ON applications USING btree (user_id);

-- Create trigger to automatically increment job applicants count
CREATE OR REPLACE FUNCTION applications__inc_job_applicants()
RETURNS TRIGGER AS $$
BEGIN
  -- Only increment when a brand-new application row is inserted
  UPDATE processed_job_requests
     SET applicants = COALESCE(applicants, 0) + 1
   WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER applications_after_insert_inc_applicants 
    AFTER INSERT ON applications 
    FOR EACH ROW 
    EXECUTE FUNCTION applications__inc_job_applicants();

-- Insert some sample data for testing (optional - you can remove this)
-- Note: These sample records use valid UUIDs and reference existing tables
-- You may need to adjust the user_id, job_id, and resume_id values based on your actual data
INSERT INTO applications (user_id, job_id, resume_id, resume_slug, status, position) 
VALUES 
    ('00000000-0000-0000-0000-000000000001', 1, '00000000-0000-0000-0000-000000000002', 'sample-resume-1', 'submitted', 0),
    ('00000000-0000-0000-0000-000000000001', 2, '00000000-0000-0000-0000-000000000002', 'sample-resume-1', 'qualified', 1)
ON CONFLICT (id) DO NOTHING;

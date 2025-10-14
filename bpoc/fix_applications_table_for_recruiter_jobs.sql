-- Fix applications table to support both processed jobs and recruiter jobs
-- This script modifies the applications table to handle both job types

-- First, let's check the current structure
-- The current applications table only supports processed_job_requests (BIGINT job_id)
-- We need to modify it to support both processed_job_requests and recruiter_jobs

-- Step 1: Add new columns to support both job types
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS job_type VARCHAR(20) DEFAULT 'processed',
ADD COLUMN IF NOT EXISTS recruiter_job_id UUID REFERENCES recruiter_jobs(id) ON DELETE CASCADE;

-- Step 2: Create a check constraint to ensure only one job_id is set
ALTER TABLE applications 
ADD CONSTRAINT applications_job_type_check 
CHECK (
  (job_type = 'processed' AND job_id IS NOT NULL AND recruiter_job_id IS NULL) OR
  (job_type = 'recruiter' AND job_id IS NULL AND recruiter_job_id IS NOT NULL)
);

-- Step 3: Update the unique constraint to handle both job types
DROP INDEX IF EXISTS applications_user_job_uidx;
CREATE UNIQUE INDEX applications_user_job_uidx ON applications (user_id, job_id, recruiter_job_id);

-- Step 4: Make job_id nullable since it's only used for processed jobs
ALTER TABLE applications ALTER COLUMN job_id DROP NOT NULL;

-- Step 5: Add a trigger to automatically set job_type based on which ID is provided
CREATE OR REPLACE FUNCTION applications_set_job_type()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.job_id IS NOT NULL AND NEW.recruiter_job_id IS NULL THEN
    NEW.job_type = 'processed';
  ELSIF NEW.job_id IS NULL AND NEW.recruiter_job_id IS NOT NULL THEN
    NEW.job_type = 'recruiter';
  ELSE
    RAISE EXCEPTION 'Exactly one of job_id or recruiter_job_id must be provided';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER applications_before_insert_set_job_type
  BEFORE INSERT ON applications
  FOR EACH ROW
  EXECUTE FUNCTION applications_set_job_type();

-- Step 6: Update existing records to have job_type = 'processed'
UPDATE applications SET job_type = 'processed' WHERE job_type IS NULL;

-- Step 7: Create indexes for better performance
CREATE INDEX IF NOT EXISTS applications_recruiter_job_idx ON applications (recruiter_job_id);
CREATE INDEX IF NOT EXISTS applications_job_type_idx ON applications (job_type);

-- Step 8: Update the applicant count trigger to handle both job types
CREATE OR REPLACE FUNCTION applications__inc_job_applicants()
RETURNS TRIGGER AS $$
BEGIN
  -- Only increment when a brand-new application row is inserted
  IF NEW.job_type = 'processed' AND NEW.job_id IS NOT NULL THEN
    UPDATE processed_job_requests
       SET applicants = COALESCE(applicants, 0) + 1
     WHERE id = NEW.job_id;
  ELSIF NEW.job_type = 'recruiter' AND NEW.recruiter_job_id IS NOT NULL THEN
    UPDATE recruiter_jobs
       SET applicants = COALESCE(applicants, 0) + 1
     WHERE id = NEW.recruiter_job_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- The trigger already exists, so we just need to update the function
-- The trigger will automatically use the new function

-- Step 9: Add a function to get job details regardless of type
CREATE OR REPLACE FUNCTION get_job_details(job_type_param VARCHAR, job_id_param BIGINT, recruiter_job_id_param UUID)
RETURNS TABLE (
  id BIGINT,
  job_title TEXT,
  company_name TEXT,
  source VARCHAR
) AS $$
BEGIN
  IF job_type_param = 'processed' THEN
    RETURN QUERY
    SELECT 
      pjr.id,
      pjr.job_title,
      COALESCE(m.company, 'Unknown Company') as company_name,
      'processed_job_requests'::VARCHAR as source
    FROM processed_job_requests pjr
    LEFT JOIN members m ON pjr.company_id = m.company_id
    WHERE pjr.id = job_id_param;
  ELSIF job_type_param = 'recruiter' THEN
    RETURN QUERY
    SELECT 
      rj.id::BIGINT,
      rj.job_title,
      COALESCE(rj.company_id, u.company, 'Unknown Company') as company_name,
      'recruiter_jobs'::VARCHAR as source
    FROM recruiter_jobs rj
    LEFT JOIN users u ON u.id = rj.recruiter_id
    WHERE rj.id = recruiter_job_id_param;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Step 10: Test the setup
-- You can test with these queries:
-- SELECT * FROM applications WHERE job_type = 'processed';
-- SELECT * FROM applications WHERE job_type = 'recruiter';
-- SELECT * FROM get_job_details('processed', 1, NULL);
-- SELECT * FROM get_job_details('recruiter', NULL, 'your-uuid-here');

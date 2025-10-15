-- Update applicants count in recruiter_jobs based on existing recruiter_applications
-- This script will sync the applicants column with actual application data

UPDATE recruiter_jobs 
SET applicants = (
    SELECT COUNT(*) 
    FROM recruiter_applications 
    WHERE recruiter_applications.job_id = recruiter_jobs.id
),
updated_at = now()
WHERE id IN (
    SELECT DISTINCT job_id 
    FROM recruiter_applications
);

-- Show the results
SELECT 
    rj.id,
    rj.job_title,
    rj.applicants as current_count,
    COUNT(ra.id) as actual_applications
FROM recruiter_jobs rj
LEFT JOIN recruiter_applications ra ON rj.id = ra.job_id
GROUP BY rj.id, rj.job_title, rj.applicants
ORDER BY rj.applicants DESC;

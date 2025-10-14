-- Drop is_admin and is_recruiter columns from users table
-- This script will remove the is_admin and is_recruiter columns and their associated objects

-- First, drop the view that depends on these columns
DROP VIEW IF EXISTS public.v_user_complete_data;

-- Drop indexes that depend on these columns
DROP INDEX IF EXISTS idx_users_is_admin;

-- Drop the columns from the users table
ALTER TABLE users DROP COLUMN IF EXISTS is_admin;
ALTER TABLE users DROP COLUMN IF EXISTS is_recruiter;

-- Recreate the view without the dropped columns
CREATE OR REPLACE VIEW public.v_user_complete_data AS
SELECT 
    -- User Basic Information (ALL COLUMNS except is_admin and is_recruiter)
    u.id as user_id,
    u.email,
    u.first_name,
    u.last_name,
    u.full_name,
    u.location,
    u.avatar_url,
    u.phone,
    u.bio,
    u.position,
    u.gender,
    u.gender_custom,
    u.admin_level,
    u.completed_data,
    u.birthday,
    u.slug,
    u.location_place_id,
    u.location_lat,
    u.location_lng,
    u.location_city,
    u.location_province,
    u.location_country,
    u.location_barangay,
    u.location_region,
    u.created_at as user_created_at,
    u.updated_at as user_updated_at,

    -- User Work Status (ALL COLUMNS)
    uws.id as work_status_id,
    uws.user_id as work_status_user_id,
    uws.current_employer,
    uws.current_position,
    uws.current_salary,
    uws.notice_period_days,
    uws.current_mood,
    uws.work_status,
    uws.preferred_shift,
    uws.expected_salary,
    uws.work_setup,
    uws.completed_data as work_status_completed,
    uws.created_at as work_status_created_at,
    uws.updated_at as work_status_updated_at,

    -- AI Analysis Results (ALL COLUMNS)
    aar.id as analysis_id,
    aar.user_id as analysis_user_id,
    aar.session_id,
    aar.original_resume_id,
    aar.overall_score,
    aar.ats_compatibility_score,
    aar.content_quality_score,
    aar.professional_presentation_score,
    aar.skills_alignment_score,
    aar.key_strengths,
    aar.strengths_analysis,
    aar.improvements,
    aar.recommendations,
    aar.improved_summary,
    aar.salary_analysis,
    aar.career_path,
    aar.section_analysis,
    aar.analysis_metadata,
    aar.portfolio_links,
    aar.files_analyzed,
    aar.candidate_profile,
    aar.skills_snapshot,
    aar.experience_snapshot,
    aar.education_snapshot,
    aar.created_at as analysis_created_at,
    aar.updated_at as analysis_updated_at

FROM public.users u
    -- User Work Status (LEFT JOIN - user might not have work status)
    LEFT JOIN public.user_work_status uws ON u.id = uws.user_id
    
    -- AI Analysis Results (LEFT JOIN - user might not have analysis)
    LEFT JOIN public.ai_analysis_results aar ON u.id = aar.user_id;

-- Add comment to document the view
COMMENT ON VIEW public.v_user_complete_data IS 'User data view combining users, work status, and AI analysis results (updated to remove is_admin and is_recruiter columns)';

-- Verify columns are dropped
SELECT 'is_admin and is_recruiter columns have been successfully dropped from users table' AS status;

-- Show remaining columns in users table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

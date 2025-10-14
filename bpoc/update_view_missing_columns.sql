-- Update v_user_complete_data view to include ALL missing columns
-- This script adds the missing columns from typing_hero_stats and disc_personality_stats

-- Drop the existing view
DROP VIEW IF EXISTS public.v_user_complete_data;

-- Recreate the view with ALL columns from both game stats tables
CREATE OR REPLACE VIEW public.v_user_complete_data AS
SELECT 
    -- User Basic Information (ALL COLUMNS)
    u.id as user_id,
    u.email,
    u.first_name,
    u.last_name,
    u.full_name,
    u.location,
    u.avatar_url,
    u.phone,
    u.bio,
    u."position",
    u.gender,
    u.gender_custom,
    u.admin_level,
    u.completed_data,
    u.birthday,
    u.slug,
    u.username,
    u.location_place_id,
    u.location_lat,
    u.location_lng,
    u.location_city,
    u.location_province,
    u.location_country,
    u.location_barangay,
    u.location_region,
    u.created_at AS user_created_at,
    u.updated_at AS user_updated_at,
    
    -- Work Status Information (LEFT JOIN - user might not have work status)
    uws.id AS work_status_id,
    uws.user_id AS work_status_user_id,
    uws.current_employer,
    uws.current_position,
    uws.current_salary,
    uws.notice_period_days,
    uws.current_mood,
    uws.work_status,
    uws.preferred_shift,
    uws.expected_salary,
    uws.work_setup,
    uws.completed_data AS work_status_completed,
    uws.created_at AS work_status_created_at,
    uws.updated_at AS work_status_updated_at,
    
    -- AI Analysis Results (LEFT JOIN - user might not have analysis)
    aar.id AS analysis_id,
    aar.user_id AS analysis_user_id,
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
    aar.created_at AS analysis_created_at,
    aar.updated_at AS analysis_updated_at,
    
    -- DISC Personality Stats (ALL COLUMNS - LEFT JOIN)
    dps.id AS disc_personality_stats_id,
    dps.user_id AS disc_personality_user_id,
    dps.created_at AS disc_created_at,
    dps.updated_at AS disc_updated_at,
    dps.total_sessions AS disc_total_sessions,
    dps.completed_sessions AS disc_completed_sessions,
    dps.last_taken_at AS disc_last_taken_at,
    dps.latest_d_score,
    dps.latest_i_score,
    dps.latest_s_score,
    dps.latest_c_score,
    dps.latest_primary_type AS disc_primary_type,
    dps.latest_secondary_type AS disc_secondary_type,
    dps.best_confidence_score AS disc_confidence_score,
    dps.average_completion_time AS disc_completion_time,
    dps.consistency_trend AS disc_consistency_trend,
    dps.latest_ai_assessment AS disc_ai_assessment,
    dps.latest_bpo_roles AS disc_bpo_roles,
    dps.percentile AS disc_percentile,
    
    -- Typing Hero Stats (ALL COLUMNS - LEFT JOIN)
    ths.id AS typing_hero_stats_id,
    ths.user_id AS typing_hero_user_id,
    ths.created_at AS typing_created_at,
    ths.updated_at AS typing_updated_at,
    ths.total_sessions AS typing_total_sessions,
    ths.completed_sessions AS typing_completed_sessions,
    ths.last_played_at AS typing_last_played_at,
    ths.best_score AS typing_best_score,
    ths.best_wpm AS typing_best_wpm,
    ths.best_accuracy AS typing_best_accuracy,
    ths.best_streak AS typing_best_streak,
    ths.latest_score AS typing_latest_score,
    ths.latest_wpm AS typing_latest_wpm,
    ths.latest_accuracy AS typing_latest_accuracy,
    ths.latest_difficulty AS typing_latest_difficulty,
    ths.avg_wpm AS typing_avg_wpm,
    ths.avg_accuracy AS typing_avg_accuracy,
    ths.total_play_time AS typing_total_play_time,
    ths.ai_analysis AS typing_ai_analysis,
    ths.total_words_correct AS typing_total_words_correct,
    ths.total_words_incorrect AS typing_total_words_incorrect,
    -- MISSING COLUMNS FROM ORIGINAL SCRIPT:
    ths.most_common_correct_words AS typing_most_common_correct_words,
    ths.most_common_incorrect_words AS typing_most_common_incorrect_words,
    ths.average_reaction_time AS typing_average_reaction_time,
    ths.vocabulary_strengths AS typing_vocabulary_strengths,
    ths.vocabulary_weaknesses AS typing_vocabulary_weaknesses

FROM users u
    LEFT JOIN user_work_status uws ON u.id = uws.user_id
    LEFT JOIN ai_analysis_results aar ON u.id = aar.user_id
    LEFT JOIN disc_personality_stats dps ON u.id = dps.user_id
    LEFT JOIN typing_hero_stats ths ON u.id = ths.user_id;

-- Add comment to document the updated view
COMMENT ON VIEW public.v_user_complete_data IS 'Complete user data view with ALL columns from users, work status, AI analysis, DISC personality stats, and typing hero stats for comprehensive public API consumption.';

-- Verify the view was created successfully
SELECT 'v_user_complete_data view has been successfully updated with ALL game stats columns' AS status;

-- Test the view with a sample query including the new columns
SELECT 
    user_id, 
    full_name, 
    overall_score,
    disc_primary_type,
    disc_confidence_score,
    typing_best_wpm,
    typing_best_accuracy,
    typing_most_common_correct_words,
    typing_vocabulary_strengths
FROM public.v_user_complete_data 
WHERE user_id IS NOT NULL 
LIMIT 5;

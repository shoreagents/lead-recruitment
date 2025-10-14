-- =====================================================
-- DROP OLD LEADERBOARD TABLES
-- Run this AFTER creating and populating the new system
-- =====================================================

-- Drop the materialized view first (depends on tables)
DROP MATERIALIZED VIEW IF EXISTS public.mv_leaderboard_overall CASCADE;

-- Drop old leaderboard tables
DROP TABLE IF EXISTS public.leaderboard_overall_scores CASCADE;
DROP TABLE IF EXISTS public.leaderboard_game_scores CASCADE;
DROP TABLE IF EXISTS public.leaderboard_applicant_scores CASCADE;
DROP TABLE IF EXISTS public.leaderboard_engagement_scores CASCADE;

-- Drop the leaderboard period enum if no longer needed
-- DROP TYPE IF EXISTS public."leaderboard_period_enum" CASCADE;

-- Verify old tables are gone
SELECT 'Old leaderboard tables have been dropped successfully' AS status;

-- Show remaining tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%leaderboard%'
ORDER BY table_name;


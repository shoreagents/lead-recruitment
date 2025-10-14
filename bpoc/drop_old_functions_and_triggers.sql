-- =====================================================
-- DROP OLD LEADERBOARD FUNCTIONS AND TRIGGERS
-- Run this BEFORE creating the new system
-- =====================================================

-- Drop triggers first (they depend on functions)
DROP TRIGGER IF EXISTS trigger_update_leaderboard_on_typing_hero ON typing_hero_stats;
DROP TRIGGER IF EXISTS trigger_update_leaderboard_on_disc ON disc_personality_stats;
DROP TRIGGER IF EXISTS trigger_update_leaderboard_on_user ON users;
DROP TRIGGER IF EXISTS trigger_update_leaderboard_on_work_status ON user_work_status;
DROP TRIGGER IF EXISTS trigger_update_leaderboard_on_resume ON ai_analysis_results;
DROP TRIGGER IF EXISTS trigger_update_leaderboard_on_applications ON applications;

-- Drop functions (now that triggers are gone)
DROP FUNCTION IF EXISTS trigger_update_leaderboard_score() CASCADE;
DROP FUNCTION IF EXISTS update_user_leaderboard_score(UUID) CASCADE;
DROP FUNCTION IF EXISTS calculate_user_leaderboard_score(UUID) CASCADE;
DROP FUNCTION IF EXISTS recalculate_leaderboard_ranks() CASCADE;
DROP FUNCTION IF EXISTS update_all_leaderboard_scores() CASCADE;

-- Drop the leaderboard table if it exists
DROP TABLE IF EXISTS user_leaderboard_scores CASCADE;

-- Verify everything is clean
SELECT 'All old leaderboard functions and triggers have been dropped successfully' AS status;

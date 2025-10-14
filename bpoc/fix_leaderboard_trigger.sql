-- Fix the leaderboard trigger function to handle the users table correctly
-- The issue is that the trigger function tries to access NEW.user_id when the table is 'users'
-- but the users table has 'id' not 'user_id'

CREATE OR REPLACE FUNCTION trigger_update_leaderboard_score()
RETURNS TRIGGER AS $$
BEGIN
    -- Update score for the affected user
    -- Handle different table structures properly
    IF TG_TABLE_NAME = 'users' THEN
        PERFORM update_user_leaderboard_score(NEW.id);
    ELSIF TG_TABLE_NAME = 'user_work_status' THEN
        PERFORM update_user_leaderboard_score(NEW.user_id);
    ELSIF TG_TABLE_NAME = 'ai_analysis_results' THEN
        PERFORM update_user_leaderboard_score(NEW.user_id);
    ELSIF TG_TABLE_NAME = 'applications' THEN
        PERFORM update_user_leaderboard_score(NEW.user_id);
    ELSIF TG_TABLE_NAME = 'typing_hero_stats' THEN
        PERFORM update_user_leaderboard_score(NEW.user_id);
    ELSIF TG_TABLE_NAME = 'disc_personality_stats' THEN
        PERFORM update_user_leaderboard_score(NEW.user_id);
    ELSE
        -- Fallback: try to get user_id from the record
        PERFORM update_user_leaderboard_score(NEW.user_id);
    END IF;
    
    -- Recalculate ranks after score update
    PERFORM recalculate_leaderboard_ranks();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION trigger_update_leaderboard_score IS 'Fixed trigger function that properly handles different table structures for leaderboard score updates';

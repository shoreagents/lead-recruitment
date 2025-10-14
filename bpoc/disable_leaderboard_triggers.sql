-- Temporarily disable the leaderboard triggers to fix the profile photo upload issue
-- This will prevent the database error while we fix the trigger function

-- Disable the trigger on users table that's causing the issue
DROP TRIGGER IF EXISTS trigger_update_leaderboard_on_user ON users;

-- Keep other triggers enabled as they work correctly
-- (The issue is specifically with the users table trigger)

-- To re-enable later, run:
-- CREATE TRIGGER trigger_update_leaderboard_on_user
--     AFTER UPDATE OF completed_data, avatar_url, bio, location ON users
--     FOR EACH ROW
--     EXECUTE FUNCTION trigger_update_leaderboard_score();

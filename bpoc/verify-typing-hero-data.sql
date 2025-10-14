-- =====================================================
-- TYPING HERO DATA VERIFICATION QUERIES
-- Run these after playing the game to verify data storage
-- =====================================================

-- 1. Check if tables exist and have data
SELECT 
    'typing_hero_sessions' as table_name,
    COUNT(*) as record_count,
    MAX(created_at) as latest_session
FROM typing_hero_sessions
UNION ALL
SELECT 
    'typing_hero_stats' as table_name,
    COUNT(*) as record_count,
    MAX(updated_at) as latest_update
FROM typing_hero_stats;

-- 2. Check latest session data for a specific user (replace with your user ID)
-- SELECT 
--     id,
--     user_id,
--     score,
--     wpm,
--     longest_streak,
--     correct_words,
--     wrong_words,
--     elapsed_time,
--     overall_accuracy,
--     difficulty_level,
--     session_status,
--     created_at
-- FROM typing_hero_sessions 
-- WHERE user_id = 'your-user-id-here'
-- ORDER BY created_at DESC 
-- LIMIT 5;

-- 3. Check user stats for a specific user (replace with your user ID)
-- SELECT 
--     user_id,
--     total_sessions,
--     completed_sessions,
--     best_score,
--     best_wpm,
--     best_accuracy,
--     best_streak,
--     latest_score,
--     latest_wpm,
--     latest_accuracy,
--     latest_difficulty,
--     avg_wpm,
--     avg_accuracy,
--     total_play_time,
--     last_played_at,
--     updated_at
-- FROM typing_hero_stats 
-- WHERE user_id = 'your-user-id-here';

-- 4. Check AI analysis structure
-- SELECT 
--     id,
--     user_id,
--     ai_analysis->>'performanceLevel' as performance_level,
--     ai_analysis->'aiAssessment'->>'overallAssessment' as assessment,
--     ai_analysis->'performanceMetrics'->>'wpm' as ai_wpm,
--     ai_analysis->'performanceMetrics'->>'accuracy' as ai_accuracy
-- FROM typing_hero_sessions 
-- WHERE user_id = 'your-user-id-here'
-- ORDER BY created_at DESC 
-- LIMIT 1;

-- 5. Check if stats are being updated correctly
-- SELECT 
--     s.user_id,
--     s.total_sessions as stats_total,
--     COUNT(sess.id) as actual_sessions,
--     s.best_wpm as stats_best_wpm,
--     MAX(sess.wpm) as actual_best_wpm,
--     s.latest_wpm as stats_latest_wpm,
--     sess.wpm as actual_latest_wpm
-- FROM typing_hero_stats s
-- LEFT JOIN typing_hero_sessions sess ON s.user_id = sess.user_id
-- WHERE s.user_id = 'your-user-id-here'
-- GROUP BY s.user_id, s.total_sessions, s.best_wpm, s.latest_wpm, sess.wpm
-- ORDER BY s.user_id;

-- 6. Quick leaderboard test
SELECT 
    user_id,
    best_wpm,
    best_score,
    total_sessions,
    last_played_at
FROM typing_hero_stats 
ORDER BY best_wpm DESC 
LIMIT 10;

-- 7. Check for any data inconsistencies
SELECT 
    'Sessions without stats' as issue,
    COUNT(*) as count
FROM typing_hero_sessions s
LEFT JOIN typing_hero_stats st ON s.user_id = st.user_id
WHERE st.user_id IS NULL
UNION ALL
SELECT 
    'Stats without sessions' as issue,
    COUNT(*) as count
FROM typing_hero_stats st
LEFT JOIN typing_hero_sessions s ON st.user_id = s.user_id
WHERE s.user_id IS NULL;

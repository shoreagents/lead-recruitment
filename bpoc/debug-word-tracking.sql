-- =====================================================
-- TYPING HERO WORD-LEVEL DATA DEBUG QUERIES
-- Run these after testing to check if word data is being stored
-- =====================================================

-- 1. Check if word-level columns exist and have data
SELECT 
    'typing_hero_sessions' as table_name,
    COUNT(*) as total_sessions,
    COUNT(CASE WHEN words_correct != '[]'::jsonb THEN 1 END) as sessions_with_correct_words,
    COUNT(CASE WHEN words_incorrect != '[]'::jsonb THEN 1 END) as sessions_with_incorrect_words,
    MAX(jsonb_array_length(words_correct)) as max_correct_words,
    MAX(jsonb_array_length(words_incorrect)) as max_incorrect_words
FROM typing_hero_sessions;

-- 2. Check latest session word data (replace with your user ID)
-- SELECT 
--     id,
--     user_id,
--     created_at,
--     score,
--     wpm,
--     correct_words,
--     wrong_words,
--     jsonb_array_length(words_correct) as words_correct_count,
--     jsonb_array_length(words_incorrect) as words_incorrect_count,
--     words_correct,
--     words_incorrect
-- FROM typing_hero_sessions 
-- WHERE user_id = 'your-user-id-here'
-- ORDER BY created_at DESC 
-- LIMIT 3;

-- 3. Check stats table word-level data
SELECT 
    'typing_hero_stats' as table_name,
    COUNT(*) as total_users,
    COUNT(CASE WHEN total_words_correct > 0 THEN 1 END) as users_with_correct_words,
    COUNT(CASE WHEN total_words_incorrect > 0 THEN 1 END) as users_with_incorrect_words,
    MAX(total_words_correct) as max_total_correct,
    MAX(total_words_incorrect) as max_total_incorrect,
    AVG(average_reaction_time) as avg_reaction_time
FROM typing_hero_stats;

-- 4. Sample word data from latest session
-- SELECT 
--     s.user_id,
--     s.created_at,
--     s.words_correct,
--     s.words_incorrect,
--     st.total_words_correct,
--     st.total_words_incorrect,
--     st.average_reaction_time
-- FROM typing_hero_sessions s
-- LEFT JOIN typing_hero_stats st ON s.user_id = st.user_id
-- WHERE s.user_id = 'your-user-id-here'
-- ORDER BY s.created_at DESC 
-- LIMIT 1;

-- 5. Check for any data inconsistencies
SELECT 
    'Data Check' as check_type,
    COUNT(*) as total_sessions,
    SUM(jsonb_array_length(words_correct)) as total_correct_words_stored,
    SUM(jsonb_array_length(words_incorrect)) as total_incorrect_words_stored,
    SUM(correct_words) as total_correct_words_count,
    SUM(wrong_words) as total_wrong_words_count
FROM typing_hero_sessions;

-- 6. Check if word arrays are properly formatted
-- SELECT 
--     id,
--     user_id,
--     jsonb_typeof(words_correct) as correct_words_type,
--     jsonb_typeof(words_incorrect) as incorrect_words_type,
--     words_correct,
--     words_incorrect
-- FROM typing_hero_sessions 
-- WHERE user_id = 'your-user-id-here'
-- ORDER BY created_at DESC 
-- LIMIT 1;

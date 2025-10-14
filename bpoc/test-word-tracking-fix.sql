-- =====================================================
-- TYPING HERO WORD TRACKING TEST QUERIES
-- Run these after testing to verify word-level data is now being stored
-- =====================================================

-- 1. Check if word-level data is being stored
SELECT 
    'Word Tracking Test' as test_name,
    COUNT(*) as total_sessions,
    COUNT(CASE WHEN jsonb_array_length(words_correct) > 0 THEN 1 END) as sessions_with_correct_words,
    COUNT(CASE WHEN jsonb_array_length(words_incorrect) > 0 THEN 1 END) as sessions_with_incorrect_words,
    SUM(jsonb_array_length(words_correct)) as total_correct_words_stored,
    SUM(jsonb_array_length(words_incorrect)) as total_incorrect_words_stored
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
-- LIMIT 1;

-- 3. Check stats aggregation
SELECT 
    'Stats Aggregation Test' as test_name,
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

-- 5. Check for data consistency
SELECT 
    'Data Consistency Check' as check_type,
    COUNT(*) as total_sessions,
    SUM(jsonb_array_length(words_correct)) as total_correct_words_stored,
    SUM(jsonb_array_length(words_incorrect)) as total_incorrect_words_stored,
    SUM(correct_words) as total_correct_words_count,
    SUM(wrong_words) as total_wrong_words_count,
    CASE 
        WHEN SUM(jsonb_array_length(words_correct)) = SUM(correct_words) 
        THEN 'CORRECT WORDS MATCH ✅' 
        ELSE 'CORRECT WORDS MISMATCH ❌' 
    END as correct_words_check,
    CASE 
        WHEN SUM(jsonb_array_length(words_incorrect)) = SUM(wrong_words) 
        THEN 'INCORRECT WORDS MATCH ✅' 
        ELSE 'INCORRECT WORDS MISMATCH ❌' 
    END as incorrect_words_check
FROM typing_hero_sessions;

-- 6. Check word data structure
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

-- =====================================================
-- DISC PERSONALITY DATA VERIFICATION SCRIPT
-- Run this after completing a DISC assessment to verify data storage
-- =====================================================

-- Check if tables exist
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE tablename IN ('disc_personality_sessions', 'disc_personality_stats')
ORDER BY tablename;

-- =====================================================
-- 1. CHECK SESSIONS TABLE
-- =====================================================

-- Count total sessions
SELECT COUNT(*) as total_sessions FROM disc_personality_sessions;

-- Show latest 5 sessions with key data
SELECT 
    id,
    user_id,
    created_at,
    duration_seconds,
    total_questions,
    d_score, i_score, s_score, c_score,
    primary_type, secondary_type,
    confidence_score,
    session_status,
    CASE 
        WHEN ai_assessment::text != '{}' THEN 'Has AI Assessment'
        ELSE 'No AI Assessment'
    END as ai_status,
    jsonb_array_length(ai_bpo_roles) as bpo_roles_count,
    jsonb_array_length(core_responses) as core_responses_count,
    jsonb_array_length(personalized_responses) as personalized_responses_count
FROM disc_personality_sessions 
ORDER BY created_at DESC 
LIMIT 5;

-- Check AI content samples
SELECT 
    id,
    user_id,
    ai_assessment->'text' as ai_assessment_preview,
    ai_bpo_roles,
    user_position,
    user_location
FROM disc_personality_sessions 
WHERE ai_assessment::text != '{}'
ORDER BY created_at DESC 
LIMIT 3;

-- =====================================================
-- 2. CHECK STATS TABLE
-- =====================================================

-- Count total users with stats
SELECT COUNT(*) as total_users_with_stats FROM disc_personality_stats;

-- Show latest stats
SELECT 
    user_id,
    total_sessions,
    completed_sessions,
    last_taken_at,
    latest_d_score, latest_i_score, latest_s_score, latest_c_score,
    latest_primary_type, latest_secondary_type,
    best_confidence_score,
    average_completion_time,
    jsonb_array_length(latest_bpo_roles) as latest_bpo_roles_count
FROM disc_personality_stats 
ORDER BY last_taken_at DESC 
LIMIT 5;

-- =====================================================
-- 3. DATA INTEGRITY CHECKS
-- =====================================================

-- Check for any invalid DISC scores (should be 0-100)
SELECT 
    id,
    user_id,
    d_score, i_score, s_score, c_score
FROM disc_personality_sessions 
WHERE d_score < 0 OR d_score > 100 
   OR i_score < 0 OR i_score > 100 
   OR s_score < 0 OR s_score > 100 
   OR c_score < 0 OR c_score > 100;

-- Check for sessions without responses
SELECT 
    id,
    user_id,
    jsonb_array_length(core_responses) as core_count,
    jsonb_array_length(personalized_responses) as personalized_count
FROM disc_personality_sessions 
WHERE jsonb_array_length(core_responses) = 0;

-- Check response patterns data
SELECT 
    id,
    user_id,
    response_patterns->'total_responses' as total_responses,
    response_patterns->'avg_response_time' as avg_response_time,
    response_patterns->'consistency_score' as consistency_score
FROM disc_personality_sessions 
WHERE response_patterns::text != '{}'
ORDER BY created_at DESC 
LIMIT 5;

-- =====================================================
-- 4. PERFORMANCE CHECKS
-- =====================================================

-- Check index usage (should show indexes exist)
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('disc_personality_sessions', 'disc_personality_stats')
ORDER BY tablename, indexname;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE tablename IN ('disc_personality_sessions', 'disc_personality_stats');

-- =====================================================
-- 5. SAMPLE DATA QUERIES
-- =====================================================

-- Show a complete session record (latest one)
SELECT 
    id,
    user_id,
    started_at,
    finished_at,
    duration_seconds,
    total_questions,
    d_score, i_score, s_score, c_score,
    primary_type, secondary_type,
    confidence_score,
    cultural_alignment,
    ai_assessment,
    ai_bpo_roles,
    core_responses,
    personalized_responses,
    response_patterns,
    user_position,
    user_location,
    session_status
FROM disc_personality_sessions 
ORDER BY created_at DESC 
LIMIT 1;

-- Show user stats summary
SELECT 
    ds.user_id,
    ds.total_sessions,
    ds.completed_sessions,
    ds.latest_primary_type,
    ds.best_confidence_score,
    ds.average_completion_time,
    COUNT(dps.id) as actual_session_count
FROM disc_personality_stats ds
LEFT JOIN disc_personality_sessions dps ON ds.user_id = dps.user_id
GROUP BY ds.user_id, ds.total_sessions, ds.completed_sessions, ds.latest_primary_type, ds.best_confidence_score, ds.average_completion_time
ORDER BY ds.last_taken_at DESC;

-- =====================================================
-- EXPECTED RESULTS GUIDE:
-- =====================================================
-- 
-- After completing a DISC assessment, you should see:
-- 1. New record in disc_personality_sessions with:
--    - All DISC scores (0-100 range)
--    - Primary/secondary types (D, I, S, C)
--    - AI assessment JSONB (if AI is working)
--    - AI BPO roles array (if AI is working)
--    - Core responses (30 items)
--    - Personalized responses (5 items if AI generated them)
--    - User context (position, location, bio)
--
-- 2. Updated record in disc_personality_stats with:
--    - Incremented session counts
--    - Latest scores and types
--    - Latest AI content
--    - Updated timestamps
--
-- 3. No data integrity issues (all scores 0-100, no null required fields)
-- =====================================================

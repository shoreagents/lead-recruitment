-- =====================================================
-- CHECK DISC PERSONALITY STATS DATA
-- Run this to see what's actually in the stats table
-- =====================================================

-- Check if stats table exists and has data
SELECT COUNT(*) as total_stats_records FROM disc_personality_stats;

-- Show all stats records with AI content status
SELECT 
    user_id,
    total_sessions,
    completed_sessions,
    last_taken_at,
    latest_primary_type,
    latest_secondary_type,
    best_confidence_score,
    CASE 
        WHEN latest_ai_assessment IS NULL THEN 'NULL'
        WHEN latest_ai_assessment = '' THEN 'EMPTY STRING'
        ELSE 'HAS CONTENT (' || LENGTH(latest_ai_assessment) || ' chars)'
    END as ai_assessment_status,
    CASE 
        WHEN latest_bpo_roles IS NULL THEN 'NULL'
        WHEN latest_bpo_roles::text = '[]' THEN 'EMPTY ARRAY'
        WHEN latest_bpo_roles::text = '{}' THEN 'EMPTY OBJECT'
        ELSE 'HAS DATA (' || jsonb_array_length(latest_bpo_roles) || ' roles)'
    END as bpo_roles_status,
    created_at,
    updated_at
FROM disc_personality_stats 
ORDER BY updated_at DESC;

-- Show detailed AI content for latest records
SELECT 
    user_id,
    latest_ai_assessment,
    latest_bpo_roles,
    updated_at
FROM disc_personality_stats 
WHERE latest_ai_assessment IS NOT NULL 
   OR (latest_bpo_roles IS NOT NULL AND latest_bpo_roles::text != '[]')
ORDER BY updated_at DESC 
LIMIT 3;

-- Compare with sessions table to see if data exists there
SELECT 
    'SESSIONS' as source,
    COUNT(*) as total_records,
    COUNT(CASE WHEN ai_assessment::text != '{}' THEN 1 END) as has_ai_assessment,
    COUNT(CASE WHEN jsonb_array_length(ai_bpo_roles) > 0 THEN 1 END) as has_bpo_roles
FROM disc_personality_sessions

UNION ALL

SELECT 
    'STATS' as source,
    COUNT(*) as total_records,
    COUNT(CASE WHEN latest_ai_assessment IS NOT NULL AND latest_ai_assessment != '' THEN 1 END) as has_ai_assessment,
    COUNT(CASE WHEN latest_bpo_roles IS NOT NULL AND jsonb_array_length(latest_bpo_roles) > 0 THEN 1 END) as has_bpo_roles
FROM disc_personality_stats;

-- Show the most recent session vs stats data for comparison
WITH recent_session AS (
    SELECT 
        user_id,
        ai_assessment,
        ai_bpo_roles,
        created_at as session_created
    FROM disc_personality_sessions 
    ORDER BY created_at DESC 
    LIMIT 1
),
recent_stats AS (
    SELECT 
        user_id,
        latest_ai_assessment,
        latest_bpo_roles,
        updated_at as stats_updated
    FROM disc_personality_stats 
    ORDER BY updated_at DESC 
    LIMIT 1
)
SELECT 
    'COMPARISON' as check_type,
    rs.user_id as session_user,
    rst.user_id as stats_user,
    CASE WHEN rs.ai_assessment::text != '{}' THEN 'HAS DATA' ELSE 'NO DATA' END as session_ai,
    CASE WHEN rst.latest_ai_assessment IS NOT NULL THEN 'HAS DATA' ELSE 'NO DATA' END as stats_ai,
    CASE WHEN jsonb_array_length(rs.ai_bpo_roles) > 0 THEN 'HAS DATA' ELSE 'NO DATA' END as session_bpo,
    CASE WHEN jsonb_array_length(rst.latest_bpo_roles) > 0 THEN 'HAS DATA' ELSE 'NO DATA' END as stats_bpo,
    rs.session_created,
    rst.stats_updated
FROM recent_session rs
FULL OUTER JOIN recent_stats rst ON rs.user_id = rst.user_id;

-- Manual fix query (run this if data is missing in stats)
/*
UPDATE disc_personality_stats 
SET 
    latest_ai_assessment = (
        SELECT ai_assessment->>'text'
        FROM disc_personality_sessions 
        WHERE disc_personality_sessions.user_id = disc_personality_stats.user_id 
        ORDER BY created_at DESC 
        LIMIT 1
    ),
    latest_bpo_roles = (
        SELECT ai_bpo_roles
        FROM disc_personality_sessions 
        WHERE disc_personality_sessions.user_id = disc_personality_stats.user_id 
        ORDER BY created_at DESC 
        LIMIT 1
    )
WHERE user_id IN (
    SELECT DISTINCT user_id FROM disc_personality_sessions 
    WHERE ai_assessment::text != '{}' OR jsonb_array_length(ai_bpo_roles) > 0
);
*/

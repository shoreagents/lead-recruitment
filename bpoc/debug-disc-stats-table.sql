-- =====================================================
-- DEBUG DISC STATS TABLE STRUCTURE AND DATA
-- =====================================================

-- 1. Check if table exists and its structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'disc_personality_stats' 
ORDER BY ordinal_position;

-- 2. Check constraints on the table
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'disc_personality_stats'::regclass;

-- 3. Show current data in stats table
SELECT 
    user_id,
    total_sessions,
    completed_sessions,
    latest_primary_type,
    latest_secondary_type,
    CASE 
        WHEN latest_ai_assessment IS NULL THEN 'NULL'
        WHEN latest_ai_assessment = '' THEN 'EMPTY'
        ELSE 'HAS DATA (' || LENGTH(latest_ai_assessment) || ' chars)'
    END as ai_assessment_status,
    CASE 
        WHEN latest_bpo_roles IS NULL THEN 'NULL'
        WHEN latest_bpo_roles::text = '[]' THEN 'EMPTY ARRAY'
        ELSE 'HAS DATA (' || jsonb_array_length(latest_bpo_roles) || ' roles)'
    END as bpo_roles_status,
    created_at,
    updated_at
FROM disc_personality_stats
ORDER BY updated_at DESC;

-- 4. Show sample AI content (if any)
SELECT 
    user_id,
    LEFT(latest_ai_assessment, 100) as ai_preview,
    latest_bpo_roles,
    updated_at
FROM disc_personality_stats 
WHERE latest_ai_assessment IS NOT NULL 
   OR (latest_bpo_roles IS NOT NULL AND latest_bpo_roles::text != '[]')
ORDER BY updated_at DESC 
LIMIT 2;

-- 5. Test INSERT to verify table works
-- (Uncomment and modify user_id to test)
/*
INSERT INTO disc_personality_stats (
    user_id, 
    total_sessions, 
    completed_sessions, 
    last_taken_at,
    latest_d_score, 
    latest_i_score, 
    latest_s_score, 
    latest_c_score,
    latest_primary_type, 
    latest_secondary_type, 
    best_confidence_score,
    average_completion_time, 
    latest_ai_assessment, 
    latest_bpo_roles
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- Replace with valid user_id
    1, 
    1, 
    NOW(),
    30, 
    25, 
    20, 
    25,
    'D', 
    'I', 
    90,
    300, 
    'Test AI assessment content for debugging purposes.', 
    '[{"title":"Test BPO Role 1"},{"title":"Test BPO Role 2"}]'::jsonb
) 
ON CONFLICT (user_id) DO UPDATE SET
    latest_ai_assessment = EXCLUDED.latest_ai_assessment,
    latest_bpo_roles = EXCLUDED.latest_bpo_roles,
    updated_at = NOW();
*/

-- 6. Show sessions vs stats comparison
SELECT 
    'SESSIONS' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN ai_assessment IS NOT NULL AND ai_assessment::text != '{}' THEN 1 END) as with_ai_assessment,
    COUNT(CASE WHEN ai_bpo_roles IS NOT NULL AND jsonb_array_length(ai_bpo_roles) > 0 THEN 1 END) as with_bpo_roles
FROM disc_personality_sessions

UNION ALL

SELECT 
    'STATS' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN latest_ai_assessment IS NOT NULL AND latest_ai_assessment != '' THEN 1 END) as with_ai_assessment,
    COUNT(CASE WHEN latest_bpo_roles IS NOT NULL AND jsonb_array_length(latest_bpo_roles) > 0 THEN 1 END) as with_bpo_roles
FROM disc_personality_stats;

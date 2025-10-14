-- =====================================================
-- VERIFY ALL DISC STATS FIELDS ARE POPULATED
-- =====================================================

-- 1. Check table structure to confirm all fields exist
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'disc_personality_stats' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Count records with NULL values for each field
SELECT 
    'consistency_trend' as field_name,
    COUNT(*) as total_records,
    COUNT(consistency_trend) as non_null_count,
    COUNT(*) - COUNT(consistency_trend) as null_count
FROM disc_personality_stats

UNION ALL

SELECT 
    'latest_ai_assessment' as field_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN latest_ai_assessment IS NOT NULL AND latest_ai_assessment != '' THEN 1 END) as non_null_count,
    COUNT(CASE WHEN latest_ai_assessment IS NULL OR latest_ai_assessment = '' THEN 1 END) as null_count
FROM disc_personality_stats

UNION ALL

SELECT 
    'latest_bpo_roles' as field_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN latest_bpo_roles IS NOT NULL AND jsonb_array_length(latest_bpo_roles) > 0 THEN 1 END) as non_null_count,
    COUNT(CASE WHEN latest_bpo_roles IS NULL OR jsonb_array_length(latest_bpo_roles) = 0 THEN 1 END) as null_count
FROM disc_personality_stats

UNION ALL

SELECT 
    'percentile' as field_name,
    COUNT(*) as total_records,
    COUNT(percentile) as non_null_count,
    COUNT(*) - COUNT(percentile) as null_count
FROM disc_personality_stats;

-- 3. Show actual data for all fields
SELECT 
    user_id,
    total_sessions,
    completed_sessions,
    latest_primary_type,
    latest_secondary_type,
    best_confidence_score,
    average_completion_time,
    COALESCE(consistency_trend::text, 'NULL') as consistency_trend,
    CASE 
        WHEN latest_ai_assessment IS NULL THEN 'NULL'
        WHEN latest_ai_assessment = '' THEN 'EMPTY'
        ELSE LEFT(latest_ai_assessment, 50) || '...'
    END as ai_assessment_preview,
    CASE 
        WHEN latest_bpo_roles IS NULL THEN 'NULL'
        WHEN jsonb_array_length(latest_bpo_roles) = 0 THEN 'EMPTY'
        ELSE 'HAS ' || jsonb_array_length(latest_bpo_roles) || ' ROLES'
    END as bpo_roles_status,
    COALESCE(percentile::text, 'NULL') as percentile,
    updated_at
FROM disc_personality_stats 
ORDER BY updated_at DESC;

-- 4. Show the latest BPO roles content
SELECT 
    user_id,
    latest_bpo_roles,
    updated_at
FROM disc_personality_stats 
WHERE latest_bpo_roles IS NOT NULL 
  AND jsonb_array_length(latest_bpo_roles) > 0
ORDER BY updated_at DESC 
LIMIT 3;

-- 5. Test query to see if all required fields would be populated in a new insert
SELECT 
    'TEST PREVIEW' as status,
    -- Simulate what would be inserted
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid as user_id,
    1 as total_sessions,
    1 as completed_sessions,
    NOW() as last_taken_at,
    30 as latest_d_score,
    25 as latest_i_score,
    20 as latest_s_score,
    25 as latest_c_score,
    'D' as latest_primary_type,
    'I' as latest_secondary_type,
    90 as best_confidence_score,
    300 as average_completion_time,
    NULL as consistency_trend, -- NULL for first session
    'Test AI assessment content...' as latest_ai_assessment,
    '[{"title":"Test Role 1"},{"title":"Test Role 2"}]'::jsonb as latest_bpo_roles,
    75.5 as percentile;

-- 6. Summary check
SELECT 
    'SUMMARY' as check_type,
    COUNT(*) as total_stats_records,
    COUNT(CASE WHEN consistency_trend IS NOT NULL THEN 1 END) as has_consistency_trend,
    COUNT(CASE WHEN latest_ai_assessment IS NOT NULL AND latest_ai_assessment != '' THEN 1 END) as has_ai_assessment,
    COUNT(CASE WHEN latest_bpo_roles IS NOT NULL AND jsonb_array_length(latest_bpo_roles) > 0 THEN 1 END) as has_bpo_roles,
    COUNT(CASE WHEN percentile IS NOT NULL THEN 1 END) as has_percentile
FROM disc_personality_stats;

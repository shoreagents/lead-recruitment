-- =====================================================
-- TEST DISC XP SYSTEM AND NEW FIELDS
-- =====================================================

-- 1. Check if new fields were added successfully
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'disc_personality_stats' 
  AND column_name IN ('total_xp', 'badges_earned', 'cultural_alignment_score', 'authenticity_score', 'latest_session_xp')
ORDER BY column_name;

-- 2. Show current data with new fields
SELECT 
    user_id,
    total_sessions,
    completed_sessions,
    best_confidence_score as confidence,
    COALESCE(total_xp, 0) as total_xp,
    COALESCE(badges_earned, 0) as badges,
    COALESCE(cultural_alignment_score, 0) as filipino_fit,
    COALESCE(authenticity_score, 0) as authenticity,
    COALESCE(latest_session_xp, 0) as last_session_xp,
    updated_at
FROM disc_personality_stats 
ORDER BY updated_at DESC;

-- 3. Test the XP calculation formula
-- Expected: (confidence * 2) + (cultural_alignment * 1.5) + (questions * 5) + bonus
SELECT 
    'XP CALCULATION TEST' as test_type,
    -- Example: 81% confidence, 95% cultural alignment, 35 questions, completed under 10 mins
    (81 * 2) + (95 * 1.5) + (35 * 5) + 50 as expected_xp,
    -- Expected: 162 + 142.5 + 175 + 50 = 529.5 (rounded to 530)
    'Should be around 530 XP' as note;

-- 4. Badge logic test
SELECT 
    'BADGE LOGIC TEST' as test_type,
    CASE 
        WHEN 81 >= 85 THEN '1 badge (high confidence)'
        ELSE '0 badges (confidence < 85%)'
    END as badge_result,
    'Confidence 81% should give 0 badges' as note

UNION ALL

SELECT 
    'BADGE LOGIC TEST' as test_type,
    CASE 
        WHEN 90 >= 85 THEN '1 badge (high confidence)'
        ELSE '0 badges (confidence < 85%)'
    END as badge_result,
    'Confidence 90% should give 1 badge' as note;

-- 5. Check if AI assessment and BPO roles are now being stored
SELECT 
    user_id,
    CASE 
        WHEN latest_ai_assessment IS NOT NULL AND latest_ai_assessment != '' 
        THEN 'HAS AI ASSESSMENT (' || LENGTH(latest_ai_assessment) || ' chars)'
        ELSE 'NO AI ASSESSMENT'
    END as ai_status,
    CASE 
        WHEN latest_bpo_roles IS NOT NULL AND jsonb_array_length(latest_bpo_roles) > 0
        THEN 'HAS BPO ROLES (' || jsonb_array_length(latest_bpo_roles) || ' roles)'
        ELSE 'NO BPO ROLES'
    END as bpo_status,
    total_xp,
    badges_earned,
    cultural_alignment_score,
    updated_at
FROM disc_personality_stats 
ORDER BY updated_at DESC 
LIMIT 3;

-- 6. Summary of what should be stored now
SELECT 
    'EXPECTED FIELDS' as summary,
    '794 XP, 1 Badge, 81% Confidence, 95% Filipino Fit' as your_example,
    'All should now be stored in the stats table' as result;

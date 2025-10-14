-- Test script for BPOC Cultural database tables
-- Run this after creating the tables to verify they work correctly

-- 1. Check if tables exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_name IN ('bpoc_cultural_sessions', 'bpoc_cultural_stats')
ORDER BY table_name;

-- 2. Check table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'bpoc_cultural_sessions'
ORDER BY ordinal_position;

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'bpoc_cultural_stats'
ORDER BY ordinal_position;

-- 3. Check if tables are empty (should be empty initially)
SELECT 
  'bpoc_cultural_sessions' as table_name,
  COUNT(*) as row_count
FROM bpoc_cultural_sessions
UNION ALL
SELECT 
  'bpoc_cultural_stats' as table_name,
  COUNT(*) as row_count
FROM bpoc_cultural_stats;

-- 4. Test inserting sample data (optional - for testing)
-- Note: This requires a valid user_id from your users table
/*
INSERT INTO bpoc_cultural_sessions (
  user_id,
  started_at,
  finished_at,
  duration_ms,
  stage_reached,
  challenge_completed,
  game_state,
  time_left,
  survival_status,
  interaction_count,
  us_score,
  uk_score,
  au_score,
  ca_score,
  tier_name,
  tier_description,
  achievements,
  metrics
) VALUES (
  'your-user-uuid-here', -- Replace with actual user UUID
  NOW() - INTERVAL '5 minutes',
  NOW(),
  300000, -- 5 minutes
  4, -- Completed all stages
  12, -- Completed all challenges
  'results',
  45, -- 45 seconds remaining
  95, -- 95% survival rate
  8, -- 8 interactions
  92, -- US score
  88, -- UK score
  95, -- AU score
  90, -- CA score
  'Cultural Master',
  'Excellent cultural adaptation - Premium client tier',
  '["🇺🇸 US Cultural Master", "🌟 Cultural Chameleon"]'::jsonb,
  '{"test": "data"}'::jsonb
);
*/

-- 5. Verify foreign key constraints
SELECT 
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('bpoc_cultural_sessions', 'bpoc_cultural_stats');

-- 6. Check indexes
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes
WHERE tablename IN ('bpoc_cultural_sessions', 'bpoc_cultural_stats')
ORDER BY tablename, indexname;

-- Test script to check current admin_level constraint
-- This will help us see if the constraint allows 'recruiter'

-- Check current constraint
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname = 'users_admin_level_check';

-- Try to insert a test user with admin_level = 'recruiter' (this will fail if constraint doesn't allow it)
-- We'll use a test UUID that won't conflict
INSERT INTO users (
  id, email, first_name, last_name, full_name, 
  location, admin_level, completed_data, created_at, updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001', 
  'test@recruiter.com', 
  'Test', 
  'Recruiter', 
  'Test Recruiter',
  'Test Location',
  'recruiter',
  false,
  NOW(),
  NOW()
);

-- If the insert succeeds, clean up the test record
DELETE FROM users WHERE id = '00000000-0000-0000-0000-000000000001';

SELECT 'Constraint test completed' AS status;

-- Update admin_level constraint to include 'recruiter'
-- This script will modify the existing constraint to allow 'recruiter' as a valid admin_level

-- First, drop the existing constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_admin_level_check;

-- Add the new constraint that includes 'recruiter'
ALTER TABLE users ADD CONSTRAINT users_admin_level_check 
  CHECK (admin_level IN ('user', 'admin', 'recruiter'));

-- Verify the constraint is updated
SELECT 'admin_level constraint updated to include recruiter' AS status;

-- Show the current constraint
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname = 'users_admin_level_check';

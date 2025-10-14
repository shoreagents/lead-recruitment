-- Add position column to existing users table
-- Run this script in your Railway database (DBeaver or Railway console)

-- Add position column
ALTER TABLE users ADD COLUMN IF NOT EXISTS position TEXT;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position; 
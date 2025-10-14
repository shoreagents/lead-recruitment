-- Add gender column to users table
-- This migration adds a gender field to store user gender information

-- 1) Add gender column with default null
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS gender VARCHAR(20) DEFAULT NULL;

-- 2) Add comment to document the field
COMMENT ON COLUMN users.gender IS 'User gender: male, female, other, prefer-not-to-say';

-- 3) Verify the column was added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'gender';

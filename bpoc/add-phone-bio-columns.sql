-- Add phone and bio columns to existing users table
-- Run this script in your Railway database (DBeaver or Railway console)

-- Add phone column
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add bio column  
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position; 
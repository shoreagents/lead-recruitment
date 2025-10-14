-- Add company column to users table
-- This script will add a company column to store recruiter company information

-- Add the company column
ALTER TABLE users ADD COLUMN IF NOT EXISTS company VARCHAR(255);

-- Add a comment to document the column
COMMENT ON COLUMN users.company IS 'Company name for recruiters and other users';

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'company';

SELECT 'Company column added successfully to users table' AS status;

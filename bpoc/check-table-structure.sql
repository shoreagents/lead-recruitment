-- Check the actual structure of the saved_resumes table
-- Run this first to see what columns exist

-- Option 1: Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'saved_resumes'
ORDER BY ordinal_position;

-- Option 2: Alternative way to see table structure
-- \d saved_resumes

-- Option 3: See all tables that might contain resume data
SELECT table_name 
FROM information_schema.tables 
WHERE table_name LIKE '%resume%' 
   OR table_name LIKE '%saved%'
ORDER BY table_name;

-- Option 4: If the column might have a different name, check for slug-like columns
SELECT table_name, column_name, data_type
FROM information_schema.columns 
WHERE table_name LIKE '%resume%' 
  AND (column_name LIKE '%slug%' 
    OR column_name LIKE '%url%' 
    OR column_name LIKE '%link%'
    OR column_name LIKE '%id%')
ORDER BY table_name, column_name;

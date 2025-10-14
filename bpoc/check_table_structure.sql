-- Check the current structure of the recruiter_jobs table
-- This will help us understand what fields exist

-- Check if the table exists
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'recruiter_jobs' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check the primary key constraint
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'recruiter_jobs' 
    AND tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_schema = 'public';

-- Check foreign key constraints
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'recruiter_jobs' 
    AND tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public';

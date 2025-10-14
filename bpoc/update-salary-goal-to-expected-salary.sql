-- Update salary_goal column to expected_salary with TEXT type
-- This migration changes from numeric to string format for salary ranges

-- Step 1: Add the new expected_salary column as TEXT
ALTER TABLE public.user_work_status ADD COLUMN expected_salary TEXT;

-- Step 2: Migrate existing data from salary_goal to expected_salary
-- Convert numeric values to string format with peso sign
UPDATE public.user_work_status 
SET expected_salary = CASE 
    WHEN salary_goal IS NOT NULL THEN 'P' || salary_goal::text
    ELSE NULL 
END;

-- Step 3: Drop the old salary_goal column
ALTER TABLE public.user_work_status DROP COLUMN salary_goal;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_work_status' AND table_schema = 'public'
ORDER BY ordinal_position;

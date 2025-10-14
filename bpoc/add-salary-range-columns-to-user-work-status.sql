-- =====================================================
-- Add Salary Range Columns to user_work_status Table
-- Adds minimum_salary_range and maximum_salary_range columns
-- =====================================================

-- Add minimum_salary_range column
ALTER TABLE public.user_work_status 
ADD COLUMN minimum_salary_range NUMERIC(12, 2) NULL;

-- Add maximum_salary_range column  
ALTER TABLE public.user_work_status 
ADD COLUMN maximum_salary_range NUMERIC(12, 2) NULL;

-- Add check constraint to ensure minimum <= maximum
ALTER TABLE public.user_work_status 
ADD CONSTRAINT user_work_status_salary_range_check 
CHECK (
  minimum_salary_range IS NULL OR 
  maximum_salary_range IS NULL OR 
  minimum_salary_range <= maximum_salary_range
);

-- Add comments for documentation
COMMENT ON COLUMN public.user_work_status.minimum_salary_range IS 'Minimum salary range for expected salary';
COMMENT ON COLUMN public.user_work_status.maximum_salary_range IS 'Maximum salary range for expected salary';

-- Update existing records to populate range columns from expected_salary text field
-- This is optional - you can run this to migrate existing data
-- UPDATE public.user_work_status 
-- SET 
--   minimum_salary_range = CASE 
--     WHEN expected_salary ~ '^\d+$' THEN expected_salary::NUMERIC
--     WHEN expected_salary ~ '^\d+\s*-\s*\d+$' THEN SPLIT_PART(expected_salary, '-', 1)::NUMERIC
--     ELSE NULL 
--   END,
--   maximum_salary_range = CASE 
--     WHEN expected_salary ~ '^\d+$' THEN expected_salary::NUMERIC
--     WHEN expected_salary ~ '^\d+\s*-\s*\d+$' THEN SPLIT_PART(expected_salary, '-', 2)::NUMERIC
--     ELSE NULL 
--   END
-- WHERE expected_salary IS NOT NULL AND expected_salary != '';

-- Verify the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_work_status' 
  AND table_schema = 'public'
  AND column_name IN ('minimum_salary_range', 'maximum_salary_range')
ORDER BY ordinal_position;

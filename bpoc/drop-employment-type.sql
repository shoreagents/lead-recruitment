-- Drop employment_type column and enum from user_work_status table
-- This migration removes the employment_type functionality

-- Step 1: Drop the column from the table
ALTER TABLE public.user_work_status DROP COLUMN IF EXISTS employment_type;

-- Step 2: Drop the enum type (only if no other tables use it)
-- Check for dependencies first:
-- SELECT pg_depend.objid, pg_class.relname 
-- FROM pg_depend 
-- JOIN pg_class ON pg_depend.objid = pg_class.oid 
-- WHERE pg_depend.refobjid = (SELECT oid FROM pg_type WHERE typname = 'employment_type_enum');

-- If no dependencies exist, drop the enum:
DROP TYPE IF EXISTS public.employment_type_enum;

-- Verify the changes (run this separately in DBeaver if needed)
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'user_work_status' AND table_schema = 'public';

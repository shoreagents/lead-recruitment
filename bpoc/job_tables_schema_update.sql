-- =====================================================
-- BPOC.IO Database Schema Updates
-- Adding shift column and urgent priority option
-- =====================================================

-- Step 1: Create shift enum type
CREATE TYPE public."shift_enum" AS ENUM (
    'day',
    'night'
);

-- Step 2: Add urgent option to existing priority enum
ALTER TYPE public."priority_enum" ADD VALUE 'urgent';

-- Step 3: Add shift column to job_requests table
ALTER TABLE public.job_requests 
ADD COLUMN shift public."shift_enum" DEFAULT 'day' NOT NULL;

-- Step 4: Add shift column to processed_job_requests table  
ALTER TABLE public.processed_job_requests
ADD COLUMN shift public."shift_enum" DEFAULT 'day' NOT NULL;

-- Step 5: Create indexes for better query performance
CREATE INDEX idx_job_requests_shift ON public.job_requests USING btree (shift);
CREATE INDEX idx_processed_job_requests_shift ON public.processed_job_requests USING btree (shift);

-- =====================================================
-- Verification Queries (Optional - for testing)
-- =====================================================

-- Verify the enum types
-- SELECT enumlabel FROM pg_enum WHERE enumtypid = 'public.priority_enum'::regtype ORDER BY enumsortorder;
-- SELECT enumlabel FROM pg_enum WHERE enumtypid = 'public.shift_enum'::regtype ORDER BY enumsortorder;

-- Verify the table structures
-- \d public.job_requests
-- \d public.processed_job_requests

-- =====================================================
-- Rollback Script (if needed)
-- =====================================================

-- To rollback these changes, run:
-- ALTER TABLE public.job_requests DROP COLUMN shift;
-- ALTER TABLE public.processed_job_requests DROP COLUMN shift;
-- DROP TYPE public."shift_enum";
-- Note: Cannot easily remove enum value 'urgent' from priority_enum once added

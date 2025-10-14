-- Connect saved_resumes to resumes_generated table
-- This script adds the foreign key constraint to link the tables

-- Add foreign key constraint to connect saved_resumes to resumes_generated
ALTER TABLE saved_resumes 
ADD CONSTRAINT saved_resumes_original_resume_id_fkey 
FOREIGN KEY (original_resume_id) REFERENCES resumes_generated(id) ON DELETE SET NULL;

-- Add a comment to document the relationship
COMMENT ON COLUMN saved_resumes.original_resume_id IS 'References the resumes_generated table to track which AI-generated resume was used to create this saved resume';

-- Verify the constraint was added
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'saved_resumes';

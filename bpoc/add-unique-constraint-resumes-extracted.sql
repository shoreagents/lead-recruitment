-- Add unique constraint to resumes_extracted table to enable upsert functionality
-- Run this in DBeaver or your database client

-- Add unique constraint on user_id to ensure one resume per user
ALTER TABLE resumes_extracted 
ADD CONSTRAINT resumes_extracted_user_id_unique UNIQUE (user_id);

-- This will allow the API to use ON CONFLICT (user_id) for upsert operations
-- Now when a user uploads a new resume, it will overwrite their existing record
-- instead of creating a new one

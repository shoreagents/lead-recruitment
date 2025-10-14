-- Add unique constraint to resumes_generated table to enable upsert functionality
-- Run this in DBeaver or your database client

-- Add unique constraint on user_id to ensure one generated resume per user
ALTER TABLE resumes_generated 
ADD CONSTRAINT resumes_generated_user_id_unique UNIQUE (user_id);

-- This will allow the API to use ON CONFLICT (user_id) for upsert operations
-- Now when a user generates a new resume, it will overwrite their existing record
-- instead of creating a new one

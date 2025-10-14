-- Add resumes_generated table to existing database
-- Run this in DBeaver or your database client

-- Create resumes_generated table to store AI-generated resume data
CREATE TABLE IF NOT EXISTS resumes_generated (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  original_resume_id UUID REFERENCES resumes_extracted(id) ON DELETE SET NULL,
  generated_resume_data JSONB NOT NULL, -- Stores the AI-generated resume data
  template_used TEXT, -- Store which template was used
  generation_metadata JSONB, -- Store additional metadata about the generation
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id) -- Ensure one generated resume per user for upsert functionality
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resumes_generated_user_id ON resumes_generated(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_generated_created_at ON resumes_generated(created_at);
CREATE INDEX IF NOT EXISTS idx_resumes_generated_original_resume_id ON resumes_generated(original_resume_id);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_resumes_generated_updated_at 
    BEFORE UPDATE ON resumes_generated
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 
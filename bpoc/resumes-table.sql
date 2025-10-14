-- Add resumes table to existing database
-- Run this in DBeaver or your database client

-- Create resumes_extracted table to store extracted JSON data
CREATE TABLE IF NOT EXISTS resumes_extracted (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resume_data JSONB NOT NULL, -- Stores the entire flexible JSON structure
  original_filename TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id) -- Ensure one resume per user for upsert functionality
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resumes_extracted_user_id ON resumes_extracted(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_extracted_created_at ON resumes_extracted(created_at);

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_resumes_extracted_updated_at 
    BEFORE UPDATE ON resumes_extracted 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 
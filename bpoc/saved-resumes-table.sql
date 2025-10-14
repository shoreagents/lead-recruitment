-- Create saved_resumes table to store visual presentations with shareable URLs
-- Run this in DBeaver or your database client

CREATE TABLE saved_resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resume_slug TEXT UNIQUE NOT NULL, -- URL-friendly slug like "john-doe-resume"
  resume_title TEXT NOT NULL, -- Display title like "John Doe's Resume"
  resume_data JSONB NOT NULL, -- Stores the complete resume data (content + template)
  template_used TEXT NOT NULL, -- Template ID used for styling
  is_public BOOLEAN DEFAULT true, -- Whether the resume is publicly accessible
  view_count INTEGER DEFAULT 0, -- Track how many times the resume has been viewed
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_saved_resumes_user_id ON saved_resumes(user_id);
CREATE INDEX idx_saved_resumes_slug ON saved_resumes(resume_slug);
CREATE INDEX idx_saved_resumes_public ON saved_resumes(is_public);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_saved_resumes_updated_at 
    BEFORE UPDATE ON saved_resumes
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

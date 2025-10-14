-- Railway Database Schema for User Profile
-- This schema matches the signup form fields

-- Create users table that references Supabase auth.users
CREATE TABLE users (
  id UUID PRIMARY KEY, -- This will be the Supabase user ID
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  location TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  position TEXT,
  gender TEXT,
  admin_level VARCHAR(10) DEFAULT 'user',
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT users_admin_level_check CHECK (admin_level IN ('user', 'admin'))
);
-- Validate gender field values (case-insensitive)
ALTER TABLE users
  ADD CONSTRAINT IF NOT EXISTS users_gender_check
  CHECK (gender IS NULL OR lower(gender) IN ('male', 'female', 'others'));

-- Create resumes table to store extracted JSON data
CREATE TABLE resumes_extracted (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resume_data JSONB NOT NULL, -- Stores the entire flexible JSON structure
  original_filename TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id) -- Ensure one resume per user for upsert functionality
);

-- Create resumes_generated table to store AI-generated resume data
CREATE TABLE resumes_generated (
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

-- Create saved_resumes table to store visual presentations with shareable URLs
CREATE TABLE saved_resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resume_slug TEXT UNIQUE NOT NULL, -- URL-friendly slug like "john-doe-resume"
  resume_title TEXT NOT NULL, -- Display title like "John Doe's Resume"
  resume_data JSONB NOT NULL, -- Stores the complete resume data (content + template)
  template_used TEXT NOT NULL, -- Template ID used for styling
  original_resume_id UUID, -- References the resumes_generated table
  is_public BOOLEAN DEFAULT true, -- Whether the resume is publicly accessible
  view_count INTEGER DEFAULT 0, -- Track how many times the resume has been viewed
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add foreign key constraint to connect saved_resumes to resumes_generated
ALTER TABLE saved_resumes 
ADD CONSTRAINT saved_resumes_original_resume_id_fkey 
FOREIGN KEY (original_resume_id) REFERENCES resumes_generated(id) ON DELETE SET NULL;

-- Add a comment to document the relationship
COMMENT ON COLUMN saved_resumes.original_resume_id IS 'References the resumes_generated table to track which AI-generated resume was used to create this saved resume';

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_full_name ON users(full_name);
CREATE INDEX idx_resumes_extracted_user_id ON resumes_extracted(user_id);
CREATE INDEX idx_resumes_extracted_created_at ON resumes_extracted(created_at);
CREATE INDEX idx_resumes_generated_user_id ON resumes_generated(user_id);
CREATE INDEX idx_resumes_generated_created_at ON resumes_generated(created_at);
CREATE INDEX idx_resumes_generated_original_resume_id ON resumes_generated(original_resume_id);
CREATE INDEX idx_saved_resumes_user_id ON saved_resumes(user_id);
CREATE INDEX idx_saved_resumes_slug ON saved_resumes(resume_slug);
CREATE INDEX idx_saved_resumes_public ON saved_resumes(is_public);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resumes_extracted_updated_at 
    BEFORE UPDATE ON resumes_extracted
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resumes_generated_updated_at 
    BEFORE UPDATE ON resumes_generated
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_resumes_updated_at 
    BEFORE UPDATE ON saved_resumes
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 
-- Create user_recruiter table
-- This table stores recruiter-specific user data, similar to users table but without admin fields

CREATE TABLE IF NOT EXISTS user_recruiter (
  id UUID PRIMARY KEY, -- This will be the Supabase user ID
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Not specified',
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  position TEXT,
  company TEXT,
  gender TEXT,
  completed_data BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_recruiter_email ON user_recruiter(email);
CREATE INDEX IF NOT EXISTS idx_user_recruiter_company ON user_recruiter(company);
CREATE INDEX IF NOT EXISTS idx_user_recruiter_created_at ON user_recruiter(created_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE user_recruiter ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY "Users can view own recruiter data" ON user_recruiter
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own recruiter data" ON user_recruiter
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Users can insert their own data
CREATE POLICY "Users can insert own recruiter data" ON user_recruiter
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy: Users can delete their own data
CREATE POLICY "Users can delete own recruiter data" ON user_recruiter
  FOR DELETE USING (auth.uid() = id);


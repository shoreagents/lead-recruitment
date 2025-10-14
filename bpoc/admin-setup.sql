-- Simple Admin Role Setup SQL for BPOC.IO
-- Add admin role to existing users table

-- 1. Add admin role column to existing users table
ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN admin_level VARCHAR(10) DEFAULT 'user' CHECK (admin_level IN ('user', 'admin'));

-- 2. Create Admin Activity Logs Table
CREATE TABLE admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  details TEXT,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create Indexes for Performance
CREATE INDEX idx_users_is_admin ON users(is_admin);
CREATE INDEX idx_users_admin_level ON users(admin_level);
CREATE INDEX idx_admin_activity_logs_user_id ON admin_activity_logs(user_id);
CREATE INDEX idx_admin_activity_logs_created_at ON admin_activity_logs(created_at DESC);

-- 4. Create Function to Check if User is Admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID) 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = user_uuid 
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql;

-- 5. Create Function to Log Admin Actions
CREATE OR REPLACE FUNCTION log_admin_action(
  user_id UUID,
  action TEXT,
  details TEXT DEFAULT NULL,
  ip_address INET DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO admin_activity_logs (
    user_id, action, details, ip_address
  ) VALUES (
    log_admin_action.user_id,
    log_admin_action.action,
    log_admin_action.details,
    log_admin_action.ip_address
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- 6. Make your user an admin (REPLACE WITH YOUR ACTUAL USER ID)
-- First, find your user ID from the users table:
-- SELECT id, email, full_name FROM users WHERE email = 'your-email@example.com';

-- Then run this to make yourself an admin:
-- UPDATE users 
-- SET is_admin = true, admin_level = 'admin' 
-- WHERE id = 'YOUR_USER_ID_HERE';

-- 7. Test Queries (Optional)
-- Check admin users:
-- SELECT id, email, full_name, is_admin, admin_level FROM users WHERE is_admin = true;

-- Test if admin function works:
-- SELECT is_admin('your-user-id-here');

-- View admin activity logs:
-- SELECT * FROM admin_activity_logs ORDER BY created_at DESC; 
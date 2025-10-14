-- Check users table structure and data
-- Run these queries in DBeaver to examine your users table

-- 1. Show table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Count total users
SELECT COUNT(*) as total_users FROM users;

-- 3. Show sample user data (first 5 users)
SELECT 
    id,
    email,
    full_name,
    location,
    phone,
    position,
    is_admin,
    admin_level,
    created_at,
    updated_at
FROM users 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. Show admin users
SELECT 
    id,
    email,
    full_name,
    is_admin,
    admin_level,
    created_at
FROM users 
WHERE is_admin = true;

-- 5. Show users with missing data
SELECT 
    id,
    email,
    full_name,
    CASE 
        WHEN phone IS NULL THEN 'Missing Phone'
        ELSE phone 
    END as phone_status,
    CASE 
        WHEN bio IS NULL THEN 'Missing Bio'
        ELSE 'Has Bio'
    END as bio_status,
    CASE 
        WHEN position IS NULL THEN 'Missing Position'
        ELSE position
    END as position_status,
    CASE 
        WHEN avatar_url IS NULL THEN 'Missing Avatar'
        ELSE 'Has Avatar'
    END as avatar_status
FROM users 
ORDER BY created_at DESC;

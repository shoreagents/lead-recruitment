-- Resume Slug Migration Script for DBeaver
-- Updates all resume slugs to firstName-lastName-lastTwoDigitsOfUID format

-- First, let's see what we're working with (preview query)
-- Run this first to see current data:
/*
SELECT 
    r.id,
    r.resume_slug as current_slug,
    r.user_id,
    u.first_name,
    u.last_name,
    u.id as uid,
    -- Preview the new slug format
    LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(u.first_name, '[^a-zA-Z0-9]', '', 'g'), 
            '^(.{20}).*', '\1'
        )
    ) || '-' || 
    LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(COALESCE(u.last_name, 'profile'), '[^a-zA-Z0-9]', '', 'g'), 
            '^(.{20}).*', '\1'
        )
    ) || '-' || 
    LPAD(RIGHT(u.id::text, 2), 2, '0') as new_slug
FROM saved_resumes r
JOIN users u ON r.user_id = u.id
WHERE r.resume_slug IS NOT NULL
ORDER BY r.id;
*/

-- Backup current slugs (run this before updating)
-- CREATE TABLE resume_slug_backup AS
-- SELECT id, resume_slug, user_id, NOW() as backup_date FROM saved_resumes WHERE resume_slug IS NOT NULL;

-- Main update query - updates all resume slugs to new format
UPDATE saved_resumes 
SET resume_slug = (
    -- Generate new slug: firstName-lastName-lastTwoDigits
    LOWER(
        -- Clean first name: remove special chars, limit to 20 chars
        REGEXP_REPLACE(
            REGEXP_REPLACE(COALESCE(u.first_name, 'user'), '[^a-zA-Z0-9]', '', 'g'), 
            '^(.{20}).*', '\1'
        )
    ) || '-' || 
    LOWER(
        -- Clean last name: remove special chars, limit to 20 chars  
        REGEXP_REPLACE(
            REGEXP_REPLACE(COALESCE(u.last_name, 'profile'), '[^a-zA-Z0-9]', '', 'g'), 
            '^(.{20}).*', '\1'
        )
    ) || '-' || 
    -- Last 2 digits of user ID, padded with 0 if needed
    LPAD(RIGHT(u.id::text, 2), 2, '0')
)
FROM users u 
WHERE saved_resumes.user_id = u.id 
AND saved_resumes.resume_slug IS NOT NULL;

-- Verify the update worked
-- Run this after the update to check results:
/*
SELECT 
    r.id,
    r.resume_slug as new_slug,
    u.first_name,
    u.last_name,
    u.id as uid
FROM saved_resumes r
JOIN users u ON r.user_id = u.id
WHERE r.resume_slug IS NOT NULL
ORDER BY r.id;
*/

-- Check for any duplicate slugs (should be empty if all is well)
/*
SELECT resume_slug, COUNT(*) as count
FROM saved_resumes 
WHERE resume_slug IS NOT NULL
GROUP BY resume_slug 
HAVING COUNT(*) > 1;
*/

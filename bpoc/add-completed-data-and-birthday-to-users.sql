-- Add new columns to users table: completed_data (boolean) and birthday (date)
-- Safe to run multiple times due to IF NOT EXISTS

BEGIN;

-- 1) Add completed_data with default false
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS completed_data boolean DEFAULT false;

-- Ensure existing rows have a value
UPDATE users SET completed_data = false WHERE completed_data IS NULL;

-- Optionally enforce NOT NULL (comment out if you prefer nullable)
ALTER TABLE users ALTER COLUMN completed_data SET NOT NULL;

-- 2) Add birthday as DATE (nullable)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS birthday date;

COMMIT;

-- Rollback (manual):
-- ALTER TABLE users DROP COLUMN IF EXISTS birthday;
-- ALTER TABLE users DROP COLUMN IF EXISTS completed_data;



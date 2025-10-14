-- Update application_status_enum to new values
-- - Rename 'screened' -> 'qualified'
-- - Rename 'failed'   -> 'not qualified'
-- - Create type if missing with the full desired set

DO $$
BEGIN
  -- Create the enum if it does not exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'application_status_enum'
  ) THEN
    CREATE TYPE application_status_enum AS ENUM (
      'submitted',
      'qualified',
      'for verification',
      'verified',
      'initial interview',
      'final interview',
      'not qualified',
      'passed',
      'rejected',
      'withdrawn',
      'hired'
    );
    RETURN;
  END IF;

  -- Safely rename old enum values if they exist
  BEGIN
    ALTER TYPE application_status_enum RENAME VALUE 'screened' TO 'qualified';
  EXCEPTION WHEN undefined_object THEN
    -- Old value not present, nothing to do
    NULL;
  END;

  BEGIN
    ALTER TYPE application_status_enum RENAME VALUE 'failed' TO 'not qualified';
  EXCEPTION WHEN undefined_object THEN
    NULL;
  END;

  -- Ensure all desired values exist (idempotent)
  -- Note: IF NOT EXISTS is supported for ADD VALUE in modern Postgres
  BEGIN
    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS 'submitted';
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS 'qualified';
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS 'for verification';
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS 'verified';
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS 'initial interview';
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS 'final interview';
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS 'not qualified';
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS 'passed';
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS 'rejected';
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS 'withdrawn';
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    ALTER TYPE application_status_enum ADD VALUE IF NOT EXISTS 'hired';
  EXCEPTION WHEN duplicate_object THEN NULL; END;
END
$$;



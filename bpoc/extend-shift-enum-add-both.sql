-- Add 'both' choice to shift_enum, update UI code separately

BEGIN;

-- Add the new enum value if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'shift_enum' AND e.enumlabel = 'both'
  ) THEN
    ALTER TYPE public."shift_enum" ADD VALUE 'both';
  END IF;
END$$;

COMMIT;



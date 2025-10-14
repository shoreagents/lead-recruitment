-- Normalize current_mood values and restrict to: Happy, Satisfied, Sad, Undecided

BEGIN;

-- If a previous constraint exists, drop it first (name may differ in your DB)
ALTER TABLE public.user_work_status DROP CONSTRAINT IF EXISTS user_work_status_current_mood_check;

-- Normalize common existing variants
UPDATE public.user_work_status
SET current_mood = 'Happy'
WHERE LOWER(current_mood) IN ('happy','excited');

UPDATE public.user_work_status
SET current_mood = 'Satisfied'
WHERE LOWER(current_mood) IN ('satisfied','content','okay');

UPDATE public.user_work_status
SET current_mood = 'Sad'
WHERE LOWER(current_mood) IN ('sad','frustrated','stressed','unhappy');

UPDATE public.user_work_status
SET current_mood = 'Undecided'
WHERE LOWER(current_mood) IN ('neutral','bored','undecided','unknown');

-- For any other non-null values, coerce to Undecided to satisfy the constraint
UPDATE public.user_work_status
SET current_mood = 'Undecided'
WHERE current_mood IS NOT NULL
  AND LOWER(current_mood) NOT IN ('happy','excited','satisfied','content','okay','sad','frustrated','stressed','unhappy','neutral','bored','undecided','unknown');

-- Add CHECK constraint allowing only the four values (NULLs remain allowed)
ALTER TABLE public.user_work_status
  ADD CONSTRAINT user_work_status_current_mood_check
  CHECK (
    current_mood IN ('Happy','Satisfied','Sad','Undecided') OR current_mood IS NULL
  );

COMMIT;



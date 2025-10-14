-- =====================================================
-- ADD MISSING FIELDS TO DISC PERSONALITY STATS TABLE
-- =====================================================

-- Add the missing fields for XP, badges, and cultural alignment
ALTER TABLE disc_personality_stats 
ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS badges_earned INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS cultural_alignment_score INTEGER CHECK (cultural_alignment_score IS NULL OR (cultural_alignment_score >= 0 AND cultural_alignment_score <= 100)),
ADD COLUMN IF NOT EXISTS authenticity_score INTEGER CHECK (authenticity_score IS NULL OR (authenticity_score >= 0 AND authenticity_score <= 100)),
ADD COLUMN IF NOT EXISTS latest_session_xp INTEGER DEFAULT 0;

-- Add indexes for the new fields
CREATE INDEX IF NOT EXISTS idx_disc_stats_total_xp ON disc_personality_stats(total_xp);
CREATE INDEX IF NOT EXISTS idx_disc_stats_badges ON disc_personality_stats(badges_earned);
CREATE INDEX IF NOT EXISTS idx_disc_stats_cultural_alignment ON disc_personality_stats(cultural_alignment_score);

-- Add comments to document the new fields
COMMENT ON COLUMN disc_personality_stats.total_xp IS 'Cumulative XP earned across all DISC sessions';
COMMENT ON COLUMN disc_personality_stats.badges_earned IS 'Total number of badges/achievements earned';
COMMENT ON COLUMN disc_personality_stats.cultural_alignment_score IS 'Latest cultural alignment percentage (Filipino workplace fit)';
COMMENT ON COLUMN disc_personality_stats.authenticity_score IS 'Latest authenticity score from DISC assessment';
COMMENT ON COLUMN disc_personality_stats.latest_session_xp IS 'XP earned in the most recent session';

-- Show the updated table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'disc_personality_stats' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

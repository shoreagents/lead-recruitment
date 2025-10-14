-- =====================================================
-- TYPING HERO ALTER TABLE STATEMENTS
-- Add word-level tracking columns to existing tables
-- =====================================================

-- Add word-level tracking columns to typing_hero_sessions table
ALTER TABLE typing_hero_sessions 
ADD COLUMN words_correct JSONB DEFAULT '[]',
ADD COLUMN words_incorrect JSONB DEFAULT '[]';

-- Add indexes for the new JSONB columns
CREATE INDEX idx_typing_hero_sessions_words_correct ON typing_hero_sessions USING GIN (words_correct);
CREATE INDEX idx_typing_hero_sessions_words_incorrect ON typing_hero_sessions USING GIN (words_incorrect);

-- Add word-level aggregated statistics to typing_hero_stats table
ALTER TABLE typing_hero_stats 
ADD COLUMN total_words_correct INTEGER DEFAULT 0,
ADD COLUMN total_words_incorrect INTEGER DEFAULT 0,
ADD COLUMN most_common_correct_words JSONB DEFAULT '[]',
ADD COLUMN most_common_incorrect_words JSONB DEFAULT '[]',
ADD COLUMN average_reaction_time NUMERIC(5,2),
ADD COLUMN vocabulary_strengths JSONB DEFAULT '[]',
ADD COLUMN vocabulary_weaknesses JSONB DEFAULT '[]';

-- Add indexes for the new JSONB columns in stats table
CREATE INDEX idx_typing_hero_stats_vocabulary_strengths ON typing_hero_stats USING GIN (vocabulary_strengths);
CREATE INDEX idx_typing_hero_stats_vocabulary_weaknesses ON typing_hero_stats USING GIN (vocabulary_weaknesses);

-- Add comments for the new columns
COMMENT ON COLUMN typing_hero_sessions.words_correct IS 'Array of correctly typed words with metadata (word, timestamp, reactionTime, difficulty, position) as JSONB.';
COMMENT ON COLUMN typing_hero_sessions.words_incorrect IS 'Array of incorrectly typed words with metadata (word, userInput, timestamp, errorType, difficulty, position) as JSONB.';

COMMENT ON COLUMN typing_hero_stats.total_words_correct IS 'Total number of correctly typed words across all sessions.';
COMMENT ON COLUMN typing_hero_stats.total_words_incorrect IS 'Total number of incorrectly typed words across all sessions.';
COMMENT ON COLUMN typing_hero_stats.most_common_correct_words IS 'Array of most frequently correctly typed words with counts as JSONB.';
COMMENT ON COLUMN typing_hero_stats.most_common_incorrect_words IS 'Array of most frequently incorrectly typed words with counts as JSONB.';
COMMENT ON COLUMN typing_hero_stats.average_reaction_time IS 'Average reaction time across all correct words in milliseconds.';
COMMENT ON COLUMN typing_hero_stats.vocabulary_strengths IS 'Array of vocabulary areas where the user performs well as JSONB.';
COMMENT ON COLUMN typing_hero_stats.vocabulary_weaknesses IS 'Array of vocabulary areas where the user needs improvement as JSONB.';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if columns were added successfully
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'typing_hero_sessions' 
AND column_name IN ('words_correct', 'words_incorrect');

SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'typing_hero_stats' 
AND column_name IN ('total_words_correct', 'total_words_incorrect', 'most_common_correct_words', 'most_common_incorrect_words', 'average_reaction_time', 'vocabulary_strengths', 'vocabulary_weaknesses');

-- Check indexes were created
SELECT indexname, tablename, indexdef 
FROM pg_indexes 
WHERE tablename IN ('typing_hero_sessions', 'typing_hero_stats')
AND indexname LIKE '%words%' OR indexname LIKE '%vocabulary%';

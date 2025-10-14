-- =====================================================
-- TYPING HERO SESSIONS TABLE - UPDATED WITH WORD-LEVEL TRACKING
-- Stores individual session data with detailed word tracking
-- =====================================================
CREATE TABLE typing_hero_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Core Performance Metrics
    score INTEGER NOT NULL DEFAULT 0,
    wpm INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    correct_words INTEGER NOT NULL DEFAULT 0,
    wrong_words INTEGER NOT NULL DEFAULT 0,
    elapsed_time INTEGER NOT NULL DEFAULT 0, -- in seconds
    overall_accuracy NUMERIC(5,2) NOT NULL DEFAULT 0.00, -- percentage
    
    -- AI Analysis for this specific session
    ai_analysis JSONB DEFAULT '{}',
    
    -- NEW: Word-level tracking for detailed analysis
    words_correct JSONB DEFAULT '[]', -- Array of correct word objects
    words_incorrect JSONB DEFAULT '[]', -- Array of incorrect word objects
    
    -- Metadata
    difficulty_level TEXT DEFAULT 'rockstar',
    session_status TEXT DEFAULT 'completed' CHECK (session_status IN ('completed', 'failed', 'abandoned'))
);

-- Indexes for typing_hero_sessions
CREATE INDEX idx_typing_hero_sessions_user_id ON typing_hero_sessions(user_id);
CREATE INDEX idx_typing_hero_sessions_created_at ON typing_hero_sessions(created_at);
CREATE INDEX idx_typing_hero_sessions_wpm ON typing_hero_sessions(wpm);
CREATE INDEX idx_typing_hero_sessions_accuracy ON typing_hero_sessions(overall_accuracy);
CREATE INDEX idx_typing_hero_sessions_ai_analysis ON typing_hero_sessions USING GIN (ai_analysis);
CREATE INDEX idx_typing_hero_sessions_words_correct ON typing_hero_sessions USING GIN (words_correct);
CREATE INDEX idx_typing_hero_sessions_words_incorrect ON typing_hero_sessions USING GIN (words_incorrect);

-- Comments for typing_hero_sessions
COMMENT ON TABLE typing_hero_sessions IS 'Individual Typing Hero game sessions with detailed metrics, AI analysis, and word-level tracking.';
COMMENT ON COLUMN typing_hero_sessions.user_id IS 'Foreign key to the users table.';
COMMENT ON COLUMN typing_hero_sessions.created_at IS 'Timestamp when the session was recorded.';
COMMENT ON COLUMN typing_hero_sessions.score IS 'Total score achieved in the session.';
COMMENT ON COLUMN typing_hero_sessions.wpm IS 'Words per minute achieved in the session.';
COMMENT ON COLUMN typing_hero_sessions.longest_streak IS 'Longest consecutive correct words streak in the session.';
COMMENT ON COLUMN typing_hero_sessions.correct_words IS 'Number of correctly typed words in the session.';
COMMENT ON COLUMN typing_hero_sessions.wrong_words IS 'Number of incorrectly typed words in the session.';
COMMENT ON COLUMN typing_hero_sessions.elapsed_time IS 'Duration of the session in seconds.';
COMMENT ON COLUMN typing_hero_sessions.overall_accuracy IS 'Overall accuracy percentage (0-100) for the session.';
COMMENT ON COLUMN typing_hero_sessions.ai_analysis IS 'Comprehensive AI assessment and analysis for this specific session as JSONB.';
COMMENT ON COLUMN typing_hero_sessions.words_correct IS 'Array of correctly typed words with metadata (word, timestamp, reactionTime, difficulty, position) as JSONB.';
COMMENT ON COLUMN typing_hero_sessions.words_incorrect IS 'Array of incorrectly typed words with metadata (word, userInput, timestamp, errorType, difficulty, position) as JSONB.';
COMMENT ON COLUMN typing_hero_sessions.difficulty_level IS 'Difficulty level played (e.g., rookie, rockstar, virtuoso, legend).';
COMMENT ON COLUMN typing_hero_sessions.session_status IS 'Status of the session (completed, failed, abandoned).';

-- =====================================================
-- TYPING HERO STATS TABLE - UPDATED WITH WORD-LEVEL AGGREGATION
-- Stores aggregated user statistics for Typing Hero
-- =====================================================
CREATE TABLE typing_hero_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id), -- Ensures one stats record per user
    
    -- Aggregated session counts
    total_sessions INTEGER DEFAULT 0 NOT NULL,
    completed_sessions INTEGER DEFAULT 0 NOT NULL,
    last_played_at TIMESTAMPTZ,
    
    -- Best performance metrics across all sessions
    best_score INTEGER,
    best_wpm INTEGER,
    best_accuracy NUMERIC(5,2),
    best_streak INTEGER,
    
    -- Latest session data for quick display
    latest_score INTEGER,
    latest_wpm INTEGER,
    latest_accuracy NUMERIC(5,2),
    latest_difficulty TEXT,
    
    -- Averages
    avg_wpm NUMERIC(5,2),
    avg_accuracy NUMERIC(5,2),
    total_play_time INTEGER, -- Total elapsed time across all sessions
    
    -- Latest AI analysis summary (or a subset)
    ai_analysis JSONB,
    
    -- NEW: Word-level aggregated statistics
    total_words_correct INTEGER DEFAULT 0,
    total_words_incorrect INTEGER DEFAULT 0,
    most_common_correct_words JSONB DEFAULT '[]', -- Array of {word, count} objects
    most_common_incorrect_words JSONB DEFAULT '[]', -- Array of {word, count} objects
    average_reaction_time NUMERIC(5,2), -- Average reaction time in milliseconds
    vocabulary_strengths JSONB DEFAULT '[]', -- Array of strong vocabulary areas
    vocabulary_weaknesses JSONB DEFAULT '[]', -- Array of weak vocabulary areas
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for typing_hero_stats
CREATE INDEX idx_typing_hero_stats_user_id ON typing_hero_stats(user_id);
CREATE INDEX idx_typing_hero_stats_best_wpm ON typing_hero_stats(best_wpm);
CREATE INDEX idx_typing_hero_stats_best_accuracy ON typing_hero_stats(best_accuracy);
CREATE INDEX idx_typing_hero_stats_ai_analysis ON typing_hero_stats USING GIN (ai_analysis);
CREATE INDEX idx_typing_hero_stats_vocabulary_strengths ON typing_hero_stats USING GIN (vocabulary_strengths);
CREATE INDEX idx_typing_hero_stats_vocabulary_weaknesses ON typing_hero_stats USING GIN (vocabulary_weaknesses);

-- Comments for typing_hero_stats
COMMENT ON TABLE typing_hero_stats IS 'Aggregated statistics for each user''s Typing Hero performance with word-level analysis.';
COMMENT ON COLUMN typing_hero_stats.user_id IS 'Foreign key to the users table, unique for each user.';
COMMENT ON COLUMN typing_hero_stats.total_sessions IS 'Total number of Typing Hero sessions played by the user.';
COMMENT ON COLUMN typing_hero_stats.completed_sessions IS 'Number of completed Typing Hero sessions by the user.';
COMMENT ON COLUMN typing_hero_stats.last_played_at IS 'Timestamp of the user''s most recent Typing Hero session.';
COMMENT ON COLUMN typing_hero_stats.best_score IS 'Highest score achieved by the user.';
COMMENT ON COLUMN typing_hero_stats.best_wpm IS 'Highest WPM achieved by the user.';
COMMENT ON COLUMN typing_hero_stats.best_accuracy IS 'Highest accuracy percentage achieved by the user.';
COMMENT ON COLUMN typing_hero_stats.best_streak IS 'Longest streak achieved by the user.';
COMMENT ON COLUMN typing_hero_stats.latest_score IS 'Score from the user''s most recent session.';
COMMENT ON COLUMN typing_hero_stats.latest_wpm IS 'WPM from the user''s most recent session.';
COMMENT ON COLUMN typing_hero_stats.latest_accuracy IS 'Accuracy from the user''s most recent session.';
COMMENT ON COLUMN typing_hero_stats.latest_difficulty IS 'Difficulty level of the user''s most recent session.';
COMMENT ON COLUMN typing_hero_stats.avg_wpm IS 'Average WPM across all completed sessions.';
COMMENT ON COLUMN typing_hero_stats.avg_accuracy IS 'Average accuracy across all completed sessions.';
COMMENT ON COLUMN typing_hero_stats.total_play_time IS 'Total time spent playing Typing Hero in seconds.';
COMMENT ON COLUMN typing_hero_stats.ai_analysis IS 'Summary or latest AI assessment from the most recent session as JSONB.';
COMMENT ON COLUMN typing_hero_stats.total_words_correct IS 'Total number of correctly typed words across all sessions.';
COMMENT ON COLUMN typing_hero_stats.total_words_incorrect IS 'Total number of incorrectly typed words across all sessions.';
COMMENT ON COLUMN typing_hero_stats.most_common_correct_words IS 'Array of most frequently correctly typed words with counts as JSONB.';
COMMENT ON COLUMN typing_hero_stats.most_common_incorrect_words IS 'Array of most frequently incorrectly typed words with counts as JSONB.';
COMMENT ON COLUMN typing_hero_stats.average_reaction_time IS 'Average reaction time across all correct words in milliseconds.';
COMMENT ON COLUMN typing_hero_stats.vocabulary_strengths IS 'Array of vocabulary areas where the user performs well as JSONB.';
COMMENT ON COLUMN typing_hero_stats.vocabulary_weaknesses IS 'Array of vocabulary areas where the user needs improvement as JSONB.';
COMMENT ON COLUMN typing_hero_stats.created_at IS 'Timestamp when the stats record was first created.';
COMMENT ON COLUMN typing_hero_stats.updated_at IS 'Timestamp when the stats record was last updated.';

-- =====================================================
-- SAMPLE QUERIES FOR WORD-LEVEL ANALYSIS
-- =====================================================

-- Query 1: Get word-level performance for a specific user
-- SELECT 
--     user_id,
--     words_correct,
--     words_incorrect,
--     ai_analysis->'errorAnalysis'->'vocabularyPerformance' as vocabulary_performance
-- FROM typing_hero_sessions 
-- WHERE user_id = 'user-uuid-here'
-- ORDER BY created_at DESC 
-- LIMIT 5;

-- Query 2: Analyze vocabulary strengths and weaknesses
-- SELECT 
--     user_id,
--     most_common_correct_words,
--     most_common_incorrect_words,
--     vocabulary_strengths,
--     vocabulary_weaknesses,
--     average_reaction_time
-- FROM typing_hero_stats 
-- WHERE user_id = 'user-uuid-here';

-- Query 3: Find users with specific vocabulary issues
-- SELECT 
--     user_id,
--     most_common_incorrect_words,
--     vocabulary_weaknesses
-- FROM typing_hero_stats 
-- WHERE vocabulary_weaknesses ? 'technical_terms' 
--    OR vocabulary_weaknesses ? 'bpoc_terminology';

-- Query 4: Get detailed word analysis for AI improvement
-- SELECT 
--     s.user_id,
--     s.words_correct,
--     s.words_incorrect,
--     s.ai_analysis->'errorAnalysis'->'vocabularyPerformance' as detailed_vocab_analysis,
--     st.vocabulary_strengths,
--     st.vocabulary_weaknesses
-- FROM typing_hero_sessions s
-- JOIN typing_hero_stats st ON s.user_id = st.user_id
-- WHERE s.user_id = 'user-uuid-here'
-- ORDER BY s.created_at DESC 
-- LIMIT 1;

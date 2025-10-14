-- =====================================================
-- TYPING HERO TWO-TABLE SCHEMA (Following BPOC DISC Pattern)
-- Run this in DBeaver to create the complete table structure
-- =====================================================

-- =====================================================
-- 1. TYPING HERO SESSIONS TABLE (Individual Session Data)
-- =====================================================

CREATE TABLE typing_hero_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Core Performance Metrics (exactly as requested)
    score INTEGER NOT NULL DEFAULT 0,
    wpm INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    correct_words INTEGER NOT NULL DEFAULT 0,
    wrong_words INTEGER NOT NULL DEFAULT 0,
    elapsed_time INTEGER NOT NULL DEFAULT 0, -- in seconds
    overall_accuracy NUMERIC(5,2) NOT NULL DEFAULT 0.00, -- percentage
    
    -- AI Analysis as single JSONB field
    ai_analysis JSONB DEFAULT '{}',
    
    -- Optional metadata
    difficulty_level TEXT DEFAULT 'rockstar',
    session_status TEXT DEFAULT 'completed' CHECK (session_status IN ('completed', 'failed', 'abandoned')),
    
    -- Timestamps
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. TYPING HERO STATS TABLE (User Aggregated Data)
-- =====================================================

CREATE TABLE typing_hero_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id), -- One record per user
    
    -- Session counts
    total_sessions INTEGER DEFAULT 0,
    completed_sessions INTEGER DEFAULT 0,
    last_played_at TIMESTAMPTZ,
    
    -- Best performance metrics
    best_score INTEGER,
    best_wpm INTEGER,
    best_accuracy NUMERIC(5,2),
    best_streak INTEGER,
    
    -- Latest session data
    latest_score INTEGER,
    latest_wpm INTEGER,
    latest_accuracy NUMERIC(5,2),
    latest_difficulty TEXT,
    
    -- Aggregated metrics
    avg_wpm NUMERIC(5,2),
    avg_accuracy NUMERIC(5,2),
    total_play_time INTEGER, -- total seconds played
    
    -- AI analysis summary (latest assessment)
    ai_analysis JSONB,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. PERFORMANCE INDEXES
-- =====================================================

-- Sessions table indexes
CREATE INDEX idx_typing_hero_sessions_user_id ON typing_hero_sessions(user_id);
CREATE INDEX idx_typing_hero_sessions_created_at ON typing_hero_sessions(created_at);
CREATE INDEX idx_typing_hero_sessions_score ON typing_hero_sessions(score);
CREATE INDEX idx_typing_hero_sessions_wpm ON typing_hero_sessions(wpm);
CREATE INDEX idx_typing_hero_sessions_accuracy ON typing_hero_sessions(overall_accuracy);
CREATE INDEX idx_typing_hero_sessions_difficulty ON typing_hero_sessions(difficulty_level);

-- JSONB indexes for AI analysis queries
CREATE INDEX idx_typing_hero_sessions_ai_analysis ON typing_hero_sessions USING GIN (ai_analysis);
CREATE INDEX idx_typing_hero_sessions_performance_level ON typing_hero_sessions ((ai_analysis->>'performanceLevel'));

-- Stats table indexes
CREATE INDEX idx_typing_hero_stats_user_id ON typing_hero_stats(user_id);
CREATE INDEX idx_typing_hero_stats_best_wpm ON typing_hero_stats(best_wpm);
CREATE INDEX idx_typing_hero_stats_best_score ON typing_hero_stats(best_score);
CREATE INDEX idx_typing_hero_stats_last_played ON typing_hero_stats(last_played_at);

-- JSONB index for AI analysis in stats
CREATE INDEX idx_typing_hero_stats_ai_analysis ON typing_hero_stats USING GIN (ai_analysis);

-- =====================================================
-- 4. TABLE TRIGGERS (Auto-update timestamps)
-- =====================================================

-- Trigger for sessions table
CREATE OR REPLACE FUNCTION update_typing_hero_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_typing_hero_sessions_updated_at
    BEFORE UPDATE ON typing_hero_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_typing_hero_sessions_updated_at();

-- Trigger for stats table
CREATE OR REPLACE FUNCTION update_typing_hero_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_typing_hero_stats_updated_at
    BEFORE UPDATE ON typing_hero_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_typing_hero_stats_updated_at();

-- =====================================================
-- 5. TABLE DOCUMENTATION
-- =====================================================

COMMENT ON TABLE typing_hero_sessions IS 'Individual Typing Hero session records with core metrics and AI analysis';
COMMENT ON TABLE typing_hero_stats IS 'Aggregated Typing Hero statistics per user for fast lookups';

-- Sessions table column comments
COMMENT ON COLUMN typing_hero_sessions.score IS 'Total score achieved in the session';
COMMENT ON COLUMN typing_hero_sessions.wpm IS 'Words per minute achieved';
COMMENT ON COLUMN typing_hero_sessions.longest_streak IS 'Longest consecutive correct words streak';
COMMENT ON COLUMN typing_hero_sessions.correct_words IS 'Number of correctly typed words';
COMMENT ON COLUMN typing_hero_sessions.wrong_words IS 'Number of incorrectly typed words';
COMMENT ON COLUMN typing_hero_sessions.elapsed_time IS 'Session duration in seconds';
COMMENT ON COLUMN typing_hero_sessions.overall_accuracy IS 'Overall accuracy percentage (0-100)';
COMMENT ON COLUMN typing_hero_sessions.ai_analysis IS 'Complete AI assessment and analysis as JSONB';
COMMENT ON COLUMN typing_hero_sessions.difficulty_level IS 'Difficulty level played (rookie, rockstar, virtuoso, legend)';
COMMENT ON COLUMN typing_hero_sessions.session_status IS 'Session completion status';

-- Stats table column comments
COMMENT ON COLUMN typing_hero_stats.total_sessions IS 'Total number of sessions played';
COMMENT ON COLUMN typing_hero_stats.completed_sessions IS 'Number of completed sessions';
COMMENT ON COLUMN typing_hero_stats.best_score IS 'Highest score achieved across all sessions';
COMMENT ON COLUMN typing_hero_stats.best_wpm IS 'Highest WPM achieved across all sessions';
COMMENT ON COLUMN typing_hero_stats.best_accuracy IS 'Highest accuracy achieved across all sessions';
COMMENT ON COLUMN typing_hero_stats.best_streak IS 'Longest streak achieved across all sessions';
COMMENT ON COLUMN typing_hero_stats.latest_score IS 'Score from most recent session';
COMMENT ON COLUMN typing_hero_stats.latest_wpm IS 'WPM from most recent session';
COMMENT ON COLUMN typing_hero_stats.latest_accuracy IS 'Accuracy from most recent session';
COMMENT ON COLUMN typing_hero_stats.latest_difficulty IS 'Difficulty level from most recent session';
COMMENT ON COLUMN typing_hero_stats.avg_wpm IS 'Average WPM across all sessions';
COMMENT ON COLUMN typing_hero_stats.avg_accuracy IS 'Average accuracy across all sessions';
COMMENT ON COLUMN typing_hero_stats.total_play_time IS 'Total time played in seconds';
COMMENT ON COLUMN typing_hero_stats.ai_analysis IS 'Latest AI assessment and analysis';

-- =====================================================
-- 6. VERIFICATION QUERIES
-- Run these after creating the tables to verify everything works
-- =====================================================

-- Check that both tables were created successfully
SELECT 
    table_name, 
    table_type 
FROM information_schema.tables 
WHERE table_name IN ('typing_hero_sessions', 'typing_hero_stats')
ORDER BY table_name;

-- Check sessions table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'typing_hero_sessions' 
ORDER BY ordinal_position;

-- Check stats table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'typing_hero_stats' 
ORDER BY ordinal_position;

-- Check indexes were created
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename IN ('typing_hero_sessions', 'typing_hero_stats')
ORDER BY tablename, indexname;

-- Check triggers were created
SELECT 
    trigger_name, 
    event_manipulation, 
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table IN ('typing_hero_sessions', 'typing_hero_stats')
ORDER BY event_object_table, trigger_name;

-- =====================================================
-- 7. EXAMPLE USAGE QUERIES
-- =====================================================

-- Get user's latest stats (fast lookup)
-- SELECT * FROM typing_hero_stats WHERE user_id = 'user-id-here';

-- Get user's session history
-- SELECT * FROM typing_hero_sessions WHERE user_id = 'user-id-here' ORDER BY created_at DESC;

-- Get leaderboard (fast with stats table)
-- SELECT user_id, best_wpm, best_score FROM typing_hero_stats ORDER BY best_wpm DESC LIMIT 10;

-- Get AI analysis from latest session
-- SELECT ai_analysis FROM typing_hero_stats WHERE user_id = 'user-id-here';

-- Get performance trends
-- SELECT DATE(created_at) as date, AVG(wpm) as avg_wpm, AVG(overall_accuracy) as avg_accuracy
-- FROM typing_hero_sessions 
-- WHERE user_id = 'user-id-here' 
-- GROUP BY DATE(created_at) 
-- ORDER BY date DESC;

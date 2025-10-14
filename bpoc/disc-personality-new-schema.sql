-- =====================================================
-- NEW DISC PERSONALITY SCHEMA (Following Typing Hero Pattern)
-- Drop old tables and create new structure similar to typing_hero
-- =====================================================

-- =====================================================
-- DROP OLD DISC PERSONALITY TABLES
-- =====================================================

-- Drop old tables and their indexes
DROP TABLE IF EXISTS disc_personality_stats CASCADE;
DROP TABLE IF EXISTS disc_personality_sessions CASCADE;

-- Drop any related indexes that might remain
DROP INDEX IF EXISTS idx_disc_personality_sessions_user;
DROP INDEX IF EXISTS idx_disc_personality_sessions_started;
DROP INDEX IF EXISTS idx_disc_personality_stats_user;
DROP INDEX IF EXISTS idx_disc_sessions_started;
DROP INDEX IF EXISTS idx_disc_sessions_user;
DROP INDEX IF EXISTS idx_disc_stats_ai_interpretation;
DROP INDEX IF EXISTS idx_disc_stats_user;

-- =====================================================
-- 1. DISC PERSONALITY SESSIONS TABLE (Individual Session Data)
-- =====================================================

CREATE TABLE disc_personality_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Session Metadata
    started_at TIMESTAMPTZ NOT NULL,
    finished_at TIMESTAMPTZ,
    duration_seconds INTEGER, -- Total time to complete assessment
    total_questions INTEGER NOT NULL DEFAULT 35, -- 30 core + 5 personalized
    
    -- Core DISC Scores (0-100 percentages)
    d_score INTEGER NOT NULL DEFAULT 0 CHECK (d_score >= 0 AND d_score <= 100),
    i_score INTEGER NOT NULL DEFAULT 0 CHECK (i_score >= 0 AND i_score <= 100),
    s_score INTEGER NOT NULL DEFAULT 0 CHECK (s_score >= 0 AND s_score <= 100),
    c_score INTEGER NOT NULL DEFAULT 0 CHECK (c_score >= 0 AND c_score <= 100),
    
    -- Primary and Secondary Types
    primary_type TEXT NOT NULL CHECK (primary_type IN ('D', 'I', 'S', 'C')),
    secondary_type TEXT CHECK (secondary_type IN ('D', 'I', 'S', 'C')),
    
    -- Assessment Quality Metrics
    confidence_score INTEGER DEFAULT 0 CHECK (confidence_score >= 0 AND confidence_score <= 100),
    cultural_alignment INTEGER DEFAULT 95 CHECK (cultural_alignment >= 0 AND cultural_alignment <= 100),
    consistency_index NUMERIC(5,2), -- Response consistency metric
    
    -- AI-Generated Content (stored as JSONB)
    ai_assessment JSONB DEFAULT '{}', -- Full AI personality assessment
    ai_bpo_roles JSONB DEFAULT '[]', -- AI-recommended BPO roles array
    
    -- Response Data (detailed session tracking)
    core_responses JSONB DEFAULT '[]', -- First 30 Filipino scenario responses
    personalized_responses JSONB DEFAULT '[]', -- AI-generated follow-up responses
    response_patterns JSONB DEFAULT '{}', -- Response time analysis, patterns
    
    -- User Context (captured at time of assessment)
    user_position TEXT, -- User's job position when taking assessment
    user_location TEXT, -- User's location when taking assessment
    user_experience TEXT, -- User's bio/experience when taking assessment
    
    -- Session Status
    session_status TEXT DEFAULT 'completed' CHECK (session_status IN ('completed', 'abandoned', 'in_progress')),
    
    -- Timestamps
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. DISC PERSONALITY STATS TABLE (User Aggregated Data)
-- =====================================================

CREATE TABLE disc_personality_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Session Tracking
    total_sessions INTEGER NOT NULL DEFAULT 0,
    completed_sessions INTEGER NOT NULL DEFAULT 0,
    last_taken_at TIMESTAMPTZ,
    
    -- Latest/Best DISC Results (from most recent completed session)
    latest_d_score INTEGER CHECK (latest_d_score IS NULL OR (latest_d_score >= 0 AND latest_d_score <= 100)),
    latest_i_score INTEGER CHECK (latest_i_score IS NULL OR (latest_i_score >= 0 AND latest_i_score <= 100)),
    latest_s_score INTEGER CHECK (latest_s_score IS NULL OR (latest_s_score >= 0 AND latest_s_score <= 100)),
    latest_c_score INTEGER CHECK (latest_c_score IS NULL OR (latest_c_score >= 0 AND latest_c_score <= 100)),
    
    -- Latest Primary/Secondary Types
    latest_primary_type TEXT CHECK (latest_primary_type IS NULL OR latest_primary_type IN ('D', 'I', 'S', 'C')),
    latest_secondary_type TEXT CHECK (latest_secondary_type IS NULL OR latest_secondary_type IN ('D', 'I', 'S', 'C')),
    
    -- Assessment Quality
    best_confidence_score INTEGER CHECK (best_confidence_score IS NULL OR (best_confidence_score >= 0 AND best_confidence_score <= 100)),
    average_completion_time INTEGER, -- Average seconds to complete
    consistency_trend NUMERIC(5,2), -- How consistent results are across sessions
    
    -- Latest AI Content
    latest_ai_assessment TEXT, -- Most recent AI assessment text
    latest_bpo_roles JSONB DEFAULT '[]', -- Most recent AI BPO role recommendations
    
    -- Performance Percentile (compared to other users)
    percentile NUMERIC(5,2) CHECK (percentile IS NULL OR (percentile >= 0 AND percentile <= 100)),
    
    -- Unique constraint to ensure one row per user
    UNIQUE(user_id)
);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Sessions table indexes
CREATE INDEX idx_disc_sessions_user_id ON disc_personality_sessions(user_id);
CREATE INDEX idx_disc_sessions_created_at ON disc_personality_sessions(created_at);
CREATE INDEX idx_disc_sessions_primary_type ON disc_personality_sessions(primary_type);
CREATE INDEX idx_disc_sessions_confidence ON disc_personality_sessions(confidence_score);
CREATE INDEX idx_disc_sessions_status ON disc_personality_sessions(session_status);

-- JSONB indexes for AI content queries
CREATE INDEX idx_disc_sessions_ai_assessment ON disc_personality_sessions USING GIN (ai_assessment);
CREATE INDEX idx_disc_sessions_ai_bpo_roles ON disc_personality_sessions USING GIN (ai_bpo_roles);
CREATE INDEX idx_disc_sessions_core_responses ON disc_personality_sessions USING GIN (core_responses);
CREATE INDEX idx_disc_sessions_response_patterns ON disc_personality_sessions USING GIN (response_patterns);

-- Stats table indexes
CREATE INDEX idx_disc_stats_user_id ON disc_personality_stats(user_id);
CREATE INDEX idx_disc_stats_last_taken ON disc_personality_stats(last_taken_at);
CREATE INDEX idx_disc_stats_primary_type ON disc_personality_stats(latest_primary_type);
CREATE INDEX idx_disc_stats_confidence ON disc_personality_stats(best_confidence_score);
CREATE INDEX idx_disc_stats_percentile ON disc_personality_stats(percentile);

-- JSONB index for BPO roles in stats
CREATE INDEX idx_disc_stats_bpo_roles ON disc_personality_stats USING GIN (latest_bpo_roles);

-- =====================================================
-- CREATE TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- =====================================================

-- Trigger for sessions table
CREATE OR REPLACE FUNCTION update_disc_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_disc_sessions_updated_at
    BEFORE UPDATE ON disc_personality_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_disc_sessions_updated_at();

-- Trigger for stats table
CREATE OR REPLACE FUNCTION update_disc_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_disc_stats_updated_at
    BEFORE UPDATE ON disc_personality_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_disc_stats_updated_at();

-- =====================================================
-- ADD TABLE COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE disc_personality_sessions IS 'Individual DISC personality assessment sessions with detailed response tracking and AI analysis';
COMMENT ON TABLE disc_personality_stats IS 'Aggregated DISC personality statistics per user for quick lookups and leaderboards';

COMMENT ON COLUMN disc_personality_sessions.ai_assessment IS 'Full AI-generated personality assessment text';
COMMENT ON COLUMN disc_personality_sessions.ai_bpo_roles IS 'AI-recommended BPO roles based on personality and user background';
COMMENT ON COLUMN disc_personality_sessions.core_responses IS 'Detailed responses to the 30 Filipino scenario questions';
COMMENT ON COLUMN disc_personality_sessions.personalized_responses IS 'Responses to AI-generated personalized follow-up questions';
COMMENT ON COLUMN disc_personality_sessions.response_patterns IS 'Analysis of response times, consistency, and decision patterns';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify tables were created successfully
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE tablename IN ('disc_personality_sessions', 'disc_personality_stats')
ORDER BY tablename;

-- Verify indexes were created
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('disc_personality_sessions', 'disc_personality_stats')
ORDER BY tablename, indexname;

-- Show table structures
\d disc_personality_sessions;
\d disc_personality_stats;

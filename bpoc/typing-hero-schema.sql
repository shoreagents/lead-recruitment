-- Typing Hero Database Schema
-- Simplified 2-table design for storing all session results

-- Main Session Table
CREATE TABLE typing_hero_sessions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(50) UNIQUE NOT NULL,
    
    -- Session Metadata
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    finished_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_seconds INTEGER NOT NULL,
    difficulty VARCHAR(20) NOT NULL, -- 'rookie', 'rockstar', 'virtuoso', 'legend'
    
    -- Core Performance Metrics
    score INTEGER NOT NULL DEFAULT 0,
    wpm INTEGER NOT NULL DEFAULT 0,
    raw_wpm INTEGER DEFAULT 0,
    burst_wpm INTEGER DEFAULT 0,
    accuracy DECIMAL(5,2) NOT NULL DEFAULT 0.00, -- 67.00%
    accuracy_ratio DECIMAL(5,2) DEFAULT 0.00, -- 10.5:1
    
    -- Word Statistics
    correct_words INTEGER NOT NULL DEFAULT 0,
    wrong_words INTEGER NOT NULL DEFAULT 0,
    missed_words INTEGER DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    
    -- AI Assessment Results
    performance_level VARCHAR(20), -- 'Beginner', 'Developing', 'Intermediate', 'Advanced', 'Expert'
    estimated_real_wpm VARCHAR(20), -- '0-91 WPM'
    ai_analysis TEXT, -- Full AI analysis text
    strengths TEXT[], -- Array of strength points
    tips TEXT[], -- Array of improvement tips
    next_session_goal TEXT, -- Personalized goal
    
    -- Additional Metrics
    peak_speed INTEGER DEFAULT 0,
    average_speed DECIMAL(5,2) DEFAULT 0.00,
    error_rate DECIMAL(5,2) DEFAULT 0.00,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Word Performance Table (for detailed word-level tracking)
CREATE TABLE typing_hero_word_performance (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(50) REFERENCES typing_hero_sessions(session_id),
    
    -- Word Details
    word TEXT NOT NULL,
    word_length INTEGER NOT NULL,
    difficulty_level VARCHAR(20), -- 'easy', 'medium', 'hard'
    
    -- Performance Metrics
    time_to_type_ms INTEGER NOT NULL,
    wpm_for_word DECIMAL(5,2) NOT NULL,
    was_correct BOOLEAN NOT NULL DEFAULT false,
    error_count INTEGER DEFAULT 0,
    
    -- Context
    position_in_session INTEGER NOT NULL,
    streak_at_word INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_typing_hero_sessions_user_id ON typing_hero_sessions(user_id);
CREATE INDEX idx_typing_hero_sessions_started_at ON typing_hero_sessions(started_at);
CREATE INDEX idx_typing_hero_sessions_difficulty ON typing_hero_sessions(difficulty);
CREATE INDEX idx_typing_hero_word_performance_session_id ON typing_hero_word_performance(session_id);
CREATE INDEX idx_typing_hero_word_performance_word ON typing_hero_word_performance(word);

-- Comments
COMMENT ON TABLE typing_hero_sessions IS 'Main table storing complete Typing Hero session results including AI analysis';
COMMENT ON TABLE typing_hero_word_performance IS 'Detailed word-level performance tracking for each session';


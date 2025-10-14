-- =====================================================
-- COMPLETE LEADERBOARD SETUP SCRIPT
-- This script does everything in the correct order
-- =====================================================

-- Step 1: Drop old triggers first
DROP TRIGGER IF EXISTS trigger_update_leaderboard_on_typing_hero ON typing_hero_stats;
DROP TRIGGER IF EXISTS trigger_update_leaderboard_on_disc ON disc_personality_stats;
DROP TRIGGER IF EXISTS trigger_update_leaderboard_on_user ON users;
DROP TRIGGER IF EXISTS trigger_update_leaderboard_on_work_status ON user_work_status;
DROP TRIGGER IF EXISTS trigger_update_leaderboard_on_resume ON ai_analysis_results;
DROP TRIGGER IF EXISTS trigger_update_leaderboard_on_applications ON applications;

-- Step 2: Drop old functions
DROP FUNCTION IF EXISTS trigger_update_leaderboard_score() CASCADE;
DROP FUNCTION IF EXISTS update_user_leaderboard_score(UUID) CASCADE;
DROP FUNCTION IF EXISTS calculate_user_leaderboard_score(UUID) CASCADE;
DROP FUNCTION IF EXISTS recalculate_leaderboard_ranks() CASCADE;
DROP FUNCTION IF EXISTS update_all_leaderboard_scores() CASCADE;

-- Step 3: Drop old leaderboard table if it exists
DROP TABLE IF EXISTS user_leaderboard_scores CASCADE;

-- =====================================================
-- CREATE NEW LEADERBOARD SYSTEM
-- =====================================================

-- Single unified leaderboard scores table
CREATE TABLE public.user_leaderboard_scores (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    
    -- Core Activity Scores (0-100 each)
    typing_hero_score INTEGER DEFAULT 0 NOT NULL CHECK (typing_hero_score >= 0 AND typing_hero_score <= 100),
    disc_personality_score INTEGER DEFAULT 0 NOT NULL CHECK (disc_personality_score >= 0 AND disc_personality_score <= 100),
    profile_completion_score INTEGER DEFAULT 0 NOT NULL CHECK (profile_completion_score >= 0 AND profile_completion_score <= 100),
    resume_building_score INTEGER DEFAULT 0 NOT NULL CHECK (resume_building_score >= 0 AND resume_building_score <= 100),
    application_activity_score INTEGER DEFAULT 0 NOT NULL CHECK (application_activity_score >= 0 AND application_activity_score <= 100),
    
    -- Overall Score (weighted average)
    overall_score INTEGER DEFAULT 0 NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    
    -- Tier/Rank based on overall score
    tier TEXT DEFAULT 'Bronze' NOT NULL CHECK (tier IN ('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond')),
    
    -- Ranking position (1 = top, calculated dynamically)
    rank_position INTEGER DEFAULT 0 NOT NULL,
    
    -- Additional Metrics for Transparency
    metrics JSONB DEFAULT '{}'::jsonb NOT NULL, -- Detailed breakdown of scoring
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_activity_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_user_leaderboard_overall_score ON user_leaderboard_scores(overall_score DESC);
CREATE INDEX idx_user_leaderboard_tier ON user_leaderboard_scores(tier);
CREATE INDEX idx_user_leaderboard_rank ON user_leaderboard_scores(rank_position);
CREATE INDEX idx_user_leaderboard_typing ON user_leaderboard_scores(typing_hero_score DESC);
CREATE INDEX idx_user_leaderboard_disc ON user_leaderboard_scores(disc_personality_score DESC);
CREATE INDEX idx_user_leaderboard_updated ON user_leaderboard_scores(updated_at DESC);
CREATE INDEX idx_user_leaderboard_metrics ON user_leaderboard_scores USING gin(metrics);

COMMENT ON TABLE user_leaderboard_scores IS 'Unified leaderboard scoring system based on typing hero, DISC personality, profile completion, resume building, and job applications';

-- =====================================================
-- SCORING CALCULATION FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_user_leaderboard_score(p_user_id UUID)
RETURNS TABLE(
    typing_score INTEGER,
    disc_score INTEGER,
    profile_score INTEGER,
    resume_score INTEGER,
    application_score INTEGER,
    overall INTEGER,
    tier_name TEXT,
    detailed_metrics JSONB
) AS $$
DECLARE
    v_typing_score INTEGER := 0;
    v_disc_score INTEGER := 0;
    v_profile_score INTEGER := 0;
    v_resume_score INTEGER := 0;
    v_application_score INTEGER := 0;
    v_overall_score INTEGER := 0;
    v_tier TEXT := 'Bronze';
    v_metrics JSONB := '{}'::jsonb;
    
    -- Typing Hero variables
    v_typing_best_wpm INTEGER;
    v_typing_best_accuracy NUMERIC;
    v_typing_avg_wpm NUMERIC;
    v_typing_sessions INTEGER;
    
    -- DISC Personality variables
    v_disc_confidence INTEGER;
    v_disc_completed INTEGER;
    v_disc_primary_type TEXT;
    
    -- Profile completion variables
    v_profile_completed BOOLEAN;
    v_work_status_completed BOOLEAN;
    v_has_avatar BOOLEAN;
    v_has_bio BOOLEAN;
    v_has_location BOOLEAN;
    
    -- Resume variables
    v_resume_overall_score INTEGER;
    v_has_resume BOOLEAN;
    
    -- Application variables
    v_total_applications INTEGER;
    v_active_applications INTEGER;
    v_hired_count INTEGER;
    v_passed_count INTEGER;
BEGIN
    -- =====================================================
    -- 1. TYPING HERO SCORE (0-100)
    -- =====================================================
    -- Scoring: 40% best WPM, 30% accuracy, 20% avg WPM, 10% consistency (sessions)
    SELECT 
        ths.best_wpm,
        ths.best_accuracy,
        ths.avg_wpm,
        ths.completed_sessions
    INTO v_typing_best_wpm, v_typing_best_accuracy, v_typing_avg_wpm, v_typing_sessions
    FROM typing_hero_stats ths
    WHERE ths.user_id = p_user_id;
    
    IF v_typing_best_wpm IS NOT NULL THEN
        -- WPM Score: 0 at 0 WPM, 100 at 100+ WPM
        v_typing_score := LEAST(100, (
            (LEAST(v_typing_best_wpm, 100)::NUMERIC / 100.0 * 40) +  -- 40% weight
            (COALESCE(v_typing_best_accuracy, 0) / 100.0 * 30) +      -- 30% weight
            (LEAST(COALESCE(v_typing_avg_wpm, 0), 100)::NUMERIC / 100.0 * 20) +  -- 20% weight
            (LEAST(v_typing_sessions, 10)::NUMERIC / 10.0 * 10)       -- 10% weight
        ))::INTEGER;
    END IF;
    
    -- =====================================================
    -- 2. DISC PERSONALITY SCORE (0-100)
    -- =====================================================
    -- Scoring: 50% confidence, 30% completion, 20% engagement
    SELECT 
        dps.best_confidence_score,
        dps.completed_sessions,
        dps.latest_primary_type
    INTO v_disc_confidence, v_disc_completed, v_disc_primary_type
    FROM disc_personality_stats dps
    WHERE dps.user_id = p_user_id;
    
    IF v_disc_confidence IS NOT NULL THEN
        v_disc_score := (
            (COALESCE(v_disc_confidence, 0) * 0.5) +                  -- 50% weight
            (LEAST(v_disc_completed, 3)::NUMERIC / 3.0 * 30) +        -- 30% weight (cap at 3 sessions)
            (CASE WHEN v_disc_primary_type IS NOT NULL THEN 20 ELSE 0 END)  -- 20% weight
        )::INTEGER;
    END IF;
    
    -- =====================================================
    -- 3. PROFILE COMPLETION SCORE (0-100)
    -- =====================================================
    -- Scoring: All sections weighted
    SELECT 
        u.completed_data,
        uws.completed_data,
        u.avatar_url IS NOT NULL,
        u.bio IS NOT NULL AND length(u.bio) > 20,
        u.location IS NOT NULL
    INTO v_profile_completed, v_work_status_completed, v_has_avatar, v_has_bio, v_has_location
    FROM users u
    LEFT JOIN user_work_status uws ON u.id = uws.user_id
    WHERE u.id = p_user_id;
    
    v_profile_score := (
        (CASE WHEN v_profile_completed THEN 30 ELSE 0 END) +          -- Personal data: 30%
        (CASE WHEN v_work_status_completed THEN 30 ELSE 0 END) +      -- Work status: 30%
        (CASE WHEN v_has_avatar THEN 15 ELSE 0 END) +                 -- Avatar: 15%
        (CASE WHEN v_has_bio THEN 15 ELSE 0 END) +                    -- Bio: 15%
        (CASE WHEN v_has_location THEN 10 ELSE 0 END)                 -- Location: 10%
    )::INTEGER;
    
    -- =====================================================
    -- 4. RESUME BUILDING SCORE (0-100)
    -- =====================================================
    -- Scoring: Resume quality + having saved resume
    SELECT 
        aar.overall_score,
        EXISTS(SELECT 1 FROM saved_resumes sr WHERE sr.user_id = p_user_id)
    INTO v_resume_overall_score, v_has_resume
    FROM ai_analysis_results aar
    WHERE aar.user_id = p_user_id;
    
    IF v_resume_overall_score IS NOT NULL THEN
        v_resume_score := (
            (v_resume_overall_score * 0.7) +                           -- AI score: 70%
            (CASE WHEN v_has_resume THEN 30 ELSE 0 END)               -- Has saved resume: 30%
        )::INTEGER;
    ELSIF v_has_resume THEN
        v_resume_score := 30; -- At least they have a resume
    END IF;
    
    -- =====================================================
    -- 5. APPLICATION ACTIVITY SCORE (0-100)
    -- =====================================================
    -- Scoring: Based on quantity and quality of applications
    SELECT 
        COUNT(*)::INTEGER,
        COUNT(*) FILTER (WHERE status IN ('submitted', 'qualified', 'for verification', 'verified', 'initial interview', 'final interview'))::INTEGER,
        COUNT(*) FILTER (WHERE status = 'hired')::INTEGER,
        COUNT(*) FILTER (WHERE status = 'passed')::INTEGER
    INTO v_total_applications, v_active_applications, v_hired_count, v_passed_count
    FROM applications
    WHERE user_id = p_user_id;
    
    IF v_total_applications > 0 THEN
        v_application_score := LEAST(100, (
            (LEAST(v_total_applications, 20)::NUMERIC / 20.0 * 40) +  -- Total apps: 40% (cap at 20)
            (LEAST(v_active_applications, 10)::NUMERIC / 10.0 * 30) + -- Active apps: 30% (cap at 10)
            (v_hired_count * 20) +                                     -- Each hire: 20 points
            (v_passed_count * 10)                                      -- Each pass: 10 points
        ))::INTEGER;
    END IF;
    
    -- =====================================================
    -- 6. CALCULATE OVERALL SCORE (Weighted Average)
    -- =====================================================
    -- Weights: Typing 25%, DISC 25%, Profile 15%, Resume 20%, Applications 15%
    v_overall_score := (
        (v_typing_score * 0.25) +
        (v_disc_score * 0.25) +
        (v_profile_score * 0.15) +
        (v_resume_score * 0.20) +
        (v_application_score * 0.15)
    )::INTEGER;
    
    -- =====================================================
    -- 7. DETERMINE TIER
    -- =====================================================
    v_tier := CASE 
        WHEN v_overall_score >= 90 THEN 'Diamond'
        WHEN v_overall_score >= 75 THEN 'Platinum'
        WHEN v_overall_score >= 60 THEN 'Gold'
        WHEN v_overall_score >= 40 THEN 'Silver'
        ELSE 'Bronze'
    END;
    
    -- =====================================================
    -- 8. BUILD DETAILED METRICS JSON
    -- =====================================================
    v_metrics := jsonb_build_object(
        'typing_hero', jsonb_build_object(
            'best_wpm', v_typing_best_wpm,
            'best_accuracy', v_typing_best_accuracy,
            'avg_wpm', v_typing_avg_wpm,
            'sessions', v_typing_sessions,
            'score', v_typing_score
        ),
        'disc_personality', jsonb_build_object(
            'confidence', v_disc_confidence,
            'completed_sessions', v_disc_completed,
            'primary_type', v_disc_primary_type,
            'score', v_disc_score
        ),
        'profile_completion', jsonb_build_object(
            'personal_data', v_profile_completed,
            'work_status', v_work_status_completed,
            'has_avatar', v_has_avatar,
            'has_bio', v_has_bio,
            'has_location', v_has_location,
            'score', v_profile_score
        ),
        'resume_building', jsonb_build_object(
            'ai_score', v_resume_overall_score,
            'has_saved_resume', v_has_resume,
            'score', v_resume_score
        ),
        'applications', jsonb_build_object(
            'total', v_total_applications,
            'active', v_active_applications,
            'hired', v_hired_count,
            'passed', v_passed_count,
            'score', v_application_score
        ),
        'weights', jsonb_build_object(
            'typing_hero', '25%',
            'disc_personality', '25%',
            'profile_completion', '15%',
            'resume_building', '20%',
            'applications', '15%'
        )
    );
    
    -- Return calculated values
    RETURN QUERY SELECT 
        v_typing_score,
        v_disc_score,
        v_profile_score,
        v_resume_score,
        v_application_score,
        v_overall_score,
        v_tier,
        v_metrics;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_user_leaderboard_score IS 'Calculates comprehensive leaderboard score for a user based on typing hero, DISC personality, profile completion, resume building, and applications';

-- =====================================================
-- FUNCTION TO UPDATE USER LEADERBOARD SCORE
-- =====================================================

CREATE OR REPLACE FUNCTION update_user_leaderboard_score(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    v_scores RECORD;
BEGIN
    -- Calculate scores
    SELECT * INTO v_scores FROM calculate_user_leaderboard_score(p_user_id);
    
    -- Upsert into leaderboard table
    INSERT INTO user_leaderboard_scores (
        user_id,
        typing_hero_score,
        disc_personality_score,
        profile_completion_score,
        resume_building_score,
        application_activity_score,
        overall_score,
        tier,
        metrics,
        updated_at,
        last_activity_at
    ) VALUES (
        p_user_id,
        v_scores.typing_score,
        v_scores.disc_score,
        v_scores.profile_score,
        v_scores.resume_score,
        v_scores.application_score,
        v_scores.overall,
        v_scores.tier_name,
        v_scores.detailed_metrics,
        NOW(),
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        typing_hero_score = EXCLUDED.typing_hero_score,
        disc_personality_score = EXCLUDED.disc_personality_score,
        profile_completion_score = EXCLUDED.profile_completion_score,
        resume_building_score = EXCLUDED.resume_building_score,
        application_activity_score = EXCLUDED.application_activity_score,
        overall_score = EXCLUDED.overall_score,
        tier = EXCLUDED.tier,
        metrics = EXCLUDED.metrics,
        updated_at = NOW(),
        last_activity_at = NOW();
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_user_leaderboard_score IS 'Updates leaderboard score for a specific user';

-- =====================================================
-- FUNCTION TO RECALCULATE ALL RANKS
-- =====================================================

CREATE OR REPLACE FUNCTION recalculate_leaderboard_ranks()
RETURNS VOID AS $$
BEGIN
    WITH ranked_users AS (
        SELECT 
            user_id,
            ROW_NUMBER() OVER (ORDER BY overall_score DESC, updated_at ASC) AS new_rank
        FROM user_leaderboard_scores
    )
    UPDATE user_leaderboard_scores uls
    SET rank_position = ru.new_rank
    FROM ranked_users ru
    WHERE uls.user_id = ru.user_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION recalculate_leaderboard_ranks IS 'Recalculates rank positions for all users in the leaderboard';

-- =====================================================
-- FUNCTION TO BULK UPDATE ALL USERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_all_leaderboard_scores()
RETURNS INTEGER AS $$
DECLARE
    v_user_id UUID;
    v_count INTEGER := 0;
BEGIN
    FOR v_user_id IN SELECT id FROM users LOOP
        PERFORM update_user_leaderboard_score(v_user_id);
        v_count := v_count + 1;
    END LOOP;
    
    -- Recalculate ranks after all scores updated
    PERFORM recalculate_leaderboard_ranks();
    
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_all_leaderboard_scores IS 'Updates leaderboard scores for all users and recalculates ranks';

-- =====================================================
-- TRIGGER TO AUTO-UPDATE SCORES
-- =====================================================

-- Trigger function
CREATE OR REPLACE FUNCTION trigger_update_leaderboard_score()
RETURNS TRIGGER AS $$
BEGIN
    -- Update score for the affected user
    PERFORM update_user_leaderboard_score(
        CASE 
            WHEN TG_TABLE_NAME = 'users' THEN NEW.id
            ELSE NEW.user_id
        END
    );
    
    -- Recalculate ranks after score update
    PERFORM recalculate_leaderboard_ranks();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to relevant tables
CREATE TRIGGER trigger_update_leaderboard_on_typing_hero
    AFTER INSERT OR UPDATE ON typing_hero_stats
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_leaderboard_score();

CREATE TRIGGER trigger_update_leaderboard_on_disc
    AFTER INSERT OR UPDATE ON disc_personality_stats
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_leaderboard_score();

CREATE TRIGGER trigger_update_leaderboard_on_user
    AFTER UPDATE OF completed_data, avatar_url, bio, location ON users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_leaderboard_score();

CREATE TRIGGER trigger_update_leaderboard_on_work_status
    AFTER INSERT OR UPDATE OF completed_data ON user_work_status
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_leaderboard_score();

CREATE TRIGGER trigger_update_leaderboard_on_resume
    AFTER INSERT OR UPDATE OF overall_score ON ai_analysis_results
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_leaderboard_score();

CREATE TRIGGER trigger_update_leaderboard_on_applications
    AFTER INSERT OR UPDATE OF status ON applications
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_leaderboard_score();

-- =====================================================
-- VERIFY SETUP
-- =====================================================

SELECT 'New leaderboard system has been created successfully!' AS status;

-- Show table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_leaderboard_scores' 
AND table_schema = 'public'
ORDER BY ordinal_position;

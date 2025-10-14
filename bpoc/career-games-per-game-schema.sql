-- Per-Game Tables for Career Games (per user)
-- Run after base schema so users table and update_updated_at_column() exist

-- Reuse difficulty enum from generic schema if present; otherwise create a local one
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'game_difficulty_enum') THEN
    CREATE TYPE game_difficulty_enum AS ENUM (
      'beginner','easy','intermediate','advanced','expert'
    );
  END IF;
END $$;

-- =============================
-- Typing Hero
-- =============================
CREATE TABLE IF NOT EXISTS typing_hero_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  duration_ms INTEGER CHECK (duration_ms IS NULL OR duration_ms >= 0),
  difficulty game_difficulty_enum,
  level TEXT, -- optional track/difficulty label
  wpm INTEGER CHECK (wpm IS NULL OR wpm >= 0),
  accuracy NUMERIC(5,2) CHECK (accuracy IS NULL OR (accuracy >= 0 AND accuracy <= 100)),
  error_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb, -- { spelling: n, punctuation: n, other: n }
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_typing_hero_sessions_user ON typing_hero_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_typing_hero_sessions_started ON typing_hero_sessions(started_at);

CREATE TABLE IF NOT EXISTS typing_hero_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_sessions INTEGER NOT NULL DEFAULT 0,
  completed_sessions INTEGER NOT NULL DEFAULT 0,
  last_played_at TIMESTAMPTZ,
  best_wpm INTEGER,
  best_accuracy NUMERIC(5,2) CHECK (best_accuracy IS NULL OR (best_accuracy >= 0 AND best_accuracy <= 100)),
  median_wpm NUMERIC(6,2),
  highest_difficulty game_difficulty_enum,
  recent_wpm INTEGER,
  consistency_index NUMERIC(5,2), -- variation metric across runs
  percentile NUMERIC(5,2) CHECK (percentile IS NULL OR (percentile >= 0 AND percentile <= 100)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_typing_hero_stats_user ON typing_hero_stats(user_id);

-- =============================
-- Inbox Zero
-- =============================
CREATE TABLE IF NOT EXISTS inbox_zero_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  duration_ms INTEGER CHECK (duration_ms IS NULL OR duration_ms >= 0),
  difficulty game_difficulty_enum,
  triage_score INTEGER CHECK (triage_score IS NULL OR (triage_score >= 0 AND triage_score <= 100)),
  correct_priority_pct NUMERIC(5,2) CHECK (correct_priority_pct IS NULL OR (correct_priority_pct >= 0 AND correct_priority_pct <= 100)),
  sla_adherence_pct NUMERIC(5,2) CHECK (sla_adherence_pct IS NULL OR (sla_adherence_pct >= 0 AND sla_adherence_pct <= 100)),
  avg_decision_ms INTEGER CHECK (avg_decision_ms IS NULL OR avg_decision_ms >= 0),
  false_positives INTEGER CHECK (false_positives IS NULL OR false_positives >= 0),
  false_negatives INTEGER CHECK (false_negatives IS NULL OR false_negatives >= 0),
  decisions JSONB NOT NULL DEFAULT '[]'::jsonb, -- optional per-email details
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inbox_zero_sessions_user ON inbox_zero_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_inbox_zero_sessions_started ON inbox_zero_sessions(started_at);

CREATE TABLE IF NOT EXISTS inbox_zero_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_sessions INTEGER NOT NULL DEFAULT 0,
  completed_sessions INTEGER NOT NULL DEFAULT 0,
  last_played_at TIMESTAMPTZ,
  best_triage_score INTEGER,
  correct_priority_pct NUMERIC(5,2) CHECK (correct_priority_pct IS NULL OR (correct_priority_pct >= 0 AND correct_priority_pct <= 100)),
  sla_adherence_pct NUMERIC(5,2) CHECK (sla_adherence_pct IS NULL OR (sla_adherence_pct >= 0 AND sla_adherence_pct <= 100)),
  avg_decision_ms INTEGER,
  percentile NUMERIC(5,2) CHECK (percentile IS NULL OR (percentile >= 0 AND percentile <= 100)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_inbox_zero_stats_user ON inbox_zero_stats(user_id);

-- =============================
-- Logic Grid
-- =============================
CREATE TABLE IF NOT EXISTS logic_grid_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  duration_ms INTEGER CHECK (duration_ms IS NULL OR duration_ms >= 0),
  difficulty game_difficulty_enum,
  puzzle_id TEXT,
  solved BOOLEAN,
  time_ms INTEGER CHECK (time_ms IS NULL OR time_ms >= 0),
  hints_used INTEGER CHECK (hints_used IS NULL OR hints_used >= 0),
  score INTEGER CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logic_grid_sessions_user ON logic_grid_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_logic_grid_sessions_started ON logic_grid_sessions(started_at);

CREATE TABLE IF NOT EXISTS logic_grid_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_sessions INTEGER NOT NULL DEFAULT 0,
  completed_sessions INTEGER NOT NULL DEFAULT 0,
  last_played_at TIMESTAMPTZ,
  highest_difficulty game_difficulty_enum,
  avg_time_ms INTEGER,
  hints_per_puzzle NUMERIC(6,2),
  puzzles_solved_pct NUMERIC(5,2) CHECK (puzzles_solved_pct IS NULL OR (puzzles_solved_pct >= 0 AND puzzles_solved_pct <= 100)),
  percentile NUMERIC(5,2) CHECK (percentile IS NULL OR (percentile >= 0 AND percentile <= 100)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_logic_grid_stats_user ON logic_grid_stats(user_id);

-- =============================
-- Right Choice
-- =============================
CREATE TABLE IF NOT EXISTS right_choice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  difficulty game_difficulty_enum,
  duration_ms INTEGER CHECK (duration_ms IS NULL OR duration_ms >= 0),
  correct_pct NUMERIC(5,2) CHECK (correct_pct IS NULL OR (correct_pct >= 0 AND correct_pct <= 100)),
  ethics_score NUMERIC(5,2) CHECK (ethics_score IS NULL OR (ethics_score >= 0 AND ethics_score <= 100)),
  risk_score NUMERIC(5,2) CHECK (risk_score IS NULL OR (risk_score >= 0 AND risk_score <= 100)),
  avg_decision_ms INTEGER CHECK (avg_decision_ms IS NULL OR avg_decision_ms >= 0),
  decisions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_right_choice_sessions_user ON right_choice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_right_choice_sessions_started ON right_choice_sessions(started_at);

CREATE TABLE IF NOT EXISTS right_choice_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_sessions INTEGER NOT NULL DEFAULT 0,
  completed_sessions INTEGER NOT NULL DEFAULT 0,
  last_played_at TIMESTAMPTZ,
  correct_pct NUMERIC(5,2) CHECK (correct_pct IS NULL OR (correct_pct >= 0 AND correct_pct <= 100)),
  ethics_score NUMERIC(5,2) CHECK (ethics_score IS NULL OR (ethics_score >= 0 AND ethics_score <= 100)),
  risk_score NUMERIC(5,2) CHECK (risk_score IS NULL OR (risk_score >= 0 AND risk_score <= 100)),
  avg_decision_ms INTEGER,
  percentile NUMERIC(5,2) CHECK (percentile IS NULL OR (percentile >= 0 AND percentile <= 100)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_right_choice_stats_user ON right_choice_stats(user_id);

-- =============================
-- BPOC DISC (Personality)
-- =============================
CREATE TABLE IF NOT EXISTS disc_personality_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  duration_ms INTEGER CHECK (duration_ms IS NULL OR duration_ms >= 0),
  d SMALLINT CHECK (d IS NULL OR (d >= 0 AND d <= 100)),
  i SMALLINT CHECK (i IS NULL OR (i >= 0 AND i <= 100)),
  s SMALLINT CHECK (s IS NULL OR (s >= 0 AND s <= 100)),
  c SMALLINT CHECK (c IS NULL OR (c >= 0 AND c <= 100)),
  primary_style TEXT CHECK (primary_style IS NULL OR primary_style IN ('D','I','S','C')),
  secondary_style TEXT CHECK (secondary_style IS NULL OR secondary_style IN ('D','I','S','C')),
  consistency_index NUMERIC(5,2),
  strengths JSONB, -- tags/array
  blind_spots JSONB, -- tags/array
  preferred_env JSONB, -- tags/array
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_disc_personality_sessions_user ON disc_personality_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_disc_personality_sessions_started ON disc_personality_sessions(started_at);

-- Latest/aggregated (store latest and selected aggregates)
CREATE TABLE IF NOT EXISTS disc_personality_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_taken_at TIMESTAMPTZ,
  d SMALLINT,
  i SMALLINT,
  s SMALLINT,
  c SMALLINT,
  primary_style TEXT CHECK (primary_style IS NULL OR primary_style IN ('D','I','S','C')),
  secondary_style TEXT CHECK (secondary_style IS NULL OR secondary_style IN ('D','I','S','C')),
  consistency_index NUMERIC(5,2),
  strengths JSONB,
  blind_spots JSONB,
  preferred_env JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_disc_personality_stats_user ON disc_personality_stats(user_id);

-- =============================
-- BPOC Ultimate (Assessment)
-- =============================
CREATE TABLE IF NOT EXISTS ultimate_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  duration_ms INTEGER CHECK (duration_ms IS NULL OR duration_ms >= 0),
  difficulty game_difficulty_enum,
  leadership SMALLINT CHECK (leadership IS NULL OR (leadership >= 0 AND leadership <= 100)),
  crisis_mgmt SMALLINT CHECK (crisis_mgmt IS NULL OR (crisis_mgmt >= 0 AND crisis_mgmt <= 100)),
  integrity SMALLINT CHECK (integrity IS NULL OR (integrity >= 0 AND integrity <= 100)),
  communications SMALLINT CHECK (communications IS NULL OR (communications >= 0 AND communications <= 100)),
  analysis SMALLINT CHECK (analysis IS NULL OR (analysis >= 0 AND analysis <= 100)),
  overall SMALLINT CHECK (overall IS NULL OR (overall >= 0 AND overall <= 100)),
  pass_level TEXT, -- e.g., 'pass', 'merit', 'distinction', or custom
  scenario_breakdown JSONB, -- details per scenario
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ultimate_sessions_user ON ultimate_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ultimate_sessions_started ON ultimate_sessions(started_at);

CREATE TABLE IF NOT EXISTS ultimate_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_sessions INTEGER NOT NULL DEFAULT 0,
  completed_sessions INTEGER NOT NULL DEFAULT 0,
  last_played_at TIMESTAMPTZ,
  leadership SMALLINT,
  crisis_mgmt SMALLINT,
  integrity SMALLINT,
  communications SMALLINT,
  analysis SMALLINT,
  overall SMALLINT,
  pass_level TEXT,
  percentile NUMERIC(5,2) CHECK (percentile IS NULL OR (percentile >= 0 AND percentile <= 100)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_ultimate_stats_user ON ultimate_stats(user_id);

-- =============================
-- updated_at triggers
-- =============================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_typing_hero_sessions_updated_at') THEN
    CREATE TRIGGER update_typing_hero_sessions_updated_at
      BEFORE UPDATE ON typing_hero_sessions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_typing_hero_stats_updated_at') THEN
    CREATE TRIGGER update_typing_hero_stats_updated_at
      BEFORE UPDATE ON typing_hero_stats
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_inbox_zero_sessions_updated_at') THEN
    CREATE TRIGGER update_inbox_zero_sessions_updated_at
      BEFORE UPDATE ON inbox_zero_sessions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_inbox_zero_stats_updated_at') THEN
    CREATE TRIGGER update_inbox_zero_stats_updated_at
      BEFORE UPDATE ON inbox_zero_stats
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_logic_grid_sessions_updated_at') THEN
    CREATE TRIGGER update_logic_grid_sessions_updated_at
      BEFORE UPDATE ON logic_grid_sessions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_logic_grid_stats_updated_at') THEN
    CREATE TRIGGER update_logic_grid_stats_updated_at
      BEFORE UPDATE ON logic_grid_stats
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_right_choice_sessions_updated_at') THEN
    CREATE TRIGGER update_right_choice_sessions_updated_at
      BEFORE UPDATE ON right_choice_sessions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_right_choice_stats_updated_at') THEN
    CREATE TRIGGER update_right_choice_stats_updated_at
      BEFORE UPDATE ON right_choice_stats
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_disc_personality_sessions_updated_at') THEN
    CREATE TRIGGER update_disc_personality_sessions_updated_at
      BEFORE UPDATE ON disc_personality_sessions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_disc_personality_stats_updated_at') THEN
    CREATE TRIGGER update_disc_personality_stats_updated_at
      BEFORE UPDATE ON disc_personality_stats
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_ultimate_sessions_updated_at') THEN
    CREATE TRIGGER update_ultimate_sessions_updated_at
      BEFORE UPDATE ON ultimate_sessions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_ultimate_stats_updated_at') THEN
    CREATE TRIGGER update_ultimate_stats_updated_at
      BEFORE UPDATE ON ultimate_stats
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;



-- Career Games Schema (per-user storage)
-- This adds per-session, per-user aggregated stats, and achievements for games

-- Enumerations
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'game_id_enum') THEN
    CREATE TYPE game_id_enum AS ENUM (
      'typing-hero',
      'disc-personality',
      'ultimate',
      'bpoc-cultural'
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'game_difficulty_enum') THEN
    CREATE TYPE game_difficulty_enum AS ENUM (
      'beginner','easy','intermediate','advanced','expert'
    );
  END IF;
END $$;

-- Per-play session records (one row per run)
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id game_id_enum NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  finished_at TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER CHECK (duration_ms IS NULL OR duration_ms >= 0),
  score INTEGER, -- generic score field when applicable
  accuracy NUMERIC(5,2) CHECK (accuracy IS NULL OR (accuracy >= 0 AND accuracy <= 100)),
  difficulty game_difficulty_enum,
  -- Flexible per-game metrics payload. Examples:
  -- typing-hero: {"wpm": 72, "errors": {"spelling": 3, "punctuation": 1}}
  -- disc-personality: {"d": 35, "i": 60, "s": 55, "c": 50, "primary": "I", "secondary": "S"}
  -- ultimate: {"leadership": 78, "crisis": 72, "integrity": 90}
  -- second-ultimate: {"us_compatibility": 95, "uk_compatibility": 92, "au_compatibility": 88, "ca_compatibility": 90}
  metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_game_sessions_user ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_game ON game_sessions(user_id, game_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_started_at ON game_sessions(started_at);

-- Aggregated per-user stats per game (one row per user+game)
CREATE TABLE IF NOT EXISTS user_game_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id game_id_enum NOT NULL,
  total_sessions INTEGER NOT NULL DEFAULT 0,
  completed_sessions INTEGER NOT NULL DEFAULT 0,
  last_played_at TIMESTAMP WITH TIME ZONE,
  best_score INTEGER,
  best_accuracy NUMERIC(5,2) CHECK (best_accuracy IS NULL OR (best_accuracy >= 0 AND best_accuracy <= 100)),
  highest_difficulty game_difficulty_enum,
  recent_score INTEGER,
  percentile NUMERIC(5,2) CHECK (percentile IS NULL OR (percentile >= 0 AND percentile <= 100)),
  -- Flexible aggregate metrics (e.g., medians, trends, breakdowns)
  metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

CREATE INDEX IF NOT EXISTS idx_user_game_stats_user ON user_game_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_game_stats_user_game ON user_game_stats(user_id, game_id);

-- Achievements earned by a user for a game
CREATE TABLE IF NOT EXISTS game_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id game_id_enum NOT NULL,
  achievement_code TEXT NOT NULL, -- e.g., 'typing_hero_80_wpm', 'inbox_zero_perfect_round'
  title TEXT,
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, game_id, achievement_code)
);

CREATE INDEX IF NOT EXISTS idx_game_achievements_user ON game_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_game_achievements_user_game ON game_achievements(user_id, game_id);
CREATE INDEX IF NOT EXISTS idx_game_achievements_code ON game_achievements(achievement_code);

-- Triggers to maintain updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_game_sessions_updated_at'
  ) THEN
    CREATE TRIGGER update_game_sessions_updated_at
      BEFORE UPDATE ON game_sessions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_game_stats_updated_at'
  ) THEN
    CREATE TRIGGER update_user_game_stats_updated_at
      BEFORE UPDATE ON user_game_stats
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_game_achievements_updated_at'
  ) THEN
    CREATE TRIGGER update_game_achievements_updated_at
      BEFORE UPDATE ON game_achievements
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Optional helper view: latest session per user+game
CREATE OR REPLACE VIEW v_latest_game_session AS
SELECT DISTINCT ON (user_id, game_id)
  user_id,
  game_id,
  id AS session_id,
  started_at,
  finished_at,
  score,
  accuracy,
  difficulty,
  metrics
FROM game_sessions
ORDER BY user_id, game_id, started_at DESC;



-- Leaderboard tables (persistent), with minimal, focused design

-- Enums
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'leaderboard_period_enum') THEN
    CREATE TYPE leaderboard_period_enum AS ENUM ('weekly','monthly','all');
  END IF;
END $$;

-- Per-game leaderboard scores
CREATE TABLE IF NOT EXISTS leaderboard_game_scores (
  period leaderboard_period_enum NOT NULL,
  game_id text NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  best_score integer NOT NULL,
  plays integer NOT NULL DEFAULT 0,
  last_played timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  extra jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT leaderboard_game_scores_pkey PRIMARY KEY (period, game_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_lbs_game_order ON leaderboard_game_scores (game_id, period, best_score DESC, plays ASC, last_played ASC);

-- Applicant leaderboard (status milestone points)
CREATE TABLE IF NOT EXISTS leaderboard_applicant_scores (
  period leaderboard_period_enum NOT NULL DEFAULT 'all',
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score integer NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  extra jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT leaderboard_applicant_scores_pkey PRIMARY KEY (period, user_id)
);

CREATE INDEX IF NOT EXISTS idx_lbs_applicants_order ON leaderboard_applicant_scores (period, score DESC);

-- Engagement leaderboard (one-time achievement points)
CREATE TABLE IF NOT EXISTS leaderboard_engagement_scores (
  period leaderboard_period_enum NOT NULL DEFAULT 'all',
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score integer NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  extra jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT leaderboard_engagement_scores_pkey PRIMARY KEY (period, user_id)
);

CREATE INDEX IF NOT EXISTS idx_lbs_engagement_order ON leaderboard_engagement_scores (period, score DESC);



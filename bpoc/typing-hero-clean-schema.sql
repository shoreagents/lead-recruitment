-- Clean Typing Hero Table Schema
-- Simple structure with core metrics + AI analysis JSONB

-- Create the main typing_hero_sessions table
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
    session_status TEXT DEFAULT 'completed' CHECK (session_status IN ('completed', 'failed', 'abandoned'))
);

-- Create indexes for performance
CREATE INDEX idx_typing_hero_user_id ON typing_hero_sessions(user_id);
CREATE INDEX idx_typing_hero_created_at ON typing_hero_sessions(created_at);
CREATE INDEX idx_typing_hero_score ON typing_hero_sessions(score);
CREATE INDEX idx_typing_hero_wpm ON typing_hero_sessions(wpm);
CREATE INDEX idx_typing_hero_accuracy ON typing_hero_sessions(overall_accuracy);

-- JSONB indexes for AI analysis queries
CREATE INDEX idx_typing_hero_ai_analysis ON typing_hero_sessions USING GIN (ai_analysis);
CREATE INDEX idx_typing_hero_performance_level ON typing_hero_sessions ((ai_analysis->>'performanceLevel'));
CREATE INDEX idx_typing_hero_ai_wpm ON typing_hero_sessions ((ai_analysis->'performanceMetrics'->>'wpm'));

-- Add comments for documentation
COMMENT ON TABLE typing_hero_sessions IS 'Clean Typing Hero sessions with core metrics and AI analysis';
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

-- Example of the AI analysis JSONB structure
/*
{
  "sessionMetadata": {
    "timestamp": "2025-01-19T06:08:27.566Z",
    "difficultyLevel": "rockstar",
    "sessionDuration": 90,
    "totalWords": 66,
    "charactersTyped": 324
  },
  "performanceMetrics": {
    "wpm": 81,
    "accuracy": 68.2,
    "correctWords": 45,
    "missedWords": 21,
    "fires": 45,
    "poos": 21,
    "longestStreak": 58,
    "currentStreak": 12,
    "burstWPM": 95,
    "sustainedWPM": 78,
    "realtimeWPM": 81,
    "totalKeypresses": 324,
    "errorRate": 31.8,
    "wordsPerMinute": 81,
    "charactersPerMinute": 216
  },
  "errorAnalysis": {
    "totalErrors": 21,
    "errorPatterns": [
      {
        "word": "customer",
        "userInput": "custmer",
        "errorType": "typo",
        "timestamp": 1234567890,
        "category": "adjacent_keys"
      }
    ],
    "errorBreakdown": {
      "typos": 12,
      "spelling": 5,
      "speed": 3,
      "missed": 1
    },
    "mostCommonErrors": [
      {
        "word": "customer",
        "frequency": 3,
        "errorType": "typo"
      }
    ],
    "errorTrends": {
      "increasing": false,
      "decreasing": true,
      "stable": false
    }
  },
  "streakAnalysis": {
    "bestStreak": 58,
    "currentStreak": 12,
    "averageStreak": 8.5,
    "streakConsistency": "high",
    "focusPatterns": {
      "concentrationLevel": "strong",
      "distractionPoints": 2,
      "recoveryTime": "fast"
    }
  },
  "difficultyAssessment": {
    "level": "rockstar",
    "appropriateness": "optimal",
    "challengeLevel": "moderate",
    "recommendation": "maintain_current_level"
  },
  "aiAssessment": {
    "overallAssessment": "Impressive speed at 81 WPM puts you in expert territory, though there's room to improve accuracy from 68.2%. Your excellent streak of 58 shows strong potential!",
    "performanceLevel": "Expert",
    "strengths": [
      "Outstanding typing speed above 80 WPM",
      "Excellent streak maintenance showing good focus",
      "Strong performance at 'rockstar' difficulty level",
      "High volume of characters typed showing good endurance"
    ],
    "improvementAreas": [
      "Accuracy consistency",
      "Error reduction techniques",
      "Speed-accuracy balance"
    ],
    "personalizedTips": [
      {
        "category": "Accuracy",
        "tip": "Try reducing speed by 10-15% temporarily",
        "explanation": "Slowing down slightly will help rebuild accuracy without significantly impacting your impressive WPM",
        "priority": "high"
      },
      {
        "category": "Technique",
        "tip": "Implement a brief pause (0.5s) between words",
        "explanation": "This micro-rest helps reset finger positioning and can reduce error rate while maintaining overall speed",
        "priority": "medium"
      },
      {
        "category": "Focus",
        "tip": "Practice looking ahead 2-3 words while typing",
        "explanation": "This technique helps maintain your excellent speed while giving your brain more time to process upcoming words",
        "priority": "medium"
      }
    ],
    "encouragement": "You're already performing at an expert level with fantastic speed! With some focus on accuracy, you'll be unstoppable. Keep up the amazing work! 🚀",
    "nextSessionGoal": "Aim for 75+ WPM while increasing accuracy to at least 80% - quality over pure speed",
    "confidenceScore": 0.85,
    "assessmentVersion": "1.0"
  },
  "comparativeAnalysis": {
    "percentileRank": 92,
    "peerComparison": "top_8_percent",
    "improvementTrend": "positive",
    "consistencyScore": 0.78,
    "potentialLevel": "expert_plus"
  },
  "recommendations": {
    "nextDifficulty": "virtuoso",
    "practiceFocus": ["accuracy", "technique"],
    "estimatedImprovement": "10-15% accuracy gain in 2-3 sessions",
    "skillGaps": ["error_prevention", "speed_consistency"],
    "strengthAreas": ["typing_speed", "focus_maintenance"]
  },
  "sessionInsights": {
    "keyTakeaways": [
      "Excellent speed performance with room for accuracy improvement",
      "Strong focus patterns demonstrated by long streaks",
      "Good adaptation to game mechanics"
    ],
    "notableMoments": [
      {
        "timestamp": 45,
        "event": "longest_streak_achieved",
        "value": 58,
        "significance": "high"
      }
    ],
    "performancePhases": {
      "warmup": {"duration": 15, "wpm": 65, "accuracy": 72},
      "peak": {"duration": 45, "wpm": 85, "accuracy": 75},
      "cooling": {"duration": 30, "wpm": 78, "accuracy": 68}
    }
  }
}
*/

-- Test script to verify Typing Hero session storage
-- Run this after creating the table to test data insertion

-- Test data insertion
INSERT INTO typing_hero_sessions (
  user_id, 
  score, 
  wpm, 
  longest_streak, 
  correct_words, 
  wrong_words, 
  elapsed_time, 
  overall_accuracy, 
  ai_analysis,
  difficulty_level,
  session_status
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Test user ID (replace with real user ID)
  1250,
  81,
  58,
  45,
  21,
  90,
  68.2,
  '{
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
      "totalKeypresses": 324,
      "errorRate": 31.8,
      "wordsPerMinute": 81,
      "charactersPerMinute": 216
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
      "personalizedTips": [
        {
          "category": "Accuracy",
          "tip": "Try reducing speed by 10-15% temporarily",
          "explanation": "Slowing down slightly will help rebuild accuracy without significantly impacting your impressive WPM",
          "priority": "high"
        }
      ],
      "encouragement": "You're already performing at an expert level with fantastic speed! With some focus on accuracy, you'll be unstoppable. Keep up the amazing work! 🚀",
      "nextSessionGoal": "Aim for 75+ WPM while increasing accuracy to at least 80% - quality over pure speed"
    }
  }'::jsonb,
  'rockstar',
  'completed'
);

-- Verify the data was inserted correctly
SELECT 
  id,
  user_id,
  score,
  wpm,
  longest_streak,
  correct_words,
  wrong_words,
  elapsed_time,
  overall_accuracy,
  difficulty_level,
  session_status,
  ai_analysis->>'performanceLevel' as ai_performance_level,
  ai_analysis->'aiAssessment'->>'overallAssessment' as ai_assessment
FROM typing_hero_sessions 
WHERE user_id = '00000000-0000-0000-0000-000000000000'
ORDER BY created_at DESC 
LIMIT 1;

-- Test JSONB queries
SELECT 
  COUNT(*) as total_sessions,
  AVG(wpm) as avg_wpm,
  MAX(wpm) as best_wpm,
  AVG(overall_accuracy) as avg_accuracy
FROM typing_hero_sessions 
WHERE ai_analysis->>'performanceLevel' = 'Expert';

-- Test error patterns query
SELECT 
  ai_analysis->'performanceMetrics'->>'wpm' as wpm,
  ai_analysis->'performanceMetrics'->>'accuracy' as accuracy,
  ai_analysis->'aiAssessment'->>'performanceLevel' as level
FROM typing_hero_sessions 
WHERE (ai_analysis->'performanceMetrics'->>'wpm')::int > 80;

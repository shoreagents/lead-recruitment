# 🎮 BPOC Cultural Game API Documentation

## Overview
The BPOC Cultural game now stores comprehensive session and statistics data for each user, providing valuable insights for hiring decisions and candidate assessment.

## 🗄️ Database Tables

### 1. `bpoc_cultural_sessions`
Stores individual game session data (one row per game attempt)

**Key Fields:**
- `user_id`: Reference to user
- `started_at` / `finished_at`: Session timing
- `duration_ms`: Total time played
- `stage_reached`: Which stage they completed (1-4)
- `challenge_completed`: Which challenge they finished
- `survival_status`: Overall performance (0-100)
- `us_score`, `uk_score`, `au_score`, `ca_score`: Regional cultural compatibility scores
- `tier_name`: Final tier classification
- `achievements`: Array of achievements earned
- `metrics`: JSONB with detailed game data

### 2. `bpoc_cultural_stats`
Stores aggregated user statistics (one row per user)

**Key Fields:**
- `user_id`: Reference to user
- `total_sessions` / `completed_sessions`: Session counts
- `best_survival_status`: Highest survival rate achieved
- `best_average_score`: Best average cultural score
- `avg_us_score`, `avg_uk_score`, `avg_au_score`, `avg_ca_score`: Average regional scores
- `current_tier`: Latest tier classification
- `unique_achievements`: All achievements earned across sessions

## 🚀 API Endpoints

### 1. Save Game Session
**POST** `/api/games/bpoc-cultural/session`

**Purpose:** Save completed game session data

**Request Body:**
```json
{
  "startedAt": "2024-01-15T10:00:00Z",
  "finishedAt": "2024-01-15T10:05:00Z",
  "durationMs": 300000,
  "stageReached": 4,
  "challengeCompleted": 12,
  "gameState": "results",
  "timeLeft": 45,
  "survivalStatus": 95,
  "interactionCount": 8,
  "usScore": 92,
  "ukScore": 88,
  "auScore": 95,
  "caScore": 90,
  "tierName": "Cultural Master",
  "tierDescription": "Excellent cultural adaptation - Premium client tier",
  "achievements": ["🇺🇸 US Cultural Master", "🌟 Cultural Chameleon"],
  "metrics": {
    "culturalTranscripts": { "US": "...", "UK": "...", "AU": "...", "CA": "..." },
    "generatedScripts": { "US": "...", "UK": "...", "AU": "...", "CA": "..." },
    "stageAchievements": { "1": [...], "2": [...], "3": [...], "4": [...] },
    "audioRecordings": { "totalRecordings": 8, "recordingTime": 120 },
    "challengeBreakdown": {
      "stage1": { "completed": true, "challenges": 3 },
      "stage2": { "completed": true, "challenges": 2 },
      "stage3": { "completed": true, "challenges": 3 },
      "stage4": { "completed": true, "challenges": 1 }
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid-here"
}
```

### 2. Get User Stats
**GET** `/api/games/bpoc-cultural/stats`

**Purpose:** Retrieve user's game statistics and recent sessions

**Response:**
```json
{
  "success": true,
  "stats": {
    "total_sessions": 5,
    "completed_sessions": 4,
    "best_survival_status": 95,
    "best_average_score": 91.25,
    "current_tier": "Cultural Master",
    "avg_us_score": 92.0,
    "avg_uk_score": 88.0,
    "avg_au_score": 95.0,
    "avg_ca_score": 90.0
  },
  "recentSessions": [...],
  "achievementBreakdown": [
    { "achievement": "🇺🇸 US Cultural Master", "earned_count": 3 },
    { "achievement": "🌟 Cultural Chameleon", "earned_count": 2 }
  ]
}
```

### 3. Admin Stats (Admin Only)
**GET** `/api/admin/bpoc-cultural-stats`

**Purpose:** View overall game statistics across all users

**Response:**
```json
{
  "success": true,
  "overallStats": {
    "total_players": 150,
    "total_sessions": 450,
    "overall_avg_us": 78.5,
    "overall_avg_uk": 76.2,
    "overall_avg_au": 79.1,
    "overall_avg_ca": 77.8
  },
  "topPerformers": [...],
  "tierDistribution": [
    { "current_tier": "Cultural Master", "player_count": 25 },
    { "current_tier": "Cultural Professional", "player_count": 45 }
  ],
  "recentActivity": [...]
}
```

## 🔐 Authentication

All endpoints require authentication via:
- **Header:** `Authorization: Bearer {token}`
- **Header:** `x-user-id: {userId}`

## 📊 Data Usage Examples

### For Hiring Decisions:
```sql
-- Get candidates with high cultural compatibility
SELECT 
  u.full_name,
  u.email,
  bcs.current_tier,
  bcs.best_average_score,
  bcs.avg_us_score,
  bcs.avg_uk_score
FROM bpoc_cultural_stats bcs
JOIN users u ON bcs.user_id = u.id
WHERE bcs.best_average_score >= 85
ORDER BY bcs.best_average_score DESC;
```

### For Training Insights:
```sql
-- Identify areas needing improvement
SELECT 
  user_id,
  AVG(us_score) as avg_us,
  AVG(uk_score) as avg_uk,
  AVG(au_score) as avg_au,
  AVG(ca_score) as avg_ca
FROM bpoc_cultural_sessions
GROUP BY user_id
HAVING AVG(us_score) < 70 OR AVG(uk_score) < 70;
```

## 🎯 Key Benefits

1. **Cultural Guarantee**: Verify candidates can communicate across all regions
2. **Performance Tracking**: Monitor improvement over multiple attempts
3. **Risk Assessment**: Identify candidates who might struggle with specific clients
4. **Training Insights**: Know exactly which cultural areas need development
5. **Client Matching**: Place candidates where they'll communicate most effectively

## 🚨 Important Notes

- Data is automatically saved when a game session completes
- Stats are automatically updated after each session
- Voice transcripts and writing samples are stored in the `metrics` JSONB field
- All scores are normalized to 0-100 scale
- Achievements track both regional mastery and overall performance

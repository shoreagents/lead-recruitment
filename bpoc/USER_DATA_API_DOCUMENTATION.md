# BPOC.IO User Data API Documentation

## Overview
The User Data API provides comprehensive access to user-related information and their job application data through a single endpoint. This API combines data from user profiles, work status, AI analysis results, DISC personality stats, typing hero stats, and job information from `processed_job_requests`.

## Quick Reference

| Data Source | Fields Available | Description |
|-------------|------------------|-------------|
| **Users** | 26 fields | Profile, location (with lat/lng), contact info, demographics |
| **Work Status** | 14 fields | Employment info, salary, preferences, work setup |
| **AI Analysis** | 26 fields | Resume scores, strengths, recommendations, career insights |
| **DISC Personality** | 24 fields | Personality scores, types, BPO roles, XP, badges, cultural alignment |
| **Typing Hero** | 28 fields | Typing speed, accuracy, vocabulary, generated story |
| **Jobs** (optional) | 30+ fields | Job details, applications, company info |
| **Total** | **110+ fields** | Comprehensive candidate profile |

## Base URL
```
https://your-domain.com/api/public/user-data
```

## Authentication
This is a public API with CORS enabled. No authentication required for basic data access.

## Endpoint

### GET /api/public/user-data

Retrieves comprehensive user data and optionally their job application data.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string (UUID) | No* | User's unique identifier |
| `slug` | string | No* | User's public slug (e.g., "john-doe-1234") |
| `email` | string | No* | User's email address |
| `includeJobs` | boolean | No | Include job data for applied jobs (default: false) |
| `includePrivate` | boolean | No | Include private/sensitive fields (default: false) |
| `fields` | string (comma-separated) | No | Specific fields to return (default: all public fields) |
| `limit` | number | No | Number of records to return (max: 100, default: 1) |
| `offset` | number | No | Number of records to skip (default: 0) |

*At least one identifier (`userId`, `slug`, or `email`) is required.

#### Response Format

```json
{
  "success": true,
  "data": [
    {
      // User Profile
      "user_id": "uuid",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "full_name": "John Doe",
      "location": "Manila, Philippines",
      "avatar_url": "https://...",
      "phone": "+63912345678",
      "bio": "Software Developer...",
      "position": "Senior Developer",
      "gender": "male",
      "gender_custom": null,
      "admin_level": 0,
      "completed_data": true,
      "birthday": "1990-01-15",
      "slug": "john-doe-1234",
      "username": "johndoe",
      "location_place_id": "ChIJ...",
      "location_lat": 14.5995,
      "location_lng": 120.9842,
      "location_city": "Manila",
      "location_province": "Metro Manila",
      "location_country": "Philippines",
      "location_barangay": "Poblacion",
      "location_region": "NCR",
      "user_created_at": "2024-01-01T00:00:00Z",
      "user_updated_at": "2024-01-01T00:00:00Z",
      
      // Work Status
      "work_status_id": "uuid",
      "work_status_user_id": "uuid",
      "current_employer": "Tech Corp",
      "current_position": "Senior Developer",
      "current_salary": 50000,
      "notice_period_days": 30,
      "current_mood": "active",
      "work_status": "employed",
      "preferred_shift": "day",
      "expected_salary": 60000,
      "work_setup": "Hybrid",
      "work_status_completed": true,
      "work_status_created_at": "2024-01-01T00:00:00Z",
      "work_status_updated_at": "2024-01-01T00:00:00Z",
      
      // AI Analysis Results
      "analysis_id": "uuid",
      "analysis_user_id": "uuid",
      "session_id": "uuid",
      "original_resume_id": "uuid",
      "overall_score": 85,
      "ats_compatibility_score": 90,
      "content_quality_score": 80,
      "professional_presentation_score": 85,
      "skills_alignment_score": 88,
      "key_strengths": ["JavaScript", "React", "Node.js"],
      "strengths_analysis": {...},
      "improvements": ["Add more metrics", "Include certifications"],
      "recommendations": ["Consider leadership roles", "Expand backend skills"],
      "improved_summary": "Experienced software developer...",
      "salary_analysis": {...},
      "career_path": {...},
      "section_analysis": {...},
      "analysis_metadata": {...},
      "portfolio_links": ["https://github.com/johndoe"],
      "files_analyzed": ["resume.pdf"],
      "candidate_profile": {...},
      "skills_snapshot": {...},
      "experience_snapshot": {...},
      "education_snapshot": {...},
      "analysis_created_at": "2024-01-01T00:00:00Z",
      "analysis_updated_at": "2024-01-01T00:00:00Z",
      
      // DISC Personality Stats
      "disc_personality_stats_id": "uuid",
      "disc_personality_user_id": "uuid",
      "disc_created_at": "2024-01-01T00:00:00Z",
      "disc_updated_at": "2024-01-01T00:00:00Z",
      "disc_total_sessions": 5,
      "disc_completed_sessions": 4,
      "disc_last_taken_at": "2024-01-15T00:00:00Z",
      "latest_d_score": 75,
      "latest_i_score": 85,
      "latest_s_score": 65,
      "latest_c_score": 70,
      "disc_primary_type": "Influencer",
      "disc_secondary_type": "Dominant",
      "disc_confidence_score": 92,
      "disc_completion_time": 180,
      "disc_consistency_trend": "stable",
      "disc_ai_assessment": {...},
      "disc_bpo_roles": ["Customer Service", "Sales"],
      "disc_percentile": 85,
      "disc_total_xp": 2500,
      "disc_badges_earned": 8,
      "disc_cultural_alignment_score": 88,
      "disc_authenticity_score": 95,
      "disc_latest_session_xp": 500,
      
      // Typing Hero Stats
      "typing_hero_stats_id": "uuid",
      "typing_hero_user_id": "uuid",
      "typing_created_at": "2024-01-01T00:00:00Z",
      "typing_updated_at": "2024-01-01T00:00:00Z",
      "typing_total_sessions": 20,
      "typing_completed_sessions": 18,
      "typing_last_played_at": "2024-01-15T00:00:00Z",
      "typing_best_score": 1500,
      "typing_best_wpm": 85,
      "typing_best_accuracy": 98.5,
      "typing_best_streak": 25,
      "typing_latest_score": 1400,
      "typing_latest_wpm": 82,
      "typing_latest_accuracy": 97.8,
      "typing_latest_difficulty": "medium",
      "typing_avg_wpm": 78,
      "typing_avg_accuracy": 96.5,
      "typing_total_play_time": 3600,
      "typing_ai_analysis": {...},
      "typing_total_words_correct": 1250,
      "typing_total_words_incorrect": 45,
      "typing_most_common_correct_words": ["the", "and", "for"],
      "typing_most_common_incorrect_words": ["accommodate", "necessary"],
      "typing_average_reaction_time": 250,
      "typing_vocabulary_strengths": ["common words", "technical terms"],
      "typing_vocabulary_weaknesses": ["long words", "uncommon words"],
      "typing_generated_story": "Once upon a time in a bustling office..."
    }
  ],
  "jobs": [
    {
      "user_id": "uuid",
      "full_name": "John Doe",
      "slug": "john-doe-1234",
      
      // Application Information
      "application_id": "uuid",
      "application_status": "initial interview",
      "application_created_at": "2024-01-15T00:00:00Z",
      "application_position": 1,
      
      // Job Information
      "job_id": 123,
      "job_title": "Senior Software Developer",
      "job_description": "We are looking for...",
      "requirements": ["5+ years experience", "React knowledge"],
      "responsibilities": ["Develop applications", "Code review"],
      "benefits": ["Health insurance", "Remote work"],
      "job_skills": ["JavaScript", "React", "Node.js"],
      "job_experience_level": "senior-level",
      "application_deadline": "2024-02-15",
      "job_industry": "Technology",
      "job_department": "Engineering",
      "job_work_arrangement": "hybrid",
      "job_salary_min": 80000,
      "job_salary_max": 120000,
      "job_currency": "PHP",
      "job_salary_type": "monthly",
      "job_work_type": "full-time",
      "job_status": "active",
      "job_views": 150,
      "job_applicants": 25,
      "job_priority": "high",
      "job_shift": "day",
      "job_created_at": "2024-01-01T00:00:00Z",
      "job_updated_at": "2024-01-01T00:00:00Z",
      
      // Company Information
      "company_name": "Tech Corp",
      "company_id": "uuid",
      "company_created_at": "2023-01-01T00:00:00Z",
      "company_updated_at": "2023-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 1,
    "offset": 0,
    "hasMore": false
  },
  "meta": {
    "requestedFields": "all",
    "includePrivate": false,
    "includeJobs": true,
    "timestamp": "2024-01-20T12:00:00Z"
  }
}
```

## Usage Examples

### 1. Get User by ID
```bash
curl "https://your-domain.com/api/public/user-data?userId=123e4567-e89b-12d3-a456-426614174000"
```

### 2. Get User by Slug (Public Profile)
```bash
curl "https://your-domain.com/api/public/user-data?slug=john-doe-1234"
```

### 3. Get User by Email
```bash
curl "https://your-domain.com/api/public/user-data?email=john@example.com"
```

### 4. Get User with Job Data
```bash
curl "https://your-domain.com/api/public/user-data?userId=123e4567-e89b-12d3-a456-426614174000&includeJobs=true"
```

### 5. Get Specific Fields Only
```bash
curl "https://your-domain.com/api/public/user-data?userId=123e4567-e89b-12d3-a456-426614174000&fields=full_name,position,overall_score,key_strengths"
```

### 6. Include Private Data (for internal use)
```bash
curl "https://your-domain.com/api/public/user-data?userId=123e4567-e89b-12d3-a456-426614174000&includePrivate=true"
```

### 7. Get Multiple Users with Job Data
```bash
curl "https://your-domain.com/api/public/user-data?limit=10&offset=0&includeJobs=true&fields=user_id,full_name"
```

### 8. Get User's Job Applications Only
```bash
curl "https://your-domain.com/api/public/user-data?userId=123e4567-e89b-12d3-a456-426614174000&includeJobs=true&fields=user_id,full_name"
```

### 9. Get User with DISC Personality Stats
```bash
curl "https://your-domain.com/api/public/user-data?userId=123e4567-e89b-12d3-a456-426614174000&fields=user_id,full_name,disc_primary_type,disc_secondary_type,latest_d_score,latest_i_score,latest_s_score,latest_c_score"
```

### 10. Get User with Typing Hero Stats
```bash
curl "https://your-domain.com/api/public/user-data?userId=123e4567-e89b-12d3-a456-426614174000&fields=user_id,full_name,typing_best_wpm,typing_best_accuracy,typing_avg_wpm"
```

### 11. Get User with DISC XP and Badges (Gamification)
```bash
curl "https://your-domain.com/api/public/user-data?userId=123e4567-e89b-12d3-a456-426614174000&fields=user_id,full_name,disc_total_xp,disc_badges_earned,disc_latest_session_xp,disc_cultural_alignment_score,disc_authenticity_score"
```

### 12. Get User with Typing Generated Story
```bash
curl "https://your-domain.com/api/public/user-data?userId=123e4567-e89b-12d3-a456-426614174000&fields=user_id,full_name,typing_generated_story,typing_best_wpm"
```

## Available Fields

### User Data Fields (Default)

- **User Profile**: `user_id`, `email`, `first_name`, `last_name`, `full_name`, `location`, `avatar_url`, `phone`, `bio`, `position`, `gender`, `gender_custom`, `admin_level`, `completed_data`, `birthday`, `slug`, `username`, `location_place_id`, `location_lat`, `location_lng`, `location_city`, `location_province`, `location_country`, `location_barangay`, `location_region`, `user_created_at`, `user_updated_at`

- **Work Status**: `work_status_id`, `work_status_user_id`, `current_employer`, `current_position`, `current_salary`, `notice_period_days`, `current_mood`, `work_status`, `preferred_shift`, `expected_salary`, `work_setup`, `work_status_completed`, `work_status_created_at`, `work_status_updated_at`

- **AI Analysis**: `analysis_id`, `analysis_user_id`, `session_id`, `original_resume_id`, `overall_score`, `ats_compatibility_score`, `content_quality_score`, `professional_presentation_score`, `skills_alignment_score`, `key_strengths`, `strengths_analysis`, `improvements`, `recommendations`, `improved_summary`, `salary_analysis`, `career_path`, `section_analysis`, `analysis_metadata`, `portfolio_links`, `files_analyzed`, `candidate_profile`, `skills_snapshot`, `experience_snapshot`, `education_snapshot`, `analysis_created_at`, `analysis_updated_at`

- **DISC Personality Stats**: `disc_personality_stats_id`, `disc_personality_user_id`, `disc_created_at`, `disc_updated_at`, `disc_total_sessions`, `disc_completed_sessions`, `disc_last_taken_at`, `latest_d_score`, `latest_i_score`, `latest_s_score`, `latest_c_score`, `disc_primary_type`, `disc_secondary_type`, `disc_confidence_score`, `disc_completion_time`, `disc_consistency_trend`, `disc_ai_assessment`, `disc_bpo_roles`, `disc_percentile`, `disc_total_xp`, `disc_badges_earned`, `disc_cultural_alignment_score`, `disc_authenticity_score`, `disc_latest_session_xp`

- **Typing Hero Stats**: `typing_hero_stats_id`, `typing_hero_user_id`, `typing_created_at`, `typing_updated_at`, `typing_total_sessions`, `typing_completed_sessions`, `typing_last_played_at`, `typing_best_score`, `typing_best_wpm`, `typing_best_accuracy`, `typing_best_streak`, `typing_latest_score`, `typing_latest_wpm`, `typing_latest_accuracy`, `typing_latest_difficulty`, `typing_avg_wpm`, `typing_avg_accuracy`, `typing_total_play_time`, `typing_ai_analysis`, `typing_total_words_correct`, `typing_total_words_incorrect`, `typing_most_common_correct_words`, `typing_most_common_incorrect_words`, `typing_average_reaction_time`, `typing_vocabulary_strengths`, `typing_vocabulary_weaknesses`, `typing_generated_story`

### Job Data Fields (when `includeJobs=true`)
- **Application Info**: `application_id`, `application_status`, `application_created_at`, `application_position`
- **Job Details**: `job_id`, `job_title`, `job_description`, `requirements`, `responsibilities`, `benefits`, `job_skills`, `job_experience_level`, `application_deadline`, `job_industry`, `job_department`, `job_work_arrangement`, `job_salary_min`, `job_salary_max`, `job_currency`, `job_salary_type`, `job_work_type`, `job_status`, `job_views`, `job_applicants`, `job_priority`, `job_shift`, `job_created_at`, `job_updated_at`
- **Company Info**: `company_name`, `company_id`, `company_created_at`, `company_updated_at`

### Private Fields (require `includePrivate=true`)
- `email`, `phone`, `current_salary`, `expected_salary`, `birthday`, `admin_level`, `location_place_id`, `location_lat`, `location_lng`, `notice_period_days`, `current_mood`, `analysis_metadata`, `files_analyzed`, `session_id`, `original_resume_id`

## New Fields Added (Complete Table Coverage)

### DISC Personality - Gamification & Cultural Fit
- **`disc_total_xp`** (integer): Cumulative XP earned across all DISC sessions - use for leaderboards
- **`disc_badges_earned`** (integer): Total number of badges/achievements earned - gamification metric
- **`disc_cultural_alignment_score`** (integer, 0-100): Filipino workplace cultural fit score - important for BPO hiring
- **`disc_authenticity_score`** (integer, 0-100): Authenticity/consistency score from DISC assessment
- **`disc_latest_session_xp`** (integer): XP earned in the most recent session - track progress

### Typing Hero - Story Generation
- **`typing_generated_story`** (text): AI-generated story based on user's typing session - creative writing assessment

These fields enable:
- 🎮 Gamification features (XP, badges, leaderboards)
- 🌏 Cultural fit assessment for Filipino BPO roles
- ✍️ Creative writing evaluation through generated stories
- 📊 More comprehensive candidate profiling

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "At least one identifier (userId, slug, or email) is required"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Failed to fetch user data",
  "details": "Detailed error message (development only)"
}
```

## Rate Limiting
- No rate limiting currently implemented
- Consider implementing rate limiting for production use

## CORS
- CORS is enabled for all origins (`*`)
- Allowed methods: `GET`, `OPTIONS`
- Allowed headers: `Content-Type`, `Authorization`

## Data Freshness
- Data is real-time from the database
- No caching implemented
- Consider implementing caching for frequently accessed data

## Use Cases

### 1. Public Profile Pages
```javascript
// Get user profile for public display
const response = await fetch('/api/public/user-data?slug=john-doe-1234');
const userData = await response.json();
```

### 2. User Job Application History
```javascript
// Get user with their job application history
const response = await fetch('/api/public/user-data?userId=USER_ID&includeJobs=true');
const userWithJobs = await response.json();
// Access job data via userWithJobs.jobs array
```

### 3. AI Analysis and Scores
```javascript
// Get users with AI analysis scores
const response = await fetch('/api/public/user-data?limit=100&fields=user_id,full_name,overall_score,ats_compatibility_score,key_strengths');
const analyzedUsers = await response.json();
```

### 4. DISC Personality Filtering
```javascript
// Get users with specific DISC personality types
const response = await fetch('/api/public/user-data?limit=50&fields=user_id,full_name,disc_primary_type,disc_secondary_type,disc_bpo_roles');
const discUsers = await response.json();
// Filter for specific personality types suitable for roles
```

### 5. Job Application Tracking
```javascript
// Get specific user's job applications
const response = await fetch('/api/public/user-data?userId=USER_ID&includeJobs=true&fields=user_id,full_name');
const userJobs = await response.json();
// Process userJobs.jobs to show application history
```

### 6. Company Job Analytics
```javascript
// Get all users who applied to jobs from a specific company
const response = await fetch('/api/public/user-data?includeJobs=true&limit=100');
const allUserJobs = await response.json();
const companyJobs = allUserJobs.jobs.filter(job => job.company_name === 'Tech Corp');
```

### 7. DISC Personality Analysis
```javascript
// Get user with DISC personality data
const response = await fetch('/api/public/user-data?userId=USER_ID&fields=user_id,full_name,disc_primary_type,disc_secondary_type,latest_d_score,latest_i_score,latest_s_score,latest_c_score,disc_bpo_roles');
const userData = await response.json();
// Access DISC data for career matching
```

### 8. Typing Speed Assessment
```javascript
// Get users with typing hero stats for skill assessment
const response = await fetch('/api/public/user-data?limit=50&fields=user_id,full_name,typing_best_wpm,typing_best_accuracy,typing_avg_wpm,typing_vocabulary_strengths');
const typingStats = await response.json();
// Evaluate typing skills for data entry roles
```

### 9. Complete Candidate Profile
```javascript
// Get comprehensive candidate data including games and analysis
const response = await fetch('/api/public/user-data?userId=USER_ID&fields=full_name,position,overall_score,disc_primary_type,typing_best_wpm,key_strengths');
const candidateProfile = await response.json();
// Use for holistic candidate evaluation
```

### 10. Gamification Leaderboard
```javascript
// Get top users by DISC XP and badges for leaderboard
const response = await fetch('/api/public/user-data?limit=50&fields=user_id,full_name,disc_total_xp,disc_badges_earned,disc_cultural_alignment_score');
const topPlayers = await response.json();
// Sort by XP to display leaderboard
```

### 11. Cultural Fit Assessment
```javascript
// Get users with high cultural alignment for Filipino workplace
const response = await fetch('/api/public/user-data?limit=100&fields=user_id,full_name,disc_cultural_alignment_score,disc_authenticity_score,disc_bpo_roles');
const culturallyAligned = await response.json();
// Filter for cultural_alignment_score > 80 for BPO roles
```

### 12. Typing Story Generation
```javascript
// Get user's generated typing story for creative assessment
const response = await fetch('/api/public/user-data?userId=USER_ID&fields=user_id,full_name,typing_generated_story,typing_best_wpm,typing_vocabulary_strengths');
const typingStory = await response.json();
// Display the story alongside typing performance
```

## Database Views
This API uses two views:

### `v_user_complete_data` - User Data
Combines data from:
- `users` (profile information)
- `user_work_status` (work preferences and employment status)
- `ai_analysis_results` (AI-powered resume analysis)
- `disc_personality_stats` (DISC personality game statistics)
- `typing_hero_stats` (typing speed game statistics)

### `v_user_job_data` - Job Data (when `includeJobs=true`)
Combines data from:
- `users` (user information)
- `applications` (application details)
- `processed_job_requests` (job information)
- `members` (company information)

## Important Notes

### What's Included
- Complete user profile with location details
- Full work status and preferences
- Comprehensive AI analysis results with all scores
- Complete DISC personality game statistics
- Full Typing Hero game performance data
- Job applications data (when `includeJobs=true`)

### What's NOT Currently Included
The following tables are **not** currently joined in the view:
- **`saved_resumes`** - Resume data (slug, title, template, visibility, view count) is not available
- **`applications` aggregations** - Application statistics (total, active, hired, rejected counts) are not available

If you need these fields, you would need to either:
1. Update the `v_user_complete_data` view to include LEFT JOINs to these tables
2. Make separate API calls to fetch this data

## Performance Considerations
- The view includes LEFT JOINs on 4 additional tables (`user_work_status`, `ai_analysis_results`, `disc_personality_stats`, `typing_hero_stats`)
- Users will be returned even if they don't have all related data (e.g., no DISC stats, no typing stats)
- The view contains 110+ columns, so use specific field selection to reduce payload size
- Consider implementing caching for frequently accessed data
- Indexes are created on:
  - User lookups: `user_id`, `email`, `slug`
  - DISC stats: `total_xp`, `badges_earned`, `cultural_alignment_score`, `percentile`, `primary_type`
  - Typing stats: `best_score`, `best_wpm`, `last_played_at`
- DISC and Typing Hero stats will be `null` for users who haven't played the games
- `typing_generated_story` can be large (text field), consider excluding it when not needed
- JSONB fields (`disc_bpo_roles`, `typing_ai_analysis`, vocabulary arrays) support GIN indexes for fast queries

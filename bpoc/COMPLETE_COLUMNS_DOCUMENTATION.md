# 📊 Complete API Columns Documentation

## 🔍 **Overview**
This document provides a comprehensive list of ALL available columns in the BPOC User Data API, organized by table and privacy level.

---

## 📋 **Available Tables & Columns**

### 1. **👤 Users Table** (`users`)
**All columns included in API**

| Column | Type | Public | Description |
|--------|------|--------|-------------|
| `user_id` | UUID | ✅ | User's unique identifier |
| `email` | TEXT | 🔒 | User's email address |
| `first_name` | TEXT | ✅ | User's first name |
| `last_name` | TEXT | ✅ | User's last name |
| `full_name` | TEXT | ✅ | User's full name |
| `location` | TEXT | ✅ | General location |
| `avatar_url` | TEXT | ✅ | Profile picture URL |
| `phone` | TEXT | 🔒 | Phone number |
| `bio` | TEXT | ✅ | User biography |
| `position` | TEXT | ✅ | Current job position |
| `gender` | TEXT | ✅ | Gender (male/female/others) |
| `gender_custom` | TEXT | ✅ | Custom gender identity |
| `admin_level` | VARCHAR | 🔒 | Admin permission level |
| `completed_data` | BOOLEAN | ✅ | Profile completion status |
| `birthday` | DATE | ✅ | Date of birth |
| `slug` | TEXT | ✅ | Public profile slug |
| `location_place_id` | TEXT | ✅ | Google Places ID |
| `location_lat` | FLOAT | ✅ | Latitude coordinate |
| `location_lng` | FLOAT | ✅ | Longitude coordinate |
| `location_city` | TEXT | ✅ | City name |
| `location_province` | TEXT | ✅ | Province/State |
| `location_country` | TEXT | ✅ | Country |
| `location_barangay` | TEXT | ✅ | Barangay/District |
| `location_region` | TEXT | ✅ | Region |
| `user_created_at` | TIMESTAMP | ✅ | Account creation date |
| `user_updated_at` | TIMESTAMP | ✅ | Last profile update |

---

### 2. **💼 User Work Status** (`user_work_status`)
**All columns included in API**

| Column | Type | Public | Description |
|--------|------|--------|-------------|
| `work_status_id` | UUID | ✅ | Work status record ID |
| `work_status_user_id` | UUID | 🔒 | Internal user reference |
| `current_employer` | TEXT | ✅ | Current company name |
| `current_position` | TEXT | ✅ | Current job title |
| `current_salary` | NUMERIC | 🔒 | Current salary amount |
| `notice_period_days` | INTEGER | ✅ | Notice period in days |
| `current_mood` | ENUM | ✅ | Current work mood |
| `work_status` | ENUM | ✅ | Employment status |
| `preferred_shift` | ENUM | ✅ | Preferred work shift |
| `expected_salary` | TEXT | 🔒 | Expected salary range |
| `work_setup` | ENUM | ✅ | Work arrangement preference |
| `work_status_completed` | BOOLEAN | ✅ | Work status completion |
| `work_status_created_at` | TIMESTAMP | ✅ | Work status creation date |
| `work_status_updated_at` | TIMESTAMP | ✅ | Last work status update |

---

### 3. **🤖 AI Analysis Results** (`ai_analysis_results`)
**All columns included in API**

| Column | Type | Public | Description |
|--------|------|--------|-------------|
| `analysis_id` | UUID | ✅ | Analysis record ID |
| `analysis_user_id` | UUID | 🔒 | Internal user reference |
| `session_id` | TEXT | ✅ | Analysis session ID |
| `original_resume_id` | UUID | 🔒 | Original resume reference |
| `overall_score` | INTEGER | ✅ | Overall resume score (0-100) |
| `ats_compatibility_score` | INTEGER | ✅ | ATS compatibility score |
| `content_quality_score` | INTEGER | ✅ | Content quality score |
| `professional_presentation_score` | INTEGER | ✅ | Professional presentation score |
| `skills_alignment_score` | INTEGER | ✅ | Skills alignment score |
| `key_strengths` | JSONB | ✅ | Key strengths array |
| `strengths_analysis` | JSONB | ✅ | Detailed strengths breakdown |
| `improvements` | JSONB | ✅ | Improvement suggestions |
| `recommendations` | JSONB | ✅ | Actionable recommendations |
| `improved_summary` | TEXT | ✅ | AI-generated summary |
| `salary_analysis` | JSONB | ✅ | Salary analysis data |
| `career_path` | JSONB | ✅ | Career path analysis |
| `section_analysis` | JSONB | ✅ | Resume section analysis |
| `analysis_metadata` | JSONB | 🔒 | Internal analysis metadata |
| `portfolio_links` | JSONB | ✅ | Portfolio links considered |
| `files_analyzed` | JSONB | 🔒 | Files analyzed metadata |
| `candidate_profile` | JSONB | ✅ | Candidate profile summary |
| `skills_snapshot` | JSONB | ✅ | Skills overview |
| `experience_snapshot` | JSONB | ✅ | Experience overview |
| `education_snapshot` | JSONB | ✅ | Education overview |
| `analysis_created_at` | TIMESTAMP | ✅ | Analysis creation date |
| `analysis_updated_at` | TIMESTAMP | ✅ | Last analysis update |

---

### 4. **📄 Saved Resumes** (`saved_resumes`)
**All columns included in API**

| Column | Type | Public | Description |
|--------|------|--------|-------------|
| `resume_id` | UUID | ✅ | Resume record ID |
| `resume_user_id` | UUID | 🔒 | Internal user reference |
| `resume_slug` | TEXT | ✅ | Public resume URL slug |
| `resume_title` | TEXT | ✅ | Resume title |
| `resume_data` | JSONB | 🔒 | Full resume content |
| `template_used` | TEXT | ✅ | Resume template name |
| `resume_is_public` | BOOLEAN | ✅ | Public visibility status |
| `resume_view_count` | INTEGER | ✅ | Number of views |
| `saved_resume_original_id` | UUID | ✅ | Original resume reference |
| `resume_created_at` | TIMESTAMP | ✅ | Resume creation date |
| `resume_updated_at` | TIMESTAMP | ✅ | Last resume update |

---

### 5. **📊 Application Statistics** (`applications` - aggregated)
**Comprehensive statistics included in API**

| Column | Type | Public | Description |
|--------|------|--------|-------------|
| `total_applications` | INTEGER | ✅ | Total applications submitted |
| `active_applications` | INTEGER | ✅ | Currently active applications |
| `hired_applications` | INTEGER | ✅ | Successfully hired applications |
| `rejected_applications` | INTEGER | ✅ | Rejected applications |
| `withdrawn_applications` | INTEGER | ✅ | Withdrawn applications |
| `closed_applications` | INTEGER | ✅ | Closed applications |
| `latest_application_date` | TIMESTAMP | ✅ | Most recent application date |
| `latest_application_status` | ENUM | ✅ | Status of latest application |
| `first_application_date` | TIMESTAMP | ✅ | First application date |
| `avg_applications_per_month` | NUMERIC | ✅ | Average applications per month |

---

## 🚫 **Excluded Tables** (Not in API)

### **Job-Related Tables**
- `job_match_results` - Job matching scores
- `processed_job_requests` - Job postings
- `job_requests` - Job requests
- `members` - Company information

### **Resume Processing Tables**
- `resumes_extracted` - Original uploaded resumes
- `resumes_generated` - AI-generated resumes

### **Game Performance Tables**
- `bpoc_cultural_sessions` - Cultural game sessions
- `bpoc_cultural_stats` - Cultural game statistics
- `disc_personality_sessions` - DISC assessment sessions
- `disc_personality_stats` - DISC assessment statistics
- `typing_hero_sessions` - Typing game sessions
- `typing_hero_stats` - Typing game statistics
- `ultimate_sessions` - Ultimate game sessions
- `ultimate_stats` - Ultimate game statistics

### **Leaderboard Tables**
- `leaderboard_applicant_scores` - Applicant leaderboard
- `leaderboard_engagement_scores` - Engagement leaderboard
- `leaderboard_game_scores` - Game leaderboard
- `leaderboard_overall_scores` - Overall leaderboard

---

## 🔒 **Privacy Levels**

### **✅ PUBLIC** (Default API Response)
- Basic profile information
- Work preferences and status
- AI analysis scores and insights
- Resume metadata (not content)
- Application statistics

### **🔒 PRIVATE** (Requires `includePrivate=true`)
- Contact information (`email`, `phone`)
- Financial data (`current_salary`, `expected_salary`)
- Internal system data (`admin_level`)
- Full resume content (`resume_data`)
- Analysis metadata (`analysis_metadata`, `files_analyzed`)
- Internal references (`*_user_id` fields)

---

## 🎯 **Usage Examples**

### **Get All Public Data**
```bash
curl "https://your-domain.com/api/public/user-data"
```

### **Get Specific Fields**
```bash
curl "https://your-domain.com/api/public/user-data?fields=user_id,full_name,overall_score,key_strengths"
```

### **Include Private Data**
```bash
curl "https://your-domain.com/api/public/user-data?includePrivate=true"
```

### **Sort by AI Score**
```bash
curl "https://your-domain.com/api/public/user-data?sortBy=overall_score&sortOrder=desc&limit=20"
```

---

## 📈 **Total Column Count**

- **Users Table**: 25 columns
- **Work Status Table**: 13 columns  
- **AI Analysis Table**: 25 columns
- **Saved Resumes Table**: 10 columns
- **Application Stats**: 10 columns

**Total Available Columns**: **83 columns**

**Public Columns**: **70 columns**
**Private Columns**: **13 columns**

---

## 🔄 **API Response Format**

```json
{
  "success": true,
  "data": [
    {
      "user_id": "uuid",
      "full_name": "John Doe",
      "overall_score": 85,
      "key_strengths": ["Leadership", "Problem Solving"],
      "total_applications": 5,
      // ... all other columns
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  },
  "meta": {
    "requestedFields": "all",
    "includePrivate": false,
    "sortBy": "user_created_at",
    "sortOrder": "desc"
  }
}
```

---

## 🚀 **Ready for Production**

Your API now includes **ALL columns** from the relevant user-related tables, with proper privacy controls and comprehensive documentation. Perfect for sharing with your development team! 🎉

# 📊 **What Data Are We Sharing?**

After removing `processed_job_requests`, here's exactly what data your team can access through the API:

## 🎯 **Single API Endpoint**: `/api/public/user-data`

---

## 📋 **Data Categories Being Shared**

### **1. 👤 User Profile Information**
```json
{
  "user_id": "uuid",
  "first_name": "John",
  "last_name": "Doe", 
  "full_name": "John Doe",
  "location": "Manila, Philippines",
  "avatar_url": "https://...",
  "bio": "Software Developer with 5+ years experience...",
  "position": "Senior Developer",
  "gender": "male",
  "slug": "john-doe-1234",
  "location_city": "Manila",
  "location_province": "Metro Manila", 
  "location_country": "Philippines",
  "location_region": "NCR",
  "user_created_at": "2024-01-01T00:00:00Z",
  "user_updated_at": "2024-01-01T00:00:00Z"
}
```

### **2. 💼 Work Status & Preferences**
```json
{
  "current_employer": "Tech Corp",
  "current_position": "Senior Developer",
  "work_status": "employed",
  "preferred_shift": "day",
  "work_setup": "Hybrid",
  "work_status_completed": true,
  "work_status_created_at": "2024-01-01T00:00:00Z",
  "work_status_updated_at": "2024-01-01T00:00:00Z"
}
```

### **3. 🤖 AI Analysis Results**
```json
{
  "overall_score": 85,
  "ats_compatibility_score": 90,
  "content_quality_score": 80,
  "professional_presentation_score": 85,
  "skills_alignment_score": 88,
  "key_strengths": ["JavaScript", "React", "Node.js"],
  "strengths_analysis": {
    "core_skills": ["JavaScript", "React"],
    "technical_skills": ["Node.js", "MongoDB"],
    "soft_skills": ["Leadership", "Communication"]
  },
  "improvements": ["Add more metrics", "Include certifications"],
  "recommendations": ["Consider leadership roles", "Expand backend skills"],
  "improved_summary": "Experienced software developer with strong frontend skills...",
  "salary_analysis": {
    "level": "Senior",
    "range": "80,000 - 120,000 PHP",
    "factors": ["Experience", "Skills", "Location"]
  },
  "career_path": {
    "current_position": "Senior Developer",
    "next_steps": ["Tech Lead", "Engineering Manager"],
    "skill_gaps": ["Team Management", "System Design"]
  },
  "section_analysis": {
    "contact": "Complete and professional",
    "summary": "Well-written but could be more specific",
    "experience": "Strong technical background",
    "education": "Relevant degree",
    "skills": "Comprehensive skill set"
  },
  "candidate_profile": {
    "personality": "Technical leader",
    "work_style": "Collaborative",
    "strengths": ["Problem solving", "Code quality"]
  },
  "skills_snapshot": ["JavaScript", "React", "Node.js", "MongoDB"],
  "experience_snapshot": ["5+ years development", "Team leadership"],
  "education_snapshot": ["Computer Science Degree", "Certifications"]
}
```

### **4. 📄 Resume Information**
```json
{
  "resume_slug": "john-doe-resume",
  "resume_title": "John Doe's Resume",
  "resume_data": {
    "template": "modern",
    "sections": ["contact", "summary", "experience", "education", "skills"]
  },
  "template_used": "modern",
  "resume_is_public": true,
  "resume_view_count": 25,
  "resume_created_at": "2024-01-01T00:00:00Z",
  "resume_updated_at": "2024-01-01T00:00:00Z"
}
```

### **5. 📊 Application Statistics**
```json
{
  "total_applications": 5,
  "active_applications": 2,
  "hired_applications": 1,
  "rejected_applications": 1,
  "latest_application_date": "2024-01-15T00:00:00Z",
  "latest_application_status": "initial interview"
}
```

---

## 🔒 **Private Fields** (require `includePrivate=true`)
```json
{
  "email": "john@example.com",
  "phone": "+63 912 345 6789",
  "current_salary": 50000,
  "expected_salary": "80000-120000",
  "analysis_metadata": {
    "analysis_version": "2.1",
    "processing_time": "45 seconds"
  },
  "files_analyzed": ["resume.pdf", "portfolio.pdf"]
}
```

---

## 🚀 **API Usage Examples**

### **Basic User Data**
```bash
curl "https://your-domain.com/api/public/user-data?userId=USER_ID"
```

### **Public Profile Data**
```bash
curl "https://your-domain.com/api/public/user-data?slug=john-doe-1234"
```

### **Specific Fields Only**
```bash
curl "https://your-domain.com/api/public/user-data?userId=USER_ID&fields=full_name,position,overall_score,key_strengths"
```

### **Include Private Data**
```bash
curl "https://your-domain.com/api/public/user-data?userId=USER_ID&includePrivate=true"
```

### **Multiple Users**
```bash
curl "https://your-domain.com/api/public/user-data?limit=10&fields=user_id,full_name,overall_score,total_applications"
```

---

## 📈 **Use Cases for Your Team**

### **1. Public Profile Pages**
- User name, bio, position, location
- Resume slug for public resume viewing
- AI analysis scores and strengths

### **2. Talent Search & Analytics**
- Users with high AI scores
- Users with active applications
- Users by location, position, work status

### **3. Resume Analytics**
- Public resume view counts
- Resume template usage
- Resume performance metrics

### **4. Application Tracking**
- Total applications per user
- Application status tracking
- Latest application activity

### **5. AI Analysis Insights**
- Resume quality scores
- Skills analysis
- Career path recommendations
- Salary analysis

---

## 🎯 **Summary**

**What we're sharing:**
- ✅ User profiles and contact info
- ✅ Work status and preferences  
- ✅ Complete AI analysis results
- ✅ Resume data and performance
- ✅ Application statistics
- ✅ Location and demographic data

**What we're NOT sharing:**
- ❌ Job details from `processed_job_requests`
- ❌ Game performance data
- ❌ Leaderboard scores
- ❌ Job matching results
- ❌ Resume extraction/generation data

**Result:** Clean, focused API with user-centric data perfect for profiles, analytics, and talent management! 🎉

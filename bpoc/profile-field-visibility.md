# Profile Field Visibility Documentation

## 📋 **Three Separate Table Views**

---

## 🔐 **Table 1: Owner Viewing Own Profile**

| Field Category | Field Name | Visibility | Edit Capability | Notes |
|---|---|---|---|---|
| **👤 Personal Information** |
| | `first_name` | ✅ **Visible** | ✅ **Editable** | Full access |
| | `last_name` | ✅ **Visible** | ✅ **Editable** | Full access |
| | `full_name` | ✅ **Visible** | ✅ **Editable** | Auto-generated |
| | `email` | ✅ **Visible** | ✅ **Editable** | Contact info |
| | `phone` | ✅ **Visible** | ✅ **Editable** | Contact info |
| | `location` | ✅ **Visible** | ✅ **Editable** | Location data |
| | `avatar_url` | ✅ **Visible** | ✅ **Editable** | Profile photo |
| | `bio` | ✅ **Visible** | ✅ **Editable** | Bio text |
| | `position` | ✅ **Visible** | ✅ **Editable** | Job title |
| | `gender` | ✅ **Visible** | ✅ **Editable** | Gender info |
| | `gender_custom` | ✅ **Visible** | ✅ **Editable** | Custom gender |
| | `birthday` | ✅ **Visible** | ✅ **Editable** | Birth date |
| | `age` | ✅ **Visible** | ❌ **Read-only** | Calculated from birthday |
| **💼 Work Status** |
| | `current_employer` | ✅ **Visible** | ✅ **Editable** | Company name |
| | `current_position` | ✅ **Visible** | ✅ **Editable** | Job position |
| | `current_salary` | ✅ **Visible** | ✅ **Editable** | Current pay |
| | `work_status` | ✅ **Visible** | ✅ **Editable** | Employment status |
| | `preferred_shift` | ✅ **Visible** | ✅ **Editable** | Shift preference |
| | `work_setup` | ✅ **Visible** | ✅ **Editable** | Work arrangement |
| | `expected_salary` | ✅ **Visible** | ✅ **Editable** | Salary expectation |
| | `notice_period_days` | ✅ **Visible** | ✅ **Editable** | Notice period |
| | `current_mood` | ✅ **Visible** | ✅ **Editable** | Job satisfaction |
| **🤖 AI Analysis Results** |
| | `overall_score` | ✅ **Visible** | ❌ **Read-only** | AI analysis score |
| | `ats_compatibility_score` | ✅ **Visible** | ❌ **Read-only** | ATS compatibility |
| | `content_quality_score` | ✅ **Visible** | ❌ **Read-only** | Content quality |
| | `professional_presentation_score` | ✅ **Visible** | ❌ **Read-only** | Presentation score |
| | `skills_alignment_score` | ✅ **Visible** | ❌ **Read-only** | Skills alignment |
| | `key_strengths` | ✅ **Visible** | ❌ **Read-only** | Identified strengths |
| | `strengths_analysis` | ✅ **Visible** | ❌ **Read-only** | Detailed analysis |
| | `improvements` | ✅ **Visible** | ❌ **Read-only** | Improvement suggestions |
| | `recommendations` | ✅ **Visible** | ❌ **Read-only** | AI recommendations |
| | `improved_summary` | ✅ **Visible** | ❌ **Read-only** | AI-generated summary |
| | `salary_analysis` | ✅ **Visible** | ❌ **Read-only** | Salary insights |
| | `career_path` | ✅ **Visible** | ❌ **Read-only** | Career recommendations |
| | `section_analysis` | ✅ **Visible** | ❌ **Read-only** | Section-by-section analysis |
| **🎮 Game Results** |
| | `bpoc_cultural_stats` | ✅ **Visible** | ❌ **Read-only** | Cultural game results |
| | `disc_personality_stats` | ✅ **Visible** | ❌ **Read-only** | DISC personality results |
| | `typing_hero_stats` | ✅ **Visible** | ❌ **Read-only** | Typing test results |
| | `ultimate_stats` | ✅ **Visible** | ❌ **Read-only** | Ultimate game results |
| | `completed_games` | ✅ **Visible** | ❌ **Read-only** | Games completed count |
| **🔧 System Information** |
| | `created_at` | ✅ **Visible** | ❌ **Read-only** | Account creation date |
| | `updated_at` | ✅ **Visible** | ❌ **Read-only** | Last update date |
| | `slug` | ✅ **Visible** | ❌ **Read-only** | Profile URL slug |
| | `username` | ✅ **Visible** | ❌ **Read-only** | Username |

---

## 👤 **Table 2: Anonymous User (Not Logged In)**

| Field Category | Field Name | Visibility | Notes |
|---|---|---|---|
| **👤 Personal Information** |
| | `first_name` | ✅ **Visible** | Public information |
| | `last_name` | ✅ **Visible** | Public information |
| | `full_name` | ✅ **Visible** | Public information |
| | `email` | ❌ **Hidden** | Private contact info |
| | `phone` | ❌ **Hidden** | Private contact info |
| | `location` | ✅ **Visible** | Public location |
| | `avatar_url` | ✅ **Visible** | Public profile photo |
| | `bio` | ✅ **Visible** | Public bio |
| | `position` | ✅ **Visible** | Public job title |
| | `gender` | ❌ **Hidden** | Private personal info |
| | `gender_custom` | ❌ **Hidden** | Private personal info |
| | `birthday` | ❌ **Hidden** | Private personal info |
| | `age` | ✅ **Visible** | Calculated and shown |
| **💼 Work Status** |
| | `current_employer` | ✅ **Visible** | Public work info |
| | `current_position` | ✅ **Visible** | Public work info |
| | `current_salary` | ❌ **Hidden** | Private financial info |
| | `work_status` | ✅ **Visible** | Public work status |
| | `preferred_shift` | ✅ **Visible** | Public preference |
| | `work_setup` | ✅ **Visible** | Public preference |
| | `expected_salary` | ✅ **Visible** | Public expectation |
| | `notice_period_days` | ❌ **Hidden** | Private work details |
| | `current_mood` | ❌ **Hidden** | Private work details |
| **🤖 AI Analysis Results** |
| | `overall_score` | ✅ **Visible** | Public analysis |
| | `ats_compatibility_score` | ✅ **Visible** | Public analysis |
| | `content_quality_score` | ✅ **Visible** | Public analysis |
| | `professional_presentation_score` | ✅ **Visible** | Public analysis |
| | `skills_alignment_score` | ✅ **Visible** | Public analysis |
| | `key_strengths` | ✅ **Visible** | Public analysis |
| | `strengths_analysis` | ✅ **Visible** | Public analysis |
| | `improvements` | ✅ **Visible** | Public analysis |
| | `recommendations` | ✅ **Visible** | Public analysis |
| | `improved_summary` | ✅ **Visible** | Public analysis |
| | `salary_analysis` | ❌ **Hidden** | Private financial analysis |
| | `career_path` | ✅ **Visible** | Public analysis |
| | `section_analysis` | ✅ **Visible** | Public analysis |
| **🎮 Game Results** |
| | `bpoc_cultural_stats` | ✅ **Visible** | Public game results |
| | `disc_personality_stats` | ✅ **Visible** | Public game results |
| | `typing_hero_stats` | ✅ **Visible** | Public game results |
| | `ultimate_stats` | ✅ **Visible** | Public game results |
| | `completed_games` | ✅ **Visible** | Public game count |
| **🔧 System Information** |
| | `created_at` | ✅ **Visible** | Public account info |
| | `updated_at` | ❌ **Hidden** | Private system info |
| | `slug` | ✅ **Visible** | Public profile URL |
| | `username` | ✅ **Visible** | Public username |

---

## 🔑 **Table 3: Logged-in User Viewing Other Profiles**

| Field Category | Field Name | Visibility | Notes |
|---|---|---|---|
| **👤 Personal Information** |
| | `first_name` | ✅ **Visible** | Same as anonymous |
| | `last_name` | ✅ **Visible** | Same as anonymous |
| | `full_name` | ✅ **Visible** | Same as anonymous |
| | `email` | ❌ **Hidden** | Same as anonymous |
| | `phone` | ❌ **Hidden** | Same as anonymous |
| | `location` | ✅ **Visible** | Same as anonymous |
| | `avatar_url` | ✅ **Visible** | Same as anonymous |
| | `bio` | ✅ **Visible** | Same as anonymous |
| | `position` | ✅ **Visible** | Same as anonymous |
| | `gender` | ❌ **Hidden** | Same as anonymous |
| | `gender_custom` | ❌ **Hidden** | Same as anonymous |
| | `birthday` | ❌ **Hidden** | Same as anonymous |
| | `age` | ✅ **Visible** | Same as anonymous |
| **💼 Work Status** |
| | `current_employer` | ✅ **Visible** | Same as anonymous |
| | `current_position` | ✅ **Visible** | Same as anonymous |
| | `current_salary` | ❌ **Hidden** | Same as anonymous |
| | `work_status` | ✅ **Visible** | Same as anonymous |
| | `preferred_shift` | ✅ **Visible** | Same as anonymous |
| | `work_setup` | ✅ **Visible** | Same as anonymous |
| | `expected_salary` | ✅ **Visible** | Same as anonymous |
| | `notice_period_days` | ❌ **Hidden** | Same as anonymous |
| | `current_mood` | ❌ **Hidden** | Same as anonymous |
| **🤖 AI Analysis Results** |
| | `overall_score` | ✅ **Visible** | Same as anonymous |
| | `ats_compatibility_score` | ✅ **Visible** | Same as anonymous |
| | `content_quality_score` | ✅ **Visible** | Same as anonymous |
| | `professional_presentation_score` | ✅ **Visible** | Same as anonymous |
| | `skills_alignment_score` | ✅ **Visible** | Same as anonymous |
| | `key_strengths` | ✅ **Visible** | Same as anonymous |
| | `strengths_analysis` | ✅ **Visible** | Same as anonymous |
| | `improvements` | ✅ **Visible** | Same as anonymous |
| | `recommendations` | ✅ **Visible** | Same as anonymous |
| | `improved_summary` | ✅ **Visible** | Same as anonymous |
| | `salary_analysis` | ❌ **Hidden** | Same as anonymous |
| | `career_path` | ✅ **Visible** | Same as anonymous |
| | `section_analysis` | ✅ **Visible** | Same as anonymous |
| **🎮 Game Results** |
| | `bpoc_cultural_stats` | ✅ **Visible** | Same as anonymous |
| | `disc_personality_stats` | ✅ **Visible** | Same as anonymous |
| | `typing_hero_stats` | ✅ **Visible** | Same as anonymous |
| | `ultimate_stats` | ✅ **Visible** | Same as anonymous |
| | `completed_games` | ✅ **Visible** | Same as anonymous |
| **🔧 System Information** |
| | `created_at` | ✅ **Visible** | Same as anonymous |
| | `updated_at` | ❌ **Hidden** | Same as anonymous |
| | `slug` | ✅ **Visible** | Same as anonymous |
| | `username` | ✅ **Visible** | Same as anonymous |

---

## 🔍 **Quick Reference Summary**

### **🌐 Always Public Fields (Visible to Everyone)**
- **Basic profile info**: `first_name`, `last_name`, `full_name`, `location`, `avatar_url`, `bio`, `position`
- **Work preferences**: `current_employer`, `current_position`, `work_status`, `preferred_shift`, `work_setup`, `expected_salary`
- **AI analysis**: All scores, `key_strengths`, `strengths_analysis`, `improvements`, `recommendations`, `improved_summary`, `career_path`, `section_analysis`
- **Game results**: All game statistics and completion data
- **System info**: `created_at`, `slug`, `username`, `age` (calculated)

### **🔒 Private Fields (Owner Only)**
- **Contact info**: `email`, `phone`
- **Personal details**: `gender`, `gender_custom`, `birthday`
- **Sensitive work info**: `current_salary`, `notice_period_days`, `current_mood`
- **Detailed analysis**: `salary_analysis`
- **System info**: `updated_at`

### **✏️ Owner-Only Features**
- **Edit Capabilities**: Personal info, work status, bio, profile photo
- **Work Status Tab**: Only visible to profile owner
- **Full Data Access**: All fields visible including private ones

---

## 🔐 **Privacy Settings Framework**

The system includes a privacy settings framework with these default visibility levels:

```typescript
privacySettings = {
  // Overview
  username: 'public',
  firstName: 'public', 
  lastName: 'only-me',        // Hidden from others
  location: 'public',
  jobTitle: 'public',
  birthday: 'only-me',        // Hidden from others
  age: 'only-me',             // Hidden from others
  gender: 'only-me',          // Hidden from others
  
  // Work Status  
  workStatus: 'public',
  expectedSalaryRange: 'only-me',  // Hidden from others
  currentEmployer: 'public',
  noticePeriod: 'only-me',         // Hidden from others
  moodAtCurrentEmployer: 'only-me', // Hidden from others
  preferredShift: 'public',
  preferredWorkSetup: 'public',
  currentSalary: 'only-me',         // Hidden from others
  
  // AI Analysis
  detailedAnalysisScores: 'public',
  salaryAnalysis: 'only-me',       // Hidden from others
  
  // Game Results
  bpocCultural: 'public',
  bpocDisc: 'public', 
  typingHero: 'public',
  bpocUltimate: 'public'
}
```

---

## 📡 **API Endpoint Differences**

### **Private API (`/api/user/profile`)**
- **Used by**: Profile owner only
- **Returns**: Complete user data including sensitive fields
- **Authentication**: Required (Bearer token)

### **Public APIs (`/api/public/user-by-slug`, `/api/public/user-data`)**
- **Used by**: Anyone (anonymous or logged-in)
- **Returns**: Filtered data excluding sensitive fields
- **Authentication**: Not required

### **Field Filtering Logic**
```typescript
// From /api/public/user-data/route.ts
const privateFields = [
  'email', 'phone', 'current_salary',
  'analysis_metadata', 'files_analyzed', 'original_resume_id',
  'admin_level', 'work_status_user_id', 'analysis_user_id'
];
```

---

## 🎯 **Key Insights**

1. **No Additional Access for Logged-in Users**: Logged-in users viewing other profiles have identical visibility to anonymous users
2. **Privacy by Design**: Sensitive personal and financial information is protected by default
3. **Professional Focus**: Career-relevant information is public to facilitate networking
4. **Owner Control**: Profile owners have full control over their data and editing capabilities

---

## 🔍 **Special Cases**

### **Age vs Birthday**
- **Birthday**: Hidden from non-owners
- **Age**: Calculated and shown to everyone (derived from birthday)

### **Work Status Tab**
- **Owner**: Can see and edit all work status fields
- **Others**: Cannot see the "Work Status" tab at all (tab is conditionally rendered)

### **Edit Functionality**
- **Owner**: Edit buttons visible for personal info, work status, bio
- **Others**: No edit functionality available

### **Profile Photo**
- **Owner**: Can upload/edit profile photo
- **Others**: Can only view existing photo

---

## 📊 **Summary**

The profile visibility system follows a **three-tier approach**:

1. **Owner Access**: Complete data + edit capabilities
2. **Public Access**: Professional information visible, personal/sensitive data hidden
3. **Consistent Public View**: Same visibility for both anonymous and logged-in non-owners

This design balances **professional networking** (showing relevant career information) with **privacy protection** (hiding personal/sensitive details) while giving profile owners full control over their data.

---

*Last Updated: January 2025*
*Documentation Version: 1.0*

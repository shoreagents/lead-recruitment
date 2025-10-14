# 🏆 New BPOC Leaderboard Scoring System

## 📋 Overview

This new leaderboard system replaces the old multi-table approach with a **single unified scoring system** that focuses on meaningful user achievements.

### **What Changed**
- ❌ **Removed**: BPOC Cultural, BPOC Ultimate games
- ✅ **Kept**: Typing Hero, DISC Personality
- ✅ **Added**: Profile Completion, Resume Building, Application Activity

### **Old System vs New System**

| Old System | New System |
|------------|------------|
| 4 separate tables | 1 unified table |
| Multiple game types | Focus on Typing Hero + DISC |
| Complex normalization | Direct percentage scores |
| Manual recomputation | Auto-updates with triggers |
| Weekly/Monthly/All periods | Single real-time ranking |

---

## 🎯 Scoring Components

### **Overall Score = 100 points total**

The overall score is a weighted average of 5 components:

```
Overall Score = (Typing Hero × 25%) + (DISC × 25%) + (Profile × 15%) + (Resume × 20%) + (Applications × 15%)
```

---

## 📊 Component Breakdown

### **1. Typing Hero Score (25% weight)**
**Range**: 0-100 points

**Formula**:
```
Typing Score = (Best WPM × 40%) + (Best Accuracy × 30%) + (Avg WPM × 20%) + (Sessions × 10%)
```

**Breakdown**:
- **Best WPM (40%)**: Capped at 100 WPM
  - 0 WPM = 0 points
  - 100+ WPM = 40 points
- **Best Accuracy (30%)**: Based on percentage
  - 0% = 0 points
  - 100% = 30 points
- **Average WPM (20%)**: Capped at 100 WPM
  - 0 WPM = 0 points
  - 100+ WPM = 20 points
- **Sessions (10%)**: Capped at 10 sessions
  - 0 sessions = 0 points
  - 10+ sessions = 10 points

**Example**:
- Best WPM: 75 → 30 points
- Best Accuracy: 90% → 27 points
- Avg WPM: 65 → 13 points
- Sessions: 5 → 5 points
- **Total: 75/100**

---

### **2. DISC Personality Score (25% weight)**
**Range**: 0-100 points

**Formula**:
```
DISC Score = (Confidence × 50%) + (Completed Sessions × 30%) + (Has Primary Type × 20%)
```

**Breakdown**:
- **Confidence Score (50%)**: From assessment
  - 0% confidence = 0 points
  - 100% confidence = 50 points
- **Completed Sessions (30%)**: Capped at 3 sessions
  - 0 sessions = 0 points
  - 3+ sessions = 30 points
- **Has Primary Type (20%)**: Binary
  - No type = 0 points
  - Has type = 20 points

**Example**:
- Confidence: 85% → 42.5 points
- Sessions: 2 → 20 points
- Has Type: Yes → 20 points
- **Total: 82/100 (rounded)**

---

### **3. Profile Completion Score (15% weight)**
**Range**: 0-100 points

**Formula**:
```
Profile Score = Personal Data (30%) + Work Status (30%) + Avatar (15%) + Bio (15%) + Location (10%)
```

**Breakdown**:
- **Personal Data Completed (30%)**: Binary
  - Not completed = 0 points
  - Completed = 30 points
- **Work Status Completed (30%)**: Binary
  - Not completed = 0 points
  - Completed = 30 points
- **Has Avatar (15%)**: Binary
  - No avatar = 0 points
  - Has avatar = 15 points
- **Has Bio (15%)**: Must be >20 characters
  - No/short bio = 0 points
  - Has bio = 15 points
- **Has Location (10%)**: Binary
  - No location = 0 points
  - Has location = 10 points

**Example**:
- Personal Data: ✅ → 30 points
- Work Status: ✅ → 30 points
- Avatar: ✅ → 15 points
- Bio: ✅ → 15 points
- Location: ❌ → 0 points
- **Total: 90/100**

---

### **4. Resume Building Score (20% weight)**
**Range**: 0-100 points

**Formula**:
```
Resume Score = (AI Analysis Score × 70%) + (Has Saved Resume × 30%)
```

**Breakdown**:
- **AI Analysis Score (70%)**: From resume analysis
  - 0/100 AI score = 0 points
  - 100/100 AI score = 70 points
- **Has Saved Resume (30%)**: Binary
  - No saved resume = 0 points
  - Has saved resume = 30 points

**Example**:
- AI Score: 85/100 → 59.5 points
- Has Saved: Yes → 30 points
- **Total: 89/100 (rounded)**

---

### **5. Application Activity Score (15% weight)**
**Range**: 0-100 points

**Formula**:
```
Application Score = (Total Apps × 40%) + (Active Apps × 30%) + (Hired × 20 pts each) + (Passed × 10 pts each)
```

**Breakdown**:
- **Total Applications (40%)**: Capped at 20
  - 0 apps = 0 points
  - 20+ apps = 40 points
- **Active Applications (30%)**: Capped at 10
  - 0 active = 0 points
  - 10+ active = 30 points
- **Hired (20 points each)**: Bonus points
  - Each "hired" status = +20 points
- **Passed (10 points each)**: Bonus points
  - Each "passed" status = +10 points

**Max Score**: 100 (capped)

**Example**:
- Total: 15 apps → 30 points
- Active: 5 apps → 15 points
- Hired: 1 → 20 points
- Passed: 2 → 20 points
- **Total: 85/100**

---

## 🏅 Tier System

Based on overall score:

| Tier | Score Range | Badge Color |
|------|-------------|-------------|
| 💎 **Diamond** | 90-100 | Diamond Blue |
| 💠 **Platinum** | 75-89 | Platinum Silver |
| 🥇 **Gold** | 60-74 | Gold Yellow |
| 🥈 **Silver** | 40-59 | Silver Gray |
| 🥉 **Bronze** | 0-39 | Bronze Orange |

---

## 📈 Example Calculation

Let's calculate a complete user score:

```
User: John Doe

1. Typing Hero Score: 75/100
   - Best WPM: 75 → 30 pts
   - Best Accuracy: 90% → 27 pts
   - Avg WPM: 65 → 13 pts
   - Sessions: 5 → 5 pts
   
2. DISC Score: 82/100
   - Confidence: 85% → 42.5 pts
   - Sessions: 2 → 20 pts
   - Has Type: Yes → 20 pts
   
3. Profile Score: 90/100
   - Personal Data: ✅ → 30 pts
   - Work Status: ✅ → 30 pts
   - Avatar: ✅ → 15 pts
   - Bio: ✅ → 15 pts
   - Location: ❌ → 0 pts
   
4. Resume Score: 89/100
   - AI Score: 85 → 59.5 pts
   - Has Saved: Yes → 30 pts
   
5. Application Score: 85/100
   - Total: 15 → 30 pts
   - Active: 5 → 15 pts
   - Hired: 1 → 20 pts
   - Passed: 2 → 20 pts

Overall Score = (75×0.25) + (82×0.25) + (90×0.15) + (89×0.20) + (85×0.15)
              = 18.75 + 20.5 + 13.5 + 17.8 + 12.75
              = 83.3
              = 83/100

Tier: Platinum 💠
```

---

## 🚀 Implementation Steps

### **Step 1: Create New System**
```sql
-- Run in DBeaver
\i new_leaderboard_system.sql
```

This creates:
- ✅ `user_leaderboard_scores` table
- ✅ `calculate_user_leaderboard_score()` function
- ✅ `update_user_leaderboard_score()` function
- ✅ `recalculate_leaderboard_ranks()` function
- ✅ `update_all_leaderboard_scores()` function
- ✅ Auto-update triggers

### **Step 2: Populate Scores**
```sql
-- Calculate scores for all existing users
SELECT update_all_leaderboard_scores();
```

### **Step 3: Verify Results**
```sql
-- Check top 10 users
SELECT 
    user_id,
    overall_score,
    tier,
    rank_position,
    typing_hero_score,
    disc_personality_score,
    profile_completion_score,
    resume_building_score,
    application_activity_score,
    updated_at
FROM user_leaderboard_scores
ORDER BY overall_score DESC
LIMIT 10;
```

### **Step 4: Drop Old Tables**
```sql
-- ONLY after verifying new system works
\i drop_old_leaderboard_tables.sql
```

---

## 🔄 Auto-Updates

The system automatically updates when:

1. ✅ **Typing Hero**: User completes a session
2. ✅ **DISC Personality**: User completes assessment
3. ✅ **Profile**: User updates personal data, avatar, bio, or location
4. ✅ **Work Status**: User completes work status data
5. ✅ **Resume**: AI analysis completes or overall score changes
6. ✅ **Applications**: User submits application or status changes

**Triggers automatically**:
- Recalculate user's score
- Update tier if score crosses threshold
- Recalculate global ranks

---

## 📊 API Endpoints

### **Get Leaderboard**
```sql
-- Top 100 users
SELECT 
    u.id,
    u.full_name,
    u.avatar_url,
    u.slug,
    uls.overall_score,
    uls.tier,
    uls.rank_position,
    uls.typing_hero_score,
    uls.disc_personality_score,
    uls.profile_completion_score,
    uls.resume_building_score,
    uls.application_activity_score,
    uls.metrics,
    uls.updated_at
FROM user_leaderboard_scores uls
JOIN users u ON u.id = uls.user_id
ORDER BY uls.overall_score DESC, uls.updated_at ASC
LIMIT 100;
```

### **Get User Rank**
```sql
-- Specific user
SELECT 
    overall_score,
    tier,
    rank_position,
    metrics
FROM user_leaderboard_scores
WHERE user_id = 'USER_UUID_HERE';
```

### **Get Tier Rankings**
```sql
-- Users by tier
SELECT 
    tier,
    COUNT(*) as user_count,
    AVG(overall_score) as avg_score
FROM user_leaderboard_scores
GROUP BY tier
ORDER BY AVG(overall_score) DESC;
```

---

## 🎯 Benefits of New System

### **Simpler**
- ✅ One table instead of 4
- ✅ Direct percentage scores (0-100)
- ✅ No complex normalization

### **More Meaningful**
- ✅ Rewards actual user engagement
- ✅ Includes profile completion
- ✅ Values resume quality
- ✅ Tracks job application success

### **Better Performance**
- ✅ Single table queries
- ✅ Indexed for speed
- ✅ Auto-updates with triggers
- ✅ No manual recomputation needed

### **More Transparent**
- ✅ Clear scoring breakdown in `metrics` JSON
- ✅ Easy to understand weights
- ✅ Visible progress for users

---

## 🔍 Monitoring & Maintenance

### **Check System Health**
```sql
-- Total users with scores
SELECT COUNT(*) FROM user_leaderboard_scores;

-- Tier distribution
SELECT tier, COUNT(*) 
FROM user_leaderboard_scores 
GROUP BY tier 
ORDER BY COUNT(*) DESC;

-- Average scores by component
SELECT 
    AVG(typing_hero_score) as avg_typing,
    AVG(disc_personality_score) as avg_disc,
    AVG(profile_completion_score) as avg_profile,
    AVG(resume_building_score) as avg_resume,
    AVG(application_activity_score) as avg_applications,
    AVG(overall_score) as avg_overall
FROM user_leaderboard_scores;
```

### **Manual Refresh (if needed)**
```sql
-- Refresh specific user
SELECT update_user_leaderboard_score('USER_UUID');

-- Refresh all users
SELECT update_all_leaderboard_scores();

-- Recalculate ranks only
SELECT recalculate_leaderboard_ranks();
```

---

## 🎮 User Experience

Users can now see:
1. **Overall Rank** - Their position among all users
2. **Tier Badge** - Bronze, Silver, Gold, Platinum, or Diamond
3. **Component Scores** - Breakdown of their 5 scores
4. **Progress Bar** - Visual representation of each component
5. **Next Tier** - How many points until next tier
6. **Detailed Metrics** - Full JSON breakdown in their profile

---

## ✅ Migration Checklist

- [ ] Run `new_leaderboard_system.sql` in DBeaver
- [ ] Run `SELECT update_all_leaderboard_scores();` to populate
- [ ] Verify top 10 users look correct
- [ ] Test with a few user updates (typing, DISC, profile)
- [ ] Confirm auto-updates are working
- [ ] Update API endpoints to use new table
- [ ] Update frontend to display new leaderboard
- [ ] Run `drop_old_leaderboard_tables.sql` to clean up
- [ ] Update documentation for users
- [ ] Celebrate! 🎉

---

## 📝 Notes

- **No data loss**: Old game data remains in `typing_hero_stats`, `disc_personality_stats`, etc.
- **Reversible**: Can rebuild old tables if needed (not recommended)
- **Performance**: Triggers are lightweight and fast
- **Scalability**: Designed for millions of users
- **Flexibility**: Easy to adjust weights by modifying the function

---

**Ready to launch the new leaderboard system!** 🚀


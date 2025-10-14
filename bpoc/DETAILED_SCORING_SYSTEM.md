# 🎯 Detailed BPOC Leaderboard Scoring System

## 📊 Complete Scoring Breakdown

### **Overall Score Formula**
```
Overall Score = (Typing Hero × 25%) + (DISC × 25%) + (Profile × 15%) + (Resume × 20%) + (Applications × 15%)
```

**Maximum Possible**: 100 points  
**Minimum Possible**: 0 points  
**Tier Thresholds**: Bronze (0-39), Silver (40-59), Gold (60-74), Platinum (75-89), Diamond (90-100)

---

## 🎮 1. TYPING HERO SCORE (25% weight)

### **Formula Breakdown**
```
Typing Score = (Best WPM × 40%) + (Best Accuracy × 30%) + (Avg WPM × 20%) + (Sessions × 10%)
```

### **Component Details**

#### **A. Best WPM Score (40 points max)**
- **Calculation**: `MIN(best_wpm, 100) / 100 * 40`
- **Range**: 0-40 points
- **Examples**:
  - 0 WPM → 0 points
  - 25 WPM → 10 points
  - 50 WPM → 20 points
  - 75 WPM → 30 points
  - 100+ WPM → 40 points (capped)

#### **B. Best Accuracy Score (30 points max)**
- **Calculation**: `best_accuracy / 100 * 30`
- **Range**: 0-30 points
- **Examples**:
  - 0% accuracy → 0 points
  - 50% accuracy → 15 points
  - 80% accuracy → 24 points
  - 95% accuracy → 28.5 points
  - 100% accuracy → 30 points

#### **C. Average WPM Score (20 points max)**
- **Calculation**: `MIN(avg_wpm, 100) / 100 * 20`
- **Range**: 0-20 points
- **Examples**:
  - 0 avg WPM → 0 points
  - 30 avg WPM → 6 points
  - 60 avg WPM → 12 points
  - 90 avg WPM → 18 points
  - 100+ avg WPM → 20 points (capped)

#### **D. Sessions Score (10 points max)**
- **Calculation**: `MIN(completed_sessions, 10) / 10 * 10`
- **Range**: 0-10 points
- **Examples**:
  - 0 sessions → 0 points
  - 2 sessions → 2 points
  - 5 sessions → 5 points
  - 10+ sessions → 10 points (capped)

### **Real Examples**

#### **Example 1: Beginner Player**
```
Data: best_wpm=30, best_accuracy=70%, avg_wpm=25, completed_sessions=3
Calculation:
- Best WPM: 30/100 * 40 = 12 points
- Best Accuracy: 70/100 * 30 = 21 points
- Avg WPM: 25/100 * 20 = 5 points
- Sessions: 3/10 * 10 = 3 points
Total: 12 + 21 + 5 + 3 = 41/100
```

#### **Example 2: Advanced Player**
```
Data: best_wpm=85, best_accuracy=95%, avg_wpm=75, completed_sessions=8
Calculation:
- Best WPM: 85/100 * 40 = 34 points
- Best Accuracy: 95/100 * 30 = 28.5 points
- Avg WPM: 75/100 * 20 = 15 points
- Sessions: 8/10 * 10 = 8 points
Total: 34 + 28.5 + 15 + 8 = 85.5/100 → 86/100
```

#### **Example 3: Expert Player**
```
Data: best_wpm=120, best_accuracy=98%, avg_wpm=110, completed_sessions=15
Calculation:
- Best WPM: MIN(120,100)/100 * 40 = 40 points (capped)
- Best Accuracy: 98/100 * 30 = 29.4 points
- Avg WPM: MIN(110,100)/100 * 20 = 20 points (capped)
- Sessions: MIN(15,10)/10 * 10 = 10 points (capped)
Total: 40 + 29.4 + 20 + 10 = 99.4/100 → 99/100
```

---

## 🧠 2. DISC PERSONALITY SCORE (25% weight)

### **Formula Breakdown**
```
DISC Score = (Confidence × 50%) + (Completed Sessions × 30%) + (Has Primary Type × 20%)
```

### **Component Details**

#### **A. Confidence Score (50 points max)**
- **Source**: `best_confidence_score` from `disc_personality_stats`
- **Calculation**: `confidence_score * 0.5`
- **Range**: 0-50 points
- **Examples**:
  - 0% confidence → 0 points
  - 50% confidence → 25 points
  - 80% confidence → 40 points
  - 100% confidence → 50 points

#### **B. Completed Sessions Score (30 points max)**
- **Source**: `completed_sessions` from `disc_personality_stats`
- **Calculation**: `MIN(completed_sessions, 3) / 3 * 30`
- **Range**: 0-30 points
- **Examples**:
  - 0 sessions → 0 points
  - 1 session → 10 points
  - 2 sessions → 20 points
  - 3+ sessions → 30 points (capped)

#### **C. Has Primary Type Score (20 points max)**
- **Source**: `latest_primary_type` from `disc_personality_stats`
- **Calculation**: Binary (20 or 0)
- **Range**: 0 or 20 points
- **Examples**:
  - No primary type → 0 points
  - Has primary type (D/I/S/C) → 20 points

### **Real Examples**

#### **Example 1: First-Time User**
```
Data: confidence_score=65, completed_sessions=1, latest_primary_type='D'
Calculation:
- Confidence: 65 * 0.5 = 32.5 points
- Sessions: 1/3 * 30 = 10 points
- Has Type: Yes → 20 points
Total: 32.5 + 10 + 20 = 62.5/100 → 63/100
```

#### **Example 2: Regular User**
```
Data: confidence_score=85, completed_sessions=2, latest_primary_type='I'
Calculation:
- Confidence: 85 * 0.5 = 42.5 points
- Sessions: 2/3 * 30 = 20 points
- Has Type: Yes → 20 points
Total: 42.5 + 20 + 20 = 82.5/100 → 83/100
```

#### **Example 3: Expert User**
```
Data: confidence_score=95, completed_sessions=5, latest_primary_type='S'
Calculation:
- Confidence: 95 * 0.5 = 47.5 points
- Sessions: MIN(5,3)/3 * 30 = 30 points (capped)
- Has Type: Yes → 20 points
Total: 47.5 + 30 + 20 = 97.5/100 → 98/100
```

---

## 👤 3. PROFILE COMPLETION SCORE (15% weight)

### **Formula Breakdown**
```
Profile Score = Personal Data (30%) + Work Status (30%) + Avatar (15%) + Bio (15%) + Location (10%)
```

### **Component Details**

#### **A. Personal Data Completed (30 points max)**
- **Source**: `completed_data` from `users` table
- **Calculation**: Binary (30 or 0)
- **Range**: 0 or 30 points
- **Examples**:
  - Not completed → 0 points
  - Completed → 30 points

#### **B. Work Status Completed (30 points max)**
- **Source**: `completed_data` from `user_work_status` table
- **Calculation**: Binary (30 or 0)
- **Range**: 0 or 30 points
- **Examples**:
  - Not completed → 0 points
  - Completed → 30 points

#### **C. Has Avatar (15 points max)**
- **Source**: `avatar_url` from `users` table
- **Calculation**: Binary (15 or 0)
- **Range**: 0 or 15 points
- **Examples**:
  - No avatar_url → 0 points
  - Has avatar_url → 15 points

#### **D. Has Bio (15 points max)**
- **Source**: `bio` from `users` table
- **Calculation**: Binary (15 or 0) + length check
- **Range**: 0 or 15 points
- **Examples**:
  - No bio or <20 characters → 0 points
  - Bio ≥20 characters → 15 points

#### **E. Has Location (10 points max)**
- **Source**: `location` from `users` table
- **Calculation**: Binary (10 or 0)
- **Range**: 0 or 10 points
- **Examples**:
  - No location → 0 points
  - Has location → 10 points

### **Real Examples**

#### **Example 1: Minimal Profile**
```
Data: personal_data=false, work_status=false, avatar_url=null, bio=null, location=null
Calculation:
- Personal Data: No → 0 points
- Work Status: No → 0 points
- Avatar: No → 0 points
- Bio: No → 0 points
- Location: No → 0 points
Total: 0/100
```

#### **Example 2: Partial Profile**
```
Data: personal_data=true, work_status=false, avatar_url='https://...', bio='Short', location='Manila'
Calculation:
- Personal Data: Yes → 30 points
- Work Status: No → 0 points
- Avatar: Yes → 15 points
- Bio: No (<20 chars) → 0 points
- Location: Yes → 10 points
Total: 30 + 0 + 15 + 0 + 10 = 55/100
```

#### **Example 3: Complete Profile**
```
Data: personal_data=true, work_status=true, avatar_url='https://...', bio='I am a software developer with 5 years experience...', location='Makati City'
Calculation:
- Personal Data: Yes → 30 points
- Work Status: Yes → 30 points
- Avatar: Yes → 15 points
- Bio: Yes (≥20 chars) → 15 points
- Location: Yes → 10 points
Total: 30 + 30 + 15 + 15 + 10 = 100/100
```

---

## 📄 4. RESUME BUILDING SCORE (20% weight)

### **Formula Breakdown**
```
Resume Score = (AI Analysis Score × 70%) + (Has Saved Resume × 30%)
```

### **Component Details**

#### **A. AI Analysis Score (70 points max)**
- **Source**: `overall_score` from `ai_analysis_results` table
- **Calculation**: `overall_score * 0.7`
- **Range**: 0-70 points
- **Examples**:
  - 0/100 AI score → 0 points
  - 50/100 AI score → 35 points
  - 80/100 AI score → 56 points
  - 100/100 AI score → 70 points

#### **B. Has Saved Resume (30 points max)**
- **Source**: Existence in `saved_resumes` table
- **Calculation**: Binary (30 or 0)
- **Range**: 0 or 30 points
- **Examples**:
  - No saved resume → 0 points
  - Has saved resume → 30 points

### **Real Examples**

#### **Example 1: No Resume**
```
Data: no_ai_analysis, no_saved_resume
Calculation:
- AI Score: N/A → 0 points
- Has Saved: No → 0 points
Total: 0/100
```

#### **Example 2: AI Analysis Only**
```
Data: ai_score=75, no_saved_resume
Calculation:
- AI Score: 75 * 0.7 = 52.5 points
- Has Saved: No → 0 points
Total: 52.5/100 → 53/100
```

#### **Example 3: Saved Resume Only**
```
Data: no_ai_analysis, has_saved_resume
Calculation:
- AI Score: N/A → 0 points
- Has Saved: Yes → 30 points
Total: 30/100
```

#### **Example 4: Complete Resume**
```
Data: ai_score=90, has_saved_resume
Calculation:
- AI Score: 90 * 0.7 = 63 points
- Has Saved: Yes → 30 points
Total: 63 + 30 = 93/100
```

---

## 💼 5. APPLICATION ACTIVITY SCORE (15% weight)

### **Formula Breakdown**
```
Application Score = (Total Apps × 40%) + (Active Apps × 30%) + (Hired × 20 pts each) + (Passed × 10 pts each)
```

### **Component Details**

#### **A. Total Applications Score (40 points max)**
- **Source**: Count from `applications` table
- **Calculation**: `MIN(total_applications, 20) / 20 * 40`
- **Range**: 0-40 points
- **Examples**:
  - 0 applications → 0 points
  - 5 applications → 10 points
  - 10 applications → 20 points
  - 20+ applications → 40 points (capped)

#### **B. Active Applications Score (30 points max)**
- **Source**: Count from `applications` where status in ('submitted', 'qualified', 'for verification', 'verified', 'initial interview', 'final interview')
- **Calculation**: `MIN(active_applications, 10) / 10 * 30`
- **Range**: 0-30 points
- **Examples**:
  - 0 active → 0 points
  - 3 active → 9 points
  - 7 active → 21 points
  - 10+ active → 30 points (capped)

#### **C. Hired Bonus (20 points each)**
- **Source**: Count from `applications` where status = 'hired'
- **Calculation**: `hired_count * 20`
- **Range**: 0+ points (no cap)
- **Examples**:
  - 0 hired → 0 points
  - 1 hired → 20 points
  - 2 hired → 40 points

#### **D. Passed Bonus (10 points each)**
- **Source**: Count from `applications` where status = 'passed'
- **Calculation**: `passed_count * 10`
- **Range**: 0+ points (no cap)
- **Examples**:
  - 0 passed → 0 points
  - 1 passed → 10 points
  - 3 passed → 30 points

**Note**: Total score is capped at 100 points

### **Real Examples**

#### **Example 1: New User**
```
Data: total_apps=0, active_apps=0, hired=0, passed=0
Calculation:
- Total Apps: 0/20 * 40 = 0 points
- Active Apps: 0/10 * 30 = 0 points
- Hired: 0 * 20 = 0 points
- Passed: 0 * 10 = 0 points
Total: 0/100
```

#### **Example 2: Active Job Seeker**
```
Data: total_apps=8, active_apps=3, hired=0, passed=1
Calculation:
- Total Apps: 8/20 * 40 = 16 points
- Active Apps: 3/10 * 30 = 9 points
- Hired: 0 * 20 = 0 points
- Passed: 1 * 10 = 10 points
Total: 16 + 9 + 0 + 10 = 35/100
```

#### **Example 3: Successful Applicant**
```
Data: total_apps=15, active_apps=2, hired=1, passed=2
Calculation:
- Total Apps: 15/20 * 40 = 30 points
- Active Apps: 2/10 * 30 = 6 points
- Hired: 1 * 20 = 20 points
- Passed: 2 * 10 = 20 points
Total: 30 + 6 + 20 + 20 = 76/100
```

#### **Example 4: Super Successful**
```
Data: total_apps=25, active_apps=5, hired=3, passed=5
Calculation:
- Total Apps: MIN(25,20)/20 * 40 = 40 points (capped)
- Active Apps: MIN(5,10)/10 * 30 = 15 points
- Hired: 3 * 20 = 60 points
- Passed: 5 * 10 = 50 points
Total: MIN(40 + 15 + 60 + 50, 100) = 100/100 (capped)
```

---

## 🏆 COMPLETE SCORING EXAMPLES

### **Example 1: Beginner User**
```
Typing Hero: 41/100 (25% weight) = 10.25 points
DISC: 63/100 (25% weight) = 15.75 points
Profile: 55/100 (15% weight) = 8.25 points
Resume: 30/100 (20% weight) = 6.00 points
Applications: 0/100 (15% weight) = 0.00 points

Overall Score = 10.25 + 15.75 + 8.25 + 6.00 + 0.00 = 40.25 → 40/100
Tier: Silver 🥈
```

### **Example 2: Active User**
```
Typing Hero: 86/100 (25% weight) = 21.50 points
DISC: 83/100 (25% weight) = 20.75 points
Profile: 100/100 (15% weight) = 15.00 points
Resume: 53/100 (20% weight) = 10.60 points
Applications: 35/100 (15% weight) = 5.25 points

Overall Score = 21.50 + 20.75 + 15.00 + 10.60 + 5.25 = 73.10 → 73/100
Tier: Gold 🥇
```

### **Example 3: Expert User**
```
Typing Hero: 99/100 (25% weight) = 24.75 points
DISC: 98/100 (25% weight) = 24.50 points
Profile: 100/100 (15% weight) = 15.00 points
Resume: 93/100 (20% weight) = 18.60 points
Applications: 76/100 (15% weight) = 11.40 points

Overall Score = 24.75 + 24.50 + 15.00 + 18.60 + 11.40 = 94.25 → 94/100
Tier: Diamond 💎
```

---

## 🎯 EDGE CASES & SPECIAL SCENARIOS

### **No Data Scenarios**
- **No Typing Hero data**: Score = 0/100
- **No DISC data**: Score = 0/100
- **No Profile data**: Score = 0/100
- **No Resume data**: Score = 0/100
- **No Applications**: Score = 0/100

### **Partial Data Scenarios**
- **Only Typing Hero**: Max possible = 25/100 (25% weight)
- **Only DISC**: Max possible = 25/100 (25% weight)
- **Only Profile**: Max possible = 15/100 (15% weight)
- **Only Resume**: Max possible = 20/100 (20% weight)
- **Only Applications**: Max possible = 15/100 (15% weight)

### **Data Quality Issues**
- **Negative values**: Clamped to 0
- **Values > 100**: Capped at 100
- **NULL values**: Treated as 0
- **Missing tables**: Component score = 0

### **Tier Boundaries**
- **39.5 → 40**: Silver tier (rounded up)
- **59.5 → 60**: Gold tier (rounded up)
- **74.5 → 75**: Platinum tier (rounded up)
- **89.5 → 90**: Diamond tier (rounded up)

---

## 📈 SCORING OPTIMIZATION STRATEGIES

### **For Users to Maximize Scores**

#### **Typing Hero (25% weight)**
1. **Focus on accuracy** (30% of typing score)
2. **Improve WPM** (40% of typing score)
3. **Play consistently** (10% of typing score)
4. **Maintain good average** (20% of typing score)

#### **DISC Personality (25% weight)**
1. **Answer honestly** (confidence score)
2. **Complete multiple sessions** (up to 3)
3. **Ensure you get a primary type**

#### **Profile Completion (15% weight)**
1. **Complete personal data** (30 points)
2. **Complete work status** (30 points)
3. **Add avatar** (15 points)
4. **Write detailed bio** (15 points)
5. **Add location** (10 points)

#### **Resume Building (20% weight)**
1. **Get AI analysis** (up to 70 points)
2. **Save your resume** (30 points)
3. **Improve resume quality** (higher AI score)

#### **Applications (15% weight)**
1. **Apply to more jobs** (up to 40 points)
2. **Keep applications active** (up to 30 points)
3. **Get hired** (20 points each)
4. **Pass interviews** (10 points each)

---

## 🔄 SCORE UPDATES & TRIGGERS

### **Automatic Updates**
- **Typing Hero**: After each completed session
- **DISC**: After each completed assessment
- **Profile**: After personal data or work status changes
- **Resume**: After AI analysis or saved resume changes
- **Applications**: After status changes

### **Manual Updates**
```sql
-- Update specific user
SELECT update_user_leaderboard_score('USER_UUID');

-- Update all users
SELECT update_all_leaderboard_scores();

-- Recalculate ranks only
SELECT recalculate_leaderboard_ranks();
```

### **Update Frequency**
- **Real-time**: For individual user changes
- **Batch**: For bulk operations
- **Scheduled**: For rank recalculation (if needed)

---

This detailed scoring system ensures fair, transparent, and meaningful leaderboard rankings that reward genuine user engagement and achievement! 🎯

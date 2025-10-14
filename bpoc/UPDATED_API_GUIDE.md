# 🚀 **Updated Step-by-Step Guide: User Data API with Job Information**

## **What Changed**
✅ **Removed**: Game data, leaderboards, job matching, resume extraction/generation  
✅ **Added**: Complete job data from `processed_job_requests` table  
✅ **New Feature**: `includeJobs=true` parameter to get job application data  

---

## **Phase 1: Database Setup (You - Database Admin)**

### **Step 1: Update Database Views**
1. **Run the updated SQL script**:
   ```sql
   -- Execute the entire content from create_user_data_view.sql
   -- This creates TWO views: v_user_complete_data AND v_user_job_data
   ```

2. **Verify both views were created**:
   ```sql
   -- Test user data view
   SELECT user_id, full_name, total_applications FROM public.v_user_complete_data LIMIT 1;
   
   -- Test job data view  
   SELECT user_id, job_title, company_name FROM public.v_user_job_data LIMIT 1;
   ```

---

## **Phase 2: API Deployment (You - Backend Developer)**

### **Step 2: Deploy Updated API**
1. **The API is already updated**: `src/app/api/public/user-data/route.ts`
2. **New parameter**: `includeJobs=true` to get job data
3. **Deploy to your server**

### **Step 3: Test the Updated API**
```bash
# Test basic user data
curl "http://localhost:3000/api/public/user-data?userId=YOUR_USER_ID"

# Test with job data
curl "http://localhost:3000/api/public/user-data?userId=YOUR_USER_ID&includeJobs=true"
```

---

## **Phase 3: Team Integration (Your Team)**

### **Step 4: Updated API Usage**

#### **Basic User Data (No Jobs)**
```javascript
// Get user profile only
const response = await fetch('https://your-domain.com/api/public/user-data?userId=USER_ID');
const userData = await response.json();
console.log(userData.data[0]); // User profile data
```

#### **User Data + Job Applications**
```javascript
// Get user with their job applications
const response = await fetch('https://your-domain.com/api/public/user-data?userId=USER_ID&includeJobs=true');
const userWithJobs = await response.json();

console.log(userData.data[0]); // User profile
console.log(userData.jobs);    // Array of job applications
```

#### **Job Data Only (for Analytics)**
```javascript
// Get job application data for analytics
const response = await fetch('https://your-domain.com/api/public/user-data?includeJobs=true&limit=100');
const allJobData = await response.json();

// Process job applications
allJobData.jobs.forEach(job => {
  console.log(`${job.full_name} applied to ${job.job_title} at ${job.company_name}`);
});
```

---

## **Phase 4: Common Use Cases**

### **Step 5: Real-World Examples**

#### **1. User Profile Page**
```javascript
async function getUserProfile(slug) {
  const response = await fetch(`https://your-domain.com/api/public/user-data?slug=${slug}`);
  const data = await response.json();
  
  return {
    name: data.data[0].full_name,
    position: data.data[0].position,
    location: data.data[0].location,
    bio: data.data[0].bio,
    resumeSlug: data.data[0].resume_slug,
    overallScore: data.data[0].overall_score,
    totalApplications: data.data[0].total_applications
  };
}
```

#### **2. Job Application History**
```javascript
async function getUserJobHistory(userId) {
  const response = await fetch(`https://your-domain.com/api/public/user-data?userId=${userId}&includeJobs=true`);
  const data = await response.json();
  
  return data.jobs.map(job => ({
    jobTitle: job.job_title,
    company: job.company_name,
    status: job.application_status,
    appliedDate: job.application_created_at,
    salary: `${job.job_salary_min} - ${job.job_salary_max} ${job.job_currency}`
  }));
}
```

#### **3. Application Analytics Dashboard**
```javascript
async function getApplicationAnalytics() {
  const response = await fetch('https://your-domain.com/api/public/user-data?includeJobs=true&limit=1000');
  const data = await response.json();
  
  const analytics = {
    totalApplications: data.jobs.length,
    activeApplications: data.jobs.filter(job => 
      ['submitted', 'qualified', 'initial interview'].includes(job.application_status)
    ).length,
    hiredApplications: data.jobs.filter(job => job.application_status === 'hired').length,
    topCompanies: {}
  };
  
  // Count applications by company
  data.jobs.forEach(job => {
    analytics.topCompanies[job.company_name] = 
      (analytics.topCompanies[job.company_name] || 0) + 1;
  });
  
  return analytics;
}
```

#### **4. Company Job Analytics**
```javascript
async function getCompanyJobData(companyName) {
  const response = await fetch('https://your-domain.com/api/public/user-data?includeJobs=true&limit=1000');
  const data = await response.json();
  
  return data.jobs.filter(job => job.company_name === companyName);
}
```

---

## **Phase 5: API Response Structure**

### **Step 6: Understanding the Response**

#### **Without Jobs (`includeJobs=false` or omitted)**
```json
{
  "success": true,
  "data": [
    {
      "user_id": "uuid",
      "full_name": "John Doe",
      "position": "Developer",
      "total_applications": 5,
      "overall_score": 85,
      // ... other user fields
    }
  ],
  "pagination": { "total": 1, "limit": 1, "offset": 0 },
  "meta": { "includeJobs": false }
}
```

#### **With Jobs (`includeJobs=true`)**
```json
{
  "success": true,
  "data": [
    {
      "user_id": "uuid",
      "full_name": "John Doe",
      "total_applications": 5,
      // ... user fields
    }
  ],
  "jobs": [
    {
      "user_id": "uuid",
      "job_title": "Senior Developer",
      "company_name": "Tech Corp",
      "application_status": "initial interview",
      "job_salary_min": 80000,
      "job_salary_max": 120000,
      // ... job fields
    }
  ],
  "pagination": { "total": 1, "limit": 1, "offset": 0 },
  "meta": { "includeJobs": true }
}
```

---

## **🎯 Key Benefits for Your Team**

1. **Single Endpoint**: One API call gets user + job data
2. **Flexible**: Get user data only, or include job applications
3. **Complete Job Info**: Full job details from `processed_job_requests`
4. **Company Data**: Company information included with jobs
5. **Application Tracking**: See application status and history
6. **Analytics Ready**: Perfect for dashboards and reporting

---

## **🚨 Important Notes**

1. **Job data is only returned when `includeJobs=true`**
2. **Job data shows jobs the user has applied to** (not all jobs)
3. **Company information comes from `members` table**
4. **Application status shows current state**
5. **Salary data is in the job information**

---

## **📞 Quick Test Commands**

```bash
# Test user data
curl "https://your-domain.com/api/public/user-data?userId=USER_ID"

# Test with job data
curl "https://your-domain.com/api/public/user-data?userId=USER_ID&includeJobs=true"

# Test with specific fields
curl "https://your-domain.com/api/public/user-data?userId=USER_ID&includeJobs=true&fields=full_name,job_title,company_name,application_status"
```

**Ready to deploy!** Your team now has access to comprehensive user and job data through a single, powerful API endpoint! 🎉

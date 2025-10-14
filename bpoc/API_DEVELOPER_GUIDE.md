# 🚀 BPOC.IO User Data API - Developer Guide

## 📋 Overview
The User Data API provides comprehensive access to user information through a single, production-ready endpoint. This API is designed for external consumption by other projects and developers.

## 🌐 Base URL
```
https://your-domain.com/api/public/user-data
```

## 🔐 Authentication
- **Public API**: No authentication required for basic access
- **Optional API Key**: Add `X-API-Key` header for enhanced security (if implemented)
- **CORS Enabled**: Ready for cross-origin requests

---

## 📡 API Endpoint

### `GET /api/public/user-data`

Retrieves user data based on provided identifiers.

#### Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `userId` | string (UUID) | No | User's unique identifier | `123e4567-e89b-12d3-a456-426614174000` |
| `slug` | string | No | User's public slug | `john-doe-1234` |
| `email` | string | No | User's email address | `john@example.com` |
| `includePrivate` | boolean | No | Include private/sensitive fields | `true` |
| `fields` | string (comma-separated) | No | Specific fields to return | `full_name,position,overall_score` |
| `limit` | number | No | Records per page (max: 100) | `10` |
| `offset` | number | No | Records to skip | `0` |
| `sortBy` | string | No | Field to sort by | `overall_score` |
| `sortOrder` | string | No | Sort direction (`asc`/`desc`) | `desc` |

**Note**: If no identifiers are provided, the API returns all users (public access).

#### Headers (Optional)
```
X-API-Key: your-api-key-here
Authorization: Bearer your-token-here
```

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": [
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
      "user_updated_at": "2024-01-01T00:00:00Z",
      
      // Work Status
      "current_employer": "Tech Corp",
      "current_position": "Senior Developer",
      "work_status": "employed",
      "preferred_shift": "day",
      "work_setup": "Hybrid",
      "work_status_completed": true,
      
      // AI Analysis Results
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
      "candidate_profile": {...},
      "skills_snapshot": {...},
      "experience_snapshot": {...},
      "education_snapshot": {...},
      
      // Resume Information
      "resume_slug": "john-doe-resume",
      "resume_title": "John Doe's Resume",
      "resume_data": {...},
      "template_used": "modern",
      "resume_is_public": true,
      "resume_view_count": 25,
      
      // Application Statistics
      "total_applications": 5,
      "active_applications": 2,
      "hired_applications": 1,
      "rejected_applications": 1,
      "latest_application_date": "2024-01-15T00:00:00Z",
      "latest_application_status": "initial interview"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 1,
    "offset": 0,
    "hasMore": false,
    "totalPages": 1,
    "currentPage": 1
  },
  "meta": {
    "requestedFields": "all",
    "includePrivate": false,
    "sortBy": "user_created_at",
    "sortOrder": "desc",
    "timestamp": "2024-01-20T12:00:00Z",
    "version": "1.0.0"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "Human-readable description",
  "details": "Technical details (development only)",
  "timestamp": "2024-01-20T12:00:00Z"
}
```

---

## 🎯 Usage Examples

### 1. Get All Users (Public Access)
```bash
curl "https://your-domain.com/api/public/user-data"
```

### 2. Get User by ID
```bash
curl "https://your-domain.com/api/public/user-data?userId=123e4567-e89b-12d3-a456-426614174000"
```

### 3. Get User by Slug (Public Profile)
```bash
curl "https://your-domain.com/api/public/user-data?slug=john-doe-1234"
```

### 4. Get User by Email
```bash
curl "https://your-domain.com/api/public/user-data?email=john@example.com"
```

### 5. Get Specific Fields Only
```bash
curl "https://your-domain.com/api/public/user-data?userId=USER_ID&fields=full_name,position,overall_score,key_strengths"
```

### 6. Include Private Data
```bash
curl "https://your-domain.com/api/public/user-data?userId=USER_ID&includePrivate=true"
```

### 7. Pagination
```bash
curl "https://your-domain.com/api/public/user-data?limit=10&offset=20"
```

### 8. Sorting
```bash
curl "https://your-domain.com/api/public/user-data?sortBy=overall_score&sortOrder=desc&limit=50"
```

### 9. Multiple Users with Filtering
```bash
curl "https://your-domain.com/api/public/user-data?limit=20&fields=user_id,full_name,overall_score,total_applications&sortBy=overall_score&sortOrder=desc"
```

---

## 💻 JavaScript Integration Examples

### Basic Fetch
```javascript
async function getUserData(userId) {
  try {
    const response = await fetch(`https://your-domain.com/api/public/user-data?userId=${userId}`);
    const data = await response.json();
    
    if (data.success) {
      return data.data[0];
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}
```

### With Error Handling
```javascript
async function getUserProfile(slug) {
  try {
    const response = await fetch(`https://your-domain.com/api/public/user-data?slug=${slug}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || data.error);
    }
    
    return {
      name: data.data[0].full_name,
      position: data.data[0].position,
      location: data.data[0].location,
      bio: data.data[0].bio,
      avatar: data.data[0].avatar_url,
      resumeSlug: data.data[0].resume_slug,
      overallScore: data.data[0].overall_score,
      totalApplications: data.data[0].total_applications
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
```

### Pagination Example
```javascript
async function getUsersPage(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  
  try {
    const response = await fetch(
      `https://your-domain.com/api/public/user-data?limit=${limit}&offset=${offset}&fields=user_id,full_name,overall_score,total_applications&sortBy=overall_score&sortOrder=desc`
    );
    
    const data = await response.json();
    
    if (data.success) {
      return {
        users: data.data,
        pagination: data.pagination,
        hasMore: data.pagination.hasMore
      };
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
  
  return { users: [], pagination: null, hasMore: false };
}
```

### React Hook Example
```javascript
import { useState, useEffect } from 'react';

function useUserData(userId) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        const response = await fetch(`https://your-domain.com/api/public/user-data?userId=${userId}`);
        const data = await response.json();
        
        if (data.success) {
          setUserData(data.data[0]);
        } else {
          setError(data.message || data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  return { userData, loading, error };
}
```

---

## 📋 Available Fields

### Public Fields (Default)
- **User Profile**: `user_id`, `first_name`, `last_name`, `full_name`, `location`, `avatar_url`, `bio`, `position`, `gender`, `slug`, `location_city`, `location_province`, `location_country`, `location_region`, `user_created_at`
- **Work Status**: `current_employer`, `current_position`, `work_status`, `preferred_shift`, `work_setup`
- **AI Analysis**: `overall_score`, `ats_compatibility_score`, `content_quality_score`, `professional_presentation_score`, `skills_alignment_score`, `key_strengths`, `strengths_analysis`, `improvements`, `recommendations`, `improved_summary`, `salary_analysis`, `career_path`, `section_analysis`, `candidate_profile`, `skills_snapshot`, `experience_snapshot`, `education_snapshot`
- **Resume**: `resume_slug`, `resume_title`, `template_used`, `resume_is_public`, `resume_view_count`
- **Applications**: `total_applications`, `active_applications`, `hired_applications`, `rejected_applications`, `latest_application_date`, `latest_application_status`

### Private Fields (require `includePrivate=true`)
- `email`, `phone`, `current_salary`, `expected_salary`, `analysis_metadata`, `files_analyzed`

### Sortable Fields
- `user_created_at`, `user_updated_at`, `full_name`, `overall_score`, `total_applications`, `active_applications`, `resume_view_count`

---

## 🚨 Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 400 | Bad Request | Check required parameters |
| 401 | Unauthorized | Provide valid API key |
| 404 | Not Found | User doesn't exist |
| 500 | Internal Server Error | Contact support |

---

## 🔧 Rate Limiting
- **No rate limiting** currently implemented
- **Recommended**: Implement client-side rate limiting
- **Consider**: Adding rate limiting for production use

---

## 🌍 CORS Support
- **Enabled**: All origins (`*`)
- **Methods**: `GET`, `OPTIONS`
- **Headers**: `Content-Type`, `Authorization`, `X-API-Key`
- **Max Age**: 24 hours

---

## 📈 Performance Tips

1. **Use specific fields**: Request only needed fields to reduce payload
2. **Implement pagination**: Use `limit` and `offset` for large datasets
3. **Cache responses**: Implement client-side caching for frequently accessed data
4. **Use sorting**: Sort by relevant fields for better performance
5. **Handle errors gracefully**: Always check `success` field in response

---

## 🎯 Use Cases

### 1. Public Profile Pages
```javascript
const profile = await getUserProfile('john-doe-1234');
```

### 2. Talent Search
```javascript
const topPerformers = await getUsersPage(1, 50); // Get top 50 users
```

### 3. Analytics Dashboard
```javascript
const analytics = await fetch('/api/public/user-data?limit=1000&fields=user_id,overall_score,total_applications');
```

### 4. Resume Analytics
```javascript
const resumeData = await fetch('/api/public/user-data?fields=user_id,resume_slug,resume_view_count,overall_score');
```

---

## 🔄 API Versioning
- **Current Version**: 1.0.0
- **Version Field**: Included in response `meta.version`
- **Backward Compatibility**: Maintained for minor updates
- **Breaking Changes**: Will increment major version

---

## 📞 Support
- **Documentation**: This guide
- **Issues**: Contact your development team
- **Updates**: Check `meta.version` in responses

---

## 🚀 Ready to Use!

Your API is now production-ready and shareable with other projects. All your developers can start using it immediately! 🎉

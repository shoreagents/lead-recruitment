// BPOC.IO User Data API - Integration Examples
// Copy and paste these examples into your projects

// =====================================================
// 1. BASIC USER DATA FETCHING
// =====================================================

/**
 * Get user data by ID
 */
async function getUserById(userId) {
  const response = await fetch(`https://your-domain.com/api/public/user-data?userId=${userId}`);
  const data = await response.json();
  
  if (data.success) {
    return data.data[0];
  } else {
    throw new Error(data.error);
  }
}

/**
 * Get user data by slug (for public profiles)
 */
async function getUserBySlug(slug) {
  const response = await fetch(`https://your-domain.com/api/public/user-data?slug=${slug}`);
  const data = await response.json();
  
  if (data.success) {
    return data.data[0];
  } else {
    throw new Error(data.error);
  }
}

/**
 * Get user data by email
 */
async function getUserByEmail(email) {
  const response = await fetch(`https://your-domain.com/api/public/user-data?email=${email}`);
  const data = await response.json();
  
  if (data.success) {
    return data.data[0];
  } else {
    throw new Error(data.error);
  }
}

// =====================================================
// 2. ADVANCED QUERIES WITH FILTERING
// =====================================================

/**
 * Get specific fields only
 */
async function getUserFields(userId, fields) {
  const fieldsParam = fields.join(',');
  const response = await fetch(`https://your-domain.com/api/public/user-data?userId=${userId}&fields=${fieldsParam}`);
  const data = await response.json();
  
  return data.success ? data.data[0] : null;
}

/**
 * Get users with pagination
 */
async function getUsersPage(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const response = await fetch(`https://your-domain.com/api/public/user-data?limit=${limit}&offset=${offset}`);
  const data = await response.json();
  
  return {
    users: data.data,
    pagination: data.pagination,
    hasMore: data.pagination.hasMore
  };
}

/**
 * Get top performers sorted by AI score
 */
async function getTopPerformers(limit = 50) {
  const response = await fetch(`https://your-domain.com/api/public/user-data?limit=${limit}&sortBy=overall_score&sortOrder=desc&fields=user_id,full_name,overall_score,total_applications`);
  const data = await response.json();
  
  return data.success ? data.data : [];
}

// =====================================================
// 3. REACT HOOKS
// =====================================================

import { useState, useEffect } from 'react';

/**
 * React hook for user data
 */
function useUserData(userId) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        const user = await getUserById(userId);
        setUserData(user);
        setError(null);
      } catch (err) {
        setError(err.message);
        setUserData(null);
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

/**
 * React hook for user profile by slug
 */
function useUserProfile(slug) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const user = await getUserBySlug(slug);
        setProfile({
          name: user.full_name,
          position: user.position,
          location: user.location,
          bio: user.bio,
          avatar: user.avatar_url,
          resumeSlug: user.resume_slug,
          overallScore: user.overall_score,
          totalApplications: user.total_applications
        });
        setError(null);
      } catch (err) {
        setError(err.message);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProfile();
    }
  }, [slug]);

  return { profile, loading, error };
}

// =====================================================
// 4. UTILITY FUNCTIONS
// =====================================================

/**
 * Format user data for display
 */
function formatUserForDisplay(user) {
  return {
    id: user.user_id,
    name: user.full_name,
    position: user.position || 'Position not specified',
    location: user.location || 'Location not specified',
    avatar: user.avatar_url || generateInitials(user.full_name),
    bio: user.bio || 'No bio available',
    resumeSlug: user.resume_slug,
    overallScore: user.overall_score || 0,
    totalApplications: user.total_applications || 0,
    activeApplications: user.active_applications || 0,
    hiredApplications: user.hired_applications || 0,
    keyStrengths: user.key_strengths || [],
    workStatus: user.work_status || 'Not specified',
    workSetup: user.work_setup || 'Not specified'
  };
}

/**
 * Generate initials from name
 */
function generateInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

/**
 * Check if user has high AI score
 */
function isHighPerformer(user) {
  return user.overall_score && user.overall_score >= 80;
}

/**
 * Get user's application status summary
 */
function getApplicationSummary(user) {
  return {
    total: user.total_applications || 0,
    active: user.active_applications || 0,
    hired: user.hired_applications || 0,
    rejected: user.rejected_applications || 0,
    latestStatus: user.latest_application_status || 'No applications',
    latestDate: user.latest_application_date
  };
}

// =====================================================
// 5. ANALYTICS FUNCTIONS
// =====================================================

/**
 * Get analytics data for multiple users
 */
async function getUserAnalytics(limit = 100) {
  const response = await fetch(`https://your-domain.com/api/public/user-data?limit=${limit}&fields=user_id,full_name,overall_score,total_applications,active_applications,hired_applications`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error);
  }

  const users = data.data;
  
  return {
    totalUsers: users.length,
    averageScore: users.reduce((sum, user) => sum + (user.overall_score || 0), 0) / users.length,
    totalApplications: users.reduce((sum, user) => sum + (user.total_applications || 0), 0),
    activeApplications: users.reduce((sum, user) => sum + (user.active_applications || 0), 0),
    hiredApplications: users.reduce((sum, user) => sum + (user.hired_applications || 0), 0),
    highPerformers: users.filter(user => user.overall_score >= 80).length,
    topPerformers: users
      .filter(user => user.overall_score >= 80)
      .sort((a, b) => b.overall_score - a.overall_score)
      .slice(0, 10)
  };
}

/**
 * Get users by location
 */
async function getUsersByLocation(location, limit = 50) {
  const response = await fetch(`https://your-domain.com/api/public/user-data?limit=${limit}&fields=user_id,full_name,location,overall_score`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error);
  }

  return data.data.filter(user => 
    user.location && user.location.toLowerCase().includes(location.toLowerCase())
  );
}

// =====================================================
// 6. ERROR HANDLING WRAPPER
// =====================================================

/**
 * Wrapper function with error handling
 */
async function safeApiCall(apiFunction, ...args) {
  try {
    return await apiFunction(...args);
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

// =====================================================
// 7. USAGE EXAMPLES
// =====================================================

// Example 1: Get user profile for display
async function displayUserProfile(userId) {
  const user = await safeApiCall(getUserById, userId);
  if (user) {
    const formatted = formatUserForDisplay(user);
    console.log('User Profile:', formatted);
    return formatted;
  }
  return null;
}

// Example 2: Get top performers for leaderboard
async function getLeaderboard() {
  const topPerformers = await safeApiCall(getTopPerformers, 20);
  return topPerformers.map(user => ({
    name: user.full_name,
    score: user.overall_score,
    applications: user.total_applications
  }));
}

// Example 3: Get analytics dashboard data
async function getDashboardData() {
  const analytics = await safeApiCall(getUserAnalytics, 200);
  if (analytics) {
    console.log('Dashboard Analytics:', analytics);
    return analytics;
  }
  return null;
}

// =====================================================
// 8. EXPORT FOR USE IN OTHER FILES
// =====================================================

export {
  getUserById,
  getUserBySlug,
  getUserByEmail,
  getUserFields,
  getUsersPage,
  getTopPerformers,
  useUserData,
  useUserProfile,
  formatUserForDisplay,
  generateInitials,
  isHighPerformer,
  getApplicationSummary,
  getUserAnalytics,
  getUsersByLocation,
  safeApiCall,
  displayUserProfile,
  getLeaderboard,
  getDashboardData
};

// =====================================================
// 9. QUICK START GUIDE
// =====================================================

/*
QUICK START:

1. Copy this file to your project
2. Replace 'https://your-domain.com' with your actual API URL
3. Import the functions you need:

   import { getUserById, useUserData } from './bpoc-api-integration';

4. Use in your components:

   const { userData, loading, error } = useUserData('user-id-here');

5. Or use directly:

   const user = await getUserById('user-id-here');

That's it! Your API integration is ready to use.
*/

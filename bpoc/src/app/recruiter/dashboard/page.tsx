'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  FileText, 
  TrendingUp, 
  Calendar,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RecruiterSignInModal from '@/components/auth/RecruiterSignInModal';
import RecruiterSignUpForm from '@/components/auth/RecruiterSignUpForm';
import RecruiterProfileCompletionModal from '@/components/auth/RecruiterProfileCompletionModal';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function RecruiterDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Modal handler functions
  const handleSwitchToSignUp = () => {
    setShowSignInModal(false);
    setShowSignUpModal(true);
  };

  const handleSwitchToSignIn = () => {
    setShowSignUpModal(false);
    setShowSignInModal(true);
  };

  // Fetch user profile from Railway
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          setProfileLoading(true);
          console.log('🔄 Fetching user profile for:', user.id);
          const response = await fetch(`/api/user/profile?userId=${user.id}`);
          if (response.ok) {
            const data = await response.json();
            console.log('✅ User profile loaded:', data.user);
            setUserProfile(data.user);
            
            // Check if profile completion is needed
            // Don't show modal if user was just created (within last 5 minutes) - they just signed up
            const userCreatedAt = new Date(data.user.created_at);
            const now = new Date();
            const timeDiff = now.getTime() - userCreatedAt.getTime();
            const minutesSinceCreation = timeDiff / (1000 * 60);
            
            if (data.user && !data.user.completed_data && minutesSinceCreation > 5) {
              console.log('📝 Profile completion needed, showing modal');
              console.log('📊 User completed_data value:', data.user.completed_data);
              console.log('📊 Minutes since user creation:', minutesSinceCreation);
              setShowProfileModal(true);
            } else if (data.user && !data.user.completed_data && minutesSinceCreation <= 5) {
              console.log('⏭️ User recently created (within 5 minutes), not showing modal yet');
              console.log('📊 Minutes since user creation:', minutesSinceCreation);
            } else {
              console.log('✅ Profile already completed, not showing modal');
              console.log('📊 User completed_data value:', data.user?.completed_data);
            }
          } else {
            console.error('❌ Failed to fetch user profile:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('❌ Error fetching user profile:', error);
        } finally {
          setProfileLoading(false);
        }
      } else {
        console.log('⚠️ No user ID available for profile fetch');
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  const handleProfileComplete = async () => {
    setShowProfileModal(false);
    // Refetch profile data instead of reloading the page
    if (user?.id) {
      try {
        const response = await fetch(`/api/user/profile?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.user);
        }
      } catch (error) {
        console.error('Error refetching profile after completion:', error);
        // Fallback to page reload if refetch fails
        window.location.reload();
      }
    }
  };
  
  // Dashboard data states
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalApplicants, setTotalApplicants] = useState<number>(0);
  const [activeJobs, setActiveJobs] = useState<number>(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [applicationTrends, setApplicationTrends] = useState<any[]>([]);
  const [recruiterJobs, setRecruiterJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Activity feed state
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  // Scroll state for both cards
  const [showApplicationsScrollTop, setShowApplicationsScrollTop] = useState(false);
  const [showActivityScrollTop, setShowActivityScrollTop] = useState(false);

  // Function to get status color based on mood/meaning
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    
    // Job statuses with specific colors
    if (statusLower === 'active') {
      return 'text-green-600'; // Green for active jobs
    }
    if (statusLower === 'inactive') {
      return 'text-gray-600'; // Grey for inactive jobs
    }
    if (statusLower === 'closed') {
      return 'text-red-600'; // Red for closed jobs
    }
    
    // Application statuses - Positive/Good statuses - Green
    if (statusLower.includes('hired') || statusLower.includes('passed') || 
        statusLower.includes('qualified') || statusLower.includes('verified') || statusLower.includes('success')) {
      return 'text-green-600';
    }
    
    // Warning/In Progress statuses - Orange/Yellow
    if (statusLower.includes('interview') || statusLower.includes('pending') || statusLower.includes('review') ||
        statusLower.includes('shortlisted') || statusLower.includes('initial') || statusLower.includes('verification')) {
      return 'text-orange-600';
    }
    
    // Negative/Bad statuses - Red
    if (statusLower.includes('rejected') || statusLower.includes('failed') || 
        statusLower.includes('not qualified') || statusLower.includes('withdrawn')) {
      return 'text-red-600';
    }
    
    // Informational statuses - Blue
    if (statusLower.includes('submitted') || statusLower.includes('applied') || statusLower.includes('new')) {
      return 'text-blue-600';
    }
    
    // Default - Blue for unknown statuses
    return 'text-blue-600';
  };

  // Debug activities state
  useEffect(() => {
    console.log('🔍 Activities state changed:', activities.length, activities);
  }, [activities]);

  // Fetch access token when component mounts
  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        setAccessToken(token);
      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    };
    
    getAccessToken();
  }, []);

  // Separate effect to fetch activities when user becomes available
  useEffect(() => {
    const fetchActivitiesWhenReady = async () => {
      if (user?.id && !loadingActivities && activities.length === 0) {
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          const accessToken = sessionData.session?.access_token;
          
          if (accessToken) {
            console.log('🔄 User ready, fetching activities...');
            await refreshActivities();
          }
        } catch (error) {
          console.error('Error fetching activities when user ready:', error);
        }
      }
    };

    fetchActivitiesWhenReady();
  }, [user?.id]);

  // Scroll handlers
  const handleApplicationsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setShowApplicationsScrollTop(target.scrollTop > 100);
  };

  const handleActivityScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setShowActivityScrollTop(target.scrollTop > 100);
  };

  const scrollToApplicationsTop = () => {
    const container = document.getElementById('applications-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToActivityTop = () => {
    const container = document.getElementById('activity-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Refresh functions for both cards
  const refreshApplications = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      console.log('🔄 Refreshing applications for user:', user.id);
      
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      
      const response = await fetch('/api/recruiter/recent-applications', {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Applications refreshed:', data.recent_activity?.length || 0);
        setRecentActivity(data.recent_activity || []);
      } else {
        console.error('❌ Failed to refresh applications:', response.status);
        setRecentActivity([]);
      }
    } catch (error) {
      console.error('Error refreshing applications:', error);
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshActivities = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingActivities(true);
      console.log('🔄 Refreshing activities for user:', user.id);
      
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      
      const activitiesResponse = await fetch('/api/recruiter/activity-fallback', {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        console.log('✅ Activities refreshed:', activitiesData.activities?.length || 0);
        setActivities(activitiesData.activities || []);
      } else {
        console.error('❌ Failed to refresh activities:', activitiesResponse.status);
        setActivities([]);
      }
    } catch (error) {
      console.error('Error refreshing activities:', error);
      setActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get access token for API calls
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        setAccessToken(token);
        
        // Fetch total users (keep this for platform overview)
        try {
          const usersResponse = await fetch('/api/admin/total-users');
          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            setTotalUsers(usersData.total_users);
          }
        } catch (error) {
          console.error('Error fetching total users:', error);
        }

        // Fetch recruiter jobs first
        try {
          const jobsResponse = await fetch('/api/recruiter/jobs', {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });
          
          if (jobsResponse.ok) {
            const jobsData = await jobsResponse.json();
            const jobs = jobsData.jobs || [];
            setRecruiterJobs(jobs);
            
            // Count active jobs (status not 'closed' or 'inactive')
            const activeJobsCount = jobs.filter((job: any) => 
              job.status && !['closed', 'inactive'].includes(job.status)
            ).length;
            setActiveJobs(activeJobsCount);
            
        // Fetch total applicants from recruiter_applications table
        try {
          const totalApplicantsResponse = await fetch('/api/recruiter/total-applicants', {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });
          
          if (totalApplicantsResponse.ok) {
            const totalApplicantsData = await totalApplicantsResponse.json();
            setTotalApplicants(totalApplicantsData.total_applicants || 0);
          }
        } catch (error) {
          console.error('Error fetching total applicants:', error);
        }
          }
        } catch (error) {
          console.error('Error fetching recruiter jobs:', error);
        }

        // Fetch recent recruiter applications (only for this recruiter's jobs)
        if (user?.id) {
          try {
            console.log('🔍 Fetching applications for user:', user.id);
            const activityResponse = await fetch('/api/recruiter/recent-applications', {
              headers: {
                'Content-Type': 'application/json',
                'x-user-id': user.id,
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            });
            
            if (activityResponse.ok) {
              const activityData = await activityResponse.json();
              console.log('✅ Applications fetched:', activityData.recent_activity?.length || 0);
              setRecentActivity(activityData.recent_activity || []);
            } else {
              console.error('❌ Failed to fetch applications:', activityResponse.status);
              setRecentActivity([]);
            }
          } catch (error) {
            console.error('Error fetching recent recruiter applications:', error);
            setRecentActivity([]);
          }
        }

        // Fetch application trends for this recruiter
        if (user?.id) {
        try {
            const trendsResponse = await fetch(`/api/admin/application-trends?range=7d&recruiterId=${user.id}`);
          if (trendsResponse.ok) {
            const trendsData = await trendsResponse.json();
            setApplicationTrends(trendsData.application_trends || []);
          }
        } catch (error) {
          console.error('Error fetching application trends:', error);
          }
        }

        // Fetch recruiter activities - wait for user to be fully authenticated
        if (user?.id && token) {
          try {
            setLoadingActivities(true);
            console.log('🔍 Fetching activities for user:', user.id);
            console.log('🔍 Making API call to /api/recruiter/activity');
            console.log('🔍 User ID being sent:', user.id);
            console.log('🔍 Access token available:', !!token);
            
            const activitiesResponse = await fetch('/api/recruiter/activity-fallback', {
              headers: {
                'Content-Type': 'application/json',
                'x-user-id': user.id,
                'Authorization': `Bearer ${token}`,
              },
            });
            
            if (activitiesResponse.ok) {
              const activitiesData = await activitiesResponse.json();
              console.log('✅ Activities fetched:', activitiesData.activities?.length || 0);
              console.log('🔍 Activities data:', activitiesData.activities);
              console.log('🔍 Full API response:', activitiesData);
              setActivities(activitiesData.activities || []);
            } else {
              console.error('❌ Failed to fetch activities:', activitiesResponse.status);
              const errorText = await activitiesResponse.text();
              console.error('❌ Error response:', errorText);
              setActivities([]);
            }
          } catch (error) {
            console.error('Error fetching recruiter activities:', error);
            setActivities([]);
          } finally {
            setLoadingActivities(false);
          }
        } else {
          console.log('⚠️ User or access token not ready for activities fetch');
          console.log('🔍 User ID:', user?.id);
          console.log('🔍 Access token:', !!token);
          setActivities([]);
        }
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch dashboard data when user is available
    if (user?.id) {
    fetchDashboardData();
    }
  }, [user?.id, accessToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                Recruiter Dashboard
              </h1>
              <p className="text-lg text-gray-600">Manage your job postings and find the best candidates</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last updated</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Platform Users</p>
                  <div className="text-3xl font-bold text-blue-900">
                    {loading ? (
                      <span className="inline-block w-12 h-8 bg-blue-300 animate-pulse rounded"></span>
                    ) : (
                      totalUsers.toLocaleString()
                    )}
                  </div>
                  <p className="text-sm text-blue-700 mt-2">Total platform users</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600 mb-1">Total Applicants</p>
                  <div className="text-3xl font-bold text-emerald-900">
                    {loading ? (
                      <span className="inline-block w-12 h-8 bg-emerald-300 animate-pulse rounded"></span>
                    ) : (
                      totalApplicants.toLocaleString()
                    )}
                  </div>
                  <p className="text-sm text-emerald-700 mt-2">Total applicants across all your jobs</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">Your Active Jobs</p>
                  <div className="text-3xl font-bold text-purple-900">
                    {loading ? (
                      <span className="inline-block w-12 h-8 bg-purple-300 animate-pulse rounded"></span>
                    ) : (
                      activeJobs.toLocaleString()
                    )}
                  </div>
                  <p className="text-sm text-purple-700 mt-2">Your open positions</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="space-y-8">
            {/* Top Row - Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Recent Applications */}
              <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Recent Applications</CardTitle>
                      <CardDescription className="text-gray-600 mt-1">Latest job applications from candidates</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={refreshApplications}
                        disabled={loading}
                        size="sm"
                        className="flex items-center space-x-1 !bg-green-600 !border-green-600 !text-white hover:!bg-green-700"
                      >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                      </Button>
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div 
                      id="applications-container"
                      onScroll={handleApplicationsScroll}
                      className="max-h-80 overflow-y-auto space-y-4 pr-2 dashboard-scroll"
                    >
                      {loading ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                              <div className="flex-1">
                                <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded animate-pulse mb-1"></div>
                                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : recentActivity.length > 0 ? (
                        recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden">
                              {activity.user_avatar ? (
                                <img 
                                  src={activity.user_avatar} 
                                  alt={activity.user_name || 'User'} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Fallback to initials if image fails to load
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                      parent.innerHTML = `
                                        <div class="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                                          <span class="text-white text-sm font-bold">
                                            ${activity.user_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'U'}
                                          </span>
                                        </div>
                                      `;
                                    }
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-bold">
                                    {activity.user_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'U'}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900">{activity.user_name?.split(' ')[0] || 'Unknown User'}</p>
                              <p className="text-sm text-gray-700 mt-1">
                                {activity.action.includes(':') ? (
                                  <>
                                    {activity.action.split(':')[0]}:
                                    <span className={`font-bold ${getStatusColor(activity.action.split(':')[1].trim())}`}> {activity.action.split(':')[1]}</span>
                                  </>
                                ) : (
                                  activity.action
                                )}
                              </p>
                              <p className="text-xs text-gray-500 mt-2 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {activity.activity_time ? new Date(activity.activity_time).toLocaleString() : 'Unknown time'}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No recent applications</p>
                          <p className="text-sm">Job applications will appear here as candidates apply to your jobs</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Scroll to top button for Recent Applications */}
                    {showApplicationsScrollTop && (
                      <Button
                        onClick={scrollToApplicationsTop}
                        size="sm"
                        className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white shadow-lg z-10"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Recent Activity</CardTitle>
                      <CardDescription className="text-gray-600 mt-1">Your job posting and status changes</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={refreshActivities}
                        disabled={loadingActivities}
                        size="sm"
                        className="flex items-center space-x-1 !bg-green-600 !border-green-600 !text-white hover:!bg-green-700"
                      >
                        <RefreshCw className={`w-4 h-4 ${loadingActivities ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                      </Button>
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div 
                      id="activity-container"
                      onScroll={handleActivityScroll}
                      className="max-h-80 overflow-y-scroll space-y-4 pr-2 dashboard-scroll"
                      style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#6B7280 #F3F4F6',
                        overflowY: 'scroll',
                        minHeight: '320px'
                      }}
                    >
                    {loadingActivities ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : activities.length > 0 ? (
                      activities.map((activity, index) => {
                        // Get icon component based on activity type
                        const getIconComponent = (type: string) => {
                          switch (type) {
                            case 'job_posted':
                              return <Building2 className="w-6 h-6 text-white" />;
                            case 'status_change':
                              return <Calendar className="w-6 h-6 text-white" />;
                            default:
                              return <Calendar className="w-6 h-6 text-white" />;
                          }
                        };

                        // Get color classes based on activity color
                        const getColorClasses = (color: string) => {
                          switch (color) {
                            case 'green':
                              return 'from-green-50 to-emerald-50 border-green-200 bg-green-500';
                            case 'blue':
                              return 'from-blue-50 to-indigo-50 border-blue-200 bg-blue-500';
                            case 'purple':
                              return 'from-purple-50 to-violet-50 border-purple-200 bg-purple-500';
                            case 'orange':
                              return 'from-orange-50 to-amber-50 border-orange-200 bg-orange-500';
                            default:
                              return 'from-gray-50 to-slate-50 border-gray-200 bg-gray-500';
                          }
                        };

                        const colorClasses = getColorClasses(activity.color);
                        const IconComponent = getIconComponent(activity.type);

                        // Format timestamp
                        const timeAgo = activity.timestamp 
                          ? new Date(activity.timestamp).toLocaleString()
                          : 'Unknown time';

                        return (
                          <div key={activity.id || index} className={`flex items-center space-x-4 p-4 bg-gradient-to-r ${colorClasses} rounded-xl border shadow-sm hover:shadow-md transition-shadow`}>
                            <div className={`w-10 h-10 ${activity.color === 'green' ? 'bg-green-500' : activity.color === 'blue' ? 'bg-blue-500' : activity.color === 'purple' ? 'bg-purple-500' : activity.color === 'orange' ? 'bg-orange-500' : 'bg-gray-500'} rounded-full flex items-center justify-center shadow-lg`}>
                              {IconComponent}
                            </div>
                            <div className="flex-1">
                              {activity.title.includes(':') ? (
                                <p className="font-semibold text-gray-900 text-sm">
                                  {activity.title.split(':')[0]}:
                                  <span className={`font-bold ${getStatusColor(activity.title.split(':')[1].trim())}`}> {activity.title.split(':')[1]}</span>
                                </p>
                              ) : (
                                <p className="font-semibold text-gray-900 text-sm">{activity.title}</p>
                              )}
                              <p className="text-gray-600 text-xs mt-1">{timeAgo}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No recent activity</p>
                        <p className="text-sm">Job activities will appear here as you post jobs and make changes</p>
                      </div>
                    )}
                    
                    {/* Guaranteed spacer to ensure scrollbar is always visible */}
                    <div className="h-8 opacity-0 pointer-events-none"></div>
                    </div>
                    
                    {/* Scroll to top button for Recent Activity */}
                    {showActivityScrollTop && (
                      <Button
                        onClick={scrollToActivityTop}
                        size="sm"
                        className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white shadow-lg z-10"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Applications Overview Chart */}
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Applications Overview</CardTitle>
                      <CardDescription className="text-gray-600 mt-1">Application trends over the last 7 days</CardDescription>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-96 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl border border-emerald-200">
                    {loading ? (
                      <div className="text-center">
                        <div className="h-16 w-16 bg-gray-300 rounded animate-pulse mx-auto mb-4"></div>
                        <div className="h-6 bg-gray-300 rounded animate-pulse w-48 mx-auto mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-64 mx-auto"></div>
                      </div>
                    ) : applicationTrends.length > 0 ? (
                      <div className="w-full h-full p-6">
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">Application Trends (Last 7 Days)</h3>
                          <p className="text-sm text-gray-600">Daily application counts</p>
                        </div>
                        <div className="grid grid-cols-7 gap-4 h-56">
                          {applicationTrends.map((trend, index) => (
                            <div key={index} className="flex flex-col justify-end group">
                              <div 
                                className="bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg shadow-lg hover:shadow-xl transition-all duration-300 group-hover:from-emerald-700 group-hover:to-emerald-500"
                                style={{ 
                                  height: `${Math.max(20, (trend.count / Math.max(...applicationTrends.map(t => t.count), 1)) * 100)}%` 
                                }}
                              ></div>
                              <div className="text-xs text-gray-700 mt-3 text-center font-medium">
                                {trend.displayDate}
                              </div>
                              <div className="text-xs text-emerald-600 text-center font-semibold">
                                {trend.count}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <TrendingUp className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Application Trends</h3>
                        <p className="text-sm text-gray-600">No application data available</p>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            </div>
        </div>
      </div>

      {/* Sign In Modal */}
      <RecruiterSignInModal 
        open={showSignInModal} 
        onOpenChange={setShowSignInModal}
        onSwitchToSignUp={handleSwitchToSignUp}
      />
      
      {/* Sign Up Modal */}
      <RecruiterSignUpForm
        open={showSignUpModal}
        onOpenChange={setShowSignUpModal}
        onSwitchToLogin={handleSwitchToSignIn}
      />

      {/* Profile Completion Modal */}
      <RecruiterProfileCompletionModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
        onComplete={handleProfileComplete}
      />

    </div>
  );
}

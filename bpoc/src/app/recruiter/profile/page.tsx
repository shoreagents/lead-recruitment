'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Edit3,
  Save,
  X,
  Award,
  Users,
  Star,
  Target,
  CheckCircle,
  Briefcase,
  UserPlus,
  Camera,
  RefreshCw
} from 'lucide-react';

interface RecruiterProfile {
  id: string;
  full_name: string;
  email: string;
  username?: string;
  phone?: string;
  location?: string;
  company?: string;
  position?: string;
  bio?: string;
  avatar_url?: string;
  join_date: string;
  total_hires: number;
  success_rate: number;
  avg_response_time: string;
  rating: number;
  specialties: string[];
  achievements: string[];
  // Additional Information
  linkedin_url?: string;
  website?: string;
  company_email?: string;
  working_hours?: string;
  total_jobs_posted?: number;
  active_jobs?: number;
  closed_jobs?: number;
  total_applications?: number;
  interviews_conducted?: number;
}

export default function RecruiterProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [editForm, setEditForm] = useState({
    full_name: '',
    username: '',
    location: '',
    company: '',
    position: '',
    bio: ''
  });

  // Effect to populate form when entering edit mode
  useEffect(() => {
    if (isEditingPersonal && profile) {
      console.log('🔍 useEffect: Populating form for personal editing');
      setEditForm({
        full_name: profile.full_name || '',
        username: profile.username || '',
        location: profile.location || '',
        position: profile.position || '',
        bio: profile.bio || ''
      });
    }
  }, [isEditingPersonal, profile]);

  // Fetch activities data
  const fetchActivities = async () => {
    if (!user?.id) return;
    
    try {
      setActivitiesLoading(true);
      console.log('🔍 Fetching activities for user:', user.id);
      
      const response = await fetch('/api/recruiter/activity', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Activities fetched:', data.activities?.length || 0);
        console.log('🔍 Activities data:', data.activities);
        setActivities(data.activities || []);
        setLastRefreshTime(new Date());
      } else {
        console.error('❌ Failed to fetch activities:', response.status);
        setActivities([]);
      }
    } catch (error) {
      console.error('❌ Error fetching activities:', error);
      setActivities([]);
    } finally {
      setActivitiesLoading(false);
    }
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // Check if user is authenticated
        if (!user || !user.id) {
          console.log('No authenticated user found, using mock data');
          setProfile(getMockProfile());
          setLoading(false);
          return;
        }

        console.log('🔍 Fetching profile for logged-in user:', user.id, user.email);

        // Fetch user profile from API
        const response = await fetch(`/api/user/profile?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Profile data received:', data.user);
          
          // Always show the logged-in user's data, regardless of admin_level
          // (since this is the recruiter profile page, we assume they should have access)
          if (data.user) {
            // Transform API data to profile format
            const profileData: RecruiterProfile = {
              id: data.user.id,
              full_name: data.user.full_name || user.email?.split('@')[0] || 'Unknown User',
              email: data.user.email || user.email || '',
              username: data.user.username || '',
              phone: data.user.phone || '',
              location: data.user.location || '',
              company: data.user.company || '',
              position: data.user.position || '',
              bio: data.user.bio || '',
              avatar_url: data.user.avatar_url || null,
              join_date: data.user.created_at || new Date().toISOString(),
              total_hires: 0, // This would need to be calculated from applications table
              success_rate: 0, // This would need to be calculated
              avg_response_time: 'N/A', // This would need to be calculated
              rating: 0, // This would need to be calculated
              specialties: ['BPO Recruitment', 'Talent Acquisition'], // Default specialties
              achievements: [
                'Recruiter Account',
                'Active Member'
              ],
              // Additional Information
              linkedin_url: data.user.linkedin_url || '',
              website: data.user.website || '',
              company_email: data.user.company_email || '',
              working_hours: data.user.working_hours || '',
              total_jobs_posted: data.user.total_jobs_posted || 0,
              active_jobs: data.user.active_jobs || 0,
              closed_jobs: data.user.closed_jobs || 0,
              total_applications: data.user.total_applications || 0,
              interviews_conducted: data.user.interviews_conducted || 0
            };

            setProfile(profileData);
            setEditForm({
              full_name: profileData.full_name,
              username: profileData.username || '',
              location: profileData.location || '',
              company: profileData.company || '',
              position: profileData.position || '',
              bio: profileData.bio || '',
              linkedin_url: profileData.linkedin_url || '',
              website: profileData.website || '',
              company_email: profileData.company_email || '',
              working_hours: profileData.working_hours || ''
            });
            console.log('✅ Profile set for logged-in user:', profileData.full_name);
        } else {
          console.error('No user data returned from API');
          const mockProfile = getMockProfile();
          setProfile(mockProfile);
          setEditForm({
            full_name: mockProfile.full_name,
            username: mockProfile.username || '',
            location: mockProfile.location || '',
            company: mockProfile.company || '',
            position: mockProfile.position || '',
            bio: mockProfile.bio || '',
            linkedin_url: mockProfile.linkedin_url || '',
            website: mockProfile.website || '',
            company_email: mockProfile.company_email || '',
            working_hours: mockProfile.working_hours || ''
          });
        }
      } else {
        console.error('Failed to fetch profile:', response.status, response.statusText);
        // Fallback to mock data on error
        const mockProfile = getMockProfile();
        setProfile(mockProfile);
        setEditForm({
          full_name: mockProfile.full_name,
          username: mockProfile.username || '',
          location: mockProfile.location || '',
          company: mockProfile.company || '',
          position: mockProfile.position || '',
          bio: mockProfile.bio || '',
          linkedin_url: mockProfile.linkedin_url || '',
          website: mockProfile.website || '',
          company_email: mockProfile.company_email || '',
          working_hours: mockProfile.working_hours || ''
        });
      }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Fallback to mock data on error
        const mockProfile = getMockProfile();
        setProfile(mockProfile);
        setEditForm({
          full_name: mockProfile.full_name,
          username: mockProfile.username || '',
          location: mockProfile.location || '',
          company: mockProfile.company || '',
          position: mockProfile.position || '',
          bio: mockProfile.bio || '',
          linkedin_url: mockProfile.linkedin_url || '',
          website: mockProfile.website || '',
          company_email: mockProfile.company_email || '',
          working_hours: mockProfile.working_hours || ''
        });
      } finally {
        setLoading(false);
      }
    };

    // Mock profile data fallback
    const getMockProfile = (): RecruiterProfile => ({
      id: '1',
      full_name: 'Sarah Johnson',
      email: 'sarah.johnson@techcorp.com',
      username: 'sarah_johnson',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      company: 'TechCorp Solutions',
      position: 'Senior Talent Acquisition Manager',
      bio: 'Experienced recruiter with 8+ years in BPO talent acquisition. Passionate about connecting top talent with innovative companies. Specialized in customer service, technical support, and sales roles.',
      avatar_url: null,
      join_date: '2023-01-15',
      total_hires: 247,
      success_rate: 94,
      avg_response_time: '2.3 hours',
      rating: 4.8,
      specialties: ['Customer Service', 'Technical Support', 'Sales', 'BPO Operations'],
      achievements: [
        'Top Performer Q1 2024',
        '100+ Successful Hires',
        'Fastest Response Time Award',
        'Client Satisfaction Excellence'
      ],
      // Additional Information
      linkedin_url: 'https://linkedin.com/in/sarahjohnson',
      website: 'https://techcorp.com',
      company_email: 'hr@techcorp.com',
      working_hours: '9:00 AM - 6:00 PM PST',
      total_jobs_posted: 45,
      active_jobs: 12,
      closed_jobs: 33,
      total_applications: 1247,
      interviews_conducted: 89
    });

    fetchUserProfile();
  }, [user]);

  // Fetch activities when component mounts
  useEffect(() => {
    fetchActivities();
  }, [user]);

  // Refresh activities every 10 seconds to catch status changes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchActivities();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [user]);

  // Also refresh when the tab becomes visible (user switches back to profile)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchActivities();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  // Helper function to format time ago
  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  };

  // Helper function to get icon component
  const getActivityIcon = (icon: string) => {
    switch (icon) {
      case 'briefcase': return Briefcase;
      case 'check-circle': return CheckCircle;
      case 'user-plus': return UserPlus;
      case 'edit': return Edit3;
      default: return Users;
    }
  };


  const handleEditPersonal = () => {
    console.log('🔍 Starting personal information edit mode');
    console.log('🔍 Current profile data:', profile);
    console.log('🔍 Current editForm before update:', editForm);
    
    if (profile) {
      // Directly set the form with profile data
      const newFormData = {
        full_name: profile.full_name || '',
        username: profile.username || '',
        location: profile.location || '',
        position: profile.position || '',
        bio: profile.bio || ''
      };
      
      console.log('🔍 Setting form data to:', newFormData);
      setEditForm(newFormData);
      
      // Set editing mode after a brief delay to ensure state update
      setTimeout(() => {
        console.log('🔍 Setting isEditingPersonal to true');
        setIsEditingPersonal(true);
      }, 100);
    }
  };


  const handleSave = async () => {
    try {
      if (!profile || !user || !user.id) {
        console.error('No profile or user data found');
        return;
      }
      
      // Update profile in database
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          updates: {
            full_name: editForm.full_name,
            username: editForm.username,
            phone: editForm.phone,
            location: editForm.location,
            company: editForm.company,
            position: editForm.position,
            bio: editForm.bio,
            linkedin_url: editForm.linkedin_url,
            website: editForm.website,
            company_email: editForm.company_email,
            working_hours: editForm.working_hours
          }
        })
      });

      if (response.ok) {
        // Update local profile state
        setProfile({
          ...profile,
          ...editForm
        });
        setIsEditing(false);
        console.log('✅ Profile updated successfully');
      } else {
        console.error('Failed to update profile:', response.status, response.statusText);
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };


  const handleSavePersonal = async () => {
    try {
      if (!profile || !user || !user.id) {
        console.error('No profile or user data found');
        return;
      }
      
      // Update profile in database
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          updates: {
            full_name: editForm.full_name,
            username: editForm.username,
            location: editForm.location,
            position: editForm.position,
            bio: editForm.bio
          }
        })
      });

      if (response.ok) {
        // Update local profile state
        setProfile({
          ...profile,
          full_name: editForm.full_name,
          username: editForm.username,
          location: editForm.location,
          position: editForm.position,
          bio: editForm.bio
        });
        setIsEditingPersonal(false);
        console.log('✅ Personal information updated successfully');
      } else {
        console.error('Failed to update personal information:', response.status, response.statusText);
        alert('Failed to update personal information. Please try again.');
      }
    } catch (error) {
      console.error('Error updating personal information:', error);
      alert('Error updating personal information. Please try again.');
    }
  };

  const handleSaveAdditional = async () => {
    try {
      if (!profile || !user || !user.id) {
        console.error('No profile or user data found');
        return;
      }
      
      // Update profile in database
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          updates: {
            linkedin_url: editForm.linkedin_url,
            website: editForm.website,
            company_email: editForm.company_email,
            working_hours: editForm.working_hours
          }
        })
      });

      if (response.ok) {
        // Update local profile state
        setProfile({
          ...profile,
          linkedin_url: editForm.linkedin_url,
          website: editForm.website,
          company_email: editForm.company_email,
          working_hours: editForm.working_hours
        });
        setIsEditingAdditional(false);
        console.log('✅ Additional information updated successfully');
      } else {
        console.error('Failed to update additional information:', response.status, response.statusText);
        alert('Failed to update additional information. Please try again.');
      }
    } catch (error) {
      console.error('Error updating additional information:', error);
      alert('Error updating additional information. Please try again.');
    }
  };

  const handleCancelPersonal = () => {
    if (profile) {
      setEditForm(prev => ({
        ...prev,
        full_name: profile.full_name,
        username: profile.username || '',
        location: profile.location || '',
        position: profile.position || '',
        bio: profile.bio || ''
      }));
    }
    setIsEditingPersonal(false);
  };

  const handleCancelAdditional = () => {
    if (profile) {
      setEditForm(prev => ({
        ...prev,
        linkedin_url: profile.linkedin_url || '',
        website: profile.website || '',
        company_email: profile.company_email || '',
        working_hours: profile.working_hours || ''
      }));
    }
    setIsEditingAdditional(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="text-center py-12">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Single Profile Card */}
        <Card className="bg-white border border-gray-200 shadow-lg min-h-[700px]">
          <CardContent className="p-0">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-8 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-28 h-28 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.full_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      profile.full_name.split(' ').map(n => n[0]).join('')
                    )}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border-2 border-emerald-100">
                    <Camera className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>

                {/* Profile Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                     <div className="flex-1 min-w-0">
                       <div className="space-y-3">
                         <h1 className="text-3xl font-bold text-gray-900 truncate">{profile.full_name}</h1>
                         {profile.username && (
                           <p className="text-lg text-gray-500 font-medium">@{profile.username}</p>
                         )}
                         {profile.position && profile.company && (
                           <p className="text-lg text-gray-700 font-medium">
                             {profile.position} at <span className="text-emerald-600 font-semibold">{profile.company}</span>
                           </p>
                         )}
                         {profile.position && !profile.company && (
                           <p className="text-lg text-gray-700 font-medium">{profile.position}</p>
                         )}
                         {!profile.position && profile.company && (
                           <p className="text-base text-emerald-600 font-semibold">{profile.company}</p>
                         )}
                       </div>
                     </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="text-center p-5 bg-white/70 rounded-xl border border-white/90 shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-2xl font-bold text-gray-900 mb-1">{profile.total_hires}</div>
                      <div className="text-sm text-gray-600 font-medium">Total Hires</div>
                    </div>
                    <div className="text-center p-5 bg-white/70 rounded-xl border border-white/90 shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-2xl font-bold text-emerald-600 mb-1">{profile.success_rate}%</div>
                      <div className="text-sm text-gray-600 font-medium">Success Rate</div>
                    </div>
                    <div className="text-center p-5 bg-white/70 rounded-xl border border-white/90 shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{profile.avg_response_time}</div>
                      <div className="text-sm text-gray-600 font-medium">Avg Response</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <div className="px-8 pt-8">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 border-2 border-gray-200 rounded-xl p-1 h-12">
                  <TabsTrigger 
                    value="overview" 
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg font-semibold transition-all duration-200"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="activity" 
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg font-semibold transition-all duration-200"
                  >
                    Activity
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="p-8">
                {/* Personal Information */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span>Personal Information</span>
                    </h3>
                    {!isEditingPersonal && (
                      <Button
                        onClick={handleEditPersonal}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit</span>
                      </Button>
                    )}
                  </div>
                </div>
                <div className="space-y-6">
                  {isEditingPersonal ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Debug info */}
                      {console.log('🔍 Rendering edit form with values:', {
                        full_name: editForm.full_name,
                        username: editForm.username,
                        location: editForm.location,
                        company: editForm.company,
                        position: editForm.position,
                        bio: editForm.bio,
                        isEditingPersonal: isEditingPersonal,
                        profileExists: !!profile
                      })}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        {console.log('🔍 Full Name input value:', editForm.full_name || profile?.full_name || '')}
                        <input
                          type="text"
                          value={editForm.full_name || profile?.full_name || ''}
                          onChange={(e) => handleInputChange('full_name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          style={{ color: '#000', backgroundColor: '#fff' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        {console.log('🔍 Username input value:', editForm.username || profile?.username || '')}
                        <input
                          type="text"
                          value={editForm.username || profile?.username || ''}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          style={{ color: '#000', backgroundColor: '#fff' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        {console.log('🔍 Location input value:', editForm.location || profile?.location || '')}
                        <input
                          type="text"
                          value={editForm.location || profile?.location || ''}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          style={{ color: '#000', backgroundColor: '#fff' }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <input
                          type="text"
                          value={profile?.company || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                          disabled
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                        {console.log('🔍 Position input value:', editForm.position || profile?.position || '')}
                        <input
                          type="text"
                          value={editForm.position || profile?.position || ''}
                          onChange={(e) => handleInputChange('position', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          style={{ color: '#000', backgroundColor: '#fff' }}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        {console.log('🔍 Bio input value:', editForm.bio || profile?.bio || '')}
                        <textarea
                          value={editForm.bio || profile?.bio || ''}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          style={{ color: '#000', backgroundColor: '#fff' }}
                        />
                      </div>
                      <div className="md:col-span-2 flex space-x-3">
                        <Button onClick={handleSavePersonal} className="bg-emerald-600 hover:bg-emerald-700">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button onClick={handleCancelPersonal} variant="outline">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Email - Always visible, non-editable */}
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="text-gray-900 font-semibold">{profile.email}</p>
                        </div>
                      </div>
                      
                      {/* Username - Editable */}
                      {profile.username && (
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Username</p>
                            <p className="text-gray-900 font-semibold">@{profile.username}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Phone - Always visible, non-editable */}
                      {profile.phone && (
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Phone className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Phone</p>
                            <p className="text-gray-900 font-semibold">{profile.phone}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Location - Editable */}
                      {profile.location && (
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Location</p>
                            <p className="text-gray-900 font-semibold">{profile.location}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Company - Editable */}
                      {profile.company && (
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Company</p>
                            <p className="text-gray-900 font-semibold">{profile.company}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Joined - Always visible, non-editable */}
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Joined</p>
                          <p className="text-gray-900 font-semibold">{new Date(profile.join_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {profile.bio && (
                        <div className="md:col-span-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                            <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                              <User className="w-4 h-4 text-emerald-600" />
                            </div>
                            <span>About</span>
                          </h4>
                          <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </TabsContent>

              <TabsContent value="activity" className="p-8">
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                        <p className="text-gray-600 mt-1">
                          Your recent recruitment activities and milestones
                          {lastRefreshTime && (
                            <span className="text-xs text-gray-500 ml-2">
                              (Last updated: {lastRefreshTime.toLocaleTimeString()})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={fetchActivities}
                      disabled={activitiesLoading}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${activitiesLoading ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </Button>
                  </div>
                </div>
                
                {activitiesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading activities...</span>
                  </div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No activities yet</h3>
                    <p className="text-gray-600">Your recruitment activities will appear here once you start posting jobs and receiving applications.</p>
                  </div>
                ) : (
                  <div className="space-y-6 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                    {activities.map((activity, index) => {
                      const IconComponent = getActivityIcon(activity.icon);
                      const timeAgo = getTimeAgo(activity.timestamp);
                      
                      const getColorClasses = (color: string) => {
                        switch (color) {
                          case 'green':
                            return 'from-green-50 to-emerald-50 border-green-200 bg-green-500';
                          case 'blue':
                            return 'from-blue-50 to-cyan-50 border-blue-200 bg-blue-500';
                          case 'purple':
                            return 'from-purple-50 to-pink-50 border-purple-200 bg-purple-500';
                          case 'orange':
                            return 'from-orange-50 to-yellow-50 border-orange-200 bg-orange-500';
                          default:
                            return 'from-gray-50 to-slate-50 border-gray-200 bg-gray-500';
                        }
                      };

                      const getBadgeClasses = (status: string) => {
                        switch (status) {
                          case 'completed':
                            return 'bg-green-100 text-green-800 border-green-200';
                          case 'active':
                            return 'bg-blue-100 text-blue-800 border-blue-200';
                          case 'pending':
                            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                          case 'updated':
                            return 'bg-orange-100 text-orange-800 border-orange-200';
                          default:
                            return 'bg-gray-100 text-gray-800 border-gray-200';
                        }
                      };

                      const colorClasses = getColorClasses(activity.color);
                      const badgeClasses = getBadgeClasses(activity.status);

                      return (
                        <div key={activity.id || index} className={`flex items-center space-x-6 p-6 bg-gradient-to-r ${colorClasses} rounded-xl border shadow-sm hover:shadow-md transition-shadow`}>
                          <div className={`w-12 h-12 ${activity.color === 'green' ? 'bg-green-500' : activity.color === 'blue' ? 'bg-blue-500' : activity.color === 'purple' ? 'bg-purple-500' : activity.color === 'orange' ? 'bg-orange-500' : 'bg-gray-500'} rounded-full flex items-center justify-center shadow-lg`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-lg">{activity.title}</p>
                            <p className="text-gray-600 mt-1">{timeAgo}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={badgeClasses}>{activity.status}</Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

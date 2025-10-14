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
  Camera
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
}

export default function RecruiterProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    full_name: '',
    username: '',
    phone: '',
    location: '',
    company: '',
    position: '',
    bio: ''
  });

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
              ]
            };

            setProfile(profileData);
            setEditForm({
              full_name: profileData.full_name,
              username: profileData.username || '',
              phone: profileData.phone || '',
              location: profileData.location || '',
              company: profileData.company || '',
              position: profileData.position || '',
              bio: profileData.bio || ''
            });
            console.log('✅ Profile set for logged-in user:', profileData.full_name);
          } else {
            console.error('No user data returned from API');
            setProfile(getMockProfile());
          }
        } else {
          console.error('Failed to fetch profile:', response.status, response.statusText);
          // Fallback to mock data on error
          setProfile(getMockProfile());
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Fallback to mock data on error
        setProfile(getMockProfile());
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
      ]
    });

    fetchUserProfile();
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
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
            bio: editForm.bio
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

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name,
        username: profile.username || '',
        phone: profile.phone || '',
        location: profile.location || '',
        company: profile.company || '',
        position: profile.position || '',
        bio: profile.bio || ''
      });
    }
    setIsEditing(false);
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
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex-shrink-0">
                      <Button
                        onClick={handleEdit}
                        variant="outline"
                        className="flex items-center space-x-2 px-6 py-3 border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 font-medium"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </Button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <div className="text-center p-5 bg-white/70 rounded-xl border border-white/90 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="text-2xl font-bold text-gray-900">{profile.rating}</span>
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Rating</div>
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Personal Information */}
                  <div className="lg:col-span-2">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span>Personal Information</span>
                      </h3>
                    </div>
                    <div className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={editForm.full_name}
                          onChange={(e) => handleInputChange('full_name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                          type="text"
                          value={editForm.username}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="Enter your username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="text"
                          value={editForm.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <input
                          type="text"
                          value={editForm.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                        <input
                          type="text"
                          value={editForm.position}
                          onChange={(e) => handleInputChange('position', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                          value={editForm.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button onClick={handleCancel} variant="outline">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="text-gray-900 font-semibold">{profile.email}</p>
                        </div>
                      </div>
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
                        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
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
                  </div>

                  {/* Specialties & Achievements */}
                  <div className="space-y-8">
                    {/* Specialties */}
                    <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Target className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span>Specialties</span>
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {profile.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-800 px-4 py-2 text-sm font-medium border border-emerald-200">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Recent Achievements */}
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-blue-600" />
                        </div>
                        <span>Recent Achievements</span>
                      </h3>
                      <div className="space-y-4">
                        {profile.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center space-x-4 p-3 bg-white/60 rounded-lg border border-white/80">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="text-gray-800 font-medium">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="p-8">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <span>Recent Activity</span>
                  </h3>
                  <p className="text-gray-600 mt-2">Your recent recruitment activities and milestones</p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-lg">Successfully hired Maria Rodriguez</p>
                      <p className="text-gray-600 mt-1">Customer Service Representative • 2 hours ago</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800 border border-green-200">Completed</Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-lg">Posted new job: Technical Support Specialist</p>
                      <p className="text-gray-600 mt-1">15 applications received • 4 hours ago</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-blue-100 text-blue-800 border border-blue-200">Active</Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-lg">Received 5-star rating from client</p>
                      <p className="text-gray-600 mt-1">TechCorp Solutions • 1 day ago</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-purple-100 text-purple-800 border border-purple-200">Achievement</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

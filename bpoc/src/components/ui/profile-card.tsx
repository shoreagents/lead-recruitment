'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Removed Card wrappers to avoid double containers in Profile tab
import { Button } from '@/components/ui/button';

import { 
  Edit3,
  Loader2,
  Mail,
  Phone as PhoneIcon,
  MapPin,
  Briefcase,
  CalendarDays,
  User as UserIcon,
  Eye,
  Heart,
  FileText
} from 'lucide-react';
import PlacesAutocomplete from '@/components/ui/places-autocomplete';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { getSessionToken } from '@/lib/auth-helpers';
import { uploadProfilePhoto, optimizeImage } from '@/lib/storage';

interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  location: string
  avatar_url?: string
  phone?: string
  bio?: string
  position?: string
  gender?: string | null
  slug?: string | null
  created_at: string
  updated_at: string
  birthday?: string | null
  gender_custom?: string | null
  overall_score?: number
}

interface ProfileCardProps {
  userId?: string;
  showEditButton?: boolean;
  className?: string;
}

export default function ProfileCard({ userId, showEditButton = true, className = '' }: ProfileCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to determine rank based on overall score
  const getRank = (score: number) => {
    if (score >= 85 && score <= 100) return { rank: 'GOLD', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30' }
    if (score >= 65 && score <= 84) return { rank: 'SILVER', color: 'text-gray-300', bgColor: 'bg-gray-500/20', borderColor: 'border-gray-500/30' }
    if (score >= 50 && score <= 64) return { rank: 'BRONZE', color: 'text-orange-400', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/30' }
    return { rank: 'None', color: 'text-gray-500', bgColor: 'bg-gray-600/20', borderColor: 'border-gray-600/30' }
  }

  // Function to handle viewing resume
  const handleViewResume = async () => {
    if (userProfile?.id) {
      try {
        // Fetch the resume slug from saved_resumes table
        const response = await fetch(`/api/get-user-resume-slug?userId=${userProfile.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.resumeSlug) {
            router.push(`/resume/${data.resumeSlug}`);
          } else {
            console.log('No resume found for this user');
          }
        }
      } catch (error) {
        console.error('Error fetching resume slug:', error);
      }
    }
  }
  
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [professionalSummary, setProfessionalSummary] = useState<string>('');
  const [aiAnalysisScore, setAiAnalysisScore] = useState<number | null>(null);
  const [completedGames, setCompletedGames] = useState<number>(0);
  const [jobMatchesCount, setJobMatchesCount] = useState<number>(0);
  const [jobMatchesLoading, setJobMatchesLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Use provided userId or fall back to current user
  const targetUserId = userId || user?.id;
  
  // Fetch user profile from Railway (owner via private API with auth, others via public API)
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!targetUserId) {
        console.log('⚠️ Profile card: No user ID available for profile fetch');
        return;
      }
        try {
          setProfileLoading(true);
        const isOwner = !!user?.id && user.id === targetUserId && showEditButton;
        if (isOwner) {
          const token = await getSessionToken();
          const response = await fetch(`/api/user/profile?userId=${targetUserId}` , {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            cache: 'no-store'
          });
          if (response.ok) {
            const data = await response.json();
            setUserProfile(data.user);
          } else {
            console.error('❌ Profile card: Failed to fetch private profile:', response.status, response.statusText);
          }
        } else {
          const fields = [
            'id','email','first_name','last_name','full_name','location','avatar_url',
            'phone','bio','position','gender','slug','created_at','updated_at','overall_score'
          ].join(',');
          const response = await fetch(`/api/public/users?ids=${encodeURIComponent(targetUserId)}&fields=${encodeURIComponent(fields)}`, { cache: 'no-store' });
          if (response.ok) {
            const data = await response.json();
            const u = (data?.items && data.items[0]) || null;
            if (u) setUserProfile(u as any);
          } else {
            console.error('❌ Profile card: Failed to fetch public user profile:', response.status, response.statusText);
          }
          }
        } catch (error) {
        console.error('❌ Profile card: Error fetching user profile:', error);
        } finally {
          setProfileLoading(false);
        }
    };

    fetchUserProfile();
  }, [targetUserId, user?.id, showEditButton])

  // Listen for work status position changes and refresh profile data
  useEffect(() => {
    const handleWorkStatusPositionChange = (event: CustomEvent) => {
      const { position, userId } = event.detail;
      if (userId === targetUserId) {
        console.log('🔄 Work status position changed, updating profile position:', position);
        setUserProfile(prev => prev ? { ...prev, position } : prev);
        setProfileData(prev => ({ ...prev, jobTitle: position }));
      }
    };

    window.addEventListener('workStatusPositionChanged', handleWorkStatusPositionChange as EventListener);
    
    return () => {
      window.removeEventListener('workStatusPositionChanged', handleWorkStatusPositionChange as EventListener);
    };
  }, [targetUserId]);

  // Fetch professional summary from saved resume data
  useEffect(() => {
    const fetchProfessionalSummary = async () => {
      if (targetUserId) {
        try {
          console.log('🔄 Profile card: Fetching professional summary from saved resume for:', targetUserId);
          const response = await fetch(`/api/user/saved-resume-data`, {
            headers: {
              'x-user-id': targetUserId
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.hasData && data.resumeData) {
              // Extract professional summary from saved resume data
              const summary = extractProfessionalSummary(data.resumeData);
              if (summary) {
                console.log('✅ Profile card: Professional summary loaded from saved resume:', summary);
                setProfessionalSummary(summary);
              }
            } else {
              console.log('⚠️ Profile card: No saved resume data found for user');
            }
          } else {
            console.log('⚠️ Profile card: Failed to fetch saved resume data');
          }
        } catch (error) {
          console.error('❌ Profile card: Error fetching professional summary from saved resume:', error);
        }
      }
    };

    fetchProfessionalSummary();
  }, [targetUserId]);

  // Fetch AI analysis score
  useEffect(() => {
    const fetchAiAnalysisScore = async () => {
      if (targetUserId) {
        try {
          console.log('🔄 Profile card: Fetching AI analysis score for:', targetUserId);
          const response = await fetch(`/api/user/ai-analysis-score`, {
            headers: {
              'x-user-id': targetUserId
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.hasData && data.overallScore !== undefined) {
              console.log('✅ Profile card: AI analysis score loaded:', data.overallScore);
              setAiAnalysisScore(data.overallScore);
            } else {
              console.log('⚠️ Profile card: No AI analysis score found for user');
            }
          } else {
            console.log('⚠️ Profile card: Failed to fetch AI analysis score');
          }
        } catch (error) {
          console.error('❌ Profile card: Error fetching AI analysis score:', error);
        }
      }
    };

    fetchAiAnalysisScore();
  }, [targetUserId]);

  // Helper function to extract professional summary from saved resume data
  const extractProfessionalSummary = (resumeData: any): string | null => {
    if (!resumeData) return null;
    
    // Check for various possible field names for professional summary
    const summaryFields = ['summary', 'professional_summary', 'profile', 'objective', 'about', 'overview', 'career_summary'];
    
    // First, check if the data is in the content field (common in saved resumes)
    if (resumeData.content && typeof resumeData.content === 'object') {
      for (const field of summaryFields) {
        if (resumeData.content[field] && typeof resumeData.content[field] === 'string') {
          return resumeData.content[field];
        }
      }
    }
    
    // Check for direct fields in the resume data
    for (const field of summaryFields) {
      if (resumeData[field] && typeof resumeData[field] === 'string') {
        return resumeData[field];
      }
    }
    
    // If no direct field found, check if it's nested in files array (for extracted resumes)
    if (resumeData.files && Array.isArray(resumeData.files)) {
      for (const file of resumeData.files) {
        if (file?.data) {
          for (const field of summaryFields) {
            if (file.data[field] && typeof file.data[field] === 'string') {
              return file.data[field];
            }
          }
        }
      }
    }
    
    // Check for sections array (common in saved resumes)
    if (resumeData.sections && Array.isArray(resumeData.sections)) {
      for (const section of resumeData.sections) {
        if (section.type === 'summary' || section.type === 'profile' || section.type === 'objective') {
          if (section.content && typeof section.content === 'string') {
            return section.content;
          }
        }
      }
    }
    
    return null;
  };
  
  // Extract user info from Railway data only
  const userDisplayName = profileLoading ? 'Loading...' : (userProfile?.full_name || 'User');
  const userInitials = profileLoading ? 'L' : (userProfile?.full_name 
    ? userProfile.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)
    : 'U');

  // Mock user data - in production this would come from your database
  const userStats = {
    level: 12,
    experiencePoints: 14400,
    nextLevelXP: 15000,
    completedAssessments: 8,
    totalAssessments: 12,
    resumeScore: 87,
    jobMatches: 0
  };

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    jobTitle: '',
    company: '',
    bio: '',
    gender: '',
    genderCustom: '',
    birthday: ''
  });

  // Location place details for Google Maps integration
  const [locationDetails, setLocationDetails] = useState({
    place_id: '',
    lat: null as number | null,
    lng: null as number | null,
    city: '',
    province: '',
    country: '',
    barangay: '',
    region: ''
  });

  // Update profile data when Railway data loads
  useEffect(() => {
    if (userProfile) {
      setProfileData({
        firstName: userProfile.first_name || '',
        lastName: userProfile.last_name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        location: userProfile.location || '',
        jobTitle: userProfile.position || '',
        company: '',
        bio: userProfile.bio || '',
        gender: userProfile.gender || '',
        genderCustom: userProfile.gender_custom || '',
        birthday: userProfile.birthday || ''
      });
    }
  }, [userProfile]);

  // Helpers
  const computeAge = (birthday?: string | null): number | null => {
    if (!birthday) return null;
    const dob = new Date(birthday);
    if (isNaN(dob.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  };
  const formatMonthYear = (iso?: string | null): string | null => {
    if (!iso) return null;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  };
  const formatDisplayGender = (gender?: string | null, custom?: string | null): string => {
    if (!gender) return '—';
    const g = String(gender).toLowerCase();
    if (g === 'others') {
      return custom && custom.trim().length > 0 ? custom : 'Others';
    }
    return g.charAt(0).toUpperCase() + g.slice(1);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const saveProfileChanges = async () => {
    if (!user) return;
    try {
      setIsSaving(true);
      const payload: any = {
        userId: user.id,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        location: profileData.location,
        phone: profileData.phone,
        bio: profileData.bio,
        position: profileData.jobTitle,
        gender: profileData.gender || null,
        gender_custom: profileData.gender === 'others' ? (profileData.genderCustom || null) : null,
        birthday: profileData.birthday || null,
        // Include location details for Google Maps integration
        location_place_id: locationDetails.place_id || null,
        location_lat: locationDetails.lat,
        location_lng: locationDetails.lng,
        location_city: locationDetails.city || null,
        location_province: locationDetails.province || null,
        location_country: locationDetails.country || null,
        location_barangay: locationDetails.barangay || null,
        location_region: locationDetails.region || null
      };
      const token = await getSessionToken();
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      const text = await res.text();
      let data: any = null; try { data = JSON.parse(text); } catch {}
      if (!res.ok) throw new Error(data?.error || 'Failed to save profile');
      setUserProfile(prev => prev ? {
        ...prev,
        first_name: payload.first_name,
        last_name: payload.last_name,
        full_name: `${payload.first_name || ''} ${payload.last_name || ''}`.trim() || (prev.full_name || ''),
        location: payload.location,
        phone: payload.phone,
        bio: payload.bio,
        position: payload.position,
        gender: payload.gender,
        gender_custom: payload.gender_custom,
        birthday: payload.birthday || null,
        updated_at: new Date().toISOString()
      } : prev);
      setIsEditing(false);

      // Notify parent component that profile data has changed
      // This will trigger work status refresh if position changed
      if (payload.position !== undefined) {
        window.dispatchEvent(new CustomEvent('profilePositionChanged', { 
          detail: { position: payload.position, userId: user.id } 
        }));
      }

      // If user slug or resume slug changed due to name change, navigate
      try {
        const newSlug: string | undefined = data?.user?.slug;
        const oldSlug: string | undefined = (userProfile as any)?.slug;
        const newResumeSlug: string | undefined = data?.newResumeSlug;
        if (newSlug && newSlug !== oldSlug) router.replace(`/${newSlug}`);
        else if (newResumeSlug) router.replace(`/${newResumeSlug}`);
      } catch {}
    } catch (e) {
      console.error('❌ Failed to save profile:', e);
      alert(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    
    try {
      setPhotoUploading(true);
      setPhotoError('');
      
      console.log('📸 Starting photo upload from profile card...');
      
      // Optimize image
      const optimizedFile = await optimizeImage(file);
      console.log('✅ Image optimized');
      
      // Upload to Supabase
      const { fileName, publicUrl } = await uploadProfilePhoto(optimizedFile, user.id);
      console.log('✅ Photo uploaded to Supabase:', publicUrl);
      
      // Update local state
      setProfilePicture(publicUrl);
      setUserProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : prev);
      
      // Update Railway database
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          avatar_url: publicUrl
        })
      });
      
      if (response.ok) {
        console.log('✅ Profile photo updated in Railway');
        
        // Trigger header update
        window.dispatchEvent(new CustomEvent('profileUpdated'));
      } else {
        console.error('❌ Failed to update profile photo in Railway');
      }
      
    } catch (error) {
      console.error('❌ Photo upload failed:', error);
      
      // Extract meaningful error message
      let errorMessage = 'Upload failed';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Handle Supabase error objects
        if ('message' in error) {
          errorMessage = String(error.message);
        } else if ('error' in error) {
          errorMessage = String(error.error);
        } else {
          errorMessage = JSON.stringify(error);
        }
      } else {
        errorMessage = String(error);
      }
      
      setPhotoError(errorMessage);
    } finally {
      setPhotoUploading(false);
    }
  };



  // Load Career Games count from database sessions
  useEffect(() => {
    (async () => {
      try {
        if (!targetUserId) return;
        
        console.log('🔄 Profile card: Fetching games count from database sessions for:', targetUserId);
        const response = await fetch(`/api/user/games-count`, {
          headers: {
            'x-user-id': targetUserId
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.hasData && data.gamesCount !== undefined) {
            setCompletedGames(data.gamesCount);
            console.log('✅ Profile card: Games count loaded from database:', data.gamesCount, 'Breakdown:', data.breakdown);
          } else {
            console.log('⚠️ Profile card: No games count data found');
            setCompletedGames(0);
          }
        } else {
          console.log('⚠️ Profile card: Failed to fetch games count');
          setCompletedGames(0);
        }
        
      } catch (e) {
        console.error('❌ Profile card: Error loading games count:', e);
        setCompletedGames(0);
      }
    })();
  }, [targetUserId]);

  // Load Job Matches count based on active jobs analyzed
  useEffect(() => {
    (async () => {
      try {
        if (!targetUserId) return;
        setJobMatchesLoading(true)
        const response = await fetch(`/api/user/job-matches-count?threshold=70`, {
          headers: { 'x-user-id': targetUserId }
        })
        if (response.ok) {
          const data = await response.json()
          if (typeof data.matches === 'number') {
            setJobMatchesCount(data.matches)
          }
        }
      } catch (e) {
        // ignore
      } finally {
        setJobMatchesLoading(false)
      }
    })()
  }, [targetUserId])



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={className}
    >
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Profile Picture */}
            <div className="relative flex-shrink-0">
              {(() => {
                const overallScore = userProfile?.overall_score || 0;
                const rankInfo = getRank(overallScore);
                const borderClass = rankInfo.rank === 'GOLD' ? 'border-yellow-400' :
                                  rankInfo.rank === 'SILVER' ? 'border-gray-400' :
                                  rankInfo.rank === 'BRONZE' ? 'border-orange-400' :
                                  'border-cyan-400';
                
                return (
                  <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${borderClass} p-1`}>
                    {photoUploading ? (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    ) : profilePicture ? (
                      <img 
                        src={profilePicture} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : userProfile?.avatar_url ? (
                      <img 
                        src={userProfile.avatar_url} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-black">
                          {userInitials}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {showEditButton && user?.id === targetUserId && isEditing && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  <Button
                    type="button"
                    size="sm"
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded-md shadow"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={photoUploading}
                  >
                    {photoUploading ? 'Uploading…' : 'Change Photo'}
                  </Button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-6 mb-2">
                    <h2 className="text-3xl font-bold text-white">{userDisplayName}</h2>
                    
                    {/* Likes and Views Stats */}
                    <div className="flex items-center gap-4">
                      {/* Views */}
                      <div className="flex items-center gap-1">
                        <div className="p-1 rounded-full bg-cyan-500/20">
                          <Eye className="w-4 h-4 text-cyan-400" />
                        </div>
                        <span className="text-sm text-gray-300">1,247</span>
                      </div>
                      
                      {/* Likes */}
                      <div className="flex items-center gap-1">
                        <div className="p-1 rounded-full bg-pink-500/20">
                          <Heart className="w-4 h-4 text-pink-400" />
                        </div>
                        <span className="text-sm text-gray-300">89</span>
                      </div>
                    </div>
                  </div>
                  
                  {userProfile?.position && (
                    <div className="text-sm text-gray-300 mt-1">{userProfile.position}</div>
                  )}
                  {/* Rank Badge */}
                  {userProfile?.overall_score && userProfile.overall_score > 0 && (() => {
                    const rankInfo = getRank(userProfile.overall_score);
                    if (rankInfo.rank !== 'None') {
                      return (
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${rankInfo.bgColor} ${rankInfo.color} border ${rankInfo.borderColor}`}>
                            {rankInfo.rank} - Score: {userProfile.overall_score}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
                <div className="flex items-center gap-2">
                  {/* Edit Profile Button - Only for own profile */}
                  {showEditButton && user?.id === targetUserId && (
                    <>
                      {isEditing ? (
                        <>
                          <Button
                            variant="outline"
                            className="border-white/20 text-gray-300 hover:bg-white/10"
                            onClick={() => {
                              if (userProfile) {
                                setProfileData({
                                  firstName: userProfile.first_name || '',
                                  lastName: userProfile.last_name || '',
                                  email: userProfile.email || '',
                                  phone: userProfile.phone || '',
                                  location: userProfile.location || '',
                                  jobTitle: userProfile.position || '',
                                  company: '',
                                  bio: userProfile.bio || '',
                                  gender: userProfile.gender || '',
                                  genderCustom: userProfile.gender_custom || '',
                                  birthday: userProfile.birthday || ''
                                });
                              }
                              setIsEditing(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={saveProfileChanges}
                            disabled={isSaving}
                            className="bg-cyan-500 hover:bg-cyan-600"
                          >
                            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Edit3 className="w-4 h-4 mr-2" />}
                            Save
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)} className="bg-cyan-500">
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      )}
                    </>
                  )}
                  
                  {/* View Resume Button - Hidden for all users viewing other profiles */}
                  {/* Removed - no longer showing View Resume button for other users */}
                </div>
              </div>

              {/* Bio (editable for owner) */}
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-white font-medium mb-2">Bio</h4>
                {isEditing ? (
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself…"
                    className="bg-black/30 text-white border-white/20"
                  />
                ) : (
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {profileData.bio || '—'}
                  </p>
                )}
              </div>

              {/* Contact & Details from Users table (colorful, on-brand). If editing, show inputs. */}
              <div className="p-5 rounded-lg border border-white/10 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-600/10">
                <h4 className="text-white font-semibold mb-4">Profile Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* First Name */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded-md bg-cyan-500/20 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-cyan-300" />
                    </div>
                    <div className="w-full">
                      <div className="text-xs uppercase text-gray-400">First Name</div>
                      {isEditing ? (
                        <Input
                          value={profileData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="First Name"
                          className="mt-1 bg-black/40 text-white border-white/20"
                        />
                      ) : (
                        <div className="text-gray-100">{userProfile?.first_name || '—'}</div>
                      )}
                    </div>
                  </div>
                  {/* Last Name */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded-md bg-cyan-500/20 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-cyan-300" />
                    </div>
                    <div className="w-full">
                      <div className="text-xs uppercase text-gray-400">Last Name</div>
                      {isEditing ? (
                        <Input
                          value={profileData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Last Name"
                          className="mt-1 bg-black/40 text-white border-white/20"
                        />
                      ) : (
                        <div className="text-gray-100">{userProfile?.last_name || '—'}</div>
                      )}
                    </div>
                  </div>
                  {/* Location */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded-md bg-pink-500/20 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-pink-300" />
                    </div>
                    <div className="w-full">
                      <div className="text-xs uppercase text-gray-400">Location</div>
                      {isEditing ? (
                        <div className="relative mt-1">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                          <PlacesAutocomplete
                            value={profileData.location}
                            placeholder="Type city, province, municipality, or barangay"
                            onChange={(val) => handleInputChange('location', val)}
                            onSelect={(place) => {
                              handleInputChange('location', place.description);
                              setLocationDetails({
                                place_id: place.place_id,
                                lat: place.lat,
                                lng: place.lng,
                                city: place.city || '',
                                province: place.province || '',
                                country: place.country || '',
                                barangay: place.barangay || '',
                                region: place.region || ''
                              });
                            }}
                          />
                        </div>
                      ) : (
                        <div className="text-gray-100">{userProfile?.location || '—'}</div>
                      )}
                    </div>
                  </div>
                  {/* Job Title */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded-md bg-amber-500/20 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-amber-300" />
                    </div>
                    <div>
                      <div className="text-xs uppercase text-gray-400">Job Title</div>
                      {isEditing ? (
                        <Input
                          value={profileData.jobTitle}
                          onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                          placeholder="Job Title"
                          className="mt-1 bg-black/40 text-white border-white/20"
                        />
                      ) : (
                        <div className="text-gray-100">{userProfile?.position || '—'}</div>
                      )}
                    </div>
                  </div>
                  {/* Gender */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded-md bg-indigo-500/20 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-indigo-300" />
                    </div>
                    <div>
                      <div className="text-xs uppercase text-gray-400">Gender</div>
                      {isEditing ? (
                        <>
                          <Select value={profileData.gender} onValueChange={(v) => handleInputChange('gender', v)}>
                            <SelectTrigger className="mt-1 bg-black/50 text-white border-white/20">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="others">Others</SelectItem>
                            </SelectContent>
                          </Select>
                          {profileData.gender === 'others' && (
                            <Input
                              value={profileData.genderCustom}
                              onChange={(e) => handleInputChange('genderCustom', e.target.value)}
                              placeholder="Enter preferred gender"
                              className="mt-2 bg-black/40 text-white border-white/20"
                            />
                          )}
                        </>
                      ) : (
                        <div className="text-gray-100">{formatDisplayGender(userProfile?.gender, userProfile?.gender_custom)}</div>
                      )}
                    </div>
                  </div>
                  {/* Birthday + Age */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded-md bg-sky-500/20 flex items-center justify-center">
                      <CalendarDays className="w-4 h-4 text-sky-300" />
                    </div>
                    <div>
                      <div className="text-xs uppercase text-gray-400">Birthday</div>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={profileData.birthday}
                          onChange={(e) => handleInputChange('birthday', e.target.value)}
                          className="mt-1 bg-black/40 text-white border-white/20"
                        />
                      ) : (
                        <div className="text-gray-100">
                          {userProfile?.birthday ? `${new Date(userProfile.birthday as string).toLocaleDateString()}${computeAge(userProfile.birthday) !== null ? ` • Age ${computeAge(userProfile.birthday)}` : ''}` : '—'}
                </div>
              )}
                    </div>
                  </div>
                  {/* Account Created */}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded-md bg-fuchsia-500/20 flex items-center justify-center">
                      <CalendarDays className="w-4 h-4 text-fuchsia-300" />
                    </div>
                    <div>
                      <div className="text-xs uppercase text-gray-400">Account Created</div>
                      <div className="text-gray-100">{formatMonthYear(userProfile?.created_at) || '—'}</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
    </motion.div>
  );
}

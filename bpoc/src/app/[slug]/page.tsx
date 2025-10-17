'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import PlacesAutocomplete from '@/components/ui/places-autocomplete';
import { 
  User,
  Briefcase,
  BarChart3,
  Gamepad2,
  Brain,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Trophy,
  Medal,
  Heart,
  Eye,
  CheckCircle,
  DollarSign,
  Clock,
  Edit3,
  Save,
  X,
  CalendarDays,
  Target,
  FileText,
  TrendingUp,
  Lightbulb,
  Share,
  Camera,
  Info,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import LoadingScreen from '@/components/ui/loading-screen';
import Header from '@/components/layout/Header';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { uploadProfilePhoto, optimizeImage } from '@/lib/storage';

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  full_name: string;
  username?: string;
  email: string;
  phone?: string;
  location?: string;
  position?: string;
  location_place_id?: string;
  location_lat?: number | null;
  location_lng?: number | null;
  location_city?: string;
  location_province?: string;
  location_country?: string;
  avatar_url?: string;
  bio?: string;
  gender?: string;
  gender_custom?: string;
  birthday?: string;
  created_at: string;
  overall_score?: number;
  resume_score?: number;
  completed_games?: number;
  total_games?: number;
  key_strengths?: string[];
  strengths_analysis?: any;
  current_employer?: string;
  current_position?: string;
  current_salary?: string | number;
  notice_period_days?: number;
  current_mood?: string;
  work_status?: string;
  preferred_shift?: string;
  expected_salary?: string;
  minimum_salary_range?: number;
  maximum_salary_range?: number;
  work_setup?: string;
  completed_data?: boolean;
  ats_compatibility_score?: number;
  content_quality_score?: number;
  professional_presentation_score?: number;
  skills_alignment_score?: number;
  improvements?: string[];
  recommendations?: string[];
  improved_summary?: string;
  salary_analysis?: any;
  career_path?: any;
  section_analysis?: any;
  game_stats?: {
    bpoc_cultural_stats?: any;
    disc_personality_stats?: any;
    typing_hero_stats?: any;
    ultimate_stats?: any;
    bpoc_cultural_results?: any;
  };
  work_status_completed_data?: boolean;
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  // Get authentication state
  const { user, loading: authLoading } = useAuth();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState<boolean>(false);
  const [editedPersonalInfo, setEditedPersonalInfo] = useState({
    first_name: '',
    last_name: '',
    username: '',
    location: '',
    position: '',
    gender: '',
    gender_custom: '',
    birthday: '',
    location_place_id: '',
    location_lat: null as number | null,
    location_lng: null as number | null,
    location_city: '',
    location_province: '',
    location_country: ''
  });
  const [isEditingWorkStatus, setIsEditingWorkStatus] = useState<boolean>(false);
  const [editedWorkStatus, setEditedWorkStatus] = useState({
    current_employer: '',
    current_salary: '',
    notice_period_days: '',
    current_mood: '',
    work_status: '',
    preferred_shift: '',
    expected_salary: '',
    expected_salary_min: '',
    expected_salary_max: '',
    work_setup: ''
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false);
  const [editedBio, setEditedBio] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [photoError, setPhotoError] = useState<string>('');
  const [isAnimalReasonExpanded, setIsAnimalReasonExpanded] = useState<boolean>(false);
  const [isCoreTraitsExpanded, setIsCoreTraitsExpanded] = useState<boolean>(false);
  const [isCulturalStrengthsExpanded, setIsCulturalStrengthsExpanded] = useState<boolean>(false);
  const [isTypingAnalysisExpanded, setIsTypingAnalysisExpanded] = useState<boolean>(false);
  const [isTypingStrengthsExpanded, setIsTypingStrengthsExpanded] = useState<boolean>(false);
  const [showUsernameChangeModal, setShowUsernameChangeModal] = useState<boolean>(false);
  const [usernameChangeStep, setUsernameChangeStep] = useState<number>(1);

  // Function to determine rank based on overall score (matching leaderboards and talent search system)
  const getRank = (score: number) => {
    if (score >= 90 && score <= 100) return { rank: '💎 Diamond', color: 'text-cyan-400', bgColor: 'bg-cyan-500/20', borderColor: 'border-cyan-500/30', icon: '💎' }
    if (score >= 75 && score <= 89) return { rank: '🥈 Platinum', color: 'text-slate-300', bgColor: 'bg-slate-500/20', borderColor: 'border-slate-500/30', icon: '🥈' }
    if (score >= 60 && score <= 74) return { rank: '🥇 Gold', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30', icon: '🥇' }
    if (score >= 40 && score <= 59) return { rank: '🥉 Silver', color: 'text-gray-300', bgColor: 'bg-gray-500/20', borderColor: 'border-gray-500/30', icon: '🥉' }
    if (score >= 0 && score <= 39) return { rank: '🏅 Bronze', color: 'text-orange-400', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/30', icon: '🏅' }
    return { rank: 'None', color: 'text-gray-500', bgColor: 'bg-gray-600/20', borderColor: 'border-gray-600/30', icon: '❌' }
  }

  // Calculate rank based on overall score
  const rank = getRank(overallScore);

  // Helper functions for work status field management (matching stepper modal logic)
  const isFieldDisabled = (field: string) => {
    switch (editedWorkStatus.work_status) {
      case 'unemployed-looking-for-work':
      case 'student':
        return ['current_employer', 'current_salary', 'notice_period_days'].includes(field)
      default:
        return false
    }
  }

  const getFieldClassName = (field: string) => {
    const baseClass = "w-full bg-gray-700/50 border-2 border-blue-400/50 rounded-lg px-3 py-2 text-white text-lg font-semibold focus:border-blue-400 focus:bg-gray-700/70 focus:outline-none"
    return isFieldDisabled(field) 
      ? `${baseClass} opacity-60 cursor-not-allowed` 
      : baseClass
  }

  const getFieldPlaceholder = (field: string) => {
    switch (field) {
      case 'current_employer':
        switch (editedWorkStatus.work_status) {
          case 'employed':
            return 'e.g., ABC Company or "Prefer not to disclose"'
          case 'part-time':
            return 'e.g., XYZ Restaurant or "Prefer not to disclose"'
          case 'freelancer':
            return 'e.g., Self-employed / Freelance or "Prefer not to disclose"'
          case 'unemployed-looking-for-work':
            return 'Not applicable - currently unemployed'
          case 'student':
            return 'Not applicable - currently studying'
          default:
            return 'e.g., ABC Company or "Prefer not to disclose"'
        }
      
      case 'current_salary':
        switch (editedWorkStatus.work_status) {
          case 'employed':
            return 'e.g., 50000, 60000 (use full numbers, not 50k or 60k) or "Prefer not to disclose"'
          case 'part-time':
            return 'e.g., 15000, 20000 (use full numbers, not 15k or 20k) or "Prefer not to disclose"'
          case 'freelancer':
            return 'e.g., 30000, 40000 (monthly average, use full numbers, not 30k or 40k) or "Prefer not to disclose"'
          case 'unemployed-looking-for-work':
            return 'Not applicable - currently unemployed'
          case 'student':
            return 'Not applicable - currently studying'
          default:
            return 'e.g., 50000, 60000 (use full numbers, not 50k or 60k) or "Prefer not to disclose"'
        }
      
      case 'notice_period_days':
        switch (editedWorkStatus.work_status) {
          case 'employed':
            return 'e.g., 30 days'
          case 'part-time':
            return 'e.g., 15 days'
          case 'freelancer':
            return 'e.g., 0 days (immediate availability)'
          case 'unemployed-looking-for-work':
            return 'Not applicable - currently unemployed'
          case 'student':
            return 'Not applicable - currently studying'
          default:
            return 'e.g., 30 days'
        }
      
      default:
        return ''
    }
  }

  // Handle work status changes and disable/enable fields accordingly (matching stepper modal logic)
  useEffect(() => {
    if (!editedWorkStatus.work_status) return

    const newEditedWorkStatus = { ...editedWorkStatus }

    switch (editedWorkStatus.work_status) {
      case 'employed':
      case 'part-time':
        // Enable all fields - no changes needed
        break
      
      case 'unemployed-looking-for-work':
      case 'student':
        // Disable and clear: Current Employer, Current Salary, Notice Period
        newEditedWorkStatus.current_employer = ''
        newEditedWorkStatus.current_salary = ''
        newEditedWorkStatus.notice_period_days = ''
        break
      
      case 'freelancer':
        // Set Notice Period to 0 if no input
        if (!newEditedWorkStatus.notice_period_days) {
          newEditedWorkStatus.notice_period_days = '0'
        }
        break
    }

    // Only update if there are changes
    if (JSON.stringify(newEditedWorkStatus) !== JSON.stringify(editedWorkStatus)) {
      setEditedWorkStatus(newEditedWorkStatus)
    }
  }, [editedWorkStatus.work_status])

  // Sign up CTA component for anonymous users
  const SignUpCTA = ({ title, description, icon: Icon, className = "" }: { title: string; description: string; icon: any; className?: string }) => (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-2xl blur-xl"></div>
      <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-8 border border-blue-500/20 backdrop-blur-sm text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-300 text-lg mb-6">{description}</p>
        <Button
          onClick={() => {
            // Trigger sign-up dialog via URL parameter (same as resume-builder)
            const url = new URL(window.location.href);
            url.searchParams.set('signup', 'true');
            router.push(`${url.pathname}?${url.searchParams.toString()}`);
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105"
        >
          Sign Up to Access
        </Button>
      </div>
    </div>
  );

  // Function to start editing personal information
  const startEditingPersonalInfo = () => {
    if (userProfile) {
      setEditedPersonalInfo({
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        username: userProfile.username || '',
        location: userProfile.location || '',
        position: userProfile.position || '',
        gender: userProfile.gender || '',
        gender_custom: userProfile.gender_custom || '',
        birthday: userProfile.birthday || '',
        location_place_id: userProfile.location_place_id || '',
        location_lat: userProfile.location_lat || null,
        location_lng: userProfile.location_lng || null,
        location_city: userProfile.location_city || '',
        location_province: userProfile.location_province || '',
        location_country: userProfile.location_country || ''
      });
      setIsEditingPersonalInfo(true);
    }
  };

  // Function to cancel editing
  const cancelEditingPersonalInfo = () => {
    setIsEditingPersonalInfo(false);
    setEditedPersonalInfo({
      first_name: '',
      last_name: '',
      username: '',
      location: '',
      position: '',
      gender: '',
      gender_custom: '',
      birthday: '',
      location_place_id: '',
      location_lat: null,
      location_lng: null,
      location_city: '',
      location_province: '',
      location_country: ''
    });
  };

  // Function to verify username update and profile page accessibility
  const verifyUsernameUpdate = async (newUsername: string, maxAttempts = 8): Promise<boolean> => {
    console.log(`🔄 Starting verification for username: ${newUsername}`);
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        // Check if the profile page endpoint can find the user by new username
        const response = await fetch(
          `/api/public/user-by-slug?slug=${encodeURIComponent(newUsername)}&_t=${Date.now()}`,
          { 
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache'
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.user && data.user.id === userProfile?.id) {
            console.log(`✅ Profile verified and accessible after ${attempt + 1} attempt(s)`);
            return true;
          } else {
            console.log(`⏳ Attempt ${attempt + 1}: Profile found but user ID mismatch or no user data`);
          }
        } else {
          console.log(`⏳ Attempt ${attempt + 1}: Profile not yet accessible (${response.status})`);
        }
      } catch (error) {
        console.error(`⏳ Attempt ${attempt + 1} error:`, error);
      }
      
      // Wait before next attempt (exponential backoff with longer delays)
      const delay = Math.min(1000 * Math.pow(1.5, attempt), 4000);
      console.log(`⏳ Waiting ${delay}ms before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    console.warn('⚠️ Verification timed out after all attempts');
    return false;
  };

  // Function to save personal information changes
  const savePersonalInfo = async () => {
    if (!userProfile) return;
    
    // Check if username has changed
    const usernameChanged = editedPersonalInfo.username !== userProfile.username;
    
    // Show loading modal if username changed
    if (usernameChanged && editedPersonalInfo.username) {
      setShowUsernameChangeModal(true);
      setUsernameChangeStep(1);
    }
    
    setIsSaving(true);
    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('No session found');
        setShowUsernameChangeModal(false);
        return;
      }

      // Calculate full name from first and last name
      const fullName = `${editedPersonalInfo.first_name || ''} ${editedPersonalInfo.last_name || ''}`.trim();
      
      if (usernameChanged) setUsernameChangeStep(2); // Saving changes
      
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userId: userProfile.id,
          ...editedPersonalInfo,
          full_name: fullName,
          slug: editedPersonalInfo.username // Explicitly set slug to match new username
        }),
      });

      if (response.ok) {
        // Update the local state
        setUserProfile(prev => prev ? {
          ...prev,
          ...editedPersonalInfo,
          full_name: fullName
        } : null);
        
        // If username changed, verify update and redirect
        if (usernameChanged && editedPersonalInfo.username) {
          setUsernameChangeStep(3); // Verifying changes
          console.log('🔄 Verifying username update in database...');
          
          // Wait for initial database write to propagate
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Convert username to lowercase to match the database slug format
          const slugifiedUsername = editedPersonalInfo.username.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          console.log(`📝 Slugified username: ${editedPersonalInfo.username} → ${slugifiedUsername}`);
          
          // Verify the username is updated in the database
          const verified = await verifyUsernameUpdate(slugifiedUsername);
          
          setUsernameChangeStep(4); // Redirecting
          
          if (verified) {
            console.log('✅ Profile verified and accessible, redirecting...');
            // Small delay before redirect
            await new Promise(resolve => setTimeout(resolve, 300));
            // Redirect with cache busting to ensure fresh data (use slugified username for URL)
            window.location.href = `/${slugifiedUsername}?updated=${Date.now()}`;
        } else {
          console.warn('⚠️ Profile verification timed out');
          // Wait longer and try redirect anyway
          await new Promise(resolve => setTimeout(resolve, 2000));
          console.log('⚠️ Redirecting with longer timeout...');
          window.location.href = `/${slugifiedUsername}?updated=${Date.now()}`;
        }
      } else {
        // Username didn't change, but other profile fields were updated - refresh to update UI (navbar, profile display, etc.)
        console.log('✅ Profile updated (no username change), refreshing page...');
        await new Promise(resolve => setTimeout(resolve, 300));
        window.location.reload();
      }
      } else {
        console.error('Failed to save changes');
        setShowUsernameChangeModal(false);
        setUsernameChangeStep(1);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      setShowUsernameChangeModal(false);
      setUsernameChangeStep(1);
    } finally {
      if (!usernameChanged) {
        setIsSaving(false);
      }
      // Keep isSaving true and modal open if username changed until redirect completes
    }
  };

  // Work Status Edit Functions
  const startEditingWorkStatus = () => {
    if (userProfile) {
      // Parse existing salary range if it exists
      let expectedSalaryMin = '';
      let expectedSalaryMax = '';
      
      // First try to get from the new structured fields
      if (userProfile.minimum_salary_range && userProfile.maximum_salary_range) {
        expectedSalaryMin = String(userProfile.minimum_salary_range);
        expectedSalaryMax = String(userProfile.maximum_salary_range);
      } else if (userProfile.expected_salary) {
        // Fallback to parsing the concatenated string
        const salaryStr = String(userProfile.expected_salary);
        if (salaryStr.includes('-')) {
          const parts = salaryStr.replace(/P+/g, '').split('-');
          expectedSalaryMin = parts[0] || '';
          expectedSalaryMax = parts[1] || '';
        } else {
          expectedSalaryMin = salaryStr.replace(/P+/g, '');
        }
      }

      setEditedWorkStatus({
        current_employer: userProfile.current_employer || '',
        current_salary: String(userProfile.current_salary || ''),
        notice_period_days: String(userProfile.notice_period_days || ''),
        current_mood: userProfile.current_mood || '',
        work_status: userProfile.work_status || '',
        preferred_shift: userProfile.preferred_shift || '',
        expected_salary: userProfile.expected_salary || '',
        expected_salary_min: expectedSalaryMin,
        expected_salary_max: expectedSalaryMax,
        work_setup: userProfile.work_setup || ''
      });
    }
    setIsEditingWorkStatus(true);
  };

  const cancelEditingWorkStatus = () => {
    setIsEditingWorkStatus(false);
    setEditedWorkStatus({
      current_employer: '',
      current_salary: '',
      notice_period_days: '',
      current_mood: '',
      work_status: '',
      preferred_shift: '',
      expected_salary: '',
      expected_salary_min: '',
      expected_salary_max: '',
      work_setup: ''
    });
  };

  const saveWorkStatus = async () => {
    if (!userProfile) return;
    
    setIsSaving(true);
    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('❌ No session found');
        return;
      }

      console.log('🔄 Saving work status for user:', userProfile.id);
      console.log('📝 Work status data:', editedWorkStatus);

      const response = await fetch('/api/user/update-work-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userId: userProfile.id,
          ...editedWorkStatus,
          expected_salary_min: editedWorkStatus.expected_salary_min,
          expected_salary_max: editedWorkStatus.expected_salary_max
        }),
      });

      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Work status saved successfully:', result);
        
        // Update the local state
        setUserProfile(prev => prev ? {
          ...prev,
          current_employer: editedWorkStatus.current_employer,
          current_salary: editedWorkStatus.current_salary as string | number,
          notice_period_days: parseInt(editedWorkStatus.notice_period_days) || 0,
          current_mood: editedWorkStatus.current_mood,
          work_status: editedWorkStatus.work_status,
          preferred_shift: editedWorkStatus.preferred_shift,
          expected_salary: editedWorkStatus.expected_salary,
          minimum_salary_range: editedWorkStatus.expected_salary_min ? parseFloat(editedWorkStatus.expected_salary_min) : undefined,
          maximum_salary_range: editedWorkStatus.expected_salary_max ? parseFloat(editedWorkStatus.expected_salary_max) : undefined,
          work_setup: editedWorkStatus.work_setup
        } : null);
        setIsEditingWorkStatus(false);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Failed to save work status changes:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        
        // Show user-friendly error message
        alert(`Failed to save work status: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Error saving work status changes:', error);
      alert(`Error saving work status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Function to start editing bio
  const startEditingBio = () => {
    setEditedBio(userProfile?.bio || '');
    setIsEditingBio(true);
  };

  // Function to cancel bio editing
  const cancelEditingBio = () => {
    setEditedBio('');
    setIsEditingBio(false);
  };

  // Function to save bio changes
  const saveBio = async () => {
    if (!userProfile) return;
    
    setIsSaving(true);
    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error('No session found');
        return;
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userId: userProfile.id,
          bio: editedBio
        }),
      });

      if (response.ok) {
        // Update the local state
        setUserProfile(prev => prev ? {
          ...prev,
          bio: editedBio
        } : null);
        
        setIsEditingBio(false);
      } else {
        console.error('Failed to save bio changes');
      }
    } catch (error) {
      console.error('Error saving bio changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Function to handle profile picture upload
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !userProfile) return
    
    try {
      setIsUploadingPhoto(true)
      setPhotoError('')
      
      console.log('📸 Starting photo upload...')
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file')
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB')
      }
      
      // Optimize image
      const optimizedFile = await optimizeImage(file)
      console.log('✅ Image optimized')
      
      // Upload to Supabase
      const { fileName, publicUrl } = await uploadProfilePhoto(optimizedFile, userProfile.id)
      console.log('✅ Photo uploaded to Supabase:', publicUrl)
      
      // Update Railway database
      console.log('🔄 Updating Railway with avatar_url:', publicUrl)
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userProfile.id,
          avatar_url: publicUrl
        })
      })
      
      if (response.ok) {
        // Update local state
        setUserProfile(prev => prev ? {
          ...prev,
          avatar_url: publicUrl
        } : null)
        
        console.log('✅ Profile photo updated successfully')
        
        // Trigger header update
        window.dispatchEvent(new CustomEvent('profileUpdated'))
      } else {
        const errorData = await response.text()
        console.error('❌ Failed to update profile photo in Railway:', response.status, errorData)
        throw new Error('Failed to update profile photo')
      }
      
    } catch (error) {
      console.error('❌ Photo upload failed:', error)
      setPhotoError(error instanceof Error ? error.message : 'Photo upload failed')
    } finally {
      setIsUploadingPhoto(false)
      // Reset the input
      event.target.value = ''
    }
  };

  // Check if this is resume mode and redirect
  const modeParam = searchParams?.get('mode');
  const slugLower = (slug || '').toLowerCase();
  // Check if it's a resume slug (new format: firstName-lastName-XX or firstName-lastName-XX)
  const isResumeSlug = /^[a-z]+-[a-z]+-[a-z0-9]{2}$/.test(slugLower);
  const inferredMode = isResumeSlug ? 'resume' : 'profile';
  const initialMode = (modeParam === 'resume' || modeParam === 'profile') ? modeParam : inferredMode;
  const isProfileMode = initialMode === 'profile';

  // Redirect resume mode to separate resume page
  useEffect(() => {
    if (!isProfileMode) {
      router.replace(`/resume/${slug}`);
    }
  }, [isProfileMode, router, slug]);

  // Don't render anything if we're redirecting
  if (!isProfileMode) {
    return null;
  }

  // Refetch profile data when returning from stepper modal
  useEffect(() => {
    const handleFocus = async () => {
      // Only refetch if we have an existing profile and we're not in the middle of initial loading
      if (userProfile?.id && !loading) {
        try {
          const { data: { user: currentUser } } = await supabase.auth.getUser()
          const viewerUserId = currentUser?.id || null
          
          const res = await fetch(`/api/public/user-by-slug?slug=${encodeURIComponent(slug)}${viewerUserId ? `&viewerUserId=${viewerUserId}` : ''}`, { 
            cache: 'no-store'
          });
          
          if (res.ok) {
            const data = await res.json();
            const user = data.user || {};
            setUserProfile(user);
          }
        } catch (error) {
          console.log('Failed to refetch profile:', error);
        }
      }
    };

    // Listen for when the user returns to the page (from stepper modal)
    window.addEventListener('focus', handleFocus);
    
    // Also refetch when the component becomes visible again
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleFocus();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userProfile?.id, loading, slug]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // Get current user ID for privacy checking
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        const viewerUserId = currentUser?.id || null
        
        const res = await fetch(`/api/public/user-by-slug?slug=${encodeURIComponent(slug)}${viewerUserId ? `&viewerUserId=${viewerUserId}` : ''}`, { 
          cache: 'no-store'
        });
        
        if (!res.ok) {
          setError('Profile not found');
          setLoading(false);
          return;
        }
        
        const data = await res.json();
        const user = data.user || {};
        setUserProfile(user);
        
        // Fetch overall score from leaderboard
        if (user.id) {
          try {
            const scoreResponse = await fetch(`/api/leaderboards/user/${user.id}`);
            if (scoreResponse.ok) {
              const scoreData = await scoreResponse.json();
              setOverallScore(scoreData.overall?.overall_score || 0);
            }
          } catch (error) {
            console.log('Failed to fetch overall score:', error);
            setOverallScore(0);
          }
        }
        
        // Check if current user is the owner
        // If public=true query parameter is present, always show public view
        const isPublicView = searchParams.get('public') === 'true';
        
        if (isPublicView) {
          setIsOwner(false);
          setIsAnonymous(true);
        } else {
          try {
            const { data: authData } = await supabase.auth.getUser();
            const currentUserId = authData?.user?.id;
            setIsOwner(!!currentUserId && String(currentUserId) === String(user.id || ''));
            setIsAnonymous(!currentUserId);
          } catch {
            setIsOwner(false);
            setIsAnonymous(true);
          }
        }
        
        setError(null);

      } catch (e) {
        setError('Failed to load profile');
      } finally {
        // Add a small delay to ensure progress animation completes
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    if (slug) {
      fetchUserProfile();
    }
  }, [slug]);

  if (loading) {
    return <LoadingScreen 
      title="Loading Profile"
      subtitle="Fetching your profile information..."
      progressValue={100}
      showProgress={true}
      showStatusIndicators={true}
    />;
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Profile Not Found</h1>
            <p className="text-gray-400 mb-8">{error || 'The requested profile could not be found.'}</p>
            <Button onClick={() => router.push('/home')} variant="outline">
              Go Home
            </Button>
        </div>
      </div>
      
      {/* Custom CSS for owl animations */}
      <style jsx>{`
        @keyframes owlWise {
          0%, 100% { 
            transform: rotate(0deg) scale(1);
            filter: drop-shadow(0 0 10px #3b82f6);
          }
          25% { 
            transform: rotate(-15deg) scale(1.1);
            filter: drop-shadow(0 0 15px #3b82f6);
          }
          50% { 
            transform: rotate(0deg) scale(1.2);
            filter: drop-shadow(0 0 20px #3b82f6);
          }
          75% { 
            transform: rotate(15deg) scale(1.1);
            filter: drop-shadow(0 0 15px #3b82f6);
          }
        }
        
        @keyframes owlBlink {
          0%, 90%, 100% { 
            opacity: 1;
          }
          95% { 
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}

  return (
    <div className="min-h-screen cyber-grid overflow-hidden">
      <Header />
      
      {/* Username Change Loading Modal */}
      <Dialog open={showUsernameChangeModal} onOpenChange={() => {}}>
        <DialogContent 
          showCloseButton={false}
          className="max-w-md bg-gradient-to-br from-cyan-900/95 via-blue-900/95 to-purple-900/95 border-cyan-400/50"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              </div>
              Updating Username
            </DialogTitle>
            <DialogDescription className="text-cyan-200 text-base mt-2">
              Please wait while we update your profile...
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 text-cyan-400 animate-spin" />
            </div>
            
            {/* Progress Steps */}
            <div className="space-y-3">
              <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                usernameChangeStep >= 1 ? 'bg-cyan-500/20 border border-cyan-500/40' : 'bg-gray-800/20 border border-gray-700/40'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  usernameChangeStep >= 2 ? 'bg-green-500' : usernameChangeStep === 1 ? 'bg-cyan-500' : 'bg-gray-600'
                }`}>
                  {usernameChangeStep >= 2 ? (
                    <CheckCircle className="h-4 w-4 text-white" />
                  ) : usernameChangeStep === 1 ? (
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  ) : (
                    <span className="text-white text-xs">1</span>
                  )}
                </div>
                <span className={`text-sm font-medium ${usernameChangeStep >= 1 ? 'text-white' : 'text-gray-400'}`}>
                  Preparing changes
                </span>
              </div>

              <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                usernameChangeStep >= 2 ? 'bg-cyan-500/20 border border-cyan-500/40' : 'bg-gray-800/20 border border-gray-700/40'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  usernameChangeStep >= 3 ? 'bg-green-500' : usernameChangeStep === 2 ? 'bg-cyan-500' : 'bg-gray-600'
                }`}>
                  {usernameChangeStep >= 3 ? (
                    <CheckCircle className="h-4 w-4 text-white" />
                  ) : usernameChangeStep === 2 ? (
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  ) : (
                    <span className="text-white text-xs">2</span>
                  )}
                </div>
                <span className={`text-sm font-medium ${usernameChangeStep >= 2 ? 'text-white' : 'text-gray-400'}`}>
                  Saving to database
                </span>
              </div>

              <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                usernameChangeStep >= 3 ? 'bg-cyan-500/20 border border-cyan-500/40' : 'bg-gray-800/20 border border-gray-700/40'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  usernameChangeStep >= 4 ? 'bg-green-500' : usernameChangeStep === 3 ? 'bg-cyan-500' : 'bg-gray-600'
                }`}>
                  {usernameChangeStep >= 4 ? (
                    <CheckCircle className="h-4 w-4 text-white" />
                  ) : usernameChangeStep === 3 ? (
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  ) : (
                    <span className="text-white text-xs">3</span>
                  )}
                </div>
                <span className={`text-sm font-medium ${usernameChangeStep >= 3 ? 'text-white' : 'text-gray-400'}`}>
                  Verifying update
                </span>
              </div>

              <div className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                usernameChangeStep >= 4 ? 'bg-cyan-500/20 border border-cyan-500/40' : 'bg-gray-800/20 border border-gray-700/40'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  usernameChangeStep === 4 ? 'bg-cyan-500' : 'bg-gray-600'
                }`}>
                  {usernameChangeStep === 4 ? (
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  ) : (
                    <span className="text-white text-xs">4</span>
                  )}
                </div>
                <span className={`text-sm font-medium ${usernameChangeStep >= 4 ? 'text-white' : 'text-gray-400'}`}>
                  Redirecting to new profile
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      <div className="container mx-auto px-4 pt-24 pb-8 relative z-10">
        {/* Single Wide Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <Card className="bg-gray-900/50 border-gray-800 overflow-hidden">
            {/* Profile Header */}
            <div className="relative overflow-hidden">
              {/* Static Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10">
                <div className="absolute top-4 left-4 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl"></div>
                <div className="absolute top-8 right-8 w-16 h-16 bg-purple-400/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-4 left-1/3 w-12 h-12 bg-pink-400/20 rounded-full blur-xl"></div>
              </div>
              {/* Action Icons and Buttons */}
              <div className="absolute top-6 right-6 flex items-center gap-4 z-50">
                {/* Action Buttons - Left of Icons */}
                <div className="flex flex-col gap-3 relative z-50">
                  {/* View Resume Button - Hidden for all users viewing other profiles */}
                  {/* Removed - no longer showing View Resume button for other users */}

                  {/* Share Button - Only show for owners */}
                  {isOwner && (
                    <Button 
                      onClick={() => {
                        // Create a clean public-only version of the profile URL with ?public=true
                        const currentUrl = new URL(window.location.href);
                        const baseUrl = currentUrl.origin;
                        const currentPath = currentUrl.pathname;
                        
                        // Create a clean public URL by adding ?public=true query parameter
                        const publicProfileUrl = `${baseUrl}${currentPath}?public=true`;
                        
                        navigator.clipboard.writeText(publicProfileUrl).then(() => {
                          alert('Public profile link copied to clipboard!');
                        }).catch(() => {
                          alert('Failed to copy link. Please copy manually: ' + publicProfileUrl);
                        });
                      }}
                      className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 text-emerald-300 hover:from-emerald-500/40 hover:to-teal-500/40 hover:border-emerald-400/70 hover:text-emerald-200 transition-all duration-300 hover:scale-105 relative z-50 cursor-pointer"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <Share className="w-4 h-4 mr-2" />
                      Share Profile
                    </Button>
                  )}
                </div>

                {/* Eye Icon Only - Views count */}
                <div className="flex items-center gap-4">
                  {/* Eye Icon - Always show (views count) */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="p-3 rounded-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-110 cursor-default">
                      <Eye className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-xs text-blue-400 font-medium">2.4k</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 p-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                  {/* Avatar Section */}
                  <div className="relative">
                    {/* Glowing Ring */}
                    {overallScore > 0 && (
                      <div className={`absolute -inset-2 rounded-full opacity-75 blur-sm ${
                        rank.rank === '💎 Diamond' ? 'bg-gradient-to-r from-cyan-400 to-cyan-600' :
                        rank.rank === '🥈 Platinum' ? 'bg-gradient-to-r from-slate-300 to-slate-500' :
                        rank.rank === '🥇 Gold' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                        rank.rank === '🥉 Silver' ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                        rank.rank === '🏅 Bronze' ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                        'bg-gradient-to-r from-gray-500 to-gray-700'
                      }`}></div>
                    )}
                    
                    {/* Avatar */}
                    <div className={`relative w-36 h-36 rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl ${
                      overallScore > 0 ? 'border-4' : 'border-0'
                    } ${
                      overallScore > 0 ? 
                        rank.rank === '💎 Diamond' ? 'border-cyan-500/50' :
                        rank.rank === '🥈 Platinum' ? 'border-slate-400/60' :
                        rank.rank === '🥇 Gold' ? 'border-yellow-500/50' :
                        rank.rank === '🥉 Silver' ? 'border-gray-400/60' :
                        rank.rank === '🏅 Bronze' ? 'border-orange-500/50' :
                        'border-gray-500/50'
                      : ''
                    } ${
                      overallScore > 0 
                        ? rank.rank === '💎 Diamond' ? 'bg-gradient-to-br from-cyan-500 to-cyan-600' :
                          rank.rank === '🥈 Platinum' ? 'bg-gradient-to-br from-slate-400 to-slate-600' :
                          rank.rank === '🥇 Gold' ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                          rank.rank === '🥉 Silver' ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                          rank.rank === '🏅 Bronze' ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                          'bg-gradient-to-br from-gray-600 to-gray-700'
                        : 'bg-gradient-to-br from-gray-700 to-gray-800'
                    }`}>
                      {userProfile.avatar_url ? (
                        <img 
                          src={userProfile.avatar_url} 
                          alt={userProfile.full_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-4xl">
                          {(() => {
                            const displayName = isOwner ? userProfile.full_name : (userProfile.first_name || userProfile.full_name);
                            return displayName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U';
                          })()}
                        </div>
                      )}
                    </div>
                    
                    {/* Edit Photo Button - Only for profile owners */}
                    {isOwner && (
                      <div className="absolute bottom-0 right-0">
                        <label htmlFor="photo-upload" className="cursor-pointer">
                          <div className="w-10 h-10 bg-cyan-600 hover:bg-cyan-700 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 border-2 border-white/20">
                            {isUploadingPhoto ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Camera className="w-5 h-5 text-white" />
                            )}
                          </div>
                        </label>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          disabled={isUploadingPhoto}
                        />
                      </div>
                    )}
                    
                    {/* Photo Error Message */}
                    {photoError && (
                      <div className="absolute -bottom-8 left-0 right-0 text-center">
                        <p className="text-red-400 text-xs bg-red-500/10 px-2 py-1 rounded">
                          {photoError}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 space-y-4">
                    {/* Name and Verified Badge */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                          {isOwner ? userProfile.full_name : (userProfile.first_name || userProfile.full_name)}
                        </h1>
                        {(() => {
                          const hasPersonalData = userProfile.completed_data === true;
                          const hasWorkStatusData = userProfile.work_status_completed_data === true;
                          const hasResume = userProfile.resume_score !== undefined && userProfile.resume_score > 0;
                          const hasTypingHero = userProfile.game_stats?.typing_hero_stats && 
                            (userProfile.game_stats.typing_hero_stats.best_wpm > 0 || 
                             userProfile.game_stats.typing_hero_stats.latest_wpm > 0);
                          const hasDisc = userProfile.game_stats?.disc_personality_stats && 
                            (userProfile.game_stats.disc_personality_stats.primary_type || 
                             userProfile.game_stats.disc_personality_stats.latest_primary_type);
                          const completedSteps = [hasPersonalData, hasWorkStatusData, hasResume, hasTypingHero, hasDisc].filter(Boolean).length;
                          const completionPercentage = Math.round((completedSteps / 5) * 100);
                          
                          return completionPercentage === 100 ? (
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm">
                              <CheckCircle className="w-5 h-5 text-blue-400" />
                              <span className="text-sm font-bold text-blue-400">Verified</span>
                            </div>
                          ) : null;
                        })()}
                      </div>

                      {/* Username */}
                      {userProfile.username && (
                        <p className="text-xl text-gray-400 font-medium">
                          @{userProfile.username}
                        </p>
                      )}

                      {userProfile.position && (
                        <p className="text-2xl text-cyan-300 font-medium">
                          {userProfile.position}
                        </p>
                      )}
                    </div>

                    {/* Location and Rank */}
                    <div className="flex items-center gap-6 flex-wrap">
                      {userProfile.location && (
                        <div className="flex items-center gap-3 text-lg text-gray-300">
                          <div className="p-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                            <MapPin className="w-5 h-5 text-cyan-400" />
                          </div>
                          <span>{userProfile.location}</span>
                        </div>
                      )}

                      {overallScore > 0 ? (
                        <div className={`px-4 py-2 rounded-full border-2 ${rank.bgColor} ${rank.borderColor} backdrop-blur-sm`}>
                          <div className={`text-sm font-bold ${rank.color}`}>
                            {rank.rank} RANK
                          </div>
                        </div>
                      ) : (
                        <div className="px-4 py-2 rounded-full border-2 bg-gray-600/20 border-gray-500/30 backdrop-blur-sm">
                          <div className="text-sm font-bold text-gray-400">
                            NO RANK
                          </div>
                        </div>
                      )}
                    </div>


                    {/* Bio */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-white">Bio</h3>
                        {isOwner && (
                          <button
                            onClick={startEditingBio}
                            className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                      
                      {isEditingBio ? (
                        <div className="space-y-4">
                          <textarea
                            value={editedBio}
                            onChange={(e) => setEditedBio(e.target.value)}
                            placeholder="Tell us about yourself..."
                            className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                            maxLength={500}
                          />
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">
                              {editedBio.length}/500 characters
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={cancelEditingBio}
                                className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
                                disabled={isSaving}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={saveBio}
                                disabled={isSaving}
                                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isSaving ? 'Saving...' : 'Save'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {userProfile.bio ? (
                            <p className="text-gray-200 leading-relaxed text-lg">{userProfile.bio}</p>
                          ) : (
                            <p className="text-gray-400 italic">No bio data found</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-800">
              <nav className="flex space-x-0">
                {[
                  { id: 'overview', label: 'Overview', icon: User, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', activeBgColor: 'bg-cyan-500/20', borderColor: 'border-cyan-400' },
                  ...(isOwner ? [{ id: 'work-status', label: 'Work Status', icon: Briefcase, color: 'text-green-400', bgColor: 'bg-green-500/10', activeBgColor: 'bg-green-500/20', borderColor: 'border-green-400' }] : []),
                  { id: 'analysis', label: 'AI Analysis', icon: BarChart3, color: 'text-purple-400', bgColor: 'bg-purple-500/10', activeBgColor: 'bg-purple-500/20', borderColor: 'border-purple-400' },
                  { id: 'game-results', label: 'Game Results', icon: Gamepad2, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', activeBgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-400' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <div key={item.id} className="relative">
                      <button
                        onClick={() => setActiveSection(item.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-base font-medium transition-all duration-200 border-b-2 ${
                          isActive 
                            ? `text-white ${item.borderColor} ${item.activeBgColor}`
                            : `${item.color} border-transparent hover:text-white hover:${item.bgColor}`
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} />
                        {item.label}
                      </button>
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeSection === 'overview' && (
                  <div className="space-y-8">
                    {/* Profile Completion Section */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 rounded-2xl blur-xl"></div>
                      <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg">
                            <Target className="w-6 h-6 text-white" />
                          </div>
                          <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                            Profile Completion
                          </span>
                        </h3>
                        
                        {/* Profile Completion Percentage */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-semibold text-lg">Overall Progress</span>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                              {(() => {
                                const hasPersonalData = userProfile.completed_data === true;
                                const hasWorkStatusData = userProfile.work_status_completed_data === true;
                                const hasResume = userProfile.resume_score !== undefined && userProfile.resume_score > 0;
                                const hasTypingHero = userProfile.game_stats?.typing_hero_stats && 
                                  (userProfile.game_stats.typing_hero_stats.best_wpm > 0 || 
                                   userProfile.game_stats.typing_hero_stats.latest_wpm > 0);
                                const hasDisc = userProfile.game_stats?.disc_personality_stats && 
                                  (userProfile.game_stats.disc_personality_stats.primary_type || 
                                   userProfile.game_stats.disc_personality_stats.latest_primary_type);
                                const completedSteps = [hasPersonalData, hasWorkStatusData, hasResume, hasTypingHero, hasDisc].filter(Boolean).length;
                                return Math.round((completedSteps / 5) * 100);
                              })()}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-4">
                            <div 
                              className="bg-gradient-to-r from-blue-400 to-cyan-500 h-4 rounded-full transition-all duration-1000 ease-out"
                              style={{ 
                                width: `${(() => {
                                  const hasPersonalData = userProfile.completed_data === true;
                                  const hasWorkStatusData = userProfile.work_status_completed_data === true;
                                  const hasResume = userProfile.resume_score !== undefined && userProfile.resume_score > 0;
                                  const hasTypingHero = userProfile.game_stats?.typing_hero_stats && 
                                    (userProfile.game_stats.typing_hero_stats.best_wpm > 0 || 
                                     userProfile.game_stats.typing_hero_stats.latest_wpm > 0);
                                  const hasDisc = userProfile.game_stats?.disc_personality_stats && 
                                    (userProfile.game_stats.disc_personality_stats.primary_type || 
                                     userProfile.game_stats.disc_personality_stats.latest_primary_type);
                                  const completedSteps = [hasPersonalData, hasWorkStatusData, hasResume, hasTypingHero, hasDisc].filter(Boolean).length;
                                  return (completedSteps / 5) * 100;
                                })()}%` 
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Profile Completion Steps */}
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-white mb-4">Complete Your Profile</h4>
                          
                          {/* Step 1: Personal Information */}
                          <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              userProfile.completed_data === true
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-600 text-gray-400'
                            }`}>
                              {userProfile.completed_data === true ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : (
                                <span className="text-sm font-bold">1</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h5 className="text-white font-semibold">Personal Information</h5>
                              <p className="text-gray-400 text-sm">Complete your basic profile information</p>
                            </div>
                            {userProfile.completed_data === true ? (
                              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Completed</Badge>
                            ) : isOwner ? (
                              <Button
                                onClick={() => router.push('/?step=1')}
                                size="sm"
                                className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30"
                              >
                                Complete
                              </Button>
                            ) : null}
                          </div>

                          {/* Step 2: Work Status */}
                          <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              userProfile.work_status_completed_data === true
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-600 text-gray-400'
                            }`}>
                              {userProfile.work_status_completed_data === true ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : (
                                <span className="text-sm font-bold">2</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h5 className="text-white font-semibold">Work Status</h5>
                              <p className="text-gray-400 text-sm">Provide your current work information</p>
                            </div>
                            {userProfile.work_status_completed_data === true ? (
                              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Completed</Badge>
                            ) : isOwner ? (
                              <Button
                                onClick={() => router.push('/?step=2')}
                                size="sm"
                                className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30"
                              >
                                Complete
                              </Button>
                            ) : null}
                          </div>

                          {/* Step 3: Resume Builder */}
                          <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              userProfile.resume_score !== undefined && userProfile.resume_score > 0
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-600 text-gray-400'
                            }`}>
                              {userProfile.resume_score !== undefined && userProfile.resume_score > 0 ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : (
                                <span className="text-sm font-bold">3</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h5 className="text-white font-semibold">Resume Builder</h5>
                              <p className="text-gray-400 text-sm">Upload and analyze your resume</p>
                            </div>
                            {userProfile.resume_score !== undefined && userProfile.resume_score > 0 ? (
                              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Completed</Badge>
                            ) : isOwner ? (
                              <Button
                                onClick={() => router.push('/resume-builder')}
                                size="sm"
                                className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30"
                              >
                                Start
                              </Button>
                            ) : null}
                          </div>

                          {/* Step 4: Typing Hero */}
                          <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              userProfile.game_stats?.typing_hero_stats && 
                              (userProfile.game_stats.typing_hero_stats.best_wpm > 0 || 
                               userProfile.game_stats.typing_hero_stats.latest_wpm > 0)
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-600 text-gray-400'
                            }`}>
                              {userProfile.game_stats?.typing_hero_stats && 
                               (userProfile.game_stats.typing_hero_stats.best_wpm > 0 || 
                                userProfile.game_stats.typing_hero_stats.latest_wpm > 0) ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : (
                                <span className="text-sm font-bold">4</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h5 className="text-white font-semibold">Typing Hero</h5>
                              <p className="text-gray-400 text-sm">Improve your typing skills and speed</p>
                            </div>
                            {userProfile.game_stats?.typing_hero_stats && 
                             (userProfile.game_stats.typing_hero_stats.best_wpm > 0 || 
                              userProfile.game_stats.typing_hero_stats.latest_wpm > 0) ? (
                              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Completed</Badge>
                            ) : isOwner ? (
                              <Button
                                onClick={() => router.push('/career-tools/games/typing-hero')}
                                size="sm"
                                className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30"
                              >
                                Start
                              </Button>
                            ) : null}
                          </div>

                          {/* Step 5: BPOC DISC */}
                          <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              userProfile.game_stats?.disc_personality_stats && 
                              (userProfile.game_stats.disc_personality_stats.primary_type || 
                               userProfile.game_stats.disc_personality_stats.latest_primary_type)
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-600 text-gray-400'
                            }`}>
                              {userProfile.game_stats?.disc_personality_stats && 
                               (userProfile.game_stats.disc_personality_stats.primary_type || 
                                userProfile.game_stats.disc_personality_stats.latest_primary_type) ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : (
                                <span className="text-sm font-bold">5</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <h5 className="text-white font-semibold">BPOC DISC</h5>
                              <p className="text-gray-400 text-sm">Discover your personality type and communication style</p>
                            </div>
                            {userProfile.game_stats?.disc_personality_stats && 
                             (userProfile.game_stats.disc_personality_stats.primary_type || 
                              userProfile.game_stats.disc_personality_stats.latest_primary_type) ? (
                              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Completed</Badge>
                            ) : isOwner ? (
                              <Button
                                onClick={() => router.push('/career-tools/games/disc-personality')}
                                size="sm"
                                className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30"
                              >
                                Start
                              </Button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BPOC.io Verification Card - Only show for profile owner */}
                    {isOwner && (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl"></div>
                        <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-green-500/20 backdrop-blur-sm">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">BPOC.IO Verification</h3>
                            <p className="text-gray-400 text-sm">Your profile verification status</p>
                          </div>
                        </div>
                        
                        {(() => {
                          // Use the same logic as Profile Completion card
                          const hasPersonalData = userProfile.completed_data === true;
                          const hasWorkStatusData = userProfile.work_status_completed_data === true;
                          const hasResume = userProfile.resume_score !== undefined && userProfile.resume_score > 0;
                          const hasTypingHero = userProfile.game_stats?.typing_hero_stats && 
                            (userProfile.game_stats.typing_hero_stats.best_wpm > 0 || 
                             userProfile.game_stats.typing_hero_stats.latest_wpm > 0);
                          const hasDisc = userProfile.game_stats?.disc_personality_stats && 
                            (userProfile.game_stats.disc_personality_stats.primary_type || 
                             userProfile.game_stats.disc_personality_stats.latest_primary_type);
                          const completedSteps = [hasPersonalData, hasWorkStatusData, hasResume, hasTypingHero, hasDisc].filter(Boolean).length;
                          const completionPercentage = Math.round((completedSteps / 5) * 100);
                          
                          const isFullyVerified = completionPercentage >= 80;
                          
                          return (
                            <div className="space-y-4">
                              {/* Verification Status */}
                              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    isFullyVerified 
                                      ? 'bg-green-500 text-white' 
                                      : 'bg-yellow-500 text-white'
                                  }`}>
                                    {isFullyVerified ? (
                                      <CheckCircle className="w-6 h-6" />
                                    ) : (
                                      <span className="text-lg">⚠️</span>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="text-white font-semibold">
                                      {isFullyVerified ? 'Verified Profile' : 'Pending Verification'}
                                    </h4>
                                    <p className="text-gray-400 text-sm">
                                      {isFullyVerified 
                                        ? `Your profile is verified (${completionPercentage}% complete)` 
                                        : 'Complete your profile to gain verification'
                                      }
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className={`text-2xl font-bold ${
                                    isFullyVerified ? 'text-green-400' : 'text-yellow-400'
                                  }`}>
                                    {completionPercentage}%
                                  </div>
                                </div>
                              </div>
                              
                              {/* Verification Explanation */}
                              <div className="bg-gradient-to-r from-gray-700/30 to-gray-800/30 rounded-lg p-4 border border-gray-600/30">
                                <h5 className="text-white font-semibold mb-2 flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  Verification Requirements
                                </h5>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                  {isFullyVerified ? (
                                    <>
                                      <span className="text-green-400 font-medium">✓ Congratulations!</span> You have completed {completionPercentage}% of your profile and gained the <span className="text-blue-400 font-semibold">Verified</span> badge. This badge appears next to your name and indicates that your profile meets the verification requirements.
                                    </>
                                  ) : (
                                    <>
                                      To earn the <span className="text-blue-400 font-semibold">Verified</span> badge, you need to complete at least 100% of your profile information. The verified badge helps establish trust and credibility with other users and potential employers. Complete the remaining profile sections above to gain verification.
                                    </>
                                  )}
                                </p>
                              </div>
                              
                              {/* Verification Benefits */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <span className="text-green-400 font-semibold text-sm">Trust & Credibility</span>
                                  </div>
                                  <p className="text-gray-300 text-xs">
                                    Verified profiles are more trusted by employers and other users
                                  </p>
                                </div>
                                
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Star className="w-4 h-4 text-blue-400" />
                                    <span className="text-blue-400 font-semibold text-sm">Enhanced Visibility</span>
                                  </div>
                                  <p className="text-gray-300 text-xs">
                                    Verified profiles appear higher in talent search and leaderboards
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                        </div>
                      </div>
                    )}

                    {/* Personal Information Section */}
                    <div className="relative z-[99999]">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl"></div>
                      <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-cyan-500/20 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-2xl font-bold flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
                              Personal Information
                            </span>
                          </h3>
                          {isOwner && (
                            <div className="flex items-center gap-2">
                              {!isEditingPersonalInfo ? (
                                <Button 
                                  onClick={startEditingPersonalInfo}
                                  variant="outline" 
                                  size="sm"
                                  className="bg-cyan-500/10 border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/30 hover:border-cyan-400/70 hover:text-cyan-200"
                                >
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Edit
                                </Button>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Button
                                    onClick={savePersonalInfo}
                                    disabled={isSaving}
                                    size="sm"
                                    className="bg-green-500/10 border-green-400/30 text-green-300 hover:bg-green-500/30 hover:border-green-400/70 hover:text-green-200"
                                  >
                                    <Save className="w-4 h-4 mr-2" />
                                    {isSaving ? 'Saving...' : 'Save'}
                                  </Button>
                                  <Button
                                    onClick={cancelEditingPersonalInfo}
                                    variant="outline"
                                    size="sm"
                                    className="bg-red-500/10 border-red-400/30 text-red-300 hover:bg-red-500/30 hover:border-red-400/70 hover:text-red-200"
                                  >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                          {/* Owner-only fields */}
                          {isOwner && (
                            <>
                              {/* 1. First Name */}
                              {userProfile.first_name && (
                                <div className="group bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 hover:scale-105">
                                  <label className="text-sm font-medium text-cyan-300 mb-2 block">First Name</label>
                                  {isEditingPersonalInfo ? (
                                    <input 
                                      type="text" 
                                      value={editedPersonalInfo.first_name}
                                      onChange={(e) => setEditedPersonalInfo(prev => ({ ...prev, first_name: e.target.value }))}
                                      className="w-full bg-gray-700/50 text-white text-lg font-semibold border-2 border-cyan-400/50 rounded-lg px-3 py-2 outline-none focus:border-cyan-400 focus:bg-gray-700/70 transition-all duration-200"
                                      placeholder="Enter first name"
                                    />
                                  ) : (
                                    <p className="text-white text-lg font-semibold">
                                      {userProfile.first_name}
                                    </p>
                                  )}
                                </div>
                              )}
                              
                              {/* 2. Last Name */}
                              {userProfile.last_name && (
                                <div className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105">
                                  <label className="text-sm font-medium text-purple-300 mb-2 block">Last Name</label>
                                  {isEditingPersonalInfo ? (
                                    <input 
                                      type="text" 
                                      value={editedPersonalInfo.last_name}
                                      onChange={(e) => setEditedPersonalInfo(prev => ({ ...prev, last_name: e.target.value }))}
                                      className="w-full bg-gray-700/50 text-white text-lg font-semibold border-2 border-purple-400/50 rounded-lg px-3 py-2 outline-none focus:border-purple-400 focus:bg-gray-700/70 transition-all duration-200"
                                      placeholder="Enter last name"
                                    />
                                  ) : (
                                    <p className="text-white text-lg font-semibold">
                                      {userProfile.last_name}
                                    </p>
                                  )}
                                </div>
                              )}
                              
                              {/* 3. Username */}
                              {userProfile.username && (
                                <div className="group bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-4 border border-orange-400/30 hover:border-orange-400/60 transition-all duration-300 hover:scale-105">
                                  <label className="text-sm font-medium text-orange-300 mb-2 block">Username</label>
                                  {isEditingPersonalInfo ? (
                                    <input 
                                      type="text" 
                                      value={editedPersonalInfo.username}
                                      onChange={(e) => setEditedPersonalInfo(prev => ({ ...prev, username: e.target.value }))}
                                      className="w-full bg-gray-700/50 text-white text-lg font-semibold border-2 border-orange-400/50 rounded-lg px-3 py-2 outline-none focus:border-orange-400 focus:bg-gray-700/70 transition-all duration-200"
                                      placeholder="Enter username"
                                    />
                                  ) : (
                                    <p className="text-white text-lg font-semibold">
                                      @{userProfile.username}
                                    </p>
                                  )}
                                </div>
                              )}
                              
                              {/* 4. Job Title */}
                              {userProfile.position && (
                                <div className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 hover:scale-105">
                                  <label className="text-sm font-medium text-blue-300 mb-2 block">Job Title</label>
                                  {isEditingPersonalInfo ? (
                                    <input 
                                      type="text" 
                                      value={editedPersonalInfo.position}
                                      onChange={(e) => setEditedPersonalInfo(prev => ({ ...prev, position: e.target.value }))}
                                      className="w-full bg-gray-700/50 text-white text-lg font-semibold border-2 border-blue-400/50 rounded-lg px-3 py-2 outline-none focus:border-blue-400 focus:bg-gray-700/70 transition-all duration-200"
                                      placeholder="Enter job title"
                                    />
                                  ) : (
                                    <p className="text-white text-lg font-semibold">
                                      {userProfile.position}
                                    </p>
                                  )}
                                </div>
                              )}
                              
                              {/* 5. Location */}
                              {userProfile.location && (
                                <div className="group bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-400/30 hover:border-green-400/60 transition-all duration-300 hover:scale-105">
                                  <label className="text-sm font-medium text-green-300 mb-2 block">Location</label>
                                  {isEditingPersonalInfo ? (
                                    <div className="relative z-[9999]">
                                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400 pointer-events-none z-10" />
                                      <PlacesAutocomplete
                                        value={editedPersonalInfo.location}
                                        placeholder="Type city, province, municipality, or barangay"
                                        onChange={(val) => setEditedPersonalInfo(prev => ({ ...prev, location: val }))}
                        onSelect={(place) => {
                          setEditedPersonalInfo(prev => ({
                            ...prev,
                            location: place.description,
                            location_place_id: place.place_id,
                            location_lat: place.lat as number | null,
                            location_lng: place.lng as number | null,
                            location_city: place.city || '',
                            location_province: place.province || '',
                            location_country: place.country || ''
                          }))
                        }}
                                      />
                                      <p className="text-xs text-green-400/70 mt-1">Start typing to see location suggestions</p>
                                    </div>
                                  ) : (
                                    <p className="text-white text-lg font-semibold">
                                      {userProfile.location}
                                    </p>
                                  )}
                                </div>
                              )}
                              
                              {/* 6. Gender */}
                              {userProfile.gender && (
                                <div className="group bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-xl p-4 border border-pink-400/30 hover:border-pink-400/60 transition-all duration-300 hover:scale-105">
                                  <label className="text-sm font-medium text-pink-300 mb-2 block">Gender</label>
                                  {isEditingPersonalInfo ? (
                                    <div className="space-y-2">
                                      <select
                                        value={editedPersonalInfo.gender}
                                        onChange={(e) => setEditedPersonalInfo(prev => ({ 
                                          ...prev, 
                                          gender: e.target.value,
                                          gender_custom: e.target.value === 'other' ? prev.gender_custom : ''
                                        }))}
                                        className="w-full bg-gray-700/50 text-white text-lg font-semibold border-2 border-pink-400/50 rounded-lg px-3 py-2 outline-none focus:border-pink-400 focus:bg-gray-700/70 transition-all duration-200"
                                      >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                      </select>
                                      {editedPersonalInfo.gender === 'other' && (
                                        <input 
                                          type="text" 
                                          value={editedPersonalInfo.gender_custom}
                                          onChange={(e) => setEditedPersonalInfo(prev => ({ ...prev, gender_custom: e.target.value }))}
                                          className="w-full bg-gray-700/50 text-white text-base font-medium border-2 border-pink-400/50 rounded-lg px-3 py-2 outline-none focus:border-pink-400 focus:bg-gray-700/70 transition-all duration-200"
                                          placeholder="Please specify your gender"
                                        />
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-white text-lg font-semibold capitalize">
                                      {userProfile.gender_custom || userProfile.gender}
                                    </p>
                                  )}
                                </div>
                              )}
                              
                              {/* 7. Birthday */}
                              {userProfile.birthday && (
                                <div className="group bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-xl p-4 border border-indigo-400/30 hover:border-indigo-400/60 transition-all duration-300 hover:scale-105">
                                  <label className="text-sm font-medium text-indigo-300 mb-2 block">Birthday</label>
                                  {isEditingPersonalInfo ? (
                                    <input 
                                      type="date"
                                      value={editedPersonalInfo.birthday}
                                      onChange={(e) => setEditedPersonalInfo(prev => ({ ...prev, birthday: e.target.value }))}
                                      className="w-full bg-gray-700/50 text-white text-lg font-semibold border-2 border-indigo-400/50 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 focus:bg-gray-700/70 transition-all duration-200"
                                    />
                                  ) : (
                                    <p className="text-white text-lg font-semibold">
                                      {new Date(userProfile.birthday).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      })}
                                    </p>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                          
                          {/* 8. Age - Always visible */}
                          {userProfile.birthday && (
                            <div className="group bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-xl p-4 border border-teal-400/30 hover:border-teal-400/60 transition-all duration-300 hover:scale-105">
                              <label className="text-sm font-medium text-teal-300 mb-2 block">Age</label>
                              <p className="text-white text-lg font-semibold">
                                {Math.floor((new Date().getTime() - new Date(userProfile.birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) + " years old"}
                              </p>
                            </div>
                          )}

                          {/* 9. Member Since - Always visible */}
                          {userProfile.created_at && (
                            <div className="group bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl p-4 border border-violet-400/30 hover:border-violet-400/60 transition-all duration-300 hover:scale-105">
                              <label className="text-sm font-medium text-violet-300 mb-2 block">Member Since</label>
                              <p className="text-white text-lg font-semibold">
                                {new Date(userProfile.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Resume Score Section */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 rounded-2xl blur-xl"></div>
                      <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-purple-500/20 backdrop-blur-sm">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-white" />
                          </div>
                          <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                            Resume Score
                          </span>
                        </h3>
                        {userProfile.resume_score ? (
                          <div className="flex items-center gap-6">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-lg opacity-50"></div>
                              <div className="relative text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                {userProfile.resume_score}
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-semibold text-xl mb-2">Overall Resume Quality</p>
                              <p className="text-gray-300 text-base">Based on AI analysis of your resume</p>
                              <div className="mt-4 w-full bg-gray-700 rounded-full h-3">
                                <div 
                                  className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                  style={{ width: `${userProfile.resume_score}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                              <BarChart3 className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="text-gray-400 text-lg mb-4">Resume score is set to private</p>
                            {isOwner && (
                              <Button
                                onClick={() => router.push('/resume-builder')}
                                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 hover:from-purple-500/40 hover:to-pink-500/40 hover:border-purple-400/70 hover:text-purple-200 transition-all duration-300 hover:scale-105"
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                Upload Resume for Analysis
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Games Completed Section */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 rounded-2xl blur-xl"></div>
                      <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-yellow-500/20 backdrop-blur-sm">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                            <Gamepad2 className="w-6 h-6 text-white" />
                          </div>
                          <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                            Games Completed
                          </span>
                        </h3>
                        {userProfile.completed_games !== undefined ? (
                          <div>
                            <div className="flex items-center gap-6">
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-50"></div>
                                <div className="relative text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                  {userProfile.completed_games || 0}/2
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="text-white font-semibold text-xl mb-2">Career Games Completed</p>
                                <p className="text-gray-300 text-base mb-4">
                                  {userProfile.completed_games === 2 
                                    ? "All games completed! 🎉" 
                                    : `${2 - (userProfile.completed_games || 0)} games remaining`}
                                </p>
                                <div className="w-full bg-gray-700 rounded-full h-3">
                                  <div 
                                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${((userProfile.completed_games || 0) / 2) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            {/* Add CTA button when 0 games completed */}
                            {userProfile.completed_games === 0 && isOwner && (
                              <div className="mt-6 text-center">
                                <Button
                                  onClick={() => router.push('/career-tools/games')}
                                  className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 text-yellow-300 hover:from-yellow-500/40 hover:to-orange-500/40 hover:border-yellow-400/70 hover:text-yellow-200 transition-all duration-300 hover:scale-105"
                                >
                                  <Gamepad2 className="w-4 h-4 mr-2" />
                                  Start Playing Career Games
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Gamepad2 className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="text-gray-400 text-lg mb-4">No game data found</p>
                            {isOwner && (
                              <Button
                                onClick={() => router.push('/career-tools/games')}
                                className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 text-yellow-300 hover:from-yellow-500/30 hover:to-orange-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105"
                              >
                                <Gamepad2 className="w-4 h-4 mr-2" />
                                Play Career Games
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sign-up CTA for anonymous users */}
                    {isAnonymous && (
                      <SignUpCTA
                        title="Create Your Own Analysis"
                        description="Sign up to upload your resume and get detailed AI analysis scores, personalized insights, and career recommendations tailored just for you."
                        icon={BarChart3}
                      />
                    )}

                    {/* Key Strengths Section - Hidden for anonymous users and other users */}
                    {isOwner && (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl"></div>
                        <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-green-500/20 backdrop-blur-sm">
                          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg">
                              <Star className="w-6 h-6 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                              Key Strengths
                            </span>
                          </h3>
                          {userProfile.key_strengths && userProfile.key_strengths.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {userProfile.key_strengths.map((strength, index) => (
                                <div key={index} className="group bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-400/30 hover:border-green-400/60 transition-all duration-300 hover:scale-105">
                                  <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex-shrink-0 animate-pulse"></div>
                                    <span className="text-white font-semibold text-lg">{strength}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="w-8 h-8 text-gray-500" />
                              </div>
                              <p className="text-gray-400 text-lg mb-4">Key strengths are set to private</p>
                              {isOwner && (
                                <Button
                                  onClick={() => router.push('/resume-builder')}
                                  className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 hover:from-purple-500/40 hover:to-pink-500/40 hover:border-purple-400/70 hover:text-purple-200 transition-all duration-300 hover:scale-105"
                                >
                                  <FileText className="w-4 h-4 mr-2" />
                                  Upload Resume for Analysis
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {activeSection === 'work-status' && (
                  <div className="space-y-8">
                    {/* Work Status Information */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl"></div>
                      <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-green-500/20 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-2xl font-bold flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg">
                              <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                              Work Status Information
                            </span>
                          </h3>
                          {isOwner && (
                            <div className="flex gap-2">
                              {!isEditingWorkStatus ? (
                                <Button
                                  onClick={startEditingWorkStatus}
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-500/10 border-green-400/30 text-green-400 hover:bg-green-500/20 hover:border-green-400/50"
                                >
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Edit
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    onClick={saveWorkStatus}
                                    disabled={isSaving}
                                    size="sm"
                                    className="bg-green-500/20 border-green-400/50 text-green-400 hover:bg-green-500/30"
                                  >
                                    <Save className="w-4 h-4 mr-2" />
                                    {isSaving ? 'Saving...' : 'Save'}
                                  </Button>
                                  <Button
                                    onClick={cancelEditingWorkStatus}
                                    variant="outline"
                                    size="sm"
                                    className="bg-red-500/10 border-red-400/30 text-red-400 hover:bg-red-500/20 hover:border-red-400/50"
                                  >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                  </Button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Job Title - Always visible */}
                          <div className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105">
                            <label className="text-sm font-medium text-purple-300 mb-2 block">Job Title</label>
                            <p className="text-white text-lg font-semibold">
                              {userProfile.position || "Data is set to private"}
                            </p>
                          </div>

                          {/* Mood at Current Employer - Always visible */}
                          <div className="group bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-xl p-4 border border-pink-400/30 hover:border-pink-400/60 transition-all duration-300 hover:scale-105">
                            <label className="text-sm font-medium text-pink-300 mb-2 block">Mood at Current Employer</label>
                            {isEditingWorkStatus ? (
                              <select
                                value={editedWorkStatus.current_mood}
                                onChange={(e) => setEditedWorkStatus(prev => ({ ...prev, current_mood: e.target.value }))}
                                className="w-full bg-gray-700/50 border-2 border-pink-400/50 rounded-lg px-3 py-2 text-white text-lg font-semibold focus:border-pink-400 focus:bg-gray-700/70 focus:outline-none"
                              >
                                <option value="">How are you feeling?</option>
                                <option value="happy">😊 Happy</option>
                                <option value="satisfied">😌 Satisfied</option>
                                <option value="sad">😔 Sad</option>
                                <option value="undecided">🤔 Undecided</option>
                              </select>
                            ) : (
                              <p className="text-white text-lg font-semibold">
                                {userProfile.current_mood || "No mood data found"}
                              </p>
                            )}
                          </div>

                          {/* Work Status - Always visible */}
                          <div className="group bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl p-4 border border-emerald-400/30 hover:border-emerald-400/60 transition-all duration-300 hover:scale-105">
                            <label className="text-sm font-medium text-emerald-300 mb-2 block">Work Status</label>
                            {isEditingWorkStatus ? (
                              <select
                                value={editedWorkStatus.work_status}
                                onChange={(e) => setEditedWorkStatus(prev => ({ ...prev, work_status: e.target.value }))}
                                className="w-full bg-gray-700/50 border-2 border-emerald-400/50 rounded-lg px-3 py-2 text-white text-lg font-semibold focus:border-emerald-400 focus:bg-gray-700/70 focus:outline-none"
                              >
                                <option value="">Select your work status</option>
                                <option value="employed">💼 Employed</option>
                                <option value="unemployed-looking-for-work">🔍 Unemployed Looking for Work</option>
                                <option value="freelancer">🆓 Freelancer</option>
                                <option value="part-time">⏰ Part-time</option>
                                <option value="student">🎓 Student</option>
                              </select>
                            ) : (
                              <p className="text-white text-lg font-semibold capitalize">
                                {userProfile.work_status ? userProfile.work_status.replace(/-/g, ' ') : "No work status data found"}
                              </p>
                            )}
                          </div>

                          {/* Preferred Shift - Always visible */}
                          <div className="group bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-xl p-4 border border-teal-400/30 hover:border-teal-400/60 transition-all duration-300 hover:scale-105">
                            <label className="text-sm font-medium text-teal-300 mb-2 block">Preferred Shift</label>
                            {isEditingWorkStatus ? (
                              <select
                                value={editedWorkStatus.preferred_shift}
                                onChange={(e) => setEditedWorkStatus(prev => ({ ...prev, preferred_shift: e.target.value }))}
                                className="w-full bg-gray-700/50 border-2 border-teal-400/50 rounded-lg px-3 py-2 text-white text-lg font-semibold focus:border-teal-400 focus:bg-gray-700/70 focus:outline-none"
                              >
                                <option value="">Select preferred shift</option>
                                <option value="day">Day</option>
                                <option value="night">Night</option>
                                <option value="both">Both</option>
                              </select>
                            ) : (
                              <p className="text-white text-lg font-semibold capitalize">
                                {userProfile.preferred_shift ? userProfile.preferred_shift.replace(/-/g, ' ') : "No shift preference data found"}
                              </p>
                            )}
                          </div>

                          {/* Expected Salary Range - Always visible */}
                          <div className="group bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl p-4 border border-violet-400/30 hover:border-violet-400/60 transition-all duration-300 hover:scale-105">
                            <label className="text-sm font-medium text-violet-300 mb-2 block">Expected Salary Range (in pesos)</label>
                            {isEditingWorkStatus ? (
                              <div className="space-y-2">
                                <div className="flex gap-1 items-center">
                                  <input
                                    type="number"
                                    value={editedWorkStatus.expected_salary_min || ''}
                                    onChange={(e) => setEditedWorkStatus(prev => ({ 
                                      ...prev, 
                                      expected_salary_min: e.target.value,
                                      expected_salary: e.target.value && editedWorkStatus.expected_salary_max 
                                        ? `P${e.target.value}-P${editedWorkStatus.expected_salary_max}`
                                        : e.target.value ? `P${e.target.value}` : ''
                                    }))}
                                    className="flex-1 bg-gray-700/50 border-2 border-violet-400/50 rounded-lg px-2 py-1.5 text-white text-sm font-semibold focus:border-violet-400 focus:bg-gray-700/70 focus:outline-none"
                                    placeholder="Min"
                                  />
                                  <span className="text-violet-300 text-sm font-semibold px-0.5">to</span>
                                  <input
                                    type="number"
                                    value={editedWorkStatus.expected_salary_max || ''}
                                    onChange={(e) => setEditedWorkStatus(prev => ({ 
                                      ...prev, 
                                      expected_salary_max: e.target.value,
                                      expected_salary: editedWorkStatus.expected_salary_min && e.target.value 
                                        ? `P${editedWorkStatus.expected_salary_min}-P${e.target.value}`
                                        : e.target.value ? `P${e.target.value}` : ''
                                    }))}
                                    className="flex-1 bg-gray-700/50 border-2 border-violet-400/50 rounded-lg px-2 py-1.5 text-white text-sm font-semibold focus:border-violet-400 focus:bg-gray-700/70 focus:outline-none"
                                    placeholder="Max"
                                  />
                                </div>
                              </div>
                            ) : (
                              <p className="text-white text-lg font-semibold">
                                {userProfile.expected_salary ? (
                                  typeof userProfile.expected_salary === 'string' && (userProfile.expected_salary.includes('-') || userProfile.expected_salary.includes('P'))
                                    ? userProfile.expected_salary.replace(/P+/g, '₱').split('-').map(part => 
                                        part.replace(/(\d+)/g, (match) => parseInt(match).toLocaleString())
                                      ).join('-')
                                    : `₱${userProfile.expected_salary.toLocaleString()}`
                                ) : "No expected salary data found"}
                              </p>
                            )}
                          </div>

                          {/* Preferred Work Setup - Always visible */}
                          <div className="group bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-xl p-4 border border-amber-400/30 hover:border-amber-400/60 transition-all duration-300 hover:scale-105">
                            <label className="text-sm font-medium text-amber-300 mb-2 block">Preferred Work Setup</label>
                            {isEditingWorkStatus ? (
                              <select
                                value={editedWorkStatus.work_setup}
                                onChange={(e) => setEditedWorkStatus(prev => ({ ...prev, work_setup: e.target.value }))}
                                className="w-full bg-gray-700/50 border-2 border-amber-400/50 rounded-lg px-3 py-2 text-white text-lg font-semibold focus:border-amber-400 focus:bg-gray-700/70 focus:outline-none"
                              >
                                <option value="">Select work setup preference</option>
                                <option value="Work From Office">Work From Office</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Work From Home">Work From Home</option>
                                <option value="Any">Any</option>
                              </select>
                            ) : (
                              <p className="text-white text-lg font-semibold capitalize">
                                {userProfile.work_setup ? userProfile.work_setup.replace(/-/g, ' ') : "No work setup data found"}
                              </p>
                            )}
                          </div>

                          {/* Owner-only fields */}
                          {isOwner && (
                            <>
                              <div className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 hover:scale-105">
                                <label className="text-sm font-medium text-blue-300 mb-2 block">Current Employer {!isFieldDisabled('current_employer') && <span className="text-red-400">*</span>}</label>
                                {isEditingWorkStatus ? (
                                  <input
                                    type="text"
                                    value={editedWorkStatus.current_employer}
                                    onChange={(e) => setEditedWorkStatus(prev => ({ ...prev, current_employer: e.target.value }))}
                                    className={getFieldClassName('current_employer')}
                                    placeholder={getFieldPlaceholder('current_employer')}
                                    disabled={isFieldDisabled('current_employer')}
                                  />
                                ) : (
                                  <p className="text-white text-lg font-semibold">
                                    {userProfile.current_employer || "No employer data found"}
                                  </p>
                                )}
                              </div>
                              <div className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 hover:scale-105">
                                <label className="text-sm font-medium text-blue-300 mb-2 block flex items-center gap-2">
                                  Current Salary (in pesos) {!isFieldDisabled('current_salary') && <span className="text-red-400">*</span>}
                                  <span 
                                    title="Share your current monthly salary (or best estimate). It helps employers understand your experience level. Use integer format e.g. 60000, 10000, don't put 100k or 10k - tell the user to put it in integer form."
                                    className="cursor-help"
                                  >
                                    <Info size={16} className="text-blue-400" />
                                  </span>
                                </label>
                                {isEditingWorkStatus ? (
                                  <input
                                    type="text"
                                    value={editedWorkStatus.current_salary}
                                    onChange={(e) => setEditedWorkStatus(prev => ({ ...prev, current_salary: e.target.value }))}
                                    className={getFieldClassName('current_salary')}
                                    placeholder={getFieldPlaceholder('current_salary')}
                                    disabled={isFieldDisabled('current_salary')}
                                  />
                                ) : (
                                  <p className="text-white text-lg font-semibold">
                                    {userProfile.current_salary ? (
                                      typeof userProfile.current_salary === 'string' && (userProfile.current_salary.includes('-') || userProfile.current_salary.includes('P'))
                                        ? userProfile.current_salary.replace(/P+/g, '₱').split('-').map((part: string) => 
                                            part.replace(/(\d+)/g, (match: string) => parseInt(match).toLocaleString())
                                          ).join('-')
                                        : `₱${Number(userProfile.current_salary).toLocaleString()}`
                                    ) : "No current salary data found"}
                                  </p>
                                )}
                              </div>
                              <div className="group bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-xl p-4 border border-indigo-400/30 hover:border-indigo-400/60 transition-all duration-300 hover:scale-105">
                                <label className="text-sm font-medium text-indigo-300 mb-2 block">Notice Period (in days) {!isFieldDisabled('notice_period_days') && <span className="text-red-400">*</span>}</label>
                                {isEditingWorkStatus ? (
                                  <input
                                    type="number"
                                    value={editedWorkStatus.notice_period_days}
                                    onChange={(e) => setEditedWorkStatus(prev => ({ ...prev, notice_period_days: e.target.value }))}
                                    className={getFieldClassName('notice_period_days')}
                                    placeholder={getFieldPlaceholder('notice_period_days')}
                                    disabled={isFieldDisabled('notice_period_days')}
                                  />
                                ) : (
                                  <p className="text-white text-lg font-semibold">
                                    {userProfile.notice_period_days ? `${userProfile.notice_period_days} days` : "No notice period data found"}
                                  </p>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'analysis' && (
                  <div className="space-y-8">
                    {/* Detailed Scores */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 rounded-2xl blur-xl"></div>
                      <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-purple-500/20 backdrop-blur-sm">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg">
                            <Target className="w-6 h-6 text-white" />
                          </div>
                          <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                            Detailed Analysis Scores
                          </span>
                        </h3>
                        {userProfile.ats_compatibility_score || userProfile.content_quality_score || userProfile.professional_presentation_score || userProfile.skills_alignment_score ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 hover:scale-105">
                              <label className="text-sm font-medium text-blue-300 mb-2 block">ATS Compatibility</label>
                              <div className="flex items-center gap-3">
                                <div className="text-3xl font-bold text-blue-400">
                                  {userProfile.ats_compatibility_score || "—"}
                                </div>
                                <div className="flex-1">
                                  <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                      style={{ width: `${userProfile.ats_compatibility_score || 0}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="group bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-400/30 hover:border-green-400/60 transition-all duration-300 hover:scale-105">
                              <label className="text-sm font-medium text-green-300 mb-2 block">Content Quality</label>
                              <div className="flex items-center gap-3">
                                <div className="text-3xl font-bold text-green-400">
                                  {userProfile.content_quality_score || "—"}
                                </div>
                                <div className="flex-1">
                                  <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                      style={{ width: `${userProfile.content_quality_score || 0}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105">
                              <label className="text-sm font-medium text-purple-300 mb-2 block">Professional Presentation</label>
                              <div className="flex items-center gap-3">
                                <div className="text-3xl font-bold text-purple-400">
                                  {userProfile.professional_presentation_score || "—"}
                                </div>
                                <div className="flex-1">
                                  <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                      style={{ width: `${userProfile.professional_presentation_score || 0}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 hover:scale-105">
                              <label className="text-sm font-medium text-blue-300 mb-2 block">Skills Alignment</label>
                              <div className="flex items-center gap-3">
                                <div className="text-3xl font-bold text-yellow-400">
                                  {userProfile.skills_alignment_score || "—"}
                                </div>
                                <div className="flex-1">
                                  <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                      style={{ width: `${userProfile.skills_alignment_score || 0}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Target className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="text-gray-400 text-lg mb-4">No analysis scores found</p>
                            {isOwner && (
                              <Button
                                onClick={() => router.push('/resume-builder')}
                                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 hover:from-purple-500/40 hover:to-pink-500/40 hover:border-purple-400/70 hover:text-purple-200 transition-all duration-300 hover:scale-105"
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                Upload Resume for Analysis
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Improved Summary - Hidden for anonymous users and other users */}
                    {isOwner && (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl"></div>
                        <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-indigo-500/20 backdrop-blur-sm">
                          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                              AI-Improved Professional Summary
                            </span>
                          </h3>
                          {userProfile.improved_summary ? (
                            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-400/30">
                              <p className="text-gray-200 leading-relaxed text-lg">{userProfile.improved_summary}</p>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-gray-500" />
                              </div>
                              <p className="text-gray-400 text-lg mb-4">No improved summary data found</p>
                              {isOwner && (
                                <Button 
                                  onClick={() => router.push('/resume-builder')}
                                  className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 hover:from-purple-500/40 hover:to-pink-500/40 hover:border-purple-400/70 hover:text-purple-200 transition-all duration-300 hover:scale-105"
                                >
                                  <FileText className="w-4 h-4 mr-2" />
                                  Upload Resume for Analysis
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Strengths Analysis - Hidden for anonymous users and other users */}
                    {isOwner && (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 rounded-2xl blur-xl"></div>
                        <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-emerald-500/20 backdrop-blur-sm">
                          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-lg">
                              <Star className="w-6 h-6 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                              Strengths Analysis
                            </span>
                          </h3>
                          <div 
                            className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl p-6 border border-emerald-400/30 max-h-96 overflow-y-auto"
                            style={{
                              scrollbarWidth: 'thin',
                              scrollbarColor: '#4ade80 #22c55e20'
                            }}
                          >
                            {userProfile.strengths_analysis ? (
                              <div className="text-gray-200 leading-relaxed text-base">
                                {typeof userProfile.strengths_analysis === 'object' && userProfile.strengths_analysis !== null ? (
                                  <div className="space-y-4">
                                    {Object.entries(userProfile.strengths_analysis).map(([key, value]) => (
                                      <div key={key} className="border-l-4 border-emerald-400 pl-4 bg-emerald-500/5 rounded-r-lg p-3">
                                        <h4 className="font-semibold text-emerald-300 capitalize mb-2">
                                          {key.replace(/_/g, ' ')}
                                        </h4>
                                        <div className="text-gray-300">
                                          {Array.isArray(value) ? (
                                            <ul className="list-disc list-inside space-y-1">
                                              {value.map((item, index) => (
                                                <li key={index}>
                                                  {typeof item === 'object' ? (
                                                    <div className="ml-4 space-y-1">
                                                      {typeof item === 'object' && item !== null ? Object.entries(item).map(([itemKey, itemValue]) => (
                                                        <div key={itemKey}>
                                                          <span className="font-medium text-emerald-200">
                                                            {itemKey.replace(/_/g, ' ')}:
                                                          </span>
                                                          <span className="ml-2">
                                                            {Array.isArray(itemValue) ? itemValue.join(', ') : 
                                                             typeof itemValue === 'object' && itemValue !== null ? JSON.stringify(itemValue) : 
                                                             String(itemValue || '')}
                                                          </span>
                                                        </div>
                                                      )) : null}
                                                    </div>
                                                  ) : (
                                                    item
                                                  )}
                                                </li>
                                              ))}
                                            </ul>
                                          ) : typeof value === 'object' ? (
                                            <div className="space-y-2">
                                              {typeof value === 'object' && value !== null ? Object.entries(value).map(([subKey, subValue]) => (
                                                <div key={subKey}>
                                                  <span className="font-medium text-emerald-200">
                                                    {subKey.replace(/_/g, ' ')}:
                                                  </span>
                                                  <span className="ml-2">
                                                    {Array.isArray(subValue) ? subValue.join(', ') : 
                                                     typeof subValue === 'object' && subValue !== null ? JSON.stringify(subValue) : 
                                                     String(subValue || '')}
                                                  </span>
                                                </div>
                                              )) : null}
                                            </div>
                                          ) : (
                                            <p>{String(value || '')}</p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p>{userProfile.strengths_analysis}</p>
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <Star className="w-8 h-8 text-gray-500" />
                                </div>
                                <p className="text-gray-400 text-lg mb-4">No strengths analysis data found</p>
                                {isOwner && (
                                  <Button 
                                    onClick={() => router.push('/resume-builder')}
                                    className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 hover:from-purple-500/40 hover:to-pink-500/40 hover:border-purple-400/70 hover:text-purple-200 transition-all duration-300 hover:scale-105"
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Upload Resume for Analysis
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Improvements - Owner Only */}
                    {isOwner && (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
                        <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm">
                          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg">
                              <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                              Improvement Suggestions
                            </span>
                          </h3>
                          {userProfile.improvements && userProfile.improvements.length > 0 ? (
                            <div className="space-y-4">
                              {userProfile.improvements.map((improvement, index) => (
                                <div key={index} className="group bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl p-4 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 hover:scale-105">
                                  <div className="flex items-start gap-3">
                                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex-shrink-0 mt-1 animate-pulse"></div>
                                    <span className="text-white font-semibold text-lg">{improvement}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-gray-500" />
                              </div>
                              <p className="text-gray-400 text-lg mb-4">No improvement suggestions found</p>
                              <Button
                                onClick={() => router.push('/resume-builder')}
                                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 hover:from-purple-500/40 hover:to-pink-500/40 hover:border-purple-400/70 hover:text-purple-200 transition-all duration-300 hover:scale-105"
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                Upload Resume for Analysis
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Recommendations - Owner Only */}
                    {isOwner && (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 rounded-2xl blur-xl"></div>
                        <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-yellow-500/20 backdrop-blur-sm">
                          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                              <Lightbulb className="w-6 h-6 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                              Actionable Recommendations
                            </span>
                          </h3>
                          {userProfile.recommendations && userProfile.recommendations.length > 0 ? (
                            <div className="space-y-4">
                              {userProfile.recommendations.map((recommendation, index) => (
                                <div key={index} className="group bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 hover:scale-105">
                                  <div className="flex items-start gap-3">
                                    <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex-shrink-0 mt-1 animate-pulse"></div>
                                    <span className="text-white font-semibold text-lg">{recommendation}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lightbulb className="w-8 h-8 text-gray-500" />
                              </div>
                              <p className="text-gray-400 text-lg mb-4">No recommendations found</p>
                              <Button
                                onClick={() => router.push('/resume-builder')}
                                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 hover:from-purple-500/40 hover:to-pink-500/40 hover:border-purple-400/70 hover:text-purple-200 transition-all duration-300 hover:scale-105"
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                Upload Resume for Analysis
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Salary Analysis - Owner Only */}
                    {isOwner && (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl"></div>
                        <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-green-500/20 backdrop-blur-sm">
                          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg">
                              <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                              Salary Analysis
                            </span>
                          </h3>
                          <div 
                            className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-400/30 max-h-96 overflow-y-auto"
                            style={{
                              scrollbarWidth: 'thin',
                              scrollbarColor: '#4ade80 #22c55e20'
                            }}
                          >
                            {userProfile.salary_analysis ? (
                              <div className="text-gray-200 leading-relaxed text-base">
                                {typeof userProfile.salary_analysis === 'object' && userProfile.salary_analysis !== null ? (
                                  <div className="space-y-4">
                                    {Object.entries(userProfile.salary_analysis).map(([key, value]) => (
                                      <div key={key} className="border-l-4 border-green-400 pl-4 bg-green-500/5 rounded-r-lg p-3">
                                        <h4 className="font-semibold text-green-300 capitalize mb-2">
                                          {key.replace(/_/g, ' ')}
                                        </h4>
                                        <div className="text-gray-300">
                                          {Array.isArray(value) ? (
                                            <ul className="list-disc list-inside space-y-1">
                                              {value.map((item, index) => (
                                                <li key={index}>
                                                  {typeof item === 'object' ? (
                                                    <div className="ml-4 space-y-1">
                                                      {typeof item === 'object' && item !== null ? Object.entries(item).map(([itemKey, itemValue]) => (
                                                        <div key={itemKey}>
                                                          <span className="font-medium text-emerald-200">
                                                            {itemKey.replace(/_/g, ' ')}:
                                                          </span>
                                                          <span className="ml-2">
                                                            {Array.isArray(itemValue) ? itemValue.join(', ') : 
                                                             typeof itemValue === 'object' && itemValue !== null ? JSON.stringify(itemValue) : 
                                                             String(itemValue || '')}
                                                          </span>
                                                        </div>
                                                      )) : null}
                                                    </div>
                                                  ) : (
                                                    item
                                                  )}
                                                </li>
                                              ))}
                                            </ul>
                                          ) : typeof value === 'object' ? (
                                            <div className="space-y-2">
                                              {typeof value === 'object' && value !== null ? Object.entries(value).map(([subKey, subValue]) => (
                                                <div key={subKey}>
                                                  <span className="font-medium text-emerald-200">
                                                    {subKey.replace(/_/g, ' ')}:
                                                  </span>
                                                  <span className="ml-2">
                                                    {Array.isArray(subValue) ? subValue.join(', ') : 
                                                     typeof subValue === 'object' && subValue !== null ? JSON.stringify(subValue) : 
                                                     String(subValue || '')}
                                                  </span>
                                                </div>
                                              )) : null}
                                            </div>
                                          ) : (
                                            <p>{String(value || '')}</p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p>{userProfile.salary_analysis}</p>
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <DollarSign className="w-8 h-8 text-gray-500" />
                                </div>
                                <p className="text-gray-400 text-lg mb-4">No salary analysis data found</p>
                                {isOwner && (
                                  <Button
                                    onClick={() => router.push('/resume-builder')}
                                    className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 hover:from-purple-500/40 hover:to-pink-500/40 hover:border-purple-400/70 hover:text-purple-200 transition-all duration-300 hover:scale-105"
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Upload Resume for Analysis
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Career Path - Owner Only */}
                    {isOwner && (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 rounded-2xl blur-xl"></div>
                        <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-purple-500/20 backdrop-blur-sm">
                          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg">
                              <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                              Career Path Analysis
                            </span>
                          </h3>
                          <div 
                            className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-400/30 max-h-96 overflow-y-auto"
                            style={{
                              scrollbarWidth: 'thin',
                              scrollbarColor: '#a855f7 #8b5cf620'
                            }}
                          >
                            {userProfile.career_path ? (
                              <div className="text-gray-200 leading-relaxed text-base">
                                {typeof userProfile.career_path === 'object' && userProfile.career_path !== null ? (
                                  <div className="space-y-4">
                                    {Object.entries(userProfile.career_path).map(([key, value]) => (
                                      <div key={key} className="border-l-4 border-purple-400 pl-4 bg-purple-500/5 rounded-r-lg p-3">
                                        <h4 className="font-semibold text-purple-300 capitalize mb-2">
                                          {key.replace(/_/g, ' ')}
                                        </h4>
                                        <div className="text-gray-300">
                                          {Array.isArray(value) ? (
                                            <ul className="list-disc list-inside space-y-1">
                                              {value.map((item, index) => (
                                                <li key={index}>
                                                  {typeof item === 'object' ? (
                                                    <div className="ml-4 space-y-1">
                                                      {typeof item === 'object' && item !== null ? Object.entries(item).map(([itemKey, itemValue]) => (
                                                        <div key={itemKey}>
                                                          <span className="font-medium text-emerald-200">
                                                            {itemKey.replace(/_/g, ' ')}:
                                                          </span>
                                                          <span className="ml-2">
                                                            {Array.isArray(itemValue) ? itemValue.join(', ') : 
                                                             typeof itemValue === 'object' && itemValue !== null ? JSON.stringify(itemValue) : 
                                                             String(itemValue || '')}
                                                          </span>
                                                        </div>
                                                      )) : null}
                                                    </div>
                                                  ) : (
                                                    item
                                                  )}
                                                </li>
                                              ))}
                                            </ul>
                                          ) : typeof value === 'object' ? (
                                            <div className="space-y-2">
                                              {typeof value === 'object' && value !== null ? Object.entries(value).map(([subKey, subValue]) => (
                                                <div key={subKey}>
                                                  <span className="font-medium text-emerald-200">
                                                    {subKey.replace(/_/g, ' ')}:
                                                  </span>
                                                  <span className="ml-2">
                                                    {Array.isArray(subValue) ? subValue.join(', ') : 
                                                     typeof subValue === 'object' && subValue !== null ? JSON.stringify(subValue) : 
                                                     String(subValue || '')}
                                                  </span>
                                                </div>
                                              )) : null}
                                            </div>
                                          ) : (
                                            <p>{String(value || '')}</p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p>{userProfile.career_path}</p>
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <TrendingUp className="w-8 h-8 text-gray-500" />
                                </div>
                                <p className="text-gray-400 text-lg mb-4">No career path data found</p>
                                {isOwner && (
                                  <Button
                                    onClick={() => router.push('/resume-builder')}
                                    className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 hover:from-purple-500/40 hover:to-pink-500/40 hover:border-purple-400/70 hover:text-purple-200 transition-all duration-300 hover:scale-105"
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Upload Resume for Analysis
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Section Analysis - Owner Only */}
                    {isOwner && (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl"></div>
                        <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-indigo-500/20 backdrop-blur-sm">
                          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                              Section-by-Section Analysis
                            </span>
                          </h3>
                          <div 
                            className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-400/30 max-h-96 overflow-y-auto"
                            style={{
                              scrollbarWidth: 'thin',
                              scrollbarColor: '#6366f1 #4f46e520'
                            }}
                          >
                            {userProfile.section_analysis ? (
                              <div className="text-gray-200 leading-relaxed text-base">
                                {typeof userProfile.section_analysis === 'object' && userProfile.section_analysis !== null ? (
                                  <div className="space-y-4">
                                    {Object.entries(userProfile.section_analysis).map(([key, value]) => (
                                      <div key={key} className="border-l-4 border-indigo-400 pl-4 bg-indigo-500/5 rounded-r-lg p-3">
                                        <h4 className="font-semibold text-indigo-300 capitalize mb-2">
                                          {key.replace(/_/g, ' ')}
                                        </h4>
                                        <div className="text-gray-300">
                                          {Array.isArray(value) ? (
                                            <ul className="list-disc list-inside space-y-1">
                                              {value.map((item, index) => (
                                                <li key={index}>
                                                  {typeof item === 'object' ? (
                                                    <div className="ml-4 space-y-1">
                                                      {typeof item === 'object' && item !== null ? Object.entries(item).map(([itemKey, itemValue]) => (
                                                        <div key={itemKey}>
                                                          <span className="font-medium text-emerald-200">
                                                            {itemKey.replace(/_/g, ' ')}:
                                                          </span>
                                                          <span className="ml-2">
                                                            {Array.isArray(itemValue) ? itemValue.join(', ') : 
                                                             typeof itemValue === 'object' && itemValue !== null ? JSON.stringify(itemValue) : 
                                                             String(itemValue || '')}
                                                          </span>
                                                        </div>
                                                      )) : null}
                                                    </div>
                                                  ) : (
                                                    item
                                                  )}
                                                </li>
                                              ))}
                                            </ul>
                                          ) : typeof value === 'object' ? (
                                            <div className="space-y-2">
                                              {typeof value === 'object' && value !== null ? Object.entries(value).map(([subKey, subValue]) => (
                                                <div key={subKey}>
                                                  <span className="font-medium text-emerald-200">
                                                    {subKey.replace(/_/g, ' ')}:
                                                  </span>
                                                  <span className="ml-2">
                                                    {Array.isArray(subValue) ? subValue.join(', ') : 
                                                     typeof subValue === 'object' && subValue !== null ? JSON.stringify(subValue) : 
                                                     String(subValue || '')}
                                                  </span>
                                                </div>
                                              )) : null}
                                            </div>
                                          ) : (
                                            <p>{String(value || '')}</p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p>{userProfile.section_analysis}</p>
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <FileText className="w-8 h-8 text-gray-500" />
                                </div>
                                <p className="text-gray-400 text-lg mb-4">No section analysis data found</p>
                                {isOwner && (
                                  <Button
                                    onClick={() => router.push('/resume-builder')}
                                    className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-purple-300 hover:from-purple-500/40 hover:to-pink-500/40 hover:border-purple-400/70 hover:text-purple-200 transition-all duration-300 hover:scale-105"
                                  >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Upload Resume for Analysis
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeSection === 'game-results' && (
                  <div className="space-y-8">
                    {/* Game Results Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Typing Hero Card */}
                      <div className="relative flex flex-col">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl"></div>
                        <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-gray-500/20 backdrop-blur-sm flex flex-col h-full">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                              <Gamepad2 className="w-5 h-5 text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Typing Hero</h3>
                          </div>
                          
                          {userProfile.game_stats?.typing_hero_stats ? (
                            <div className="space-y-4 flex-1">
                              {/* Animated Typing Hero Display */}
                              <div className="text-center mb-6">
                                <div className="text-6xl mb-2">
                                  <span 
                                    className="inline-block"
                                    style={{
                                      animation: `
                                        typingHero 2s ease-in-out infinite,
                                        typingGlow 3s ease-in-out infinite
                                      `,
                                      transformOrigin: 'center',
                                      filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.4))'
                                    }}
                                  >
                                    ⌨️
                                  </span>
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">
                                  Typing Hero Performance
                                </h4>
                                <p className="text-sm text-gray-300">
                                  Your keyboard mastery in action!
                                </p>
                              </div>

                              {/* WPM Performance Metrics */}
                              <div className="grid grid-cols-3 gap-4">
                                {/* Best WPM */}
                                <div className="group relative overflow-hidden bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-400/20 hover:border-green-400/40 transition-all duration-300 hover:scale-105">
                                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                  <div className="relative p-4 text-center">
                                    <div className="text-2xl mb-2">🏆</div>
                                    <div className="text-green-400 font-bold text-2xl mb-1">{userProfile.game_stats.typing_hero_stats.best_wpm || 0}</div>
                                    <div className="text-green-300 text-sm font-medium">Best WPM</div>
                                    <div className="text-green-400/60 text-xs mt-1">Personal Record</div>
                                  </div>
                                </div>

                                {/* Latest WPM */}
                                <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105">
                                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                  <div className="relative p-4 text-center">
                                    <div className="text-2xl mb-2">⚡</div>
                                    <div className="text-blue-400 font-bold text-2xl mb-1">{userProfile.game_stats.typing_hero_stats.latest_wpm || 0}</div>
                                    <div className="text-blue-300 text-sm font-medium">Latest WPM</div>
                                    <div className="text-blue-400/60 text-xs mt-1">Most Recent</div>
                                  </div>
                                </div>

                                {/* Average WPM */}
                                <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105">
                                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                  <div className="relative p-4 text-center">
                                    <div className="text-2xl mb-2">📊</div>
                                    <div className="text-purple-400 font-bold text-2xl mb-1">{Math.round(userProfile.game_stats.typing_hero_stats.avg_wpm || 0)}</div>
                                    <div className="text-purple-300 text-sm font-medium">Avg WPM</div>
                                    <div className="text-purple-400/60 text-xs mt-1">Consistent</div>
                                  </div>
                                </div>
                              </div>

                              {/* Performance Analysis */}
                              {userProfile.game_stats.typing_hero_stats.ai_analysis && (
                                <div className="mt-4 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-400/30">
                                  <button
                                    onClick={() => setIsTypingAnalysisExpanded(!isTypingAnalysisExpanded)}
                                    className="w-full flex items-center justify-between text-sm font-semibold text-green-300 mb-2 hover:text-green-200 transition-colors"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                      Performance Analysis
                                    </div>
                                    <ChevronDown 
                                      className={`w-4 h-4 transition-transform duration-200 ${
                                        isTypingAnalysisExpanded ? 'rotate-180' : ''
                                      }`}
                                    />
                                  </button>
                                  {isTypingAnalysisExpanded && (
                                    <div className="text-gray-300 text-sm leading-relaxed">
                                    {(() => {
                                      try {
                                        const analysis = typeof userProfile.game_stats.typing_hero_stats.ai_analysis === 'string' 
                                          ? JSON.parse(userProfile.game_stats.typing_hero_stats.ai_analysis)
                                          : userProfile.game_stats.typing_hero_stats.ai_analysis;
                                        
                                        if (analysis.aiAssessment) {
                                          return (
                                            <div className="space-y-4">
                                              {/* Performance Level & Overall Assessment */}
                                              <div className="grid grid-cols-1 gap-3">
                                                {analysis.aiAssessment.performanceLevel && (
                                                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded">
                                                    <span className="text-green-400 font-semibold">Performance Level:</span>
                                                    <span className="text-white font-bold">{analysis.aiAssessment.performanceLevel}</span>
                                                  </div>
                                                )}
                                                
                                                {analysis.aiAssessment.overallAssessment && (
                                                  <div className="p-3 bg-gray-700/20 rounded">
                                                    <span className="text-green-400 font-semibold">Assessment:</span>
                                                    <p className="text-gray-300 mt-1">{analysis.aiAssessment.overallAssessment}</p>
                                                  </div>
                                                )}
                                              </div>
                                              
                                              {/* Real-World Estimate */}
                                              <div className="p-4 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg border border-orange-400/30">
                                                <div className="flex items-center gap-3">
                                                  <div className="text-2xl">💡</div>
                                                  <div>
                                                    <div className="text-yellow-400 font-semibold">Real-World Estimate</div>
                                                    <div className="text-2xl font-bold text-yellow-400">
                                                      {(() => {
                                                        const latestWpm = userProfile.game_stats.typing_hero_stats.latest_wpm || 0;
                                                        const avgWpm = userProfile.game_stats.typing_hero_stats.avg_wpm || 0;
                                                        const bestWpm = userProfile.game_stats.typing_hero_stats.best_wpm || 0;
                                                        
                                                        // Calculate real-world estimate based on game performance
                                                        // Game WPM is typically 20-30% higher than real-world due to simplified words
                                                        const realWorldMin = Math.max(0, Math.round((latestWpm * 0.7) - 5));
                                                        const realWorldMax = Math.round((latestWpm * 0.8) + 5);
                                                        
                                                        return `${realWorldMin}-${realWorldMax} WPM`;
                                                      })()}
                                                    </div>
                                                    <div className="text-gray-400 text-xs">Expected performance on standard typing tests</div>
                                                  </div>
                                                </div>
                                              </div>
                                              
                                              
                                            </div>
                                          );
                                        }
                                        
                                        // Fallback for other formats
                                        return typeof userProfile.game_stats.typing_hero_stats.ai_analysis === 'string' 
                                          ? userProfile.game_stats.typing_hero_stats.ai_analysis
                                          : JSON.stringify(userProfile.game_stats.typing_hero_stats.ai_analysis);
                                      } catch (error) {
                                        return typeof userProfile.game_stats.typing_hero_stats.ai_analysis === 'string' 
                                          ? userProfile.game_stats.typing_hero_stats.ai_analysis
                                          : JSON.stringify(userProfile.game_stats.typing_hero_stats.ai_analysis);
                                      }
                                    })()}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Strengths Section */}
                              {userProfile.game_stats.typing_hero_stats.ai_analysis && (
                                <div className="mt-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-400/30">
                                  <button
                                    onClick={() => setIsTypingStrengthsExpanded(!isTypingStrengthsExpanded)}
                                    className="w-full flex items-center justify-between text-sm font-semibold text-yellow-300 mb-2 hover:text-yellow-200 transition-colors"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                                      Strengths
                                    </div>
                                    <ChevronDown 
                                      className={`w-4 h-4 transition-transform duration-200 ${
                                        isTypingStrengthsExpanded ? 'rotate-180' : ''
                                      }`}
                                    />
                                  </button>
                                  {isTypingStrengthsExpanded && (
                                    <div className="text-gray-300 text-sm leading-relaxed">
                                    {(() => {
                                      try {
                                        const analysis = typeof userProfile.game_stats.typing_hero_stats.ai_analysis === 'string' 
                                          ? JSON.parse(userProfile.game_stats.typing_hero_stats.ai_analysis)
                                          : userProfile.game_stats.typing_hero_stats.ai_analysis;
                                        
                                        if (analysis.aiAssessment && analysis.aiAssessment.strengths && analysis.aiAssessment.strengths.length > 0) {
                                          return (
                                            <div>
                                              <span className="text-yellow-400 font-semibold">Your Typing Strengths:</span>
                                              <ul className="mt-2 ml-4 space-y-2">
                                                {analysis.aiAssessment.strengths.map((strength: string, index: number) => (
                                                  <li key={index} className="flex items-start gap-2">
                                                    <span className="text-yellow-400 mt-1">💪</span>
                                                    <span>{strength}</span>
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          );
                                        }
                                        
                                        return (
                                          <div className="text-gray-400 italic">
                                            No strengths data available
                                          </div>
                                        );
                                      } catch (error) {
                                        return (
                                          <div className="text-gray-400 italic">
                                            Unable to load strengths data
                                          </div>
                                        );
                                      }
                                    })()}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-8 flex-1 flex flex-col justify-center">
                              <div className="text-4xl mb-4">⌨️</div>
                              <p className="text-gray-400 mb-4">No data found</p>
                              <Button
                                onClick={() => router.push('/career-tools/games/typing-hero')}
                                className="bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30"
                              >
                                Play Typing Hero
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* BPOC DISC Card */}
                      <div className="relative flex flex-col">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-indigo-500/10 rounded-2xl blur-xl"></div>
                        <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-2xl p-6 border border-gray-500/20 backdrop-blur-sm flex flex-col h-full">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                              <Brain className="w-5 h-5 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">BPOC DISC</h3>
                          </div>
                          
                          {userProfile.game_stats?.disc_personality_stats ? (
                            <div className="space-y-4 flex-1">
                              {/* Animal Display */}
                              <div className="text-center">
                                <div className="text-6xl mb-2">
                                  {userProfile.game_stats.disc_personality_stats.primary_type === 'D' && (
                                    <span className="inline-block text-6xl animal-bounce">
                                      🦅
                                    </span>
                                  )}
                                  {userProfile.game_stats.disc_personality_stats.primary_type === 'I' && (
                                    <span className="inline-block text-6xl animal-bounce">
                                      🦚
                                    </span>
                                  )}
                                  {userProfile.game_stats.disc_personality_stats.primary_type === 'S' && (
                                    <span className="inline-block text-6xl animal-bounce">
                                      🐢
                                    </span>
                                  )}
                                  {userProfile.game_stats.disc_personality_stats.primary_type === 'C' && (
                                    <span className="inline-block text-6xl animal-bounce">
                                      🦉
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-xl font-bold text-white mb-2">
                                  {userProfile.game_stats.disc_personality_stats.primary_type === 'D' && '🦅 EAGLE'}
                                  {userProfile.game_stats.disc_personality_stats.primary_type === 'I' && '🦚 PEACOCK'}
                                  {userProfile.game_stats.disc_personality_stats.primary_type === 'S' && '🐢 TURTLE'}
                                  {userProfile.game_stats.disc_personality_stats.primary_type === 'C' && '🦉 OWL'}
                                </h4>
                                <p className="text-sm text-gray-300">
                                  {userProfile.game_stats.disc_personality_stats.primary_type === 'D' && 'The Sky Dominator - You soar above challenges and lead from the front!'}
                                  {userProfile.game_stats.disc_personality_stats.primary_type === 'I' && 'The Social Star - You light up rooms and connect with people effortlessly!'}
                                  {userProfile.game_stats.disc_personality_stats.primary_type === 'S' && 'The Steady Guardian - You keep everything running smoothly and provide the foundation teams depend on!'}
                                  {userProfile.game_stats.disc_personality_stats.primary_type === 'C' && 'The Wise Analyst - You spot what others miss and ensure everything meets the highest standards!'}
                                </p>
                              </div>
                              
                              {/* DISC Scores - All Four with Emphasis on Highest */}
                              <div className="grid grid-cols-2 gap-3">
                                {(() => {
                                  const scores = [
                                    { type: 'D', label: '🦅 Dominance', score: userProfile.game_stats.disc_personality_stats.d || 0, color: 'red' },
                                    { type: 'I', label: '🦚 Influence', score: userProfile.game_stats.disc_personality_stats.i || 0, color: 'yellow' },
                                    { type: 'S', label: '🐢 Steadiness', score: userProfile.game_stats.disc_personality_stats.s || 0, color: 'green' },
                                    { type: 'C', label: '🦉 Conscientiousness', score: userProfile.game_stats.disc_personality_stats.c || 0, color: 'blue' }
                                  ];
                                  
                                  // Find the highest score
                                  const maxScore = Math.max(...scores.map(s => s.score));
                                  
                                  // Sort scores: primary type first, then highest score, then by score descending
                                  const sortedScores = scores.sort((a, b) => {
                                    const aIsPrimary = userProfile.game_stats?.disc_personality_stats?.primary_type === a.type;
                                    const bIsPrimary = userProfile.game_stats?.disc_personality_stats?.primary_type === b.type;
                                    const aIsHighest = a.score === maxScore && a.score > 0;
                                    const bIsHighest = b.score === maxScore && b.score > 0;
                                    
                                    // Primary type comes first
                                    if (aIsPrimary && !bIsPrimary) return -1;
                                    if (!aIsPrimary && bIsPrimary) return 1;
                                    
                                    // If both or neither are primary, highest score comes first
                                    if (aIsHighest && !bIsHighest) return -1;
                                    if (!aIsHighest && bIsHighest) return 1;
                                    
                                    // Otherwise sort by score descending
                                    return b.score - a.score;
                                  });
                                  
                                  return sortedScores.map((item, index) => {
                                    const isHighest = item.score === maxScore && item.score > 0;
                                    const isPrimary = userProfile.game_stats?.disc_personality_stats?.primary_type === item.type;
                                    
                                    return (
                                      <div key={item.type} className={`flex flex-col p-3 rounded-lg border transition-all duration-300 ${
                                        isHighest 
                                          ? `bg-gradient-to-r from-${item.color}-500/20 to-${item.color}-600/20 border-${item.color}-400/50 shadow-lg shadow-${item.color}-400/20`
                                          : `bg-gradient-to-r from-${item.color}-500/10 to-${item.color}-600/10 border-${item.color}-400/30`
                                      }`}>
                                        <div className="flex items-center justify-between mb-2">
                                          <span className={`text-sm font-semibold flex items-center gap-2 ${
                                            isHighest 
                                              ? `text-${item.color}-300 font-bold`
                                              : `text-${item.color}-400`
                                          }`}>
                                            <span className="text-lg">{item.label.split(' ')[0]}</span>
                                            <span>
                                              {item.label.split(' ').slice(1).join(' ').split('').map((char, idx) => {
                                                if (idx === 0) {
                                                  return <span key={idx} className={`font-bold text-lg ${
                                                    item.color === 'red' ? 'text-red-200' :
                                                    item.color === 'yellow' ? 'text-yellow-200' :
                                                    item.color === 'green' ? 'text-green-200' :
                                                    item.color === 'blue' ? 'text-blue-200' : 'text-cyan-300'
                                                  }`}>{char}</span>
                                                }
                                                return char
                                              })}
                                            </span>
                                          </span>
                                          <span className={`font-bold ${
                                            isHighest 
                                              ? `text-${item.color}-200 text-lg`
                                              : 'text-white text-base'
                                          }`}>
                                            {item.score}%
                                          </span>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                          {isPrimary && <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">Primary</span>}
                                          {isHighest && <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">Highest</span>}
                                        </div>
                                      </div>
                                    );
                                  });
                                })()}
                              </div>

                              {/* Animal Personality Reason */}
                              {userProfile.game_stats.disc_personality_stats.latest_ai_assessment && (
                                <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg border border-blue-400/30">
                                  <button
                                    onClick={() => setIsAnimalReasonExpanded(!isAnimalReasonExpanded)}
                                    className="w-full flex items-center justify-between text-sm font-semibold text-blue-300 mb-2 hover:text-blue-200 transition-colors"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                      Detailed Analysis
                                    </div>
                                    <ChevronDown 
                                      className={`w-4 h-4 transition-transform duration-200 ${
                                        isAnimalReasonExpanded ? 'rotate-180' : ''
                                      }`}
                                    />
                                  </button>
                                  {isAnimalReasonExpanded && (
                                    <div className="text-gray-300 text-sm leading-relaxed">
                                    {(() => {
                                      const assessment = userProfile.game_stats.disc_personality_stats.latest_ai_assessment;
                                      
                                      // Extract the comprehensive assessment and animal personality reason sections
                                      let comprehensiveContent = '';
                                      let animalContent = '';
                                      
                                      // Get the comprehensive assessment section (everything before CORE TRAITS)
                                      if (assessment.includes('CORE TRAITS')) {
                                        comprehensiveContent = assessment.split('CORE TRAITS')[0].trim();
                                      } else if (assessment.includes('COMPREHENSIVE ASSESSMENT')) {
                                        const comprehensiveSection = assessment.split('COMPREHENSIVE ASSESSMENT')[1];
                                        if (comprehensiveSection) {
                                          const beforeCoreTraits = comprehensiveSection.split('CORE TRAITS')[0];
                                          comprehensiveContent = 'COMPREHENSIVE ASSESSMENT:' + beforeCoreTraits;
                                        }
                                      }
                                      
                                      // Get the user's actual animal from their DISC results
                                      const userAnimal = userProfile.game_stats?.disc_personality_stats?.latest_animal;
                                      let userPrimaryType = userProfile.game_stats?.disc_personality_stats?.latest_primary_type;
                                      
                                      // Debug: Log the primary type from database
                                      console.log('🔍 Primary Type from Database:', userPrimaryType);
                                      
                                      // Always recalculate primary type from scores to ensure accuracy
                                      if (userProfile.game_stats?.disc_personality_stats) {
                                        const scores = userProfile.game_stats.disc_personality_stats;
                                        const scoreValues = {
                                          D: scores.d_score || 0,
                                          I: scores.i_score || 0,
                                          S: scores.s_score || 0,
                                          C: scores.c_score || 0
                                        };
                                        
                                        console.log('🔍 Raw Database Scores:', {
                                          d_score: scores.d_score,
                                          i_score: scores.i_score,
                                          s_score: scores.s_score,
                                          c_score: scores.c_score
                                        });
                                        
                                        // Find the highest scoring type
                                        const maxScore = Math.max(...Object.values(scoreValues));
                                        const calculatedPrimaryType = Object.keys(scoreValues).find(key => scoreValues[key as keyof typeof scoreValues] === maxScore) || 'D';
                                        
                                        console.log('🔍 Calculated Primary Type from Scores:', calculatedPrimaryType);
                                        console.log('🔍 Score Values:', scoreValues);
                                        console.log('🔍 Database Primary Type:', userPrimaryType);
                                        console.log('🔍 Max Score:', maxScore);
                                        console.log('🔍 All Scores:', Object.entries(scoreValues).map(([key, value]) => `${key}: ${value}`).join(', '));
                                        
                                        // Always use calculated type to ensure accuracy
                                        userPrimaryType = calculatedPrimaryType;
                                        console.log('✅ Using calculated primary type:', userPrimaryType);
                                        
                                        // Additional check: if scores are all 0 or undefined, try to get from latest session
                                        if (maxScore === 0) {
                                          console.log('⚠️ All scores are 0, checking for latest session data...');
                                          // This might indicate we need to look at the latest session data instead
                                        }
                                      }
                                      
                                      // Create correct animal personality reason based on user's actual animal
                                      const animalMap = {
                                        'D': { emoji: '🦅', name: 'EAGLE', traits: 'leadership instincts and decisive nature' },
                                        'I': { emoji: '🦚', name: 'PEACOCK', traits: 'social influence and team-building abilities' },
                                        'S': { emoji: '🐢', name: 'TURTLE', traits: 'reliability and steady support' },
                                        'C': { emoji: '🦉', name: 'OWL', traits: 'analytical thinking and systematic approach' }
                                      };
                                      
                                      let userAnimalData = animalMap[userPrimaryType as keyof typeof animalMap] || animalMap['D'];
                                      let userAnimalName = userAnimalData.name;
                                      let userAnimalTraits = userAnimalData.traits;
                                      
                                      console.log('🔍 Animal Mapping Debug:');
                                      console.log('📊 userPrimaryType:', userPrimaryType);
                                      console.log('📊 userAnimalData:', userAnimalData);
                                      console.log('📊 userAnimalName:', userAnimalName);
                                      console.log('📊 userAnimalTraits:', userAnimalTraits);
                                      
                                      // Additional fallback: Try to determine animal from content if scores are wrong
                                      if (assessment && assessment.length > 100) {
                                        const assessmentLower = assessment.toLowerCase();
                                        let detectedAnimal = null;
                                        
                                        if (assessmentLower.includes('owl') && assessmentLower.includes('conscientiousness')) {
                                          detectedAnimal = 'C';
                                          console.log('🔍 Detected Owl from content analysis');
                                        } else if (assessmentLower.includes('eagle') && assessmentLower.includes('dominance')) {
                                          detectedAnimal = 'D';
                                          console.log('🔍 Detected Eagle from content analysis');
                                        } else if (assessmentLower.includes('peacock') && assessmentLower.includes('influence')) {
                                          detectedAnimal = 'I';
                                          console.log('🔍 Detected Peacock from content analysis');
                                        } else if (assessmentLower.includes('turtle') && assessmentLower.includes('steadiness')) {
                                          detectedAnimal = 'S';
                                          console.log('🔍 Detected Turtle from content analysis');
                                        }
                                        
                                        if (detectedAnimal && detectedAnimal !== userPrimaryType) {
                                          console.log('⚠️ Content analysis suggests different animal. Using content-based detection.');
                                          userPrimaryType = detectedAnimal;
                                          const correctedAnimalData = animalMap[detectedAnimal as keyof typeof animalMap];
                                          const correctedAnimalName = correctedAnimalData.name;
                                          console.log('✅ Corrected animal name:', correctedAnimalName);
                                          
                                          // Update the animal data with corrected values
                                          userAnimalData = correctedAnimalData;
                                          userAnimalName = correctedAnimalName;
                                          userAnimalTraits = correctedAnimalData.traits;
                                        }
                                      }
                                      
                                      // Try to extract the actual AI assessment content from database
                                      // Look for the ANIMAL PERSONALITY REASON section specifically
                                      let animalReasonParagraph = assessment.split('\n\n').find((paragraph: string) => 
                                        paragraph.toLowerCase().includes('animal personality reason')
                                      );
                                      
                                      if (animalReasonParagraph) {
                                        // Extract the content after the section title
                                        const reasonContent = animalReasonParagraph
                                          .split(/animal personality reason[:\s]*/i)[1]
                                          ?.trim();
                                        
                                        if (reasonContent) {
                                          // Parse bullet points from the database content
                                          const bulletPoints = reasonContent
                                            .split('\n')
                                            .map((line: string) => line.trim())
                                            .filter((line: string) => line && line.startsWith('•'))
                                            .map((line: string) => line.replace(/^•\s*/, '').trim())
                                            .filter((line: string) => line.length > 0);
                                          
                                          if (bulletPoints.length > 0) {
                                            animalContent = bulletPoints.join('\n');
                                          } else {
                                            animalContent = reasonContent;
                                          }
                                        }
                                      }
                                      
                                      // If not found, try alternative patterns
                                      let alternativeParagraph = null;
                                      if (!animalContent || animalContent.length < 10) {
                                        // Try to find any paragraph that contains animal personality analysis
                                        alternativeParagraph = assessment.split('\n\n').find((paragraph: string) => {
                                          const lowerParagraph = paragraph.toLowerCase();
                                          return (lowerParagraph.includes('animal personality') && 
                                                  (lowerParagraph.includes('analysis') || 
                                                   lowerParagraph.includes('reason') ||
                                                   lowerParagraph.includes('instincts'))) ||
                                                 (lowerParagraph.includes('eagle') && lowerParagraph.includes('personality')) ||
                                                 (lowerParagraph.includes('peacock') && lowerParagraph.includes('personality')) ||
                                                 (lowerParagraph.includes('turtle') && lowerParagraph.includes('personality')) ||
                                                 (lowerParagraph.includes('owl') && lowerParagraph.includes('personality'));
                                        });
                                        
                                        if (alternativeParagraph) {
                                          // Extract content after any animal personality header
                                          const content = alternativeParagraph
                                            .split(/animal personality[:\s]*/i)[1] ||
                                            alternativeParagraph
                                            .split(/personality[:\s]*/i)[1] ||
                                            alternativeParagraph;
                                          
                                          if (content && content.trim().length > 10) {
                                            animalContent = content.trim();
                                          }
                                        }
                                      }
                                      
                                      // Final fallback: Look for specific animal name in assessment
                                      if (!animalContent || animalContent.length < 10) {
                                        // Try to find content that mentions the specific animal
                                        const animalSpecificParagraph = assessment.split('\n\n').find((paragraph: string) => {
                                          const lowerParagraph = paragraph.toLowerCase();
                                          const animalLower = userAnimalName.toLowerCase();
                                          return lowerParagraph.includes(animalLower) && 
                                                 (lowerParagraph.includes('personality') || 
                                                  lowerParagraph.includes('instincts') ||
                                                  lowerParagraph.includes('natural'));
                                        });
                                        
                                        if (animalSpecificParagraph) {
                                          // Extract content after the animal name
                                          const content = animalSpecificParagraph
                                            .split(new RegExp(`${userAnimalName}[:\s]*`, 'i'))[1] ||
                                            animalSpecificParagraph;
                                          
                                          if (content && content.trim().length > 10) {
                                            animalContent = content.trim();
                                          }
                                        }
                                      }
                                      
                                      // Final fallback: Generate correct animal personality reason if database content not found
                                      if (!animalContent || animalContent.length < 10) {
                                        const userName = userProfile.first_name || userProfile.email || 'this person';
                                        animalContent = `• Like the ${userAnimalName}'s natural instincts, ${userName} demonstrates ${userAnimalTraits} in their decision-making patterns\n• The ${userAnimalName} personality reflects ${userName}'s authentic approach to challenges and social interactions\n• This ${userPrimaryType === 'D' ? 'dominance' : userPrimaryType === 'I' ? 'influence' : userPrimaryType === 'S' ? 'steadiness' : 'conscientiousness'}-dominant profile shows how ${userName} naturally navigates professional and personal situations`;
                                      }
                                      
                                      // Debug logging
                                      console.log('🔍 Profile Animal Personality Debug:');
                                      console.log('📊 User Primary Type:', userPrimaryType);
                                      console.log('📊 User Animal Name (for title):', userAnimalName);
                                      console.log('📊 User Animal from DB:', userAnimal);
                                      console.log('📊 DISC Scores:', {
                                        D: userProfile.game_stats?.disc_personality_stats?.d_score,
                                        I: userProfile.game_stats?.disc_personality_stats?.i_score,
                                        S: userProfile.game_stats?.disc_personality_stats?.s_score,
                                        C: userProfile.game_stats?.disc_personality_stats?.c_score
                                      });
                                      console.log('📊 Assessment contains ANIMAL PERSONALITY REASON:', assessment.includes('ANIMAL PERSONALITY REASON'));
                                      console.log('📊 Assessment contains ANIMAL PERSONALITY:', assessment.includes('ANIMAL PERSONALITY'));
                                      console.log('📊 Assessment contains ANALYSIS:', assessment.includes('ANALYSIS'));
                                      console.log('📊 Animal Reason Paragraph found:', !!animalReasonParagraph);
                                      console.log('📊 Alternative Paragraph found:', !!alternativeParagraph);
                                      console.log('📊 Final Animal Content:', animalContent);
                                      console.log('📊 Animal Content length:', animalContent.length);
                                      console.log('📊 Animal Content first line:', animalContent.split('\n')[0]);
                                      console.log('📊 Assessment preview:', assessment.substring(0, 1000));
                                      console.log('🎯 TITLE WILL SHOW: ANIMAL PERSONALITY (' + userAnimalName + ') ANALYSIS:');
                                      
                                      // Fallback: If no animal content found, create a basic one
                                      if (!animalContent || animalContent.length < 10) {
                                        const primaryType = userProfile.game_stats?.disc_personality_stats?.latest_primary_type;
                                        const animalName = primaryType === 'D' ? 'Eagle' : primaryType === 'I' ? 'Peacock' : primaryType === 'S' ? 'Turtle' : 'Owl';
                                        const discType = primaryType === 'D' ? 'Dominance' : primaryType === 'I' ? 'Influence' : primaryType === 'S' ? 'Steadiness' : 'Conscientiousness';
                                        
                                        animalContent = `• Like the ${animalName}'s natural instincts, Aaron demonstrates ${discType.toLowerCase()} traits in their decision-making patterns
• The ${animalName} personality reflects Aaron's authentic approach to challenges and social interactions
• This ${discType.toLowerCase()}-dominant profile shows how Aaron naturally navigates professional and personal situations`;
                                      }
                                      
                                      // Clean up the content
                                      const cleanComprehensive = comprehensiveContent
                                            .replace(/^[^:]*:\s*/, '') // Remove everything before the first colon
                                            .trim();
                                          
                                      const cleanAnimal = animalContent.trim();
                                      
                                      if ((cleanComprehensive && cleanComprehensive.length > 50) || (cleanAnimal && cleanAnimal.length > 10)) {
                                            return (
                                          <div className="space-y-6">
                                            {/* Comprehensive Assessment Section */}
                                            {cleanComprehensive && cleanComprehensive.length > 50 && (
                                              <div>
                                                <h4 className="text-blue-300 font-semibold mb-3 text-sm">COMPREHENSIVE ASSESSMENT:</h4>
                                                <div className="text-gray-300 leading-relaxed space-y-4">
                                                    <span 
                                                      dangerouslySetInnerHTML={{
                                                      __html: cleanComprehensive
                                                        .replace(/\n\n/g, '</p><p class="mb-4">') // Add paragraph spacing
                                                        .replace(/^/, '<p class="mb-4">') // Start with paragraph
                                                        .replace(/$/, '</p>') // End with paragraph
                                                          .replace(/\b(Natural Instinct|Decision Pattern|Challenge Navigation|Key Insight|Growth Area)\b/gi, 
                                                            '<span class="text-cyan-400 font-semibold">$1</span>')
                                                          .replace(/\b(dominance|influence|steadiness|conscientiousness)\b/gi, 
                                                            '<span class="text-purple-400 font-medium">$1</span>')
                                                          .replace(/\b(peacock|eagle|turtle|owl)\b/gi, 
                                                            '<span class="text-green-400 font-medium">$1</span>')
                                                          .replace(/\b(strengths?|blind spots?|recommendations?|response|critical|essential|important|should|must|need to)\b/gi, 
                                                            '<span class="text-yellow-400 font-semibold">$1</span>')
                                                          .replace(/\b(high|low|equal|balanced|calculated|purposeful|strategic|harmony|accuracy|support|information|confronting|directly|firm|challenging|situations)\b/gi, 
                                                            '<span class="text-orange-400 font-medium">$1</span>')
                                                        .replace(/\b(husay at tiyaga|tapang at tiyaga|pakikisama|malasakit|pagkamatiyaga)\b/gi, 
                                                          '<span class="text-pink-400 font-semibold">$1</span>')
                                                    }}
                                                  />
                                                </div>
                                              </div>
                                            )}
                                            
                                            {/* Animal Personality Reason Section */}
                                            {cleanAnimal && cleanAnimal.length > 10 && (
                                              <div>
                                                <h4 className="text-lg font-semibold text-purple-300 mb-3">
                                                  ANIMAL PERSONALITY ({userAnimalName}) ANALYSIS:
                                                </h4>
                                                <div className="space-y-4">
                                                  {cleanAnimal
                                                    .split('\n')
                                                    .filter((line: string) => {
                                                      const trimmed = line.trim();
                                                      // Filter out header lines that might be redundant
                                                      return trimmed && 
                                                             !trimmed.toLowerCase().includes('animal personality reason') &&
                                                             !trimmed.toLowerCase().includes('animal personality -') &&
                                                             !trimmed.toLowerCase().includes('personality analysis') &&
                                                             !trimmed.match(/^[A-Z\s]+:$/); // Filter out lines that are just headers like "ANIMAL PERSONALITY REASON:"
                                                    })
                                                    .map((point: string, bulletIndex: number) => (
                                                      <div key={bulletIndex} className="flex items-start gap-2 mb-6">
                                                        <span className="text-purple-400 mt-1">•</span>
                                                        <span className="text-gray-300 leading-relaxed">{point.replace(/^•\s*/, '')}</span>
                                                  </div>
                                                ))}
                                                </div>
                                              </div>
                                            )}
                                              </div>
                                            );
                                          }
                                      
                                      // Fallback if no specific content found
                                      return 'Your unique personality traits make you naturally suited to this animal archetype.';
                                    })()}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Core Traits Section */}
                              {userProfile.game_stats.disc_personality_stats.latest_ai_assessment && (
                                <div className="mt-4 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-400/30">
                                  <button
                                    onClick={() => setIsCoreTraitsExpanded(!isCoreTraitsExpanded)}
                                    className="w-full flex items-center justify-between text-sm font-semibold text-green-300 mb-2 hover:text-green-200 transition-colors"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                      Core Traits
                                    </div>
                                    <ChevronDown 
                                      className={`w-4 h-4 transition-transform duration-200 ${
                                        isCoreTraitsExpanded ? 'rotate-180' : ''
                                      }`}
                                    />
                                  </button>
                                  {isCoreTraitsExpanded && (
                                    <div className="text-gray-300 text-sm leading-relaxed">
                                    {(() => {
                                      const assessment = userProfile.game_stats.disc_personality_stats.latest_ai_assessment;
                                      
                                      // Extract the core traits section
                                      if (assessment.includes('CORE TRAITS')) {
                                        const traitsSection = assessment
                                          .split('CORE TRAITS')[1]
                                          ?.split('\n\n')[0]
                                          ?.trim();
                                        
                                        if (traitsSection) {
                                          // Clean up the content and split into individual traits
                                          const cleanTraits = traitsSection
                                            .replace(/^[^:]*:\s*/, '') // Remove everything before the first colon
                                            .trim();
                                          
                                          // Split by bullet points or dashes to get individual traits with their evidence
                                          let traits = cleanTraits
                                            .split(/^[-•]\s*/m) // Split by bullet points at start of line
                                            .map((trait: string) => trait.trim())
                                            .filter((trait: string) => trait.length > 0);
                                          
                                          // If no bullet points found, try to split by line breaks
                                          if (traits.length === 1) {
                                            traits = cleanTraits
                                              .split(/\n/)
                                              .map((trait: string) => trait.trim())
                                              .filter((trait: string) => trait.length > 0);
                                          }
                                          
                                          // Add hyphens to compound words
                                          traits = traits.map((trait: string) => {
                                            return trait
                                              .replace(/\bproblemsolver\b/gi, 'problem-solver')
                                              .replace(/\bqualityfocused\b/gi, 'quality-focused')
                                              .replace(/\bprocessoriented\b/gi, 'process-oriented')
                                              .replace(/\bdetailoriented\b/gi, 'detail-oriented')
                                              .replace(/\bresultsoriented\b/gi, 'results-oriented')
                                              .replace(/\bpeopleoriented\b/gi, 'people-oriented')
                                              .replace(/\btaskoriented\b/gi, 'task-oriented')
                                              .replace(/\bgoaloriented\b/gi, 'goal-oriented')
                                              .replace(/\boutcomeoriented\b/gi, 'outcome-oriented')
                                              .replace(/\bteamoriented\b/gi, 'team-oriented')
                                              .replace(/\bclientoriented\b/gi, 'client-oriented')
                                              .replace(/\bdataoriented\b/gi, 'data-oriented')
                                              .replace(/\bactionoriented\b/gi, 'action-oriented')
                                              .replace(/\brelationshipconscious\b/gi, 'relationship-conscious')
                                              .replace(/\bstrategicrelationship\b/gi, 'strategic relationship')
                                              .replace(/\badaptablecommunicator\b/gi, 'adaptable communicator')
                                              .replace(/\bprocessfocused\b/gi, 'process-focused')
                                              .replace(/\bresultfocused\b/gi, 'result-focused')
                                              .replace(/\boutcomefocused\b/gi, 'outcome-focused')
                                              .replace(/\bteamfocused\b/gi, 'team-focused')
                                              .replace(/\bclientfocused\b/gi, 'client-focused')
                                              .replace(/\bdatafocused\b/gi, 'data-focused')
                                              .replace(/\bproblemfocused\b/gi, 'problem-focused')
                                              .replace(/\bsolutionfocused\b/gi, 'solution-focused')
                                              .replace(/\bactionfocused\b/gi, 'action-focused')
                                              .replace(/\bresultfocused\b/gi, 'result-focused')
                                              .replace(/\boutcomefocused\b/gi, 'outcome-focused')
                                              .replace(/\bteamfocused\b/gi, 'team-focused')
                                              .replace(/\bclientfocused\b/gi, 'client-focused')
                                              .replace(/\bdatafocused\b/gi, 'data-focused')
                                              .replace(/\bproblemfocused\b/gi, 'problem-focused')
                                              .replace(/\bsolutionfocused\b/gi, 'solution-focused')
                                              .replace(/\bactionfocused\b/gi, 'action-focused');
                                          });
                                          
                                          return (
                                            <div className="space-y-3">
                                              {traits.map((trait: string, index: number) => (
                                                <div key={index} className="flex items-start gap-3">
                                                  <span className="text-green-400 mt-1 flex-shrink-0">-</span>
                                                  <span 
                                                    className="text-gray-300 leading-relaxed"
                                                    dangerouslySetInnerHTML={{
                                                      __html: trait
                                                        .replace(/\b(leadership|communication|analytical|creative|organized|strategic|empathetic|decisive|collaborative|detail-oriented|methodical|quality-focused|perfectionist|emerging|quiet|leader|process-oriented|thinker|problem-solver)\b/gi, 
                                                          '<span class="text-green-400 font-semibold">$1</span>')
                                                        .replace(/\b(strong|natural|key|primary|essential|core|fundamental)\b/gi, 
                                                          '<span class="text-yellow-400 font-medium">$1</span>')
                                                        .replace(/\b(evidenced by|shown in|demonstrated through|reflected in)\b/gi, 
                                                          '<span class="text-blue-400 font-medium">$1</span>')
                                                        .replace(/\b(Dominance|Influence|Steadiness|Conscientiousness|DISC)\b/gi, 
                                                          '<span class="text-purple-400 font-medium">$1</span>')
                                                    }}
                                                  />
                                                </div>
                                              ))}
                                            </div>
                                          );
                                        }
                                      }
                                      
                                      // Fallback if no specific traits found
                                      return 'Your core personality traits are being analyzed.';
                                    })()}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Cultural Strengths Section */}
                              {userProfile.game_stats.disc_personality_stats.latest_ai_assessment && (
                                <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-400/30">
                                  <button
                                    onClick={() => setIsCulturalStrengthsExpanded(!isCulturalStrengthsExpanded)}
                                    className="w-full flex items-center justify-between text-sm font-semibold text-purple-300 mb-2 hover:text-purple-200 transition-colors"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                                      Cultural Strengths
                                    </div>
                                    <ChevronDown 
                                      className={`w-4 h-4 transition-transform duration-200 ${
                                        isCulturalStrengthsExpanded ? 'rotate-180' : ''
                                      }`}
                                    />
                                  </button>
                                  {isCulturalStrengthsExpanded && (
                                    <div className="text-gray-300 text-sm leading-relaxed">
                                    {(() => {
                                      const assessment = userProfile.game_stats.disc_personality_stats.latest_ai_assessment;
                                      
                                      // Extract the cultural strengths section
                                      if (assessment.includes('CULTURAL STRENGTHS')) {
                                        const culturalSection = assessment
                                          .split('CULTURAL STRENGTHS')[1]
                                          ?.split('\n\n')[0]
                                          ?.trim();
                                        
                                        if (culturalSection) {
                                      // Clean up the content and display as bullet points
                                      const cleanCultural = culturalSection
                                        .replace(/^[^:]*:\s*/, '') // Remove everything before the first colon
                                        .trim();
                                      
                                      // Split by numbered items or bullet points and display each as a separate line
                                      // Handle both numbered format (1. 2. 3.) and bullet points (- • *)
                                      const bulletPoints = cleanCultural
                                        .split(/(?<=^|\n)\s*(?:\d+\.\s*|[-•*]\s+)/)
                                        .map((point: string) => point.trim())
                                        .filter((point: string) => point.length > 0);
                                      
                                      return (
                                        <div className="space-y-3">
                                          {bulletPoints.map((point: string, bulletIndex: number) => (
                                            <div key={bulletIndex} className="flex items-start gap-3">
                                              <span className="text-purple-400 mt-1 flex-shrink-0">-</span>
                                              <span 
                                                className="text-gray-300 leading-relaxed"
                                                dangerouslySetInnerHTML={{
                                                  __html: point
                                                    .replace(/\b(pakikisama|malasakit|bayanihan|kapwa|utang na loob|hiya|pagkamatiyaga|tiyaga)\b/gi, 
                                                      '<span class="text-purple-400 font-semibold">$1</span>')
                                                    .replace(/\b(ability to get along|genuine care|community spirit|shared identity|debt of gratitude|sense of shame|relating to others|patience|perseverance)\b/gi, 
                                                      '<span class="text-pink-400 font-medium">$1</span>')
                                                    .replace(/\b(Filipino|cultural|values|tradition|heritage)\b/gi, 
                                                      '<span class="text-yellow-400 font-medium">$1</span>')
                                                }}
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      );
                                        }
                                      }
                                      
                                      // Fallback if no specific cultural strengths found
                                      return 'Your Filipino cultural strengths are being analyzed.';
                                    })()}
                                    </div>
                                  )}
                                </div>
                              )}

                            </div>
                          ) : (
                            <div className="text-center py-8 flex-1 flex flex-col justify-center">
                              <div className="text-4xl mb-4">📊</div>
                              <p className="text-gray-400 mb-4">No data found</p>
                              <Button
                                onClick={() => router.push('/career-tools/games/disc-personality')}
                                className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30"
                              >
                                Take DISC Assessment
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {isAnonymous && (
                      <SignUpCTA
                        title="View Game Interpretations"
                        description="Sign up to view detailed interpretations of game results, unlock personalized insights, and play career assessment games to discover your professional strengths."
                        icon={Gamepad2}
                      />
                    )}
                  </div>
                )}


              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
      
      {/* Custom CSS for owl animations */}
      <style jsx>{`
        @keyframes owlWise {
          0%, 100% { 
            transform: rotate(0deg) scale(1);
            filter: drop-shadow(0 0 10px #3b82f6);
          }
          25% { 
            transform: rotate(-15deg) scale(1.1);
            filter: drop-shadow(0 0 15px #3b82f6);
          }
          50% { 
            transform: rotate(0deg) scale(1.2);
            filter: drop-shadow(0 0 20px #3b82f6);
          }
          75% { 
            transform: rotate(15deg) scale(1.1);
            filter: drop-shadow(0 0 15px #3b82f6);
          }
        }
        
        @keyframes owlBlink {
          0%, 90%, 100% { 
            opacity: 1;
          }
          95% { 
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}


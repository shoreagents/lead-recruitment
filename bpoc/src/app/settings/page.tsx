'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { PacmanLoader } from 'react-spinners'
import { Loader as GoogleMapsLoader } from '@googlemaps/js-api-loader'
import Header from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Settings,
  User,
  Bell,
  Shield,
  Eye,
  Key,
  Download,
  Trash2,
  Save,
  ChevronRight,
  Mail,
  Phone,
  Globe,
  Lock,
  Smartphone,
  Monitor,
  Sun,
  Moon,
  Zap,
  Database,
  FileText,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  Camera,
  Upload,
  Building,
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  BarChart3,
  Medal,
  Users,
  Calendar
} from 'lucide-react'
import { uploadProfilePhoto, deleteProfilePhoto, optimizeImage, testStorageConnection } from '@/lib/storage'

interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  location: string
  avatar_url?: string
  phone?: string
  bio?: string
  position?: string
  location_place_id?: string
  location_lat?: number | null
  location_lng?: number | null
  location_city?: string
  location_province?: string
  location_country?: string
  location_barangay?: string
  location_region?: string
}

export default function SettingsPage() {
  const router = useRouter()
  const { user, updateProfile, refreshUser } = useAuth()
  const [activeSection, setActiveSection] = useState('profile')
  const [activePrivacyTab, setActivePrivacyTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [photoUploading, setPhotoUploading] = useState(false)
  const [photoError, setPhotoError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const locationInputRef = useRef<HTMLInputElement | null>(null)
  const placesAutocompleteRef = useRef<any>(null)
  
  const [profileData, setProfileData] = useState<UserProfile>({
    id: '',
    email: '',
    first_name: '',
    last_name: '',
    location: '',
    avatar_url: '',
    phone: '',
    bio: '',
    position: '',
    location_place_id: '',
    location_lat: null,
    location_lng: null,
    location_city: '',
    location_province: '',
    location_country: '',
    location_barangay: '',
    location_region: ''
  })

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    jobAlerts: true,
    marketingEmails: false,
    smsNotifications: true,
    pushNotifications: true
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    // Overview tab
    username: 'public',
    firstName: 'public',
    lastName: 'only-me',
    location: 'public',
    jobTitle: 'public', // Uneditable - Default Public
    birthday: 'only-me',
    age: 'only-me',
    gender: 'only-me',
    memberSince: 'public',
    resumeScore: 'public', // Uneditable - Default Public
    gamesCompleted: 'public', // Uneditable - Default Public
    keyStrengths: 'only-me' // Uneditable - Default Private
  })

  const settingsSections = [
    {
      id: 'profile',
      title: 'Profile Settings',
      icon: User,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      description: 'Manage your personal information'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      description: 'Coming soon'
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Shield,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      description: 'Control your profile visibility'
    },
  ]

  const COMING_SOON_SECTIONS = new Set(['notifications'])

  const privacyTabs = [
    {
      id: 'overview',
      title: 'Overview',
      icon: User,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10'
    }
  ]

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  // Initialize Google Places Autocomplete for location field
  useEffect(() => {
    const initPlaces = async () => {
      try {
        if (!locationInputRef.current) return
        if (placesAutocompleteRef.current) return // already initialized

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        if (!apiKey) {
          console.warn('Google Maps API key missing: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY')
          return
        }

        const loader = new GoogleMapsLoader({ apiKey, libraries: ['places'] })
        const google = await loader.load()
        if (!locationInputRef.current) return

        const autocomplete = new google.maps.places.Autocomplete(locationInputRef.current, {
          fields: ['place_id', 'formatted_address', 'address_components', 'geometry'],
          types: ['(regions)'],
          componentRestrictions: { country: 'ph' }
        })

        placesAutocompleteRef.current = autocomplete
        console.log('✅ Google Places Autocomplete attached to location input')

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          if (!place || !place.geometry || !place.address_components) return

          const get = (type: string) =>
            place.address_components?.find((c: any) => c.types.includes(type))?.long_name || ''

          const province = get('administrative_area_level_2') || get('administrative_area_level_1')
          const city = get('locality') || get('administrative_area_level_3')
          const country = get('country')
          const barangay = get('administrative_area_level_3') || get('sublocality')
          const region = get('administrative_area_level_1')

          console.log('📍 Selected place', { placeId: place.place_id, province, city, country })

          setProfileData(prev => ({
            ...prev,
            location: place.formatted_address || '',
            location_place_id: place.place_id || '',
            location_lat: place.geometry!.location?.lat() ?? null,
            location_lng: place.geometry!.location?.lng() ?? null,
            location_city: city,
            location_province: province,
            location_country: country,
            location_barangay: barangay,
            location_region: region
          }))
        })
      } catch (error) {
        console.error('❌ Failed to initialize Google Places Autocomplete:', error)
      }
    }

    // Initialize after a short delay to ensure the input is rendered
    const timer = setTimeout(initPlaces, 100)
    return () => clearTimeout(timer)
  }, [])

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return

      try {
        setLoading(true)
        const response = await fetch(`/api/user/profile?userId=${user.id}`)
        console.log('🔍 Profile API response status:', response.status)
        if (response.ok) {
          const data = await response.json()
          const userData = data.user
          console.log('📋 Loaded user data from Railway:', userData)
          setProfileData({
            id: userData.id || user.id,
            email: userData.email || user.email || '',
            first_name: userData.first_name || user.user_metadata?.first_name || '',
            last_name: userData.last_name || user.user_metadata?.last_name || '',
            location: userData.location || user.user_metadata?.location || '',
            avatar_url: userData.avatar_url || user.user_metadata?.avatar_url || '',
            phone: userData.phone || user.user_metadata?.phone || '',
            bio: userData.bio || user.user_metadata?.bio || '',
            position: userData.position || user.user_metadata?.position || ''
          })

          // Check if Supabase display name is out of sync
          const railwayFullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim()
          const supabaseFullName = user.user_metadata?.full_name || ''
          
          if (railwayFullName && railwayFullName !== supabaseFullName) {
            console.log('⚠️ Display name out of sync. Railway:', railwayFullName, 'Supabase:', supabaseFullName)
            console.log('🔄 Auto-fixing Supabase display name...')
            
            try {
              const { error } = await updateProfile({
                full_name: railwayFullName,
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                location: userData.location || '',
                avatar_url: userData.avatar_url || '',
                phone: userData.phone || '',
                bio: userData.bio || '',
                position: userData.position || ''
              })
              
              if (error) {
                console.error('❌ Auto-fix failed:', error)
              } else {
                console.log('✅ Auto-fixed Supabase display name')
              }
            } catch (error) {
              console.error('❌ Failed to auto-fix display name:', error)
            }
          }
        } else {
          // Fallback to Supabase user metadata
          setProfileData({
            id: user.id,
            email: user.email || '',
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            location: user.user_metadata?.location || '',
            avatar_url: user.user_metadata?.avatar_url || '',
            phone: user.user_metadata?.phone || '',
            bio: user.user_metadata?.bio || '',
            position: user.user_metadata?.position || ''
          })
        }
      } catch (error) {
        console.error('Error loading user profile:', error)
        // Fallback to Supabase user metadata
        setProfileData({
          id: user.id,
          email: user.email || '',
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          location: user.user_metadata?.location || '',
          avatar_url: user.user_metadata?.avatar_url || '',
          phone: user.user_metadata?.phone || '',
          bio: user.user_metadata?.bio || '',
          position: user.user_metadata?.position || ''
        })
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [user, updateProfile])

  // Load privacy settings from database
  useEffect(() => {
    const loadPrivacySettings = async () => {
      if (!user) return

      try {
        const response = await fetch(`/api/privacy-settings?userId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setPrivacySettings({
              username: data.data.username || 'public',
              firstName: data.data.first_name || 'public',
              lastName: data.data.last_name || 'only-me',
              location: data.data.location || 'public',
              jobTitle: data.data.job_title || 'public',
              birthday: data.data.birthday || 'only-me',
              age: data.data.age || 'only-me',
              gender: data.data.gender || 'only-me',
              memberSince: data.data.member_since || 'public',
              resumeScore: data.data.resume_score || 'public',
              gamesCompleted: data.data.games_completed || 'public',
              keyStrengths: data.data.key_strengths || 'only-me'
            })
          }
        }
      } catch (error) {
        console.error('Error loading privacy settings:', error)
      }
    }

    loadPrivacySettings()
  }, [user])

  const handleSaveProfile = async () => {
    if (!user) return

    try {
      console.log('💾 Starting profile save process...')
      console.log('📋 Profile data to save:', profileData)

      // Generate full name from first and last name
      const fullName = `${profileData.first_name} ${profileData.last_name}`.trim()

      // Update Railway database (which also handles Supabase metadata update)
      console.log('🔄 Updating Railway database and Supabase metadata...')
      const railwayResponse = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token || ''}`
        },
        body: JSON.stringify({
          userId: user.id,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          full_name: fullName,
          username: profileData.username,
          location: profileData.location,
          position: profileData.position,
          gender: profileData.gender,
          birthday: profileData.birthday,
          slug: profileData.username // Use username as slug
        }),
      })

      if (railwayResponse.ok) {
        console.log('✅ Railway and Supabase update successful')
        
        // If username changed, redirect to new profile URL immediately
        if (profileData.username && profileData.username !== user.user_metadata?.username) {
          console.log('🔄 Username changed, redirecting to new profile URL...')
          window.location.href = `/${profileData.username}`
        } else {
          // If no username change, just reload the current page
          window.location.reload()
        }
      } else {
        const railwayError = await railwayResponse.json()
        console.error('❌ Railway update failed:', railwayError)
        alert(`Failed to save profile: ${railwayError.error}`)
      }

    } catch (error) {
      console.error('❌ Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    }
  }

  const handleSavePrivacySettings = async () => {
    if (!user) return

    try {
      setSaveStatus('saving')
      setErrorMessage('')

      console.log('💾 Starting privacy settings save process...')
      console.log('📋 Privacy settings to save:', privacySettings)

      const response = await fetch('/api/privacy-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          username: privacySettings.username,
          first_name: privacySettings.firstName,
          last_name: privacySettings.lastName,
          location: privacySettings.location,
          job_title: privacySettings.jobTitle,
          birthday: privacySettings.birthday,
          age: privacySettings.age,
          gender: privacySettings.gender,
          member_since: privacySettings.memberSince,
          resume_score: privacySettings.resumeScore,
          games_completed: privacySettings.gamesCompleted,
          key_strengths: privacySettings.keyStrengths
        }),
      })

      if (response.ok) {
        console.log('✅ Privacy settings saved successfully')
        setSaveStatus('success')
        setErrorMessage('')
        
        // Show success modal
        setShowSuccessModal(true)
        
        // Auto-hide success modal after 3 seconds
        setTimeout(() => {
          setShowSuccessModal(false)
          setSaveStatus('idle')
        }, 3000)
      } else {
        const errorData = await response.json()
        console.error('❌ Privacy settings save failed:', errorData)
        setSaveStatus('error')
        setErrorMessage(`Failed to save privacy settings: ${errorData.error}`)
      }

    } catch (error) {
      console.error('❌ Error saving privacy settings:', error)
      setSaveStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save privacy settings')
      setTimeout(() => setSaveStatus('idle'), 5000)
    }
  }

  const handleToggleNotification = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }))
  }

  const handlePrivacySettingChange = (key: string, value: string) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleForceUpdateDisplayName = async () => {
    if (!user) return

    try {
      setSaveStatus('saving')
      setErrorMessage('')

      const fullName = `${profileData.first_name} ${profileData.last_name}`.trim()
      
      console.log('🔄 Force updating Supabase display name to:', fullName)
      
      const { error } = await updateProfile({
        full_name: fullName,
        first_name: profileData.first_name,
        last_name: profileData.last_name
      })

      if (error) {
        console.error('❌ Force update failed:', error)
        setErrorMessage(`Failed to update display name: ${error.message}`)
        setSaveStatus('error')
      } else {
        console.log('✅ Display name updated successfully')
        
        // Refresh user data to ensure UI reflects latest changes
        try {
          await refreshUser()
          console.log('✅ User data refreshed after force update')
        } catch (refreshError) {
          console.error('❌ Failed to refresh user data:', refreshError)
        }
        
        setSaveStatus('success')
        setErrorMessage('')
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('❌ Error force updating display name:', error)
      setSaveStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update display name')
      setTimeout(() => setSaveStatus('idle'), 5000)
    }
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return
    
    try {
      setPhotoUploading(true)
      setPhotoError('')
      
      console.log('📸 Starting photo upload...')
      

      
      // Optimize image
      const optimizedFile = await optimizeImage(file)
      console.log('✅ Image optimized')
      
      // Upload to Supabase
      const { fileName, publicUrl } = await uploadProfilePhoto(optimizedFile, user.id)
      console.log('✅ Photo uploaded to Supabase:', publicUrl)
      
      // Update profile data
      setProfileData(prev => ({
        ...prev,
        avatar_url: publicUrl
      }))
      
      // Update Railway database
      console.log('🔄 Updating Railway with avatar_url:', publicUrl)
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...profileData,
          avatar_url: publicUrl
        })
      })
      
      console.log('📊 Railway update response status:', response.status)
      
      if (response.ok) {
        const responseData = await response.json()
        console.log('✅ Profile photo updated in Railway:', responseData)
        
        // Refresh user data
        try {
          await refreshUser()
          console.log('✅ User data refreshed after photo upload')
        } catch (refreshError) {
          console.error('❌ Failed to refresh user data:', refreshError)
        }
        
        // Trigger header update
        window.dispatchEvent(new CustomEvent('profileUpdated'))
      } else {
        const errorData = await response.text()
        console.error('❌ Failed to update profile photo in Railway:', response.status, errorData)
      }
      
    } catch (error) {
      console.error('❌ Photo upload failed:', error)
      
      // Extract meaningful error message
      let errorMessage = 'Upload failed'
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null) {
        // Handle Supabase error objects
        if ('message' in error) {
          errorMessage = String(error.message)
        } else if ('error' in error) {
          errorMessage = String(error.error)
        } else {
          errorMessage = JSON.stringify(error)
        }
      } else {
        errorMessage = String(error)
      }
      
      setPhotoError(errorMessage)
    } finally {
      setPhotoUploading(false)
    }
  }

  const handleTestStorage = async () => {
    try {
      console.log('🧪 Testing storage connection...')
      
      // Check environment variables first
      const envResponse = await fetch('/api/test-env')
      const envResult = await envResponse.json()
      console.log('Environment check result:', envResult)
      
      if (!envResult.success) {
        alert(`Environment check failed:\nMissing: ${envResult.missingVars.join(', ')}`)
        return
      }
      
      // Test client-side connection
      const clientResult = await testStorageConnection()
      console.log('Client-side test result:', clientResult)
      
      // Test server-side connection
      const serverResponse = await fetch('/api/test-storage')
      const serverResult = await serverResponse.json()
      console.log('Server-side test result:', serverResult)
      
      if (clientResult.success && serverResult.success) {
        console.log('✅ All tests successful')
        alert('Storage connection test successful! Check console for details.')
      } else {
        const errors = []
        if (!clientResult.success) errors.push(`Client: ${clientResult.error}`)
        if (!serverResult.success) errors.push(`Server: ${serverResult.error}`)
        console.error('❌ Storage test failed:', errors)
        alert(`Storage test failed:\n${errors.join('\n')}`)
      }
    } catch (error) {
      console.error('❌ Storage test error:', error)
      alert(`Storage test error: ${error}`)
    }
  }

  const renderProfileSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            Personal Information
          </CardTitle>
          <CardDescription>
            Update your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <PacmanLoader 
                    color="#fbbf24" 
                    size={40}
                    margin={3}
                    speedMultiplier={1.2}
                  />
                </div>
                <span className="text-gray-300 text-sm">Loading profile...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Profile Photo Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Camera className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-semibold text-white">Profile Photo</h3>
                </div>
                
                <div className="flex items-center gap-6">
                  {/* Current Photo */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-400 to-purple-400">
                      {profileData.avatar_url ? (
                        <img
                          src={profileData.avatar_url}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Upload Overlay */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={photoUploading}
                      className="absolute -bottom-1 -right-1 w-8 h-8 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-500 rounded-full flex items-center justify-center transition-colors"
                    >
                      {photoUploading ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4 text-white" />
                      )}
                    </button>
                  </div>
                  
                  {/* Upload Info */}
                  <div className="flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={photoUploading}
                          variant="outline"
                          size="sm"
                          className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                        >
                          {photoUploading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Photo
                            </>
                          )}
                        </Button>
                        
                        {profileData.avatar_url && (
                          <Button
                            onClick={() => {
                              setProfileData(prev => ({ ...prev, avatar_url: '' }))
                              // TODO: Implement photo deletion
                            }}
                            variant="outline"
                            size="sm"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-400">
                        JPG, PNG, GIF up to 5MB. Recommended size: 400x400px
                      </p>
                      
                      {photoError && (
                        <p className="text-xs text-red-400">{photoError}</p>
                      )}
                      
                      {/* Hidden Test Storage Button - functionality preserved */}
                      <Button
                        onClick={handleTestStorage}
                        variant="outline"
                        size="sm"
                        className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 hidden"
                      >
                        <Database className="w-4 h-4 mr-2" />
                        Test Storage
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
              
              <Separator className="bg-white/10" />
              
              {/* Personal Information Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">First Name</label>
                  <Input
                    value={profileData.first_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, first_name: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Last Name</label>
                  <Input
                    value={profileData.last_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, last_name: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Enter your last name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Email</label>
                  <Input
                    value={profileData.email}
                    disabled
                    className="bg-white/5 border-white/10 text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Phone</label>
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Location</label>
                  <div className="relative">
                  <Input
                      ref={locationInputRef}
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      className="bg-white/5 border-white/10 text-white pl-10"
                    placeholder="Enter your location"
                  />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Start typing to see location suggestions</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Position/Title</label>
                  <Input
                    value={profileData.position}
                    onChange={(e) => setProfileData(prev => ({ ...prev, position: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Enter your job title or position"
                  />
                </div>
                {/* Hidden Avatar URL Field - functionality preserved */}
                <div className="hidden">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Avatar URL</label>
                  <Input
                    value={profileData.avatar_url}
                    onChange={(e) => setProfileData(prev => ({ ...prev, avatar_url: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Enter your profile picture URL"
                  />
                </div>
              </div>
              <div className="hidden">
                <label className="text-sm font-medium text-gray-300 mb-2 block">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              </div>
              
              
              <div className="flex justify-between items-center">
                {/* Hidden Update Display Name Button - functionality preserved */}
                <div className="flex flex-col hidden">
                  <Button 
                    onClick={handleForceUpdateDisplayName}
                    variant="outline"
                    className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Update Display Name
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">Force update Supabase display name</p>
                </div>
                
                <Button 
                  onClick={handleSaveProfile}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

  const ComingSoon = ({ title, icon: Icon, bg }: any) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            {title}
          </CardTitle>
          <CardDescription>Coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-gray-400 text-sm">This section is under development.</div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const renderNotificationSettings = () => (
    <ComingSoon title="Notification Preferences" icon={Bell} bg="bg-gradient-to-br from-yellow-500 to-orange-600" />
  )





  const renderPrivacyDropdown = (key: string, currentValue: string) => (
    <Select value={currentValue} onValueChange={(value) => handlePrivacySettingChange(key, value)}>
      <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border-gray-700">
        <SelectItem value="only-me" className="text-white hover:bg-gray-700">Only Me</SelectItem>
        <SelectItem value="public" className="text-white hover:bg-gray-700">Public</SelectItem>
      </SelectContent>
    </Select>
  )

  const renderUneditablePrivacyField = (key: string, value: string, label: string, description: string) => (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center gap-3">
        <div>
          <div className="text-white font-medium">{label}</div>
          <div className="text-gray-400 text-sm">{description}</div>
        </div>
      </div>
      <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${
        value === 'public' 
          ? 'bg-green-500/20 border-green-500/30' 
          : 'bg-red-500/20 border-red-500/30'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          value === 'public' ? 'bg-green-400' : 'bg-red-400'
        }`}></div>
        <span className={`text-sm font-medium ${
          value === 'public' ? 'text-green-400' : 'text-red-400'
        }`}>
          {value === 'public' ? 'Public' : 'Only Me'}
        </span>
      </div>
    </div>
  )

  const renderPrivacySettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Main Privacy Settings Card with Integrated Tabs */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            Profile Visibility Control
          </CardTitle>
          <CardDescription>
            Control what information is visible on your public profile. Choose who can see each section: Only Me, Public, or Other Candidates.
          </CardDescription>
        </CardHeader>
        
        {/* Privacy Tabs Navigation */}
        <div className="px-6 pb-0">
          <div className="flex flex-wrap gap-2 border-b border-white/10">
            {privacyTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePrivacyTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-all duration-200 border-b-2 ${
                  activePrivacyTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/50 text-cyan-400'
                    : 'hover:bg-white/5 border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <div className={`w-5 h-5 ${tab.bgColor} rounded-lg flex items-center justify-center`}>
                  <tab.icon className={`w-3 h-3 ${activePrivacyTab === tab.id ? tab.color : 'text-gray-400'}`} />
                </div>
                <span className="font-medium">{tab.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <CardContent className="pt-6">

          <motion.div
            key={activePrivacyTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activePrivacyTab === 'overview' && (
              <div className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Fields with Toggles */}
                  <div className="space-y-3">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      Editable Settings
                    </h3>
                    
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="text-white font-medium">First Name</div>
                          <div className="text-gray-400 text-sm">Your first name</div>
                        </div>

                      </div>
                      {renderPrivacyDropdown('firstName', privacySettings.firstName)}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="text-white font-medium">Location</div>
                          <div className="text-gray-400 text-sm">Your current location</div>
                        </div>
                      </div>
                      {renderPrivacyDropdown('location', privacySettings.location)}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="text-white font-medium">Birthday</div>
                          <div className="text-gray-400 text-sm">Your date of birth</div>
                        </div>
                      </div>
                      {renderPrivacyDropdown('birthday', privacySettings.birthday)}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="text-white font-medium">Age</div>
                          <div className="text-gray-400 text-sm">Your current age</div>
                        </div>
                      </div>
                      {renderPrivacyDropdown('age', privacySettings.age)}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="text-white font-medium">Gender</div>
                          <div className="text-gray-400 text-sm">Your gender identity</div>
                        </div>
                      </div>
                      {renderPrivacyDropdown('gender', privacySettings.gender)}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="text-white font-medium">Member Since</div>
                          <div className="text-gray-400 text-sm">When you joined BPOC</div>
                        </div>
                      </div>
                      {renderPrivacyDropdown('memberSince', privacySettings.memberSince)}
                    </div>
                  </div>

                  {/* Right Column - Uneditable Fields */}
                  <div className="space-y-3">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      System Settings
                    </h3>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="text-white font-medium">Last Name</div>
                          <div className="text-gray-400 text-sm">Your last name (always private)</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-lg">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span className="text-red-400 text-sm font-medium">Only Me</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="text-white font-medium">Username</div>
                          <div className="text-gray-400 text-sm">Your unique username (always public)</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-green-400 text-sm font-medium">Public</span>
                      </div>
                    </div>

                    {renderUneditablePrivacyField('jobTitle', privacySettings.jobTitle, 'Job Title', 'Your current job title or position')}

                    {renderUneditablePrivacyField('resumeScore', privacySettings.resumeScore, 'Resume Score', 'Your AI-generated resume score')}

                    {renderUneditablePrivacyField('gamesCompleted', privacySettings.gamesCompleted, 'Games Completed', 'Number of career games you\'ve completed')}

                    {renderUneditablePrivacyField('keyStrengths', privacySettings.keyStrengths, 'Key Strengths', 'Your AI-identified key strengths')}
                  </div>
                </div>
              </div>
            )}



          </motion.div>

          {/* Save Settings Button - At Bottom */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold mb-1">Save Privacy Settings</h3>
                <p className="text-gray-400 text-sm">Your privacy preferences will be applied to your public profile</p>
              </div>
              <Button
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                onClick={activeSection === 'privacy' ? handleSavePrivacySettings : handleSaveProfile}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

    </motion.div>
  )


  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'privacy':
        return renderPrivacySettings()
      default:
        return renderProfileSettings()
    }
  }

  // Show loading state while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Futuristic Space Background */}
        <div className="absolute inset-0">
          {/* Nebula Effect */}
          <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-cyan-900/20"></div>
          <div className="absolute inset-0 bg-gradient-radial from-blue-900/15 via-transparent to-pink-900/15"></div>
          
          {/* Starfield */}
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                  opacity: 0.3 + Math.random() * 0.7
                }}
              ></div>
            ))}
          </div>
          
          {/* Floating Space Debris */}
          <div className="absolute top-20 left-10 w-3 h-3 bg-cyan-400/40 rounded-full animate-bounce"></div>
          <div className="absolute top-40 right-20 w-2 h-2 bg-purple-400/50 rounded-full animate-ping"></div>
          <div className="absolute top-60 left-1/4 w-2.5 h-2.5 bg-blue-400/40 rounded-full animate-pulse"></div>
          <div className="absolute top-80 right-1/3 w-1.5 h-1.5 bg-green-400/60 rounded-full animate-bounce"></div>
          <div className="absolute top-32 left-2/3 w-2 h-2 bg-pink-400/50 rounded-full animate-ping"></div>
          <div className="absolute top-72 right-1/6 w-1.5 h-1.5 bg-yellow-400/40 rounded-full animate-pulse"></div>
          
          {/* Energy Orbs */}
          <div className="absolute top-1/4 left-1/6 w-6 h-6 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full animate-spin opacity-40"></div>
          <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-gradient-to-r from-purple-400/25 to-pink-400/25 rounded-full animate-pulse opacity-30"></div>
          <div className="absolute top-2/3 left-1/3 w-5 h-5 bg-gradient-to-r from-green-400/35 to-cyan-400/35 rounded-full animate-bounce opacity-50"></div>
          <div className="absolute top-1/2 right-1/6 w-4 h-4 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full animate-spin opacity-40" style={{ animationDirection: 'reverse' }}></div>
          
          {/* Cosmic Grid */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/8 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/8 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-transparent"></div>
          
          {/* Wormhole Effect */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-40 h-40 border border-cyan-400/15 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-purple-400/15 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '4s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-blue-400/15 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-pink-400/15 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
          </div>
          
          {/* Energy Waves */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent animate-pulse"></div>
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-purple-500/10 via-transparent to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <Header />
        <div className="pt-16 relative z-10">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center relative">
                {/* Pac-Man Loader */}
                <div className="relative mb-8">
                  <div className="flex justify-center">
                    <PacmanLoader 
                      color="#fbbf24" 
                      size={60}
                      margin={4}
                      speedMultiplier={1.2}
                    />
                  </div>
                  
                  {/* Floating energy particles */}
                  <div className="absolute -top-4 -left-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                  <div className="absolute -top-4 -right-4 w-3 h-3 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute -bottom-4 -left-4 w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute -bottom-4 -right-4 w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
                </div>
                
                {/* Enhanced Text with Glow Effect */}
                <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg" style={{ textShadow: '0 0 20px rgba(34, 211, 238, 0.5)' }}>
                  Loading Settings
                </h2>
                <p className="text-gray-300 mb-6 text-lg">Preparing your personalized settings...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state while user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen cyber-grid overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>
        <Header />
        <div className="pt-16 relative z-10">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center py-20">
                <span className="text-gray-300">Please sign in to access settings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen cyber-grid overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <Header />
      
      <div className="pt-16 relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mr-4 text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <div className="flex items-center">
                <Settings className="h-12 w-12 text-cyan-400 mr-4" />
                <div>
                  <h1 className="text-4xl font-bold gradient-text">Settings</h1>
                  <p className="text-gray-400">Customize your BPOC.IO experience and manage your account preferences</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Settings Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <Card className="glass-card border-white/10 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-white">Settings Menu</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <nav className="space-y-2">
                    {settingsSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-left ${
                          activeSection === section.id
                            ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <div className={`w-8 h-8 ${section.bgColor} rounded-lg flex items-center justify-center`}>
                          <section.icon className={`w-4 h-4 ${section.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium">{section.title}</div>
                          <div className="text-xs text-gray-400 truncate">{section.description}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </motion.div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
      

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <DialogTitle className="text-white text-xl font-semibold">
                Privacy Settings Saved!
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-300 text-base">
              Your privacy preferences have been successfully updated and are now active on your profile.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button 
              onClick={() => setShowSuccessModal(false)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              Got it!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
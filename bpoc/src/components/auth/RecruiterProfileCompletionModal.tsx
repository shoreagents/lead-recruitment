'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader as GoogleMapsLoader } from '@googlemaps/js-api-loader'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import PlacesAutocomplete from '@/components/ui/places-autocomplete'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  User, 
  MapPin, 
  Phone, 
  Briefcase, 
  FileText, 
  Calendar,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Loader2,
  Building2,
  X
} from 'lucide-react'

interface RecruiterProfileData {
  // Step 1: Profile Information
  username: string
  company: string
  position: string
  location: string
  // Structured location fields (optional)
  location_place_id?: string
  location_lat?: number | null
  location_lng?: number | null
  location_city?: string
  location_province?: string
  location_country?: string
  location_barangay?: string
  location_region?: string
  phone: string
  bio: string
  birthday: string
  gender: string
  genderCustom: string
}

interface RecruiterProfileCompletionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
}

const steps = [
  { id: 1, title: 'Profile Info', icon: User },
  { id: 2, title: 'Confirmation', icon: CheckCircle }
]

export default function RecruiterProfileCompletionModal({ 
  open, 
  onOpenChange, 
  onComplete 
}: RecruiterProfileCompletionModalProps) {
  const { user, updateProfile } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState<RecruiterProfileData>({
    // Step 1: Profile Information
    username: '',
    company: '',
    position: '',
    location: '',
    phone: '',
    bio: '',
    birthday: '',
    gender: '',
    genderCustom: ''
  })

  const [age, setAge] = useState<number | null>(null)
  const [usernameChecking, setUsernameChecking] = useState<boolean>(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [usernameTimeout, setUsernameTimeout] = useState<NodeJS.Timeout | null>(null)
  const locationInputRef = useRef<HTMLInputElement | null>(null)
  const placesAutocompleteRef = useRef<any>(null)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  // Initialize Google Places Autocomplete when modal opens and step 1 is visible
  useEffect(() => {
    const initPlaces = async () => {
      try {
        if (!open || currentStep !== 1) return
        if (placesAutocompleteRef.current) return // already initialized
        if (!locationInputRef.current) return

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

          console.log('📍 Selected place', { placeId: place.place_id, province, city, country })

          handleInputChange('location', place.formatted_address || '')
          setFormData(prev => ({
            ...prev,
            location_place_id: place.place_id || '',
            location_lat: place.geometry!.location?.lat() ?? null,
            location_lng: place.geometry!.location?.lng() ?? null,
            location_city: city,
            location_province: province,
            location_country: country
          }))
        })
      } catch (e) {
        console.warn('Google Places init failed', e)
      }
    }
    // Defer to ensure the input is mounted inside the modal
    const t = setTimeout(initPlaces, 0)
    return () => clearTimeout(t)
  }, [open, currentStep])

  // Ensure Google suggestions dropdown is above modal
  useEffect(() => {
    if (typeof document === 'undefined') return
    const id = 'gm-places-zfix'
    if (document.getElementById(id)) return
    const style = document.createElement('style')
    style.id = id
    style.innerHTML = `.pac-container{z-index:99999 !important;}`
    document.head.appendChild(style)
  }, [])

  // Calculate age when birthday changes
  useEffect(() => {
    if (formData.birthday) {
      const today = new Date()
      const birthDate = new Date(formData.birthday)
      let calculatedAge = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--
      }
      
      setAge(calculatedAge)
    } else {
      setAge(null)
    }
  }, [formData.birthday])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (usernameTimeout) {
        clearTimeout(usernameTimeout)
      }
    }
  }, [usernameTimeout])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    // Clear genderCustom when gender changes to something other than 'others'
    if (field === 'gender' && value !== 'others') {
      setFormData(prev => ({ ...prev, genderCustom: '' }))
      if (errors.genderCustom) {
        setErrors(prev => ({ ...prev, genderCustom: '' }))
      }
    }
  }

  // Check username availability
  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null)
      return
    }

    setUsernameChecking(true)
    try {
      const response = await fetch('/api/user/check-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, userId: user?.id }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setUsernameAvailable(data.available)
        if (!data.available) {
          setErrors(prev => ({ ...prev, username: 'Username is already taken' }))
        } else {
          setErrors(prev => ({ ...prev, username: '' }))
        }
      } else {
        setErrors(prev => ({ ...prev, username: data.error || 'Error checking username' }))
        setUsernameAvailable(false)
      }
    } catch (error) {
      console.error('Error checking username:', error)
      setErrors(prev => ({ ...prev, username: 'Error checking username availability' }))
      setUsernameAvailable(false)
    } finally {
      setUsernameChecking(false)
    }
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1: // Profile Information
        if (!formData.username.trim()) {
          newErrors.username = 'Username is required'
        } else if (formData.username.length < 3) {
          newErrors.username = 'Username must be at least 3 characters'
        } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
          newErrors.username = 'Username can only contain letters, numbers, underscores, and hyphens'
        } else if (usernameAvailable === false) {
          newErrors.username = 'Username is already taken'
        }
        if (!formData.company.trim()) {
          newErrors.company = 'Company is required'
        }
        if (!formData.position.trim()) {
          newErrors.position = 'Position is required'
        }
        if (!formData.gender.trim()) {
          newErrors.gender = 'Gender is required'
        } else if (formData.gender === 'others' && !formData.genderCustom.trim()) {
          newErrors.genderCustom = 'Please specify your gender'
        }
        if (!formData.location.trim()) {
          newErrors.location = 'Location is required'
        }
        if (!formData.phone.trim()) {
          newErrors.phone = 'Phone number is required'
        } else if (!/^[+]?[^\D]?[\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
          newErrors.phone = 'Please enter a valid phone number'
        }
        if (!formData.bio.trim()) {
          newErrors.bio = 'Bio is required'
        } else if (formData.bio.length < 10) {
          newErrors.bio = 'Bio must be at least 10 characters'
        }
        if (!formData.birthday) {
          newErrors.birthday = 'Birthday is required'
        } else {
          const birthDate = new Date(formData.birthday)
          const today = new Date()
          const minAge = 16
          const maxAge = 100
          
          if (birthDate > today) {
            newErrors.birthday = 'Birthday cannot be in the future'
          } else if (age !== null && (age < minAge || age > maxAge)) {
            newErrors.birthday = `Age must be between ${minAge} and ${maxAge} years`
          }
        }
        break
    }

    return newErrors
  }

  const handleNext = () => {
    const stepErrors = validateStep(currentStep)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
      setErrors({})
      
      // Scroll to top of the content area when transitioning to next step
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        }
      }, 100) // Small delay to ensure the new step content is rendered
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setErrors({})
      
      // Scroll to top of the content area when transitioning to previous step
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        }
      }, 100) // Small delay to ensure the new step content is rendered
    }
  }

  const handleSubmit = async () => {
    const stepErrors = validateStep(currentStep)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }

    // Check if user is available
    if (!user?.id) {
      console.error('User not available:', { user, userId: user?.id })
      setErrors({ general: 'User not authenticated. Please refresh the page and try again.' })
      return
    }

    console.log('Submitting recruiter profile completion for user:', user.id)

    setIsLoading(true)

    try {
      // Update user profile with the additional information
      const profileUpdateData = {
        userId: user.id,
        username: formData.username,
        company: formData.company,
        position: formData.position,
        gender: formData.gender,
        gender_custom: formData.gender === 'others' ? formData.genderCustom : null,
        location: formData.location,
        location_place_id: formData.location_place_id,
        location_lat: formData.location_lat,
        location_lng: formData.location_lng,
        location_city: formData.location_city,
        location_province: formData.location_province,
        location_country: formData.location_country,
        location_barangay: formData.location_barangay,
        location_region: formData.location_region,
        phone: formData.phone,
        bio: formData.bio,
        birthday: formData.birthday,
        completed_data: true
      }

      // Update profile in Railway database
      console.log('Sending recruiter profile update:', profileUpdateData)
      const profileResponse = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileUpdateData),
      })

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json().catch(() => ({}))
        const errorMessage = errorData.details || errorData.error || 'Failed to update profile'
        throw new Error(`Failed to update profile: ${profileResponse.status} ${errorMessage}`)
      }

      // Update Supabase metadata
      await updateProfile(profileUpdateData)

      // Add a small delay to ensure database update is complete
      await new Promise(resolve => setTimeout(resolve, 500))
      
      onComplete()
      onOpenChange(false)
      
      // Redirect to /recruiter after successful completion
      if (typeof window !== 'undefined') {
        window.location.href = '/recruiter'
      }
    } catch (error) {
      console.error('Error updating recruiter profile:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile. Please try again.'
      setErrors({ general: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Profile Information
        return (
          <div className="space-y-4 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="e.g., john_doe123"
                    value={formData.username}
                    onChange={(e) => {
                      handleInputChange('username', e.target.value)
                      // Clear previous timeout
                      if (usernameTimeout) {
                        clearTimeout(usernameTimeout)
                      }
                      // Set new timeout for username checking
                      const timeoutId = setTimeout(() => {
                        checkUsernameAvailability(e.target.value)
                      }, 500)
                      setUsernameTimeout(timeoutId)
                    }}
                    className={`pl-10 h-11 !bg-white !text-gray-900 !placeholder:text-gray-500 !border-gray-300 focus:!border-emerald-500 focus:!ring-2 focus:!ring-emerald-500 focus-visible:!border-emerald-500 focus-visible:!ring-2 focus-visible:!ring-emerald-500 ${
                      errors.username ? '!border-red-500 focus:!border-emerald-500 focus-visible:!border-emerald-500' : ''
                    }`}
                  />
                  {usernameChecking && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                  )}
                  {usernameAvailable === true && !usernameChecking && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
                  )}
                  {usernameAvailable === false && !usernameChecking && (
                    <X className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-400" />
                  )}
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">
                    {formData.username.length}/20 characters (minimum 3 required)
                  </span>
                  {usernameAvailable === true && (
                    <span className="text-green-500">✓ Username available</span>
                  )}
                  {usernameAvailable === false && (
                    <span className="text-red-500">✗ Username taken</span>
                  )}
                </div>
                {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
              </div>

              {/* Company field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Company <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="e.g., ABC Corporation"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className={`pl-10 h-11 !bg-white !text-gray-900 !placeholder:text-gray-500 !border-gray-300 focus:!border-emerald-500 focus:!ring-2 focus:!ring-emerald-500 focus-visible:!border-emerald-500 focus-visible:!ring-2 focus-visible:!ring-emerald-500 ${
                      errors.company ? '!border-red-500 focus:!border-emerald-500 focus-visible:!border-emerald-500' : ''
                    }`}
                  />
                </div>
                {errors.company && <p className="text-red-500 text-xs">{errors.company}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Position <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="e.g., HR Manager"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className={`pl-10 h-11 !bg-white !text-gray-900 !placeholder:text-gray-500 !border-gray-300 focus:!border-emerald-500 focus:!ring-2 focus:!ring-emerald-500 focus-visible:!border-emerald-500 focus-visible:!ring-2 focus-visible:!ring-emerald-500 ${
                      errors.position ? '!border-red-500 focus:!border-emerald-500 focus-visible:!border-emerald-500' : ''
                    }`}
                  />
                </div>
                {errors.position && <p className="text-red-500 text-xs">{errors.position}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Gender <span className="text-red-500">*</span>
                </label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger className={`h-11 !bg-white !text-gray-900 !border-gray-300 focus:!border-emerald-500 focus:!ring-2 focus:!ring-emerald-500 focus-visible:!border-emerald-500 focus-visible:!ring-2 focus-visible:!ring-emerald-500 ${
                    errors.gender ? '!border-red-500 focus:!border-emerald-500 focus-visible:!border-emerald-500' : ''
                  }`}>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    <SelectItem value="male" className="text-gray-900 hover:bg-emerald-50 hover:text-emerald-700 focus:bg-emerald-50 focus:text-emerald-700">Male</SelectItem>
                    <SelectItem value="female" className="text-gray-900 hover:bg-emerald-50 hover:text-emerald-700 focus:bg-emerald-50 focus:text-emerald-700">Female</SelectItem>
                    <SelectItem value="others" className="text-gray-900 hover:bg-emerald-50 hover:text-emerald-700 focus:bg-emerald-50 focus:text-emerald-700">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
                
                {/* Custom gender input field */}
                {formData.gender === 'others' && (
                  <div className="mt-2">
                    <Input
                      type="text"
                      placeholder="Please specify your gender"
                      value={formData.genderCustom}
                      onChange={(e) => handleInputChange('genderCustom', e.target.value)}
                      className={`h-10 !bg-white !text-gray-900 !placeholder:text-gray-500 !border-gray-300 focus:!border-emerald-500 focus:!ring-2 focus:!ring-emerald-500 focus-visible:!border-emerald-500 focus-visible:!ring-2 focus-visible:!ring-emerald-500 ${
                        errors.genderCustom ? '!border-red-500 focus:!border-emerald-500 focus-visible:!border-emerald-500' : ''
                      }`}
                    />
                    {errors.genderCustom && <p className="text-red-500 text-xs mt-1">{errors.genderCustom}</p>}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <PlacesAutocomplete
                    value={formData.location}
                    placeholder="Type city, province, municipality, or barangay"
                    onChange={(val) => handleInputChange('location', val)}
                    onSelect={(p) => {
                      handleInputChange('location', p.description)
                      setFormData(prev => ({
                        ...prev,
                        location_place_id: p.place_id,
                        location_lat: p.lat,
                        location_lng: p.lng,
                        location_city: p.city,
                        location_province: p.province,
                        location_country: p.country,
                        location_barangay: p.barangay,
                        location_region: p.region,
                      }))
                    }}
                  />
                </div>
                {errors.location && <p className="text-red-500 text-xs">{errors.location}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="e.g., +63 912 345 6789"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`pl-10 h-11 !bg-white !text-gray-900 !placeholder:text-gray-500 !border-gray-300 focus:!border-emerald-500 focus:!ring-2 focus:!ring-emerald-500 focus-visible:!border-emerald-500 focus-visible:!ring-2 focus-visible:!ring-emerald-500 ${
                      errors.phone ? '!border-red-500 focus:!border-emerald-500 focus-visible:!border-emerald-500' : ''
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">
                  Birthday <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => handleInputChange('birthday', e.target.value)}
                    className={`pl-10 h-11 !bg-white !text-gray-900 !placeholder:text-gray-500 !border-gray-300 focus:!border-emerald-500 focus:!ring-2 focus:!ring-emerald-500 focus-visible:!border-emerald-500 focus-visible:!ring-2 focus-visible:!ring-emerald-500 ${
                      errors.birthday ? '!border-red-500 focus:!border-emerald-500 focus-visible:!border-emerald-500' : ''
                    }`}
                  />
                </div>
                {errors.birthday && <p className="text-red-500 text-xs">{errors.birthday}</p>}
                {age !== null && <p className="text-emerald-600 text-sm">Age: {age} years old</p>}
              </div>
            </div>
            
            {/* Bio field - full width */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Bio <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Textarea
                  placeholder="Tell us about yourself, your experience in recruitment, and your goals..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className={`pl-10 min-h-[100px] !bg-white !text-gray-900 !placeholder:text-gray-500 !border-gray-300 focus:!border-emerald-500 focus:!ring-2 focus:!ring-emerald-500 focus-visible:!border-emerald-500 focus-visible:!ring-2 focus-visible:!ring-emerald-500 resize-none ${
                    errors.bio ? '!border-red-500 focus:!border-emerald-500 focus-visible:!border-emerald-500' : ''
                  }`}
                />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">
                  {formData.bio.length}/500 characters (minimum 10 required)
                </span>
                {formData.bio.length < 10 && formData.bio.length > 0 && (
                  <span className="text-red-500">
                    At least 10 characters required
                  </span>
                )}
              </div>
              {errors.bio && <p className="text-red-500 text-xs">{errors.bio}</p>}
            </div>
          </div>
        )

      case 2: // Confirmation
        return (
          <div className="space-y-6 pb-6">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-emerald-600" />
                Profile Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Username:</span>
                  <span className="text-gray-900 ml-2">{formData.username || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Company:</span>
                  <span className="text-gray-900 ml-2">{formData.company || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Position:</span>
                  <span className="text-gray-900 ml-2">{formData.position || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Gender:</span>
                  <span className="text-gray-900 ml-2">
                    {formData.gender === 'others' && formData.genderCustom 
                      ? formData.genderCustom 
                      : formData.gender || 'Not specified'
                    }
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Location:</span>
                  <span className="text-gray-900 ml-2">{formData.location || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <span className="text-gray-900 ml-2">{formData.phone || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Birthday:</span>
                  <span className="text-gray-900 ml-2">{formData.birthday || 'Not specified'}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-600">Bio:</span>
                  <p className="text-gray-900 mt-1">{formData.bio || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="bg-white border-gray-200 !max-w-[60vw] w-full mx-4 sm:mx-auto h-[700px] overflow-hidden flex flex-col shadow-xl" showCloseButton={false} onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader className="text-center space-y-3 pb-4 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Complete Your Recruiter Profile
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Help us personalize your recruiter experience by providing some additional information
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 flex-shrink-0">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                    isCompleted 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : isActive 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <span className={`text-xs mt-2 transition-all duration-200 ${
                    isActive ? 'text-emerald-600 font-medium' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-24 h-0.5 mx-4 mt-6 transition-all duration-200 ${
                    isCompleted ? 'bg-emerald-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Step Content */}
        <div ref={scrollContainerRef} className="flex-1 min-h-0 flex flex-col px-6 overflow-y-auto profile-modal-scroll">
          {/* Step Description */}
          <div className="text-center mb-6 flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {currentStep === 1 
                ? 'Additional Profile Information' 
                : 'Confirm Your Information'
              }
            </h3>
            <p className="text-sm text-gray-600">
              {currentStep === 1 
                ? 'Please provide your basic profile details to complete your recruiter profile'
                : 'Please review and confirm all your information before submitting'
              }
            </p>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex-shrink-0 px-6 pt-4 border-t border-gray-200">
          {/* Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm text-center">{errors.general}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isLoading}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </div>

            {currentStep === steps.length ? (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit & Complete
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Mail, 
  MapPin, 
  Save, 
  Loader2,
  Camera,
  Phone,
  Calendar,
  Briefcase
} from 'lucide-react'

interface EditProfileProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditProfile({ open, onOpenChange }: EditProfileProps) {
  const { user, updateProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    location: '',
    jobTitle: '',
    company: '',
    dateOfBirth: ''
  })

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user && open) {
      const metadata = user.user_metadata || {}
      setProfileData({
        firstName: metadata.first_name || '',
        lastName: metadata.last_name || '',
        email: user.email || '',
        phone: metadata.phone || '',
        position: metadata.position || '',
        location: metadata.location || '',
        jobTitle: metadata.job_title || '',
        company: metadata.company || '',
        dateOfBirth: metadata.date_of_birth || ''
      })
    }
  }, [user, open])

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (profileData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(profileData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage('')
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)

    try {
      // Update user metadata
      const { error } = await updateProfile({
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        full_name: `${profileData.firstName} ${profileData.lastName}`,
        phone: profileData.phone,
        position: profileData.position,
        location: profileData.location,
        job_title: profileData.jobTitle,
        company: profileData.company,
        date_of_birth: profileData.dateOfBirth
      })

      if (error) {
        setErrors({ general: error.message })
      } else {
        setSuccessMessage('Profile updated successfully!')
        
        // Close dialog after short delay
        setTimeout(() => {
          onOpenChange(false)
          setSuccessMessage('')
        }, 2000)
      }
    } catch (error) {
      console.error('Profile update error:', error)
      setErrors({ general: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const getUserInitials = () => {
    if (profileData.firstName && profileData.lastName) {
      return `${profileData.firstName[0]}${profileData.lastName[0]}`.toUpperCase()
    }
    return user?.email?.slice(0, 2).toUpperCase() || 'U'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/20 max-w-2xl w-full mx-4 sm:mx-auto max-h-[95vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Header */}
          <DialogHeader className="text-center space-y-3">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-black">
                    {getUserInitials()}
                  </span>
                </div>
                <button 
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                  title="Change avatar"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold gradient-text">
              Edit Profile
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Update your personal information and preferences
            </DialogDescription>
          </DialogHeader>

          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/10 border border-green-500/20 rounded-lg p-4"
            >
              <p className="text-green-400 text-sm text-center">{successMessage}</p>
            </motion.div>
          )}

          {/* General Error Display */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
            >
              <p className="text-red-400 text-sm text-center">{errors.general}</p>
            </motion.div>
          )}

          {/* Edit Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2 flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                Basic Information
              </h3>
              
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-semibold text-white block flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                    First Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`pl-10 h-12 bg-white/10 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/15 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-200 ${
                        errors.firstName ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-400 text-xs">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-semibold text-white block flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                    Last Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`pl-10 h-12 bg-white/10 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/15 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-200 ${
                        errors.lastName ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-400 text-xs">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-white block flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-10 h-12 bg-white/10 border-white/30 text-white placeholder:text-gray-300 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-200 ${
                      errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
                    }`}
                    disabled={true} // Email usually can't be changed
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs">{errors.email}</p>
                )}
                <p className="text-xs text-gray-400">Email cannot be changed. Contact support if needed.</p>
              </div>

              {/* Phone and Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-semibold text-white block flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+63 912 345 6789"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`pl-10 h-12 bg-white/10 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/15 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-200 ${
                        errors.phone ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-400 text-xs">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="position" className="text-sm font-semibold text-white block flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                    Position
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="position"
                      type="text"
                      placeholder="e.g., Software Engineer, Customer Service Rep"
                      value={profileData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className="pl-10 h-12 bg-white/10 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/15 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-200"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-semibold text-white block flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="location"
                    type="text"
                    placeholder="e.g., Clark, Pampanga, Metro Manila"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="pl-10 h-12 bg-white/10 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/15 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Professional Information */}
            <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-cyan-400" />
                Professional Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="jobTitle" className="text-sm font-semibold text-white block flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                    Job Title
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="jobTitle"
                      type="text"
                      placeholder="e.g., Customer Service Representative, Team Lead"
                      value={profileData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      className="pl-10 h-12 bg-white/10 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/15 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-200"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-semibold text-white block flex items-center gap-2">
                    <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                    Company
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="company"
                      type="text"
                      placeholder="e.g., Accenture, Amazon, Google"
                      value={profileData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="pl-10 h-12 bg-white/10 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/15 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-200"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="dateOfBirth" className="text-sm font-semibold text-white block flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="pl-10 h-12 bg-white/10 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/15 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-white/20 text-white hover:bg-white/10"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white border-0"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
} 
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
  UserPlus, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2,
  Chrome,
  User,
  CheckCircle,
  ArrowLeft,
  FileText
} from 'lucide-react'

interface SignUpFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToLogin?: () => void
}

export default function SignUpForm({ open, onOpenChange, onSwitchToLogin }: SignUpFormProps) {
  const { signUp, signInWithGoogle, signOut } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Set signup flag when component mounts to prevent immediate stepper modal
  useEffect(() => {
    if (open) {
      console.log('🚫 SignUpForm: Setting justSignedUp flag to prevent stepper modal')
      sessionStorage.setItem('justSignedUp', 'true')
    }
  }, [open])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [termsLocked, setTermsLocked] = useState(false)
  const [hasReadTerms, setHasReadTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showTermsContent, setShowTermsContent] = useState(false)
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false)

  // Set signup flag when modal opens
  useEffect(() => {
    if (open) {
      sessionStorage.setItem('justSignedUp', 'true')
      sessionStorage.removeItem('hasSignedIn')
      console.log('🚫 SignUpForm: Set justSignedUp flag when modal opened')
    }
  }, [open])

  // Check if terms were accepted from the terms page
  useEffect(() => {
    const termsAccepted = sessionStorage.getItem('termsAccepted')
    const termsLocked = sessionStorage.getItem('termsLocked')
    const hasReadTerms = sessionStorage.getItem('hasReadTerms')
    
    if (termsAccepted === 'true') {
      setAgreedToTerms(true)
      sessionStorage.removeItem('termsAccepted') // Clean up
    }
    
    if (termsLocked === 'true') {
      setAgreedToTerms(true)
      setTermsLocked(true)
      setHasReadTerms(true)
      sessionStorage.removeItem('termsLocked') // Clean up
    }

    // Only set hasReadTerms to true if terms were locked (meaning they completed reading)
    // Otherwise, reset it to false to allow the error message to work
    if (termsLocked === 'true') {
      setHasReadTerms(true)
    } else {
      setHasReadTerms(false)
      sessionStorage.removeItem('hasReadTerms') // Clear it so error message can show
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleTermsCheckboxClick = () => {
    if (termsLocked) return // Don't allow changes if locked
    
    if (!hasReadTerms) {
      setErrors(prev => ({ ...prev, terms: 'Please read the Terms and Conditions first before agreeing' }))
      return
    }
    
    setAgreedToTerms(!agreedToTerms)
    // Clear any existing terms error
    if (errors.terms) {
      setErrors(prev => ({ ...prev, terms: '' }))
    }
  }

  const handleTermsCheckboxChange = () => {
    // This prevents the checkbox from being checked if terms haven't been read
    if (!hasReadTerms) {
      setErrors(prev => ({ ...prev, terms: 'Please read the Terms and Conditions first before agreeing' }))
      return
    }
    
    // Only allow checkbox to be checked if terms have been read
    if (termsLocked) return // Don't allow changes if locked
    
    setAgreedToTerms(!agreedToTerms)
    // Clear any existing terms error
    if (errors.terms) {
      setErrors(prev => ({ ...prev, terms: '' }))
    }
  }

  const handleTermsLinkClick = () => {
    setShowTermsContent(true)
    setHasReadTerms(true)
    setHasScrolledToEnd(false) // Reset scroll state when opening terms
    sessionStorage.setItem('hasReadTerms', 'true')
    // Clear any existing terms error when they click to read terms
    if (errors.terms) {
      setErrors(prev => ({ ...prev, terms: '' }))
    }
  }


  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }



    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)

    try {
      // 1) Check if email already exists in our DB first
      const existsRes = await fetch(`/api/public/users/exists?email=${encodeURIComponent(formData.email)}`)
      if (existsRes.ok) {
        const { exists } = await existsRes.json()
        if (exists) {
          setErrors({ general: 'An account with this email already exists. Please sign in instead.' })
          setIsLoading(false)
          return
        }
      }

      // 2) Proceed with Supabase registration
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          full_name: `${formData.firstName} ${formData.lastName}`
        }
      )
      
      if (error) {
        if (error.message.includes('User already registered')) {
          setErrors({ general: 'An account with this email already exists. Please sign in instead.' })
        } else if (error.message.includes('Password should be at least 6 characters')) {
          setErrors({ password: 'Password should be at least 6 characters long.' })
        } else {
          setErrors({ general: error.message })
        }
      } else if (data.user) {
        // 3) Sync user to database
        try {
          console.log('🔄 Syncing user to database:', data.user.email)
          
          const syncResponse = await fetch('/api/user/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: data.user.id,
              email: data.user.email,
              first_name: formData.firstName,
              last_name: formData.lastName,
              full_name: `${formData.firstName} ${formData.lastName}`,
              location: '',
              avatar_url: null,
              phone: '',
              bio: '',
              position: '',
              company: '',
              completed_data: false,
              birthday: null,
              gender: null,
              admin_level: 'user'
            })
          })

          if (syncResponse.ok) {
            console.log('✅ User synced to database successfully')
          } else {
            console.error('❌ Failed to sync user to database:', syncResponse.status)
          }
        } catch (syncError) {
          console.error('❌ Error syncing user to database:', syncError)
        }

        // Successful registration
        console.log('Registration successful:', data.user.email)
        
        // Set flag to indicate user just signed up (not signed in yet)
        sessionStorage.setItem('justSignedUp', 'true')
        sessionStorage.removeItem('googleOAuthFlow')
        sessionStorage.removeItem('hasSignedIn')
        
        // Sign out the user so they need to sign in manually
        try {
          await signOut()
          console.log('✅ User signed out after registration, must sign in manually')
        } catch (signOutError) {
          console.error('Error during sign out after registration:', signOutError)
        }
        
        // Close the signup modal
        onOpenChange(false)
        
        // Don't dispatch userSignedIn event - user needs to sign in manually
      }
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ general: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignUp = async () => {
    try {
      setIsLoading(true)
      
      // For sign-up flow, redirect to Google OAuth with a signup flag
      console.log('🔄 Starting Google OAuth sign-up flow')
      
      // Set a flag in sessionStorage to indicate this is a sign-up flow
      sessionStorage.setItem('googleOAuthFlow', 'signup')
      
      // Close the sign-up modal
      onOpenChange(false)
      
      // Start Google OAuth flow
      const { error } = await signInWithGoogle()
      
      if (error) {
        console.error('Google sign up error:', error)
        setErrors({ general: 'Failed to sign up with Google. Please try again.' })
        // Clear the flag on error
        sessionStorage.removeItem('googleOAuthFlow')
      }
      // Note: On success, user will be redirected to callback URL
      
    } catch (error) {
      console.error('Google sign up error:', error)
      setErrors({ general: 'An error occurred during Google sign up.' })
      // Clear the flag on error
      sessionStorage.removeItem('googleOAuthFlow')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwitchToLogin = () => {
    // Reset form state
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    setShowPassword(false)
    setShowConfirmPassword(false)
    setAgreedToTerms(false)
    setHasReadTerms(false)
    setTermsLocked(false)
    setErrors({})
    setIsLoading(false)
    
    // Clear session storage
    sessionStorage.removeItem('hasReadTerms')
    sessionStorage.removeItem('termsAccepted')
    sessionStorage.removeItem('termsLocked')
    
    // Switch to login form
    if (onSwitchToLogin) {
      onSwitchToLogin()
    }
  }


  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glass-card border-white/20 max-w-lg w-full mx-4 sm:mx-auto max-h-[95vh] overflow-y-auto [&>div[data-slot=dialog-overlay]]:bg-black/80 [&>div[data-slot=dialog-overlay]]:backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-right-1/2 data-[state=open]:slide-in-from-right-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%] duration-200">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30,
              duration: 0.3
            }}
            className="space-y-6"
          >
            {/* Header */}
            <DialogHeader className="text-center space-y-3">
              <DialogTitle className="text-2xl sm:text-3xl font-bold gradient-text flex items-center justify-center gap-3">
                {showTermsContent ? (
                  <>
                    <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
                    Terms and Conditions
                  </>
                ) : (
                  <>
                    <UserPlus className="w-6 h-6 sm:w-8 sm:h-8" />
                    Join BPOC.IO
                  </>
                )}
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-sm sm:text-base">
                {showTermsContent 
                  ? "Please read and understand our terms before joining"
                  : "Start your BPO career journey with our FREE platform"
                }
              </DialogDescription>
            </DialogHeader>


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

            {/* Back Button for Terms */}

            {/* Conditional Content */}
            {showTermsContent ? (
              <>
                <TermsContent onScrollToEnd={() => {
                  setHasScrolledToEnd(true)
                  // Automatically accept terms and close modal when user reaches the end
                  setAgreedToTerms(true)
                  setTermsLocked(true)
                  setShowTermsContent(false)
                  // Clear any existing terms error
                  if (errors.terms) {
                    setErrors(prev => ({ ...prev, terms: '' }))
                  }
                }} />
                {!hasScrolledToEnd && (
                  <div className="text-center py-2">
                    <p className="text-xs text-gray-500 italic">
                      Please scroll to the end to continue
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-white block">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`pl-10 h-11 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all duration-200 ${
                        errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                      }`}
                      disabled={isLoading}
                      autoComplete="off"
                    />
                  </div>
                  {errors.firstName && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs"
                    >
                      {errors.firstName}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-white block">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`pl-10 h-11 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all duration-200 ${
                        errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                      }`}
                      disabled={isLoading}
                      autoComplete="off"
                    />
                  </div>
                  {errors.lastName && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs"
                    >
                      {errors.lastName}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="signup-email" className="text-sm font-medium text-white block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-10 h-11 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all duration-200 ${
                      errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                    }`}
                    disabled={isLoading}
                    autoComplete="off"
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>







              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="signup-password" className="text-sm font-medium text-white block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`pl-10 pr-10 h-11 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all duration-200 ${
                        errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                      }`}
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black rounded"
                      disabled={isLoading}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-white block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`pl-10 pr-10 h-11 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all duration-200 ${
                        errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                      }`}
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black rounded"
                      disabled={isLoading}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs"
                    >
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-2">
                {/* Note about reading terms first */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-xl p-4 mb-4 shadow-lg shadow-cyan-500/5">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-cyan-300 font-semibold text-sm">📋 First Step Required</span>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Please read the <span className="text-cyan-400 font-medium">Terms and Conditions</span> before proceeding with your account creation.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <button
                    type="button"
                    onClick={handleTermsCheckboxChange}
                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black ${
                      agreedToTerms 
                        ? 'bg-cyan-500 border-cyan-500' 
                        : 'border-white/20 hover:border-cyan-500'
                    } ${errors.terms ? 'border-red-500' : ''} ${termsLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                    disabled={isLoading || termsLocked}
                    aria-label="Agree to terms and conditions"
                  >
                    {agreedToTerms && <CheckCircle className="w-3 h-3 text-white" />}
                  </button>
                  <label className="text-sm text-gray-300 leading-relaxed">
                    I agree to the{' '}
                    <button
                      type="button"
                      className="text-cyan-400 hover:text-cyan-300 underline transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black rounded"
                      onClick={handleTermsLinkClick}
                    >
                      Terms and Conditions
                    </button>
                    {termsLocked && (
                      <span className="ml-2 text-xs text-green-400 font-medium">
                        ✓ Terms reviewed and accepted
                      </span>
                    )}
                  </label>
                </div>
                {errors.terms && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs"
                  >
                    {errors.terms}
                  </motion.p>
                )}
              </div>

              {/* Create Account Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 h-12 font-medium transition-all duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50"
                disabled={isLoading || !agreedToTerms}
                                 title={!agreedToTerms ? 'You must agree to the Terms and Conditions' : undefined}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Free Account
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <Separator className="bg-white/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white/5 backdrop-blur-sm px-3 text-sm text-gray-300 border border-white/10 rounded-md">Or continue with</span>
              </div>
            </div>

            {/* Social Sign Up Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSocialSignUp}
              disabled={isLoading || !agreedToTerms}
              title={!agreedToTerms ? 'You must agree to the Terms and Conditions first' : undefined}
            >
              <Chrome className="w-4 h-4 mr-2" />
              Sign up with Google
            </Button>

            {/* Sign In Link */}
            <div className="text-center text-sm text-gray-300 pt-2">
              Already have an account?{' '}
              <button
                type="button"
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors underline focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black rounded"
                onClick={handleSwitchToLogin}
              >
                Sign in
              </button>
            </div>
              </>
            )}
          </motion.div>
        </DialogContent>
      </Dialog>

    </>
  )
}

// Terms Content Component
function TermsContent({ onScrollToEnd }: { onScrollToEnd: () => void }) {
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1
    
    if (isAtBottom) {
      onScrollToEnd()
    }
  }

  return (
    <div 
      className="max-h-[60vh] overflow-y-auto space-y-6 text-sm terms-modal-scroll"
      onScroll={handleScroll}
    >
      {/* Platform Information */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Platform Information</h3>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2 text-gray-300">
              <div><strong className="text-gray-300">Platform:</strong> <span className="text-gray-100">BPOC.IO</span></div>
              <div><strong className="text-gray-300">Operated By:</strong> <span className="text-gray-100">ShoreAgents Inc.</span></div>
              <div><strong className="text-gray-300">Registration:</strong> <span className="text-gray-100">SEC CS201918140 | TIN 010-425-223-00000</span></div>
              <div><strong className="text-gray-300">Phone:</strong> <span className="text-gray-100">+63 917 702 0676</span></div>
            </div>
            <div className="space-y-2 text-gray-300">
              <div><strong className="text-gray-300">Email:</strong> <span className="text-gray-100">careers@shoreagents.com</span></div>
              <div><strong className="text-gray-300">Website:</strong> <span className="text-gray-100">https://shoreagents.com</span></div>
              <div><strong className="text-gray-300">Careers Website:</strong> <span className="text-gray-100">https://careers.shoreagents.com</span></div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div><strong className="text-gray-300">Address:</strong> <span className="text-gray-100">Business Center 26, Philexcel Business Park, Ma Roxas Highway, Clark Freeport, 2023 Pampanga</span></div>
          </div>
        </div>
      </div>

      {/* About BPOC.IO */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">About BPOC.IO</h3>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <p className="text-gray-300 mb-3">BPOC.IO is ShoreAgents Inc.'s recruitment and assessment platform designed to:</p>
          <ul className="space-y-1 text-gray-300">
            <li>• <strong className="text-white">Streamline hiring</strong> for positions within ShoreAgents organization</li>
            <li>• <strong className="text-white">Evaluate candidate qualifications</strong> through AI-powered assessments and interactive tools</li>
            <li>• <strong className="text-white">Match talent</strong> with appropriate roles in our company</li>
            <li>• <strong className="text-white">Provide career development</strong> insights and professional growth opportunities</li>
            <li>• <strong className="text-white">Optimize recruitment efficiency</strong> through automated screening and evaluation</li>
          </ul>
          <div className="mt-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
            <p className="text-gray-200 font-semibold text-sm">By using BPOC.IO, you are applying for potential employment with ShoreAgents Inc.</p>
          </div>
        </div>
      </div>

      {/* Acceptance of Terms */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Acceptance of Terms</h3>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="mb-4">
            <h4 className="text-base font-semibold text-white mb-2">Agreement to Terms</h4>
            <p className="text-gray-300 text-xs">By accessing, registering for, or using BPOC.IO, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use, along with our Privacy Policy.</p>
          </div>
          
          <div className="mb-4">
            <h4 className="text-base font-semibold text-white mb-2">Capacity to Agree</h4>
            <p className="text-gray-300 text-xs mb-2">You represent and warrant that:</p>
            <ul className="space-y-1 text-gray-300 text-xs">
              <li>• You are <strong className="text-white">18 years of age or older</strong></li>
              <li>• You have the <strong className="text-white">legal capacity</strong> to enter into this agreement</li>
              <li>• You are <strong className="text-white">legally eligible for employment</strong> in the Philippines</li>
              <li>• All information you provide is <strong className="text-white">accurate and complete</strong></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-white mb-2">Updates to Terms</h4>
            <p className="text-gray-300 text-xs">We reserve the right to modify these Terms of Use at any time. Material changes will be communicated via email and platform notifications with 30 days advance notice.</p>
          </div>
        </div>
      </div>

      {/* User Account & Registration */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">User Account & Registration</h3>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="mb-4">
            <h4 className="text-base font-semibold text-white mb-2">Account Creation</h4>
            <ul className="space-y-1 text-gray-300 text-xs">
              <li>• You must provide <strong className="text-white">accurate, current, and complete information</strong> during registration</li>
              <li>• You are responsible for <strong className="text-white">maintaining the confidentiality</strong> of your account credentials</li>
              <li>• You must <strong className="text-white">promptly update</strong> any changes to your personal or professional information</li>
              <li>• <strong className="text-white">One account per person</strong> - multiple accounts are not permitted</li>
            </ul>
          </div>

          <div className="mb-4">
            <h4 className="text-base font-semibold text-white mb-2">Account Security</h4>
            <ul className="space-y-1 text-gray-300 text-xs">
              <li>• You are <strong className="text-white">solely responsible</strong> for all activities under your account</li>
              <li>• <strong className="text-white">Immediately notify us</strong> of any unauthorized access or security breaches</li>
              <li>• We reserve the right to <strong className="text-white">suspend or terminate accounts</strong> that show signs of unauthorized access</li>
              <li>• <strong className="text-white">Do not share</strong> your login credentials with anyone</li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-white mb-2">Account Verification</h4>
            <ul className="space-y-1 text-gray-300 text-xs">
              <li>• We may require <strong className="text-white">identity verification</strong> for certain platform features</li>
              <li>• <strong className="text-white">False or misleading information</strong> may result in immediate account termination</li>
              <li>• <strong className="text-white">Professional references</strong> may be contacted as part of the verification process</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Acceptable Use Policy */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Acceptable Use Policy</h3>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="mb-4">
            <h4 className="text-base font-semibold text-white mb-2">Permitted Uses</h4>
            <p className="text-gray-300 text-xs mb-2">You may use BPOC.IO to:</p>
            <div className="bg-green-600/20 p-3 rounded-lg border border-green-500/30">
              <ul className="space-y-1 text-green-300 text-xs">
                <li>✅ Complete job applications for ShoreAgents positions</li>
                <li>✅ Take skills assessments and career evaluations honestly</li>
                <li>✅ Communicate with ShoreAgents recruitment team</li>
                <li>✅ Access your assessment results and feedback</li>
                <li>✅ Update your profile and employment preferences</li>
                <li>✅ Participate in career development activities offered</li>
              </ul>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-base font-semibold text-white mb-2">Prohibited Activities</h4>
            <p className="text-gray-300 text-xs mb-2">You agree <strong className="text-white">NOT</strong> to:</p>
            <div className="bg-red-600/20 p-3 rounded-lg border border-red-500/30">
              <ul className="space-y-1 text-red-300 text-xs">
                <li>❌ Provide false, misleading, or incomplete information</li>
                <li>❌ Create multiple accounts or impersonate others</li>
                <li>❌ Share your account access with third parties</li>
                <li>❌ Use automated tools, bots, or scripts for assessments</li>
                <li>❌ Attempt to hack, disrupt, or compromise platform security</li>
                <li>❌ Copy, reproduce, or distribute platform content without permission</li>
                <li>❌ Harass, abuse, or threaten other users or ShoreAgents personnel</li>
                <li>❌ Use the platform for any purpose other than employment with ShoreAgents</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold text-white mb-2">Consequences of Violations</h4>
            <p className="text-gray-300 text-xs mb-2">Violations may result in:</p>
            <ul className="space-y-1 text-gray-300 text-xs">
              <li>• <strong className="text-white">Immediate account suspension</strong> or termination</li>
              <li>• <strong className="text-white">Disqualification</strong> from current and future ShoreAgents opportunities</li>
              <li>• <strong className="text-white">Legal action</strong> for serious violations or damage to our systems</li>
              <li>• <strong className="text-white">Reporting to authorities</strong> if illegal activity is suspected</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Platform Features & Assessments */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Platform Features & Assessments</h3>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="mb-4">
            <h4 className="text-base font-semibold text-white mb-2">Skills Assessments</h4>
            <ul className="space-y-1 text-gray-300 text-xs">
              <li>• All assessments must be completed <strong className="text-white">independently and honestly</strong></li>
              <li>• <strong className="text-white">No assistance</strong> from others, online resources, or automated tools is permitted</li>
              <li>• Assessment results become part of your <strong className="text-white">employment evaluation</strong></li>
              <li>• We reserve the right to <strong className="text-white">re-test</strong> if irregularities are detected</li>
            </ul>
          </div>

          <div className="mb-4">
            <h4 className="text-base font-semibold text-white mb-2">Career Games & Evaluations</h4>
            <ul className="space-y-1 text-gray-300 text-xs">
              <li>• Interactive games are designed to <strong className="text-white">assess job-relevant skills</strong></li>
              <li>• Your performance data will be <strong className="text-white">analyzed using AI technology</strong></li>
              <li>• Game results contribute to your <strong className="text-white">overall candidate scoring</strong></li>
              <li>• <strong className="text-white">Fair play</strong> is required - cheating will result in disqualification</li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-white mb-2">AI-Powered Analysis</h4>
            <ul className="space-y-1 text-gray-300 text-xs">
              <li>• Your resume and responses may be <strong className="text-white">analyzed by artificial intelligence</strong></li>
              <li>• AI insights are used to <strong className="text-white">match your skills</strong> with suitable positions</li>
              <li>• <strong className="text-white">Assessment scores</strong> are generated through automated evaluation</li>
              <li>• AI recommendations supplement but <strong className="text-white">do not replace</strong> human hiring decisions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Employment Relationship */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Employment Relationship</h3>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="mb-4">
            <h4 className="text-base font-semibold text-white mb-2">No Guarantee of Employment</h4>
            <ul className="space-y-1 text-gray-300 text-xs">
              <li>• Platform use <strong className="text-white">does not guarantee</strong> job interviews or employment offers</li>
              <li>• All hiring decisions are <strong className="text-white">at ShoreAgents' sole discretion</strong></li>
              <li>• Employment offers are subject to <strong className="text-white">additional requirements</strong> (background checks, references, etc.)</li>
              <li>• We reserve the right to <strong className="text-white">modify or cancel</strong> job openings at any time</li>
            </ul>
          </div>

          <div className="mb-4">
            <h4 className="text-base font-semibold text-white mb-2">At-Will Employment</h4>
            <ul className="space-y-1 text-gray-300 text-xs">
              <li>• Any employment relationship will be <strong className="text-white">at-will</strong>, meaning either party may terminate at any time</li>
              <li>• Platform use does <strong className="text-white">not create any employment contract</strong> or guarantee of continued employment</li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-white mb-2">Equal Opportunity</h4>
            <ul className="space-y-1 text-gray-300 text-xs">
              <li>• ShoreAgents is an <strong className="text-white">equal opportunity employer</strong></li>
              <li>• We do not discriminate based on race, religion, gender, age, disability, or other protected characteristics</li>
              <li>• All candidates are evaluated based on <strong className="text-white">qualifications and merit</strong></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-base font-semibold text-white mb-2">Platform Support</h4>
              <div className="space-y-3 text-gray-300 text-xs">
                <div>
                  <div><strong>Recruitment Team</strong></div>
                  <div>recruitment@shoreagents.com</div>
                </div>
                <div>
                  <div><strong>Careers Team</strong></div>
                  <div>careers@shoreagents.com</div>
                </div>
                <div>
                  <div><strong>IT Support</strong></div>
                  <div>it@shoreagents.com</div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-base font-semibold text-white mb-2">Business Information</h4>
              <div className="space-y-1 text-gray-300 text-xs">
                <div><strong>Phone:</strong> +63 917 702 0676</div>
                <div><strong>Business Hours:</strong> Monday-Friday, 6am to 3pm (Philippine Time)</div>
                <div><strong>SEC Registration:</strong> CS201918140</div>
                <div><strong>TIN:</strong> 010-425-223-00000</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acknowledgment & Agreement */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Acknowledgment & Agreement</h3>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <p className="text-gray-300 mb-3 font-semibold text-sm">By using BPOC.IO, you acknowledge that:</p>
          <ul className="space-y-1 text-gray-300 text-xs">
            <li>1. You have <strong className="text-white">read and understood</strong> these Terms of Use in their entirety</li>
            <li>2. You <strong className="text-white">agree to be bound</strong> by all terms and conditions stated herein</li>
            <li>3. You understand this is a <strong className="text-white">recruitment platform for ShoreAgents employment</strong></li>
            <li>4. You will <strong className="text-white">comply with all acceptable use policies</strong> and platform rules</li>
            <li>5. You <strong className="text-white">consent to data collection and processing</strong> as outlined in our Privacy Policy</li>
            <li>6. You meet all <strong className="text-white">age and legal eligibility requirements</strong></li>
            <li>7. You will provide <strong className="text-white">accurate and truthful information</strong> at all times</li>
            <li>8. You understand <strong className="text-white">platform use does not guarantee employment</strong></li>
          </ul>
          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-gray-300 font-semibold text-xs">Your continued use of BPOC.IO constitutes ongoing acceptance of these Terms of Use.</p>
          </div>
        </div>
      </div>

      {/* Document Information */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Document Information</h3>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2 text-gray-300 text-xs">
              <div><strong className="text-gray-300">Document Title:</strong> <span className="text-gray-100">BPOC.IO Terms of Use</span></div>
              <div><strong className="text-gray-300">Version:</strong> <span className="text-gray-100">1.0</span></div>
              <div><strong className="text-gray-300">Effective Date:</strong> <span className="text-gray-100">August 28, 2025</span></div>
            </div>
            <div className="space-y-2 text-gray-300 text-xs">
              <div><strong className="text-gray-300">Last Modified:</strong> <span className="text-gray-100">August 28, 2025</span></div>
              <div><strong className="text-gray-300">Next Review Date:</strong> <span className="text-gray-100">February 28, 2026</span></div>
              <div><strong className="text-gray-300">Approved By:</strong> <span className="text-gray-100">Stephen Philip Atcheler, Managing Director</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 border-t border-gray-700">
        <p className="text-gray-400 italic text-xs mb-1">These Terms of Use are binding and enforceable. By using BPOC.IO, you accept all terms and conditions outlined above.</p>
        <p className="text-gray-500 font-semibold text-xs">© 2025 ShoreAgents Inc. All rights reserved.</p>
      </div>
    </div>
  )
} 
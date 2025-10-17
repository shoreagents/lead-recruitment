'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  Building2,
  FileText,
  ArrowLeft
} from 'lucide-react'

interface RecruiterSignUpFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToLogin?: () => void
}

export default function RecruiterSignUpForm({ open, onOpenChange, onSwitchToLogin }: RecruiterSignUpFormProps) {
  const { signInWithGoogle, signUp } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [termsLocked, setTermsLocked] = useState(false)
  const [hasReadTerms, setHasReadTerms] = useState(false)
  const [showTermsContent, setShowTermsContent] = useState(false)
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
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
    console.log('Form submitted with data:', formData)
    setErrors({})
    setSuccessMessage('')
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      console.log('Validation errors:', validationErrors)
      setErrors(validationErrors)
      return
    }

    console.log('Starting signup process...')
    setIsLoading(true)
    
    // Set flag to indicate this is a recruiter sign-up flow
    sessionStorage.setItem('recruiterSignupFlow', 'true')

    try {
      // 1) Check if email already exists in user_recruiter table
      const existsRes = await fetch(`/api/recruiter/signup?email=${encodeURIComponent(formData.email)}`)
      if (existsRes.ok) {
        const { exists } = await existsRes.json()
        if (exists) {
          setErrors({ general: 'An account with this email already exists. Please sign in instead.' })
          setIsLoading(false)
          return
        }
      }

      // 2) Proceed with Supabase registration using AuthContext
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          full_name: `${formData.firstName} ${formData.lastName}`,
          admin_level: 'recruiter'
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
        // 3) Create recruiter in users table with admin_level = 'recruiter'
        try {
          console.log('🔄 Creating recruiter in database with data:', {
            id: data.user.id,
            email: data.user.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
            location: 'Not specified',
            completed_data: false
          })

          const recruiterResponse = await fetch('/api/recruiter/signup', {
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
              location: 'Not specified',
              completed_data: false
            })
          })

          const recruiterResult = await recruiterResponse.json()
          console.log('📋 Recruiter API response:', recruiterResult)

          if (!recruiterResponse.ok) {
            console.error('❌ Failed to create recruiter in database:', recruiterResult)
            const errorMessage = recruiterResult.details || recruiterResult.error || 'Unknown error'
            setErrors({ general: `Failed to create recruiter account: ${errorMessage}` })
            setIsLoading(false)
            return
          }

          console.log('✅ Recruiter created successfully in database')
          
          // Add a small delay to ensure the database operation completes
          await new Promise(resolve => setTimeout(resolve, 500))
          
        } catch (recruiterError) {
          console.error('❌ Error creating recruiter:', recruiterError)
          setErrors({ general: 'Failed to create recruiter account. Please try again.' })
          setIsLoading(false)
          return
        }

        setSuccessMessage('Recruiter account created successfully! Please sign in to continue.')
        
        // Close the sign up modal and show sign in modal
        setTimeout(() => {
          onOpenChange(false)
          if (onSwitchToLogin) {
            onSwitchToLogin()
          }
        }, 2000) // Give user time to read the success message
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
    setErrors({})
    setSuccessMessage('')
    setIsLoading(false)
    
    // Switch to login form
    if (onSwitchToLogin) {
      onSwitchToLogin()
    }
  }


  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md bg-white border-gray-200 shadow-xl" data-recruiter-modal="true">
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
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-gray-900">
                {showTermsContent && (
                  <button
                    onClick={() => setShowTermsContent(false)}
                    className="mr-2 hover:bg-gray-100 rounded-full p-1 transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                  </button>
                )}
                <Building2 className="h-5 w-5 text-emerald-600" />
                {showTermsContent ? 'Terms and Conditions' : 'Create Recruiter Account'}
              </DialogTitle>
              {!showTermsContent && (
                <DialogDescription className="text-gray-600">
                  Join our platform and start finding the best talent
                </DialogDescription>
              )}
            </DialogHeader>

            {/* Show Terms Content or Form */}
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
                {/* Success Message */}
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-600 text-sm text-center">{successMessage}</p>
                  </div>
                )}

                {/* General Error Display */}
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm text-center">{errors.general}</p>
                  </div>
                )}

                <div className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-1">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white text-gray-900 placeholder-gray-500  ${
                        errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      disabled={isLoading}
                      autoComplete="off"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-1">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      required
                      placeholder="Smith"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white text-gray-900 placeholder-gray-500  ${
                        errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      disabled={isLoading}
                      autoComplete="off"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="john.smith@company.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white text-gray-900 placeholder-gray-500  ${
                      errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                    disabled={isLoading}
                    autoComplete="off"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>



                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white text-gray-900 placeholder-gray-500  ${
                        errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white text-gray-900 placeholder-gray-500  ${
                        errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-2">
                  {/* Note about reading terms first */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-emerald-700 font-semibold text-sm">📋 First Step Required</span>
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          Please read the <span className="text-emerald-600 font-medium">Terms and Conditions</span> before proceeding with your account creation.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <button
                      type="button"
                      onClick={handleTermsCheckboxChange}
                      className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                        agreedToTerms 
                          ? 'bg-emerald-500 border-emerald-500' 
                          : 'border-gray-300 hover:border-emerald-500'
                      } ${errors.terms ? 'border-red-500' : ''} ${termsLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                      disabled={isLoading || termsLocked}
                      aria-label="Agree to terms and conditions"
                    >
                      {agreedToTerms && <CheckCircle className="w-3 h-3 text-white" />}
                    </button>
                    <label className="text-sm text-gray-700 leading-relaxed">
                      I agree to the{' '}
                      <button
                        type="button"
                        className="text-emerald-600 hover:text-emerald-700 underline transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded"
                        onClick={handleTermsLinkClick}
                      >
                        Terms and Conditions
                      </button>
                      {termsLocked && (
                        <span className="ml-2 text-xs text-green-600 font-medium">
                          ✓ Terms reviewed and accepted
                        </span>
                      )}
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-red-500 text-xs mt-1">{errors.terms}</p>
                  )}
                </div>

                {/* Sign In Link */}
                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    onClick={handleSwitchToLogin}
                  >
                    Already have an account? Sign in
                  </button>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 flex-1"
                    disabled={isLoading || !agreedToTerms}
                    title={!agreedToTerms ? 'You must agree to the Terms and Conditions' : undefined}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </div>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        </DialogContent>
      </Dialog>

    </>
  )
}

// Terms Content Component for Recruiter Signup
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
      className="max-h-[60vh] overflow-y-auto space-y-6 text-sm px-2"
      onScroll={handleScroll}
    >
      {/* Platform Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Platform Information</h3>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2 text-gray-700">
              <div><strong className="text-gray-900">Platform:</strong> <span className="text-gray-800">BPOC.IO</span></div>
              <div><strong className="text-gray-900">Operated By:</strong> <span className="text-gray-800">ShoreAgents Inc.</span></div>
              <div><strong className="text-gray-900">Registration:</strong> <span className="text-gray-800">SEC CS201918140 | TIN 010-425-223-00000</span></div>
              <div><strong className="text-gray-900">Phone:</strong> <span className="text-gray-800">+63 917 702 0676</span></div>
            </div>
            <div className="space-y-2 text-gray-700">
              <div><strong className="text-gray-900">Email:</strong> <span className="text-gray-800">careers@shoreagents.com</span></div>
              <div><strong className="text-gray-900">Website:</strong> <span className="text-gray-800">https://shoreagents.com</span></div>
              <div><strong className="text-gray-900">Careers Website:</strong> <span className="text-gray-800">https://careers.shoreagents.com</span></div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-300">
            <div><strong className="text-gray-900">Address:</strong> <span className="text-gray-800">Business Center 26, Philexcel Business Park, Ma Roxas Highway, Clark Freeport, 2023 Pampanga</span></div>
          </div>
        </div>
      </div>

      {/* About BPOC.IO */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">About BPOC.IO</h3>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-700 mb-3">BPOC.IO is ShoreAgents Inc.'s recruitment and assessment platform designed to:</p>
          <ul className="space-y-1 text-gray-700">
            <li>• <strong className="text-gray-900">Streamline hiring</strong> for positions within ShoreAgents organization</li>
            <li>• <strong className="text-gray-900">Evaluate candidate qualifications</strong> through AI-powered assessments and interactive tools</li>
            <li>• <strong className="text-gray-900">Match talent</strong> with appropriate roles in our company</li>
            <li>• <strong className="text-gray-900">Provide career development</strong> insights and professional growth opportunities</li>
            <li>• <strong className="text-gray-900">Optimize recruitment efficiency</strong> through automated screening and evaluation</li>
          </ul>
          <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-gray-800 font-semibold text-sm">By using BPOC.IO, you are applying for potential employment with ShoreAgents Inc.</p>
          </div>
        </div>
      </div>

      {/* Acceptance of Terms */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Acceptance of Terms</h3>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="mb-4">
            <h4 className="text-base font-semibold text-gray-900 mb-2">Agreement to Terms</h4>
            <p className="text-gray-700 text-xs">By accessing, registering for, or using BPOC.IO, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use, along with our Privacy Policy.</p>
          </div>
          
          <div className="mb-4">
            <h4 className="text-base font-semibold text-gray-900 mb-2">Changes to Terms</h4>
            <p className="text-gray-700 text-xs">We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of BPOC.IO after any changes indicates your acceptance of the updated Terms.</p>
          </div>
          
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-2">Eligibility</h4>
            <p className="text-gray-700 text-xs">By using BPOC.IO, you represent that you are at least 18 years old and have the legal capacity to enter into these Terms.</p>
          </div>
        </div>
      </div>

      {/* User Registration and Account */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">User Registration and Account</h3>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-2">Account Creation</h4>
            <p className="text-gray-700 text-xs">To access certain features of BPOC.IO, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.</p>
          </div>
          
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-2">Account Security</h4>
            <p className="text-gray-700 text-xs">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>
          </div>
          
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-2">Account Termination</h4>
            <p className="text-gray-700 text-xs">We reserve the right to suspend or terminate your account at any time, with or without cause, including if you violate these Terms.</p>
          </div>
        </div>
      </div>

      {/* Data Collection and Privacy */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Collection and Privacy</h3>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-2">Information We Collect</h4>
            <p className="text-gray-700 text-xs mb-2">We collect the following types of information:</p>
            <ul className="space-y-1 text-gray-700 text-xs ml-4">
              <li>• Personal information (name, email, contact details)</li>
              <li>• Professional information (work experience, education, skills)</li>
              <li>• Assessment results and game performance data</li>
              <li>• Resume and application materials</li>
              <li>• Usage data and analytics</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-2">How We Use Your Information</h4>
            <p className="text-gray-700 text-xs mb-2">Your information is used to:</p>
            <ul className="space-y-1 text-gray-700 text-xs ml-4">
              <li>• Process your job applications</li>
              <li>• Evaluate your qualifications and fit for positions</li>
              <li>• Communicate with you regarding opportunities</li>
              <li>• Improve our platform and services</li>
              <li>• Comply with legal obligations</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-2">Data Sharing</h4>
            <p className="text-gray-700 text-xs">We may share your information with hiring managers and relevant personnel within ShoreAgents Inc. for recruitment purposes. We do not sell your personal information to third parties.</p>
          </div>
        </div>
      </div>

      {/* Platform Usage */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Platform Usage</h3>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-2">Permitted Use</h4>
            <p className="text-gray-700 text-xs">You may use BPOC.IO solely for the purpose of applying for positions with ShoreAgents Inc. and related recruitment activities.</p>
          </div>
          
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-2">Prohibited Conduct</h4>
            <p className="text-gray-700 text-xs mb-2">You agree not to:</p>
            <ul className="space-y-1 text-gray-700 text-xs ml-4">
              <li>• Provide false or misleading information</li>
              <li>• Use the platform for any unlawful purpose</li>
              <li>• Attempt to gain unauthorized access to our systems</li>
              <li>• Interfere with or disrupt the platform's operation</li>
              <li>• Copy, modify, or distribute platform content without permission</li>
              <li>• Use automated tools to access or interact with the platform</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Intellectual Property */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Intellectual Property</h3>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-2">Platform Ownership</h4>
            <p className="text-gray-700 text-xs">All content, features, and functionality of BPOC.IO, including but not limited to text, graphics, logos, and software, are owned by ShoreAgents Inc. and are protected by intellectual property laws.</p>
          </div>
          
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-2">User Content</h4>
            <p className="text-gray-700 text-xs">By submitting content to BPOC.IO (including resumes, applications, and assessment responses), you grant ShoreAgents Inc. a non-exclusive, worldwide, royalty-free license to use, store, and process such content for recruitment and business purposes.</p>
          </div>
        </div>
      </div>

      {/* Limitation of Liability */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-700 text-xs mb-3">BPOC.IO is provided "as is" without warranties of any kind. ShoreAgents Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform.</p>
          <p className="text-gray-700 text-xs">We do not guarantee that the platform will be uninterrupted, secure, or error-free, nor do we guarantee any specific results from using the platform.</p>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Us</h3>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-700 text-xs mb-3">If you have any questions about these Terms of Use, please contact us:</p>
          <div className="space-y-1 text-gray-700 text-xs">
            <div><strong className="text-gray-900">Email:</strong> careers@shoreagents.com</div>
            <div><strong className="text-gray-900">Phone:</strong> +63 917 702 0676</div>
            <div><strong className="text-gray-900">Address:</strong> Business Center 26, Philexcel Business Park, Ma Roxas Highway, Clark Freeport, 2023 Pampanga</div>
          </div>
        </div>
      </div>

      {/* Final Acknowledgment */}
      <div className="bg-emerald-50 p-4 rounded-lg border-2 border-emerald-500">
        <p className="text-gray-800 text-sm font-semibold text-center mb-2">
          ✓ You have reached the end of the Terms and Conditions
        </p>
        <p className="text-gray-700 text-xs text-center">
          By continuing, you acknowledge that you have read and agree to these terms.
        </p>
      </div>
    </div>
  )
}

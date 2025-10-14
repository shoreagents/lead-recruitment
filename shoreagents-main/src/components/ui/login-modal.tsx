"use client"

import React, { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// Remove ButtonLoader import - we'll use a simple spinner instead
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LogIn, UserPlus, ChevronLeft, ChevronRight, User, Mail, Building, Lock, Eye, EyeOff, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { createClient } from "@/lib/supabase/client"
import { generateUserId } from "@/lib/userEngagementService"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { getAuthErrorMessage } from "@/lib/authErrorUtils"

// Login form schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
  rememberPassword: z.boolean().optional(),
})

// Signup form schema
const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type LoginFormData = z.infer<typeof loginSchema>
type SignupFormData = z.infer<typeof signupSchema>

interface LoginModalProps {
  children?: React.ReactNode
  onSuccess?: () => void
  prefillData?: {
    firstName?: string
    lastName?: string
    email?: string
    company?: string
  }
}

export function LoginModal({ children, onSuccess, prefillData }: LoginModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')
  const [emailChecking, setEmailChecking] = useState(false)
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { refreshUser } = useAuth()
  const { refreshAdmin } = useAdminAuth()

  // Auto-open modal and switch to signup if prefill data is provided
  React.useEffect(() => {
    if (prefillData && (prefillData.firstName || prefillData.lastName || prefillData.email)) {
      setOpen(true)
      setIsSignup(true)
      setCurrentStep(1)
    }
  }, [prefillData])

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  // Check email availability with better validation
  const checkEmailAvailability = async (email: string) => {
    // Reset state first
    setEmailAvailable(null)
    
    // Only check if email is complete and valid
    if (!email || !email.includes('@') || email.length < 5) {
      setEmailAvailable(null)
      return
    }
    
    // Check if email looks complete (has @ and domain)
    const emailParts = email.split('@')
    if (emailParts.length !== 2 || emailParts[1].length < 3 || !emailParts[1].includes('.')) {
      setEmailAvailable(null)
      return
    }

    setEmailChecking(true)
    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()
      setEmailAvailable(result.available)
    } catch (error) {
      console.error('Error checking email availability:', error)
      setEmailAvailable(null)
    } finally {
      setEmailChecking(false)
    }
  }

  // Debounced email check function
  const debouncedCheckEmail = useCallback((email: string) => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    
    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      checkEmailAvailability(email)
    }, 1000) // Increased debounce time to 1 second
  }, [])

  // Load saved credentials from localStorage
  const loadSavedCredentials = () => {
    if (typeof window !== 'undefined') {
      try {
        const savedCredentials = localStorage.getItem('shoreagents_saved_credentials')
        if (savedCredentials) {
          const { email, password } = JSON.parse(savedCredentials)
          return { email, password }
        }
      } catch (error) {
        console.error('Error loading saved credentials:', error)
      }
    }
    return { email: "", password: "" }
  }

  // Save credentials to localStorage
  const saveCredentials = (email: string, password: string) => {
    if (typeof window !== 'undefined') {
      try {
        const credentials = { email, password }
        localStorage.setItem('shoreagents_saved_credentials', JSON.stringify(credentials))
        console.log('🔍 Credentials saved to localStorage')
      } catch (error) {
        console.error('Error saving credentials:', error)
      }
    }
  }

  // Clear saved credentials from localStorage
  const clearSavedCredentials = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('shoreagents_saved_credentials')
        console.log('🔍 Saved credentials cleared from localStorage')
      } catch (error) {
        console.error('Error clearing saved credentials:', error)
      }
    }
  }

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      rememberPassword: false,
    },
  })

  // Load saved credentials on component mount
  React.useEffect(() => {
    const savedCredentials = loadSavedCredentials()
    if (savedCredentials.email && savedCredentials.password) {
      loginForm.setValue('email', savedCredentials.email)
      loginForm.setValue('password', savedCredentials.password)
      loginForm.setValue('rememberPassword', true)
    }
  }, [])

  // Signup form
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: prefillData?.firstName || "",
      lastName: prefillData?.lastName || "",
      email: prefillData?.email || "",
      company: prefillData?.company || "",
      password: "",
      confirmPassword: "",
    },
  })

  // Login form submission
  const onLoginSubmit = async (data: LoginFormData) => {
    setLoading(true)
    
    try {
      const supabase = createClient()

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      // Handle remember password functionality
      if (data.rememberPassword) {
        saveCredentials(data.email, data.password)
      } else {
        clearSavedCredentials()
      }

      if (authError) {
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error("Login failed - no user returned")
      }

      // Refresh both user and admin contexts
      await Promise.all([refreshUser(), refreshAdmin()])
      
      // Check if this is an admin user - prioritize email lookup for admin detection
      console.log('🔍 Login debug - Auth user ID:', authData.user.id);
      console.log('🔍 Login debug - Email:', data.email);
      
      // First try email lookup (more reliable for admin detection)
      let { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_type, auth_user_id, email')
        .eq('email', data.email)
        .single()
      
      console.log('🔍 Email lookup result:', { userData, userError });
      
      // If email lookup fails, try auth_user_id lookup as fallback
      if (userError) {
        console.log('🔄 Email lookup failed, trying auth_user_id lookup...');
        const { data: authUserData, error: authUserError } = await supabase
          .from('users')
          .select('user_type, auth_user_id, email')
          .eq('auth_user_id', authData.user.id)
          .single();
        
        if (!authUserError && authUserData) {
          userData = authUserData;
          userError = null;
          console.log('✅ Found user by auth_user_id:', authUserData);
        }
      }
      
      console.log('LoginModal - User data:', userData)
      console.log('LoginModal - User error:', userError)
      console.log('LoginModal - User type:', userData?.user_type)
      console.log('LoginModal - Is Admin?', userData?.user_type === 'Admin')
      
      if (!userError && userData && userData.user_type === 'Admin') {
        // This is an admin user
        toast.success("Welcome back, Admin!")
        setOpen(false)
        loginForm.reset()
        
        // Redirect to admin dashboard
        window.location.href = '/admin-dashboard'
      } else {
        // This is a regular user
        toast.success("Welcome back!")
        setOpen(false)
        loginForm.reset()
        
        // Redirect to user dashboard
        window.location.href = '/user-dashboard'
      }
    } catch (error) {
      console.error("Login error:", error)
      const errorMessage = getAuthErrorMessage(error, 'login')
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Signup form submission
  const onSignupSubmit = async (data: SignupFormData) => {
    // Prevent submission if email is not available
    if (emailAvailable === false) {
      toast.error('Please use a different email address or sign in with your existing account.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/signup-simple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          company: data.company,
          // Pass the current anonymous user ID to preserve their data
          // Use the existing device ID from localStorage (this should already exist)
          anonymous_user_id: (() => {
            // This should always run on the client side
            if (typeof window !== 'undefined') {
              const existingId = localStorage.getItem('shoreagents_device_id');
              if (existingId) {
                console.log('🔍 Using existing device ID for signup:', existingId);
                console.log('🔍 Device ID format check - is fingerprint based:', !existingId.includes('_') || existingId.startsWith('device_'));
                return existingId;
              } else {
                console.log('⚠️ No existing device ID found in localStorage - this should not happen for anonymous users');
                console.log('⚠️ Available localStorage keys:', Object.keys(localStorage));
                console.log('⚠️ This means the AnonymousUserInitializer did not run or failed');
                // For anonymous users, this should always exist
                // If it doesn't exist, something went wrong with the anonymous tracking
                return null; // Let the API handle this case
              }
            } else {
              console.log('⚠️ Window is undefined - this should not happen in client-side code');
              return null;
            }
          })(),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Sign up failed")
      }

      toast.success("Account created successfully! Your browsing history has been preserved and linked to your account.")
      
      // Automatically sign in the user after successful account creation
      try {
        const supabase = createClient()
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })

        if (signInError) {
          console.error('Auto sign-in error:', signInError)
          toast.error('Account created but failed to sign in automatically. Please sign in manually.')
        } else {
          console.log('✅ Auto sign-in successful')
          
          // Refresh auth contexts to update user state
          await Promise.all([refreshUser(), refreshAdmin()])
          
          // Check if this is an admin user for proper redirect
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('user_type, auth_user_id, email')
            .eq('email', data.email)
            .single()
          
          if (!userError && userData && userData.user_type === 'Admin') {
            // Admin user - redirect to admin dashboard
            console.log('✅ New Admin user created - redirecting to admin-dashboard')
            toast.success("Welcome, Admin!")
            setOpen(false)
            signupForm.reset()
            setIsSignup(false)
            setCurrentStep(1)
            window.location.href = '/admin-dashboard'
          } else {
            // Regular user - redirect to user dashboard
            console.log('✅ New Regular user created - redirecting to user-dashboard')
            toast.success("Welcome to ShoreAgents!")
            setOpen(false)
            signupForm.reset()
            setIsSignup(false)
            setCurrentStep(1)
            window.location.href = '/user-dashboard'
          }
        }
      } catch (autoSignInError) {
        console.error('Auto sign-in failed:', autoSignInError)
        toast.error('Account created but failed to sign in automatically. Please sign in manually.')
        setOpen(false)
        signupForm.reset()
        setIsSignup(false)
        setCurrentStep(1)
      }

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Sign up error:", error)
      const errorMessage = getAuthErrorMessage(error, 'signup')
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Google sign-in handler
  const handleGoogleSignIn = async () => {
    setLoading(true)
    
    try {
      const supabase = createClient()

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      // The OAuth flow will redirect the user, so we don't need to handle success here
    } catch (error) {
      console.error("Google sign-in error:", error)
      const errorMessage = getAuthErrorMessage(error, 'login')
      toast.error(errorMessage)
      setLoading(false)
    }
  }

  // Toggle between login and signup
  const toggleMode = () => {
    if (isSignup) {
      // Going from signup to login - slide left
      setSlideDirection('left')
    } else {
      // Going from login to signup - slide right
      setSlideDirection('right')
    }
    setIsSignup(!isSignup)
    setCurrentStep(1)
    setEmailAvailable(null)
    setEmailChecking(false)
    loginForm.reset()
    signupForm.reset()
  }

  // Signup form navigation
  const nextStep = async () => {
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'company']
    
    const isValid = await signupForm.trigger(fieldsToValidate as (keyof SignupFormData)[])
    
    // Also check if email is available before proceeding
    if (emailAvailable === false) {
      toast.error('Please use a different email address or sign in with your existing account.')
      return
    }
    
    if (isValid && (emailAvailable === true || emailAvailable === null)) {
      // Submit the form directly since we only have one step now
      await onSignupSubmit(signupForm.getValues())
    }
  }


  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) {
        setIsSignup(false)
        setCurrentStep(1)
        setSlideDirection('right')
        setEmailAvailable(null)
        setEmailChecking(false)
        loginForm.reset()
        signupForm.reset()
      }
    }}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="border-lime-300 text-lime-700 hover:bg-lime-50">
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[700px] overflow-hidden flex flex-col">
        <DialogHeader className="py-0">
          <DialogTitle className="text-2xl font-bold text-center text-gray-900">
            {isSignup ? "Create Your Account" : "Welcome to ShoreAgents"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {isSignup 
              ? "Join ShoreAgents and access our premium offshore talent solutions"
              : "Sign in to your ShoreAgents account"
            }
          </DialogDescription>
        </DialogHeader>


        <div className="px-6 py-2 flex-1 flex flex-col overflow-hidden">
          {/* Login Form */}
          {!isSignup && (
            <div className={`animate-in fade-in-0 duration-300 flex-1 flex flex-col ${
              slideDirection === 'left' 
                ? 'slide-in-from-right-4' 
                : 'slide-in-from-left-4'
            }`}>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="flex-1 flex flex-col">
                  <div className="space-y-2 flex-1">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder={fieldState.error && fieldState.isTouched ? fieldState.error.message : "Email"}
                              className={`${fieldState.error && fieldState.isTouched ? 'border-red-500 focus:border-red-500 focus:ring-red-500 placeholder:text-red-500' : 'border-gray-300 focus:border-lime-500 focus:ring-lime-500'}`}
                              {...field}
                              onChange={(e) => {
                                field.onChange(e)
                                // Clear error when user starts typing
                                if (fieldState.error) {
                                  loginForm.clearErrors('email')
                                }
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder={fieldState.error && fieldState.isTouched ? fieldState.error.message : "Password"}
                                className={`pr-10 ${fieldState.error && fieldState.isTouched ? 'border-red-500 focus:border-red-500 focus:ring-red-500 placeholder:text-red-500' : 'border-gray-300 focus:border-lime-500 focus:ring-lime-500'}`}
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e)
                                  // Clear error when user starts typing
                                  if (fieldState.error) {
                                    loginForm.clearErrors('password')
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="rememberPassword"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 text-lime-600 focus:ring-lime-500 border-gray-300 rounded"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium text-gray-700 cursor-pointer">
                              Remember password
                            </FormLabel>
                            <p className="text-xs text-gray-500">
                              Save your login credentials for faster access
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-lime-600 hover:bg-lime-700 text-white disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Signing In...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>

                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-gray-200">
                      <span className="bg-white text-gray-500 relative z-10 px-2">
                        Or
                      </span>
                    </div>

                    <Button 
                      variant="outline" 
                      type="button" 
                      className="w-full"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      {loading ? "Signing in..." : "Continue with Google"}
                    </Button>
                  </div>
                </form>
              </Form>

              {/* Toggle to Signup */}
              <div className="flex items-center justify-center space-x-2 pt-4 mt-6 border-t border-gray-200">
                <span className="text-sm text-gray-600">Don't have an account?</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={toggleMode}
                  className="text-lime-600 hover:text-lime-700 hover:bg-lime-50 p-1 h-auto"
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  Sign Up
                </Button>
              </div>
            </div>
          )}

          {/* Signup Form */}
          {isSignup && (
            <div className={`animate-in fade-in-0 duration-300 flex-1 flex flex-col ${
              slideDirection === 'right' 
                ? 'slide-in-from-right-4' 
                : 'slide-in-from-left-4'
            }`}>
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="flex-1 flex flex-col">
                  <div className="flex-1 space-y-4">
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                      <div className="space-y-4">

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={signupForm.control}
                            name="firstName"
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">First Name</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                      placeholder={fieldState.error && fieldState.isTouched ? fieldState.error.message : "First Name"}
                                      className={`pl-10 ${fieldState.error && fieldState.isTouched ? 'border-red-500 focus:border-red-500 focus:ring-red-500 placeholder:text-red-500' : 'border-gray-300 focus:border-lime-500 focus:ring-lime-500'}`}
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e)
                                        // Clear error when user starts typing
                                        if (fieldState.error) {
                                          signupForm.clearErrors('firstName')
                                        }
                                      }}
                                    />
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={signupForm.control}
                            name="lastName"
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">Last Name</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                      placeholder={fieldState.error && fieldState.isTouched ? fieldState.error.message : "Last Name"}
                                      className={`pl-10 ${fieldState.error && fieldState.isTouched ? 'border-red-500 focus:border-red-500 focus:ring-red-500 placeholder:text-red-500' : 'border-gray-300 focus:border-lime-500 focus:ring-lime-500'}`}
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e)
                                        // Clear error when user starts typing
                                        if (fieldState.error) {
                                          signupForm.clearErrors('lastName')
                                        }
                                      }}
                                    />
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={signupForm.control}
                          name="email"
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input
                                    type="email"
                                    placeholder={fieldState.error && fieldState.isTouched ? fieldState.error.message : "Email Address"}
                                    className={`pl-10 pr-10 ${
                                      fieldState.error && fieldState.isTouched 
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 placeholder:text-red-500' 
                                        : emailAvailable === false
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : emailAvailable === true
                                        ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                                        : 'border-gray-300 focus:border-lime-500 focus:ring-lime-500'
                                    }`}
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e)
                                      // Clear error when user starts typing
                                      if (fieldState.error) {
                                        signupForm.clearErrors('email')
                                      }
                                      // Reset email availability state when user starts typing
                                      setEmailAvailable(null)
                                      // Check email availability with proper debounce
                                      debouncedCheckEmail(e.target.value)
                                    }}
                                  />
                                  {emailChecking && (
                                    <div className="absolute right-3 top-3 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-lime-600"></div>
                                  )}
                                  {!emailChecking && emailAvailable === false && (
                                    <div className="absolute right-3 top-3 h-4 w-4 text-red-500">✗</div>
                                  )}
                                  {!emailChecking && emailAvailable === true && (
                                    <div className="absolute right-3 top-3 h-4 w-4 text-green-500">✓</div>
                                  )}
                                </div>
                              </FormControl>
                              {emailAvailable === false && (
                                <p className="text-sm text-red-600 mt-1">
                                  This email is already registered. Please sign in instead.
                                </p>
                              )}
                              {emailAvailable === true && (
                                <p className="text-sm text-green-600 mt-1">
                                  Email is available.
                                </p>
                              )}
                            </FormItem>
                          )}
                        />

                        {/* Company Field */}
                        <FormField
                          control={signupForm.control}
                          name="company"
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">Company</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input
                                    type="text"
                                    placeholder={fieldState.error && fieldState.isTouched ? fieldState.error.message : "Company Name"}
                                    className={`pl-10 ${fieldState.error && fieldState.isTouched ? 'border-red-500 focus:border-red-500 focus:ring-red-500 placeholder:text-red-500' : 'border-gray-300 focus:border-lime-500 focus:ring-lime-500'}`}
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e)
                                      // Clear error when user starts typing
                                      if (fieldState.error) {
                                        signupForm.clearErrors('company')
                                      }
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Password Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={signupForm.control}
                            name="password"
                            render={({ field, fieldState }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                      type={showPassword ? "text" : "password"}
                                      placeholder={fieldState.error && fieldState.isTouched ? fieldState.error.message : "Password"}
                                      className={`pl-10 pr-10 ${fieldState.error && fieldState.isTouched ? 'border-red-500 focus:border-red-500 focus:ring-red-500 placeholder:text-red-500' : 'border-gray-300 focus:border-lime-500 focus:ring-lime-500'}`}
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e)
                                        // Clear error when user starts typing
                                        if (fieldState.error) {
                                          signupForm.clearErrors('password')
                                        }
                                      }}
                                    />
                                    <button
                                      type="button"
                                      className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                                      onClick={() => setShowPassword(!showPassword)}
                                    >
                                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                  </div>
                                </FormControl>
                                <div className="min-h-[20px]">
                                  <FormMessage className="text-xs" />
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={signupForm.control}
                            name="confirmPassword"
                            render={({ field, fieldState }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel className="text-sm font-medium text-gray-700">Confirm Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                      type={showConfirmPassword ? "text" : "password"}
                                      placeholder={fieldState.error && fieldState.isTouched ? fieldState.error.message : "Confirm Password"}
                                      className={`pl-10 pr-10 ${fieldState.error && fieldState.isTouched ? 'border-red-500 focus:border-red-500 focus:ring-red-500 placeholder:text-red-500' : 'border-gray-300 focus:border-lime-500 focus:ring-lime-500'}`}
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e)
                                        // Clear error when user starts typing
                                        if (fieldState.error) {
                                          signupForm.clearErrors('confirmPassword')
                                        }
                                      }}
                                    />
                                    <button
                                      type="button"
                                      className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                  </div>
                                </FormControl>
                                <div className="min-h-[20px]">
                                  <FormMessage className="text-xs" />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>

                </div>
                    )}

              </div>

                  {/* Navigation Buttons - Fixed at bottom */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-auto">
                    <div>
                      {/* No back button needed for single step */}
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>

                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={loading}
                        className="bg-lime-600 hover:bg-lime-700 text-white disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Creating Account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </div>
                  </div>
        </form>
              </Form>

              {/* Toggle to Login */}
              <div className="flex items-center justify-center space-x-2 pt-4 mt-6 border-t border-gray-200">
                <span className="text-sm text-gray-600">Already have an account?</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={toggleMode}
                  className="text-lime-600 hover:text-lime-700 hover:bg-lime-50 p-1 h-auto"
                >
                  <LogIn className="w-4 h-4 mr-1" />
                  Sign In
                </Button>
              </div>
            </div>
          )}

          <div className="text-center text-xs text-gray-500 mt-4">
            By {isSignup ? "creating an account" : "signing in"}, you agree to our{" "}
            <a href="#" className="underline underline-offset-4 hover:text-lime-600">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-lime-600">
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

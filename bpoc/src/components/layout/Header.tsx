'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Menu, 
  X, 
  User, 
  Trophy, 
  Sparkles,
  Settings,
  LogOut,
  LogIn,
  Home,
  FileText,
  Wrench,
  Briefcase,
  Users,
  Shield,
  FileText as FileTextIcon,
  ChevronDown,
  Gamepad2,
  Brain,
  Calculator
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { cn } from '@/lib/utils'
import LoginForm from '@/components/auth/LoginForm'
import SignUpForm from '@/components/auth/SignUpForm'

import { useAuth } from '@/contexts/AuthContext'
import { useAdmin } from '@/contexts/AdminContext'
import { getSessionToken } from '@/lib/auth-helpers'

interface HeaderProps {
  className?: string
}

interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  username?: string
  location: string
  avatar_url?: string
  phone?: string
  bio?: string
  position?: string
  created_at: string
  updated_at: string
  slug?: string
}

// Component to handle search params with Suspense
function SearchParamsHandler({ 
  user, 
  setIsSignUpDialogOpen 
}: { 
  user: any; 
  setIsSignUpDialogOpen: (open: boolean) => void 
}) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const signupParam = searchParams.get('signup')
    if (signupParam === 'true' && !user) {
      setIsSignUpDialogOpen(true)
    }
  }, [searchParams, user, setIsSignUpDialogOpen])

  return null
}

export default function Header({}: HeaderProps) {
  const { user, signOut, loading, session } = useAuth()
  const { isAdmin } = useAdmin()
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [savedResumeInfo, setSavedResumeInfo] = useState<{ hasSavedResume: boolean; resumeUrl: string } | null>(null)

  const isAuthenticated = !!user
   
  // Redirect non-admin users away from admin routes
  useEffect(() => {
    if (user && !isAdmin && pathname.startsWith('/admin')) {
      router.push('/home')
    }
  }, [isAdmin, user, pathname, router])

  // Fetch user profile from Railway with retry mechanism
  useEffect(() => {
    const fetchUserProfile = async (retryCount = 0) => {
      if (user?.id) {
        let timeoutId: NodeJS.Timeout | undefined
        try {
          setProfileLoading(true)
          console.log('🔄 Fetching user profile for:', user.id, retryCount > 0 ? `(retry ${retryCount})` : '')
          console.log('⏰ Profile loading started at:', new Date().toISOString())
          
          // Add a small delay to allow Google OAuth metadata to be fully processed
          if (retryCount === 0) {
            console.log('⏳ Waiting 500ms for OAuth metadata to be processed...')
            await new Promise(resolve => setTimeout(resolve, 500))
          }
          
          // Add timeout to prevent infinite loading
          timeoutId = setTimeout(() => {
            console.log('⏰ Profile loading timeout reached, forcing loading to false')
            setProfileLoading(false)
          }, 10000) // 10 second timeout
          
          const response = await fetch(`/api/user/profile?userId=${user.id}`)
          clearTimeout(timeoutId)
          if (response.ok) {
            const data = await response.json()
            console.log('✅ User profile loaded:', data.user)
            
            // Check if user has missing name information (common with Google OAuth)
            if (!data.user.first_name || !data.user.last_name || !data.user.full_name) {
              console.log('⚠️ User missing name information, attempting to sync with Google data...')
              console.log('🔍 User metadata from Supabase:', user.user_metadata)
              console.log('🔍 Available name fields:', {
                given_name: user.user_metadata?.given_name,
                family_name: user.user_metadata?.family_name,
                name: user.user_metadata?.name,
                first_name: user.user_metadata?.first_name,
                last_name: user.user_metadata?.last_name,
                full_name: user.user_metadata?.full_name
              })
              try {
                // Parse name data from Google metadata with better extraction
                let firstName = user.user_metadata?.first_name || user.user_metadata?.given_name || ''
                let lastName = user.user_metadata?.last_name || user.user_metadata?.family_name || ''
                let fullName = user.user_metadata?.full_name || user.user_metadata?.name || ''
                
                console.log('🔍 Google metadata name fields:', {
                  first_name: user.user_metadata?.first_name,
                  last_name: user.user_metadata?.last_name,
                  given_name: user.user_metadata?.given_name,
                  family_name: user.user_metadata?.family_name,
                  full_name: user.user_metadata?.full_name,
                  name: user.user_metadata?.name
                })
                
                // If we have a full name but no individual names, parse it
                if (fullName && (!firstName || !lastName)) {
                  const nameParts = fullName.trim().split(' ')
                  if (nameParts.length >= 2) {
                    firstName = nameParts[0]
                    lastName = nameParts.slice(1).join(' ')
                  } else if (nameParts.length === 1) {
                    firstName = nameParts[0]
                    lastName = ''
                  }
                }
                
                // If we have individual names but no full name, construct it
                if ((firstName || lastName) && !fullName) {
                  fullName = `${firstName} ${lastName}`.trim()
                }
                
                // Fallback to email if no name data at all
                if (!fullName && !firstName && !lastName) {
                  fullName = user.email || 'User'
                  firstName = user.email?.split('@')[0] || 'User'
                  lastName = ''
                }
                
                console.log('🔍 Parsed name data:', {
                  firstName,
                  lastName,
                  fullName
                })

                const syncResponse = await fetch('/api/user/sync', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    id: user.id,
                    email: user.email,
                    first_name: firstName,
                    last_name: lastName,
                    full_name: fullName,
                    location: user.user_metadata?.location || '',
                    avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
                    phone: user.user_metadata?.phone || '',
                    bio: user.user_metadata?.bio || '',
                    position: user.user_metadata?.position || '',
                    company: user.user_metadata?.company || '',
                    completed_data: data.user.completed_data || false,
                    birthday: user.user_metadata?.birthday || null,
                    gender: user.user_metadata?.gender || null,
                    admin_level: data.user.admin_level || 'user' // Preserve existing admin_level
                  })
                })

                if (syncResponse.ok) {
                  console.log('✅ User name information synced successfully, retrying profile fetch...')
                  // Retry fetching the profile
                  const retryResponse = await fetch(`/api/user/profile?userId=${user.id}`)
                  if (retryResponse.ok) {
                    const retryData = await retryResponse.json()
                    setUserProfile(retryData.user)
                  }
                } else {
                  console.error('❌ Failed to sync user name information:', syncResponse.status)
                  setUserProfile(data.user) // Still set the profile even if sync failed
                }
              } catch (syncError) {
                console.error('❌ Error during user name sync:', syncError)
                setUserProfile(data.user) // Still set the profile even if sync failed
              }
            } else {
              setUserProfile(data.user)
            }
          } else if (response.status === 404) {
            // User not found in database, try to sync them
            console.log('⚠️ User not found in database, attempting to sync...')
            try {
              // Parse name data from Google metadata with better extraction
              let firstName = user.user_metadata?.first_name || user.user_metadata?.given_name || ''
              let lastName = user.user_metadata?.last_name || user.user_metadata?.family_name || ''
              let fullName = user.user_metadata?.full_name || user.user_metadata?.name || ''
              
              console.log('🔍 Google metadata name fields (404 case):', {
                first_name: user.user_metadata?.first_name,
                last_name: user.user_metadata?.last_name,
                given_name: user.user_metadata?.given_name,
                family_name: user.user_metadata?.family_name,
                full_name: user.user_metadata?.full_name,
                name: user.user_metadata?.name
              })
              
              // If we have a full name but no individual names, parse it
              if (fullName && (!firstName || !lastName)) {
                const nameParts = fullName.trim().split(' ')
                if (nameParts.length >= 2) {
                  firstName = nameParts[0]
                  lastName = nameParts.slice(1).join(' ')
                } else if (nameParts.length === 1) {
                  firstName = nameParts[0]
                  lastName = ''
                }
              }
              
              // If we have individual names but no full name, construct it
              if ((firstName || lastName) && !fullName) {
                fullName = `${firstName} ${lastName}`.trim()
              }
              
              // Fallback to email if no name data at all
              if (!fullName && !firstName && !lastName) {
                fullName = user.email || 'User'
                firstName = user.email?.split('@')[0] || 'User'
                lastName = ''
              }
              
              console.log('🔍 Parsed name data (404 case):', {
                firstName,
                lastName,
                fullName
              })

              const syncResponse = await fetch('/api/user/sync', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  id: user.id,
                  email: user.email,
                  first_name: firstName,
                  last_name: lastName,
                  full_name: fullName,
                  location: user.user_metadata?.location || '',
                  avatar_url: user.user_metadata?.avatar_url || null,
                  phone: user.user_metadata?.phone || '',
                  bio: user.user_metadata?.bio || '',
                  position: user.user_metadata?.position || '',
                  company: user.user_metadata?.company || '',
                  completed_data: user.user_metadata?.completed_data ?? false,
                  birthday: user.user_metadata?.birthday || null,
                  gender: user.user_metadata?.gender || null,
                  admin_level: 'user' // Default for new users
                })
              })

              if (syncResponse.ok) {
                console.log('✅ User synced successfully, retrying profile fetch...')
                // Retry fetching the profile
                const retryResponse = await fetch(`/api/user/profile?userId=${user.id}`)
                if (retryResponse.ok) {
                  const retryData = await retryResponse.json()
                  setUserProfile(retryData.user)
                }
              } else {
                console.error('❌ Failed to sync user:', syncResponse.status)
                // Retry after a delay if sync failed and we haven't retried too many times
                if (retryCount < 3) {
                  const delay = retryCount === 0 ? 1000 : retryCount === 1 ? 2000 : 3000
                  console.log(`🔄 Retrying profile fetch in ${delay}ms (attempt ${retryCount + 1})`)
                  setTimeout(() => fetchUserProfile(retryCount + 1), delay)
                  return
                }
              }
            } catch (syncError) {
              console.error('❌ Error during user sync:', syncError)
              // Retry after a delay if sync failed and we haven't retried too many times
              if (retryCount < 3) {
                const delay = retryCount === 0 ? 1000 : retryCount === 1 ? 2000 : 3000
                console.log(`🔄 Retrying profile fetch in ${delay}ms (attempt ${retryCount + 1})`)
                setTimeout(() => fetchUserProfile(retryCount + 1), delay)
                return
              }
            }
          } else {
            console.error('❌ Failed to fetch user profile:', response.status, response.statusText)
            // Retry after a delay if fetch failed and we haven't retried too many times
            if (retryCount < 3) {
              const delay = retryCount === 0 ? 1000 : retryCount === 1 ? 2000 : 3000
              console.log(`🔄 Retrying profile fetch in ${delay}ms (attempt ${retryCount + 1})`)
              setTimeout(() => fetchUserProfile(retryCount + 1), delay)
              return
            }
          }
        } catch (error) {
          console.error('❌ Error fetching user profile:', error)
          // Clear timeout on error
          if (timeoutId) {
            clearTimeout(timeoutId)
          }
          // Retry after a delay if fetch failed and we haven't retried too many times
          if (retryCount < 3) {
            const delay = retryCount === 0 ? 1000 : retryCount === 1 ? 2000 : 3000
            console.log(`🔄 Retrying profile fetch in ${delay}ms (attempt ${retryCount + 1})`)
            setTimeout(() => fetchUserProfile(retryCount + 1), delay)
            return
          }
        } finally {
          console.log('⏰ Profile loading finished at:', new Date().toISOString())
          setProfileLoading(false)
        }
      } else {
        console.log('⚠️ No user ID available for profile fetch')
      }
    }

    fetchUserProfile()
  }, [user?.id])

  // Function to refresh user profile (can be called from settings after updates)
  const refreshUserProfile = async () => {
    if (user?.id) {
      try {
        setProfileLoading(true)
        const response = await fetch(`/api/user/profile?userId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          setUserProfile(data.user)
        }
      } catch (error) {
        console.error('Error refreshing user profile:', error)
      } finally {
        setProfileLoading(false)
      }
    }
  }

  // Function to handle My Profile click when slug is not available
  const handleMyProfileClick = async () => {
    if (!userProfile?.slug && user?.id) {
      console.log('🔄 My Profile clicked but no slug available, attempting to refresh profile...')
      
      try {
        // Try to refresh the profile
        const response = await fetch(`/api/user/profile?userId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          const updatedProfile = data.user
          
          if (updatedProfile?.slug) {
            console.log('✅ Profile refreshed with slug:', updatedProfile.slug)
            window.location.href = `/profile/${updatedProfile.slug}`
            return
          }
          
          // If user has username but no slug, the database trigger might be delayed
          if (updatedProfile?.username && !updatedProfile?.slug) {
            console.log('🔄 User has username but no slug yet, waiting for database trigger...')
            
            // Wait a bit longer for the database trigger to generate the slug
            setTimeout(async () => {
              try {
                const retryResponse = await fetch(`/api/user/profile?userId=${user.id}`)
                if (retryResponse.ok) {
                  const retryData = await retryResponse.json()
                  const retryProfile = retryData.user
                  
                  if (retryProfile?.slug) {
                    console.log('✅ Slug generated after delay:', retryProfile.slug)
                    window.location.href = `/profile/${retryProfile.slug}`
                    return
                  }
                }
                
                // Still no slug, redirect to settings
                console.log('⚠️ Slug still not generated after delay, redirecting to settings')
                window.location.href = '/settings'
              } catch (retryError) {
                console.error('❌ Error in retry:', retryError)
                window.location.href = '/settings'
              }
            }, 2000) // Wait 2 seconds for database trigger
            return
          }
        }
        
        // If still no slug, redirect to settings
        console.log('⚠️ Still no slug available after refresh, redirecting to settings')
        window.location.href = '/settings'
      } catch (error) {
        console.error('❌ Error refreshing profile:', error)
        window.location.href = '/settings'
      }
    }
  }

  // Listen for profile updates from settings
  useEffect(() => {
    const handleProfileUpdate = () => {
      refreshUserProfile()
    }

    window.addEventListener('profileUpdated', handleProfileUpdate)
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate)
    }
  }, [user?.id])

  // Check for saved resumes
  useEffect(() => {
    const checkSavedResumes = async () => {
      if (user?.id) {
        try {
          const sessionToken = await getSessionToken()
          if (!sessionToken) return

          const response = await fetch('/api/user/saved-resumes', {
            headers: {
              'Authorization': `Bearer ${sessionToken}`
            }
          })

          if (response.ok) {
            const data = await response.json()
            setSavedResumeInfo({
              hasSavedResume: data.hasSavedResume,
              resumeUrl: data.resumeUrl
            })
          }
        } catch (error) {
          console.error('Error checking saved resumes:', error)
        }
      }
    }

    checkSavedResumes()
  }, [user?.id])
  
  // Extract user info with fallback to Google OAuth data
  const userDisplayName = profileLoading ? 'Loading...' : (
    userProfile?.full_name || 
    (userProfile?.first_name && userProfile?.last_name ? `${userProfile.first_name} ${userProfile.last_name}` : null) ||
    userProfile?.username || 
    // Fallback to Google OAuth data when Railway data isn't available yet
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    (user?.user_metadata?.given_name && user?.user_metadata?.family_name ? 
      `${user.user_metadata.given_name} ${user.user_metadata.family_name}` : null) ||
    (user?.user_metadata?.first_name && user?.user_metadata?.last_name ? 
      `${user.user_metadata.first_name} ${user.user_metadata.last_name}` : null) ||
    user?.email?.split('@')[0] ||
    'User'
  )
  const userInitials = profileLoading ? 'L' : (
    userProfile?.full_name 
      ? userProfile.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)
      : (userProfile?.first_name && userProfile?.last_name 
          ? `${userProfile.first_name[0]}${userProfile.last_name[0]}`.toUpperCase()
          : userProfile?.username?.[0]?.toUpperCase() || 
          // Fallback to Google OAuth data for initials
          (user?.user_metadata?.full_name || user?.user_metadata?.name || user?.user_metadata?.given_name)?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() ||
          user?.email?.[0]?.toUpperCase() || 'U')
  )
  


  const navigationItems = [
    { title: 'Home', href: '/home', icon: Home },
    { title: 'Resume Builder', href: '/resume-builder', icon: FileText },
    { 
      title: 'Career Games', 
      href: '/career-tools/games', 
      icon: Gamepad2
    },
    { title: 'Jobs', href: '/jobs/job-matching', icon: Briefcase },
    { 
      title: 'Talent Search', 
      href: '/talent-search', 
      icon: Users,
      dropdown: [
        { title: 'Leaderboards', href: '/leaderboards', icon: Trophy }
      ]
    },
    { title: 'About', href: '/about', icon: Users }
  ]

  // Check if navigation item is active
  const isActiveRoute = (href: string) => {
    if (href === '/home') {
      return pathname === '/home' || pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const [showSignOutDialog, setShowSignOutDialog] = useState(false)

  const handleSignOut = async () => {
    try {
      console.log('🔘 Sign out button clicked')
      console.log('👤 Current user:', user?.email)
      console.log('🔑 Auth state before sign out:', !!user)
      
      await signOut()
      console.log('✅ Sign out completed successfully')
      
      setIsMobileMenuOpen(false) // Close mobile menu if open
      setShowSignOutDialog(false)
      
      // Force a page refresh to ensure all state is cleared
      console.log('🔄 Redirecting to home page...')
      window.location.href = '/'
    } catch (error) {
      console.error('❌ Sign out error:', error)
      // Still close the dialog even if there's an error
      setShowSignOutDialog(false)
      alert('Sign out failed. Please try again.')
    }
  }

  const userMenuItems = [
    { 
      label: 'My Profile', 
      href: (userProfile?.slug ? `/profile/${userProfile.slug}` : '#'), 
      icon: FileTextIcon, 
      action: (!userProfile?.slug && !profileLoading) ? handleMyProfileClick : null,
      disabled: profileLoading
    },
    { label: 'My Resume', href: (savedResumeInfo?.resumeUrl || '/resume-builder'), icon: FileTextIcon, action: null, disabled: false },
    { label: 'My Applications', href: '/applications', icon: Briefcase, action: null, disabled: false },
    { label: 'Settings', href: '/settings', icon: Settings, action: null, disabled: false },
    { label: 'Sign Out', href: null, icon: LogOut, action: () => setShowSignOutDialog(true), disabled: false }
  ]

  // Add admin menu items if user is admin
  const adminMenuItems = isAdmin ? [
    { label: 'Admin Dashboard', href: '/admin/dashboard', icon: Shield, action: null, disabled: false }
  ] : []

  // Combine regular and admin menu items
  const allMenuItems = [...userMenuItems, ...adminMenuItems]

  // Form switching handlers
  const handleSwitchToSignUp = () => {
    setIsLoginDialogOpen(false)
    setTimeout(() => setIsSignUpDialogOpen(true), 100) // Small delay for smooth transition
  }

  const handleSwitchToLogin = () => {
    setIsSignUpDialogOpen(false)
    setTimeout(() => setIsLoginDialogOpen(true), 100) // Small delay for smooth transition
  }

  const handleOpenLogin = () => {
    setIsSignUpDialogOpen(false)
    setIsLoginDialogOpen(true)
    setIsMobileMenuOpen(false)
  }

  const handleOpenSignUp = () => {
    setIsLoginDialogOpen(false)
    setIsSignUpDialogOpen(true)
    setIsMobileMenuOpen(false)
  }

  // Remove signup query param when dialog closes so it can be re-triggered next time
  const clearSignupQueryParam = () => {
    if (typeof window === 'undefined') return
    try {
      const url = new URL(window.location.href)
      if (url.searchParams.has('signup')) {
        url.searchParams.delete('signup')
        // Replace without adding history entry
        router.replace(`${url.pathname}${url.search ? `?${url.searchParams.toString()}` : ''}`)
      }
    } catch {}
  }

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsHandler 
          user={user} 
          setIsSignUpDialogOpen={setIsSignUpDialogOpen} 
        />
      </Suspense>
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/home" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="w-8 h-8 glass-card flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold gradient-text">BPOC.IO</span>
              <span className="text-xs text-gray-400 -mt-1">Where BPO Careers Begin</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const isActive = isActiveRoute(item.href)
              
                                            // If item has dropdown, render dropdown component
              if (item.dropdown) {
                // Special case: Talent Search should be clickable
                if (item.title === 'Talent Search') {
                  return (
                    <div key={item.title} className="relative group">
                      <Link
                        href={item.href}
                        className={cn(
                          "relative font-medium transition-all duration-200 flex items-center",
                          isActive 
                            ? "text-cyan-400" 
                            : "text-white hover:text-cyan-400"
                        )}
                      >
                        {item.title}
                        <ChevronDown className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" />
                        {/* Active indicator */}
                        <div className={cn(
                          "absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-200",
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        )} />
                      </Link>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-0 mt-2 w-48 bg-black border border-white/10 rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-lg z-50">
                        {item.dropdown.map((dropdownItem: any) => (
                          dropdownItem.soon ? (
                            <div
                              key={dropdownItem.title}
                              className="flex items-center justify-between px-4 py-2 text-sm text-gray-500 cursor-not-allowed"
                            >
                              <div className="flex items-center space-x-2">
                                <dropdownItem.icon className="w-4 h-4" />
                                <span>{dropdownItem.title}</span>
                              </div>
                              <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                Soon
                              </Badge>
                            </div>
                          ) : (
                            <Link
                              key={dropdownItem.title}
                              href={dropdownItem.href}
                              className="flex items-center justify-between px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-center space-x-2">
                                <dropdownItem.icon className="w-4 h-4" />
                                <span>{dropdownItem.title}</span>
                              </div>
                            </Link>
                          )
                        ))}
                      </div>
                    </div>
                  )
                }
                
                // Default: Non-clickable dropdown (like Career Tools)
                return (
                  <div key={item.title} className="relative group">
                    <div
                      className={cn(
                        "relative font-medium transition-all duration-200 flex items-center cursor-pointer",
                        isActive 
                          ? "text-cyan-400" 
                          : "text-white hover:text-cyan-400"
                      )}
                    >
                      {item.title}
                      <ChevronDown className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" />
                      {/* Active indicator */}
                      <div className={cn(
                        "absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-200",
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      )} />
                    </div>
                    
                                                              {/* Dropdown Menu */}
                     <div className="absolute top-full left-0 mt-2 w-48 bg-black border border-white/10 rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-lg z-50">
                                               {item.dropdown.map((dropdownItem: any) => (
                          dropdownItem.soon ? (
                            <div
                              key={dropdownItem.title}
                              className="flex items-center justify-between px-4 py-2 text-sm text-gray-500 cursor-not-allowed"
                            >
                              <div className="flex items-center space-x-2">
                                <dropdownItem.icon className="w-4 h-4" />
                                <span>{dropdownItem.title}</span>
                              </div>
                              <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                Soon
                              </Badge>
                            </div>
                          ) : (
                            <Link
                              key={dropdownItem.title}
                              href={dropdownItem.href}
                              className="flex items-center justify-between px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-center space-x-2">
                                <dropdownItem.icon className="w-4 h-4" />
                                <span>{dropdownItem.title}</span>
                              </div>
                            </Link>
                          )
                        ))}
                     </div>
                  </div>
                )
              }
              
              // Regular navigation item
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "relative font-medium transition-all duration-200 group",
                    isActive 
                      ? "text-cyan-400" 
                      : "text-white hover:text-cyan-400"
                  )}
                >
                  {item.title}
                  {/* Active indicator */}
                  <div className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-200",
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="hidden md:flex items-center space-x-4">


                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 glass-button px-3 py-2 rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full flex items-center justify-center overflow-hidden">
                      {userProfile?.avatar_url ? (
                        <img
                          src={userProfile.avatar_url}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-black">
                          {userInitials}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{userDisplayName}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-black border border-white/10 rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl shadow-black/50">
                    {allMenuItems.map((item) => (
                      item.href && item.href !== '#' ? (
                        <Link
                          key={item.label}
                          href={item.href}
                          className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                            item.disabled 
                              ? 'text-gray-500 cursor-not-allowed' 
                              : 'hover:bg-white/10'
                          }`}
                          onClick={item.disabled ? (e) => e.preventDefault() : undefined}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>
                            {item.label}
                            {item.disabled && ' (Loading...)'}
                          </span>
                        </Link>
                      ) : (
                        <button
                          key={item.label}
                          onClick={item.action || (() => {})}
                          className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors w-full text-left ${
                            item.disabled 
                              ? 'text-gray-500 cursor-not-allowed' 
                              : 'hover:bg-white/10'
                          }`}
                          disabled={item.disabled}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>
                            {item.label}
                            {item.disabled && ' (Loading...)'}
                          </span>
                        </button>
                      )
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2 ml-auto">
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-cyan-400 hover:bg-white/10 transition-all duration-200 px-3"
                  onClick={handleOpenLogin}
                  data-signin-button
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button 
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 transition-all duration-200 px-4"
                  onClick={handleOpenSignUp}
                >
                  Get Started Free
                </Button>
                <div className="ml-4">
                  <Link href="/recruiter">
                    <Button 
                      variant="ghost" 
                      className="text-white hover:text-cyan-400 hover:bg-white/10 transition-all duration-200 px-3"
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      Recruiter/Post Job
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[300px] bg-black border border-white/10">
                  <div className="flex flex-col space-y-6 mt-6">
                    {/* Mobile User Info */}
                    {isAuthenticated && user && (
                      <div className="bg-black border border-white/10 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full flex items-center justify-center overflow-hidden">
                            {userProfile?.avatar_url ? (
                              <img
                                src={userProfile.avatar_url}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-bold text-black">
                                {userInitials}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{userDisplayName}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mobile Navigation */}
                    <nav className="space-y-2">
                      {navigationItems.map((item) => {
                        const isActive = isActiveRoute(item.href)
                        
                                                 // If item has dropdown, render main item and dropdown items
                         if (item.dropdown) {
                           // Special case: Talent Search should be clickable
                           if (item.title === 'Talent Search') {
                             return (
                               <div key={item.title}>
                                 <Link
                                   href={item.href}
                                   className={cn(
                                     "flex items-center p-3 rounded-lg transition-all duration-200 font-medium relative",
                                     isActive 
                                       ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30" 
                                       : "hover:bg-white/10"
                                   )}
                                   onClick={() => setIsMobileMenuOpen(false)}
                                 >
                                   <item.icon className="w-5 h-5 mr-3" />
                                   {item.title}
                                   <ChevronDown className="w-4 h-4 ml-auto" />
                                   {/* Active indicator for mobile */}
                                   {isActive && (
                                     <div className="absolute right-3 w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full" />
                                   )}
                                 </Link>
                                 
                                 {/* Dropdown items */}
                                 <div className="ml-6 space-y-1">
                                   {item.dropdown.map((dropdownItem: any) => (
                                     dropdownItem.soon ? (
                                       <div
                                         key={dropdownItem.title}
                                         className="flex items-center justify-between p-2 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                                       >
                                         <div className="flex items-center">
                                           <dropdownItem.icon className="w-4 h-4 mr-3" />
                                           {dropdownItem.title}
                                         </div>
                                         <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                           Soon
                                         </Badge>
                                       </div>
                                     ) : (
                                       <Link
                                         key={dropdownItem.title}
                                         href={dropdownItem.href}
                                         className="flex items-center justify-between p-2 rounded-lg transition-all duration-200 text-sm text-gray-300 hover:text-white hover:bg-white/5"
                                         onClick={() => setIsMobileMenuOpen(false)}
                                       >
                                         <div className="flex items-center">
                                           <dropdownItem.icon className="w-4 h-4 mr-3" />
                                           {dropdownItem.title}
                                         </div>
                                       </Link>
                                     )
                                   ))}
                                 </div>
                               </div>
                             )
                           }
                           
                           // Default: Non-clickable dropdown (like Career Tools)
                           return (
                             <div key={item.title}>
                               <div
                                 className={cn(
                                   "flex items-center p-3 rounded-lg transition-all duration-200 font-medium relative cursor-pointer",
                                   isActive 
                                     ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30" 
                                     : "hover:bg-white/10"
                                 )}
                               >
                                 <item.icon className="w-5 h-5 mr-3" />
                                 {item.title}
                                 <ChevronDown className="w-4 h-4 ml-auto" />
                                 {/* Active indicator for mobile */}
                                 {isActive && (
                                   <div className="absolute right-3 w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full" />
                                 )}
                               </div>
                              
                                                                                            {/* Dropdown items */}
                               <div className="ml-6 space-y-1">
                                                                   {item.dropdown.map((dropdownItem: any) => (
                                    dropdownItem.soon ? (
                                      <div
                                        key={dropdownItem.title}
                                        className="flex items-center justify-between p-2 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                                      >
                                        <div className="flex items-center">
                                          <dropdownItem.icon className="w-4 h-4 mr-3" />
                                          {dropdownItem.title}
                                        </div>
                                        <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                          Soon
                                        </Badge>
                                      </div>
                                    ) : (
                                      <Link
                                        key={dropdownItem.title}
                                        href={dropdownItem.href}
                                        className="flex items-center justify-between p-2 rounded-lg transition-all duration-200 text-sm text-gray-300 hover:text-white hover:bg-white/5"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                      >
                                        <div className="flex items-center">
                                          <dropdownItem.icon className="w-4 h-4 mr-3" />
                                          {dropdownItem.title}
                                        </div>
                                      </Link>
                                    )
                                  ))}
                               </div>
                            </div>
                          )
                        }
                        
                        // Regular navigation item
                        return (
                          <Link
                            key={item.title}
                            href={item.href}
                            className={cn(
                              "flex items-center p-3 rounded-lg transition-all duration-200 font-medium relative",
                              isActive 
                                ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30" 
                                : "hover:bg-white/10"
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <item.icon className="w-5 h-5 mr-3" />
                            {item.title}
                            {/* Active indicator for mobile */}
                            {isActive && (
                              <div className="absolute right-3 w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full" />
                            )}
                          </Link>
                        )
                      })}
                    </nav>

                    {/* Mobile Auth Buttons */}
                    {!isAuthenticated && (
                      <div className="space-y-3 pt-6 border-t border-white/10">
                        <Button 
                          variant="outline" 
                          className="w-full border-white/20 text-white hover:bg-white/10 transition-all duration-200"
                          onClick={handleOpenLogin}
                          data-signin-button
                        >
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In
                        </Button>
                        <Button 
                          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 transition-all duration-200"
                          onClick={handleOpenSignUp}
                        >
                          Get Started Free
                        </Button>
                        <Link href="/recruiter" className="w-full">
                          <Button 
                            variant="outline" 
                            className="w-full border-white/20 text-white hover:bg-white/10 transition-all duration-200"
                          >
                            <Briefcase className="w-4 h-4 mr-2" />
                            Recruiter/Post Job
                          </Button>
                        </Link>
                      </div>
                    )}

                    {/* Mobile User Menu */}
                    {isAuthenticated && (
                      <div className="space-y-2 pt-6 border-t border-white/10">
                        {allMenuItems.map((item) => (
                          item.href && item.href !== '#' ? (
                            <Link
                              key={item.label}
                              href={item.href}
                              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                item.disabled 
                                  ? 'text-gray-500 cursor-not-allowed' 
                                  : 'hover:bg-white/10'
                              }`}
                              onClick={item.disabled ? (e) => e.preventDefault() : () => setIsMobileMenuOpen(false)}
                            >
                              <item.icon className="w-5 h-5" />
                              <span>
                                {item.label}
                                {item.disabled && ' (Loading...)'}
                              </span>
                            </Link>
                          ) : (
                            <button
                              key={item.label}
                              onClick={item.action || (() => {})}
                              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors w-full text-left ${
                                item.disabled 
                                  ? 'text-gray-500 cursor-not-allowed' 
                                  : 'hover:bg-white/10'
                              }`}
                              disabled={item.disabled}
                            >
                              <item.icon className="w-5 h-5" />
                              <span>
                                {item.label}
                                {item.disabled && ' (Loading...)'}
                              </span>
                            </button>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
      
      {/* Login Dialog */}
      <LoginForm 
        open={isLoginDialogOpen} 
        onOpenChange={setIsLoginDialogOpen}
        onSwitchToSignUp={handleSwitchToSignUp}
      />
      
      {/* Sign Up Dialog */}
      <SignUpForm 
        open={isSignUpDialogOpen} 
        onOpenChange={(open) => {
          setIsSignUpDialogOpen(open)
          if (!open) clearSignupQueryParam()
        }}
        onSwitchToLogin={handleSwitchToLogin}
      />
      
      {/* Sign Out Alert Dialog */}
      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent className="bg-black border border-white/10 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Sign Out</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to sign out? You'll need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSignOut}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </header>
    </>
  )
} 
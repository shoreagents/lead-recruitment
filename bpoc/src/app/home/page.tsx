'use client'

import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect, Suspense } from 'react'
import Header from '@/components/layout/Header'
import Hero from '@/components/sections/Hero'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  BrainIcon,
  GamepadIcon,
  Trophy,
  Users,
  Target,
  TrendingUp,
  Star,
  Quote,
  CheckCircle,
  Sparkles,
  Globe,
  Shield,
  Zap,
  MessageSquare,
  Calculator,
  BarChart,
  X,
  Crown,
  Medal,
  Award,
  Building2
} from 'lucide-react'
import { formatNumber, generateInitials } from '@/lib/utils'
import ProfileCompletionModal from '@/components/auth/ProfileCompletionModal'

function HomePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, signOut } = useAuth()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [showRecruiterModal, setShowRecruiterModal] = useState(false)

  // Early check: Sign out recruiters if they access /home
  useEffect(() => {
    const handleRecruiterAccess = async () => {
      if (user?.user_metadata?.admin_level === 'recruiter') {
        console.log('🚫 HomePage: Recruiter detected, showing recruiter redirect modal')
        setShowRecruiterModal(true)
        await signOut()
      }
    }
    
    handleRecruiterAccess()
  }, [user, signOut])

  // RankBadge component for leaderboards
  const RankBadge = ({ rank }: { rank: number }) => {
    if (rank === 1) return (
      <motion.div 
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="relative w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 flex items-center justify-center shadow-xl shadow-yellow-500/40 ring-3 ring-yellow-400/30"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200/30 to-transparent" />
        <Crown className="w-6 h-6 text-yellow-900 drop-shadow-sm" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full flex items-center justify-center">
          <Sparkles className="w-2 h-2 text-yellow-800" />
        </div>
      </motion.div>
    )
    if (rank === 2) return (
      <motion.div 
        initial={{ scale: 0.8, rotate: 10 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: -3 }}
        className="relative w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 flex items-center justify-center shadow-xl shadow-gray-400/30 ring-3 ring-gray-300/40"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-100/40 to-transparent" />
        <Medal className="w-6 h-6 text-gray-700 drop-shadow-sm" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-200 rounded-full flex items-center justify-center">
          <Star className="w-2 h-2 text-gray-600" />
        </div>
      </motion.div>
    )
    if (rank === 3) return (
      <motion.div 
        initial={{ scale: 0.8, rotate: -5 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 2 }}
        className="relative w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 via-orange-500 to-orange-600 flex items-center justify-center shadow-xl shadow-orange-500/30 ring-3 ring-orange-400/30"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-300/30 to-transparent" />
        <Award className="w-6 h-6 text-orange-100 drop-shadow-sm" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full flex items-center justify-center">
          <Zap className="w-2 h-2 text-orange-800" />
        </div>
      </motion.div>
    )
    return (
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 text-cyan-300 border-2 border-cyan-400/40 flex items-center justify-center text-sm font-bold shadow-lg shadow-cyan-500/20 hover:border-cyan-400/60 transition-all duration-200"
      >
        #{rank}
      </motion.div>
    )
  }
  const [platformStats, setPlatformStats] = useState({
    totalUsers: 0,
    activeResumes: 0,
    activeJobs: 0,
    // Static marketing stats
    hiddenFees: 100,
    minutes: 5
  })
  const [topUsers, setTopUsers] = useState<Array<{ rank: number; userId: string; score: number; user?: { full_name: string | null; avatar_url: string | null } | null }>>([])
  const [lbLoading, setLbLoading] = useState(false)
  const [lbError, setLbError] = useState('')

  // Testimonials data
  const testimonialsData = [
    {
      name: 'Lainie',
      avatar: '/images/testimonials/lainie.png',
      text: 'A great place to work. Work-life balance, we only work 5 days a week, co-employees are friendly and have a healthy environment.'
    },
    {
      name: 'Rikki',
      avatar: '/images/testimonials/rikki.png',
      text: 'ShoreAgents is an excellent company for those seeking a healthy work-life balance. There are numerous activities and treats that you will undoubtedly appreciate. ShoreAgents will assist you in growing and stepping beyond of your comfort zone. Strongly recommended! ❤️'
    },
    {
      name: 'Dana',
      avatar: '/images/testimonials/dana.png',
      text: 'This is not only a company but it is a family, They are truly heart warming, happy environment plus lots of fun activities that they make sure that you have the work life balance! I really recommend everyone to apply in ShoreAgents and experience the happiness!'
    },
    {
      name: 'Arra',
      avatar: '/images/testimonials/arra.png',
      text: 'I enjoy working in the company; people are good, there are lots of goodies, and they encourage you to do better and work outside your comfort zone. 🥰🥰🥰'
    },
    {
      name: 'Kevin',
      avatar: '/images/testimonials/kevin.png',
      text: 'Highly recommended! Admins are very nice and approachable. They give out free pizza, burgers, cupcakes, and more every now and then to make sure staff’s are appreciated. Good working environment too.'
    },
    {
      name: 'Crizza',
      avatar: '/images/testimonials/crizza.png',
      text: 'This is a less stress workplace, you only have 8-9 hours of stress, 5 days of the week—work life balance—a place where you can enhance your knowledge and grow your skills while also having fun ’cause there are goodies and games! So rare to find those nowadays.'
    }
  ]
  const itemsPerView = 3
  const [currentIndex, setCurrentIndex] = useState(0)

  // Fetch platform statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/platform')
        if (response.ok) {
          const data = await response.json()
          // Merge so static fields (hiddenFees, minutes) are preserved
          setPlatformStats((prev) => ({ ...prev, ...data }))
        }
      } catch (error) {
        console.error('Failed to fetch platform stats:', error)
      }
    }

    fetchStats()
  }, [])

  // Load top users (leaderboards)
  useEffect(() => {
    const loadTop = async () => {
      try {
        setLbLoading(true)
        setLbError('')
        const res = await fetch('/api/leaderboards?category=overall&limit=5&offset=0', { cache: 'no-store' })
        if (!res.ok) throw new Error(`Failed: ${res.status}`)
        const data = await res.json()
        setTopUsers(data?.results || [])
      } catch (e: any) {
        setLbError(e?.message || 'Failed to load top users')
        setTopUsers([])
      } finally {
        setLbLoading(false)
      }
    }
    loadTop()
  }, [])

  // Autoplay for testimonials carousel
  useEffect(() => {
    const maxIndex = Math.max(0, testimonialsData.length - itemsPerView)
    const id = setInterval(() => {
      setCurrentIndex((s) => (s + 1) % (maxIndex + 1))
    }, 5000)
    return () => clearInterval(id)
  }, [testimonialsData.length])

  // Check URL parameters for sign-in flow from sign-up
  useEffect(() => {
    const action = searchParams.get('action')
    const source = searchParams.get('source')
    
    if (action === 'signin' && source === 'signup') {
      console.log('🔄 Detected sign-up flow, opening sign-in modal')
      // Clear the URL parameters
      const url = new URL(window.location.href)
      url.searchParams.delete('action')
      url.searchParams.delete('source')
      window.history.replaceState({}, '', url.toString())
      
      // Open sign-in modal by triggering a click on the sign-in button
      // We'll use a small delay to ensure the page is fully loaded
      setTimeout(() => {
        const signInButton = document.querySelector('[data-signin-button]') as HTMLButtonElement
        if (signInButton) {
          signInButton.click()
        }
      }, 1000)
    }
  }, [searchParams])

  // Check if user needs to complete profile
  useEffect(() => {
    const checkProfileCompletion = async (retryCount = 0) => {
      if (!user) {
        setProfileLoading(false)
        return
      }

      try {
        console.log('🔄 HomePage: Fetching profile for user:', user.id, retryCount > 0 ? `(retry ${retryCount})` : '')
        console.log('🔄 HomePage: User object:', {
          id: user.id,
          email: user.email,
          metadata: user.user_metadata
        })
        
        // Add a small delay for the first attempt to allow OAuth metadata to be processed
        if (retryCount === 0) {
          console.log('⏳ HomePage: Waiting 300ms for OAuth metadata to be processed...')
          await new Promise(resolve => setTimeout(resolve, 300))
        }
        
        // Test if the API endpoint is accessible
        console.log('🔄 HomePage: Testing API endpoint accessibility...')
        const testUrl = `/api/user/profile?userId=${user.id}`
        console.log('🔄 HomePage: API URL:', testUrl)
        console.log('🔄 HomePage: Current origin:', window.location.origin)
        
        let response
        try {
          response = await fetch(`/api/user/profile?userId=${user.id}`)
          console.log('🔄 HomePage: Profile API response status:', response.status)
          console.log('🔄 HomePage: Profile API response headers:', Object.fromEntries(response.headers.entries()))
        } catch (fetchError) {
          console.error('❌ HomePage: Fetch error occurred:', fetchError)
          console.error('❌ HomePage: Fetch error details:', {
            name: fetchError?.name,
            message: fetchError?.message,
            stack: fetchError?.stack,
            type: typeof fetchError,
            constructor: fetchError?.constructor?.name,
            url: `/api/user/profile?userId=${user.id}`,
            userId: user.id
          })
          
          // Retry for network errors
          if (retryCount < 2) {
            const delay = retryCount === 0 ? 1000 : 2000
            console.log(`🔄 HomePage: Retrying due to network error in ${delay}ms (attempt ${retryCount + 1})`)
            setTimeout(() => checkProfileCompletion(retryCount + 1), delay)
            return
          }
          
          // Don't throw the error, handle it gracefully
          console.log('🔄 HomePage: Handling fetch error gracefully after retries failed...')
          setUserProfile(null)
          return
        }
        
        if (response.ok) {
          const data = await response.json()
          const profile = data.user
          console.log('✅ HomePage: Profile loaded successfully:', profile)
          setUserProfile(profile)
          
          // Sign out recruiters and show modal
          if (profile.admin_level === 'recruiter') {
            console.log('🚫 HomePage: User is a recruiter, showing recruiter redirect modal')
            setShowRecruiterModal(true)
            await signOut()
            return
          }
          
          // Show modal if completed_data is false
          if (profile.completed_data === false) {
            console.log('📝 HomePage: Showing profile completion modal for regular user')
            setShowProfileModal(true)
          }
        } else {
          let errorData = {}
          let errorText = ''
          
          console.log('🔍 HomePage: Response not OK, debugging response...')
          console.log('🔍 HomePage: Response status:', response.status)
          console.log('🔍 HomePage: Response statusText:', response.statusText)
          console.log('🔍 HomePage: Response headers:', Object.fromEntries(response.headers.entries()))
          
          try {
            errorData = await response.json()
            console.log('🔍 HomePage: Parsed JSON error data:', errorData)
          } catch (jsonError) {
            console.log('⚠️ HomePage: Response is not JSON, trying to get text...')
            console.log('⚠️ HomePage: JSON parse error:', jsonError)
            try {
              errorText = await response.text()
              console.log('📄 HomePage: Response text:', errorText)
            } catch (textError) {
              console.log('⚠️ HomePage: Could not get response text either')
              console.log('⚠️ HomePage: Text parse error:', textError)
            }
          }
          
          const errorInfo = {
            status: response.status,
            statusText: response.statusText,
            error: errorData.error || errorText || 'Unknown error',
            details: errorData.details || 'No details available',
            url: `/api/user/profile?userId=${user.id}`,
            userId: user.id,
            timestamp: new Date().toISOString(),
            rawErrorData: errorData,
            rawErrorText: errorText
          }
          
          console.error('❌ HomePage: Failed to fetch user profile:', errorInfo)
          
          // Retry for certain error statuses
          if ((response.status >= 500 || response.status === 0) && retryCount < 2) {
            const delay = retryCount === 0 ? 1000 : 2000
            console.log(`🔄 HomePage: Retrying due to server error (${response.status}) in ${delay}ms (attempt ${retryCount + 1})`)
            setTimeout(() => checkProfileCompletion(retryCount + 1), delay)
            return
          }
          
          // If user not found (404), they might not be synced to Railway yet
          if (response.status === 404) {
            console.log('⚠️ HomePage: User not found in Railway database, they may need to be synced')
            console.log('🔄 HomePage: Attempting to trigger user sync...')
            console.log('🔄 HomePage: User metadata for sync:', user.user_metadata)
            
            // Try to trigger user sync by calling the sync endpoint
            try {
              // Parse name data from Google metadata with better extraction
              let firstName = user.user_metadata?.first_name || user.user_metadata?.given_name || ''
              let lastName = user.user_metadata?.last_name || user.user_metadata?.family_name || ''
              let fullName = user.user_metadata?.full_name || user.user_metadata?.name || ''
              
              console.log('🔍 HomePage Google metadata name fields:', {
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
                fullName = user.email
                firstName = user.email.split('@')[0]
                lastName = ''
              }
              
              console.log('🔍 HomePage parsed name data:', {
                firstName,
                lastName,
                fullName
              })

              const syncData = {
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
                admin_level: user.user_metadata?.admin_level || 'user'
              }
              
              console.log('🔄 HomePage: Sending sync data:', syncData)
              
              const syncResponse = await fetch('/api/user/sync', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(syncData)
              })
              
              console.log('🔄 HomePage: Sync API response status:', syncResponse.status)
              
              if (syncResponse.ok) {
                const syncResult = await syncResponse.json()
                console.log('✅ HomePage: User sync successful:', syncResult)
                console.log('✅ HomePage: User sync successful, retrying profile fetch...')
                // Retry fetching the profile after sync
                const retryResponse = await fetch(`/api/user/profile?userId=${user.id}`)
                if (retryResponse.ok) {
                  const retryData = await retryResponse.json()
                  setUserProfile(retryData.user)
                  
                  // Sign out recruiters and show modal
                  if (retryData.user.admin_level === 'recruiter') {
                    console.log('🚫 HomePage: User is a recruiter, showing recruiter redirect modal')
                    setShowRecruiterModal(true)
                    await signOut()
                    return
                  }
                  
                  // Only show modal for regular users
                  if (retryData.user.completed_data === false) {
                    setShowProfileModal(true)
                  }
                }
              } else {
                const syncErrorData = await syncResponse.json().catch(() => ({}))
                console.error('❌ HomePage: User sync failed:', {
                  status: syncResponse.status,
                  statusText: syncResponse.statusText,
                  error: syncErrorData.error || 'Unknown sync error',
                  details: syncErrorData.details || 'No details available'
                })
                // Set fallback profile when sync fails
                const fallbackProfile = {
                  id: user.id,
                  email: user.email,
                  first_name: user.user_metadata?.first_name || user.user_metadata?.given_name || '',
                  last_name: user.user_metadata?.last_name || user.user_metadata?.family_name || '',
                  full_name: user.user_metadata?.full_name || user.user_metadata?.name || 
                            (user.user_metadata?.given_name && user.user_metadata?.family_name ? 
                              `${user.user_metadata.given_name} ${user.user_metadata.family_name}` : null) ||
                            user.email?.split('@')[0] || 'User',
                  avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
                  completed_data: false
                }
                setUserProfile(fallbackProfile)
              }
            } catch (syncError) {
              console.error('❌ HomePage: Error during user sync:', syncError)
              // Set fallback profile when sync error occurs
              const fallbackProfile = {
                id: user.id,
                email: user.email,
                first_name: user.user_metadata?.first_name || user.user_metadata?.given_name || '',
                last_name: user.user_metadata?.last_name || user.user_metadata?.family_name || '',
                full_name: user.user_metadata?.full_name || user.user_metadata?.name || 
                          (user.user_metadata?.given_name && user.user_metadata?.family_name ? 
                            `${user.user_metadata.given_name} ${user.user_metadata.family_name}` : null) ||
                          user.email?.split('@')[0] || 'User',
                avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
                completed_data: false
              }
              setUserProfile(fallbackProfile)
            }
          }
        }
      } catch (error) {
        console.error('❌ HomePage: Error checking profile completion:', error)
        
        // Better error handling with more specific error information
        if (error instanceof Error) {
          console.error('❌ HomePage: Error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack,
            userId: user.id
          })
          
          // Try to get more specific error information
          if (error.name === 'TypeError' && error.message.includes('fetch')) {
            console.error('🌐 Network error detected - possible CORS, DNS, or connection issue')
          } else if (error.name === 'DOMException') {
            console.error('🚫 DOM exception - possible browser security issue')
          } else if (error.name === 'AbortError') {
            console.error('⏹️ Request was aborted')
          } else {
            console.error('❓ Error type:', error.name, 'Message:', error.message)
          }
        } else {
          console.error('❌ HomePage: Non-Error object thrown:', {
            error,
            type: typeof error,
            string: String(error),
            userId: user.id
          })
        }
        
        // Retry after a delay if fetch failed and we haven't retried too many times
        if (retryCount < 2) {
          const delay = retryCount === 0 ? 1000 : 2000
          console.log(`🔄 HomePage: Retrying profile fetch in ${delay}ms (attempt ${retryCount + 1})`)
          setTimeout(() => checkProfileCompletion(retryCount + 1), delay)
          return
        }
        
        // Set a fallback profile using Google OAuth data when profile fetch fails
        const fallbackProfile = {
          id: user.id,
          email: user.email,
          first_name: user.user_metadata?.first_name || user.user_metadata?.given_name || '',
          last_name: user.user_metadata?.last_name || user.user_metadata?.family_name || '',
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || 
                    (user.user_metadata?.given_name && user.user_metadata?.family_name ? 
                      `${user.user_metadata.given_name} ${user.user_metadata.family_name}` : null) ||
                    user.email?.split('@')[0] || 'User',
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
          completed_data: false // Assume not completed if we can't fetch from database
        }
        console.log('🔄 HomePage: Using fallback profile data after retries failed:', fallbackProfile)
        setUserProfile(fallbackProfile)
      } finally {
        setProfileLoading(false)
      }
    }

    checkProfileCompletion()
  }, [user])

  const handleProfileComplete = () => {
    setShowProfileModal(false)
    // Refresh the user profile data
    if (userProfile) {
      setUserProfile(prev => prev ? { ...prev, completed_data: true } : null)
    }
  }

  // Listen for profile updates from the profile completion modal
  useEffect(() => {
    const handleProfileUpdate = async () => {
      console.log('🔄 HomePage: Profile update event received, refreshing profile data...')
      if (user?.id) {
        try {
          setProfileLoading(true)
          const response = await fetch(`/api/user/profile?userId=${user.id}`)
          if (response.ok) {
            const data = await response.json()
            console.log('✅ HomePage: Profile refreshed after update:', data.user)
            setUserProfile(data.user)
          } else {
            let errorData = {}
            let errorText = ''
            
            try {
              errorData = await response.json()
            } catch (jsonError) {
              try {
                errorText = await response.text()
              } catch (textError) {
                console.log('⚠️ HomePage: Could not get error response text')
              }
            }
            
            console.error('❌ HomePage: Failed to refresh profile after update:', {
              status: response.status,
              statusText: response.statusText,
              error: errorData.error || errorText || 'Unknown error',
              details: errorData.details || 'No details available',
              url: `/api/user/profile?userId=${user.id}`,
              userId: user.id,
              timestamp: new Date().toISOString()
            })
          }
        } catch (error) {
          console.error('❌ HomePage: Error refreshing profile after update:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            name: error instanceof Error ? error.name : 'Unknown',
            stack: error instanceof Error ? error.stack : undefined,
            type: typeof error,
            userId: user.id,
            timestamp: new Date().toISOString()
          })
        } finally {
          setProfileLoading(false)
        }
      }
    }

    window.addEventListener('profileUpdated', handleProfileUpdate)
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate)
    }
  }, [user?.id])

  const handleCloseModal = () => {
    setShowProfileModal(false)
  }

  const handleBuildResume = () => {
    router.push('/resume-builder')
  }

  const handleCreateAccount = () => {
    if (!user) {
      // Trigger signup dialog via query param on the current home route
      router.push('/home?signup=true')
    } else {
      router.push('/resume-builder')
    }
  }

  // Navigation handlers for feature cards
  const handleNavigateToCareerGames = () => {
    router.push('/career-tools/games')
  }

  const handleNavigateToJobMatching = () => {
    router.push('/jobs/job-matching')
  }

  return (
    <main className="bg-black text-white">
      <Header />
      
      <Hero />

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Platform Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to 
              <span className="gradient-text"> Succeed in BPO</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our comprehensive platform combines AI technology with industry expertise 
              to accelerate your BPO career journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: 'AI Resume Builder',
                description: 'Create professional resumes with real-time AI analysis and industry-specific templates.',
                color: 'text-red-400',
                bgColor: 'bg-red-500/10',
                features: ['AI Analysis', 'BPO Templates', 'Real-time Scoring'],
                hasButton: true,
                buttonText: 'Build Resume',
                buttonAction: handleBuildResume,
                buttonColor: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
              },
              {
                icon: GamepadIcon,
                title: 'Career Games',
                description: 'Interactive games and assessments to test your typing speed, personality, and BPO skills.',
                color: 'text-green-400',
                bgColor: 'bg-green-500/10',
                features: ['Typing Hero', 'DISC Personality', 'Performance Analytics'],
                hasButton: true,
                buttonText: 'Play Games',
                buttonAction: handleNavigateToCareerGames,
                buttonColor: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
              },
              {
                icon: Target,
                title: 'Job Matching',
                description: 'Smart AI-powered job matching that connects you with the perfect BPO opportunities.',
                color: 'text-purple-400',
                bgColor: 'bg-purple-500/10',
                features: ['Smart Matching', 'Skill Analysis', 'Company Fit'],
                hasButton: true,
                buttonText: 'Find Jobs',
                buttonAction: handleNavigateToJobMatching,
                buttonColor: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
              },
              {
                icon: BrainIcon,
                title: 'Career Assessments',
                description: 'Comprehensive tests covering typing, personality, logic, and industry-specific skills.',
                color: 'text-cyan-400',
                bgColor: 'bg-cyan-500/10',
                features: ['DISC Personality', 'Typing Test', 'Logic Assessment'],
                hasButton: true,
                buttonText: 'Coming Soon',
                buttonAction: () => {},
                buttonColor: 'bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed opacity-75',
                isComingSoon: true
              },
              {
                icon: Calculator,
                title: 'Salary Calculator',
                description: 'Get accurate salary estimates based on your skills, experience, and location.',
                color: 'text-yellow-400',
                bgColor: 'bg-yellow-500/10',
                features: ['Market Data', 'Skill Premium', 'Location Analysis'],
                hasButton: true,
                buttonText: 'Coming Soon',
                buttonAction: () => {},
                buttonColor: 'bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed opacity-75',
                isComingSoon: true
              },
              {
                icon: BarChart,
                title: 'Career Growth',
                description: 'Track your progress and discover personalized career advancement paths.',
                color: 'text-indigo-400',
                bgColor: 'bg-indigo-500/10',
                features: ['Progress Tracking', 'Skill Roadmap', 'Career Paths'],
                hasButton: true,
                buttonText: 'Coming Soon',
                buttonAction: () => {},
                buttonColor: 'bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed opacity-75',
                isComingSoon: true
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card border-white/10 h-full hover:border-white/20 transition-all duration-300 group">
                  <CardHeader>
                    <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {feature.features.map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                    {feature.hasButton && (
                      <Button
                        onClick={feature.buttonAction}
                        disabled={feature.isComingSoon}
                        className={`w-full text-white border-0 shadow-lg transition-all duration-300 ${!feature.isComingSoon ? 'group-hover:scale-105' : ''} ${feature.buttonColor}`}
                      >
                        {feature.buttonText}
                        {!feature.isComingSoon && <ArrowRight className="w-4 h-4 ml-2" />}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Why Choose BPOC.IO Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-4">
              <Target className="w-4 h-4 mr-2" />
              Competitive Analysis
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="gradient-text">BPOC.IO</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how we compare to traditional job platforms and other career tools.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Traditional Job Sites */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group"
            >
              <Card className="glass-card border-white/10 hover:border-red-400/20 h-full transition-all duration-300 group-hover:scale-[1.02] opacity-80 group-hover:opacity-90">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-xl text-white mb-2 flex items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                      <X className="w-4 h-4 text-red-400" />
                    </div>
                    Traditional Job Sites
                  </CardTitle>
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-red-400/30 to-transparent mx-auto"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3 group/item hover:bg-red-500/5 rounded-lg p-2 transition-colors">
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <X className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="text-gray-300 text-sm">Generic resume templates</span>
                  </div>
                  <div className="flex items-start space-x-3 group/item hover:bg-red-500/5 rounded-lg p-2 transition-colors">
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <X className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="text-gray-300 text-sm">No BPO-specific guidance</span>
                  </div>
                  <div className="flex items-start space-x-3 group/item hover:bg-red-500/5 rounded-lg p-2 transition-colors">
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <X className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="text-gray-300 text-sm">Limited career tools</span>
                  </div>
                  <div className="flex items-start space-x-3 group/item hover:bg-red-500/5 rounded-lg p-2 transition-colors">
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <X className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="text-gray-300 text-sm">No AI-powered insights</span>
                  </div>
                  <div className="flex items-start space-x-3 group/item hover:bg-red-500/5 rounded-lg p-2 transition-colors">
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <X className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="text-gray-300 text-sm">Generic job matching</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* BPOC.IO - Center Column with Recommendation Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative group"
            >
              {/* Recommended Badge */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 px-6 py-2 text-sm font-bold shadow-lg shadow-red-500/25">
                  ✨ RECOMMENDED
                </Badge>
              </div>
              
              <Card className="glass-card border-red-500/40 hover:border-red-400/60 h-full relative overflow-hidden transition-all duration-300 group-hover:scale-[1.01] shadow-xl shadow-red-500/10 group-hover:shadow-red-500/20">
                {/* Enhanced Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-purple-500/5 to-pink-500/10 rounded-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl"></div>
                
                <CardHeader className="text-center pb-6 relative z-10">
                  <CardTitle className="text-2xl text-white mb-2 flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    BPOC.IO
                  </CardTitle>
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent mx-auto"></div>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <div className="flex items-start space-x-3 group/item hover:bg-green-500/5 rounded-lg p-2 transition-colors">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 shadow-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-white text-sm font-medium">AI-powered resume builder</span>
                  </div>
                  <div className="flex items-start space-x-3 group/item hover:bg-green-500/5 rounded-lg p-2 transition-colors">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 shadow-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-white text-sm font-medium">BPO-specific optimization</span>
                  </div>
                  <div className="flex items-start space-x-3 group/item hover:bg-green-500/5 rounded-lg p-2 transition-colors">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 shadow-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-white text-sm font-medium">Comprehensive career tools</span>
                  </div>
                  <div className="flex items-start space-x-3 group/item hover:bg-green-500/5 rounded-lg p-2 transition-colors">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 shadow-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-white text-sm font-medium">AI insights & recommendations</span>
                  </div>
                  <div className="flex items-start space-x-3 group/item hover:bg-green-500/5 rounded-lg p-2 transition-colors">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 shadow-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-white text-sm font-medium">Smart job matching</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Other Career Tools */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group"
            >
              <Card className="glass-card border-white/10 hover:border-red-400/20 h-full transition-all duration-300 group-hover:scale-[1.02] opacity-80 group-hover:opacity-90">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-xl text-white mb-2 flex items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                      <X className="w-4 h-4 text-red-400" />
                    </div>
                    Other Career Tools
                  </CardTitle>
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-red-400/30 to-transparent mx-auto"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3 group/item hover:bg-red-500/5 rounded-lg p-2 transition-colors">
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <X className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="text-gray-300 text-sm">Not BPO-focused</span>
                  </div>
                  <div className="flex items-start space-x-3 group/item hover:bg-red-500/5 rounded-lg p-2 transition-colors">
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <X className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="text-gray-300 text-sm">Expensive subscriptions</span>
                  </div>
                  <div className="flex items-start space-x-3 group/item hover:bg-red-500/5 rounded-lg p-2 transition-colors">
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <X className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="text-gray-300 text-sm">Limited Filipino context</span>
                  </div>
                  <div className="flex items-start space-x-3 group/item hover:bg-red-500/5 rounded-lg p-2 transition-colors">
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <X className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="text-gray-300 text-sm">No job matching</span>
                  </div>
                  <div className="flex items-start space-x-3 group/item hover:bg-red-500/5 rounded-lg p-2 transition-colors">
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <X className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="text-gray-300 text-sm">Generic advice</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How It<span className="gradient-text"> Works</span> 
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get your dream BPO job in just 5 simple steps with our AI-powered platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-4 max-w-7xl mx-auto relative">
            {/* Step 1 - Sign Up */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative group"
            >
              <Card className="glass-card border-white/10 hover:border-blue-400/30 h-full transition-all duration-300 group-hover:scale-105 relative overflow-hidden p-6">
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                  1
                </div>
                
                <CardContent className="p-0 text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Sign Up</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Create your BPOC.IO account to access all platform features and tools.
                  </p>
                </CardContent>
              </Card>
              
              {/* Arrow 1 */}
              <div className="hidden md:flex absolute -right-2 top-1/2 transform -translate-y-1/2 z-20">
                <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Step 2 - Upload Resume */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative group"
            >
              <Card className="glass-card border-white/10 hover:border-cyan-400/30 h-full transition-all duration-300 group-hover:scale-105 relative overflow-hidden p-6">
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                  2
                </div>
                
                <CardContent className="p-0 text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-all duration-300">
                      <FileText className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Upload Your Resume</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Upload your existing resume or start from scratch with our AI-powered builder.
                  </p>
                </CardContent>
              </Card>
              
              {/* Arrow 2 */}
              <div className="hidden md:flex absolute -right-2 top-1/2 transform -translate-y-1/2 z-20">
                <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Step 3 - AI Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative group"
            >
              <Card className="glass-card border-white/10 hover:border-purple-400/30 h-full transition-all duration-300 group-hover:scale-105 relative overflow-hidden p-6">
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                  3
                </div>
                
                <CardContent className="p-0 text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300">
                      <BrainIcon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">AI Analysis</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Our AI analyzes your resume and provides personalized recommendations.
                  </p>
                </CardContent>
              </Card>
              
              {/* Arrow 3 */}
              <div className="hidden md:flex absolute -right-2 top-1/2 transform -translate-y-1/2 z-20">
                <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Step 4 - Optimize & Improve */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative group"
            >
              <Card className="glass-card border-white/10 hover:border-green-400/30 h-full transition-all duration-300 group-hover:scale-105 relative overflow-hidden p-6">
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                  4
                </div>
                
                <CardContent className="p-0 text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/25 group-hover:shadow-green-500/40 transition-all duration-300">
                      <Target className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Optimize & Improve</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Address red flags, fill gaps, and optimize for BPO industry standards.
                  </p>
                </CardContent>
              </Card>
              
              {/* Arrow 4 */}
              <div className="hidden md:flex absolute -right-2 top-1/2 transform -translate-y-1/2 z-20">
                <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Step 5 - Land Your Dream Job */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="relative group"
            >
              <Card className="glass-card border-white/10 hover:border-yellow-400/30 h-full transition-all duration-300 group-hover:scale-105 relative overflow-hidden p-6">
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                  5
                </div>
                
                <CardContent className="p-0 text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-yellow-500/25 group-hover:shadow-yellow-500/40 transition-all duration-300">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Land Your Dream Job</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Apply with confidence and get matched with the best BPO opportunities.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Bottom divider line */}
          <div className="mt-16">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Top Users */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 mb-4">
              <Trophy className="w-4 h-4 mr-2" />
              Our top users
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              🏆 Top 5 Overall
            </h2>
            <p className="text-gray-300 mt-2">Recognizing the most engaged candidates across games, applications, and engagement.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card border-white/10 max-w-4xl mx-auto"
          >
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[80px] text-gray-300 text-center">Rank</TableHead>
                    <TableHead className="text-gray-300">User</TableHead>
                    <TableHead className="text-right text-gray-300">Overall</TableHead>
                    <TableHead className="text-right text-gray-300">Profile</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lbLoading && (
                    <TableRow><TableCell colSpan={4} className="text-gray-400">Loading...</TableCell></TableRow>
                  )}
                  {!lbLoading && lbError && (
                    <TableRow><TableCell colSpan={4} className="text-red-400">{lbError}</TableCell></TableRow>
                  )}
                  {!lbLoading && !lbError && topUsers.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-gray-400">No data</TableCell></TableRow>
                  )}
                  {!lbLoading && !lbError && topUsers.map((row: any) => {
                    const getRowStyling = (rank: number) => {
                      if (rank === 1) return "hover:bg-yellow-500/10 cursor-pointer border-b border-yellow-400/20 bg-gradient-to-r from-yellow-500/5 to-transparent"
                      if (rank === 2) return "hover:bg-gray-300/10 cursor-pointer border-b border-gray-300/20 bg-gradient-to-r from-gray-400/5 to-transparent"
                      if (rank === 3) return "hover:bg-orange-500/10 cursor-pointer border-b border-orange-400/20 bg-gradient-to-r from-orange-500/5 to-transparent"
                      return "hover:bg-white/5 cursor-pointer border-b border-white/10"
                    }

                    const getSpecialBadge = (rank: number) => {
                      if (rank === 1) return <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-900 border-yellow-400/50 font-bold">🥇 Champion</Badge>
                      if (rank === 2) return <Badge className="bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 border-gray-300/50 font-semibold">🥈 2nd Place</Badge>
                      if (rank === 3) return <Badge className="bg-gradient-to-r from-orange-400 to-orange-500 text-orange-900 border-orange-400/50 font-semibold">🥉 3rd Place</Badge>
                      return null
                    }

                    return (
                      <motion.tr 
                        key={`${row.userId}-${row.rank}`} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * (row.rank - 1) }}
                        className={getRowStyling(row.rank)}
                        onClick={() => {}}
                      >
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center w-full h-full min-h-[60px]">
                            <RankBadge rank={row.rank} />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center ${
                              row.rank === 1 ? 'ring-3 ring-yellow-400/50' :
                              row.rank === 2 ? 'ring-2 ring-gray-300/50' :
                              row.rank === 3 ? 'ring-2 ring-orange-400/50' :
                              'ring-2 ring-cyan-500/20'
                            }`}>
                              {row.user?.avatar_url ? (
                                <img src={row.user.avatar_url} alt={row.user?.full_name || row.userId} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">{generateInitials(row.user?.full_name || null)}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`font-semibold truncate ${
                                row.rank === 1 ? 'text-yellow-300' :
                                row.rank === 2 ? 'text-gray-200' :
                                row.rank === 3 ? 'text-orange-300' :
                                'text-cyan-300'
                              }`}>
                                {row.user?.full_name || row.userId}
                              </div>
                              {getSpecialBadge(row.rank)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{row.score}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-cyan-300 transition-all duration-200 hover:scale-105" onClick={async () => {
                            try {
                              const r = await fetch(`/api/users/${row.userId}/profile`, { cache: 'no-store' })
                              if (!r.ok) {
                                setShowProfileModal(true)
                                return
                              }
                              const data = await r.json()
                              if (data?.slug) {
                                router.push(`/${data.slug}?mode=profile`)
                              } else {
                                setShowProfileModal(true)
                              }
                            } catch {
                              setShowProfileModal(true)
                            }
                          }}>View Profile</Button>
                        </TableCell>
                      </motion.tr>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </motion.div>
          
          {/* View Full Leaderboards Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-8"
          >
            <Button
              onClick={() => router.push('/leaderboards')}
              className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white border-0 shadow-lg shadow-yellow-500/25 transition-all duration-300 hover:scale-105 px-8 py-3 text-lg font-semibold"
            >
              View Full Leaderboards
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 mb-4">
              <Trophy className="w-4 h-4 mr-2" />
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Success</span> Stories 
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how BPOC.IO has helped thousands of Filipino BPO professionals advance their careers.
            </p>
          </motion.div>

          {/* Testimonials Carousel */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="overflow-hidden px-1 md:px-2">
              <div className="flex gap-4 md:gap-6 transition-transform duration-500"
                style={{ transform: `translateX(-${currentIndex * (100 / 3 + 2)}%)` }}
              >
                {testimonialsData.map((t, index) => (
                  <motion.div
                    key={t.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + (index * 0.1) }}
                    className="w-full md:w-[32%] shrink-0 flex"
                  >
                    <Card className="glass-card border-white/10 p-5 md:p-6 min-h-[220px] w-full">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-white/10 flex items-center justify-center ring-2 ring-white/10">
                        <img src={t.avatar} alt={t.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-base">{t.name}</h3>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 mb-3">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-gray-300 leading-relaxed text-base italic">"{t.text}"</blockquote>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Arrows */}
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              aria-label="Previous"
              onClick={() => setCurrentIndex((s) => Math.max(0, s - 1))}
              className="absolute -left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full p-2 text-white shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              aria-label="Next"
              onClick={() => setCurrentIndex((s) => Math.min(s + 1, Math.max(0, testimonialsData.length - itemsPerView)))}
              className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full p-2 text-white shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>

            {/* Dots */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 mt-6"
            >
              {Array.from({ length: Math.max(1, testimonialsData.length - itemsPerView + 1) }).map((_, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + (i * 0.05) }}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full border ${i === currentIndex ? 'bg-white border-white' : 'bg-white/20 border-white/30'}`}
                  aria-label={`Go to position ${i + 1}`}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Statistics removed by request */}
        </div>
      </section>

      {/* CTA Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-900/20 to-purple-900/20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-8">
                <Zap className="w-4 h-4 mr-2" />
                Ready to Transform Your Career?
              </div>
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Start Your Journey 
              <span className="gradient-text"> Today </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Join thousands of Filipino BPO professionals who have already transformed their careers with BPOC.IO. It's completely free to get started.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                onClick={handleBuildResume}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg shadow-red-500/25 text-lg px-8 py-4"
              >
                Build Your Resume Now 
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              {!user && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleCreateAccount}
                  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 bg-transparent text-lg px-8 py-4"
                >
                  Create Free Account
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">{formatNumber(platformStats.hiddenFees)}% Free</div>
                <div className="text-sm text-gray-400">No hidden fees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{formatNumber(platformStats.minutes)} Minutes</div>
                <div className="text-sm text-gray-400">To get started</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">Instant</div>
                <div className="text-sm text-gray-400">AI analysis</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer included globally via RootLayout */}

      {/* Profile Completion Modal */}
      <ProfileCompletionModal
        open={showProfileModal}
        onOpenChange={handleCloseModal}
        onComplete={handleProfileComplete}
      />

      {/* Recruiter Redirect Modal */}
      <Dialog open={showRecruiterModal} onOpenChange={setShowRecruiterModal}>
        <DialogContent className="max-w-md bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border-emerald-500/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-white text-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              Recruiter Account Detected
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <p className="text-gray-200 text-center leading-relaxed">
                This account is registered as a <span className="font-bold text-emerald-400">Recruiter Account</span>.
              </p>
            </div>
            
            <div className="space-y-3 text-gray-300">
              <p className="text-sm">
                Recruiter accounts have access to:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Post and manage job listings</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Browse candidate profiles</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Review job applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Access recruiter dashboard</span>
                </li>
              </ul>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mt-4">
              <p className="text-cyan-200 text-sm text-center">
                Please sign in on the <span className="font-bold text-cyan-400">Recruiter Portal</span> to access your account features.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowRecruiterModal(false)}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Stay Here
            </Button>
            <Button
              onClick={() => {
                setShowRecruiterModal(false)
                router.push('/recruiter')
              }}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
            >
              Go to Recruiter Portal
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  )
} 
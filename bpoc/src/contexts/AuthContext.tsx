'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { syncUserToDatabase } from '@/lib/user-sync'
import { cleanupLocalStorageOnSignOut } from '@/lib/utils'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signUp: (email: string, password: string, metadata?: any) => Promise<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signIn: (email: string, password: string) => Promise<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signInWithGoogle: () => Promise<any>
  signOut: () => Promise<void>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateProfile: (metadata: any) => Promise<any>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Error getting initial session:', error)
          // If it's a refresh token error, clear storage and continue
          if (error.message?.includes('refresh token') || error.message?.includes('Invalid Refresh Token')) {
            console.log('🧹 Clearing storage due to refresh token error')
            if (typeof window !== 'undefined') {
              localStorage.clear()
              sessionStorage.clear()
            }
          }
          setSession(null)
          setUser(null)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
          
          // Note: App load sync removed - user data is already in database from sign up
          // Profile data is fetched from database via /api/user/profile endpoint
          if (session?.user) {
            console.log('🔍 Initial session found for user:', session.user.email)
          }
        }
      } catch (error) {
        console.error('❌ Unexpected error in getInitialSession:', error)
        setSession(null)
        setUser(null)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔍 Auth Event:', event, session?.user?.email)
        
        // Handle token refresh errors
        if (event === 'TOKEN_REFRESHED' && !session) {
          console.log('❌ Token refresh failed, clearing storage')
          if (typeof window !== 'undefined') {
            localStorage.clear()
            sessionStorage.clear()
          }
          setSession(null)
          setUser(null)
          setLoading(false)
          return
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        
        // Handle Google OAuth sign-up flow
        if (session?.user && event === 'SIGNED_IN') {
          console.log('🔍 SIGNED_IN event detected for user:', session.user.email)
          console.log('🔍 User metadata:', session.user.user_metadata)
          
          // Check if this user came from a sign-up flow
          const googleOAuthFlow = typeof window !== 'undefined' ? sessionStorage.getItem('googleOAuthFlow') : null
          const recruiterSignupFlow = typeof window !== 'undefined' ? sessionStorage.getItem('recruiterSignupFlow') : null
          
          if (googleOAuthFlow === 'signup') {
            console.log('🔄 User came from Google OAuth sign-up flow, signing them out to complete proper flow')
            // Clear the flag
            sessionStorage.removeItem('googleOAuthFlow')
            // Sign out the user so they can go through the proper sign-in flow
            await supabase.auth.signOut()
            // Redirect to home page with sign-in flag
            if (typeof window !== 'undefined') {
              window.location.href = '/?action=signin&source=signup'
            }
            return
          }
          
          if (recruiterSignupFlow === 'true') {
            console.log('🔄 User came from recruiter sign-up flow, signing them out to complete proper flow')
            // Clear the flag
            sessionStorage.removeItem('recruiterSignupFlow')
            // Sign out the user so they can go through the proper sign-in flow
            await supabase.auth.signOut()
            // Redirect to recruiter page with sign-in flag
            if (typeof window !== 'undefined') {
              window.location.href = '/recruiter?action=signin&source=signup'
            }
            return
          }
          
          // Check if this is a Google OAuth user with name data that might need syncing
          const hasGoogleNameData = session.user.user_metadata?.given_name || 
                                   session.user.user_metadata?.family_name || 
                                   session.user.user_metadata?.name ||
                                   session.user.user_metadata?.first_name ||
                                   session.user.user_metadata?.last_name
          
          if (hasGoogleNameData) {
            console.log('🔍 Google OAuth user detected, will sync name data if needed')
            console.log('🔍 Google OAuth metadata:', session.user.user_metadata)
            console.log('🔍 Full user object:', session.user)
            
            // Extract name data with detailed logging
            let firstName = session.user.user_metadata?.first_name || session.user.user_metadata?.given_name || ''
            let lastName = session.user.user_metadata?.last_name || session.user.user_metadata?.family_name || ''
            let fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || ''
            
            // If we have a full name but no individual names, parse it
            if (fullName && (!firstName || !lastName)) {
              console.log('🔍 Parsing full name:', fullName)
              const nameParts = fullName.trim().split(' ')
              if (nameParts.length >= 2) {
                firstName = nameParts[0]
                lastName = nameParts.slice(1).join(' ') // Handle multiple last names
                console.log('🔍 Parsed names:', { firstName, lastName })
              } else if (nameParts.length === 1) {
                firstName = nameParts[0]
                lastName = ''
                console.log('🔍 Single name parsed:', { firstName, lastName })
              }
            }
            
            // Fallback to email if no name data at all
            if (!fullName && !firstName && !lastName) {
              fullName = session.user.email
            }
            
            console.log('🔍 Extracted name data:', {
              firstName,
              lastName,
              fullName,
              email: session.user.email
            })
            
              // Proactively sync Google OAuth users to ensure their names are stored
              try {
                console.log('🔄 Proactively syncing Google OAuth user...')
                
                // First, check existing user's admin_level to preserve it
                let existingAdminLevel = 'user'
                let profileData = null
                try {
                  // Add a small delay to ensure recruiter sign-up has completed
                  await new Promise(resolve => setTimeout(resolve, 1000))
                  
                  const profileResponse = await fetch(`/api/user/profile?userId=${session.user.id}`)
                  if (profileResponse.ok) {
                    profileData = await profileResponse.json()
                    existingAdminLevel = profileData.user?.admin_level || 'user'
                    console.log('🔍 Preserving existing admin_level:', existingAdminLevel)
                    
                    // If user is already a recruiter, skip the sync to avoid overriding
                    if (existingAdminLevel === 'recruiter') {
                      console.log('✅ User is already a recruiter, skipping sync to preserve admin_level')
                      return
                    }
                  }
                } catch (profileError) {
                  console.log('🔍 Could not fetch existing profile, using default admin_level')
                }
                
                const syncData = {
                  id: session.user.id,
                  email: session.user.email,
                  first_name: firstName,
                  last_name: lastName,
                  full_name: fullName,
                  location: session.user.user_metadata?.location || '',
                  avatar_url: profileData?.user?.avatar_url || session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
                  phone: session.user.user_metadata?.phone || '',
                  bio: session.user.user_metadata?.bio || '',
                  position: session.user.user_metadata?.position || '',
                  company: session.user.user_metadata?.company || '',
                  completed_data: session.user.user_metadata?.completed_data ?? false,
                  birthday: session.user.user_metadata?.birthday || null,
                  gender: session.user.user_metadata?.gender || null,
                  admin_level: existingAdminLevel // Preserve existing admin_level
                }
              
              console.log('🔍 Sending sync data:', syncData)
              
              const syncResponse = await fetch('/api/user/sync', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(syncData)
              });

              if (syncResponse.ok) {
                const result = await syncResponse.json()
                console.log('✅ Google OAuth user synced successfully:', result)
              } else {
                const errorText = await syncResponse.text()
                console.error('❌ Failed to sync Google OAuth user:', syncResponse.status, errorText)
              }
            } catch (syncError) {
              console.error('❌ Error syncing Google OAuth user:', syncError)
            }
          } else {
            console.log('⚠️ No Google name data found in metadata:', session.user.user_metadata)
            
            // Even if no name data is found, we should still sync the user to ensure they exist in the database
            // They can fill in their name through the stepper modal
            try {
              console.log('🔄 Syncing user without name data (will be filled in stepper modal)...')
              
              // Try to parse any available name data
              let firstName = ''
              let lastName = ''
              let fullName = session.user.email // Use email as fallback
              
              // Check if there's any name data we missed
              const availableName = session.user.user_metadata?.name || 
                                  session.user.user_metadata?.full_name ||
                                  session.user.user_metadata?.given_name ||
                                  session.user.user_metadata?.family_name
              
              if (availableName) {
                console.log('🔍 Found name data in fallback:', availableName)
                const nameParts = availableName.trim().split(' ')
                if (nameParts.length >= 2) {
                  firstName = nameParts[0]
                  lastName = nameParts.slice(1).join(' ')
                  fullName = availableName
                } else if (nameParts.length === 1) {
                  firstName = nameParts[0]
                  lastName = ''
                  fullName = availableName
                }
              }
              
              // First, check existing user's admin_level to preserve it
              let existingAdminLevel = 'user'
              try {
                // Add a small delay to ensure recruiter sign-up has completed
                await new Promise(resolve => setTimeout(resolve, 1000))
                
                const profileResponse = await fetch(`/api/user/profile?userId=${session.user.id}`)
                if (profileResponse.ok) {
                  const profileData = await profileResponse.json()
                  existingAdminLevel = profileData.user?.admin_level || 'user'
                  console.log('🔍 Preserving existing admin_level (fallback):', existingAdminLevel)
                  
                  // If user is already a recruiter, skip the sync to avoid overriding
                  if (existingAdminLevel === 'recruiter') {
                    console.log('✅ User is already a recruiter, skipping sync to preserve admin_level (fallback)')
                    return
                  }
                }
              } catch (profileError) {
                console.log('🔍 Could not fetch existing profile, using default admin_level')
              }
              
              const syncData = {
                id: session.user.id,
                email: session.user.email,
                first_name: firstName,
                last_name: lastName,
                full_name: fullName,
                location: '',
                avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
                phone: '',
                bio: '',
                position: '',
                company: '',
                completed_data: false,
                birthday: null,
                gender: null,
                admin_level: existingAdminLevel // Preserve existing admin_level
              }
              
              console.log('🔍 Sending sync data (no name):', syncData)
              
              const syncResponse = await fetch('/api/user/sync', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(syncData)
              });

              if (syncResponse.ok) {
                const result = await syncResponse.json()
                console.log('✅ User synced successfully (no name):', result)
              } else {
                const errorText = await syncResponse.text()
                console.error('❌ Failed to sync user (no name):', syncResponse.status, errorText)
              }
            } catch (syncError) {
              console.error('❌ Error syncing user (no name):', syncError)
            }
          }
        }
        
        console.log('🔍 Auth Event:', event, 'user:', !!session?.user)
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signUp = async (email: string, password: string, metadata?: any) => {
    console.log('📝 Sign up attempt for:', email)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (data.user) {
      console.log('✅ Sign up successful for:', data.user.email)
      console.log('📋 User metadata:', data.user.user_metadata)
      
      // Only sync immediately if it's not a recruiter signup
      // Recruiter signups are handled by the RecruiterSignUpForm
      if (data.user.user_metadata?.admin_level !== 'recruiter') {
        try {
          await syncUserToDatabase(data.user)
          console.log('✅ Immediate sync after signup successful')
        } catch (syncError) {
          console.error('❌ Immediate sync after signup failed:', syncError)
        }
      } else {
        console.log('⏭️ Skipping immediate sync for recruiter - handled by signup form')
      }
    }
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signInWithGoogle = async () => {
    // Force the correct redirect URL based on current environment
    const isProduction = process.env.NODE_ENV === 'production'
    const baseUrl = isProduction 
      ? (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bpoc.io')
      : 'http://localhost:3000'
    
    console.log('🔗 Google OAuth redirect URL:', `${baseUrl}/auth/callback`)
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${baseUrl}/auth/callback`
      }
    })
    return { data, error }
  }

  const signOut = async () => {
    try {
      console.log('🚪 Starting comprehensive sign out...')
      
      // Clear browser storage
      if (typeof window !== 'undefined') {
        // Clean up BPOC-related localStorage data
        cleanupLocalStorageOnSignOut()
        
        // Clear Supabase auth items
        const keysToRemove = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && (key.includes('supabase') || key.includes('auth'))) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key))
        
        // Clear sessionStorage
        sessionStorage.clear()
        
        console.log('🧹 Cleared browser storage')
      }
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      
      if (error) {
        console.error('❌ Supabase sign out error:', error)
        throw error
      }
      
      console.log('✅ Sign out successful')
      
    } catch (error) {
      console.error('❌ Sign out failed:', error)
      throw error
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateProfile = async (metadata: any) => {
    console.log('🔄 Updating Supabase user metadata:', metadata)
    
    // Ensure full_name is always generated from first_name and last_name if not provided
    if (metadata.first_name && metadata.last_name && !metadata.full_name) {
      metadata.full_name = `${metadata.first_name} ${metadata.last_name}`.trim()
      console.log('🔧 Generated full_name from first_name and last_name:', metadata.full_name)
    }
    
    const { data, error } = await supabase.auth.updateUser({
      data: metadata
    })
    
    console.log('📋 Supabase update result:', { data, error })
    
    if (data.user && !error) {
      console.log('✅ Supabase update successful')
      // Update the local user state to reflect changes immediately
      setUser(data.user)
      
      // Note: We don't automatically sync to Railway here to avoid overwriting
      // Railway data with Supabase metadata. The settings page handles Railway updates separately.
    } else {
      console.error('❌ Supabase update failed:', error)
    }
    
    return { data, error }
  }

  // Function to refresh user data from Supabase
  const refreshUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (user && !error) {
        setUser(user)
        console.log('✅ User data refreshed from Supabase')
      } else {
        console.error('❌ Failed to refresh user data:', error)
      }
    } catch (error) {
      console.error('❌ Error refreshing user data:', error)
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 
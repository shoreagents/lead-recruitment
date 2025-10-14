"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from './supabase/client'
import type { User } from '@supabase/supabase-js'

const supabase = createClient()

// TanStack Query hook for fetching app user data
export const useAppUserQuery = (authUser: User | null) => {
  return useQuery({
    queryKey: ['appUser', authUser?.id],
    queryFn: async () => {
      if (!authUser || !supabase) {
        return null
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .single()

      if (error) {
        console.error('Error fetching app user:', error)
        throw error
      }

      return userData
    },
    enabled: !!authUser && !!supabase,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
  })
}

export interface AppUser {
  id: string
  user_id: string
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string
  company?: string
  country?: string
  created_at: string
  updated_at: string
  auth_user_id?: string
  user_type: 'Anonymous' | 'Regular' | 'Admin'
}

interface AuthContextType {
  user: User | null
  appUser: AppUser | null
  userType: 'Anonymous' | 'Regular' | 'Admin' | null
  isAdmin: boolean
  isRegular: boolean
  isAnonymous: boolean
  isAuthenticated: boolean
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const queryClient = useQueryClient()

  // Use TanStack Query for app user data
  const { 
    data: appUser, 
    isLoading: appUserLoading, 
    error: appUserError,
    refetch: refetchAppUser 
  } = useAppUserQuery(user)

  // Memoize the refresh function to prevent unnecessary re-renders
  const refreshUser = async () => {
    if (user) {
      await refetchAppUser()
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null } }
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase?.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    ) || { data: { subscription: null } }

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      console.log('🔍 Starting sign out process...')
      
      if (supabase) {
        // Sign out from Supabase
        const { error } = await supabase.auth.signOut()
        
        if (error) {
          console.error('❌ Supabase signOut error:', error)
          throw error
        }
        
        console.log('✅ Supabase signOut successful')
      }
      
      // Clear TanStack Query cache
      queryClient.clear()
      
      // Clear local state immediately
      setUser(null)
      
      console.log('✅ Local state and cache cleared')
      
      // Force a page reload to ensure complete cleanup
      // This prevents any lingering state issues
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
      
    } catch (error) {
      console.error('❌ Sign out error:', error)
      
      // Even if there's an error, clear local state and cache
      queryClient.clear()
      setUser(null)
      
      // Still redirect to home page
      window.location.href = '/'
    }
  }


  // Computed values
  const userType = appUser?.user_type || (user ? 'Regular' : 'Anonymous')
  const isAdmin = userType === 'Admin'
  const isRegular = userType === 'Regular'
  const isAnonymous = userType === 'Anonymous'
  const isAuthenticated = !!user

  // Combined loading state
  const combinedLoading = loading || appUserLoading

  const value = {
    user,
    appUser,
    userType,
    isAdmin,
    isRegular,
    isAnonymous,
    isAuthenticated,
    loading: combinedLoading,
    signOut,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

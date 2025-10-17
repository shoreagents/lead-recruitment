"use client"

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from './supabase/client'
import type { User } from '@supabase/supabase-js'
import { generateUserId } from '@/lib/userEngagementService'
import { getAuthErrorMessage } from '@/lib/authErrorUtils'

const supabase = createClient()

// User-specific interface
export interface UserAppUser {
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
  user_type: 'Anonymous' | 'Client' | 'User'
  is_verified: boolean
  last_login?: string
  device_id?: string
  ip_address?: string
  user_agent?: string
  timezone?: string
  language?: string
  preferences?: {
    notifications: boolean
    email_updates: boolean
    sms_updates: boolean
  }
}

interface UserAuthContextType {
  user: UserAppUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, userData?: Partial<UserAppUser>) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateUser: (updates: Partial<UserAppUser>) => Promise<{ success: boolean; error?: string }>
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
  isVerified: boolean
  isClient: boolean
  isAnonymous: boolean
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined)

export function UserAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAppUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserData = useCallback(async (authUser: User) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .single()

      if (error) {
        console.error('Error fetching user data:', error)
        return null
      }

      return data as UserAppUser
    } catch (error) {
      console.error('Error in fetchUserData:', error)
      return null
    }
  }, [])

  const updateUser = useCallback(async (updates: Partial<UserAppUser>) => {
    if (!user) return { success: false, error: 'No user logged in' }

    try {
      const { error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        console.error('Error updating user:', error)
        return { success: false, error: error.message }
      }

      // Update local state
      setUser(prev => prev ? { ...prev, ...updates } : null)
      return { success: true }
    } catch (error) {
      console.error('Error in updateUser:', error)
      return { success: false, error: 'Failed to update user' }
    }
  }, [user])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        const errorMessage = getAuthErrorMessage(error, 'login')
        return { success: false, error: errorMessage }
      }

      if (data.user) {
        const userData = await fetchUserData(data.user)
        if (userData) {
          setUser(userData)
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in signIn:', error)
      return { success: false, error: 'Failed to sign in' }
    }
  }, [fetchUserData])

  const signUp = useCallback(async (email: string, password: string, userData?: Partial<UserAppUser>) => {
    try {
      console.log('🚀 Starting signup process for:', email)
      console.log('📧 Supabase client available:', !!supabase)
      
      if (!supabase) {
        return { success: false, error: 'Database connection not available' }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      console.log('🔐 Supabase Auth response:', { data, error })

      if (error) {
        console.error('❌ Supabase Auth error:', error)
        const errorMessage = getAuthErrorMessage(error, 'signup')
        return { success: false, error: errorMessage }
      }

      console.log('✅ Supabase Auth success:', {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          email_confirmed_at: data.user.email_confirmed_at,
          created_at: data.user.created_at
        } : null,
        session: data.session ? 'Session created' : 'No session (email confirmation required)'
      })

      if (data.user) {
        // Get the current device fingerprint ID (this preserves anonymous tracking data)
        const deviceFingerprintId = generateUserId()
        
        // First, check if anonymous user already exists
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', deviceFingerprintId)
          .single()

        console.log('🔍 Existing user check:', { existingUser, checkError })

        let dbUserData, dbUserError

        if (existingUser) {
          // Update existing anonymous user with auth data
          console.log('📝 Updating existing anonymous user with auth data')
          const { data: updateData, error: updateError } = await supabase
            .from('users')
            .update({
              auth_user_id: data.user.id, // Add auth UUID
              first_name: userData?.first_name,
              last_name: userData?.last_name,
              email: data.user.email,
              phone_number: userData?.phone_number,
              company: userData?.company,
              country: userData?.country || 'Unknown',
              user_type: 'Regular', // Change from Anonymous to Regular
              updated_at: new Date().toISOString()
            })
            .eq('user_id', deviceFingerprintId)
            .select()
          
          dbUserData = updateData
          dbUserError = updateError
        } else {
          // Create new user record (fallback)
          console.log('🆕 Creating new user record')
          const { data: insertData, error: insertError } = await supabase
            .from('users')
            .insert({
              user_id: deviceFingerprintId, // Device fingerprint ID for tracking
              auth_user_id: data.user.id, // Supabase auth UUID
              first_name: userData?.first_name,
              last_name: userData?.last_name,
              email: data.user.email,
              phone_number: userData?.phone_number,
              company: userData?.company,
              country: userData?.country || 'Unknown',
              user_type: 'Regular',
            })
            .select()
          
          dbUserData = insertData
          dbUserError = insertError
        }

        if (dbUserError) {
          console.error('Error creating/updating user record:', dbUserError)
          return { success: false, error: 'Account created but failed to link tracking data. Please contact support.' }
        }

        console.log('✅ User record created/updated successfully:', dbUserData)

        const newUserData = await fetchUserData(data.user)
        if (newUserData) {
          setUser(newUserData)
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in signUp:', error)
      return { success: false, error: 'Failed to sign up' }
    }
  }, [fetchUserData])

  const signOut = useCallback(async () => {
    try {
      console.log('🔍 UserAuth - Starting sign out...')
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ UserAuth - Supabase signOut error:', error)
        throw error
      }
      
      console.log('✅ UserAuth - Supabase signOut successful')
      
      // Clear user state
      setUser(null)
      
      console.log('✅ UserAuth - User state cleared')
      
      // Clear all browser cache and storage
      if (typeof window !== 'undefined') {
        // Clear localStorage except for essential items
        const essentialKeys = ['theme', 'language']
        const keysToRemove = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && !essentialKeys.includes(key)) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key))
        
        // Clear sessionStorage
        sessionStorage.clear()
        
        // Clear TanStack Query cache
        if ((window as any).__REACT_QUERY_CLIENT__) {
          (window as any).__REACT_QUERY_CLIENT__.clear()
        }
        
        console.log('✅ UserAuth - Browser cache cleared')
      }
      
      // Force redirect to home page
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
      
    } catch (error) {
      console.error('❌ UserAuth - Sign out error:', error)
      
      // Even if there's an error, clear user state and cache
      setUser(null)
      
      // Clear cache even on error
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.clear()
          if ((window as any).__REACT_QUERY_CLIENT__) {
            (window as any).__REACT_QUERY_CLIENT__.clear()
          }
        } catch (e) {
          console.error('Error clearing cache:', e)
        }
      }
      
      // Still redirect to home page
      window.location.href = '/'
    }
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const userData = await fetchUserData(authUser)
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error in refreshUser:', error)
      setUser(null)
    }
  }, [fetchUserData])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: { user: User } | null) => {
      if (session?.user) {
        const userData = await fetchUserData(session.user)
        setUser(userData)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [fetchUserData])

  // User-specific computed properties
  const isAuthenticated = !!user
  const isVerified = user?.is_verified ?? false
  const isClient = user?.user_type === 'Client'
  const isAnonymous = user?.user_type === 'Anonymous'

  const value: UserAuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUser,
    refreshUser,
    isAuthenticated,
    isVerified,
    isClient,
    isAnonymous
  }

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  )
}

export function useUserAuth() {
  const context = useContext(UserAuthContext)
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider')
  }
  return context
}

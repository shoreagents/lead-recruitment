"use client"

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from './supabase/client'
import type { User } from '@supabase/supabase-js'
import { getAuthErrorMessage } from '@/lib/authErrorUtils'

const supabase = createClient()

// Admin-specific interface
export interface AdminAppUser {
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
  user_type: 'Admin' | 'Regular'
  is_verified: boolean
  is_admin: boolean
  admin_level: 'basic' | 'advanced' | 'super'
  permissions: {
    user_management: boolean
    system_settings: boolean
    analytics: boolean
    billing: boolean
    support: boolean
    content_management: boolean
  }
  last_login?: string
  device_id?: string
  ip_address?: string
  user_agent?: string
  timezone?: string
  language?: string
  admin_preferences?: {
    dashboard_layout: string
    notifications: boolean
    email_reports: boolean
    security_alerts: boolean
  }
}

interface AdminAuthContextType {
  admin: AdminAppUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateAdmin: (updates: Partial<AdminAppUser>) => Promise<{ success: boolean; error?: string }>
  refreshAdmin: () => Promise<void>
  isAuthenticated: boolean
  isVerified: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  hasPermission: (permission: keyof AdminAppUser['permissions']) => boolean
  promoteUser: (userId: string, adminLevel: AdminAppUser['admin_level']) => Promise<{ success: boolean; error?: string }>
  demoteUser: (userId: string) => Promise<{ success: boolean; error?: string }>
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminAppUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAdminData = useCallback(async (authUser: User) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .single()

      if (error) {
        console.error('Error fetching admin data:', error)
        return null
      }

      // Verify this is actually an admin user
      console.log('Admin auth - User data:', data)
      console.log('Admin auth - user_type:', data.user_type)
      
      if (data.user_type !== 'Admin') {
        // User is not an admin - this is expected for regular users
        console.log('Admin auth - User is not an admin')
        return null
      }
      
      console.log('Admin auth - User is confirmed as admin')

      return data as AdminAppUser
    } catch (error) {
      console.error('Error in fetchAdminData:', error)
      return null
    }
  }, [])

  const updateAdmin = useCallback(async (updates: Partial<AdminAppUser>) => {
    if (!admin) return { success: false, error: 'No admin logged in' }

    try {
      const { error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', admin.id)

      if (error) {
        console.error('Error updating admin:', error)
        return { success: false, error: error.message }
      }

      // Update local state
      setAdmin(prev => prev ? { ...prev, ...updates } : null)
      return { success: true }
    } catch (error) {
      console.error('Error in updateAdmin:', error)
      return { success: false, error: 'Failed to update admin' }
    }
  }, [admin])

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
        const adminData = await fetchAdminData(data.user)
        if (adminData) {
          setAdmin(adminData)
        } else {
          return { success: false, error: 'Access denied. Admin privileges required.' }
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in admin signIn:', error)
      return { success: false, error: 'Failed to sign in' }
    }
  }, [fetchAdminData])

  const signOut = useCallback(async () => {
    try {
      console.log('🔍 AdminAuth - Starting sign out...')
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ AdminAuth - Supabase signOut error:', error)
        throw error
      }
      
      console.log('✅ AdminAuth - Supabase signOut successful')
      
      // Clear admin state
      setAdmin(null)
      
      console.log('✅ AdminAuth - Admin state cleared')
      
      // Force redirect to home page
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
      
    } catch (error) {
      console.error('❌ AdminAuth - Sign out error:', error)
      
      // Even if there's an error, clear admin state
      setAdmin(null)
      
      // Still redirect to home page
      window.location.href = '/'
    }
  }, [])

  const refreshAdmin = useCallback(async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const adminData = await fetchAdminData(authUser)
        setAdmin(adminData)
      } else {
        setAdmin(null)
      }
    } catch (error) {
      console.error('Error in refreshAdmin:', error)
      setAdmin(null)
    }
  }, [fetchAdminData])

  const hasPermission = useCallback((permission: keyof AdminAppUser['permissions']) => {
    if (!admin) return false
    return admin.permissions[permission] || admin.admin_level === 'super'
  }, [admin])

  const promoteUser = useCallback(async (userId: string, adminLevel: AdminAppUser['admin_level']) => {
    if (!admin || !hasPermission('user_management')) {
      return { success: false, error: 'Insufficient permissions' }
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({
          is_admin: true,
          user_type: adminLevel === 'super' ? 'SuperAdmin' : 'Admin',
          admin_level: adminLevel,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('Error promoting user:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in promoteUser:', error)
      return { success: false, error: 'Failed to promote user' }
    }
  }, [admin, hasPermission])

  const demoteUser = useCallback(async (userId: string) => {
    if (!admin || !hasPermission('user_management')) {
      return { success: false, error: 'Insufficient permissions' }
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({
          is_admin: false,
          user_type: 'Client',
          admin_level: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('Error demoting user:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error in demoteUser:', error)
      return { success: false, error: 'Failed to demote user' }
    }
  }, [admin, hasPermission])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: { user: User } | null) => {
      if (session?.user) {
        const adminData = await fetchAdminData(session.user)
        setAdmin(adminData)
      } else {
        setAdmin(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [fetchAdminData])

  // Admin-specific computed properties
  const isAuthenticated = !!admin
  const isVerified = admin?.is_verified ?? false
  const isAdmin = !!(admin && admin.user_type === 'Admin')
  const isSuperAdmin = admin?.admin_level === 'super'

  const value: AdminAuthContextType = {
    admin,
    loading,
    signIn,
    signOut,
    updateAdmin,
    refreshAdmin,
    isAuthenticated,
    isVerified,
    isAdmin,
    isSuperAdmin,
    hasPermission,
    promoteUser,
    demoteUser
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { AdminUser, AdminDashboardStats } from '@/types/user'

interface AdminContextType {
  isAdmin: boolean
  adminUser: AdminUser | null
  adminStats: AdminDashboardStats | null
  loading: boolean
  checkAdminStatus: () => Promise<void>
  logAdminAction: (action: string, details?: string) => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [adminStats, setAdminStats] = useState<AdminDashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAdminStatus = async () => {
    if (!user) {
      console.log('No user available for admin check')
      setIsAdmin(false)
      setAdminUser(null)
      setLoading(false)
      return
    }

    console.log('Checking admin status for user:', user.id)
    try {
      // Check admin status directly in Railway database
      const response = await fetch(`/api/admin/check-status?userId=${user.id}`, { cache: 'no-store' })
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const data = await response.json()
      
      console.log('Admin check response:', data)
      
      if (data.isAdmin) {
        setIsAdmin(true)
        setAdminUser(data.adminUser)
      } else {
        setIsAdmin(false)
        setAdminUser(null)
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
      setIsAdmin(false)
      setAdminUser(null)
    } finally {
      setLoading(false)
    }
  }

  const logAdminAction = async (action: string, details?: string) => {
    if (!isAdmin || !user) return

    try {
      await fetch('/api/admin/log-action', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          action, 
          details,
          userId: user.id 
        })
      })
    } catch (error) {
      console.error('Error logging admin action:', error)
    }
  }

  useEffect(() => {
    // Wait for auth to finish loading before checking admin status
    if (authLoading) {
      return
    }
    
    // Only check admin status if user is available
    if (user) {
      checkAdminStatus()
    } else {
      // If no user, we're not an admin
      setIsAdmin(false)
      setAdminUser(null)
      setLoading(false)
    }
  }, [user, authLoading])

  const value = {
    isAdmin,
    adminUser,
    adminStats,
    loading: loading || authLoading,
    checkAdminStatus,
    logAdminAction
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
} 
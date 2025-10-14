"use client"

import { useUserAuth } from '@/lib/user-auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface UserGuardProps {
  children: React.ReactNode
  requireVerification?: boolean
  fallback?: React.ReactNode
}

export function UserGuard({ 
  children, 
  requireVerification = false,
  fallback = <div></div> 
}: UserGuardProps) {
  const { user, loading, isAuthenticated, isVerified } = useUserAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Redirect to home page where users can use the login modal
        router.push('/')
        return
      }

      if (requireVerification && !isVerified) {
        // Redirect to verification page
        router.push('/auth/verify')
        return
      }
    }
  }, [loading, isAuthenticated, isVerified, requireVerification, router])

  if (loading) {
    return <>{fallback}</>
  }

  if (!isAuthenticated) {
    return <>{fallback}</>
  }

  if (requireVerification && !isVerified) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

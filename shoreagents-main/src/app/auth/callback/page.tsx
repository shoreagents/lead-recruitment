"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { useAdminAuth } from '@/lib/admin-auth-context'

export default function AuthCallback() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const { refreshAdmin } = useAdminAuth()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createClient()
        
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/login?error=auth_failed')
          return
        }

        if (data.session) {
          // User is authenticated, refresh both user and admin contexts
          await Promise.all([refreshUser(), refreshAdmin()])
          
          // Check if this is an admin user by looking at the user data - prioritize email lookup
          console.log('🔍 Auth callback - Auth user ID:', data.session.user.id);
          console.log('🔍 Auth callback - Email:', data.session.user.email);
          
          // First try email lookup (more reliable for admin detection)
          let { data: userData, error: userError } = await supabase
            .from('users')
            .select('user_type, auth_user_id, email')
            .eq('email', data.session.user.email)
            .single()
          
          console.log('🔍 Auth callback - Email lookup result:', { userData, userError });
          
          // If email lookup fails, try auth_user_id lookup as fallback
          if (userError) {
            console.log('🔄 Auth callback - Email lookup failed, trying auth_user_id lookup...');
            const { data: authUserData, error: authUserError } = await supabase
              .from('users')
              .select('user_type, auth_user_id, email')
              .eq('auth_user_id', data.session.user.id)
              .single();
            
            if (!authUserError && authUserData) {
              userData = authUserData;
              userError = null;
              console.log('✅ Auth callback - Found user by auth_user_id:', authUserData);
            }
          }
          
          console.log('🔍 Auth callback - Final user data:', userData);
          console.log('🔍 Auth callback - User error:', userError);
          console.log('🔍 Auth callback - User type:', userData?.user_type);
          console.log('🔍 Auth callback - Is Admin?', userData?.user_type === 'Admin');
          
          if (!userError && userData && userData.user_type === 'Admin') {
            // This is an admin user, redirect to admin dashboard
            console.log('✅ Auth callback - Redirecting admin to /admin-dashboard');
            router.push('/admin-dashboard')
          } else {
            // This is a regular user, redirect to user dashboard
            console.log('✅ Auth callback - Redirecting user to /user-dashboard');
            router.push('/user-dashboard')
          }
        } else {
          // No session found, redirect to home page
          router.push('/')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/login?error=auth_failed')
      }
    }

    handleAuthCallback()
  }, [router, refreshUser, refreshAdmin])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}

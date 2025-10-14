'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function RedirectHandler() {
  useEffect(() => {
    const handleOAuthRedirect = async () => {
      // Only run this if we're on localhost:8080 with an access token (wrong OAuth redirect)
      // This is specifically for handling the Supabase OAuth redirect bug
      if (
        window.location.hostname === 'localhost' && 
        window.location.port === '8080' &&
        window.location.hash.includes('access_token')
      ) {
        console.log('Detected OAuth redirect to wrong localhost:8080 URL, handling...')
        
        try {
          // Let Supabase handle the hash fragment automatically
          const { data, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error('Error getting session from URL:', error)
            return
          }

          if (data.session) {
            console.log('Session established successfully, redirecting to correct URL')
            
            // Always redirect to production since this wrong redirect only happens in production
            const correctUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bpocai-production.up.railway.app'
            
            console.log(`Redirecting to correct URL: ${correctUrl}`)
            window.location.href = correctUrl
          }
        } catch (err) {
          console.error('Error handling OAuth redirect:', err)
        }
      }
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(handleOAuthRedirect, 100)
    return () => clearTimeout(timer)
  }, [])

  return null // This component doesn't render anything
} 
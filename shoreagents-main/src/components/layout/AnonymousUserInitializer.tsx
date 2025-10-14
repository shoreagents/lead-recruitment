'use client'

import { useEffect } from 'react'
import { generateUserId } from '@/lib/userEngagementService'

export function AnonymousUserInitializer() {
  useEffect(() => {
    // Initialize anonymous user immediately when the page loads
    const initializeAnonymousUser = async () => {
      try {
        // Generate or get existing device ID
        const deviceId = generateUserId()
        console.log('🔍 AnonymousUserInitializer: Device ID generated/retrieved:', deviceId)
        
        // Check if we already have a device ID in localStorage
        if (typeof window !== 'undefined') {
          const existingDeviceId = localStorage.getItem('shoreagents_device_id')
          if (existingDeviceId) {
            console.log('🔍 AnonymousUserInitializer: Using existing device ID:', existingDeviceId)
          } else {
            console.log('🔍 AnonymousUserInitializer: Generated new device ID:', deviceId)
          }
        }
        
        // Call API to ensure anonymous user exists in database
        try {
          const response = await fetch('/api/ensure-anonymous-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          
          const result = await response.json()
          
          if (result.success) {
            console.log('✅ AnonymousUserInitializer: Anonymous user ensured in database:', result)
          } else {
            console.warn('⚠️ AnonymousUserInitializer: Failed to ensure anonymous user:', result.error)
          }
        } catch (apiError) {
          console.error('❌ AnonymousUserInitializer: API call failed:', apiError)
        }
        
        // The device ID is now available for immediate use
        console.log('✅ AnonymousUserInitializer: Anonymous user ready with device ID:', deviceId)
      } catch (error) {
        console.error('❌ AnonymousUserInitializer: Error initializing anonymous user:', error)
      }
    }

    // Run immediately
    initializeAnonymousUser()
  }, [])

  // This component doesn't render anything
  return null
}

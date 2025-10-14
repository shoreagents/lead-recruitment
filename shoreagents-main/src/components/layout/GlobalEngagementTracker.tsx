'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { userEngagementTracker } from '@/lib/userEngagementTracker'

export function GlobalEngagementTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Start tracking when pathname changes
    if (pathname) {
      console.log('🌍 Global tracker: Starting tracking for:', pathname)
      console.log('🌍 Global tracker: userEngagementTracker exists:', !!userEngagementTracker)
      
      // Ensure anonymous user is created immediately when tracking starts
      userEngagementTracker.resetForNewPage(pathname)
    }

    // Cleanup when component unmounts or pathname changes
    return () => {
      console.log('🌍 Global tracker: Cleaning up for:', pathname)
      // Note: We don't call stopTracking here because resetForNewPage already handles it
    }
  }, [pathname])

  // This component doesn't render anything
  return null
}

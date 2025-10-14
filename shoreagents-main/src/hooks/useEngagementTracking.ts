import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { userEngagementTracker } from '@/lib/userEngagementTracker'

export function useEngagementTracking() {
  const pathname = usePathname()

  useEffect(() => {
    // Start tracking when component mounts or pathname changes
    if (pathname) {
      console.log('🎯 Starting engagement tracking for:', pathname)
      userEngagementTracker.resetForNewPage(pathname)
    }

    // Cleanup when component unmounts
    return () => {
      console.log('🛑 Stopping engagement tracking for:', pathname)
      userEngagementTracker.stopTracking()
    }
  }, [pathname])

  // Return the tracker instance for manual control if needed
  return userEngagementTracker
}

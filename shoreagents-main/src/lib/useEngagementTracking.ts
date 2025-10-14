import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { userEngagementTracker, type UserEngagementData } from './userEngagementTracker'

export function useEngagementTracking() {
  const pathname = usePathname()
  const [engagementData, setEngagementData] = useState<UserEngagementData>({
    activeTime: 0,
    contentRead: 0,
    interactionCount: 0, // Changed from 'interaction' to 'interactionCount'
    interestScore: 0,
    pageStartTime: 0, // Start with 0 to prevent hydration mismatch
    lastActivityTime: 0, // Start with 0 to prevent hydration mismatch
    scrollDepth: 0,
    totalScrollHeight: 0,
    sessionStartTime: 0
  })

  useEffect(() => {
    // Reset tracking when pathname changes
    userEngagementTracker.resetForNewPage(pathname)

    // Subscribe to updates
    const unsubscribe = userEngagementTracker.subscribe((data: UserEngagementData) => {
      setEngagementData(data)
    })

    return () => {
      unsubscribe()
      userEngagementTracker.stopTracking()
    }
  }, [pathname])

  // Helper function to manually record interactions
  const recordInteraction = (type: string = 'click') => {
    userEngagementTracker.recordInteraction()
    // Immediately update local state to reflect the new interaction
    setEngagementData(prev => ({
      ...prev,
      interactionCount: prev.interactionCount + 1 // Removed the redundant interaction field
    }))
  }

  // Helper function to get formatted metrics
  const getFormattedMetrics = () => {
    return userEngagementTracker.getFormattedMetrics()
  }

  // Get formatted metrics that include current session time
  const formattedMetrics = userEngagementTracker.getFormattedMetrics()

  return {
    engagementData,
    recordInteraction,
    getFormattedMetrics,
    // Individual metrics for easy access (using formatted metrics for activeTime)
    activeTime: formattedMetrics.activeTime,
    contentRead: engagementData.contentRead,
    interactionCount: engagementData.interactionCount, // Changed from 'interaction' to 'interactionCount'
    interestScore: engagementData.interestScore,
    // Page-specific data methods
    getAllPageData: () => userEngagementTracker.getAllPageData(),
    getPageData: (pathname: string) => userEngagementTracker.getPageData(pathname),
    clearAllPageData: () => userEngagementTracker.clearAllPageData()
  }
}

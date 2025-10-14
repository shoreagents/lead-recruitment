"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Only scroll to top on page refresh, not on route changes
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0)
    }

    // Add event listener for page refresh
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [pathname])

  return null
}







'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only redirect if we're on the root path and not already on home
    if (pathname === '/') {
      router.replace('/home')
    }
  }, [router, pathname])

  return null
}
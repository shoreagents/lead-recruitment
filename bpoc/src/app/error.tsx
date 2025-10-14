'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-red-400">Error</h1>
        <p className="text-gray-400 max-w-md">
          Something went wrong! Please try again.
        </p>
        <div className="pt-4">
          <Button onClick={() => reset()}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  )
} 
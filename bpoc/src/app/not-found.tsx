import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold gradient-text">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-gray-400 max-w-md">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="pt-4">
          <Button asChild>
            <Link href="/recruiter">
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 
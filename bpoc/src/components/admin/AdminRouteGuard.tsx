'use client'

import { useAdmin } from '@/contexts/AdminContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import LoadingScreen from '@/components/ui/loading-screen'

interface AdminRouteGuardProps {
  children: React.ReactNode
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { isAdmin, loading } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    console.log('AdminRouteGuard state:', { isAdmin, loading })
    // Only redirect if we're not loading and we're definitely not an admin
    // Add a small delay to prevent race conditions during page reload
    if (!loading && !isAdmin) {
      console.log('Redirecting to home page - not an admin')
      const timer = setTimeout(() => {
        router.push('/')
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isAdmin, loading, router])

  if (loading) {
    return (
      <LoadingScreen 
        title="Checking Admin Access"
        subtitle="Verifying your administrative privileges..."
        showProgress={false}
        showStatusIndicators={false}
      />
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Futuristic Space Background */}
        <div className="absolute inset-0">
          {/* Nebula Effect */}
          <div className="absolute inset-0 bg-gradient-radial from-red-900/20 via-transparent to-orange-900/20"></div>
          <div className="absolute inset-0 bg-gradient-radial from-pink-900/15 via-transparent to-red-900/15"></div>
          
          {/* Starfield */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-red-400 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                  opacity: 0.3 + Math.random() * 0.7
                }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="pt-16 relative z-10">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center relative">
                {/* Error Icon */}
                <div className="relative mb-8">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 border-4 border-red-500 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">✕</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating error particles */}
                  <div className="absolute -top-4 -left-4 w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
                  <div className="absolute -top-4 -right-4 w-3 h-3 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute -bottom-4 -left-4 w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute -bottom-4 -right-4 w-3 h-3 bg-red-500 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
                </div>
                
                {/* Error Text */}
                <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg" style={{ textShadow: '0 0 20px rgba(239, 68, 68, 0.5)' }}>
                  Access Denied
                </h2>
                <p className="text-gray-300 mb-6 text-lg">You don't have permission to access this page.</p>
                <p className="text-red-400 text-sm">Please contact an administrator if you believe this is an error.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 
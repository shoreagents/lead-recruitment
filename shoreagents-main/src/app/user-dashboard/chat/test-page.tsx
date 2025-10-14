"use client"

import { UserGuard } from '@/components/auth/UserGuard'
import { UserDashboardSidebar } from '@/components/layout/UserDashboardSidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { useUserAuth } from '@/lib/user-auth-context'
import { Badge } from '@/components/ui/badge'

export default function TestChatPage() {
  const { user } = useUserAuth()

  return (
    <UserGuard>
      <SidebarProvider>
        <UserDashboardSidebar />
        <SidebarInset className="relative h-screen">
          {/* Header */}
          <header className="absolute top-0 left-0 right-80 z-20 h-14 bg-white border-b flex items-center gap-1 px-4">
            <SidebarTrigger className="!size-8 hover:bg-lime-100 [&_svg]:!w-6 [&_svg]:!h-6" />
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold">Chat with Maya</h1>
              <Badge variant="secondary" className="text-xs">
                AI Assistant
              </Badge>
            </div>
          </header>

          {/* Main Content */}
          <div className="absolute top-14 bottom-0 left-0 right-80 overflow-y-auto bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Chat Page</h2>
                <p className="text-gray-600 mb-4">This is a simple test to see if the page renders.</p>
                <p className="text-sm text-gray-500">User: {user?.first_name || 'Anonymous'}</p>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </UserGuard>
  )
}

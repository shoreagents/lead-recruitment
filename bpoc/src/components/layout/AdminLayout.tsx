'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useAdmin } from '@/contexts/AdminContext'
import { 
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  Gamepad2,
  ClipboardList,
  Trophy,
  ChevronDown,
  Brain,
  Sparkles,
  LogOut,
  ChevronUp,
  Home,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface SidebarItem {
  title: string
  icon: any
  href?: string
  children?: { title: string; href: string }[]
}

const platformItems: SidebarItem[] = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { title: 'Users', icon: Users, href: '/admin/users' },
  { title: 'Resumes', icon: FileText, href: '/admin/resumes' },
  { title: 'Work Status', icon: ClipboardList, href: '/admin/work-statuses' },
  { title: 'Analysis', icon: BarChart3, href: '/admin/analysis' },
  { title: 'Jobs', icon: Briefcase, href: '/admin/jobs' },
  { title: 'Applicants', icon: Users, href: '/admin/applicants' },
  { title: 'Games', icon: Gamepad2, href: '/admin/games' },
  { title: 'Leaderboards', icon: Trophy, href: '/admin/leaderboards' }
]




interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  titleContent?: React.ReactNode
  adminUser?: {
    id: string
    email: string
    full_name: string
    admin_level: 'user' | 'admin'
  } | null
}

export default function AdminLayout({ 
  children, 
  title = "Admin Panel", 
  description = "Manage BPOC.IO platform",
  titleContent,
  adminUser 
}: AdminLayoutProps) {
  const { user } = useAuth()
  const { adminUser: contextAdminUser } = useAdmin()
  const router = useRouter()
  
  // Use adminUser from props if provided, otherwise use from context
  const currentAdminUser = adminUser || contextAdminUser
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['platform']))
  const [userExpanded, setUserExpanded] = useState(false)
  const [sidebarMinimized, setSidebarMinimized] = useState(false)
  const pathname = usePathname()

  const toggleExpanded = (itemTitle: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemTitle)) {
      newExpanded.delete(itemTitle)
    } else {
      newExpanded.add(itemTitle)
    }
    setExpandedItems(newExpanded)
  }

  const SidebarItem = ({ item, level = 0, category = 'platform' }: { item: SidebarItem; level?: number; category?: string }) => {
    const router = useRouter()
    const isExpanded = expandedItems.has(item.title)
    const hasChildren = item.children && item.children.length > 0
    const isActive = pathname === item.href || 
                    (pathname === '/admin/dashboard' && item.title === 'Dashboard') ||
                    (pathname === '/admin/users' && item.title === 'Users')

    // Define category colors
    const getCategoryColor = (category: string) => {
      switch (category) {
        case 'platform':
          return 'text-cyan-400'
        case 'management':
          return 'text-purple-400'
        default:
          return 'text-cyan-400'
      }
    }

    const handleClick = () => {
      if (item.href) {
        router.push(item.href)
      } else if (hasChildren) {
        toggleExpanded(item.title)
      }
    }

    return (
      <div>
        <button
          onClick={handleClick}
          className={cn(
            "w-full flex items-center rounded-lg transition-all duration-200 group",
            level === 0 ? "font-medium" : "font-normal",
            isActive ? "bg-white/10" : level === 0 ? "hover:bg-white/10" : "hover:bg-white/5",
            sidebarMinimized ? "justify-center px-2 py-2" : "justify-between px-3 py-2"
          )}
        >
          <div className={cn(
            "flex items-center",
            sidebarMinimized ? "justify-center" : "space-x-3"
          )}>
            <item.icon className={cn(
              "w-4 h-4",
              level === 0 ? getCategoryColor(category) : "text-gray-400"
            )} />
            {!sidebarMinimized && (
              <span className={cn(
                level === 0 ? "text-white" : "text-gray-300"
              )}>
                {item.title}
              </span>
            )}
          </div>
          {hasChildren && !sidebarMinimized && (
            <ChevronUp className={cn(
              "w-4 h-4 transition-transform duration-200",
              isExpanded ? "rotate-0" : "rotate-180"
            )} />
          )}
        </button>
        
        {hasChildren && isExpanded && !sidebarMinimized && (
          <div className="ml-6 mt-2 space-y-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400/30 hover:scrollbar-thumb-gray-400/50">
            {item.children?.map((child) => {
              const isChildActive = pathname === child.href
              return (
                <button
                  key={child.href}
                  onClick={() => router.push(child.href)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-all duration-200",
                    isChildActive ? "bg-white/10 text-white" : "hover:bg-white/5 text-gray-300 hover:text-white"
                  )}
                >
                  <span>{child.title}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden cyber-grid">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="flex relative z-10">
        {/* Sidebar */}
        <div className={cn(
          "h-screen fixed left-0 top-0 glass-card border-r border-white/10 overflow-y-auto transition-all duration-300",
          sidebarMinimized ? "w-16" : "w-64"
        )}>
          <div className={cn(
            "transition-all duration-300",
            sidebarMinimized ? "p-3" : "p-6"
          )}>
            {/* Header */}
            <div className={cn(
              "flex items-center mb-6",
              sidebarMinimized ? "justify-center" : "space-x-2"
            )}>
              <button
                type="button"
                onClick={() => router.push('/home')}
                className={cn(
                  "flex items-center",
                  sidebarMinimized ? "justify-center" : "space-x-2",
                  "group cursor-pointer select-none"
                )}
                title="Go to Home"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                {!sidebarMinimized && (
                  <div>
                    <h2 className="text-lg font-bold gradient-text">BPOC.IO</h2>
                    <p className="text-xs text-gray-400">Admin Panel</p>
                  </div>
                )}
              </button>
              {!sidebarMinimized && (
                <button
                  onClick={() => setSidebarMinimized(!sidebarMinimized)}
                  className="p-1.5 rounded-md hover:bg-white/10 transition-colors border border-white/10 ml-auto"
                  title="Minimize sidebar"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-300 hover:text-white" />
                </button>
              )}
            </div>

            {/* Minimize Button for minimized state */}
            {sidebarMinimized && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => setSidebarMinimized(!sidebarMinimized)}
                  className="p-1.5 rounded-md hover:bg-white/10 transition-colors border border-white/10"
                  title="Expand sidebar"
                >
                  <ChevronRight className="w-4 h-4 text-gray-300 hover:text-white" />
                </button>
              </div>
            )}

            {/* Platform Section */}
            <div className="mb-6">
              <div className={cn(
                "flex items-center mb-3",
                sidebarMinimized ? "justify-center" : "space-x-2"
              )}>
                <Home className="w-4 h-4 text-cyan-400" />
                {!sidebarMinimized && (
                  <span className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Platform</span>
                )}
              </div>
              <div className="space-y-1">
                {platformItems.map((item) => (
                  <SidebarItem key={item.title} item={item} category="platform" />
                ))}
              </div>
            </div>




            {/* User Profile Section */}
            <div className="mt-auto pt-6">
              <Separator className="mb-6 bg-white/10" />
              <div className="space-y-2">
                <button
                  onClick={() => setUserExpanded(!userExpanded)}
                  className={cn(
                    "w-full flex items-center rounded-lg hover:bg-white/10 transition-all duration-200",
                    sidebarMinimized ? "justify-center p-3" : "justify-between p-3"
                  )}
                >
                  <div className={cn(
                    "flex items-center",
                    sidebarMinimized ? "justify-center" : "space-x-3"
                  )}>
                    <Avatar className={cn(
                      sidebarMinimized ? "w-8 h-8" : "w-10 h-10"
                    )}>
                      <AvatarImage 
                        src={currentAdminUser?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture} 
                        alt={currentAdminUser?.full_name || 'Admin'}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white">
                        <UserCircle className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    {!sidebarMinimized && (
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">
                          {currentAdminUser?.full_name || user?.user_metadata?.full_name || 'Admin'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {currentAdminUser?.email || user?.email || 'admin@BPOC.IO'}
                        </p>
                        <p className="text-xs text-cyan-400">
                          Admin
                        </p>
                      </div>
                    )}
                  </div>
                  {!sidebarMinimized && (
                    <ChevronUp className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      userExpanded ? "rotate-0" : "rotate-180"
                    )} />
                  )}
                </button>
                
                {userExpanded && !sidebarMinimized && (
                  <div className="ml-4 mt-2">
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 hover:bg-white/5 text-gray-300 hover:text-white">
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={cn(
          "flex-1 p-8 transition-all duration-300",
          sidebarMinimized ? "ml-16" : "ml-64"
        )}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold gradient-text">{title}</h1>
                  <p className="text-gray-400 mt-2">{description}</p>
                </div>
                {titleContent && (
                  <div className="flex items-center gap-3">
                    {titleContent}
                  </div>
                )}
              </div>
            </div>

            {/* Page Content */}
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  )
} 
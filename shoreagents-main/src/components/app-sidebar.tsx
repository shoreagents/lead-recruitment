"use client"

import * as React from "react"
import { useAuth } from '@/lib/auth-context'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSidebar } from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  BarChart3,
  Database,
  FileText,
  Shield,
  UserCheck,
  Building,
  ChevronDown,
  ChevronRight,
  Info,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const adminNavItems = [
  {
    title: "Dashboard",
    url: "/admin-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Lead Management",
    url: "/admin-dashboard/leads",
    icon: Users,
  },
  {
    title: "Analytics",
    url: "/admin-dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Reports",
    url: "/admin-dashboard/reports",
    icon: FileText,
  },
  {
    title: "Database",
    url: "/admin-dashboard/database",
    icon: Database,
  },
  {
    title: "Settings",
    url: "/admin-dashboard/settings",
    icon: Settings,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const { toggleSidebar, state } = useSidebar()
  
  // Keep dropdown open when on any lead management page
  const isLeadManagementOpen = pathname.startsWith('/admin-dashboard/leads')

  const handleSignOut = async () => {
    try {
      console.log('🔍 AppSidebar - Starting sign out...')
      await signOut()
      console.log('✅ AppSidebar - Sign out completed')
    } catch (error) {
      console.error('❌ AppSidebar - Sign out error:', error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className='pb-0'>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-600 text-white">
            <span className="text-lg font-bold">SA</span>
          </div>
          <div className="grid flex-1 text-left text-base leading-tight [&_p]:hidden [&_p]:data-[collapsible=icon]:block">
            <span className="truncate font-semibold text-lg">ShoreAgents</span>
            <span className="truncate text-sm text-muted-foreground">
              Admin Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-0">
        <SidebarGroup className='pt-0'>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0">
              {adminNavItems.map((item) => {
                if (item.title === "Lead Management") {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <div>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname.startsWith('/admin-dashboard/leads')}
                          tooltip={item.title}
                          className={`${pathname.startsWith('/admin-dashboard/leads') ? '!bg-lime-600 !text-white hover:!bg-lime-700 h-10 data-[active=true]:!bg-lime-600 data-[active=true]:!text-white' : 'hover:!bg-lime-100 hover:!text-lime-800'} text-base h-10 w-full data-[collapsible=icon]:!w-10 data-[collapsible=icon]:!h-10 data-[collapsible=icon]:!p-2`}
                        >
                          <Link href="/admin-dashboard/leads">
                            <item.icon className="w-5 h-5 data-[collapsible=icon]:!w-6 data-[collapsible=icon]:!h-6" />
                            <span className="text-base font-medium data-[collapsible=icon]:!hidden">{item.title}</span>
                            {isLeadManagementOpen ? (
                              <ChevronDown className="w-4 h-4 ml-auto data-[collapsible=icon]:!hidden" />
                            ) : (
                              <ChevronRight className="w-4 h-4 ml-auto data-[collapsible=icon]:!hidden" />
                            )}
                          </Link>
                        </SidebarMenuButton>
                        
                        {isLeadManagementOpen && (
                          <div className="ml-4 mt-1 space-y-1 data-[collapsible=icon]:!hidden">
                            <SidebarMenuButton
                              asChild
                              isActive={pathname === "/admin-dashboard/leads"}
                              tooltip="Lead Details"
                              className={`${pathname === "/admin-dashboard/leads" ? '!bg-lime-600 !text-white hover:!bg-lime-700 h-8' : 'hover:!bg-lime-100 hover:!text-lime-800'} text-sm h-8 w-full`}
                            >
                              <Link href="/admin-dashboard/leads">
                                <Users className="w-4 h-4" />
                                <span className="text-sm font-medium">Lead Tracking</span>
                              </Link>
                            </SidebarMenuButton>
                            
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === "/admin-dashboard/leads/quotations"}
                          tooltip="Lead Quotations"
                          className={`${pathname === "/admin-dashboard/leads/quotations" ? '!bg-lime-600 !text-white hover:!bg-lime-700 h-8' : 'hover:!bg-lime-100 hover:!text-lime-800'} text-sm h-8 w-full`}
                        >
                          <Link href="/admin-dashboard/leads/quotations">
                            <Info className="w-4 h-4" />
                            <span className="text-sm font-medium">Quotations</span>
                          </Link>
                        </SidebarMenuButton>
                          </div>
                        )}
                      </div>
                    </SidebarMenuItem>
                  )
                }
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                      className={`${pathname === item.url ? '!bg-lime-600 !text-white hover:!bg-lime-700 h-10 data-[active=true]:!bg-lime-600 data-[active=true]:!text-white' : 'hover:!bg-lime-100 hover:!text-lime-800'} text-base h-10 w-full data-[collapsible=icon]:!w-10 data-[collapsible=icon]:!h-10 data-[collapsible=icon]:!p-2`}
                    >
                      <Link href={item.url}>
                        <item.icon className="w-5 h-5 data-[collapsible=icon]:!w-6 data-[collapsible=icon]:!h-6" />
                        <span className="text-base font-medium data-[collapsible=icon]:!hidden">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-3 px-3 py-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={user?.first_name} />
            <AvatarFallback className="bg-lime-600 text-white text-sm font-semibold">
              {getInitials(`${user?.first_name || ''} ${user?.last_name || ''}`)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-base leading-tight [&_p]:hidden [&_p]:data-[collapsible=icon]:block">
            <span className="truncate font-semibold text-base">
              {user?.first_name} {user?.last_name}
            </span>
            <span className="truncate text-sm text-muted-foreground">
              {user?.email}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

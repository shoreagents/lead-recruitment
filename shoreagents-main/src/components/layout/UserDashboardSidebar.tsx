"use client"

import { useAuth } from '@/lib/auth-context'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSidebar } from '@/components/ui/sidebar'
import { SidebarTrigger } from '@/components/ui/sidebar'
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
import {
  LayoutDashboard,
  User,
  Users,
  Briefcase,
  Settings,
  LogOut,
  Quote,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Clock,
  Trash2,
  Plus,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useChatContext } from '@/lib/chat-context'

const userNavItems = [
  {
    title: "Dashboard",
    url: "/user-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    url: "/user-dashboard/profile",
    icon: User,
  },
  {
    title: "Candidates",
    url: "/user-dashboard/candidates",
    icon: Users,
  },
  {
    title: "Jobs",
    url: "/user-dashboard/jobs",
    icon: Briefcase,
  },
  {
    title: "Quotation",
    url: "/user-dashboard/quotation",
    icon: Quote,
  },
  {
    title: "Settings",
    url: "/user-dashboard/settings",
    icon: Settings,
  },
]

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface UserDashboardSidebarProps {
  onChatOpen?: () => void;
}

export function UserDashboardSidebar({ onChatOpen }: UserDashboardSidebarProps) {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const { toggleSidebar, state } = useSidebar()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  
  // Chat context for creating new conversations
  const { clearMessages, setCurrentConversationId } = useChatContext()

  const handleSignOut = async () => {
    try {
      console.log('🔍 UserDashboardSidebar - Starting sign out...')
      await signOut()
      console.log('✅ UserDashboardSidebar - Sign out completed')
    } catch (error) {
      console.error('❌ UserDashboardSidebar - Sign out error:', error)
    }
  }

  const handleChatWithMaya = () => {
    if (onChatOpen) {
      onChatOpen()
    }
  }

  const handleNewChat = () => {
    // Clear current messages and conversation
    clearMessages()
    setCurrentConversationId(null)
    
    // Navigate to chat page
    window.location.href = '/user-dashboard/chat'
  }

  const handleLoadConversation = (conversationId: string) => {
    // Set the current conversation ID
    setCurrentConversationId(conversationId)
    
    // Navigate to chat page with conversation ID
    window.location.href = `/user-dashboard/chat?conversation=${conversationId}`
  }

  // Load conversations from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem('chat-conversations')
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations)
        // Convert timestamp strings back to Date objects
        const conversationsWithDates = parsed.map((conv: { timestamp: string; id: string; title: string; messages: any[] }) => ({
          ...conv,
          timestamp: new Date(conv.timestamp)
        }))
        setConversations(conversationsWithDates)
      } catch (error) {
        console.error('Error parsing conversations:', error)
      }
    }
  }, [])

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId))
    const updated = conversations.filter(c => c.id !== conversationId)
    localStorage.setItem('chat-conversations', JSON.stringify(updated))
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className='pb-0'>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-600 text-white">
            <span className="text-lg font-bold">SA</span>
          </div>
          <div className="grid flex-1 text-left text-base leading-tight [&_p]:hidden [&_p]:data-[collapsible=icon]:block">
            <span className="truncate font-semibold text-lg">ShoreAgents</span>
            <span className="truncate text-sm text-muted-foreground">
              User Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-0">
        <SidebarGroup className='pt-0'>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0">
              {userNavItems.map((item) => (
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
              ))}
              
              {/* Separator and Chat with Maya section */}
              <div className="mt-4 mb-2">
                <div className="h-px bg-gray-200 mx-3"></div>
              </div>
              
              {/* Chat with Maya - Main Button */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/user-dashboard/chat'}
                  className={`${pathname === '/user-dashboard/chat' ? '!bg-lime-600 !text-white hover:!bg-lime-700' : 'bg-lime-600 hover:bg-lime-700 text-white'} transition-colors text-base`}
                  tooltip="Chat with Maya"
                >
                  <Link href="/user-dashboard/chat">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-base font-medium">Chat with Maya</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* New Chat Button */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleNewChat}
                  className="w-full hover:!bg-lime-100 hover:!text-lime-800 text-base h-10 cursor-pointer"
                  tooltip="Start New Chat"
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-base font-medium">New Chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Maya Components Button */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/user-dashboard/maya-components'}
                  className={`${pathname === '/user-dashboard/maya-components' ? '!bg-lime-600 !text-white hover:!bg-lime-700' : 'hover:!bg-lime-100 hover:!text-lime-800'} transition-colors text-base`}
                  tooltip="Maya's Components"
                >
                  <Link href="/user-dashboard/maya-components">
                    <Settings className="w-5 h-5" />
                    <span className="text-base font-medium">Maya's Components</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Recent Conversations */}
              {conversations.length > 0 && (
                <>
                  <div className="mt-4 mb-2">
                    <div className="px-3 py-1">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Recent Conversations
                      </h3>
                    </div>
                  </div>
                  
                  {conversations.slice(0, 5).map((conversation) => (
                    <SidebarMenuItem key={conversation.id}>
                      <SidebarMenuButton
                        onClick={() => handleLoadConversation(conversation.id)}
                        className="w-full hover:!bg-gray-100 hover:!text-gray-800 text-sm h-auto py-2 px-3 cursor-pointer"
                        tooltip={conversation.title}
                      >
                        <div className="flex items-center justify-between w-full group">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {conversation.title}
                            </div>
                            <div className="text-xs text-gray-500 truncate mt-1">
                              {conversation.lastMessage}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3" />
                              <span className="text-xs text-gray-400">
                                {conversation.timestamp.toLocaleDateString()}
                              </span>
                              <span className="text-xs text-gray-400">
                                {conversation.messageCount} messages
                              </span>
                            </div>
                          </div>
                          <div
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center hover:bg-gray-200 rounded"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              deleteConversation(conversation.id)
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </div>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </>
              )}
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

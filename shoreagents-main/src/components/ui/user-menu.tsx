"use client"

import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, LogOut, Settings, Building } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export function UserMenu() {
  const { user, signOut, isAdmin } = useAuth()
  const [loading, setLoading] = useState(false)


  // Memoize the sign out handler to prevent unnecessary re-renders
  const handleSignOut = useCallback(async () => {
    setLoading(true)
    try {
      console.log('🔍 UserMenu - Starting sign out...')
      await signOut()
      console.log('✅ UserMenu - Sign out completed')
      toast.success("Signed out successfully")
    } catch (error) {
      console.error("❌ UserMenu - Sign out error:", error)
      toast.error("Failed to sign out")
    } finally {
      setLoading(false)
    }
  }, [signOut])

  // Memoize user initials calculation
  const userInitials = useMemo(() => {
    if (!user?.email) return 'U'
    return user.email
      .split('@')[0]
      .split('.')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }, [user?.email])

  // Memoize user display name
  const userDisplayName = useMemo(() => {
    if (!user) return 'User'
    const firstName = user.user_metadata?.first_name || ''
    const lastName = user.user_metadata?.last_name || ''
    return `${firstName} ${lastName}`.trim() || 'User'
  }, [user])

  if (!user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-lime-600 text-white text-sm font-medium">
              {userInitials || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userDisplayName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            {user.user_metadata?.company && (
              <p className="text-xs leading-none text-muted-foreground flex items-center">
                <Building className="h-3 w-3 mr-1" />
                {user.user_metadata.company}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span><a href={isAdmin ? "/admin-dashboard" : "/user-dashboard"}>Dashboard</a></span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleSignOut}
          disabled={loading}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{loading ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

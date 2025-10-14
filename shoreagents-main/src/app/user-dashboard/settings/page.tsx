"use client"

import { UserGuard } from '@/components/auth/UserGuard'
import { UserDashboardSidebar } from '@/components/layout/UserDashboardSidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { useUserAuth } from '@/lib/user-auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Mail,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  Save,
  BellOff,
  BellRing
} from 'lucide-react'
import { useState } from 'react'

export default function SettingsPage() {
  const { user } = useUserAuth()
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: true
  })
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showOnlineStatus: true,
    allowMessages: true
  })
  const [appearance, setAppearance] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'UTC'
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
  }

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }))
  }

  const handleAppearanceChange = (key: string, value: string) => {
    setAppearance(prev => ({ ...prev, [key]: value }))
  }

  return (
    <UserGuard>
      <SidebarProvider>
        <UserDashboardSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Settings</h1>
              <Badge variant="secondary" className="text-xs">
                Manage your preferences
              </Badge>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4">
            {/* Header */}
            <div className="grid gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Account Settings</h2>
                <p className="text-muted-foreground">
                  Customize your experience and manage your account preferences
                </p>
              </div>
            </div>

            {/* Settings Sections */}
            <div className="grid gap-6">
              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-lime-600" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified in your browser
                      </p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive text message alerts
                      </p>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive promotional content and updates
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy & Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-lime-600" />
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Public Profile</Label>
                      <p className="text-sm text-muted-foreground">
                        Make your profile visible to other users
                      </p>
                    </div>
                    <Switch
                      checked={privacy.profileVisible}
                      onCheckedChange={(checked) => handlePrivacyChange('profileVisible', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Online Status</Label>
                      <p className="text-sm text-muted-foreground">
                        Let others see when you're online
                      </p>
                    </div>
                    <Switch
                      checked={privacy.showOnlineStatus}
                      onCheckedChange={(checked) => handlePrivacyChange('showOnlineStatus', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Direct Messages</Label>
                      <p className="text-sm text-muted-foreground">
                        Let other users send you messages
                      </p>
                    </div>
                    <Switch
                      checked={privacy.allowMessages}
                      onCheckedChange={(checked) => handlePrivacyChange('allowMessages', checked)}
                    />
                  </div>

                  {/* Password Change */}
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-4">Change Password</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter current password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Enter new password"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                        />
                      </div>
                      
                      <Button className="bg-lime-600 hover:bg-lime-700">
                        <Lock className="w-4 h-4 mr-2" />
                        Update Password
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Appearance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-lime-600" />
                    Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={appearance.theme === 'light' ? 'default' : 'outline'}
                        onClick={() => handleAppearanceChange('theme', 'light')}
                        className={appearance.theme === 'light' ? 'bg-lime-600 hover:bg-lime-700' : ''}
                      >
                        Light
                      </Button>
                      <Button
                        variant={appearance.theme === 'dark' ? 'default' : 'outline'}
                        onClick={() => handleAppearanceChange('theme', 'dark')}
                        className={appearance.theme === 'dark' ? 'bg-lime-600 hover:bg-lime-700' : ''}
                      >
                        Dark
                      </Button>
                      <Button
                        variant={appearance.theme === 'auto' ? 'default' : 'outline'}
                        onClick={() => handleAppearanceChange('theme', 'auto')}
                        className={appearance.theme === 'auto' ? 'bg-lime-600 hover:bg-lime-700' : ''}
                      >
                        Auto
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      value={appearance.language}
                      onChange={(e) => handleAppearanceChange('language', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      value={appearance.timezone}
                      onChange={(e) => handleAppearanceChange('timezone', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="PST">Pacific Time</option>
                      <option value="CST">Central Time</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Account Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-lime-600" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Account Type</Label>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-lime-100 text-lime-800">
                          Business Account
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Member Since</Label>
                      <p className="text-sm font-medium">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex gap-2">
                      <Button className="bg-lime-600 hover:bg-lime-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline">
                        Reset to Defaults
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </UserGuard>
  )
}









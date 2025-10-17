"use client"

import { UserGuard } from '@/components/auth/UserGuard'
import { UserDashboardSidebar } from '@/components/layout/UserDashboardSidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { useUserAuth } from '@/lib/user-auth-context'
import { useUserProfile, useUpdateUserProfile } from '@/hooks/use-api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  User, 
  Mail, 
  Building, 
  Calendar,
  Edit,
  Save,
  X,
  FileText,
  Briefcase,
  Shield,
  TrendingUp,
  CheckCircle,
  RefreshCw
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useToast } from '@/lib/toast-context'

export default function ProfilePage() {
  const { user } = useUserAuth()
  const { data: profileData, isLoading, refetch } = useUserProfile(user?.user_id || '')
  const updateProfileMutation = useUpdateUserProfile()
  const { showToast } = useToast()
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    industry: ''
  })

  // Update form data when profile data loads
  useEffect(() => {
    if (profileData) {
      setFormData({
        firstName: profileData.first_name || '',
        lastName: profileData.last_name || '',
        email: profileData.email || '',
        company: profileData.company || '',
        industry: profileData.industry_name || ''
      })
    }
  }, [profileData])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!user?.user_id) return
    
    try {
      await updateProfileMutation.mutateAsync({
        user_id: user.user_id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        company: formData.company,
        industry_name: formData.industry
      })
      
      showToast('Profile updated successfully!', 'success')
      setIsEditing(false)
      refetch()
    } catch (error) {
      showToast('Failed to update profile. Please try again.', 'error')
      console.error('Error updating profile:', error)
    }
  }

  const handleCancel = () => {
    if (profileData) {
      setFormData({
        firstName: profileData.first_name || '',
        lastName: profileData.last_name || '',
        email: profileData.email || '',
        company: profileData.company || '',
        industry: profileData.industry_name || ''
      })
    }
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'Regular':
        return 'bg-lime-100 text-lime-800 border-lime-300'
      case 'Admin':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getEngagementLevel = () => {
    const leadCaptureCount = [
      profileData?.first_lead_capture,
      profileData?.second_lead_capture,
      profileData?.third_lead_capture
    ].filter(Boolean).length

    if (leadCaptureCount === 3) return { level: 'High', color: 'text-green-600', icon: TrendingUp }
    if (leadCaptureCount >= 1) return { level: 'Medium', color: 'text-yellow-600', icon: TrendingUp }
    return { level: 'Low', color: 'text-gray-600', icon: TrendingUp }
  }

  if (isLoading) {
    return (
      <UserGuard>
        <SidebarProvider>
          <UserDashboardSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <h1 className="text-lg font-semibold">Profile</h1>
            </header>
            <div className="flex flex-1 items-center justify-center">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-lime-600" />
                <span className="text-lime-600">Loading profile...</span>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </UserGuard>
    )
  }

  const engagement = getEngagementLevel()
  const EngagementIcon = engagement.icon

  return (
    <UserGuard>
      <SidebarProvider>
        <UserDashboardSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Profile</h1>
              <Badge variant="secondary" className="text-xs">
                Manage your account
              </Badge>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-6 p-6">
            {/* Profile Header with Stats */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {formData.company || 'No company specified'}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge className={getUserTypeColor(profileData?.user_type || '')}>
                    <Shield className="w-3 h-3 mr-1" />
                    {profileData?.user_type}
                  </Badge>
                  {profileData?.email && (
                    <Badge variant="outline" className="border-lime-300 text-lime-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
              {!isEditing ? (
                <Button onClick={handleEdit} className="bg-lime-600 hover:bg-lime-700">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSave} 
                    className="bg-lime-600 hover:bg-lime-700"
                    disabled={updateProfileMutation.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-lime-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Quotes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-lime-600">
                      {profileData?.quoteCount || 0}
                    </div>
                    <FileText className="w-8 h-8 text-lime-600 opacity-50" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pricing quotes generated
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-lime-100 text-lime-800 text-sm px-3 py-1">
                      Active
                    </Badge>
                    <CheckCircle className="w-8 h-8 text-lime-600 opacity-50" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your account is active
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className={`text-2xl font-bold ${engagement.color}`}>
                      {engagement.level}
                    </div>
                    <EngagementIcon className={`w-8 h-8 ${engagement.color} opacity-50`} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Platform interaction level
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Member Since</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-900">
                      {profileData?.created_at 
                        ? new Date(profileData.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          })
                        : 'N/A'}
                    </div>
                    <Calendar className="w-8 h-8 text-orange-600 opacity-50" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Join date
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-lime-600" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">
                        First Name
                      </Label>
                      {isEditing ? (
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="Enter first name"
                        />
                      ) : (
                        <p className="text-sm font-medium py-2 px-3 bg-gray-50 rounded-md">
                          {formData.firstName || 'Not specified'}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </Label>
                      {isEditing ? (
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Enter last name"
                        />
                      ) : (
                        <p className="text-sm font-medium py-2 px-3 bg-gray-50 rounded-md">
                          {formData.lastName || 'Not specified'}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    {isEditing ? (
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your.email@example.com"
                          className="pl-10"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-md">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <p className="text-sm font-medium">
                          {formData.email || 'Not specified'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userId" className="text-sm font-medium">
                      User ID
                    </Label>
                    <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-md">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <p className="text-sm font-mono text-gray-600 truncate">
                        {profileData?.user_id || 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Company & Professional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-lime-600" />
                    Company & Professional
                  </CardTitle>
                  <CardDescription>
                    Your organization and industry details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium">
                      Company Name
                    </Label>
                    {isEditing ? (
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder="Enter company name"
                          className="pl-10"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-md">
                        <Building className="w-4 h-4 text-gray-500" />
                        <p className="text-sm font-medium">
                          {formData.company || 'Not specified'}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-sm font-medium">
                      Industry
                    </Label>
                    {isEditing ? (
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                          id="industry"
                          value={formData.industry}
                          onChange={(e) => handleInputChange('industry', e.target.value)}
                          placeholder="Enter industry"
                          className="pl-10"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-md">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <p className="text-sm font-medium">
                          {formData.industry || 'Not specified'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Account Type
                    </Label>
                    <div className="py-2 px-3 bg-gray-50 rounded-md">
                      <Badge className={getUserTypeColor(profileData?.user_type || '')}>
                        {profileData?.user_type || 'Not specified'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activity & Engagement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-lime-600" />
                  Activity & Engagement
                </CardTitle>
                <CardDescription>
                  Your platform usage and interaction history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-5 h-5 ${profileData?.first_lead_capture ? 'text-lime-600' : 'text-gray-300'}`} />
                      <Label className="text-sm font-medium">First Lead Capture</Label>
                    </div>
                    <p className="text-xs text-muted-foreground ml-7">
                      {profileData?.first_lead_capture ? 'Completed' : 'Not completed'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-5 h-5 ${profileData?.second_lead_capture ? 'text-lime-600' : 'text-gray-300'}`} />
                      <Label className="text-sm font-medium">Second Lead Capture</Label>
                    </div>
                    <p className="text-xs text-muted-foreground ml-7">
                      {profileData?.second_lead_capture ? 'Completed' : 'Not completed'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-5 h-5 ${profileData?.third_lead_capture ? 'text-lime-600' : 'text-gray-300'}`} />
                      <Label className="text-sm font-medium">Third Lead Capture</Label>
                    </div>
                    <p className="text-xs text-muted-foreground ml-7">
                      {profileData?.third_lead_capture ? 'Completed' : 'Not completed'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Account Created</Label>
                      <p className="text-sm font-semibold mt-1">
                        {profileData?.created_at 
                          ? new Date(profileData.created_at).toLocaleDateString('en-US', { 
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
                      <p className="text-sm font-semibold mt-1">
                        {profileData?.updated_at 
                          ? new Date(profileData.updated_at).toLocaleDateString('en-US', { 
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </UserGuard>
  )
}

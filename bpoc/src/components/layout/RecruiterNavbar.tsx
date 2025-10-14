'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Building2, LogOut, ChevronDown, User, Inbox, Bell, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RecruiterNavbarProps {
  currentPage?: string;
  onSignInClick?: () => void;
  onSignUpClick?: () => void;
}

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url?: string;
}

export default function RecruiterNavbar({ 
  currentPage = '', 
  onSignInClick,
  onSignUpClick 
}: RecruiterNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isAuthenticated = !!user;

  // Dummy notification data
  const notifications = [
    {
      id: 1,
      title: "New Application Received",
      message: "John Doe applied for your Software Engineer position",
      time: "2 minutes ago",
      unread: true,
      type: "application"
    },
    {
      id: 2,
      title: "Profile View",
      message: "Sarah Wilson viewed your company profile",
      time: "15 minutes ago",
      unread: true,
      type: "profile_view"
    },
    {
      id: 3,
      title: "Job Post Expiring",
      message: "Your 'Marketing Manager' job post expires in 2 days",
      time: "1 hour ago",
      unread: false,
      type: "job_expiry"
    },
    {
      id: 4,
      title: "New Message",
      message: "You have a new message from a candidate",
      time: "3 hours ago",
      unread: false,
      type: "message"
    },
    {
      id: 5,
      title: "Weekly Report",
      message: "Your weekly recruitment report is ready",
      time: "1 day ago",
      unread: false,
      type: "report"
    }
  ];

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications) {
        const target = event.target as Element;
        if (!target.closest('.notification-dropdown')) {
          setShowNotifications(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Fetch user profile from Railway
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          setProfileLoading(true);
          console.log('🔄 Fetching user profile for:', user.id);
          const response = await fetch(`/api/user/profile?userId=${user.id}`);
          if (response.ok) {
            const data = await response.json();
            console.log('✅ User profile loaded:', data.user);
            
             // Check if user has missing name information (common with Google OAuth)
             if (!data.user.first_name || !data.user.last_name || !data.user.full_name) {
               console.log('⚠️ User missing name information, attempting to sync with Google data...');
               console.log('🔍 User metadata from Supabase:', user.user_metadata);
               console.log('🔍 Available name fields:', {
                 given_name: user.user_metadata?.given_name,
                 family_name: user.user_metadata?.family_name,
                 name: user.user_metadata?.name,
                 first_name: user.user_metadata?.first_name,
                 last_name: user.user_metadata?.last_name,
                 full_name: user.user_metadata?.full_name
               });
               try {
                // Parse name data from Google metadata
                let firstName = user.user_metadata?.first_name || user.user_metadata?.given_name || ''
                let lastName = user.user_metadata?.last_name || user.user_metadata?.family_name || ''
                let fullName = user.user_metadata?.full_name || user.user_metadata?.name || ''
                
                // If we have a full name but no individual names, parse it
                if (fullName && (!firstName || !lastName)) {
                  const nameParts = fullName.trim().split(' ')
                  if (nameParts.length >= 2) {
                    firstName = nameParts[0]
                    lastName = nameParts.slice(1).join(' ')
                  } else if (nameParts.length === 1) {
                    firstName = nameParts[0]
                    lastName = ''
                  }
                }
                
                // Fallback to email if no name data at all
                if (!fullName && !firstName && !lastName) {
                  fullName = user.email
                }

                const syncResponse = await fetch('/api/user/sync', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    id: user.id,
                    email: user.email,
                    first_name: firstName,
                    last_name: lastName,
                    full_name: fullName,
                    location: user.user_metadata?.location || '',
                    avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
                    phone: user.user_metadata?.phone || '',
                    bio: user.user_metadata?.bio || '',
                    position: user.user_metadata?.position || '',
                    company: user.user_metadata?.company || '',
                    completed_data: data.user.completed_data || false,
                    birthday: user.user_metadata?.birthday || null,
                    gender: user.user_metadata?.gender || null,
                    admin_level: 'recruiter'
                  })
                });

                if (syncResponse.ok) {
                  console.log('✅ User name information synced successfully, retrying profile fetch...');
                  // Retry fetching the profile
                  const retryResponse = await fetch(`/api/user/profile?userId=${user.id}`);
                  if (retryResponse.ok) {
                    const retryData = await retryResponse.json();
                    setUserProfile(retryData.user);
                  }
                } else {
                  console.error('❌ Failed to sync user name information:', syncResponse.status);
                  setUserProfile(data.user); // Still set the profile even if sync failed
                }
              } catch (syncError) {
                console.error('❌ Error during user name sync:', syncError);
                setUserProfile(data.user); // Still set the profile even if sync failed
              }
            } else {
              setUserProfile(data.user);
            }
          } else if (response.status === 404) {
            // User not found in database, try to sync them
            console.log('⚠️ User not found in database, attempting to sync...');
            try {
              // Parse name data from Google metadata
              let firstName = user.user_metadata?.first_name || user.user_metadata?.given_name || ''
              let lastName = user.user_metadata?.last_name || user.user_metadata?.family_name || ''
              let fullName = user.user_metadata?.full_name || user.user_metadata?.name || ''
              
              // If we have a full name but no individual names, parse it
              if (fullName && (!firstName || !lastName)) {
                const nameParts = fullName.trim().split(' ')
                if (nameParts.length >= 2) {
                  firstName = nameParts[0]
                  lastName = nameParts.slice(1).join(' ')
                } else if (nameParts.length === 1) {
                  firstName = nameParts[0]
                  lastName = ''
                }
              }
              
              // Fallback to email if no name data at all
              if (!fullName && !firstName && !lastName) {
                fullName = user.email
              }

              const syncResponse = await fetch('/api/user/sync', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  id: user.id,
                  email: user.email,
                  first_name: firstName,
                  last_name: lastName,
                  full_name: fullName,
                  location: user.user_metadata?.location || '',
                  avatar_url: user.user_metadata?.avatar_url || null,
                  phone: user.user_metadata?.phone || '',
                  bio: user.user_metadata?.bio || '',
                  position: user.user_metadata?.position || '',
                  company: user.user_metadata?.company || '',
                  completed_data: false,
                  birthday: user.user_metadata?.birthday || null,
                  gender: user.user_metadata?.gender || null,
                  admin_level: 'recruiter'
                })
              });

              if (syncResponse.ok) {
                console.log('✅ User synced successfully, retrying profile fetch...');
                // Retry fetching the profile
                const retryResponse = await fetch(`/api/user/profile?userId=${user.id}`);
                if (retryResponse.ok) {
                  const retryData = await retryResponse.json();
                  setUserProfile(retryData.user);
                }
              } else {
                console.error('❌ Failed to sync user:', syncResponse.status);
              }
            } catch (syncError) {
              console.error('❌ Error during user sync:', syncError);
            }
          } else {
            console.error('❌ Failed to fetch user profile:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('❌ Error fetching user profile:', error);
        } finally {
          setProfileLoading(false);
        }
      } else {
        console.log('⚠️ No user ID available for profile fetch');
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  const handleSignOut = async () => {
    try {
      console.log('🔘 Sign out button clicked');
      console.log('👤 Current user:', user?.email);
      console.log('🔑 Auth state before sign out:', !!user);
      
      await signOut();
      console.log('✅ Sign out completed successfully');
      
      setShowSignOutDialog(false);
      
      // Force a page refresh to ensure all state is cleared
      console.log('🔄 Redirecting to recruiter page...');
      window.location.href = '/recruiter';
    } catch (error) {
      console.error('❌ Sign out error:', error);
      // Still close the dialog even if there's an error
      setShowSignOutDialog(false);
      alert('Sign out failed. Please try again.');
    }
  };

  // Extract user info from Railway data only
  const userDisplayName = profileLoading ? 'Loading...' : (userProfile?.full_name || 'User');
  const userInitials = profileLoading ? 'L' : (userProfile?.full_name 
    ? userProfile.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)
    : 'U');

  const isActive = (path: string) => {
    if (path === '/recruiter' && pathname === '/recruiter') return true;
    if (path !== '/recruiter' && pathname.startsWith(path)) return true;
    return false;
  };

  // Check if we're on the main recruiter landing page
  const isRecruiterLanding = pathname === '/recruiter';

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg shadow-gray-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                BPOC Recruiter
              </span>
            </div>
            
            {/* Navigation Links - Only show on non-landing pages */}
            {!isRecruiterLanding && (
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/recruiter" className={`font-medium transition-colors duration-200 relative group ${
                  isActive('/recruiter') 
                    ? 'text-emerald-600 border-b-2 border-emerald-600' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}>
                  Home
                  {isActive('/recruiter') && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-teal-600"></span>
                  )}
                </Link>
                <Link href="/recruiter/dashboard" className={`font-medium transition-colors duration-200 relative group ${
                  isActive('/recruiter/dashboard') 
                    ? 'text-emerald-600 border-b-2 border-emerald-600' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}>
                  Dashboard
                  {isActive('/recruiter/dashboard') && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-teal-600"></span>
                  )}
                </Link>
                <Link href="/recruiter/post-job" className={`font-medium transition-colors duration-200 relative group ${
                  isActive('/recruiter/post-job') 
                    ? 'text-emerald-600 border-b-2 border-emerald-600' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}>
                  Jobs
                  {isActive('/recruiter/post-job') && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-teal-600"></span>
                  )}
                  {!isActive('/recruiter/post-job') && (
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-200 group-hover:w-full"></span>
                  )}
                </Link>
                <Link href="/recruiter/applications" className={`font-medium transition-colors duration-200 relative group ${
                  isActive('/recruiter/applications') 
                    ? 'text-emerald-600 border-b-2 border-emerald-600' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}>
                  Applications
                  {isActive('/recruiter/applications') && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-teal-600"></span>
                  )}
                </Link>
                <Link href="/recruiter/candidates" className={`font-medium transition-colors duration-200 relative group ${
                  isActive('/recruiter/candidates') 
                    ? 'text-emerald-600 border-b-2 border-emerald-600' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}>
                  Applicants
                  {isActive('/recruiter/candidates') && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-teal-600"></span>
                  )}
                </Link>
                <Link href="/recruiter/leaderboard" className={`font-medium transition-colors duration-200 relative group ${
                  isActive('/recruiter/leaderboard') 
                    ? 'text-emerald-600 border-b-2 border-emerald-600' 
                    : 'text-gray-700 hover:text-emerald-600'
                }`}>
                  Leaderboard
                  {isActive('/recruiter/leaderboard') && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-teal-600"></span>
                  )}
                </Link>
              </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && user ? (
              // If on landing page and authenticated, redirect to dashboard
              isRecruiterLanding ? (
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 px-4 py-2 font-medium transition-all duration-200 rounded-full"
                    onClick={() => router.push('/home')}
                  >
                    ← Back to BPOC
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-2 font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 rounded-full transform hover:scale-105"
                    onClick={() => router.push('/recruiter/dashboard')}
                  >
                    Go to Dashboard →
                  </Button>
                </div>
              ) : (
                // Full navbar for authenticated users on other pages
                <div className="flex items-center space-x-3">
                  {/* User Menu */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all duration-200 border border-gray-200 -mt-1">
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center overflow-hidden">
                        {userProfile?.avatar_url ? (
                          <img
                            src={userProfile.avatar_url}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-bold text-white">
                            {userInitials}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700 hidden sm:block">{userDisplayName}</span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl shadow-gray-900/10">
                      <button
                        onClick={() => router.push('/recruiter/profile')}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={() => setShowSignOutDialog(true)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                  
                  
                  {/* Notification Icon */}
                  <div className="relative">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 transition-all duration-200 rounded-full border border-black relative"
                            onClick={() => setShowNotifications(!showNotifications)}
                          >
                            <Bell className="w-4 h-4" />
                            {notifications.filter(n => n.unread).length > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {notifications.filter(n => n.unread).length}
                              </span>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Notifications</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                      <div className="notification-dropdown absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                            <button
                              onClick={() => setShowNotifications(false)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              No notifications yet
                            </div>
                          ) : (
                            notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                                  notification.unread ? 'bg-blue-50' : ''
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className={`w-2 h-2 rounded-full mt-2 ${
                                    notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                                  }`} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">
                                      {notification.title}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">
                                      {notification.time}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        
                        <div className="p-3 border-t border-gray-200">
                          <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                            View All Notifications
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Inbox Icon */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-gray-600 hover:text-gray-900 px-3 py-2 transition-all duration-200 rounded-full border border-black"
                          onClick={() => router.push('/recruiter/messages')}
                        >
                          <Inbox className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Inbox</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )
            ) : (
              // Simplified navbar for non-authenticated users on landing page
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 px-4 py-2 font-medium transition-all duration-200 rounded-full"
                  onClick={onSignInClick}
                >
                  Sign In
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-2 font-medium transition-all duration-200 shadow-sm rounded-full"
                  onClick={onSignUpClick}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Sign Out Alert Dialog */}
      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent className="bg-white border-gray-200 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Sign Out</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to sign out? You'll need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSignOut}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard,
  Briefcase,
  Users,
  Trophy,
  MessageCircle,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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
import { cn } from '@/lib/utils';

interface SidebarItem {
  title: string;
  icon: any;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/recruiter/dashboard' },
  { title: 'Jobs', icon: Briefcase, href: '/recruiter/post-job' },
  { title: 'Applications', icon: Users, href: '/recruiter/applications' },
  { title: 'Applicants', icon: Users, href: '/recruiter/candidates' },
  { title: 'Leaderboard', icon: Trophy, href: '/recruiter/leaderboard' },
  { title: 'Messages', icon: MessageCircle, href: '/recruiter/messages' },
];

interface RecruiterSidebarProps {
  userProfile: any;
  profileLoading: boolean;
}

export default function RecruiterSidebar({ userProfile, profileLoading }: RecruiterSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [minimized, setMinimized] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  const userDisplayName = profileLoading ? 'Loading...' : (userProfile?.full_name || 'User');
  const userInitials = profileLoading ? 'L' : (userProfile?.full_name 
    ? userProfile.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U');

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowSignOutDialog(false);
      window.location.href = '/recruiter';
    } catch (error) {
      console.error('❌ Sign out error:', error);
      setShowSignOutDialog(false);
      alert('Sign out failed. Please try again.');
    }
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      <div className={cn(
        "fixed left-0 top-0 h-screen bg-gradient-to-b from-emerald-600 to-emerald-800 text-white transition-all duration-300 flex flex-col shadow-2xl z-50",
        minimized ? "w-20" : "w-64"
      )}>
        {/* Header */}
        <div className={cn(
          "p-4 flex items-center border-b border-white/10",
          minimized ? "justify-center" : "justify-between"
        )}>
          {!minimized && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-lg font-bold">BPOC Recruiter</span>
            </div>
          )}
          {minimized && (
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-emerald-600" />
            </div>
          )}
        </div>

        {/* User Profile Section */}
        <div className={cn(
          "p-4 border-b border-white/10",
          minimized ? "flex justify-center" : ""
        )}>
          <div className={cn(
            "flex items-center",
            minimized ? "flex-col space-y-2" : "space-x-3"
          )}>
            <Avatar className={minimized ? "w-10 h-10" : "w-12 h-12"}>
              {userProfile?.avatar_url ? (
                <AvatarImage src={userProfile.avatar_url} alt={userDisplayName} />
              ) : (
                <AvatarFallback className="bg-white text-emerald-600 font-bold">
                  {userInitials}
                </AvatarFallback>
              )}
            </Avatar>
            {!minimized && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {userDisplayName}
                </p>
                <p className="text-xs text-emerald-100 truncate">
                  {profileLoading ? 'Loading...' : userProfile?.email || user?.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
          {sidebarItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg transition-all duration-200 group",
                  active 
                    ? "bg-white/20 text-white" 
                    : "text-white/80 hover:bg-white/10 hover:text-white",
                  minimized ? "justify-center px-2 py-3" : "px-3 py-2 space-x-3"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!minimized && (
                  <span className="text-sm font-medium">{item.title}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <Separator className="bg-white/10" />

        {/* Bottom Actions */}
        <div className="p-2 space-y-1">
          {/* Profile */}
          <button
            onClick={() => router.push('/recruiter/profile')}
            className={cn(
              "w-full flex items-center rounded-lg transition-all duration-200 text-white/80 hover:bg-white/10 hover:text-white",
              minimized ? "justify-center px-2 py-3" : "px-3 py-2 space-x-3"
            )}
          >
            <User className="w-5 h-5 flex-shrink-0" />
            {!minimized && <span className="text-sm font-medium">Profile</span>}
          </button>

          {/* Sign Out */}
          <button
            onClick={() => setShowSignOutDialog(true)}
            className={cn(
              "w-full flex items-center rounded-lg transition-all duration-200 text-red-200 hover:bg-red-500/20 hover:text-red-100",
              minimized ? "justify-center px-2 py-3" : "px-3 py-2 space-x-3"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!minimized && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <div className="p-2 border-t border-white/10">
          <button
            onClick={() => setMinimized(!minimized)}
            className="w-full flex items-center justify-center py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
          >
            {minimized ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Sign Out Dialog */}
      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You'll need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


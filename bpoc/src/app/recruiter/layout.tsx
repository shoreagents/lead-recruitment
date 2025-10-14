'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import RecruiterSidebar from '@/components/layout/RecruiterSidebar';
import RecruiterFooter from '@/components/layout/RecruiterFooter';
import { cn } from '@/lib/utils';

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          setProfileLoading(true);
          const response = await fetch(`/api/user/profile?userId=${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setUserProfile(data.user);
          }
        } catch (error) {
          console.error('❌ Error fetching user profile:', error);
        } finally {
          setProfileLoading(false);
        }
      } else {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  // Check if we're on the landing page (/recruiter root)
  const isLandingPage = pathname === '/recruiter';
  
  // Only show sidebar if user is authenticated and NOT on landing page
  const showSidebar = !!user && !isLandingPage;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - only shown when authenticated and not on landing page */}
      {showSidebar && (
        <RecruiterSidebar 
          userProfile={userProfile}
          profileLoading={profileLoading}
        />
      )}

      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all duration-300 flex flex-col min-h-screen",
        showSidebar ? "ml-64" : "ml-0"
      )}>
        <div className="flex-1">
          {children}
        </div>
        {/* Footer - only show on authenticated pages (not landing page) */}
        {showSidebar && <RecruiterFooter />}
      </div>
    </div>
  );
}


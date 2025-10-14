'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { contentTracker } from '@/lib/contentTrackingService';

interface ContentTrackerProps {
  contentType: string;
  contentId?: string;
  contentTitle?: string;
  pageSection?: string;
  children?: React.ReactNode;
}

export function ContentTracker({
  contentType,
  contentId,
  contentTitle,
  pageSection,
  children
}: ContentTrackerProps) {
  const pathname = usePathname();
  const { user, appUser } = useAuth();

  // Generate content ID from pathname if not provided
  const finalContentId = contentId || pathname.replace(/^\//, '') || 'home';
  const finalContentTitle = contentTitle || (typeof document !== 'undefined' ? document.title : '');

  useEffect(() => {
    console.log('🎯 ContentTracker useEffect triggered', {
      contentType,
      finalContentId,
      finalContentTitle,
      pageSection,
      appUser: !!appUser,
      user: !!user
    });
    
    const trackView = async () => {
      console.log('🚀 ContentTracker: Starting to track page view', {
        contentType,
        finalContentId,
        finalContentTitle,
        pageSection,
        userId: appUser?.user_id,
        appUser: appUser,
        user: user,
        isAuthenticated: !!user
      });

      try {
        const result = await contentTracker.trackPageView(
          contentType,
          finalContentId,
          {
            user_id: appUser?.user_id || null, // Pass user_id from auth context
            content_title: finalContentTitle,
            page_section: pageSection || 'main'
          }
        );
        console.log('ContentTracker: Track page view result:', result);
      } catch (error) {
        console.error('ContentTracker: Error tracking page view:', error);
      }
    };

    trackView();
  }, [contentType, finalContentId, finalContentTitle, pageSection, appUser?.user_id]);

  // Track page exit
  useEffect(() => {
    const handleBeforeUnload = () => {
      contentTracker.updateContentView({
        content_type: contentType,
        content_id: finalContentId
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        contentTracker.updateContentView({
          content_type: contentType,
          content_id: finalContentId
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [contentType, finalContentId]);

  return <>{children}</>;
}

// Higher-order component for easy wrapping
export function withContentTracking<P extends object>(
  Component: React.ComponentType<P>,
  trackingConfig: Omit<ContentTrackerProps, 'children'>
) {
  return function TrackedComponent(props: P) {
    return (
      <ContentTracker {...trackingConfig}>
        <Component {...props} />
      </ContentTracker>
    );
  };
}

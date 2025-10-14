'use client';

import { useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { contentTracker } from '@/lib/contentTrackingService';

interface UseContentTrackingOptions {
  contentType: string;
  contentId?: string;
  contentTitle?: string;
  pageSection?: string;
  autoTrack?: boolean;
}

export function useContentTracking({
  contentType,
  contentId,
  contentTitle,
  pageSection,
  autoTrack = true
}: UseContentTrackingOptions) {
  const pathname = usePathname();
  const { user, appUser } = useAuth();

  // Generate content ID from pathname if not provided
  const finalContentId = contentId || pathname.replace(/^\//, '') || 'home';
  const finalContentTitle = contentTitle || document.title;

  // Track page view on mount
  useEffect(() => {
    if (!autoTrack) return;

    const trackView = async () => {
      await contentTracker.trackPageView(
        contentType,
        finalContentId,
        {
          user_id: appUser?.user_id || null, // Pass user_id from auth context
          content_title: finalContentTitle,
          page_section: pageSection || 'main'
        }
      );
    };

    trackView();
  }, [contentType, finalContentId, finalContentTitle, pageSection, autoTrack, appUser?.user_id]);

  // Track page exit
  useEffect(() => {
    if (!autoTrack) return;

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
  }, [contentType, finalContentId, autoTrack]);

  // Manual tracking functions
  const trackSectionView = useCallback(async (section: string) => {
    return contentTracker.trackSectionView(
      contentType,
      finalContentId,
      section,
      {
        user_id: user?.id || null,
        content_title: finalContentTitle
      }
    );
  }, [contentType, finalContentId, finalContentTitle, user?.id]);

  const trackFormSubmission = useCallback(async (formName?: string) => {
    return contentTracker.trackFormSubmission(
      contentType,
      finalContentId,
      {
        user_id: user?.id || null,
        content_title: finalContentTitle,
        page_section: formName || pageSection
      }
    );
  }, [contentType, finalContentId, finalContentTitle, pageSection, user?.id]);

  const trackInteraction = useCallback(async (interactionType?: string) => {
    return contentTracker.trackInteraction(
      contentType,
      finalContentId,
      {
        user_id: user?.id || null,
        content_title: finalContentTitle,
        page_section: interactionType || pageSection
      }
    );
  }, [contentType, finalContentId, finalContentTitle, pageSection, user?.id]);

  const updateView = useCallback(async (data: Record<string, unknown>) => {
    return contentTracker.updateContentView({
      content_type: contentType,
      content_id: finalContentId,
      user_id: user?.id || null,
      ...data
    });
  }, [contentType, finalContentId, user?.id]);

  return {
    trackSectionView,
    trackFormSubmission,
    trackInteraction,
    updateView,
    contentId: finalContentId,
    contentTitle: finalContentTitle
  };
}

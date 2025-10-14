'use client';

import { createClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface ContentViewData {
  user_id?: string | null;
  session_id?: string;
  device_id?: string;
  content_type: string;
  content_id: string;
  content_title?: string;
  content_url?: string;
  page_section?: string;
  referrer_url?: string;
  referrer_type?: string;
  view_duration?: number;
  scroll_depth?: number;
  interaction_type?: 'view' | 'click' | 'scroll' | 'form_submit' | 'page_exit' | 'return_visit';
  activity_count?: number;
}

class ContentTrackingServiceSimple {
  private supabase: SupabaseClient | null = null;
  private sessionId: string | null = null;
  private deviceId: string | null = null;
  private startTime: number = 0;
  private maxScrollDepth: number = 0;
  private activityCount: number = 1;
  private isTracking: boolean = false;
  private currentViewId: string | null = null;
  private currentInteractionType: 'view' | 'click' | 'scroll' | 'form_submit' | 'page_exit' | 'return_visit' = 'view';

  constructor() {
    console.log('🏗️ ContentTrackingServiceSimple constructor called');
    
    try {
      this.supabase = createClient();
      console.log('🔗 Supabase client created:', !!this.supabase);
    } catch (error) {
      console.error('❌ Failed to create Supabase client:', error);
      this.supabase = null;
    }
    
    this.initializeTracking();
  }

  private initializeTracking() {
    console.log('🔄 Initializing simple tracking...');
    
    try {
      // Generate or retrieve session ID
      this.sessionId = this.getOrCreateSessionId();
      console.log('📱 Session ID set:', this.sessionId);
      
      // Generate or retrieve device ID
      this.deviceId = this.getOrCreateDeviceId();
      console.log('📱 Device ID set:', this.deviceId);
      
      // Initialize scroll tracking
      this.initializeScrollTracking();
      
      // Initialize interaction tracking
      this.initializeInteractionTracking();
      
      console.log('✅ Simple tracking initialization complete');
    } catch (error) {
      console.error('❌ Error in initializeTracking:', error);
      throw error;
    }
  }

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return '';
    
    try {
      let sessionId = sessionStorage.getItem('content_tracking_session_id');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('content_tracking_session_id', sessionId);
      }
      return sessionId;
    } catch (error) {
      console.error('❌ Error in getOrCreateSessionId:', error);
      return `session_${Date.now()}_fallback`;
    }
  }

  private getOrCreateDeviceId(): string {
    if (typeof window === 'undefined') return '';
    
    try {
      let deviceId = localStorage.getItem('content_tracking_device_id');
      if (!deviceId) {
        deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('content_tracking_device_id', deviceId);
      }
      return deviceId;
    } catch (error) {
      console.error('❌ Error in getOrCreateDeviceId:', error);
      return `device_${Date.now()}_fallback`;
    }
  }

  private initializeScrollTracking() {
    if (typeof window === 'undefined') return;

    let ticking = false;
    
    const updateScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (docHeight > 0) {
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);
        const previousMaxScroll = this.maxScrollDepth;
        this.maxScrollDepth = Math.max(this.maxScrollDepth, scrollPercent);
        
        // If scroll depth increased significantly, update the database
        if (this.maxScrollDepth > previousMaxScroll + 10) {
          this.activityCount++;
          this.currentInteractionType = 'scroll';
          console.log('📊 Scroll depth increased:', this.maxScrollDepth, 'Activity count:', this.activityCount);
          if (this.currentViewId && this.isTracking) {
            this.updateContentView({});
          }
        }
      }
      
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDepth);
        ticking = true;
      }
    };

    // Initial scroll depth calculation
    updateScrollDepth();
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Also track on resize
    window.addEventListener('resize', updateScrollDepth, { passive: true });
  }

  private initializeInteractionTracking() {
    if (typeof window === 'undefined') return;

    // Track clicks on interactive elements
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      // Only count meaningful interactions
      if (target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.closest('button') || 
          target.closest('a') ||
          target.closest('[role="button"]') ||
          target.closest('.cursor-pointer')) {
        this.activityCount++;
        this.currentInteractionType = 'click';
        console.log('🖱️ Click interaction tracked:', this.activityCount);
        
        // Update database immediately when interaction occurs
        if (this.currentViewId && this.isTracking) {
          this.updateContentView({});
        }
      }
    }, { passive: true });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      this.activityCount++;
      this.currentInteractionType = 'form_submit';
      console.log('📝 Form submission tracked, Activity count:', this.activityCount);
      
      // Update database immediately when form is submitted
      if (this.currentViewId && this.isTracking) {
        this.updateContentView({});
      }
    }, { passive: true });

    // Periodically update the database with current metrics (every 30 seconds)
    setInterval(() => {
      if (this.currentViewId && this.isTracking) {
        this.updateContentView({});
      }
    }, 30000);
  }

  private getReferrerType(referrer: string): string {
    if (!referrer) return 'direct';
    
    const hostname = new URL(referrer).hostname;
    const currentHostname = window.location.hostname;
    
    if (hostname === currentHostname) return 'internal';
    
    // Check for social media
    const socialDomains = ['facebook.com', 'twitter.com', 'linkedin.com', 'instagram.com', 'youtube.com', 'tiktok.com'];
    if (socialDomains.some(domain => hostname.includes(domain))) return 'social';
    
    // Check for search engines
    const searchDomains = ['google.com', 'bing.com', 'yahoo.com', 'duckduckgo.com'];
    if (searchDomains.some(domain => hostname.includes(domain))) return 'search';
    
    return 'external';
  }

  public async trackContentView(data: ContentViewData): Promise<boolean> {
    console.log('🚀 trackContentView called with data:', data);
    
    try {
      console.log('🔍 Step 1: Checking window availability...');
      if (typeof window === 'undefined') {
        console.log('❌ Skipping content tracking on server-side');
        return false;
      }
      console.log('✅ Window is available');

      console.log('🔍 Step 2: Setting tracking state...');
      this.startTime = Date.now();
      this.isTracking = true;
      this.currentViewId = null;
      this.activityCount = 1;
      this.maxScrollDepth = 0;
      this.currentInteractionType = 'view';
      console.log('✅ Tracking state set');

      console.log('🔍 Step 3: Checking session/device IDs...');
      if (!this.sessionId || !this.deviceId) {
        console.log('🔄 Initializing tracking (session/device IDs missing)');
        this.initializeTracking();
      }
      
      console.log('📱 Session ID:', this.sessionId);
      console.log('📱 Device ID:', this.deviceId);
      console.log('✅ Session/device IDs ready');

      console.log('🔍 Step 4: Using device_id as user_id...');
      const userId = this.deviceId; // Use device_id as user_id directly
      console.log('Final user_id to be stored:', userId);
      console.log('✅ User ID processed');

      console.log('🔍 Step 5: Building view data...');
      const viewData: ContentViewData = {
        user_id: userId,
        session_id: this.sessionId || '',
        device_id: this.deviceId || '',
        content_type: data.content_type,
        content_id: data.content_id,
        content_title: data.content_title || (typeof document !== 'undefined' ? document.title : ''),
        content_url: data.content_url || (typeof window !== 'undefined' ? window.location.href : ''),
        page_section: data.page_section,
        referrer_url: data.referrer_url || (typeof document !== 'undefined' ? document.referrer : ''),
        referrer_type: data.referrer_type || (typeof document !== 'undefined' ? this.getReferrerType(document.referrer) : 'direct'),
        interaction_type: 'view',
        activity_count: 1
      };
      console.log('✅ View data built');

      console.log('Tracking content view:', {
        user_id: userId,
        content_type: data.content_type,
        content_id: data.content_id,
        session_id: this.sessionId,
        device_id: this.deviceId
      });

      console.log('🔍 Step 6: Validating data...');
      console.log('📊 View data to insert:', viewData);

      if (!viewData.content_type || !viewData.content_id) {
        console.error('❌ Missing required fields:', {
          content_type: viewData.content_type,
          content_id: viewData.content_id
        });
        return false;
      }
      console.log('✅ Data validation passed');

      console.log('🔍 Step 7: Checking Supabase client...');
      console.log('🔗 Supabase client:', !!this.supabase);
      
      if (!this.supabase) {
        console.error('❌ Supabase client is null - cannot insert data');
        return false;
      }
      console.log('✅ Supabase client ready');
      
      console.log('🔍 Step 8: Executing database insert...');
      const { data: insertedData, error } = await this.supabase
        .from('content_views')
        .insert([viewData])
        .select('id');
        
      console.log('📤 Insert result:', { insertedData, error });
      console.log('✅ Database insert completed');

      if (error) {
        console.error('❌ Error tracking content view:');
        console.error('   Message:', error.message);
        console.error('   Code:', error.code);
        console.error('   Details:', error.details);
        console.error('   Hint:', error.hint);
        console.error('   Full error object:', error);
        console.error('   View data that failed:', viewData);
        return false;
      }

      console.log('Successfully tracked content view:', insertedData);

      // Store the view ID for future updates
      if (insertedData && insertedData.length > 0) {
        this.currentViewId = insertedData[0].id;
        console.log('📝 Stored current view ID:', this.currentViewId);
      }

      // Set up exit tracking
      this.setupExitTracking(data.content_type, data.content_id);

      return true;
    } catch (error) {
      console.error('❌ Exception in trackContentView:');
      console.error('   Error type:', typeof error);
      console.error('   Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('   Error stack:', error instanceof Error ? error.stack : 'No stack');
      console.error('   Full error:', error);
      console.error('   Input data:', data);
      return false;
    }
  }

  public async updateContentView(data: Partial<ContentViewData>): Promise<boolean> {
    if (!this.currentViewId || !this.supabase) {
      console.log('❌ No current view ID or Supabase client for update');
      return false;
    }

    try {
      const viewDuration = Math.round((Date.now() - this.startTime) / 1000);
      
      const updateData = {
        view_duration: viewDuration,
        scroll_depth: this.maxScrollDepth,
        interaction_type: this.currentInteractionType,
        activity_count: this.activityCount,
        ...data
      };

      console.log('🔄 Updating content view:', {
        viewId: this.currentViewId,
        updateData: updateData,
        currentMetrics: {
          activityCount: this.activityCount,
          interactionType: this.currentInteractionType,
          maxScrollDepth: this.maxScrollDepth,
          viewDuration: viewDuration
        }
      });

      const { error } = await this.supabase
        .from('content_views')
        .update(updateData)
        .eq('id', this.currentViewId);

      if (error) {
        console.error('❌ Error updating content view:', error);
        return false;
      }

      console.log('✅ Content view updated successfully');
      return true;
    } catch (error) {
      console.error('❌ Exception in updateContentView:', error);
      return false;
    }
  }

  public async trackPageView(
    contentType: string,
    contentId: string,
    options: Partial<ContentViewData> = {}
  ): Promise<boolean> {
    return this.trackContentView({
      content_type: contentType,
      content_id: contentId,
      page_section: options.page_section || 'main',
      ...options
    });
  }

  public async trackFormSubmission(
    contentType: string,
    contentId: string,
    options: Partial<ContentViewData> = {}
  ): Promise<boolean> {
    this.activityCount++;
    this.currentInteractionType = 'form_submit';
    return this.updateContentView({
      content_type: contentType,
      content_id: contentId,
      ...options
    });
  }

  public async trackInteraction(
    contentType: string,
    contentId: string,
    options: Partial<ContentViewData> = {}
  ): Promise<boolean> {
    this.activityCount++;
    this.currentInteractionType = 'click';
    return this.updateContentView({
      content_type: contentType,
      content_id: contentId,
      ...options
    });
  }

  private setupExitTracking(contentType: string, contentId: string) {
    if (typeof window === 'undefined') return;

    const handleExit = () => {
      this.currentInteractionType = 'page_exit';
      this.updateContentView({
        content_type: contentType,
        content_id: contentId
      });
    };

    // Track when user leaves the page
    window.addEventListener('beforeunload', handleExit);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        handleExit();
      }
    });

    // Clean up after 30 seconds to avoid memory leaks
    setTimeout(() => {
      window.removeEventListener('beforeunload', handleExit);
    }, 30000);
  }
}

// Export singleton instance
export const contentTrackerSimple = new ContentTrackingServiceSimple();

// Export the service functions
export function getContentTrackerSimple() {
  return {
    trackPageView: contentTrackerSimple.trackPageView.bind(contentTrackerSimple),
    trackFormSubmission: contentTrackerSimple.trackFormSubmission.bind(contentTrackerSimple),
    trackInteraction: contentTrackerSimple.trackInteraction.bind(contentTrackerSimple),
    updateContentView: contentTrackerSimple.updateContentView.bind(contentTrackerSimple)
  };
}

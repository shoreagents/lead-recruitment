// Service for tracking candidate views and interactions
import { createClient } from './supabase/client';

export interface CandidateViewData {
  user_id: string;
  candidate_id: string;
  candidate_name?: string;
  view_duration?: number;
  scroll_percentage?: number;
}

export class CandidateTrackingService {
  private static instance: CandidateTrackingService;
  private currentCandidateId: string | null = null;
  private currentUserId: string | null = null;
  private startTime: number = 0;

  private constructor() {}

  public static getInstance(): CandidateTrackingService {
    if (!CandidateTrackingService.instance) {
      CandidateTrackingService.instance = new CandidateTrackingService();
    }
    return CandidateTrackingService.instance;
  }

  // Initialize tracking for a candidate view
  public async startTracking(userId: string, candidateId: string, candidateName?: string): Promise<void> {
    try {
      console.log('🚀 Starting candidate tracking:', {
        userId,
        candidateId,
        candidateName,
        timestamp: new Date().toISOString()
      });

      // Use the provided userId directly (this should be the device ID from content tracking)
      let trackingUserId: string | null = userId;
      
      if (!trackingUserId) {
        console.log('❌ No user ID provided for candidate tracking');
        return;
      }
      
      // Ensure the user exists in the users table (create if needed)
      trackingUserId = await this.ensureUserExists(trackingUserId);

      // If no user found, skip tracking
      if (!trackingUserId) {
        console.log('❌ No user found for tracking, skipping...');
        return;
      }
      
      this.currentUserId = trackingUserId;
      this.currentCandidateId = candidateId;
      this.startTime = Date.now(); // Record start time for duration tracking

      // Get candidate name from BPOC API if not provided
      let finalCandidateName = candidateName;
      if (!finalCandidateName) {
        finalCandidateName = await this.getCandidateNameFromBPOC(candidateId) || undefined;
      }

      // Record initial view using the new function that accepts actual user_id
      // This will either create a new record or update an existing one
      await this.recordInteractionDirect({
        user_id: trackingUserId,
        candidate_id: candidateId,
        candidate_name: finalCandidateName,
        view_duration: 0, // Initial duration, will be updated in endTracking()
        scroll_percentage: 0 // Initial scroll percentage, will be updated during tracking
      });

      console.log(`✅ Started tracking view for candidate: ${finalCandidateName || candidateId} (User: ${trackingUserId})`);
    } catch (error) {
      console.error('❌ Error starting candidate tracking:', error);
    }
  }

  // Get candidate name from BPOC API
  private async getCandidateNameFromBPOC(candidateId: string): Promise<string | null> {
    try {
      console.log('🔍 Fetching candidate name from BPOC API for:', candidateId);
      
      // Import BPOC service dynamically to avoid SSR issues
      const { fetchBPOCEmployeeData } = await import('@/lib/bpocApiService');
      
      // Fetch all BPOC employees
      const bpocEmployees = await fetchBPOCEmployeeData();
      
      // Find the specific employee by ID
      const foundEmployee = bpocEmployees.find(emp => emp.user_id === candidateId);
      
      if (foundEmployee) {
        console.log('✅ Found candidate name from BPOC:', foundEmployee.full_name);
        return foundEmployee.full_name;
      } else {
        console.log('❌ Candidate not found in BPOC data');
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching candidate name from BPOC:', error);
      return null;
    }
  }

  // Ensure user exists in users table (create if needed)
  private async ensureUserExists(userId: string): Promise<string | null> {
    try {
      const supabase = createClient();
      
      // First check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', userId)
        .single();

      // If user exists, return it
      if (!checkError && existingUser) {
        console.log('✅ User already exists:', userId);
        return userId;
      }

      // If user doesn't exist (checkError.code === 'PGRST116' means no rows found)
      if (checkError && checkError.code === 'PGRST116') {
        console.log('🔧 User does not exist, creating new user:', userId);
        
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            user_id: userId,
            user_type: 'Anonymous'
          })
          .select('user_id')
          .single();

        if (createError) {
          console.error('❌ Error creating user:', createError);
          return null;
        }

        console.log('✅ Created new user:', newUser.user_id);
        return newUser.user_id;
      } else {
        // Some other error occurred
        console.error('❌ Error checking user existence:', checkError);
        return null;
      }
    } catch (error) {
      console.error('❌ Error in ensureUserExists:', error);
      return null;
    }
  }

  // Get existing authenticated user from users table
  private async getExistingAuthenticatedUser(authUserId: string): Promise<string | null> {
    try {
      console.log('🔍 Looking up authenticated user for:', authUserId);
      
      const supabase = createClient();
      
      // First try direct table query (more reliable than RPC)
      const { data: directData, error: directError } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', authUserId)
        .single();

      if (!directError && directData) {
        console.log('✅ Found user by direct user_id lookup:', directData.user_id);
        return directData.user_id;
      }

      // If direct lookup fails, try RPC function
      const { data, error } = await supabase
        .rpc('simple_get_authenticated_user', {
          p_auth_user_id: authUserId
        });

      if (error) {
        console.error('❌ Error getting existing authenticated user:', {
          error: error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          authUserId: authUserId,
          fullError: JSON.stringify(error, null, 2)
        });
        return null;
      }

      if (data) {
        console.log('✅ Got existing authenticated user via RPC:', data);
        return data;
      } else {
        console.log('❌ No authenticated user found for auth_user_id:', authUserId);
        return null;
      }
    } catch (error) {
      console.error('❌ Exception in getExistingAuthenticatedUser:', {
        error: error,
        authUserId: authUserId
      });
      return null;
    }
  }

  // Record a specific interaction (simple approach)
  public async recordInteraction(data: CandidateViewData): Promise<void> {
    try {
      if (!this.currentUserId || !this.currentCandidateId) {
        console.warn('No active tracking session. Call startTracking first.');
        return;
      }

      console.log('🔍 Attempting to record interaction:', {
        user_id: data.user_id,
        candidate_id: data.candidate_id,
        candidate_name: data.candidate_name,
        view_duration: data.view_duration,
        scroll_percentage: data.scroll_percentage
      });

      const supabase = createClient();
      
      // Use the simple record function with the actual user_id
      const { data: result, error } = await supabase
        .rpc('simple_record_view', {
          p_user_id: data.user_id, // This is the actual user_id from the tracking service
          p_candidate_id: data.candidate_id,
          p_candidate_name: data.candidate_name,
          p_view_duration: data.view_duration,
          p_scroll_percentage: data.scroll_percentage || 0
        });

      if (error) {
        console.error('❌ Error recording candidate interaction:', {
          error: error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return;
      }

      console.log(`✅ Successfully recorded view for candidate: ${data.candidate_name || data.candidate_id}`, result);
    } catch (error) {
      console.error('❌ Exception in recordInteraction:', error);
    }
  }

  // Record interaction directly with actual user_id from frontend
  public async recordInteractionDirect(data: CandidateViewData): Promise<void> {
    try {
      console.log('🔍 Attempting to record interaction directly:', {
        user_id: data.user_id,
        candidate_id: data.candidate_id,
        candidate_name: data.candidate_name,
        scroll_percentage: data.scroll_percentage
      });

      const supabase = createClient();
      
      // Try the new database function first
      try {
        const { data: result, error } = await supabase.rpc('record_candidate_view_simple', {
          p_user_id: data.user_id,
          p_candidate_id: data.candidate_id,
          p_candidate_name: data.candidate_name,
          p_view_duration: data.view_duration,
          p_scroll_percentage: data.scroll_percentage
        });

        if (error) {
          console.warn('⚠️ RPC function failed, falling back to direct table operations:', error);
          throw error; // This will trigger the fallback
        }

        console.log(`✅ Successfully recorded view using RPC for candidate: ${data.candidate_name || data.candidate_id}`, result);
        return;
      } catch (rpcError) {
        console.log('🔄 RPC function not available, using fallback method...');
        
        // Fallback: Use direct table operations with duplicate prevention
        const { data: existingView, error: findError } = await supabase
          .from('candidate_views')
          .select('id, view_duration, scroll_percentage')
          .eq('user_id', data.user_id)
          .eq('candidate_id', data.candidate_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (findError && findError.code !== 'PGRST116') {
          console.error('❌ Error checking for existing view:', findError);
          return;
        }

        if (existingView) {
          // Update existing record instead of creating new one
          console.log('🔄 Updating existing view record instead of creating duplicate');
          const { error: updateError } = await supabase
            .from('candidate_views')
            .update({
              candidate_name: data.candidate_name,
              view_duration: (existingView.view_duration || 0) + (data.view_duration || 0),
              scroll_percentage: Math.max(existingView.scroll_percentage || 0, data.scroll_percentage || 0),
              updated_at: new Date().toISOString()
            })
            .eq('id', existingView.id);

          if (updateError) {
            console.error('❌ Error updating existing view:', updateError);
          } else {
            console.log('✅ Existing view record updated successfully');
          }
        } else {
          // Insert new record when no existing record found
          const { data: result, error } = await supabase
            .from('candidate_views')
            .insert({
              user_id: data.user_id,
              candidate_id: data.candidate_id,
              candidate_name: data.candidate_name,
              view_duration: data.view_duration,
              scroll_percentage: data.scroll_percentage,
              page_views: 1
            })
            .select('id')
            .single();

          if (error) {
            console.error('❌ Error recording candidate interaction:', {
              error: error,
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code
            });
            return;
          }

          console.log(`✅ Successfully recorded view for candidate: ${data.candidate_name || data.candidate_id}`, result);
        }
      }
    } catch (error) {
      console.error('❌ Exception in recordInteractionDirect:', error);
    }
  }

  // Record scroll percentage during viewing
  public async recordScrollPercentage(scrollPercentage: number): Promise<void> {
    if (!this.currentUserId || !this.currentCandidateId) return;

    try {
      const supabase = createClient();
      
      // Use the new database function to update scroll percentage
      const { error } = await supabase.rpc('record_candidate_view_simple', {
        p_user_id: this.currentUserId,
        p_candidate_id: this.currentCandidateId,
        p_candidate_name: null, // Keep existing name
        p_view_duration: null, // Keep existing duration
        p_scroll_percentage: scrollPercentage
      });

      if (error) {
        console.error('❌ Error updating scroll percentage:', error);
      } else {
        console.log(`✅ Updated scroll percentage: ${scrollPercentage}%`);
      }
    } catch (error) {
      console.error('❌ Exception in recordScrollPercentage:', error);
    }
  }

  // End tracking with duration calculation
  public async endTracking(): Promise<void> {
    try {
      if (!this.currentUserId || !this.currentCandidateId || this.startTime === 0) {
        console.log('⚠️ No active tracking session to end');
        return;
      }

      // Calculate view duration in seconds
      const viewDuration = Math.round((Date.now() - this.startTime) / 1000);
      console.log(`📊 Ending tracking session - Duration: ${viewDuration} seconds`);

      // Update the candidate view record with the calculated duration
      await this.updateViewDuration(this.currentUserId, this.currentCandidateId, viewDuration);

      // Reset tracking state
      this.currentCandidateId = null;
      this.currentUserId = null;
      this.startTime = 0;
    } catch (error) {
      console.error('Error ending candidate tracking:', error);
    }
  }

  // Update view duration for a specific candidate view
  private async updateViewDuration(userId: string, candidateId: string, duration: number): Promise<void> {
    try {
      const supabase = createClient();
      
      console.log(`🔍 Updating view duration: user=${userId}, candidate=${candidateId}, duration=${duration}`);
      
      // Try the RPC function first
      try {
        const { data: result, error } = await supabase.rpc('record_candidate_view_simple', {
          p_user_id: userId,
          p_candidate_id: candidateId,
          p_candidate_name: null, // Keep existing name
          p_view_duration: duration, // This will be added to existing duration by the function
          p_scroll_percentage: null // Keep existing scroll percentage
        });

        if (error) {
          console.warn('⚠️ RPC function failed for duration update, using fallback:', error);
          throw error; // This will trigger the fallback
        }

        console.log(`✅ Updated view duration using RPC for candidate ${candidateId}:`, result);
        return;
      } catch (rpcError) {
        console.log('🔄 RPC function not available for duration update, using fallback method...');
        
        // Fallback: Use direct table operations with duration accumulation
        const { data: existingView, error: findError } = await supabase
          .from('candidate_views')
          .select('id, view_duration, scroll_percentage')
          .eq('user_id', userId)
          .eq('candidate_id', candidateId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (findError && findError.code !== 'PGRST116') {
          console.error('❌ Error finding candidate view to update duration:', findError);
          return;
        }

        if (existingView) {
          // Update existing record by ADDING to the existing duration
          const currentDuration = existingView.view_duration || 0;
          const newTotalDuration = currentDuration + duration;
          
          console.log(`🔄 Adding ${duration} seconds to existing duration ${currentDuration} = ${newTotalDuration} seconds`);
          
          const { error: updateError } = await supabase
            .from('candidate_views')
            .update({ 
              view_duration: newTotalDuration,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingView.id);

          if (updateError) {
            console.error('❌ Error updating view duration:', updateError);
          } else {
            console.log(`✅ Updated view duration: ${newTotalDuration} seconds (${currentDuration} + ${duration}) for candidate ${candidateId}`);
          }
        } else {
          console.log('⚠️ No existing view record found for duration update');
        }
      }
    } catch (error) {
      console.error('❌ Exception in updateViewDuration:', error);
    }
  }

  // Manually update view duration for testing
  public async updateViewDurationManually(userId: string, candidateId: string, duration: number): Promise<void> {
    console.log(`🔧 Manually updating view duration: user=${userId}, candidate=${candidateId}, duration=${duration}`);
    await this.updateViewDuration(userId, candidateId, duration);
  }

  // Test duration accumulation for a specific candidate
  public async testDurationAccumulation(userId: string, candidateId: string, candidateName: string): Promise<void> {
    try {
      console.log(`🧪 Testing duration accumulation for candidate: ${candidateName}`);
      
      // First visit - should create record
      console.log('🔄 First visit - creating initial record...');
      await this.startTracking(userId, candidateId, candidateName);
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds
      await this.endTracking();
      
      // Second visit - should update existing record
      console.log('🔄 Second visit - updating existing record...');
      await this.startTracking(userId, candidateId, candidateName);
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds
      await this.endTracking();
      
      // Third visit - should update existing record again
      console.log('🔄 Third visit - updating existing record again...');
      await this.startTracking(userId, candidateId, candidateName);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second
      await this.endTracking();
      
      console.log('✅ Duration accumulation test completed - should have ~6 seconds total');
    } catch (error) {
      console.error('❌ Error in testDurationAccumulation:', error);
    }
  }

  // Get candidate analytics (using the database function)
  public async getCandidateAnalytics(candidateId: string): Promise<Record<string, unknown> | null> {
    try {
      console.log('🔍 Fetching analytics for candidate:', candidateId);
      
      const supabase = createClient();
      // Query candidate_views table directly for analytics
      const { data, error } = await supabase
        .from('candidate_views')
        .select('candidate_id, candidate_name, view_duration, scroll_percentage, created_at, user_id')
        .eq('candidate_id', candidateId);

      if (error) {
        console.error('❌ Error fetching candidate analytics:', {
          error: error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          candidateId: candidateId
        });
        return null;
      }

      console.log('📊 Analytics data received:', { data, candidateId, dataLength: data?.length });

      // Process the data to create analytics
      if (!data || data.length === 0) {
        console.log('📊 No analytics data found for candidate, returning default structure');
        return {
          candidate_id: candidateId,
          candidate_name: null,
          total_views: 0,
          unique_users: 0,
          total_duration: 0,
          avg_duration: 0,
          max_duration: 0,
          avg_scroll_percentage: 0,
          max_scroll_percentage: 0,
          hotness_score: 0,
          last_viewed: null,
          first_viewed: null
        };
      }

      // Calculate analytics from the raw data
      const totalViews = data.length;
      const uniqueUsers = new Set(data.map(d => d.user_id)).size;
      const totalDuration = data.reduce((sum, d) => sum + (d.view_duration || 0), 0);
      const avgDuration = totalDuration / totalViews;
      const maxDuration = Math.max(...data.map(d => d.view_duration || 0));
      const avgScrollPercentage = data.reduce((sum, d) => sum + (d.scroll_percentage || 0), 0) / totalViews;
      const maxScrollPercentage = Math.max(...data.map(d => d.scroll_percentage || 0));
      const firstViewed = data.reduce((earliest, d) => 
        new Date(d.created_at) < new Date(earliest) ? d.created_at : earliest, data[0].created_at);
      const lastViewed = data.reduce((latest, d) => 
        new Date(d.created_at) > new Date(latest) ? d.created_at : latest, data[0].created_at);

      const result = {
        candidate_id: candidateId,
        candidate_name: data[0].candidate_name,
        total_views: totalViews,
        unique_users: uniqueUsers,
        total_duration: totalDuration,
        avg_duration: Math.round(avgDuration),
        max_duration: maxDuration,
        avg_scroll_percentage: Math.round(avgScrollPercentage),
        max_scroll_percentage: maxScrollPercentage,
        hotness_score: totalDuration, // Use total duration as hotness score
        last_viewed: lastViewed,
        first_viewed: firstViewed
      };

      console.log('✅ Analytics data processed successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Exception in getCandidateAnalytics:', error);
      return null;
    }
  }

  // Get the most viewed candidate for a specific user (authenticated or anonymous)
  public async getUserMostViewedCandidate(userId: string): Promise<Record<string, unknown> | null> {
    try {
      console.log('🔍 Fetching most viewed candidate for user/device:', userId);
      console.log('🔍 Function called at:', new Date().toISOString());
      console.log('🔍 User ID type:', typeof userId);
      console.log('🔍 User ID length:', userId?.length);
      console.log('🔍 User ID starts with device_:', userId?.startsWith('device_'));
      console.log('🔍 User ID starts with anon_:', userId?.startsWith('anon_'));
      
      const supabase = createClient();
      
      // Use the proper database analytics function
      try {
        console.log('🔍 Calling get_most_viewed_candidate_smart with params:', { p_user_id: userId, p_days_back: 30 });
        
        const { data: analytics, error: analyticsError } = await supabase.rpc('get_most_viewed_candidate_smart', {
          p_user_id: userId,
          p_days_back: 30
        });

        console.log('🔍 RPC call result:', { data: analytics, error: analyticsError });

        if (analyticsError) {
          console.warn('⚠️ Analytics function failed, using fallback method:', analyticsError);
          throw analyticsError; // This will trigger the fallback
        }

        if (analytics && analytics.length > 0) {
          const userAnalytics = analytics[0];
          console.log('✅ Found user analytics:', userAnalytics);
          
          if (userAnalytics.candidate_id) {
            const result = {
              candidate_id: userAnalytics.candidate_id,
              candidate_name: userAnalytics.candidate_name,
              total_views: userAnalytics.total_views,
              view_duration: userAnalytics.total_duration,
              avg_view_duration: userAnalytics.avg_duration,
              last_activity: userAnalytics.last_viewed
            };
            console.log('✅ Returning analytics result:', result);
            return result;
          }
        }

        console.log('📭 No most viewed candidate found in analytics');
        console.log('📭 Analytics data:', analytics);
        return null;
      } catch (rpcError) {
        console.log('🔄 Analytics function not available, using fallback method...');
        
        // Fallback: Direct query with proper aggregation
        console.log('🔄 Using fallback method - direct query to candidate_views table');
        console.log('🔄 Querying for user_id:', userId);
        
        const { data: allViews, error: viewsError } = await supabase
          .from('candidate_views')
          .select('candidate_id, candidate_name, page_views, view_duration, scroll_percentage, created_at')
          .eq('user_id', userId);
          
        console.log('🔄 Direct query result:', { data: allViews, error: viewsError });

        if (viewsError) {
          console.error('❌ Error fetching user candidate views:', viewsError);
          return null;
        }

        if (!allViews || allViews.length === 0) {
          console.log('📭 No candidate views found for user:', userId);
          console.log('📭 Views error:', viewsError);
          return null;
        }

        console.log('📊 Processing', allViews.length, 'view records...');
        console.log('📊 Raw views data:', allViews);

        // Group by candidate and calculate totals
        const candidateStats = allViews.reduce((acc: Record<string, {
          candidate_id: string;
          candidate_name: string;
          total_views: number;
          total_duration: number;
          max_duration: number;
          last_viewed: string;
        }>, view: Record<string, unknown>) => {
          const candidateId = String(view.candidate_id);
          if (!acc[candidateId]) {
            acc[candidateId] = {
              candidate_id: candidateId,
              candidate_name: (view as Record<string, unknown>).candidate_name as string,
              total_views: 0,
              total_duration: 0,
              max_duration: 0,
              last_viewed: (view as Record<string, unknown>).created_at as string
            };
          }
          
          acc[candidateId].total_views += Number((view as Record<string, unknown>).page_views) || 1;
          acc[candidateId].total_duration += Number((view as Record<string, unknown>).view_duration) || 0;
          acc[candidateId].max_duration = Math.max(acc[candidateId].max_duration, Number((view as Record<string, unknown>).view_duration) || 0);
          
          if (new Date((view as Record<string, unknown>).created_at as string) > new Date(acc[candidateId].last_viewed)) {
            acc[candidateId].last_viewed = (view as Record<string, unknown>).created_at as string;
          }
          
          return acc;
        }, {});

        // Find the most viewed candidate (by total views, then by total duration)
        const mostViewed = Object.values(candidateStats).reduce((prev: {
          candidate_id: string;
          candidate_name: string;
          total_views: number;
          total_duration: number;
          max_duration: number;
          last_viewed: string;
        }, current: {
          candidate_id: string;
          candidate_name: string;
          total_views: number;
          total_duration: number;
          max_duration: number;
          last_viewed: string;
        }) => {
          if (current.total_views > prev.total_views) {
            return current;
          } else if (current.total_views === prev.total_views && current.total_duration > prev.total_duration) {
            return current;
          }
          return prev;
        });

        console.log('✅ Found most viewed candidate for user:', mostViewed);
        return mostViewed;
      }
    } catch (error) {
      console.error('❌ Exception in getUserMostViewedCandidate:', error);
      return null;
    }
  }

  // Get user's viewing history
  public async getUserViewingHistory(userId: string, daysBack: number = 30): Promise<Record<string, unknown>[] | null> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .rpc('candidate_tracking_get_user_history', { 
          p_user_id: userId as string, 
          p_days_back: daysBack as number
        });

      if (error) {
        console.error('Error fetching user viewing history:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user viewing history:', error);
      return null;
    }
  }

  // Transfer anonymous tracking data to authenticated user
  public async transferAnonymousDataToUser(anonymousUserId: string, authenticatedUserId: string): Promise<void> {
    try {
      console.log('🔄 Transferring anonymous data to authenticated user:', {
        anonymousUserId,
        authenticatedUserId
      });

      const supabase = createClient();
      
      // Update all candidate_views records from anonymous to authenticated user
      const { error } = await supabase
        .from('candidate_views')
        .update({ user_id: authenticatedUserId })
        .eq('user_id', anonymousUserId);

      if (error) {
        console.error('❌ Error transferring anonymous data:', error);
        return;
      }

      // Clear the anonymous user ID from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('shoreagents_anonymous_user_id');
      }

      // Update current tracking session
      this.currentUserId = authenticatedUserId;

      console.log('✅ Successfully transferred anonymous data to authenticated user');
    } catch (error) {
      console.error('❌ Exception in transferAnonymousDataToUser:', error);
    }
  }

  // Get anonymous user ID from localStorage
  public getAnonymousUserId(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('shoreagents_anonymous_user_id');
    }
    return null;
  }
}

// Export singleton instance
export const candidateTracker = CandidateTrackingService.getInstance();

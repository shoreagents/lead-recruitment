import { savePageVisit, getUserIPAddress } from './userEngagementService'

interface UserEngagementData {
  activeTime: number // Total accumulated time spent on this page across all visits (in seconds)
  contentRead: number // Scroll percentage (0-100)
  interactionCount: number // Number of clicks/interactions
  interestScore: number // Calculated interest score
  pageStartTime: number // Start time of current session
  lastActivityTime: number
  scrollDepth: number
  totalScrollHeight: number
  sessionStartTime: number // When current session started
}

class UserEngagementTracker {
  private static instance: UserEngagementTracker
  private engagementData: UserEngagementData
  private updateCallbacks: ((data: UserEngagementData) => void)[] = []
  private isTracking: boolean = false
  private activityTimer: NodeJS.Timeout | null = null
  private scrollThrottleTimer: NodeJS.Timeout | null = null
  private currentPage: string = ''
  private pageData: Map<string, UserEngagementData> = new Map()
  private lastClickTime: number = 0
  private supabaseEnabled: boolean = true
  private lastSupabaseSave: number = 0
  private supabaseSaveInterval: number = 0 // Disabled - no periodic saves

  private constructor() {
    this.engagementData = {
      activeTime: 0,
      contentRead: 0,
      interactionCount: 0,
      interestScore: 0,
      pageStartTime: 0, // Start with 0 to prevent hydration mismatch
      lastActivityTime: 0, // Start with 0 to prevent hydration mismatch
      scrollDepth: 0,
      totalScrollHeight: 0,
      sessionStartTime: 0
    }
    this.loadPageDataFromStorage()
  }

  public static getInstance(): UserEngagementTracker {
    if (!UserEngagementTracker.instance) {
      UserEngagementTracker.instance = new UserEngagementTracker()
    }
    return UserEngagementTracker.instance
  }

  private loadPageDataFromStorage(): void {
    if (typeof window === 'undefined') return
    
    try {
      const savedData = localStorage.getItem('pageEngagementData')
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        this.pageData = new Map(Object.entries(parsedData))
        console.log('Tracker: Loaded page data from storage', this.pageData.size, 'pages')
      }
    } catch (error) {
      console.error('Error loading page data from storage:', error)
    }
  }

  private savePageDataToStorage(): void {
    if (typeof window === 'undefined') return
    
    try {
      const dataToSave = Object.fromEntries(this.pageData)
      localStorage.setItem('pageEngagementData', JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Error saving page data to storage:', error)
    }
  }

  private getPageKey(pathname: string): string {
    // Use pathname as the key, or 'home' for root path
    return pathname === '/' ? 'home' : pathname.replace(/^\//, '').replace(/\//g, '-')
  }

  public startTracking(pathname: string = ''): void {
    if (this.isTracking) {
      console.log('Tracker: Already tracking, skipping start')
      return
    }
    
    console.log('🚀 Tracker: Starting tracking for page:', pathname)
    this.isTracking = true
    this.currentPage = pathname
    
    // Load existing data for this page or create new data
    const pageKey = this.getPageKey(pathname)
    const existingData = this.pageData.get(pageKey)
    
    const now = Date.now()
    
    if (existingData) {
      this.engagementData = { ...existingData }
      // Don't reset session start time - continue from where we left off
      this.engagementData.sessionStartTime = now
      console.log('📊 Tracker: Loaded existing data for page:', pageKey, 'Active time:', this.engagementData.activeTime, 'New session start:', now)
    } else {
      // Create new data for this page
      this.engagementData = {
        activeTime: 0,
        contentRead: 0,
        scrollDepth: 0,
        totalScrollHeight: 0,
        interactionCount: 0,
        sessionStartTime: now,
        interestScore: 0,
        pageStartTime: now,
        lastActivityTime: now
      }
      console.log('🆕 Tracker: Created new data for page:', pageKey, 'Session start time:', now)
    }

    this.engagementData.pageStartTime = now
    this.engagementData.lastActivityTime = now
    
    console.log('⏰ Tracker: Set session start time to:', now, 'Current time:', Date.now())
    console.log('⏰ Tracker: Session start time is valid:', this.engagementData.sessionStartTime > 0)
    
    this.setupEventListeners()
    this.startActivityTimer()
    
    // Save page visit immediately when starting to track (0 seconds spent)
    if (this.supabaseEnabled) {
      this.saveToSupabase().catch(error => {
        console.warn('Tracker: Failed to save initial page visit:', error)
      })
    }
    
    console.log('✅ Tracker: Tracking started successfully for:', pathname)
  }

  public async stopTracking(): Promise<void> {
    if (this.isTracking && this.currentPage) {
      // Calculate and add current session time to accumulated time
      const now = Date.now()
      if (this.engagementData.sessionStartTime > 0) {
        const sessionTime = Math.floor((now - this.engagementData.sessionStartTime) / 1000)
        this.engagementData.activeTime += sessionTime
        
        // Cap the accumulated time
        const maxActiveTime = 7200
        this.engagementData.activeTime = Math.min(this.engagementData.activeTime, maxActiveTime)
      }
      
      // Save current page data before stopping
      const pageKey = this.getPageKey(this.currentPage)
      this.pageData.set(pageKey, { ...this.engagementData })
      this.savePageDataToStorage()
      
      // Save to Supabase before stopping
      if (this.supabaseEnabled) {
        await this.saveToSupabase()
      }
      
      // Reset session start time when leaving the page
      this.engagementData.sessionStartTime = 0
      console.log('🔄 Tracker: Reset session start time when leaving page')
      
      console.log('Tracker: Saved data for page:', pageKey, 'Total active time:', this.engagementData.activeTime)
    }
    
    this.isTracking = false
    this.clearTimers()
    this.removeEventListeners()
  }

  public subscribe(callback: (data: UserEngagementData) => void): () => void {
    this.updateCallbacks.push(callback)
    
    // Return unsubscribe function
    return () => {
      const index = this.updateCallbacks.indexOf(callback)
      if (index > -1) {
        this.updateCallbacks.splice(index, 1)
      }
    }
  }

  public getCurrentData(): UserEngagementData {
    return { ...this.engagementData }
  }

  private setupEventListeners(): void {
    console.log('Tracker: Setting up event listeners')
    
    // Track scroll events
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true })
    
    // Track all button clicks automatically
    document.addEventListener('click', this.handleClick.bind(this), { passive: true })
    console.log('Tracker: Click listener added - tracking all button clicks')
    
    // Track navigation events
    window.addEventListener('beforeunload', this.handlePageUnload.bind(this))
    
    // Track visibility changes (tab switching, etc.)
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this))
    
    // Track mouse movement for activity
    document.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true })
    
    // Track keyboard activity
    document.addEventListener('keydown', this.handleKeyPress.bind(this), { passive: true })
  }

  private removeEventListeners(): void {
    window.removeEventListener('scroll', this.handleScroll.bind(this))
    document.removeEventListener('click', this.handleClick.bind(this))
    window.removeEventListener('beforeunload', this.handlePageUnload.bind(this))
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this))
    document.removeEventListener('mousemove', this.handleMouseMove.bind(this))
    document.removeEventListener('keydown', this.handleKeyPress.bind(this))
  }

  private handleScroll(): void {
    if (!this.isTracking) return

    // Throttle scroll events
    if (this.scrollThrottleTimer) return

    this.scrollThrottleTimer = setTimeout(() => {
      this.updateScrollMetrics()
      this.scrollThrottleTimer = null
    }, 100)
  }

  private handleClick(event: Event): void {
    if (!this.isTracking) return
    
    const now = Date.now()
    
    // Debounce: only count clicks that are at least 200ms apart
    if (now - this.lastClickTime < 200) {
      return
    }
    
    // Check if the clicked element is a button or has a button-like role
    const target = event.target as HTMLElement
    const isButton = target.tagName === 'BUTTON' || 
                    target.getAttribute('role') === 'button' ||
                    target.closest('button') ||
                    target.classList.contains('btn') ||
                    target.classList.contains('button')
    
    if (isButton) {
      // Check if this is a utility button that should not be counted
      const actualButton = target.tagName === 'BUTTON' ? target : target.closest('button') || target
      
      // Skip counting for utility buttons (reset, database, etc.)
      const isUtilityButton = actualButton?.getAttribute('title')?.includes('Reset') ||
                             actualButton?.getAttribute('title')?.includes('Show stored data') ||
                             actualButton?.getAttribute('title')?.includes('reset') ||
                             actualButton?.getAttribute('title')?.includes('data') ||
                             actualButton?.classList.contains('utility-button') ||
                             actualButton?.closest('.utility-buttons')
      
      if (!isUtilityButton) {
        // Update last click time
        this.lastClickTime = now
        
        // Increment interaction count by exactly 1
        this.engagementData.interactionCount++
        this.engagementData.lastActivityTime = now
        console.log('Tracker: Button click detected, interaction count:', this.engagementData.interactionCount)
        this.updateMetrics()
      } else {
        console.log('Tracker: Utility button click ignored:', actualButton?.getAttribute('title'))
      }
    }
  }

  private handleKeyPress(): void {
    if (!this.isTracking) return
    
    this.engagementData.lastActivityTime = Date.now()
    this.updateMetrics()
  }

  private handleMouseMove(): void {
    if (!this.isTracking) return
    
    this.engagementData.lastActivityTime = Date.now()
  }

  private handlePageUnload(): void {
    // Use synchronous version for page unload to avoid issues
    if (this.isTracking && this.currentPage) {
      // Calculate and add current session time to accumulated time
      const now = Date.now()
      if (this.engagementData.sessionStartTime > 0) {
        const sessionTime = Math.floor((now - this.engagementData.sessionStartTime) / 1000)
        this.engagementData.activeTime += sessionTime
        
        // Cap the accumulated time
        const maxActiveTime = 7200
        this.engagementData.activeTime = Math.min(this.engagementData.activeTime, maxActiveTime)
      }
      
      // Save current page data before stopping
      const pageKey = this.getPageKey(this.currentPage)
      this.pageData.set(pageKey, { ...this.engagementData })
      this.savePageDataToStorage()
      
      // Try to save to Supabase synchronously (may not complete)
      if (this.supabaseEnabled) {
        this.saveToSupabase().catch(error => {
          console.warn('Tracker: Failed to save to Supabase on page unload:', error)
        })
      }
      
      console.log('Tracker: Saved data for page on unload:', pageKey, 'Total active time:', this.engagementData.activeTime)
    }
    
    this.isTracking = false
    this.clearTimers()
    this.removeEventListeners()
  }

  private handleVisibilityChange(): void {
    if (document.hidden) {
      // Page is hidden, pause tracking
      this.pauseTracking()
    } else {
      // Page is visible, resume tracking
      this.resumeTracking()
    }
  }

  private pauseTracking(): void {
    this.clearTimers()
  }

  private resumeTracking(): void {
    if (this.isTracking) {
      this.startActivityTimer()
    }
  }

  private startActivityTimer(): void {
    this.activityTimer = setInterval(() => {
      this.updateActiveTime()
      this.updateMetrics()
    }, 1000) // Update every second
  }

  private clearTimers(): void {
    if (this.activityTimer) {
      clearInterval(this.activityTimer)
      this.activityTimer = null
    }
    if (this.scrollThrottleTimer) {
      clearTimeout(this.scrollThrottleTimer)
      this.scrollThrottleTimer = null
    }
  }

  private updateActiveTime(): void {
    const now = Date.now()
    
    // Ensure sessionStartTime is valid
    if (this.engagementData.sessionStartTime === 0 || this.engagementData.sessionStartTime > now) {
      this.engagementData.sessionStartTime = now
      return
    }
    
    // Calculate time spent in current session
    const sessionTime = Math.floor((now - this.engagementData.sessionStartTime) / 1000)
    
    // The activeTime field stores the accumulated time from previous visits
    // We don't add current session time here - that will be added when the session ends
    // For display purposes, we show: accumulated time + current session time
    const totalDisplayTime = this.engagementData.activeTime + sessionTime
    
    // Cap the display time to prevent unrealistic values (max 2 hours = 7200 seconds)
    const maxActiveTime = 7200
    Math.min(totalDisplayTime, maxActiveTime)
    
    // Update the display value (we'll use a temporary field for this)
    // For now, we'll store the current session time separately and calculate total on demand
  }

  private updateScrollMetrics(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    
    // Always update scroll depth and total height
    this.engagementData.scrollDepth = scrollTop + windowHeight
    this.engagementData.totalScrollHeight = documentHeight
    
    // Calculate current scroll percentage
    const currentScrollPercentage = Math.min(100, Math.round((this.engagementData.scrollDepth / this.engagementData.totalScrollHeight) * 100))
    
    // Only update contentRead if it's higher than the current value (track maximum reached)
    if (currentScrollPercentage > this.engagementData.contentRead) {
      this.engagementData.contentRead = currentScrollPercentage
    }
    
    // Don't go back to 0 - maintain the highest scroll percentage reached
  }

  private calculateInitialMetrics(): void {
    // Don't calculate scroll metrics initially - start at 0
    // this.updateScrollMetrics() // Commented out - let user scroll first
    this.updateMetrics()
  }

  private updateMetrics(): void {
    // Calculate interest score based on realistic factors
    // Active Time: 15% weight (lowest - users can leave laptop open)
    const timeScore = Math.min(100, this.engagementData.activeTime / 60 * 15) // Max 15 points, reaches 100 at 60 seconds
    
    // Content Read: 25% weight (shows engagement with content)
    const scrollScore = this.engagementData.contentRead * 0.25 // 25% weight for scroll
    
    // Interactions: 60% weight (highest - shows active engagement and intent)
    const interactionScore = Math.min(100, this.engagementData.interactionCount * 10) * 0.6 // 60% weight, max 60 points
    
    this.engagementData.interestScore = Math.round(timeScore + scrollScore + interactionScore)
    
    // Ensure score stays within 0-100 range
    this.engagementData.interestScore = Math.max(0, Math.min(100, this.engagementData.interestScore))
    
    // Notify subscribers
    this.notifySubscribers()
  }

  private async saveToSupabase(): Promise<void> {
    if (!this.supabaseEnabled || !this.isTracking || !this.currentPage) {
      console.log('🔍 saveToSupabase skipped:', { 
        supabaseEnabled: this.supabaseEnabled, 
        isTracking: this.isTracking, 
        currentPage: this.currentPage 
      })
      return
    }

    try {
      const ipAddress = await getUserIPAddress()
      
      // Calculate the current session time
      let currentSessionTime = 0
      if (this.engagementData.sessionStartTime > 0) {
        const now = Date.now()
        currentSessionTime = Math.floor((now - this.engagementData.sessionStartTime) / 1000)
      }
      
      console.log('🔍 saveToSupabase debug:', {
        currentPage: this.currentPage,
        sessionStartTime: this.engagementData.sessionStartTime,
        currentSessionTime,
        activeTime: this.engagementData.activeTime,
        ipAddress,
        timeDifference: Date.now() - this.engagementData.sessionStartTime,
        timestamp: new Date().toISOString()
      })
      
      // Save the current session time - the database will accumulate it
      const result = await savePageVisit(this.currentPage, ipAddress, currentSessionTime)

      if (result.success) {
        console.log('✅ Tracker: Successfully saved page visit to Supabase:', this.currentPage, 'Current session time:', currentSessionTime)
        this.lastSupabaseSave = Date.now()
        
        // DON'T reset session start time after periodic saves - only reset when leaving page
        // This allows time to accumulate properly across multiple saves
        console.log('🔄 Tracker: Periodic save completed, session continues')
      } else {
        console.warn('❌ Tracker: Failed to save to Supabase:', result.error)
      }
    } catch (error) {
      console.error('❌ Tracker: Error saving to Supabase:', error)
    }
  }

  private shouldSaveToSupabase(): boolean {
    // Periodic saves disabled - only save on page leave
    return false
  }

  private notifySubscribers(): void {
    console.log('Tracker: Notifying subscribers, interaction count:', this.engagementData.interactionCount)
    
    // Save current page data periodically
    if (this.isTracking && this.currentPage) {
      const pageKey = this.getPageKey(this.currentPage)
      this.pageData.set(pageKey, { ...this.engagementData })
      this.savePageDataToStorage()

      // Periodic saves disabled - only save on page leave
    }
    
    this.updateCallbacks.forEach(callback => {
      try {
        callback({ ...this.engagementData })
      } catch (error) {
        console.error('Error in engagement tracker callback:', error)
      }
    })
  }

  // Public method to manually trigger interaction (for programmatic interactions)
  public recordInteraction(): void {
    this.engagementData.interactionCount++
    this.engagementData.lastActivityTime = Date.now()
    console.log('Tracker: Interaction recorded, count now:', this.engagementData.interactionCount)
    this.updateMetrics()
  }

  // Public method to reset tracking for new page
  public resetForNewPage(pathname: string): void {
    console.log('🔄 Tracker: Reset for new page:', pathname, 'Current page:', this.currentPage)
    
    // Only reset if we're actually changing pages
    if (this.currentPage === pathname) {
      console.log('🔄 Tracker: Same page, no need to reset - continuing current session')
      return
    }
    
    // Stop current tracking first (this will save current page data and accumulate session time)
    if (this.isTracking) {
      console.log('🔄 Tracker: Stopping current tracking for page:', this.currentPage)
      this.stopTracking()
    }
    
    // Start tracking for the new page
    console.log('🔄 Tracker: Starting tracking for new page:', pathname)
    this.startTracking(pathname)
    
    console.log('✅ Tracker: Reset completed for new page:', pathname)
  }

  // Get current total active time (accumulated + current session)
  private getCurrentTotalActiveTime(): number {
    const now = Date.now()
    if (this.engagementData.sessionStartTime > 0) {
      const sessionTime = Math.floor((now - this.engagementData.sessionStartTime) / 1000)
      return this.engagementData.activeTime + sessionTime
    }
    return this.engagementData.activeTime
  }

  // Get formatted metrics for display
  public getFormattedMetrics() {
    return {
      activeTime: this.getCurrentTotalActiveTime(),
      contentRead: this.engagementData.contentRead,
      interactionCount: this.engagementData.interactionCount, // Changed from 'interaction' to 'interactionCount'
      interestScore: this.engagementData.interestScore
    }
  }

  // Debug method to log current state
  public debug(): void {
    console.log('User Engagement Tracker Debug:', {
      isTracking: this.isTracking,
      data: this.engagementData,
      subscribers: this.updateCallbacks.length
    })
  }

  // Method to get raw data for analytics
  public getRawData(): UserEngagementData {
    return { ...this.engagementData }
  }

  // Method to get all page data for analytics
  public getAllPageData(): Record<string, UserEngagementData> {
    return Object.fromEntries(this.pageData)
  }

  // Method to get data for a specific page
  public getPageData(pathname: string): UserEngagementData | null {
    const pageKey = this.getPageKey(pathname)
    return this.pageData.get(pageKey) || null
  }

  // Method to clear all page data (for testing or reset)
  public async clearAllPageData(): Promise<void> {
    // Stop current tracking first
    await this.stopTracking()
    
    // Clear all page data
    this.pageData.clear()
    
    // Reset current engagement data
    this.engagementData = {
      activeTime: 0,
      contentRead: 0,
      interactionCount: 0,
      interestScore: 0,
      pageStartTime: 0,
      lastActivityTime: 0,
      scrollDepth: 0,
      totalScrollHeight: 0,
      sessionStartTime: 0
    }
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('pageEngagementData')
        console.log('Tracker: Cleared all page data from localStorage')
      } catch (error) {
        console.error('Error clearing page data from storage:', error)
      }
    }
    
    // Restart tracking for the current page if we have a current page
    if (this.currentPage) {
      console.log('Tracker: Restarting tracking after reset for page:', this.currentPage)
      this.startTracking(this.currentPage)
    }
    
    // Notify subscribers of the reset
    this.notifySubscribers()
    
    console.log('Tracker: Cleared all page data and restarted tracking')
  }

  // Public methods for Supabase integration control
  public enableSupabase(): void {
    this.supabaseEnabled = true
    console.log('Tracker: Supabase integration enabled')
  }

  public disableSupabase(): void {
    this.supabaseEnabled = false
    console.log('Tracker: Supabase integration disabled')
  }

  public isSupabaseEnabled(): boolean {
    return this.supabaseEnabled
  }

  public setSupabaseSaveInterval(intervalMs: number): void {
    this.supabaseSaveInterval = intervalMs
    console.log('Tracker: Supabase save interval set to', intervalMs, 'ms')
  }

}

// Export singleton instance
export const userEngagementTracker = UserEngagementTracker.getInstance()

// Export types for use in components
export type { UserEngagementData }

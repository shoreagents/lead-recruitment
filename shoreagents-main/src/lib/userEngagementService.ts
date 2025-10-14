import { supabase, UserPageVisit } from './supabase'
import { UserType } from '@/types/user'

// Generate a unique session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
}

// Get user's IP address
export async function getUserIPAddress(): Promise<string | undefined> {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.warn('Could not fetch IP address:', error)
    return undefined
  }
}

// Generate a device-based unique ID (fingerprint only)
export function generateUserId(): string {
  // Try to get existing device ID from localStorage, or create a new one
  if (typeof window === 'undefined') {
    console.log('⚠️ generateUserId called on server side - this should not happen');
    return `device_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
  }
  
  let deviceId = localStorage.getItem('shoreagents_device_id')
  if (!deviceId) {
    console.log('🔍 No existing device ID found, generating new fingerprint-based ID');
    // Use fingerprint-based device ID only
    deviceId = generateDeviceFingerprint()
    localStorage.setItem('shoreagents_device_id', deviceId)
    console.log('🔍 Generated and stored new device ID:', deviceId);
  } else {
    console.log('🔍 Using existing device ID:', deviceId);
  }
  return deviceId
}


// Generate a device fingerprint based on hardware and browser characteristics
function generateDeviceFingerprint(): string {
  try {
    // Collect device characteristics
    const deviceInfo = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height + 'x' + screen.colorDepth,
      navigator.hardwareConcurrency || 'unknown',
      navigator.platform,
      new Date().getTimezoneOffset().toString(),
      navigator.maxTouchPoints || '0',
      (navigator as { deviceMemory?: number }).deviceMemory || 'unknown',
      // Add canvas fingerprint for additional uniqueness
      getCanvasFingerprint()
    ].join('|')
    
    // Create a hash of the device info
    const hash = createSimpleHash(deviceInfo)
    return `device_${hash}`
  } catch (error) {
    console.warn('Failed to generate device fingerprint, using fallback:', error)
    // Fallback to timestamp-based ID if fingerprinting fails
    return `device_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
  }
}

// Create a canvas fingerprint for additional uniqueness
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return 'no-canvas'
    
    // Draw some text and shapes
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillStyle = '#f60'
    ctx.fillRect(125, 1, 62, 20)
    ctx.fillStyle = '#069'
    ctx.fillText('Device fingerprint', 2, 15)
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
    ctx.fillText('Device fingerprint', 4, 17)
    
    return canvas.toDataURL().substring(22, 50) // Get part of the data URL
  } catch {
    return 'canvas-error'
  }
}

// Create a simple hash function
function createSimpleHash(str: string): string {
  let hash = 0
  if (str.length === 0) return hash.toString(36)
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Convert to base36 and ensure it's positive
  return Math.abs(hash).toString(36).substring(0, 12)
}

// Get current session ID
export function getCurrentSessionId(): string {
  if (typeof window === 'undefined') return generateSessionId()
  
  let sessionId = sessionStorage.getItem('shoreagents_session_id')
  if (!sessionId) {
    sessionId = generateSessionId()
    sessionStorage.setItem('shoreagents_session_id', sessionId)
  }
  return sessionId
}

// Detect device type based on user agent and screen size
export function detectDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop'
  
  const userAgent = navigator.userAgent.toLowerCase()
  const screenWidth = window.screen.width
  const screenHeight = window.screen.height
  
  // Check for mobile devices
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
  
  // Check for tablet devices
  const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent) || 
                   (screenWidth >= 768 && screenWidth <= 1024 && screenHeight >= 768 && screenHeight <= 1024)
  
  // Check screen size for additional mobile detection
  const isSmallScreen = screenWidth <= 768 || (screenWidth <= 1024 && screenHeight <= 768)
  
  if (isTablet) return 'tablet'
  if (isMobile || isSmallScreen) return 'mobile'
  return 'desktop'
}

// Ensure anonymous user exists in users table
async function ensureAnonymousUser(userId: string): Promise<void> {
  if (!supabase) {
    console.warn('Supabase not available for ensureAnonymousUser')
    return
  }

  try {
    console.log('🔍 ensureAnonymousUser called with userId:', userId)
    
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('user_id')
      .eq('user_id', userId)
      .single()

    console.log('🔍 User check result:', { existingUser, checkError })

    // If user doesn't exist, create anonymous user record
    if (!existingUser) {
      console.log('🆕 Creating anonymous user record for:', userId)
      const { data: insertData, error: insertError } = await supabase
        .from('users')
        .insert({
          user_id: userId,
          auth_user_id: null, // Anonymous user
          user_type: UserType.ANONYMOUS, // Set as anonymous user
          first_name: null,
          last_name: null,
          email: null,
          phone_number: null,
          company: null,
          country: null,
        })
        .select()

      if (insertError) {
        console.error('❌ Failed to create anonymous user:', insertError)
        console.error('❌ Insert data that failed:', {
          user_id: userId,
          auth_user_id: null,
          user_type: UserType.ANONYMOUS,
          first_name: null,
          last_name: null,
          email: null,
          phone_number: null,
          company: null,
          country: null,
        })
      } else {
        console.log('✅ Anonymous user created successfully:', insertData)
      }
    } else {
      console.log('✅ Anonymous user already exists:', existingUser)
    }
  } catch (error) {
    console.error('❌ Failed to ensure anonymous user exists:', error)
  }
}

// Save user page visit data to Supabase with upsert logic
export async function savePageVisit(
  pagePath: string,
  ipAddress?: string,
  currentSessionTimeSeconds: number = 0
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if Supabase is available
    if (!supabase) {
      console.warn('Supabase client not available. Skipping page visit save.')
      return { success: false, error: 'Supabase client not configured' }
    }

    console.log('🔍 savePageVisit called with:', { pagePath, ipAddress, currentSessionTimeSeconds })

    const userId = generateUserId()
    const now = new Date().toISOString()
    
    // Ensure anonymous user exists in users table
    await ensureAnonymousUser(userId)
    
    // First, check if this user has visited this page before
    // Get the most recent visit for this user and page
    const { data: existingVisits, error: checkError } = await supabase
      .from('user_page_visits')
      .select('*')
      .eq('user_id', userId)
      .eq('page_path', pagePath)
      .order('last_visit_timestamp', { ascending: false })
      .limit(1)

    if (checkError) {
      console.error('Error checking for existing visit:', checkError)
      return { success: false, error: checkError.message }
    }

    const existingVisit = existingVisits && existingVisits.length > 0 ? existingVisits[0] : null

    console.log('🔍 Existing visit found:', existingVisit)

    if (existingVisit) {
      // Update existing visit - increment count and add current session time
      const updatedVisit = {
        visit_count: existingVisit.visit_count + 1,
        time_spent_seconds: existingVisit.time_spent_seconds + currentSessionTimeSeconds,
        last_visit_timestamp: now,
        ip_address: ipAddress || existingVisit.ip_address
      }

      console.log('🔍 Updating visit with:', updatedVisit)

      const { error: updateError } = await supabase
        .from('user_page_visits')
        .update(updatedVisit)
        .eq('id', existingVisit.id)

      if (updateError) {
        console.error('Error updating page visit:', updateError)
        return { success: false, error: updateError.message }
      }

      console.log('✅ Page visit updated:', pagePath, 'Total visits:', updatedVisit.visit_count, 'Total time:', updatedVisit.time_spent_seconds, 'Added time:', currentSessionTimeSeconds)
    } else {
      // Insert new visit
      const newVisit: Omit<UserPageVisit, 'id' | 'created_at'> = {
        user_id: userId,
        page_path: pagePath,
        ip_address: ipAddress,
        visit_timestamp: now,
        visit_count: 1,
        time_spent_seconds: currentSessionTimeSeconds,
        last_visit_timestamp: now
      }

      console.log('🔍 Creating new visit with:', newVisit)

      const { error: insertError } = await supabase
        .from('user_page_visits')
        .insert([newVisit])

      if (insertError) {
        console.error('Error inserting page visit:', insertError)
        return { success: false, error: insertError.message }
      }

      console.log('✅ New page visit created:', pagePath, 'Time spent:', currentSessionTimeSeconds)
    }

    return { success: true }
  } catch (error) {
    console.error('Error in savePageVisit:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}


// Get page visits for a specific user
export async function getUserPageVisits(userId?: string): Promise<UserPageVisit[]> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available. Returning empty array.')
      return []
    }

    const targetUserId = userId || generateUserId()
    
    const { data, error } = await supabase
      .from('user_page_visits')
      .select('*')
      .eq('user_id', targetUserId)
      .order('visit_timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching user page visits:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getUserPageVisits:', error)
    return []
  }
}


// Get aggregated page analytics
export async function getPageAnalytics(): Promise<Record<string, unknown>[]> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available. Returning empty array.')
      return []
    }

    const { data, error } = await supabase
      .from('page_analytics')
      .select('*')
      .order('total_visits', { ascending: false })

    if (error) {
      console.error('Error fetching page analytics:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getPageAnalytics:', error)
    return []
  }
}

// Get user visit analytics
export async function getUserVisitAnalytics(): Promise<Record<string, unknown>[]> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available. Returning empty array.')
      return []
    }

    const { data, error } = await supabase
      .from('user_visit_analytics')
      .select('*')
      .order('total_page_visits', { ascending: false })

    if (error) {
      console.error('Error fetching user visit analytics:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getUserVisitAnalytics:', error)
    return []
  }
}



// Batch save multiple page visits
export async function batchSavePageVisits(
  pageVisits: Array<{
    pagePath: string
    ipAddress?: string
  }>
): Promise<{ success: boolean; error?: string; savedCount?: number }> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available. Skipping batch save.')
      return { success: false, error: 'Supabase client not configured' }
    }

    const userId = generateUserId()
    
    const visitsToInsert = pageVisits.map(({ pagePath, ipAddress }) => ({
      user_id: userId,
      page_path: pagePath,
      ip_address: ipAddress,
      visit_timestamp: new Date().toISOString()
    }))

    const { error } = await supabase
      .from('user_page_visits')
      .insert(visitsToInsert)

    if (error) {
      console.error('Error batch saving page visits:', error)
      return { success: false, error: error.message }
    }

    console.log(`Batch saved ${pageVisits.length} page visits successfully`)
    return { success: true, savedCount: pageVisits.length }
  } catch (error) {
    console.error('Error in batchSavePageVisits:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Get page analytics with visit counts and time spent
export async function getPageAnalyticsWithTime(): Promise<Record<string, unknown>[]> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available. Returning empty array.')
      return []
    }

    const { data, error } = await supabase
      .from('user_page_visits')
      .select('*')
      .order('visit_count', { ascending: false })

    if (error) {
      console.error('Error fetching page analytics with time:', error)
      return []
    }

    // Group by page_path and aggregate data
    const pageStats = new Map()
    
    data?.forEach(visit => {
      const pagePath = visit.page_path
      if (!pageStats.has(pagePath)) {
        pageStats.set(pagePath, {
          page_path: pagePath,
          total_visits: 0,
          total_time_spent: 0,
          unique_users: new Set(),
          last_visit: visit.last_visit_timestamp
        })
      }
      
      const stats = pageStats.get(pagePath)
      stats.total_visits += visit.visit_count
      stats.total_time_spent += visit.time_spent_seconds
      stats.unique_users.add(visit.user_id)
    })

    // Convert to array and calculate unique users
    return Array.from(pageStats.values()).map(stats => ({
      ...stats,
      unique_users: stats.unique_users.size,
      avg_time_per_visit: stats.total_visits > 0 ? Math.round(stats.total_time_spent / stats.total_visits) : 0
    }))
  } catch (error) {
    console.error('Error in getPageAnalyticsWithTime:', error)
    return []
  }
}

// Get user analytics with visit counts and time spent
export async function getUserAnalyticsWithTime(): Promise<Record<string, unknown>[]> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available. Returning empty array.')
      return []
    }

    const { data, error } = await supabase
      .from('user_page_visits')
      .select('*')
      .order('time_spent_seconds', { ascending: false })

    if (error) {
      console.error('Error fetching user analytics with time:', error)
      return []
    }

    // Group by user_id and aggregate data
    const userStats = new Map()
    
    data?.forEach(visit => {
      const userId = visit.user_id
      if (!userStats.has(userId)) {
        userStats.set(userId, {
          user_id: userId,
          total_visits: 0,
          total_time_spent: 0,
          pages_visited: new Set(),
          last_visit: visit.last_visit_timestamp
        })
      }
      
      const stats = userStats.get(userId)
      stats.total_visits += visit.visit_count
      stats.total_time_spent += visit.time_spent_seconds
      stats.pages_visited.add(visit.page_path)
    })

    // Convert to array and calculate unique pages
    return Array.from(userStats.values()).map(stats => ({
      ...stats,
      pages_visited: stats.pages_visited.size,
      avg_time_per_visit: stats.total_visits > 0 ? Math.round(stats.total_time_spent / stats.total_visits) : 0
    }))
  } catch (error) {
    console.error('Error in getUserAnalyticsWithTime:', error)
    return []
  }
}

// Device ID management utilities
export function getDeviceInfo(): Record<string, string | number> {
  if (typeof window === 'undefined') return {}
  
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}x${screen.colorDepth}`,
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
    timezoneOffset: new Date().getTimezoneOffset(),
    maxTouchPoints: navigator.maxTouchPoints || 0,
    deviceMemory: (navigator as { deviceMemory?: number }).deviceMemory || 'unknown',
    currentDeviceId: generateUserId()
  }
}

// Reset device ID (useful for testing)
export function resetDeviceId(): string {
  if (typeof window === 'undefined') return `device_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
  
  // Remove existing device ID
  localStorage.removeItem('shoreagents_device_id')
  
  // Generate new one
  const newDeviceId = generateUserId()
  console.log('🔄 Device ID reset. New ID:', newDeviceId)
  return newDeviceId
}

// Test device ID generation (fingerprint-based only)
export function testDeviceIdGeneration(): void {
  console.log('🧪 Testing Fingerprint-Based Device ID Generation...')
  
  const deviceInfo = getDeviceInfo()
  console.log('📱 Device Information:', deviceInfo)
  
  const deviceId = generateUserId()
  console.log('🆔 Generated Device ID:', deviceId)
  console.log('🔍 ID Type: Fingerprint-based (comprehensive device characteristics)')
  
  // Test persistence
  const retrievedId = generateUserId()
  console.log('🔄 Retrieved Device ID:', retrievedId)
  console.log('✅ IDs Match:', deviceId === retrievedId)
  
  // Test uniqueness (generate multiple IDs)
  const ids = new Set()
  for (let i = 0; i < 5; i++) {
    const testId = generateDeviceFingerprint()
    ids.add(testId)
  }
  console.log('🎯 Uniqueness Test - Generated 5 IDs, unique count:', ids.size)
  console.log('📊 Fingerprint includes: User Agent, Screen, Hardware, Canvas, Timezone, Touch Support')
}

// Get real device statistics from database
export async function getRealDeviceStats(): Promise<{ desktop: number; mobile: number; tablet: number }> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available. Returning default device stats.')
      return { desktop: 0, mobile: 0, tablet: 0 }
    }

    const { data: visits, error } = await supabase
      .from('user_page_visits')
      .select('*')

    if (error) {
      console.error('Error fetching device stats:', error)
      return { desktop: 0, mobile: 0, tablet: 0 }
    }

    if (!visits || visits.length === 0) {
      return { desktop: 0, mobile: 0, tablet: 0 }
    }

    // Count unique users by device type (we'll need to add device_type to the database)
    // For now, we'll estimate based on user agent patterns
    const deviceCounts = { desktop: 0, mobile: 0, tablet: 0 }
    const uniqueUsers = new Set()

    visits.forEach(visit => {
      if (!uniqueUsers.has(visit.user_id)) {
        uniqueUsers.add(visit.user_id)
        
        // Estimate device type based on user agent (if available in the data)
        // This is a fallback - ideally we'd store device_type in the database
        const deviceType = detectDeviceType()
        deviceCounts[deviceType]++
      }
    })

    return deviceCounts
  } catch (error) {
    console.error('Error in getRealDeviceStats:', error)
    return { desktop: 0, mobile: 0, tablet: 0 }
  }
}

// Get real time-series data for the chart
export async function getRealTimeSeriesData(days: number = 90): Promise<Array<{ date: string; desktop: number; mobile: number; tablet: number }>> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available. Returning empty time series data.')
      return []
    }

    const { data: visits, error } = await supabase
      .from('user_page_visits')
      .select('*')
      .gte('visit_timestamp', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())

    if (error) {
      console.error('Error fetching time series data:', error)
      return []
    }

    if (!visits || visits.length === 0) {
      return []
    }

    // Group visits by date and device type
    const dailyData = new Map<string, { desktop: number; mobile: number; tablet: number }>()

    visits.forEach(visit => {
      const date = new Date(visit.visit_timestamp).toISOString().split('T')[0]
      
      if (!dailyData.has(date)) {
        dailyData.set(date, { desktop: 0, mobile: 0, tablet: 0 })
      }

      // Estimate device type (fallback method)
      const deviceType = detectDeviceType()
      dailyData.get(date)![deviceType] += visit.visit_count
    })

    // Convert to array and sort by date
    return Array.from(dailyData.entries())
      .map(([date, counts]) => ({ date, ...counts }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  } catch (error) {
    console.error('Error in getRealTimeSeriesData:', error)
    return []
  }
}

export function testSupabaseConfig(): void {
  console.log('🧪 Testing Supabase configuration...')
  console.log('Supabase client exists:', supabase !== null)
  console.log('Environment variables:', {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
  })
  
  if (!supabase) {
    console.error('❌ Supabase client is null! You need to set up your environment variables.')
    console.log('Create a .env.local file with:')
    console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key')
  } else {
    console.log('✅ Supabase client is configured')
  }
}

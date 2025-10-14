import { NextRequest, NextResponse } from 'next/server';

// Cache for BPOC users data (in-memory cache)
let bpocUsersCache: any[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Fetching BPOC users from database...');
    
    // Check if we have valid cached data
    const now = Date.now();
    if (bpocUsersCache && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('✅ Returning cached BPOC users data');
      return NextResponse.json({
        success: true,
        data: bpocUsersCache,
        total: bpocUsersCache.length,
        cached: true,
        cacheAge: Math.round((now - cacheTimestamp) / 1000) // seconds
      });
    }
    
    // Import BPOC database functions (server-side only)
    const { fetchBPOCUsersFromDatabase } = await import('@/lib/bpoc-database');
    
    // Fetch users from database
    const users = await fetchBPOCUsersFromDatabase();
    
    // Update cache
    bpocUsersCache = users;
    cacheTimestamp = now;
    
    console.log(`✅ Successfully fetched ${users.length} users from BPOC database`);
    
    return NextResponse.json({
      success: true,
      data: users,
      total: users.length,
      cached: false
    });
    
  } catch (error) {
    console.error('❌ Error fetching BPOC users:', error);
    
    // Return cached data if available, even if stale
    if (bpocUsersCache) {
      console.log('⚠️ Returning stale cached data due to error');
      return NextResponse.json({
        success: true,
        data: bpocUsersCache,
        total: bpocUsersCache.length,
        cached: true,
        stale: true,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to fetch BPOC users from database'
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

// Cache for individual BPOC users (in-memory cache)
const userCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }
    
    // Check if we have valid cached data for this user
    const now = Date.now();
    const cachedUser = userCache.get(userId);
    
    if (cachedUser && (now - cachedUser.timestamp) < CACHE_DURATION) {
      console.log(`✅ Returning cached BPOC user ${userId}`);
      return NextResponse.json({
        success: true,
        data: cachedUser.data,
        cached: true,
        cacheAge: Math.round((now - cachedUser.timestamp) / 1000) // seconds
      });
    }
    
    console.log(`📊 Fetching BPOC user ${userId} from database...`);
    
    // Import BPOC database functions (server-side only)
    const { fetchBPOCUserById } = await import('@/lib/bpoc-database');
    
    // Fetch user from database
    const user = await fetchBPOCUserById(userId);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }
    
    // Update cache
    userCache.set(userId, { data: user, timestamp: now });
    
    console.log(`✅ Successfully fetched user ${userId} from BPOC database`);
    
    return NextResponse.json({
      success: true,
      data: user,
      cached: false
    });
    
  } catch (error) {
    console.error('❌ Error fetching BPOC user:', error);
    
    // Return cached data if available, even if stale
    const userId = params.id;
    const cachedUser = userCache.get(userId);
    if (cachedUser) {
      console.log(`⚠️ Returning stale cached data for user ${userId} due to error`);
      return NextResponse.json({
        success: true,
        data: cachedUser.data,
        cached: true,
        stale: true,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to fetch BPOC user from database'
    }, { status: 500 });
  }
}

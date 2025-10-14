import { NextRequest, NextResponse } from 'next/server'
import { syncUserToDatabaseServer } from '@/lib/user-sync-server'

// Test endpoint to verify the route is working
export async function GET() {
  return NextResponse.json({ 
    message: 'User sync API is working',
    methods: ['GET', 'POST'],
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  console.log('🚀 POST /api/user/sync called')
  console.log('📡 Request method:', request.method)
  console.log('📡 Request URL:', request.url)
  console.log('📡 Request headers:', Object.fromEntries(request.headers.entries()))
  
  let userData: any = null
  
  try {
    userData = await request.json()
    
    console.log('📥 Received user sync request:', {
      id: userData.id,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      full_name: userData.full_name,
      location: userData.location,
      admin_level: userData.admin_level,
      phone: userData.phone,
      bio: userData.bio,
      position: userData.position,
      gender: userData.gender ?? null
    })

    // Validate required fields
    if (!userData.id || !userData.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Sync user to Railway database
    console.log('🔄 About to call syncUserToDatabaseServer with data:', {
      id: userData.id,
      email: userData.email,
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      full_name: userData.full_name || '',
      location: userData.location || '',
      avatar_url: userData.avatar_url,
      phone: userData.phone,
      bio: userData.bio,
      position: userData.position,
      company: userData.company,
      completed_data: userData.completed_data ?? null,
      birthday: userData.birthday ?? null,
      gender: userData.gender ?? null,
      admin_level: userData.admin_level || 'user'
    })
    
    const result = await syncUserToDatabaseServer({
      id: userData.id,
      email: userData.email,
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      full_name: userData.full_name || '',
      location: userData.location || '',
      avatar_url: userData.avatar_url,
      phone: userData.phone,
      bio: userData.bio,
      position: userData.position,
      company: userData.company,
      completed_data: userData.completed_data ?? null,
      birthday: userData.birthday ?? null,
      gender: userData.gender ?? null,
      admin_level: userData.admin_level || 'user'
    })

    console.log('✅ User sync completed:', result)
    return NextResponse.json(result)
  } catch (error) {
    console.error('❌ Error in user sync API:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('❌ Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      userData: userData ? {
        id: userData.id,
        email: userData.email
      } : 'No user data received'
    })
    return NextResponse.json({ 
      error: 'Internal server error',
      details: errorMessage 
    }, { status: 500 })
  }
} 
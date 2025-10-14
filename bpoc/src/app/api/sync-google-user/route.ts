import { NextRequest, NextResponse } from 'next/server'
import { syncUserToDatabaseServer } from '@/lib/user-sync-server'

export async function POST(request: NextRequest) {
  try {
    const { userId, email, userMetadata } = await request.json()
    
    if (!userId || !email) {
      return NextResponse.json({ error: 'User ID and email are required' }, { status: 400 })
    }

    console.log('🔄 Manually syncing Google OAuth user:', { userId, email, userMetadata })

    // Extract name information from Google OAuth metadata
    const firstName = userMetadata?.given_name || userMetadata?.first_name || ''
    const lastName = userMetadata?.family_name || userMetadata?.last_name || ''
    const fullName = userMetadata?.name || 
                    userMetadata?.full_name || 
                    `${firstName} ${lastName}`.trim() || 
                    email

    const result = await syncUserToDatabaseServer({
      id: userId,
      email: email,
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      location: userMetadata?.location || '',
      avatar_url: userMetadata?.picture || userMetadata?.avatar_url || null,
      phone: userMetadata?.phone || '',
      bio: userMetadata?.bio || '',
      position: userMetadata?.position || '',
      company: userMetadata?.company || '',
      completed_data: false,
      birthday: userMetadata?.birthday || null,
      gender: userMetadata?.gender || null,
      admin_level: 'user'
    })

    console.log('✅ Google OAuth user sync completed:', result)
    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ Error in Google OAuth user sync:', error)
    return NextResponse.json({
      error: 'Failed to sync Google OAuth user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

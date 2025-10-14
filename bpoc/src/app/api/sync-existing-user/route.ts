import { NextRequest, NextResponse } from 'next/server'
import { syncUserToDatabaseServer } from '@/lib/user-sync-server'

export async function POST(request: NextRequest) {
  try {
    const { userId, email, firstName, lastName } = await request.json()
    
    if (!userId || !email) {
      return NextResponse.json({ error: 'User ID and email are required' }, { status: 400 })
    }

    console.log('🔄 Manually syncing existing user:', { userId, email, firstName, lastName })

    const result = await syncUserToDatabaseServer({
      id: userId,
      email: email,
      first_name: firstName || '',
      last_name: lastName || '',
      full_name: `${firstName || ''} ${lastName || ''}`.trim() || email,
      location: '',
      avatar_url: null,
      phone: '',
      bio: '',
      position: '',
      company: '',
      completed_data: false,
      birthday: null,
      gender: null,
      admin_level: 'user'
    })

    console.log('✅ Manual sync completed:', result)
    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ Error in manual user sync:', error)
    return NextResponse.json({
      error: 'Failed to sync user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

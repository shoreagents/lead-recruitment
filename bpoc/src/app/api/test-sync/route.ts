import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { syncUserToDatabaseServer } from '@/lib/user-sync-server'

export async function POST(req: NextRequest) {
  try {
    console.log('🧪 Starting manual sync test...')
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.log('❌ No authenticated user found, but continuing with test...')
      // For testing purposes, we'll continue even without auth
      return NextResponse.json({ 
        success: false, 
        error: 'No authenticated user found',
        message: 'This is expected if user is not fully authenticated yet'
      })
    }

    console.log('🧪 Testing sync for user:', user.email)
    console.log('📋 User metadata:', user.user_metadata)
    console.log('🆔 User ID:', user.id)
    
    await syncUserToDatabaseServer({
      id: user.id,
      email: user.email,
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || '',
      full_name: user.user_metadata?.full_name || '',
      location: user.user_metadata?.location || '',
      avatar_url: user.user_metadata?.avatar_url || null
    })
    
    console.log('✅ Manual sync test successful')
    return NextResponse.json({ 
      success: true, 
      message: 'Sync test successful',
      user: {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata
      }
    })
  } catch (error) {
    console.error('❌ Sync test failed:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
} 
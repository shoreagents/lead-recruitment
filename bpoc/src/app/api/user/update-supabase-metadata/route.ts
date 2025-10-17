import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { userId, metadata } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!metadata) {
      return NextResponse.json({ error: 'Metadata is required' }, { status: 400 })
    }

    console.log('🔄 Updating Supabase metadata for user:', userId)
    console.log('📊 Metadata to update:', metadata)

    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      console.error('❌ Missing Supabase environment variables')
      return NextResponse.json({
        error: 'Supabase configuration missing',
        details: 'NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set'
      }, { status: 500 })
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(supabaseUrl, serviceKey)

    // Update user metadata
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: metadata
    })

    if (error) {
      console.error('❌ Supabase metadata update failed:', error.message)
      return NextResponse.json({
        error: 'Failed to update Supabase metadata',
        details: error.message
      }, { status: 500 })
    }

    console.log('✅ Supabase metadata updated successfully')
    console.log('✅ Updated user data:', data.user)

    return NextResponse.json({
      success: true,
      message: 'Supabase metadata updated successfully',
      user: data.user,
      metadata: data.user?.user_metadata
    })

  } catch (error) {
    console.error('❌ Error updating Supabase metadata:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json({
      error: 'Internal server error',
      details: errorMessage
    }, { status: 500 })
  }
}

// GET - Test Supabase connection and user metadata
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    console.log('🧪 Testing Supabase connection for user:', userId)

    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({
        error: 'Supabase configuration missing',
        details: 'NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set'
      }, { status: 500 })
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(supabaseUrl, serviceKey)

    // Get user data
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId)

    if (error) {
      console.error('❌ Failed to get user from Supabase:', error.message)
      return NextResponse.json({
        error: 'Failed to get user from Supabase',
        details: error.message
      }, { status: 500 })
    }

    console.log('✅ Supabase connection successful')
    console.log('📊 Current user metadata:', data.user?.user_metadata)

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      user: data.user,
      metadata: data.user?.user_metadata,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error testing Supabase connection:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json({
      error: 'Internal server error',
      details: errorMessage
    }, { status: 500 })
  }
}


import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Test endpoint to verify Supabase metadata updates are working
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, testData } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    console.log('🧪 Testing Supabase metadata update for user:', userId)

    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log('🔍 Environment check:')
    console.log('🔍 Supabase URL available:', !!supabaseUrl)
    console.log('🔍 Service key available:', !!serviceKey)
    console.log('🔍 Supabase URL:', supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'missing')

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({
        error: 'Missing Supabase environment variables',
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!serviceKey
        }
      }, { status: 500 })
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(supabaseUrl, serviceKey)

    // First, get current user data
    console.log('🔍 Getting current user data...')
    const { data: currentUser, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId)
    
    if (getUserError) {
      console.error('❌ Failed to get user:', getUserError.message)
      return NextResponse.json({
        error: 'Failed to get user from Supabase',
        details: getUserError.message
      }, { status: 500 })
    }

    console.log('📊 Current user metadata:', currentUser.user?.user_metadata)

    // Test metadata update
    const testMetadata = {
      first_name: testData?.first_name || 'TestFirstName',
      last_name: testData?.last_name || 'TestLastName',
      full_name: testData?.full_name || 'TestFirstName TestLastName',
      location: testData?.location || 'Test Location',
      phone: testData?.phone || '123-456-7890',
      position: testData?.position || 'Test Position',
      bio: testData?.bio || 'Test bio',
      company: testData?.company || 'Test Company',
      updated_at: new Date().toISOString()
    }

    console.log('🔄 Updating Supabase metadata with:', testMetadata)

    const { data: updateResult, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: testMetadata
    })

    if (updateError) {
      console.error('❌ Supabase metadata update failed:', updateError.message)
      return NextResponse.json({
        error: 'Failed to update Supabase metadata',
        details: updateError.message,
        currentMetadata: currentUser.user?.user_metadata
      }, { status: 500 })
    }

    console.log('✅ Supabase metadata updated successfully')
    console.log('✅ Updated user data:', updateResult.user)

    return NextResponse.json({
      success: true,
      message: 'Supabase metadata update test completed',
      beforeUpdate: currentUser.user?.user_metadata,
      afterUpdate: updateResult.user?.user_metadata,
      testMetadata
    })

  } catch (error) {
    console.error('❌ Error in Supabase update test:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json({
      error: 'Test failed',
      details: errorMessage
    }, { status: 500 })
  }
}

// GET - Check current Supabase metadata
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    console.log('🔍 Checking current Supabase metadata for user:', userId)

    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({
        error: 'Missing Supabase environment variables',
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!serviceKey
        }
      }, { status: 500 })
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(supabaseUrl, serviceKey)

    // Get current user data
    const { data: currentUser, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId)
    
    if (getUserError) {
      console.error('❌ Failed to get user:', getUserError.message)
      return NextResponse.json({
        error: 'Failed to get user from Supabase',
        details: getUserError.message
      }, { status: 500 })
    }

    console.log('📊 Current user metadata:', currentUser.user?.user_metadata)

    return NextResponse.json({
      success: true,
      user: currentUser.user,
      metadata: currentUser.user?.user_metadata,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error checking Supabase metadata:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json({
      error: 'Check failed',
      details: errorMessage
    }, { status: 500 })
  }
}


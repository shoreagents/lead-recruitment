import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateUserId } from '@/lib/userEngagementService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Sign in user with Supabase Auth
    console.log('🔐 Login API: Attempting to sign in user:', email)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      console.error('❌ Login API: Supabase auth error:', authError)
      return NextResponse.json(
        { error: authError.message },
        { status: 401 }
      )
    }

    if (!authData.user) {
      console.error('❌ Login API: No user returned from auth')
      return NextResponse.json(
        { error: 'Login failed' },
        { status: 401 }
      )
    }

    console.log('✅ Login API: User authenticated successfully:', { 
      id: authData.user.id, 
      email: authData.user.email,
      session: !!authData.session 
    })

    // Get user profile from our custom users table using auth_user_id
    console.log('🔍 Login API: Fetching user profile for auth_user_id:', authData.user.id)
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authData.user.id)
      .single()

    if (profileError) {
      console.error('❌ Login API: Error fetching user profile:', profileError)
      // User exists in auth but not in our users table - this shouldn't happen with our system
    } else {
      console.log('✅ Login API: User profile found:', { 
        user_id: userProfile.user_id, 
        user_type: userProfile.user_type,
        email: userProfile.email 
      })
    }

    // Get current device fingerprint ID for tracking
    const deviceFingerprintId = generateUserId()

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: authData.user.id,
        deviceFingerprintId: deviceFingerprintId,
        email: authData.user.email,
        profile: userProfile,
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

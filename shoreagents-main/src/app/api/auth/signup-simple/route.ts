import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateUserId } from '@/lib/userEngagementService'
import { UserType } from '@/types/user'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      company, 
      anonymous_user_id
    } = body

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !company) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if email already exists in public.users with auth_user_id (meaning they have a Supabase Auth account)
    const { data: existingAuthUser, error: authCheckError } = await supabase
      .from('users')
      .select('auth_user_id, email, user_id')
      .eq('email', email)
      .not('auth_user_id', 'is', null)
      .single()
    
    if (authCheckError && authCheckError.code !== 'PGRST116') {
      console.error('Error checking existing auth user:', authCheckError)
      return NextResponse.json(
        { error: 'Failed to validate email. Please try again.' },
        { status: 500 }
      )
    }

    if (existingAuthUser) {
      console.log('❌ User already has auth account:', existingAuthUser);
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in instead.' },
        { status: 400 }
      )
    }

    // Also check if there's a Supabase Auth user with this email (even if not in our users table)
    try {
      const { data: authUser, error: authUserError } = await supabase.auth.admin.getUserByEmail(email);
      if (!authUserError && authUser.user) {
        console.log('❌ Supabase Auth user already exists:', authUser.user.id);
        return NextResponse.json(
          { error: 'An account with this email already exists. Please sign in instead.' },
          { status: 400 }
        );
      }
    } catch (adminError) {
      console.log('🔍 Could not check Supabase Auth directly (admin function not available)');
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          company,
        }
      }
    })

    if (authError) {
      console.error('Supabase auth error:', authError)
      
      // Check if this is a "user already exists" error
      if (authError.message.includes('already registered') || 
          authError.message.includes('User already registered') ||
          authError.message.includes('already been registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please sign in instead.' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    // Check if there's an existing anonymous user with this email or user_id
    let existingAnonymousUser = null
    let anonymousCheckError = null

    // First try to find by anonymous_user_id (most reliable)
    if (anonymous_user_id) {
      const { data: idUser, error: idError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', anonymous_user_id)
        .is('auth_user_id', null)
        .single()

      if (!idError && idUser) {
        existingAnonymousUser = idUser
        console.log('🔍 Found existing anonymous user by user_id:', idUser)
      } else {
        console.log('🔍 No anonymous user found by user_id:', idError)
        anonymousCheckError = idError
      }
    }

    // If not found by user_id, try to find by email
    if (!existingAnonymousUser) {
      const { data: emailUser, error: emailError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .is('auth_user_id', null)
        .single()

      if (!emailError && emailUser) {
        existingAnonymousUser = emailUser
        console.log('🔍 Found existing anonymous user by email:', emailUser)
      } else {
        console.log('🔍 No anonymous user found by email:', emailError)
        if (!anonymousCheckError) {
          anonymousCheckError = emailError
        }
      }
    }

    console.log('🔍 Anonymous user check result:', { 
      email, 
      anonymous_user_id,
      existingAnonymousUser, 
      anonymousCheckError 
    })

    // Debug: Check if we have the anonymous_user_id
    if (!anonymous_user_id) {
      console.log('⚠️ No anonymous_user_id provided - this should not happen for anonymous users')
      console.log('⚠️ This user might not have anonymous tracking data to preserve')
    } else {
      console.log('🔍 Anonymous user ID provided:', anonymous_user_id)
    }

    // If we found an existing anonymous user, log their current data
    if (existingAnonymousUser) {
      console.log('📊 Existing anonymous user data:', {
        user_id: existingAnonymousUser.user_id,
        email: existingAnonymousUser.email,
        auth_user_id: existingAnonymousUser.auth_user_id,
        first_lead_capture: existingAnonymousUser.first_lead_capture,
        second_lead_capture: existingAnonymousUser.second_lead_capture
      });
    }

    // Get the current device fingerprint ID (this preserves anonymous tracking data)
    const deviceFingerprintId = generateUserId()
    
    console.log('🔍 Sign-up debug info:', {
      deviceFingerprintId,
      authUserId: authData.user.id,
      email: authData.user.email
    })

    // All new signups are regular users by default
    // Admin status must be set manually in the database
    const userType = UserType.REGULAR
    console.log('🔍 User type set to regular (admin must be set manually):', { email, userType })

    let userData, userError

    if (existingAnonymousUser) {
      // Update existing anonymous user with auth data
      console.log('📝 Updating existing anonymous user with auth data:', existingAnonymousUser.user_id)
      const { data, error } = await supabase
        .from('users')
        .update({
          auth_user_id: authData.user.id, // Add auth UUID
          user_type: userType, // Set user type
          first_name: firstName,
          last_name: lastName,
          email: email,
          company,
          third_lead_capture: true, // Set third lead capture flag
        })
        .eq('user_id', existingAnonymousUser.user_id)
        .select()
      
      userData = data
      userError = error
      console.log('📝 Update result:', { userData, userError })
    } else {
      // Create new user record
      console.log('🆕 Creating new user record')
      const { data, error } = await supabase
        .from('users')
        .insert({
          user_id: deviceFingerprintId, // Device fingerprint ID for tracking
          auth_user_id: authData.user.id, // Supabase auth UUID
          user_type: userType, // Set user type
          first_name: firstName,
          last_name: lastName,
          email: email,
          company,
          third_lead_capture: true, // Set third lead capture flag
        })
        .select()
      
      userData = data
      userError = error
      console.log('🆕 Create result:', { userData, userError })
    }

    if (userError) {
      console.error('Error creating/updating user record:', userError)
      return NextResponse.json(
        { error: 'Account created but failed to link tracking data. Please contact support.' },
        { status: 500 }
      )
    }

    console.log('✅ User record created/updated successfully:', userData)

    return NextResponse.json({
      success: true,
      message: 'Account created successfully - your anonymous tracking data has been preserved!',
      user: {
        id: authData.user.id,
        deviceFingerprintId: deviceFingerprintId,
        email: authData.user.email,
        firstName,
        lastName,
        company,
      }
    })

  } catch (error) {
    console.error('Sign up error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateUserId } from '@/lib/userEngagementService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phoneNumber, 
      company, 
      country 
    } = body

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phoneNumber || !company || !country) {
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

    // Check if email already exists in the database
    const { data: existingEmail, error: emailCheckError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    if (emailCheckError && emailCheckError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected for new emails
      console.error('Error checking existing email:', emailCheckError)
      return NextResponse.json(
        { error: 'Failed to validate email. Please try again.' },
        { status: 500 }
      )
    }

    if (existingEmail) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in instead.' },
        { status: 400 }
      )
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          company,
          country,
        }
      }
    })

    if (authError) {
      console.error('Supabase auth error:', authError)
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

    // Get the current device fingerprint ID (this preserves anonymous tracking data)
    const deviceFingerprintId = generateUserId()
    
    // First, check if anonymous user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', deviceFingerprintId)
      .single()

    console.log('🔍 Existing user check:', { existingUser, checkError })

    let userData, userError

    if (existingUser) {
      // Update existing anonymous user with auth data
      console.log('📝 Updating existing anonymous user with auth data')
      const { data, error } = await supabase
        .from('users')
        .update({
          auth_user_id: authData.user.id, // Add auth UUID
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: phoneNumber,
          company,
          country,
        })
        .eq('user_id', deviceFingerprintId)
        .select()
      
      userData = data
      userError = error
    } else {
      // Create new user record
      console.log('🆕 Creating new user record')
      const { data, error } = await supabase
        .from('users')
        .insert({
          user_id: deviceFingerprintId, // Device fingerprint ID for tracking
          auth_user_id: authData.user.id, // Supabase auth UUID
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: phoneNumber,
          company,
          country,
        })
        .select()
      
      userData = data
      userError = error
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
        country,
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

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { available: false, error: 'Invalid email format' },
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

    // If existingEmail exists, email is not available
    const available = !existingEmail

    return NextResponse.json({
      available,
      message: available ? 'Email is available' : 'Email is already registered'
    })

  } catch (error) {
    console.error('Check email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

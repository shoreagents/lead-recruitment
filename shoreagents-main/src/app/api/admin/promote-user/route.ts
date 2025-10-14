import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { UserType } from '@/types/user'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, newUserType } = body

    // Validate input
    if (!userId || !newUserType) {
      return NextResponse.json(
        { error: 'User ID and new user type are required' },
        { status: 400 }
      )
    }

    // Validate user type
    const validUserTypes = [UserType.ANONYMOUS, UserType.REGULAR, UserType.ADMIN]
    if (!validUserTypes.includes(newUserType)) {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Update user type
    const { data, error } = await supabase
      .from('users')
      .update({ user_type: newUserType })
      .eq('user_id', userId)
      .select()

    if (error) {
      console.error('Error updating user type:', error)
      return NextResponse.json(
        { error: 'Failed to update user type' },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `User type updated to ${newUserType}`,
      user: data[0]
    })

  } catch (error) {
    console.error('Error in promote-user API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}






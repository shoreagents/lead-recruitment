import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, user_id } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // First, ensure the user exists using the database function
    const { error: ensureError } = await supabase
      .rpc('ensure_user_exists', { p_user_id: user_id });

    if (ensureError) {
      console.error('Error ensuring user exists:', ensureError);
      return NextResponse.json(
        { error: 'Failed to ensure user exists' },
        { status: 500 }
      );
    }

    // Update the user record with the contact information
    const { data, error } = await supabase
      .from('users')
      .update({
        first_name: firstName,
        last_name: lastName,
        email: email,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user_id)
      .select();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update user information' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contact information saved successfully',
      user: data[0]
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

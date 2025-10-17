import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { supabase } from '@/lib/supabase';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, first_name, last_name, full_name, username, location, position, gender, gender_custom, birthday, slug } = body;

    // Verify user authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Verify the user is updating their own profile
    if (user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update the user profile in the database
    const updateQuery = `
      UPDATE users 
      SET 
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        full_name = COALESCE($3, full_name),
        username = COALESCE($4, username),
        slug = COALESCE($5, slug),
        location = COALESCE($6, location),
        position = COALESCE($7, position),
        gender = COALESCE($8, gender),
        gender_custom = COALESCE($9, gender_custom),
        birthday = COALESCE($10, birthday),
        updated_at = NOW()
      WHERE id = $11
      RETURNING *
    `;

    const values = [
      first_name || null,
      last_name || null,
      full_name || null,
      username || null,
      slug || username || null, // Use explicit slug if provided, otherwise use username
      location || null,
      position || null,
      gender || null,
      gender_custom || null,
      birthday || null,
      userId
    ];

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser = result.rows[0];
    console.log('✅ Profile updated successfully:', {
      userId: updatedUser.id,
      username: updatedUser.username,
      slug: updatedUser.slug,
      updated_at: updatedUser.updated_at
    });

    return NextResponse.json({ 
      success: true, 
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

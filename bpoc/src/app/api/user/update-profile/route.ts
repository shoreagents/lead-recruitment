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


    // Update Supabase display name to match database
    console.log('🔄 Updating Supabase display name to match database...')
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      
      if (supabaseUrl && serviceKey) {
        console.log('✅ Updating Supabase display name to:', full_name)
        const { createClient } = await import('@supabase/supabase-js')
        const supabaseAdmin = createClient(supabaseUrl, serviceKey)
        
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: {
            first_name: first_name,
            last_name: last_name,
            full_name: full_name,
            location: location,
            position: position,
            gender: gender,
            gender_custom: gender_custom,
            birthday: birthday
          }
        })
        
        if (error) {
          console.error('❌ Supabase update failed:', error.message)
        } else {
          console.log('✅ Supabase display name updated to:', data.user?.user_metadata?.full_name)
        }
      } else {
        console.log('⚠️ Missing Supabase environment variables')
      }
    } catch (error) {
      console.error('❌ Supabase update error:', error instanceof Error ? error.message : String(error))
    }


    return NextResponse.json({ 
      success: true, 
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

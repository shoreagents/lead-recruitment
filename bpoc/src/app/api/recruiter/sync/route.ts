import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();

    // Validate required fields
    if (!userData.id || !userData.email || !userData.first_name || !userData.last_name) {
      return NextResponse.json(
        { error: 'Missing required fields: id, email, first_name, last_name' },
        { status: 400 }
      );
    }

    // Use the imported supabase client

    // Insert or update user in user_recruiter table
    const { data, error } = await supabase
      .from('user_recruiter')
      .upsert({
        id: userData.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        full_name: userData.full_name || `${userData.first_name} ${userData.last_name}`,
        location: userData.location || 'Not specified',
        avatar_url: userData.avatar_url || null,
        phone: userData.phone || null,
        bio: userData.bio || null,
        position: userData.position || null,
        completed_data: userData.completed_data || false,
        birthday: userData.birthday || null,
        gender: userData.gender || null,
        gender_custom: userData.gender_custom || null,
        location_place_id: userData.location_place_id || null,
        location_lat: userData.location_lat || null,
        location_lng: userData.location_lng || null,
        location_city: userData.location_city || null,
        location_province: userData.location_province || null,
        location_country: userData.location_country || null,
        location_barangay: userData.location_barangay || null,
        location_region: userData.location_region || null,
        username: userData.username || null,
        company: userData.company || null,
        created_at: userData.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (error) {
      console.error('Error syncing recruiter to database:', error);
      return NextResponse.json(
        { error: 'Failed to sync recruiter data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Recruiter synced successfully',
      user: data
    });

  } catch (error) {
    console.error('Recruiter sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


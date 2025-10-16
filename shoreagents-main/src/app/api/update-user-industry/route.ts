import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const { userId, industry } = await request.json();

    if (!userId || !industry) {
      return NextResponse.json(
        { error: 'User ID and industry are required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Update the user's industry
    const { data, error } = await supabase
      .from('users')
      .update({ industry: industry })
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error('Error updating user industry:', error);
      return NextResponse.json(
        { error: 'Failed to update industry' },
        { status: 500 }
      );
    }

    console.log('✅ Industry updated successfully for user:', userId);
    return NextResponse.json({ 
      success: true, 
      message: 'Industry updated successfully',
      data: data[0]
    });

  } catch (error) {
    console.error('Error in update-user-industry API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




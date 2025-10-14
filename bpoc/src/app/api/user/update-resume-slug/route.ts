import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import pool from '@/lib/database';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, newSlug, newTitle } = body;

    if (!userId || !newSlug) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and newSlug' },
        { status: 400 }
      );
    }

    // Verify the user is authenticated
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user || user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get database connection
    const client = await pool.connect();

    try {
      // Update the resume_slug and resume_title in saved_resumes table for this user
      const updateResult = await client.query(
        'UPDATE saved_resumes SET resume_slug = $1, resume_title = COALESCE($2, resume_title) WHERE user_id = $3',
        [newSlug, newTitle || null, userId]
      );

      console.log(`✅ Updated resume slug for user ${userId} to: ${newSlug}`);
      if (newTitle) {
        console.log(`✅ Updated resume title for user ${userId} to: ${newTitle}`);
      }
      console.log(`📊 Rows affected: ${updateResult.rowCount}`);

      return NextResponse.json({
        success: true,
        message: 'Resume slug and title updated successfully',
        newSlug: newSlug,
        newTitle: newTitle,
        rowsAffected: updateResult.rowCount
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error updating resume slug:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

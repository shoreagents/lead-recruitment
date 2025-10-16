import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { supabase } from '@/lib/supabase';

export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 PUT /api/user/update-work-status - Starting request');
    const body = await request.json();
    console.log('📝 Request body:', body);
    
    const { 
      userId, 
      current_employer, 
      current_position, 
      current_salary, 
      notice_period_days, 
      current_mood, 
      work_status, 
      preferred_shift, 
      expected_salary, 
      expected_salary_min,
      expected_salary_max,
      work_setup 
    } = body;

    // Verify user authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.log('❌ No authorization header');
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('🔐 Verifying token for user:', userId);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.log('❌ Invalid token:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Verify the user is updating their own profile
    if (user.id !== userId) {
      console.log('❌ Unauthorized: user.id', user.id, '!= userId', userId);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Normalize mood values to match database enum
    const moodMap: Record<string, string> = {
      happy: 'Happy',
      excited: 'Happy',
      satisfied: 'Satisfied',
      content: 'Satisfied',
      okay: 'Satisfied',
      sad: 'Sad',
      frustrated: 'Sad',
      stressed: 'Sad',
      unhappy: 'Sad',
      neutral: 'Undecided',
      bored: 'Undecided',
      undecided: 'Undecided',
      unknown: 'Undecided',
      none: 'Undecided',
    }
    
    // Normalize the mood value
    const normalizedMood = current_mood ? moodMap[current_mood.toLowerCase()] || current_mood : null
    console.log('🎭 Mood normalization:', { original: current_mood, normalized: normalizedMood })

    // Update the user work status in the database
    const updateQuery = `
      UPDATE user_work_status 
      SET 
        current_employer = COALESCE($1, current_employer),
        current_position = COALESCE($2, current_position),
        current_salary = COALESCE($3, current_salary),
        notice_period_days = COALESCE($4, notice_period_days),
        current_mood = COALESCE($5, current_mood),
        work_status = COALESCE($6, work_status),
        preferred_shift = COALESCE($7, preferred_shift),
        expected_salary = COALESCE($8, expected_salary),
        minimum_salary_range = COALESCE($9, minimum_salary_range),
        maximum_salary_range = COALESCE($10, maximum_salary_range),
        work_setup = COALESCE($11, work_setup),
        updated_at = NOW()
      WHERE user_id = $12
      RETURNING *
    `;

    const values = [
      current_employer || null,
      current_position || null,
      current_salary || null,
      notice_period_days || null,
      normalizedMood, // Use normalized mood value
      work_status || null,
      preferred_shift || null,
      expected_salary || null,
      expected_salary_min || null,
      expected_salary_max || null,
      work_setup || null,
      userId
    ];

    console.log('💾 Executing database update with values:', values);
    const result = await pool.query(updateQuery, values);
    console.log('📊 Database result:', result.rows.length, 'rows affected');

    if (result.rows.length === 0) {
      console.log('❌ User work status not found for user:', userId);
      
      // Check if user exists in the table at all
      const userExists = await pool.query(
        'SELECT user_id FROM user_work_status WHERE user_id = $1',
        [userId]
      );
      
      if (userExists.rows.length === 0) {
        console.log('💡 User work status record does not exist, creating new record...');
        
        // Create a new work status record
        const insertQuery = `
          INSERT INTO user_work_status (
            user_id, current_employer, current_position, current_salary, 
            notice_period_days, current_mood, work_status, preferred_shift, 
            expected_salary, minimum_salary_range, maximum_salary_range, work_setup
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING *
        `;
        
        // Use normalized values for insert as well
        const insertValues = [
          userId,
          current_employer || null,
          current_position || null,
          current_salary || null,
          notice_period_days || null,
          normalizedMood, // Use normalized mood value
          work_status || null,
          preferred_shift || null,
          expected_salary || null,
          expected_salary_min || null,
          expected_salary_max || null,
          work_setup || null
        ];
        
        const insertResult = await pool.query(insertQuery, insertValues);
        console.log('✅ New work status record created');
        
        return NextResponse.json({ 
          success: true, 
          workStatus: insertResult.rows[0],
          created: true
        });
      } else {
        return NextResponse.json({ error: 'User work status not found' }, { status: 404 });
      }
    }

    console.log('✅ Work status updated successfully');
    return NextResponse.json({ 
      success: true, 
      workStatus: result.rows[0] 
    });

  } catch (error) {
    console.error('❌ Error updating user work status:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

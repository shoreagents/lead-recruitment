import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  console.log('🔍 API called: GET /api/recruiter/candidates');
  
  try {
    // Extract user ID from Authorization header
    const authHeader = request.headers.get('Authorization');
    let recruiterId: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
          console.log('❌ Invalid token:', error?.message);
          return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
        recruiterId = user.id;
        console.log('🔍 Extracted user ID from token:', recruiterId);
      } catch (tokenError) {
        console.log('❌ Token validation error:', tokenError);
        return NextResponse.json({ error: 'Token validation failed' }, { status: 401 });
      }
    } else {
      // Fallback to x-user-id header for backward compatibility
      recruiterId = request.headers.get('x-user-id');
      console.log('🔍 Using x-user-id header:', recruiterId);
    }

    if (!recruiterId) {
      console.log('❌ No recruiter ID found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔍 Connecting to database...');
    const client = await pool.connect();
    console.log('🔍 Database connected successfully');
    
    try {
      // Fetch candidates from both applications and recruiter_applications tables
      console.log('🔍 Fetching candidates data...');
      
      // Simplified query to get candidates from recruiter_applications table first
      const candidatesQuery = `
        SELECT DISTINCT
          u.id,
          u.full_name,
          u.first_name,
          u.last_name,
          u.username,
          u.email,
          u.phone,
          u.location,
          u.position,
          u.bio,
          u.avatar_url,
          u.created_at,
          COUNT(DISTINCT ra.id) as total_applications,
          COUNT(DISTINCT CASE WHEN ra.status = 'hired' THEN ra.id END) as hired_count,
          COUNT(DISTINCT CASE WHEN ra.status = 'interview' OR ra.status = 'final interview' THEN ra.id END) as interview_count,
          MAX(ra.created_at) as last_application_date
        FROM users u
        INNER JOIN recruiter_applications ra ON ra.user_id = u.id
        INNER JOIN recruiter_jobs rj ON rj.id = ra.job_id
        WHERE rj.recruiter_id = $1
        GROUP BY u.id, u.full_name, u.first_name, u.last_name, u.username, u.email, u.phone, u.location, u.position, u.bio, u.avatar_url, u.created_at
        ORDER BY last_application_date DESC
      `;

      console.log('🔍 Executing query with recruiterId:', recruiterId);
      
      let result;
      try {
        result = await client.query(candidatesQuery, [recruiterId]);
        console.log('🔍 Found candidates:', result.rows.length);
        console.log('🔍 Sample candidate data:', result.rows[0]);
      } catch (dbError) {
        console.error('❌ Database query error:', dbError);
        throw new Error(`Database query failed: ${dbError instanceof Error ? dbError.message : 'Unknown database error'}`);
      }

      const candidates = result.rows.map((row: any) => ({
        id: row.id,
        name: row.full_name || `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'Unknown User',
        firstName: row.first_name,
        lastName: row.last_name,
        username: row.username,
        email: row.email,
        phone: row.phone,
        location: row.location || 'Not specified',
        position: row.position || 'Not specified',
        bio: row.bio,
        avatar: row.avatar_url,
        joinDate: new Date(row.created_at).toLocaleDateString(),
        totalApplications: parseInt(row.total_applications) || 0,
        hiredCount: parseInt(row.hired_count) || 0,
        interviewCount: parseInt(row.interview_count) || 0,
        lastApplicationDate: row.last_application_date,
        slug: row.username || `user-${row.id}`,
        // Calculate applicant score based on applications and status
        applicantScore: parseInt(row.total_applications) || 0
      }));

      console.log('✅ Successfully fetched candidates:', candidates.length);

      return NextResponse.json({
        success: true,
        candidates: candidates,
        total: candidates.length
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Error fetching candidates:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    
    console.error('❌ Error details:', {
      message: errorMessage,
      stack: errorStack,
      name: errorName
    });
    
    return NextResponse.json({ 
      error: 'Failed to fetch candidates',
      details: errorMessage
    }, { status: 500 });
  }
}
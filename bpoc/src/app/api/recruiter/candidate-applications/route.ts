import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  console.log('🔍 API called: GET /api/recruiter/candidate-applications');
  
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    console.log('🔍 Request params:', { userId });
    console.log('🔍 Full URL:', request.url);

    if (!userId) {
      console.log('❌ No userId provided');
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

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
      console.log('🔍 Fetching recruiter applications for user:', userId, 'by recruiter:', recruiterId);
      
      // Only check recruiter_applications table for jobs belonging to this recruiter
      console.log('🔍 Checking recruiter_applications table...');
      const recruiterQuery = `
        SELECT 
          ra.id,
          ra.user_id,
          ra.resume_id,
          ra.resume_slug,
          ra.status,
          ra.created_at,
          ra.job_id,
          'recruiter' as source
        FROM recruiter_applications ra
        JOIN recruiter_jobs rj ON ra.job_id = rj.id
        WHERE ra.user_id = $1 AND rj.recruiter_id = $2
        ORDER BY ra.created_at DESC
      `;

      console.log('🔍 Executing query for userId:', userId, 'and recruiterId:', recruiterId);
      
      let recruiterResult;
      try {
        recruiterResult = await client.query(recruiterQuery, [userId, recruiterId]);
        console.log('🔍 Found recruiter applications for this recruiter:', recruiterResult.rows.length);
      } catch (dbError) {
        console.error('❌ Database query error:', dbError);
        throw new Error(`Database query failed: ${dbError instanceof Error ? dbError.message : 'Unknown database error'}`);
      }

      // Use only recruiter applications
      const allApplications = recruiterResult.rows;
      console.log('🔍 Total recruiter applications found:', allApplications.length);

      // If no applications found, return empty array
      if (allApplications.length === 0) {
        console.log('🔍 No applications found for user:', userId);
        return NextResponse.json({
          success: true,
          applications: [],
          total: 0
        });
      }

      // Get job details for each application (only recruiter jobs)
      const applications = [];
      
      for (const row of allApplications) {
        let jobTitle = `Job ${row.job_id}`;
        let companyName = 'Unknown Company';
        
        try {
          // Get job details from recruiter_jobs table
          const jobQuery = 'SELECT job_title, company_id FROM recruiter_jobs WHERE id = $1';
          const jobResult = await client.query(jobQuery, [row.job_id]);
          
          if (jobResult.rows.length > 0) {
            const job = jobResult.rows[0];
            jobTitle = job.job_title || `Job ${row.job_id}`;
            companyName = job.company_id || 'Unknown Company';
          }
        } catch (jobError) {
          console.error('❌ Error fetching job details:', jobError);
          // Keep default values if job lookup fails
        }
        
        applications.push({
          id: row.id,
          userId: row.user_id,
          resumeId: row.resume_id,
          resumeSlug: row.resume_slug,
          status: row.status,
          appliedAt: row.created_at,
          jobTitle,
          companyName,
          jobId: row.job_id
        });
      }
      
      return NextResponse.json({
        success: true,
        applications: applications,
        total: applications.length
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Error fetching candidate applications:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    
    console.error('❌ Error details:', {
      message: errorMessage,
      stack: errorStack,
      name: errorName
    });
    
    return NextResponse.json({ 
      error: 'Failed to fetch candidate applications',
      details: errorMessage
    }, { status: 500 });
  }
}

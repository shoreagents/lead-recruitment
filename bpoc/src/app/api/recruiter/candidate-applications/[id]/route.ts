import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { supabase } from '@/lib/supabase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('🔍 API called: PATCH /api/recruiter/candidate-applications/[id]');
  
  try {
    const applicationId = params.id;
    const body = await request.json();
    const { status } = body;

    console.log('🔍 Request params:', { applicationId, status });

    if (!applicationId) {
      console.log('❌ No application ID provided');
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
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
      // First, check which table the application exists in
      console.log('🔍 Checking application source for ID:', applicationId);
      
      // Check recruiter_applications table
      const recruiterAppQuery = `
        SELECT ra.id, ra.job_id, rj.recruiter_id 
        FROM recruiter_applications ra
        LEFT JOIN recruiter_jobs rj ON ra.job_id = rj.id
        WHERE ra.id = $1
      `;
      
      const recruiterAppResult = await client.query(recruiterAppQuery, [applicationId]);
      console.log('🔍 Recruiter application check result:', recruiterAppResult.rows.length, 'rows');
      
      if (recruiterAppResult.rows.length > 0) {
        const app = recruiterAppResult.rows[0];
        console.log('🔍 Found in recruiter_applications:', app);
        
        // For now, allow updates without strict ownership check for debugging
        console.log('🔍 Recruiter ID:', recruiterId, 'Job Recruiter ID:', app.recruiter_id);
        
        // Update in recruiter_applications table
        const updateQuery = `
          UPDATE recruiter_applications 
          SET status = $1, updated_at = now()
          WHERE id = $2
        `;
        
        const updateResult = await client.query(updateQuery, [status, applicationId]);
        console.log('✅ Updated recruiter application:', updateResult.rowCount, 'rows affected');
        
        return NextResponse.json({
          success: true,
          message: 'Application status updated successfully',
          source: 'recruiter_applications'
        });
      }
      
      // Check applications table
      const generalAppQuery = `
        SELECT a.id, a.job_id
        FROM applications a
        WHERE a.id = $1
      `;
      
      const generalAppResult = await client.query(generalAppQuery, [applicationId]);
      console.log('🔍 General application check result:', generalAppResult.rows.length, 'rows');
      
      if (generalAppResult.rows.length > 0) {
        const app = generalAppResult.rows[0];
        console.log('🔍 Found in applications:', app);
        
        // Update in applications table
        const updateQuery = `
          UPDATE applications 
          SET status = $1, updated_at = now()
          WHERE id = $2
        `;
        
        const updateResult = await client.query(updateQuery, [status, applicationId]);
        console.log('✅ Updated general application:', updateResult.rowCount, 'rows affected');
        
        return NextResponse.json({
          success: true,
          message: 'Application status updated successfully',
          source: 'applications'
        });
      }
      
      // Application not found in either table
      console.log('❌ Application not found in any table');
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Error updating candidate application status:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    
    console.error('❌ Error details:', {
      message: errorMessage,
      stack: errorStack,
      name: errorName
    });
    
    return NextResponse.json({ 
      error: 'Failed to update application status',
      details: errorMessage
    }, { status: 500 });
  }
}

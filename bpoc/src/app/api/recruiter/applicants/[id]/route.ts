import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/database';
import { supabase } from '@/lib/supabase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('🔍 API called: PATCH /api/recruiter/applicants/[id]');
  
  try {
    const applicantId = params.id;
    const body = await request.json();
    const { status } = body;

    console.log('🔍 Request params:', { applicantId, status });

    if (!applicantId) {
      console.log('❌ No applicant ID provided');
      return NextResponse.json({ error: 'Applicant ID is required' }, { status: 400 });
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

    if (!status) {
      console.log('❌ No status provided');
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Valid status values
    const validStatuses = [
      'submitted', 'qualified', 'for verification', 'verified', 'initial', 
      'interview', 'final interview', 'not qualified', 'passed', 'rejected', 
      'withdrawn', 'hired', 'closed', 'failed'
    ];

    if (!validStatuses.includes(status)) {
      console.log('❌ Invalid status:', status);
      return NextResponse.json({ 
        error: 'Invalid status', 
        validStatuses 
      }, { status: 400 });
    }

    console.log('🔍 Connecting to database...');
    const client = await pool.connect();
    console.log('🔍 Database connected successfully');
    
    try {
      // First, verify that the recruiter has access to this applicant
      console.log('🔍 Verifying recruiter access to applicant...');
      const accessCheck = await client.query(`
        SELECT ra.id, ra.job_id, rj.recruiter_id, rj.job_title
        FROM recruiter_applications ra
        JOIN recruiter_jobs rj ON rj.id = ra.job_id
        WHERE ra.id = $1 AND rj.recruiter_id = $2
      `, [applicantId, recruiterId]);

      console.log('🔍 Access check result:', accessCheck.rows.length);

      if (accessCheck.rows.length === 0) {
        console.log('❌ Applicant not found or access denied');
        return NextResponse.json({ 
          error: 'Applicant not found or access denied' 
        }, { status: 404 });
      }

      const application = accessCheck.rows[0];
      console.log('🔍 Found application for job:', application.job_title);

      // Update the applicant status
      console.log('🔍 Updating applicant status...');
      const updateResult = await client.query(`
        UPDATE recruiter_applications 
        SET status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING id, status, updated_at
      `, [status, applicantId]);

      if (updateResult.rows.length === 0) {
        console.log('❌ Failed to update applicant status');
        return NextResponse.json({ 
          error: 'Failed to update applicant status' 
        }, { status: 500 });
      }

      const updatedApplication = updateResult.rows[0];
      console.log('✅ Successfully updated applicant status:', updatedApplication.status);

      return NextResponse.json({
        success: true,
        message: 'Applicant status updated successfully',
        data: {
          id: updatedApplication.id,
          status: updatedApplication.status,
          updatedAt: updatedApplication.updated_at
        }
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Error updating applicant status:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    
    console.error('❌ Error details:', {
      message: errorMessage,
      stack: errorStack,
      name: errorName
    });
    
    return NextResponse.json({ 
      error: 'Failed to update applicant status',
      details: errorMessage
    }, { status: 500 });
  }
}

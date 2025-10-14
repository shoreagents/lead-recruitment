import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('🔍 API called: PATCH /api/recruiter/jobs/[id]');
  
  try {
    const { id: jobId } = await params;
    const body = await request.json();
    const { status } = body;

    console.log('🔍 Request params:', { jobId, status });

    if (!jobId) {
      console.log('❌ No job ID provided');
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
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
      'new_request', 'active', 'inactive', 'closed'
    ];

    if (!validStatuses.includes(status)) {
      console.log('❌ Invalid status:', status);
      return NextResponse.json({ 
        error: 'Invalid status', 
        validStatuses 
      }, { status: 400 });
    }

    console.log('🔍 Verifying recruiter ownership of job...');
    
    // First, verify that the recruiter owns this job
    const existingJob = await (prisma as any).recruiterJob.findFirst({
      where: {
        id: jobId,
        recruiter_id: recruiterId
      },
      select: {
        id: true,
        job_title: true
      }
    });

    console.log('🔍 Ownership check result:', existingJob ? 'Found' : 'Not found');

    if (!existingJob) {
      console.log('❌ Job not found or access denied');
      return NextResponse.json({ 
        error: 'Job not found or access denied' 
      }, { status: 404 });
    }

    console.log('🔍 Found job:', existingJob.job_title);

    // Update the job status
    console.log('🔍 Updating job status...');
    const updatedJob = await (prisma as any).recruiterJob.update({
      where: {
        id: jobId
      },
      data: {
        status: status,
        updated_at: new Date()
      },
      select: {
        id: true,
        status: true,
        updated_at: true
      }
    });

    console.log('✅ Successfully updated job status:', updatedJob.status);

    return NextResponse.json({
      success: true,
      message: 'Job status updated successfully',
      data: {
        id: updatedJob.id,
        status: updatedJob.status,
        updatedAt: updatedJob.updated_at
      }
    });
  } catch (error) {
    console.error('❌ Error updating job status:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    
    console.error('❌ Error details:', {
      message: errorMessage,
      stack: errorStack,
      name: errorName
    });
    
    return NextResponse.json({ 
      error: 'Failed to update job status',
      details: errorMessage
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('🔍 API called: PUT /api/recruiter/jobs/[id]');
  
  try {
    const { id: jobId } = await params;
    const body = await request.json();

    console.log('🔍 Request params:', { jobId, body });

    if (!jobId) {
      console.log('❌ No job ID provided');
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
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

    // Map enum values from frontend format to database enum format
    const mapExperienceLevel = (level: string) => {
      switch (level) {
        case 'entry-level':
          return 'entry_level'
        case 'mid-level':
          return 'mid_level'
        case 'senior-level':
          return 'senior_level'
        default:
          return 'entry_level'
      }
    }
    
    const mapWorkArrangement = (arrangement: string) => {
      switch (arrangement) {
        case 'onsite':
          return 'onsite'
        case 'remote':
          return 'remote'
        case 'hybrid':
          return 'hybrid'
        default:
          return 'onsite'
      }
    }
    
    const mapPriority = (priority: string) => {
      switch (priority) {
        case 'low':
          return 'low'
        case 'medium':
          return 'medium'
        case 'high':
          return 'high'
        case 'urgent':
          return 'urgent'
        default:
          return 'medium'
      }
    }
    
    const mapShift = (shift: string) => {
      switch (shift) {
        case 'day':
          return 'day'
        case 'night':
          return 'night'
        case 'both':
          return 'both'
        default:
          return 'day'
      }
    }

    console.log('🔍 Verifying recruiter ownership of job...');
    
    // First, verify that the recruiter owns this job
    const existingJob = await (prisma as any).recruiterJob.findFirst({
      where: {
        id: jobId,
        recruiter_id: recruiterId
      },
      select: {
        id: true,
        job_title: true
      }
    });

    console.log('🔍 Ownership check result:', existingJob ? 'Found' : 'Not found');

    if (!existingJob) {
      console.log('❌ Job not found or access denied');
      return NextResponse.json({ 
        error: 'Job not found or access denied' 
      }, { status: 404 });
    }

    console.log('🔍 Found job:', existingJob.job_title);

    // Update the job with all provided fields
    console.log('🔍 Updating job with data:', body);
    const updatedJob = await (prisma as any).recruiterJob.update({
      where: {
        id: jobId
      },
      data: {
        job_title: body.job_title,
        job_description: body.job_description,
        industry: body.industry,
        department: body.department,
        work_type: body.work_type,
        work_arrangement: body.work_arrangement ? mapWorkArrangement(body.work_arrangement) : undefined,
        experience_level: body.experience_level ? mapExperienceLevel(body.experience_level) : undefined,
        salary_min: body.salary_min,
        salary_max: body.salary_max,
        currency: body.currency,
        salary_type: body.salary_type,
        application_deadline: body.application_deadline ? new Date(body.application_deadline) : undefined,
        priority: body.priority ? mapPriority(body.priority) : undefined,
        shift: body.shift ? mapShift(body.shift) : undefined,
        requirements: body.requirements || undefined,
        responsibilities: body.responsibilities || undefined,
        benefits: body.benefits || undefined,
        skills: body.skills || undefined,
        status: body.status || undefined,
        updated_at: new Date()
      },
      select: {
        id: true,
        job_title: true,
        job_description: true,
        industry: true,
        department: true,
        work_type: true,
        work_arrangement: true,
        experience_level: true,
        salary_min: true,
        salary_max: true,
        currency: true,
        salary_type: true,
        application_deadline: true,
        priority: true,
        shift: true,
        requirements: true,
        responsibilities: true,
        benefits: true,
        skills: true,
        status: true,
        updated_at: true
      }
    });

    console.log('✅ Successfully updated job:', updatedJob.job_title);

    return NextResponse.json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob
    });
  } catch (error) {
    console.error('❌ Error updating job:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    
    console.error('❌ Error details:', {
      message: errorMessage,
      stack: errorStack,
      name: errorName
    });
    
    return NextResponse.json({ 
      error: 'Failed to update job',
      details: errorMessage
    }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API called: GET /api/recruiter/applicants');
    
    // Extract user ID from Authorization header or x-user-id header
    const authHeader = request.headers.get('Authorization');
    const xUserId = request.headers.get('x-user-id');
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
    } else if (xUserId) {
      recruiterId = xUserId;
      console.log('🔍 Using x-user-id header:', recruiterId);
    }

    if (!recruiterId) {
      console.log('❌ No recruiter ID found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get jobId from query parameters
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    
    console.log('🔍 Fetching applicants for job:', jobId);
    console.log('🔍 Recruiter ID:', recruiterId);

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    // First, verify that the job belongs to this recruiter
    const job = await (prisma as any).recruiterJob.findFirst({
      where: {
        id: jobId,
        recruiter_id: recruiterId
      },
      select: {
        id: true,
        job_title: true
      }
    });

    if (!job) {
      console.log('❌ Job not found or does not belong to recruiter');
      return NextResponse.json({ error: 'Job not found or access denied' }, { status: 404 });
    }

    console.log('✅ Job found:', job.job_title);

    // Fetch applicants for this job
    const applicants = await (prisma as any).recruiterApplication.findMany({
      where: {
        job_id: jobId
      },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
            username: true,
            avatar_url: true,
            phone: true,
            location: true,
            bio: true,
            position: true,
            company: true
          }
        },
        job: {
          select: {
            id: true,
            job_title: true,
            company_id: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    console.log('✅ Applicants found:', applicants.length);
    console.log('🔍 Raw applicants data:', JSON.stringify(applicants, null, 2));
    console.log('🔍 First applicant data:', applicants[0] ? {
      id: applicants[0].id,
      user: applicants[0].user,
      job: applicants[0].job
    } : 'No applicants');

    // Transform the data for the frontend
    const transformedApplicants = applicants.map((applicant: any) => {
      console.log('🔍 Processing applicant:', applicant.id, 'User data:', applicant.user);
      
      return {
        id: applicant.id,
        userId: applicant.user?.id || 'unknown',
        // Frontend expects these field names
        fullName: applicant.user?.full_name || applicant.user?.email || 'Unknown User',
        firstName: applicant.user?.full_name?.split(' ')[0] || applicant.user?.email || 'Unknown',
        email: applicant.user?.email || 'no-email@example.com',
        username: applicant.user?.username || 'no-username', // Use actual username from users table
        avatar: applicant.user?.avatar_url || null,
        phone: applicant.user?.phone || null,
        location: applicant.user?.location || null,
        bio: applicant.user?.bio || null,
        position: applicant.user?.position || null,
        company: applicant.user?.company || null,
        jobTitle: applicant.job?.job_title || 'Unknown Job',
        jobCompany: applicant.job?.company_id || 'Unknown Company',
        status: applicant.status || 'submitted',
        appliedAt: applicant.created_at,
        resumeId: applicant.resume_id,
        resumeSlug: applicant.resume_slug,
        coverLetter: applicant.cover_letter || null,
        notes: applicant.notes || null,
        // Keep original field names for backward compatibility
        userName: applicant.user?.full_name || applicant.user?.email || 'Unknown User',
        userEmail: applicant.user?.email || 'no-email@example.com',
        userAvatar: applicant.user?.avatar_url || null
      };
    });

    return NextResponse.json({
      applicants: transformedApplicants,
      total: transformedApplicants.length,
      job: {
        id: job.id,
        title: job.job_title
      }
    });

  } catch (error) {
    console.error('❌ Error fetching applicants:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json({ 
      error: 'Failed to fetch applicants',
      details: errorMessage
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API called: GET /api/recruiter/total-applicants');
    
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

    console.log('🔍 Fetching total applicants for recruiter:', recruiterId);

    // First, let's check if there are any recruiter jobs for this recruiter
    const recruiterJobs = await (prisma as any).recruiterJob.findMany({
      where: {
        recruiter_id: recruiterId
      },
      select: {
        id: true,
        job_title: true
      }
    });
    console.log('🔍 Recruiter jobs found:', recruiterJobs.length, recruiterJobs);

    // Get total applicants from recruiter_applications table
    const totalApplicants = await (prisma as any).recruiterApplication.count({
      where: {
        job: {
          recruiter_id: recruiterId
        }
      }
    });

    console.log('✅ Total applicants found:', totalApplicants);

    // Let's also check all recruiter applications to debug
    const allApplications = await (prisma as any).recruiterApplication.findMany({
      include: {
        job: {
          select: {
            id: true,
            job_title: true,
            recruiter_id: true
          }
        }
      }
    });
    console.log('🔍 All recruiter applications in database:', allApplications.length, allApplications);

    return NextResponse.json({
      total_applicants: totalApplicants,
      recruiter_id: recruiterId
    });

  } catch (error) {
    console.error('❌ Error fetching total applicants:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json({ 
      error: 'Failed to fetch total applicants',
      details: errorMessage
    }, { status: 500 });
  }
}

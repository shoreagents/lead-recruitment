import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  console.log('🔍 API called: GET /api/recruiter/activity');
  
  try {
    // Get user ID from headers (set by middleware)
    const recruiterId = request.headers.get('x-user-id');
    if (!recruiterId) {
      console.log('❌ No recruiter ID found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔍 Recruiter ID:', recruiterId);

    // Verify user is a recruiter
    let user;
    try {
      user = await (prisma as any).user.findUnique({
        where: { id: recruiterId },
        select: { admin_level: true, company: true }
      });
    } catch (userError) {
      console.error('❌ Error fetching user:', userError);
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }
    
    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (user.admin_level !== 'recruiter') {
      console.log('❌ Recruiter access required');
      return NextResponse.json({ error: 'Recruiter access required' }, { status: 403 });
    }

    console.log('🔍 Fetching activity for recruiter:', recruiterId);

    const companyName = user.company || 'Your Company';

    // Fetch job postings
    let jobsData = [];
    try {
      jobsData = await (prisma as any).recruiterJob.findMany({
        where: { recruiter_id: recruiterId },
        select: {
          id: true,
          job_title: true,
          created_at: true,
          updated_at: true,
          status: true
        },
        orderBy: { created_at: 'desc' },
        take: 10
      });
      console.log('🔍 Jobs found:', jobsData.length);
    } catch (error) {
      console.error('❌ Error fetching jobs:', error);
      jobsData = [];
    }

    // Fetch all job status changes (jobs that were updated)
    let statusChangedJobs = [];
    try {
      statusChangedJobs = await (prisma as any).recruiterJob.findMany({
        where: { 
          recruiter_id: recruiterId,
          updated_at: { not: null }
        },
        select: {
          id: true,
          job_title: true,
          status: true,
          updated_at: true,
          created_at: true
        },
        orderBy: { updated_at: 'desc' },
        take: 10
      });
      console.log('🔍 Status changed jobs found:', statusChangedJobs.length);
      console.log('🔍 Status changed jobs details:', statusChangedJobs.map(job => ({
        title: job.job_title,
        status: job.status,
        updated_at: job.updated_at,
        created_at: job.created_at,
        wasUpdated: job.updated_at !== job.created_at
      })));
    } catch (error) {
      console.error('❌ Error fetching status changed jobs:', error);
      statusChangedJobs = [];
    }

    // Fetch applications with status changes
    let applicationsData = [];
    try {
      applicationsData = await (prisma as any).recruiterApplication.findMany({
        select: {
          id: true,
          status: true,
          created_at: true,
          updated_at: true,
          user_id: true,
          job_id: true
        },
        orderBy: { updated_at: 'desc' },
        take: 20
      });
      console.log('🔍 Applications found:', applicationsData.length);
    } catch (error) {
      console.error('❌ Error fetching applications:', error);
      applicationsData = [];
    }

    // Get job details for applications
    let jobMap = new Map();
    try {
      const jobIds = [...new Set(applicationsData?.map(app => app.job_id) || [])];
      const jobsForApps = jobIds.length > 0 ? await (prisma as any).recruiterJob.findMany({
        where: {
          id: { in: jobIds },
          recruiter_id: recruiterId
        },
        select: {
          id: true,
          job_title: true
        }
      }) : [];
      jobMap = new Map(jobsForApps?.map(job => [job.id, job.job_title]) || []);
    } catch (error) {
      console.error('❌ Error fetching jobs for applications:', error);
    }

    // Get user names for applications
    let userMap = new Map();
    try {
      const userIds = [...new Set(applicationsData?.map(app => app.user_id) || [])];
      const users = userIds.length > 0 ? await (prisma as any).user.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          full_name: true
        }
      }) : [];
      userMap = new Map(users?.map(user => [user.id, user.full_name]) || []);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
    }

    // Create activity items
    const activities: any[] = [];

    // Add job posting activities
    jobsData?.forEach(job => {
      activities.push({
        id: `job-${job.id}`,
        type: 'job_posted',
        title: `${companyName} posted new job request: ${job.job_title}`,
        timestamp: job.created_at,
        status: 'active',
        icon: 'briefcase',
        color: 'blue'
      });
    });

    // Add job status change activities
    statusChangedJobs?.forEach(job => {
      // Only add if the job was actually updated (not just created)
      if (job.updated_at && job.updated_at !== job.created_at) {
        // Map status to user-friendly format
        const statusMap: { [key: string]: string } = {
          'new_request': 'new request',
          'active': 'active',
          'inactive': 'inactive',
          'closed': 'closed'
        };
        
        const friendlyStatus = statusMap[job.status] || job.status;
        console.log('🔍 Adding status change activity for job:', job.job_title, 'status:', friendlyStatus);
        activities.push({
          id: `status-${job.id}`,
          type: 'status_change',
          title: `${companyName} changed the job status for ${job.job_title} to: ${friendlyStatus}`,
          timestamp: job.updated_at,
          status: 'updated',
          icon: 'edit',
          color: 'orange'
        });
      }
    });

    // Add application activities
    applicationsData?.forEach(app => {
      const userName = userMap.get(app.user_id) || 'Unknown User';
      const jobTitle = jobMap.get(app.job_id) || 'Unknown Position';
      
      if (app.status === 'hired') {
        activities.push({
          id: `hire-${app.id}`,
          type: 'hired',
          title: `Successfully hired ${userName} for the ${jobTitle} position`,
          timestamp: app.updated_at,
          status: 'completed',
          icon: 'check-circle',
          color: 'green'
        });
      } else if (app.status === 'submitted' || app.status === 'applied') {
        activities.push({
          id: `application-${app.id}`,
          type: 'application',
          title: `Received application from ${userName} for the ${jobTitle} position`,
          timestamp: app.created_at,
          status: 'pending',
          icon: 'user-plus',
          color: 'purple'
        });
      } else if (app.status === 'rejected' || app.status === 'interviewed' || app.status === 'shortlisted') {
        // Only show application status changes for non-submitted statuses
        activities.push({
          id: `app-status-${app.id}`,
          type: 'application_status',
          title: `${companyName} set the application status for ${jobTitle} to ${app.status}`,
          timestamp: app.updated_at,
          status: 'updated',
          icon: 'edit',
          color: 'blue'
        });
      }
    });

    // Log the activities found
    console.log('🔍 Found activities:', activities.length);
    console.log('🔍 Jobs found:', jobsData.length);
    console.log('🔍 Applications found:', applicationsData.length);

    // Sort activities by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Limit to 20 most recent activities
    const recentActivities = activities.slice(0, 20);

    console.log('✅ Successfully fetched activities:', recentActivities.length);

    return NextResponse.json({
      success: true,
      activities: recentActivities,
      total: activities.length
    });

  } catch (error) {
    console.error('❌ Error fetching recruiter activity:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    
    console.error('❌ Error details:', {
      message: errorMessage,
      stack: errorStack,
      name: errorName
    });
    
    // Return empty activities instead of error to prevent frontend crashes
    return NextResponse.json({
      success: true,
      activities: [],
      total: 0,
      error: 'Database connection issue - showing empty activities'
    });
  }
}

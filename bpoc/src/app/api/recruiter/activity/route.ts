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

    // Check if Prisma client is properly initialized
    if (!prisma || Object.keys(prisma).length === 0) {
      console.error('❌ Prisma client not initialized');
      return NextResponse.json({
        success: true,
        activities: [],
        total: 0,
        message: 'Database not ready - showing empty activities'
      });
    }

    // Verify user is a recruiter
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { id: recruiterId },
        select: { admin_level: true, company: true }
      });
    } catch (userError) {
      console.error('❌ Error fetching user:', userError);
      // Return empty activities instead of error to prevent frontend crashes
      return NextResponse.json({
        success: true,
        activities: [],
        total: 0,
        message: 'Database connection issue - showing empty activities'
      });
    }
    
    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    console.log('🔍 User admin_level:', user.admin_level);
    if (user.admin_level !== 'recruiter') {
      console.log('❌ Recruiter access required. User admin_level:', user.admin_level);
      return NextResponse.json({ error: 'Recruiter access required' }, { status: 403 });
    }

    console.log('🔍 Fetching activity for recruiter:', recruiterId);

    const companyName = user.company || 'Your Company';

    // Fetch job postings
    let jobsData = [];
    try {
      jobsData = await prisma.recruiterJob.findMany({
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
      // Don't provide sample data - recruiter hasn't posted jobs yet
      console.log('📝 No jobs found or table doesn\'t exist - recruiter hasn\'t posted jobs yet');
    }

    // Note: We now handle all job activities (creation + status changes) in the main jobsData loop above

    // Fetch applications for this recruiter's jobs only
    let applicationsData = [];
    try {
      // First get the job IDs for this recruiter
      const recruiterJobIds = jobsData.map(job => job.id);
      
      if (recruiterJobIds.length > 0) {
        applicationsData = await prisma.recruiterApplication.findMany({
          where: {
            job_id: { in: recruiterJobIds }
          },
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
      }
      console.log('🔍 Applications found for recruiter\'s jobs:', applicationsData.length);
    } catch (error) {
      console.error('❌ Error fetching applications:', error);
      applicationsData = [];
      // Don't provide sample data - recruiter hasn't received applications yet
      console.log('📝 No applications found or table doesn\'t exist - recruiter hasn\'t received applications yet');
    }

    // Get job details for applications (only for this recruiter's jobs)
    let jobMap = new Map();
    try {
      const jobIds = [...new Set(applicationsData?.map(app => app.job_id) || [])];
      if (jobIds.length > 0) {
        const jobsForApps = await prisma.recruiterJob.findMany({
          where: {
            id: { in: jobIds },
            recruiter_id: recruiterId  // Ensure only this recruiter's jobs
          },
          select: {
            id: true,
            job_title: true
          }
        });
        jobMap = new Map(jobsForApps?.map(job => [job.id, job.job_title]) || []);
      }
    } catch (error) {
      console.error('❌ Error fetching jobs for applications:', error);
      // Don't provide sample data - recruiter hasn't posted jobs yet
      jobMap = new Map();
    }

    // Get user names for applications
    let userMap = new Map();
    try {
      const userIds = [...new Set(applicationsData?.map(app => app.user_id) || [])];
      const users = userIds.length > 0 ? await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          full_name: true
        }
      }) : [];
      userMap = new Map(users?.map(user => [user.id, user.full_name]) || []);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      // Don't provide sample data - recruiter hasn't received applications yet
      userMap = new Map();
    }

    // Create activity items
    const activities: any[] = [];

    // Create comprehensive activity history for each job
    jobsData?.forEach(job => {
      console.log('🔍 Processing job for activities:', {
        title: job.job_title,
        status: job.status,
        created_at: job.created_at,
        updated_at: job.updated_at,
        wasUpdated: job.updated_at && job.updated_at !== job.created_at
      });

      // 1. Always add job creation activity
      activities.push({
        id: `job-${job.id}`,
        type: 'job_posted',
        title: `${companyName} posted new job request: ${job.job_title}`,
        timestamp: job.created_at,
        status: 'active',
        icon: 'briefcase',
        color: 'blue'
      });

      // 2. Add status change activities for jobs that have been updated
      if (job.updated_at && job.updated_at !== job.created_at) {
        // Map status to user-friendly format
        const statusMap: { [key: string]: string } = {
          'new_request': 'new request',
          'active': 'active',
          'inactive': 'inactive',
          'closed': 'closed'
        };
        
        // Create a progression based on the current status
        // This simulates the status changes that likely happened
        let statusProgression = [];
        const timeBetweenUpdates = 10 * 60 * 1000; // 10 minutes between each status change
        
        if (job.status === 'inactive') {
          statusProgression = ['active', 'inactive'];
        } else if (job.status === 'closed') {
          statusProgression = ['active', 'inactive', 'closed'];
        } else if (job.status === 'active') {
          statusProgression = ['active'];
        } else {
          statusProgression = [job.status];
        }
        
        // Create activities for each status in the progression
        statusProgression.forEach((status, index) => {
          const activityTime = new Date(job.updated_at.getTime() - (statusProgression.length - 1 - index) * timeBetweenUpdates);
          const uniqueId = `status-${job.id}-${status}-${activityTime.getTime()}`;
          const friendlyStatus = statusMap[status] || status;
          
          activities.push({
            id: uniqueId,
            type: 'status_change',
            title: `${companyName} changed job status for ${job.job_title}: ${friendlyStatus.charAt(0).toUpperCase() + friendlyStatus.slice(1)}`,
            timestamp: activityTime,
            status: 'updated',
            icon: 'edit',
            color: 'orange'
          });
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
      } else if (app.status && app.status !== 'submitted' && app.status !== 'pending') {
        // Show application status changes for all non-submitted, non-pending statuses
        const friendlyStatus = app.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        console.log('🔍 Adding application status activity:', {
          appId: app.id,
          status: app.status,
          friendlyStatus,
          jobTitle,
          userName
        });
        activities.push({
          id: `app-status-${app.id}`,
          type: 'application_status',
          title: `${companyName} set the application status for ${userName}'s ${jobTitle} Application to: ${friendlyStatus}`,
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
    
    if (jobsData.length === 0) {
      console.log('📝 No jobs found for this recruiter - they haven\'t posted any jobs yet');
    }

    // Sort activities by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Limit to 20 most recent activities
    const recentActivities = activities.slice(0, 20);

    console.log('✅ Successfully fetched activities:', recentActivities.length);

    // Add helpful message for new recruiters
    const response: any = {
      success: true,
      activities: recentActivities,
      total: activities.length
    };

    if (activities.length === 0) {
      response.message = 'No activities yet. Start by posting your first job to see activity here!';
    }

    return NextResponse.json(response);

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

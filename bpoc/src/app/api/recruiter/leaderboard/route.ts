import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API called: GET /api/recruiter/leaderboard');
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const timeFilter = searchParams.get('timeFilter') || 'month';
    const categoryFilter = searchParams.get('categoryFilter') || 'overall';
    
    console.log('🔍 Filters:', { timeFilter, categoryFilter });

    // Calculate date range based on time filter
    let dateFilter = new Date();
    switch (timeFilter) {
      case 'week':
        dateFilter.setDate(dateFilter.getDate() - 7);
        break;
      case 'month':
        dateFilter.setMonth(dateFilter.getMonth() - 1);
        break;
      case 'quarter':
        dateFilter.setMonth(dateFilter.getMonth() - 3);
        break;
      case 'year':
        dateFilter.setFullYear(dateFilter.getFullYear() - 1);
        break;
    }

    // Get total active jobs count first
    const activeJobsCount = await (prisma as any).$queryRaw`
      SELECT COUNT(*) as count 
      FROM recruiter_jobs 
      WHERE status = 'active'
    `;
    const totalActiveJobs = parseInt(activeJobsCount[0]?.count || 0);

    // Fetch top applicants by number of applications submitted (same data as /recruiter/candidates)
    const topRecruiters = await (prisma as any).$queryRaw`
      SELECT 
        u.id,
        u.full_name,
        u.email,
        u.avatar_url,
        u.slug,
        u.company,
        u.location,
        u.position,
        u.bio,
        COUNT(ra.id) as total_applications,
        COUNT(DISTINCT ra.job_id) as unique_jobs_applied,
        COUNT(CASE WHEN ra.status = 'submitted' THEN 1 END) as pending_applications,
        COUNT(CASE WHEN ra.status = 'shortlisted' THEN 1 END) as shortlisted_applications,
        COUNT(CASE WHEN ra.status = 'interview' OR ra.status = 'final interview' THEN 1 END) as interview_applications,
        COUNT(CASE WHEN ra.status = 'hired' THEN 1 END) as hired_applications,
        MAX(ra.created_at) as last_application_date
      FROM users u
      JOIN recruiter_applications ra ON u.id = ra.user_id
      JOIN recruiter_jobs rj ON ra.job_id = rj.id
      WHERE ra.created_at >= ${dateFilter}
      GROUP BY u.id, u.full_name, u.email, u.avatar_url, u.slug, u.company, u.location, u.position, u.bio
      HAVING COUNT(ra.id) > 0
      ORDER BY total_applications DESC
      LIMIT 20
    `;

    // Fetch top companies by total applications
    const topCompanies = await (prisma as any).$queryRaw`
      SELECT 
        u.company,
        COUNT(rj.id) as total_jobs,
        SUM(rj.applicants) as total_applications,
        AVG(rj.applicants) as avg_applications_per_job,
        COUNT(CASE WHEN rj.status = 'active' THEN 1 END) as active_jobs,
        COUNT(DISTINCT u.id) as total_recruiters
      FROM users u
      JOIN recruiter_jobs rj ON u.id = rj.recruiter_id
      WHERE u.admin_level = 'recruiter'
        AND u.company IS NOT NULL
        AND rj.created_at >= ${dateFilter}
      GROUP BY u.company
      HAVING SUM(rj.applicants) > 0
      ORDER BY total_applications DESC
      LIMIT 20
    `;

    // Fetch most popular jobs
    const popularJobs = await (prisma as any).$queryRaw`
      SELECT 
        rj.job_title,
        rj.applicants,
        rj.views,
        rj.status,
        u.company,
        u.full_name as recruiter_name
      FROM recruiter_jobs rj
      JOIN users u ON rj.recruiter_id = u.id
      WHERE rj.created_at >= ${dateFilter}
        AND rj.applicants > 0
      ORDER BY rj.applicants DESC
      LIMIT 10
    `;

    console.log('🔍 Top applicants found:', topRecruiters.length);
    console.log('🔍 Top companies found:', topCompanies.length);
    console.log('🔍 Popular jobs found:', popularJobs.length);

    // Format the data for the frontend (now showing applicants - same structure as /recruiter/candidates)
    const formattedRecruiters = topRecruiters.map((applicant, index) => ({
      rank: index + 1,
      id: applicant.id,
      user: {
        full_name: applicant.full_name,
        email: applicant.email,
        avatar_url: applicant.avatar_url,
        slug: applicant.slug,
        location: applicant.location,
        position: applicant.position,
        bio: applicant.bio
      },
      company: applicant.company,
      score: parseInt(applicant.total_applications),
      total_applications: parseInt(applicant.total_applications),
      unique_jobs_applied: parseInt(applicant.unique_jobs_applied),
      active_jobs: totalActiveJobs, // Total active jobs in recruiter_jobs table
      pending_applications: parseInt(applicant.pending_applications),
      shortlisted_applications: parseInt(applicant.shortlisted_applications),
      interview_applications: parseInt(applicant.interview_applications),
      hired_applications: parseInt(applicant.hired_applications),
      last_application_date: applicant.last_application_date,
      change: '+0', // Could be calculated based on previous period
      changeType: 'up'
    }));

    const formattedCompanies = topCompanies.map((company, index) => ({
      rank: index + 1,
      company: company.company,
      score: parseInt(company.total_applications),
      total_applications: parseInt(company.total_applications),
      total_jobs: parseInt(company.total_jobs),
      active_jobs: parseInt(company.active_jobs),
      total_recruiters: parseInt(company.total_recruiters),
      avg_applications_per_job: parseFloat(company.avg_applications_per_job),
      change: '+0',
      changeType: 'up'
    }));

    const formattedJobs = popularJobs.map((job, index) => ({
      rank: index + 1,
      job_title: job.job_title,
      applicants: parseInt(job.applicants),
      views: parseInt(job.views),
      status: job.status,
      company: job.company,
      recruiter_name: job.recruiter_name
    }));

    return NextResponse.json({
      success: true,
      topRecruiters: formattedRecruiters,
      topCompanies: formattedCompanies,
      popularJobs: formattedJobs,
      timeFilter,
      categoryFilter
    });

  } catch (error) {
    console.error('❌ Error fetching leaderboard data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch leaderboard data',
      topRecruiters: [],
      topCompanies: [],
      popularJobs: []
    }, { status: 500 });
  }
}

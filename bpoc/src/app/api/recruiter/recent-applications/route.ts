import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Recruiter Recent Applications API: Starting to fetch recent recruiter applications...')
    
    // Get recruiter ID from headers (set by middleware)
    const recruiterId = request.headers.get('x-user-id');
    if (!recruiterId) {
      console.log('❌ No recruiter ID found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔍 Fetching applications for recruiter:', recruiterId);
    
    const client = await pool.connect()
    
    try {
      // Get only applications for jobs posted by this specific recruiter
      const activities = []
      
      // Fetch from recruiter_applications table (only for this recruiter's jobs)
      console.log('🔍 Fetching from recruiter_applications table for recruiter:', recruiterId)
      const recruiterApplicationQuery = `
        SELECT 
          'applicants' as type,
          u.full_name as user_name,
          u.avatar_url as user_avatar,
          'Applied for: ' || COALESCE(rj.job_title, 'Job Position') as action,
          NULL as score,
          ra.created_at as activity_time
        FROM recruiter_applications ra
        JOIN users u ON ra.user_id = u.id
        LEFT JOIN recruiter_jobs rj ON ra.job_id = rj.id
        WHERE rj.recruiter_id = $1
        ORDER BY ra.created_at DESC
        LIMIT 10
      `
      const recruiterApplicationResult = await client.query(recruiterApplicationQuery, [recruiterId])
      console.log('📝 Recruiter application activities found for this recruiter:', recruiterApplicationResult.rows.length)
      console.log('📝 Sample recruiter application data:', recruiterApplicationResult.rows.slice(0, 2))
      if (recruiterApplicationResult.rows.length > 0) {
        activities.push(...recruiterApplicationResult.rows)
      }
      
      // No fallback needed - if no applications, show empty state
      if (recruiterApplicationResult.rows.length === 0) {
        console.log('📝 No applications found for this recruiter - they haven\'t posted jobs yet or received applications')
      }
      
      // Sort all activities by time (most recent first)
      const recentActivity = activities.sort((a, b) => 
        new Date(b.activity_time).getTime() - new Date(a.activity_time).getTime()
      ).slice(0, 10) // Limit to 10 most recent activities
      
      console.log('🎯 Total recruiter activities found:', activities.length)
      console.log('📊 Final recent recruiter activities:', recentActivity.length)
      
      // Log sample activities for debugging
      console.log('🔍 Sample recruiter activities:', recentActivity.slice(0, 3).map(a => ({
        type: a.type,
        user_name: a.user_name,
        action: a.action,
        activity_time: a.activity_time
      })))
      
      // If no real data, return empty array (no sample data for new recruiters)
      if (recentActivity.length === 0) {
        console.log('📝 No applications found for this recruiter - showing empty state')
        return NextResponse.json({ 
          recent_activity: [],
          message: 'No applications yet. Post your first job to start receiving applications!'
        })
      }
      
      return NextResponse.json({ 
        recent_activity: recentActivity,
        message: 'Real recruiter application data found'
      })
      
    } finally {
      client.release()
    }
    
  } catch (error) {
    console.error('❌ Error getting recent recruiter applications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

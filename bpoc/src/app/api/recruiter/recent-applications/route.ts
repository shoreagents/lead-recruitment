import { NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET() {
  try {
    console.log('🚀 Recruiter Recent Applications API: Starting to fetch recent recruiter applications...')
    
    const client = await pool.connect()
    
    try {
      // Get only recruiter job applications
      const activities = []
      
      // Fetch from recruiter_applications table (recruiter jobs only)
      console.log('🔍 Fetching from recruiter_applications table...')
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
        ORDER BY ra.created_at DESC
        LIMIT 10
      `
      const recruiterApplicationResult = await client.query(recruiterApplicationQuery)
      console.log('📝 Recruiter application activities found:', recruiterApplicationResult.rows.length)
      console.log('📝 Sample recruiter application data:', recruiterApplicationResult.rows.slice(0, 2))
      if (recruiterApplicationResult.rows.length > 0) {
        activities.push(...recruiterApplicationResult.rows)
      }
      
      // Fallback: Simple query without JOINs if the above fails
      if (recruiterApplicationResult.rows.length === 0) {
        console.log('🔍 Trying fallback query for recruiter applications...')
        const recruiterFallbackQuery = `
          SELECT 
            'applicants' as type,
            u.full_name as user_name,
            u.avatar_url as user_avatar,
            'Applied for a recruiter job' as action,
            NULL as score,
            ra.created_at as activity_time
          FROM recruiter_applications ra
          JOIN users u ON ra.user_id = u.id
          ORDER BY ra.created_at DESC
          LIMIT 10
        `
        const recruiterFallbackResult = await client.query(recruiterFallbackQuery)
        console.log('📝 Fallback recruiter application activities found:', recruiterFallbackResult.rows.length)
        if (recruiterFallbackResult.rows.length > 0) {
          activities.push(...recruiterFallbackResult.rows)
        }
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
      
      // If no real data, provide sample recruiter application data
      if (recentActivity.length === 0) {
        console.log('⚠️ No recruiter application data found, providing sample recruiter application data...')
        const sampleData = [
          {
            user_name: 'John Doe',
            user_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            action: 'Applied for: Customer Service Representative',
            score: null,
            type: 'applicants',
            activity_time: new Date().toISOString()
          },
          {
            user_name: 'Jane Smith',
            user_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            action: 'Applied for: Technical Support Specialist',
            score: null,
            type: 'applicants',
            activity_time: new Date(Date.now() - 3600000).toISOString()
          },
          {
            user_name: 'Mike Johnson',
            user_avatar: null, // This one will show initials
            action: 'Applied for: Sales Representative',
            score: null,
            type: 'applicants',
            activity_time: new Date(Date.now() - 7200000).toISOString()
          },
          {
            user_name: 'Sarah Wilson',
            user_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            action: 'Applied for: Data Entry Specialist',
            score: null,
            type: 'applicants',
            activity_time: new Date(Date.now() - 10800000).toISOString()
          },
          {
            user_name: 'David Brown',
            user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            action: 'Applied for: Customer Service Representative',
            score: null,
            type: 'applicants',
            activity_time: new Date(Date.now() - 14400000).toISOString()
          }
        ]
        
        return NextResponse.json({ 
          recent_activity: sampleData,
          message: 'Using sample recruiter application data - no real recruiter applications found'
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

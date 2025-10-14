import { NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET() {
  try {
    console.log('🚀 Recent Activity API: Starting to fetch recent activity...')
    
    const client = await pool.connect()
    
    try {
      // Get only application activities
      const activities = []
      
      // 1. Fetch Job Applications from both tables (ONLY APPLICATIONS)
      try {
        console.log('🔍 Starting to fetch application activities...')
        
        // First, let's check if the tables exist and have data
        console.log('🔍 Checking if applications table exists...')
        try {
          const applicationsTableCheck = await client.query(`
            SELECT COUNT(*) as count FROM applications
          `)
          console.log('📊 Total applications in applications table:', applicationsTableCheck.rows[0]?.count)
        } catch (tableError) {
          console.log('⚠️ Applications table does not exist or error:', tableError.message)
        }
        
        // Show recent applications from applications table
        try {
          const recentApplicationsCheck = await client.query(`
            SELECT a.id, a.user_id, a.job_id, a.created_at, u.full_name
            FROM applications a
            JOIN users u ON a.user_id = u.id
            ORDER BY a.created_at DESC
            LIMIT 5
          `)
          console.log('📝 Recent applications from applications table:', recentApplicationsCheck.rows)
        } catch (recentError) {
          console.log('⚠️ Error fetching recent applications:', recentError.message)
        }
        
        console.log('🔍 Checking if recruiter_applications table exists...')
        try {
          const recruiterApplicationsTableCheck = await client.query(`
            SELECT COUNT(*) as count FROM recruiter_applications
          `)
          console.log('📊 Total applications in recruiter_applications table:', recruiterApplicationsTableCheck.rows[0]?.count)
        } catch (tableError) {
          console.log('⚠️ Recruiter_applications table does not exist or error:', tableError.message)
        }
        
        // Show recent applications from recruiter_applications table
        try {
          const recentRecruiterApplicationsCheck = await client.query(`
            SELECT ra.id, ra.user_id, ra.job_id, ra.created_at, u.full_name
            FROM recruiter_applications ra
            JOIN users u ON ra.user_id = u.id
            ORDER BY ra.created_at DESC
            LIMIT 5
          `)
          console.log('📝 Recent applications from recruiter_applications table:', recentRecruiterApplicationsCheck.rows)
        } catch (recentError) {
          console.log('⚠️ Error fetching recent recruiter applications:', recentError.message)
        }
        
        // Fetch from applications table (processed jobs)
        console.log('🔍 Fetching from applications table...')
        const applicationQuery = `
          SELECT 
            'applicants' as type,
            u.full_name as user_name,
            u.avatar_url as user_avatar,
            'Applied for: ' || COALESCE(pjr.job_title, 'Job Position') as action,
            NULL as score,
            a.created_at as activity_time
          FROM applications a
          JOIN users u ON a.user_id = u.id
          LEFT JOIN processed_job_requests pjr ON a.job_id = pjr.id
          ORDER BY a.created_at DESC
          LIMIT 5
        `
        const applicationResult = await client.query(applicationQuery)
        console.log('📝 Application activities found (applications table):', applicationResult.rows.length)
        console.log('📝 Sample application data:', applicationResult.rows.slice(0, 2))
        if (applicationResult.rows.length > 0) {
          activities.push(...applicationResult.rows)
        }
        
        // Fallback: Simple query without JOINs if the above fails
        if (applicationResult.rows.length === 0) {
          console.log('🔍 Trying fallback query for applications...')
          const fallbackQuery = `
            SELECT 
              'applicants' as type,
              u.full_name as user_name,
              u.avatar_url as user_avatar,
              'Applied for a job' as action,
              NULL as score,
              a.created_at as activity_time
            FROM applications a
            JOIN users u ON a.user_id = u.id
            ORDER BY a.created_at DESC
            LIMIT 5
          `
          const fallbackResult = await client.query(fallbackQuery)
          console.log('📝 Fallback application activities found:', fallbackResult.rows.length)
          if (fallbackResult.rows.length > 0) {
            activities.push(...fallbackResult.rows)
          }
        }
        
        // Fetch from recruiter_applications table (recruiter jobs)
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
          LIMIT 5
        `
        const recruiterApplicationResult = await client.query(recruiterApplicationQuery)
        console.log('📝 Application activities found (recruiter_applications table):', recruiterApplicationResult.rows.length)
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
            LIMIT 5
          `
          const recruiterFallbackResult = await client.query(recruiterFallbackQuery)
          console.log('📝 Fallback recruiter application activities found:', recruiterFallbackResult.rows.length)
          if (recruiterFallbackResult.rows.length > 0) {
            activities.push(...recruiterFallbackResult.rows)
          }
        }
      } catch (error) {
        console.log('⚠️ Error fetching application activities:', error)
        console.log('⚠️ Error details:', error.message)
        console.log('⚠️ Error stack:', error.stack)
      }
      
      
      // Sort all activities by time (most recent first)
      const recentActivity = activities.sort((a, b) => 
        new Date(b.activity_time).getTime() - new Date(a.activity_time).getTime()
      ).slice(0, 20) // Limit to 20 most recent activities
      
      console.log('🎯 Total activities found:', activities.length)
      console.log('📊 Final recent activities:', recentActivity.length)
      console.log('📋 Application activities breakdown:', {
        applications_table: activities.filter(a => a.type === 'applicants').length,
        recruiter_applications_table: activities.filter(a => a.type === 'applicants').length
      })
      
      // Log sample activities for debugging
      console.log('🔍 Sample activities:', recentActivity.slice(0, 3).map(a => ({
        type: a.type,
        user_name: a.user_name,
        action: a.action,
        activity_time: a.activity_time
      })))
      
      // If no real data, provide sample application data
      if (recentActivity.length === 0) {
        console.log('⚠️ No application data found, providing sample application data...')
        const sampleData = [
          {
            user_name: 'John Doe',
            user_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            action: 'Applied for: Frontend Developer',
            score: null,
            type: 'applicants',
            activity_time: new Date().toISOString()
          },
          {
            user_name: 'Jane Smith',
            user_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            action: 'Applied for: Software Engineer',
            score: null,
            type: 'applicants',
            activity_time: new Date(Date.now() - 3600000).toISOString()
          },
          {
            user_name: 'Mike Johnson',
            user_avatar: null, // This one will show initials
            action: 'Applied for: Data Analyst',
            score: null,
            type: 'applicants',
            activity_time: new Date(Date.now() - 7200000).toISOString()
          },
          {
            user_name: 'Sarah Wilson',
            user_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            action: 'Applied for: Marketing Specialist',
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
          message: 'Using sample application data - no real applications found'
        })
      }
      
      return NextResponse.json({ 
        recent_activity: recentActivity,
        message: 'Real application data found'
      })
      
    } finally {
      client.release()
    }
    
  } catch (error) {
    console.error('❌ Error getting recent activity:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

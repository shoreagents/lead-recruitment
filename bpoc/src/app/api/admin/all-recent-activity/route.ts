import { NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET() {
  try {
    console.log('🚀 All Recent Activity API: Starting to fetch ALL recent activity...')
    
    const client = await pool.connect()
    
    try {
      const activities = []
      
      // 1. Fetch Job Applications from both tables
      try {
        console.log('🔍 Starting to fetch application activities...')
        
        // Applications from applications table
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
          LIMIT 10
        `
        const applicationResult = await client.query(applicationQuery)
        console.log('📝 Application activities found (applications table):', applicationResult.rows.length)
        if (applicationResult.rows.length > 0) {
          activities.push(...applicationResult.rows)
        }
        
        // Applications from recruiter_applications table
        const recruiterApplicationQuery = `
          SELECT 
            'applicants' as type,
            u.full_name as user_name,
            u.avatar_url as user_avatar,
            'Applied for: ' || COALESCE(rj.job_title, 'Recruiter Job') as action,
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
        if (recruiterApplicationResult.rows.length > 0) {
          activities.push(...recruiterApplicationResult.rows)
        }
      } catch (error) {
        console.log('⚠️ Error fetching application activities:', error)
      }
      
      // 2. Fetch Typing Hero Activities
      try {
        console.log('🔍 Starting to fetch Typing Hero activities...')
        const typingHeroQuery = `
          SELECT 
            'game' as type,
            u.full_name as user_name,
            u.avatar_url as user_avatar,
            'Completed Typing Hero' as action,
            ths.wpm as score,
            ths.created_at as activity_time
          FROM typing_hero_sessions ths
          JOIN users u ON ths.user_id = u.id
          ORDER BY ths.created_at DESC
          LIMIT 10
        `
        const typingHeroResult = await client.query(typingHeroQuery)
        console.log('⌨️ Typing Hero activities found:', typingHeroResult.rows.length)
        if (typingHeroResult.rows.length > 0) {
          activities.push(...typingHeroResult.rows)
        }
      } catch (error) {
        console.log('⚠️ Error fetching Typing Hero activities:', error)
      }
      
      // 3. Fetch DISC Personality Activities
      try {
        console.log('🔍 Starting to fetch DISC Personality activities...')
        const discQuery = `
          SELECT 
            'game' as type,
            u.full_name as user_name,
            u.avatar_url as user_avatar,
            CASE 
              WHEN dps.d_score >= dps.i_score AND dps.d_score >= dps.s_score AND dps.d_score >= dps.c_score THEN 'Completed DISC Personality - D'
              WHEN dps.i_score >= dps.d_score AND dps.i_score >= dps.s_score AND dps.i_score >= dps.c_score THEN 'Completed DISC Personality - I'
              WHEN dps.s_score >= dps.d_score AND dps.s_score >= dps.i_score AND dps.s_score >= dps.c_score THEN 'Completed DISC Personality - S'
              WHEN dps.c_score >= dps.d_score AND dps.c_score >= dps.i_score AND dps.c_score >= dps.s_score THEN 'Completed DISC Personality - C'
              ELSE 'Completed DISC Personality'
            END as action,
            NULL as score,
            dps.created_at as activity_time
          FROM disc_personality_sessions dps
          JOIN users u ON dps.user_id = u.id
          WHERE dps.finished_at IS NOT NULL
          ORDER BY dps.created_at DESC
          LIMIT 10
        `
        const discResult = await client.query(discQuery)
        console.log('🧠 DISC Personality activities found:', discResult.rows.length)
        if (discResult.rows.length > 0) {
          activities.push(...discResult.rows)
        }
      } catch (error) {
        console.log('⚠️ Error fetching DISC Personality activities:', error)
      }
      
      // 4. Fetch Ultimate Game Activities
      try {
        console.log('🔍 Starting to fetch Ultimate Game activities...')
        const ultimateQuery = `
          SELECT 
            'game' as type,
            u.full_name as user_name,
            u.avatar_url as user_avatar,
            'Completed Ultimate Game' as action,
            us.total_score as score,
            us.created_at as activity_time
          FROM ultimate_sessions us
          JOIN users u ON us.user_id = u.id
          WHERE us.finished_at IS NOT NULL
          ORDER BY us.created_at DESC
          LIMIT 10
        `
        const ultimateResult = await client.query(ultimateQuery)
        console.log('🎮 Ultimate Game activities found:', ultimateResult.rows.length)
        if (ultimateResult.rows.length > 0) {
          activities.push(...ultimateResult.rows)
        }
      } catch (error) {
        console.log('⚠️ Error fetching Ultimate Game activities:', error)
      }
      
      // 5. Fetch BPOC Cultural Activities
      try {
        console.log('🔍 Starting to fetch BPOC Cultural activities...')
        const culturalQuery = `
          SELECT 
            'game' as type,
            u.full_name as user_name,
            u.avatar_url as user_avatar,
            'Completed BPOC Cultural Assessment' as action,
            bcs.total_score as score,
            bcs.created_at as activity_time
          FROM bpoc_cultural_sessions bcs
          JOIN users u ON bcs.user_id = u.id
          WHERE bcs.finished_at IS NOT NULL
          ORDER BY bcs.created_at DESC
          LIMIT 10
        `
        const culturalResult = await client.query(culturalQuery)
        console.log('🏛️ BPOC Cultural activities found:', culturalResult.rows.length)
        if (culturalResult.rows.length > 0) {
          activities.push(...culturalResult.rows)
        }
      } catch (error) {
        console.log('⚠️ Error fetching BPOC Cultural activities:', error)
      }
      
      // 6. Fetch Resume Upload Activities
      try {
        console.log('🔍 Starting to fetch Resume Upload activities...')
        const resumeQuery = `
          SELECT 
            'resume' as type,
            u.full_name as user_name,
            u.avatar_url as user_avatar,
            'Uploaded Resume' as action,
            NULL as score,
            sr.created_at as activity_time
          FROM saved_resumes sr
          JOIN users u ON sr.user_id = u.id
          ORDER BY sr.created_at DESC
          LIMIT 10
        `
        const resumeResult = await client.query(resumeQuery)
        console.log('📄 Resume upload activities found:', resumeResult.rows.length)
        if (resumeResult.rows.length > 0) {
          activities.push(...resumeResult.rows)
        }
      } catch (error) {
        console.log('⚠️ Error fetching Resume Upload activities:', error)
      }
      
      // 5. Fetch Profile Update Activities
      try {
        console.log('🔍 Starting to fetch Profile Update activities...')
        const profileQuery = `
          SELECT 
            'profile' as type,
            u.full_name as user_name,
            u.avatar_url as user_avatar,
            'Updated Profile' as action,
            NULL as score,
            u.updated_at as activity_time
          FROM users u
          WHERE u.updated_at > u.created_at
          ORDER BY u.updated_at DESC
          LIMIT 10
        `
        const profileResult = await client.query(profileQuery)
        console.log('👤 Profile update activities found:', profileResult.rows.length)
        if (profileResult.rows.length > 0) {
          activities.push(...profileResult.rows)
        }
      } catch (error) {
        console.log('⚠️ Error fetching Profile Update activities:', error)
      }
      
      // Sort all activities by time (most recent first)
      const recentActivity = activities.sort((a, b) => 
        new Date(b.activity_time).getTime() - new Date(a.activity_time).getTime()
      ).slice(0, 20) // Limit to 20 most recent activities
      
      console.log('🎯 Total activities found:', activities.length)
      console.log('📊 Final recent activities:', recentActivity.length)
      
      // If no real data, provide sample data with all activity types
      if (recentActivity.length === 0) {
        console.log('⚠️ No real activity data found, providing sample data...')
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
            action: 'Completed Typing Hero',
            score: 85,
            type: 'game',
            activity_time: new Date(Date.now() - 3600000).toISOString()
          },
          {
            user_name: 'Mike Johnson',
            user_avatar: null,
            action: 'Completed DISC Personality - S',
            score: null,
            type: 'game',
            activity_time: new Date(Date.now() - 7200000).toISOString()
          },
          {
            user_name: 'Sarah Wilson',
            user_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            action: 'Uploaded Resume',
            score: null,
            type: 'resume',
            activity_time: new Date(Date.now() - 10800000).toISOString()
          },
          {
            user_name: 'David Brown',
            user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            action: 'Updated Profile',
            score: null,
            type: 'profile',
            activity_time: new Date(Date.now() - 14400000).toISOString()
          }
        ]
        
        return NextResponse.json({ 
          recent_activity: sampleData,
          message: 'Using sample data - no real activities found'
        })
      }
      
      return NextResponse.json({ 
        recent_activity: recentActivity,
        message: 'Real activity data found'
      })
      
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Error in All Recent Activity API:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch recent activity',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

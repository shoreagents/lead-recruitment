import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Starting talent search API...')
    
    // Get filter parameter from query string
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'
    console.log('📊 Filter requested:', filter)
    
    // Query for all users (filtering will be applied later)
    const allUsersQuery = `
      SELECT 
        u.id,
        u.full_name,
        u.position,
        u.email,
        u.avatar_url,
        u.created_at,
        u.location,
        u.completed_data,
        u.slug,
        COALESCE(los.overall_score, 0) as overall_score,
        CASE WHEN sr.id IS NOT NULL THEN true ELSE false END as has_resume,
        CASE WHEN uws.completed_data IS NOT NULL THEN uws.completed_data ELSE false END as work_status_completed,
        sr.resume_slug,
        CASE WHEN sr.id IS NOT NULL THEN 1 ELSE 0 END as resume_score,
        CASE WHEN ths.id IS NOT NULL THEN true ELSE false END as has_typing_hero,
        CASE WHEN dps.id IS NOT NULL THEN true ELSE false END as has_disc_personality
      FROM users u
      LEFT JOIN user_leaderboard_scores los ON u.id = los.user_id
      LEFT JOIN saved_resumes sr ON u.id = sr.user_id
      LEFT JOIN user_work_status uws ON u.id = uws.user_id
      LEFT JOIN typing_hero_stats ths ON u.id = ths.user_id
      LEFT JOIN disc_personality_stats dps ON u.id = dps.user_id
      WHERE u.full_name IS NOT NULL 
        AND u.full_name != ''
        AND u.slug IS NOT NULL
        AND u.slug != ''
      ORDER BY COALESCE(los.overall_score, 0) DESC, u.created_at DESC
      LIMIT 100
    `
    
    console.log('Executing all users query...')
    let result
    try {
      result = await pool.query(allUsersQuery)
      console.log('✅ All users query result:', result.rows.length, 'users found')
    } catch (queryError) {
      console.error('❌ High-score query failed:', queryError)
      // Fallback to basic query if leaderboard table doesn't exist
      console.log('🔄 Falling back to basic query...')
      const fallbackQuery = `
        SELECT 
          u.id,
          u.full_name,
          u.position,
          u.email,
          u.avatar_url,
          u.created_at,
          u.location,
          u.completed_data,
          u.slug,
          0 as overall_score,
          false as has_resume,
          false as work_status_completed,
          null as resume_slug,
          0 as resume_score,
          false as has_typing_hero,
          false as has_disc_personality
        FROM users u
        WHERE u.full_name IS NOT NULL 
          AND u.full_name != ''
          AND u.slug IS NOT NULL
          AND u.slug != ''
        ORDER BY u.created_at DESC
        LIMIT 100
      `
      result = await pool.query(fallbackQuery)
      console.log('✅ Fallback query result:', result.rows.length, 'users found')
    }
    
    if (result.rows.length === 0) {
      console.log('⚠️ No users found with basic profile data, returning empty result')
      return NextResponse.json({ 
        success: true, 
        candidates: [],
        total: 0,
        message: 'No users found with basic profile data'
      })
    }
    
    // Map to candidate format with proper verification logic
    const candidates = result.rows
      .map(row => {
        // Calculate profile completion (5 steps)
        const hasPersonalData = row.completed_data === true;
        const hasWorkStatusData = row.work_status_completed === true;
        const hasResume = row.resume_score !== undefined && row.resume_score > 0;
        const hasTypingHero = row.has_typing_hero === true;
        const hasDisc = row.has_disc_personality === true;
        const completedSteps = [hasPersonalData, hasWorkStatusData, hasResume, hasTypingHero, hasDisc].filter(Boolean).length;
        const isFullyVerified = completedSteps === 5; // 100% completion
        const isHighlyQualified = completedSteps >= 4; // 80% completion (4/5 steps)
        
        console.log(`🔍 User ${row.full_name}: Score=${row.overall_score}, Personal=${hasPersonalData}, Work=${hasWorkStatusData}, Resume=${hasResume}, Typing=${hasTypingHero}, DISC=${hasDisc} -> Steps=${completedSteps}/5 -> FullyVerified=${isFullyVerified}`);
        
        return {
          id: row.id,
          name: row.full_name,
          position: row.position || 'Position not specified',
          email: row.email,
          avatar: row.avatar_url ? row.avatar_url : row.full_name.split(' ').map(n => n[0]).join('').toUpperCase(),
          joinDate: new Date(row.created_at).toLocaleDateString(),
          location: row.location || 'Location not specified',
          overallScore: Math.round(row.overall_score || 0),
          resumeAvailable: row.has_resume || false,
          profileComplete: row.completed_data && (row.work_status_completed || false),
          verified: isFullyVerified, // Only true if 100% complete
          completedSteps: completedSteps, // Add completion steps count
          isHighlyQualified: isHighlyQualified, // 80% completion
          slug: row.slug,
          resumeSlug: row.resume_slug || null
        }
      })
      .filter(candidate => {
        // Apply filtering based on the filter parameter
        const hasHighScore = candidate.overallScore > 50;
        const isHighlyQualified = candidate.isHighlyQualified; // 4/5 steps completed
        const isFullyVerified = candidate.verified; // 5/5 steps completed
        
        let qualifies = false;
        
        switch (filter) {
          case 'highest-scores':
            // Only users with high scores (regardless of completion)
            qualifies = hasHighScore;
            break;
          case 'verified':
            // Only users with 100% profile completion
            qualifies = isFullyVerified;
            break;
          case 'all':
          default:
            // Users with high scores AND high profile completion (4/5 steps = 80%)
            qualifies = hasHighScore && isHighlyQualified;
            break;
        }
        
        if (!qualifies) {
          console.log('❌ Filtering out user:', candidate.name, 'score:', candidate.overallScore, 'completedSteps:', candidate.completedSteps, 'filter:', filter, 'reason:', !hasHighScore ? 'low score' : !isFullyVerified ? 'insufficient profile completion' : 'filter criteria not met')
        } else {
          console.log('✅ Keeping user:', candidate.name, 'score:', candidate.overallScore, 'completedSteps:', candidate.completedSteps, 'filter:', filter)
        }
        return qualifies
      })
    
    console.log('✅ Returning', candidates.length, 'candidates to frontend')
    
    return NextResponse.json({ 
      success: true, 
      candidates,
      total: candidates.length
    })

  } catch (error) {
    console.error('Error fetching talent search data:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch talent data',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

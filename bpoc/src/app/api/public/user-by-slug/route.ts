import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const viewerUserId = searchParams.get('viewerUserId') // Optional - if provided, check if viewing own profile
    
    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      // Get user data
      const res = await client.query(
        `SELECT u.id, u.email, u.first_name, u.last_name, u.full_name, u.location, u.avatar_url, u.phone, u.bio, u.position, u.gender, u.gender_custom, u.birthday, u.created_at, u.updated_at, u.slug, u.username, u.completed_data,
         aar.overall_score as resume_score, aar.key_strengths, aar.strengths_analysis, aar.ats_compatibility_score, aar.content_quality_score, aar.professional_presentation_score, aar.skills_alignment_score,
         aar.improvements, aar.recommendations, aar.improved_summary, aar.salary_analysis, aar.career_path, aar.section_analysis,
         uws.current_employer, uws.current_position, uws.current_salary, uws.notice_period_days, uws.current_mood, uws.work_status, uws.preferred_shift, uws.expected_salary, uws.work_setup, uws.completed_data as work_status_completed_data
         FROM users u
         LEFT JOIN ai_analysis_results aar ON u.id = aar.user_id
         LEFT JOIN user_work_status uws ON u.id = uws.user_id
         WHERE u.slug = $1 LIMIT 1`,
        [slug]
      )

      if (res.rowCount === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const user = res.rows[0]
      const isOwner = viewerUserId && viewerUserId === user.id

      // Get privacy settings
      const privacyRes = await client.query(
        'SELECT * FROM privacy_settings WHERE user_id = $1',
        [user.id]
      )

      const privacySettings = privacyRes.rowCount > 0 ? privacyRes.rows[0] : {
        username: 'public',
        first_name: 'public',
        last_name: 'only-me',
        location: 'public',
        job_title: 'public',
        birthday: 'only-me',
        age: 'only-me',
        gender: 'only-me',
        member_since: 'public',
        resume_score: 'public',
        games_completed: 'public',
        key_strengths: 'only-me'
      }

      // Filter data based on privacy settings
      const filteredUser = { ...user }

      // Apply privacy filters (only if not owner)
      if (!isOwner) {
        // Personal information
        if (privacySettings.first_name === 'only-me') {
          delete filteredUser.first_name
        }
        if (privacySettings.last_name === 'only-me') {
          delete filteredUser.last_name
          delete filteredUser.full_name
        }
        if (privacySettings.location === 'only-me') {
          delete filteredUser.location
        }
        if (privacySettings.birthday === 'only-me') {
          delete filteredUser.birthday
        }
        if (privacySettings.gender === 'only-me') {
          delete filteredUser.gender
          delete filteredUser.gender_custom
        }

        // Member Since information
        if (privacySettings.member_since === 'only-me') {
          delete filteredUser.created_at
        }

        // Work information
        if (privacySettings.job_title === 'only-me') {
          delete filteredUser.position
        }

        // Analysis information
        if (privacySettings.resume_score === 'only-me') {
          delete filteredUser.resume_score
          delete filteredUser.ats_compatibility_score
          delete filteredUser.content_quality_score
          delete filteredUser.professional_presentation_score
          delete filteredUser.skills_alignment_score
        }
        if (privacySettings.key_strengths === 'only-me') {
          delete filteredUser.key_strengths
          delete filteredUser.strengths_analysis
        }

        // Always hide private fields for non-owners
        delete filteredUser.email
        delete filteredUser.phone
        delete filteredUser.current_salary
      }

      // Get game completion data - only if user exists
      let completedGames = 0
      try {
        const gameCompletionRes = await client.query(
          `SELECT 
            (SELECT COUNT(*) FROM bpoc_cultural_sessions WHERE user_id = $1) +
            (SELECT COUNT(*) FROM disc_personality_sessions WHERE user_id = $1) +
            (SELECT COUNT(*) FROM typing_hero_sessions WHERE user_id = $1) +
            (SELECT COUNT(*) FROM ultimate_sessions WHERE user_id = $1) as total_sessions`,
          [user.id]
        )
        
        // We'll calculate completed games after we fetch the game stats data
        // to use the exact same logic as the profile completion card
        completedGames = 0
      } catch (gameError) {
        console.log('Game sessions tables might not exist:', gameError)
        completedGames = 0
      }

      const totalGames = 2

      // Get game stats data
      let gameStats = {
        bpoc_cultural_stats: null,
        disc_personality_stats: null,
        typing_hero_stats: null,
        ultimate_stats: null
      }

      try {
        // Only fetch game stats if user is owner or games are public
        if (isOwner || privacySettings.games_completed === 'public') {
          // Fetch BPOC Cultural Stats
          const bpocStatsRes = await client.query(
            'SELECT * FROM bpoc_cultural_stats WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
            [user.id]
          )
          gameStats.bpoc_cultural_stats = bpocStatsRes.rows[0] || null

          // Fetch DISC Personality Stats
          const discStatsRes = await client.query(
            'SELECT * FROM disc_personality_stats WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
            [user.id]
          )
          const ds = discStatsRes.rows[0] || null
          if (ds) {
            // Normalize stats so frontend always receives consistent keys
            gameStats.disc_personality_stats = {
              // Scores
              d: ds.latest_d_score ?? ds.d ?? 0,
              i: ds.latest_i_score ?? ds.i ?? 0,
              s: ds.latest_s_score ?? ds.s ?? 0,
              c: ds.latest_c_score ?? ds.c ?? 0,
              // Types
              primary_type: ds.latest_primary_type ?? ds.primary_style ?? null,
              secondary_type: ds.latest_secondary_type ?? ds.secondary_style ?? null,
              // Session/quality
              confidence: ds.best_confidence_score ?? ds.consistency_index ?? null,
              cultural_alignment: ds.cultural_alignment_score ?? null,
              average_completion_time: ds.average_completion_time ?? null,
              last_taken_at: ds.last_taken_at ?? null,
              // XP/badges
              total_xp: ds.total_xp ?? null,
              latest_session_xp: ds.latest_session_xp ?? null,
              badges_earned: ds.badges_earned ?? null,
              // AI content
              latest_ai_assessment: ds.latest_ai_assessment ?? null,
              latest_bpo_roles: ds.latest_bpo_roles ?? null,
            }
          } else {
            gameStats.disc_personality_stats = null
          }

          // Fetch Typing Hero Stats
          const typingStatsRes = await client.query(
            'SELECT * FROM typing_hero_stats WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
            [user.id]
          )
          gameStats.typing_hero_stats = typingStatsRes.rows[0] || null

          // Fetch Ultimate Stats
          const ultimateStatsRes = await client.query(
            'SELECT * FROM ultimate_stats WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
            [user.id]
          )
          gameStats.ultimate_stats = ultimateStatsRes.rows[0] || null

          // Fetch BPOC Cultural Results
          const bpocResultsRes = await client.query(
            'SELECT result_json FROM bpoc_cultural_results WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
            [user.id]
          )
          gameStats.bpoc_cultural_results = bpocResultsRes.rows[0]?.result_json || null
        }
      } catch (gameStatsError) {
        console.log('Game stats tables might not exist:', gameStatsError)
      }

      // Calculate completed games using the exact same logic as profile completion card
      if (!isOwner && privacySettings.games_completed === 'only-me') {
        completedGames = 0 // Hide the count
      } else {
        // Use the same logic as profile completion card
        let gamesCompleted = 0
        
        // Check Typing Hero (same logic as profile completion card)
        if (gameStats.typing_hero_stats && 
            (gameStats.typing_hero_stats.best_wpm > 0 || gameStats.typing_hero_stats.latest_wpm > 0)) {
          gamesCompleted++
        }
        
        // Check DISC Personality (same logic as profile completion card)
        if (gameStats.disc_personality_stats && 
            (gameStats.disc_personality_stats.primary_type || gameStats.disc_personality_stats.latest_primary_type)) {
          gamesCompleted++
        }
        
        completedGames = gamesCompleted
      }

      return NextResponse.json({ 
        user: {
          ...filteredUser,
          completed_games: completedGames,
          total_games: totalGames,
          game_stats: gameStats,
          is_owner: isOwner
        }
      })

    } finally {
      client.release()
    }

  } catch (e) {
    console.error('Error in user-by-slug:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



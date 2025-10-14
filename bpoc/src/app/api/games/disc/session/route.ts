import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

// Save DISC personality session data to existing schema tables
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('💾 Saving DISC session for user:', userId)
    console.log('📊 Received data keys:', Object.keys(body))
    console.log('📋 Core responses count:', body.coreResponses?.length || 0)
    console.log('🤖 AI assessment length:', body.aiAssessment?.length || 0)
    console.log('💼 BPO roles count:', body.aiBpoRoles?.length || 0)

    const {
      sessionStartTime,
      sessionData,
      coreResponses,
      coreScores,
      personalizedResponses,
      personalizedQuestions,
      finalResults,
      aiAssessment,
      aiBpoRoles,
      userContext
    } = body || {}

    // Calculate session duration
    const startTime = sessionStartTime ? new Date(sessionStartTime) : new Date()
    const endTime = new Date()
    const durationSeconds = Math.max(0, Math.floor((endTime.getTime() - startTime.getTime()) / 1000))
    
    console.log('⏱️ Session timing:', {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      durationSeconds
    })

    // Prepare session data for NEW schema (as discovered at runtime)
    const safeScores = {
      D: Math.max(0, Math.min(100, Math.round(finalResults?.scores?.D || coreScores?.D || 0))),
      I: Math.max(0, Math.min(100, Math.round(finalResults?.scores?.I || coreScores?.I || 0))),
      S: Math.max(0, Math.min(100, Math.round(finalResults?.scores?.S || coreScores?.S || 0))),
      C: Math.max(0, Math.min(100, Math.round(finalResults?.scores?.C || coreScores?.C || 0)))
    }

    const pickPrimary = () => {
      if (finalResults?.primaryType && ['D','I','S','C'].includes(finalResults.primaryType)) return finalResults.primaryType
      const entries = Object.entries(safeScores).sort((a,b) => (b[1] as number) - (a[1] as number))
      return (entries[0]?.[0] as 'D'|'I'|'S'|'C') || 'D'
    }
    const pickSecondary = () => {
      if (finalResults?.secondaryType && ['D','I','S','C'].includes(finalResults.secondaryType)) return finalResults.secondaryType
      const entries = Object.entries(safeScores).sort((a,b) => (b[1] as number) - (a[1] as number))
      return (entries[1]?.[0] as 'D'|'I'|'S'|'C') || null
    }

    const sessionInsert = {
      user_id: userId,
      started_at: startTime.toISOString(),
      finished_at: endTime.toISOString(),
      duration_seconds: durationSeconds,
      total_questions: (coreResponses?.length || 30) + (personalizedResponses?.length || 0),

      // Core DISC scores (new schema field names)
      d_score: safeScores.D,
      i_score: safeScores.I,
      s_score: safeScores.S,
      c_score: safeScores.C,

      // Primary/Secondary types (primary_type is NOT NULL per schema)
      primary_type: pickPrimary(),
      secondary_type: pickSecondary(),

      // Assessment quality
      confidence_score: Math.round(finalResults?.confidence || 85),
      cultural_alignment: Math.round(finalResults?.culturalAlignment || 95),
      consistency_index: finalResults?.consistency || null,

      // AI content and response data (JSONB)
      ai_assessment: aiAssessment ? { text: aiAssessment, generated_at: new Date().toISOString() } : {},
      ai_bpo_roles: Array.isArray(aiBpoRoles) ? aiBpoRoles : [],
      core_responses: Array.isArray(coreResponses) ? coreResponses : [],
      personalized_responses: Array.isArray(personalizedResponses) ? personalizedResponses : [],
      response_patterns: {
        total_responses: (coreResponses?.length || 0) + (personalizedResponses?.length || 0),
        avg_response_time: coreResponses?.length > 0 ? 
          Math.round(coreResponses.reduce((sum: number, r: any) => sum + (r.responseTime || 0), 0) / coreResponses.length) : 0,
        consistency_score: finalResults?.confidence || 85
      },

      // User context
      user_position: userContext?.position || null,
      user_location: userContext?.location || null,
      user_experience: userContext?.bio || null,

      session_status: 'completed'
    }

    console.log('📝 Session data prepared (new schema):', {
      scores: { D: sessionInsert.d_score, I: sessionInsert.i_score, S: sessionInsert.s_score, C: sessionInsert.c_score },
      primary_type: sessionInsert.primary_type,
      secondary_type: sessionInsert.secondary_type,
      duration_seconds: sessionInsert.duration_seconds,
      total_questions: sessionInsert.total_questions,
      ai: { hasAssessment: !!aiAssessment, rolesCount: Array.isArray(aiBpoRoles) ? aiBpoRoles.length : 0 }
    })

    // Check database connection
    if (!pool) {
      console.error('❌ Database pool not available')
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 })
    }

    const client = await pool.connect()
    try {
      console.log('✅ Database connection established')
      
      // Insert session record using NEW schema columns
      const sessionQuery = `
        INSERT INTO disc_personality_sessions (
          user_id, started_at, finished_at, duration_seconds, total_questions,
          d_score, i_score, s_score, c_score, primary_type, secondary_type,
          confidence_score, cultural_alignment, consistency_index,
          ai_assessment, ai_bpo_roles, core_responses, personalized_responses,
          response_patterns, user_position, user_location, user_experience, session_status
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10, $11,
          $12, $13, $14,
          $15, $16, $17, $18,
          $19, $20, $21, $22, $23
        ) RETURNING id
      `

      const sessionResult = await client.query(sessionQuery, [
        sessionInsert.user_id, sessionInsert.started_at, sessionInsert.finished_at, sessionInsert.duration_seconds, sessionInsert.total_questions,
        sessionInsert.d_score, sessionInsert.i_score, sessionInsert.s_score, sessionInsert.c_score, sessionInsert.primary_type, sessionInsert.secondary_type,
        sessionInsert.confidence_score, sessionInsert.cultural_alignment, sessionInsert.consistency_index,
        JSON.stringify(sessionInsert.ai_assessment), JSON.stringify(sessionInsert.ai_bpo_roles), JSON.stringify(sessionInsert.core_responses), JSON.stringify(sessionInsert.personalized_responses),
        JSON.stringify(sessionInsert.response_patterns), sessionInsert.user_position, sessionInsert.user_location, sessionInsert.user_experience, sessionInsert.session_status
      ])

      const sessionId = sessionResult.rows[0].id
      console.log('✅ DISC session saved with ID:', sessionId)
      console.log('💾 Session record inserted successfully')

      // === Update aggregated stats table ===
      try {
        // Prepare response aggregates
        let totalXp: number | null = null
        let latestSessionXp: number | null = null
        let badgesEarned: number | null = null

        const statsColsRes = await client.query(
          `SELECT column_name FROM information_schema.columns WHERE table_name = 'disc_personality_stats'`
        )
        const statsCols = new Set((statsColsRes.rows || []).map((r: any) => r.column_name))
        console.log('📋 Available columns in disc_personality_stats:', Array.from(statsCols))

        const isNewStatsSchema = statsCols.has('latest_d_score')

        // Fetch existing row (works for both schemas)
        const existingStatsRes = await client.query(
          `SELECT * FROM disc_personality_stats WHERE user_id = $1 LIMIT 1`,
          [sessionInsert.user_id]
        )
        const existingStats = existingStatsRes.rows?.[0]

          if (isNewStatsSchema) {
          // Compute session XP (overwrite strategy)
          const sessionXP = Math.round(
            (sessionInsert.confidence_score * 2) +
            (sessionInsert.cultural_alignment * 1.5) +
            (sessionInsert.total_questions * 5) +
            (sessionInsert.duration_seconds < 600 ? 50 : 0)
          )

          // UPSERT to overwrite latest values and increment counters atomically
          await client.query(
            `INSERT INTO disc_personality_stats (
               user_id, total_sessions, completed_sessions, last_taken_at,
               latest_d_score, latest_i_score, latest_s_score, latest_c_score,
               latest_primary_type, latest_secondary_type, best_confidence_score,
               average_completion_time, latest_ai_assessment, latest_bpo_roles,
               cultural_alignment_score, authenticity_score, latest_session_xp,
               total_xp, badges_earned
             ) VALUES (
               $1, 1, 1, $2,
               $3, $4, $5, $6,
               $7, $8, $9,
               $10, $11, $12,
               $13, $14, $15,
               $16, $17
             )
             ON CONFLICT (user_id) DO UPDATE SET
               total_sessions = disc_personality_stats.total_sessions + 1,
               completed_sessions = disc_personality_stats.completed_sessions + 1,
               last_taken_at = EXCLUDED.last_taken_at,
               latest_d_score = EXCLUDED.latest_d_score,
               latest_i_score = EXCLUDED.latest_i_score,
               latest_s_score = EXCLUDED.latest_s_score,
               latest_c_score = EXCLUDED.latest_c_score,
               latest_primary_type = EXCLUDED.latest_primary_type,
               latest_secondary_type = EXCLUDED.latest_secondary_type,
               best_confidence_score = EXCLUDED.best_confidence_score,
               average_completion_time = CASE 
                 WHEN disc_personality_stats.completed_sessions > 0 THEN ROUND(((disc_personality_stats.average_completion_time * disc_personality_stats.completed_sessions) + EXCLUDED.average_completion_time)::numeric / (disc_personality_stats.completed_sessions + 1))::int
                 ELSE EXCLUDED.average_completion_time
               END,
               latest_ai_assessment = EXCLUDED.latest_ai_assessment,
               latest_bpo_roles = EXCLUDED.latest_bpo_roles,
               cultural_alignment_score = EXCLUDED.cultural_alignment_score,
               authenticity_score = EXCLUDED.authenticity_score,
              latest_session_xp = EXCLUDED.latest_session_xp,
              total_xp = COALESCE(disc_personality_stats.total_xp, 0) + EXCLUDED.latest_session_xp,
              badges_earned = COALESCE(disc_personality_stats.badges_earned, 0) + (CASE WHEN EXCLUDED.best_confidence_score >= 85 THEN 1 ELSE 0 END),
               updated_at = NOW()`,
            [
              sessionInsert.user_id,
              sessionInsert.finished_at,
              sessionInsert.d_score,
              sessionInsert.i_score,
              sessionInsert.s_score,
              sessionInsert.c_score,
              sessionInsert.primary_type,
              sessionInsert.secondary_type,
              sessionInsert.confidence_score,
              sessionInsert.duration_seconds,
              (sessionInsert.ai_assessment as any)?.text || null,
              JSON.stringify(sessionInsert.ai_bpo_roles),
              sessionInsert.cultural_alignment,
              finalResults?.authenticity ? Math.round(finalResults.authenticity) : null,
              sessionXP,
              sessionXP,
              sessionInsert.confidence_score >= 85 ? 1 : 0
            ]
          );
          console.log('✅ Upserted disc_personality_stats (new schema)')

          // Read back cumulative values for response
          const agg = await client.query(
            `SELECT total_xp, latest_session_xp, badges_earned FROM disc_personality_stats WHERE user_id = $1 LIMIT 1`,
            [sessionInsert.user_id]
          )
          if (agg.rows?.[0]) {
            totalXp = agg.rows[0].total_xp ?? null
            latestSessionXp = agg.rows[0].latest_session_xp ?? null
            badgesEarned = agg.rows[0].badges_earned ?? null
          }
        } else {
          // Old stats schema with d/i/s/c and *_style and JSONB
          if (existingStats) {
            await client.query(
              `UPDATE disc_personality_stats SET
                 last_taken_at = $2,
                 d = $3,
                 i = $4,
                 s = $5,
                 c = $6,
                 primary_style = $7,
                 secondary_style = $8,
                 consistency_index = $9,
                 strengths = $10,
                 blind_spots = $11,
                 preferred_env = $12,
                 updated_at = NOW()
               WHERE user_id = $1`,
              [
                sessionInsert.user_id,
                sessionInsert.finished_at,
                sessionInsert.d_score,
                sessionInsert.i_score,
                sessionInsert.s_score,
                sessionInsert.c_score,
                sessionInsert.primary_type,
                sessionInsert.secondary_type,
                sessionInsert.consistency_index,
                JSON.stringify(sessionInsert.ai_bpo_roles),
                JSON.stringify(sessionInsert.core_responses),
                JSON.stringify({
                  ai_assessment: sessionInsert.ai_assessment,
                  personalized_responses: sessionInsert.personalized_responses,
                  response_patterns: sessionInsert.response_patterns,
                  user_context: {
                    position: sessionInsert.user_position,
                    location: sessionInsert.user_location,
                    bio: sessionInsert.user_experience
                  }
                })
              ]
            )
          } else {
            await client.query(
              `INSERT INTO disc_personality_stats (
                 user_id, last_taken_at, d, i, s, c,
                 primary_style, secondary_style, consistency_index,
                 strengths, blind_spots, preferred_env, created_at, updated_at
               ) VALUES (
                 $1, $2, $3, $4, $5, $6,
                 $7, $8, $9,
                 $10, $11, $12, NOW(), NOW()
               )`,
              [
                sessionInsert.user_id,
                sessionInsert.finished_at,
                sessionInsert.d_score,
                sessionInsert.i_score,
                sessionInsert.s_score,
                sessionInsert.c_score,
                sessionInsert.primary_type,
                sessionInsert.secondary_type,
                sessionInsert.consistency_index,
                JSON.stringify(sessionInsert.ai_bpo_roles),
                JSON.stringify(sessionInsert.core_responses),
                JSON.stringify({
                  ai_assessment: sessionInsert.ai_assessment,
                  personalized_responses: sessionInsert.personalized_responses,
                  response_patterns: sessionInsert.response_patterns,
                  user_context: {
                    position: sessionInsert.user_position,
                    location: sessionInsert.user_location,
                    bio: sessionInsert.user_experience
                  }
                })
              ]
            )
          }
          console.log('✅ Updated disc_personality_stats (old schema)')
        }
      } catch (statsError) {
        console.error('⚠️ Failed to update disc_personality_stats:', statsError)
        // Do not fail the whole request; session was saved successfully
      }

      return NextResponse.json({ 
        success: true, 
        sessionId,
        message: 'DISC session saved successfully',
        totals: {
          total_xp: typeof totalXp === 'number' ? totalXp : undefined,
          latest_session_xp: typeof latestSessionXp === 'number' ? latestSessionXp : undefined,
          badges_earned: typeof badgesEarned === 'number' ? badgesEarned : undefined
        }
      })

    } finally {
      client.release()
    }

  } catch (error) {
    console.error('❌ Failed to save DISC session:', error)
    return NextResponse.json({ 
      error: 'Failed to save session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
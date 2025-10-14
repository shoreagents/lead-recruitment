import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const client = await pool.connect()
    try {
      // Get user stats
      const statsSql = `
        SELECT * FROM bpoc_cultural_stats 
        WHERE user_id = $1
      `
      const statsResult = await client.query(statsSql, [userId])
      
      // Get recent sessions
      const sessionsSql = `
        SELECT 
          id, started_at, finished_at, duration_ms,
          stage_reached, challenge_completed, game_state,
          time_left, survival_status, interaction_count,
          us_score, uk_score, au_score, ca_score,
          tier_name, tier_description, achievements
        FROM bpoc_cultural_sessions 
        WHERE user_id = $1 
        ORDER BY started_at DESC 
        LIMIT 10
      `
      const sessionsResult = await client.query(sessionsSql, [userId])

      // Get achievement breakdown
      const achievementsSql = `
        SELECT 
          jsonb_array_elements_text(achievements) as achievement,
          COUNT(*) as earned_count
        FROM bpoc_cultural_sessions 
        WHERE user_id = $1 AND achievements != '[]'::jsonb
        GROUP BY jsonb_array_elements_text(achievements)
        ORDER BY earned_count DESC
      `
      const achievementsResult = await client.query(achievementsSql, [userId])

      return NextResponse.json({
        success: true,
        stats: statsResult.rows[0] || null,
        recentSessions: sessionsResult.rows,
        achievementBreakdown: achievementsResult.rows
      })

    } finally {
      client.release()
    }

  } catch (e) {
    console.error('Failed to fetch BPOC Cultural stats', e)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}

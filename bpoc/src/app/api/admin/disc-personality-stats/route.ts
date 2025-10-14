import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    console.log('DISC Personality Stats API called')
    
    const result = await pool.query(`
      SELECT
        dps.id,
        dps.user_id,
        dps.total_sessions,
        dps.completed_sessions,
        dps.last_taken_at,
        dps.latest_d_score,
        dps.latest_i_score,
        dps.latest_s_score,
        dps.latest_c_score,
        dps.latest_primary_type,
        dps.latest_secondary_type,
        dps.best_confidence_score,
        dps.average_completion_time,
        dps.consistency_trend,
        dps.latest_ai_assessment,
        dps.latest_bpo_roles,
        dps.percentile,
        dps.total_xp,
        dps.badges_earned,
        dps.cultural_alignment_score,
        dps.authenticity_score,
        dps.latest_session_xp,
        dps.created_at,
        dps.updated_at,
        u.full_name as user_name,
        u.email as user_email,
        u.avatar_url as user_avatar
      FROM disc_personality_stats dps
      LEFT JOIN users u ON dps.user_id = u.id
      ORDER BY dps.last_taken_at DESC NULLS LAST, dps.created_at DESC
    `)

    const transformedStats = result.rows.map((stat: any) => ({
      id: stat.id,
      user_id: stat.user_id,
      total_sessions: stat.total_sessions || 0,
      completed_sessions: stat.completed_sessions || 0,
      last_taken_at: stat.last_taken_at,
      d: stat.latest_d_score || 0,
      i: stat.latest_i_score || 0,
      s: stat.latest_s_score || 0,
      c: stat.latest_c_score || 0,
      primary_style: stat.latest_primary_type || 'N/A',
      secondary_style: stat.latest_secondary_type || 'N/A',
      consistency_index: stat.consistency_trend || 0,
      percentile: stat.percentile || 0,
      best_confidence_score: stat.best_confidence_score,
      average_completion_time: stat.average_completion_time,
      latest_ai_assessment: stat.latest_ai_assessment,
      latest_bpo_roles: stat.latest_bpo_roles,
      total_xp: stat.total_xp,
      badges_earned: stat.badges_earned,
      cultural_alignment_score: stat.cultural_alignment_score,
      authenticity_score: stat.authenticity_score,
      latest_session_xp: stat.latest_session_xp,
      created_at: stat.created_at,
      updated_at: stat.updated_at,
      user_name: stat.user_name || 'Unknown User',
      user_email: stat.user_email || 'No Email',
      user_avatar: stat.user_avatar
    }))

    console.log('DISC API - Raw rows:', result.rows.length)
    console.log('DISC API - Transformed stats:', transformedStats.length)

    return NextResponse.json({
      stats: transformedStats,
      total: transformedStats.length,
      active_players: transformedStats.filter((s: any) => s.last_taken_at && new Date(s.last_taken_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
      total_assessments: transformedStats.length
    })

  } catch (error) {
    console.error('Error in DISC personality stats API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

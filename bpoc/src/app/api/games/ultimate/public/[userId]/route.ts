import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = await Promise.resolve(params)
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  try {
    const client = await pool.connect()
    try {
      const stats = await client.query(
        `SELECT user_id, total_sessions, last_taken_at,
                smart, motivated, integrity, business,
                platinum_choices, gold_choices, bronze_choices, nightmare_choices,
                last_tier, last_recommendation, last_client_value,
                latest_competencies, key_strengths, development_areas
         FROM ultimate_stats
         WHERE user_id = $1
         LIMIT 1`,
        [userId]
      )

      const latest = await client.query(
        `SELECT id, started_at, finished_at, duration_ms,
                smart, motivated, integrity, business,
                platinum_choices, gold_choices, bronze_choices, nightmare_choices,
                tier, tier_recommendation, client_value,
                team_morale, client_trust, business_impact, crisis_pressure
         FROM ultimate_sessions
         WHERE user_id = $1
         ORDER BY started_at DESC
         LIMIT 1`,
        [userId]
      )

      return NextResponse.json({
        stats: stats.rows[0] || null,
        latestSession: latest.rows[0] || null,
      })
    } finally {
      client.release()
    }
  } catch (e) {
    console.error('Failed to fetch ultimate public data', e)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}

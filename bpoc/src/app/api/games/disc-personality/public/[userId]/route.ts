import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(
  _request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  try {
    const client = await pool.connect()
    try {
      const stats = await client.query(
        `SELECT user_id, total_sessions, completed_sessions, last_taken_at,
                d, i, s, c, primary_style, secondary_style, consistency_index, percentile, ai_interpretation
         FROM disc_personality_stats
         WHERE user_id = $1
         LIMIT 1`,
        [userId]
      )

      const latest = await client.query(
        `SELECT id, started_at, finished_at, duration_ms,
                d, i, s, c, primary_style, secondary_style, consistency_index
         FROM disc_personality_sessions
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
    console.error('Failed to fetch disc personality public data', e)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}



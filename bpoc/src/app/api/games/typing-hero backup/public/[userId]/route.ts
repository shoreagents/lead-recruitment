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
      const latest = await client.query(
        `SELECT id, started_at, finished_at, duration_ms, difficulty, wpm, accuracy
         FROM typing_hero_sessions
         WHERE user_id = $1
         ORDER BY started_at DESC
         LIMIT 1`,
        [userId]
      )

      const stats = await client.query(
        `SELECT total_sessions, completed_sessions, last_played_at, best_wpm, best_accuracy,
                median_wpm, highest_difficulty, recent_wpm, consistency_index, percentile
         FROM typing_hero_stats
         WHERE user_id = $1
         LIMIT 1`,
        [userId]
      )

      return NextResponse.json({
        latestSession: latest.rows[0] || null,
        stats: stats.rows[0] || null,
      })
    } finally {
      client.release()
    }
  } catch (e) {
    console.error('Failed to fetch typing hero public data', e)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}



import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      startedAt,
      finishedAt,
      durationMs,
      d, i, s, c,
      primary_style,
      secondary_style,
      consistency_index,
      strengths,
      blind_spots,
      preferred_env,
      ai_interpretation
    } = body || {}

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      const insertSql = `
        INSERT INTO disc_personality_sessions (
          user_id, started_at, finished_at, duration_ms,
          d, i, s, c,
          primary_style, secondary_style, consistency_index,
          strengths, blind_spots, preferred_env
        ) VALUES (
          $1, $2, $3, $4,
          $5, $6, $7, $8,
          $9, $10, $11,
          COALESCE($12, '{}'::jsonb), COALESCE($13, '{}'::jsonb), COALESCE($14, '{}'::jsonb)
        ) RETURNING id
      `

      await client.query(insertSql, [
        userId,
        startedAt ? new Date(startedAt) : new Date(),
        finishedAt ? new Date(finishedAt) : new Date(),
        typeof durationMs === 'number' ? durationMs : null,
        Number.isFinite(d) ? d : null,
        Number.isFinite(i) ? i : null,
        Number.isFinite(s) ? s : null,
        Number.isFinite(c) ? c : null,
        primary_style ?? null,
        secondary_style ?? null,
        consistency_index != null ? Number(consistency_index) : null,
        strengths ? JSON.stringify(strengths) : null,
        blind_spots ? JSON.stringify(blind_spots) : null,
        preferred_env ? JSON.stringify(preferred_env) : null,
      ])

      const upsertStatsSql = `
        WITH latest AS (
          SELECT * FROM disc_personality_sessions
          WHERE user_id = $1
          ORDER BY started_at DESC
          LIMIT 1
        ),
        agg AS (
          SELECT 
            COUNT(*)::int AS total_sessions,
            COUNT(*)::int AS completed_sessions,
            MAX(started_at) AS last_taken_at
          FROM disc_personality_sessions
          WHERE user_id = $1
        )
        INSERT INTO disc_personality_stats (
          user_id, total_sessions, completed_sessions, last_taken_at,
          d, i, s, c, primary_style, secondary_style, consistency_index, percentile,
          ai_interpretation, created_at, updated_at
        )
        SELECT 
          $1, agg.total_sessions, agg.completed_sessions, agg.last_taken_at,
          latest.d, latest.i, latest.s, latest.c, latest.primary_style, latest.secondary_style, latest.consistency_index, NULL,
          COALESCE($2::jsonb, NULL), NOW(), NOW()
        FROM agg, latest
        ON CONFLICT (user_id) DO UPDATE SET
          total_sessions = EXCLUDED.total_sessions,
          completed_sessions = EXCLUDED.completed_sessions,
          last_taken_at = EXCLUDED.last_taken_at,
          d = EXCLUDED.d,
          i = EXCLUDED.i,
          s = EXCLUDED.s,
          c = EXCLUDED.c,
          primary_style = EXCLUDED.primary_style,
          secondary_style = EXCLUDED.secondary_style,
          consistency_index = EXCLUDED.consistency_index,
          ai_interpretation = COALESCE(EXCLUDED.ai_interpretation, disc_personality_stats.ai_interpretation),
          updated_at = NOW()
      `

      await client.query(upsertStatsSql, [userId, ai_interpretation ? JSON.stringify(ai_interpretation) : null])

      await client.query('COMMIT')
      return NextResponse.json({ success: true })
    } catch (e) {
      await client.query('ROLLBACK')
      console.error('Failed to save BPOC DISC session', e)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    } finally {
      client.release()
    }
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}



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
      difficulty,
      level,
      wpm,
      accuracy,
      keypresses,
      mistakes,
      error_breakdown,
    } = body || {}

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // normalize difficulty to DB enum
      const normalizeDifficulty = (d: any): any => {
        if (!d) return null
        const val = String(d).toLowerCase()
        if (val === 'medium') return 'intermediate'
        if (val === 'hard') return 'advanced'
        if (['beginner','easy','intermediate','advanced','expert'].includes(val)) return val
        return null
      }

      const mappedDifficulty = normalizeDifficulty(difficulty)

      const insertSql = `
        INSERT INTO typing_hero_sessions (
          user_id, started_at, finished_at, duration_ms, difficulty, level, wpm, accuracy, keypresses, mistakes, error_breakdown
        ) VALUES (
          $1, $2, $3, $4, $5::game_difficulty_enum, $6, $7, $8, $9, $10, COALESCE($11, '{}'::jsonb)
        )
        RETURNING id
      `
      const insertParams = [
        userId,
        startedAt ? new Date(startedAt) : new Date(),
        finishedAt ? new Date(finishedAt) : new Date(),
        typeof durationMs === 'number' ? durationMs : null,
        mappedDifficulty,
        level ?? null,
        typeof wpm === 'number' ? wpm : null,
        typeof accuracy === 'number' ? accuracy : null,
        typeof keypresses === 'number' ? keypresses : null,
        typeof mistakes === 'number' ? mistakes : null,
        error_breakdown ? JSON.stringify(error_breakdown) : null,
      ]

      await client.query(insertSql, insertParams)

      const upsertStatsSql = `
        WITH agg AS (
          SELECT 
            COUNT(*)::int AS total_sessions,
            COUNT(*)::int AS completed_sessions,
            MAX(started_at) AS last_played_at,
            MAX(wpm)::int AS best_wpm,
            MAX(accuracy)::numeric(5,2) AS best_accuracy,
            percentile_disc(0.5) WITHIN GROUP (ORDER BY wpm) AS median_wpm,
            (SELECT difficulty FROM typing_hero_sessions WHERE user_id = $1 ORDER BY started_at DESC LIMIT 1) AS highest_difficulty,
            (SELECT wpm FROM typing_hero_sessions WHERE user_id = $1 ORDER BY started_at DESC LIMIT 1)::int AS recent_wpm,
            COALESCE(stddev_pop(wpm::numeric), 0)::numeric(6,3) AS consistency_index
          FROM typing_hero_sessions
          WHERE user_id = $1
        ),
        bests AS (
          SELECT user_id, MAX(wpm) AS best
          FROM typing_hero_sessions
          WHERE wpm IS NOT NULL
          GROUP BY user_id
        ),
        pct AS (
          SELECT CASE WHEN COUNT(*) = 0 THEN NULL
                      ELSE (COUNT(*) FILTER (WHERE best <= (SELECT best_wpm FROM agg)))::numeric / COUNT(*)
                 END AS p
          FROM bests
        )
        INSERT INTO typing_hero_stats (
          user_id, total_sessions, completed_sessions, last_played_at, best_wpm, best_accuracy, median_wpm, highest_difficulty, recent_wpm, consistency_index, percentile, created_at, updated_at
        )
        SELECT $1, total_sessions, completed_sessions, last_played_at, best_wpm, best_accuracy, median_wpm, highest_difficulty, recent_wpm, consistency_index,
               CASE WHEN (SELECT p FROM pct) IS NULL THEN NULL ELSE ROUND((SELECT p FROM pct) * 100, 2) END,
               NOW(), NOW()
        FROM agg
        ON CONFLICT (user_id)
        DO UPDATE SET
          total_sessions = EXCLUDED.total_sessions,
          completed_sessions = EXCLUDED.completed_sessions,
          last_played_at = EXCLUDED.last_played_at,
          best_wpm = EXCLUDED.best_wpm,
          best_accuracy = EXCLUDED.best_accuracy,
          median_wpm = EXCLUDED.median_wpm,
          highest_difficulty = EXCLUDED.highest_difficulty,
          recent_wpm = EXCLUDED.recent_wpm,
          consistency_index = EXCLUDED.consistency_index,
          percentile = EXCLUDED.percentile,
          updated_at = NOW()
      `

      await client.query(upsertStatsSql, [userId])

      await client.query('COMMIT')
      return NextResponse.json({ success: true })
    } catch (e) {
      await client.query('ROLLBACK')
      console.error('Failed to save typing hero session', e)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    } finally {
      client.release()
    }
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}



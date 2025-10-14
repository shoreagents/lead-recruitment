import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

function decodeJwtSub(authHeader: string | null): string | null {
  try {
    if (!authHeader) return null
    const parts = authHeader.split(' ')
    const token = parts.length === 2 ? parts[1] : null
    if (!token) return null
    const segs = token.split('.')
    if (segs.length < 2) return null
    const payload = JSON.parse(Buffer.from(segs[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'))
    return payload?.sub || null
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    let userId = request.headers.get('x-user-id') || body?.userId || ''
    if (!userId) {
      const sub = decodeJwtSub(request.headers.get('authorization'))
      if (sub) userId = sub
    }
    if (!userId) return NextResponse.json({ error: 'x-user-id required' }, { status: 400 })

    const {
      startedAt, finishedAt, durationMs,
      stageReached, challengeCompleted,
      gameState, timeLeft, survivalStatus,
      interactionCount,
      tierName, tierDescription,
      achievements = [], metrics = {},
      // String captures per challenge
      c1a_us_text, c1a_uk_text, c1a_au_text, c1a_ca_text,
      c1b_text, c1c_text,
      c2a_text,
      c2b_us_text, c2b_uk_text, c2b_au_text, c2b_ca_text,
      c3a_text, c3b_text, c3c_text,
    } = body || {}

    const insertRes = await pool.query(
      `INSERT INTO bpoc_cultural_sessions (
        user_id,
        started_at, finished_at, duration_ms,
        stage_reached, challenge_completed,
        game_state, time_left, survival_status,
        interaction_count,
        tier_name, tier_description,
        achievements, metrics,
        c1a_us_text, c1a_uk_text, c1a_au_text, c1a_ca_text,
        c1b_text, c1c_text,
        c2a_text,
        c2b_us_text, c2b_uk_text, c2b_au_text, c2b_ca_text,
        c3a_text, c3b_text, c3c_text
      ) VALUES (
        $1,
        $2, $3, $4,
        $5, $6,
        $7, $8, $9,
        $10,
        $11, $12,
        $13, $14,
        $15, $16, $17, $18,
        $19, $20,
        $21,
        $22, $23, $24, $25,
        $26, $27, $28
      ) RETURNING id` ,
      [
        userId,
        startedAt || null, finishedAt || null, durationMs || null,
        stageReached || null, challengeCompleted || null,
        gameState || null, timeLeft || null, survivalStatus || null,
        interactionCount || null,
        tierName || null, tierDescription || null,
        Array.isArray(achievements) ? achievements : [], metrics || {},
        c1a_us_text || null, c1a_uk_text || null, c1a_au_text || null, c1a_ca_text || null,
        c1b_text || null, c1c_text || null,
        c2a_text || null,
        c2b_us_text || null, c2b_uk_text || null, c2b_au_text || null, c2b_ca_text || null,
        c3a_text || null, c3b_text || null, c3c_text || null,
      ]
    )

    const sessionId: string = insertRes.rows[0]?.id

    // Upsert stats: last-known strings and counters only
    await pool.query(
      `INSERT INTO bpoc_cultural_stats (
        user_id, total_sessions, completed_sessions, current_tier,
        last_c1a_us_text, last_c1a_uk_text, last_c1a_au_text, last_c1a_ca_text,
        last_c1b_text, last_c1c_text,
        last_c2a_text,
        last_c2b_us_text, last_c2b_uk_text, last_c2b_au_text, last_c2b_ca_text,
        last_c3a_text, last_c3b_text, last_c3c_text
      ) VALUES (
        $1, 1, CASE WHEN $2::timestamptz IS NULL THEN 0 ELSE 1 END, $3,
        $4, $5, $6, $7,
        $8, $9,
        $10,
        $11, $12, $13, $14,
        $15, $16, $17
      )
      ON CONFLICT (user_id) DO UPDATE SET
        current_tier = COALESCE(EXCLUDED.current_tier, bpoc_cultural_stats.current_tier),
        last_c1a_us_text = COALESCE(EXCLUDED.last_c1a_us_text, bpoc_cultural_stats.last_c1a_us_text),
        last_c1a_uk_text = COALESCE(EXCLUDED.last_c1a_uk_text, bpoc_cultural_stats.last_c1a_uk_text),
        last_c1a_au_text = COALESCE(EXCLUDED.last_c1a_au_text, bpoc_cultural_stats.last_c1a_au_text),
        last_c1a_ca_text = COALESCE(EXCLUDED.last_c1a_ca_text, bpoc_cultural_stats.last_c1a_ca_text),
        last_c1b_text = COALESCE(EXCLUDED.last_c1b_text, bpoc_cultural_stats.last_c1b_text),
        last_c1c_text = COALESCE(EXCLUDED.last_c1c_text, bpoc_cultural_stats.last_c1c_text),
        last_c2a_text = COALESCE(EXCLUDED.last_c2a_text, bpoc_cultural_stats.last_c2a_text),
        last_c2b_us_text = COALESCE(EXCLUDED.last_c2b_us_text, bpoc_cultural_stats.last_c2b_us_text),
        last_c2b_uk_text = COALESCE(EXCLUDED.last_c2b_uk_text, bpoc_cultural_stats.last_c2b_uk_text),
        last_c2b_au_text = COALESCE(EXCLUDED.last_c2b_au_text, bpoc_cultural_stats.last_c2b_au_text),
        last_c2b_ca_text = COALESCE(EXCLUDED.last_c2b_ca_text, bpoc_cultural_stats.last_c2b_ca_text),
        last_c3a_text = COALESCE(EXCLUDED.last_c3a_text, bpoc_cultural_stats.last_c3a_text),
        last_c3b_text = COALESCE(EXCLUDED.last_c3b_text, bpoc_cultural_stats.last_c3b_text),
        last_c3c_text = COALESCE(EXCLUDED.last_c3c_text, bpoc_cultural_stats.last_c3c_text)
      `,
      [
        userId,
        finishedAt || null,
        tierName || null,
        c1a_us_text || null, c1a_uk_text || null, c1a_au_text || null, c1a_ca_text || null,
        c1b_text || null, c1c_text || null,
        c2a_text || null,
        c2b_us_text || null, c2b_uk_text || null, c2b_au_text || null, c2b_ca_text || null,
        c3a_text || null, c3b_text || null, c3c_text || null,
      ]
    )

    // Overwrite counters to latest real counts
    await pool.query(
      `UPDATE bpoc_cultural_stats s
       SET total_sessions = sub.total_sessions,
           completed_sessions = sub.completed_sessions
       FROM (
         SELECT COUNT(*)::int AS total_sessions,
                COUNT(*) FILTER (WHERE game_state = 'results')::int AS completed_sessions
         FROM bpoc_cultural_sessions
         WHERE user_id = $1
       ) sub
       WHERE s.user_id = $1`,
      [userId]
    )

    return NextResponse.json({ success: true, sessionId })
  } catch (e) {
    console.error('bpoc-cultural/session POST failed:', e)
    return NextResponse.json({ error: 'failed_to_save' }, { status: 500 })
  }
}

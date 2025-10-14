import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

// Minimal storage: sessions + per-user stats (aggregate)
export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const {
      startedAt,
      finishedAt,
      durationMs,
      // summary-level results
      smart,
      motivated,
      integrity,
      business,
      platinumChoices,
      goldChoices,
      bronzeChoices,
      nightmareChoices,
      // new detailed fields
      tier,
      tierRecommendation,
      clientValue,
      teamMorale,
      clientTrust,
      businessImpact,
      crisisPressure,
      keyStrengths,
      developmentAreas,
      playerName,
      avatar
    } = body || {}

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // Create session table if not present (optional safety for dev environments)
      await client.query(`
        CREATE TABLE IF NOT EXISTS ultimate_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          started_at TIMESTAMPTZ DEFAULT NOW(),
          finished_at TIMESTAMPTZ,
          duration_ms INTEGER,
          smart INTEGER,
          motivated INTEGER,
          integrity INTEGER,
          business INTEGER,
          platinum_choices INTEGER,
          gold_choices INTEGER,
          bronze_choices INTEGER,
          nightmare_choices INTEGER,
          tier TEXT,
          tier_recommendation TEXT,
          client_value TEXT,
          team_morale INTEGER,
          client_trust INTEGER,
          business_impact INTEGER,
          crisis_pressure INTEGER,
          key_strengths JSONB,
          development_areas JSONB,
          player_name TEXT,
          avatar TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        ALTER TABLE ultimate_sessions
          ADD COLUMN IF NOT EXISTS tier TEXT,
          ADD COLUMN IF NOT EXISTS tier_recommendation TEXT,
          ADD COLUMN IF NOT EXISTS client_value TEXT,
          ADD COLUMN IF NOT EXISTS team_morale INTEGER,
          ADD COLUMN IF NOT EXISTS client_trust INTEGER,
          ADD COLUMN IF NOT EXISTS business_impact INTEGER,
          ADD COLUMN IF NOT EXISTS crisis_pressure INTEGER,
          ADD COLUMN IF NOT EXISTS key_strengths JSONB,
          ADD COLUMN IF NOT EXISTS development_areas JSONB,
          ADD COLUMN IF NOT EXISTS player_name TEXT,
          ADD COLUMN IF NOT EXISTS avatar TEXT;
      `)

      await client.query(`
        CREATE TABLE IF NOT EXISTS ultimate_stats (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
          total_sessions INTEGER NOT NULL DEFAULT 0,
          last_taken_at TIMESTAMPTZ,
          smart INTEGER,
          motivated INTEGER,
          integrity INTEGER,
          business INTEGER,
          platinum_choices INTEGER,
          gold_choices INTEGER,
          bronze_choices INTEGER,
          nightmare_choices INTEGER,
          last_tier TEXT,
          last_recommendation TEXT,
          last_client_value TEXT,
          latest_competencies JSONB,
          key_strengths JSONB,
          development_areas JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        ALTER TABLE ultimate_stats
          ADD COLUMN IF NOT EXISTS last_tier TEXT,
          ADD COLUMN IF NOT EXISTS last_recommendation TEXT,
          ADD COLUMN IF NOT EXISTS last_client_value TEXT,
          ADD COLUMN IF NOT EXISTS latest_competencies JSONB,
          ADD COLUMN IF NOT EXISTS key_strengths JSONB,
          ADD COLUMN IF NOT EXISTS development_areas JSONB;
      `)

      // Insert session
      await client.query(
        `INSERT INTO ultimate_sessions (
           user_id, started_at, finished_at, duration_ms,
           smart, motivated, integrity, business,
           platinum_choices, gold_choices, bronze_choices, nightmare_choices,
           tier, tier_recommendation, client_value,
           team_morale, client_trust, business_impact, crisis_pressure,
           key_strengths, development_areas, player_name, avatar
         ) VALUES (
           $1, $2, $3, $4,
           $5, $6, $7, $8,
           $9, $10, $11, $12,
           $13, $14, $15,
           $16, $17, $18, $19,
           COALESCE($20, '[]'::jsonb), COALESCE($21, '[]'::jsonb), $22, $23
         )`,
        [
          userId,
          startedAt ? new Date(startedAt) : new Date(),
          finishedAt ? new Date(finishedAt) : new Date(),
          typeof durationMs === 'number' ? durationMs : null,
          Number.isFinite(smart) ? smart : null,
          Number.isFinite(motivated) ? motivated : null,
          Number.isFinite(integrity) ? integrity : null,
          Number.isFinite(business) ? business : null,
          Number.isFinite(platinumChoices) ? platinumChoices : null,
          Number.isFinite(goldChoices) ? goldChoices : null,
          Number.isFinite(bronzeChoices) ? bronzeChoices : null,
          Number.isFinite(nightmareChoices) ? nightmareChoices : null,
          tier ?? null,
          tierRecommendation ?? null,
          clientValue ?? null,
          Number.isFinite(teamMorale) ? teamMorale : null,
          Number.isFinite(clientTrust) ? clientTrust : null,
          Number.isFinite(businessImpact) ? businessImpact : null,
          Number.isFinite(crisisPressure) ? crisisPressure : null,
          keyStrengths ? JSON.stringify(keyStrengths) : null,
          developmentAreas ? JSON.stringify(developmentAreas) : null,
          playerName ?? null,
          avatar ?? null
        ]
      )

      // Upsert stats from latest session + counts
      await client.query(
        `INSERT INTO ultimate_stats (
           user_id, total_sessions, last_taken_at, smart, motivated, integrity, business,
           platinum_choices, gold_choices, bronze_choices, nightmare_choices,
           last_tier, last_recommendation, last_client_value, latest_competencies, key_strengths, development_areas,
           created_at, updated_at
         )
         SELECT $1,
                (SELECT COUNT(*) FROM ultimate_sessions WHERE user_id = $1),
                NOW(),
                $2, $3, $4, $5,
                $6, $7, $8, $9,
                $10, $11, $12, $13::jsonb, COALESCE($14::jsonb, '[]'::jsonb), COALESCE($15::jsonb, '[]'::jsonb),
                NOW(), NOW()
         ON CONFLICT (user_id)
         DO UPDATE SET
           total_sessions = EXCLUDED.total_sessions,
           last_taken_at = EXCLUDED.last_taken_at,
           smart = EXCLUDED.smart,
           motivated = EXCLUDED.motivated,
           integrity = EXCLUDED.integrity,
           business = EXCLUDED.business,
           platinum_choices = EXCLUDED.platinum_choices,
           gold_choices = EXCLUDED.gold_choices,
           bronze_choices = EXCLUDED.bronze_choices,
           nightmare_choices = EXCLUDED.nightmare_choices,
           last_tier = EXCLUDED.last_tier,
           last_recommendation = EXCLUDED.last_recommendation,
           last_client_value = EXCLUDED.last_client_value,
           latest_competencies = EXCLUDED.latest_competencies,
           key_strengths = EXCLUDED.key_strengths,
           development_areas = EXCLUDED.development_areas,
           updated_at = NOW();
        `,
        [
          userId,
          Number.isFinite(smart) ? smart : null,
          Number.isFinite(motivated) ? motivated : null,
          Number.isFinite(integrity) ? integrity : null,
          Number.isFinite(business) ? business : null,
          Number.isFinite(platinumChoices) ? platinumChoices : null,
          Number.isFinite(goldChoices) ? goldChoices : null,
          Number.isFinite(bronzeChoices) ? bronzeChoices : null,
          Number.isFinite(nightmareChoices) ? nightmareChoices : null,
          tier ?? null,
          tierRecommendation ?? null,
          clientValue ?? null,
          JSON.stringify({ team_morale: teamMorale ?? null, client_trust: clientTrust ?? null, business_impact: businessImpact ?? null, crisis_pressure: crisisPressure ?? null }),
          keyStrengths ? JSON.stringify(keyStrengths) : null,
          developmentAreas ? JSON.stringify(developmentAreas) : null
        ]
      )

      await client.query('COMMIT')
      return NextResponse.json({ success: true })
    } catch (e) {
      await client.query('ROLLBACK')
      console.error('Failed to save Ultimate session', e)
      return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    } finally {
      client.release()
    }
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}



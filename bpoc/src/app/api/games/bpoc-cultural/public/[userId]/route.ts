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
			// Fetch all results for this user (ordered newest first)
			const resultsRes = await client.query(
				`SELECT 
					id,
					session_id as "sessionId",
					summary_text as "summary",
					result_json as "result"
				FROM bpoc_cultural_results
				WHERE user_id = $1
				ORDER BY id DESC`,
				[userId]
			)

			const results = resultsRes.rows
			const latestResult = results[0] || null

			// Collect related session IDs and fetch their details
			const sessionIds = results
				.map((r: any) => r.sessionId)
				.filter((v: any) => !!v)
				.filter((v: any, i: number, a: any[]) => a.indexOf(v) === i)
			let sessionsById: Record<string, any> = {}
			if (sessionIds.length > 0) {
				const params = [userId, ...sessionIds]
				const placeholders = sessionIds.map((_, idx) => `$${idx + 2}`).join(',')
				const sessionsRes = await client.query(
					`SELECT 
						id,
						started_at as "startedAt",
						finished_at as "finishedAt",
						duration_ms as "durationMs",
						stage_reached as "stageReached",
						challenge_completed as "challengeCompleted",
						game_state as "gameState",
						time_left as "timeLeft",
						survival_status as "survivalStatus",
						interaction_count as "interactionCount",
						tier_name as "tierName",
						tier_description as "tierDescription",
						achievements
					FROM bpoc_cultural_sessions
					WHERE user_id = $1 AND id IN (${placeholders})`,
					params
				)
				sessionsById = Object.fromEntries(sessionsRes.rows.map((s: any) => [String(s.id), s]))
			}

			return NextResponse.json({ latestResult, results, sessionsById })
		} finally {
			client.release()
		}
	} catch (e) {
		console.error('Failed to fetch BPOC Cultural public data', e)
		return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
	}
}




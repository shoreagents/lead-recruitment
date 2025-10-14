import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
	try {
		const url = new URL(request.url)
		const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || 200), 1), 500)
		const offset = Math.max(Number(url.searchParams.get('offset') || 0), 0)

		const res = await pool.query(
			`SELECT 
			   r.id,
			   r.user_id,
			   r.session_id,
			   r.model_provider,
			   r.model_version,
			   r.summary_text,
			   r.result_json,
			   u.full_name,
			   u.avatar_url
			 FROM bpoc_cultural_results r
			 LEFT JOIN users u ON u.id = r.user_id
			 ORDER BY r.id DESC
			 LIMIT $1 OFFSET $2`,
			[limit, offset]
		)

		return NextResponse.json({ results: res.rows, total: res.rows.length })
	} catch (e) {
		console.error('Failed to fetch admin bpoc cultural results', e)
		return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
	}
}



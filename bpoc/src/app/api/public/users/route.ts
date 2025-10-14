import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

const CORS_HEADERS: Record<string, string> = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET,OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Access-Control-Max-Age': '86400'
}

function withCors(response: NextResponse) {
	Object.entries(CORS_HEADERS).forEach(([k, v]) => response.headers.set(k, v))
	return response
}

export async function OPTIONS() { return withCors(new NextResponse(null, { status: 204 })) }

// Only expose non-sensitive columns
const SAFE_FIELDS = new Set([
	'id','email','first_name','last_name','full_name','location','avatar_url','position','phone','bio','gender','created_at','updated_at','overall_score'
])

export async function GET(request: NextRequest) {
	const url = new URL(request.url)
	const page = Math.max(1, Number(url.searchParams.get('page') || 1))
	const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize') || 20)))
	const offset = (page - 1) * pageSize
	const q = (url.searchParams.get('q') || '').trim()
	const fieldsParam = (url.searchParams.get('fields') || '').trim()
	const idsParam = (url.searchParams.get('ids') || '').trim()

	const fields = fieldsParam ? fieldsParam.split(',').map(s => s.trim()).filter(s => SAFE_FIELDS.has(s))
		: ['id','full_name','email','location','position','avatar_url','phone','bio','gender','created_at']
	
	// Handle overall_score separately since it comes from a different table
	const hasOverallScore = fields.includes('overall_score')
	const userFields = fields.filter(f => f !== 'overall_score')
	const selectList = userFields.map(f => `u."${f}"`).join(', ')
	const overallScoreSelect = hasOverallScore ? ', COALESCE(los.overall_score, 0) as overall_score' : ''

	const client = await pool.connect()
	try {
		const where: string[] = []
		const params: any[] = []
		if (q) {
			params.push(`%${q}%`)
			where.push(`(u.full_name ILIKE $${params.length} OR u.email ILIKE $${params.length})`)
		}
		if (idsParam) {
			const ids = idsParam.split(',').map(s => s.trim()).filter(Boolean)
			if (ids.length) {
				params.push(ids)
				where.push(`u.id = ANY($${params.length})`)
			}
		}
		const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
		const fromClause = hasOverallScore ? 'FROM users u LEFT JOIN leaderboard_overall_scores los ON u.id = los.user_id' : 'FROM users u'
		const countRes = await client.query(`SELECT COUNT(*)::int AS total FROM users u ${whereSql}`, params)
		const total = countRes.rows[0]?.total || 0

		params.push(pageSize, offset)
		const dataRes = await client.query(
			`SELECT ${selectList}${overallScoreSelect} ${fromClause} ${whereSql} ORDER BY u.created_at DESC LIMIT $${params.length-1} OFFSET $${params.length}`,
			params
		)
		return withCors(NextResponse.json({ page, pageSize, total, items: dataRes.rows }))
	} catch (e) {
		return withCors(NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 }))
	} finally { client.release() }
}

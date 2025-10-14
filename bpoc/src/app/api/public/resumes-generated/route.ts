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

const SAFE_FIELDS = new Set([
	'id','user_id','original_resume_id','template_used','generation_metadata','created_at','updated_at'
])

export async function GET(request: NextRequest) {
	const url = new URL(request.url)
	const page = Math.max(1, Number(url.searchParams.get('page') || 1))
	const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize') || 20)))
	const offset = (page - 1) * pageSize
	const userId = url.searchParams.get('userId') || ''
	const fieldsParam = (url.searchParams.get('fields') || '').trim()

	const fields = fieldsParam ? fieldsParam.split(',').map(s => s.trim()).filter(s => SAFE_FIELDS.has(s))
		: ['id','user_id','original_resume_id','template_used','generation_metadata','created_at']
	const selectList = fields.map(f => `"${f}"`).join(', ')

	const client = await pool.connect()
	try {
		const where: string[] = []
		const params: any[] = []
		if (userId) { params.push(userId); where.push(`user_id = $${params.length}`) }
		const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
		const countRes = await client.query(`SELECT COUNT(*)::int AS total FROM resumes_generated ${whereSql}`, params)
		const total = countRes.rows[0]?.total || 0

		params.push(pageSize, offset)
		const dataRes = await client.query(
			`SELECT ${selectList} FROM resumes_generated ${whereSql} ORDER BY created_at DESC LIMIT $${params.length-1} OFFSET $${params.length}`,
			params
		)
		return withCors(NextResponse.json({ page, pageSize, total, items: dataRes.rows }))
	} catch (e) {
		return withCors(NextResponse.json({ error: 'Failed to fetch generated resumes' }, { status: 500 }))
	} finally { client.release() }
}

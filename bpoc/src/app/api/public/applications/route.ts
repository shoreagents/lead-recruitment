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

export async function OPTIONS() {
	return withCors(new NextResponse(null, { status: 204 }))
}

const ALLOWED_FIELDS = new Set([
	'id','user_id','job_id','resume_id','resume_slug','status','position','created_at','updated_at'
])

export async function GET(request: NextRequest) {
	const url = new URL(request.url)
	const page = Math.max(1, Number(url.searchParams.get('page') || 1))
	const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize') || 20)))
	const offset = (page - 1) * pageSize
	const userId = url.searchParams.get('userId') || ''
	const jobId = url.searchParams.get('jobId') || ''
	const status = url.searchParams.get('status') || ''
	const fieldsParam = (url.searchParams.get('fields') || '').trim()

	const fields = fieldsParam
		? fieldsParam.split(',').map(s => s.trim()).filter(s => ALLOWED_FIELDS.has(s))
		: ['id','user_id','job_id','resume_id','resume_slug','status','position','created_at']
	const selectList = fields.map(f => `"${f}"`).join(', ')

	const client = await pool.connect()
	try {
		const where: string[] = []
		const params: any[] = []
		if (userId) { params.push(userId); where.push(`user_id = $${params.length}`) }
		if (jobId)  { params.push(Number(jobId)); where.push(`job_id = $${params.length}`) }
		if (status) { params.push(status); where.push(`status = $${params.length}`) }

		const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
		const countRes = await client.query(`SELECT COUNT(*)::int AS total FROM applications ${whereSql}`, params)
		const total = countRes.rows[0]?.total || 0

		params.push(pageSize, offset)
		const dataSql = `SELECT ${selectList} FROM applications ${whereSql} ORDER BY created_at DESC LIMIT $${params.length-1} OFFSET $${params.length}`
		const rowsRes = await client.query(dataSql, params)

		return withCors(NextResponse.json({ page, pageSize, total, items: rowsRes.rows }))
	} catch (e) {
		return withCors(NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 }))
	} finally {
		client.release()
	}
}

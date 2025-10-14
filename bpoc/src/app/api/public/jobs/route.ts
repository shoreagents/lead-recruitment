import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

// Very permissive CORS for public consumption (adjust later if needed)
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

export async function GET(request: NextRequest) {
	const url = new URL(request.url)
	const page = Math.max(1, Number(url.searchParams.get('page') || 1))
	const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize') || 20)))
	const q = (url.searchParams.get('q') || '').trim()
	const status = (url.searchParams.get('status') || 'active').trim()
	const offset = (page - 1) * pageSize

	const client = await pool.connect()
	try {
		const whereParts: string[] = []
		const params: any[] = []

		// status filter
		params.push(status)
		whereParts.push(`status = $${params.length}`)

		// simple search on title and department
		if (q) {
			params.push(`%${q}%`)
			whereParts.push(`(job_title ILIKE $${params.length} OR department ILIKE $${params.length})`)
		}

		// count first
		const countSql = `SELECT COUNT(*)::int AS total FROM processed_job_requests ${whereParts.length ? 'WHERE ' + whereParts.join(' AND ') : ''}`
		const countRes = await client.query(countSql, params)
		const total = countRes.rows[0]?.total || 0

		// then page of items
		params.push(pageSize, offset)
		const dataSql = `
			SELECT id, company_id, job_title, department, work_arrangement, salary_min, salary_max,
			       currency, salary_type, experience_level, priority, shift, application_deadline,
			       industry, work_type, status, views, applicants, created_at, updated_at
			FROM processed_job_requests
			${whereParts.length ? 'WHERE ' + whereParts.join(' AND ') : ''}
			ORDER BY created_at DESC
			LIMIT $${params.length - 1} OFFSET $${params.length}
		`
		const dataRes = await client.query(dataSql, params)

		const body = {
			page,
			pageSize,
			total,
			items: dataRes.rows
		}
		return withCors(NextResponse.json(body))
	} catch (e) {
		return withCors(NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 }))
	} finally {
		client.release()
	}
}

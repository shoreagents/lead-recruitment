import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '100', 10) || 100, 1), 200)
    const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10) || 0, 0)
    const mood = searchParams.get('mood')
    const status = searchParams.get('status')
    const q = searchParams.get('q')

    const where: string[] = []
    const params: any[] = []

    if (mood) {
      params.push(mood)
      where.push(`uws.current_mood = $${params.length}`)
    }
    if (status) {
      params.push(status)
      where.push(`uws.work_status = $${params.length}`)
    }
    if (q) {
      params.push(`%${q}%`)
      where.push(`(u.full_name ILIKE $${params.length} OR u.email ILIKE $${params.length})`)
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

    const sql = `
      SELECT 
        uws.user_id,
        u.full_name,
        u.email,
        u.avatar_url,
        uws.current_employer,
        uws.current_position,
        uws.current_salary,
        uws.notice_period_days,
        uws.expected_salary,
        uws.current_mood,
        uws.work_status,
        uws.preferred_shift,
        uws.created_at,
        uws.updated_at
      FROM user_work_status uws
      JOIN users u ON u.id = uws.user_id
      ${whereSql}
      ORDER BY uws.updated_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `

    const countSql = `
      SELECT COUNT(*)::int AS total
      FROM user_work_status uws
      JOIN users u ON u.id = uws.user_id
      ${whereSql}
    `

    const [listRes, countRes] = await Promise.all([
      pool.query(sql, [...params, limit, offset]),
      pool.query(countSql, params),
    ])

    const rows = listRes.rows.map((r: any) => ({
      userId: r.user_id,
      fullName: r.full_name,
      email: r.email,
      avatarUrl: r.avatar_url,
      currentEmployer: r.current_employer,
      currentPosition: r.current_position,
      currentSalary: r.current_salary,
      noticePeriodDays: r.notice_period_days,
      expectedSalary: r.expected_salary,
      currentMood: r.current_mood,
      workStatus: r.work_status,
      preferredShift: r.preferred_shift,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }))

    return NextResponse.json({ results: rows, total: countRes.rows[0]?.total || 0, limit, offset })
  } catch (e) {
    console.error('Failed to fetch user work statuses', e)
    return NextResponse.json({ error: 'Failed to fetch user work statuses' }, { status: 500 })
  }
}



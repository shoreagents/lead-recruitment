import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Ensure caller is admin
    const adminCheck = await pool.query('SELECT admin_level FROM users WHERE id = $1', [userId])
    if (adminCheck.rows[0]?.admin_level !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    }

    const id = params.id
    const res = await pool.query(
      `SELECT j.*, m.company as company_name
       FROM job_requests j
       LEFT JOIN members m ON m.company_id = j.company_id
       WHERE j.id = $1`,
      [id]
    )
    if (res.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    
    const job = { ...res.rows[0], company: res.rows[0].company_name || 'ShoreAgents' }
    return NextResponse.json({ job })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 })
  }
}



import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const admin = await pool.query('SELECT admin_level FROM users WHERE id = $1', [userId])
    if (admin.rows[0]?.admin_level !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 })

    const res = await pool.query('SELECT company_id, company FROM members ORDER BY company ASC')
    return NextResponse.json({ members: res.rows })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load members' }, { status: 500 })
  }
}



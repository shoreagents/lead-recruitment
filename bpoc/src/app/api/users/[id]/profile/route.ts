import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = await Promise.resolve(params)
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const res = await pool.query(
      `SELECT slug FROM users WHERE id = $1`,
      [userId]
    )

    const slug = res.rows[0]?.slug || null
    if (!slug) return NextResponse.json({ slug: null }, { status: 200 })
    return NextResponse.json({ slug })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch user slug' }, { status: 500 })
  }
}

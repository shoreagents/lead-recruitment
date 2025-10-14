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
      `SELECT resume_slug FROM saved_resumes WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [userId]
    )

    const slug = res.rows[0]?.resume_slug || null
    if (!slug) return NextResponse.json({ slug: null }, { status: 200 })
    return NextResponse.json({ slug })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch resume slug' }, { status: 500 })
  }
}



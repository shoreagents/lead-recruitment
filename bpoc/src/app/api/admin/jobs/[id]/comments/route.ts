import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await context.params
    const res = await pool.query(`
      SELECT c.id, c.user_id, c.comment, c.created_at,
             u.full_name AS user_name, u.avatar_url AS user_avatar
      FROM job_request_comments c
      LEFT JOIN users u ON u.id = c.user_id
      WHERE c.job_request_id = $1
      ORDER BY c.created_at DESC
    `, [id])
    return NextResponse.json({ comments: res.rows })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load comments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await context.params
    const body = await request.json()
    const text = (body?.comment || '').toString().trim()
    if (!text) return NextResponse.json({ error: 'Empty comment' }, { status: 400 })
    const ins = await pool.query(`
      INSERT INTO job_request_comments (job_request_id, user_id, comment)
      VALUES ($1,$2,$3)
      RETURNING id, user_id, comment, created_at
    `, [id, userId, text])
    return NextResponse.json({ comment: ins.rows[0] })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 })
  }
}



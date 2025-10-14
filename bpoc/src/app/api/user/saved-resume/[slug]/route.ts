import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const p = await Promise.resolve(context.params as any)
    const { slug } = p as { slug: string }
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      // Find the resume id first to cascade delete related applications
      const sel = await client.query(
        'SELECT id FROM saved_resumes WHERE user_id = $1 AND resume_slug = $2 LIMIT 1',
        [userId, slug]
      )
      if (sel.rowCount === 0) {
        await client.query('ROLLBACK')
        return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
      }
      const resumeId = sel.rows[0].id as string

      // Delete dependent applications that reference this resume (by id or slug)
      await client.query(
        'DELETE FROM applications WHERE user_id = $1 AND (resume_id = $2 OR resume_slug = $3)',
        [userId, resumeId, slug]
      )

      // Now delete the saved resume
      const del = await client.query(
        'DELETE FROM saved_resumes WHERE id = $1 AND user_id = $2 RETURNING id',
        [resumeId, userId]
      )
      if (del.rowCount === 0) {
        await client.query('ROLLBACK')
        return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
      }
      await client.query('COMMIT')
      return NextResponse.json({ success: true })
    } catch (e: any) {
      await client.query('ROLLBACK')
      console.error('❌ DELETE saved-resume error:', e?.message || e)
      return NextResponse.json({ error: 'Failed to delete resume', details: e?.message || String(e) }, { status: 500 })
    } finally {
      client.release()
    }
  } catch (err: any) {
    console.error('❌ DELETE handler error:', err?.message || err)
    return NextResponse.json({ error: 'Failed to delete resume', details: err?.message || String(err) }, { status: 500 })
  }
}



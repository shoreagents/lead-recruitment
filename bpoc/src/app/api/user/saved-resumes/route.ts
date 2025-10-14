import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID not provided' }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      // Test database connection
      await client.query('SELECT NOW()')
      console.log('✅ Database connection successful')

      // Check if user has any saved resumes
      const result = await client.query(
        `SELECT id, resume_slug, resume_title, created_at 
         FROM saved_resumes 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT 1`,
        [userId]
      )

      if (result.rows.length > 0) {
        const savedResume = result.rows[0]
        return NextResponse.json({
          success: true,
          hasSavedResume: true,
          id: savedResume.id,
          resumeId: savedResume.id,
          resumeSlug: savedResume.resume_slug,
          resumeTitle: savedResume.resume_title,
          resumeUrl: `/resume/${savedResume.resume_slug}`
        })
      } else {
        return NextResponse.json({
          success: true,
          hasSavedResume: false,
          resumeUrl: '/resume-builder'
        })
      }

    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Error checking saved resumes:', error)
    return NextResponse.json(
      { error: 'Failed to check saved resumes', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID not provided' }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      await client.query('DELETE FROM saved_resumes WHERE user_id = $1', [userId])
      return NextResponse.json({ success: true })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Error deleting saved resumes:', error)
    return NextResponse.json(
      { error: 'Failed to delete saved resumes', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
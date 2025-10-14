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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await pool.connect()
    try {
      const result = await client.query(
        'SELECT resume_data FROM resumes_extracted WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1',
        [userId]
      )

      if (result.rows.length === 0) {
        return NextResponse.json({ hasData: false })
      }

      return NextResponse.json({ hasData: true, resumeData: result.rows[0].resume_data })
    } finally {
      client.release()
    }
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load extracted resume' }, { status: 500 })
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
      await client.query('DELETE FROM resumes_extracted WHERE user_id = $1', [userId])
      return NextResponse.json({ success: true })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Error deleting extracted resume:', error)
    return NextResponse.json(
      { error: 'Failed to delete extracted resume', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}



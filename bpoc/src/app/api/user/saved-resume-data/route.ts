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
      // Fetch the most recent saved resume for the user
      const result = await client.query(
        `SELECT resume_data 
         FROM saved_resumes 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT 1`,
        [userId]
      )

      if (result.rows.length > 0) {
        const resumeData = result.rows[0].resume_data
        return NextResponse.json({ 
          hasData: true, 
          resumeData 
        })
      } else {
        return NextResponse.json({ 
          hasData: false, 
          message: 'No saved resume found' 
        })
      }

    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Error fetching saved resume data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved resume data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

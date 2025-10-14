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
      // Fetch the most recent AI analysis result for the user
      const result = await client.query(
        `SELECT overall_score 
         FROM ai_analysis_results 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT 1`,
        [userId]
      )

      if (result.rows.length > 0) {
        const overallScore = result.rows[0].overall_score
        return NextResponse.json({ 
          hasData: true, 
          overallScore 
        })
      } else {
        return NextResponse.json({ 
          hasData: false, 
          message: 'No AI analysis results found' 
        })
      }

    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Error fetching AI analysis score:', error)
    return NextResponse.json(
      { error: 'Failed to fetch AI analysis score', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

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

      // Check if user has any generated resumes
      const result = await client.query(
        `SELECT id, original_resume_id, generated_resume_data, template_used, generation_metadata, created_at, updated_at
         FROM resumes_generated 
         WHERE user_id = $1 
         ORDER BY updated_at DESC 
         LIMIT 1`,
        [userId]
      )

      if (result.rows.length > 0) {
        const generatedResume = result.rows[0]
        return NextResponse.json({
          success: true,
          hasGeneratedResume: true,
          id: generatedResume.id,
          originalResumeId: generatedResume.original_resume_id,
          generatedResumeData: generatedResume.generated_resume_data,
          templateUsed: generatedResume.template_used,
          generationMetadata: generatedResume.generation_metadata,
          createdAt: generatedResume.created_at,
          updatedAt: generatedResume.updated_at
        })
      } else {
        return NextResponse.json({
          success: true,
          hasGeneratedResume: false
        })
      }

    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Error checking generated resumes:', error)
    return NextResponse.json(
      { error: 'Failed to check generated resumes', details: error instanceof Error ? error.message : 'Unknown error' },
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
      await client.query('DELETE FROM resumes_generated WHERE user_id = $1', [userId])
      return NextResponse.json({ success: true })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('❌ Error deleting generated resumes:', error)
    return NextResponse.json(
      { error: 'Failed to delete generated resumes', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

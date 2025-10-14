import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Starting save-resume API call...')
    
    const { resumeData, originalFilename } = await request.json()
    console.log('📥 Received data:', { 
      hasResumeData: !!resumeData, 
      originalFilename,
      resumeDataKeys: resumeData ? Object.keys(resumeData) : null
    })

    if (!resumeData) {
      console.log('❌ Missing resumeData')
      return NextResponse.json(
        { error: 'Missing required field: resumeData' },
        { status: 400 }
      )
    }

    // Get the user from the request headers (set by middleware)
    const userId = request.headers.get('x-user-id')
    console.log('👤 User ID from headers:', userId)
    
    if (!userId) {
      console.log('❌ No user ID found in headers')
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Check environment variables
    const databaseUrl = process.env.DATABASE_URL
    
    console.log('🔧 Environment check:', {
      hasDatabaseUrl: !!databaseUrl,
      databaseUrl: databaseUrl ? `${databaseUrl.substring(0, 30)}...` : 'missing'
    })

    if (!databaseUrl) {
      console.log('❌ Missing DATABASE_URL environment variable')
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      )
    }

    // Test database connection first
    console.log('🧪 Testing database connection...')
    const client = await pool.connect()
    
    try {
      // Test the connection
      const testResult = await client.query('SELECT NOW()')
      console.log('✅ Database connection successful:', testResult.rows[0])

      // Check if user exists
      const userCheck = await client.query(
        'SELECT id FROM users WHERE id = $1',
        [userId]
      )

      if (userCheck.rows.length === 0) {
        console.log('❌ User not found in database:', userId)
        return NextResponse.json(
          { error: 'User not found in database' },
          { status: 404 }
        )
      }

      console.log('✅ User found in database')

      // Insert the resume data into the database
                console.log('💾 Upserting resume data (overwrite if exists)...')
          const upsertResult = await client.query(
            `INSERT INTO resumes_extracted (user_id, resume_data, original_filename, updated_at)
             VALUES ($1, $2, $3, NOW())
             ON CONFLICT (user_id) 
             DO UPDATE SET 
               resume_data = EXCLUDED.resume_data,
               original_filename = EXCLUDED.original_filename,
               updated_at = NOW()
             RETURNING id`,
            [userId, JSON.stringify(resumeData), originalFilename || 'extracted_resume.json']
          )

          const resumeId = upsertResult.rows[0].id
          console.log(`💾 Resume upserted to database: ${resumeId}`)
          console.log(`👤 User ID: ${userId}`)
          console.log(`📁 Original filename: ${originalFilename}`)

      return NextResponse.json({
        success: true,
        resumeId: resumeId,
        message: 'Resume saved to database successfully'
      })

    } finally {
      client.release()
    }

  } catch (error) {
    console.error('❌ Error saving resume to database:', error)
    return NextResponse.json(
      {
        error: 'Failed to save resume to database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const client = await pool.connect()
    try {
      await client.query('DELETE FROM resumes_extracted WHERE user_id = $1', [userId])
      return NextResponse.json({ success: true })
    } finally {
      client.release()
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear extracted resume' }, { status: 500 })
  }
} 
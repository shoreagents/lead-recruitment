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
    console.log('🔍 Starting save-generated-resume API call...')
    
    const { 
      generatedResumeData, 
      originalResumeId, 
      templateUsed, 
      generationMetadata 
    } = await request.json()
    
    console.log('📥 Received data:', { 
      hasGeneratedResumeData: !!generatedResumeData, 
      originalResumeId,
      templateUsed,
      generationMetadataKeys: generationMetadata ? Object.keys(generationMetadata) : null
    })

    if (!generatedResumeData) {
      console.log('❌ Missing generatedResumeData')
      return NextResponse.json(
        { error: 'Missing required field: generatedResumeData' },
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

      // If originalResumeId is provided, verify it exists and belongs to the user
      if (originalResumeId) {
        const originalResumeCheck = await client.query(
          'SELECT id FROM resumes_extracted WHERE id = $1 AND user_id = $2',
          [originalResumeId, userId]
        )

        if (originalResumeCheck.rows.length === 0) {
          console.log('❌ Original resume not found or does not belong to user:', originalResumeId)
          return NextResponse.json(
            { error: 'Original resume not found or access denied' },
            { status: 404 }
          )
        }

        console.log('✅ Original resume verified')
      }

      // Insert the generated resume data into the database
      console.log('💾 Upserting generated resume data (overwrite if exists)...')
                  const upsertResult = await client.query(
                    `INSERT INTO resumes_generated (user_id, original_resume_id, generated_resume_data, template_used, generation_metadata, updated_at)
                     VALUES ($1, $2, $3, $4, $5, NOW())
                     ON CONFLICT (user_id) 
                     DO UPDATE SET 
                       original_resume_id = EXCLUDED.original_resume_id,
                       generated_resume_data = EXCLUDED.generated_resume_data,
                       template_used = EXCLUDED.template_used,
                       generation_metadata = EXCLUDED.generation_metadata,
                       updated_at = NOW()
                     RETURNING id`,
                    [
                      userId,
                      originalResumeId || null,
                      JSON.stringify(generatedResumeData),
                      templateUsed || null,
                      generationMetadata ? JSON.stringify(generationMetadata) : null
                    ]
                  )

                  const generatedResumeId = upsertResult.rows[0].id
                  console.log(`💾 Generated resume upserted to database: ${generatedResumeId}`)
                  console.log(`👤 User ID: ${userId}`)
                  console.log(`📁 Original resume ID: ${originalResumeId || 'none'}`)
                  console.log(`🎨 Template used: ${templateUsed || 'none'}`)

      // Optional: Update users.position from generated recommendation to keep consistent across views
      try {
        const recommendedPosition = (generatedResumeData && (
          (generatedResumeData as any).bestJobTitle ||
          (generatedResumeData as any).title ||
          (generatedResumeData as any).recommendedTitle ||
          (generatedResumeData as any).recommendedRole ||
          ((generatedResumeData as any).summary && (generatedResumeData as any).summary.bestJobTitle)
        )) || null

        if (recommendedPosition && typeof recommendedPosition === 'string' && recommendedPosition.trim().length > 0) {
          const newPos = recommendedPosition.trim()
          console.log('📝 Updating users.position from generated resume recommendation:', newPos)
          await client.query(
            'UPDATE users SET position = $1, updated_at = NOW() WHERE id = $2',
            [newPos, userId]
          )
        }
      } catch (e) {
        console.log('⚠️ Skipping users.position update from generated resume:', e instanceof Error ? e.message : 'unknown error')
      }

      return NextResponse.json({
        success: true,
        generatedResumeId: generatedResumeId,
        message: 'Generated resume saved to database successfully'
      })

    } finally {
      client.release()
    }

  } catch (error) {
    console.error('❌ Error saving generated resume to database:', error)
    return NextResponse.json(
      {
        error: 'Failed to save generated resume to database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 
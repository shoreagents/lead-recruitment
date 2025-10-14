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
    console.log('🔍 Starting save-resume-to-profile API call...')
    
    let { 
      resumeData, 
      templateUsed, 
      resumeTitle,
      resumeSlug 
    } = await request.json()
    
    console.log('📥 Received data:', { 
      hasResumeData: !!resumeData, 
      templateUsed,
      resumeTitle,
      resumeSlug
    })

    if (!resumeData || !templateUsed || !resumeTitle) {
      console.log('❌ Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields: resumeData, templateUsed, resumeTitle' },
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

      // Helper to safely extract header info from extracted JSON
      const pickFirst = (obj: any, keys: string[]): any => {
        if (!obj) return undefined
        for (const k of keys) {
          if (obj[k]) return obj[k]
        }
        return undefined
      }
      const combine = (obj: any, keys: string[]): string | undefined => {
        const vals = keys.map(k => obj?.[k]).filter(Boolean)
        return vals.length ? vals.join(' ') : undefined
      }
      const fromContact = (obj: any, key: string): any => obj?.contact?.[key]

      const computeHeaderFromExtracted = (extracted: any) => {
        const data = extracted || {}
        return {
          name:
            pickFirst(data, ['name', 'full_name', 'fullName', 'personal_name', 'candidate_name']) ||
            (data.first_name && data.last_name ? `${data.first_name} ${data.last_name}` : undefined) ||
            fromContact(data, 'name') || 'Name not found',
          title:
            pickFirst(data, ['title', 'job_title', 'current_title']) ||
            (Array.isArray(data.experience) && data.experience[0]?.title) || 'Title not found',
          location:
            pickFirst(data, ['location', 'address', 'city', 'residence', 'current_location']) ||
            combine(data, ['city', 'country']) ||
            fromContact(data, 'location') || 'Location not found',
          email:
            pickFirst(data, ['email', 'email_address', 'contact_email', 'primary_email']) ||
            fromContact(data, 'email') || 'Email not found',
          phone:
            pickFirst(data, ['phone', 'phone_number', 'contact_phone', 'mobile', 'telephone']) ||
            fromContact(data, 'phone') || 'Phone not found',
        }
      }

      // If header info missing or incomplete, use resumes_extracted to enrich
      let needsHeaderEnrichment = !resumeData.headerInfo ||
        !resumeData.headerInfo.name || !resumeData.headerInfo.email || !resumeData.headerInfo.phone || !resumeData.headerInfo.location

      if (needsHeaderEnrichment) {
        const extractedRes = await client.query(
          'SELECT resume_data FROM resumes_extracted WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1',
          [userId]
        )
        if (extractedRes.rows.length > 0) {
          const extracted = extractedRes.rows[0].resume_data
          const computedHeader = computeHeaderFromExtracted(extracted)
          resumeData = {
            ...resumeData,
            headerInfo: {
              ...(resumeData.headerInfo || {}),
              ...computedHeader
            }
          }
        }
      }

      // Check if user exists and get user info
      const userCheck = await client.query(
        'SELECT id, first_name, last_name, full_name FROM users WHERE id = $1',
        [userId]
      )

      if (userCheck.rows.length === 0) {
        console.log('❌ User not found in database:', userId)
        return NextResponse.json(
          { error: 'User not found in database' },
          { status: 404 }
        )
      }

      const user = userCheck.rows[0]
      console.log('✅ User found in database:', user.full_name)

      // Helper function to generate slug in firstName-lastName-XX format
      const generateSlugFromUser = (firstName: string, lastName: string, uid: string) => {
        // Clean and normalize names
        const cleanFirst = (firstName || 'user')
          .toLowerCase()
          .normalize('NFD') // Decompose accented characters
          .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
          .replace(/[^a-z0-9]/g, '') // Keep only alphanumeric
          .slice(0, 20) // Limit length
        
        const cleanLast = (lastName || 'profile')
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]/g, '')
          .slice(0, 20)
        
        // Get last 2 digits of UID
        const lastTwoDigits = uid.toString().slice(-2).padStart(2, '0')
        
        return `${cleanFirst}-${cleanLast}-${lastTwoDigits}`
      }

      // Get the most recent generated resume ID for this user
      const generatedResumeResult = await client.query(
        'SELECT id FROM resumes_generated WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1',
        [userId]
      )
      
      const originalResumeId = generatedResumeResult.rows.length > 0 ? generatedResumeResult.rows[0].id : null
      
      // Check if user already has a saved resume
      const existingResumeCheck = await client.query(
        'SELECT id, resume_slug FROM saved_resumes WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1',
        [userId]
      )

      let finalSlug: string
      let savedResumeId: string

      if (existingResumeCheck.rows.length > 0) {
        // User already has a saved resume - update it
        const existingResume = existingResumeCheck.rows[0]
        finalSlug = existingResume.resume_slug
        savedResumeId = existingResume.id
        
        console.log('🔄 Updating existing saved resume:', savedResumeId)
        
        // Update the existing saved resume
        const updateResult = await client.query(
          `UPDATE saved_resumes 
           SET resume_title = $1, resume_data = $2, template_used = $3, original_resume_id = $4, updated_at = NOW()
           WHERE id = $5
           RETURNING id, resume_slug`,
          [
            resumeTitle,
            JSON.stringify(resumeData),
            templateUsed,
            originalResumeId,
            savedResumeId
          ]
        )
        
        console.log('✅ Existing resume updated successfully')
      } else {
        // User doesn't have a saved resume - create new one
        // Use provided slug from frontend, or generate one as fallback
        const baseSlug = resumeSlug || generateSlugFromUser(user.first_name, user.last_name, userId)
        
        console.log('🔧 Generating slug:', {
          providedSlug: resumeSlug,
          generatedSlug: !resumeSlug ? baseSlug : null,
          firstName: user.first_name,
          lastName: user.last_name
        })

        // Check if slug already exists
        const slugCheck = await client.query(
          'SELECT id FROM saved_resumes WHERE resume_slug = $1',
          [baseSlug]
        )
        
        if (slugCheck.rows.length > 0) {
          // Slug already exists, add counter to make unique
          let counter = 1
          let uniqueSlug = baseSlug
          
          while (true) {
            uniqueSlug = `${baseSlug}-${counter}`
            const uniqueCheck = await client.query(
              'SELECT id FROM saved_resumes WHERE resume_slug = $1',
              [uniqueSlug]
            )
            
            if (uniqueCheck.rows.length === 0) {
              finalSlug = uniqueSlug
              break
            }
            counter++
          }
        } else {
          finalSlug = baseSlug
        }

        console.log('🆕 Creating new saved resume with slug:', finalSlug)
        
        // Insert new saved resume
        const insertResult = await client.query(
          `INSERT INTO saved_resumes (user_id, resume_slug, resume_title, resume_data, template_used, original_resume_id, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
           RETURNING id, resume_slug`,
          [
            userId,
            finalSlug,
            resumeTitle,
            JSON.stringify(resumeData),
            templateUsed,
            originalResumeId
          ]
        )

        savedResumeId = insertResult.rows[0].id
        console.log('✅ New resume created successfully')
      }

      console.log(`💾 Resume saved to profile: ${savedResumeId}`)
      console.log(`🔗 Resume slug: ${finalSlug}`)
      console.log(`👤 User ID: ${userId}`)
      console.log(`📁 Resume title: ${resumeTitle}`)

      return NextResponse.json({
        success: true,
        savedResumeId: savedResumeId,
        resumeSlug: finalSlug,
        resumeUrl: `/${finalSlug}`,
        message: 'Resume saved to profile successfully'
      })

    } finally {
      client.release()
    }

  } catch (error) {
    console.error('❌ Error saving resume to profile:', error)
    return NextResponse.json(
      {
        error: 'Failed to save resume to profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

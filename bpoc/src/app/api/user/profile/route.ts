import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'
import { createClient } from '@supabase/supabase-js'

// GET - Fetch user profile from Railway
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    console.log('🔍 API: Fetching profile for user:', userId)
    console.log('🔍 API: Database URL available:', !!process.env.DATABASE_URL)
    console.log('🔍 API: Database URL length:', process.env.DATABASE_URL?.length || 0)

    // Base query (avoid selecting optional columns that may not exist across envs)
    const query = `
      SELECT 
        u.id, u.email, u.first_name, u.last_name, u.full_name, u.location, u.avatar_url, u.phone, u.bio, u.position, u.completed_data, u.birthday, u.slug, u.created_at, u.updated_at,
        u.gender, u.gender_custom, u.username, u.company, u.admin_level,
        u.location_place_id, u.location_lat, u.location_lng, u.location_city, u.location_province, u.location_country, u.location_barangay, u.location_region,
        COALESCE(uls.overall_score, 0) as overall_score
      FROM users u
      LEFT JOIN user_leaderboard_scores uls ON u.id = uls.user_id
      WHERE u.id = $1
    `
    
    console.log('🔍 API: Executing query:', query)
    console.log('🔍 API: Query parameters:', [userId])
    
    let result
    try {
      result = await pool.query(query, [userId])
      console.log('🔍 API: Query result rows count:', result.rows.length)
    } catch (dbError) {
      console.error('❌ API: Database query failed:', dbError)
      console.error('❌ API: Database error details:', {
        message: dbError instanceof Error ? dbError.message : 'Unknown database error',
        stack: dbError instanceof Error ? dbError.stack : undefined,
        errorType: typeof dbError,
        errorString: String(dbError)
      })
      throw dbError
    }

    if (result.rows.length === 0) {
      console.log('❌ API: User not found:', userId)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = result.rows[0]

    const userProfile = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      full_name: user.full_name,
      location: user.location,
      avatar_url: user.avatar_url,
      phone: user.phone,
      bio: user.bio,
      position: user.position,
      completed_data: user.completed_data,
      birthday: user.birthday,
      slug: user.slug,
      gender: user.gender,
      gender_custom: user.gender_custom,
      username: user.username,
      company: user.company,
      admin_level: user.admin_level,
      location_place_id: user.location_place_id,
      location_lat: user.location_lat,
      location_lng: user.location_lng,
      location_city: user.location_city,
      location_province: user.location_province,
      location_country: user.location_country,
      location_barangay: user.location_barangay,
      location_region: user.location_region,
      created_at: user.created_at,
      updated_at: user.updated_at,
      overall_score: user.overall_score
    }
    
    console.log('✅ API: User profile loaded:', userProfile)

    return NextResponse.json({ user: userProfile })
  } catch (error) {
    console.error('❌ API: Error fetching user profile:', error)
    console.error('❌ API: Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      errorType: typeof error,
      errorString: String(error),
      errorJSON: JSON.stringify(error),
      userId: userId,
      timestamp: new Date().toISOString()
    })
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('connection')) {
        console.error('🌐 Database connection error detected')
        return NextResponse.json({ 
          error: 'Database connection failed', 
          details: 'Unable to connect to the database. Please try again.' 
        }, { status: 503 })
      } else if (error.message.includes('timeout')) {
        console.error('⏰ Database timeout error detected')
        return NextResponse.json({ 
          error: 'Database timeout', 
          details: 'Database query timed out. Please try again.' 
        }, { status: 504 })
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// PUT - Update user profile in Railway
export async function PUT(request: NextRequest) {
  try {
    const { userId, ...updateData } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    console.log('🔄 API: Updating profile for user:', userId)
    console.log('📊 API: Update data received:', updateData)
    console.log('📊 API: Company field:', updateData.company)
    console.log('📊 API: Phone field:', updateData.phone)
    console.log('📊 API: Bio field:', updateData.bio)
    console.log('📊 API: Position field:', updateData.position)
    console.log('📊 API: Birthday field:', updateData.birthday)
    console.log('📊 API: Gender field:', updateData.gender)

    // First, check what columns actually exist in the users table
    const colsRes = await pool.query(
      `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users'`
    )
    const available = new Set<string>(colsRes.rows.map((r: any) => r.column_name))
    console.log('🔍 Available columns in users table:', Array.from(available))

    // Build SELECT query dynamically based on available columns
    const selectFields = ['first_name', 'last_name', 'full_name', 'location', 'avatar_url', 'phone', 'bio', 'position', 'completed_data', 'birthday']
    // Optional structured location fields
    if (available.has('location_place_id')) selectFields.push('location_place_id')
    if (available.has('location_lat')) selectFields.push('location_lat')
    if (available.has('location_lng')) selectFields.push('location_lng')
    if (available.has('location_city')) selectFields.push('location_city')
    if (available.has('location_province')) selectFields.push('location_province')
    if (available.has('location_country')) selectFields.push('location_country')
    if (available.has('location_barangay')) selectFields.push('location_barangay')
    if (available.has('location_region')) selectFields.push('location_region')
    if (available.has('gender')) selectFields.push('gender')
    if (available.has('gender_custom')) selectFields.push('gender_custom')
    if (available.has('username')) selectFields.push('username')
    if (available.has('company')) selectFields.push('company')
    if (available.has('admin_level')) selectFields.push('admin_level')
    
    const selectQuery = `SELECT ${selectFields.join(', ')} FROM users WHERE id = $1`
    console.log('🔍 SELECT query:', selectQuery)
    
    try {
      const existingRes = await pool.query(selectQuery, [userId])
      console.log('✅ SELECT query executed successfully')
      
      if (existingRes.rows.length === 0) {
        console.log('❌ API: User not found for update:', userId)
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const existing = existingRes.rows[0]
      console.log('📊 Existing user data:', existing)

    const firstName = updateData.first_name ?? existing.first_name
    const lastName = updateData.last_name ?? existing.last_name
    const location = updateData.location ?? existing.location
    const avatarUrl = updateData.avatar_url ?? existing.avatar_url
    const phone = updateData.phone ?? existing.phone
    const bio = updateData.bio ?? existing.bio
    const position = updateData.position ?? existing.position
    // Structured location
    const locationPlaceId = available.has('location_place_id') ? (updateData.location_place_id ?? existing.location_place_id) : null
    const locationLat = available.has('location_lat') ? (updateData.location_lat ?? existing.location_lat) : null
    const locationLng = available.has('location_lng') ? (updateData.location_lng ?? existing.location_lng) : null
    const locationCity = available.has('location_city') ? (updateData.location_city ?? existing.location_city) : null
    const locationProvince = available.has('location_province') ? (updateData.location_province ?? existing.location_province) : null
    const locationCountry = available.has('location_country') ? (updateData.location_country ?? existing.location_country) : null
    const locationBarangay = available.has('location_barangay') ? (updateData.location_barangay ?? existing.location_barangay) : null
    const locationRegion = available.has('location_region') ? (updateData.location_region ?? existing.location_region) : null

    const gender = available.has('gender') ? (updateData.gender ?? existing.gender) : null
    const genderCustom = available.has('gender_custom') ? (updateData.gender_custom ?? existing.gender_custom) : null
    const username = available.has('username') ? (updateData.username ?? existing.username) : null
    const company = available.has('company') ? (updateData.company ?? existing.company) : null
    const adminLevel = available.has('admin_level') ? (updateData.admin_level ?? existing.admin_level) : null

    console.log('🔧 Processed field values:', {
      firstName, lastName, location, avatarUrl, phone, bio, position, gender, genderCustom, company,
      locationPlaceId, locationLat, locationLng, locationCity, locationProvince, locationCountry
    })


    // Handle completed_data and birthday, preserving ability to clear birthday
    const completedData = Object.prototype.hasOwnProperty.call(updateData, 'completed_data')
      ? updateData.completed_data
      : existing.completed_data
    let birthday = Object.prototype.hasOwnProperty.call(updateData, 'birthday')
      ? updateData.birthday
      : existing.birthday
    // Normalize birthday: empty strings -> null to satisfy DATE type
    if (typeof birthday === 'string' && birthday.trim() === '') {
      birthday = null
    }

    // Recompute full_name from first/last when applicable, otherwise keep existing
    const recomputedFullName = `${firstName || ''} ${lastName || ''}`.trim()
    const fullName = recomputedFullName || existing.full_name

    // Use the available columns we already checked above
    console.log('🔍 Building UPDATE query with available columns')

    type Field = { col: string, val: any }
    const baseFields: Field[] = [
      { col: 'first_name', val: firstName },
      { col: 'last_name', val: lastName },
      { col: 'full_name', val: fullName },
      { col: 'location', val: location },
      { col: 'avatar_url', val: avatarUrl },
      { col: 'phone', val: phone },
      { col: 'bio', val: bio },
      { col: 'position', val: position }
    ]
    const optionalFields: Field[] = []
    if (available.has('location_place_id')) optionalFields.push({ col: 'location_place_id', val: locationPlaceId })
    if (available.has('location_lat')) optionalFields.push({ col: 'location_lat', val: locationLat })
    if (available.has('location_lng')) optionalFields.push({ col: 'location_lng', val: locationLng })
    if (available.has('location_city')) optionalFields.push({ col: 'location_city', val: locationCity })
    if (available.has('location_province')) optionalFields.push({ col: 'location_province', val: locationProvince })
    if (available.has('location_country')) optionalFields.push({ col: 'location_country', val: locationCountry })
    if (available.has('location_barangay')) optionalFields.push({ col: 'location_barangay', val: locationBarangay })
    if (available.has('location_region')) optionalFields.push({ col: 'location_region', val: locationRegion })
    if (available.has('completed_data')) optionalFields.push({ col: 'completed_data', val: completedData })
    if (available.has('birthday')) optionalFields.push({ col: 'birthday', val: birthday })
    if (available.has('gender')) optionalFields.push({ col: 'gender', val: gender })
    if (available.has('gender_custom')) optionalFields.push({ col: 'gender_custom', val: genderCustom })
    if (available.has('username')) optionalFields.push({ col: 'username', val: username })
    if (available.has('company')) optionalFields.push({ col: 'company', val: company })
    if (available.has('admin_level')) optionalFields.push({ col: 'admin_level', val: adminLevel })

    const allFields = [...baseFields, ...optionalFields]
    const setClauses: string[] = []
    const params: any[] = [userId]
    let i = 2
    for (const f of allFields) {
      setClauses.push(`${f.col} = $${i}`)
      params.push(f.val)
      i++
    }
    setClauses.push('updated_at = NOW()')

    const updateSql = `UPDATE users SET ${setClauses.join(', ')} WHERE id = $1 RETURNING *`
    console.log('🔧 UPDATE users dynamic SQL:', updateSql)
    console.log('🔧 UPDATE parameters:', params)
    
    const result = await pool.query(updateSql, params)
    console.log('✅ UPDATE query executed successfully')

    if (result.rows.length === 0) {
      console.log('❌ API: User not found for update:', userId)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updatedUser = result.rows[0]
    console.log('✅ API: User profile updated:', {
      id: updatedUser.id,
      full_name: updatedUser.full_name,
      avatar_url: updatedUser.avatar_url
    })

    // Sync position changes to user_work_status table
    if (updateData.position !== undefined) {
      try {
        console.log('🔄 Syncing position to work status table:', updateData.position)
        
        // First check if user_work_status record exists
        const checkResult = await pool.query(
          'SELECT user_id FROM user_work_status WHERE user_id = $1',
          [userId]
        )
        
        if (checkResult.rows.length === 0) {
          console.log('⚠️ No user_work_status record found, creating one...')
          // Create a new work status record with the position
          await pool.query(
            `INSERT INTO user_work_status (user_id, current_position, created_at, updated_at) 
             VALUES ($1, $2, NOW(), NOW())`,
            [userId, updateData.position]
          )
          console.log('✅ New user_work_status record created with position')
        } else {
          // Update existing record
          const updateResult = await pool.query(
            `UPDATE user_work_status SET current_position = $1, updated_at = NOW() WHERE user_id = $2`,
            [updateData.position, userId]
          )
          console.log('✅ Position synced to work status table, rows affected:', updateResult.rowCount)
        }
      } catch (error) {
        console.log('❌ Failed to sync position to work status:', error instanceof Error ? error.message : String(error))
        console.log('❌ Full error details:', error)
      }
    }


    // Also update Supabase auth user metadata so future syncs won't revert names
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (supabaseUrl && serviceKey) {
        const supabaseAdmin = createClient(supabaseUrl, serviceKey)
        const adminRes = await supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: {
            first_name: firstName,
            last_name: lastName,
            full_name: fullName,
            location,
            phone,
            position,
            location_place_id: locationPlaceId,
            location_lat: locationLat,
            location_lng: locationLng,
            location_city: locationCity,
            location_province: locationProvince,
            location_country: locationCountry
          }
        })
        if (adminRes.error) {
          console.log('⚠️ Supabase admin metadata update failed:', adminRes.error.message)
        } else {
          console.log('✅ Supabase metadata updated for user:', userId)
        }
      } else {
        console.log('⚠️ Skipping Supabase metadata update - missing env vars')
      }
    } catch (e) {
      console.log('⚠️ Error updating Supabase metadata (non-fatal):', e instanceof Error ? e.message : String(e))
    }

    // Ensure saved resume slug reflects the updated first/last name
    let resumeSlugUpdated = false
    let newResumeSlug: string | null = null
    try {
      // Find the most recent saved resume for this user (if any)
      const savedRes = await pool.query(
        `SELECT id, resume_slug FROM saved_resumes WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1`,
        [userId]
      )
      if (savedRes.rows.length > 0) {
        const resumeId: string = savedRes.rows[0].id
        const currentSlug: string = savedRes.rows[0].resume_slug

        // Build base slug in firstName-lastName-XX format
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

        // Get user's first and last name from full_name
        const nameParts = (fullName || '').trim().split(' ')
        const firstName = nameParts[0] || 'user'
        const lastName = nameParts.slice(1).join(' ') || 'profile'
        
        const baseSlug = generateSlugFromUser(firstName, lastName, userId)

        // If slug is already correct, skip
        if (currentSlug !== baseSlug) {
          // Ensure uniqueness
          let candidate = baseSlug
          let counter = 1
          // Avoid conflicting with other rows (excluding this resume id)
          // Try a reasonable number of attempts; collisions unlikely
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const check = await pool.query(
              `SELECT 1 FROM saved_resumes WHERE resume_slug = $1 AND id <> $2 LIMIT 1`,
              [candidate, resumeId]
            )
            if (check.rows.length === 0) break
            candidate = `${baseSlug}-${counter}`
            counter++
          }

          // Update saved_resumes slug
          await pool.query(
            `UPDATE saved_resumes SET resume_slug = $1, updated_at = NOW() WHERE id = $2`,
            [candidate, resumeId]
          )

          // Keep applications table in sync for convenience
          try {
            await pool.query(
              `UPDATE applications SET resume_slug = $1 WHERE resume_id = $2`,
              [candidate, resumeId]
            )
          } catch {}

          resumeSlugUpdated = true
          newResumeSlug = candidate
        }
      }
    } catch (e) {
      console.log('⚠️ Skipping resume slug update:', e instanceof Error ? e.message : String(e))
    }

      return NextResponse.json({ user: updatedUser, resumeSlugUpdated, newResumeSlug })
      
    } catch (dbError) {
      console.error('❌ Database error during profile update:', dbError)
      const dbErrorMessage = dbError instanceof Error ? dbError.message : String(dbError)
      return NextResponse.json({ error: 'Database error during profile update', details: dbErrorMessage }, { status: 500 })
    }
  } catch (error) {
    console.error('❌ API: Error updating user profile:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 })
  }
} 